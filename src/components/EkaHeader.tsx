import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, ShoppingBag, Menu, LogOut, CheckCircle } from "lucide-react";
import { LoginModal } from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const EkaHeader = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b border-serene-sage/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-luxury rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/0555df50-cd91-4e2c-95d7-7009f8e63ef9.png" 
                  alt="Eka" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <a href="/" className="text-2xl font-bold text-nurturing-jade tracking-wider hover:opacity-80 transition-opacity">EKA</a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/collections" className="text-foreground hover:text-nurturing-jade transition-colors font-medium">
                Collections
              </a>
              <a href="/products" className="text-foreground hover:text-nurturing-jade transition-colors font-medium">
                Products
              </a>
              <a href="/about" className="text-foreground hover:text-nurturing-jade transition-colors font-medium">
                About
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="w-5 h-5" />
              </Button>
              
              {/* User Authentication */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="w-5 h-5" />
                      <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-eka-golden fill-current" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsLoginOpen(true)}
                  disabled={loading}
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-golden-grace text-xs rounded-full w-5 h-5 flex items-center justify-center text-white font-medium">
                  0
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-serene-sage/30">
              <nav className="flex flex-col space-y-3">
                <a href="/collections" className="text-foreground hover:text-nurturing-jade transition-colors font-medium py-2">
                  Collections
                </a>
                <a href="/products" className="text-foreground hover:text-nurturing-jade transition-colors font-medium py-2">
                  Products
                </a>
                <a href="/about" className="text-foreground hover:text-nurturing-jade transition-colors font-medium py-2">
                  About
                </a>
                <div className="pt-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};