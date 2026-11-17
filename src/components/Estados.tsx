import { ActivityIndicator, View } from 'react-native';

import { Botao } from './Botao';
import { Icone, type NomeIcone } from './Icone';
import { Texto, Titulo } from './Texto';

import { useTema } from '@/theme';

/** Estado "carregando": indicador do sistema + frase do que está sendo buscado. */
export function EstadoCarregando({ mensagem }: { mensagem: string }) {
  const { cores, espaco } = useTema();
  return (
    <View
      accessible
      accessibilityLabel={mensagem}
      accessibilityState={{ busy: true }}
      accessibilityLiveRegion="polite"
      style={{ alignItems: 'center', gap: espaco.sm + 4, paddingVertical: espaco.xl }}
    >
      <ActivityIndicator size="large" color={cores.texto.secundario} />
      <Texto variante="legenda" centralizado cor={cores.texto.secundario}>
        {mensagem}
      </Texto>
    </View>
  );
}

type PropsConteudo = {
  icone: NomeIcone;
  titulo: string;
  mensagem: string;
  acao?: { rotulo: string; aoPressionar: () => void; icone?: NomeIcone };
  alerta?: boolean;
};

/** Tela de "conteúdo indisponível" do iOS: ícone grande, título, explicação e uma ação. */
function ConteudoIndisponivel({ icone, titulo, mensagem, acao, alerta }: PropsConteudo) {
  const { cores, espaco } = useTema();
  return (
    <View style={{ alignItems: 'center', gap: espaco.md, paddingVertical: espaco.xl, paddingHorizontal: espaco.md }}>
      <Icone nome={icone} cor={cores.texto.secundario} tamanho={48} />
      <View
        accessible
        accessibilityRole={alerta ? 'alert' : undefined}
        style={{ gap: espaco.xs + 2, alignItems: 'center' }}
      >
        <Titulo nivel="subtitulo" centralizado>
          {titulo}
        </Titulo>
        <Texto variante="legenda" centralizado cor={cores.texto.secundario}>
          {mensagem}
        </Texto>
      </View>
      {acao && (
        <Botao
          variante="secundario"
          rotulo={acao.rotulo}
          icone={acao.icone}
          aoPressionar={acao.aoPressionar}
          estilo={{ alignSelf: 'center', minHeight: 44, paddingVertical: espaco.sm }}
        />
      )}
    </View>
  );
}

/** Estado "erro": diz o que houve em linguagem simples e oferece tentar de novo. */
export function EstadoErro({ mensagem, aoTentarDeNovo }: { mensagem: string; aoTentarDeNovo: () => void }) {
  return (
    <ConteudoIndisponivel
      alerta
      icone="semConexao"
      titulo="Não deu para carregar"
      mensagem={mensagem}
      acao={{ rotulo: 'Tentar de novo', icone: 'atualizar', aoPressionar: aoTentarDeNovo }}
    />
  );
}

/** Estado "vazio": explica por que não há nada e o que a pessoa pode fazer. */
export function EstadoVazio(props: Omit<PropsConteudo, 'alerta'>) {
  return <ConteudoIndisponivel {...props} />;
}
