import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Alert, Linking, Platform, ScrollView, View } from 'react-native';

import {
  AcaoRapida,
  Aviso,
  EstadoCarregando,
  EstadoErro,
  Grupo,
  ICONE_TIPO,
  Icone,
  IconeQuadrado,
  Linha,
  Selo,
  Texto,
  Titulo,
} from '@/components';
import { usePreferencias } from '@/context/PreferenciasContext';
import { pontoEstaSalvo, registrarPausa, removerPontoSalvo, salvarPonto } from '@/database';
import { distanciaPorExtenso, formatarDistancia, hora, minutosAPe, rotuloTipo, type PontoDetalhe } from '@/domain';
import { useRecurso } from '@/hooks/useRecurso';
import { fonteDeDados } from '@/services';
import { useTema } from '@/theme';
import { haptico } from '@/utils/haptico';

const nuncaVazio = () => false;

function enderecoCompleto(ponto: PontoDetalhe): string {
  const { logradouro, numero, complemento, bairro } = ponto.endereco;
  const rua = numero && numero !== 's/n' ? `${logradouro}, ${numero}` : logradouro;
  return [rua, complemento, bairro].filter(Boolean).join(' · ');
}

function abrirCaminho(ponto: PontoDetalhe) {
  const destino = `${ponto.latitude},${ponto.longitude}`;
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${destino}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=walking`;
  Linking.openURL(url).catch(() =>
    Alert.alert('Não foi possível abrir o mapa', `Endereço: ${enderecoCompleto(ponto)}`),
  );
}

export default function TelaPonto() {
  const { id, distanciaKm } = useLocalSearchParams<{ id: string; distanciaKm?: string }>();
  const pontoId = Number(id);
  const distancia = distanciaKm !== undefined ? Number(distanciaKm) : null;
  const db = useSQLiteContext();
  const { versaoDados } = usePreferencias();
  const { cores, espaco } = useTema();

  const ponto = useRecurso(() => fonteDeDados.detalharPonto(pontoId), [pontoId, versaoDados]);
  // A temperatura do dia vai junto com a pausa registrada, quando disponível.
  const alertaHoje = useRecurso(() => fonteDeDados.buscarAlertaDeHoje(), [versaoDados], nuncaVazio);

  const [salvo, setSalvo] = useState(false);
  const [gravandoSalvo, setGravandoSalvo] = useState(false);
  const [gravandoPausa, setGravandoPausa] = useState(false);
  const [confirmacao, setConfirmacao] = useState<string | null>(null);

  useEffect(() => {
    pontoEstaSalvo(db, pontoId)
      .then(setSalvo)
      .catch(() => setSalvo(false));
  }, [db, pontoId]);

  const avisar = (mensagem: string) => {
    setConfirmacao(mensagem);
    haptico.sucesso();
    AccessibilityInfo.announceForAccessibility(mensagem);
  };

  async function alternarSalvo(dados: PontoDetalhe) {
    setGravandoSalvo(true);
    try {
      if (salvo) {
        await removerPontoSalvo(db, dados.id);
        setSalvo(false);
        avisar('Ponto removido de Meus registros.');
      } else {
        await salvarPonto(db, {
          pontoId: dados.id,
          nome: dados.nome,
          tipo: dados.tipo,
          logradouro: dados.endereco.logradouro,
          bairro: dados.endereco.bairro,
        });
        setSalvo(true);
        avisar('Ponto salvo. Ele fica em Meus registros, mesmo sem internet.');
      }
    } catch {
      haptico.aviso();
      Alert.alert('Não foi possível salvar', 'Tente de novo em instantes.');
    } finally {
      setGravandoSalvo(false);
    }
  }

  async function registrar(dados: PontoDetalhe) {
    setGravandoPausa(true);
    try {
      const pausa = await registrarPausa(db, {
        pontoId: dados.id,
        pontoNome: dados.nome,
        temperaturaC: alertaHoje.dados?.temperaturaMaxima ?? null,
      });
      avisar(`Pausa registrada às ${hora(new Date(pausa.registradaEm))}. Continue bebendo água.`);
    } catch {
      haptico.aviso();
      Alert.alert('Não foi possível registrar a pausa', 'Tente de novo em instantes.');
    } finally {
      setGravandoPausa(false);
    }
  }

  const dados = ponto.estado === 'pronto' ? ponto.dados : null;
  const tom = dados ? cores.tipo[dados.tipo] : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.fundo.tela }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: espaco.md, gap: espaco.lg, paddingBottom: espaco.xxl }}
    >
      {ponto.estado === 'carregando' && <EstadoCarregando mensagem="Abrindo o ponto de apoio…" />}
      {ponto.estado === 'erro' && <EstadoErro mensagem={ponto.erro ?? ''} aoTentarDeNovo={ponto.recarregar} />}

      {dados && tom && (
        <>
          <View style={{ gap: espaco.sm + 4 }}>
            <IconeQuadrado nome={ICONE_TIPO[dados.tipo]} fundo={tom.fundo} tamanho={60} />
            <Titulo>{dados.nome}</Titulo>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm }}>
              <Selo texto={rotuloTipo(dados.tipo)} fundo={tom.suave} cor={tom.texto} icone={ICONE_TIPO[dados.tipo]} />
              <Selo
                texto={dados.acessivel ? 'Acessível' : 'Não acessível'}
                fundo={cores.fundo.preenchimento}
                cor={cores.texto.principal}
                icone="acessivel"
              />
            </View>
            {distancia !== null && Number.isFinite(distancia) && (
              <View
                accessible
                accessibilityLabel={`A ${distanciaPorExtenso(distancia)} de você, cerca de ${minutosAPe(distancia)} minutos a pé`}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <Icone nome="caminhar" cor={cores.texto.secundario} tamanho={16} />
                <Texto variante="legenda" cor={cores.texto.secundario}>
                  {formatarDistancia(distancia)} · cerca de {minutosAPe(distancia)} min a pé
                </Texto>
              </View>
            )}
          </View>

          <View style={{ flexDirection: 'row', gap: espaco.sm }}>
            <AcaoRapida
              destaque
              rotulo="Como chegar"
              icone="rota"
              aoPressionar={() => abrirCaminho(dados)}
              dica="Abre o mapa com o caminho a pé até o ponto"
            />
            <AcaoRapida
              rotulo={salvo ? 'Salvo' : 'Salvar'}
              rotuloAcessivel={salvo ? 'Remover dos meus pontos' : 'Salvar nos meus pontos'}
              icone={salvo ? 'salvo' : 'salvar'}
              ocupado={gravandoSalvo}
              aoPressionar={() => alternarSalvo(dados)}
              dica={salvo ? 'Tira o ponto de Meus registros' : 'Guarda o ponto no celular para achar depois'}
            />
            <AcaoRapida
              rotulo="Registrar pausa"
              rotuloAcessivel="Registrar pausa para beber água"
              icone="copo"
              ocupado={gravandoPausa}
              aoPressionar={() => registrar(dados)}
              dica="Anota no celular a hora da sua pausa neste ponto"
            />
          </View>

          {confirmacao && <Aviso tipo="sucesso" mensagem={confirmacao} anunciar />}

          <Grupo titulo="Informações" recuoSeparador={58}>
            <Linha icone="endereco" corIcone={cores.icone.vermelho} sobretitulo="Endereço" titulo={enderecoCompleto(dados)} />
            <Linha
              icone="relogio"
              corIcone={cores.icone.laranja}
              sobretitulo="Horário"
              titulo={dados.horarioFuncionamento ?? 'Não informado'}
            />
            <Linha
              icone="acessivel"
              corIcone={cores.icone.azul}
              sobretitulo="Acessibilidade"
              titulo={dados.acessivel ? 'Sem degrau, dá para chegar de cadeira de rodas.' : 'Tem degrau ou piso irregular.'}
            />
            {dados.descricao ? (
              <Linha icone="info" corIcone={cores.icone.verde} sobretitulo="Sobre o ponto" titulo={dados.descricao} />
            ) : null}
            <Linha icone="pessoas" corIcone={cores.icone.cinza} sobretitulo="Mantido por" titulo={dados.parceiroNome} />
          </Grupo>
        </>
      )}
    </ScrollView>
  );
}
