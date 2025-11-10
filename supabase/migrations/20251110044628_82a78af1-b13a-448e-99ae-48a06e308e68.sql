-- Add multi-currency price fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS price_ngn numeric,
ADD COLUMN IF NOT EXISTS price_usd numeric,
ADD COLUMN IF NOT EXISTS price_gbp numeric;

-- Update existing products to copy price to all currency fields
UPDATE products
SET 
  price_ngn = price,
  price_usd = price,
  price_gbp = price
WHERE price IS NOT NULL;

-- Create site_settings for payment keys if they don't exist
INSERT INTO site_settings (key, value, description)
VALUES 
  ('paystack_public_key_ngn', '', 'Paystack public key for NGN payments'),
  ('paystack_public_key_usd', '', 'Paystack public key for USD payments'),
  ('stripe_public_key_gbp', '', 'Stripe public key for GBP payments'),
  ('stripe_public_key_usd', '', 'Stripe public key for USD payments')
ON CONFLICT (key) DO NOTHING;