export interface SonGuncellemelerRow {
  id: string
  metin: string
  created_at: string
}

export interface SonGuncellemelerItem {
  id: string
  metin: string
  createdAt: string
}

export interface SonGuncellemelerMutationInput {
  metin: string
}

export function mapSonGuncellemelerRow(row: SonGuncellemelerRow): SonGuncellemelerItem {
  return {
    id: row.id,
    metin: row.metin,
    createdAt: row.created_at,
  }
}

export function normalizeSonGuncellemelerInput(
  payload: unknown
): { ok: true; value: SonGuncellemelerMutationInput } | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Gecersiz istek govdesi.' }
  }

  const body = payload as Record<string, unknown>

  if (typeof body.metin !== 'string' || body.metin.trim().length === 0) {
    return { ok: false, error: 'Metin alani zorunludur.' }
  }

  return { ok: true, value: { metin: body.metin.trim() } }
}
