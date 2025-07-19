import { EkaHeader } from "@/components/EkaHeader";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProductCategories = () => {
  const navigate = useNavigate();

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
  
  const categories = [
    {
      name: "Tops",
      description: "Sophisticated blouses, blazers, and statement pieces designed for the modern professional.",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop"
    },
    {
      name: "Bottoms", 
      description: "Tailored trousers, elegant skirts, and contemporary silhouettes for every occasion.",
      image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=500&h=600&fit=crop"
    },
    {
      name: "Ensembles",
      description: "Complete coordinated sets and statement dresses that embody Afromodern elegance.",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop"
    },
    {
      name: "Accessories",
      description: "Luxury jewelry, handbags, and finishing touches that complete your distinctive look.",
      image: "https://images.unsplash.com/photo-1506629905607-45848be1e3b7?w=500&h=600&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-normal text-obsidian-depth">
            Product Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our carefully curated categories of Afromodern luxury fashion. 
            Each piece represents our commitment to exceptional craftsmanship and contemporary design.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div 
              key={category.name}
              onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              className="group relative overflow-hidden rounded-lg bg-card shadow-card hover:shadow-luxury transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-depth/80 via-obsidian-depth/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-heading font-normal mb-2 group-hover:text-golden-grace transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-obsidian-depth text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png" 
                  alt="Eka" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold tracking-wider">EKA</h3>
            </div>
            <p className="text-white/60 max-w-md mx-auto">
              Afromodern luxury fashion for the discerning few. Membership by invitation only.
            </p>
            <div className="border-t border-white/20 pt-6">
              <p className="text-white/40 text-sm">
                © 2024 Eka. All rights reserved. Exclusivity guaranteed.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductCategories;