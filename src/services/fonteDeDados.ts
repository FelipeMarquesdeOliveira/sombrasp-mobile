import type {
  AlertaCalor,
  Coordenada,
  FiltroPontos,
  PontoDetalhe,
  PontoProximo,
  ResumoAlerta,
} from '@/domain';

/**
 * Contrato que as telas usam. Existem duas implementações:
 * - mockSombraSP: dados simulados, padrão da entrega;
 * - apiSombraSP: API REST do SombraSP (SOA), ligada por EXPO_PUBLIC_FONTE_DADOS=api.
 */
export interface FonteDeDados {
  readonly descricao: string;
  /** Alerta ativo mais grave de hoje, ou null se não houver alerta. */
  buscarAlertaDeHoje(): Promise<AlertaCalor | null>;
  /** Alertas ativos (hoje e previsões), do mais recente ao mais antigo. */
  listarAlertasAtivos(): Promise<ResumoAlerta[]>;
  /** Pontos ativos dentro do raio, do mais perto ao mais longe. */
  buscarPontosProximos(origem: Coordenada, filtro: FiltroPontos): Promise<PontoProximo[]>;
  detalharPonto(id: number): Promise<PontoDetalhe>;
}
