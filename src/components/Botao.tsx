import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icone, type NomeIcone } from './Icone';
import { Texto } from './Texto';

import { useTema } from '@/theme';

type Props = {
  rotulo: string;
  aoPressionar: () => void;
  /** primario: a ação principal da tela (preenchido). secundario: tingido. neutro: cinza. perigo: apagar. */
  variante?: 'primario' | 'secundario' | 'neutro' | 'perigo';
  icone?: NomeIcone;
  /** O que acontece ao tocar (lido pelo leitor de tela). */
  dica?: string;
  rotuloAcessivel?: string;
  desabilitado?: boolean;
  ocupado?: boolean;
  estilo?: StyleProp<ViewStyle>;
};

/** Botão grande no padrão do iOS (preenchido ou tingido, cantos contínuos, sem contorno). */
export function Botao({
  rotulo,
  aoPressionar,
  variante = 'primario',
  icone,
  dica,
  rotuloAcessivel,
  desabilitado,
  ocupado,
  estilo,
}: Props) {
  const { cores, raio, espaco, toque } = useTema();
  const tom = {
    primario: cores.acao.primaria,
    secundario: cores.acao.secundaria,
    neutro: cores.acao.neutra,
    perigo: cores.acao.perigo,
  }[variante];
  const inativo = !!desabilitado || !!ocupado;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel ?? rotulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: inativo, busy: !!ocupado }}
      style={({ pressed }) => [
        {
          minHeight: toque.botao,
          borderRadius: raio.md,
          borderCurve: 'continuous',
          backgroundColor: pressed ? tom.pressionado : tom.fundo,
          paddingHorizontal: espaco.lg,
          paddingVertical: espaco.sm + 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        desabilitado && { opacity: 0.45 },
        estilo,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco.sm }}>
        {ocupado ? (
          <ActivityIndicator color={tom.texto} />
        ) : (
          icone && <Icone nome={icone} cor={tom.texto} tamanho={20} />
        )}
        <Texto variante="botao" cor={tom.texto} style={{ flexShrink: 1, textAlign: 'center' }}>
          {rotulo}
        </Texto>
      </View>
    </Pressable>
  );
}

/** Botão quadrado de ação rápida, como no cartão de um lugar no app Mapas. */
export function AcaoRapida({
  rotulo,
  icone,
  aoPressionar,
  destaque,
  rotuloAcessivel,
  dica,
  ocupado,
}: {
  rotulo: string;
  icone: NomeIcone;
  aoPressionar: () => void;
  destaque?: boolean;
  rotuloAcessivel?: string;
  dica?: string;
  ocupado?: boolean;
}) {
  const { cores, raio, espaco } = useTema();
  const tom = destaque ? cores.acao.primaria : cores.acao.secundaria;
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={ocupado}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel ?? rotulo}
      accessibilityHint={dica}
      accessibilityState={{ busy: !!ocupado }}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 68,
        borderRadius: raio.md,
        borderCurve: 'continuous',
        backgroundColor: pressed ? tom.pressionado : tom.fundo,
        alignItems: 'center',
        justifyContent: 'center',
        gap: espaco.xs,
        paddingVertical: espaco.sm,
        paddingHorizontal: espaco.xs,
      })}
    >
      {ocupado ? <ActivityIndicator color={tom.texto} /> : <Icone nome={icone} cor={tom.texto} tamanho={22} />}
      <Texto variante="nota" cor={tom.texto} centralizado style={{ fontWeight: '600' }} numberOfLines={2}>
        {rotulo}
      </Texto>
    </Pressable>
  );
}
