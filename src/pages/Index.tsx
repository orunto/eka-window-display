
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useFeaturedCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts();
  const { data: featuredCollections, isLoading: collectionsLoading } = useFeaturedCollections();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <EkaHeader />
      <HeroSection />
      
      {/* Featured Collections Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading text-eka-pearl mb-4">
              Featured Collections
            </h2>
            <p className="text-xl text-eka-champagne max-w-2xl mx-auto">
              Discover our curated collections celebrating African artistry and contemporary design
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionsLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-6 border border-eka-jade-luxury/30">
                  <Skeleton className="w-full h-48 rounded-2xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : (
              featuredCollections?.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading text-eka-pearl mb-4">
              Featured Pieces
            </h2>
            <p className="text-xl text-eka-champagne max-w-2xl mx-auto">
              Handpicked treasures that showcase the finest of African craftsmanship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-6 border border-eka-jade-luxury/30">
                  <Skeleton className="w-full h-48 rounded-2xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : (
              featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <EkaFooter />
    </div>
  );
};

export default Index;
