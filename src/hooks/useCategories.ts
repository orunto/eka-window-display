
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCategoryProducts = (categoryId: string) => {
  return useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          collections (id, name)
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!categoryId,
  });
};
