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
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('social_media_accounts')
      .select(SOCIAL_MEDIA_COLUMNS)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Sosyal medya listesi alinamadi.' })
    }

    return res.status(200).json({
      accounts: (data as SocialMediaAccountRow[]).map(mapSocialMediaRow),
    })
  }

  if (req.method === 'POST') {
    const normalized = normalizeSocialMediaMutationInput(req.body)

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const insertPayload = {
      platform: normalized.value.platform,
      hesap_adi: normalized.value.hesapAdi,
      link: normalized.value.link,
      yorumlar: normalized.value.yorumlar ?? null,
      durum: 'Hazir',
    }

    const { data, error } = await supabaseAdmin
      .from('social_media_accounts')
      .insert(insertPayload)
      .select(SOCIAL_MEDIA_COLUMNS)
      .single()

    if (error || !data) {
      if (error?.code === '23505') {
        return res.status(409).json({ error: 'Bu link zaten kayitli.' })
      }

      return res.status(500).json({ error: 'Sosyal medya hesabi eklenemedi.' })
    }

    return res.status(201).json({
      account: mapSocialMediaRow(data as SocialMediaAccountRow),
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
