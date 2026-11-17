import { useMemo } from 'react';

import { cores } from './cores';
import { elevacao } from './elevacao';
import { espaco, raio, toque } from './espacamento';
import { criarTipografia, ESCALAS_LETRA } from './tipografia';

import { usePreferencias } from '@/context/PreferenciasContext';

/** Tema com a tipografia já no tamanho de letra escolhido pela pessoa. */
export function useTema() {
  const { tamanhoLetra } = usePreferencias();
  return useMemo(
    () => ({
      cores,
      elevacao,
      espaco,
      raio,
      toque,
      tipografia: criarTipografia(ESCALAS_LETRA[tamanhoLetra]),
    }),
    [tamanhoLetra],
  );
}

export type Tema = ReturnType<typeof useTema>;
