import type { TextStyle } from 'react-native';

/**
 * CAMADA 1/2 — TIPOGRAFIA.
 *
 * Fonte do sistema (San Francisco no iPhone, Roboto no Android), com a escala de
 * estilos de texto do iOS (Large Title, Title, Headline, Body, Subheadline, Footnote).
 * A SF foi desenhada para leitura em tela e acompanha o "Tamanho do Texto" do iPhone.
 */
const base = {
  /** Temperatura do alerta (fina e grande, como no app Tempo). */
  destaque: { fontSize: 76, lineHeight: 84, fontWeight: '200', letterSpacing: -2 },
  /** Large Title: título da tela. */
  tituloGrande: { fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: 0.4 },
  /** Title 1: nome do ponto no detalhe. */
  titulo: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: 0.3 },
  /** Title 3: título dentro de cartões. */
  subtitulo: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  /** Body. */
  corpo: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
  /** Headline. */
  corpoNegrito: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  /** Subheadline: textos de apoio. */
  legenda: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  /** Footnote: cabeçalho e rodapé de seção. */
  nota: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  /** Botões. */
  botao: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  /** Sobretítulo em caixa alta (ex.: data acima do título). */
  rotulo: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export type VarianteTexto = keyof typeof base;
export type Tipografia = Record<VarianteTexto, TextStyle>;

/** Tamanhos de letra que a pessoa escolhe em Ajustes (guardado no SQLite). */
export const ESCALAS_LETRA = {
  normal: 1,
  grande: 1.15,
  muito_grande: 1.3,
} as const;

export type TamanhoLetra = keyof typeof ESCALAS_LETRA;

/** Tipografia multiplicada pela escala escolhida. O Tamanho do Texto do iPhone continua valendo por cima. */
export function criarTipografia(escala: number = 1): Tipografia {
  const resultado = {} as Tipografia;
  for (const [nome, estilo] of Object.entries(base) as [VarianteTexto, TextStyle][]) {
    resultado[nome] = {
      ...estilo,
      fontSize: Math.round((estilo.fontSize ?? 17) * escala),
      lineHeight: Math.round((estilo.lineHeight ?? 22) * escala),
    };
  }
  return resultado;
}
