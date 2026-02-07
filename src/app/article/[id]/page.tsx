import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'

// 샘플 기사 데이터 (나중에 Supabase에서 가져옴)
const articles: Record<string, any> = {
  '1': {
    id: 1,
    category: 'AI교육',
    title: 'AI 시대, 유치원 선생님이 알아야 할 5가지',
    summary: '생성형 AI가 유아 교육에 미치는 영향과 활용 방법',
    content: `
# AI 시대, 유치원 선생님이 알아야 할 5가지

## 1. ChatGPT 같은 AI 뭘에요?

생성형 AI는 텍스트, 이미지, 영상 등을 스스로 만들어내는 인공지능입니다.
대표적으로 ChatGPT, Claude, DALL-E 같은 서비스가 있죠.

## 2. 왜 유치원에서 AI를 알아야 하나요?

유아 교육 현장에서 AI는 다음과 같이 활용될 수 있습니다:

- **연간 활동 계획 작성**: 시간 단축
- **부모 소통 자료**: 체계적인 안내
- **활동 아이디어**: 다양한 놀이 제안
- **행정 업무**: 문서화 자동화

## 3. 어떻게 시작하나요?

가장 쉬운 방법은 프롬프트 라이브러리를 활용하는 것입니다.
이미 검증된 프롬프트를 바로 사용하면 실수가 줄어듭니다.

## 4. 주의할 점은?

AI가 생성한 내용은 반드시 선생님이 검토해야 합니다.
유아 발달 단계에 맞지 않는 내용이 있을 수 있거든요.

## 5. 망설립지 마세요!

AI는 도구일 뿐입니다. 선생님의 전문성이 가장 중요합니다.
AI는 선생님을 돕는 보조 역할일 뿐이라는 점을 기억하세요.
    `,
    author: '김지현',
    date: '2026.02.05',
    readTime: '5분',
    tags: ['AI교육', 'ChatGPT', '유치원'],
    image: true,
  },
  '2': {
    id: 2,
    category: '정책',
    title: '교육부, 2025년 유치원 AI 교육 지원 확대',
    summary: '정부가 발표한 새로운 AI 교육 지원 정책의 핵심 내용',
    content: `
# 교육부, 2025년 유치원 AI 교육 지원 확대

## 주요 내용

교육부가 2025년부터 유치원 AI 교육 지원을 대폭 확대한다고 발표했습니다.

## 지원 대상

- 전국 유치원·어린이집
- 특히 경기·강원 등 수도권 외 지역 우선

## 지원 내용

- AI 활용 교육 연수
- 장비 지원
- 프롬프트 라이브러리 무료 제공

## 신청 방법

교육청 홈페이지에서 온라인 신청 가능합니다.
    `,
    author: '박민수',
    date: '2026.02.04',
    readTime: '3분',
    tags: ['정책', '교육부', 'AI교육'],
    image: true,
  },
  '3': {
    id: 3,
    category: '유치원',
    title: '경기 유치원 "AI 활용해서 부모 신뢰 얻어요"',
    summary: '실제 현장에서 AI를 활용해 소통을 개선한 사례',
    content: `
# 경기 유치원 "AI 활용해서 부모 신뢰 얻어요"

## 사례 소개

경기도의 한 유치원에서 AI를 활용해
부모와의 소통을 개선한 사례를 소개합니다.

## 도입 배경

부모님들이 "AI로 무엇을 가르치나요?"라는 질문이 많아졌습니다.

## 해결 방법

AI를 활용해 월간 교육 계획을 시각화해서 전달했습니다.

## 효과

부모님들의 이해도가 높아지고 신뢰가 상승했습니다.
    `,
    author: '이수진',
    date: '2026.02.03',
    readTime: '4분',
    tags: ['유치원', '사례', '부모소통'],
    image: true,
  },
  '4': {
    id: 4,
    category: '학부모',
    title: '우리 아이 AI 교육, 어디서부터 시작할까요?',
    summary: '초보 학부모를 위한 AI 교육 가이드',
    content: `
# 우리 아이 AI 교육, 어디서부터 시작할까요?

## 시작하기 전에

AI 교육은 아이의 연령과 발달 수준을 고려해야 합니다.

## 연령별 추천

- 만 3-5세: AI를 도구로 활용하는 체험 중심
- 만 6-7세: AI의 원리를 이해하는 교육 가능
- 만 8세 이상: 직접 AI 활용 가능

## 주의사항

- 화면 시간 제한
- 부모님과 함께 사용
- 올바른 정보인지 확인
    `,
    author: '정유미',
    date: '2026.02.02',
    readTime: '6분',
    tags: ['학부모', '연령별', '가이드'],
    image: true,
  },
  '5': {
    id: 5,
    category: '인터뷰',
    title: '[인터뷰] AI 교육 선구자 원장님의 이야기',
    summary: '경기의 한 유치원에서 시작된 AI 교육 혁신',
    content: `
# [인터뷰] AI 교육 선구자 원장님의 이야기

## 들어가기

경기도의 한 유치원 김원장님을 만났습니다.
원장님은 2년 전부터 AI를 교육 현장에 도입했습니다.

## 시작하게 된 계기

"선생님들이 업무가 너무 많아서요.
AI를 잘 쓰면 시간을 많이 줄일 수 있을 것 같았어요."

## 도입 과정

처음에는 반대도 있었지만 차차 열리게 되었습니다.

## 성과

- 연간 계획 작성 시간: 8시간 → 2시간
- 부모 설명회 준비: 4시간 → 1시간
- 교사들의 업무 만족도 상승

## 조언

"두려워 말고 일단 시작해보세요.
AI는 선생님을 대체하는 게 아니라 돕는 도구니까요?"
    `,
    author: '편집부',
    date: '2026.02.01',
    readTime: '8분',
    tags: ['인터뷰', '사례', '원장'],
    image: true,
  },
  '6': {
    id: 6,
    category: 'AI교육',
    title: '프롬프트 공부의 정석, 전문가가 알려줘요',
    summary: '효율적인 AI 활용을 위한 프롬프트 작성법',
    content: `
# 프롬프트 공부의 정석, 전문가가 알려줘요

## 프롬프트란 뭔가요?

프롬프트는 AI에게 하는 질문이나 요청입니다.
잘 작성한 프롬프트는 좋은 답변을 얻을 수 있습니다.

## 프롬프트 작성법

### 1. 구체적으로

❌ "유치원 활동 계획 짜줘"
✅ "만 4세 유아를 위한 봄놀이 활동 계획을 짜줘.
      안전 주의사항과 교육적 효과를 포함해야 해."

### 2. 맥락을 분명하게

❌ "부모들한테 보낼 편지 써줘"
✅ "우리 반 아이들의 5월 활동 내역을 알리는
      부모님께 보내는 편지를 작성해줘.
      따뜻하고 신뢰감이 느껴야 해."

### 3. 형식 지정하기

❌ "게시판 문구"
✅ "제목: [봄나물 채집 활동 안내]
   본문: 날짜, 시간, 준비물, 활동 내용 순으로 작성해줘."
    `,
    author: '최현우',
    date: '2026.01.31',
    readTime: '7분',
    tags: ['프롬프트', 'AI활용', '노하우'],
    image: true,
  },
}

// 다른 기사 목록 (관련 기사 추천용)
const getAllArticles = () => Object.values(articles)

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articles[params.id]

  if (!article) {
    notFound()
  }

  // 관련 기사 (같은 카테고리)
  const relatedArticles = getAllArticles()
    .filter(a => a.id !== parseInt(params.id))
    .filter(a => a.category === article.category || a.tags.some(t => article.tags.includes(t)))
    .slice(0, 3)

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
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* 썸네일 이미지 */}
          {article.image && (
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
          )}

          {/* 본문 - Markdown 스타일로 렌더링 */}
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, idx) => {
              // 제목 처리
              if (paragraph.startsWith('# ')) {
                const titleText = paragraph.replace('# ', '')
                const level = paragraph.split(' ')[0].length
                const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
                return (
                  <Tag key={idx} className="font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                    {titleText}
                  </Tag>
                )
              }

              // 리스트 처리
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={idx} className="ml-4 list-disc text-gray-700">
                    {paragraph.replace('- ', '')}
                  </li>
                )
              }

              // 본문
              return (
                <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              )
            })}
          </div>

          {/* 태그 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
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
