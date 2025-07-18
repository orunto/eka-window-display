import { EkaHeader } from "@/components/EkaHeader";
import { mockCollections } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

const Collections = () => {
  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-obsidian-depth">
            Collections
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each collection tells a story of Afromodern luxury, blending contemporary design 
            with cultural heritage to create pieces that transcend trends and celebrate identity.
          </p>
        </div>

        <div className="space-y-20">
          {mockCollections.map((collection, index) => (
            <section key={collection.id} className={`${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-obsidian-depth">
                      {collection.name}
                    </h2>
                    {collection.tier === "A" && (
                      <Badge variant="secondary" className="bg-golden-grace text-white">
                        Full Access
                      </Badge>
                    )}
                    {collection.tier === "B" && (
                      <Badge variant="outline" className="border-serene-sage">
                        Limited View
                      </Badge>
                    )}
                    {collection.tier === "C" && (
                      <Badge variant="destructive" className="bg-obsidian-depth">
                        <Lock className="w-3 h-3 mr-1" />
                        Restricted
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-nurturing-jade font-medium uppercase tracking-wider">
                      {collection.season}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {collection.tier === "C" 
                        ? "This exclusive collection is available only to select Eka clients. Experience the pinnacle of luxury fashion with pieces crafted for true connoisseurs."
                        : collection.description
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {collection.productCount} pieces
                    </p>
                  </div>

                  {collection.tier === "A" && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-obsidian-depth">
                        Collection Highlights
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Handcrafted details with cultural significance</li>
                        <li>• Sustainable luxury materials</li>
                        <li>• Limited production runs</li>
                        <li>• Custom sizing available</li>
                      </ul>
                    </div>
                  )}

                  {collection.tier === "B" && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-obsidian-depth">
                        Collection Features
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Contemporary Afromodern aesthetics</li>
                        <li>• Premium material selection</li>
                        <li>• Limited availability</li>
                      </ul>
                    </div>
                  )}

                  {collection.tier === "C" && (
                    <div className="bg-pearl-mist p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-obsidian-depth mb-3">
                        Exclusive Access Required
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        This collection represents the epitome of Eka's craftsmanship and vision. 
                        Access is carefully curated for clients who share our commitment to excellence.
                      </p>
                      <p className="text-sm text-nurturing-jade font-medium">
                        Application required for collection access
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className={`aspect-[4/3] rounded-lg overflow-hidden ${collection.tier === "C" ? "blur-sm" : ""}`}>
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {collection.tier === "C" && (
                    <div className="absolute inset-0 bg-obsidian-depth/30 flex items-center justify-center rounded-lg">
                      <div className="text-center text-white space-y-2">
                        <Lock className="w-12 h-12 mx-auto" />
                        <p className="text-lg font-medium">Client Access Required</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

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
              Afromodern luxury fashion for the discerning few. Membership by invitation only.
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

export default Collections;