import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  customer_email: string | null;
  customer_name: string | null;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_tier: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isViewingOrder, setIsViewingOrder] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
    setIsViewingOrder(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
      
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated':
        return 'bg-gray-500/20 text-gray-400';
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Orders Management</h2>
        <div className="flex items-center gap-2 text-eka-champagne">
          <Package className="w-5 h-5" />
          <span>{orders.length} Total Orders</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Package className="w-16 h-16 text-eka-jade-luxury/40" />
            <h3 className="text-xl font-heading text-eka-pearl">No orders yet</h3>
            <p className="text-eka-champagne">Orders will appear here when customers place them</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-eka-jade-luxury/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-eka-pearl">Order ID</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Customer</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Total</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Status</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Date</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eka-jade-luxury/20">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-eka-jade-luxury/10">
                      <td className="px-4 py-3 text-eka-champagne font-mono text-sm">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-eka-pearl">{order.customer_name || 'N/A'}</span>
                          <span className="text-xs text-eka-champagne">{order.customer_email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-eka-golden font-semibold">
                        ₦{order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className={`w-32 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="initiated">Initiated</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-eka-champagne">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          onClick={() => handleViewOrder(order)}
                          size="sm"
                          variant="outline"
                          className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-mono text-eka-champagne mb-1">
                      {order.id.substring(0, 8)}...
                    </h3>
                    <p className="text-base font-heading text-eka-pearl">{order.customer_name || 'N/A'}</p>
                    <p className="text-xs text-eka-champagne">{order.customer_email || 'N/A'}</p>
                  </div>
                  <Button
                    onClick={() => handleViewOrder(order)}
                    size="sm"
                    variant="outline"
                    className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-eka-champagne">Total:</span>
                    <span className="text-eka-golden font-semibold">₦{order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-eka-champagne">Status:</span>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className={`w-32 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="initiated">Initiated</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-eka-champagne">Date:</span>
                    <span className="text-eka-pearl">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={isViewingOrder} onOpenChange={setIsViewingOrder}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl bg-eka-emerald-depth border-eka-jade-luxury/30 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-eka-pearl">
              Order Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-eka-champagne">Order ID</label>
                  <p className="text-eka-pearl font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="text-sm text-eka-champagne">Status</label>
                  <p className={`inline-block px-3 py-1 rounded text-sm ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-eka-champagne">Customer Name</label>
                  <p className="text-eka-pearl">{selectedOrder.customer_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-eka-champagne">Customer Email</label>
                  <p className="text-eka-pearl">{selectedOrder.customer_email || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-eka-champagne">Shipping Address</label>
                  <p className="text-eka-pearl">{selectedOrder.shipping_address || 'N/A'}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <label className="text-sm text-eka-champagne">Notes</label>
                    <p className="text-eka-pearl">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-heading text-eka-pearl mb-3">Order Items</h3>
                <div className="border border-eka-jade-luxury/30 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-eka-jade-luxury/20">
                      <tr>
                        <th className="px-4 py-2 text-left text-eka-pearl">Product</th>
                        <th className="px-4 py-2 text-left text-eka-pearl">Tier</th>
                        <th className="px-4 py-2 text-right text-eka-pearl">Unit Price</th>
                        <th className="px-4 py-2 text-right text-eka-pearl">Quantity</th>
                        <th className="px-4 py-2 text-right text-eka-pearl">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-eka-jade-luxury/20">
                      {orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-eka-pearl">{item.product_name}</td>
                          <td className="px-4 py-3 text-eka-champagne">Tier {item.product_tier}</td>
                          <td className="px-4 py-3 text-right text-eka-champagne">
                            ₦{item.unit_price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-eka-champagne">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-eka-golden font-semibold">
                            ₦{item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <p className="text-eka-champagne">Total Amount</p>
                    <p className="text-3xl font-heading text-eka-golden">
                      ₦{selectedOrder.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};