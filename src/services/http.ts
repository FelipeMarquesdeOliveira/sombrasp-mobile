import { configuracaoDados } from './config';
import { ErroDeServico } from './erros';

type Parametros = Record<string, string | number | boolean | null | undefined>;

function montarUrl(caminho: string, parametros?: Parametros): string {
  const query = Object.entries(parametros ?? {})
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`)
    .join('&');
  return `${configuracaoDados.apiUrl}${caminho}${query ? `?${query}` : ''}`;
}

/**
 * GET com tempo limite. Devolve null quando a API responde 204 (ex.: sem alerta hoje).
 * Qualquer falha vira ErroDeServico, com mensagem simples para a tela.
 */
export async function getJson<T>(caminho: string, parametros?: Parametros): Promise<T | null> {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), configuracaoDados.tempoLimiteMs);

  let resposta: Response;
  try {
    resposta = await fetch(montarUrl(caminho, parametros), {
      headers: { Accept: 'application/json' },
      signal: controle.signal,
    });
  } catch {
    throw new ErroDeServico('sem_conexao');
  } finally {
    clearTimeout(limite);
  }

  if (resposta.status === 204) return null;
  if (resposta.status === 404) throw new ErroDeServico('nao_encontrado');
  if (!resposta.ok) throw new ErroDeServico('servidor');

  try {
    return (await resposta.json()) as T;
  } catch {
    throw new ErroDeServico('servidor');
  }
}
