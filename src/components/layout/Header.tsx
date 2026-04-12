import type { RefObject } from 'react'
import Link from 'next/link'
import { Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
  menuButtonRef: RefObject<HTMLButtonElement>
  isSidebarCollapsed: boolean
  onSidebarCollapseToggle: () => void
}

export default function Header({
  onMenuToggle,
  isSidebarOpen,
  menuButtonRef,
  isSidebarCollapsed,
  onSidebarCollapseToggle,
}: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--docs-header-height)] border-b border-canvas-border bg-canvas-elevated/95 backdrop-blur-sm" style={{ boxShadow: '0 1px 0 0 #1F1F1F' }}>
      {/* Windows XP 4-colour flag stripe */}
      <div className="absolute inset-x-0 top-0 h-[3px] flex">
        <div className="flex-1" style={{ background: '#CC3300' }} />
        <div className="flex-1" style={{ background: '#4CAF50' }} />
        <div className="flex-1" style={{ background: '#1A6DC2' }} />
        <div className="flex-1" style={{ background: '#F5A500' }} />
      </div>
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
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

          {/* Desktop sidebar collapse toggle */}
          <button
            type="button"
            onClick={onSidebarCollapseToggle}
            className="hidden lg:inline-flex rounded-lg p-2 text-ink-muted transition-colors hover:bg-canvas-base hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-elevated"
            aria-label={isSidebarCollapsed ? "Sidebar'ı aç" : "Sidebar'ı kapat"}
            aria-controls="docs-sidebar"
            aria-expanded={!isSidebarCollapsed}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={20} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={20} aria-hidden="true" />
            )}
          </button>

          <Link
            href="/"
            className="rounded-md text-sm font-semibold text-ink-primary transition-colors hover:text-xp-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-elevated"
          >
            desiremap.de
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium italic text-ink-muted">
            DesireMap&apos;le zevkten dört köşe olun...
          </span>
        </div>
      </div>
    </header>
  )
}
