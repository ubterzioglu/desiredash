import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowLeft, Search } from 'lucide-react'
import BrainstormingManager from '../brainstorming/BrainstormingManager'
import ContactManager from '../contacts/ContactManager'
import LogoFikirlerManager from '../logo-fikirler/LogoFikirlerManager'
import MvpManager from '../mvp/MvpManager'
import SocialMediaManager from '../social-media/SocialMediaManager'
import SonGuncellemelerManager from '../son-guncellemeler/SonGuncellemelerManager'
import ToplantiNotlariManager from '../toplanti-notlari/ToplantiNotlariManager'
import ContentCard from '../ui/ContentCard'
import TodoManager from '../todo/TodoManager'
import SectionHeading from '../ui/SectionHeading'
import {
  getDocsCategoryContentView,
  getDocsCategories,
  getDocsHubContentView,
  type ContentViewSection,
  type DocCategorySlug,
} from '@/lib/docs-data'
import { getDocIcon } from '@/lib/docs-icons'
import { buildDocItemHref, getDocsRouteState } from '@/lib/docs-navigation'

interface MainContentProps {
  categorySlug?: DocCategorySlug
}

export default function MainContent({ categorySlug }: MainContentProps) {
  const router = useRouter()
  const contentView = categorySlug
    ? getDocsCategoryContentView(categorySlug)
    : getDocsHubContentView()
  const isStandaloneCardPage =
    categorySlug === 'neden-var' ||
    categorySlug === 'todo' ||
    categorySlug === 'contacts' ||
    categorySlug === 'sosyal-medya' ||
    categorySlug === 'son-guncellemeler' ||
    categorySlug === 'logo-fikirler' ||
    categorySlug === 'toplanti-notlari' ||
    categorySlug === 'mvp' ||
    categorySlug === 'brainstorming'
  const currentCategory = categorySlug
    ? getDocsCategories().find((category) => category.slug === categorySlug)
    : undefined
  const activeItemId = categorySlug
    ? getDocsRouteState(router.asPath).activeItemId
    : undefined
  const searchInputId = `${contentView.mode}-search-preview`
  const searchHelperId = `${searchInputId}-helper`

  if (isStandaloneCardPage) {
    const standaloneSection = contentView.sections[0]

    return (
      <article className="space-y-6">
        {contentView.backLink && (
          <Link
            href={contentView.backLink.href}
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
            style={{ color: '#CC3300' }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {contentView.backLink.label}
          </Link>
        )}

        {categorySlug !== 'contacts' && categorySlug !== 'todo' && categorySlug !== 'mvp' && categorySlug !== 'brainstorming' && standaloneSection?.cards.map((card, cardIndex) => {
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
              xpColorIndex={cardIndex}
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

        {categorySlug === 'todo' && <TodoManager />}
        {categorySlug === 'mvp' && <MvpManager />}
        {categorySlug === 'contacts' && <ContactManager />}
        {categorySlug === 'sosyal-medya' && <SocialMediaManager />}
        {categorySlug === 'son-guncellemeler' && <SonGuncellemelerManager />}
        {categorySlug === 'logo-fikirler' && <LogoFikirlerManager />}
        {categorySlug === 'toplanti-notlari' && <ToplantiNotlariManager />}
        {categorySlug === 'brainstorming' && <BrainstormingManager />}
      </article>
    )
  }

  return (
    <article className="space-y-10">
      <div className="space-y-4">
        {contentView.backLink && (
          <Link
            href={contentView.backLink.href}
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
            style={{ color: '#CC3300' }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {contentView.backLink.label}
          </Link>
        )}

        <div className="rounded-2xl border border-canvas-border bg-canvas-elevated p-6 shadow-sm" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.8)', borderColor: '#1F1F1F' }}>
          {contentView.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#F5A500' }}>
              {contentView.eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-bold text-ink-primary">
            {contentView.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-ink-muted">
            {contentView.description}
          </p>
          {contentView.supportingText && (
            <p className="mt-3 max-w-3xl text-sm text-ink-muted opacity-70">
              {contentView.supportingText}
            </p>
          )}
          {contentView.metaBadges && contentView.metaBadges.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-muted">
              {contentView.metaBadges.map((metaBadge) => (
                <span key={metaBadge} className="rounded-full bg-canvas-surface border border-canvas-border px-3 py-1">
                  {metaBadge}
                </span>
              ))}
            </div>
          )}

          {currentCategory && currentCategory.items.length > 1 && (
            <nav
              aria-label={`${contentView.title} bolum gezintisi`}
              className="docs-inline-nav mt-8 border-t border-canvas-border pt-5"
            >
              <div className="docs-inline-nav-list">
                {currentCategory.items.map((item, index) => {
                  const itemNumber = String(index + 1).padStart(2, '0')
                  const isActive = item.id === activeItemId

                  return (
                    <Link
                      key={item.id}
                      href={buildDocItemHref(item)}
                      title={item.label}
                      aria-label={`${itemNumber} ${item.label}`}
                      aria-current={isActive ? 'location' : undefined}
                      className={`docs-inline-nav-button ${isActive ? 'active' : ''}`}
                    >
                      {itemNumber}
                    </Link>
                  )
                })}
              </div>
            </nav>
          )}

          {contentView.search && (
            <div className="mt-8 border-t border-canvas-border pt-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor={searchInputId}
                  className="text-sm font-medium text-ink-muted"
                >
                  {contentView.search.label}
                </label>
                <span className="rounded-full bg-xp-yellow/10 border border-xp-yellow/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-xp-yellow">
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
                  className="w-full rounded-lg border border-canvas-border bg-canvas-surface py-3 pl-11 pr-4 text-sm text-ink-muted placeholder:text-ink-muted/50 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted opacity-40"
                  size={18}
                  aria-hidden="true"
                />
              </div>
              <p id={searchHelperId} className="mt-2 text-sm text-ink-muted opacity-50">
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
              {section.cards.map((card, cardIndex) => {
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
                    xpColorIndex={cardIndex}
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
            <div className="rounded-2xl border border-dashed border-canvas-border bg-canvas-surface p-6 text-sm text-ink-muted">
              <h3 className="text-base font-semibold text-ink-primary">
                {section.emptyState?.title ?? 'No content available'}
              </h3>
              <p className="mt-2 max-w-2xl">
                {section.emptyState?.description ??
                  'This section is intentionally empty for now.'}
              </p>
              {section.emptyState?.action?.type === 'link' && (
                <Link
                  href={section.emptyState.action.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-surface"
                  style={{ color: '#4CAF50' }}
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
