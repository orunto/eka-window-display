-- Fix Issue 1: Add admin role for alayofortune@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('7032b444-9086-4163-a873-774b5967f1a2', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Fix Issue 3: Update products RLS policy to enforce tier-based access
DROP POLICY IF EXISTS "Anyone can view products" ON products;

CREATE POLICY "Users can view appropriate tier products"
ON products FOR SELECT
USING (
  tier = 'A' OR auth.uid() IS NOT NULL
);