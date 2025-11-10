-- Add tier and season columns to collections table
ALTER TABLE public.collections 
ADD COLUMN tier text DEFAULT 'A' CHECK (tier IN ('A', 'B', 'C')),
ADD COLUMN season text;

-- Update existing collections to have tier A by default
UPDATE public.collections SET tier = 'A' WHERE tier IS NULL;

COMMENT ON COLUMN public.collections.tier IS 'A = Public, B = Partial Access, C = Client Only';
COMMENT ON COLUMN public.collections.season IS 'Season or year for the collection (e.g., Spring 2024)';