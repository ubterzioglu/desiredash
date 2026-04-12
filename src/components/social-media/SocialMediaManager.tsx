'use client'

import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react'
import {
  SOCIAL_MEDIA_PLATFORMS,
  createEmptySocialMediaFormState,
  formatFollowerCount,
  formatSocialMediaTimestamp,
  getSocialMediaPlatformLabel,
  isRefreshablePlatform,
  toSocialMediaFormState,
  type SocialMediaAccount,
  type SocialMediaFormState,
} from '@/lib/social-media-items'

export default function SocialMediaManager() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<SocialMediaFormState>(
    createEmptySocialMediaFormState
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingState, setEditingState] = useState<SocialMediaFormState>(
    createEmptySocialMediaFormState
  )

  const isEditing = useMemo(() => editingId !== null, [editingId])

  useEffect(() => {
    void loadAccounts()
  }, [])

  async function loadAccounts() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/social-media')
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Sosyal medya listesi yuklenemedi.')
      }

      setAccounts(payload.accounts ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Sosyal medya listesi yuklenemedi.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Sosyal medya hesabi eklenemedi.')
      }

      setAccounts((previousAccounts) => [payload.account, ...previousAccounts])
      setFormState(createEmptySocialMediaFormState())
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Sosyal medya hesabi eklenemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEdit(account: SocialMediaAccount) {
    setEditingId(account.id)
    setEditingState(toSocialMediaFormState(account))
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingState(createEmptySocialMediaFormState())
  }

  async function handleUpdate(accountId: string) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/social-media/${accountId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingState),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Sosyal medya hesabi guncellenemedi.')
      }

      setAccounts((previousAccounts) =>
        previousAccounts.map((account) =>
          account.id === accountId ? payload.account : account
        )
      )
      cancelEdit()
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Sosyal medya hesabi guncellenemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(accountId: string) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Bu sosyal medya hesabi silinsin mi?')
    ) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/social-media/${accountId}`, {
        method: 'DELETE',
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Sosyal medya hesabi silinemedi.')
      }

      setAccounts((previousAccounts) =>
        previousAccounts.filter((account) => account.id !== accountId)
      )
      if (editingId === accountId) {
        cancelEdit()
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Sosyal medya hesabi silinemedi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRefresh(accountId: string) {
    setRefreshingId(accountId)
    setError(null)

    try {
      const response = await fetch(`/api/social-media/${accountId}/refresh`, {
        method: 'POST',
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Takipci sayisi guncellenemedi.')
      }

      setAccounts((previousAccounts) =>
        previousAccounts.map((account) =>
          account.id === accountId ? payload.account : account
        )
      )
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : 'Takipci sayisi guncellenemedi.'
      )
    } finally {
      setRefreshingId(null)
    }
  }

  return (
    <section className="space-y-6" aria-labelledby="social-media-manager-heading">
      <div className="space-y-2">
        <h2
          id="social-media-manager-heading"
          className="text-xl font-semibold text-ink-primary"
        >
          Sosyal Medya Listesi
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Hesap linklerini tek yerden yonet, gerekli oldugunda takipci sayisini cek ve
          haftalik refresh endpoint&apos;i icin kayitlari hazir tut.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-lg border border-canvas-border bg-canvas-surface p-5 md:grid-cols-2 xl:grid-cols-[0.8fr_1fr_1.4fr]"
      >
        <label className="space-y-2">
          <span className="text-sm font-medium text-ink-primary">Platform</span>
          <select
            value={formState.platform}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                platform: event.target.value as SocialMediaFormState['platform'],
              }))
            }
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors focus:border-xp-blue"
          >
            {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {getSocialMediaPlatformLabel(platform)}
              </option>
            ))}
          </select>
        </label>

        <TextField
          label="Hesap adi"
          value={formState.hesapAdi}
          onChange={(value) =>
            setFormState((previousState) => ({
              ...previousState,
              hesapAdi: value,
            }))
          }
          placeholder="@kullanici veya kanal adi"
          required
        />

        <TextField
          label="Link"
          value={formState.link}
          onChange={(value) =>
            setFormState((previousState) => ({
              ...previousState,
              link: value,
            }))
          }
          placeholder="https://..."
          required
        />

        <label className="space-y-2 md:col-span-2 xl:col-span-3">
          <span className="text-sm font-medium text-ink-primary">Yorumlar</span>
          <textarea
            value={formState.yorumlar}
            onChange={(event) =>
              setFormState((previousState) => ({
                ...previousState,
                yorumlar: event.target.value,
              }))
            }
            placeholder="Kampanya notu, hesap aciklamasi veya takip edilmesi gereken detay"
            rows={4}
            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
          />
        </label>

        <div className="flex items-end justify-end md:col-span-2 xl:col-span-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-xp-blue px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} aria-hidden="true" />
            {isSubmitting ? 'Kaydediliyor...' : 'Yeni ekle'}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-xp-red/40 bg-xp-red/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-lg border border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Sosyal medya listesi yukleniyor...
          </div>
        ) : accounts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-canvas-border bg-canvas-surface px-4 py-6 text-sm text-ink-muted">
            Henuz sosyal medya hesabi yok. Ilk kaydi ustteki formdan ekleyebilirsin.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-canvas-border bg-canvas-surface md:block">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-canvas-elevated text-left text-xs uppercase tracking-[0.16em] text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Platform</th>
                    <th className="px-4 py-3 font-semibold">Hesap</th>
                    <th className="px-4 py-3 font-semibold">Link</th>
                    <th className="px-4 py-3 font-semibold">Takipci</th>
                    <th className="px-4 py-3 font-semibold">Son kontrol</th>
                    <th className="px-4 py-3 font-semibold">Durum</th>
                    <th className="px-4 py-3 font-semibold">Yorumlar</th>
                    <th className="px-4 py-3 font-semibold">Islemler</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => {
                    const rowIsEditing = editingId === account.id
                    const isRowRefreshing = refreshingId === account.id

                    return (
                      <tr key={account.id} className="border-t border-canvas-border align-top">
                        <td className="px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <select
                              value={editingState.platform}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  platform:
                                    event.target.value as SocialMediaFormState['platform'],
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            >
                              {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                                <option key={platform} value={platform}>
                                  {getSocialMediaPlatformLabel(platform)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            getSocialMediaPlatformLabel(account.platform)
                          )}
                        </td>
                        <EditableCell
                          editing={rowIsEditing}
                          value={rowIsEditing ? editingState.hesapAdi : account.hesapAdi}
                          onChange={(value) =>
                            setEditingState((previousState) => ({
                              ...previousState,
                              hesapAdi: value,
                            }))
                          }
                          required
                        />
                        <td className="max-w-sm px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <input
                              type="url"
                              value={editingState.link}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  link: event.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            <a
                              href={account.link}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-xp-blue transition-opacity hover:opacity-80"
                            >
                              {account.link}
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-primary">
                          {formatFollowerCount(account.takipciSayisi)}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {formatSocialMediaTimestamp(account.sonKontrolAt)}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">{account.durum}</td>
                        <td className="max-w-sm px-4 py-3 text-ink-muted">
                          {rowIsEditing ? (
                            <textarea
                              value={editingState.yorumlar}
                              onChange={(event) =>
                                setEditingState((previousState) => ({
                                  ...previousState,
                                  yorumlar: event.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                            />
                          ) : (
                            account.yorumlar ?? '-'
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {rowIsEditing ? (
                              <>
                                <ActionButton
                                  icon={<Save size={14} aria-hidden="true" />}
                                  label="Kaydet"
                                  onClick={() => void handleUpdate(account.id)}
                                  disabled={isSubmitting}
                                  tone="success"
                                />
                                <ActionButton
                                  icon={<X size={14} aria-hidden="true" />}
                                  label="Iptal"
                                  onClick={cancelEdit}
                                  disabled={isSubmitting}
                                  tone="neutral"
                                />
                              </>
                            ) : (
                              <ActionButton
                                icon={<Pencil size={14} aria-hidden="true" />}
                                label="Duzenle"
                                onClick={() => startEdit(account)}
                                disabled={isSubmitting || isEditing || isRowRefreshing}
                                tone="neutral"
                              />
                            )}

                            <ActionButton
                              icon={<RefreshCw size={14} aria-hidden="true" />}
                              label={isRowRefreshing ? 'Cekiliyor...' : 'Guncelle'}
                              onClick={() => void handleRefresh(account.id)}
                              disabled={
                                isSubmitting ||
                                isRowRefreshing ||
                                !isRefreshablePlatform(account.platform)
                              }
                              tone="info"
                            />

                            <ActionButton
                              icon={<Trash2 size={14} aria-hidden="true" />}
                              label="Sil"
                              onClick={() => void handleDelete(account.id)}
                              disabled={isSubmitting || isRowRefreshing}
                              tone="danger"
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {accounts.map((account) => {
                const rowIsEditing = editingId === account.id
                const isRowRefreshing = refreshingId === account.id

                return (
                  <div
                    key={account.id}
                    className="space-y-3 rounded-lg border border-canvas-border bg-canvas-surface p-4"
                  >
                    {rowIsEditing ? (
                      <div className="grid gap-3">
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-ink-primary">
                            Platform
                          </span>
                          <select
                            value={editingState.platform}
                            onChange={(event) =>
                              setEditingState((previousState) => ({
                                ...previousState,
                                platform:
                                  event.target.value as SocialMediaFormState['platform'],
                              }))
                            }
                            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                          >
                            {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                              <option key={platform} value={platform}>
                                {getSocialMediaPlatformLabel(platform)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <TextField
                          label="Hesap adi"
                          value={editingState.hesapAdi}
                          onChange={(value) =>
                            setEditingState((previousState) => ({
                              ...previousState,
                              hesapAdi: value,
                            }))
                          }
                          required
                        />
                        <TextField
                          label="Link"
                          value={editingState.link}
                          onChange={(value) =>
                            setEditingState((previousState) => ({
                              ...previousState,
                              link: value,
                            }))
                          }
                          required
                        />
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-ink-primary">
                            Yorumlar
                          </span>
                          <textarea
                            value={editingState.yorumlar}
                            onChange={(event) =>
                              setEditingState((previousState) => ({
                                ...previousState,
                                yorumlar: event.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
                          />
                        </label>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-ink-primary">
                            {account.hesapAdi}
                          </h3>
                          <a
                            href={account.link}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-sm text-xp-blue transition-opacity hover:opacity-80"
                          >
                            {account.link}
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <InfoPair
                            label="Platform"
                            value={getSocialMediaPlatformLabel(account.platform)}
                          />
                          <InfoPair
                            label="Takipci"
                            value={formatFollowerCount(account.takipciSayisi)}
                          />
                          <InfoPair
                            label="Durum"
                            value={account.durum}
                          />
                          <InfoPair
                            label="Son kontrol"
                            value={formatSocialMediaTimestamp(account.sonKontrolAt)}
                          />
                        </div>

                        <p className="text-sm text-ink-muted">
                          {account.yorumlar ?? 'Yorum yok'}
                        </p>
                      </>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {rowIsEditing ? (
                        <>
                          <ActionButton
                            icon={<Save size={14} aria-hidden="true" />}
                            label="Kaydet"
                            onClick={() => void handleUpdate(account.id)}
                            disabled={isSubmitting}
                            tone="success"
                          />
                          <ActionButton
                            icon={<X size={14} aria-hidden="true" />}
                            label="Iptal"
                            onClick={cancelEdit}
                            disabled={isSubmitting}
                            tone="neutral"
                          />
                        </>
                      ) : (
                        <ActionButton
                          icon={<Pencil size={14} aria-hidden="true" />}
                          label="Duzenle"
                          onClick={() => startEdit(account)}
                          disabled={isSubmitting || isEditing || isRowRefreshing}
                          tone="neutral"
                        />
                      )}

                      <ActionButton
                        icon={<RefreshCw size={14} aria-hidden="true" />}
                        label={isRowRefreshing ? 'Cekiliyor...' : 'Guncelle'}
                        onClick={() => void handleRefresh(account.id)}
                        disabled={
                          isSubmitting ||
                          isRowRefreshing ||
                          !isRefreshablePlatform(account.platform)
                        }
                        tone="info"
                      />

                      <ActionButton
                        icon={<Trash2 size={14} aria-hidden="true" />}
                        label="Sil"
                        onClick={() => void handleDelete(account.id)}
                        disabled={isSubmitting || isRowRefreshing}
                        tone="danger"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-ink-primary">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted/50 focus:border-xp-blue"
      />
    </label>
  )
}

function EditableCell({
  editing,
  value,
  onChange,
  required,
}: {
  editing: boolean
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <td className="px-4 py-3 text-ink-muted">
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className="w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-xp-blue"
        />
      ) : (
        <span className="text-ink-primary">{value}</span>
      )}
    </td>
  )
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </p>
      <p className="text-sm text-ink-primary">{value}</p>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  tone,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  tone: 'neutral' | 'success' | 'danger' | 'info'
}) {
  const toneClasses =
    tone === 'success'
      ? 'border-xp-green/40 bg-xp-green/10 text-xp-green'
      : tone === 'danger'
        ? 'border-xp-red/40 bg-xp-red/10 text-red-200'
        : tone === 'info'
          ? 'border-xp-blue/40 bg-xp-blue/10 text-xp-blue'
          : 'border-canvas-border text-ink-muted hover:text-ink-primary'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses}`}
    >
      {icon}
      {label}
    </button>
  )
}
