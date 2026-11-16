export type TipoErroServico = 'sem_conexao' | 'servidor' | 'nao_encontrado';

const MENSAGENS: Record<TipoErroServico, string> = {
  sem_conexao: 'Sem conexão no momento. Confira a internet e tente de novo.',
  servidor: 'O serviço do SombraSP não respondeu agora. Tente de novo em instantes.',
  nao_encontrado: 'Não encontramos esse ponto. Ele pode ter sido desativado.',
};

/** Erro de dados com mensagem em linguagem simples, pronta para mostrar na tela. */
export class ErroDeServico extends Error {
  constructor(public readonly tipo: TipoErroServico) {
    super(MENSAGENS[tipo]);
    this.name = 'ErroDeServico';
  }
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroDeServico) return erro.message;
  return MENSAGENS.servidor;
}
