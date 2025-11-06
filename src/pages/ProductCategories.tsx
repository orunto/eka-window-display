
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";

const ProductCategories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useCategories();

  useEffect(() => {
    // Scroll to top when component mounts
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

  const getProductCount = async (categoryId: string) => {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);
    return count || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle decorative pattern overlays */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 pattern-subtle opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/6 h-1/3 pattern-accent opacity-20" />
      
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28 relative z-10">
        <div className="text-center mb-20">
          <div className="relative inline-block p-12 rounded-3xl bg-gradient-glass backdrop-blur-xl shadow-xl border border-eka-jade-luxury/30">
            <div className="absolute inset-0 bg-gradient-accent opacity-[0.05] rounded-3xl" />
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-heading text-eka-pearl mb-6 tracking-wide">
                Product Categories
              </h1>
              <p className="text-xl text-eka-champagne max-w-3xl mx-auto leading-relaxed">
                Explore our carefully curated categories of Afromodern luxury fashion. 
                Each piece represents our commitment to exceptional craftsmanship and contemporary design.
              </p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        {loading ? (
          <div className="text-center text-eka-champagne py-20">
            <p className="text-xl">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-eka-champagne py-20">
            <p className="text-xl">No categories available yet.</p>
            <p className="text-sm mt-2">Categories will appear here once added by an administrator.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="group relative bg-gradient-glass backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-500 cursor-pointer border border-eka-jade-luxury/30 hover:border-eka-golden/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img 
                    src={category.image_url || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop'} 
                    alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Elegant gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-eka-emerald-depth/20 via-eka-emerald-depth/40 to-eka-emerald-depth/80" />
                
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="bg-gradient-glass backdrop-blur-md rounded-2xl p-6 border border-eka-pearl/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-3xl font-heading text-eka-pearl group-hover:text-eka-golden transition-colors duration-300">
                          {category.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-eka-champagne">
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                      <p className="text-eka-pearl/90 text-sm leading-relaxed mb-4">
                        {category.description || "Explore this category"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-1 bg-gradient-accent rounded-full group-hover:w-20 transition-all duration-500" />
                      <span className="text-xs text-eka-champagne/80 uppercase tracking-wider">
                        Explore Collection
                      </span>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EkaFooter />
    </div>
  );
};

export default ProductCategories;
