
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showApplication, setShowApplication] = useState(false);
  const { toast } = useToast();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign up form state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Client application form state
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Successfully signed in!",
          });
          onClose();
        }
      } else if (activeTab === "signup") {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: signUpEmail,
          password: signUpPassword,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Account created! Please check your email for verification.",
          });
          onClose();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('client_applications')
        .insert({
          full_name: clientName,
          email: clientEmail,
          phone_number: phoneNumber,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully! 🎉",
        description: "We will reach out to you via WhatsApp and messaging to tell you when we've accepted your application.",
      });
      
      setClientName("");
      setClientEmail("");
      setPhoneNumber("");
      setShowApplication(false);
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto bg-eka-emerald-depth/95 backdrop-blur-md border-eka-jade-luxury/30 text-eka-pearl p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-heading text-eka-golden">
              {showApplication ? "Apply as EKA Client" : "Access EKA"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowApplication(false);
                onClose();
              }}
              className="text-eka-pearl hover:bg-eka-jade-luxury/20 min-h-[40px] min-w-[40px] touch-manipulation"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm sm:text-base text-eka-champagne leading-relaxed">
            {showApplication 
              ? "Complete the application form to become an EKA client."
              : "Sign in to access exclusive collections and purchase luxury pieces."}
          </p>
        </DialogHeader>

        {showApplication ? (
          <form onSubmit={handleClientAppSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-sm text-eka-champagne">Full Name</Label>
              <Input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="text-sm text-eka-champagne">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm text-eka-champagne">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                placeholder="+234 XXX XXX XXXX"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="button"
                onClick={() => setShowApplication(false)}
                variant="outline"
                className="flex-1 border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20 min-h-[44px] touch-manipulation"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth min-h-[44px] touch-manipulation"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </form>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-eka-jade-luxury/20 border border-eka-jade-luxury/30">
              <TabsTrigger 
                value="login" 
                className="text-xs sm:text-sm data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth touch-manipulation"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="text-xs sm:text-sm data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth touch-manipulation"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-eka-champagne">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-eka-champagne">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth min-h-[44px] touch-manipulation"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm text-eka-champagne">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signUpEmail" className="text-sm text-eka-champagne">Email</Label>
                <Input
                  id="signUpEmail"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signUpPassword" className="text-sm text-eka-champagne">Password</Label>
                <Input
                  id="signUpPassword"
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 min-h-[44px]"
                  placeholder="Create a password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth min-h-[44px] touch-manipulation"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowApplication(true)}
                  className="text-sm text-eka-champagne hover:text-eka-golden transition-colors underline"
                >
                  Not an eka client yet? Apply here
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
