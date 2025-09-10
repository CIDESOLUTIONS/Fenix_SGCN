-- Fix critical security vulnerability in profiles table RLS policies
-- Remove all existing conflicting policies
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil." ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserción a usuarios y administradores" ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserción total a los administradores" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create secure, non-conflicting RLS policies
-- Users can only view their own profile data
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only allow profile deletion by the user themselves (optional, can be removed if not needed)
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);