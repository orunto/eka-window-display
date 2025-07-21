
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Lock, Heart, Eye } from "lucide-react";

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
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="group relative bg-gradient-card backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-eka-jade-luxury/20 cursor-not-allowed">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover filter blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-eka-emerald-depth/80 via-eka-emerald-depth/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-eka-pearl space-y-3 bg-eka-emerald-depth/60 backdrop-blur-md rounded-xl p-6 border border-eka-golden/30">
              <Lock className="w-8 h-8 mx-auto text-eka-golden" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Heritage Collection</p>
                <p className="text-xs text-eka-champagne">Client Access Required</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg text-eka-pearl/60 truncate">
              {product.name}
            </h3>
            <Badge variant="outline" className="border-eka-golden/50 text-eka-golden text-xs">
              Heritage
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative bg-gradient-glass backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-glow transition-all duration-500 cursor-pointer border border-eka-jade-luxury/30 hover:border-eka-golden/50"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-eka-emerald-depth/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Action buttons */}
        <div className={`absolute top-4 right-4 space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`w-10 h-10 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center ${
              isLiked 
                ? 'bg-eka-golden/90 border-eka-golden text-eka-emerald-depth' 
                : 'bg-eka-pearl/20 border-eka-pearl/30 text-eka-pearl hover:bg-eka-pearl/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-10 h-10 rounded-full bg-eka-pearl/20 backdrop-blur-md border border-eka-pearl/30 text-eka-pearl hover:bg-eka-pearl/30 transition-all duration-300 flex items-center justify-center"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Tier badge */}
        <div className="absolute top-4 left-4">
          {product.tier === "A" && (
            <Badge className="bg-eka-golden/90 text-eka-emerald-depth border-0 font-medium">
              Full Access
            </Badge>
          )}
          {product.tier === "B" && (
            <Badge variant="outline" className="border-eka-champagne/70 text-eka-champagne bg-eka-emerald-depth/60 backdrop-blur-sm">
              Collaboration
            </Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-3">
        <div className="space-y-1">
          <h3 className="font-heading text-xl text-eka-pearl group-hover:text-eka-golden transition-colors duration-300">
            {product.name}
          </h3>
          {product.collection && (
            <p className="text-sm text-eka-champagne font-medium">
              {product.collection}
            </p>
          )}
          <p className="text-sm text-eka-pearl/70">
            {product.category}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-eka-jade-luxury/30">
          <p className="text-sm text-eka-champagne/80">
            Bespoke Available
          </p>
          <div className={`w-6 h-6 rounded-full bg-gradient-accent transition-all duration-300 ${isHovered ? 'scale-110 shadow-glow' : ''}`} />
        </div>
      </div>
    </div>
  );
};
