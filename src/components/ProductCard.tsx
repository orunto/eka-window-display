
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { slugify } from "@/utils/slugify";

interface Product {
  id: string;
  name: string;
  image: string;
  price?: number;
  category: string;
  tier: "A" | "B" | "C";
  description: string;
  collection?: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(`/product/${slugify(product.name)}`);
  };

  const getTierBadge = () => {
    switch (product.tier) {
      case "A":
        return <Badge variant="secondary" className="bg-eka-golden text-eka-emerald-depth text-xs">Full Access</Badge>;
      case "B":
        return <Badge variant="outline" className="border-eka-sage-whisper text-eka-champagne text-xs">Limited</Badge>;
      case "C":
        return <Badge variant="destructive" className="bg-eka-graphite text-eka-pearl text-xs">Restricted</Badge>;
      default:
        return null;
    }
  };

  const getPriceDisplay = () => {
    if (product.tier === "A" && product.price) {
      return (
        <span className="text-lg sm:text-xl font-bold text-eka-pearl">
          ${product.price.toLocaleString()}
        </span>
      );
    }
    
    if (product.tier === "B") {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-bold text-eka-pearl blur-sm select-none">
            $XX,XXX
          </span>
          <Lock className="w-4 h-4 text-eka-champagne" />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div 
      className="group bg-gradient-card backdrop-blur-md rounded-2xl overflow-hidden border border-eka-jade-luxury/30 hover:border-eka-golden/50 transition-all duration-500 hover:shadow-xl hover:shadow-eka-golden/20 cursor-pointer touch-manipulation"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className={`absolute inset-0 bg-eka-jade-luxury/20 animate-pulse transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Tier Badge */}
        <div className="absolute top-3 left-3">
          {getTierBadge()}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-eka-emerald-depth/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button 
            size="icon" 
            variant="secondary"
            className="bg-eka-golden/90 hover:bg-eka-golden text-eka-emerald-depth min-h-[40px] min-w-[40px] touch-manipulation"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-heading font-normal text-eka-pearl leading-tight line-clamp-2">
            {product.name}
          </h3>
          
          {product.collection && (
            <p className="text-sm text-eka-golden font-medium">
              {product.collection}
            </p>
          )}
          
          <p className="text-xs text-eka-champagne uppercase tracking-wider">
            {product.category}
          </p>
        </div>

        <p className="text-sm text-eka-champagne leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Price */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            {getPriceDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
};
