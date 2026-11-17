import type { SQLiteDatabase } from 'expo-sqlite';

export type ChavePreferencia = 'tamanho_letra' | 'raio_km';

export async function lerPreferencias(db: SQLiteDatabase): Promise<Partial<Record<ChavePreferencia, string>>> {
  const linhas = await db.getAllAsync<{ chave: ChavePreferencia; valor: string }>(
    'SELECT chave, valor FROM preferencia',
  );
  return Object.fromEntries(linhas.map((linha) => [linha.chave, linha.valor]));
}

export async function gravarPreferencia(db: SQLiteDatabase, chave: ChavePreferencia, valor: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO preferencia (chave, valor) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor',
    chave,
    valor,
  );
}
