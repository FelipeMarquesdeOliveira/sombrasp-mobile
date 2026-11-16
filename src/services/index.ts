import { apiSombraSP } from './apiSombraSP';
import { configuracaoDados } from './config';
import type { FonteDeDados } from './fonteDeDados';
import { mockSombraSP } from './mockSombraSP';

/** Fonte usada pelas telas: o mock por padrão, ou a API de SOA com EXPO_PUBLIC_FONTE_DADOS=api. */
export const fonteDeDados: FonteDeDados = configuracaoDados.fonte === 'api' ? apiSombraSP : mockSombraSP;

export const usandoMock = configuracaoDados.fonte === 'mock';

export { configuracaoDados, ENDPOINTS_SOA } from './config';
export { ErroDeServico, mensagemDeErro } from './erros';
export type { FonteDeDados } from './fonteDeDados';
export { controleMock } from './mockSombraSP';
export type { CenarioCalor } from './mock/alertas';
