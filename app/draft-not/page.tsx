'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type KimsinSen = 'BA' | 'UBT'

interface Not {
  id: string
  icerik: string
  kimsin_sen: KimsinSen
  created_at: string
}

const SECENEKLER: KimsinSen[] = ['BA', 'UBT']

export default function DraftNotPage() {
  const [notlar, setNotlar] = useState<Not[]>([])
  const [metin, setMetin] = useState('')
  const [kimsinSen, setKimsinSen] = useState<KimsinSen>('BA')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('draft_notlar')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setNotlar((data as Not[]) ?? [])
        setLoading(false)
      })
  }, [])

  async function ekle() {
    if (!supabase) return

    const temiz = metin.trim()
    if (!temiz) return

    setSaving(true)

    const { data } = await supabase
      .from('draft_notlar')
      .insert([{ icerik: temiz, kimsin_sen: kimsinSen }])
      .select()
      .single()

    if (data) {
      setNotlar((prev) => [data as Not, ...prev])
    }

    setMetin('')
    setKimsinSen('BA')
    setSaving(false)
    textareaRef.current?.focus()
  }

  async function sil(id: string) {
    if (!supabase) return

    setDeleting(id)
    await supabase.from('draft_notlar').delete().eq('id', id)
    setNotlar((prev) => prev.filter((not) => not.id !== id))
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      ekle()
    }
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
          <div style={{ fontSize: 18, fontWeight: 700 }}>Draft Notlar</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Aklına geleni yaz, kaydet. Ctrl+Enter ile hızlı ekle.
          </div>
        </div>

        <div
          style={{
            background: '#18181f',
            border: '1px solid #2a2a38',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 24,
          }}
        >
          <textarea
            ref={textareaRef}
            value={metin}
            onChange={(e) => setMetin(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Notunu buraya yaz..."
            rows={5}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e8e8f0',
              fontSize: 14,
              padding: '16px 18px',
              resize: 'vertical',
              fontFamily: 'system-ui, sans-serif',
              lineHeight: 1.7,
              boxSizing: 'border-box',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderTop: '1px solid #2a2a38',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#8f90a6', fontWeight: 600 }}>Kimsin Sen?</span>
              {SECENEKLER.map((secenek) => {
                const aktif = kimsinSen === secenek

                return (
                  <label
                    key={secenek}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      color: aktif ? '#fff' : '#9ea0b8',
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="radio"
                      name="kimsin-sen"
                      value={secenek}
                      checked={aktif}
                      onChange={() => setKimsinSen(secenek)}
                      style={{ accentColor: '#7c6dfa' }}
                    />
                    {secenek}
                  </label>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {metin.trim() && (
                <button
                  onClick={() => setMetin('')}
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
                disabled={saving || !metin.trim()}
                style={{
                  background: saving || !metin.trim() ? '#7c6dfa44' : '#7c6dfa',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '7px 20px',
                  cursor: saving || !metin.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Kaydediliyor...' : '+ Ekle'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
            Yükleniyor...
          </div>
        ) : notlar.length === 0 ? (
          <div style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
            Henüz not yok. İlk notunu ekle.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notlar.map((not) => (
              <div
                key={not.id}
                style={{
                  background: '#18181f',
                  border: '1px solid #2a2a38',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 28,
                      padding: '0 10px',
                      borderRadius: 999,
                      background: '#232334',
                      color: '#c8c9de',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                    }}
                  >
                    {not.kimsin_sen}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#e8e8f0',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {not.icerik}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <span style={{ fontSize: 11, color: '#444' }}>{formatTarih(not.created_at)}</span>
                  <button
                    onClick={() => sil(not.id)}
                    disabled={deleting === not.id}
                    style={{
                      background: 'none',
                      border: '1px solid #2a2a38',
                      borderRadius: 6,
                      color: deleting === not.id ? '#666' : '#555',
                      cursor: 'pointer',
                      fontSize: 11,
                      padding: '2px 8px',
                    }}
                  >
                    {deleting === not.id ? '...' : 'Sil'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
