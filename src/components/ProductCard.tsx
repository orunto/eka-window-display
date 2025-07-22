
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  tier?: string;
  featured?: boolean;
  in_stock?: boolean;
  categories?: { id: string; name: string } | null;
  collections?: { id: string; name: string } | null;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-6 border border-eka-jade-luxury/30 hover:border-eka-golden/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
        <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-eka-emerald-depth/20">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading text-eka-pearl group-hover:text-eka-golden transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.tier && (
              <span className="text-xs px-2 py-1 rounded-full bg-eka-jade-luxury/20 text-eka-golden border border-eka-golden/30">
                Tier {product.tier}
              </span>
            )}
          </div>
          
          {product.categories && (
            <p className="text-sm text-eka-champagne/80">
              {product.categories.name}
            </p>
          )}
          
          {product.price && (
            <p className="text-lg font-semibold text-eka-golden">
              ${product.price.toFixed(2)}
            </p>
          )}
          
          <div className="flex items-center gap-2">
            {product.featured && (
              <span className="text-xs px-2 py-1 rounded-full bg-eka-golden/20 text-eka-golden">
                Featured
              </span>
            )}
            {!product.in_stock && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
