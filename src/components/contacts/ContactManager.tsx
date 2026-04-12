'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import {
  createEmptyContactFormState,
  toContactFormState,
  type ContactFormState,
  type ContactItem,
} from '@/lib/contact-items'

export default function ContactManager() {
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<ContactFormState>(
    createEmptyContactFormState
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingState, setEditingState] = useState<ContactFormState>(
    createEmptyContactFormState
  )

  const isEditing = useMemo(() => editingId !== null, [editingId])

  useEffect(() => {
    void loadContacts()
  }, [])

  async function loadContacts() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/contacts')
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Contact listesi yuklenemedi.')
      }

      setContacts(payload.contacts ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Contact listesi yuklenemedi.'
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
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Contact eklenemedi.')
      }

      setContacts((previousContacts) => [payload.contact, ...previousContacts])
      setFormState(createEmptyContactFormState())
    } catch (createError) {
      setError(
        createError instanceof Error ? createError.message : 'Contact eklenemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEdit(contact: ContactItem) {
    setEditingId(contact.id)
    setEditingState(toContactFormState(contact))
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingState(createEmptyContactFormState())
  }

  async function handleUpdate(contactId: string) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingState),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Contact guncellenemedi.')
      }

      setContacts((previousContacts) =>
        previousContacts.map((contact) =>
          contact.id === contactId ? payload.contact : contact
        )
      )
      cancelEdit()
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : 'Contact guncellenemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(contactId: string) {
    if (typeof window !== 'undefined' && !window.confirm('Bu contact silinsin mi?')) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Contact silinemedi.')
      }

      setContacts((previousContacts) =>
        previousContacts.filter((contact) => contact.id !== contactId)
      )
      if (editingId === contactId) {
        cancelEdit()
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Contact silinemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6" aria-labelledby="contact-manager-heading">
      <div className="space-y-2">
        <h2
          id="contact-manager-heading"
          className="text-xl font-semibold text-ink-primary"
        >
          Contact Listesi
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Kisi ve kurum kayitlarini bu tablodan ekle, guncelle ve sil.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-lg border border-canvas-border bg-canvas-surface p-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <FormField
          label="Contact"
          value={formState.contact}
          onChange={(value) => setFormState((prev) => ({ ...prev, contact: value }))}
          placeholder="Kisi veya kurum"
          required
        />
        <FormField
          label="Telefon"
          value={formState.telefon}
          onChange={(value) => setFormState((prev) => ({ ...prev, telefon: value }))}
          placeholder="+49..."
        />
        <FormField
          label="Websitesi"
          value={formState.websitesi}
          onChange={(value) => setFormState((prev) => ({ ...prev, websitesi: value }))}
          placeholder="https://..."
        />
        <FormField
          label="Tur"
          value={formState.tur}
          onChange={(value) => setFormState((prev) => ({ ...prev, tur: value }))}
          placeholder="Paydas, kurum..."
        />
        <FormField
          label="Sorumlu"
          value={formState.sorumlu}
          onChange={(value) => setFormState((prev) => ({ ...prev, sorumlu: value }))}
          placeholder="UBT"
        />
        <FormField
          label="Durum"
          value={formState.durum}
          onChange={(value) => setFormState((prev) => ({ ...prev, durum: value }))}
          placeholder="Aktif"
        />
        <label className="space-y-2 md:col-span-2 xl:col-span-3">
          <span className="text-sm font-medium text-ink-primary">Yorumlar</span>
          <textarea
            value={formState.yorumlar}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, yorumlar: event.target.value }))
            }
            placeholder="Ek notlar"
            rows={4}
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
          />
        </label>
        <div className="md:col-span-2 xl:col-span-3 flex justify-end">
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
            Contact listesi yukleniyor...
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Henuz contact yok. Ilk kaydi ustteki formdan ekleyebilirsin.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-canvas-border bg-canvas-surface md:block">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-canvas-elevated text-left text-xs uppercase tracking-[0.16em] text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Telefon</th>
                    <th className="px-4 py-3 font-semibold">Websitesi</th>
                    <th className="px-4 py-3 font-semibold">Tur</th>
                    <th className="px-4 py-3 font-semibold">Sorumlu</th>
                    <th className="px-4 py-3 font-semibold">Durum</th>
                    <th className="px-4 py-3 font-semibold">Yorumlar</th>
                    <th className="px-4 py-3 font-semibold">Islemler</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => {
                    const rowIsEditing = editingId === contact.id

                    return (
                      <tr key={contact.id} className="border-t border-canvas-border align-top">
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.contact : contact.contact}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, contact: value }))
                          }
                          required
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.telefon : contact.telefon ?? '-'}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, telefon: value }))
                          }
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={
                            rowIsEditing ? editingState.websitesi : contact.websitesi ?? '-'
                          }
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, websitesi: value }))
                          }
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.tur : contact.tur ?? '-'}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, tur: value }))
                          }
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={
                            rowIsEditing ? editingState.sorumlu : contact.sorumlu ?? '-'
                          }
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, sorumlu: value }))
                          }
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.durum : contact.durum ?? '-'}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, durum: value }))
                          }
                        />
                        <td className="max-w-sm px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <textarea
                              value={editingState.yorumlar}
                              onChange={(event) =>
                                setEditingState((prev) => ({
                                  ...prev,
                                  yorumlar: event.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            contact.yorumlar ?? '-'
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {rowIsEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => void handleUpdate(contact.id)}
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
                                onClick={() => startEdit(contact)}
                                disabled={isSubmitting || isEditing}
                                className="inline-flex items-center gap-1 rounded-md border border-canvas-border px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-60"
                              >
                                <Pencil size={14} aria-hidden="true" />
                                Duzenle
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => void handleDelete(contact.id)}
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
              {contacts.map((contact) => {
                const rowIsEditing = editingId === contact.id

                return (
                  <div
                    key={contact.id}
                    className="space-y-3 rounded-lg border border-canvas-border bg-canvas-surface p-4"
                  >
                    {rowIsEditing ? (
                      <div className="grid gap-3">
                        <FormField
                          label="Contact"
                          value={editingState.contact}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, contact: value }))
                          }
                          required
                        />
                        <FormField
                          label="Telefon"
                          value={editingState.telefon}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, telefon: value }))
                          }
                        />
                        <FormField
                          label="Websitesi"
                          value={editingState.websitesi}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, websitesi: value }))
                          }
                        />
                        <FormField
                          label="Tur"
                          value={editingState.tur}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, tur: value }))
                          }
                        />
                        <FormField
                          label="Sorumlu"
                          value={editingState.sorumlu}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, sorumlu: value }))
                          }
                        />
                        <FormField
                          label="Durum"
                          value={editingState.durum}
                          onChange={(value) =>
                            setEditingState((prev) => ({ ...prev, durum: value }))
                          }
                        />
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-ink-primary">
                            Yorumlar
                          </span>
                          <textarea
                            value={editingState.yorumlar}
                            onChange={(event) =>
                              setEditingState((prev) => ({
                                ...prev,
                                yorumlar: event.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                          />
                        </label>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-ink-primary">
                            {contact.contact}
                          </h3>
                          <p className="text-sm text-ink-muted">
                            {contact.yorumlar ?? 'Yorum yok'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <InfoPair label="Telefon" value={contact.telefon ?? '-'} />
                          <InfoPair label="Websitesi" value={contact.websitesi ?? '-'} />
                          <InfoPair label="Tur" value={contact.tur ?? '-'} />
                          <InfoPair label="Sorumlu" value={contact.sorumlu ?? '-'} />
                          <InfoPair label="Durum" value={contact.durum ?? '-'} />
                        </div>
                      </>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {rowIsEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleUpdate(contact.id)}
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
                          onClick={() => startEdit(contact)}
                          disabled={isSubmitting || isEditing}
                          className="inline-flex items-center gap-1 rounded-md border border-canvas-border px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-60"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Duzenle
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void handleDelete(contact.id)}
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
    </section>
  )
}

function FormField({
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

function EditableCell({
  editing,
  value,
  onChange,
  required,
}: {
  editing: boolean
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <td className="px-4 py-3 text-ink-muted">
      {editing ? (
        <input
          type="text"
          value={value === '-' ? '' : value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
        />
      ) : (
        value
      )}
    </td>
  )
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </p>
      <p className="text-sm text-ink-primary break-words">{value}</p>
    </div>
  )
}
