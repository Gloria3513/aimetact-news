/**
 * 기사 데이터 관련 함수
 */

import { supabase } from './supabase'
import type { Article, Category, SearchResult } from './types'

// 기사 목록 가져오기
export async function getArticles(options?: {
  category?: string
  published?: boolean
  limit?: number
  offset?: number
}): Promise<Article[]> {
  // 캐시 방지를 위한 타임스탬프 추가
  const cacheBuster = Date.now()

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (options?.category && options.category !== '전체') {
    query = query.eq('category', options.category)
  }

  if (options?.published !== undefined) {
    query = query.eq('published', options.published)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data as Article[]
}

// 기사 하나 가져오기
export async function getArticleById(id: number): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return data as Article
}

// 조회수 증가
export async function incrementViews(id: number): Promise<void> {
  await supabase.rpc('increment_views', { article_id: id })
}

// 관련 기사 가져오기
export async function getRelatedArticles(
  categoryId: string,
  currentId: number,
  limit: number = 3
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', categoryId)
    .eq('published', true)
    .neq('id', currentId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related articles:', error)
    return []
  }

  return data as Article[]
}

// 인기 기사 가져오기 (조회수 기준)
export async function getPopularArticles(limit: number = 5): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching popular articles:', error)
    return []
  }

  return data as Article[]
}

// 검색
export async function searchArticles(query: string): Promise<SearchResult> {
  const { data, error, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching articles:', error)
    return { articles: [], totalCount: 0 }
  }

  return {
    articles: data as Article[],
    totalCount: count || 0
  }
}

// 카테고리별 카운트
export async function getCategoryCounts(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('category')
    .eq('published', true)

  if (error) {
    console.error('Error fetching category counts:', error)
    return []
  }

  const counts: Record<string, number> = {}
  data?.forEach((article: any) => {
    counts[article.category] = (counts[article.category] || 0) + 1
  })

  return Object.entries(counts).map(([slug, count]) => ({
    slug,
    name: slug,
    count
  }))
}

// 기사 생성
export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...article,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating article:', error)
    return null
  }

  return data as Article
}

// 기사 수정
export async function updateArticle(id: number, updates: Partial<Article>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating article:', error)
    return null
  }

  return data as Article
}

// 기사 삭제
export async function deleteArticle(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting article:', error)
    return false
  }

  return true
}
