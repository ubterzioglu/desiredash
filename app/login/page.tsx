'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
    } else {
      setError('Hatalı şifre')
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f13',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#18181f',
        border: '1px solid #2a2a38',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 360,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e8e8f0', letterSpacing: '-0.5px' }}>
            Corte<span style={{ color: '#7c6dfa' }}>QS</span>
          </h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 6 }}>Devam etmek için şifrenizi girin</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 14px',
              background: '#0f0f13',
              border: `1px solid ${error ? '#f06b4a' : '#2a2a38'}`,
              borderRadius: 8,
              color: '#e8e8f0',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <p style={{ color: '#f06b4a', fontSize: 12, marginTop: 8 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              marginTop: 16,
              padding: '12px',
              background: '#7c6dfa',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.6 : 1,
            }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </main>
  )
}
