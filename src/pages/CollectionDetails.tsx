import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { EkaHeader } from "@/components/EkaHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useCollection } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { slugify } from "@/utils/slugify";

const CollectionDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { collection, loading: collectionLoading } = useCollection(slug);
  const { products, loading: productsLoading } = useProducts({
    collectionId: collection?.id,
  });

  useEffect(() => {
    // Load fonts
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

  if (collectionLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28">
          <p>Collection not found</p>
        </div>
      </div>
    );
  }

  // Filter products based on user tier
  const collectionProducts = user ? products : products.filter(p => p.tier === 'A');

  const getTierBadge = () => {
    switch (collection.tier) {
      case "A":
        return <Badge variant="secondary" className="bg-golden-grace text-white">Full Access</Badge>;
      case "B":
        return <Badge variant="outline" className="border-serene-sage">Limited View</Badge>;
      case "C":
        return <Badge variant="destructive" className="bg-obsidian-depth">Restricted</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-28">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collections
        </Button>

        {/* Collection Story Section */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-heading font-normal text-obsidian-depth">
                    {collection.name}
                  </h1>
                  {getTierBadge()}
                </div>
                
                <p className="text-lg text-nurturing-jade font-medium uppercase tracking-wider">
                  {collection.season}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-heading font-normal text-obsidian-depth">
                  Collection Story
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {collection.description}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-obsidian-depth">
                  Collection Philosophy
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  This collection represents our vision of Afromodern luxury, where traditional craftsmanship 
                  meets contemporary design. Each piece tells a story of cultural heritage reimagined for the 
                  modern world, creating timeless elegance that transcends fleeting trends.
                </p>
              </div>

              <div className="bg-pearl-mist p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-obsidian-depth mb-3">
                  Collection Highlights
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  {collection.features && collection.features.length > 0 ? (
                    collection.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))
                  ) : (
                    <>
                      <li>• Exclusive luxury pieces</li>
                      <li>• Handcrafted with premium materials</li>
                      <li>• Limited production</li>
                      <li>• Custom sizing available</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={collection.image_url || '/placeholder.svg'} 
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Collection Products */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-normal text-obsidian-depth mb-4">
              Collection Pieces
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover every piece in this carefully curated collection, each designed to complement 
              and elevate your personal style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collectionProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  name: product.name,
                  image: product.image_url || '/placeholder.svg',
                  price: product.price || undefined,
                  category: 'Product',
                  tier: (product.tier as "A" | "B" | "C") || "A",
                  description: product.description || '',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetails;