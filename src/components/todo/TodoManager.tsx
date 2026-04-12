'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import AccordionCard from '../ui/AccordionCard'
import {
  TODO_ASSIGNEES,
  TODO_STATUSES,
  createEmptyTodoFormState,
  formatTodoDate,
  toTodoFormState,
  type TodoFormState,
  type TodoItem,
} from '@/lib/todo-items'

const ASSIGNEE_CARDS = [
  { assignee: 'UBT' as const, color: '#1A6DC2' },
  { assignee: 'Baran' as const, color: '#4CAF50' },
  { assignee: 'Sahin' as const, color: '#F5A500' },
]

const STATUS_COLORS: Record<string, string> = {
  Baslanmadi: '#888888',
  Beklemede: '#F5A500',
  'Devam ediyor': '#1A6DC2',
  Tamamlandi: '#4CAF50',
}

export default function TodoManager() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<TodoFormState>(createEmptyTodoFormState)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingState, setEditingState] = useState<TodoFormState>(createEmptyTodoFormState)

  const isEditing = useMemo(() => editingId !== null, [editingId])

  const todosByAssignee = useMemo(() => {
    const map: Record<string, TodoItem[]> = {}
    for (const { assignee } of ASSIGNEE_CARDS) {
      map[assignee] = todos.filter((t) => t.kim === assignee)
    }
    return map
  }, [todos])

  useEffect(() => {
    void loadTodos()
  }, [])

  async function loadTodos() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/todos')
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Todo listesi yuklenemedi.')
      }

      setTodos(payload.todos ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Todo listesi yuklenemedi.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          konu: formState.konu,
          kim: formState.kim,
          neZaman: formState.neZaman,
          ayrinti: formState.ayrinti,
          durum: formState.durum,
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Todo eklenemedi.')
      }

      setTodos((previousTodos) => [payload.todo, ...previousTodos])
      setFormState(createEmptyTodoFormState())
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Todo eklenemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEdit(todo: TodoItem) {
    setEditingId(todo.id)
    setEditingState(toTodoFormState(todo))
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingState(createEmptyTodoFormState())
  }

  async function handleUpdate(todoId: string) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          konu: editingState.konu,
          kim: editingState.kim,
          neZaman: editingState.neZaman,
          ayrinti: editingState.ayrinti,
          durum: editingState.durum,
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Todo guncellenemedi.')
      }

      setTodos((previousTodos) =>
        previousTodos.map((todo) => (todo.id === todoId ? payload.todo : todo))
      )
      cancelEdit()
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : 'Todo guncellenemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(todoId: string) {
    if (typeof window !== 'undefined' && !window.confirm('Bu todo silinsin mi?')) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Todo silinemedi.')
      }

      setTodos((previousTodos) => previousTodos.filter((todo) => todo.id !== todoId))
      if (editingId === todoId) {
        cancelEdit()
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Todo silinemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6" aria-labelledby="todo-manager-heading">
      <div className="space-y-2">
        <h2 id="todo-manager-heading" className="text-xl font-semibold text-ink-primary">
          Todo Listesi
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Yeni kayit ekle, mevcut kayitlari guncelle veya artik gerekmeyenleri sil.
        </p>
      </div>

      <AccordionCard
        defaultOpenId="new-todo"
        items={[
          {
            id: 'new-todo',
            title: 'Yeni Todo Ekle',
            accentColor: '#1A6DC2',
            children: (
              <form
                onSubmit={handleCreate}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_0.9fr_0.9fr_1fr]"
              >
        <label className="space-y-2">
          <span className="text-sm font-medium text-ink-primary">Konu</span>
          <input
            type="text"
            value={formState.konu}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                konu: event.target.value,
              }))
            }
            placeholder="Yeni todo konusu"
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-ink-primary">Kim</span>
          <select
            value={formState.kim}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                kim: event.target.value as TodoFormState['kim'],
              }))
            }
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors focus:border-xp-blue"
          >
            {TODO_ASSIGNEES.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-ink-primary">Ne zaman</span>
          <input
            type="date"
            value={formState.neZaman}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                neZaman: event.target.value,
              }))
            }
            onKeyDown={(e) => {
              const allowed = ['Tab', 'Enter', 'Escape']
              if (!allowed.includes(e.key) && !e.key.startsWith('Arrow') && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault()
              }
            }}
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors focus:border-xp-blue"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-ink-primary">Durum</span>
          <select
            value={formState.durum}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                durum: event.target.value as TodoFormState['durum'],
              }))
            }
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors focus:border-xp-blue"
          >
            {TODO_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-2 xl:col-span-3">
          <span className="text-sm font-medium text-ink-primary">Ayrinti</span>
          <textarea
            value={formState.ayrinti}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                ayrinti: event.target.value,
              }))
            }
            placeholder="Goreve dair notlar"
            rows={4}
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-xp-blue px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} aria-hidden="true" />
            {isSubmitting ? 'Kaydediliyor...' : 'Yeni ekle'}
          </button>
        </div>
      </form>
            ),
          },
        ]}
      />

      {error && (
        <div className="rounded-md border border-xp-red/40 bg-xp-red/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-lg border border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Todo listesi yukleniyor...
          </div>
        ) : todos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Henuz todo yok. Ilk kaydi ustteki formdan ekleyebilirsin.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-canvas-border bg-canvas-surface md:block">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-canvas-elevated text-left text-xs uppercase tracking-[0.16em] text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Konu</th>
                    <th className="px-4 py-3 font-semibold">Kim</th>
                    <th className="px-4 py-3 font-semibold">Ne zaman</th>
                    <th className="px-4 py-3 font-semibold">Ayrinti</th>
                    <th className="px-4 py-3 font-semibold">Durum</th>
                    <th className="px-4 py-3 font-semibold">Islemler</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => {
                    const rowIsEditing = editingId === todo.id

                    return (
                      <tr key={todo.id} className="border-t border-canvas-border align-top">
                        <td className="px-4 py-3 text-ink-primary">
                          {rowIsEditing ? (
                            <input
                              type="text"
                              value={editingState.konu}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  konu: event.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            todo.konu
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <select
                              value={editingState.kim}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  kim: event.target.value as TodoFormState['kim'],
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            >
                              {TODO_ASSIGNEES.map((assignee) => (
                                <option key={assignee} value={assignee}>
                                  {assignee}
                                </option>
                              ))}
                            </select>
                          ) : (
                            todo.kim
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <input
                              type="date"
                              value={editingState.neZaman}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  neZaman: event.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            formatTodoDate(todo.neZaman)
                          )}
                        </td>
                        <td className="max-w-sm px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <textarea
                              value={editingState.ayrinti}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  ayrinti: event.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            todo.ayrinti ?? '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <select
                              value={editingState.durum}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  durum: event.target.value as TodoFormState['durum'],
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            >
                              {TODO_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          ) : (
                            todo.durum
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {rowIsEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => void handleUpdate(todo.id)}
                                  disabled={isSubmitting}
                                  className="inline-flex items-center gap-1 rounded-md border border-xp-green/40 bg-xp-green/10 px-3 py-2 text-xs font-semibold text-xp-green transition-opacity hover:opacity-85 disabled:opacity-60"
                                >
                                  <Save size={14} aria-hidden="true" />
                                  Kaydet
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  disabled={isSubmitting}
                                  className="inline-flex items-center gap-1 rounded-md border border-canvas-border px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-60"
                                >
                                  <X size={14} aria-hidden="true" />
                                  Iptal
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEdit(todo)}
                                disabled={isSubmitting || isEditing}
                                className="inline-flex items-center gap-1 rounded-md border border-canvas-border px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-60"
                              >
                                <Pencil size={14} aria-hidden="true" />
                                Duzenle
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => void handleDelete(todo.id)}
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-1 rounded-md border border-xp-red/40 bg-xp-red/10 px-3 py-2 text-xs font-semibold text-red-200 transition-opacity hover:opacity-85 disabled:opacity-60"
                            >
                              <Trash2 size={14} aria-hidden="true" />
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {todos.map((todo) => {
                const rowIsEditing = editingId === todo.id

                return (
                  <div
                    key={todo.id}
                    className="space-y-3 rounded-lg border border-canvas-border bg-canvas-surface p-4"
                  >
                    {rowIsEditing ? (
                      <>
                        <input
                          type="text"
                          value={editingState.konu}
                          onChange={(event) =>
                            setEditingState((previousState) => ({
                              ...previousState,
                              konu: event.target.value,
                            }))
                          }
                          className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <select
                            value={editingState.kim}
                            onChange={(event) =>
                              setEditingState((previousState) => ({
                                ...previousState,
                                kim: event.target.value as TodoFormState['kim'],
                              }))
                            }
                            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                          >
                            {TODO_ASSIGNEES.map((assignee) => (
                              <option key={assignee} value={assignee}>
                                {assignee}
                              </option>
                            ))}
                          </select>
                          <input
                            type="date"
                            value={editingState.neZaman}
                            onChange={(event) =>
                              setEditingState((previousState) => ({
                                ...previousState,
                                neZaman: event.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                          />
                          <select
                            value={editingState.durum}
                            onChange={(event) =>
                              setEditingState((previousState) => ({
                                ...previousState,
                                durum: event.target.value as TodoFormState['durum'],
                              }))
                            }
                            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue sm:col-span-2"
                          >
                            {TODO_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          value={editingState.ayrinti}
                          onChange={(event) =>
                            setEditingState((previousState) => ({
                              ...previousState,
                              ayrinti: event.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                        />
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-ink-primary">
                            {todo.konu}
                          </h3>
                          <p className="text-sm text-ink-muted">
                            {todo.ayrinti ?? 'Ayrinti yok'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <InfoPair label="Kim" value={todo.kim} />
                          <InfoPair label="Durum" value={todo.durum} />
                          <InfoPair label="Ne zaman" value={formatTodoDate(todo.neZaman)} />
                        </div>
                      </>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {rowIsEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleUpdate(todo.id)}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1 rounded-md border border-xp-green/40 bg-xp-green/10 px-3 py-2 text-xs font-semibold text-xp-green transition-opacity hover:opacity-85 disabled:opacity-60"
                          >
                            <Save size={14} aria-hidden="true" />
                            Kaydet
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1 rounded-md border border-canvas-border px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-60"
                          >
                            <X size={14} aria-hidden="true" />
                            Iptal
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(todo)}
                          disabled={isSubmitting || isEditing}
                          className="inline-flex items-center gap-1 rounded-md border border-canvas-border px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-60"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Duzenle
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void handleDelete(todo.id)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 rounded-md border border-xp-red/40 bg-xp-red/10 px-3 py-2 text-xs font-semibold text-red-200 transition-opacity hover:opacity-85 disabled:opacity-60"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        Sil
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Kişiye Göre Görevler */}
      {!isLoading && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Kişiye Göre Görevler
          </p>
          <AccordionCard
            items={ASSIGNEE_CARDS.map(({ assignee, color }) => {
              const assigneeTodos = todosByAssignee[assignee] ?? []
              return {
                id: `assignee-${assignee}`,
                title: assignee,
                badge: `${assigneeTodos.length} görev`,
                accentColor: color,
                children:
                  assigneeTodos.length === 0 ? (
                    <p className="text-sm text-ink-muted italic">Henüz görev atanmadı.</p>
                  ) : (
                    <ul className="divide-y divide-canvas-border">
                      {assigneeTodos.map((todo) => (
                        <li
                          key={todo.id}
                          className="flex items-center justify-between gap-3 py-2 text-sm"
                        >
                          <span className="text-ink-primary font-medium">{todo.konu}</span>
                          <div className="flex shrink-0 items-center gap-2">
                            {todo.neZaman && (
                              <span className="text-xs text-ink-muted">
                                {formatTodoDate(todo.neZaman)}
                              </span>
                            )}
                            <span
                              className="rounded px-1.5 py-0.5 text-[11px] font-semibold"
                              style={{
                                color: STATUS_COLORS[todo.durum] ?? '#888888',
                                background: `${STATUS_COLORS[todo.durum] ?? '#888888'}22`,
                              }}
                            >
                              {todo.durum}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ),
              }
            })}
          />
        </div>
      )}
    </section>
  )
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </p>
      <p className="text-sm text-ink-primary">{value}</p>
    </div>
  )
}
