-- Add about_yourself column to client_applications table
ALTER TABLE public.client_applications
ADD COLUMN about_yourself text;