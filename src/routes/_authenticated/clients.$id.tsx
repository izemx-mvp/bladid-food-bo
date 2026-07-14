import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { clients, commandes, formatMAD, formatDate } from "@/lib/mock/data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ArrowLeft, Mail, Phone, MapPin, Award, ShoppingBag, Wallet, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/clients/$id")({
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const initial = clients.find((c) => c.id === id);
  const [c, setC] = useState(initial);
  if (!c) return <div className="p-8">Introuvable</div>;

  const historique = commandes.slice(0, 5);

  function adjust(delta: number) {
    setC((prev) => prev ? { ...prev, points: Math.max(0, prev.points + delta) } : prev);
    toast.success(`${delta > 0 ? "+" : ""}${delta} points ajustés`);
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/clients" })} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" />Retour</Button>
      <PageHeader title={c.nom} description={`Client ${c.niveau} · Inscrit ${formatDate(c.inscription)}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass p-6 space-y-3">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground text-xl font-display">
              {c.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <Badge className="bg-primary/20 text-primary border border-primary/30"><Award className="h-3 w-3 mr-1" />{c.niveau}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-primary" />{c.email}</div>
          <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-primary" />{c.telephone}</div>
          {c.adresses.map((a, i) => <div key={i} className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 text-primary mt-0.5" />{a}</div>)}
        </Card>

        <Card className="glass p-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Points fidélité</div>
          <div className="text-5xl font-display font-semibold text-primary mb-4">{c.points.toLocaleString("fr-FR")}</div>
          <div className="flex gap-2 mb-3">
            <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => adjust(-50)}><Minus className="h-3 w-3 mr-1" />50</Button>
            <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => adjust(50)}><Plus className="h-3 w-3 mr-1" />50</Button>
            <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => adjust(100)}><Plus className="h-3 w-3 mr-1" />100</Button>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-teal-glow" style={{ width: `${Math.min(100, (c.points / 3000) * 100)}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-2">Prochain palier : Platine à 3 000 pts</div>
        </Card>

        <Card className="glass p-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Récapitulatif</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><ShoppingBag className="h-3 w-3" />Commandes</div>
              <div className="text-2xl font-display">{c.commandes}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Wallet className="h-3 w-3" />Dépensé</div>
              <div className="text-2xl font-display text-primary">{formatMAD(c.totalDepense)}</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground">Panier moyen</div>
          <div className="text-lg font-display">{formatMAD(Math.round(c.totalDepense / Math.max(1, c.commandes)))}</div>
        </Card>
      </div>

      <Card className="glass p-6 mt-4">
        <h3 className="font-display text-lg mb-4">Historique récent</h3>
        <div className="space-y-2">
          {historique.map((h) => (
            <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
              <div>
                <div className="font-medium">{h.numero}</div>
                <div className="text-xs text-muted-foreground">{formatDate(h.date)} · {h.canal}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatMAD(h.total)}</div>
                <Badge variant="outline" className="text-[10px]">{h.statut}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
