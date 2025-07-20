import { EkaHeader } from "@/components/EkaHeader";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/data/mockData";

const Index = () => {
  // Only show featured products (Tier A products)
  const featuredProducts = mockProducts.filter(product => product.tier === "A").slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Subtle decorative pattern overlays */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 bg-pattern-floral opacity-[0.02] bg-no-repeat bg-cover pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/6 h-1/3 bg-pattern-elegant opacity-[0.015] bg-no-repeat bg-cover pointer-events-none" />
      
      <EkaHeader />
      
      {/* Featured Products */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block p-12 rounded-3xl bg-gradient-card backdrop-blur-lg shadow-card border border-eka-champagne/30 relative">
              <div className="absolute inset-0 bg-gradient-accent opacity-[0.03] rounded-3xl" />
              <div className="relative z-10">
                <h2 className="text-5xl md:text-6xl font-heading text-eka-deep-forest mb-8 tracking-wide">
                  Featured Pieces
                </h2>
                <p className="text-xl text-eka-warm-bronze max-w-3xl mx-auto leading-relaxed">
                  Discover our carefully curated selection where African heritage meets contemporary luxury, 
                  each piece crafted to celebrate individuality and timeless elegance.
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
      <footer className="bg-eka-ink text-white py-16 relative">
        <div className="absolute inset-0 bg-gradient-primary opacity-95" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-6">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src="/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png" 
                  alt="Eka" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-4xl font-heading tracking-wider text-eka-champagne">EKA</h3>
            </div>
            <p className="text-white/80 max-w-lg mx-auto text-lg leading-relaxed">
              A legacy reimagined. Timeless luxury rooted in African heritage, 
              crafted for the discerning woman who values authenticity and excellence.
            </p>
            <div className="border-t border-white/20 pt-8">
              <p className="text-white/60 text-sm tracking-wide">
                © 2024 Eka. Timeless luxury, rooted in legacy.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
