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
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--docs-header-height)] border-b border-canvas-border bg-canvas-elevated/95 backdrop-blur" style={{ boxShadow: '0 1px 0 0 #1E3A5F, inset 0 3px 0 0 #1A6DC2' }}>
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-canvas-base hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-elevated lg:hidden"
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
            className="rounded-md text-xl font-semibold text-ink-primary transition-colors hover:text-xp-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-elevated"
          >
            DesireMap Workspace
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-muted bg-canvas-surface border border-canvas-border px-2 py-1 rounded">
            project board
          </span>
        </div>
      </div>
    </header>
  )
}
