-- Add features column to collections table
ALTER TABLE public.collections 
ADD COLUMN features TEXT[] DEFAULT ARRAY['Heritage craftsmanship', 'Sustainable luxury', 'Limited production', 'Custom tailoring'];