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
  const rawId = req.query.id
  const contactId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!contactId) {
    return res.status(400).json({ error: 'Contact id gerekli.' })
  }

  if (req.method === 'PATCH') {
    const normalized = normalizeContactMutationInput(req.body, { partial: true })

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const updatePayload = {
      ...(normalized.value.contact !== undefined
        ? { contact: normalized.value.contact }
        : {}),
      ...(normalized.value.telefon !== undefined
        ? { telefon: normalized.value.telefon }
        : {}),
      ...(normalized.value.websitesi !== undefined
        ? { websitesi: normalized.value.websitesi }
        : {}),
      ...(normalized.value.tur !== undefined ? { tur: normalized.value.tur } : {}),
      ...(normalized.value.sorumlu !== undefined
        ? { sorumlu: normalized.value.sorumlu }
        : {}),
      ...(normalized.value.durum_dm !== undefined
        ? { durum_dm: normalized.value.durum_dm }
        : {}),
      ...(normalized.value.durum_customer !== undefined
        ? { durum_customer: normalized.value.durum_customer }
        : {}),
      ...(normalized.value.yorumlar !== undefined
        ? { yorumlar: normalized.value.yorumlar }
        : {}),
    }

    const { data, error } = await supabaseAdmin
      .from('contact_items')
      .update(updatePayload)
      .eq('id', contactId)
      .select(
        'id, contact, telefon, websitesi, tur, sorumlu, durum, durum_dm, durum_customer, yorumlar, created_at, updated_at'
      )
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Contact guncellenemedi.' })
    }

    return res.status(200).json({
      contact: mapContactRow(data as ContactItemRow),
    })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('contact_items')
      .delete()
      .eq('id', contactId)

    if (error) {
      return res.status(500).json({ error: 'Contact silinemedi.' })
    }

    return res.status(200).json({ success: true })
  }

  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
