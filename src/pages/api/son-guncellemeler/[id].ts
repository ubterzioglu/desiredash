import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rawId = req.query.id
  const itemId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!itemId) {
    return res.status(400).json({ error: 'Item id gerekli.' })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('son_guncellemeler')
      .delete()
      .eq('id', itemId)

    if (error) {
      return res.status(500).json({ error: 'Guncelleme silinemedi.' })
    }

    return res.status(200).json({ success: true })
  }

  res.setHeader('Allow', ['DELETE'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
