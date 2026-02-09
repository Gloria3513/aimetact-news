import { notFound } from 'next/navigation'
import { getArticleById } from '@/lib/articles'
import { ArticleEditor } from '@/components/ArticleEditor'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const articleId = parseInt(id)
  const article = await getArticleById(articleId)

  if (!article) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">기사 수정</h1>
      <ArticleEditor article={article} />
    </div>
  )
}
