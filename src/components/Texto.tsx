import { Text, type TextProps } from 'react-native';

import { useTema, type VarianteTexto } from '@/theme';

type Props = TextProps & {
  variante?: VarianteTexto;
  cor?: string;
  centralizado?: boolean;
};

/** Todo texto do app passa por aqui: tamanho (com a escala escolhida), peso e cor vêm do tema. */
export function Texto({ variante = 'corpo', cor, centralizado, style, ...resto }: Props) {
  const { tipografia, cores } = useTema();
  return (
    <Text
      style={[
        tipografia[variante],
        { color: cor ?? cores.texto.principal },
        centralizado && { textAlign: 'center' },
        style,
      ]}
      {...resto}
    />
  );
}

/** Título anunciado como cabeçalho pelo leitor de tela. */
export function Titulo({
  nivel = 'titulo',
  ...props
}: Omit<Props, 'variante'> & { nivel?: 'tituloGrande' | 'titulo' | 'subtitulo' }) {
  return <Texto variante={nivel} accessibilityRole="header" {...props} />;
}
