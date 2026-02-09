import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, PlusCircle, Home, LogOut } from 'lucide-react'
import { checkSession } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 로그인 확인
  const isAuthenticated = await checkSession()
  if (!isAuthenticated) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-xl font-bold text-teal-600">
                  aimeta<span className="text-gray-900">edu</span>
                </span>
                <span className="text-sm text-gray-500">관리자</span>
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-600"
                >
                  <FileText className="w-4 h-4" />
                  기사 목록
                </Link>
                <Link
                  href="/admin/new"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-600"
                >
                  <PlusCircle className="w-4 h-4" />
                  새 기사
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600"
              >
                <Home className="w-4 h-4" />
                사이트 보기
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
