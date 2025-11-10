import { FileText, Package, ShoppingCart, FolderOpen, Users, Layers, Settings, CreditCard } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
const items = [{
  title: "Applications",
  value: "applications",
  icon: FileText
}, {
  title: "Orders",
  value: "orders",
  icon: ShoppingCart
}, {
  title: "Products",
  value: "products",
  icon: Package
}, {
  title: "Categories",
  value: "categories",
  icon: Layers
}, {
  title: "Collections",
  value: "collections",
  icon: FolderOpen
}, {
  title: "Users",
  value: "users",
  icon: Users
}, {
  title: "Payment Settings",
  value: "payments",
  icon: CreditCard
}, {
  title: "Site Settings",
  value: "settings",
  icon: Settings
}];
interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}
export function AdminSidebar({
  activeView,
  onViewChange
}: AdminSidebarProps) {
  const {
    open
  } = useSidebar();
  return <Sidebar className="border-eka-jade-luxury/30 bg-eka-emerald-depth/95 backdrop-blur-xl">
      <SidebarContent className="bg-transparent">
        <SidebarGroup className="mx-0 py-[75px] px-[5px]">
          <SidebarGroupLabel className="text-eka-champagne font-semibold text-sm">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.value)} 
                    isActive={activeView === item.value} 
                    className="text-eka-pearl hover:bg-eka-jade-luxury/20 data-[active=true]:bg-eka-golden data-[active=true]:text-eka-emerald-depth font-medium"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {open && <span className="ml-2">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}