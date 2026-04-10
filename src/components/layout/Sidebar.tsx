import type { RefObject } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SidebarCategory from './SidebarCategory'
import { getDocsCategories } from '@/lib/docs-data'
import { getDocIcon } from '@/lib/docs-icons'
import {
  createExpandedCategoryState,
  getDocsRouteState,
  syncExpandedCategoryState,
} from '@/lib/docs-navigation'

interface SidebarProps {
  isDesktopViewport: boolean
  isOpen: boolean
  initialFocusRef: RefObject<HTMLButtonElement>
  onClose: () => void
}

export default function Sidebar({
  isDesktopViewport,
  isOpen,
  initialFocusRef,
  onClose,
}: SidebarProps) {
  const router = useRouter()
  const { activeCategorySlug, activeItemId } = getDocsRouteState(router.asPath)
  const docsCategories = getDocsCategories()
  const [expandedCategories, setExpandedCategories] = useState(() =>
    createExpandedCategoryState(activeCategorySlug)
  )
  const isSidebarVisible = isDesktopViewport || isOpen

  useEffect(() => {
    setExpandedCategories((previousState) =>
      syncExpandedCategoryState(previousState, activeCategorySlug)
    )
  }, [activeCategorySlug])

  return (
    <>
      {!isDesktopViewport && isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-label="Close documentation navigation"
        />
      )}
      <aside
        id="docs-sidebar"
        className={`fixed left-0 top-[var(--docs-header-height)] z-40 h-[calc(100vh-var(--docs-header-height))] w-[var(--docs-sidebar-width)] border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarVisible
            ? 'visible translate-x-0'
            : 'invisible -translate-x-full lg:visible lg:translate-x-0'
        }`}
      >
        <nav
          aria-label="Documentation navigation"
          className="h-full overflow-y-auto px-3 py-4 [overscroll-behavior:contain]"
        >
          <div className="space-y-1">
            {docsCategories.map((category, index) => {
              const Icon = getDocIcon(category.iconKey)

              return (
                <SidebarCategory
                  key={category.slug}
                  slug={category.slug}
                  title={category.label}
                  icon={<Icon size={16} />}
                  items={category.items}
                  active={category.slug === activeCategorySlug}
                  activeItemId={activeItemId}
                  isExpanded={expandedCategories[category.slug]}
                  buttonRef={index === 0 ? initialFocusRef : undefined}
                  onToggle={() =>
                    setExpandedCategories((previousState) => ({
                      ...previousState,
                      [category.slug]:
                        category.slug === activeCategorySlug
                          ? true
                          : !previousState[category.slug],
                    }))
                  }
                  onItemSelect={onClose}
                />
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}
