import type { RefObject, ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import SidebarItem from './SidebarItem'
import type { DocCategorySlug, DocNavItem } from '@/lib/docs-data'
import { buildDocCategoryHref } from '@/lib/docs-navigation'

interface SidebarCategoryProps {
  slug: DocCategorySlug
  title: string
  icon?: ReactNode
  items: DocNavItem[]
  active?: boolean
  activeItemId?: string
  isExpanded: boolean
  buttonRef?: RefObject<HTMLButtonElement>
  onToggle: () => void
  onItemSelect: () => void
}

export default function SidebarCategory({
  slug,
  title,
  icon,
  items,
  active,
  activeItemId,
  isExpanded,
  buttonRef,
  onToggle,
  onItemSelect,
}: SidebarCategoryProps) {
  const buttonId = `sidebar-category-button-${slug}`
  const panelId = `sidebar-category-panel-${slug}`
  const hasNestedItems = items.length > 1

  if (!hasNestedItems) {
    return (
      <div className="py-2">
        <Link
          href={buildDocCategoryHref(slug)}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-surface ${
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

  return (
    <div className="py-2">
      <button
        id={buttonId}
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-surface ${
          active
            ? 'text-xp-green'
            : 'text-ink-muted hover:bg-canvas-elevated hover:text-ink-primary'
        }`}
        style={active ? { background: 'rgba(76,175,80,0.12)', boxShadow: 'inset 2px 0 0 #4CAF50' } : undefined}
      >
        {icon && (
          <span className="h-4 w-4" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{title}</span>
        {isExpanded ? (
          <ChevronDown size={14} className="ml-auto" aria-hidden="true" />
        ) : (
          <ChevronRight size={14} className="ml-auto" aria-hidden="true" />
        )}
      </button>
      {isExpanded && (
        <div
          id={panelId}
          role="group"
          aria-labelledby={buttonId}
          className="mt-1 space-y-1 pl-2"
        >
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              href={item}
              label={item.label}
              description={item.description}
              active={item.id === activeItemId}
              onClick={onItemSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
