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
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, MessageSquareWarning, Wallet, Award, TicketPercent, Bike, Store, ShieldCheck, Star, BellRing, FileBarChart, Settings2,
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
      { title: "Paramètres", url: "/parametres", icon: Settings2 },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="h-10 w-10 rounded-xl bg-cream flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <img src={LOGO_URL} alt="Ladid" className="h-8 w-8" onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.style.display = "none";
              t.parentElement!.innerHTML = '<span class="font-display text-primary-foreground text-xl">L</span>';
              (t.parentElement as HTMLElement).style.background = "var(--primary)";
            }} />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="font-display text-lg leading-none text-sidebar-foreground">Ladid Food</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Backoffice</div>
          </div>
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
