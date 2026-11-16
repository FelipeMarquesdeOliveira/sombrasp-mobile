import { ErroDeServico } from './erros';
import type { FonteDeDados } from './fonteDeDados';
import { alertasDoCenario, type CenarioCalor } from './mock/alertas';
import { PONTOS_MOCK } from './mock/pontos';

import { arredondarKm, atende, dataISO, distanciaKm, RAIO_MAXIMO_KM } from '@/domain';
import type { AlertaCalor, PontoProximo } from '@/domain';

/**
 * Estado da simulação. Fica em memória: ao reabrir o app, volta ao padrão.
 * Serve para mostrar na apresentação os estados de carregando, erro e vazio.
 */
const simulacao = {
  cenario: 'calor_forte' as CenarioCalor,
  falhaDeConexao: false,
  atrasoMs: 700,
};

export const controleMock = {
  cenario: () => simulacao.cenario,
  definirCenario: (cenario: CenarioCalor) => {
    simulacao.cenario = cenario;
  },
  falhaDeConexao: () => simulacao.falhaDeConexao,
  definirFalhaDeConexao: (ativa: boolean) => {
    simulacao.falhaDeConexao = ativa;
  },
  /** Usado nos testes para não esperar o atraso de rede. */
  definirAtrasoMs: (ms: number) => {
    simulacao.atrasoMs = ms;
  },
};

/** Imita o tempo de resposta de uma rede móvel e, se pedido, uma queda de conexão. */
async function simularRede() {
  if (simulacao.atrasoMs > 0) {
    await new Promise((resolver) => setTimeout(resolver, simulacao.atrasoMs));
  }
  if (simulacao.falhaDeConexao) throw new ErroDeServico('sem_conexao');
}

const GRAVIDADE = { ALERTA: 1, EMERGENCIA: 2 } as const;

/** Mesma regra de GET /alertas/hoje: o alerta ativo mais grave com a data de hoje. */
function maisGraveDeHoje(alertas: AlertaCalor[], hoje: string): AlertaCalor | null {
  return (
    alertas
      .filter((alerta) => alerta.ativo && alerta.dataReferencia === hoje)
      .sort((a, b) => GRAVIDADE[b.nivel] - GRAVIDADE[a.nivel])[0] ?? null
  );
}

export const mockSombraSP: FonteDeDados = {
  descricao: 'Dados simulados (mock) do Centro de SP',

  async buscarAlertaDeHoje() {
    await simularRede();
    return maisGraveDeHoje(alertasDoCenario(simulacao.cenario), dataISO());
  },

  async listarAlertasAtivos() {
    await simularRede();
    return alertasDoCenario(simulacao.cenario)
      .filter((alerta) => alerta.ativo)
      .sort((a, b) => b.dataReferencia.localeCompare(a.dataReferencia))
      .map(({ id, dataReferencia, temperaturaMaxima, nivel, fonte, ativo }) => ({
        id,
        dataReferencia,
        temperaturaMaxima,
        nivel,
        fonte,
        ativo,
      }));
  },

  async buscarPontosProximos(origem, filtro) {
    await simularRede();
    const raio = Math.min(Math.max(filtro.raioKm, 0.1), RAIO_MAXIMO_KM);
    return PONTOS_MOCK.filter((ponto) => ponto.ativo)
      .filter((ponto) => atende(ponto.tipo, filtro.tipo))
      .filter((ponto) => !filtro.acessivel || ponto.acessivel)
      .map<PontoProximo>((ponto) => ({
        id: ponto.id,
        nome: ponto.nome,
        tipo: ponto.tipo,
        bairro: ponto.endereco.bairro,
        logradouro: ponto.endereco.logradouro,
        acessivel: ponto.acessivel,
        horarioFuncionamento: ponto.horarioFuncionamento,
        distanciaKm: arredondarKm(distanciaKm(origem, ponto)),
      }))
      .filter((ponto) => ponto.distanciaKm <= raio)
      .sort((a, b) => a.distanciaKm - b.distanciaKm);
  },

  async detalharPonto(id) {
    await simularRede();
    const ponto = PONTOS_MOCK.find((p) => p.id === id && p.ativo);
    if (!ponto) throw new ErroDeServico('nao_encontrado');
    return ponto;
  },
};
