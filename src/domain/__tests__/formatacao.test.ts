import {
  amanhaISO,
  dataISO,
  dataPorExtenso,
  distanciaPorExtenso,
  formatarDistancia,
  formatarTemperatura,
  rotuloTipo,
} from '@/domain/formatacao';

describe('formatação para a tela e para o leitor de tela', () => {
  it('distância em metros abaixo de 1 km e em km acima', () => {
    expect(formatarDistancia(0.347)).toBe('350 m');
    expect(formatarDistancia(0)).toBe('10 m');
    expect(formatarDistancia(1.234)).toBe('1,2 km');
  });

  it('distância por extenso para o leitor de tela', () => {
    expect(distanciaPorExtenso(0.347)).toBe('350 metros');
    expect(distanciaPorExtenso(1.2)).toBe('1,2 quilômetro');
    expect(distanciaPorExtenso(2.5)).toBe('2,5 quilômetros');
  });

  it('temperatura com vírgula decimal', () => {
    expect(formatarTemperatura(34.2)).toBe('34 °C');
    expect(formatarTemperatura(34.2, 1)).toBe('34,2 °C');
  });

  it('datas em português e no formato da API', () => {
    const data = new Date(2026, 10, 18, 15, 42);
    expect(dataPorExtenso(data)).toBe('quarta-feira, 18 de novembro');
    expect(dataISO(data)).toBe('2026-11-18');
    expect(amanhaISO(new Date(2026, 11, 31))).toBe('2027-01-01');
  });

  it('tipos em linguagem simples', () => {
    expect(rotuloTipo('HIDRATACAO')).toBe('Água');
    expect(rotuloTipo('SOMBRA_E_HIDRATACAO')).toBe('Sombra e água');
  });
});
