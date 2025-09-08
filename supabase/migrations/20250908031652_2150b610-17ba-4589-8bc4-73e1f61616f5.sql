-- Add module_type column to strategy_criteria table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'strategy_criteria' 
                   AND column_name = 'module_type') THEN
        ALTER TABLE public.strategy_criteria 
        ADD COLUMN module_type TEXT DEFAULT 'strategy';
    END IF;
END $$;