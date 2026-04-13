import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapLogoFikirRow,
  normalizeLogoFikirInput,
  type LogoFikirRow,
} from '@/lib/logo-fikirler-items'

const SELECT_FIELDS =
  'id, kimsin, logo_link, puan_ubt, puan_baran, puan_sahin, created_at'
const DEFAULT_LOGO_BUCKET = 'logo-fikirler'
const LOGO_BUCKET = process.env.SUPABASE_LOGO_BUCKET?.trim() || DEFAULT_LOGO_BUCKET
const SUPABASE_PUBLIC_STORAGE_SEGMENT = '/storage/v1/object/public/'

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function toPublicLogoUrl(raw: string): string {
  const input = raw.trim()

  if (!input) {
    return input
  }

  if (input.includes(SUPABASE_PUBLIC_STORAGE_SEGMENT)) {
    return input
  }

  if (input.startsWith('supabase://')) {
    const withoutScheme = input.slice('supabase://'.length)
    const firstSlashIndex = withoutScheme.indexOf('/')

    if (firstSlashIndex > 0) {
      const bucketFromUrl = withoutScheme.slice(0, firstSlashIndex)
      const pathFromUrl = withoutScheme.slice(firstSlashIndex + 1)
      return supabaseAdmin.storage.from(bucketFromUrl).getPublicUrl(pathFromUrl).data.publicUrl
    }
  }

  if (isHttpUrl(input)) {
    return input
  }

  const normalizedPath = input.startsWith(`${LOGO_BUCKET}/`)
    ? input.slice(LOGO_BUCKET.length + 1)
    : input.replace(/^\/+/, '')

  return supabaseAdmin.storage.from(LOGO_BUCKET).getPublicUrl(normalizedPath).data.publicUrl
}

function mapWithPublicLogoUrl(row: LogoFikirRow) {
  const mapped = mapLogoFikirRow(row)
  return {
    ...mapped,
    logoLink: toPublicLogoUrl(mapped.logoLink),
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('logo_fikirler')
      .select(SELECT_FIELDS)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Logo fikir listesi alinamadi.' })
    }

    return res.status(200).json({
      items: (data as LogoFikirRow[]).map(mapWithPublicLogoUrl),
    })
  }

  if (req.method === 'POST') {
    const normalized = normalizeLogoFikirInput(req.body)

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const { data, error } = await supabaseAdmin
      .from('logo_fikirler')
      .insert({
        kimsin: normalized.value.kimsin,
        logo_link: toPublicLogoUrl(normalized.value.logo_link),
      })
      .select(SELECT_FIELDS)
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Logo fikir eklenemedi.' })
    }

    return res.status(201).json({
      item: mapWithPublicLogoUrl(data as LogoFikirRow),
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
