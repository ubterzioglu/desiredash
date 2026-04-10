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
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--docs-header-height)] border-b border-canvas-border bg-canvas-elevated/95 backdrop-blur" style={{ boxShadow: '0 1px 0 0 #1E3A5F' }}>
      {/* Windows XP 4-colour flag stripe */}
      <div className="absolute inset-x-0 top-0 h-[3px] flex">
        <div className="flex-1" style={{ background: '#CC3300' }} />
        <div className="flex-1" style={{ background: '#4CAF50' }} />
        <div className="flex-1" style={{ background: '#1A6DC2' }} />
        <div className="flex-1" style={{ background: '#F5A500' }} />
      </div>
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
          <span className="text-sm font-medium px-2.5 py-1 rounded" style={{ background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.3)', color: '#4CAF50' }}>
            project board
          </span>
        </div>
      </div>
    </header>
  )
}
