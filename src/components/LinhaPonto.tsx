import { Pressable, View } from 'react-native';

import { Icone, IconeQuadrado, type NomeIcone } from './Icone';
import { Texto } from './Texto';

import {
  distanciaPorExtenso,
  formatarDistancia,
  minutosAPe,
  rotuloTipo,
  type PontoProximo,
  type TipoPonto,
} from '@/domain';
import { useTema } from '@/theme';

export const ICONE_TIPO: Record<TipoPonto, NomeIcone> = {
  SOMBRA: 'folha',
  HIDRATACAO: 'gota',
  SOMBRA_E_HIDRATACAO: 'guardaSol',
};

/** Linha de ponto de apoio dentro de um Grupo: ícone do tipo, nome, rua e distância a pé. */
export function LinhaPonto({ ponto, aoPressionar }: { ponto: PontoProximo; aoPressionar: () => void }) {
  const { cores, espaco, toque } = useTema();
  const minutos = minutosAPe(ponto.distanciaKm);

  const rotuloAcessivel = [
    ponto.nome,
    rotuloTipo(ponto.tipo),
    `A ${distanciaPorExtenso(ponto.distanciaKm)}, cerca de ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} a pé`,
    ponto.acessivel ? 'Acessível para cadeira de rodas' : 'Sem acessibilidade para cadeira de rodas',
    ponto.horarioFuncionamento ? `Horário: ${ponto.horarioFuncionamento}` : null,
  ]
    .filter(Boolean)
    .join('. ');

  const detalhes = [rotuloTipo(ponto.tipo), ponto.logradouro, ponto.acessivel ? 'Acessível' : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      accessibilityHint="Abre os detalhes, o caminho e a opção de salvar"
    >
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: espaco.md - 4,
            minHeight: toque.linha + 12,
            paddingHorizontal: espaco.md,
            paddingVertical: espaco.sm + 2,
            backgroundColor: pressed ? cores.fundo.pressionado : 'transparent',
          }}
        >
          <IconeQuadrado nome={ICONE_TIPO[ponto.tipo]} fundo={cores.tipo[ponto.tipo].fundo} tamanho={36} />
          <View style={{ flex: 1, gap: 2 }}>
            <Texto variante="corpoNegrito" numberOfLines={2}>
              {ponto.nome}
            </Texto>
            <Texto variante="legenda" cor={cores.texto.secundario} numberOfLines={2}>
              {detalhes}
            </Texto>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Texto variante="corpoNegrito">{formatarDistancia(ponto.distanciaKm)}</Texto>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Icone nome="caminhar" cor={cores.texto.secundario} tamanho={13} />
              <Texto variante="nota" cor={cores.texto.secundario}>
                {minutos} min
              </Texto>
            </View>
          </View>
          <Icone nome="seta" cor={cores.separador} tamanho={14} />
        </View>
      )}
    </Pressable>
  );
}
