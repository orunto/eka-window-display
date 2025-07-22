
import { Link } from "react-router-dom";

interface Collection {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  featured?: boolean;
}

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link to={`/collection/${collection.id}`} className="group block">
      <div className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-6 border border-eka-jade-luxury/30 hover:border-eka-golden/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-eka-emerald-depth/20">
          <img 
            src={collection.image_url || '/placeholder.svg'} 
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading text-eka-pearl group-hover:text-eka-golden transition-colors">
              {collection.name}
            </h3>
            {collection.featured && (
              <span className="text-xs px-2 py-1 rounded-full bg-eka-golden/20 text-eka-golden border border-eka-golden/30">
                Featured
              </span>
            )}
          </div>
          
          <p className="text-eka-champagne leading-relaxed line-clamp-3">
            {collection.description}
          </p>
          
          <div className="pt-2">
            <span className="text-eka-golden group-hover:text-eka-pearl transition-colors font-medium">
              Explore Collection →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
