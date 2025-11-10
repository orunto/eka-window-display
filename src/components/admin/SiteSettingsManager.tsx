import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
}
export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchSettings();
  }, []);
  const fetchSettings = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("site_settings").select("*").order("key");
      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load site settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const updateSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      const {
        error
      } = await supabase.from("site_settings").update({
        value
      }).eq("key", key);
      if (error) throw error;
      setSettings(prev => prev.map(s => s.key === key ? {
        ...s,
        value
      } : s));
      toast({
        title: "Success",
        description: "Setting updated successfully"
      });
    } catch (error) {
      console.error("Error updating setting:", error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  const getSetting = (key: string) => {
    return settings.find(s => s.key === key)?.value || "";
  };
  const getSettingObj = (key: string) => {
    return settings.find(s => s.key === key);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, keys: string[]) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    for (const key of keys) {
      const value = formData.get(key) as string;
      if (value !== getSetting(key)) {
        await updateSetting(key, value);
      }
    }
  };
  if (loading) {
    return <div className="text-eka-pearl">Loading settings...</div>;
  }
  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading text-eka-pearl mb-2">Site Settings</h2>
        <p className="text-eka-champagne">Manage Eka website content and information</p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-eka-emerald-depth/40">
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="bespoke">Bespoke</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
            <CardHeader>
              <CardTitle className="text-eka-pearl">About Us Page</CardTitle>
              <CardDescription className="text-eka-champagne">
                Update the content displayed on the About Us page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => handleSubmit(e, ["about_us_title", "about_us_content"])} className="space-y-4">
                <div>
                  <Label htmlFor="about_us_title" className="text-eka-pearl">Title</Label>
                  <Input id="about_us_title" name="about_us_title" defaultValue={getSetting("about_us_title")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                </div>
                <div>
                  <Label htmlFor="about_us_content" className="text-eka-pearl">Content</Label>
                  <Textarea id="about_us_content" name="about_us_content" defaultValue={getSetting("about_us_content")} rows={12} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                </div>
                <Button type="submit" disabled={saving} className="bg-eka-golden hover:bg-eka-golden/80">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
            <CardHeader>
              <CardTitle className="text-eka-pearl">Contact Information</CardTitle>
              <CardDescription className="text-eka-champagne">
                Update contact details and social media links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => handleSubmit(e, ["contact_email", "contact_phone", "contact_address", "social_instagram", "social_twitter", "social_facebook"])} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="contact_email" className="text-eka-pearl">Email</Label>
                    <Input id="contact_email" name="contact_email" type="email" defaultValue={getSetting("contact_email")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone" className="text-eka-pearl">Phone</Label>
                    <Input id="contact_phone" name="contact_phone" defaultValue={getSetting("contact_phone")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact_address" className="text-eka-pearl">Address</Label>
                  <Input id="contact_address" name="contact_address" defaultValue={getSetting("contact_address")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-eka-pearl font-semibold">Social Media Links</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="social_instagram" className="text-eka-pearl">Instagram</Label>
                      <Input id="social_instagram" name="social_instagram" defaultValue={getSetting("social_instagram")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                    </div>
                    <div>
                      <Label htmlFor="social_twitter" className="text-eka-pearl">Twitter</Label>
                      <Input id="social_twitter" name="social_twitter" defaultValue={getSetting("social_twitter")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                    </div>
                    <div>
                      <Label htmlFor="social_facebook" className="text-eka-pearl">Facebook</Label>
                      <Input id="social_facebook" name="social_facebook" defaultValue={getSetting("social_facebook")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={saving} className="bg-eka-golden hover:bg-eka-golden/80 text-slate-950">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bespoke">
          <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
            <CardHeader>
              <CardTitle className="text-eka-pearl">Bespoke Service</CardTitle>
              <CardDescription className="text-eka-champagne">
                Update Eka Bespoke service information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => handleSubmit(e, ["bespoke_title", "bespoke_intro", "bespoke_process", "bespoke_timeline", "bespoke_pricing"])} className="space-y-4">
                <div>
                  <Label htmlFor="bespoke_title" className="text-eka-pearl">Title</Label>
                  <Input id="bespoke_title" name="bespoke_title" defaultValue={getSetting("bespoke_title")} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                </div>
                <div>
                  <Label htmlFor="bespoke_intro" className="text-eka-pearl">Introduction</Label>
                  <Textarea id="bespoke_intro" name="bespoke_intro" defaultValue={getSetting("bespoke_intro")} rows={4} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                </div>
                <div>
                  <Label htmlFor="bespoke_process" className="text-eka-pearl">Process (Markdown supported)</Label>
                  <Textarea id="bespoke_process" name="bespoke_process" defaultValue={getSetting("bespoke_process")} rows={16} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl font-mono text-sm" />
                </div>
                <div>
                  <Label htmlFor="bespoke_timeline" className="text-eka-pearl">Timeline</Label>
                  <Textarea id="bespoke_timeline" name="bespoke_timeline" defaultValue={getSetting("bespoke_timeline")} rows={3} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                </div>
                <div>
                  <Label htmlFor="bespoke_pricing" className="text-eka-pearl">Pricing</Label>
                  <Textarea id="bespoke_pricing" name="bespoke_pricing" defaultValue={getSetting("bespoke_pricing")} rows={3} className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl" />
                </div>
                <Button type="submit" disabled={saving} className="bg-eka-golden hover:bg-eka-golden/80">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}