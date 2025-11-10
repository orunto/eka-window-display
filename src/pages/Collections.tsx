import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { useCollections } from "@/hooks/useCollections";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { slugify } from "@/utils/slugify";

const Collections = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { collections, loading } = useCollections();

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
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 pattern-subtle" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 pattern-accent" />
      </div>
      
      <EkaHeader />
      
      <div className="pt-16 sm:pt-20" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-20 space-y-8">
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-8xl font-heading font-normal bg-gradient-to-br from-eka-pearl via-eka-champagne to-eka-golden bg-clip-text text-transparent">
                Collections
              </h1>
              <div className="absolute -inset-4 bg-gradient-accent opacity-10 blur-3xl rounded-full" />
            </div>
            <p className="text-xl md:text-2xl text-eka-champagne max-w-4xl mx-auto leading-relaxed">
              Where heritage meets haute couture. Each collection tells the story of Eka's legacy—
              timeless luxury rooted in African artistry, reimagined for the modern woman.
            </p>
            <div className="w-32 h-1 bg-gradient-accent mx-auto rounded-full animate-glow" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 relative">
        {loading ? (
          <div className="text-center text-eka-champagne py-20">
            <p className="text-xl">Loading collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center text-eka-champagne py-20">
            <p className="text-xl">No collections available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-40">
            {collections.map((collection, index) => (
            <div key={collection.id}>
              {/* Visual Section Divider */}
              {index > 0 && (
                <div className="flex items-center justify-center my-32">
                  <div className="flex items-center space-x-8">
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-eka-golden to-transparent" />
                    <div className="w-3 h-3 rounded-full bg-eka-golden animate-pulse" />
                    <div className="w-32 h-px bg-gradient-to-r from-eka-golden via-eka-champagne to-eka-golden" />
                    <div className="w-3 h-3 rounded-full bg-eka-golden animate-pulse animation-delay-500" />
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-eka-golden to-transparent" />
                  </div>
                </div>
              )}

              <section 
                className="group cursor-pointer transition-all duration-700 hover:scale-[1.02] relative"
                onClick={() => navigate(`/collection/${slugify(collection.name)}`)}
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-700 rounded-3xl" />
                
                <div className={`grid lg:grid-cols-2 gap-16 items-center relative ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    {/* Collection Header */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 flex-wrap">
                        <h2 className="text-5xl md:text-6xl font-heading font-normal bg-gradient-to-r from-eka-pearl to-eka-champagne bg-clip-text text-transparent group-hover:from-eka-golden group-hover:to-eka-pearl transition-all duration-700">
                          {collection.name}
                        </h2>
                        <Badge className="bg-eka-golden text-eka-emerald-depth border-0 px-6 py-3 font-medium text-base">
                          Exclusive
                        </Badge>
                      </div>
                      
                      <p className="text-lg text-eka-golden font-medium uppercase tracking-[0.3em] opacity-90">
                        {collection.season}
                      </p>
                    </div>
                    
                    {/* Collection Story */}
                    <div className="bg-gradient-glass backdrop-blur-xl border border-eka-jade-luxury/30 rounded-3xl p-8 space-y-6 shadow-xl group-hover:shadow-glow transition-all duration-700">
                      <p className="text-lg md:text-xl text-eka-pearl leading-relaxed">
                        {collection.tier === "C" && !user
                          ? "This exclusive collection represents the pinnacle of Eka's artistry. Available only to heritage clients, each piece embodies generations of craftsmanship and the deepest connection to our African roots."
                          : collection.description
                        }
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-eka-jade-luxury/30">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-eka-golden rounded-full animate-pulse" />
                          <p className="text-eka-champagne font-medium">
                            Exclusive collection
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-accent opacity-70 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center animate-float">
                          <div className="w-3 h-3 bg-eka-emerald-depth rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Collection Features */}
                    <div className="bg-gradient-to-br from-eka-golden/10 to-eka-champagne/5 border border-eka-golden/30 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
                      <h3 className="text-2xl font-semibold text-eka-golden">
                        {collection.tier === "C" && !user ? "Sign in to view exclusive collections" : "Collection Features"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {collection.tier === "C" && !user ? (
                          <>
                            <div className="flex items-center gap-3">
                              <Lock className="w-3 h-3 text-eka-golden" />
                              <span className="text-eka-pearl">Restricted Access</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Lock className="w-3 h-3 text-eka-golden" />
                              <span className="text-eka-pearl">Client Only</span>
                            </div>
                          </>
                        ) : (
                          ((collection as any).features || ['Heritage craftsmanship', 'Sustainable luxury', 'Limited production', 'Custom tailoring']).map((feature: string, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-eka-golden rounded-full animate-pulse" style={{animationDelay: `${i * 200}ms`}} />
                              <span className="text-eka-pearl">{feature}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Collection Image */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="relative group/image">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-glow relative">
                        <img 
                          src={collection.image_url || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop'}
                          alt={collection.name}
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                            collection.tier === "C" && !user ? "blur-md" : ""
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-eka-emerald-depth/30 via-transparent to-transparent" />
                        
                        {/* Restricted Overlay */}
                        {collection.tier === "C" && !user && (
                          <div className="absolute inset-0 bg-eka-emerald-depth/40 flex items-center justify-center">
                            <div className="text-center text-eka-pearl space-y-3">
                              <Lock className="w-12 h-12 mx-auto" />
                              <div className="space-y-1">
                                <p className="text-lg font-semibold">Exclusive Collection</p>
                                <p className="text-sm opacity-90">Client Access Required</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-accent rounded-full opacity-70 group-hover:opacity-100 transition-all duration-700 animate-float" />
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-eka-golden rounded-full opacity-60 group-hover:opacity-90 transition-all duration-700 animate-float animation-delay-1000" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - keeping the existing footer component */}
      <EkaFooter />
    </div>
  );
};

export default Collections;
