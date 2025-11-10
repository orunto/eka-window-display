
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, Check, Package, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LoginModal } from "@/components/LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const EkaHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        if (data?.full_name) {
          const firstName = data.full_name.split(' ')[0];
          setUserFirstName(firstName);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "Categories", path: "/categories" },
    { name: "Bespoke", path: "/bespoke" },
    { name: "About", path: "/about" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-eka-emerald-depth/90 backdrop-blur-md shadow-lg border-b border-eka-jade-luxury/30' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div 
            className="text-2xl sm:text-3xl font-heading text-eka-golden cursor-pointer touch-manipulation"
            onClick={() => handleNavigation("/")}
          >
            EKA
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`text-sm lg:text-base font-medium transition-colors duration-300 hover:text-eka-golden touch-manipulation ${
                  isActivePath(item.path) 
                    ? 'text-eka-golden' 
                    : 'text-eka-pearl hover:text-eka-golden'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Status & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Status - Desktop */}
            {!loading && (
              <div className="hidden sm:flex items-center gap-3">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 bg-eka-jade-luxury/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-eka-golden/30 hover:bg-eka-jade-luxury/30 transition-colors">
                        <Check className="w-4 h-4 text-eka-golden" />
                        <span className="text-sm text-eka-pearl">Welcome {userFirstName}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-eka-emerald-depth/95 backdrop-blur-md border-eka-jade-luxury/30">
                      <DropdownMenuItem 
                        onClick={() => navigate("/profile")}
                        className="text-eka-pearl hover:bg-eka-jade-luxury/20 cursor-pointer"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate("/orders")}
                        className="text-eka-pearl hover:bg-eka-jade-luxury/20 cursor-pointer"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Order History
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate("/delivery")}
                        className="text-eka-pearl hover:bg-eka-jade-luxury/20 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Delivery Information
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-eka-jade-luxury/30" />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-eka-champagne hover:bg-eka-jade-luxury/20 hover:text-red-400 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth text-sm px-4 py-2"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden text-eka-pearl hover:bg-eka-jade-luxury/20 min-h-[44px] min-w-[44px] touch-manipulation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[280px] sm:w-[320px] bg-eka-emerald-depth/95 backdrop-blur-md border-eka-jade-luxury/30"
              >
                <div className="flex flex-col space-y-6 mt-8">
                  {/* User Status - Mobile */}
                  {!loading && (
                    <div className="pb-4 border-b border-eka-jade-luxury/30">
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-eka-golden">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Welcome {userFirstName}</span>
                          </div>
                          <Button
                            onClick={() => handleNavigation("/profile")}
                            className="w-full bg-eka-jade-luxury/20 hover:bg-eka-jade-luxury/30 text-eka-pearl min-h-[44px] touch-manipulation justify-start"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </Button>
                          <Button
                            onClick={() => handleNavigation("/orders")}
                            className="w-full bg-eka-jade-luxury/20 hover:bg-eka-jade-luxury/30 text-eka-pearl min-h-[44px] touch-manipulation justify-start"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Order History
                          </Button>
                          <Button
                            onClick={() => handleNavigation("/delivery")}
                            className="w-full bg-eka-jade-luxury/20 hover:bg-eka-jade-luxury/30 text-eka-pearl min-h-[44px] touch-manipulation justify-start"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Delivery Information
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className="w-full border-eka-jade-luxury/30 text-eka-champagne hover:bg-eka-jade-luxury/20 hover:text-red-400 min-h-[44px] touch-manipulation justify-start"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-eka-champagne">
                            <User className="w-4 h-4" />
                            <span className="text-sm">Guest Access</span>
                          </div>
                          <Button
                            onClick={() => {
                              setIsLoginModalOpen(true);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth min-h-[44px] touch-manipulation"
                          >
                            Sign In
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.path)}
                        className={`text-left py-3 px-2 text-base font-medium transition-colors duration-300 rounded-md touch-manipulation ${
                          isActivePath(item.path)
                            ? 'text-eka-golden bg-eka-jade-luxury/20'
                            : 'text-eka-pearl hover:text-eka-golden hover:bg-eka-jade-luxury/10'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
};
