import { ReactNode, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Header from './Header'
import Sidebar from './Sidebar'

interface DocsShellProps {
  children: ReactNode
}

const DESKTOP_BREAKPOINT = '(min-width: 1024px)'

export default function DocsShell({ children }: DocsShellProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstSidebarToggleRef = useRef<HTMLButtonElement>(null)
  const previousSidebarOpenRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT)
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsDesktopViewport(event.matches)

      if (event.matches) {
        setIsSidebarOpen(false)
      }
    }

    setIsDesktopViewport(mediaQuery.matches)

    if (mediaQuery.matches) {
      setIsSidebarOpen(false)
    }

    mediaQuery.addEventListener('change', handleViewportChange)

    return () => mediaQuery.removeEventListener('change', handleViewportChange)
  }, [])

  useEffect(() => {
    if (!isSidebarOpen || isDesktopViewport || typeof window === 'undefined') {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)
    const focusFrame = window.requestAnimationFrame(() => {
      firstSidebarToggleRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isDesktopViewport, isSidebarOpen])

  useEffect(() => {
    if (
      previousSidebarOpenRef.current &&
      !isSidebarOpen &&
      !isDesktopViewport
    ) {
      menuButtonRef.current?.focus()
    }

    previousSidebarOpenRef.current = isSidebarOpen
  }, [isDesktopViewport, isSidebarOpen])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [router.asPath])

  return (
    <div className="docs-shell">
      <a
        href="#docs-main-content"
        className="sr-only fixed left-4 top-4 z-[60] rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>
      <Header
        isSidebarOpen={isSidebarOpen}
        menuButtonRef={menuButtonRef}
        onMenuToggle={() => setIsSidebarOpen((previousState) => !previousState)}
      />
      <Sidebar
        isDesktopViewport={isDesktopViewport}
        isOpen={isSidebarOpen}
        initialFocusRef={firstSidebarToggleRef}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main id="docs-main-content" tabIndex={-1} className="docs-shell-main">
        <div className="docs-shell-content">{children}</div>
      </main>
    </div>
  )
}
