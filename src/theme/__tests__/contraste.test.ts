import { contraste } from '@/theme/contraste';
import { cores } from '@/theme/cores';
import { paleta } from '@/theme/paleta';

const { fundo, texto } = cores;

/** Todas as combinações de texto sobre fundo usadas nas telas (WCAG AA: 4,5:1). */
const TEXTOS: [string, string, string][] = [
  ['texto principal no fundo agrupado', texto.principal, fundo.tela],
  ['texto principal na célula', texto.principal, fundo.cartao],
  ['texto principal na célula pressionada', texto.principal, fundo.pressionado],
  ['texto principal no preenchimento cinza', texto.principal, fundo.preenchimento],
  ['texto secundário no fundo agrupado', texto.secundario, fundo.tela],
  ['texto secundário na célula', texto.secundario, fundo.cartao],
  ['texto secundário na célula pressionada', texto.secundario, fundo.pressionado],
  ['cor de destaque (tint) na célula', cores.tint, fundo.cartao],
  ['cor de destaque (tint) no fundo agrupado', cores.tint, fundo.tela],
  ['botão principal', cores.acao.primaria.texto, cores.acao.primaria.fundo],
  ['botão principal pressionado', cores.acao.primaria.texto, cores.acao.primaria.pressionado],
  ['botão tingido', cores.acao.secundaria.texto, cores.acao.secundaria.fundo],
  ['botão tingido pressionado', cores.acao.secundaria.texto, cores.acao.secundaria.pressionado],
  ['botão cinza', cores.acao.neutra.texto, cores.acao.neutra.fundo],
  ['botão de perigo', cores.acao.perigo.texto, cores.acao.perigo.fundo],
  ['linha destrutiva', cores.acao.perigo.texto, fundo.cartao],
  ['filtro ligado', cores.selecao.texto, cores.selecao.fundo],
  ['aviso de sucesso', texto.principal, cores.feedback.sucesso.fundo],
  ['aviso de erro', texto.principal, cores.feedback.erro.fundo],
  ['aviso de informação', texto.principal, cores.feedback.info.fundo],
  ['aba inativa', cores.navegacao.inativo, cores.navegacao.fundo],
  ['aba ativa', cores.navegacao.ativo, cores.navegacao.fundo],
  ...(['SOMBRA', 'HIDRATACAO', 'SOMBRA_E_HIDRATACAO'] as const).map(
    (tipo): [string, string, string] => [`selo ${tipo}`, cores.tipo[tipo].texto, cores.tipo[tipo].suave],
  ),
  // Cartão do alerta: confere as duas pontas do gradiente, para o texto ler bem em qualquer parte.
  ...(['ALERTA', 'EMERGENCIA', 'SEM_ALERTA'] as const).flatMap((nivel): [string, string, string][] => {
    const tom = cores.nivel[nivel];
    return tom.gradiente.flatMap((ponta, i): [string, string, string][] => [
      [`alerta ${nivel}: texto (ponta ${i + 1})`, tom.texto, ponta],
      [`alerta ${nivel}: texto suave (ponta ${i + 1})`, tom.textoSuave, ponta],
    ]);
  }),
];

/** Ícones e elementos gráficos que carregam informação (WCAG 1.4.11: 3:1). */
const GRAFICOS: [string, string, string][] = [
  ...(['SOMBRA', 'HIDRATACAO', 'SOMBRA_E_HIDRATACAO'] as const).map(
    (tipo): [string, string, string] => [`ícone branco no quadrado ${tipo}`, texto.sobreCor, cores.tipo[tipo].fundo],
  ),
  ...(Object.entries(cores.icone) as [string, string][]).map(
    ([nome, cor]): [string, string, string] => [`ícone branco no quadrado ${nome}`, texto.sobreCor, cor],
  ),
  ...(['ALERTA', 'EMERGENCIA', 'SEM_ALERTA'] as const).flatMap((nivel) =>
    cores.nivel[nivel].gradiente.map(
      (ponta, i): [string, string, string] => [`ícone do alerta ${nivel} (ponta ${i + 1})`, cores.nivel[nivel].icone, ponta],
    ),
  ),
  ['quadrados de ícone se destacam do fundo', cores.tipo.SOMBRA.fundo, fundo.cartao],
];

describe('contraste do texto (WCAG 2.1 AA, 4,5:1)', () => {
  it.each(TEXTOS)('%s', (_nome, frente, fundoDaCor) => {
    expect(contraste(frente, fundoDaCor)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('contraste de ícones e gráficos (3:1)', () => {
  it.each(GRAFICOS)('%s', (_nome, frente, fundoDaCor) => {
    expect(contraste(frente, fundoDaCor)).toBeGreaterThanOrEqual(3);
  });
});

describe('regras do design system', () => {
  it('o cinza secundário padrão do iOS (#8A8A8E) não é usado em texto, porque não passa de 4,5:1', () => {
    expect(contraste(paleta.cinza[500], fundo.cartao)).toBeLessThan(4.5);
    expect(texto.secundario).not.toBe(paleta.cinza[500]);
  });

  it('as cores da paleta estão no formato #RRGGBB', () => {
    const todas = Object.values(paleta).flatMap((escala) => Object.values(escala));
    expect(todas.every((cor) => /^#[0-9A-F]{6}$/.test(cor))).toBe(true);
  });
});
