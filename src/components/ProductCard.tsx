import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AccessTier = "A" | "B" | "C";

interface Product {
  id: string;
  name: string;
  image: string;
  price?: number;
  description: string;
  category: string;
  collection?: string;
  tier: AccessTier;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
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

  const handleClick = () => {
    if (product.tier === "C") {
      return; // Don't navigate for restricted products
    }
    navigate(`/product/${product.id}`);
  };

  if (product.tier === "C") {
    return (
      <div className="group relative bg-card rounded-lg overflow-hidden shadow-card cursor-not-allowed">
        <div className="relative aspect-[4/5] overflow-hidden bg-pearl-mist">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-obsidian-depth/50 flex items-center justify-center">
            <div className="text-center text-white space-y-2">
              <p className="text-sm font-medium">Client Access Required</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Product Image - Apple style minimal */}
      <div className="relative aspect-[4/5] overflow-hidden bg-background">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* Product Info - Minimal Apple style */}
      <div className="p-4 space-y-1">
        <h3 className="font-heading font-normal text-lg text-foreground">
          {product.name}
        </h3>
        {product.collection && (
          <p className="text-sm text-nurturing-jade font-medium">
            {product.collection}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {product.category}
        </p>
      </div>
    </div>
  );
};