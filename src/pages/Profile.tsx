import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
}

export default function Profile() {
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
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.get("full_name") as string,
          phone_number: formData.get("phone_number") as string,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      await fetchProfile(user.id);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
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
            <CardTitle className="text-eka-pearl">Profile Information</CardTitle>
            <CardDescription className="text-eka-champagne">
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-eka-pearl">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-champagne"
                />
                <p className="text-sm text-eka-champagne/60 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="full_name" className="text-eka-pearl">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name || ""}
                  className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl"
                />
              </div>
              <div>
                <Label htmlFor="phone_number" className="text-eka-pearl">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  defaultValue={profile?.phone_number || ""}
                  className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl"
                />
              </div>
              <Button type="submit" disabled={saving} className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <EkaFooter />
    </div>
  );
}
