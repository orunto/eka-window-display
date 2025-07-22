
-- Insert demo data into categories (using existing sample data structure)
INSERT INTO public.categories (name, description, image_url) VALUES
('Jewelry', 'Handcrafted jewelry pieces including necklaces, earrings, and bracelets', '/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png'),
('Accessories', 'Luxury accessories including bags, scarves, and home decor items', '/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png'),
('Home Decor', 'African-inspired home decorations and artistic pieces', '/placeholder.svg'),
('Textiles', 'Traditional and contemporary African textiles and fabrics', '/placeholder.svg');

-- Insert demo data into collections
INSERT INTO public.collections (name, description, image_url, featured) VALUES
('Heritage Collection', 'Celebrating African heritage through modern design with traditional motifs', '/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png', true),
('Contemporary Series', 'Modern interpretations of traditional African crafts and designs', '/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png', true),
('Limited Edition', 'Exclusive limited edition pieces crafted by master artisans', '/placeholder.svg', false),
('Artisan Showcase', 'Featuring works from emerging African artists and craftspeople', '/placeholder.svg', true);

-- Insert demo products with proper relationships
INSERT INTO public.products (name, description, price, category_id, collection_id, tier, image_url, gallery_images, in_stock, featured) VALUES
-- Jewelry products
('Golden Sunrise Necklace', 'Handcrafted gold-plated necklace inspired by African sunrises, featuring intricate beadwork and traditional patterns.', 189.99, 
 (SELECT id FROM categories WHERE name = 'Jewelry'), 
 (SELECT id FROM collections WHERE name = 'Heritage Collection'), 
 'A', '/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png', 
 ARRAY['/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png', '/placeholder.svg'], true, true),

('Elegant Copper Earrings', 'Sophisticated copper earrings with traditional Akan symbols, perfect for both casual and formal occasions.', 89.99,
 (SELECT id FROM categories WHERE name = 'Jewelry'),
 (SELECT id FROM collections WHERE name = 'Contemporary Series'),
 'B', '/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png',
 ARRAY['/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png'], true, true),

('Royal Bracelet Set', 'A set of three bracelets inspired by royal African jewelry, crafted with premium materials and attention to detail.', 145.50,
 (SELECT id FROM categories WHERE name = 'Jewelry'),
 (SELECT id FROM collections WHERE name = 'Limited Edition'),
 'A', '/placeholder.svg', 
 ARRAY['/placeholder.svg'], true, false),

-- Accessories products  
('Luxury Woven Bag', 'Premium handwoven bag using traditional techniques, perfect for everyday use or special occasions.', 125.00,
 (SELECT id FROM categories WHERE name = 'Accessories'),
 (SELECT id FROM collections WHERE name = 'Heritage Collection'),
 'B', '/placeholder.svg',
 ARRAY['/placeholder.svg'], true, true),

('Artisan Silk Scarf', 'Beautiful silk scarf featuring traditional African prints and contemporary color combinations.', 67.99,
 (SELECT id FROM categories WHERE name = 'Accessories'),
 (SELECT id FROM collections WHERE name = 'Contemporary Series'),
 'C', '/placeholder.svg',
 ARRAY['/placeholder.svg'], true, false),

-- Home Decor products
('Ceramic Vase Collection', 'Set of three handcrafted ceramic vases with traditional African patterns and earth tones.', 299.99,
 (SELECT id FROM categories WHERE name = 'Home Decor'),
 (SELECT id FROM collections WHERE name = 'Artisan Showcase'),
 'A', '/placeholder.svg',
 ARRAY['/placeholder.svg'], true, true),

('Wooden Wall Art', 'Intricately carved wooden wall art piece celebrating African heritage and craftsmanship.', 185.00,
 (SELECT id FROM categories WHERE name = 'Home Decor'),
 (SELECT id FROM collections WHERE name = 'Heritage Collection'),
 'B', '/placeholder.svg',
 ARRAY['/placeholder.svg'], true, false),

-- Textiles products
('Traditional Kente Cloth', 'Authentic Kente cloth woven by skilled artisans, perfect for special occasions or display.', 245.00,
 (SELECT id FROM categories WHERE name = 'Textiles'),
 (SELECT id FROM collections WHERE name = 'Heritage Collection'),
 'A', '/placeholder.svg',
 ARRAY['/placeholder.svg'], true, true),

('Modern African Print Fabric', 'Contemporary interpretation of traditional African prints on premium cotton fabric.', 45.99,
 (SELECT id FROM categories WHERE name = 'Textiles'),
 (SELECT id FROM collections WHERE name = 'Contemporary Series'),
 'C', '/placeholder.svg',
 ARRAY['/placeholder.svg'], true, false);

-- Add some product variants for demonstration
INSERT INTO public.product_variants (product_id, name, type, price_adjustment, stock_quantity) VALUES
-- Variants for Golden Sunrise Necklace
((SELECT id FROM products WHERE name = 'Golden Sunrise Necklace'), 'Small (16 inch)', 'size', 0.00, 5),
((SELECT id FROM products WHERE name = 'Golden Sunrise Necklace'), 'Medium (18 inch)', 'size', 10.00, 8),
((SELECT id FROM products WHERE name = 'Golden Sunrise Necklace'), 'Large (20 inch)', 'size', 20.00, 3),

-- Variants for Luxury Woven Bag
((SELECT id FROM products WHERE name = 'Luxury Woven Bag'), 'Brown', 'color', 0.00, 4),
((SELECT id FROM products WHERE name = 'Luxury Woven Bag'), 'Black', 'color', 0.00, 6),
((SELECT id FROM products WHERE name = 'Luxury Woven Bag'), 'Natural', 'color', 15.00, 2);

-- Create a demo admin user profile (you can use this to test admin functionality)
-- Note: This will only work if you have a user with this ID in your auth.users table
-- You can update this with your actual user ID after authentication is set up
INSERT INTO public.profiles (id, email, full_name, role) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@eka.com', 'Demo Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
