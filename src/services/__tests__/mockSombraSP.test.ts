import { dataISO } from '@/domain';
import { ErroDeServico } from '@/services/erros';
import { controleMock, mockSombraSP } from '@/services/mockSombraSP';

const praçaDaSe = { latitude: -23.5503, longitude: -46.6339 };

beforeEach(() => {
  controleMock.definirAtrasoMs(0);
  controleMock.definirFalhaDeConexao(false);
  controleMock.definirCenario('calor_forte');
});

describe('mock do SombraSP', () => {
  it('devolve o alerta de hoje com a data do dia', async () => {
    const alerta = await mockSombraSP.buscarAlertaDeHoje();
    expect(alerta?.dataReferencia).toBe(dataISO());
    expect(alerta?.nivel).toBe('ALERTA');
  });

  it('em dia sem alerta devolve null (como o 204 da API)', async () => {
    controleMock.definirCenario('sem_alerta');
    expect(await mockSombraSP.buscarAlertaDeHoje()).toBeNull();
  });

  it('ordena os pontos do mais perto ao mais longe, dentro do raio', async () => {
    const pontos = await mockSombraSP.buscarPontosProximos(praçaDaSe, { raioKm: 2 });
    expect(pontos.length).toBeGreaterThan(0);
    expect(pontos[0].nome).toBe('Tenda de hidratação da Praça da Sé');
    const distancias = pontos.map((p) => p.distanciaKm);
    expect([...distancias].sort((a, b) => a - b)).toEqual(distancias);
    expect(distancias.every((d) => d <= 2)).toBe(true);
  });

  it('filtra por água e por acessibilidade', async () => {
    const pontos = await mockSombraSP.buscarPontosProximos(praçaDaSe, {
      raioKm: 5,
      tipo: 'HIDRATACAO',
      acessivel: true,
    });
    expect(pontos.length).toBeGreaterThan(0);
    expect(pontos.every((p) => p.acessivel && p.tipo !== 'SOMBRA')).toBe(true);
  });

  it('lista vazia quando não há ponto no raio', async () => {
    const avenidaPaulista = { latitude: -23.5614, longitude: -46.6559 };
    const pontos = await mockSombraSP.buscarPontosProximos(avenidaPaulista, { raioKm: 1 });
    expect(pontos).toEqual([]);
  });

  it('simula a queda de conexão com erro em linguagem simples', async () => {
    controleMock.definirFalhaDeConexao(true);
    await expect(mockSombraSP.buscarPontosProximos(praçaDaSe, { raioKm: 2 })).rejects.toBeInstanceOf(ErroDeServico);
  });

  it('ponto inexistente vira erro "não encontrado"', async () => {
    await expect(mockSombraSP.detalharPonto(999)).rejects.toMatchObject({ tipo: 'nao_encontrado' });
  });
});
