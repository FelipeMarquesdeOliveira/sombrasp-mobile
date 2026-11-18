import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';

import {
  Aviso,
  Botao,
  EstadoCarregando,
  EstadoErro,
  EstadoVazio,
  Filtro,
  Grupo,
  LinhaPonto,
  Tela,
} from '@/components';
import { usePreferencias } from '@/context/PreferenciasContext';
import { tipoProcurado, type PontoProximo } from '@/domain';
import { PONTO_DE_REFERENCIA, useLocalizacao, type OrigemLocalizacao } from '@/hooks/useLocalizacao';
import { useRecurso } from '@/hooks/useRecurso';
import { fonteDeDados } from '@/services';
import { useTema } from '@/theme';
import { haptico } from '@/utils/haptico';

const ORIGEM_TEXTO: Record<OrigemLocalizacao, string> = {
  gps: 'a partir de onde você está',
  sem_permissao: `a partir da ${PONTO_DE_REFERENCIA.nome}`,
  fora_da_area: `a partir da ${PONTO_DE_REFERENCIA.nome}`,
  indisponivel: `a partir da ${PONTO_DE_REFERENCIA.nome}`,
};

const AVISO_LOCALIZACAO: Partial<Record<OrigemLocalizacao, string>> = {
  sem_permissao: `Sem acesso à sua localização. As distâncias são contadas a partir da ${PONTO_DE_REFERENCIA.nome}.`,
  fora_da_area: `Você está fora do Centro de SP. As distâncias são contadas a partir da ${PONTO_DE_REFERENCIA.nome}.`,
  indisponivel: `Não conseguimos achar sua localização. As distâncias são contadas a partir da ${PONTO_DE_REFERENCIA.nome}.`,
};

/** Fica pendente enquanto a localização não chega; o estado continua "carregando". */
const aguardarLocalizacao = () => new Promise<PontoProximo[]>(() => {});

export default function TelaPerto() {
  const router = useRouter();
  const { espaco } = useTema();
  const { raioKm, versaoDados } = usePreferencias();
  const local = useLocalizacao();
  const [querSombra, setQuerSombra] = useState(false);
  const [querAgua, setQuerAgua] = useState(false);
  const [soAcessivel, setSoAcessivel] = useState(false);

  const tipo = tipoProcurado(querSombra, querAgua);
  const origem = local.coordenada;
  const temFiltro = querSombra || querAgua || soAcessivel;

  const pontos = useRecurso(
    () =>
      origem
        ? fonteDeDados.buscarPontosProximos(origem, { raioKm, tipo, acessivel: soAcessivel })
        : aguardarLocalizacao(),
    [origem?.latitude, origem?.longitude, raioKm, tipo, soAcessivel, versaoDados],
  );

  const alternar = (definir: (fn: (v: boolean) => boolean) => void) => () => {
    haptico.selecao();
    definir((v) => !v);
  };

  const limparFiltros = () => {
    setQuerSombra(false);
    setQuerAgua(false);
    setSoAcessivel(false);
  };

  const quantidade = pontos.dados?.length ?? 0;
  const aviso = local.origem ? AVISO_LOCALIZACAO[local.origem] : undefined;

  return (
    <Tela
      subtitulo={`Sombra e água até ${raioKm} km, ${local.origem ? ORIGEM_TEXTO[local.origem] : 'perto de você'}.`}
      aoAtualizar={() => {
        local.atualizar();
        pontos.atualizar();
      }}
      atualizando={pontos.atualizando}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="toolbar"
        accessibilityLabel="Filtros"
        style={{ marginHorizontal: -espaco.md }}
        contentContainerStyle={{ gap: espaco.sm, paddingHorizontal: espaco.md, paddingVertical: 2 }}
      >
        <Filtro rotulo="Sombra" icone="folha" selecionado={querSombra} aoAlternar={alternar(setQuerSombra)} />
        <Filtro rotulo="Água" icone="gota" selecionado={querAgua} aoAlternar={alternar(setQuerAgua)} />
        <Filtro
          rotulo="Acessível"
          icone="acessivel"
          selecionado={soAcessivel}
          aoAlternar={alternar(setSoAcessivel)}
          dica="Mostra só pontos sem degrau, para cadeira de rodas"
        />
      </ScrollView>

      {aviso && (
        <View style={{ gap: espaco.sm }}>
          <Aviso tipo="info" icone="local" mensagem={aviso} />
          {local.origem === 'sem_permissao' && (
            <Botao
              variante="secundario"
              rotulo="Permitir localização"
              icone="local"
              aoPressionar={() => Linking.openSettings()}
              dica="Abre os ajustes do iPhone para liberar a localização"
            />
          )}
        </View>
      )}

      {pontos.estado === 'carregando' && (
        <EstadoCarregando mensagem={origem ? 'Procurando pontos perto de você…' : 'Descobrindo onde você está…'} />
      )}
      {pontos.estado === 'erro' && <EstadoErro mensagem={pontos.erro ?? ''} aoTentarDeNovo={pontos.recarregar} />}
      {pontos.estado === 'vazio' && (
        <EstadoVazio
          icone="busca"
          titulo="Nenhum ponto encontrado"
          mensagem={
            temFiltro
              ? `Não há pontos com esses filtros até ${raioKm} km. Tire um filtro ou aumente a distância em Ajustes.`
              : `Não há pontos de apoio até ${raioKm} km daqui. Aumente a distância em Ajustes.`
          }
          acao={
            temFiltro
              ? { rotulo: 'Limpar filtros', icone: 'fechar', aoPressionar: limparFiltros }
              : { rotulo: 'Aumentar a distância', icone: 'ajustes', aoPressionar: () => router.navigate('/ajustes') }
          }
        />
      )}
      {pontos.estado === 'pronto' && (
        <Grupo
          titulo={`${quantidade} ${quantidade === 1 ? 'ponto' : 'pontos'} · do mais perto ao mais longe`}
          rodape="Toque num ponto para ver o caminho a pé, salvar ou registrar uma pausa."
          recuoSeparador={64}
        >
          {(pontos.dados ?? []).map((ponto) => (
            <LinhaPonto
              key={ponto.id}
              ponto={ponto}
              aoPressionar={() =>
                router.push({
                  pathname: '/ponto/[id]',
                  params: { id: String(ponto.id), distanciaKm: String(ponto.distanciaKm) },
                })
              }
            />
          ))}
        </Grupo>
      )}
    </Tela>
  );
}
