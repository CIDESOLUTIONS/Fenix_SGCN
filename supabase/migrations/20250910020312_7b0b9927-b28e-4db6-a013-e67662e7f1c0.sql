-- Create role-based access control for demo_requests security
-- First create the app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for role management
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update demo_requests policies to use role-based access
DROP POLICY IF EXISTS "Authenticated users can view all demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Authenticated users can update demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Authenticated users can delete demo requests" ON public.demo_requests;

-- Only admins can view demo requests
CREATE POLICY "Only admins can view demo requests" 
ON public.demo_requests 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update demo requests status
CREATE POLICY "Only admins can update demo requests" 
ON public.demo_requests 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete demo requests
CREATE POLICY "Only admins can delete demo requests" 
ON public.demo_requests 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();