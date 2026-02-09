import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요' },
        { status: 400 }
      )
    }

    if (verifyCredentials(username, password)) {
      await createSession()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: '아이디 또는 비밀번호가 올바르지 않습니다' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: '로그인에 실패했습니다' },
      { status: 500 }
    )
  }
}
