import { configuracaoDados, ENDPOINTS_SOA } from './config';
import { ErroDeServico } from './erros';
import type { FonteDeDados } from './fonteDeDados';
import { getJson } from './http';

import type { AlertaCalor, PontoDetalhe, PontoProximo, ResumoAlerta } from '@/domain';

/** Formato de página do Spring Data (GET /alertas devolve Page<DadosListagemAlerta>). */
type Pagina<T> = { content: T[] };

/** Adaptador da API REST do SombraSP feita em SOA (Spring Boot, porta 8085). */
export const apiSombraSP: FonteDeDados = {
  descricao: `API SombraSP (SOA) em ${configuracaoDados.apiUrl}`,

  async buscarAlertaDeHoje() {
    const alerta = await getJson<AlertaCalor>(ENDPOINTS_SOA.alertaDeHoje);
    return alerta && { ...alerta, temperaturaMaxima: Number(alerta.temperaturaMaxima) };
  },

  async listarAlertasAtivos() {
    const pagina = await getJson<Pagina<ResumoAlerta>>(ENDPOINTS_SOA.alertasAtivos, {
      ativos: true,
      size: 10,
    });
    return (pagina?.content ?? []).map((alerta) => ({
      ...alerta,
      temperaturaMaxima: Number(alerta.temperaturaMaxima),
    }));
  },

  async buscarPontosProximos(origem, filtro) {
    const pontos = await getJson<PontoProximo[]>(ENDPOINTS_SOA.pontosProximos, {
      latitude: origem.latitude,
      longitude: origem.longitude,
      raioKm: filtro.raioKm,
      tipo: filtro.tipo ?? undefined,
      acessivel: filtro.acessivel ? true : undefined,
    });
    return pontos ?? [];
  },

  async detalharPonto(id) {
    const ponto = await getJson<PontoDetalhe>(ENDPOINTS_SOA.pontoPorId(id));
    if (!ponto) throw new ErroDeServico('nao_encontrado');
    return { ...ponto, latitude: Number(ponto.latitude), longitude: Number(ponto.longitude) };
  },
};
