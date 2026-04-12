import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapSocialMediaRow,
  normalizeSocialMediaMutationInput,
  type SocialMediaAccountRow,
} from '@/lib/social-media-items'

const SOCIAL_MEDIA_COLUMNS =
  'id, platform, hesap_adi, link, takipci_sayisi, son_kontrol_at, durum, yorumlar, created_at, updated_at'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rawId = req.query.id
  const accountId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!accountId) {
    return res.status(400).json({ error: 'Hesap id gerekli.' })
  }

  if (req.method === 'PATCH') {
    const normalized = normalizeSocialMediaMutationInput(req.body, {
      partial: true,
    })

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const updatePayload = {
      ...(normalized.value.platform !== undefined
        ? { platform: normalized.value.platform }
        : {}),
      ...(normalized.value.hesapAdi !== undefined
        ? { hesap_adi: normalized.value.hesapAdi }
        : {}),
      ...(normalized.value.link !== undefined
        ? { link: normalized.value.link }
        : {}),
      ...(normalized.value.yorumlar !== undefined
        ? { yorumlar: normalized.value.yorumlar }
        : {}),
      durum: 'Hazir',
    }

    const { data, error } = await supabaseAdmin
      .from('social_media_accounts')
      .update(updatePayload)
      .eq('id', accountId)
      .select(SOCIAL_MEDIA_COLUMNS)
      .single()

    if (error || !data) {
      if (error?.code === '23505') {
        return res.status(409).json({ error: 'Bu link zaten kayitli.' })
      }

      return res.status(500).json({ error: 'Sosyal medya hesabi guncellenemedi.' })
    }

    return res.status(200).json({
      account: mapSocialMediaRow(data as SocialMediaAccountRow),
    })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('social_media_accounts')
      .delete()
      .eq('id', accountId)

    if (error) {
      return res.status(500).json({ error: 'Sosyal medya hesabi silinemedi.' })
    }

    return res.status(200).json({ success: true })
  }

  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
