import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Profile {
  id: string;
  delivery_address: string | null;
}

export default function Delivery() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/register");
      return;
    }
    setUser(session.user);
    await fetchProfile(session.user.id);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, delivery_address")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          delivery_address: formData.get("delivery_address") as string,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery address updated successfully",
      });

      await fetchProfile(user.id);
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "Failed to update delivery address",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-eka-pearl text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <EkaHeader />

      <main className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
        <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
          <CardHeader>
            <CardTitle className="text-eka-pearl">Delivery Address</CardTitle>
            <CardDescription className="text-eka-champagne">
              Update your default delivery address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateAddress} className="space-y-4">
              <div>
                <Label htmlFor="delivery_address" className="text-eka-pearl">Address</Label>
                <Textarea
                  id="delivery_address"
                  name="delivery_address"
                  defaultValue={profile?.delivery_address || ""}
                  rows={4}
                  placeholder="Enter your full delivery address including street, city, state, and postal code"
                  className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl"
                />
              </div>
              <Button type="submit" disabled={saving} className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth">
                {saving ? "Saving..." : "Save Address"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <EkaFooter />
    </div>
  );
}
