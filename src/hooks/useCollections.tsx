import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  featured: boolean | null;
  created_at: string | null;
  tier: "A" | "B" | "C";
  season: string | null;
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
        setCollections((data || []).map(c => ({
          ...c,
          tier: (c.tier || 'A') as 'A' | 'B' | 'C'
        })));
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

export const useCollection = (id: string | undefined) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setCollection(data ? {
          ...data,
          tier: (data.tier || 'A') as 'A' | 'B' | 'C'
        } : null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

  return { collection, loading, error };
};
