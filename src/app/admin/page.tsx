'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getArticles, deleteArticle } from '@/lib/articles'
import type { Article } from '@/lib/types'
import { Edit, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react'

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setLoading(true)
    const data = await getArticles()
    setArticles(data)
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    const success = await deleteArticle(id)
    if (success) {
      setArticles(articles.filter(a => a.id !== id))
    } else {
      alert('삭제 실패')
    }
  }

  const handleTogglePublish = async (article: Article) => {
    const success = await fetch(`/api/admin/articles/${article.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !article.published }),
    }).then(res => res.ok)

    if (success) {
      loadArticles()
    }
  }

  const handleFetchNews = async () => {
    if (!confirm('RSS에서 뉴스를 가져오시겠습니까?')) return

    setFetching(true)
    try {
      const response = await fetch('/api/cron/fetch-news')
      const result = await response.json()

      if (result.success) {
        alert(`✅ ${result.stats.totalSaved}개 기사를 가져왔습니다!`)
        loadArticles()
      } else {
        alert(`❌ 오류: ${result.error || '알 수 없는 오류'}`)
      }
    } catch (error) {
      alert('❌ 요청 실패')
    } finally {
      setFetching(false)
    }
  }

  const filteredArticles = articles.filter(a => {
    if (filter === 'published') return a.published
    if (filter === 'draft') return !a.published
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">기사 관리</h1>
        <div className="flex gap-2">
          <button
            onClick={handleFetchNews}
            disabled={fetching}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            {fetching ? '가져오는 중...' : 'RSS 수집'}
          </button>
          <Link
            href="/admin/new"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            새 기사 작성
          </Link>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 ({articles.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'published'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          published ({articles.filter(a => a.published).length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'draft'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Draft ({articles.filter(a => !a.published).length})
        </button>
      </div>

      {/* 기사 목록 */}
      {filteredArticles.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">제목</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">작성일</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/edit/${article.id}`}
                      className="font-medium text-gray-900 hover:text-teal-600"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.category}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        article.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {article.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {article.published ? 'published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/edit/${article.id}`}
                        className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <p className="text-gray-500">기사가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
