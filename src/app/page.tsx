import Link from 'next/link'
import { getArticles, getPopularArticles } from '@/lib/articles'

// 날짜 포맷 함수
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

export default async function HomePage() {
  // DB에서 기사 가져오기
  const articles = await getArticles({ published: true })
  const popularArticles = await getPopularArticles(5)

  const categories = ['전체', 'AI교육', '정책', '유치원', '학부모', '인터뷰']

  // 데이터가 없으면 안내 메시지
  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">아직 등록된 기사가 없습니다</h1>
          <p className="text-gray-600">관리자 페이지에서 첫 기사를 작성해주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-teal-600">
                aimeta<span className="text-gray-900">edu</span>
              </div>
            </Link>

            {/* 네비게이션 */}
            <nav className="hidden md:flex items-center gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat === '전체' ? '' : cat}`}
                  className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </nav>

            {/* 검색 */}
            <div className="flex items-center gap-3">
              <Link href="/search" className="relative">
                <input
                  type="search"
                  placeholder="기사 검색..."
                  readOnly
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                />
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <button className="md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 뉴스 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 메인 기사 */}
          <div className="lg:col-span-2">
            {/* 헤드라인 기사 */}
            <Link href={`/article/${articles[0].id}`} className="block mb-8">
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-900 opacity-80"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold tracking-tight">AI 교육</span>
                  </div>
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold mb-3">
                    {articles[0].category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-teal-600 transition-colors">
                    {articles[0].title}
                  </h2>
                  <p className="text-gray-600 mb-4">{articles[0].summary}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{articles[0].author}</span>
                    <span>•</span>
                    <span>{formatDate(articles[0].created_at)}</span>
                    <span>•</span>
                    <span>{calcReadTime(articles[0].content)}</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* 서브 기사들 */}
            <div className="grid md:grid-cols-2 gap-6">
              {articles.slice(1).map((item) => (
                <Link key={item.id} href={`/article/${item.id}`} className="block">
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                      <span className="text-slate-400 text-4xl font-bold">{item.category[0]}</span>
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-teal-100 opacity-30"></div>
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-semibold mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatDate(item.created_at)}</span>
                        <span>•</span>
                        <span>{calcReadTime(item.content)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* 사이드바 */}
          <aside className="space-y-6">
            {/* 인기 기사 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a1 1 0 00.57 1.285c.16.12.362.24.574.332.591.151.742.262 1.451.465 2.085a1 1 0 00.57 1.285c-.243.096-.525.147-.832.147-.693 0-1.334-.196-1.84-.531-.533-.352-.95-.847-1.195-1.431a1 1 0 00-.96-.065c-.533.183-.993.508-1.297.95a1 1 0 00-.37.373c-.533.705-.923 1.473-1.083 2.436a1 1 0 00.56 1.285c.293.09.563.18.858.205.34.064.683.113 1.022.172.398.073.79.165 1.127.276a1 1 0 00.562 1.286c-.407.086-.783.225-1.128.413-.367.203-.674.476-1.016.646-.356.18-.73.29-1.097.28a1 1 0 00-.96.065c-.66.032-1.28.222-1.79.531-.53.318-.942.745-1.21 1.25a1 1 0 00.37.368c.508.746.946 1.57 1.174 2.608.083.352.12.721.276 1.057.233.37-.066.714-.19 1.313-.456 1.77-.285.49-.653.763-1.111.815a1 1 0 00-.96-.064c-.727.127-1.37.443-1.849.91-.505.49-.86 1.046-1.047 1.687-.076.373-.107.775-.18 1.168a1 1 0 00.378.86c.38.767.876 1.437 1.21 2.105a1 1 0 00.57 1.285c-.243.097-.508.186-.775.264a5.474 5.474 0 01-.57 1.286c-.445.514-.96.948-1.547 1.193-.622.26-1.266.314-1.896.516a1 1 0 00-.96.063c-.594.096-1.157.292-1.642.576-.56.306-1.042.69-1.453 1.126-.24.293-.484.518-.717.706a1 1 0 00-.96.064c-.453.434-.822.918-1.07 1.494-.269.646-.39 1.347-.34 2.112a1 1 0 00.292.655c.335.791.763 1.55 1.225 2.38a1 1 0 00.56 1.286c-.412.388-.892.787-1.556 1.082-2.34.31-.804.716-1.246 1.558-1.33 2.514a1 1 0 00.37.364z" clipRule="evenodd" />
                </svg>
                인기 기사
              </h3>
              <div className="space-y-4">
                {popularArticles.map((item, idx) => (
                  <Link key={item.id} href={`/article/${item.id}`} className="block group">
                    <div className="flex gap-3">
                      <span className="text-2xl font-bold text-gray-300 group-hover:text-teal-600 transition-colors">{idx + 1}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-teal-600 text-sm line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 뉴스레터 */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <h3 className="text-lg font-bold mb-2 relative">📰 뉴스레터 구독</h3>
              <p className="text-teal-100 text-sm mb-4 relative">
                최신 교육 소식을 매일 아침 메일로 받아보세요
              </p>
              <NewsletterForm />
            </div>

            {/* 스마택트 배너 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎓</span>
                <h3 className="text-lg font-bold text-gray-900">AI 교육이 필요하신가요?</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                스마택트에서 맞춤형 AI 교육 솔루션을 만나보세요
              </p>
              <a href="https://smartact.co.kr" target="_blank" rel="noopener noreferrer" className="block">
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors">
                  스마택트 방문하기
                </button>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                <span className="text-teal-400">aimeta</span><span>edu</span>
              </div>
              <p className="text-sm">
                AI 시대의 교육 뉴스
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">카테고리</h4>
              <ul className="text-sm space-y-2">
                {categories.slice(1).map((cat) => (
                  <li key={cat}>
                    <Link href={`/category/${cat}`} className="hover:text-white">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">소개</h4>
              <ul className="text-sm space-y-2">
                <li><Link href="#" className="hover:text-white">회사 소개</Link></li>
                <li><Link href="#" className="hover:text-white">광고 문의</Link></li>
                <li><Link href="#" className="hover:text-white">파트너십</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">문의</h4>
              <ul className="text-sm space-y-2">
                <li>contact@aimetaedu.com</li>
                <li>카카오톡: @aimetaedu</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2026 aimetaedu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// 뉴스레터 폼 컴포넌트
import NewsletterForm from '@/components/NewsletterForm'
