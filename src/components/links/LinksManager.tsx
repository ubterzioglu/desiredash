'use client'

import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import {
  LINK_ADDED_BY,
  createEmptyLinkFormState,
  toLinkFormState,
  type Link,
  type LinkFormState,
} from '@/lib/links-items'

export default function LinksManager() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<LinkFormState>(
    createEmptyLinkFormState
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingState, setEditingState] = useState<LinkFormState>(
    createEmptyLinkFormState
  )

  const isEditing = useMemo(() => editingId !== null, [editingId])

  useEffect(() => {
    void loadLinks()
  }, [])

  async function loadLinks() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/links')
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Link listesi yuklenemedi.')
      }

      setLinks(payload.links ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Link listesi yuklenemedi.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...formState,
      kimEklediCustom: formState.kimEkledi === 'Diğer' ? formState.kimEklediCustom : null,
    }

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Link eklenemedi.')
      }

      setLinks((previousLinks) => [result.link, ...previousLinks])
      setFormState(createEmptyLinkFormState())
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Link eklenemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEdit(link: Link) {
    setEditingId(link.id)
    setEditingState(toLinkFormState(link))
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingState(createEmptyLinkFormState())
  }

  async function handleUpdate(linkId: string) {
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...editingState,
      kimEklediCustom: editingState.kimEkledi === 'Diğer' ? editingState.kimEklediCustom : null,
    }

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Link guncellenemedi.')
      }

      setLinks((previousLinks) =>
        previousLinks.map((link) =>
          link.id === linkId ? result.link : link
        )
      )
      cancelEdit()
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Link guncellenemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(linkId: string) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Bu link silinsin mi?')
    ) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Link silinemedi.')
      }

      setLinks((previousLinks) =>
        previousLinks.filter((link) => link.id !== linkId)
      )
      if (editingId === linkId) {
        cancelEdit()
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Link silinemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function getKimEklediDisplay(link: Link): string {
    if (link.kimEkledi === 'Diğer' && link.kimEklediCustom) {
      return link.kimEklediCustom
    }
    return link.kimEkledi
  }

  function getKimEklediDisplayFromForm(form: LinkFormState): string {
    if (form.kimEkledi === 'Diğer' && form.kimEklediCustom) {
      return form.kimEklediCustom
    }
    return form.kimEkledi
  }

  return (
    <section className="space-y-6" aria-labelledby="links-manager-heading">
      <div className="space-y-2">
        <h2
          id="links-manager-heading"
          className="text-xl font-semibold text-ink-primary"
        >
          Links
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Referans linklerini, harici kaynaklari ve hizli erisimleri tek yerden yonet.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-lg border border-canvas-border bg-canvas-surface p-5 md:grid-cols-2"
      >
        <label className="space-y-2">
          <span className="text-sm font-medium text-ink-primary">Kim ekledi</span>
          <select
            value={formState.kimEkledi}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                kimEkledi: event.target.value as LinkFormState['kimEkledi'],
              }))
            }
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors focus:border-xp-blue"
          >
            {LINK_ADDED_BY.map((addedBy) => (
              <option key={addedBy} value={addedBy}>
                {addedBy}
              </option>
            ))}
          </select>
        </label>

        {formState.kimEkledi === 'Diğer' && (
          <TextField
            label="Ad"
            value={formState.kimEklediCustom}
            onChange={(value) =>
              setFormState((previousState) => ({
                ...previousState,
                kimEklediCustom: value,
              }))
            }
            placeholder="Kimi eklediginizi girin"
          />
        )}

        <TextField
          label="Aciklama"
          value={formState.aciklama}
          onChange={(value) =>
            setFormState((previousState) => ({
              ...previousState,
              aciklama: value,
            }))
          }
          placeholder="Link aciklamasi"
          required
        />

        <TextField
          label="Link"
          value={formState.link}
          onChange={(value) =>
            setFormState((previousState) => ({
              ...previousState,
              link: value,
            }))
          }
          placeholder="https://..."
          required
        />

        <div className="flex items-end justify-end md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-xp-blue px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} aria-hidden="true" />
            {isSubmitting ? 'Kaydediliyor...' : 'Yeni ekle'}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-xp-red/40 bg-xp-red/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-lg border border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Link listesi yukleniyor...
          </div>
        ) : links.length === 0 ? (
          <div className="rounded-lg border border-dashed border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Henuz link yok. Ilk kaydi ustteki formdan ekleyebilirsin.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-canvas-border bg-canvas-surface md:block">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-canvas-elevated text-left text-xs uppercase tracking-[0.16em] text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Kim ekledi</th>
                    <th className="px-4 py-3 font-semibold">Aciklama</th>
                    <th className="px-4 py-3 font-semibold">Link</th>
                    <th className="px-4 py-3 font-semibold">Islemler</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => {
                    const rowIsEditing = editingId === link.id

                    return (
                      <tr key={link.id} className="border-t border-canvas-border align-top">
                        <td className="px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <>
                              <select
                                value={editingState.kimEkledi}
                                onChange={(event) =>
                                  setEditingState((previousState) => ({
                                    ...previousState,
                                    kimEkledi: event.target.value as LinkFormState['kimEkledi'],
                                  }))
                                }
                                className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue mb-2"
                              >
                                {LINK_ADDED_BY.map((addedBy) => (
                                  <option key={addedBy} value={addedBy}>
                                    {addedBy}
                                  </option>
                                ))}
                              </select>
                              {editingState.kimEkledi === 'Diğer' && (
                                <input
                                  type="text"
                                  value={editingState.kimEklediCustom}
                                  onChange={(event) =>
                                    setEditingState((previousState) => ({
                                      ...previousState,
                                      kimEklediCustom: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                                  placeholder="Ad girin"
                                />
                              )}
                            </>
                          ) : (
                            <span className="text-ink-primary">{getKimEklediDisplay(link)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <input
                              type="text"
                              value={editingState.aciklama}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  aciklama: event.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            <span className="text-ink-primary">{link.aciklama}</span>
                          )}
                        </td>
                        <td className="max-w-sm px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <input
                              type="url"
                              value={editingState.link}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  link: event.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            <a
                              href={link.link}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-xp-blue transition-opacity hover:opacity-80"
                            >
                              {link.link}
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {rowIsEditing ? (
                              <>
                                <ActionButton
                                  icon={<Save size={14} aria-hidden="true" />}
                                  label="Kaydet"
                                  onClick={() => void handleUpdate(link.id)}
                                  disabled={isSubmitting}
                                  tone="success"
                                />
                                <ActionButton
                                  icon={<X size={14} aria-hidden="true" />}
                                  label="Iptal"
                                  onClick={cancelEdit}
                                  disabled={isSubmitting}
                                  tone="neutral"
                                />
                              </>
                            ) : (
                              <ActionButton
                                icon={<Pencil size={14} aria-hidden="true" />}
                                label="Duzenle"
                                onClick={() => startEdit(link)}
                                disabled={isSubmitting || isEditing}
                                tone="neutral"
                              />
                            )}

                            <ActionButton
                              icon={<Trash2 size={14} aria-hidden="true" />}
                              label="Sil"
                              onClick={() => void handleDelete(link.id)}
                              disabled={isSubmitting}
                              tone="danger"
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {links.map((link) => {
                const rowIsEditing = editingId === link.id

                return (
                  <div
                    key={link.id}
                    className="space-y-3 rounded-lg border border-canvas-border bg-canvas-surface p-4"
                  >
                    {rowIsEditing ? (
                      <div className="grid gap-3">
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-ink-primary">
                            Kim ekledi
                          </span>
                          <select
                            value={editingState.kimEkledi}
                            onChange={(event) =>
                              setEditingState((previousState) => ({
                                ...previousState,
                                kimEkledi: event.target.value as LinkFormState['kimEkledi'],
                              }))
                            }
                            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                          >
                            {LINK_ADDED_BY.map((addedBy) => (
                              <option key={addedBy} value={addedBy}>
                                {addedBy}
                              </option>
                            ))}
                          </select>
                        </label>
                        {editingState.kimEkledi === 'Diğer' && (
                          <TextField
                            label="Ad"
                            value={editingState.kimEklediCustom}
                            onChange={(value) =>
                              setEditingState((previousState) => ({
                                ...previousState,
                                kimEklediCustom: value,
                              }))
                            }
                            placeholder="Ad girin"
                          />
                        )}
                        <TextField
                          label="Aciklama"
                          value={editingState.aciklama}
                          onChange={(value) =>
                            setEditingState((previousState) => ({
                              ...previousState,
                              aciklama: value,
                            }))
                          }
                          required
                        />
                        <TextField
                          label="Link"
                          value={editingState.link}
                          onChange={(value) =>
                            setEditingState((previousState) => ({
                              ...previousState,
                              link: value,
                            }))
                          }
                          required
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <InfoPair
                            label="Kim ekledi"
                            value={getKimEklediDisplay(link)}
                          />
                          <InfoPair
                            label="Aciklama"
                            value={link.aciklama}
                          />
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                              Link
                            </p>
                            <a
                              href={link.link}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-sm text-xp-blue transition-opacity hover:opacity-80"
                            >
                              {link.link}
                            </a>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {rowIsEditing ? (
                        <>
                          <ActionButton
                            icon={<Save size={14} aria-hidden="true" />}
                            label="Kaydet"
                            onClick={() => void handleUpdate(link.id)}
                            disabled={isSubmitting}
                            tone="success"
                          />
                          <ActionButton
                            icon={<X size={14} aria-hidden="true" />}
                            label="Iptal"
                            onClick={cancelEdit}
                            disabled={isSubmitting}
                            tone="neutral"
                          />
                        </>
                      ) : (
                        <ActionButton
                          icon={<Pencil size={14} aria-hidden="true" />}
                          label="Duzenle"
                          onClick={() => startEdit(link)}
                          disabled={isSubmitting || isEditing}
                          tone="neutral"
                        />
                      )}

                      <ActionButton
                        icon={<Trash2 size={14} aria-hidden="true" />}
                        label="Sil"
                        onClick={() => void handleDelete(link.id)}
                        disabled={isSubmitting}
                        tone="danger"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-ink-primary">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
      />
    </label>
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

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  tone,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  tone: 'neutral' | 'success' | 'danger'
}) {
  const toneClasses =
    tone === 'success'
      ? 'border-xp-green/40 bg-xp-green/10 text-xp-green'
      : tone === 'danger'
        ? 'border-xp-red/40 bg-xp-red/10 text-red-200'
        : 'border-canvas-border text-ink-muted hover:text-ink-primary'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses}`}
    >
      {icon}
      {label}
    </button>
  )
}
