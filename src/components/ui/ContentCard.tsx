import Link from 'next/link'
import { ReactNode } from 'react'
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
}: ContentCardProps) {
  const actionSurface = action?.surface ?? 'card'
  const isCardInteractive = Boolean(action) && actionSurface === 'card'

  const cardClasses = [
    'content-card group',
    density === 'detail' ? 'rounded-2xl' : '',
    isCardInteractive
      ? 'block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
      : 'block',
    density === 'compact' ? 'p-5' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const titleClasses =
    density === 'detail'
      ? 'text-xl font-semibold text-gray-900'
      : 'text-base font-semibold text-gray-900 transition-colors group-hover:text-primary-600 group-focus-visible:text-primary-600'

  const descriptionClasses =
    density === 'detail'
      ? 'text-sm leading-6 text-gray-600'
      : 'text-sm text-gray-500'

  const actionMarkup = action ? (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700">
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
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {actionMarkup}
        </Link>
      )
    }

    return (
      <button
        type="button"
        onClick={action.onClick}
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        {actionMarkup}
      </button>
    )
  }

  const content = (
    <div
      id={anchorId}
      className={`${
        anchorId ? 'scroll-mt-28' : ''
      } ${density === 'detail' ? 'space-y-4' : 'space-y-3'}`.trim()}
    >
      <div className="flex items-start gap-4">
        {icon && density !== 'detail' && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    {eyebrow}
                  </p>
                )}
                {badge && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
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
              <p className="whitespace-pre-line text-sm leading-6 text-gray-500">
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
