import type { SQLiteDatabase } from 'expo-sqlite';

import type { PontoSalvo, TipoPonto } from '@/domain';

type LinhaPontoSalvo = {
  ponto_id: number;
  nome: string;
  tipo: TipoPonto;
  logradouro: string;
  bairro: string;
  salvo_em: string;
};

const paraPontoSalvo = (linha: LinhaPontoSalvo): PontoSalvo => ({
  pontoId: linha.ponto_id,
  nome: linha.nome,
  tipo: linha.tipo,
  logradouro: linha.logradouro,
  bairro: linha.bairro,
  salvoEm: linha.salvo_em,
});

export async function listarPontosSalvos(db: SQLiteDatabase): Promise<PontoSalvo[]> {
  const linhas = await db.getAllAsync<LinhaPontoSalvo>(
    'SELECT ponto_id, nome, tipo, logradouro, bairro, salvo_em FROM ponto_salvo ORDER BY salvo_em DESC',
  );
  return linhas.map(paraPontoSalvo);
}

export async function pontoEstaSalvo(db: SQLiteDatabase, pontoId: number): Promise<boolean> {
  const linha = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM ponto_salvo WHERE ponto_id = ?',
    pontoId,
  );
  return (linha?.total ?? 0) > 0;
}

export async function salvarPonto(db: SQLiteDatabase, ponto: Omit<PontoSalvo, 'salvoEm'>): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO ponto_salvo (ponto_id, nome, tipo, logradouro, bairro, salvo_em)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ponto.pontoId,
    ponto.nome,
    ponto.tipo,
    ponto.logradouro,
    ponto.bairro,
    new Date().toISOString(),
  );
}

export async function removerPontoSalvo(db: SQLiteDatabase, pontoId: number): Promise<void> {
  await db.runAsync('DELETE FROM ponto_salvo WHERE ponto_id = ?', pontoId);
}
