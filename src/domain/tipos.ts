/**
 * Tipos do domínio. Seguem o contrato da API REST do SombraSP (disciplina de SOA,
 * repositório sombrasp-soa), para que o app possa trocar o mock pela API sem mudar as telas.
 */

/** Igual ao enum NivelAlerta da API: >= 31 °C ALERTA, >= 35 °C EMERGENCIA. */
export type NivelAlerta = 'ALERTA' | 'EMERGENCIA';

/** De onde veio a temperatura: modelo de IA&ML (INMET A701), estação ESP32 ou gestor. */
export type FonteAlerta = 'MODELO_IA_INMET' | 'ESTACAO_ESP32' | 'MANUAL';

export type TipoPonto = 'SOMBRA' | 'HIDRATACAO' | 'SOMBRA_E_HIDRATACAO';

/** GET /alertas/hoje e GET /alertas (DadosDetalhamentoAlerta). */
export type AlertaCalor = {
  id: number;
  dataReferencia: string; // AAAA-MM-DD
  temperaturaMaxima: number;
  nivel: NivelAlerta;
  fonte: FonteAlerta;
  mensagem: string;
  ativo: boolean;
  emitidoEm: string;
  encerradoEm: string | null;
};

/** GET /alertas (DadosListagemAlerta): resumo, sem a mensagem. */
export type ResumoAlerta = Pick<
  AlertaCalor,
  'id' | 'dataReferencia' | 'temperaturaMaxima' | 'nivel' | 'fonte' | 'ativo'
>;

export type Endereco = {
  logradouro: string;
  numero: string | null;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
};

/** GET /pontos/{id} (DadosDetalhamentoPonto). */
export type PontoDetalhe = {
  id: number;
  nome: string;
  tipo: TipoPonto;
  descricao: string | null;
  latitude: number;
  longitude: number;
  acessivel: boolean;
  horarioFuncionamento: string | null;
  endereco: Endereco;
  parceiroId: number;
  parceiroNome: string;
  ativo: boolean;
};

/** GET /pontos/proximos (DadosPontoProximo). */
export type PontoProximo = {
  id: number;
  nome: string;
  tipo: TipoPonto;
  bairro: string;
  logradouro: string;
  acessivel: boolean;
  horarioFuncionamento: string | null;
  distanciaKm: number;
};

export type Coordenada = {
  latitude: number;
  longitude: number;
};

/** Filtros da busca por proximidade (mesmos parâmetros de GET /pontos/proximos). */
export type FiltroPontos = {
  raioKm: number;
  tipo?: TipoPonto | null;
  acessivel?: boolean;
};

/** Ponto que a pessoa guardou no aparelho (tabela ponto_salvo do SQLite). */
export type PontoSalvo = {
  pontoId: number;
  nome: string;
  tipo: TipoPonto;
  logradouro: string;
  bairro: string;
  salvoEm: string;
};

/** Pausa para beber água registrada no aparelho (tabela pausa_hidratacao do SQLite). */
export type PausaHidratacao = {
  id: number;
  pontoId: number | null;
  pontoNome: string;
  temperaturaC: number | null;
  registradaEm: string;
};
