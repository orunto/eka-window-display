import { EkaHeader } from "@/components/EkaHeader";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { Button } from "@/components/ui/button";
import { mockProducts, mockCollections } from "@/data/mockData";
import { ArrowRight, Star, Users, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      <HeroSection />
      
      {/* Featured Collections */}
      <section id="collections" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-obsidian-depth">
              Exclusive Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each collection tells a story of craftsmanship, exclusivity, and timeless design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCollections.slice(0, 6).map((collection) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection}
                onClick={() => console.log(`Viewing collection: ${collection.name}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-obsidian-depth">
              Curated Pieces
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully selected pieces, each with different levels of access.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 8).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => console.log(`Viewing product: ${product.name}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-nurturing-jade text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              The Eka Philosophy
            </h2>
            <p className="text-xl leading-relaxed opacity-90">
              We believe luxury is not about price—it's about purpose, craftsmanship, and the intimate 
              relationship between creator and wearer. Eka exists for those who understand that true 
              exclusivity cannot be bought, only earned.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-golden-grace rounded-full mx-auto flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Uncompromising Quality</h3>
                <p className="opacity-80">
                  Every piece is crafted with the finest materials and meticulous attention to detail.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-golden-grace rounded-full mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Curated Clientele</h3>
                <p className="opacity-80">
                  Our pieces are designed for individuals who appreciate artistry and exclusivity.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-golden-grace rounded-full mx-auto flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Timeless Design</h3>
                <p className="opacity-80">
                  We create pieces that transcend trends, designed to be cherished for generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="about" className="py-20 bg-gradient-luxury text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl leading-relaxed opacity-90">
              Join our exclusive community of discerning clients who understand that true luxury 
              is about the extraordinary, not the ordinary.
            </p>
            <Button 
              size="xl"
              className="bg-white text-nurturing-jade hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-glow"
            >
              Apply for Membership
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-obsidian-depth text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png" 
                  alt="Eka" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold tracking-wider">EKA</h3>
            </div>
            <p className="text-white/60 max-w-md mx-auto">
              Luxury fashion for the discerning few. Membership by invitation only.
            </p>
            <div className="border-t border-white/20 pt-6">
              <p className="text-white/40 text-sm">
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
