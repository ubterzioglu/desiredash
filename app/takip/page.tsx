'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Durum = 'Başlanmadı' | 'Devam Ediyor' | 'Bitti' | 'Bekliyor'
type Atanan = 'Burak' | 'UBT' | ''

interface Gorev {
  id: string
  gorev: string
  durum: Durum
  atanan: Atanan
  baslangic: string
  bitis: string
  aciklama: string
  link: string
}

const DURUM_STYLES: Record<Durum, { bg: string; color: string; border: string }> = {
  'Başlanmadı':  { bg: '#44444422', color: '#aaa',     border: '#44444444' },
  'Devam Ediyor':{ bg: '#7c6dfa22', color: '#7c6dfa',  border: '#7c6dfa44' },
  'Bitti':       { bg: '#2dd4a022', color: '#2dd4a0',  border: '#2dd4a044' },
  'Bekliyor':    { bg: '#f5a62322', color: '#f5a623',  border: '#f5a62344' },
}

const EMPTY: Omit<Gorev, 'id'> = {
  gorev: '', durum: 'Başlanmadı', atanan: '', baslangic: '', bitis: '', aciklama: '', link: '',
}

const input = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#e8e8f0',
  fontSize: 13,
  width: '100%',
  fontFamily: 'system-ui, sans-serif',
} as React.CSSProperties

export default function TakipPage() {
  const [rows, setRows]       = useState<Gorev[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft]     = useState<Partial<Gorev>>({})

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('gorevler')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setRows((data as Gorev[]) ?? [])
        setLoading(false)
      })
  }, [])

  function startEdit(row: Gorev) {
    setEditingId(row.id)
    setDraft({ ...row })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft({})
  }

  async function saveEdit(id: string) {
    if (!supabase) return
    setSaving(id)
    const { gorev, durum, atanan, baslangic, bitis, aciklama, link } = draft
    await supabase.from('gorevler').update({
      gorev, durum, atanan: atanan || null,
      baslangic: baslangic || null, bitis: bitis || null,
      aciklama: aciklama || null, link: link || null,
    }).eq('id', id)
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...draft } as Gorev : r)))
    setSaving(null)
    setEditingId(null)
    setDraft({})
  }

  async function addRow() {
    if (!supabase) return
    const { data } = await supabase.from('gorevler').insert([EMPTY]).select().single()
    if (data) {
      const newRow = data as Gorev
      setRows((prev) => [...prev, newRow])
      startEdit(newRow)
    }
  }

  async function deleteRow(id: string) {
    if (!supabase) return
    await supabase.from('gorevler').delete().eq('id', id)
    setRows((prev) => prev.filter((r) => r.id !== id))
    if (editingId === id) cancelEdit()
  }

  return (
    <div style={{ background: '#0f0f13', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#e8e8f0' }}>
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Görev Takip Tablosu</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>{rows.length} görev</div>
          </div>
          <button
            onClick={addRow}
            style={{ background: '#7c6dfa', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 16px', cursor: 'pointer' }}
          >
            + Görev Ekle
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#666', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Yükleniyor…</div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #2a2a38' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#1e1e28', borderBottom: '1px solid #2a2a38' }}>
                  {['Görev', 'Durum', 'Atanan', 'Başlangıç', 'Bitiş', 'Açıklama', 'Link', ''].map((h) => (
                    <th key={h} style={{ padding: '11px 12px', textAlign: 'left', color: '#666', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isEditing = editingId === row.id
                  const isSaving  = saving === row.id
                  const ds = DURUM_STYLES[isEditing ? (draft.durum ?? row.durum) : row.durum] ?? DURUM_STYLES['Başlanmadı']

                  return (
                    <tr
                      key={row.id}
                      style={{ borderBottom: '1px solid #1e1e28', background: isEditing ? '#ffffff06' : 'transparent' }}
                      onMouseEnter={(e) => { if (!isEditing) e.currentTarget.style.background = '#ffffff04' }}
                      onMouseLeave={(e) => { if (!isEditing) e.currentTarget.style.background = 'transparent' }}
                    >
                      {/* Görev */}
                      <td style={{ padding: '11px 12px', minWidth: 180 }}>
                        {isEditing ? (
                          <input style={input} value={draft.gorev ?? ''} placeholder="Görev adı..." autoFocus
                            onChange={(e) => setDraft((d) => ({ ...d, gorev: e.target.value }))} />
                        ) : (
                          <span style={{ color: '#e8e8f0', fontWeight: 500 }}>{row.gorev || <span style={{ color: '#444' }}>—</span>}</span>
                        )}
                      </td>

                      {/* Durum */}
                      <td style={{ padding: '11px 12px', whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <select value={draft.durum ?? row.durum}
                            onChange={(e) => setDraft((d) => ({ ...d, durum: e.target.value as Durum }))}
                            style={{ background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                          >
                            {(['Başlanmadı', 'Devam Ediyor', 'Bitti', 'Bekliyor'] as Durum[]).map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                            {row.durum}
                          </span>
                        )}
                      </td>

                      {/* Atanan */}
                      <td style={{ padding: '11px 12px' }}>
                        {isEditing ? (
                          <select value={draft.atanan ?? ''}
                            onChange={(e) => setDraft((d) => ({ ...d, atanan: e.target.value as Atanan }))}
                            style={{ background: '#1e1e28', color: '#ccc', border: '1px solid #2a2a38', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer', outline: 'none' }}
                          >
                            <option value="">—</option>
                            <option value="Burak">Burak</option>
                            <option value="UBT">UBT</option>
                          </select>
                        ) : (
                          <span style={{ color: '#ccc' }}>{row.atanan || '—'}</span>
                        )}
                      </td>

                      {/* Başlangıç */}
                      <td style={{ padding: '11px 12px' }}>
                        {isEditing ? (
                          <input type="date" style={{ ...input, color: '#ccc', width: 130 }}
                            value={draft.baslangic ?? ''}
                            onChange={(e) => setDraft((d) => ({ ...d, baslangic: e.target.value }))} />
                        ) : (
                          <span style={{ color: row.baslangic ? '#ccc' : '#444' }}>{row.baslangic || '—'}</span>
                        )}
                      </td>

                      {/* Bitiş */}
                      <td style={{ padding: '11px 12px' }}>
                        {isEditing ? (
                          <input type="date" style={{ ...input, color: '#ccc', width: 130 }}
                            value={draft.bitis ?? ''}
                            onChange={(e) => setDraft((d) => ({ ...d, bitis: e.target.value }))} />
                        ) : (
                          <span style={{ color: row.bitis ? '#ccc' : '#444' }}>{row.bitis || '—'}</span>
                        )}
                      </td>

                      {/* Açıklama */}
                      <td style={{ padding: '11px 12px', minWidth: 200 }}>
                        {isEditing ? (
                          <input style={input} value={draft.aciklama ?? ''} placeholder="Açıklama..."
                            onChange={(e) => setDraft((d) => ({ ...d, aciklama: e.target.value }))} />
                        ) : (
                          <span style={{ color: row.aciklama ? '#ccc' : '#444' }}>{row.aciklama || '—'}</span>
                        )}
                      </td>

                      {/* Link */}
                      <td style={{ padding: '11px 12px', minWidth: 160 }}>
                        {isEditing ? (
                          <input style={{ ...input, color: '#7c6dfa' }} value={draft.link ?? ''} placeholder="https://..."
                            onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))} />
                        ) : row.link ? (
                          <a href={row.link} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#7c6dfa', fontSize: 12, textDecoration: 'none' }}>
                            {row.link.replace(/^https?:\/\//, '').slice(0, 28)}{row.link.length > 35 ? '…' : ''} ↗
                          </a>
                        ) : (
                          <span style={{ color: '#444' }}>—</span>
                        )}
                      </td>

                      {/* Aksiyonlar */}
                      <td style={{ padding: '11px 12px', whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <span style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => saveEdit(row.id)} title="Kaydet"
                              style={{ background: '#2dd4a022', border: '1px solid #2dd4a044', borderRadius: 6, color: '#2dd4a0', cursor: 'pointer', fontSize: 13, padding: '3px 9px', fontWeight: 700 }}>
                              {isSaving ? '…' : '✓'}
                            </button>
                            <button onClick={cancelEdit} title="İptal"
                              style={{ background: 'none', border: '1px solid #2a2a38', borderRadius: 6, color: '#666', cursor: 'pointer', fontSize: 13, padding: '3px 9px' }}>
                              ✕
                            </button>
                          </span>
                        ) : (
                          <span style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => startEdit(row)} title="Düzenle"
                              style={{ background: 'none', border: '1px solid #2a2a38', borderRadius: 6, color: '#888', cursor: 'pointer', fontSize: 12, padding: '3px 8px' }}>
                              ✎
                            </button>
                            <button onClick={() => deleteRow(row.id)} title="Sil"
                              style={{ background: 'none', border: '1px solid #2a2a38', borderRadius: 6, color: '#555', cursor: 'pointer', fontSize: 12, padding: '3px 8px' }}>
                              🗑
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: 13 }}>
                      Henüz görev yok. "+ Görev Ekle" ile başlayın.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
