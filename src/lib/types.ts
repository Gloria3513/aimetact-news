/**
 * 타입 정의
 */

export interface Article {
  id: number
  title: string
  content: string
  summary: string
  category: string
  author: string
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
  image_url?: string
  views?: number
}

export interface Category {
  slug: string
  name: string
  count: number
}

export interface NewsletterSubscriber {
  id: number
  email: string
  created_at: string
  active: boolean
}

export interface SearchResult {
  articles: Article[]
  totalCount: number
}

export type ArticleCategory = 'AI교육' | '정책' | '유치원' | '학부모' | '인터뷰'
