import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { AccessibilityInfo, Alert, Pressable } from 'react-native';

import {
  EstadoCarregando,
  EstadoErro,
  EstadoVazio,
  Grupo,
  ICONE_TIPO,
  Icone,
  Linha,
  Tela,
} from '@/components';
import { apagarPausas, contarPausasDoDia, listarPausas, listarPontosSalvos, removerPontoSalvo } from '@/database';
import { dataHoraCurta, formatarTemperatura, rotuloTipo, type PausaHidratacao, type PontoSalvo } from '@/domain';
import { useTema } from '@/theme';
import { haptico } from '@/utils/haptico';

type Dados = { pontos: PontoSalvo[]; pausas: PausaHidratacao[]; pausasHoje: number };

export default function TelaRegistros() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { cores, toque } = useTema();
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState(false);

  /** Lê tudo do SQLite. Roda sempre que a aba ganha foco, para mostrar o que acabou de ser salvo. */
  const carregar = useCallback(async () => {
    try {
      const [pontos, pausas, pausasHoje] = await Promise.all([
        listarPontosSalvos(db),
        listarPausas(db),
        contarPausasDoDia(db),
      ]);
      setDados({ pontos, pausas, pausasHoje });
      setErro(false);
    } catch {
      setErro(true);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  async function remover(ponto: PontoSalvo) {
    await removerPontoSalvo(db, ponto.pontoId);
    haptico.sucesso();
    AccessibilityInfo.announceForAccessibility(`${ponto.nome} removido dos seus pontos.`);
    carregar();
  }

  function confirmarApagarPausas() {
    haptico.aviso();
    Alert.alert('Apagar histórico de pausas?', 'As pausas registradas neste celular serão apagadas.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await apagarPausas(db);
          AccessibilityInfo.announceForAccessibility('Histórico de pausas apagado.');
          carregar();
        },
      },
    ]);
  }

  return (
    <Tela subtitulo="Guardado neste celular. Funciona sem internet.">
      {erro && <EstadoErro mensagem="Não conseguimos ler os dados guardados no celular." aoTentarDeNovo={carregar} />}
      {!erro && !dados && <EstadoCarregando mensagem="Abrindo seus registros…" />}

      {!erro && dados && (
        <>
          {dados.pontos.length === 0 ? (
            <EstadoVazio
              icone="salvar"
              titulo="Nenhum ponto salvo"
              mensagem="Em Perto de mim, abra um ponto e toque em Salvar."
              acao={{ rotulo: 'Achar pontos', icone: 'local', aoPressionar: () => router.navigate('/perto') }}
            />
          ) : (
            <Grupo titulo={`Meus pontos (${dados.pontos.length})`} recuoSeparador={58}>
              {dados.pontos.map((ponto) => (
                <Linha
                  key={ponto.pontoId}
                  icone={ICONE_TIPO[ponto.tipo]}
                  corIcone={cores.tipo[ponto.tipo].fundo}
                  titulo={ponto.nome}
                  subtitulo={`${rotuloTipo(ponto.tipo)} · ${ponto.logradouro}`}
                  aoPressionar={() => router.push({ pathname: '/ponto/[id]', params: { id: String(ponto.pontoId) } })}
                  dica="Abre os detalhes do ponto. Para remover, use as ações."
                  acoesAcessiveis={[{ name: 'remover', label: 'Remover dos meus pontos' }]}
                  aoAcaoAcessivel={(evento) => {
                    if (evento.nativeEvent.actionName === 'remover') remover(ponto);
                  }}
                  seta={false}
                  acessorio={
                    <Pressable
                      onPress={() => remover(ponto)}
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
                      hitSlop={8}
                      style={({ pressed }) => ({
                        width: toque.minimo,
                        height: toque.minimo,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: pressed ? 0.5 : 1,
                      })}
                    >
                      <Icone nome="lixeira" cor={cores.acao.perigo.texto} tamanho={20} />
                    </Pressable>
                  }
                />
              ))}
            </Grupo>
          )}

          {dados.pausas.length === 0 ? (
            <EstadoVazio
              icone="copo"
              titulo="Nenhuma pausa registrada"
              mensagem="Quando chegar num ponto de apoio, toque em Registrar pausa."
            />
          ) : (
            <>
              <Grupo
                titulo="Pausas para beber água"
                rodape={`Hoje: ${dados.pausasHoje} ${dados.pausasHoje === 1 ? 'pausa' : 'pausas'}.`}
                recuoSeparador={58}
              >
                {dados.pausas.map((pausa) => {
                  const quando = dataHoraCurta(new Date(pausa.registradaEm));
                  const calor = pausa.temperaturaC !== null ? `dia de ${formatarTemperatura(pausa.temperaturaC)}` : null;
                  return (
                    <Linha
                      key={pausa.id}
                      icone="gota"
                      corIcone={cores.icone.azul}
                      titulo={quando}
                      subtitulo={[pausa.pontoNome, calor].filter(Boolean).join(' · ')}
                      rotuloAcessivel={`Pausa em ${quando}, ${pausa.pontoNome}${calor ? `, ${calor.replace(' °C', ' graus')}` : ''}`}
                    />
                  );
                })}
              </Grupo>
              <Grupo>
                <Linha
                  destrutivo
                  titulo="Apagar histórico de pausas"
                  aoPressionar={confirmarApagarPausas}
                  dica="Pede confirmação antes de apagar"
                />
              </Grupo>
            </>
          )}
        </>
      )}
    </Tela>
  );
}
