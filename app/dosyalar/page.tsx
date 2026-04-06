'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface DosyaLink {
  id: string
  baslik: string
  url: string
  created_at: string
}

export default function DosyalarPage() {
  const [dosyalar, setDosyalar] = useState<DosyaLink[]>([])
  const [baslik, setBaslik] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('dosya_linkler')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDosyalar((data as DosyaLink[]) ?? [])
        setLoading(false)
      })
  }, [])

  async function ekle() {
    if (!supabase || !baslik.trim() || !url.trim()) return

    setSaving(true)

    const { data } = await supabase
      .from('dosya_linkler')
      .insert([{ baslik: baslik.trim(), url: url.trim() }])
      .select()
      .single()

    if (data) {
      setDosyalar((prev) => [data as DosyaLink, ...prev])
      setBaslik('')
      setUrl('')
    }

    setSaving(false)
  }

  async function sil(id: string) {
    if (!supabase) return

    setDeleting(id)
    await supabase.from('dosya_linkler').delete().eq('id', id)
    setDosyalar((prev) => prev.filter((d) => d.id !== id))
    setDeleting(null)
  }

  function formatTarih(iso: string) {
    return new Date(iso).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      style={{
        background: '#0f0f13',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: '#e8e8f0',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Dökümanlar & Linkler</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Dosya başlığı ve link ekle, direkt listeye geçecek.
          </div>
        </div>

        <div
          style={{
            background: '#18181f',
            border: '1px solid #2a2a38',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 24,
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8f90a6', fontWeight: 600, marginBottom: 6 }}>
                Başlık
              </label>
              <input
                type="text"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                placeholder="Dokuman/Link başlığı..."
                style={{
                  width: '100%',
                  background: '#0f0f13',
                  border: '1px solid #2a2a38',
                  borderRadius: 8,
                  color: '#e8e8f0',
                  fontSize: 14,
                  padding: '10px 12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'system-ui, sans-serif',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8f90a6', fontWeight: 600, marginBottom: 6 }}>
                Link
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  background: '#0f0f13',
                  border: '1px solid #2a2a38',
                  borderRadius: 8,
                  color: '#e8e8f0',
                  fontSize: 14,
                  padding: '10px 12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'system-ui, sans-serif',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {(baslik.trim() || url.trim()) && (
                <button
                  onClick={() => {
                    setBaslik('')
                    setUrl('')
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid #2a2a38',
                    borderRadius: 8,
                    color: '#666',
                    fontSize: 13,
                    padding: '7px 14px',
                    cursor: 'pointer',
                  }}
                >
                  Temizle
                </button>
              )}
              <button
                onClick={ekle}
                disabled={saving || !baslik.trim() || !url.trim()}
                style={{
                  background: saving || !baslik.trim() || !url.trim() ? '#7c6dfa44' : '#7c6dfa',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '7px 20px',
                  cursor: saving || !baslik.trim() || !url.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Ekleniyor...' : '+ Ekle'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
            Yükleniyor...
          </div>
        ) : dosyalar.length === 0 ? (
          <div style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
            Henüz döküman yok. İlk linkini ekle.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dosyalar.map((dosya) => (
              <a
                key={dosya.id}
                href={dosya.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#18181f',
                  border: '1px solid #2a2a38',
                  borderRadius: 10,
                  padding: '14px 16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1e1e2a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#18181f'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#e8e8f0', fontWeight: 500, marginBottom: 4 }}>
                    {dosya.baslik}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#7c6dfa',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {dosya.url}
                  </div>
                  <div style={{ fontSize: 11, color: '#444', marginTop: 6 }}>
                    {formatTarih(dosya.created_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    sil(dosya.id)
                  }}
                  disabled={deleting === dosya.id}
                  style={{
                    background: 'none',
                    border: '1px solid #2a2a38',
                    borderRadius: 6,
                    color: deleting === dosya.id ? '#666' : '#555',
                    cursor: 'pointer',
                    fontSize: 11,
                    padding: '2px 8px',
                    flexShrink: 0,
                  }}
                >
                  {deleting === dosya.id ? '...' : 'Sil'}
                </button>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
