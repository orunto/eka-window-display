
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: ['featured-collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCollectionProducts = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-products', collectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          collections (id, name)
        `)
        .eq('collection_id', collectionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!collectionId,
  });
};
