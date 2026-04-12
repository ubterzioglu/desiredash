export const SOCIAL_MEDIA_PLATFORMS = [
  'instagram',
  'tiktok',
  'youtube',
  'x',
  'other',
] as const

export const SOCIAL_MEDIA_STATUSES = [
  'Hazir',
  'Guncel',
  'Desteklenmiyor',
  'Engellendi',
  'Hata',
] as const

export type SocialMediaPlatform = (typeof SOCIAL_MEDIA_PLATFORMS)[number]
export type SocialMediaStatus = (typeof SOCIAL_MEDIA_STATUSES)[number]

export interface SocialMediaAccountRow {
  id: string
  platform: SocialMediaPlatform
  hesap_adi: string
  link: string
  takipci_sayisi: number | null
  son_kontrol_at: string | null
  durum: SocialMediaStatus
  yorumlar: string | null
  created_at: string
  updated_at: string
}

export interface SocialMediaAccount {
  id: string
  platform: SocialMediaPlatform
  hesapAdi: string
  link: string
  takipciSayisi: number | null
  sonKontrolAt: string | null
  durum: SocialMediaStatus
  yorumlar: string | null
  createdAt: string
  updatedAt: string
}

export interface SocialMediaMutationInput {
  platform: SocialMediaPlatform
  hesapAdi: string
  link: string
  yorumlar: string | null
}

export interface SocialMediaFormState {
  platform: SocialMediaPlatform
  hesapAdi: string
  link: string
  yorumlar: string
}

export function createEmptySocialMediaFormState(): SocialMediaFormState {
  return {
    platform: 'instagram',
    hesapAdi: '',
    link: '',
    yorumlar: '',
  }
}

export function mapSocialMediaRow(
  row: SocialMediaAccountRow
): SocialMediaAccount {
  return {
    id: row.id,
    platform: row.platform,
    hesapAdi: row.hesap_adi,
    link: row.link,
    takipciSayisi: row.takipci_sayisi,
    sonKontrolAt: row.son_kontrol_at,
    durum: row.durum,
    yorumlar: row.yorumlar,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function isSocialMediaPlatform(
  value: unknown
): value is SocialMediaPlatform {
  return (
    typeof value === 'string' &&
    SOCIAL_MEDIA_PLATFORMS.includes(value as SocialMediaPlatform)
  )
}

export function isSocialMediaStatus(value: unknown): value is SocialMediaStatus {
  return (
    typeof value === 'string' &&
    SOCIAL_MEDIA_STATUSES.includes(value as SocialMediaStatus)
  )
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsedUrl = new URL(value)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeSocialMediaMutationInput(
  payload: unknown,
  options?: { partial?: boolean }
):
  | { ok: true; value: Partial<SocialMediaMutationInput> }
  | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Gecersiz istek govdesi.' }
  }

  const body = payload as Record<string, unknown>
  const partial = options?.partial ?? false
  const nextValue: Partial<SocialMediaMutationInput> = {}

  if ('platform' in body || !partial) {
    if (!isSocialMediaPlatform(body.platform)) {
      return { ok: false, error: 'Platform alani gecersiz.' }
    }

    nextValue.platform = body.platform
  }

  if ('hesapAdi' in body || !partial) {
    const rawHesapAdi = body.hesapAdi
    if (typeof rawHesapAdi !== 'string' || rawHesapAdi.trim().length === 0) {
      return { ok: false, error: 'Hesap adi zorunludur.' }
    }

    nextValue.hesapAdi = rawHesapAdi.trim()
  }

  if ('link' in body || !partial) {
    const rawLink = body.link
    if (typeof rawLink !== 'string' || rawLink.trim().length === 0) {
      return { ok: false, error: 'Link zorunludur.' }
    }

    const normalizedLink = rawLink.trim()
    if (!isValidHttpUrl(normalizedLink)) {
      return { ok: false, error: 'Link gecerli bir URL olmali.' }
    }

    nextValue.link = normalizedLink
  }

  if ('yorumlar' in body || !partial) {
    const rawYorumlar = body.yorumlar
    if (rawYorumlar === '' || rawYorumlar === null || rawYorumlar === undefined) {
      nextValue.yorumlar = null
    } else if (typeof rawYorumlar === 'string') {
      const trimmed = rawYorumlar.trim()
      nextValue.yorumlar = trimmed.length > 0 ? trimmed : null
    } else {
      return { ok: false, error: 'Yorumlar alani gecersiz.' }
    }
  }

  if (partial && Object.keys(nextValue).length === 0) {
    return { ok: false, error: 'Guncellenecek alan bulunamadi.' }
  }

  return { ok: true, value: nextValue }
}

export function toSocialMediaFormState(
  item: SocialMediaAccount
): SocialMediaFormState {
  return {
    platform: item.platform,
    hesapAdi: item.hesapAdi,
    link: item.link,
    yorumlar: item.yorumlar ?? '',
  }
}

export function formatFollowerCount(value: number | null): string {
  if (value === null) {
    return '-'
  }

  return new Intl.NumberFormat('tr-TR').format(value)
}

export function formatSocialMediaTimestamp(value: string | null): string {
  if (!value) {
    return '-'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getSocialMediaPlatformLabel(
  platform: SocialMediaPlatform
): string {
  switch (platform) {
    case 'instagram':
      return 'Instagram'
    case 'tiktok':
      return 'TikTok'
    case 'youtube':
      return 'YouTube'
    case 'x':
      return 'X'
    default:
      return 'Diger'
  }
}

export function isRefreshablePlatform(platform: SocialMediaPlatform): boolean {
  return platform !== 'other'
}
