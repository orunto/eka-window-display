
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category_id: string | null;
  collection_id: string | null;
  tier: "A" | "B" | "C";
  image_url: string | null;
  gallery_images: string[] | null;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
  collections?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
}

export const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    collection_id: "",
    tier: "B" as "A" | "B" | "C",
    image_url: "",
    gallery_images: "",
    in_stock: true,
    featured: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCollections();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          collections (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure proper typing
      const typedProducts: Product[] = (data || []).map(product => ({
        ...product,
        tier: (product.tier as "A" | "B" | "C") || "B"
      }));
      
      setProducts(typedProducts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCollections(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      collection_id: "",
      tier: "B",
      image_url: "",
      gallery_images: "",
      in_stock: true,
      featured: false,
    });
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        category_id: formData.category_id || null,
        collection_id: formData.collection_id || null,
        tier: formData.tier,
        image_url: formData.image_url || null,
        gallery_images: formData.gallery_images ? formData.gallery_images.split(',').map(s => s.trim()).filter(Boolean) : null,
        in_stock: formData.in_stock,
        featured: formData.featured,
      };

      if (isEditing && editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price?.toString() || "",
      category_id: product.category_id || "",
      collection_id: product.collection_id || "",
      tier: product.tier,
      image_url: product.image_url || "",
      gallery_images: product.gallery_images?.join(', ') || "",
      in_stock: product.in_stock,
      featured: product.featured,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Products Management</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isEditing && (
        <div className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-6">
          <h3 className="text-xl font-heading text-eka-pearl mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-eka-pearl">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-eka-pearl">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-eka-pearl">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="collection" className="text-eka-pearl">Collection</Label>
              <Select value={formData.collection_id} onValueChange={(value) => setFormData({ ...formData, collection_id: value })}>
                <SelectTrigger className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tier" className="text-eka-pearl">Tier</Label>
              <Select value={formData.tier} onValueChange={(value: "A" | "B" | "C") => setFormData({ ...formData, tier: value })}>
                <SelectTrigger className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Tier A</SelectItem>
                  <SelectItem value="B">Tier B</SelectItem>
                  <SelectItem value="C">Tier C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-eka-pearl">Product Image</Label>
              <ImageUpload
                bucket="product-images"
                currentImage={formData.image_url}
                onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-eka-pearl">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="gallery_images" className="text-eka-pearl">Gallery Images (comma-separated URLs)</Label>
              <Input
                id="gallery_images"
                value={formData.gallery_images}
                onChange={(e) => setFormData({ ...formData, gallery_images: e.target.value })}
                placeholder="url1, url2, url3"
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-eka-pearl">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="rounded border-eka-jade-luxury/30"
                />
                <span>In Stock</span>
              </label>
              
              <label className="flex items-center space-x-2 text-eka-pearl">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-eka-jade-luxury/30"
                />
                <span>Featured</span>
              </label>
            </div>

            <div className="md:col-span-2 flex space-x-2">
              <Button
                type="submit"
                className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-eka-jade-luxury/20">
              <tr>
                <th className="px-4 py-3 text-left text-eka-pearl">Name</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Category</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Collection</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Price</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Tier</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Status</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eka-jade-luxury/20">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-eka-jade-luxury/10">
                  <td className="px-4 py-3 text-eka-pearl">{product.name}</td>
                  <td className="px-4 py-3 text-eka-champagne">{product.categories?.name || 'Uncategorized'}</td>
                  <td className="px-4 py-3 text-eka-champagne">{product.collections?.name || 'No collection'}</td>
                  <td className="px-4 py-3 text-eka-champagne">${product.price || 'N/A'}</td>
                  <td className="px-4 py-3 text-eka-champagne">Tier {product.tier}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      <span className={`text-xs px-2 py-1 rounded ${product.in_stock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.featured && (
                        <span className="text-xs px-2 py-1 rounded bg-eka-golden/20 text-eka-golden">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        size="sm"
                        variant="outline"
                        className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
