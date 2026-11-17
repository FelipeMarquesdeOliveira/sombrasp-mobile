import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

import { distanciaKm, type Coordenada } from '@/domain';

/** Ponto de partida quando não há localização: centro da Praça da Sé (marco zero de SP). */
export const PONTO_DE_REFERENCIA = {
  nome: 'Praça da Sé',
  coordenada: { latitude: -23.5503, longitude: -46.6339 } as Coordenada,
};

/** Acima disso a pessoa está fora da área atendida (Centro de SP) e usamos o ponto de referência. */
const DISTANCIA_MAXIMA_DO_CENTRO_KM = 15;

export type OrigemLocalizacao = 'gps' | 'sem_permissao' | 'fora_da_area' | 'indisponivel';

type Estado = { coordenada: Coordenada | null; origem: OrigemLocalizacao | null };

/** Só atualiza a lista quando a pessoa anda pelo menos isso (evita buscar a cada passo). */
const DISTANCIA_MINIMA_METROS = 50;

/**
 * Localização para calcular distâncias. Fica só na memória do aparelho:
 * não é salva no banco nem enviada a ninguém (com a API, vai só na busca de pontos).
 * Enquanto a tela está aberta, acompanha a pessoa andando (como no app Mapas).
 */
export function useLocalizacao() {
  const [estado, setEstado] = useState<Estado>({ coordenada: null, origem: null });
  const assinatura = useRef<Location.LocationSubscription | null>(null);

  const aplicar = useCallback((latitude: number, longitude: number) => {
    const coordenada = { latitude, longitude };
    if (distanciaKm(coordenada, PONTO_DE_REFERENCIA.coordenada) > DISTANCIA_MAXIMA_DO_CENTRO_KM) {
      setEstado({ coordenada: PONTO_DE_REFERENCIA.coordenada, origem: 'fora_da_area' });
      return;
    }
    setEstado({ coordenada, origem: 'gps' });
  }, []);

  const usarReferencia = (origem: OrigemLocalizacao) =>
    setEstado({ coordenada: PONTO_DE_REFERENCIA.coordenada, origem });

  /** Na abertura aceita a última posição conhecida (mais rápido); ao puxar para atualizar, pede a posição atual. */
  const atualizar = useCallback(async (modo: 'rapido' | 'atual' = 'atual') => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) return usarReferencia('sem_permissao');

      const ultimaConhecida =
        modo === 'rapido' ? await Location.getLastKnownPositionAsync({ maxAge: 60_000 }) : null;
      const posicao =
        ultimaConhecida ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
      aplicar(posicao.coords.latitude, posicao.coords.longitude);

      if (!assinatura.current) {
        assinatura.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: DISTANCIA_MINIMA_METROS },
          (nova) => aplicar(nova.coords.latitude, nova.coords.longitude),
        );
      }
    } catch {
      usarReferencia('indisponivel');
    }
  }, [aplicar]);

  useEffect(() => {
    atualizar('rapido');
    return () => {
      assinatura.current?.remove();
      assinatura.current = null;
    };
  }, [atualizar]);

  return { ...estado, atualizar };
}
