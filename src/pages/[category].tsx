import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import DocsShell from '@/components/layout/DocsShell'
import MainContent from '@/components/layout/MainContent'
import {
  getDocsCategorySlugs,
  isDocsCategorySlug,
  type DocCategorySlug,
} from '@/lib/docs-data'

interface CategoryPageProps {
  categorySlug: DocCategorySlug
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getDocsCategorySlugs().map((category) => ({
    params: { category },
  })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({
  params,
}) => {
  const rawCategory = params?.category
  const categoryParam = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory

  if (typeof categoryParam !== 'string' || !isDocsCategorySlug(categoryParam)) {
    return {
      notFound: true,
    }
  }

  const categorySlug: DocCategorySlug = categoryParam

  return {
    props: {
      categorySlug,
    },
  }
}

export default function CategoryPage({
  categorySlug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <DocsShell>
      <div className="docs-main-column">
        <MainContent categorySlug={categorySlug} />
      </div>
    </DocsShell>
  )
}
