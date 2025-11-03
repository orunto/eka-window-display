
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Signed in successfully",
        description: "Welcome to the admin dashboard",
      });
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

  return (
    <div className="max-w-md mx-auto">
      <div className="relative p-8 rounded-3xl bg-gradient-glass backdrop-blur-xl shadow-xl border border-eka-jade-luxury/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading text-eka-pearl mb-2">
            Admin Login
          </h1>
          <p className="text-eka-champagne">
            Access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-eka-pearl">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-eka-pearl">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};
