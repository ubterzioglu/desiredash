import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapContactRow,
  normalizeContactMutationInput,
  type ContactItemRow,
} from '@/lib/contact-items'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('contact_items')
      .select(
        'id, contact, telefon, websitesi, tur, sorumlu, durum, durum_dm, durum_customer, yorumlar, created_at, updated_at'
      )
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Contact listesi alinamadi.' })
    }

    return res.status(200).json({
      contacts: (data as ContactItemRow[]).map(mapContactRow),
    })
  }

  if (req.method === 'POST') {
    const normalized = normalizeContactMutationInput(req.body)

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const insertPayload = {
      contact: normalized.value.contact,
      telefon: normalized.value.telefon ?? null,
      websitesi: normalized.value.websitesi ?? null,
      tur: normalized.value.tur ?? null,
      sorumlu: normalized.value.sorumlu ?? null,
      durum_dm: normalized.value.durum_dm ?? null,
      durum_customer: normalized.value.durum_customer ?? null,
      yorumlar: normalized.value.yorumlar ?? null,
    }

    const { data, error } = await supabaseAdmin
      .from('contact_items')
      .insert(insertPayload)
      .select(
        'id, contact, telefon, websitesi, tur, sorumlu, durum, durum_dm, durum_customer, yorumlar, created_at, updated_at'
      )

    if (error || !data) {
      return res.status(500).json({ error: 'Contact eklenemedi.' })
    }

    return res.status(201).json({
      contact: mapContactRow((data as unknown as ContactItemRow[])[0]),
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
