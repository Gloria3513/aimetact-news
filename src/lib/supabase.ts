/**
 * Supabase 클라이언트 설정
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fnvwvgfqadcwamiwgmge.supabase.co'
const supabaseAnonKey = 'sb_publishable_urTSNeJakmjLdjISlwbbcQ_yXzrN1bv'

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
