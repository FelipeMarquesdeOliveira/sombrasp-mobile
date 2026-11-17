import type { SQLiteDatabase } from 'expo-sqlite';

import type { PausaHidratacao } from '@/domain';

type LinhaPausa = {
  id: number;
  ponto_id: number | null;
  ponto_nome: string;
  temperatura_c: number | null;
  registrada_em: string;
};

const paraPausa = (linha: LinhaPausa): PausaHidratacao => ({
  id: linha.id,
  pontoId: linha.ponto_id,
  pontoNome: linha.ponto_nome,
  temperaturaC: linha.temperatura_c,
  registradaEm: linha.registrada_em,
});

export async function registrarPausa(
  db: SQLiteDatabase,
  dados: { pontoId: number | null; pontoNome: string; temperaturaC: number | null },
): Promise<PausaHidratacao> {
  const registradaEm = new Date().toISOString();
  const resultado = await db.runAsync(
    'INSERT INTO pausa_hidratacao (ponto_id, ponto_nome, temperatura_c, registrada_em) VALUES (?, ?, ?, ?)',
    dados.pontoId,
    dados.pontoNome,
    dados.temperaturaC,
    registradaEm,
  );
  return { id: resultado.lastInsertRowId, ...dados, registradaEm };
}

export async function listarPausas(db: SQLiteDatabase, limite = 30): Promise<PausaHidratacao[]> {
  const linhas = await db.getAllAsync<LinhaPausa>(
    `SELECT id, ponto_id, ponto_nome, temperatura_c, registrada_em
       FROM pausa_hidratacao
      ORDER BY registrada_em DESC
      LIMIT ?`,
    limite,
  );
  return linhas.map(paraPausa);
}

/** Pausas registradas no dia (pelo horário do aparelho). */
export async function contarPausasDoDia(db: SQLiteDatabase, dia: Date = new Date()): Promise<number> {
  const inicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
  const fim = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate() + 1);
  const linha = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM pausa_hidratacao WHERE registrada_em >= ? AND registrada_em < ?',
    inicio.toISOString(),
    fim.toISOString(),
  );
  return linha?.total ?? 0;
}

export async function apagarPausas(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM pausa_hidratacao');
}
