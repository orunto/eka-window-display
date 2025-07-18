import { EkaHeader } from "@/components/EkaHeader";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/data/mockData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ProductCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const categories = ["All", "Tops", "Bottoms", "Ensembles", "Accessories"];
  
  const filteredProducts = selectedCategory === "All" 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-obsidian-depth">
            Product Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our carefully curated categories of Afromodern luxury fashion. 
            Each piece represents our commitment to exceptional craftsmanship and contemporary design.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "exclusive" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full px-6"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Category Descriptions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-pearl-mist p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-obsidian-depth mb-3">Tops</h3>
            <p className="text-sm text-muted-foreground">
              Sophisticated blouses, blazers, and statement pieces designed for the modern professional.
            </p>
          </div>
          <div className="bg-pearl-mist p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-obsidian-depth mb-3">Bottoms</h3>
            <p className="text-sm text-muted-foreground">
              Tailored trousers, elegant skirts, and contemporary silhouettes for every occasion.
            </p>
          </div>
          <div className="bg-pearl-mist p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-obsidian-depth mb-3">Ensembles</h3>
            <p className="text-sm text-muted-foreground">
              Complete coordinated sets and statement dresses that embody Afromodern elegance.
            </p>
          </div>
          <div className="bg-pearl-mist p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-obsidian-depth mb-3">Accessories</h3>
            <p className="text-sm text-muted-foreground">
              Luxury jewelry, handbags, and finishing touches that complete your distinctive look.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onClick={() => console.log(`Viewing product: ${product.name}`)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
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