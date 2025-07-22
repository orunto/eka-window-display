
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

const ProductCategories = () => {
  const navigate = useNavigate();

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
  
  const categories = [
    {
      name: "Tops",
      description: "Sophisticated blouses, blazers, and statement pieces designed for the modern professional.",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop",
      count: "12 Pieces"
    },
    {
      name: "Bottoms", 
      description: "Tailored trousers, elegant skirts, and contemporary silhouettes for every occasion.",
      image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=500&h=600&fit=crop",
      count: "8 Pieces"
    },
    {
      name: "Ensembles",
      description: "Complete coordinated sets and statement dresses that embody Afromodern elegance.",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop",
      count: "15 Pieces"
    },
    {
      name: "Accessories",
      description: "Luxury jewelry, handbags, and finishing touches that complete your distinctive look.",
      image: "https://images.unsplash.com/photo-1506629905607-45848be1e3b7?w=500&h=600&fit=crop",
      count: "24 Pieces"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle decorative pattern overlays */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 pattern-subtle opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/6 h-1/3 pattern-accent opacity-20" />
      
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
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
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              className="group relative bg-gradient-glass backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-500 cursor-pointer border border-eka-jade-luxury/30 hover:border-eka-golden/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img 
                  src={category.image} 
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
                        <span className="text-sm font-medium">{category.count}</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    <p className="text-eka-pearl/90 text-sm leading-relaxed mb-4">
                      {category.description}
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
      </div>

      <EkaFooter />
    </div>
  );
};

export default ProductCategories;
