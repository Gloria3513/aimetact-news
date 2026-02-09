import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { getArticleById, getRelatedArticles, incrementViews } from '@/lib/articles'

// 날짜 포맷
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.')
}

// 읽기 시간 계산
function calcReadTime(content: string): string {
  const wordsPerMinute = 500
  const wordCount = content.length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes}분`
}

// 마크다운 렌더링
function renderMarkdown(content: string) {
  // 줄 단위로 분할
  const paragraphs = content.split('\n\n')

  return paragraphs.map((block, idx) => {
    const trimmed = block.trim()

    // 헤딩 처리
    if (trimmed.startsWith('### ')) {
      return <h3 key={idx} className="text-xl font-bold text-gray-900 mt-8 mb-3">{trimmed.replace('### ', '')}</h3>
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{trimmed.replace('## ', '')}</h2>
    }
    if (trimmed.startsWith('# ')) {
      return <h1 key={idx} className="text-3xl font-bold text-gray-900 mt-12 mb-6">{trimmed.replace('# ', '')}</h1>
    }

    // 리스트 처리
    if (trimmed.startsWith('- ')) {
      return <li key={idx} className="ml-4 list-disc text-gray-700">{trimmed.replace('- ', '')}</li>
    }

    // 강조 처리
    if (trimmed.startsWith('> ')) {
      return <blockquote key={idx} className="border-l-4 border-teal-500 pl-4 italic text-gray-600 my-4">{trimmed.replace('> ', '')}</blockquote>
    }

    // 본문
    return <p key={idx} className="text-gray-700 leading-relaxed my-4">{trimmed}</p>
  })
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const articleId = parseInt(params.id)

  // 기사 가져오기
  const article = await getArticleById(articleId)

  if (!article) {
    notFound()
  }

  // 조회수 증가 (백그라운드)
  incrementViews(articleId).catch(console.error)

  // 관련 기사
  const relatedArticles = await getRelatedArticles(article.category, articleId, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">목록으로</span>
            </Link>
            <div className="flex-1"></div>
            <Link href="/" className="text-2xl font-bold text-teal-600">
              aimeta<span className="text-gray-900">edu</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 기사 본문 */}
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* 카테고리 */}
          <div className="mb-4">
            <Link
              href={`/category/${article.category}`}
              className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold hover:bg-teal-200 transition-colors"
            >
              {article.category}
            </Link>
          </div>

          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* 부가 정보 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{calcReadTime(article.content)}</span>
            </div>
          </div>

          {/* 썸네일 이미지 */}
          <div className="mb-8 aspect-video bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-900 opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-5xl md:text-6xl font-bold tracking-tight">{article.category}</span>
            </div>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-40 h-40 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-32 h-32 border-2 border-white rounded-full"></div>
            </div>
          </div>

          {/* 요약 */}
          {article.summary && (
            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-r-lg mb-8">
              <p className="text-lg text-gray-800 font-medium">{article.summary}</p>
            </div>
          )}

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {renderMarkdown(article.content)}
          </div>

          {/* 태그 */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* 관련 기사 */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📰 관련 기사
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/article/${related.id}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-4xl font-bold">{related.category[0]}</span>
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-semibold mb-2">
                        {related.category}
                      </span>
                      <h3 className="font-bold text-gray-900 group-hover:text-teal-600 text-sm line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p>© 2026 aimetaedu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
