import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  type: string;
  price_adjustment: number;
  stock_quantity: number;
}

interface ProductVariantsManagerProps {
  productId: string;
}

export const ProductVariantsManager = ({ productId }: ProductVariantsManagerProps) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState({
    name: "",
    type: "",
    price_adjustment: "0",
    stock_quantity: "0",
  });
  const [pendingVariants, setPendingVariants] = useState<Array<{ name: string; type: string; price_adjustment: string; stock_quantity: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('created_at');

      if (error) throw error;
      setVariants(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.name || !newVariant.type) {
      toast({
        title: "Error",
        description: "Please fill in variant name and type",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('product_variants')
        .insert([{
          product_id: productId,
          name: newVariant.name,
          type: newVariant.type,
          price_adjustment: parseFloat(newVariant.price_adjustment),
          stock_quantity: parseInt(newVariant.stock_quantity),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Variant added successfully",
      });

      setNewVariant({
        name: "",
        type: "",
        price_adjustment: "0",
        stock_quantity: "0",
      });

      fetchVariants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Variant deleted successfully",
      });

      fetchVariants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-eka-pearl text-lg">Product Variants</Label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <Input
            placeholder="Type (e.g., Size, Color)"
            value={newVariant.type}
            onChange={(e) => setNewVariant({ ...newVariant, type: e.target.value })}
            className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
          />
        </div>
        <div>
          <Input
            placeholder="Name (e.g., Large, Red)"
            value={newVariant.name}
            onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
            className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
          />
        </div>
        <div>
          <Input
            type="number"
            step="0.01"
            placeholder="Price Adjustment"
            value={newVariant.price_adjustment}
            onChange={(e) => setNewVariant({ ...newVariant, price_adjustment: e.target.value })}
            className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Stock"
            value={newVariant.stock_quantity}
            onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: e.target.value })}
            className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
          />
        </div>
        <div>
          <Button
            onClick={handleAddVariant}
            className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex flex-wrap items-center justify-between gap-2 p-3 bg-eka-emerald-depth/20 rounded-lg border border-eka-jade-luxury/30"
            >
              <div className="flex flex-wrap gap-4 text-sm text-eka-pearl">
                <span className="font-medium">{variant.type}:</span>
                <span>{variant.name}</span>
                {variant.price_adjustment !== 0 && (
                  <span className="text-eka-champagne">
                    {variant.price_adjustment > 0 ? '+' : ''}${variant.price_adjustment}
                  </span>
                )}
                <span className="text-eka-champagne">Stock: {variant.stock_quantity}</span>
              </div>
              <Button
                onClick={() => handleDeleteVariant(variant.id)}
                size="sm"
                variant="ghost"
                className="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};