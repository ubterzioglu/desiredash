import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'

export interface MvpCustomItem {
  id: string
  label: string
  description: string | null
  createdAt: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('mvp_custom_items')
      .select('id, label, description, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      return res.status(500).json({ error: 'Itemlar alinamadi.' })
    }

    const items: MvpCustomItem[] = (data ?? []).map((row) => ({
      id: row.id as string,
      label: row.label as string,
      description: (row.description ?? null) as string | null,
      createdAt: row.created_at as string,
    }))

    return res.status(200).json({ items })
  }

  if (req.method === 'POST') {
    const { label, description } = req.body as { label?: unknown; description?: unknown }

    if (typeof label !== 'string' || label.trim() === '') {
      return res.status(400).json({ error: 'Baslik zorunludur.' })
    }

    const { data, error } = await supabaseAdmin
      .from('mvp_custom_items')
      .insert({
        label: label.trim(),
        description:
          typeof description === 'string' && description.trim() !== ''
            ? description.trim()
            : null,
      })
      .select('id, label, description, created_at')
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Item eklenemedi.' })
    }

    const item: MvpCustomItem = {
      id: data.id as string,
      label: data.label as string,
      description: (data.description ?? null) as string | null,
      createdAt: data.created_at as string,
    }

    return res.status(201).json({ item })
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
