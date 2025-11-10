
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
    tier: 'A',
    season: '',
    features: ['', '', '', ''],
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
        tier: formData.tier,
        season: formData.season,
        features: formData.features.filter(f => f.trim() !== ''),
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
      tier: (collection as any).tier || 'A',
      season: (collection as any).season || '',
      features: (collection as any).features || ['', '', '', ''],
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
      tier: 'A',
      season: '',
      features: ['', '', '', ''],
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
          <DialogContent className="bg-eka-emerald-depth border-eka-jade-luxury/30 text-eka-pearl max-h-[90vh] overflow-y-auto max-w-[95vw] sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-eka-pearl">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pb-4">
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

              <div>
                <Label htmlFor="tier">Access Tier</Label>
                <select
                  id="tier"
                  value={formData.tier}
                  onChange={(e) => setFormData({...formData, tier: e.target.value})}
                  className="w-full px-3 py-2 bg-eka-emerald-depth/20 border border-eka-jade-luxury/30 rounded-md text-eka-pearl"
                >
                  <option value="A">Tier A - Public Access</option>
                  <option value="B">Tier B - Partial Access</option>
                  <option value="C">Tier C - Restricted (Client Only)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="season">Season/Year</Label>
                <Input
                  id="season"
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  placeholder="e.g., Spring/Summer 2025"
                  className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                />
              </div>

              <div>
                <Label>Collection Features (up to 4)</Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <Input
                      key={index}
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[index] = e.target.value;
                        setFormData({...formData, features: newFeatures});
                      }}
                      placeholder={`Feature ${index + 1}`}
                      className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30"
                    />
                  ))}
                </div>
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

      {collections.length === 0 ? (
        <div className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Plus className="w-16 h-16 text-eka-jade-luxury/40" />
            <h3 className="text-xl font-heading text-eka-pearl">No collections yet</h3>
            <p className="text-eka-champagne">Get started by adding your first collection</p>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Collection
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
                  <TableHead className="text-eka-champagne">Tier</TableHead>
                  <TableHead className="text-eka-champagne">Season</TableHead>
                  <TableHead className="text-eka-champagne">Image</TableHead>
                  <TableHead className="text-eka-champagne">Featured</TableHead>
                  <TableHead className="text-eka-champagne">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id} className="border-eka-jade-luxury/20">
                    <TableCell className="text-eka-pearl font-medium">{collection.name}</TableCell>
                    <TableCell className="text-eka-pearl">
                      <span className={`px-2 py-1 rounded text-xs ${
                        (collection as any).tier === 'C' 
                          ? 'bg-red-500/20 text-red-300' 
                          : (collection as any).tier === 'B'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        Tier {(collection as any).tier || 'A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-eka-pearl">{(collection as any).season || 'N/A'}</TableCell>
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading text-eka-pearl">{collection.name}</h3>
                      {collection.featured && (
                        <span className="text-xs px-2 py-1 rounded bg-eka-golden/20 text-eka-golden">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-eka-champagne line-clamp-2">{collection.description || 'No description'}</p>
                  </div>
                  {collection.image_url && (
                    <img src={collection.image_url} alt={collection.name} className="w-16 h-16 object-cover rounded ml-3" />
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-eka-jade-luxury/20">
                  <span className="text-xs text-eka-champagne">
                    {new Date(collection.created_at).toLocaleDateString()}
                  </span>
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
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
