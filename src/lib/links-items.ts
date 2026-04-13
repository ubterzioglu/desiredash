export const LINK_ADDED_BY = ['Şahin', 'UBT', 'Baran', 'Diğer'] as const

export type LinkAddedBy = (typeof LINK_ADDED_BY)[number]

export interface LinkRow {
  id: string
  kim_ekledi: LinkAddedBy
  kim_ekledi_custom: string | null
  aciklama: string
  link: string
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  kimEkledi: LinkAddedBy
  kimEklediCustom: string | null
  aciklama: string
  link: string
  createdAt: string
  updatedAt: string
}

export interface LinkMutationInput {
  kimEkledi: LinkAddedBy
  kimEklediCustom: string | null
  aciklama: string
  link: string
}

export interface LinkFormState {
  kimEkledi: LinkAddedBy
  kimEklediCustom: string
  aciklama: string
  link: string
}

export function createEmptyLinkFormState(): LinkFormState {
  return {
    kimEkledi: 'Şahin',
    kimEklediCustom: '',
    aciklama: '',
    link: '',
  }
}

export function mapLinkRow(row: LinkRow): Link {
  return {
    id: row.id,
    kimEkledi: row.kim_ekledi,
    kimEklediCustom: row.kim_ekledi_custom,
    aciklama: row.aciklama,
    link: row.link,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function isLinkAddedBy(value: unknown): value is LinkAddedBy {
  return (
    typeof value === 'string' && LINK_ADDED_BY.includes(value as LinkAddedBy)
  )
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsedUrl = new URL(value)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeLinkMutationInput(
  payload: unknown,
  options?: { partial?: boolean }
): { ok: true; value: Partial<LinkMutationInput> } | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Gecersiz istek govdesi.' }
  }

  const body = payload as Record<string, unknown>
  const partial = options?.partial ?? false
  const nextValue: Partial<LinkMutationInput> = {}

  if ('kimEkledi' in body || !partial) {
    if (!isLinkAddedBy(body.kimEkledi)) {
      return { ok: false, error: 'Kim ekledi alani gecersiz.' }
    }

    nextValue.kimEkledi = body.kimEkledi
  }

  if ('kimEklediCustom' in body || !partial) {
    const rawKimEklediCustom = body.kimEklediCustom
    if (rawKimEklediCustom === '' || rawKimEklediCustom === null || rawKimEklediCustom === undefined) {
      nextValue.kimEklediCustom = null
    } else if (typeof rawKimEklediCustom === 'string') {
      const trimmed = rawKimEklediCustom.trim()
      nextValue.kimEklediCustom = trimmed.length > 0 ? trimmed : null
    } else {
      return { ok: false, error: 'Kim ekledi custom alani gecersiz.' }
    }
  }

  if ('aciklama' in body || !partial) {
    const rawAciklama = body.aciklama
    if (typeof rawAciklama !== 'string' || rawAciklama.trim().length === 0) {
      return { ok: false, error: 'Aciklama zorunludur.' }
    }

    nextValue.aciklama = rawAciklama.trim()
  }

  if ('link' in body || !partial) {
    const rawLink = body.link
    if (typeof rawLink !== 'string' || rawLink.trim().length === 0) {
      return { ok: false, error: 'Link zorunludur.' }
    }

    const normalizedLink = rawLink.trim()
    if (!isValidHttpUrl(normalizedLink)) {
      return { ok: false, error: 'Link gecerli bir URL olmali.' }
    }

    nextValue.link = normalizedLink
  }

  if (partial && Object.keys(nextValue).length === 0) {
    return { ok: false, error: 'Guncellenecek alan bulunamadi.' }
  }

  return { ok: true, value: nextValue }
}

export function toLinkFormState(item: Link): LinkFormState {
  return {
    kimEkledi: item.kimEkledi,
    kimEklediCustom: item.kimEklediCustom ?? '',
    aciklama: item.aciklama,
    link: item.link,
  }
}
