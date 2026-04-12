import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import { refreshSocialMediaAccount } from '@/lib/social-media-refresh'
import {
  isRefreshablePlatform,
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

  const cronSecret = process.env.SOCIAL_REFRESH_CRON_SECRET?.trim()
  const providedSecret = req.headers['x-cron-secret']

  if (!cronSecret) {
    return res.status(500).json({ error: 'SOCIAL_REFRESH_CRON_SECRET tanimli degil.' })
  }

  if (providedSecret !== cronSecret) {
    return res.status(403).json({ error: 'Yetkisiz istek.' })
  }

  const { data, error } = await supabaseAdmin
    .from('social_media_accounts')
    .select(SOCIAL_MEDIA_COLUMNS)
    .order('created_at', { ascending: true })

  if (error) {
    return res.status(500).json({ error: 'Sosyal medya listesi alinamadi.' })
  }

  const accounts = (data as SocialMediaAccountRow[]) ?? []
  const processed: Array<{ id: string; durum: string }> = []

  for (const account of accounts) {
    if (!isRefreshablePlatform(account.platform)) {
      await supabaseAdmin
        .from('social_media_accounts')
        .update({
          durum: 'Desteklenmiyor',
          son_kontrol_at: new Date().toISOString(),
        })
        .eq('id', account.id)

      processed.push({ id: account.id, durum: 'Desteklenmiyor' })
      continue
    }

    const refreshResult = await refreshSocialMediaAccount(account)
    await supabaseAdmin
      .from('social_media_accounts')
      .update({
        durum: refreshResult.durum,
        son_kontrol_at: refreshResult.sonKontrolAt,
        ...(refreshResult.takipciSayisi !== null
          ? { takipci_sayisi: refreshResult.takipciSayisi }
          : {}),
      })
      .eq('id', account.id)

    processed.push({ id: account.id, durum: refreshResult.durum })
  }

  return res.status(200).json({
    success: true,
    processedCount: processed.length,
    processed,
  })
}
