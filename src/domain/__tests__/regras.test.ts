import {
  atende,
  distanciaKm,
  minutosAPe,
  nivelParaTemperatura,
  tipoProcurado,
} from '@/domain/regras';

describe('nivelParaTemperatura (mesma regra da API de SOA)', () => {
  it('não gera alerta abaixo de 31 °C', () => {
    expect(nivelParaTemperatura(30.9)).toBeNull();
  });

  it('gera ALERTA a partir de 31 °C', () => {
    expect(nivelParaTemperatura(31)).toBe('ALERTA');
    expect(nivelParaTemperatura(34.9)).toBe('ALERTA');
  });

  it('gera EMERGENCIA a partir de 35 °C', () => {
    expect(nivelParaTemperatura(35)).toBe('EMERGENCIA');
  });
});

describe('atende / tipoProcurado', () => {
  it('sem filtro, qualquer ponto atende', () => {
    expect(atende('SOMBRA', null)).toBe(true);
  });

  it('ponto de sombra e água atende quem procura só um dos dois', () => {
    expect(atende('SOMBRA_E_HIDRATACAO', 'SOMBRA')).toBe(true);
    expect(atende('SOMBRA_E_HIDRATACAO', 'HIDRATACAO')).toBe(true);
  });

  it('ponto só de sombra não atende quem procura água', () => {
    expect(atende('SOMBRA', 'HIDRATACAO')).toBe(false);
  });

  it('marcar Sombra e Água pede pontos que têm os dois', () => {
    expect(tipoProcurado(true, true)).toBe('SOMBRA_E_HIDRATACAO');
    expect(tipoProcurado(true, false)).toBe('SOMBRA');
    expect(tipoProcurado(false, true)).toBe('HIDRATACAO');
    expect(tipoProcurado(false, false)).toBeNull();
  });
});

describe('distanciaKm (Haversine)', () => {
  const se = { latitude: -23.5503, longitude: -46.6339 };
  const republica = { latitude: -23.5435, longitude: -46.6426 };

  it('é zero para o mesmo ponto', () => {
    expect(distanciaKm(se, se)).toBeCloseTo(0, 6);
  });

  it('Praça da Sé até Praça da República dá pouco mais de 1 km', () => {
    const km = distanciaKm(se, republica);
    expect(km).toBeGreaterThan(1.1);
    expect(km).toBeLessThan(1.3);
  });

  it('tempo a pé nunca é menor que 1 minuto', () => {
    expect(minutosAPe(0)).toBe(1);
    expect(minutosAPe(1)).toBe(15);
  });
});
