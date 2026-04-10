import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ''

const missingEnvKeys = [
  !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
  !supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
].filter((envKey): envKey is string => envKey !== null)

export interface SupabaseEnvStatus {
  isConfigured: boolean
  missingEnvKeys: string[]
  mode: 'configured' | 'mock-fallback'
}

export const supabaseEnvStatus: SupabaseEnvStatus = {
  isConfigured: missingEnvKeys.length === 0,
  missingEnvKeys,
  mode: missingEnvKeys.length === 0 ? 'configured' : 'mock-fallback',
}

let browserClient: SupabaseClient | null | undefined

// Only data adapter modules should call this. UI components should stay env-safe
// by consuming a repository/adapter instead of importing Supabase directly.
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient !== undefined) {
    return browserClient
  }

  if (!supabaseEnvStatus.isConfigured) {
    browserClient = null
    return browserClient
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return browserClient
}

export interface SupabaseDocCategoryRow {
  id: string
  slug: string
  label: string
  short_description: string
  icon_key: string
  default_expanded: boolean
  sort_order: number
}

export interface SupabaseDocContentItemRow {
  id: string
  category_id: string
  slug: string
  label: string
  description: string
  body: string | null
  featured_order: number | null
  sort_order: number
}

export const supabasePreparationNotes = {
  currentSource: 'mock',
  futureTables: {
    categories: 'doc_categories',
    contentItems: 'doc_content_items',
  },
  fieldMapping: {
    routeSlug: 'doc_categories.slug',
    categoryLabel: 'doc_categories.label',
    categoryDescription: 'doc_categories.short_description',
    contentItemSlug: 'doc_content_items.slug',
    contentItemTitle: 'doc_content_items.label',
    contentItemDescription: 'doc_content_items.description',
    contentCategoryRelation: 'doc_content_items.category_id -> doc_categories.id',
  },
  outOfScope: ['auth', 'RLS', 'real fetch', 'admin content entry'],
} as const
