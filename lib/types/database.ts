export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      personal_finances: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense' | 'subscription' | 'rent'
          category: string
          amount: number
          date: string
          description: string | null
          recurring: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'income' | 'expense' | 'subscription' | 'rent'
          category: string
          amount: number
          date?: string
          description?: string | null
          recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'income' | 'expense' | 'subscription' | 'rent'
          category?: string
          amount?: number
          date?: string
          description?: string | null
          recurring?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      market_news: {
        Row: {
          id: string
          title: string
          snippet: string | null
          source: string
          url: string
          published_at: string
          topic: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          snippet?: string | null
          source: string
          url: string
          published_at?: string
          topic: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          snippet?: string | null
          source?: string
          url?: string
          published_at?: string
          topic?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      finance_type: 'income' | 'expense' | 'subscription' | 'rent'
    }
  }
}