import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoginModal } from "@/components/LoginModal";
import { ArrowLeft, Lock, ShoppingBag, Heart, X } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useProductVariants } from "@/hooks/useProductVariants";
import { slugify } from "@/utils/slugify";
import { detectUserCurrency, formatCurrency, getProductPrice, type Currency } from "@/utils/currency";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");

  const { product, loading } = useProduct(slug);
  const { variants } = useProductVariants(product?.id);
  const { products: relatedProducts } = useProducts({
    collectionId: product?.collection_id || undefined,
  });

  // Determine access level based on user tier vs product tier
  const getTierLevel = (tier: string) => {
    const tierMap: Record<string, number> = { 'A': 3, 'B': 2, 'C': 1 };
    return tierMap[tier] || 0;
  };

  const userTierLevel = getTierLevel(profile?.tier || 'C');
  const productTierLevel = getTierLevel(product.tier || 'B');

  // Tier A products are public - full access to everyone
  // Tier B products - full access to A and B users, limited to C users
  // Tier C products - full access to all authenticated users
  const hasFullAccess = 
    product.tier === 'A' || // Tier A is public
    userTierLevel >= productTierLevel || // User tier meets or exceeds product tier
    (user && product.tier === 'C'); // Any authenticated user can access tier C
  
  const hasLimitedAccess = 
    !hasFullAccess && 
    userTierLevel === productTierLevel - 1; // One tier below

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

  useEffect(() => {
    detectUserCurrency().then(setCurrency).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28">
          <p className="text-eka-pearl">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28">
          <p className="text-eka-pearl">Product not found</p>
        </div>
      </div>
    );
  }

  // Use gallery images or fallback to main image
  const productImages = product.gallery_images && product.gallery_images.length > 0
    ? product.gallery_images
    : product.image_url
    ? [product.image_url]
    : [];
  
  const filteredRelatedProducts = relatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handlePurchaseClick = () => {
    if (!user) {
      setIsLoginOpen(true);
    } else {
      const selectedVariantData = selectedVariant 
        ? variants.find(v => v.id === selectedVariant)
        : undefined;
      
      navigate("/checkout", { 
        state: { 
          items: [{ 
            product, 
            quantity: 1,
            selectedVariant: selectedVariantData ? {
              id: selectedVariantData.id,
              name: selectedVariantData.name,
              type: selectedVariantData.type,
              price_adjustment: selectedVariantData.price_adjustment
            } : undefined
          }] 
        } 
      });
    }
  };

  const getTierBadge = () => {
    if (hasFullAccess) {
      return <Badge variant="secondary" className="bg-golden-grace text-white text-xs sm:text-sm">Full Access</Badge>;
    } else if (hasLimitedAccess) {
      return <Badge variant="outline" className="border-serene-sage text-xs sm:text-sm">Limited View</Badge>;
    } else {
      return <Badge variant="destructive" className="bg-obsidian-depth text-xs sm:text-sm">Restricted</Badge>;
    }
  };

  const openImageView = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewOpen(true);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(/lovable-uploads/a8277916-da04-404a-a49d-3a6e73a0433f.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-eka-emerald-depth/80 backdrop-blur-[1px]" />
      
      <EkaHeader />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pt-20 sm:pt-24 relative z-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 text-eka-pearl hover:bg-eka-jade-luxury/20 touch-manipulation"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-eka-pearl/10 backdrop-blur-sm touch-manipulation">
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300 touch-manipulation"
                onClick={() => openImageView(currentImageIndex)}
              />
            </div>
            
            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      openImageView(index);
                    }}
                    className={`flex-shrink-0 aspect-square w-16 sm:w-20 rounded-md overflow-hidden border-2 transition-all duration-300 touch-manipulation ${
                      currentImageIndex === index 
                        ? 'border-eka-golden shadow-glow' 
                        : 'border-transparent hover:border-eka-jade-luxury'
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
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4 sm:space-y-6 bg-eka-emerald-depth/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-eka-jade-luxury/30">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-normal text-eka-pearl leading-tight">
                  {product.name}
                </h1>
                {getTierBadge()}
              </div>
              
              <p className="text-xs sm:text-sm text-eka-champagne uppercase tracking-wider">
                Product
              </p>
            </div>

            {hasFullAccess && getProductPrice(product as any, currency) !== null && (
              <div className="text-xl sm:text-2xl font-bold text-eka-pearl">
                {formatCurrency(getProductPrice(product as any, currency) as number, currency)}
              </div>
            )}

            {hasLimitedAccess && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="text-xl sm:text-2xl font-bold text-eka-pearl blur-sm select-none">
                  {getProductPrice(product as any, currency) !== null
                    ? formatCurrency(getProductPrice(product as any, currency) as number, currency)
                    : '—'}
                </div>
                <div className="flex items-center gap-2 text-eka-champagne">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm bg-eka-jade-luxury/60 backdrop-blur-sm px-3 py-1 rounded-md border border-eka-jade-luxury/30">
                    Price available to higher tier clients
                  </span>
                </div>
              </div>
            )}

            {/* Product Variants */}
            {hasFullAccess && variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-eka-pearl">Available Options</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 text-left touch-manipulation ${
                        selectedVariant === variant.id
                          ? 'border-eka-golden bg-eka-golden/10 text-eka-pearl'
                          : 'border-eka-jade-luxury/30 bg-eka-jade-luxury/10 text-eka-champagne hover:border-eka-jade-luxury'
                      }`}
                    >
                      <div className="text-sm font-medium">{variant.name}</div>
                      <div className="text-xs text-eka-champagne mt-1">{variant.type}</div>
                        {variant.price_adjustment !== 0 && (
                          <div className="text-xs text-eka-golden mt-1">
                            {variant.price_adjustment > 0 ? '+' : ''}{`${variant.price_adjustment}%`}
                            {getProductPrice(product as any, currency) ? (
                              <span className="text-eka-champagne ml-1">
                                ({formatCurrency(Math.abs((getProductPrice(product as any, currency)! * variant.price_adjustment) / 100), currency)})
                              </span>
                            ) : null}
                          </div>
                        )}
                      {variant.stock_quantity <= 5 && variant.stock_quantity > 0 && (
                        <div className="text-xs text-serene-sage mt-1">Only {variant.stock_quantity} left</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-eka-pearl">Description</h3>
              <p className={`text-sm sm:text-base text-eka-champagne leading-relaxed ${!hasFullAccess && !hasLimitedAccess ? 'blur-sm select-none' : ''}`}>
                {hasFullAccess || hasLimitedAccess ? product.description : 'Detailed product information available to clients with appropriate access level.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
              <Button 
                variant="exclusive" 
                className="flex-1 bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth text-sm sm:text-base min-h-[44px] touch-manipulation"
                onClick={handlePurchaseClick}
                disabled={!hasFullAccess}
              >
                <ShoppingBag className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-center">
                  {hasFullAccess ? "Buy Now" : "Purchase - Higher Tier Required"}
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePurchaseClick}
                className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20 min-h-[44px] min-w-[44px] touch-manipulation self-center sm:self-auto"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <h2 className="text-xl sm:text-2xl font-heading font-normal text-eka-pearl mb-6 sm:mb-8">
              Related Products
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={{
                    id: relatedProduct.id,
                    name: relatedProduct.name,
                    image: relatedProduct.image_url || '/placeholder.svg',
                    price: relatedProduct.price || undefined,
                    category: 'Product',
                    tier: (relatedProduct.tier as "A" | "B" | "C") || "A",
                    description: relatedProduct.description || '',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {isImageViewOpen && (
        <div className="fixed inset-0 z-50 bg-eka-emerald-depth/95 backdrop-blur-md flex items-center justify-center touch-manipulation">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsImageViewOpen(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 text-eka-pearl hover:bg-eka-jade-luxury/20 min-h-[44px] min-w-[44px] touch-manipulation"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            
            <img
              src={productImages[currentImageIndex]}
              alt={`${product.name} ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg touch-manipulation"
            />
            
            {/* Navigation arrows */}
            {productImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
                  className="absolute left-2 sm:left-4 text-eka-pearl hover:bg-eka-jade-luxury/20 min-h-[44px] min-w-[44px] touch-manipulation"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % productImages.length)}
                  className="absolute right-2 sm:right-4 text-eka-pearl hover:bg-eka-jade-luxury/20 min-h-[44px] min-w-[44px] touch-manipulation"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <EkaFooter />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default ProductDetails;
