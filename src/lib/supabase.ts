import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxjhtwmrfrbbddmyzyjy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4amh0d21yZnJiYmRkbXl6eWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTE4MTYsImV4cCI6MjA4OTEyNzgxNn0.qjVBBzMRMjGJReHBqBUHIn9DdziL1tDUIdNuLa_zrgM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface News {
  id: number
  title: string
  content: string
  image_url: string | null
  category: 'association' | 'club'
  created_at: string
}

export interface User {
  id: number
  name: string
  gender: string
  id_card: string
  phone: string
  is_annual_card: boolean
  expire_date: string
  points_total: number
  points_count: number
  rank: number
  level: string
  password: string
  created_at: string
}

export interface Match {
  id: number
  opponent: string
  match_date: string
  match_type: 'league' | 'cup' | 'national' | 'second_home'
  venue: string
  is_home: boolean
  result: string | null
  created_at: string
}

export interface PointRecord {
  id: number
  user_id: number
  match_id: number
  points: number
  reason: string
  created_at: string
}
