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
      profiles: {
        Row: {
          id: string
          username: string
          nickname: string | null
          avatar_url: string | null
          total_points: number
          weekly_points: number
          current_streak: number
          longest_streak: number
          created_at: string
        }
        Insert: {
          id: string
          username: string
          nickname?: string | null
          avatar_url?: string | null
          total_points?: number
          weekly_points?: number
          current_streak?: number
          longest_streak?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          nickname?: string | null
          avatar_url?: string | null
          total_points?: number
          weekly_points?: number
          current_streak?: number
          longest_streak?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          planned_for: string
          planned_at: string
          target_points: number
          actual_points: number | null
          scored_at: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          planned_for: string
          planned_at?: string
          target_points?: number
          actual_points?: number | null
          scored_at?: string | null
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          planned_for?: string
          planned_at?: string
          target_points?: number
          actual_points?: number | null
          scored_at?: string | null
          is_public?: boolean
          created_at?: string
        }
      }
      daily_summaries: {
        Row: {
          id: string
          user_id: string
          date: string
          total_tasks: number
          scored_tasks: number
          total_possible: number
          total_earned: number
          completion_pct: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          total_tasks?: number
          scored_tasks?: number
          total_possible?: number
          total_earned?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          total_tasks?: number
          scored_tasks?: number
          total_possible?: number
          total_earned?: number
          created_at?: string
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          total_points: number
          weekly_points: number
          current_streak: number
          alltime_rank: number
          weekly_rank: number
          days_active: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
