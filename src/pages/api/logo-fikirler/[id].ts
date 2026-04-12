import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapLogoFikirRow,
  normalizeLogoFikirScoreInput,
  type LogoFikirRow,
} from '@/lib/logo-fikirler-items'

const SELECT_FIELDS =
  'id, kimsin, logo_link, puan_ubt, puan_baran, puan_sahin, created_at'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rawId = req.query.id
  const itemId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!itemId) {
    return res.status(400).json({ error: 'Item id gerekli.' })
  }

  if (req.method === 'PATCH') {
    const normalized = normalizeLogoFikirScoreInput(req.body)

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const { data, error } = await supabaseAdmin
      .from('logo_fikirler')
      .update(normalized.value)
      .eq('id', itemId)
      .select(SELECT_FIELDS)
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Puan guncellenemedi.' })
    }

    return res.status(200).json({ item: mapLogoFikirRow(data as LogoFikirRow) })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('logo_fikirler')
      .delete()
      .eq('id', itemId)

    if (error) {
      return res.status(500).json({ error: 'Logo fikir silinemedi.' })
    }

    return res.status(200).json({ success: true })
  }

  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
