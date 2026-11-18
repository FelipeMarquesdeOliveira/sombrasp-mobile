import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { cores } from '@/theme';

/**
 * Barra de abas nativa do iOS (UITabBar, com o vidro do iOS 26) e SF Symbols.
 * No Android vira a barra de navegação do Material, com os ícones do Ionicons.
 */
export default function LayoutAbas() {
  return (
    <NativeTabs
      tintColor={cores.navegacao.ativo}
      iconColor={{ default: cores.navegacao.inativo, selected: cores.navegacao.ativo }}
      labelStyle={{ default: { color: cores.navegacao.inativo }, selected: { color: cores.navegacao.ativo } }}
      // Sempre visível: com rótulos, mais fácil para idosos do que a barra que encolhe ao rolar.
      minimizeBehavior="never"
    >
      <NativeTabs.Trigger name="(hoje)" accessibilityLabel="Hoje. Alerta de calor de hoje">
        <NativeTabs.Trigger.Label>Hoje</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'sun.max', selected: 'sun.max.fill' }}
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="sunny" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(perto)" accessibilityLabel="Perto de mim. Pontos de sombra e água mais próximos">
        <NativeTabs.Trigger.Label>Perto de mim</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'location', selected: 'location.fill' }}
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="location" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(registros)" accessibilityLabel="Registros. Pontos salvos e pausas para beber água">
        <NativeTabs.Trigger.Label>Registros</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bookmark', selected: 'bookmark.fill' }}
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="bookmark" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(ajustes)" accessibilityLabel="Ajustes. Tamanho da letra e distância">
        <NativeTabs.Trigger.Label>Ajustes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="settings" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
