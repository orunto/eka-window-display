-- Create client applications table
CREATE TABLE public.client_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add tier column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN tier TEXT DEFAULT 'C' CHECK (tier IN ('A', 'B', 'C'));

-- Enable RLS on client_applications
ALTER TABLE public.client_applications ENABLE ROW LEVEL SECURITY;

-- Admins can manage all applications
CREATE POLICY "Admins can manage applications" 
ON public.client_applications 
FOR ALL 
USING (is_admin());

-- Anyone can create an application
CREATE POLICY "Anyone can create applications" 
ON public.client_applications 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_client_applications_updated_at
BEFORE UPDATE ON public.client_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_client_applications_status ON public.client_applications(status);
CREATE INDEX idx_client_applications_email ON public.client_applications(email);