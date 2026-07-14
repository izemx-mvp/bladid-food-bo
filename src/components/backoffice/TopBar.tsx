import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogOut, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession, signOut } from "@/lib/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const labels: Record<string, string> = {
  dashboard: "Tableau de bord",
  commandes: "Commandes",
  menu: "Menu & Plats",
  clients: "Clients",
  reclamations: "Réclamations",
  remboursements: "Remboursements",
  fidelite: "Fidélité",
  promotions: "Promotions",
  livreurs: "Livreurs",
  "points-de-vente": "Points de vente",
  utilisateurs: "Utilisateurs",
  avis: "Avis clients",
  notifications: "Notifications",
  rapports: "Rapports",
  parametres: "Paramètres",
};

export function TopBar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const session = getSession();
  const segments = pathname.split("/").filter(Boolean);

  function logout() {
    signOut();
    toast.success("À bientôt !");
    navigate({ to: "/login" });
  }

  return (
    <header className="h-16 border-b border-border bg-background/60 backdrop-blur-xl sticky top-0 z-20 flex items-center gap-4 px-4">
      <SidebarTrigger className="text-muted-foreground" />

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/dashboard">Ladid Food</Link></BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((seg, i) => {
            const isLast = i === segments.length - 1;
            const label = labels[seg] ?? seg;
            return (
              <span key={i} className="flex items-center gap-2">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? <BreadcrumbPage>{label}</BreadcrumbPage> : <BreadcrumbLink>{label}</BreadcrumbLink>}
                </BreadcrumbItem>
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex-1" />

      <div className="hidden lg:block relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher commande, client…  ⌘K" className="pl-9 w-72 h-9 rounded-full bg-secondary border-0" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="relative rounded-full">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px]">3</Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start py-3">
            <div className="text-sm font-medium">Nouvelle réclamation urgente</div>
            <div className="text-xs text-muted-foreground">Commande #LDF-2618 · il y a 5 min</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start py-3">
            <div className="text-sm font-medium">Livreur Youssef · en ligne</div>
            <div className="text-xs text-muted-foreground">Zone Kénitra Centre · il y a 12 min</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start py-3">
            <div className="text-sm font-medium">3 remboursements en attente</div>
            <div className="text-xs text-muted-foreground">À traiter aujourd'hui</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full h-10 pl-1 pr-3 gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {session?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium leading-none">{session?.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{session?.role}</div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><User className="h-4 w-4 mr-2" />Profil</DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/parametres"><Settings2 className="h-4 w-4 mr-2" /> Paramètres</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
