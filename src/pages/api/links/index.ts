import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapLinkRow,
  normalizeLinkMutationInput,
  type LinkRow,
} from '@/lib/links-items'

const LINKS_COLUMNS =
  'id, kim_ekledi, kim_ekledi_custom, aciklama, link, created_at, updated_at'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('links')
      .select(LINKS_COLUMNS)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Link listesi alinamadi.' })
    }

    return res.status(200).json({
      links: (data as LinkRow[]).map(mapLinkRow),
    })
  }

  if (req.method === 'POST') {
    const normalized = normalizeLinkMutationInput(req.body)

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const insertPayload = {
      kim_ekledi: normalized.value.kimEkledi,
      kim_ekledi_custom: normalized.value.kimEklediCustom,
      aciklama: normalized.value.aciklama,
      link: normalized.value.link,
    }

    const { data, error } = await supabaseAdmin
      .from('links')
      .insert(insertPayload)
      .select(LINKS_COLUMNS)
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Link eklenemedi.' })
    }

    return res.status(201).json({
      link: mapLinkRow(data as LinkRow),
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
