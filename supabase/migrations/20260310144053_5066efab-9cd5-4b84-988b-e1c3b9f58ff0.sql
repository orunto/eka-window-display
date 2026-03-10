
-- ============================================
-- CONSOLIDATED MIGRATION: Restore full Eka schema
-- ============================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

-- 2. Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create collections table (with features, tier, season)
CREATE TABLE public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  tier TEXT DEFAULT 'B',
  season TEXT,
  features TEXT[] DEFAULT ARRAY['Heritage craftsmanship', 'Sustainable luxury', 'Limited production', 'Custom tailoring'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create products table (with multi-currency)
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  price_ngn NUMERIC,
  price_usd NUMERIC,
  price_gbp NUMERIC,
  category_id UUID REFERENCES public.categories(id),
  collection_id UUID REFERENCES public.collections(id),
  tier TEXT CHECK (tier IN ('A', 'B', 'C')) DEFAULT 'B',
  image_url TEXT,
  gallery_images TEXT[],
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create product_variants table
CREATE TABLE public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Create profiles table (with tier, delivery_address, phone_number)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  tier TEXT DEFAULT 'C' CHECK (tier IN ('A', 'B', 'C')),
  delivery_address TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 8. Create orders table (with currency, status constraint)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'initiated',
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  customer_email TEXT,
  customer_name TEXT,
  shipping_address TEXT,
  notes TEXT,
  currency TEXT DEFAULT 'NGN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT orders_status_check CHECK (status IN ('initiated', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'))
);

-- 9. Create order_items table (with variant fields)
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_tier TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  variant_id UUID,
  variant_name TEXT,
  variant_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Create client_applications table (with about_yourself)
CREATE TABLE public.client_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  about_yourself TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Create site_settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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

-- Check admin via user_roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- Handle new user registration (auto profile + role assignment)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  
  IF new.email = 'alayofortune@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin'::app_role);
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'customer'::app_role);
  END IF;
  
  RETURN new;
END;
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_applications_updated_at
  BEFORE UPDATE ON public.client_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- Collections
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admins can manage collections" ON public.collections FOR ALL USING (public.is_admin());

-- Products (tier-based access)
CREATE POLICY "Users can view appropriate tier products" ON public.products FOR SELECT USING (tier = 'A' OR auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin());

-- Product Variants
CREATE POLICY "Anyone can view product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins can manage product variants" ON public.product_variants FOR ALL USING (public.is_admin());

-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- User Roles
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.is_admin());

-- Order Items
CREATE POLICY "Users can view items from their orders" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (public.is_admin());

-- Client Applications
CREATE POLICY "Admins can manage applications" ON public.client_applications FOR ALL USING (is_admin());
CREATE POLICY "Anyone can create applications" ON public.client_applications FOR INSERT WITH CHECK (true);

-- Site Settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (is_admin());

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_client_applications_status ON public.client_applications(status);
CREATE INDEX idx_client_applications_email ON public.client_applications(email);

-- ============================================
-- STORAGE
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());

-- ============================================
-- SEED DATA
-- ============================================

-- Categories
INSERT INTO public.categories (name, description, image_url) VALUES
('Jewelry', 'Handcrafted jewelry pieces including necklaces, earrings, and bracelets', '/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png'),
('Accessories', 'Luxury accessories including bags, scarves, and home decor items', '/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png'),
('Home Decor', 'African-inspired home decorations and artistic pieces', '/placeholder.svg'),
('Textiles', 'Traditional and contemporary African textiles and fabrics', '/placeholder.svg');

-- Collections
INSERT INTO public.collections (name, description, image_url, featured) VALUES
('Heritage Collection', 'Celebrating African heritage through modern design with traditional motifs', '/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png', true),
('Contemporary Series', 'Modern interpretations of traditional African crafts and designs', '/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png', true),
('Limited Edition', 'Exclusive limited edition pieces crafted by master artisans', '/placeholder.svg', false),
('Artisan Showcase', 'Featuring works from emerging African artists and craftspeople', '/placeholder.svg', true);

-- Products
INSERT INTO public.products (name, description, price, price_ngn, price_usd, price_gbp, category_id, collection_id, tier, image_url, gallery_images, in_stock, featured) VALUES
('Golden Sunrise Necklace', 'Handcrafted gold-plated necklace inspired by African sunrises, featuring intricate beadwork and traditional patterns.', 189.99, 189.99, 189.99, 189.99,
 (SELECT id FROM public.categories WHERE name = 'Jewelry'), 
 (SELECT id FROM public.collections WHERE name = 'Heritage Collection'), 
 'A', '/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png', 
 ARRAY['/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png', '/placeholder.svg'], true, true),

('Elegant Copper Earrings', 'Sophisticated copper earrings with traditional Akan symbols, perfect for both casual and formal occasions.', 89.99, 89.99, 89.99, 89.99,
 (SELECT id FROM public.categories WHERE name = 'Jewelry'),
 (SELECT id FROM public.collections WHERE name = 'Contemporary Series'),
 'B', '/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png',
 ARRAY['/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png'], true, true),

('Royal Bracelet Set', 'A set of three bracelets inspired by royal African jewelry, crafted with premium materials and attention to detail.', 145.50, 145.50, 145.50, 145.50,
 (SELECT id FROM public.categories WHERE name = 'Jewelry'),
 (SELECT id FROM public.collections WHERE name = 'Limited Edition'),
 'A', '/placeholder.svg', ARRAY['/placeholder.svg'], true, false),

('Luxury Woven Bag', 'Premium handwoven bag using traditional techniques, perfect for everyday use or special occasions.', 125.00, 125.00, 125.00, 125.00,
 (SELECT id FROM public.categories WHERE name = 'Accessories'),
 (SELECT id FROM public.collections WHERE name = 'Heritage Collection'),
 'B', '/placeholder.svg', ARRAY['/placeholder.svg'], true, true),

('Artisan Silk Scarf', 'Beautiful silk scarf featuring traditional African prints and contemporary color combinations.', 67.99, 67.99, 67.99, 67.99,
 (SELECT id FROM public.categories WHERE name = 'Accessories'),
 (SELECT id FROM public.collections WHERE name = 'Contemporary Series'),
 'C', '/placeholder.svg', ARRAY['/placeholder.svg'], true, false),

('Ceramic Vase Collection', 'Set of three handcrafted ceramic vases with traditional African patterns and earth tones.', 299.99, 299.99, 299.99, 299.99,
 (SELECT id FROM public.categories WHERE name = 'Home Decor'),
 (SELECT id FROM public.collections WHERE name = 'Artisan Showcase'),
 'A', '/placeholder.svg', ARRAY['/placeholder.svg'], true, true),

('Wooden Wall Art', 'Intricately carved wooden wall art piece celebrating African heritage and craftsmanship.', 185.00, 185.00, 185.00, 185.00,
 (SELECT id FROM public.categories WHERE name = 'Home Decor'),
 (SELECT id FROM public.collections WHERE name = 'Heritage Collection'),
 'B', '/placeholder.svg', ARRAY['/placeholder.svg'], true, false),

('Traditional Kente Cloth', 'Authentic Kente cloth woven by skilled artisans, perfect for special occasions or display.', 245.00, 245.00, 245.00, 245.00,
 (SELECT id FROM public.categories WHERE name = 'Textiles'),
 (SELECT id FROM public.collections WHERE name = 'Heritage Collection'),
 'A', '/placeholder.svg', ARRAY['/placeholder.svg'], true, true),

('Modern African Print Fabric', 'Contemporary interpretation of traditional African prints on premium cotton fabric.', 45.99, 45.99, 45.99, 45.99,
 (SELECT id FROM public.categories WHERE name = 'Textiles'),
 (SELECT id FROM public.collections WHERE name = 'Contemporary Series'),
 'C', '/placeholder.svg', ARRAY['/placeholder.svg'], true, false);

-- Product Variants
INSERT INTO public.product_variants (product_id, name, type, price_adjustment, stock_quantity) VALUES
((SELECT id FROM public.products WHERE name = 'Golden Sunrise Necklace'), 'Small (16 inch)', 'size', 0.00, 5),
((SELECT id FROM public.products WHERE name = 'Golden Sunrise Necklace'), 'Medium (18 inch)', 'size', 10.00, 8),
((SELECT id FROM public.products WHERE name = 'Golden Sunrise Necklace'), 'Large (20 inch)', 'size', 20.00, 3),
((SELECT id FROM public.products WHERE name = 'Luxury Woven Bag'), 'Brown', 'color', 0.00, 4),
((SELECT id FROM public.products WHERE name = 'Luxury Woven Bag'), 'Black', 'color', 0.00, 6),
((SELECT id FROM public.products WHERE name = 'Luxury Woven Bag'), 'Natural', 'color', 15.00, 2);

-- Site Settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('about_us_title', 'About Eka', 'About us page title'),
  ('about_us_content', 'Eka is a luxury fashion brand dedicated to creating timeless, elegant pieces that celebrate individuality and craftsmanship. Our collections blend traditional techniques with contemporary design, offering discerning clients access to exclusive, high-quality garments.

Our philosophy centers on sustainability, exclusivity, and personalized service. Each piece is carefully curated or custom-made to ensure our clients receive not just clothing, but wearable art that reflects their unique style and values.', 'About us page content'),
  ('contact_email', 'hello@eka.luxury', 'Contact email address'),
  ('contact_phone', '+1 (555) 123-4567', 'Contact phone number'),
  ('contact_address', '123 Fashion Avenue, New York, NY 10001', 'Contact address'),
  ('social_instagram', 'https://instagram.com/eka', 'Instagram URL'),
  ('social_twitter', 'https://twitter.com/eka', 'Twitter URL'),
  ('social_facebook', 'https://facebook.com/eka', 'Facebook URL'),
  ('bespoke_title', 'Eka Bespoke', 'Bespoke page title'),
  ('bespoke_intro', 'Experience the ultimate in personalized luxury with Eka Bespoke. Our made-to-measure service offers you the opportunity to create one-of-a-kind pieces tailored exclusively to your measurements, preferences, and vision.', 'Bespoke page introduction'),
  ('bespoke_process', '## How Eka Bespoke Works

**1. Initial Consultation**
Schedule a private consultation with our design team to discuss your vision, style preferences, and requirements. We''ll explore fabrics, colors, and design elements to bring your ideas to life.

**2. Measurements & Fitting**
Our expert tailors take precise measurements to ensure a perfect fit. We create a detailed profile of your proportions to craft garments that complement your unique silhouette.

**3. Design Development**
We develop detailed sketches and fabric swatches based on your consultation. You''ll review and approve every detail before we begin crafting your piece.

**4. Creation & Craftsmanship**
Our artisans handcraft your garment using traditional techniques and the finest materials. Each piece undergoes rigorous quality checks throughout the creation process.

**5. Fitting & Adjustments**
We schedule fittings to ensure perfect fit and comfort. Any necessary adjustments are made with meticulous attention to detail.

**6. Final Delivery**
Your bespoke piece is delivered with care instructions and a certificate of authenticity. Enjoy wearing a truly unique creation designed exclusively for you.', 'Bespoke process description'),
  ('bespoke_timeline', 'The bespoke process typically takes 8-12 weeks from initial consultation to final delivery, depending on the complexity of your design.', 'Bespoke timeline information'),
  ('bespoke_pricing', 'Bespoke pricing starts at $5,000 and varies based on design complexity, materials, and embellishments. Contact us for a personalized quote.', 'Bespoke pricing information'),
  ('paystack_public_key_ngn', '', 'Paystack public key for NGN payments'),
  ('paystack_public_key_usd', '', 'Paystack public key for USD payments'),
  ('paystack_secret_key_ngn', '', 'Paystack secret key for NGN payments'),
  ('stripe_public_key_gbp', '', 'Stripe public key for GBP payments'),
  ('stripe_public_key_usd', '', 'Stripe public key for USD payments');
