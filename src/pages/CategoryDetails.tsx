
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCategory } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

const CategoryDetails = () => {
  const { category: categoryId } = useParams();
  const navigate = useNavigate();
  const { category, loading: categoryLoading } = useCategory(categoryId);
  const { products, loading: productsLoading } = useProducts({ categoryId });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadFonts = () => {
      const link1 = document.createElement('link');
      link1.href = 'https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap';
      link1.rel = 'stylesheet';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.href = 'https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&display=swap';
      link2.rel = 'stylesheet';
      document.head.appendChild(link2);
    };
    loadFonts();
  }, []);

  const loading = categoryLoading || productsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28 text-center">
          <p className="text-xl text-eka-champagne">Loading...</p>
        </div>
        <EkaFooter />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28 text-center">
          <p className="text-xl text-eka-champagne">Category not found</p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/categories')}
            className="mt-4 text-eka-pearl hover:text-eka-golden"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </div>
        <EkaFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle decorative pattern overlays */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 pattern-subtle opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/6 h-1/3 pattern-accent opacity-20" />
      
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-28 relative z-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-eka-pearl hover:text-eka-golden"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        {/* Category Header with Image */}
        {category.image_url && (
          <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-12">
            <img 
              src={category.image_url} 
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-eka-emerald-depth/60 via-eka-emerald-depth/40 to-eka-emerald-depth/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl md:text-6xl font-heading font-normal text-eka-pearl">
                {category.name}
              </h1>
            </div>
          </div>
        )}

        {/* Category Introduction */}
        <div className="text-center mb-16 space-y-6">
          {!category.image_url && (
            <h1 className="text-4xl md:text-5xl font-heading font-normal text-obsidian-depth">
              {category.name}
            </h1>
          )}
          
          {category.description && (
            <div className="bg-pearl-mist p-8 rounded-lg max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {category.description}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              {products.length} pieces available
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    image: product.image_url || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop',
                    price: product.price ? Number(product.price) : undefined,
                    category: category.name,
                    tier: (product.tier || 'B') as "A" | "B" | "C",
                    description: product.description || '',
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>

      <EkaFooter />
    </div>
  );
};

export default CategoryDetails;
