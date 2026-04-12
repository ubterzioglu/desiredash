'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import AccordionCard from '../ui/AccordionCard'
import { getDocsCategories } from '@/lib/docs-data'

const MVP_TAGS = ['MVP1', 'MVP2', 'MVP3'] as const
type MvpTag = (typeof MVP_TAGS)[number]

type TagMap = Record<string, MvpTag | null>

interface MvpCustomItem {
  id: string
  label: string
  description: string | null
  createdAt: string
}

const TAG_COLORS: Record<MvpTag, string> = {
  MVP1: '#CC3300',
  MVP2: '#1A6DC2',
  MVP3: '#F5A500',
}

const ACCENT_CYCLE = ['#CC3300', '#4CAF50', '#1A6DC2', '#F5A500']

const staticItems = getDocsCategories().find((c) => c.slug === 'mvp')?.items ?? []

export default function MvpManager() {
  const [tags, setTags] = useState<TagMap>({})
  const [customItems, setCustomItems] = useState<MvpCustomItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add-item form state
  const [newLabel, setNewLabel] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const labelRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void loadAll()
  }, [])

  async function loadAll() {
    setIsLoading(true)
    setError(null)
    try {
      const [tagsRes, itemsRes] = await Promise.all([
        fetch('/api/mvp/tags'),
        fetch('/api/mvp/items'),
      ])
      const [tagsPayload, itemsPayload] = await Promise.all([
        tagsRes.json(),
        itemsRes.json(),
      ])
      if (!tagsRes.ok) throw new Error(tagsPayload.error ?? 'Etiketler yuklenemedi.')
      if (!itemsRes.ok) throw new Error(itemsPayload.error ?? 'Itemlar yuklenemedi.')
      setTags(tagsPayload.tags ?? {})
      setCustomItems(itemsPayload.items ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veriler yuklenemedi.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleTagChange(itemId: string, newTag: MvpTag | null) {
    const previousTag = tags[itemId] ?? null
    setTags((prev) => ({ ...prev, [itemId]: newTag }))

    try {
      const response = await fetch('/api/mvp/tags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, tag: newTag }),
      })
      const payload = await response.json()
      if (!response.ok) {
        setTags((prev) => ({ ...prev, [itemId]: previousTag }))
        setError(payload.error ?? 'Etiket kaydedilemedi.')
      }
    } catch {
      setTags((prev) => ({ ...prev, [itemId]: previousTag }))
      setError('Etiket kaydedilemedi.')
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault()
    if (newLabel.trim() === '' || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/mvp/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newLabel.trim(), description: newDescription.trim() || null }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'Item eklenemedi.')
      setCustomItems((prev) => [...prev, payload.item as MvpCustomItem])
      setNewLabel('')
      setNewDescription('')
      labelRef.current?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Item eklenemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteItem(itemId: string) {
    setCustomItems((prev) => prev.filter((i) => i.id !== itemId))
    setTags((prev) => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
    try {
      const response = await fetch(`/api/mvp/items/${itemId}`, { method: 'DELETE' })
      if (!response.ok) {
        void loadAll()
      }
    } catch {
      void loadAll()
    }
  }

  // Merge static + custom items for display
  const allItems = [
    ...staticItems.map((s) => ({ id: s.id, label: s.label, description: s.description ?? null, isCustom: false })),
    ...customItems.map((c) => ({ id: c.id, label: c.label, description: c.description, isCustom: true })),
  ]

  const taggedItems = (tag: MvpTag) => allItems.filter((item) => tags[item.id] === tag)

  return (
    <section className="space-y-6" aria-labelledby="mvp-manager-heading">
      <div className="space-y-2">
        <h2 id="mvp-manager-heading" className="text-xl font-semibold text-ink-primary">
          MVP Planlama
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Her blogu etiketle: hangi phase&apos;e ait? Seçimler Supabase&apos;e kaydedilir.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-xp-red/40 bg-xp-red/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Add item form */}
      <AccordionCard
        defaultOpenId="new-mvp-item"
        items={[
          {
            id: 'new-mvp-item',
            title: 'Yeni Item Ekle',
            accentColor: '#4CAF50',
            children: (
              <form onSubmit={(e) => void handleAddItem(e)} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="mvp-new-label" className="block text-xs font-medium text-ink-muted">
                    Başlık <span className="text-xp-red">*</span>
                  </label>
                  <input
                    ref={labelRef}
                    id="mvp-new-label"
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Item başlığı..."
                    required
                    className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-colors focus:border-xp-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="mvp-new-desc" className="block text-xs font-medium text-ink-muted">
                    Açıklama <span className="text-ink-muted font-normal">(opsiyonel)</span>
                  </label>
                  <input
                    id="mvp-new-desc"
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Kısa açıklama..."
                    className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-colors focus:border-xp-blue"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || newLabel.trim() === ''}
                  className="rounded-md bg-xp-green px-4 py-2 text-sm font-semibold text-white outline-none transition-opacity hover:opacity-90 focus:ring-2 focus:ring-xp-green/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </form>
            ),
          },
        ]}
      />

      {/* Item list with tag dropdowns */}
      <div className="rounded-lg border border-canvas-border bg-canvas-surface overflow-hidden">
        <div className="px-4 py-2.5 bg-canvas-elevated border-b border-canvas-border">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            İçerik Listesi — Etiketle
          </p>
        </div>
        {isLoading ? (
          <div className="px-4 py-6 text-sm text-ink-muted">Yükleniyor...</div>
        ) : (
          <ul className="divide-y divide-canvas-border">
            {allItems.map((item, index) => {
              const currentTag = tags[item.id] ?? null
              const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length]

              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderLeft: `3px solid ${currentTag ? TAG_COLORS[currentTag] : accent}` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-primary truncate">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-ink-muted mt-0.5 truncate">{item.description}</p>
                    )}
                  </div>

                  <select
                    value={currentTag ?? ''}
                    onChange={(e) =>
                      void handleTagChange(item.id, (e.target.value as MvpTag) || null)
                    }
                    className="shrink-0 rounded-md border border-canvas-border bg-canvas-elevated px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors focus:border-xp-blue"
                    style={
                      currentTag
                        ? {
                            color: TAG_COLORS[currentTag],
                            borderColor: `${TAG_COLORS[currentTag]}60`,
                            background: `${TAG_COLORS[currentTag]}12`,
                          }
                        : undefined
                    }
                    aria-label={`${item.label} etiketi`}
                  >
                    <option value="">— Atanmadı</option>
                    {MVP_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>

                  {item.isCustom && (
                    <button
                      type="button"
                      onClick={() => void handleDeleteItem(item.id)}
                      className="shrink-0 rounded-md p-1.5 text-ink-muted outline-none transition-colors hover:bg-xp-red/15 hover:text-red-400 focus:ring-2 focus:ring-xp-red/40"
                      aria-label={`${item.label} sil`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Grouped accordion by tag */}
      {!isLoading && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Etiketlenmiş Bloklar
          </p>
          <AccordionCard
            items={MVP_TAGS.map((tag) => {
              const items = taggedItems(tag)
              return {
                id: tag,
                title: tag,
                badge: `${items.length} blok`,
                accentColor: TAG_COLORS[tag],
                children:
                  items.length === 0 ? (
                    <p className="text-sm text-ink-muted italic">
                      Bu phase için henüz blok seçilmedi.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-start gap-2 text-sm">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: TAG_COLORS[tag] }}
                          />
                          <span className="text-ink-primary font-medium">{item.label}</span>
                          {item.description && (
                            <span className="text-ink-muted ml-1">— {item.description}</span>
                          )}
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
