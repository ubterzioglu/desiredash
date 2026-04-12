import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../../lib/supabase-server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({ error: 'Gecersiz id.' })
  }

  if (req.method === 'DELETE') {
    // Also delete associated tag if any
    await supabaseAdmin.from('mvp_item_tags').delete().eq('item_id', id)

    const { error } = await supabaseAdmin
      .from('mvp_custom_items')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ error: 'Item silinemedi.' })
    }

    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
