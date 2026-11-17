import { View, type ViewProps } from 'react-native';

import { useTema } from '@/theme';

/** Cartão branco sobre o fundo agrupado. */
export function Cartao({ style, ...resto }: ViewProps) {
  const { cores, raio, espaco } = useTema();
  return (
    <View
      style={[
        {
          backgroundColor: cores.fundo.cartao,
          borderRadius: raio.lg,
          borderCurve: 'continuous',
          padding: espaco.md,
          gap: espaco.sm,
        },
        style,
      ]}
      {...resto}
    />
  );
}
