
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCategories = () => {
  const { data: categories, isLoading } = useCategories();

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
          <h1 className="text-5xl md:text-6xl font-heading text-eka-pearl mb-6">Product Categories</h1>
          <p className="text-xl text-eka-champagne max-w-3xl mx-auto leading-relaxed">
            Explore our diverse range of handcrafted African products, from stunning jewelry to beautiful home decor, 
            each category offering unique pieces that celebrate African artistry and culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-8 border border-eka-jade-luxury/30">
                <Skeleton className="w-full h-48 rounded-2xl mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            categories?.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.id}`}
                className="group block"
              >
                <div className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-8 border border-eka-jade-luxury/30 hover:border-eka-golden/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-eka-emerald-depth/20">
                    <img 
                      src={category.image_url || '/placeholder.svg'} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-heading text-eka-pearl mb-3 group-hover:text-eka-golden transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-eka-champagne leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <EkaFooter />
    </div>
  );
};

export default ProductCategories;
