import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Banco local do SombraSP (expo-sqlite).
 *
 * Por que SQLite no aparelho: quem está na rua no Centro nem sempre tem sinal ou
 * pacote de dados. Os pontos salvos, o histórico de pausas e os ajustes continuam
 * disponíveis sem internet, sem conta, sem chave e sem custo.
 */
export const NOME_BANCO = 'sombrasp.db';

const VERSAO_ATUAL = 1;

/** Cria ou atualiza as tabelas. Roda uma vez quando o app abre (SQLiteProvider.onInit). */
export async function migrarBanco(db: SQLiteDatabase): Promise<void> {
  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_ATUAL) return;

  if (versao === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS ponto_salvo (
        ponto_id   INTEGER PRIMARY KEY NOT NULL,
        nome       TEXT    NOT NULL,
        tipo       TEXT    NOT NULL CHECK (tipo IN ('SOMBRA', 'HIDRATACAO', 'SOMBRA_E_HIDRATACAO')),
        logradouro TEXT    NOT NULL,
        bairro     TEXT    NOT NULL,
        salvo_em   TEXT    NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pausa_hidratacao (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        ponto_id      INTEGER,
        ponto_nome    TEXT    NOT NULL,
        temperatura_c REAL,
        registrada_em TEXT    NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_pausa_registrada_em ON pausa_hidratacao (registrada_em);

      CREATE TABLE IF NOT EXISTS preferencia (
        chave TEXT PRIMARY KEY NOT NULL,
        valor TEXT NOT NULL
      );
    `);
    versao = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${versao}`);
}
