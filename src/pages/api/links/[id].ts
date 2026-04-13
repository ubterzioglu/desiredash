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
  const rawId = req.query.id
  const linkId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!linkId) {
    return res.status(400).json({ error: 'Link id gerekli.' })
  }

  if (req.method === 'PATCH') {
    const normalized = normalizeLinkMutationInput(req.body, {
      partial: true,
    })

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const updatePayload: Record<string, unknown> = {}

    if (normalized.value.kimEkledi !== undefined) {
      updatePayload.kim_ekledi = normalized.value.kimEkledi
    }

    if (normalized.value.kimEklediCustom !== undefined) {
      updatePayload.kim_ekledi_custom = normalized.value.kimEklediCustom
    }

    if (normalized.value.aciklama !== undefined) {
      updatePayload.aciklama = normalized.value.aciklama
    }

    if (normalized.value.link !== undefined) {
      updatePayload.link = normalized.value.link
    }

    const { data, error } = await supabaseAdmin
      .from('links')
      .update(updatePayload)
      .eq('id', linkId)
      .select(LINKS_COLUMNS)
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Link guncellenemedi.' })
    }

    return res.status(200).json({
      link: mapLinkRow(data as LinkRow),
    })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('links')
      .delete()
      .eq('id', linkId)

    if (error) {
      return res.status(500).json({ error: 'Link silinemedi.' })
    }

    return res.status(200).json({ success: true })
  }

  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
