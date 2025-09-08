-- Create table for strategy selection criteria
CREATE TABLE public.strategy_criteria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  criteria_name TEXT NOT NULL,
  description TEXT,
  weight DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  criteria_type TEXT DEFAULT 'quantitative',
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  scale_description JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for process-strategy evaluations
CREATE TABLE public.process_strategy_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  process_id UUID,
  strategy_id UUID,
  criteria_id UUID,
  score DECIMAL(5,2) NOT NULL,
  notes TEXT,
  evaluated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.strategy_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_strategy_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies for strategy_criteria
CREATE POLICY "Users can view their own criteria" 
ON public.strategy_criteria 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own criteria" 
ON public.strategy_criteria 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own criteria" 
ON public.strategy_criteria 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own criteria" 
ON public.strategy_criteria 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for process_strategy_evaluations
CREATE POLICY "Users can view their own evaluations" 
ON public.process_strategy_evaluations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own evaluations" 
ON public.process_strategy_evaluations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluations" 
ON public.process_strategy_evaluations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluations" 
ON public.process_strategy_evaluations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_strategy_criteria_updated_at
BEFORE UPDATE ON public.strategy_criteria
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_process_strategy_evaluations_updated_at
BEFORE UPDATE ON public.process_strategy_evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();