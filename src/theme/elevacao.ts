import type { ViewStyle } from 'react-native';

import { cores } from './cores';

/** Sombras discretas, como nos cartões do iOS. O agrupamento é feito pelo contraste branco/cinza, não pela sombra. */
export const elevacao = {
  nenhuma: {},
  baixa: {
    shadowColor: cores.sombra,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  media: {
    shadowColor: cores.sombra,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} satisfies Record<string, ViewStyle>;
