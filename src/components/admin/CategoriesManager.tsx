
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
});

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input data
      const validationData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      const validationResult = categorySchema.safeParse(validationData);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        toast({
          title: "Validation Error",
          description: errors,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const categoryData = {
        name: validationData.name,
        description: validationData.description || '',
        image_url: formData.image_url,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      resetForm();
      setDialogOpen(false);
      fetchCategories();
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      fetchCategories();
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
      image_url: '',
    });
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Categories Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-eka-emerald-depth border-eka-jade-luxury/30 text-eka-pearl">
            <DialogHeader>
              <DialogTitle className="text-eka-pearl">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                />
              </div>

              <div>
                <Label>Category Image</Label>
                <ImageUpload
                  bucket="product-images"
                  currentImage={formData.image_url}
                  onUploadComplete={(url) => setFormData({...formData, image_url: url})}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
              >
                {loading ? "Saving..." : (editingCategory ? "Update Category" : "Create Category")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <div className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Plus className="w-16 h-16 text-eka-jade-luxury/40" />
            <h3 className="text-xl font-heading text-eka-pearl">No categories yet</h3>
            <p className="text-eka-champagne">Get started by adding your first category</p>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Category
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-eka-emerald-depth/20 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-eka-jade-luxury/30">
                  <TableHead className="text-eka-champagne">Name</TableHead>
                  <TableHead className="text-eka-champagne">Description</TableHead>
                  <TableHead className="text-eka-champagne">Image</TableHead>
                  <TableHead className="text-eka-champagne">Created</TableHead>
                  <TableHead className="text-eka-champagne">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="border-eka-jade-luxury/20">
                    <TableCell className="text-eka-pearl font-medium">{category.name}</TableCell>
                    <TableCell className="text-eka-pearl">{category.description || 'N/A'}</TableCell>
                    <TableCell className="text-eka-pearl">
                      {category.image_url ? (
                        <img src={category.image_url} alt={category.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        'No image'
                      )}
                    </TableCell>
                    <TableCell className="text-eka-pearl">
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-heading text-eka-pearl mb-1">{category.name}</h3>
                    <p className="text-sm text-eka-champagne line-clamp-2">{category.description || 'No description'}</p>
                  </div>
                  {category.image_url && (
                    <img src={category.image_url} alt={category.name} className="w-16 h-16 object-cover rounded ml-3" />
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-eka-jade-luxury/20">
                  <span className="text-xs text-eka-champagne">
                    {new Date(category.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
