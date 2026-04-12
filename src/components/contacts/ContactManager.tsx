'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import {
  createEmptyContactFormState,
  toContactFormState,
  type ContactFormState,
  type ContactItem,
} from '@/lib/contact-items'

const DURUM_DM_OPTIONS = ['', 'Aranacak', 'Arandı', 'Mail Atılacak', 'Mail Atıldı'] as const
const DURUM_CUSTOMER_OPTIONS = ['', 'Cevap Yok', 'Cevap Geldi'] as const
const SORUMLU_OPTIONS = ['', 'UBT', 'Baran', 'Sahin'] as const

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Contact eklenemedi.')
      }

      setContacts((prev) => [payload.contact, ...prev])
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingState),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Contact guncellenemedi.')
      }

      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? payload.contact : c))
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
      const response = await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Contact silinemedi.')
      }

      setContacts((prev) => prev.filter((c) => c.id !== contactId))
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

      {/* Add form — compact single-row layout */}
      <form
        onSubmit={handleCreate}
        className="rounded-lg border border-canvas-border bg-canvas-surface p-4"
      >
        <div className="flex flex-wrap items-end gap-2">
          <CompactField
            label="Contact"
            value={formState.contact}
            onChange={(v) => setFormState((prev) => ({ ...prev, contact: v }))}
            placeholder="Kisi veya kurum"
            required
          />
          <CompactField
            label="Telefon"
            value={formState.telefon}
            onChange={(v) => setFormState((prev) => ({ ...prev, telefon: v }))}
            placeholder="+49..."
          />
          <CompactField
            label="Websitesi"
            value={formState.websitesi}
            onChange={(v) => setFormState((prev) => ({ ...prev, websitesi: v }))}
            placeholder="https://..."
          />
          <CompactField
            label="Tur"
            value={formState.tur}
            onChange={(v) => setFormState((prev) => ({ ...prev, tur: v }))}
            placeholder="Paydas..."
          />
          <CompactSelect
            label="Sorumlu"
            value={formState.sorumlu}
            options={SORUMLU_OPTIONS}
            onChange={(v) => setFormState((prev) => ({ ...prev, sorumlu: v }))}
          />
          <CompactSelect
            label="Durum DM"
            value={formState.durum_dm}
            options={DURUM_DM_OPTIONS}
            onChange={(v) => setFormState((prev) => ({ ...prev, durum_dm: v }))}
          />
          <CompactSelect
            label="Durum Customer"
            value={formState.durum_customer}
            options={DURUM_CUSTOMER_OPTIONS}
            onChange={(v) => setFormState((prev) => ({ ...prev, durum_customer: v }))}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-9 items-center justify-center gap-1.5 self-end rounded-md bg-xp-blue px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={13} aria-hidden="true" />
            {isSubmitting ? 'Kaydediliyor...' : 'Ekle'}
          </button>
        </div>
        <div className="mt-2">
          <CompactTextarea
            label="Yorumlar"
            value={formState.yorumlar}
            onChange={(v) => setFormState((prev) => ({ ...prev, yorumlar: v }))}
            placeholder="Ek notlar"
          />
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
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-lg border border-canvas-border bg-canvas-surface md:block">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-canvas-elevated text-left text-xs uppercase tracking-[0.16em] text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Telefon</th>
                    <th className="px-4 py-3 font-semibold">Websitesi</th>
                    <th className="px-4 py-3 font-semibold">Tur</th>
                    <th className="px-4 py-3 font-semibold">Sorumlu</th>
                    <th className="px-4 py-3 font-semibold">Durum DM</th>
                    <th className="px-4 py-3 font-semibold">Durum Customer</th>
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
                          onChange={(v) => setEditingState((prev) => ({ ...prev, contact: v }))}
                          required
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.telefon : contact.telefon ?? '-'}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, telefon: v }))}
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.websitesi : contact.websitesi ?? '-'}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, websitesi: v }))}
                        />
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.tur : contact.tur ?? '-'}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, tur: v }))}
                        />
                        <EditableSelectCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.sorumlu : contact.sorumlu ?? ''}
                          options={SORUMLU_OPTIONS}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, sorumlu: v }))}
                        />
                        <EditableSelectCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.durum_dm : contact.durum_dm ?? ''}
                          options={DURUM_DM_OPTIONS}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, durum_dm: v }))}
                        />
                        <EditableSelectCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.durum_customer : contact.durum_customer ?? ''}
                          options={DURUM_CUSTOMER_OPTIONS}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, durum_customer: v }))}
                        />
                        <td className="max-w-[14rem] px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <textarea
                              value={editingState.yorumlar}
                              onChange={(e) =>
                                setEditingState((prev) => ({ ...prev, yorumlar: e.target.value }))
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

            {/* Mobile cards */}
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
                        <CompactField
                          label="Contact"
                          value={editingState.contact}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, contact: v }))}
                          required
                        />
                        <CompactField
                          label="Telefon"
                          value={editingState.telefon}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, telefon: v }))}
                        />
                        <CompactField
                          label="Websitesi"
                          value={editingState.websitesi}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, websitesi: v }))}
                        />
                        <CompactField
                          label="Tur"
                          value={editingState.tur}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, tur: v }))}
                        />
                        <CompactSelect
                          label="Sorumlu"
                          value={editingState.sorumlu}
                          options={SORUMLU_OPTIONS}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, sorumlu: v }))}
                        />
                        <CompactSelect
                          label="Durum DM"
                          value={editingState.durum_dm}
                          options={DURUM_DM_OPTIONS}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, durum_dm: v }))}
                        />
                        <CompactSelect
                          label="Durum Customer"
                          value={editingState.durum_customer}
                          options={DURUM_CUSTOMER_OPTIONS}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, durum_customer: v }))}
                        />
                        <CompactTextarea
                          label="Yorumlar"
                          value={editingState.yorumlar}
                          onChange={(v) => setEditingState((prev) => ({ ...prev, yorumlar: v }))}
                        />
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
                          <InfoPair label="Durum DM" value={contact.durum_dm ?? '-'} />
                          <InfoPair label="Durum Customer" value={contact.durum_customer ?? '-'} />
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompactField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="flex min-w-[8rem] flex-1 flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-9 rounded-md border border-canvas-border bg-canvas-elevated px-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
      />
    </label>
  )
}

function CompactSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex min-w-[8rem] flex-1 flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-canvas-border bg-canvas-elevated px-2.5 text-sm text-ink-primary outline-none transition-colors focus:border-xp-blue"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === '' ? '—' : opt}
          </option>
        ))}
      </select>
    </label>
  )
}

function CompactTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex w-full flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-2.5 py-2 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
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
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <td className="px-4 py-3 text-ink-muted">
      {editing ? (
        <input
          type="text"
          value={value === '-' ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full min-w-[6rem] rounded-md border border-canvas-border bg-canvas-elevated px-2.5 py-1.5 text-sm text-ink-primary outline-none focus:border-xp-blue"
        />
      ) : (
        value
      )}
    </td>
  )
}

function EditableSelectCell({
  editing,
  value,
  options,
  onChange,
}: {
  editing: boolean
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <td className="px-4 py-3 text-ink-muted">
      {editing ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-canvas-border bg-canvas-elevated px-2.5 py-1.5 text-sm text-ink-primary outline-none focus:border-xp-blue"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === '' ? '—' : opt}
            </option>
          ))}
        </select>
      ) : (
        value || '-'
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
      <p className="break-words text-sm text-ink-primary">{value}</p>
    </div>
  )
}
