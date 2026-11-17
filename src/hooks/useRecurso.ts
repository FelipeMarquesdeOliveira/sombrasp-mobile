import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

import { mensagemDeErro } from '@/services';

export type EstadoRecurso = 'carregando' | 'erro' | 'vazio' | 'pronto';

const vazioPadrao = (dados: unknown) => dados == null || (Array.isArray(dados) && dados.length === 0);

/**
 * Busca um dado e expõe os quatro estados que toda tela trata:
 * carregando, erro (com mensagem simples), vazio e pronto.
 * Respostas antigas são ignoradas se a busca mudar no meio do caminho.
 */
export function useRecurso<T>(
  carregar: () => Promise<T>,
  dependencias: DependencyList,
  ehVazio: (dados: T) => boolean = vazioPadrao,
) {
  const [estado, setEstado] = useState<EstadoRecurso>('carregando');
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const ultimaBusca = useRef(0);
  // Em ref para que uma função criada a cada render não dispare uma nova busca.
  const ehVazioRef = useRef(ehVazio);
  ehVazioRef.current = ehVazio;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const buscar = useCallback(carregar, dependencias);

  const executar = useCallback(
    async (modo: 'inicial' | 'atualizar' = 'inicial') => {
      const busca = ++ultimaBusca.current;
      if (modo === 'atualizar') setAtualizando(true);
      else setEstado('carregando');
      setErro(null);
      try {
        const resultado = await buscar();
        if (busca !== ultimaBusca.current) return;
        setDados(resultado);
        setEstado(ehVazioRef.current(resultado) ? 'vazio' : 'pronto');
      } catch (e) {
        if (busca !== ultimaBusca.current) return;
        setErro(mensagemDeErro(e));
        setEstado('erro');
      } finally {
        if (busca === ultimaBusca.current) setAtualizando(false);
      }
    },
    [buscar],
  );

  useEffect(() => {
    executar('inicial');
  }, [executar]);

  return {
    estado,
    dados,
    erro,
    atualizando,
    recarregar: useCallback(() => executar('inicial'), [executar]),
    atualizar: useCallback(() => executar('atualizar'), [executar]),
  };
}
