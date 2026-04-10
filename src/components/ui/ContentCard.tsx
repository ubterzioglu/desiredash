import Link from 'next/link'
import { ReactNode } from 'react'
import type React from 'react'
import { ArrowRight } from 'lucide-react'

type ContentCardAction =
  | {
      type: 'link'
      href: string
      label: string
      surface?: 'card' | 'cta'
    }
  | {
      type: 'button'
      onClick: () => void
      label: string
      surface?: 'card' | 'cta'
    }

const XP_COLORS = ['#CC3300', '#4CAF50', '#1A6DC2', '#F5A500'] as const

interface ContentCardProps {
  title: string
  description: string
  icon?: ReactNode
  badge?: string
  eyebrow?: string
  detail?: string
  anchorId?: string
  density?: 'default' | 'compact' | 'detail'
  action?: ContentCardAction
  xpColorIndex?: number
}

export default function ContentCard({
  title,
  description,
  icon,
  badge,
  eyebrow,
  detail,
  anchorId,
  density = 'default',
  action,
  xpColorIndex = 0,
}: ContentCardProps) {
  const actionSurface = action?.surface ?? 'card'
  const isCardInteractive = Boolean(action) && actionSurface === 'card'
  const xpColor = XP_COLORS[xpColorIndex % XP_COLORS.length]

  const cardClasses = [
    'content-card group',
    density === 'detail' ? 'rounded-2xl' : '',
    isCardInteractive
      ? 'block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base'
      : 'block',
    density === 'compact' ? 'p-5' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const titleClasses =
    density === 'detail'
      ? 'text-xl font-semibold text-white'
      : 'text-base font-semibold text-white transition-colors'

  const descriptionClasses =
    density === 'detail'
      ? 'text-sm leading-6 text-ink-muted'
      : 'text-sm text-ink-muted'

  const actionMarkup = action ? (
    <span className="inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: xpColor }}>
      {action.label}
      <ArrowRight size={16} aria-hidden="true" />
    </span>
  ) : null

  const renderCta = () => {
    if (!action || actionSurface !== 'cta') {
      return null
    }

    if (action.type === 'link') {
      return (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-surface"
          style={{ color: xpColor }}
        >
          {actionMarkup}
        </Link>
      )
    }

    return (
      <button
        type="button"
        onClick={action.onClick}
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-surface"
        style={{ color: xpColor }}
      >
        {actionMarkup}
      </button>
    )
  }

  const cardStyle: React.CSSProperties = {
    borderLeft: `3px solid ${xpColor}`,
    background: '#0D0D0D',
    borderRadius: density === 'detail' ? '1rem' : '0.75rem',
    padding: density === 'compact' ? undefined : '1.25rem 1.5rem',
  }

  const content = (
    <div
      id={anchorId}
      style={cardStyle}
      className={`${
        anchorId ? 'scroll-mt-28' : ''
      } ${density === 'detail' ? 'space-y-4' : 'space-y-3'}`.trim()}
    >
      <div className="flex items-start gap-4">
        {icon && density !== 'detail' && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors"
            style={{ background: `${xpColor}18`, color: xpColor }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          {(eyebrow || badge || (density === 'detail' && actionSurface === 'cta' && action)) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {eyebrow && (
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: xpColor }}>
                    {eyebrow}
                  </p>
                )}
                {badge && (
                  <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: `${xpColor}15`, color: xpColor, border: `1px solid ${xpColor}40` }}>
                    {badge}
                  </span>
                )}
              </div>
              {density === 'detail' && renderCta()}
            </div>
          )}
          <div className="space-y-2">
            <h3 className={titleClasses}>
              {title}
            </h3>
            <p className={descriptionClasses}>
              {description}
            </p>
            {detail && (
              <p className="whitespace-pre-line text-sm leading-6 text-ink-muted">
                {detail}
              </p>
            )}
          </div>
          {actionMarkup && actionSurface === 'card' && (
            <div className="pt-1">
              {actionMarkup}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (action?.type === 'link' && actionSurface === 'card') {
    return (
      <Link href={action.href} className={cardClasses}>
        {content}
      </Link>
    )
  }

  if (action?.type === 'button' && actionSurface === 'card') {
    return (
      <button
        type="button"
        onClick={action.onClick}
        className={`${cardClasses} w-full text-left`}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  )
}
