import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string | null;
  shipping_address: string | null;
}

export default function Orders() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    await fetchOrders(session.user.id);
    setLoading(false);
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

      <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
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
      </main>

      <EkaFooter />
    </div>
  );
}
