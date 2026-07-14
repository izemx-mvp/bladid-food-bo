import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { livreurs, commandes, formatMAD, formatDate } from "@/lib/mock/data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ArrowLeft, Bike, Phone, MapPin, Star, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/livreurs/$id")({ component: Detail });

function Detail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const l = livreurs.find((x) => x.id === id);
  if (!l) return <div className="p-8">Introuvable</div>;
  const courses = commandes.filter((c) => c.livreur === l.nom).slice(0, 8);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/livreurs" })} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" />Retour</Button>
      <PageHeader title={l.nom} description={`${l.vehicule} · ${l.zone}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass p-6 space-y-3">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-display text-xl">
              {l.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-1 text-accent"><Star className="h-4 w-4 fill-current" /><span className="font-semibold">{l.note.toFixed(1)}</span></div>
              <Badge className="mt-1 bg-chart-5/20 text-chart-5 border border-chart-5/30">{l.statut}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-primary" />{l.telephone}</div>
          <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" />{l.zone}</div>
          <div className="flex items-center gap-2 text-sm"><Bike className="h-4 w-4 text-primary" />{l.vehicule} · {l.immatriculation}</div>
        </Card>

        <Card className="glass p-6">
          <div className="text-xs text-muted-foreground uppercase mb-2">Performance du jour</div>
          <div className="text-4xl font-display text-primary">{l.livraisonsAujourdhui}</div>
          <div className="text-xs text-muted-foreground">livraisons effectuées</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gains jour</span><span className="font-semibold text-primary">{formatMAD(l.gainsJour)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gains mois</span><span className="font-semibold">{formatMAD(l.gainsMois)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Temps moyen</span><span className="font-semibold">18 min</span></div>
          </div>
        </Card>

        <Card className="glass p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3"><Zap className="h-4 w-4 text-primary" /><h3 className="font-display text-lg">Position en temps réel</h3></div>
            <div className="h-40 rounded-xl bg-secondary/40 border border-border/50 flex items-center justify-center text-sm text-muted-foreground">
              🗺️ Kénitra Centre, Av. Mohammed V
            </div>
            <div className="text-xs text-muted-foreground mt-2">Dernière position : il y a 2 min</div>
          </div>
        </Card>
      </div>

      <Card className="glass p-6 mt-4">
        <h3 className="font-display text-lg mb-4">Courses récentes</h3>
        <div className="space-y-2">
          {courses.length === 0 ? <div className="text-sm text-muted-foreground">Aucune course récente</div> :
            courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                <div>
                  <div className="font-mono text-xs text-primary">{c.numero}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(c.date)} · {c.adresse.split(",")[1]}</div>
                </div>
                <Badge variant="outline">{c.statut}</Badge>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
