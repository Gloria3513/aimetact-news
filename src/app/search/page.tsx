import Link from 'next/link'
import { redirect } from 'next/navigation'
import { searchArticles } from '@/lib/articles'
import { Search } from 'lucide-react'

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

interface SearchParams {
  q?: string
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = searchParams.q || ''

  // 검색어가 없으면 빈 상태 표시
  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 h-16">
              <Link href="/" className="text-2xl font-bold text-teal-600">
                aimeta<span className="text-gray-900">edu</span>
              </Link>
            </div>
          </div>
        </header>

        {/* 검색 폼 */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Search className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">기사 검색</h1>
              <p className="text-gray-600">원하시는 기사를 검색해보세요</p>
            </div>

            <form action="/search" method="GET" className="relative">
              <input
                type="search"
                name="q"
                placeholder="검색어를 입력하세요..."
                autoFocus
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                검색
              </button>
            </form>
          </div>
        </main>
      </div>
    )
  }

  // 검색 실행
  const { articles, totalCount } = await searchArticles(query)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              aimeta<span className="text-gray-900">edu</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 검색 결과 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 검색 폼 */}
          <form action="/search" method="GET" className="mb-8">
            <div className="flex gap-2">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="검색어를 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                검색
              </button>
            </div>
          </form>

          {/* 결과 요약 */}
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold">"{query}"</span>에 대한 검색 결과
              <span className="font-bold text-teal-600 ml-1">{totalCount}건</span>
            </p>
          </div>

          {/* 검색 결과 */}
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-semibold mb-2">
                        {article.category}
                      </span>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{formatDate(article.created_at)}</span>
                        <span>•</span>
                        <span>{calcReadTime(article.content)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
              <p className="text-gray-400 text-sm">다른 검색어로 시도해보세요.</p>
            </div>
          )}
        </div>
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
