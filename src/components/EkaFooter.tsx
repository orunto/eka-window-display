import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Mail, MapPin, Phone, Facebook, Twitter } from "lucide-react";
export const EkaFooter = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    instagram: "",
    twitter: "",
    facebook: ""
  });
  useEffect(() => {
    fetchContactInfo();
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
  const fetchContactInfo = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("site_settings").select("key, value").in("key", ["contact_email", "contact_phone", "contact_address", "social_instagram", "social_twitter", "social_facebook"]);
      if (error) throw error;
      const info = data.reduce((acc, item) => {
        const key = item.key.replace("contact_", "").replace("social_", "");
        acc[key] = item.value;
        return acc;
      }, {} as any);
      setContactInfo(info);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };
  return <footer className="relative bg-gradient-to-br from-eka-emerald-depth via-eka-jade-luxury to-eka-emerald-depth overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full pattern-subtle opacity-[0.02]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pattern-accent opacity-[0.015]" />
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-eka-emerald-depth/90 to-transparent" />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-glow">
                  <img src="/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png" alt="Eka" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-5xl font-heading tracking-wider text-eka-golden">EKA</h3>
              </div>
              
              <p className="text-eka-champagne text-lg leading-relaxed max-w-md">
                Timeless luxury rooted in African heritage. A legacy reimagined for the discerning woman who values authenticity and excellence.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-px bg-gradient-to-r from-eka-golden to-transparent" />
                <div className="w-2 h-2 bg-eka-golden rounded-full animate-pulse" />
                <div className="w-12 h-px bg-gradient-to-l from-eka-golden to-transparent" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-2xl font-heading text-eka-pearl">Explore</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <a href="/collections" className="block text-eka-champagne hover:text-eka-golden transition-colors duration-300 text-lg">
                  Collections
                </a>
                <a href="/products" className="block text-eka-champagne hover:text-eka-golden transition-colors duration-300 text-lg">
                  Products
                </a>
                <a href="/about" className="block text-eka-champagne hover:text-eka-golden transition-colors duration-300 text-lg">
                  Our Story
                </a>
              </div>
              <div className="space-y-4">
                <a href="/bespoke" className="block text-eka-champagne hover:text-eka-golden transition-colors duration-300 text-lg">
                  Bespoke
                </a>
                
                <a href="/register" className="block text-eka-champagne hover:text-eka-golden transition-colors duration-300 text-lg">
                  Become a Client
                </a>
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-8">
            <h4 className="text-2xl font-heading text-eka-pearl">Connect</h4>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-eka-champagne">
                <div className="w-10 h-10 bg-gradient-glass rounded-xl flex items-center justify-center border border-eka-jade-luxury/30">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-lg">{contactInfo.email || "hello@eka-luxury.com"}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-eka-champagne">
                <div className="w-10 h-10 bg-gradient-glass rounded-xl flex items-center justify-center border border-eka-jade-luxury/30">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-lg">{contactInfo.phone || "+44 20 7123 4567"}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-eka-champagne">
                <div className="w-10 h-10 bg-gradient-glass rounded-xl flex items-center justify-center border border-eka-jade-luxury/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-lg">{contactInfo.address || "London • Lagos • New York"}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <p className="text-eka-pearl font-medium">Follow Our Journey</p>
              <div className="flex items-center space-x-4">
                {contactInfo.instagram && <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-glow transition-all duration-300 group">
                    <Instagram className="w-6 h-6 text-eka-emerald-depth group-hover:scale-110 transition-transform duration-300" />
                  </a>}
                {contactInfo.twitter && <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-glass rounded-xl flex items-center justify-center border border-eka-jade-luxury/30 hover:border-eka-golden/50 hover:scale-110 transition-all duration-300 group">
                    <Twitter className="w-6 h-6 text-eka-champagne group-hover:text-eka-golden transition-colors duration-300" />
                  </a>}
                {contactInfo.facebook && <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-glass rounded-xl flex items-center justify-center border border-eka-jade-luxury/30 hover:border-eka-golden/50 hover:scale-110 transition-all duration-300 group">
                    <Facebook className="w-6 h-6 text-eka-champagne group-hover:text-eka-golden transition-colors duration-300" />
                  </a>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-eka-jade-luxury/30 pt-12 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-eka-champagne/80 text-lg">© 2025 Eka. Timeless luxury, rooted in legacy.</p>
              <p className="text-eka-champagne/60 text-sm mt-2">
                Proudly crafted with African heritage and global vision.
              </p>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-eka-champagne/70">
              <a href="#" className="hover:text-eka-golden transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-eka-golden transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-eka-golden transition-colors duration-300">Heritage Club</a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};