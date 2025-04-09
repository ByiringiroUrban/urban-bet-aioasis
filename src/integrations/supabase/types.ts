export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_predictions: {
        Row: {
          analysis: string | null
          confidence: number
          created_at: string | null
          id: string
          match: string
          odds: string | null
          prediction: string
          trend: string | null
          user_id: string | null
        }
        Insert: {
          analysis?: string | null
          confidence: number
          created_at?: string | null
          id?: string
          match: string
          odds?: string | null
          prediction: string
          trend?: string | null
          user_id?: string | null
        }
        Update: {
          analysis?: string | null
          confidence?: number
          created_at?: string | null
          id?: string
          match?: string
          odds?: string | null
          prediction?: string
          trend?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bets: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          items: Json
          potential_winnings: number
          status: string | null
          total_odds: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          items: Json
          potential_winnings: number
          status?: string | null
          total_odds: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          items?: Json
          potential_winnings?: number
          status?: string | null
          total_odds?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          away_team: string
          country: string | null
          created_at: string | null
          home_team: string
          id: string
          is_live: boolean | null
          league: string | null
          sport_id: string | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          away_team: string
          country?: string | null
          created_at?: string | null
          home_team: string
          id?: string
          is_live?: boolean | null
          league?: string | null
          sport_id?: string | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          away_team?: string
          country?: string | null
          created_at?: string | null
          home_team?: string
          id?: string
          is_live?: boolean | null
          league?: string | null
          sport_id?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          name: string
          options: Json
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          name: string
          options: Json
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          name?: string
          options?: Json
        }
        Relationships: [
          {
            foreignKeyName: "markets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      odds: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          market_id: string | null
          selection: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          market_id?: string | null
          selection: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          market_id?: string | null
          selection?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "odds_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odds_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sports: {
        Row: {
          active: boolean | null
          created_at: string | null
          display_order: number | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
