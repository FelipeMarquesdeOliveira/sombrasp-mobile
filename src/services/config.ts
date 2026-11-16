/**
 * De onde o app tira os dados.
 *
 * Padrão: mock (src/services/mock). Com EXPO_PUBLIC_FONTE_DADOS=api, o app passa a
 * consumir a API REST do SombraSP feita em SOA (repositório sombrasp-soa), nas rotas abaixo.
 * As variáveis EXPO_PUBLIC_* são lidas no build pelo Expo (arquivo .env, fora do Git).
 */
export type NomeFonteDados = 'mock' | 'api';

const fonte: NomeFonteDados = process.env.EXPO_PUBLIC_FONTE_DADOS === 'api' ? 'api' : 'mock';

export const configuracaoDados = {
  fonte,
  apiUrl: (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8085').replace(/\/+$/, ''),
  tempoLimiteMs: 8000,
} as const;

/** Rotas GET públicas da API de SOA que o app usa (não exigem token). */
export const ENDPOINTS_SOA = {
  alertaDeHoje: '/alertas/hoje',
  alertasAtivos: '/alertas',
  pontosProximos: '/pontos/proximos',
  pontoPorId: (id: number) => `/pontos/${id}`,
} as const;
