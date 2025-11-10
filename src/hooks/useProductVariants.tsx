import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  type: string;
  price_adjustment: number;
  stock_quantity: number;
  created_at: string;
}

export const useProductVariants = (productId: string | undefined) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setVariants([]);
      setLoading(false);
      return;
    }

    const fetchVariants = async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productId)
          .order('created_at');

        if (error) throw error;
        setVariants(data || []);
      } catch (error) {
        console.error('Error fetching variants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [productId]);

  return { variants, loading };
};
