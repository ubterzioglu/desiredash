'use client'

import { useEffect, useState } from 'react'
import AccordionCard from '../ui/AccordionCard'
import { getDocsCategories } from '@/lib/docs-data'

const MVP_TAGS = ['MVP1', 'MVP2', 'MVP3'] as const
type MvpTag = (typeof MVP_TAGS)[number]

type TagMap = Record<string, MvpTag | null>

const TAG_COLORS: Record<MvpTag, string> = {
  MVP1: '#CC3300',
  MVP2: '#1A6DC2',
  MVP3: '#F5A500',
}

const mvpItems =
  getDocsCategories().find((c) => c.slug === 'mvp')?.items ?? []

export default function MvpManager() {
  const [tags, setTags] = useState<TagMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void loadTags()
  }, [])

  async function loadTags() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/mvp/tags')
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'Etiketler yuklenemedi.')
      setTags(payload.tags ?? {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Etiketler yuklenemedi.')
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

  const taggedItems = (tag: MvpTag) =>
    mvpItems.filter((item) => tags[item.id] === tag)

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

      {/* Item list with tag dropdowns */}
      <div className="rounded-lg border border-canvas-border bg-canvas-surface overflow-hidden">
        <div className="px-4 py-2.5 bg-canvas-elevated border-b border-canvas-border">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            İçerik Listesi — Etiketle
          </p>
        </div>
        {isLoading ? (
          <div className="px-4 py-6 text-sm text-ink-muted">Yukluniyor...</div>
        ) : (
          <ul className="divide-y divide-canvas-border">
            {mvpItems.map((item, index) => {
              const currentTag = tags[item.id] ?? null
              const xpColors = ['#CC3300', '#4CAF50', '#1A6DC2', '#F5A500']
              const accent = xpColors[index % xpColors.length]

              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderLeft: `3px solid ${currentTag ? TAG_COLORS[currentTag] : accent}` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-primary truncate">{item.label}</p>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">{item.description}</p>
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
                          <span className="text-ink-muted ml-1">— {item.description}</span>
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
