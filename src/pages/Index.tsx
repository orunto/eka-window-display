
import { EkaHeader } from "@/components/EkaHeader";
import { ProductCard } from "@/components/ProductCard";
import { EkaFooter } from "@/components/EkaFooter";
import { mockProducts } from "@/data/mockData";

const Index = () => {
  // Only show featured products (Tier A products)
  const featuredProducts = mockProducts.filter(product => product.tier === "A").slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle decorative pattern overlays */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 pattern-subtle" />
      <div className="absolute bottom-0 left-0 w-1/6 h-1/3 pattern-accent" />
      
      <EkaHeader />
      
      {/* Featured Products */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="relative inline-block p-16 rounded-3xl bg-gradient-glass backdrop-blur-xl shadow-xl border border-eka-jade-luxury/30">
              <div className="absolute inset-0 bg-gradient-accent opacity-[0.05] rounded-3xl" />
              <div className="relative z-10">
                <h2 className="text-6xl md:text-7xl font-heading text-eka-pearl mb-8 tracking-wide">
                  Featured Pieces
                </h2>
                <p className="text-xl text-eka-champagne max-w-3xl mx-auto leading-relaxed">
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

      <EkaFooter />
    </div>
  );
};

export default Index;
