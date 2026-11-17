import { paleta } from './paleta';

const { cinza, laranja, sol, vermelho, ceu, agua, folha, brisa } = paleta;

/**
 * CAMADA 2 — TOKENS SEMÂNTICOS.
 *
 * Cada token diz o PAPEL da cor. Componentes e telas usam só estes tokens.
 * Os nomes seguem os papéis do iOS: fundo agrupado, célula, rótulo, rótulo
 * secundário, separador e cor de destaque (tint).
 *
 * Regras (conferidas em src/theme/__tests__/contraste.test.ts):
 * - todo texto passa de 4,5:1 sobre o fundo em que aparece (WCAG 2.1 AA);
 * - ícones e bordas que identificam algo passam de 3:1;
 * - cor nunca é o único sinal: nível do alerta e tipo do ponto têm texto e ícone.
 */
export const cores = {
  fundo: {
    /** systemGroupedBackground: fundo de todas as telas. */
    tela: cinza[50],
    /** Célula / cartão sobre o fundo agrupado. */
    cartao: cinza[0],
    /** Botão cinza e selo neutro. */
    preenchimento: cinza[100],
    /** Célula pressionada (claro o bastante para o texto secundário manter 4,5:1). */
    pressionado: cinza[100],
  },
  texto: {
    principal: cinza[900],
    secundario: cinza[700],
    sobreCor: cinza[0],
    destaque: laranja[700],
  },
  separador: cinza[300],
  /** Cor de destaque do app (o "tint" do iOS): links, ícones ativos, marcas de seleção. */
  tint: laranja[700],
  acao: {
    primaria: { fundo: laranja[700], pressionado: laranja[800], texto: cinza[0] },
    secundaria: { fundo: laranja[100], pressionado: laranja[50], texto: laranja[800] },
    neutra: { fundo: cinza[100], pressionado: cinza[200], texto: cinza[900] },
    perigo: { fundo: vermelho[50], pressionado: cinza[100], texto: vermelho[700] },
  },
  /** Filtro ligado (cápsula). */
  selecao: {
    fundo: laranja[700],
    texto: cinza[0],
  },
  feedback: {
    sucesso: { fundo: folha[50], texto: folha[700] },
    erro: { fundo: vermelho[50], texto: vermelho[700] },
    info: { fundo: ceu[50], texto: ceu[700] },
  },
  /** Nível do alerta de calor: gradiente do cartão (mesmos níveis da API de SOA). */
  nivel: {
    ALERTA: { gradiente: [laranja[700], laranja[800]], texto: cinza[0], textoSuave: laranja[100], icone: sol[200] },
    EMERGENCIA: { gradiente: [vermelho[700], vermelho[900]], texto: cinza[0], textoSuave: vermelho[50], icone: sol[200] },
    SEM_ALERTA: { gradiente: [ceu[700], ceu[900]], texto: cinza[0], textoSuave: ceu[50], icone: sol[200] },
  },
  /** Tipo do ponto: fundo do ícone quadrado (estilo Ajustes do iPhone) e selo. */
  tipo: {
    SOMBRA: { fundo: folha[800], suave: folha[50], texto: folha[700] },
    HIDRATACAO: { fundo: agua[700], suave: agua[50], texto: agua[700] },
    SOMBRA_E_HIDRATACAO: { fundo: brisa[700], suave: brisa[50], texto: brisa[700] },
  },
  /** Ícones quadrados das linhas de lista (dicas, ajustes, informações). */
  icone: {
    laranja: laranja[700],
    azul: ceu[700],
    verde: folha[800],
    vermelho: vermelho[700],
    cinza: cinza[600],
  },
  navegacao: {
    fundo: cinza[80],
    ativo: laranja[700],
    inativo: cinza[600],
  },
  sombra: '#000000',
} as const;

export type Cores = typeof cores;
