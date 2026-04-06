import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CorteQS',
  description: 'CorteQS Dashboard & Project Status',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, background: '#0f0f13', color: '#e8e8f0', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
