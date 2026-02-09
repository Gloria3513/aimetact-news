'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('구독 완료! 🎉')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || '구독 실패')
      }
    } catch {
      setStatus('error')
      setMessage('오류가 발생했습니다')
    }

    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소"
        required
        disabled={status === 'loading'}
        className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm mb-2 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-white text-teal-700 font-semibold py-2 rounded-lg hover:bg-teal-50 transition-colors relative disabled:opacity-50"
      >
        {status === 'loading' ? '처리 중...' : '구독하기'}
      </button>
      {status === 'success' && (
        <p className="text-green-200 text-sm mt-2">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-red-200 text-sm mt-2">{message}</p>
      )}
    </form>
  )
}
