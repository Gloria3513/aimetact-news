'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Article } from '@/lib/types'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ArticleEditorProps {
  article?: Article
}

const categories = ['AI교육', '정책', '유치원', '학부모', '인터뷰']

export function ArticleEditor({ article }: ArticleEditorProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    summary: article?.summary || '',
    category: article?.category || 'AI교육',
    author: article?.author || '',
    tags: (article?.tags || []).join(', '),
    image_url: article?.image_url || '',
    published: article?.published || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.url }))
      } else {
        alert(result.error || '업로드 실패')
      }
    } catch (error) {
      alert('업로드 실패')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    try {
      if (article?.id) {
        // 수정
        await fetch(`/api/admin/articles/${article.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        // 생성
        await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      router.push('/admin')
    } catch (error) {
      console.error('Error saving article:', error)
      alert('저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="기사 제목을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* 요약 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요약 *
          </label>
          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            placeholder="기사 요약을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* 썸네일 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            썸네일 이미지
          </label>

          {/* 이미지 업로드 또는 URL 입력 */}
          <div className="space-y-3">
            {/* 업로드 영역 */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? '업로드 중...' : '이미지 업로드'}
              </button>
              {formData.image_url && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 text-sm font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  삭제
                </button>
              )}
            </div>

            {/* URL 입력 (대안) */}
            <div className="relative">
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="또는 이미지 URL 직접 입력"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <ImageIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 이미지 미리보기 */}
          {formData.image_url && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">미리보기:</p>
              <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={formData.image_url}
                  alt="썸네일 미리보기"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 카테고리 & 작성자 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              작성자 *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="작성자명"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그 (콤마로 구분)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="AI, 유치원, 교육"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* 본문 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            본문 * (마크다운 지원)
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={20}
            placeholder="# 제목&#10;&#10;본문 내용을 입력하세요...&#10;&#10;- 리스트&#10;- 항목&#10;&#10## 소제목"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            제목은 #, ##, ### / 리스트는 - / 강조는 &gt; 사용
          </p>
        </div>

        {/* 게시 여부 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            바로 게시 (Published)
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50"
        >
          {saving ? '저장 중...' : article?.id ? '수정하기' : '작성하기'}
        </button>
      </div>
    </form>
  )
}
