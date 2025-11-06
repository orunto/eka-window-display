import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Star, Users, Shield } from "lucide-react";

const About = () => {
  const [content, setContent] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["about_us_title", "about_us_content"]);

      if (error) throw error;

      const contentMap = data.reduce((acc, item) => {
        const key = item.key.replace("about_us_", "");
        acc[key] = item.value;
        return acc;
      }, {} as any);

      setContent(contentMap);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28">
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          <h1 className="text-4xl md:text-6xl font-heading text-eka-deep-forest">
            {content.title || "Our Legacy"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed whitespace-pre-line">
            {content.content || "Born from a mother's passion for bespoke craftsmanship, Eka has evolved from a hidden gem serving a close-knit community to a modern luxury brand that celebrates African heritage through contemporary elegance."}
          </p>
        </div>

        {/* Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center space-y-6 p-8 bg-gradient-card rounded-lg shadow-card">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-eka-deep-forest">Authenticity</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every design tells a story, inspired by the rich traditions of African craftsmanship. 
              Our pieces are more than garments; they are a reflection of heritage and individuality.
            </p>
          </div>
          
          <div className="text-center space-y-6 p-8 bg-gradient-card rounded-lg shadow-card">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-eka-deep-forest">Excellence</h3>
            <p className="text-muted-foreground leading-relaxed">
              Precision and quality are non-negotiable. Every stitch, fabric choice, and design 
              embodies our commitment to delivering unparalleled craftsmanship and sophistication.
            </p>
          </div>
          
          <div className="text-center space-y-6 p-8 bg-gradient-card rounded-lg shadow-card">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-eka-deep-forest">Inclusivity</h3>
            <p className="text-muted-foreground leading-relaxed">
              We bridge the gap between African heritage and global modernity, creating designs 
              that resonate across cultures while celebrating traditional artistry.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading text-eka-deep-forest">
              The Eka Legacy
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The name Eka is both a tribute and a vision. Derived from "Nneka" (meaning "mother is supreme"), 
                it represents our commitment to family, legacy, and timeless elegance. What began as a mother's 
                passion for fashion has evolved into a symbol of exclusive luxury and artisanal craftsmanship.
              </p>
              <p>
                Our founder established Eka with a mission to craft garments that would not only adorn but 
                empower women. Over the years, we've become cherished by those who truly understand our value—
                a testament to authentic luxury rooted in African heritage.
              </p>
              <p>
                Now, with the next generation at the helm, Eka is ready for its next chapter. We're modernizing 
                the brand while retaining its essence, offering a more global, contemporary appeal. 
                Eka is more than a luxury brand; it is a legacy built on family, craftsmanship, and individuality.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop" 
              alt="Eka atelier" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-luxury text-white p-12 rounded-lg shadow-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              To craft elegant and timeless pieces that empower our clients, blending personal expression 
              with superior craftsmanship while celebrating the intersection of African heritage and global sophistication.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Global Sophistication</h3>
              <p className="text-white/80 leading-relaxed">
                We serve affluent, professional women worldwide who value exclusivity and luxury, 
                creating designs that speak to their elevated status and personal style.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Cultural Connection</h3>
              <p className="text-white/80 leading-relaxed">
                We provide the African diaspora with sophisticated, timeless fashion that offers 
                an emotional connection to their cultural heritage through modern luxury.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Bespoke Craftsmanship</h3>
              <p className="text-white/80 leading-relaxed">
                From bespoke designs to curated ready-to-wear collections, we deliver exceptional 
                value through personalized fashion that tells each client's unique story.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Legacy Building</h3>
              <p className="text-white/80 leading-relaxed">
                We're transforming Eka into a globally recognized luxury brand while preserving 
                the richness of our African heritage and the intimate relationships we've built.
              </p>
            </div>
          </div>
        </div>
      </div>

      <EkaFooter />
    </div>
  );
};

export default About;