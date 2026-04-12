export const TODO_ASSIGNEES = ['Atanmadi', 'UBT', 'Baran', 'Sahin'] as const
export const TODO_STATUSES = [
  'Baslanmadi',
  'Beklemede',
  'Devam ediyor',
  'Tamamlandi',
] as const

export type TodoAssignee = (typeof TODO_ASSIGNEES)[number]
export type TodoStatus = (typeof TODO_STATUSES)[number]

export interface TodoItemRow {
  id: string
  konu: string
  kim: TodoAssignee
  ne_zaman: string | null
  ayrinti: string | null
  durum: TodoStatus
  created_at: string
  updated_at: string
}

export interface TodoItem {
  id: string
  konu: string
  kim: TodoAssignee
  neZaman: string | null
  ayrinti: string | null
  durum: TodoStatus
  createdAt: string
  updatedAt: string
}

export interface TodoMutationInput {
  konu: string
  kim: TodoAssignee
  neZaman: string | null
  ayrinti: string | null
  durum: TodoStatus
}

export interface TodoFormState {
  konu: string
  kim: TodoAssignee
  neZaman: string
  ayrinti: string
  durum: TodoStatus
}

export function createEmptyTodoFormState(): TodoFormState {
  return {
    konu: '',
    kim: 'Atanmadi',
    neZaman: '',
    ayrinti: '',
    durum: 'Baslanmadi',
  }
}

export function mapTodoRow(row: TodoItemRow): TodoItem {
  return {
    id: row.id,
    konu: row.konu,
    kim: row.kim,
    neZaman: row.ne_zaman,
    ayrinti: row.ayrinti,
    durum: row.durum,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function isTodoAssignee(value: unknown): value is TodoAssignee {
  return typeof value === 'string' && TODO_ASSIGNEES.includes(value as TodoAssignee)
}

export function isTodoStatus(value: unknown): value is TodoStatus {
  return typeof value === 'string' && TODO_STATUSES.includes(value as TodoStatus)
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime())
}

export function normalizeTodoMutationInput(
  payload: unknown,
  options?: { partial?: boolean }
):
  | { ok: true; value: Partial<TodoMutationInput> }
  | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Gecersiz istek govdesi.' }
  }

  const body = payload as Record<string, unknown>
  const partial = options?.partial ?? false
  const nextValue: Partial<TodoMutationInput> = {}

  if ('konu' in body || !partial) {
    const rawKonu = body.konu
    if (typeof rawKonu !== 'string' || rawKonu.trim().length === 0) {
      return { ok: false, error: 'Konu zorunludur.' }
    }

    nextValue.konu = rawKonu.trim()
  }

  if ('kim' in body || !partial) {
    if (!isTodoAssignee(body.kim)) {
      return { ok: false, error: 'Kim alani gecersiz.' }
    }

    nextValue.kim = body.kim
  }

  if ('durum' in body || !partial) {
    if (!isTodoStatus(body.durum)) {
      return { ok: false, error: 'Durum alani gecersiz.' }
    }

    nextValue.durum = body.durum
  }

  if ('neZaman' in body || !partial) {
    const rawDate = body.neZaman
    if (rawDate === '' || rawDate === null || rawDate === undefined) {
      nextValue.neZaman = null
    } else if (typeof rawDate === 'string' && isValidIsoDate(rawDate)) {
      nextValue.neZaman = rawDate
    } else {
      return { ok: false, error: 'Ne zaman alani gecersiz.' }
    }
  }

  if ('ayrinti' in body || !partial) {
    const rawAyrinti = body.ayrinti
    if (rawAyrinti === '' || rawAyrinti === null || rawAyrinti === undefined) {
      nextValue.ayrinti = null
    } else if (typeof rawAyrinti === 'string') {
      const trimmed = rawAyrinti.trim()
      nextValue.ayrinti = trimmed.length > 0 ? trimmed : null
    } else {
      return { ok: false, error: 'Ayrinti alani gecersiz.' }
    }
  }

  if (partial && Object.keys(nextValue).length === 0) {
    return { ok: false, error: 'Guncellenecek alan bulunamadi.' }
  }

  return { ok: true, value: nextValue }
}

export function toTodoFormState(item: TodoItem): TodoFormState {
  return {
    konu: item.konu,
    kim: item.kim,
    neZaman: item.neZaman ?? '',
    ayrinti: item.ayrinti ?? '',
    durum: item.durum,
  }
}

export function formatTodoDate(value: string | null): string {
  if (!value) {
    return '-'
  }

  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
