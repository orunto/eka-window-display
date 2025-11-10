import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export const PaymentSettingsManager = () => {
  const [settings, setSettings] = useState({
    paystack_public_key_ngn: "",
    paystack_public_key_usd: "",
    stripe_public_key_gbp: "",
    stripe_public_key_usd: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "paystack_public_key_ngn",
          "paystack_public_key_usd",
          "stripe_public_key_gbp",
          "stripe_public_key_usd",
        ]);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach((item) => {
        settingsObj[item.key] = item.value;
      });

      setSettings(settingsObj);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || "",
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: update.value })
          .eq("key", update.key);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Payment settings saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-eka-pearl">Loading payment settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Payment Settings</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Paystack Settings */}
        <Card className="bg-eka-emerald-depth/20 backdrop-blur-sm border-eka-jade-luxury/30">
          <CardHeader>
            <CardTitle className="text-eka-pearl">Paystack Keys</CardTitle>
            <CardDescription className="text-eka-champagne">
              Configure Paystack for NGN and USD payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paystack_ngn" className="text-eka-pearl">
                Paystack Public Key (NGN)
              </Label>
              <Input
                id="paystack_ngn"
                type="text"
                placeholder="pk_live_..."
                value={settings.paystack_public_key_ngn}
                onChange={(e) =>
                  setSettings({ ...settings, paystack_public_key_ngn: e.target.value })
                }
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>
            <div>
              <Label htmlFor="paystack_usd" className="text-eka-pearl">
                Paystack Public Key (USD)
              </Label>
              <Input
                id="paystack_usd"
                type="text"
                placeholder="pk_live_..."
                value={settings.paystack_public_key_usd}
                onChange={(e) =>
                  setSettings({ ...settings, paystack_public_key_usd: e.target.value })
                }
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stripe Settings */}
        <Card className="bg-eka-emerald-depth/20 backdrop-blur-sm border-eka-jade-luxury/30">
          <CardHeader>
            <CardTitle className="text-eka-pearl">Stripe Keys</CardTitle>
            <CardDescription className="text-eka-champagne">
              Configure Stripe for GBP and USD payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stripe_gbp" className="text-eka-pearl">
                Stripe Public Key (GBP)
              </Label>
              <Input
                id="stripe_gbp"
                type="text"
                placeholder="pk_live_..."
                value={settings.stripe_public_key_gbp}
                onChange={(e) =>
                  setSettings({ ...settings, stripe_public_key_gbp: e.target.value })
                }
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>
            <div>
              <Label htmlFor="stripe_usd" className="text-eka-pearl">
                Stripe Public Key (USD)
              </Label>
              <Input
                id="stripe_usd"
                type="text"
                placeholder="pk_live_..."
                value={settings.stripe_public_key_usd}
                onChange={(e) =>
                  setSettings({ ...settings, stripe_public_key_usd: e.target.value })
                }
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? "Saving..." : "Save Payment Settings"}
      </Button>
    </div>
  );
};
