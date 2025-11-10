import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { detectUserCurrency, formatCurrency, getProductPrice, type Currency } from "@/utils/currency";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface CheckoutItem {
  product: any;
  quantity: number;
  selectedVariant?: {
    id: string;
    name: string;
    type: string;
    price_adjustment: number;
  };
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [paymentKeys, setPaymentKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    initializeCheckout();
    loadPaystackScript();
    
    // Get items from location state
    if (location.state?.items) {
      setItems(location.state.items);
    }
  }, []);

  const initializeCheckout = async () => {
    await checkUser();
    const detectedCurrency = await detectUserCurrency();
    setCurrency(detectedCurrency);
    await fetchPaymentKeys();
  };

  const fetchPaymentKeys = async () => {
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

      const keys: Record<string, string> = {};
      data?.forEach((item) => {
        keys[item.key] = item.value;
      });
      setPaymentKeys(keys);
    } catch (error) {
      console.error("Error fetching payment keys:", error);
    }
  };

  const loadPaystackScript = () => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  };

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

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const basePrice = getProductPrice(item.product, currency) || 0;
      // Apply variant price adjustment if selected (percentage-based)
      const variantMultiplier = item.selectedVariant 
        ? 1 + (item.selectedVariant.price_adjustment / 100)
        : 1;
      const finalPrice = basePrice * variantMultiplier;
      return sum + finalPrice * item.quantity;
    }, 0);
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;

    const total = calculateTotal();

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending",
          customer_email: email,
          customer_name: name,
          shipping_address: address,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Determine payment provider and key based on currency
      const usePaystack = currency === "NGN";
      const paymentKey = usePaystack
        ? currency === "NGN"
          ? paymentKeys.paystack_public_key_ngn
          : paymentKeys.paystack_public_key_usd
        : currency === "GBP"
        ? paymentKeys.stripe_public_key_gbp
        : paymentKeys.stripe_public_key_usd;

      if (!paymentKey) {
        throw new Error("Payment configuration not set up for this currency");
      }

      if (usePaystack) {
        // Initialize Paystack payment
        const handler = window.PaystackPop.setup({
          key: paymentKey,
          email: email,
          amount: total * 100, // Amount in kobo (multiply by 100)
          currency: currency,
          ref: order.id,
          metadata: {
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: name,
              },
            ],
          },
          callback: async (response: any) => {
            // Update order status
            await supabase
              .from("orders")
              .update({ status: "completed" })
              .eq("id", order.id);

            toast({
              title: "Payment Successful",
              description: "Your order has been placed successfully!",
            });

            navigate("/orders");
          },
          onClose: () => {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive",
            });
            setProcessing(false);
          },
        });

        handler.openIframe();
      } else {
        // TODO: Implement Stripe payment for GBP
        toast({
          title: "Coming Soon",
          description: "Stripe payment integration will be available soon.",
        });
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
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

      <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <Button 
          onClick={() => navigate(-1)}
          className="mb-6 bg-eka-jade-luxury/20 hover:bg-eka-jade-luxury/30 text-eka-pearl border border-eka-jade-luxury/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
            <CardHeader>
              <CardTitle className="text-eka-pearl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => {
                  const basePrice = getProductPrice(item.product, currency) || 0;
                  const variantMultiplier = item.selectedVariant 
                    ? 1 + (item.selectedVariant.price_adjustment / 100)
                    : 1;
                  const finalPrice = basePrice * variantMultiplier;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-eka-champagne">
                        <span>
                          {item.product.name} x {item.quantity}
                          {item.selectedVariant && (
                            <span className="text-xs text-eka-champagne/70 block">
                              {item.selectedVariant.type}: {item.selectedVariant.name}
                            </span>
                          )}
                        </span>
                        <span>{formatCurrency(finalPrice * item.quantity, currency)}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-eka-jade-luxury/30 pt-4">
                  <div className="flex justify-between text-eka-pearl font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal(), currency)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
            <CardHeader>
              <CardTitle className="text-eka-pearl">Checkout</CardTitle>
              <CardDescription className="text-eka-champagne">
                Complete your purchase ({currency})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-eka-pearl">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profile?.full_name || ""}
                    required
                    className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-eka-pearl">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={profile?.email || ""}
                    required
                    className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-eka-pearl">Delivery Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    defaultValue={profile?.delivery_address || ""}
                    required
                    rows={3}
                    className="bg-eka-emerald-depth/60 border-eka-jade-luxury/30 text-eka-pearl"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={processing || items.length === 0}
                  className="w-full bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
                >
                  {processing ? "Processing..." : `Pay ${formatCurrency(calculateTotal(), currency)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <EkaFooter />
    </div>
  );
}
