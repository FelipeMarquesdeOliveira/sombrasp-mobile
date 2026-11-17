import { Pressable } from 'react-native';

import { Icone, type NomeIcone } from './Icone';
import { Texto } from './Texto';

import { useTema } from '@/theme';

type Props = {
  rotulo: string;
  selecionado: boolean;
  aoAlternar: () => void;
  icone: NomeIcone;
  dica?: string;
};

/** Filtro em cápsula, como no app Mapas. Ligado: preenchido na cor de destaque e com "check". */
export function Filtro({ rotulo, selecionado, aoAlternar, icone, dica }: Props) {
  const { cores, espaco, raio, toque, elevacao } = useTema();
  const corTexto = selecionado ? cores.selecao.texto : cores.texto.principal;
  return (
    <Pressable
      onPress={aoAlternar}
      accessibilityRole="checkbox"
      accessibilityLabel={rotulo}
      accessibilityHint={dica}
      accessibilityState={{ checked: selecionado }}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          minHeight: toque.minimo - 4,
          paddingHorizontal: espaco.md - 2,
          borderRadius: raio.pilula,
          backgroundColor: selecionado
            ? pressed
              ? cores.acao.primaria.pressionado
              : cores.selecao.fundo
            : pressed
              ? cores.fundo.preenchimento
              : cores.fundo.cartao,
        },
        !selecionado && elevacao.baixa,
      ]}
    >
      <Icone nome={selecionado ? 'check' : icone} cor={selecionado ? corTexto : cores.tint} tamanho={16} />
      <Texto variante="legenda" cor={corTexto} style={{ fontWeight: '600' }}>
        {rotulo}
      </Texto>
    </Pressable>
  );
}
