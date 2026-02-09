import { ArticleEditor } from '@/components/ArticleEditor'

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">새 기사 작성</h1>
      <ArticleEditor />
    </div>
  )
}
