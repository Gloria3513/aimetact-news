import { NextRequest, NextResponse } from 'next/server'
import { createArticle } from '@/lib/articles'

// POST - 새 기사 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newArticle = await createArticle(body)

    if (!newArticle) {
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
    }

    return NextResponse.json(newArticle)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Create failed' }, { status: 500 })
  }
}
