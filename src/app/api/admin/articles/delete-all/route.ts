import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// DELETE - 모든 기사 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .neq('id', 0) // 모든 기사 삭제 (id가 0인 것은 없음)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '모든 기사가 삭제되었습니다.' })
  } catch (error) {
    console.error('Error deleting all articles:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
