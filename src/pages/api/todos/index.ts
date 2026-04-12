import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabase-server'
import {
  mapTodoRow,
  normalizeTodoMutationInput,
  type TodoItemRow,
} from '@/lib/todo-items'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('todo_items')
      .select('id, konu, kim, ne_zaman, ayrinti, durum, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Todo listesi alinamadi.' })
    }

    return res.status(200).json({
      todos: (data as TodoItemRow[]).map(mapTodoRow),
    })
  }

  if (req.method === 'POST') {
    const normalized = normalizeTodoMutationInput(req.body)

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const insertPayload = {
      konu: normalized.value.konu,
      kim: normalized.value.kim,
      ne_zaman: normalized.value.neZaman ?? null,
      ayrinti: normalized.value.ayrinti ?? null,
      durum: normalized.value.durum,
    }

    const { data, error } = await supabaseAdmin
      .from('todo_items')
      .insert(insertPayload)
      .select('id, konu, kim, ne_zaman, ayrinti, durum, created_at, updated_at')
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Todo eklenemedi.' })
    }

    return res.status(201).json({
      todo: mapTodoRow(data as TodoItemRow),
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
