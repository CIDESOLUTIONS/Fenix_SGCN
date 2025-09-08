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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bia_assessments: {
        Row: {
          created_at: string
          financial_impact_1h: number | null
          financial_impact_1w: number | null
          financial_impact_24h: number | null
          id: string
          mbco: number | null
          mtpd: number | null
          operational_impact: string | null
          process_id: string | null
          regulatory_impact: string | null
          reputation_impact: string | null
          rpo: number | null
          rto: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          financial_impact_1h?: number | null
          financial_impact_1w?: number | null
          financial_impact_24h?: number | null
          id?: string
          mbco?: number | null
          mtpd?: number | null
          operational_impact?: string | null
          process_id?: string | null
          regulatory_impact?: string | null
          reputation_impact?: string | null
          rpo?: number | null
          rto?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          financial_impact_1h?: number | null
          financial_impact_1w?: number | null
          financial_impact_24h?: number | null
          id?: string
          mbco?: number | null
          mtpd?: number | null
          operational_impact?: string | null
          process_id?: string | null
          regulatory_impact?: string | null
          reputation_impact?: string | null
          rpo?: number | null
          rto?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bia_assessments_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      business_processes: {
        Row: {
          created_at: string
          criticality_level: string | null
          department: string | null
          dependencies: string[] | null
          description: string | null
          id: string
          name: string
          raci_accountable: string | null
          raci_accountable_email: string | null
          raci_accountable_position: string | null
          raci_consulted: string | null
          raci_consulted_email: string | null
          raci_consulted_position: string | null
          raci_informed: string | null
          raci_informed_email: string | null
          raci_informed_position: string | null
          raci_responsible: string | null
          raci_responsible_email: string | null
          raci_responsible_position: string | null
          responsible_person: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          criticality_level?: string | null
          department?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          name: string
          raci_accountable?: string | null
          raci_accountable_email?: string | null
          raci_accountable_position?: string | null
          raci_consulted?: string | null
          raci_consulted_email?: string | null
          raci_consulted_position?: string | null
          raci_informed?: string | null
          raci_informed_email?: string | null
          raci_informed_position?: string | null
          raci_responsible?: string | null
          raci_responsible_email?: string | null
          raci_responsible_position?: string | null
          responsible_person?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          criticality_level?: string | null
          department?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          name?: string
          raci_accountable?: string | null
          raci_accountable_email?: string | null
          raci_accountable_position?: string | null
          raci_consulted?: string | null
          raci_consulted_email?: string | null
          raci_consulted_position?: string | null
          raci_informed?: string | null
          raci_informed_email?: string | null
          raci_informed_position?: string | null
          raci_responsible?: string | null
          raci_responsible_email?: string | null
          raci_responsible_position?: string | null
          responsible_person?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      continuity_plans: {
        Row: {
          activation_criteria: string | null
          communication_plan: string | null
          created_at: string
          description: string | null
          id: string
          key_personnel: string[] | null
          last_tested: string | null
          objectives: string[] | null
          plan_name: string
          plan_type: string | null
          procedures: Json | null
          resources: Json | null
          scope: string | null
          status: string | null
          testing_schedule: string | null
          updated_at: string
          user_id: string
          version: string | null
        }
        Insert: {
          activation_criteria?: string | null
          communication_plan?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key_personnel?: string[] | null
          last_tested?: string | null
          objectives?: string[] | null
          plan_name: string
          plan_type?: string | null
          procedures?: Json | null
          resources?: Json | null
          scope?: string | null
          status?: string | null
          testing_schedule?: string | null
          updated_at?: string
          user_id: string
          version?: string | null
        }
        Update: {
          activation_criteria?: string | null
          communication_plan?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key_personnel?: string[] | null
          last_tested?: string | null
          objectives?: string[] | null
          plan_name?: string
          plan_type?: string | null
          procedures?: Json | null
          resources?: Json | null
          scope?: string | null
          status?: string | null
          testing_schedule?: string | null
          updated_at?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      continuity_strategies: {
        Row: {
          applicable_risks: string[] | null
          created_at: string
          description: string | null
          estimated_cost: number | null
          id: string
          implementation_timeline: number | null
          name: string
          process_id: string | null
          resources_required: string | null
          strategy_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applicable_risks?: string[] | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          implementation_timeline?: number | null
          name: string
          process_id?: string | null
          resources_required?: string | null
          strategy_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applicable_risks?: string[] | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          implementation_timeline?: number | null
          name?: string
          process_id?: string | null
          resources_required?: string | null
          strategy_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "continuity_strategies_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      continuity_tests: {
        Row: {
          corrective_actions: Json | null
          created_at: string
          findings: string[] | null
          id: string
          objectives: string[] | null
          overall_rating: number | null
          participants: string[] | null
          plan_id: string | null
          results: string | null
          test_date: string | null
          test_name: string
          test_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          corrective_actions?: Json | null
          created_at?: string
          findings?: string[] | null
          id?: string
          objectives?: string[] | null
          overall_rating?: number | null
          participants?: string[] | null
          plan_id?: string | null
          results?: string | null
          test_date?: string | null
          test_name: string
          test_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          corrective_actions?: Json | null
          created_at?: string
          findings?: string[] | null
          id?: string
          objectives?: string[] | null
          overall_rating?: number | null
          participants?: string[] | null
          plan_id?: string | null
          results?: string | null
          test_date?: string | null
          test_name?: string
          test_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "continuity_tests_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "continuity_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      maintenance_activities: {
        Row: {
          activity_name: string
          activity_type: string | null
          assigned_to: string | null
          completion_date: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_name: string
          activity_type?: string | null
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_name?: string
          activity_type?: string | null
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_analysis: {
        Row: {
          category: string | null
          contingency_plan: string | null
          created_at: string
          id: string
          impact: number | null
          mitigation_strategy: string | null
          probability: number | null
          process_id: string | null
          risk_description: string | null
          risk_level: number | null
          risk_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          contingency_plan?: string | null
          created_at?: string
          id?: string
          impact?: number | null
          mitigation_strategy?: string | null
          probability?: number | null
          process_id?: string | null
          risk_description?: string | null
          risk_level?: number | null
          risk_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          contingency_plan?: string | null
          created_at?: string
          id?: string
          impact?: number | null
          mitigation_strategy?: string | null
          probability?: number | null
          process_id?: string | null
          risk_description?: string | null
          risk_level?: number | null
          risk_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_analysis_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
