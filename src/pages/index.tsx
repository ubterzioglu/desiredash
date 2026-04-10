import DocsShell from '@/components/layout/DocsShell'
import MainContent from '@/components/layout/MainContent'

export default function Home() {
  return (
    <DocsShell>
      <div className="docs-main-column">
        <MainContent />
      </div>
    </DocsShell>
  )
}
