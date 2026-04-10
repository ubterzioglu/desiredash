import { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { DocNavItem } from '@/lib/docs-data'
import { buildDocItemHref } from '@/lib/docs-navigation'

interface SidebarItemProps {
  href: Pick<DocNavItem, 'categorySlug' | 'id'>
  icon?: ReactNode
  label: string
  description?: string
  active?: boolean
  onClick?: () => void
}

export default function SidebarItem({
  href,
  icon,
  label,
  description,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      href={buildDocItemHref(href)}
      onClick={onClick}
      className={`sidebar-item group w-full text-left ${active ? 'active' : ''}`}
      title={description}
      aria-current={active ? 'page' : undefined}
    >
      {icon && (
        <span className="h-5 w-5" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
      <ChevronRight
        size={16}
        className="ml-auto opacity-50 transition-opacity group-hover:opacity-80"
        aria-hidden="true"
      />
    </Link>
  )
}
