export type LogoKimsin = 'UBT' | 'Baran' | 'Sahin'
export const LOGO_KIMSIN_OPTIONS: readonly LogoKimsin[] = ['UBT', 'Baran', 'Sahin']

export interface LogoFikirRow {
  id: string
  kimsin: LogoKimsin
  logo_link: string
  puan_ubt: number | null
  puan_baran: number | null
  puan_sahin: number | null
  created_at: string
}

export interface LogoFikirItem {
  id: string
  kimsin: LogoKimsin
  logoLink: string
  puanUbt: number | null
  puanBaran: number | null
  puanSahin: number | null
  createdAt: string
}

export interface LogoFikirMutationInput {
  kimsin: LogoKimsin
  logo_link: string
}

export interface LogoFikirScoreInput {
  puan_ubt?: number | null
  puan_baran?: number | null
  puan_sahin?: number | null
}

export function mapLogoFikirRow(row: LogoFikirRow): LogoFikirItem {
  return {
    id: row.id,
    kimsin: row.kimsin,
    logoLink: row.logo_link,
    puanUbt: row.puan_ubt,
    puanBaran: row.puan_baran,
    puanSahin: row.puan_sahin,
    createdAt: row.created_at,
  }
}

export function normalizeLogoFikirInput(
  payload: unknown
): { ok: true; value: LogoFikirMutationInput } | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Gecersiz istek govdesi.' }
  }

  const body = payload as Record<string, unknown>

  if (!LOGO_KIMSIN_OPTIONS.includes(body.kimsin as LogoKimsin)) {
    return { ok: false, error: 'Kimsin alani gecersiz. UBT, Baran veya Sahin olmali.' }
  }

  if (typeof body.logo_link !== 'string' || body.logo_link.trim().length === 0) {
    return { ok: false, error: 'Logo link alani zorunludur.' }
  }

  return {
    ok: true,
    value: {
      kimsin: body.kimsin as LogoKimsin,
      logo_link: body.logo_link.trim(),
    },
  }
}

function validateScore(value: unknown): number | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  const num = Number(value)
  if (!Number.isInteger(num) || num < 1 || num > 10) return undefined
  return num
}

export function normalizeLogoFikirScoreInput(
  payload: unknown
): { ok: true; value: LogoFikirScoreInput } | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Gecersiz istek govdesi.' }
  }

  const body = payload as Record<string, unknown>
  const result: LogoFikirScoreInput = {}

  for (const field of ['puan_ubt', 'puan_baran', 'puan_sahin'] as const) {
    if (field in body) {
      const validated = validateScore(body[field])
      if (validated === undefined) {
        return { ok: false, error: `${field} alani 1-10 arasinda olmali.` }
      }
      result[field] = validated
    }
  }

  if (Object.keys(result).length === 0) {
    return { ok: false, error: 'Guncellenecek puan bulunamadi.' }
  }

  return { ok: true, value: result }
}
