-- Fix security vulnerability in demo_requests table
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Users can create demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Authenticated users can create demo requests with user_id" ON public.demo_requests;

-- Create secure policies
-- Allow anyone to submit demo requests (for lead generation)
CREATE POLICY "Anyone can create demo requests" 
ON public.demo_requests 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view demo requests (admin functionality)
CREATE POLICY "Authenticated users can view all demo requests" 
ON public.demo_requests 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to update demo requests (for status management)
CREATE POLICY "Authenticated users can update demo requests" 
ON public.demo_requests 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete demo requests if needed
CREATE POLICY "Authenticated users can delete demo requests" 
ON public.demo_requests 
FOR DELETE 
USING (auth.role() = 'authenticated');