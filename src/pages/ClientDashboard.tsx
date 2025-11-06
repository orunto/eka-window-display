import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, User, MapPin } from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  delivery_address: string | null;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string | null;
  shipping_address: string | null;
}

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
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
    await fetchOrders(session.user.id);
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

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
          delivery_address: formData.get("delivery_address") as string,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "processing":
        return "text-yellow-400";
      case "pending":
        return "text-eka-champagne";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-eka-pearl";
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

      <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28 relative z-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-heading text-eka-pearl mb-2">My Dashboard</h1>
          <p className="text-eka-champagne">Manage your profile and view order history</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-eka-emerald-depth/40 mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="delivery" className="data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              <MapPin className="h-4 w-4 mr-2" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
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
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
              <CardHeader>
                <CardTitle className="text-eka-pearl">Order History</CardTitle>
                <CardDescription className="text-eka-champagne">
                  View your past and current orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-eka-champagne/40 mb-4" />
                    <p className="text-eka-champagne text-lg">No orders yet</p>
                    <p className="text-eka-champagne/60 mt-2">Start shopping to see your orders here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-eka-jade-luxury/30 rounded-lg p-4 bg-eka-emerald-depth/20"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-eka-pearl font-semibold">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-eka-champagne text-sm mt-1">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="flex flex-col md:items-end gap-2">
                            <p className="text-eka-pearl font-semibold">
                              {formatCurrency(Number(order.total_amount))}
                            </p>
                            <p className={`text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </p>
                          </div>
                        </div>
                        {order.shipping_address && (
                          <div className="mt-3 pt-3 border-t border-eka-jade-luxury/20">
                            <p className="text-eka-champagne text-sm">
                              <span className="font-semibold">Shipping to:</span> {order.shipping_address}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery">
            <Card className="bg-eka-emerald-depth/40 border-eka-jade-luxury/30">
              <CardHeader>
                <CardTitle className="text-eka-pearl">Delivery Address</CardTitle>
                <CardDescription className="text-eka-champagne">
                  Update your default delivery address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>

      <EkaFooter />
    </div>
  );
}