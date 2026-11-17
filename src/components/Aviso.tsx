import { View } from 'react-native';

import { Icone, type NomeIcone } from './Icone';
import { Texto } from './Texto';

import { useTema } from '@/theme';

type TipoAviso = 'info' | 'sucesso' | 'erro';

const ICONE_PADRAO: Record<TipoAviso, NomeIcone> = {
  info: 'info',
  sucesso: 'ok',
  erro: 'alerta',
};

type Props = {
  tipo: TipoAviso;
  mensagem: string;
  icone?: NomeIcone;
  /** Anuncia na hora (confirmações e erros). */
  anunciar?: boolean;
};

/** Faixa de aviso tingida: informação (azul), confirmação (verde) ou erro (vermelho). */
export function Aviso({ tipo, mensagem, icone, anunciar }: Props) {
  const { cores, espaco, raio } = useTema();
  const tom = cores.feedback[tipo];
  return (
    <View
      accessible
      accessibilityLabel={mensagem}
      accessibilityRole={tipo === 'erro' ? 'alert' : undefined}
      accessibilityLiveRegion={anunciar ? 'polite' : 'none'}
      style={{
        flexDirection: 'row',
        gap: espaco.sm + 2,
        alignItems: 'center',
        paddingHorizontal: espaco.md,
        paddingVertical: espaco.sm + 4,
        borderRadius: raio.md,
        borderCurve: 'continuous',
        backgroundColor: tom.fundo,
      }}
    >
      <Icone nome={icone ?? ICONE_PADRAO[tipo]} cor={tom.texto} tamanho={20} />
      <Texto variante="legenda" style={{ flex: 1, fontWeight: anunciar ? '600' : '400' }}>
        {mensagem}
      </Texto>
    </View>
  );
}
