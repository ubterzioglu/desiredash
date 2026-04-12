'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { SonGuncellemelerItem } from '@/lib/son-guncellemeler-items'

export default function SonGuncellemelerManager() {
  const [items, setItems] = useState<SonGuncellemelerItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metin, setMetin] = useState('')

  useEffect(() => {
    void loadItems()
  }, [])

  async function loadItems() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/son-guncellemeler')
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Liste yuklenemedi.')
      }

      setItems(payload.items ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Liste yuklenemedi.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!metin.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/son-guncellemeler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metin }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Guncelleme eklenemedi.')
      }

      setItems((prev) => [payload.item, ...prev])
      setMetin('')
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : 'Guncelleme eklenemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (typeof window !== 'undefined' && !window.confirm('Bu kayit silinsin mi?')) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/son-guncellemeler/${id}`, { method: 'DELETE' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Silinemedi.')
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Silinemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6" aria-labelledby="son-guncellemeler-heading">
      <div className="space-y-2">
        <h2
          id="son-guncellemeler-heading"
          className="text-xl font-semibold text-ink-primary"
        >
          Son Güncellemeler
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Tarih damgası otomatik atılır. Sadece metin girilir, düzenleme yoktur.
        </p>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="rounded-lg border border-canvas-border bg-canvas-surface p-4"
      >
        <label className="mb-2 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Yeni Güncelleme
          </span>
          <textarea
            value={metin}
            onChange={(e) => setMetin(e.target.value)}
            placeholder="Ne oldu?"
            rows={3}
            required
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
          />
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !metin.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-xp-blue px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={13} aria-hidden="true" />
            {isSubmitting ? 'Kaydediliyor...' : 'Ekle'}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-xp-red/40 bg-xp-red/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-lg border border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Yukleniyor...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Henuz guncelleme yok. Ustteki formdan ilk kaydi ekle.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-canvas-border bg-canvas-surface px-4 py-3"
            >
              <div className="flex-1 space-y-1">
                <p className="text-[11px] font-semibold tabular-nums text-ink-muted">
                  {new Date(item.createdAt).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="whitespace-pre-wrap text-sm text-ink-primary">{item.metin}</p>
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(item.id)}
                disabled={isSubmitting}
                className="mt-0.5 inline-flex items-center rounded-md border border-xp-red/40 bg-xp-red/10 p-1.5 text-red-200 transition-opacity hover:opacity-85 disabled:opacity-60"
                aria-label="Sil"
              >
                <Trash2 size={13} aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
