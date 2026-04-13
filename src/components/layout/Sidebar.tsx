import type { RefObject } from 'react'
import { useRouter } from 'next/router'
import SidebarCategory from './SidebarCategory'
import { getDocsCategories, type DocCategorySlug } from '@/lib/docs-data'
import { getDocIcon } from '@/lib/docs-icons'
import { getDocsRouteState } from '@/lib/docs-navigation'

const UNREADY_CATEGORY_SLUGS: DocCategorySlug[] = [
  'milestones',
  'proje-takip',
  'proje-status',
]

interface SidebarProps {
  isDesktopViewport: boolean
  isOpen: boolean
  initialFocusRef: RefObject<HTMLAnchorElement>
  onClose: () => void
  isCollapsed?: boolean
}

export default function Sidebar({
  isDesktopViewport,
  isOpen,
  initialFocusRef,
  onClose,
  isCollapsed = false,
}: SidebarProps) {
  const router = useRouter()
  const { activeCategorySlug } = getDocsRouteState(router.asPath)
  const docsCategories = getDocsCategories()
  const orderedDocsCategories = [...docsCategories].sort((a, b) => {
    const aIsUnready = UNREADY_CATEGORY_SLUGS.includes(a.slug)
    const bIsUnready = UNREADY_CATEGORY_SLUGS.includes(b.slug)

    if (aIsUnready === bIsUnready) {
      return 0
    }

    return aIsUnready ? 1 : -1
  })
  const isSidebarVisible = isDesktopViewport ? !isCollapsed : isOpen

  return (
    <>
      {!isDesktopViewport && isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-canvas-base/70 lg:hidden"
          onClick={onClose}
          aria-label="Close documentation navigation"
        />
      )}
      <aside
        id="docs-sidebar"
        className={`fixed left-0 top-[var(--docs-header-height)] z-40 h-[calc(100vh-var(--docs-header-height))] w-[var(--docs-sidebar-width)] border-r border-canvas-border bg-canvas-surface transition-transform duration-300 ease-in-out ${
          isSidebarVisible
            ? 'visible translate-x-0'
            : 'invisible -translate-x-full'
        }`}
      >
        <nav
          aria-label="Documentation navigation"
          className="h-full overflow-y-auto px-3 py-4 [overscroll-behavior:contain]"
        >
          <div className="space-y-1">
            {orderedDocsCategories.map((category, index) => {
              const Icon = getDocIcon(category.iconKey)
              const isUnready = UNREADY_CATEGORY_SLUGS.includes(category.slug)
              const prevCategory = index > 0 ? orderedDocsCategories[index - 1] : null
              const isPrevUnready = prevCategory ? UNREADY_CATEGORY_SLUGS.includes(prevCategory.slug) : false
              const shouldShowUnreadyHeader = isUnready && !isPrevUnready

              return (
                <div key={category.slug}>
                  {shouldShowUnreadyHeader && (
                    <div className="pt-4 pb-2">
                      <h3 className="px-3 text-xs font-semibold text-content-secondary uppercase tracking-wider">
                        HENÜZ HAZIR OLMAYAN BÖLÜMLER
                      </h3>
                    </div>
                  )}
                  <SidebarCategory
                    slug={category.slug}
                    title={category.label}
                    icon={<Icon size={13} />}
                    active={category.slug === activeCategorySlug}
                    linkRef={index === 0 ? initialFocusRef : undefined}
                    onSelect={onClose}
                  />
                </div>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}
