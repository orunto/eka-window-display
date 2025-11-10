-- Add currency column to orders table
ALTER TABLE public.orders
ADD COLUMN currency text DEFAULT 'NGN'::text;

-- Add variant_id and variant_details to order_items for tracking selected variants
ALTER TABLE public.order_items
ADD COLUMN variant_id uuid,
ADD COLUMN variant_name text,
ADD COLUMN variant_type text;

-- Update order status check constraint to include new states
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('initiated', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Update default status to 'initiated'
ALTER TABLE public.orders
ALTER COLUMN status SET DEFAULT 'initiated'::text;