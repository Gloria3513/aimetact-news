import Link from 'next/link'
import { getArticles } from '@/lib/articles'

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

// 카테고리 목록
const categories = [
  { slug: '', name: '전체' },
  { slug: 'AI교육', name: 'AI교육' },
  { slug: '정책', name: '정책' },
  { slug: '유치원', name: '유치원' },
  { slug: '학부모', name: '학부모' },
  { slug: '인터뷰', name: '인터뷰' },
]

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = decodeURIComponent(params.slug)
  const categoryName = categories.find(c => c.slug === categorySlug)?.name || '전체'

  // 기사 가져오기
  const articles = await getArticles({
    category: categorySlug === '' ? undefined : categorySlug,
    published: true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">홈</span>
            </Link>
            <div className="flex-1"></div>
            <div className="text-lg font-bold text-gray-900">
              {categoryName}
            </div>
            <Link href="/" className="text-2xl font-bold text-teal-600">
              aimeta<span className="text-gray-900">edu</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 카테고리 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600">
              총 {articles.length}개의 기사
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="bg-white rounded-xl p-4 mb-8 shadow-sm flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* 기사 리스트 */}
          {articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="md:flex">
                    {/* 썸네일 */}
                    <div className="md:w-1/3">
                      <div className="aspect-video bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                        <span className="text-teal-400 text-4xl font-bold">{article.category[0]}</span>
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="p-6 md:w-2/3">
                      <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-semibold mb-2">
                        {article.category}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
              <div className="text-6xl mb-4">📰</div>
              <p className="text-gray-500">아직 기사가 없습니다.</p>
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
