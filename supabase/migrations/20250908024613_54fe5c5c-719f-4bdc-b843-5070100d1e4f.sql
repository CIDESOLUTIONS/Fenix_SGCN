-- Add new RACI columns for full name, email, and position
ALTER TABLE public.business_processes 
ADD COLUMN IF NOT EXISTS raci_responsible_email TEXT,
ADD COLUMN IF NOT EXISTS raci_responsible_position TEXT,
ADD COLUMN IF NOT EXISTS raci_accountable_email TEXT,
ADD COLUMN IF NOT EXISTS raci_accountable_position TEXT,
ADD COLUMN IF NOT EXISTS raci_consulted_email TEXT,
ADD COLUMN IF NOT EXISTS raci_consulted_position TEXT,
ADD COLUMN IF NOT EXISTS raci_informed_email TEXT,
ADD COLUMN IF NOT EXISTS raci_informed_position TEXT;