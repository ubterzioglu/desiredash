import {
  type SocialMediaAccountRow,
  type SocialMediaPlatform,
  type SocialMediaStatus,
} from './social-media-items'

interface FetchProfileResult {
  html: string | null
  statusCode: number | null
  blocked: boolean
  errorMessage?: string
}

export interface RefreshSocialMediaResult {
  takipciSayisi: number | null
  durum: SocialMediaStatus
  sonKontrolAt: string
  message: string
}

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
} as const

export async function refreshSocialMediaAccount(
  account: Pick<
    SocialMediaAccountRow,
    'platform' | 'link' | 'takipci_sayisi' | 'hesap_adi'
  >
): Promise<RefreshSocialMediaResult> {
  const sonKontrolAt = new Date().toISOString()

  if (account.platform === 'other') {
    return {
      takipciSayisi: null,
      durum: 'Desteklenmiyor',
      sonKontrolAt,
      message: 'Bu platform icin otomatik takipci cekimi desteklenmiyor.',
    }
  }

  const profile = await fetchProfilePage(account.link)

  if (!profile.html) {
    return {
      takipciSayisi: null,
      durum: profile.blocked ? 'Engellendi' : 'Hata',
      sonKontrolAt,
      message:
        profile.errorMessage ??
        'Profil sayfasi alinamadi. Son bilinen takipci sayisi korunuyor.',
    }
  }

  const takipciSayisi = parseFollowersByPlatform(account.platform, profile.html)

  if (takipciSayisi !== null) {
    return {
      takipciSayisi,
      durum: 'Guncel',
      sonKontrolAt,
      message: `${account.hesap_adi} icin takipci sayisi guncellendi.`,
    }
  }

  const blocked = isBlockedMarkup(profile.html)

  return {
    takipciSayisi: null,
    durum: blocked ? 'Engellendi' : 'Hata',
    sonKontrolAt,
    message: blocked
      ? 'Platform sayfasi erisimi engelledi. Son bilinen takipci sayisi korunuyor.'
      : 'Takipci sayisi parse edilemedi. Son bilinen takipci sayisi korunuyor.',
  }
}

async function fetchProfilePage(url: string): Promise<FetchProfileResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(url, {
      headers: DEFAULT_HEADERS,
      redirect: 'follow',
      signal: controller.signal,
    })
    const html = await response.text()
    const blocked = isBlockedStatus(response.status) || isBlockedMarkup(html)

    if (!response.ok) {
      return {
        html,
        statusCode: response.status,
        blocked,
        errorMessage: `Profil sayfasi ${response.status} dondu.`,
      }
    }

    return {
      html,
      statusCode: response.status,
      blocked,
    }
  } catch (error) {
    return {
      html: null,
      statusCode: null,
      blocked: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : 'Profil sayfasi alinirken bilinmeyen hata olustu.',
    }
  } finally {
    clearTimeout(timeout)
  }
}

function parseFollowersByPlatform(
  platform: SocialMediaPlatform,
  html: string
): number | null {
  switch (platform) {
    case 'instagram':
      return parseInstagramFollowers(html)
    case 'tiktok':
      return parseTikTokFollowers(html)
    case 'youtube':
      return parseYoutubeFollowers(html)
    case 'x':
      return parseXFollowers(html)
    default:
      return null
  }
}

function parseInstagramFollowers(html: string): number | null {
  const metaDescription =
    extractMetaContent(html, 'property', 'og:description') ??
    extractMetaContent(html, 'name', 'description')
  const fromMeta = metaDescription
    ? parseCountNearKeywords(metaDescription, ['followers', 'takipci'])
    : null

  if (fromMeta !== null) {
    return fromMeta
  }

  return extractDirectNumber(html, [
    /"edge_followed_by"\s*:\s*\{"count"\s*:\s*(\d+)/i,
    /"follower_count"\s*:\s*(\d+)/i,
  ])
}

function parseTikTokFollowers(html: string): number | null {
  const direct = extractDirectNumber(html, [
    /"followerCount"\s*:\s*(\d+)/i,
    /"follower_count"\s*:\s*(\d+)/i,
  ])

  if (direct !== null) {
    return direct
  }

  const metaDescription =
    extractMetaContent(html, 'name', 'description') ??
    extractMetaContent(html, 'property', 'og:description')

  return metaDescription
    ? parseCountNearKeywords(metaDescription, ['followers', 'takipci'])
    : null
}

function parseYoutubeFollowers(html: string): number | null {
  const direct = extractDirectNumber(html, [
    /"subscriberCount"\s*:\s*(\d+)/i,
    /"subscriberCountText".{0,200}?"simpleText"\s*:\s*"([^"]+)"/i,
    /"subscriberCountText".{0,300}?"label"\s*:\s*"([^"]+)"/i,
  ])

  if (direct !== null) {
    return direct
  }

  const metaDescription =
    extractMetaContent(html, 'name', 'description') ??
    extractMetaContent(html, 'property', 'og:description')

  return metaDescription
    ? parseCountNearKeywords(metaDescription, ['subscribers', 'subscriber', 'abone'])
    : null
}

function parseXFollowers(html: string): number | null {
  const direct = extractDirectNumber(html, [
    /"followers_count"\s*:\s*(\d+)/i,
    /"normal_followers_count"\s*:\s*(\d+)/i,
    /"followersCount"\s*:\s*(\d+)/i,
  ])

  if (direct !== null) {
    return direct
  }

  const metaDescription =
    extractMetaContent(html, 'name', 'description') ??
    extractMetaContent(html, 'property', 'og:description')

  return metaDescription
    ? parseCountNearKeywords(metaDescription, ['followers', 'takipci'])
    : null
}

function extractDirectNumber(html: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = html.match(pattern)
    const capturedValue = match?.[1]

    if (!capturedValue) {
      continue
    }

    if (/^\d+$/.test(capturedValue)) {
      return Number.parseInt(capturedValue, 10)
    }

    const parsedNearKeyword = parseCountNearKeywords(capturedValue, [
      'followers',
      'follower',
      'subscriber',
      'subscribers',
      'abone',
      'takipci',
    ])

    if (parsedNearKeyword !== null) {
      return parsedNearKeyword
    }

    const parsedValue = parseCompactCount(capturedValue)
    if (parsedValue !== null) {
      return parsedValue
    }
  }

  return null
}

function extractMetaContent(
  html: string,
  attrName: 'property' | 'name',
  attrValue: string
): string | null {
  const escaped = escapeRegExp(attrValue)
  const patterns = [
    new RegExp(
      `<meta[^>]*${attrName}=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`,
      'i'
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']+)["'][^>]*${attrName}=["']${escaped}["'][^>]*>`,
      'i'
    ),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      return decodeHtmlEntities(match[1])
    }
  }

  return null
}

function parseCountNearKeywords(
  text: string,
  keywords: string[]
): number | null {
  for (const keyword of keywords) {
    const escapedKeyword = escapeRegExp(keyword)
    const patterns = [
      new RegExp(
        `([0-9][0-9.,\\s]*\\s*(?:k|m|b|bn|mn|mio|bin|million|billion|thousand)?)\\s+${escapedKeyword}`,
        'i'
      ),
      new RegExp(
        `${escapedKeyword}\\s*:?\\s*([0-9][0-9.,\\s]*\\s*(?:k|m|b|bn|mn|mio|bin|million|billion|thousand)?)`,
        'i'
      ),
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (!match?.[1]) {
        continue
      }

      const parsedValue = parseCompactCount(match[1])
      if (parsedValue !== null) {
        return parsedValue
      }
    }
  }

  return null
}

function parseCompactCount(value: string): number | null {
  const trimmed = value.trim().toLowerCase()
  if (trimmed.length === 0) {
    return null
  }

  const compactMatch = trimmed.match(
    /^([0-9][0-9.,\s]*)(k|m|b|bn|mn|mio|bin|million|billion|thousand)?$/i
  )

  if (!compactMatch) {
    const digitsOnly = trimmed.replace(/[^\d]/g, '')
    return digitsOnly.length > 0 ? Number.parseInt(digitsOnly, 10) : null
  }

  const numericPart = compactMatch[1].replace(/\s+/g, '')
  const suffix = compactMatch[2] ?? ''

  if (!suffix) {
    const integerPart = numericPart.replace(/[.,]/g, '')
    return integerPart.length > 0 ? Number.parseInt(integerPart, 10) : null
  }

  const normalizedNumber = numericPart.replace(',', '.')
  const baseValue = Number.parseFloat(normalizedNumber)

  if (Number.isNaN(baseValue)) {
    return null
  }

  const multiplier = getSuffixMultiplier(suffix)
  return Math.round(baseValue * multiplier)
}

function getSuffixMultiplier(suffix: string): number {
  switch (suffix.toLowerCase()) {
    case 'k':
    case 'thousand':
      return 1_000
    case 'm':
    case 'mn':
    case 'mio':
    case 'million':
      return 1_000_000
    case 'b':
    case 'bn':
    case 'bin':
    case 'billion':
      return 1_000_000_000
    default:
      return 1
  }
}

function isBlockedStatus(statusCode: number): boolean {
  return statusCode === 401 || statusCode === 403 || statusCode === 429
}

function isBlockedMarkup(html: string): boolean {
  const lowered = html.toLowerCase()
  return [
    'captcha',
    'challenge_required',
    'sign in to continue',
    'log in to continue',
    'please enable javascript',
    'unusual traffic',
    'access denied',
  ].some((marker) => lowered.includes(marker))
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  }

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
