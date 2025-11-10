import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Lock, ArrowRight } from "lucide-react";
import { LoginModal } from "./LoginModal";

type CollectionTier = "A" | "B" | "C";

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  tier: CollectionTier;
  season?: string;
}

interface CollectionCardProps {
  collection: Collection;
  onClick?: () => void;
}

export const CollectionCard = ({ collection, onClick }: CollectionCardProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (collection.tier === "C") {
      setIsLoginOpen(true);
      return;
    }
    onClick?.();
  };

  const getTierInfo = () => {
    switch (collection.tier) {
      case "A":
        return {
          badge: <Badge className="bg-golden-grace text-white">Full Collection</Badge>,
          description: "View all pieces in this exclusive collection",
          blur: false
        };
      case "B":
        return {
          badge: <Badge variant="outline" className="border-serene-sage">Partial Access</Badge>,
          description: "Limited preview - Client access for full collection",
          blur: false
        };
      case "C":
        return {
          badge: <Badge variant="destructive" className="bg-obsidian-depth">Client Only</Badge>,
          description: "Exclusive collection for Eka clients",
          blur: true
        };
      default:
        return { badge: null, description: "", blur: false };
    }
  };

  const tierInfo = getTierInfo();

  return (
    <>
      <div 
        className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Collection Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-subtle">
          <img 
            src={collection.image} 
            alt={collection.name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              tierInfo.blur ? "blur-md" : ""
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-depth/60 via-transparent to-transparent" />
          
          {/* Restricted Overlay */}
          {collection.tier === "C" && (
            <div className="absolute inset-0 bg-obsidian-depth/40 flex items-center justify-center">
              <div className="text-center text-white space-y-3">
                <Lock className="w-12 h-12 mx-auto" />
                <div className="space-y-1">
                  <p className="text-lg font-semibold">Exclusive Collection</p>
                  <p className="text-sm opacity-90">Client Access Required</p>
                </div>
              </div>
            </div>
          )}

          {/* Tier Badge */}
          <div className="absolute top-4 left-4">
            {tierInfo.badge}
          </div>

          {/* Season Badge */}
          {collection.season && (
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-white/90 text-obsidian-depth border-white/50">
                {collection.season}
              </Badge>
            </div>
          )}

          {/* Quick Action */}
          {collection.tier !== "C" && (
            <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}>
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Collection Info */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground group-hover:text-nurturing-jade transition-colors">
                {collection.name}
              </h3>
              <span className="text-sm text-muted-foreground">
                {collection.tier === "B" ? "Some pieces" : `${collection.productCount} pieces`}
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              {tierInfo.description}
            </p>
          </div>

          {/* Description - only for non-restricted */}
          {collection.tier !== "C" && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {collection.description}
            </p>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {collection.tier === "A" ? (
              <Button 
                variant="elegant" 
                className="w-full group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : collection.tier === "B" ? (
              <Button 
                variant="outline" 
                className="w-full group"
              >
                <Eye className="w-4 h-4 mr-2" />
                <span>Limited Preview</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button 
                variant="exclusive" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLoginOpen(true);
                }}
              >
                <Lock className="w-4 h-4 mr-2" />
                Become a Client to Access
              </Button>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};