export interface ContactItemRow {
  id: string
  contact: string
  telefon: string | null
  websitesi: string | null
  tur: string | null
  sorumlu: string | null
  durum: string | null
  durum_dm: string | null
  durum_customer: string | null
  yorumlar: string | null
  created_at: string
  updated_at: string
}

export interface ContactItem {
  id: string
  contact: string
  telefon: string | null
  websitesi: string | null
  tur: string | null
  sorumlu: string | null
  durum: string | null
  durum_dm: string | null
  durum_customer: string | null
  yorumlar: string | null
  createdAt: string
  updatedAt: string
}

export interface ContactMutationInput {
  contact: string
  telefon: string | null
  websitesi: string | null
  tur: string | null
  sorumlu: string | null
  durum_dm: string | null
  durum_customer: string | null
  yorumlar: string | null
}

export interface ContactFormState {
  contact: string
  telefon: string
  websitesi: string
  tur: string
  sorumlu: string
  durum_dm: string
  durum_customer: string
  yorumlar: string
}

export function createEmptyContactFormState(): ContactFormState {
  return {
    contact: '',
    telefon: '',
    websitesi: '',
    tur: '',
    sorumlu: '',
    durum_dm: '',
    durum_customer: '',
    yorumlar: '',
  }
}

export function mapContactRow(row: ContactItemRow): ContactItem {
  return {
    id: row.id,
    contact: row.contact,
    telefon: row.telefon,
    websitesi: row.websitesi,
    tur: row.tur,
    sorumlu: row.sorumlu,
    durum: row.durum,
    durum_dm: row.durum_dm,
    durum_customer: row.durum_customer,
    yorumlar: row.yorumlar,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function normalizeNullableString(value: unknown, fieldLabel: string): string | null | symbol {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  if (typeof value !== 'string') {
    return Symbol.for(fieldLabel)
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function normalizeContactMutationInput(
  payload: unknown,
  options?: { partial?: boolean }
):
  | { ok: true; value: Partial<ContactMutationInput> }
  | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Gecersiz istek govdesi.' }
  }

  const body = payload as Record<string, unknown>
  const partial = options?.partial ?? false
  const nextValue: Partial<ContactMutationInput> = {}

  if ('contact' in body || !partial) {
    const rawContact = body.contact
    if (typeof rawContact !== 'string' || rawContact.trim().length === 0) {
      return { ok: false, error: 'Contact alani zorunludur.' }
    }

    nextValue.contact = rawContact.trim()
  }

  const optionalFields: Array<keyof Omit<ContactMutationInput, 'contact'>> = [
    'telefon',
    'websitesi',
    'tur',
    'sorumlu',
    'durum_dm',
    'durum_customer',
    'yorumlar',
  ]

  for (const field of optionalFields) {
    if (!(field in body) && partial) {
      continue
    }

    const normalized = normalizeNullableString(body[field], field)
    if (typeof normalized === 'symbol') {
      return { ok: false, error: `${field} alani gecersiz.` }
    }

    nextValue[field] = normalized
  }

  if (partial && Object.keys(nextValue).length === 0) {
    return { ok: false, error: 'Guncellenecek alan bulunamadi.' }
  }

  return { ok: true, value: nextValue }
}

export function toContactFormState(item: ContactItem): ContactFormState {
  return {
    contact: item.contact,
    telefon: item.telefon ?? '',
    websitesi: item.websitesi ?? '',
    tur: item.tur ?? '',
    sorumlu: item.sorumlu ?? '',
    durum_dm: item.durum_dm ?? '',
    durum_customer: item.durum_customer ?? '',
    yorumlar: item.yorumlar ?? '',
  }
}
