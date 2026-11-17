import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
  type AccessibilityRole,
  type AccessibilityState,
} from 'react-native';

import { Icone, IconeQuadrado, type NomeIcone } from './Icone';
import { Texto } from './Texto';

import { useTema } from '@/theme';

/**
 * Lista agrupada no estilo do iOS (como nos Ajustes do iPhone): cabeçalho em
 * caixa alta, linhas brancas com cantos arredondados, separadores finos e um
 * rodapé explicativo.
 */
export function Grupo({
  titulo,
  rodape,
  children,
  recuoSeparador = 16,
}: {
  titulo?: string;
  rodape?: string;
  children: ReactNode;
  /** Onde o separador começa (alinhado ao texto, depois do ícone). */
  recuoSeparador?: number;
}) {
  const { cores, espaco, raio } = useTema();
  const itens = Children.toArray(children).filter(isValidElement);

  return (
    <View style={{ gap: espaco.sm }}>
      {titulo && (
        <Texto
          variante="nota"
          cor={cores.texto.secundario}
          accessibilityRole="header"
          style={{ textTransform: 'uppercase', paddingHorizontal: espaco.md, letterSpacing: 0.3 }}
        >
          {titulo}
        </Texto>
      )}
      <View
        style={{
          backgroundColor: cores.fundo.cartao,
          borderRadius: raio.lg,
          borderCurve: 'continuous',
          overflow: 'hidden',
        }}
      >
        {itens.map((item, indice) => (
          <Fragment key={item.key ?? indice}>
            {indice > 0 && (
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: cores.separador,
                  marginLeft: recuoSeparador,
                }}
              />
            )}
            {item}
          </Fragment>
        ))}
      </View>
      {rodape && (
        <Texto variante="nota" cor={cores.texto.secundario} style={{ paddingHorizontal: espaco.md }}>
          {rodape}
        </Texto>
      )}
    </View>
  );
}

type PropsLinha = {
  /** Rótulo pequeno acima do título (ex.: "Endereço"), como nas fichas do app Mapas. */
  sobretitulo?: string;
  titulo: string;
  subtitulo?: string;
  /** Texto à direita (ex.: "110 m", "RM 556319"). */
  valor?: string;
  icone?: NomeIcone;
  /** Cor do quadrado do ícone. Sem cor, o ícone aparece solto na cor de destaque. */
  corIcone?: string;
  aoPressionar?: () => void;
  /** Mostra a seta ">" (padrão: quando a linha é tocável e não é marcável). */
  seta?: boolean;
  /** Linha de escolha: mostra a marca de seleção à direita. */
  marcado?: boolean;
  /** Ação destrutiva: texto vermelho centralizado. */
  destrutivo?: boolean;
  /** Elemento à direita (ex.: Switch). */
  acessorio?: ReactNode;
  rotuloAcessivel?: string;
  dica?: string;
  papel?: AccessibilityRole;
  /** Ações extras do VoiceOver (ex.: "Remover"), o equivalente acessível ao deslizar para apagar. */
  acoesAcessiveis?: AccessibilityActionInfo[];
  aoAcaoAcessivel?: (evento: AccessibilityActionEvent) => void;
};

/** Linha de lista do iOS: ícone, título, subtítulo, valor e seta. */
export function Linha({
  sobretitulo,
  titulo,
  subtitulo,
  valor,
  icone,
  corIcone,
  aoPressionar,
  seta,
  marcado,
  destrutivo,
  acessorio,
  rotuloAcessivel,
  dica,
  papel,
  acoesAcessiveis,
  aoAcaoAcessivel,
}: PropsLinha) {
  const { cores, espaco, toque } = useTema();
  const marcavel = marcado !== undefined;
  const mostrarSeta = seta ?? (!!aoPressionar && !marcavel && !destrutivo && !acessorio);
  const estado: AccessibilityState | undefined = marcavel ? { checked: marcado } : undefined;

  const conteudo = (pressionado: boolean) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaco.md - 4,
        minHeight: toque.linha,
        paddingHorizontal: espaco.md,
        paddingVertical: espaco.sm + 2,
        backgroundColor: pressionado ? cores.fundo.pressionado : 'transparent',
      }}
    >
      {icone &&
        (corIcone ? (
          <IconeQuadrado nome={icone} fundo={corIcone} />
        ) : (
          <Icone nome={icone} cor={cores.tint} tamanho={22} />
        ))}
      <View style={{ flex: 1, gap: 2 }}>
        {sobretitulo && (
          <Texto variante="nota" cor={cores.texto.secundario}>
            {sobretitulo}
          </Texto>
        )}
        <Texto
          cor={destrutivo ? cores.acao.perigo.texto : cores.texto.principal}
          centralizado={destrutivo}
        >
          {titulo}
        </Texto>
        {subtitulo && (
          <Texto variante="legenda" cor={cores.texto.secundario}>
            {subtitulo}
          </Texto>
        )}
      </View>
      {valor && (
        <Texto cor={cores.texto.secundario} style={{ textAlign: 'right', maxWidth: '45%' }}>
          {valor}
        </Texto>
      )}
      {acessorio}
      {marcavel && (
        <View style={{ width: 22 }}>{marcado && <Icone nome="check" cor={cores.tint} tamanho={18} />}</View>
      )}
      {mostrarSeta && <Icone nome="seta" cor={cores.separador} tamanho={14} />}
    </View>
  );

  const rotulo = rotuloAcessivel ?? [sobretitulo, titulo, subtitulo, valor].filter(Boolean).join('. ');

  if (!aoPressionar) {
    return (
      <View accessible={!acessorio} accessibilityLabel={acessorio ? undefined : rotulo}>
        {conteudo(false)}
      </View>
    );
  }

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole={papel ?? (marcavel ? 'radio' : 'button')}
      accessibilityLabel={rotulo}
      accessibilityHint={dica}
      accessibilityState={estado}
      accessibilityActions={acoesAcessiveis}
      onAccessibilityAction={aoAcaoAcessivel}
    >
      {({ pressed }) => conteudo(pressed)}
    </Pressable>
  );
}

export type Opcao<T extends string | number> = { valor: T; rotulo: string; descricao?: string };

/** Escolha única dentro de um grupo (marca de seleção à direita, como nos Ajustes do iPhone). */
export function GrupoOpcoes<T extends string | number>({
  titulo,
  rodape,
  opcoes,
  valor,
  aoEscolher,
}: {
  titulo: string;
  rodape?: string;
  opcoes: Opcao<T>[];
  valor: T;
  aoEscolher: (valor: T) => void;
}) {
  return (
    <Grupo titulo={titulo} rodape={rodape}>
      {opcoes.map((opcao) => (
        <Linha
          key={String(opcao.valor)}
          titulo={opcao.rotulo}
          subtitulo={opcao.descricao}
          marcado={opcao.valor === valor}
          aoPressionar={() => aoEscolher(opcao.valor)}
        />
      ))}
    </Grupo>
  );
}
