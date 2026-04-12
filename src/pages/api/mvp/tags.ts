import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'

const VALID_TAGS = ['MVP1', 'MVP2', 'MVP3'] as const
type MvpTag = (typeof VALID_TAGS)[number]

function isValidTag(value: unknown): value is MvpTag {
  return typeof value === 'string' && (VALID_TAGS as readonly string[]).includes(value)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('mvp_item_tags')
      .select('item_id, tag')

    if (error) {
      return res.status(500).json({ error: 'Etiketler alinamadi.' })
    }

    const tags: Record<string, MvpTag> = {}
    for (const row of data ?? []) {
      if (row.item_id && isValidTag(row.tag)) {
        tags[row.item_id] = row.tag
      }
    }

    return res.status(200).json({ tags })
  }

  if (req.method === 'PATCH') {
    const { item_id, tag } = req.body as { item_id?: unknown; tag?: unknown }

    if (typeof item_id !== 'string' || item_id.trim() === '') {
      return res.status(400).json({ error: 'Gecersiz item_id.' })
    }

    if (tag === null || tag === undefined || tag === '') {
      // Remove tag
      const { error } = await supabaseAdmin
        .from('mvp_item_tags')
        .delete()
        .eq('item_id', item_id)

      if (error) {
        return res.status(500).json({ error: 'Etiket silinemedi.' })
      }

      return res.status(200).json({ ok: true })
    }

    if (!isValidTag(tag)) {
      return res.status(400).json({ error: 'Gecersiz etiket. MVP1, MVP2 veya MVP3 olmali.' })
    }

    const { error } = await supabaseAdmin
      .from('mvp_item_tags')
      .upsert({ item_id: item_id.trim(), tag, updated_at: new Date().toISOString() })

    if (error) {
      return res.status(500).json({ error: 'Etiket kaydedilemedi.' })
    }

    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
