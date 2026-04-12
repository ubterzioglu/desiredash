import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapLogoFikirRow,
  normalizeLogoFikirInput,
  type LogoFikirRow,
} from '@/lib/logo-fikirler-items'

const SELECT_FIELDS =
  'id, kimsin, logo_link, puan_ubt, puan_baran, puan_sahin, created_at'

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
      items: (data as LogoFikirRow[]).map(mapLogoFikirRow),
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
        logo_link: normalized.value.logo_link,
      })
      .select(SELECT_FIELDS)
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Logo fikir eklenemedi.' })
    }

    return res.status(201).json({
      item: mapLogoFikirRow(data as LogoFikirRow),
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
