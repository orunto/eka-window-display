import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoginModal } from "@/components/LoginModal";
import { ArrowLeft, Lock, ShoppingBag, Heart } from "lucide-react";
import { mockProducts } from "@/data/mockData";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20">
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  // Mock multiple images for carousel
  const productImages = [product.image, product.image, product.image];
  
  const relatedProducts = mockProducts
    .filter(p => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4);

  const handlePurchaseClick = () => {
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

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle decorative pattern overlays */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 pattern-subtle opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/6 h-1/3 pattern-accent opacity-20" />
      
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-pearl-mist">
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square w-20 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-nurturing-jade' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-heading font-normal text-obsidian-depth">
                  {product.name}
                </h1>
                {getTierBadge()}
              </div>
              
              {product.collection && (
                <p className="text-lg text-nurturing-jade font-medium">
                  {product.collection} Collection
                </p>
              )}
              
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.category}
              </p>
            </div>

            {/* Price */}
            {product.tier === "A" && product.price && (
              <div className="text-2xl font-bold text-obsidian-depth">
                ${product.price.toLocaleString()}
              </div>
            )}

            {product.tier === "B" && (
              <div className="relative">
                <div className="text-2xl font-bold text-obsidian-depth blur-sm">
                  $XX,XXX
                </div>
                <div className="absolute inset-0 flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                  <span>Price available to clients</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-obsidian-depth">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Story */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-obsidian-depth">Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                This piece embodies the essence of Afromodern luxury, where contemporary design meets cultural heritage. 
                Crafted with meticulous attention to detail, it represents our commitment to creating fashion that transcends trends.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="exclusive" 
                className="flex-1"
                onClick={handlePurchaseClick}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Purchase - Client Login Required
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePurchaseClick}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-heading font-normal text-obsidian-depth mb-8">
              More from {product.collection} Collection
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <EkaFooter />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default ProductDetails;
