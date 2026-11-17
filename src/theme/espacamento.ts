/** CAMADA 1/2 — ESPAÇAMENTO, RAIOS E ÁREAS DE TOQUE (grade de 4 pt, margens do iOS). */
export const espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const raio = {
  /** Ícone quadrado das linhas (como nos Ajustes do iPhone). */
  icone: 8,
  sm: 10,
  /** Botões. */
  md: 14,
  /** Grupos de lista e cartões. */
  lg: 20,
  /** Cartão do alerta. */
  xl: 26,
  pilula: 999,
} as const;

/** Áreas de toque (mínimo do iOS: 44 pt). */
export const toque = {
  minimo: 44,
  linha: 52,
  botao: 52,
} as const;
