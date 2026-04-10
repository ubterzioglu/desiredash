import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import ContentCard from '../ui/ContentCard'
import SectionHeading from '../ui/SectionHeading'
import {
  getDocsCategoryContentView,
  getDocsHubContentView,
  type ContentViewSection,
  type DocCategorySlug,
} from '@/lib/docs-data'
import { getDocIcon } from '@/lib/docs-icons'

interface MainContentProps {
  categorySlug?: DocCategorySlug
}

export default function MainContent({ categorySlug }: MainContentProps) {
  const contentView = categorySlug
    ? getDocsCategoryContentView(categorySlug)
    : getDocsHubContentView()
  const searchInputId = `${contentView.mode}-search-preview`
  const searchHelperId = `${searchInputId}-helper`

  return (
    <article className="space-y-10">
      <div className="space-y-4">
        {contentView.backLink && (
          <Link
            href={contentView.backLink.href}
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {contentView.backLink.label}
          </Link>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {contentView.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              {contentView.eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {contentView.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">
            {contentView.description}
          </p>
          {contentView.supportingText && (
            <p className="mt-3 max-w-3xl text-sm text-gray-500">
              {contentView.supportingText}
            </p>
          )}
          {contentView.metaBadges && contentView.metaBadges.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500">
              {contentView.metaBadges.map((metaBadge) => (
                <span key={metaBadge} className="rounded-full bg-gray-100 px-3 py-1">
                  {metaBadge}
                </span>
              ))}
            </div>
          )}

          {contentView.search && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor={searchInputId}
                  className="text-sm font-medium text-gray-700"
                >
                  {contentView.search.label}
                </label>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                  Placeholder UI
                </span>
              </div>
              <div className="relative">
                <input
                  id={searchInputId}
                  type="text"
                  placeholder={contentView.search.placeholder}
                  readOnly
                  name="docs-search-preview"
                  autoComplete="off"
                  aria-readonly="true"
                  aria-describedby={searchHelperId}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                  aria-hidden="true"
                />
              </div>
              <p id={searchHelperId} className="mt-2 text-sm text-gray-400">
                {contentView.search.helperText}
              </p>
            </div>
          )}
        </div>
      </div>

      {contentView.sections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`section-heading-${section.id}`}
          className="space-y-4"
        >
          <SectionHeading
            id={`section-heading-${section.id}`}
            title={section.title}
            description={section.description}
          />

          {section.cards.length > 0 ? (
            <div className={getGridClasses(section)}>
              {section.cards.map((card) => {
                const Icon = card.iconKey ? getDocIcon(card.iconKey) : null

                return (
                  <ContentCard
                    key={card.id}
                    title={card.title}
                    description={card.description}
                    detail={card.detail}
                    badge={card.badge}
                    eyebrow={card.eyebrow}
                    density={card.density}
                    anchorId={card.anchorId}
                    icon={Icon ? <Icon size={20} /> : undefined}
                    action={
                      card.action?.type === 'link'
                        ? {
                            type: 'link',
                            href: card.action.href,
                            label: card.action.label,
                            surface: card.action.surface,
                          }
                        : undefined
                    }
                  />
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
              <h3 className="text-base font-semibold text-gray-900">
                {section.emptyState?.title ?? 'No content available'}
              </h3>
              <p className="mt-2 max-w-2xl">
                {section.emptyState?.description ??
                  'This section is intentionally empty for now.'}
              </p>
              {section.emptyState?.action?.type === 'link' && (
                <Link
                  href={section.emptyState.action.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-md text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  {section.emptyState.action.label}
                </Link>
              )}
            </div>
          )}
        </section>
      ))}
    </article>
  )
}

function getGridClasses(section: ContentViewSection): string {
  switch (section.columns) {
    case 1:
      return 'grid grid-cols-1 gap-4'
    case 3:
      return 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'
    case 2:
    default:
      return 'grid grid-cols-1 gap-4 md:grid-cols-2'
  }
}
