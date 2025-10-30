
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsManager } from "./ProductsManager";
import { CategoriesManager } from "./CategoriesManager";
import { CollectionsManager } from "./CollectionsManager";
import { UsersManager } from "./UsersManager";
import { OrdersManager } from "./OrdersManager";
import ClientApplicationsManager from "./ClientApplicationsManager";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdminDashboard = () => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin dashboard",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-eka-pearl mb-2">Admin Dashboard</h1>
          <p className="text-base sm:text-lg lg:text-xl text-eka-champagne">Manage your Eka store data</p>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="bg-gradient-glass backdrop-blur-xl rounded-3xl border border-eka-jade-luxury/30 p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-eka-emerald-depth/20 h-auto gap-1">
            <TabsTrigger value="applications" className="text-xs sm:text-sm text-eka-pearl data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              Applications
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm text-eka-pearl data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm text-eka-pearl data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm text-eka-pearl data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              Categories
            </TabsTrigger>
            <TabsTrigger value="collections" className="text-xs sm:text-sm text-eka-pearl data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              Collections
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm text-eka-pearl data-[state=active]:bg-eka-golden data-[state=active]:text-eka-emerald-depth">
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <ClientApplicationsManager />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <CollectionsManager />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
