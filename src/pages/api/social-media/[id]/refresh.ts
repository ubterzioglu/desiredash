import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../../lib/supabase-server'
import { refreshSocialMediaAccount } from '@/lib/social-media-refresh'
import {
  isRefreshablePlatform,
  mapSocialMediaRow,
  type SocialMediaAccountRow,
} from '@/lib/social-media-items'

const SOCIAL_MEDIA_COLUMNS =
  'id, platform, hesap_adi, link, takipci_sayisi, son_kontrol_at, durum, yorumlar, created_at, updated_at'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const rawId = req.query.id
  const accountId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!accountId) {
    return res.status(400).json({ error: 'Hesap id gerekli.' })
  }

  const { data: existingAccount, error: fetchError } = await supabaseAdmin
    .from('social_media_accounts')
    .select(SOCIAL_MEDIA_COLUMNS)
    .eq('id', accountId)
    .single()

  if (fetchError || !existingAccount) {
    return res.status(404).json({ error: 'Sosyal medya hesabi bulunamadi.' })
  }

  const accountRow = existingAccount as SocialMediaAccountRow

  if (!isRefreshablePlatform(accountRow.platform)) {
    return res.status(200).json({
      account: mapSocialMediaRow(accountRow),
      refresh: {
        status: 'Desteklenmiyor',
        message: 'Bu platform icin otomatik takipci cekimi yok.',
      },
    })
  }

  const refreshResult = await refreshSocialMediaAccount(accountRow)
  const updatePayload = {
    durum: refreshResult.durum,
    son_kontrol_at: refreshResult.sonKontrolAt,
    ...(refreshResult.takipciSayisi !== null
      ? { takipci_sayisi: refreshResult.takipciSayisi }
      : {}),
  }

  const { data: updatedAccount, error: updateError } = await supabaseAdmin
    .from('social_media_accounts')
    .update(updatePayload)
    .eq('id', accountId)
    .select(SOCIAL_MEDIA_COLUMNS)
    .single()

  if (updateError || !updatedAccount) {
    return res.status(500).json({ error: 'Takipci sayisi guncellenemedi.' })
  }

  return res.status(200).json({
    account: mapSocialMediaRow(updatedAccount as SocialMediaAccountRow),
    refresh: {
      status: refreshResult.durum,
      message: refreshResult.message,
    },
  })
}
