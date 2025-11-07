import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validate password match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('register-user', {
        body: {
          email,
          password,
          fullName,
        },
      });

      if (response.error) {
        toast({
          title: "Error",
          description: response.error.message || "An error occurred during registration",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const data = response.data;

      if (data.error) {
        toast({
          title: "Registration Failed",
          description: data.error,
          variant: "destructive",
        });
      } else if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 pr-10"
                placeholder="Create a password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-eka-champagne/60 hover:text-eka-champagne transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-eka-champagne">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-eka-sage-whisper/20 border-eka-jade-luxury/30 text-eka-pearl placeholder:text-eka-champagne/60 pr-10"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-eka-champagne/60 hover:text-eka-champagne transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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
