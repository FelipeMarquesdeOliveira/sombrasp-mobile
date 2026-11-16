import type { Coordenada, NivelAlerta, TipoPonto } from './tipos';

/** Limiar da Ficha: máxima >= 31 °C é dia de calor forte (modelo de IA&ML com INMET A701). */
export const LIMIAR_ALERTA_C = 31;
export const LIMIAR_EMERGENCIA_C = 35;

/** A API aceita raio de até 10 km. */
export const RAIO_MAXIMO_KM = 10;

/** Mesma regra de NivelAlerta.paraTemperatura na API: abaixo de 31 °C não há alerta. */
export function nivelParaTemperatura(temperaturaMaxima: number): NivelAlerta | null {
  if (!Number.isFinite(temperaturaMaxima) || temperaturaMaxima < LIMIAR_ALERTA_C) return null;
  return temperaturaMaxima >= LIMIAR_EMERGENCIA_C ? 'EMERGENCIA' : 'ALERTA';
}

/** Mesma regra de TipoPonto.atende na API: SOMBRA_E_HIDRATACAO atende quem procura qualquer um dos dois. */
export function atende(tipoDoPonto: TipoPonto, procurado?: TipoPonto | null): boolean {
  return !procurado || tipoDoPonto === procurado || tipoDoPonto === 'SOMBRA_E_HIDRATACAO';
}

/** Converte os filtros da tela (Sombra / Água) no parâmetro `tipo` da API. */
export function tipoProcurado(querSombra: boolean, querAgua: boolean): TipoPonto | null {
  if (querSombra && querAgua) return 'SOMBRA_E_HIDRATACAO';
  if (querSombra) return 'SOMBRA';
  if (querAgua) return 'HIDRATACAO';
  return null;
}

const RAIO_TERRA_KM = 6371;

function radianos(graus: number) {
  return (graus * Math.PI) / 180;
}

/** Distância em km pela fórmula de Haversine (a mesma da CalculadoraDistancia da API). */
export function distanciaKm(a: Coordenada, b: Coordenada): number {
  const dLat = radianos(b.latitude - a.latitude);
  const dLon = radianos(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radianos(a.latitude)) * Math.cos(radianos(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return RAIO_TERRA_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Arredonda para metros, como a API faz no DadosPontoProximo. */
export function arredondarKm(km: number): number {
  return Math.round(km * 1000) / 1000;
}

/** Tempo a pé, em minutos, num passo tranquilo (4 km/h), nunca menos de 1. */
export function minutosAPe(km: number, velocidadeKmH = 4): number {
  return Math.max(1, Math.round((km / velocidadeKmH) * 60));
}
