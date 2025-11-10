import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  featured: boolean | null;
  created_at: string | null;
  tier?: string;
  season?: string;
  features?: string[];
}

export const useCollections = (filters?: { featured?: boolean }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        let query = supabase.from('collections').select('*');

        if (filters?.featured !== undefined) {
          query = query.eq('featured', filters.featured);
        }

        const { data, error: fetchError } = await query.order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setCollections(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [filters?.featured]);

  return { collections, loading, error };
};

export const useCollection = (slug: string | undefined) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        setLoading(true);
        
        // Try to fetch by ID first (for backward compatibility)
        let query = supabase
          .from('collections')
          .select('*')
          .eq('id', slug)
          .maybeSingle();

        let { data, error: fetchError } = await query;

        // If not found by ID, try by name (slug)
        if (!data && !fetchError) {
          const nameQuery = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          const { data: nameData, error: nameError } = await supabase
            .from('collections')
            .select('*')
            .ilike('name', nameQuery)
            .maybeSingle();
          
          data = nameData;
          fetchError = nameError;
        }

        if (fetchError) throw fetchError;
        setCollection(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  return { collection, loading, error };
};
