
import { useEffect } from "react";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { CollectionCard } from "@/components/CollectionCard";
import { useCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";

const Collections = () => {
  const { data: collections, isLoading } = useCollections();

  useEffect(() => {
    window.scrollTo(0, 0);
    
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

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading text-eka-pearl mb-6">Our Collections</h1>
          <p className="text-xl text-eka-champagne max-w-3xl mx-auto leading-relaxed">
            Each collection tells a story, weaving together traditional African artistry with contemporary design. 
            Discover handcrafted pieces that celebrate heritage while embracing modern elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-6 border border-eka-jade-luxury/30">
                <Skeleton className="w-full h-48 rounded-2xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            collections?.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))
          )}
        </div>
      </div>

      <EkaFooter />
    </div>
  );
};

export default Collections;
