import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Vibração curta de confirmação, como nos apps nativos do iPhone.
 * Reforça a ação para quem não está olhando a tela (e não substitui o aviso visual).
 */
const disponivel = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptico = {
  sucesso: () => {
    if (disponivel) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  aviso: () => {
    if (disponivel) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
  selecao: () => {
    if (disponivel) Haptics.selectionAsync().catch(() => {});
  },
};
