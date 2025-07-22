
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id || '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        <EkaFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-heading text-eka-pearl mb-4">Product Not Found</h1>
          <Link to="/" className="text-eka-golden hover:text-eka-pearl transition-colors">
            Back to Home
          </Link>
        </div>
        <EkaFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center text-eka-champagne hover:text-eka-golden transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-glass backdrop-blur-xl border border-eka-jade-luxury/30">
              <img 
                src={product.image_url || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gallery Images */}
            {product.gallery_images && product.gallery_images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.gallery_images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gradient-glass backdrop-blur-xl border border-eka-jade-luxury/30">
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl md:text-5xl font-heading text-eka-pearl">{product.name}</h1>
                {product.tier && (
                  <span className="px-3 py-1 rounded-full bg-eka-jade-luxury/20 text-eka-golden border border-eka-golden/30">
                    Tier {product.tier}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-eka-champagne">
                {product.categories && (
                  <span>{product.categories.name}</span>
                )}
                {product.collections && (
                  <>
                    <span>•</span>
                    <span>{product.collections.name}</span>
                  </>
                )}
              </div>
            </div>

            {product.price && (
              <div className="text-3xl font-bold text-eka-golden">
                ${product.price.toFixed(2)}
              </div>
            )}

            <div className="flex items-center gap-4">
              {product.featured && (
                <span className="px-3 py-1 rounded-full bg-eka-golden/20 text-eka-golden">
                  Featured
                </span>
              )}
              <span className={`px-3 py-1 rounded-full ${
                product.in_stock 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-eka-champagne leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Variants */}
            {product.product_variants && product.product_variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-heading text-eka-pearl">Available Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.product_variants.map((variant) => (
                    <div key={variant.id} className="p-3 rounded-xl bg-gradient-glass backdrop-blur-xl border border-eka-jade-luxury/30">
                      <div className="flex justify-between items-center">
                        <span className="text-eka-pearl font-medium">{variant.name}</span>
                        {variant.price_adjustment > 0 && (
                          <span className="text-eka-golden text-sm">+${variant.price_adjustment}</span>
                        )}
                      </div>
                      <div className="text-eka-champagne text-sm">
                        {variant.type} • {variant.stock_quantity} available
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button 
                className="flex-1 bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth font-semibold py-3 text-lg"
                disabled={!product.in_stock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EkaFooter />
    </div>
  );
};

export default ProductDetails;
