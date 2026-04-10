import type { DocCategorySlug, DocNavItem } from './docs-data'
import {
  defaultDocCategorySlug,
  getDocsCategories,
  getDocsItemById,
  isDocsCategorySlug,
} from './docs-data'

export interface DocsRouteState {
  activeCategorySlug: DocCategorySlug
  activeItemId?: string
}

export type ExpandedCategoryState = Record<DocCategorySlug, boolean>

export function buildDocsHubHref(): string {
  return '/'
}

export function getDocsRouteState(asPath: string): DocsRouteState {
  const [pathWithoutHash, hashFragment] = asPath.split('#')
  const url = new URL(pathWithoutHash || '/', 'http://localhost')
  const categoryFromQuery = url.searchParams.get('category')
  const itemFromRoute = url.searchParams.get('item') ?? hashFragment ?? null
  const categoryFromPath = url.pathname.split('/').filter(Boolean)[0] ?? null
  const activeItem = getDocsItemById(itemFromRoute)

  if (activeItem) {
    return {
      activeCategorySlug: activeItem.categorySlug,
      activeItemId: activeItem.id,
    }
  }

  if (isDocsCategorySlug(categoryFromPath)) {
    return {
      activeCategorySlug: categoryFromPath,
    }
  }

  if (isDocsCategorySlug(categoryFromQuery)) {
    return {
      activeCategorySlug: categoryFromQuery,
    }
  }

  return {
    activeCategorySlug: defaultDocCategorySlug,
  }
}

export function buildDocCategoryHref(categorySlug: DocCategorySlug): string {
  return `/${categorySlug}`
}

export function buildDocItemHref(item: Pick<DocNavItem, 'categorySlug' | 'id'>): string {
  return `${buildDocCategoryHref(item.categorySlug)}#${item.id}`
}

export function createExpandedCategoryState(
  activeCategorySlug: DocCategorySlug
): ExpandedCategoryState {
  return getDocsCategories().reduce<ExpandedCategoryState>((expandedState, category) => {
    expandedState[category.slug] =
      category.defaultExpanded || category.slug === activeCategorySlug
    return expandedState
  }, {} as ExpandedCategoryState)
}

export function syncExpandedCategoryState(
  previousState: ExpandedCategoryState,
  activeCategorySlug: DocCategorySlug
): ExpandedCategoryState {
  const nextState = getDocsCategories().reduce<ExpandedCategoryState>(
    (expandedState, category) => {
      expandedState[category.slug] =
        previousState[category.slug] ?? category.defaultExpanded
      return expandedState
    },
    {} as ExpandedCategoryState
  )

  nextState[activeCategorySlug] = true

  return nextState
}
