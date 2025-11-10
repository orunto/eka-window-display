import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  tier: string | null;
  image_url: string | null;
  gallery_images: string[] | null;
  category_id: string | null;
  collection_id: string | null;
  in_stock: boolean | null;
  featured: boolean | null;
  created_at: string | null;
}

export const useProducts = (filters?: {
  categoryId?: string;
  collectionId?: string;
  featured?: boolean;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase.from('products').select('*');

        // Apply filters
        if (filters?.categoryId) {
          query = query.eq('category_id', filters.categoryId);
        }
        if (filters?.collectionId) {
          query = query.eq('collection_id', filters.collectionId);
        }
        if (filters?.featured !== undefined) {
          query = query.eq('featured', filters.featured);
        }

        // Filter by tier based on user authentication
        if (!user) {
          // Guest users only see tier A products
          query = query.eq('tier', 'A');
        }
        // Logged-in users see all tiers

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.categoryId, filters?.collectionId, filters?.featured, user]);

  return { products, loading, error };
};

export const useProduct = (slug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        let data = null;
        let fetchError = null;
        
        // Check if slug looks like a UUID (for backward compatibility)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        
        if (isUUID) {
          // Try to fetch by ID
          const result = await supabase
            .from('products')
            .select('*')
            .eq('id', slug)
            .maybeSingle();
          
          data = result.data;
          fetchError = result.error;
        }
        
        // If not found by ID or slug is not a UUID, try by name
        if (!data) {
          const nameQuery = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          const { data: nameData, error: nameError } = await supabase
            .from('products')
            .select('*')
            .ilike('name', nameQuery)
            .maybeSingle();
          
          data = nameData;
          fetchError = nameError;
        }

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};
