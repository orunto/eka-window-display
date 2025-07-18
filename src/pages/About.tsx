import { EkaHeader } from "@/components/EkaHeader";
import { Star, Users, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-obsidian-depth">
            The Eka Philosophy
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We believe luxury is not about price—it's about purpose, craftsmanship, and the intimate 
            relationship between creator and wearer. Eka exists for those who understand that true 
            exclusivity cannot be bought, only earned.
          </p>
        </div>

        {/* Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center space-y-6 p-8 bg-gradient-subtle rounded-lg">
            <div className="w-16 h-16 bg-golden-grace rounded-full mx-auto flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-obsidian-depth">Uncompromising Quality</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every piece is crafted with the finest materials and meticulous attention to detail. 
              Our artisans bring generations of skill to create garments that transcend mere fashion.
            </p>
          </div>
          
          <div className="text-center space-y-6 p-8 bg-gradient-subtle rounded-lg">
            <div className="w-16 h-16 bg-golden-grace rounded-full mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-obsidian-depth">Curated Clientele</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our pieces are designed for individuals who appreciate artistry and exclusivity. 
              We believe in building relationships, not just transactions.
            </p>
          </div>
          
          <div className="text-center space-y-6 p-8 bg-gradient-subtle rounded-lg">
            <div className="w-16 h-16 bg-golden-grace rounded-full mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-obsidian-depth">Timeless Design</h3>
            <p className="text-muted-foreground leading-relaxed">
              We create pieces that transcend trends, designed to be cherished for generations. 
              Our Afromodern aesthetic celebrates heritage while embracing the future.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-obsidian-depth">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded on the principles of Afromodern luxury, Eka represents a new paradigm in fashion. 
                We celebrate the intersection of contemporary design and cultural heritage, creating pieces 
                that honor the past while defining the future.
              </p>
              <p>
                Every collection tells a story of identity, craftsmanship, and innovation. Our designers 
                work closely with skilled artisans to bring these visions to life, ensuring that each 
                piece meets our exacting standards of excellence.
              </p>
              <p>
                Eka is not just a brand—it's a community of individuals who share our values of quality, 
                authenticity, and purposeful luxury. We invite only those who understand that true style 
                cannot be purchased; it must be cultivated.
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
        <div className="bg-nurturing-jade text-white p-12 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              These principles guide every decision we make, from design conception to client relationships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Cultural Celebration</h3>
              <p className="opacity-80 leading-relaxed">
                We honor and celebrate African heritage through contemporary design, creating pieces 
                that bridge traditional craftsmanship with modern aesthetics.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Sustainable Luxury</h3>
              <p className="opacity-80 leading-relaxed">
                Our commitment to sustainability means using ethically sourced materials and 
                supporting fair trade practices throughout our supply chain.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Artisanal Excellence</h3>
              <p className="opacity-80 leading-relaxed">
                We partner with master craftspeople who bring decades of experience and passion 
                to every piece, ensuring unmatched quality and attention to detail.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Exclusive Community</h3>
              <p className="opacity-80 leading-relaxed">
                Our clients become part of an exclusive community that values authenticity, 
                quality, and the deeper meaning behind luxury fashion.
              </p>
            </div>
          </div>
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

export default About;