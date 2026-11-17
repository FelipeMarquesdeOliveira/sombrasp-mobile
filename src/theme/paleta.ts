/**
 * CAMADA 1 — PALETA BASE ("Clima", no padrão visual do iPhone).
 *
 * Cores cruas. Telas e componentes NÃO usam a paleta direto: usam os tokens
 * semânticos de cores.ts, que dizem para que serve cada cor.
 *
 * Ideia: o app é neutro como os apps nativos do iOS (cinza agrupado + branco),
 * e a cor aparece onde importa. O calor (laranja e vermelho) marca o alerta e a
 * ação principal; o alívio (verde da sombra, azul da água e do céu) marca os pontos.
 */
export const paleta = {
  /** Cinzas do sistema iOS (systemGroupedBackground, systemGray…). */
  cinza: {
    0: '#FFFFFF',
    50: '#F2F2F7',
    80: '#F9F9F9',
    100: '#E5E5EA',
    200: '#D1D1D6',
    300: '#C6C6C8',
    500: '#8A8A8E',
    600: '#6C6C70',
    700: '#636366',
    800: '#3A3A3C',
    900: '#1C1C1E',
  },
  /** Laranja do calor: cor de destaque (tint) do app e alerta de calor forte. */
  laranja: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    300: '#FDBA74',
    500: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  /** Sol: só em ícones e detalhes sobre fundo escuro. */
  sol: {
    200: '#FFE08A',
    400: '#FFD60A',
  },
  /** Vermelho: calor extremo, erro e ações de apagar. */
  vermelho: {
    50: '#FDECEC',
    700: '#B91C1C',
    900: '#7F1D1D',
  },
  /** Azul-céu: informação e dia sem alerta. */
  ceu: {
    50: '#E6F3FB',
    700: '#0E6BA8',
    900: '#0A4A75',
  },
  /** Azul-água: pontos de hidratação. */
  agua: {
    50: '#E8F0FA',
    700: '#0B5394',
  },
  /** Verde-folha: pontos de sombra e confirmações. */
  folha: {
    50: '#E3F4E7',
    700: '#1E7B34',
    800: '#2F6B1F',
  },
  /** Verde-azulado: pontos com sombra e água. */
  brisa: {
    50: '#E3F4F4',
    700: '#0F6E6E',
  },
} as const;

export type Paleta = typeof paleta;
