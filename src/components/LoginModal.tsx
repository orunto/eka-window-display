import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showClientApp, setShowClientApp] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profession, setProfession] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account created",
          description: "Please check your email for verification link",
        });
        onClose();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            profession,
            application_reason: reason
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your account has been created. Please check your email for verification.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showClientApp) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-nurturing-jade">
              Become an Eka Client
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-luxury rounded-full mx-auto flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-obsidian-depth">
                Exclusive Access Application
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Eka is a luxury fashion house that creates exclusive pieces for a select clientele. 
                We believe in quality over quantity, craftsmanship over mass production, and 
                exclusivity over accessibility.
              </p>
            </div>

            <Separator />

            <form onSubmit={handleClientAppSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name"
                  className="mt-1"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="Create a password"
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="profession" className="text-sm font-medium">Profession/Industry</Label>
                <Input 
                  id="profession" 
                  placeholder="Your profession or industry"
                  className="mt-1"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  Why do you want to become an Eka client?
                </Label>
                <textarea 
                  id="reason"
                  rows={4}
                  placeholder="Tell us about your interest in Eka and our exclusive fashion philosophy..."
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </form>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowClientApp(false)}
                className="flex-1"
                disabled={loading}
              >
                Back to Login
              </Button>
              <Button 
                type="submit"
                variant="luxury" 
                className="flex-1"
                disabled={loading}
                onClick={handleClientAppSubmit}
              >
                {loading ? "Creating Account..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-nurturing-jade">
            Eka Client Login
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-luxury rounded-full mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-muted-foreground">
              Access your exclusive Eka client account
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="your@email.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="Enter your full name"
                  className="mt-1"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <Button type="submit" variant="elegant" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Login to Eka")}
            </Button>
          </form>

          <Separator />

          <div className="text-center space-y-3">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Want to become an exclusive client?
            </p>
            <Button 
              variant="exclusive" 
              onClick={() => setShowClientApp(true)}
              className="w-full"
              disabled={loading}
            >
              Become an Eka Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};