/**
 * Design system do SombraSP ("Clima", padrão visual do iPhone), em três camadas:
 *   1. paleta.ts  — cores cruas (cinzas do iOS, laranja, céu, folha…), tipografia e espaçamento base;
 *   2. cores.ts   — tokens semânticos (fundo, texto, ação, alerta, tipo do ponto);
 *   3. src/components — componentes que só usam os tokens.
 * Documentação: docs/DESIGN_SYSTEM.md. Catálogo ao vivo: tela "Guia visual" (Ajustes).
 */
export { paleta, type Paleta } from './paleta';
export { cores, type Cores } from './cores';
export { contraste, formatarContraste } from './contraste';
export { elevacao } from './elevacao';
export {
  criarTipografia,
  ESCALAS_LETRA,
  type TamanhoLetra,
  type Tipografia,
  type VarianteTexto,
} from './tipografia';
export { espaco, raio, toque } from './espacamento';
export { useTema, type Tema } from './useTema';
