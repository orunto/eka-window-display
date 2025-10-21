import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (fetchError) throw fetchError;
        setCategories(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useCategory = (id: string | undefined) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setCategory(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
};
