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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      community_votes: {
        Row: {
          course_id: string
          created_at: string
          id: string
          score: number
          updated_at: string
          voter_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          score: number
          updated_at?: string
          voter_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          score?: number
          updated_at?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_votes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_photos: {
        Row: {
          caption: string | null
          course_id: string
          created_at: string
          credit: string | null
          id: string
          image_url: string
          sort_order: number
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          course_id: string
          created_at?: string
          credit?: string | null
          id?: string
          image_url: string
          sort_order?: number
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          course_id?: string
          created_at?: string
          credit?: string | null
          id?: string
          image_url?: string
          sort_order?: number
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_photos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_ratings: {
        Row: {
          c_faciliteiten: number
          c_gastvrijheid: number
          c_landschap: number
          c_onderhoud: number
          c_ontwerp: number
          c_prijs_kwaliteit: number
          c_uitdaging: number
          country_code: string
          created_at: string
          fee_band: string
          findings: Json
          greenfee: number
          host_lars: number
          host_levi: number
          host_niels: number
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          notes: string
          pampas_score: number
          played_on: string | null
          rank: number
          region: string
          slug: string
          type: string
          updated_at: string
          verdict: string
        }
        Insert: {
          c_faciliteiten?: number
          c_gastvrijheid?: number
          c_landschap?: number
          c_onderhoud?: number
          c_ontwerp?: number
          c_prijs_kwaliteit?: number
          c_uitdaging?: number
          country_code?: string
          created_at?: string
          fee_band: string
          findings?: Json
          greenfee: number
          host_lars?: number
          host_levi?: number
          host_niels?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string
          pampas_score: number
          played_on?: string | null
          rank: number
          region: string
          slug: string
          type: string
          updated_at?: string
          verdict: string
        }
        Update: {
          c_faciliteiten?: number
          c_gastvrijheid?: number
          c_landschap?: number
          c_onderhoud?: number
          c_ontwerp?: number
          c_prijs_kwaliteit?: number
          c_uitdaging?: number
          country_code?: string
          created_at?: string
          fee_band?: string
          findings?: Json
          greenfee?: number
          host_lars?: number
          host_levi?: number
          host_niels?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string
          pampas_score?: number
          played_on?: string | null
          rank?: number
          region?: string
          slug?: string
          type?: string
          updated_at?: string
          verdict?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          country: string
          created_at: string
          episode_url: string | null
          fee_category: string | null
          greenfee: number | null
          holes: number
          id: string
          name: string
          region: string | null
          type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          country?: string
          created_at?: string
          episode_url?: string | null
          fee_category?: string | null
          greenfee?: number | null
          holes?: number
          id?: string
          name: string
          region?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          episode_url?: string | null
          fee_category?: string | null
          greenfee?: number | null
          holes?: number
          id?: string
          name?: string
          region?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          created_at: string
          date: string
          description: string
          duration: string
          id: string
          image_url: string | null
          number: string
          release_date: string | null
          season: string
          spotify_id: string
          title: string
          topics: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string
          duration?: string
          id?: string
          image_url?: string | null
          number: string
          release_date?: string | null
          season?: string
          spotify_id: string
          title: string
          topics?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          duration?: string
          id?: string
          image_url?: string | null
          number?: string
          release_date?: string | null
          season?: string
          spotify_id?: string
          title?: string
          topics?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      rag_chunks: {
        Row: {
          content: string
          course_name: string | null
          course_slug: string | null
          created_at: string
          embedding: string | null
          id: string
          metadata: Json
          source_id: string
          source_type: string
        }
        Insert: {
          content: string
          course_name?: string | null
          course_slug?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json
          source_id: string
          source_type: string
        }
        Update: {
          content?: string
          course_name?: string | null
          course_slug?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json
          source_id?: string
          source_type?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          course_id: string
          created_at: string
          hole_of_day: string | null
          host: string
          host_score: number | null
          id: string
          one_word: string | null
          played_on: string | null
          review: string | null
          score_challenge: number
          score_condition: number
          score_design: number
          score_facilities: number
          score_hospitality: number
          score_scenery: number
          score_value: number
          updated_at: string
          would_return: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          hole_of_day?: string | null
          host: string
          host_score?: number | null
          id?: string
          one_word?: string | null
          played_on?: string | null
          review?: string | null
          score_challenge: number
          score_condition: number
          score_design: number
          score_facilities: number
          score_hospitality: number
          score_scenery: number
          score_value: number
          updated_at?: string
          would_return?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          hole_of_day?: string | null
          host?: string
          host_score?: number | null
          id?: string
          one_word?: string | null
          played_on?: string | null
          review?: string | null
          score_challenge?: number
          score_condition?: number
          score_design?: number
          score_facilities?: number
          score_hospitality?: number
          score_scenery?: number
          score_value?: number
          updated_at?: string
          would_return?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image_url: string
          link_url: string | null
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image_url: string
          link_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string
          link_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_rag_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          course_name: string
          course_slug: string
          id: string
          metadata: Json
          similarity: number
          source_id: string
          source_type: string
        }[]
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
      app_role: ["admin", "user"],
    },
  },
} as const
