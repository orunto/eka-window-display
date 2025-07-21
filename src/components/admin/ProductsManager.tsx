
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  collection_id: string;
  tier: 'A' | 'B' | 'C';
  image_url: string;
  gallery_images: string[];
  in_stock: boolean;
  featured: boolean;
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
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    collection_id: '',
    tier: 'B' as 'A' | 'B' | 'C',
    image_url: '',
    gallery_images: '',
    in_stock: true,
    featured: false,
  });

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
          categories(name),
          collections(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
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
        description: "Failed to fetch categories",
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
        description: "Failed to fetch collections",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        category_id: formData.category_id || null,
        collection_id: formData.collection_id || null,
        tier: formData.tier,
        image_url: formData.image_url,
        gallery_images: formData.gallery_images ? formData.gallery_images.split(',').map(url => url.trim()) : [],
        in_stock: formData.in_stock,
        featured: formData.featured,
      };

      if (editingProduct) {
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
      setDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      category_id: product.category_id || '',
      collection_id: product.collection_id || '',
      tier: product.tier,
      image_url: product.image_url || '',
      gallery_images: product.gallery_images?.join(', ') || '',
      in_stock: product.in_stock,
      featured: product.featured,
    });
    setDialogOpen(true);
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      collection_id: '',
      tier: 'B',
      image_url: '',
      gallery_images: '',
      in_stock: true,
      featured: false,
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Products Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-eka-emerald-depth border-eka-jade-luxury/30 text-eka-pearl max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-eka-pearl">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                    <SelectTrigger className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30">
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
                  <Label htmlFor="collection">Collection</Label>
                  <Select value={formData.collection_id} onValueChange={(value) => setFormData({...formData, collection_id: value})}>
                    <SelectTrigger className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30">
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tier">Tier</Label>
                  <Select value={formData.tier} onValueChange={(value: 'A' | 'B' | 'C') => setFormData({...formData, tier: value})}>
                    <SelectTrigger className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - Full Access</SelectItem>
                      <SelectItem value="B">B - Limited View</SelectItem>
                      <SelectItem value="C">C - Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="in_stock"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="in_stock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Main Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                />
              </div>

              <div>
                <Label htmlFor="gallery_images">Gallery Images (comma separated URLs)</Label>
                <Textarea
                  id="gallery_images"
                  value={formData.gallery_images}
                  onChange={(e) => setFormData({...formData, gallery_images: e.target.value})}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
              >
                {loading ? "Saving..." : (editingProduct ? "Update Product" : "Create Product")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-eka-emerald-depth/20 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-eka-jade-luxury/30">
              <TableHead className="text-eka-champagne">Name</TableHead>
              <TableHead className="text-eka-champagne">Price</TableHead>
              <TableHead className="text-eka-champagne">Category</TableHead>
              <TableHead className="text-eka-champagne">Collection</TableHead>
              <TableHead className="text-eka-champagne">Tier</TableHead>
              <TableHead className="text-eka-champagne">Status</TableHead>
              <TableHead className="text-eka-champagne">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-eka-jade-luxury/20">
                <TableCell className="text-eka-pearl">{product.name}</TableCell>
                <TableCell className="text-eka-pearl">
                  {product.price ? `$${product.price}` : 'N/A'}
                </TableCell>
                <TableCell className="text-eka-pearl">
                  {categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                </TableCell>
                <TableCell className="text-eka-pearl">
                  {collections.find(c => c.id === product.collection_id)?.name || 'N/A'}
                </TableCell>
                <TableCell className="text-eka-pearl">{product.tier}</TableCell>
                <TableCell className="text-eka-pearl">
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  {product.featured && ' • Featured'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
