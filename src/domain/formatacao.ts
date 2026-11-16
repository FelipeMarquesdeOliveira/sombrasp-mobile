import type { FonteAlerta, NivelAlerta, TipoPonto } from './tipos';

const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** "quarta-feira, 18 de novembro" */
export function dataPorExtenso(data: Date): string {
  return `${DIAS[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

/** "18/11 às 15:42" */
export function dataHoraCurta(data: Date): string {
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)} às ${hora(data)}`;
}

/** "15:42" */
export function hora(data: Date): string {
  return `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

/** Data local no formato da API (AAAA-MM-DD). */
export function dataISO(data: Date = new Date()): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

export function amanhaISO(hoje: Date = new Date()): string {
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  return dataISO(amanha);
}

/** "34 °C" (arredondado, para leitura rápida) ou "34,2 °C" com casas decimais. */
export function formatarTemperatura(celsius: number, casas = 0): string {
  return `${celsius.toFixed(casas).replace('.', ',')} °C`;
}

/** "350 m" ou "1,2 km". */
export function formatarDistancia(km: number): string {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  return `${km.toFixed(1).replace('.', ',')} km`;
}

/** Versão por extenso, para o leitor de tela: "350 metros", "1,2 quilômetro". */
export function distanciaPorExtenso(km: number): string {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} metros`;
  const valor = km.toFixed(1).replace('.', ',');
  return `${valor} ${km < 2 ? 'quilômetro' : 'quilômetros'}`;
}

export function rotuloTipo(tipo: TipoPonto): string {
  switch (tipo) {
    case 'SOMBRA':
      return 'Sombra';
    case 'HIDRATACAO':
      return 'Água';
    case 'SOMBRA_E_HIDRATACAO':
      return 'Sombra e água';
  }
}

export function tituloNivel(nivel: NivelAlerta | null): string {
  if (nivel === 'EMERGENCIA') return 'Calor extremo';
  if (nivel === 'ALERTA') return 'Calor forte';
  return 'Sem alerta de calor';
}

export function rotuloFonte(fonte: FonteAlerta): string {
  switch (fonte) {
    case 'ESTACAO_ESP32':
      return 'Medido agora pela estação de rua do SombraSP';
    case 'MODELO_IA_INMET':
      return 'Previsão feita com dados do INMET (estação Mirante de Santana)';
    case 'MANUAL':
      return 'Aviso da equipe SombraSP';
  }
}

/** Mesmas mensagens padrão do enum NivelAlerta da API. */
export function mensagemPadrao(nivel: NivelAlerta | null): string {
  if (nivel === 'EMERGENCIA') {
    return 'Calor extremo. Evite o sol entre 10h e 16h, beba água sempre e procure um ponto de apoio.';
  }
  if (nivel === 'ALERTA') return 'Calor forte. Procure sombra e beba água a cada 20 minutos.';
  return 'Hoje não há alerta de calor. Mesmo assim, beba água ao longo do dia.';
}
