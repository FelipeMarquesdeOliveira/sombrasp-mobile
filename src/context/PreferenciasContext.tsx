import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { gravarPreferencia, lerPreferencias } from '@/database';
import { controleMock, type CenarioCalor } from '@/services';
import { cores } from '@/theme/cores';
import { ESCALAS_LETRA, type TamanhoLetra } from '@/theme/tipografia';

export const RAIOS_KM = [1, 2, 5] as const;
export type RaioKm = (typeof RAIOS_KM)[number];

type ContextoPreferencias = {
  carregado: boolean;
  /** Guardado no SQLite. */
  tamanhoLetra: TamanhoLetra;
  definirTamanhoLetra: (tamanho: TamanhoLetra) => Promise<void>;
  /** Guardado no SQLite. É o parâmetro raioKm de GET /pontos/proximos. */
  raioKm: RaioKm;
  definirRaioKm: (raio: RaioKm) => Promise<void>;
  /** Muda quando a simulação muda; as telas usam para buscar os dados de novo. */
  versaoDados: number;
  cenarioCalor: CenarioCalor;
  definirCenarioCalor: (cenario: CenarioCalor) => void;
  falhaDeConexao: boolean;
  definirFalhaDeConexao: (ativa: boolean) => void;
};

const Contexto = createContext<ContextoPreferencias | null>(null);

const ehTamanhoLetra = (valor?: string): valor is TamanhoLetra => !!valor && valor in ESCALAS_LETRA;
const ehRaio = (valor: number): valor is RaioKm => (RAIOS_KM as readonly number[]).includes(valor);

export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [carregado, setCarregado] = useState(false);
  const [tamanhoLetra, setTamanhoLetra] = useState<TamanhoLetra>('normal');
  const [raioKm, setRaioKm] = useState<RaioKm>(2);
  const [versaoDados, setVersaoDados] = useState(0);
  const [cenarioCalor, setCenarioCalor] = useState<CenarioCalor>(controleMock.cenario());
  const [falhaDeConexao, setFalhaDeConexao] = useState(controleMock.falhaDeConexao());

  useEffect(() => {
    lerPreferencias(db)
      .then((salvas) => {
        if (ehTamanhoLetra(salvas.tamanho_letra)) setTamanhoLetra(salvas.tamanho_letra);
        const raio = Number(salvas.raio_km);
        if (ehRaio(raio)) setRaioKm(raio);
      })
      .catch(() => {
        // Sem as preferências salvas, o app segue com o padrão.
      })
      .finally(() => setCarregado(true));
  }, [db]);

  const definirTamanhoLetra = useCallback(
    async (tamanho: TamanhoLetra) => {
      setTamanhoLetra(tamanho);
      await gravarPreferencia(db, 'tamanho_letra', tamanho);
    },
    [db],
  );

  const definirRaioKm = useCallback(
    async (raio: RaioKm) => {
      setRaioKm(raio);
      await gravarPreferencia(db, 'raio_km', String(raio));
    },
    [db],
  );

  const definirCenarioCalor = useCallback((cenario: CenarioCalor) => {
    controleMock.definirCenario(cenario);
    setCenarioCalor(cenario);
    setVersaoDados((v) => v + 1);
  }, []);

  const definirFalhaDeConexao = useCallback((ativa: boolean) => {
    controleMock.definirFalhaDeConexao(ativa);
    setFalhaDeConexao(ativa);
    setVersaoDados((v) => v + 1);
  }, []);

  const valor = useMemo(
    () => ({
      carregado,
      tamanhoLetra,
      definirTamanhoLetra,
      raioKm,
      definirRaioKm,
      versaoDados,
      cenarioCalor,
      definirCenarioCalor,
      falhaDeConexao,
      definirFalhaDeConexao,
    }),
    [
      carregado,
      tamanhoLetra,
      definirTamanhoLetra,
      raioKm,
      definirRaioKm,
      versaoDados,
      cenarioCalor,
      definirCenarioCalor,
      falhaDeConexao,
      definirFalhaDeConexao,
    ],
  );

  // Espera as preferências para não piscar o texto no tamanho errado.
  if (!carregado) return <View style={{ flex: 1, backgroundColor: cores.fundo.tela }} />;

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePreferencias(): ContextoPreferencias {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('usePreferencias precisa estar dentro de PreferenciasProvider');
  return contexto;
}
