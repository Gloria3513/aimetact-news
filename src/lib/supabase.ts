/**
 * Supabase 클라이언트 설정
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jyjlzdqwiyzelveyrldb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_lSxznKF8u26ukhjR6CTfeQ_eR6A_crY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: number
          title: string
          content: string
          summary: string
          category: string
          author: string
          tags: string[]
          created_at: string
          updated_at: string
          published: boolean
        }
      }
    }
  }
}
