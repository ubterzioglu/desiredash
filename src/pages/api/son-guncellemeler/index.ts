import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapSonGuncellemelerRow,
  normalizeSonGuncellemelerInput,
  type SonGuncellemelerRow,
} from '@/lib/son-guncellemeler-items'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('son_guncellemeler')
      .select('id, metin, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Son guncellemeler alinamadi.' })
    }

    return res.status(200).json({
      items: (data as SonGuncellemelerRow[]).map(mapSonGuncellemelerRow),
    })
  }

  if (req.method === 'POST') {
    const normalized = normalizeSonGuncellemelerInput(req.body)

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const { data, error } = await supabaseAdmin
      .from('son_guncellemeler')
      .insert({ metin: normalized.value.metin })
      .select('id, metin, created_at')
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Guncelleme eklenemedi.' })
    }

    return res.status(201).json({
      item: mapSonGuncellemelerRow(data as SonGuncellemelerRow),
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
