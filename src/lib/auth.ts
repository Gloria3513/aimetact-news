import { cookies } from 'next/headers'

// 관리자 비밀번호 (환경변수에서 가져오기, 없으면 기본값)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aimeta2026'

// 쿠키 이름
const SESSION_COOKIE = 'admin_session'

// 세션 생성
export async function createSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, 'valid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24시간
    path: '/admin',
  })
}

// 세션 확인
export async function checkSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value === 'valid'
}

// 세션 삭제
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

// 로그인 검증
export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export { ADMIN_USERNAME }
