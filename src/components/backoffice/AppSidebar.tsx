import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, MessageSquareWarning, Wallet, Award, TicketPercent, Bike, Store, ShieldCheck, Star, BellRing, FileBarChart,
} from "lucide-react";
import { LOGO_URL } from "@/lib/mock/data";

const groups = [
  {
    label: "Pilotage",
    items: [
      { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
      { title: "Commandes", url: "/commandes", icon: ShoppingBag },
      { title: "Menu & Plats", url: "/menu", icon: UtensilsCrossed },
    ],
  },
  {
    label: "Relation client",
    items: [
      { title: "Clients", url: "/clients", icon: Users },
      { title: "Réclamations", url: "/reclamations", icon: MessageSquareWarning },
      { title: "Remboursements", url: "/remboursements", icon: Wallet },
      { title: "Avis clients", url: "/avis", icon: Star },
    ],
  },
  {
    label: "Marketing",
    items: [
      { title: "Fidélité", url: "/fidelite", icon: Award },
      { title: "Promotions", url: "/promotions", icon: TicketPercent },
      { title: "Notifications", url: "/notifications", icon: BellRing },
    ],
  },
  {
    label: "Opérations",
    items: [
      { title: "Livreurs", url: "/livreurs", icon: Bike },
      { title: "Points de vente", url: "/points-de-vente", icon: Store },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Utilisateurs", url: "/utilisateurs", icon: ShieldCheck },
      { title: "Rapports", url: "/rapports", icon: FileBarChart },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-center px-2 py-4">
          <img
            src={LOGO_URL}
            alt="Ladid Food"
            className="h-12 w-auto group-data-[collapsible=icon]:h-8"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:shadow-[inset_2px_0_0_0_var(--primary)]"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="text-[10px] text-muted-foreground px-2 group-data-[collapsible=icon]:hidden">
          v2.4 · Kénitra · 🇲🇦
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
