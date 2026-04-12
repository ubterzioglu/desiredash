import type { ReactNode, RefObject } from 'react'
import Link from 'next/link'
import type { DocCategorySlug } from '@/lib/docs-data'
import { buildDocCategoryHref } from '@/lib/docs-navigation'

interface SidebarCategoryProps {
  slug: DocCategorySlug
  title: string
  icon?: ReactNode
  active?: boolean
  linkRef?: RefObject<HTMLAnchorElement>
  onSelect: () => void
}

export default function SidebarCategory({
  slug,
  title,
  icon,
  active,
  linkRef,
  onSelect,
}: SidebarCategoryProps) {
  return (
    <div className="py-1">
      <Link
        ref={linkRef}
        href={buildDocCategoryHref(slug)}
        onClick={onSelect}
        className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-surface ${
          active
            ? 'text-xp-green'
            : 'text-ink-muted hover:bg-canvas-elevated hover:text-ink-primary'
        }`}
        style={active ? { background: 'rgba(76,175,80,0.12)', boxShadow: 'inset 2px 0 0 #4CAF50' } : undefined}
        aria-current={active ? 'page' : undefined}
      >
        {icon && (
          <span className="h-4 w-4" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{title}</span>
      </Link>
    </div>
  )
}
