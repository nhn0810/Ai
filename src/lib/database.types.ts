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
      attendance_logs: {
        Row: {
          checked_in_at: string
          id: number
          is_manual_override: boolean | null
          study_id: number
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          id?: number
          is_manual_override?: boolean | null
          study_id: number
          user_id: string
        }
        Update: {
          checked_in_at?: string
          id?: number
          is_manual_override?: boolean | null
          study_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_logs_study_id_fkey"
            columns: ["study_id"]
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string
          id: number
          image_url: string | null
          study_id: number
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          study_id: number
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          study_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_study_id_fkey"
            columns: ["study_id"]
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          id: string
          is_online: boolean | null
          manner_score: number | null
          nickname: string | null
          participation_score: number | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          id: string
          is_online?: boolean | null
          manner_score?: number | null
          nickname?: string | null
          participation_score?: number | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          id?: string
          is_online?: boolean | null
          manner_score?: number | null
          nickname?: string | null
          participation_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      studies: {
        Row: {
          created_at: string
          description: string | null
          enrollment_type: string
          id: number
          leader_id: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enrollment_type?: string
          id?: number
          leader_id: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enrollment_type?: string
          id?: number
          leader_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "studies_leader_id_fkey"
            columns: ["leader_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      study_members: {
        Row: {
          joined_at: string
          role: string
          study_id: number
          user_id: string
        }
        Insert: {
          joined_at?: string
          role?: string
          study_id: number
          user_id: string
        }
        Update: {
          joined_at?: string
          role?: string
          study_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_members_study_id_fkey"
            columns: ["study_id"]
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      user_rankings: {
        Row: {
          id: string
          nickname: string | null
          avatar_url: string | null
          score: number
          rank: number
        }
      }
      study_rankings: {
        Row: {
          id: number
          title: string
          description: string | null
          score: number
          rank: number
        }
      }
    }
    Functions: {
      apply_penalty: {
        Args: {
          p_user_id: string
          p_manner_deduction: number
          p_participation_deduction: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
