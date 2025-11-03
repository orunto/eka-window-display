
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

const collectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
});

interface Collection {
  id: string;
  name: string;
  description: string;
  image_url: string;
  featured: boolean;
  created_at: string;
}

export const CollectionsManager = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    featured: false,
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

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
      // Validate input data
      const validationData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      const validationResult = collectionSchema.safeParse(validationData);
      
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

      const collectionData = {
        name: validationData.name,
        description: validationData.description || '',
        image_url: formData.image_url,
        featured: formData.featured,
      };

      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(collectionData)
          .eq('id', editingCollection.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Collection updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('collections')
          .insert([collectionData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Collection created successfully",
        });
      }

      resetForm();
      setDialogOpen(false);
      fetchCollections();
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

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      image_url: collection.image_url || '',
      featured: collection.featured,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });
      fetchCollections();
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
      featured: false,
    });
    setEditingCollection(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Collections Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth">
              <Plus className="w-4 h-4 mr-2" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-eka-emerald-depth border-eka-jade-luxury/30 text-eka-pearl">
            <DialogHeader>
              <DialogTitle className="text-eka-pearl">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
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
                <Label>Collection Image</Label>
                <ImageUpload
                  bucket="product-images"
                  currentImage={formData.image_url}
                  onUploadComplete={(url) => setFormData({...formData, image_url: url})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Collection</Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
              >
                {loading ? "Saving..." : (editingCollection ? "Update Collection" : "Create Collection")}
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
              <TableHead className="text-eka-champagne">Description</TableHead>
              <TableHead className="text-eka-champagne">Image</TableHead>
              <TableHead className="text-eka-champagne">Featured</TableHead>
              <TableHead className="text-eka-champagne">Created</TableHead>
              <TableHead className="text-eka-champagne">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((collection) => (
              <TableRow key={collection.id} className="border-eka-jade-luxury/20">
                <TableCell className="text-eka-pearl font-medium">{collection.name}</TableCell>
                <TableCell className="text-eka-pearl">{collection.description || 'N/A'}</TableCell>
                <TableCell className="text-eka-pearl">
                  {collection.image_url ? (
                    <img src={collection.image_url} alt={collection.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    'No image'
                  )}
                </TableCell>
                <TableCell className="text-eka-pearl">
                  {collection.featured ? 'Yes' : 'No'}
                </TableCell>
                <TableCell className="text-eka-pearl">
                  {new Date(collection.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(collection)}
                      className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(collection.id)}
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
