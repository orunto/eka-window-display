-- Create site_settings table for managing Eka details
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage site settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (is_admin());

-- Anyone can view site settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
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
  ('bespoke_pricing', 'Bespoke pricing starts at $5,000 and varies based on design complexity, materials, and embellishments. Contact us for a personalized quote.', 'Bespoke pricing information');

-- Add delivery_address column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS delivery_address text,
ADD COLUMN IF NOT EXISTS phone_number text;