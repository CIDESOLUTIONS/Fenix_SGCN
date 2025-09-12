-- Additional security hardening for profiles table
-- Explicitly revoke all permissions from anon role to ensure no unauthenticated access
REVOKE ALL ON public.profiles FROM anon;

-- Ensure authenticated role has proper permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- Create explicit deny policy for anonymous users (belt and suspenders approach)
CREATE POLICY "Deny all access to anonymous users" 
ON public.profiles 
FOR ALL 
TO anon
USING (false);

-- Ensure RLS is enabled (should already be, but confirming)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners/superusers (maximum security)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;