'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import {
  LOGO_KIMSIN_OPTIONS,
  type LogoFikirItem,
  type LogoKimsin,
} from '@/lib/logo-fikirler-items'

type ScoreField = 'puan_ubt' | 'puan_baran' | 'puan_sahin'

const SCORE_MAP: Array<{ field: ScoreField; label: string; key: keyof LogoFikirItem }> = [
  { field: 'puan_ubt', label: 'UBT', key: 'puanUbt' },
  { field: 'puan_baran', label: 'Baran', key: 'puanBaran' },
  { field: 'puan_sahin', label: 'Sahin', key: 'puanSahin' },
]

export default function LogoFikirlerManager() {
  const [items, setItems] = useState<LogoFikirItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [kimsin, setKimsin] = useState<LogoKimsin>('UBT')
  const [logoLink, setLogoLink] = useState('')

  useEffect(() => {
    void loadItems()
  }, [])

  async function loadItems() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/logo-fikirler')
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
    if (!logoLink.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/logo-fikirler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kimsin, logo_link: logoLink }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Eklenemedi.')
      }

      setItems((prev) => [payload.item, ...prev])
      setLogoLink('')
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : 'Eklenemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleScoreChange(id: string, field: ScoreField, raw: string) {
    const parsed = raw === '' ? null : Number(raw)
    if (parsed !== null && (isNaN(parsed) || parsed < 1 || parsed > 10)) return

    try {
      const response = await fetch(`/api/logo-fikirler/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: parsed }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Puan guncellenemedi.')
      }

      setItems((prev) =>
        prev.map((item) => (item.id === id ? payload.item : item))
      )
    } catch (scoreError) {
      setError(scoreError instanceof Error ? scoreError.message : 'Puan guncellenemedi.')
    }
  }

  async function handleDelete(id: string) {
    if (typeof window !== 'undefined' && !window.confirm('Bu kayit silinsin mi?')) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/logo-fikirler/${id}`, { method: 'DELETE' })
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
    <section className="space-y-6" aria-labelledby="logo-fikirler-heading">
      <div className="space-y-2">
        <h2
          id="logo-fikirler-heading"
          className="text-xl font-semibold text-ink-primary"
        >
          Logo Fikirler
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Google Drive&apos;a at, linkini buraya yaz. Her kisi 1-10 arası puan verir.
        </p>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="rounded-lg border border-canvas-border bg-canvas-surface p-4"
      >
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex min-w-[7rem] flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Kimsin
            </span>
            <select
              value={kimsin}
              onChange={(e) => setKimsin(e.target.value as LogoKimsin)}
              className="h-9 rounded-md border border-canvas-border bg-canvas-elevated px-2.5 text-sm text-ink-primary outline-none focus:border-xp-blue"
            >
              {LOGO_KIMSIN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[16rem] flex-1 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Logo Link
            </span>
            <input
              type="url"
              value={logoLink}
              onChange={(e) => setLogoLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              required
              className="h-9 rounded-md border border-canvas-border bg-canvas-elevated px-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !logoLink.trim()}
            className="inline-flex h-9 items-center gap-1.5 self-end rounded-md bg-xp-blue px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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

      {isLoading ? (
        <div className="rounded-lg border border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
          Yukleniyor...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
          Henuz logo fikir yok. Ustteki formdan ilk kaydi ekle.
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-canvas-border bg-canvas-surface">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-canvas-elevated text-left text-xs uppercase tracking-[0.16em] text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kimsin</th>
                  <th className="px-4 py-3 font-semibold">Logo Link</th>
                  <th className="px-4 py-3 font-semibold">Puan UBT</th>
                  <th className="px-4 py-3 font-semibold">Puan Baran</th>
                  <th className="px-4 py-3 font-semibold">Puan Sahin</th>
                  <th className="px-4 py-3 font-semibold">Islemler</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-canvas-border">
                    <td className="px-4 py-3 text-ink-muted">{item.kimsin}</td>
                    <td className="max-w-xs px-4 py-3">
                      <a
                        href={item.logoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xp-blue underline-offset-2 hover:underline"
                      >
                        <ExternalLink size={12} aria-hidden="true" />
                        <span className="max-w-[14rem] truncate text-sm">
                          {item.logoLink}
                        </span>
                      </a>
                    </td>
                    {SCORE_MAP.map(({ field, key }) => (
                      <td key={field} className="px-4 py-3">
                        <ScoreInput
                          value={(item[key] as number | null) ?? null}
                          onBlur={(val) => void handleScoreChange(item.id, field, val)}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.id)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 rounded-md border border-xp-red/40 bg-xp-red/10 px-3 py-1.5 text-xs font-semibold text-red-200 transition-opacity hover:opacity-85 disabled:opacity-60"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Logo Grid */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Logo Önizleme
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="space-y-3 rounded-lg border border-canvas-border bg-canvas-surface p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-canvas-border bg-canvas-elevated px-2.5 py-0.5 text-xs font-semibold text-ink-muted">
                      {item.kimsin}
                    </span>
                    <a
                      href={item.logoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-canvas-border px-2.5 py-1 text-xs font-semibold text-ink-muted transition-colors hover:border-xp-blue hover:text-ink-primary"
                    >
                      <ExternalLink size={11} aria-hidden="true" />
                      Logoyu Gör
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SCORE_MAP.map(({ label, key }) => {
                      const score = item[key] as number | null
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 rounded-md border border-canvas-border bg-canvas-elevated px-2 py-0.5 text-xs text-ink-muted"
                        >
                          <span className="font-semibold">{label}:</span>
                          <span
                            className={
                              score !== null ? 'font-bold text-xp-green' : 'opacity-50'
                            }
                          >
                            {score !== null ? score : '—'}
                          </span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function ScoreInput({
  value,
  onBlur,
}: {
  value: number | null
  onBlur: (raw: string) => void
}) {
  const [localValue, setLocalValue] = useState(value !== null ? String(value) : '')

  useEffect(() => {
    setLocalValue(value !== null ? String(value) : '')
  }, [value])

  return (
    <input
      type="number"
      min={1}
      max={10}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => onBlur(localValue)}
      placeholder="—"
      className="w-14 rounded-md border border-canvas-border bg-canvas-elevated px-2 py-1.5 text-center text-sm text-ink-primary outline-none focus:border-xp-blue"
    />
  )
}
