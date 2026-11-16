import type { AlertaCalor } from '@/domain';
import { amanhaISO, dataISO } from '@/domain';

/** Cenários da demonstração, escolhidos em Ajustes enquanto o app usa o mock. */
export type CenarioCalor = 'sem_alerta' | 'calor_forte' | 'calor_extremo';

/**
 * Alertas simulados, sempre com a data do dia em que o app é aberto.
 * Valores e mensagens seguem a carga inicial da API de SOA (34,2 °C hoje pela estação ESP32
 * e 33,5 °C de previsão para amanhã pelo modelo de IA&ML com dados do INMET).
 */
export function alertasDoCenario(cenario: CenarioCalor, agora: Date = new Date()): AlertaCalor[] {
  const hoje = dataISO(agora);
  const amanha = amanhaISO(agora);
  const emitidoHoje = `${hoje}T10:00:00`;
  const emitidoVespera = `${hoje}T06:00:00`;

  if (cenario === 'sem_alerta') return [];

  if (cenario === 'calor_extremo') {
    return [
      {
        id: 3,
        dataReferencia: amanha,
        temperaturaMaxima: 36.4,
        nivel: 'EMERGENCIA',
        fonte: 'MODELO_IA_INMET',
        mensagem: 'Amanhã o calor continua extremo. Planeje pausas na sombra e leve água.',
        ativo: true,
        emitidoEm: emitidoVespera,
        encerradoEm: null,
      },
      {
        id: 4,
        dataReferencia: hoje,
        temperaturaMaxima: 37.1,
        nivel: 'EMERGENCIA',
        fonte: 'ESTACAO_ESP32',
        mensagem:
          'Calor extremo agora no Centro. Evite o sol entre 10h e 16h, beba água sempre e procure um ponto de apoio.',
        ativo: true,
        emitidoEm: emitidoHoje,
        encerradoEm: null,
      },
    ];
  }

  return [
    {
      id: 2,
      dataReferencia: amanha,
      temperaturaMaxima: 33.5,
      nivel: 'ALERTA',
      fonte: 'MODELO_IA_INMET',
      mensagem: 'Amanhã a máxima deve passar de 31 °C. Planeje pausas e leve água.',
      ativo: true,
      emitidoEm: emitidoVespera,
      encerradoEm: null,
    },
    {
      id: 1,
      dataReferencia: hoje,
      temperaturaMaxima: 34.2,
      nivel: 'ALERTA',
      fonte: 'ESTACAO_ESP32',
      mensagem: 'Calor forte agora no Centro. Procure sombra e beba água a cada 20 minutos.',
      ativo: true,
      emitidoEm: emitidoHoje,
      encerradoEm: null,
    },
  ];
}
