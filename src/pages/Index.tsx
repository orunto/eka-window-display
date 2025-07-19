import { EkaHeader } from "@/components/EkaHeader";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/data/mockData";

const Index = () => {
  // Only show featured products (Tier A products)
  const featuredProducts = mockProducts.filter(product => product.tier === "A").slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Decorative pattern overlays */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-pattern-floral opacity-8 bg-no-repeat bg-top-right pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-pattern-elegant opacity-6 bg-no-repeat bg-bottom-left pointer-events-none" />
      
      <EkaHeader />
      
      {/* Featured Products */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block p-12 rounded-3xl bg-white/90 backdrop-blur-lg shadow-luxury border border-eka-golden-luxury/20 relative">
              <div className="absolute inset-0 bg-gradient-golden opacity-5 rounded-3xl" />
              <div className="relative z-10">
                <h2 className="text-5xl md:text-6xl font-heading text-eka-deep-jade mb-8 tracking-wide">
                  Featured Pieces
                </h2>
                <p className="text-xl text-eka-charcoal/80 max-w-3xl mx-auto leading-relaxed">
                  Discover our carefully curated selection of afromodern luxury fashion pieces, 
                  where heritage meets contemporary elegance in every stitch.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => console.log(`Viewing product: ${product.name}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-eka-obsidian text-white py-16 relative">
        <div className="absolute inset-0 bg-gradient-jade opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-6">
              <div className="w-16 h-16 bg-gradient-golden rounded-full flex items-center justify-center shadow-golden">
                <img 
                  src="/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png" 
                  alt="Eka" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-4xl font-heading tracking-wider text-eka-golden-luxury">EKA</h3>
            </div>
            <p className="text-white/80 max-w-lg mx-auto text-lg leading-relaxed">
              Afromodern luxury fashion for the discerning few. Where heritage meets haute couture. 
              Membership by invitation only.
            </p>
            <div className="border-t border-white/20 pt-8">
              <p className="text-white/60 text-sm tracking-wide">
                © 2024 Eka. All rights reserved. Exclusivity guaranteed.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
