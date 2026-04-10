import {
  getDocCategoryContentView as getMockDocCategoryContentView,
  getDocsHubContentView as getMockDocsHubContentView,
  type ContentView,
} from './docs-content'
import {
  docCategorySlugs,
  docsCategories,
  getDocItemById as getMockDocItemById,
  isDocCategorySlug as isMockDocCategorySlug,
  type DocCategoryDefinition,
  type DocCategorySlug,
  type DocNavItem,
} from './docs-hub'
import { supabaseEnvStatus, supabasePreparationNotes } from './supabase'

export type { ContentViewSection } from './docs-content'
export { defaultDocCategorySlug } from './docs-hub'
export type {
  DocCategoryDefinition,
  DocCategorySlug,
  DocIconKey,
  DocNavItem,
} from './docs-hub'

export type DocsDataSource = 'mock'

export interface DocsDataSourceInfo {
  source: DocsDataSource
  supabaseConfigured: boolean
  missingEnvKeys: string[]
  fallbackReason: string
}

export const docsDataBoundary = {
  supabaseConsumerBoundary: 'Only data adapter modules may inspect Supabase env or client state.',
  uiConsumerBoundary: 'Pages and components should import docs-data helpers instead of Supabase.',
  outOfScope: supabasePreparationNotes.outOfScope,
  futureSchema: supabasePreparationNotes.fieldMapping,
} as const

export function getDocsDataSourceInfo(): DocsDataSourceInfo {
  return {
    source: 'mock',
    supabaseConfigured: supabaseEnvStatus.isConfigured,
    missingEnvKeys: supabaseEnvStatus.missingEnvKeys,
    fallbackReason: supabaseEnvStatus.isConfigured
      ? 'Supabase env is present, but Session 07 intentionally keeps docs on the mock adapter until query and auth scope are designed.'
      : 'Supabase env is incomplete, so docs stay on the mock adapter and the UI remains runtime-safe.',
  }
}

export function getDocsCategories(): DocCategoryDefinition[] {
  return docsCategories
}

export function getDocsCategorySlugs(): DocCategorySlug[] {
  return docCategorySlugs
}

export function isDocsCategorySlug(value: string | null): value is DocCategorySlug {
  return isMockDocCategorySlug(value)
}

export function getDocsItemById(itemId: string | null): DocNavItem | undefined {
  return getMockDocItemById(itemId)
}

export function getDocsHubContentView(): ContentView {
  return getMockDocsHubContentView()
}

export function getDocsCategoryContentView(
  categorySlug: DocCategorySlug
): ContentView {
  return getMockDocCategoryContentView(categorySlug)
}
