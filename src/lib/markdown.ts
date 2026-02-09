/**
 * 마크다운 렌더링 유틸리티
 */

import React from 'react'

export function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n')
  const result: React.ReactNode[] = []
  let currentList: string[] = []
  let inList = false

  const flushList = () => {
    if (currentList.length > 0) {
      result.push(
        <ul key={`list-${result.length}`} className="ml-4 list-disc text-gray-700 space-y-1 my-4">
          {currentList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const trimmed = lines[idx].trim()

    // 제목 처리
    if (trimmed.startsWith('#')) {
      flushList()

      const match = trimmed.match(/^(#{1,6})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const text = match[2]
        const Tag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements
        const className = level === 1
          ? 'text-3xl font-bold text-gray-900 mt-12 mb-6'
          : level === 2
          ? 'text-2xl font-bold text-gray-900 mt-10 mb-4'
          : 'text-xl font-bold text-gray-900 mt-8 mb-3'

        result.push(<Tag key={idx} className={className}>{text}</Tag>)
      }
      continue
    }

    // 리스트 처리
    if (trimmed.startsWith('- ')) {
      inList = true
      currentList.push(trimmed.substring(2))
      continue
    }

    // 숫자 리스트
    if (/^\d+\.\s+/.test(trimmed)) {
      flushList()
      const match = trimmed.match(/^\d+\.\s+(.+)/)
      if (match) {
        result.push(<ol key={idx} className="ml-4 list-decimal text-gray-700 space-y-1 my-4"><li>{match[1]}</li></ol>)
      }
      continue
    }

    // 빈 줄
    if (!trimmed) {
      if (inList) {
        flushList()
        inList = false
      } else {
        result.push(<br key={idx} />)
      }
      continue
    }

    // 본문
    flushList()
    result.push(<p key={idx} className="text-gray-700 leading-relaxed my-4">{trimmed}</p>)
  }

  // 남은 리스트 플러시
  flushList()

  return <>{result}</>
}
