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
  const rawId = req.query.id
  const todoId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!todoId) {
    return res.status(400).json({ error: 'Todo id gerekli.' })
  }

  if (req.method === 'PATCH') {
    const normalized = normalizeTodoMutationInput(req.body, { partial: true })

    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error })
    }

    const updatePayload = {
      ...(normalized.value.konu !== undefined ? { konu: normalized.value.konu } : {}),
      ...(normalized.value.kim !== undefined ? { kim: normalized.value.kim } : {}),
      ...(normalized.value.neZaman !== undefined
        ? { ne_zaman: normalized.value.neZaman }
        : {}),
      ...(normalized.value.ayrinti !== undefined
        ? { ayrinti: normalized.value.ayrinti }
        : {}),
      ...(normalized.value.durum !== undefined
        ? { durum: normalized.value.durum }
        : {}),
    }

    const { data, error } = await supabaseAdmin
      .from('todo_items')
      .update(updatePayload)
      .eq('id', todoId)
      .select('id, konu, kim, ne_zaman, ayrinti, durum, created_at, updated_at')
      .single()

    if (error || !data) {
      return res.status(500).json({ error: 'Todo guncellenemedi.' })
    }

    return res.status(200).json({
      todo: mapTodoRow(data as TodoItemRow),
    })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('todo_items').delete().eq('id', todoId)

    if (error) {
      return res.status(500).json({ error: 'Todo silinemedi.' })
    }

    return res.status(200).json({ success: true })
  }

  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed.' })
}
