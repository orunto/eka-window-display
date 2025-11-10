
import { useState } from "react";
import { ProductsManager } from "./ProductsManager";
import { CategoriesManager } from "./CategoriesManager";
import { CollectionsManager } from "./CollectionsManager";
import { UsersManager } from "./UsersManager";
import { OrdersManager } from "./OrdersManager";
import ClientApplicationsManager from "./ClientApplicationsManager";
import { SiteSettingsManager } from "./SiteSettingsManager";
import { PaymentSettingsManager } from "./PaymentSettingsManager";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("applications");

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

  const renderContent = () => {
    switch (activeView) {
      case "applications":
        return <ClientApplicationsManager />;
      case "orders":
        return <OrdersManager />;
      case "products":
        return <ProductsManager />;
      case "categories":
        return <CategoriesManager />;
      case "collections":
        return <CollectionsManager />;
      case "users":
        return <UsersManager />;
      case "settings":
        return <SiteSettingsManager />;
      case "payments":
        return <PaymentSettingsManager />;
      default:
        return <ClientApplicationsManager />;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-eka-jade-luxury/30 bg-gradient-glass backdrop-blur-xl px-4 sm:px-6">
            <SidebarTrigger className="text-eka-pearl hover:text-eka-golden">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading text-eka-pearl">Admin Dashboard</h1>
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="bg-gradient-glass backdrop-blur-xl rounded-3xl border border-eka-jade-luxury/30 p-4 sm:p-6 lg:p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
