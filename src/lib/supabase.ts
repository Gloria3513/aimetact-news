/**
 * Supabase 클라이언트 설정
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owieylvsirzlkrbwjzyw.supabase.co'
const supabaseAnonKey = 'sb_publishable_vWJLhXc_oEm3RDGWT9i8Sg_wfoSQ4ln'

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
