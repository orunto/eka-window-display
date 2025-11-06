import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-check-only'
      });

      // If we get here and there's an existing session, user already has an account
      if (existingUser?.session || existingUser?.user) {
        toast({
          title: "Account Already Exists",
          description: "You're already a customer. Please use the sign-in button to access your account.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if email is in approved applications
      const { data: application, error: appError } = await supabase
        .from('client_applications')
        .select('status')
        .eq('email', email)
        .eq('status', 'approved')
        .single();

      if (appError || !application) {
        toast({
          title: "Access Denied",
          description: "Your application has not been approved yet. Please wait for approval.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        // Check if error is about user already existing
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          toast({
            title: "Account Already Exists",
            description: "You're already a customer. Please use the sign-in button to access your account.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Account created! Please check your email for verification.",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error: any) {
      // Check if it's an existing user error
      if (error?.message?.includes("Invalid login credentials")) {
        // This is actually good - means user doesn't exist yet, continue with signup
        // But we already handled the signup above, so this shouldn't happen
      }
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eka-emerald-depth via-eka-sage-whisper to-eka-emerald-depth flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-eka-emerald-depth/95 backdrop-blur-md border border-eka-jade-luxury/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading text-eka-golden mb-2">Create Your Account</h1>
          <p className="text-eka-champagne">Complete your registration to access EKA</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-eka-champagne">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-eka-champagne">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-eka-champagne">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60"
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
