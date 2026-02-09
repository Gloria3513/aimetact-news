/**
 * 뉴스 자동 수집 Cron Job
 * Vercel Cron Jobs에서 매일 실행
 *
 * 실행 스케줄: 매일 오전 9시 (KST)
 */

import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { supabase } from '@/lib/supabase'

// Custom fields for media content (이미지 추출용)
const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'thumbnail'],
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
    ],
  },
})

// 이미지 URL 추출 함수
function extractImageUrl(item: any): string | null {
  // 1. enclosure에서 이미지 URL (Google News 주요 방식)
  if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
    return item.enclosure.url
  }

  // 2. media:thumbnail
  if (item.thumbnail && item.thumbnail.$) {
    return item.thumbnail.$.url
  }

  // 3. media:content
  if (item.mediaContent && item.mediaContent.$) {
    return item.mediaContent.$.url
  }

  // 4. Google News 특수: content 안에 이미지 태그
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/)
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1]
    }
  }

  return null
}

// AI 교육 관련 키워드
const AI_EDUCATION_KEYWORDS = [
  'AI 교육',
  '인공지능 교육',
  'AI 교사',
  'AI 유치원',
  'AI 초등',
  'AI 학교',
  'AI 디지털 교과서',
  'AI 교육활동',
  'AI 활용 교육',
  'AI 교육 플랫폼',
  'AI 강사',
  'AI 튜터',
  'AI 학습',
  'AI 융합 교육',
  'AI 소프트웨어 교육',
]

// Google News RSS URL (AI 교육 관련)
// 타임아웃 방지를 위해 2개만 사용
const RSS_FEEDS = [
  'https://news.google.com/rss/search?q=AI%20education&hl=en&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=artificial%20intelligence%20education&hl=en&gl=US&ceid=US:en',
]

// 테스트용: 최대 5개 기사만 수집
const MAX_ARTICLES_PER_FEED = 5

// 요약 생성 함수
function generateSummary(content: string, maxLength = 200): string {
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanContent.length <= maxLength) return cleanContent
  return cleanContent.substring(0, maxLength) + '...'
}

// 카테고리 추정 함수
function estimateCategory(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase()

  if (text.includes('유치원') || text.includes('어린이집') || text.includes('유아')) return '유치원'
  if (text.includes('정책') || text.includes('법') || text.includes('예산') || text.includes('지원')) return '정책'
  if (text.includes('학부모') || text.includes('부모') || text.includes('가정')) return '학부모'
  if (text.includes('인터뷰') || text.includes('사례') || text.includes('현장')) return '인터뷰'

  return 'AI교육'
}

// 키워드 추출 함수
function extractKeywords(title: string, content: string): string[] {
  const keywords: string[] = []

  for (const keyword of AI_EDUCATION_KEYWORDS) {
    if ((title + ' ' + content).includes(keyword)) {
      keywords.push(keyword)
    }
  }

  // 추가 키워드 추출
  const additionalKeywords = [
    'OpenAI', 'ChatGPT', 'GPT-4', '교육부', '교과서', '디지털',
    'SW', '소프트웨어', '코딩', '프로그래밍', '로봇', '메타버스'
  ]

  for (const keyword of additionalKeywords) {
    if ((title + ' ' + content).includes(keyword)) {
      keywords.push(keyword)
    }
  }

  return [...new Set(keywords)].slice(0, 5)
}

// CORS 헤더 설정
function setCORSHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 뉴스 수집 시작...')

    let totalFetched = 0
    let totalSaved = 0
    const errors: string[] = []

    // 각 RSS 피드에서 기사 가져오기
    for (const feedUrl of RSS_FEEDS) {
      try {
        console.log(`📡 피드 수집: ${feedUrl}`)
        const feed = await parser.parseURL(feedUrl)

        if (!feed.items) continue

        let articleCount = 0
        for (const item of feed.items) {
          // 최대 개수 제한
          if (articleCount >= MAX_ARTICLES_PER_FEED) break
          articleCount++
          totalFetched++

          // 중복 체크 (제목으로)
          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('title', item.title || '')
            .single()

          if (existing) {
            console.log(`⏭️  중복 기사 건너뜀: ${item.title}`)
            continue
          }

          // 카테고리 추정
          const category = estimateCategory(
            item.title || '',
            item.contentSnippet || ''
          )

          // 키워드 추출
          const keywords = extractKeywords(
            item.title || '',
            item.contentSnippet || ''
          )

          // 이미지 URL 추출
          const imageUrl = extractImageUrl(item)

          // 기사 저장
          const { error: insertError } = await supabase
            .from('articles')
            .insert({
              title: item.title || '제목 없음',
              content: item.contentSnippet || item.content || '',
              summary: generateSummary(item.contentSnippet || item.content || ''),
              category: category,
              author: (item as any).creator || (item as any).author || 'Google News',
              tags: keywords,
              published: false, // 관리자 검토 후 발행
              image_url: imageUrl,
              views: 0,
            })

          if (insertError) {
            console.error('❌ 기사 저장 실패:', insertError)
            errors.push(`${item.title}: ${insertError.message}`)
          } else {
            totalSaved++
            console.log(`✅ 기사 저장 완료: ${item.title}`)
          }
        }
      } catch (feedError) {
        console.error(`❌ 피드 파싱 오류 (${feedUrl}):`, feedError)
        errors.push(`${feedUrl}: ${feedError}`)
      }
    }

    const result = {
      success: true,
      message: `뉴스 수집 완료`,
      stats: {
        totalFetched,
        totalSaved,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    }

    console.log('✅ 뉴스 수집 완료:', result)

    const response = NextResponse.json(result)
    return setCORSHeaders(response)
  } catch (error) {
    console.error('❌ 뉴스 수집 실패:', error)

    const response = NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
    return setCORSHeaders(response)
  }
}

// OPTIONS 메서드 지원 (CORS preflight)
export async function OPTIONS() {
  return setCORSHeaders(new NextResponse(null, { status: 200 }))
}
