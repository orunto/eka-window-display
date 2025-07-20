import { EkaHeader } from "@/components/EkaHeader";
import { mockCollections } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Collections = () => {
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-eka-pearl via-background to-eka-cloud">
      <EkaHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-elegant opacity-[0.02]" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center mb-20 space-y-6">
            <h1 className="text-5xl md:text-7xl font-heading font-normal bg-gradient-to-br from-eka-deep-forest via-eka-jade-luxury to-eka-warm-bronze bg-clip-text text-transparent">
              Collections
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Where heritage meets haute couture. Each collection tells the story of Eka's legacy—
              timeless luxury rooted in African artistry, reimagined for the modern woman.
            </p>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="space-y-32">
          {mockCollections.map((collection, index) => (
            <section 
              key={collection.id} 
              className="group cursor-pointer transition-all duration-700 hover:scale-[1.02]"
              onClick={() => navigate(`/collection/${collection.id}`)}
            >
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  {/* Collection Header */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h2 className="text-4xl md:text-5xl font-heading font-normal bg-gradient-to-r from-eka-deep-forest to-eka-jade-luxury bg-clip-text text-transparent group-hover:from-eka-jade-luxury group-hover:to-eka-champagne transition-all duration-500">
                        {collection.name}
                      </h2>
                      {collection.tier === "A" && (
                        <Badge className="bg-gradient-primary text-white border-0 px-4 py-2 font-medium">
                          Full Access
                        </Badge>
                      )}
                      {collection.tier === "B" && (
                        <Badge variant="outline" className="border-eka-jade-luxury text-eka-jade-luxury bg-gradient-to-r from-eka-champagne/10 to-transparent px-4 py-2">
                          Collaboration
                        </Badge>
                      )}
                      {collection.tier === "C" && (
                        <Badge className="bg-gradient-to-r from-eka-graphite to-eka-ink text-white border-0 px-4 py-2">
                          <Lock className="w-3 h-3 mr-2" />
                          Heritage
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-eka-jade-luxury font-medium uppercase tracking-[0.2em] opacity-80">
                      {collection.season}
                    </p>
                  </div>
                  
                  {/* Collection Story */}
                  <div className="bg-gradient-card backdrop-blur-sm border border-eka-cloud/50 rounded-2xl p-8 space-y-6 shadow-card">
                    <p className="text-lg md:text-xl text-foreground leading-relaxed">
                      {collection.tier === "C" 
                        ? "This exclusive collection is available only to select Eka clients. Experience the pinnacle of luxury fashion with pieces crafted for true connoisseurs."
                        : collection.description
                      }
                    </p>
                    
                    {collection.story && (
                      <div className="border-l-2 border-eka-jade-luxury pl-6">
                        <p className="text-muted-foreground italic leading-relaxed">
                          {collection.story}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-eka-cloud/30">
                      <p className="text-sm text-muted-foreground font-medium">
                        {collection.productCount} exclusive pieces
                      </p>
                      <div className="w-8 h-8 rounded-full bg-gradient-primary opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Collection Features */}
                  {collection.tier === "A" && (
                    <div className="bg-gradient-to-br from-eka-champagne/10 to-eka-cloud/20 border border-eka-champagne/20 rounded-xl p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-eka-deep-forest">
                        Collection Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-eka-jade-luxury rounded-full" />
                          <span className="text-sm">Heritage craftsmanship</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-eka-jade-luxury rounded-full" />
                          <span className="text-sm">Sustainable luxury</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-eka-jade-luxury rounded-full" />
                          <span className="text-sm">Limited production</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-eka-jade-luxury rounded-full" />
                          <span className="text-sm">Custom tailoring</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {collection.tier === "C" && (
                    <div className="bg-gradient-to-br from-eka-graphite/5 to-eka-ink/10 border border-eka-graphite/20 rounded-xl p-8 space-y-4">
                      <h3 className="text-xl font-semibold text-eka-deep-forest">
                        Exclusive Heritage Access
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        This collection represents the pinnacle of Eka's artistry and vision. 
                        Access is reserved for founding clients and carefully selected members who understand true luxury.
                      </p>
                      <div className="inline-flex items-center gap-2 text-eka-jade-luxury font-medium text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Application required for collection access</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Collection Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative group/image">
                    <div className={`aspect-[4/3] rounded-2xl overflow-hidden shadow-xl transition-all duration-700 group-hover:shadow-2xl ${collection.tier === "C" ? "blur-[2px]" : ""}`}>
                      <img 
                        src={collection.image} 
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-eka-ink/20 via-transparent to-transparent" />
                    </div>
                    
                    {collection.tier === "C" && (
                      <div className="absolute inset-0 bg-gradient-to-br from-eka-deep-forest/20 to-eka-ink/30 flex items-center justify-center rounded-2xl backdrop-blur-[1px]">
                        <div className="text-center text-white space-y-4 bg-eka-ink/40 backdrop-blur-sm rounded-xl p-8">
                          <Lock className="w-16 h-16 mx-auto opacity-90" />
                          <div className="space-y-2">
                            <p className="text-xl font-medium">Heritage Access</p>
                            <p className="text-sm opacity-80">Invitation Only</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Decorative corner */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full opacity-60 group-hover:opacity-100 transition-all duration-500" />
                  </div>
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