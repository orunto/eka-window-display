import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Lock, Sparkles } from "lucide-react";
import { LoginModal } from "./LoginModal";

export const HeroSection = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(/lovable-uploads/faba6ba3-5bb9-4134-9891-08c5c6bad58a.png)`,
            backgroundSize: '120px 120px',
            backgroundRepeat: 'repeat'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 space-y-8">
          {/* Logo */}
          <div className="animate-fade-in">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mx-auto mb-8 flex items-center justify-center border border-white/20">
              <img 
                src="/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png" 
                alt="Eka" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider">
              EKA
            </h1>
            <div className="flex items-center justify-center space-x-2 text-golden-grace">
              <Sparkles className="w-5 h-5" />
              <p className="text-xl md:text-2xl font-light tracking-wide">
                Luxury Redefined
              </p>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 animate-fade-in max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Experience fashion as it should be—exclusive, personal, and uncompromising. 
              Eka creates for the discerning few who understand that true luxury cannot be mass-produced.
            </p>
            <div className="flex items-center justify-center space-x-2 text-white/70">
              <Lock className="w-4 h-4" />
              <p className="text-sm">Membership Required for Purchase</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in">
            <Button 
              size="xl"
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300"
            >
              Explore Collections
            </Button>
            <Button 
              variant="luxury" 
              size="xl"
              onClick={() => setIsLoginOpen(true)}
              className="shadow-glow hover:shadow-glow"
            >
              <Lock className="w-5 h-5 mr-2" />
              Client Login
            </Button>
          </div>

          {/* Exclusive Badge */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-obsidian-depth/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="w-2 h-2 bg-golden-grace rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                By Invitation Only
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white/60" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-16 h-16 border border-golden-grace/20 rounded-full animate-pulse delay-1000" />
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};