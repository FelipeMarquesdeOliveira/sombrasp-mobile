import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import {
  Botao,
  CartaoAlerta,
  EstadoCarregando,
  EstadoErro,
  Grupo,
  Linha,
  LinhaPonto,
  Tela,
  Texto,
  type NomeIcone,
} from '@/components';
import { usePreferencias } from '@/context/PreferenciasContext';
import { contarPausasDoDia } from '@/database';
import { amanhaISO, dataPorExtenso, type PontoProximo } from '@/domain';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import { useRecurso } from '@/hooks/useRecurso';
import { fonteDeDados, usandoMock } from '@/services';
import { useTema } from '@/theme';

const DICAS: { icone: NomeIcone; cor: 'azul' | 'laranja' | 'verde' | 'vermelho'; texto: string }[] = [
  { icone: 'gota', cor: 'azul', texto: 'Beba água a cada 20 minutos, mesmo sem sede.' },
  { icone: 'relogio', cor: 'laranja', texto: 'Entre 10h e 16h, fique na sombra sempre que puder.' },
  { icone: 'camiseta', cor: 'verde', texto: 'Use boné ou chapéu e roupa clara e leve.' },
  {
    icone: 'saude',
    cor: 'vermelho',
    texto: 'Tontura, dor de cabeça ou enjoo? Pare na sombra, beba água e peça ajuda. Emergência: 192.',
  },
];

const nuncaVazio = () => false;
const aguardar = () => new Promise<PontoProximo[]>(() => {});

export default function TelaHoje() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { versaoDados, raioKm } = usePreferencias();
  const { cores } = useTema();
  const local = useLocalizacao();
  const origem = local.coordenada;
  const [pausasHoje, setPausasHoje] = useState<number | null>(null);

  // "Sem alerta hoje" (null) é uma resposta válida, não uma lista vazia.
  const alerta = useRecurso(() => fonteDeDados.buscarAlertaDeHoje(), [versaoDados], nuncaVazio);
  const alertas = useRecurso(() => fonteDeDados.listarAlertasAtivos(), [versaoDados]);
  const perto = useRecurso(
    () => (origem ? fonteDeDados.buscarPontosProximos(origem, { raioKm }) : aguardar()),
    [origem?.latitude, origem?.longitude, raioKm, versaoDados],
  );
  const previsaoAmanha = alertas.dados?.find((a) => a.dataReferencia === amanhaISO()) ?? null;

  useFocusEffect(
    useCallback(() => {
      contarPausasDoDia(db)
        .then(setPausasHoje)
        .catch(() => setPausasHoje(null));
    }, [db]),
  );

  const hoje = dataPorExtenso(new Date());
  const abrirPonto = (ponto: PontoProximo) =>
    router.push({ pathname: '/ponto/[id]', params: { id: String(ponto.id), distanciaKm: String(ponto.distanciaKm) } });

  return (
    <Tela
      subtitulo={`${hoje.charAt(0).toUpperCase()}${hoje.slice(1)} · Centro de SP`}
      aoAtualizar={() => {
        alerta.atualizar();
        alertas.atualizar();
        perto.atualizar();
      }}
      atualizando={alerta.atualizando}
    >
      {alerta.estado === 'carregando' && <EstadoCarregando mensagem="Buscando o alerta de calor de hoje…" />}
      {alerta.estado === 'erro' && (
        <EstadoErro
          mensagem={alerta.erro ?? ''}
          aoTentarDeNovo={() => {
            alerta.recarregar();
            alertas.recarregar();
            perto.recarregar();
          }}
        />
      )}
      {alerta.estado === 'pronto' && <CartaoAlerta alerta={alerta.dados ?? null} amanha={previsaoAmanha} />}

      <Botao
        rotulo="Achar sombra e água"
        rotuloAcessivel="Achar sombra e água perto de mim"
        icone="local"
        aoPressionar={() => router.navigate('/perto')}
        dica="Abre a lista de pontos de apoio mais próximos"
      />

      {perto.estado !== 'erro' && alerta.estado !== 'erro' && (
        <Grupo titulo="Mais perto de você" recuoSeparador={64}>
          {perto.estado === 'carregando' && <Linha titulo="Procurando pontos perto de você…" />}
          {perto.estado === 'vazio' && (
            <Linha
              titulo={`Nenhum ponto até ${raioKm} km`}
              subtitulo="Aumente a distância em Ajustes."
              aoPressionar={() => router.navigate('/ajustes')}
            />
          )}
          {perto.estado === 'pronto' &&
            (perto.dados ?? []).slice(0, 3).map((ponto) => (
              <LinhaPonto key={ponto.id} ponto={ponto} aoPressionar={() => abrirPonto(ponto)} />
            ))}
          {perto.estado === 'pronto' && (
            <Linha titulo="Ver todos os pontos" aoPressionar={() => router.navigate('/perto')} />
          )}
        </Grupo>
      )}

      <Grupo titulo="Hoje" recuoSeparador={58}>
        <Linha
          icone="copo"
          corIcone={cores.icone.azul}
          titulo="Pausas para beber água"
          valor={pausasHoje === null ? '–' : String(pausasHoje)}
          rotuloAcessivel={
            pausasHoje === null
              ? 'Pausas para beber água: não foi possível ler'
              : `Você registrou ${pausasHoje} ${pausasHoje === 1 ? 'pausa' : 'pausas'} para beber água hoje`
          }
          dica="Abre Meus registros"
          aoPressionar={() => router.navigate('/registros')}
        />
      </Grupo>

      <Grupo titulo="Como se proteger do calor" recuoSeparador={58}>
        {DICAS.map((dica) => (
          <Linha key={dica.texto} icone={dica.icone} corIcone={cores.icone[dica.cor]} titulo={dica.texto} />
        ))}
      </Grupo>

      {usandoMock && (
        <Texto variante="nota" cor={cores.texto.secundario} centralizado>
          Demonstração com dados simulados. Nenhum dado pessoal é usado.
        </Texto>
      )}
    </Tela>
  );
}
