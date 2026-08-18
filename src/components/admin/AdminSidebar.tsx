import { FileText, Package, ShoppingCart, FolderOpen, Users, Layers, Settings, CreditCard, LayoutDashboard } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
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

const workspaceItems = items.slice(0, 6);
const configurationItems = items.slice(6);

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}
export function AdminSidebar({
  activeView,
  onViewChange
}: AdminSidebarProps) {
  const {
    open,
    isMobile,
    setOpenMobile
  } = useSidebar();
  const renderItems = (groupItems: typeof items) => groupItems.map(item => <SidebarMenuItem key={item.value}>
    <SidebarMenuButton
      onClick={() => {
        onViewChange(item.value);
        if (isMobile) setOpenMobile(false);
      }}
      isActive={activeView === item.value}
      size="lg"
      tooltip={item.title}
      aria-current={activeView === item.value ? "page" : undefined}
      className="min-h-11 text-eka-champagne hover:bg-eka-jade-luxury/70 hover:text-eka-pearl data-[active=true]:bg-eka-golden data-[active=true]:font-semibold data-[active=true]:text-eka-emerald-depth"
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {(open || isMobile) && <span className="ml-2">{item.title}</span>}
    </SidebarMenuButton>
  </SidebarMenuItem>);

  return <Sidebar className="border-eka-jade-luxury/50 bg-eka-deep-forest/98 shadow-xl backdrop-blur-xl">
      <SidebarHeader className="border-b border-eka-jade-luxury/50 px-4 pb-5 pt-6">
        <div className="flex items-center gap-3 text-eka-pearl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-eka-golden text-eka-emerald-depth shadow-md">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          {(open || isMobile) && <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-wide">Admin workspace</p>
            <p className="mt-0.5 text-xs text-eka-champagne">Manage Eka Window Display</p>
          </div>}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent">
        <SidebarGroup className="mx-0 px-3 py-5">
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-widest text-eka-champagne/80">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(workspaceItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mx-0 px-3 py-1">
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-widest text-eka-champagne/80">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(configurationItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}
