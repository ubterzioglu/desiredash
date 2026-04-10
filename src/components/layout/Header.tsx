import type { RefObject } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
  menuButtonRef: RefObject<HTMLButtonElement>
}

export default function Header({
  onMenuToggle,
  isSidebarOpen,
  menuButtonRef,
}: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--docs-header-height)] border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenuToggle}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 lg:hidden"
            aria-label={
              isSidebarOpen
                ? 'Close documentation navigation'
                : 'Open documentation navigation'
            }
            aria-expanded={isSidebarOpen}
            aria-controls="docs-sidebar"
          >
            {isSidebarOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
          <Link
            href="/"
            className="rounded-md text-xl font-semibold text-gray-900 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            DesireMap Workspace
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            project board
          </span>
        </div>
      </div>
    </header>
  )
}
