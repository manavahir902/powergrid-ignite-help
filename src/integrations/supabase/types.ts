export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string | null
          created_ticket_id: string | null
          id: string
          message: string
          response: string | null
          suggested_kb_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_ticket_id?: string | null
          id?: string
          message: string
          response?: string | null
          suggested_kb_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_ticket_id?: string | null
          id?: string
          message?: string
          response?: string | null
          suggested_kb_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_created_ticket_id_fkey"
            columns: ["created_ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_suggested_kb_id_fkey"
            columns: ["suggested_kb_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          points: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamification_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          category: Database["public"]["Enums"]["ticket_category"]
          content: string
          created_at: string | null
          created_by: string | null
          helpful_count: number | null
          id: string
          keywords: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["ticket_category"]
          content: string
          created_at?: string | null
          created_by?: string | null
          helpful_count?: number | null
          id?: string
          keywords?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["ticket_category"]
          content?: string
          created_at?: string | null
          created_by?: string | null
          helpful_count?: number | null
          id?: string
          keywords?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          employee_id: string
          full_name: string
          gamification_points: number | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          employee_id: string
          full_name: string
          gamification_points?: number | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          employee_id?: string
          full_name?: string
          gamification_points?: number | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          ticket_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          ai_suggestions: Json | null
          assigned_to: string | null
          category: Database["public"]["Enums"]["ticket_category"]
          created_at: string | null
          description: string
          id: string
          location: string | null
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolution_notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          title: string
          updated_at: string | null
          urgency_flag: boolean | null
          user_id: string
        }
        Insert: {
          ai_suggestions?: Json | null
          assigned_to?: string | null
          category: Database["public"]["Enums"]["ticket_category"]
          created_at?: string | null
          description: string
          id?: string
          location?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          title: string
          updated_at?: string | null
          urgency_flag?: boolean | null
          user_id: string
        }
        Update: {
          ai_suggestions?: Json | null
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          title?: string
          updated_at?: string | null
          urgency_flag?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          p_description: string
          p_event_type: string
          p_points: number
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      ticket_category:
        | "network"
        | "account"
        | "email"
        | "hardware"
        | "software"
        | "printer"
        | "other"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "employee" | "it_admin" | "it_support" | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ticket_category: [
        "network",
        "account",
        "email",
        "hardware",
        "software",
        "printer",
        "other",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["employee", "it_admin", "it_support", "manager"],
    },
  },
} as const
