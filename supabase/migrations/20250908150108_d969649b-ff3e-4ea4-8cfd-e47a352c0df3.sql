-- Add corrective action tracking table
CREATE TABLE public.corrective_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.continuity_tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action_description TEXT NOT NULL,
  assigned_to TEXT,
  assigned_email TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  completion_date DATE,
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.corrective_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for corrective actions
CREATE POLICY "Users can view their own corrective actions" 
ON public.corrective_actions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own corrective actions" 
ON public.corrective_actions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own corrective actions" 
ON public.corrective_actions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own corrective actions" 
ON public.corrective_actions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_corrective_actions_updated_at
BEFORE UPDATE ON public.corrective_actions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add test execution steps table
CREATE TABLE public.test_execution_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.continuity_tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  step_number INTEGER NOT NULL,
  step_description TEXT NOT NULL,
  expected_result TEXT,
  actual_result TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'skipped')),
  execution_time INTEGER, -- in minutes
  notes TEXT,
  executed_by TEXT,
  executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_execution_steps ENABLE ROW LEVEL SECURITY;

-- Create policies for test execution steps
CREATE POLICY "Users can view their own test execution steps" 
ON public.test_execution_steps 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test execution steps" 
ON public.test_execution_steps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test execution steps" 
ON public.test_execution_steps 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test execution steps" 
ON public.test_execution_steps 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_test_execution_steps_updated_at
BEFORE UPDATE ON public.test_execution_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();