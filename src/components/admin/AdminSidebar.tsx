import { FileText, Package, ShoppingCart, FolderOpen, Users, Layers } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Applications", value: "applications", icon: FileText },
  { title: "Orders", value: "orders", icon: ShoppingCart },
  { title: "Products", value: "products", icon: Package },
  { title: "Categories", value: "categories", icon: Layers },
  { title: "Collections", value: "collections", icon: FolderOpen },
  { title: "Users", value: "users", icon: Users },
];

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-eka-jade-luxury/30">
      <SidebarContent className="bg-eka-emerald-depth/40 backdrop-blur-xl">
        <SidebarGroup>
          <SidebarGroupLabel className="text-eka-champagne">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.value)}
                    isActive={activeView === item.value}
                    className="text-eka-pearl hover:bg-eka-jade-luxury/20 data-[active=true]:bg-eka-golden data-[active=true]:text-eka-emerald-depth"
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
