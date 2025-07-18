import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Lock, ShoppingBag } from "lucide-react";
import { LoginModal } from "./LoginModal";

type AccessTier = "A" | "B" | "C";

interface Product {
  id: string;
  name: string;
  image: string;
  price?: number;
  description: string;
  category: string;
  tier: AccessTier;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (product.tier === "C") {
      setIsLoginOpen(true);
      return;
    }
    onClick?.();
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoginOpen(true);
  };

  const getTierBadge = () => {
    switch (product.tier) {
      case "A":
        return <Badge variant="secondary" className="bg-golden-grace text-white">Full Access</Badge>;
      case "B":
        return <Badge variant="outline" className="border-serene-sage">Limited View</Badge>;
      case "C":
        return <Badge variant="destructive" className="bg-obsidian-depth">Restricted</Badge>;
      default:
        return null;
    }
  };

  const isRestricted = product.tier === "C";

  return (
    <>
      <div 
        className={`group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 cursor-pointer ${
          isRestricted ? "opacity-75" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-pearl-mist">
          <img 
            src={product.image} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isRestricted ? "blur-sm" : ""
            }`}
          />
          
          {/* Overlay for restricted items */}
          {isRestricted && (
            <div className="absolute inset-0 bg-obsidian-depth/30 flex items-center justify-center">
              <div className="text-center text-white space-y-2">
                <Lock className="w-8 h-8 mx-auto" />
                <p className="text-sm font-medium">Client Access Required</p>
              </div>
            </div>
          )}

          {/* Tier Badge */}
          <div className="absolute top-3 left-3">
            {getTierBadge()}
          </div>

          {/* Quick Actions */}
          {!isRestricted && (
            <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}>
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-white/90 hover:bg-white text-obsidian-depth"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>
            <h3 className="font-semibold text-foreground group-hover:text-nurturing-jade transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Price - only show for tier A */}
          {product.tier === "A" && product.price && (
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-nurturing-jade">
                ${product.price.toLocaleString()}
              </p>
            </div>
          )}

          {/* No price for tier B */}
          {product.tier === "B" && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground italic">
                Price available to clients
              </p>
            </div>
          )}

          {/* Description - truncated for restricted items */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {isRestricted ? "Exclusive piece available to Eka clients only." : product.description}
          </p>

          {/* Action Button */}
          <div className="pt-2">
            {product.tier === "A" ? (
              <Button 
                variant="exclusive" 
                className="w-full"
                onClick={handleBuyClick}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Purchase - Client Login Required
              </Button>
            ) : product.tier === "B" ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleBuyClick}
              >
                <Lock className="w-4 h-4 mr-2" />
                View Price - Client Access
              </Button>
            ) : (
              <Button 
                variant="restricted" 
                className="w-full"
                disabled
              >
                <Lock className="w-4 h-4 mr-2" />
                Restricted Access
              </Button>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};