import { View } from 'react-native';

import { Icone, type NomeIcone } from './Icone';
import { Texto } from './Texto';

import { useTema } from '@/theme';

type Props = { texto: string; fundo: string; cor: string; icone?: NomeIcone };

/** Etiqueta pequena tingida (tipo do ponto, "Acessível"). Texto + ícone, nunca só a cor. */
export function Selo({ texto, fundo, cor, icone }: Props) {
  const { raio } = useTema();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        backgroundColor: fundo,
        borderRadius: raio.pilula,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      {icone && <Icone nome={icone} cor={cor} tamanho={13} />}
      <Texto variante="nota" cor={cor} style={{ fontWeight: '600' }}>
        {texto}
      </Texto>
    </View>
  );
}
