import Link from 'next/link'
import { notFound } from 'next/navigation'

// 샘플 뉴스 데이터
const articles = [
  {
    id: 1,
    category: 'AI교육',
    title: 'AI 시대, 유치원 선생님이 알아야 할 5가지',
    summary: '생성형 AI가 유아 교육에 미치는 영향과 활용 방법',
    author: '김지현',
    date: '2026.02.05',
    readTime: '5분',
  },
  {
    id: 2,
    category: '정책',
    title: '교육부, 2025년 유치원 AI 교육 지원 확대',
    summary: '정부가 발표한 새로운 AI 교육 지원 정책의 핵심 내용',
    author: '박민수',
    date: '2026.02.04',
    readTime: '3분',
  },
  {
    id: 3,
    category: '유치원',
    title: '경기 유치원 "AI 활용해서 부모 신뢰 얻어요"',
    summary: '실제 현장에서 AI를 활용해 소통을 개선한 사례',
    author: '이수진',
    date: '2026.02.03',
    readTime: '4분',
  },
  {
    id: 4,
    category: '학부모',
    title: '우리 아이 AI 교육, 어디서부터 시작할까요?',
    summary: '초보 학부모를 위한 AI 교육 가이드',
    author: '정유미',
    date: '2026.02.02',
    readTime: '6분',
  },
  {
    id: 5,
    category: '인터뷰',
    title: '[인터뷰] AI 교육 선구자 원장님의 이야기',
    summary: '경기의 한 유치원에서 시작된 AI 교육 혁신',
    author: '편집부',
    date: '2026.02.01',
    readTime: '8분',
  },
  {
    id: 6,
    category: 'AI교육',
    title: '프롬프트 공부의 정석, 전문가가 알려줘요',
    summary: '효율적인 AI 활용을 위한 프롬프트 작성법',
    author: '최현우',
    date: '2026.01.31',
    readTime: '7분',
  },
]

// 카테고리 한글명 매핑
const categoryNames: Record<string, string> = {
  'AI교육': 'AI 교육',
  '정책': '정책',
  '유치원': '유치원',
  '학부모': '학부모',
  '인터뷰': '인터뷰',
}

// 기사 더미 데이터 (더미 기사 추가용)
const moreArticles = [
  {
    id: 7,
    category: 'AI교육',
    title: 'AI가 유아 교육에 미치는 영향, 연구 결과는?',
    summary: '최신 연구에서 밝혀진 AI와 유아 발달의 관계',
    author: '이연구',
    date: '2026.01.30',
    readTime: '6분',
  },
  {
    id: 8,
    category: '정책',
    title: '경기도, AI 교육 선도 지역 확정',
    summary: '경기도가 AI 교육 선도 지역으로 지정된 배경',
    author: '행정부',
    date: '2026.01.29',
    readTime: '4분',
  },
  {
    id: 9,
    category: '유치원',
    title: '원장님들의 AI 도입기, 성공 비결이 공통점',
    summary: '성공한 원장들이 공통적으로 실천하는 것들',
    author: '김원장',
    date: '2026.01.28',
    readTime: '5분',
  },
  {
    id: 10,
    category: '학부모',
    title: 'AI와 함께하는 육아, 괜찱 괜찱할까요?',
    summary: '전문가들이 말하는 AI 활용 육아의 가이드라인',
    author: '소아과전문의',
    date: '2026.01.27',
    readTime: '7분',
  },
]

// 모든 기사 합치
const allArticles = [...articles, ...moreArticles]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug
  const categoryName = categoryNames[categorySlug]

  // 유효하지 않은 카테고리면 404
  if (!categoryName && categorySlug !== '') {
    notFound()
  }

  // 해당 카테고리 기사 필터링
  const categoryArticles = categorySlug === ''
    ? allArticles
    : allArticles.filter(article => article.category === categoryName)

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
              {categorySlug === '' ? '전체 기사' : categoryName}
            </div>
            <div className="text-2xl font-bold text-teal-600">
              aimeta<span className="text-gray-900">edu</span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 카테고리 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categorySlug === '' ? '전체 기사' : categoryName}
            </h1>
            <p className="text-gray-600">
              총 {categoryArticles.length}개의 기사
            </p>
          </div>

          {/* 카테고리 필터 (상단) */}
          <div className="bg-white rounded-xl p-4 mb-8 shadow-sm flex flex-wrap gap-2">
            <Link
              href="/category"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categorySlug === ''
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </Link>
            {Object.entries(categoryNames).map(([slug, name]) => (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categorySlug === slug
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* 기사 리스트 */}
          <div className="space-y-6">
            {categoryArticles.map((article) => (
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
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 더미 기사 */}
          {categoryArticles.length === 0 && (
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
