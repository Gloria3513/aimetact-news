import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const BUCKET_NAME = 'article-images'

// POST - 이미지 업로드
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    // 파일 타입 확인 (이미지만 허용)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 })
    }

    // 파일 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '5MB 이하의 이미지만 업로드 가능합니다.' }, { status: 400 })
    }

    // 고유 파일명 생성
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop()
    const fileName = `${timestamp}-${random}.${ext}`

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      // Bucket이 없는 경우 안내
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json({
          error: 'Storage bucket이 없습니다. Supabase에서 "article-images" bucket을 만들어주세요.'
        }, { status: 500 })
      }
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: uploadData.path
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: '업로드 실패' }, { status: 500 })
  }
}
