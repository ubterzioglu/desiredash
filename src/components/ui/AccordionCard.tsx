'use client'
import { ReactNode, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  badge?: string
  accentColor?: string
  children: ReactNode
}

interface AccordionCardProps {
  items: AccordionItem[]
  defaultOpenId?: string
  className?: string
}

export default function AccordionCard({
  items,
  defaultOpenId,
  className = '',
}: AccordionCardProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null)
  const uid = useId()

  return (
    <div
      className={`divide-y divide-canvas-border rounded-lg border border-canvas-border bg-canvas-surface ${className}`}
    >
      {items.map((item) => {
        const isOpen = openId === item.id
        const accentColor = item.accentColor ?? '#1A6DC2'
        const panelId = `${uid}-panel-${item.id}`
        const triggerId = `${uid}-trigger-${item.id}`

        return (
          <div key={item.id}>
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-canvas-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-inset"
              style={{ borderLeft: `3px solid ${accentColor}` }}
            >
              <span className="flex-1 text-sm font-semibold text-ink-primary">
                {item.title}
              </span>
              {item.badge && (
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: `${accentColor}18`,
                    color: accentColor,
                    border: `1px solid ${accentColor}40`,
                  }}
                >
                  {item.badge}
                </span>
              )}
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="shrink-0 text-ink-muted transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="px-4 pb-4 pt-3"
              >
                {item.children}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
