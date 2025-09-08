-- Create findings table for registering non-conformities and findings
CREATE TABLE public.findings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  finding_type TEXT NOT NULL DEFAULT 'non_conformity', -- 'non_conformity', 'observation', 'opportunity'
  title TEXT NOT NULL,
  description TEXT,
  source TEXT, -- 'internal_audit', 'external_audit', 'management_review', 'incident', 'other'
  severity TEXT DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'closed', 'rejected'
  identified_date DATE DEFAULT CURRENT_DATE,
  area_department TEXT,
  responsible_person TEXT,
  responsible_email TEXT,
  root_cause_analysis TEXT,
  evidence_attachments JSONB,
  closure_date DATE,
  closure_verification TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance framework table
CREATE TABLE public.compliance_framework (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  framework_name TEXT NOT NULL, -- 'ISO 22301', 'ISO 27001', 'NIST', 'Custom'
  version TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'under_review'
  certification_date DATE,
  expiry_date DATE,
  certifying_body TEXT,
  certificate_number TEXT,
  scope_description TEXT,
  compliance_level NUMERIC DEFAULT 0, -- 0-100 percentage
  last_assessment_date DATE,
  next_assessment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance requirements table
CREATE TABLE public.compliance_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  framework_id UUID REFERENCES public.compliance_framework(id),
  requirement_code TEXT NOT NULL,
  requirement_title TEXT NOT NULL,
  requirement_description TEXT,
  compliance_status TEXT DEFAULT 'not_assessed', -- 'compliant', 'partially_compliant', 'non_compliant', 'not_assessed'
  implementation_level NUMERIC DEFAULT 0, -- 0-100 percentage
  evidence_description TEXT,
  gaps_identified TEXT,
  action_plan TEXT,
  responsible_person TEXT,
  target_completion_date DATE,
  last_review_date DATE,
  reviewer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create management review table
CREATE TABLE public.management_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  review_date DATE NOT NULL,
  review_period_start DATE,
  review_period_end DATE,
  attendees JSONB, -- Array of attendee objects
  review_status TEXT DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'cancelled'
  
  -- Key performance indicators
  system_effectiveness_rating NUMERIC, -- 1-10 scale
  objectives_achievement_percentage NUMERIC,
  incidents_count INTEGER DEFAULT 0,
  tests_conducted INTEGER DEFAULT 0,
  corrective_actions_closed INTEGER DEFAULT 0,
  
  -- Review findings
  strengths TEXT,
  improvement_areas TEXT,
  strategic_decisions TEXT,
  resource_requirements TEXT,
  
  -- Management decisions
  policy_changes TEXT,
  objective_updates TEXT,
  resource_allocation TEXT,
  
  -- Evidence attachments
  evidence_attachments JSONB,
  
  -- Report generation
  report_generated BOOLEAN DEFAULT false,
  report_generated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create key performance indicators table
CREATE TABLE public.kpi_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'availability', 'recovery_time', 'test_success', 'compliance', 'training'
  measurement_unit TEXT, -- 'percentage', 'hours', 'days', 'count'
  target_value NUMERIC,
  current_value NUMERIC,
  measurement_period TEXT, -- 'monthly', 'quarterly', 'yearly'
  measurement_date DATE DEFAULT CURRENT_DATE,
  trend TEXT, -- 'improving', 'stable', 'declining'
  status TEXT DEFAULT 'on_track', -- 'on_track', 'at_risk', 'off_track'
  responsible_person TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_framework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.management_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for findings
CREATE POLICY "Users can view their own findings" ON public.findings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own findings" ON public.findings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own findings" ON public.findings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own findings" ON public.findings FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for compliance framework
CREATE POLICY "Users can view their own compliance frameworks" ON public.compliance_framework FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own compliance frameworks" ON public.compliance_framework FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own compliance frameworks" ON public.compliance_framework FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own compliance frameworks" ON public.compliance_framework FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for compliance requirements
CREATE POLICY "Users can view their own compliance requirements" ON public.compliance_requirements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own compliance requirements" ON public.compliance_requirements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own compliance requirements" ON public.compliance_requirements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own compliance requirements" ON public.compliance_requirements FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for management reviews
CREATE POLICY "Users can view their own management reviews" ON public.management_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own management reviews" ON public.management_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own management reviews" ON public.management_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own management reviews" ON public.management_reviews FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for KPI metrics
CREATE POLICY "Users can view their own KPI metrics" ON public.kpi_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own KPI metrics" ON public.kpi_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own KPI metrics" ON public.kpi_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own KPI metrics" ON public.kpi_metrics FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON public.findings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_framework_updated_at BEFORE UPDATE ON public.compliance_framework FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_requirements_updated_at BEFORE UPDATE ON public.compliance_requirements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_management_reviews_updated_at BEFORE UPDATE ON public.management_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kpi_metrics_updated_at BEFORE UPDATE ON public.kpi_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();