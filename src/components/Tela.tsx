import type { ReactNode } from 'react';
import { Platform, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Texto } from './Texto';

import { useTema } from '@/theme';

type Props = {
  /** Linha acima do conteúdo, abaixo do título grande do cabeçalho (ex.: data, explicação). */
  subtitulo?: string;
  children: ReactNode;
  aoAtualizar?: () => void;
  atualizando?: boolean;
};

/**
 * Corpo das abas. O título grande fica no cabeçalho nativo do iOS (Large Title,
 * que encolhe ao rolar); por isso a rolagem ajusta os recuos automaticamente.
 */
export function Tela({ subtitulo, children, aoAtualizar, atualizando = false }: Props) {
  const { cores, espaco } = useTema();
  const recuos = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.fundo.tela }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: espaco.md,
        paddingTop: Platform.OS === 'ios' ? espaco.xs : espaco.md,
        paddingBottom: espaco.xxl + (Platform.OS === 'ios' ? 0 : recuos.bottom),
        gap: espaco.lg,
      }}
      refreshControl={
        aoAtualizar ? (
          <RefreshControl
            refreshing={atualizando}
            onRefresh={aoAtualizar}
            tintColor={cores.texto.secundario}
            colors={[cores.tint]}
            accessibilityLabel="Puxe para atualizar"
          />
        ) : undefined
      }
    >
      {subtitulo && (
        <View style={{ marginTop: -espaco.sm }}>
          <Texto variante="legenda" cor={cores.texto.secundario}>
            {subtitulo}
          </Texto>
        </View>
      )}
      {children}
    </ScrollView>
  );
}
