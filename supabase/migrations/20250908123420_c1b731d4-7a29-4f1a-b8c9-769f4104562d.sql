-- Fix terminology: Create tables for Plans module with correct Spanish terminology

-- Create continuity_plans table (Planes de Continuidad)
CREATE TABLE public.continuity_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('crisis_management', 'business_continuity', 'disaster_recovery', 'emergency_response')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'active', 'archived')),
  version TEXT NOT NULL DEFAULT '1.0',
  approval_date TIMESTAMP WITH TIME ZONE,
  last_review_date TIMESTAMP WITH TIME ZONE,
  next_review_date TIMESTAMP WITH TIME ZONE,
  responsible_person TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plan_documents table for robust document management
CREATE TABLE public.plan_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.continuity_plans(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('main_plan', 'procedure', 'checklist', 'contact_list', 'flowchart', 'template', 'annex')),
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plan_sections table for structured plan content
CREATE TABLE public.plan_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.continuity_plans(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  section_order INTEGER NOT NULL,
  content TEXT,
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.continuity_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_sections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for continuity_plans
CREATE POLICY "Users can view all continuity plans" 
ON public.continuity_plans FOR SELECT USING (true);

CREATE POLICY "Users can create continuity plans" 
ON public.continuity_plans FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update continuity plans" 
ON public.continuity_plans FOR UPDATE USING (true);

CREATE POLICY "Users can delete continuity plans" 
ON public.continuity_plans FOR DELETE USING (true);

-- Create RLS policies for plan_documents
CREATE POLICY "Users can view all plan documents" 
ON public.plan_documents FOR SELECT USING (true);

CREATE POLICY "Users can create plan documents" 
ON public.plan_documents FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update plan documents" 
ON public.plan_documents FOR UPDATE USING (true);

CREATE POLICY "Users can delete plan documents" 
ON public.plan_documents FOR DELETE USING (true);

-- Create RLS policies for plan_sections
CREATE POLICY "Users can view all plan sections" 
ON public.plan_sections FOR SELECT USING (true);

CREATE POLICY "Users can create plan sections" 
ON public.plan_sections FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update plan sections" 
ON public.plan_sections FOR UPDATE USING (true);

CREATE POLICY "Users can delete plan sections" 
ON public.plan_sections FOR DELETE USING (true);

-- Create triggers for timestamp updates
CREATE TRIGGER update_continuity_plans_updated_at
BEFORE UPDATE ON public.continuity_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_documents_updated_at
BEFORE UPDATE ON public.plan_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_sections_updated_at
BEFORE UPDATE ON public.plan_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_continuity_plans_type ON public.continuity_plans(plan_type);
CREATE INDEX idx_continuity_plans_status ON public.continuity_plans(status);
CREATE INDEX idx_plan_documents_plan_id ON public.plan_documents(plan_id);
CREATE INDEX idx_plan_documents_type ON public.plan_documents(document_type);
CREATE INDEX idx_plan_sections_plan_id ON public.plan_sections(plan_id);
CREATE INDEX idx_plan_sections_order ON public.plan_sections(plan_id, section_order);