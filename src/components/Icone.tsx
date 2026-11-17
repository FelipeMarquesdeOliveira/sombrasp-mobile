import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Platform, View, type ColorValue } from 'react-native';

import { cores } from '@/theme/cores';

type NomeIonicons = ComponentProps<typeof Ionicons>['name'];

/**
 * Ícones do app. No iPhone usam os SF Symbols (os mesmos ícones do sistema);
 * no Android, o Ionicons equivalente.
 */
export const ICONES = {
  sol: { sf: 'sun.max.fill', ion: 'sunny' },
  solContorno: { sf: 'sun.max', ion: 'sunny-outline' },
  nuvemSol: { sf: 'cloud.sun.fill', ion: 'partly-sunny' },
  alerta: { sf: 'exclamationmark.triangle.fill', ion: 'warning' },
  ok: { sf: 'checkmark.circle.fill', ion: 'checkmark-circle' },
  check: { sf: 'checkmark', ion: 'checkmark' },
  gota: { sf: 'drop.fill', ion: 'water' },
  guardaSol: { sf: 'umbrella.fill', ion: 'umbrella' },
  folha: { sf: 'leaf.fill', ion: 'leaf' },
  local: { sf: 'location.fill', ion: 'location' },
  rota: { sf: 'arrow.triangle.turn.up.right.diamond.fill', ion: 'navigate' },
  caminhar: { sf: 'figure.walk', ion: 'walk' },
  acessivel: { sf: 'figure.roll', ion: 'accessibility' },
  salvo: { sf: 'bookmark.fill', ion: 'bookmark' },
  salvar: { sf: 'bookmark', ion: 'bookmark-outline' },
  relogio: { sf: 'clock.fill', ion: 'time' },
  calendario: { sf: 'calendar', ion: 'calendar' },
  semConexao: { sf: 'wifi.slash', ion: 'cloud-offline' },
  atualizar: { sf: 'arrow.clockwise', ion: 'refresh' },
  busca: { sf: 'magnifyingglass', ion: 'search' },
  ajustes: { sf: 'gearshape.fill', ion: 'settings' },
  lixeira: { sf: 'trash', ion: 'trash-outline' },
  seta: { sf: 'chevron.right', ion: 'chevron-forward' },
  info: { sf: 'info.circle.fill', ion: 'information-circle' },
  pessoas: { sf: 'person.2.fill', ion: 'people' },
  pessoa: { sf: 'person.fill', ion: 'person' },
  camiseta: { sf: 'tshirt.fill', ion: 'shirt' },
  saude: { sf: 'cross.case.fill', ion: 'medkit' },
  termometro: { sf: 'thermometer.sun.fill', ion: 'thermometer' },
  dados: { sf: 'externaldrive.fill', ion: 'server' },
  privacidade: { sf: 'lock.shield.fill', ion: 'shield-checkmark' },
  paleta: { sf: 'paintpalette.fill', ion: 'color-palette' },
  fechar: { sf: 'xmark.circle.fill', ion: 'close-circle' },
  letra: { sf: 'textformat.size', ion: 'text' },
  mapa: { sf: 'map.fill', ion: 'map' },
  endereco: { sf: 'mappin.and.ellipse', ion: 'location-outline' },
  copo: { sf: 'waterbottle.fill', ion: 'water-outline' },
  teste: { sf: 'hammer.fill', ion: 'construct' },
  lista: { sf: 'list.bullet', ion: 'list' },
} as const satisfies Record<string, { sf: SFSymbol; ion: NomeIonicons }>;

export type NomeIcone = keyof typeof ICONES;

type Props = { nome: NomeIcone; cor: ColorValue; tamanho?: number };

/** Ícone decorativo: o leitor de tela ignora, porque o texto ao lado já diz o que é. */
export function Icone({ nome, cor, tamanho = 22 }: Props) {
  const icone = ICONES[nome];
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}
    >
      {Platform.OS === 'ios' ? (
        <SymbolView name={icone.sf} tintColor={cor} size={tamanho} type="monochrome" resizeMode="scaleAspectFit" />
      ) : (
        <Ionicons name={icone.ion} color={cor} size={tamanho} />
      )}
    </View>
  );
}

/** Ícone branco dentro de um quadrado colorido, como nos Ajustes do iPhone. */
export function IconeQuadrado({ nome, fundo, tamanho = 30 }: { nome: NomeIcone; fundo: string; tamanho?: number }) {
  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: Math.round(tamanho * 0.26),
        borderCurve: 'continuous',
        backgroundColor: fundo,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icone nome={nome} cor={cores.texto.sobreCor} tamanho={Math.round(tamanho * 0.58)} />
    </View>
  );
}
