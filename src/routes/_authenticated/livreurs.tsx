import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Bike, Star, MapPin, Phone, Eye, Power } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { livreurs as seed, formatMAD, type Livreur } from "@/lib/mock/data";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/livreurs")({ component: Page });

const statutColor: Record<Livreur["statut"], string> = {
  "En ligne": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "En livraison": "bg-primary/20 text-primary border-primary/30",
  "En pause": "bg-accent/20 text-accent border-accent/30",
  "Hors ligne": "bg-muted text-muted-foreground border-border",
};

function Page() {
  const [data, setData] = useState(seed);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? data : data.filter((l) => l.statut === filter);

  function toggle(l: Livreur) {
    setData((d) => d.map((x) => x.id === l.id ? { ...x, actif: !x.actif } : x));
    toast.success(`${l.nom} ${!l.actif ? "réactivé" : "désactivé"}`);
  }

  return (
    <div>
      <PageHeader
        icon={Bike}
        title="Livreurs"
        description={`${data.length} livreurs · ${data.filter((l) => l.statut === "En ligne").length} en ligne · ${data.filter((l) => l.statut === "En livraison").length} en course`}
      />

      <Tabs value={filter} onValueChange={setFilter} className="mb-4">
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="En ligne">En ligne</TabsTrigger>
          <TabsTrigger value="En livraison">En livraison</TabsTrigger>
          <TabsTrigger value="En pause">En pause</TabsTrigger>
          <TabsTrigger value="Hors ligne">Hors ligne</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((l) => (
          <Card key={l.id} className="glass p-5 group hover:glow transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-display text-sm">
                    {l.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  {l.statut === "En ligne" && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-chart-5 border-2 border-card" />}
                </div>
                <div>
                  <div className="font-medium">{l.nom}</div>
                  <div className="flex items-center gap-1 text-xs text-accent"><Star className="h-3 w-3 fill-current" />{l.note.toFixed(1)}</div>
                </div>
              </div>
              <Badge className={statutColor[l.statut] + " border"}>{l.statut}</Badge>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{l.telephone}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{l.zone}</div>
              <div className="flex items-center gap-2"><Bike className="h-3 w-3" />{l.vehicule} · {l.immatriculation}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Livraisons</div>
                <div className="text-sm font-semibold">{l.livraisonsAujourdhui}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Jour</div>
                <div className="text-sm font-semibold text-primary">{formatMAD(l.gainsJour)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Mois</div>
                <div className="text-sm font-semibold">{formatMAD(l.gainsMois)}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-full"><Link to="/livreurs/$id" params={{ id: l.id }}><Eye className="h-3 w-3 mr-1" />Voir</Link></Button>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => toggle(l)}><Power className="h-3 w-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
