import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Award, Gift, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { paliersFidelite, clients, formatMAD } from "@/lib/mock/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/fidelite")({ component: Page });

function Page() {
  const totalPoints = clients.reduce((s, c) => s + c.points, 0);
  const platine = clients.filter((c) => c.niveau === "Platine").length;

  return (
    <div>
      <PageHeader
        icon={Award}
        title="Programme de fidélité"
        description="Récompensez vos clients pour chaque commande passée."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="glass p-5">
          <div className="text-xs text-muted-foreground uppercase mb-1">Points en circulation</div>
          <div className="text-3xl font-display text-primary">{totalPoints.toLocaleString("fr-FR")}</div>
        </Card>
        <Card className="glass p-5">
          <div className="text-xs text-muted-foreground uppercase mb-1">Membres Platine</div>
          <div className="text-3xl font-display">{platine}</div>
        </Card>
        <Card className="glass p-5">
          <div className="text-xs text-muted-foreground uppercase mb-1">Récompenses distribuées</div>
          <div className="text-3xl font-display">{formatMAD(4820)}</div>
        </Card>
      </div>

      <Card className="glass p-6 mb-6">
        <h3 className="font-display text-xl mb-1">Règles d'attribution</h3>
        <p className="text-sm text-muted-foreground mb-4">Personnalisez comment vos clients gagnent leurs points.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Points par 10 MAD dépensés</Label>
            <Input defaultValue="1" type="number" />
          </div>
          <div>
            <Label>Bonus inscription (pts)</Label>
            <Input defaultValue="100" type="number" />
          </div>
          <div>
            <Label>Bonus anniversaire (pts)</Label>
            <Input defaultValue="200" type="number" />
          </div>
        </div>
        <Button className="mt-4 rounded-full bg-primary text-primary-foreground" onClick={() => toast.success("Règles enregistrées")}>Enregistrer</Button>
      </Card>

      <h2 className="font-display text-2xl mb-4">Paliers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paliersFidelite.map((p, i) => (
          <Card key={p.niveau} className={`glass p-6 relative overflow-hidden ${i === 3 ? "glow" : ""}`}>
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <Badge className="bg-primary/20 text-primary border border-primary/30 mb-3">{p.niveau}</Badge>
              <div className="text-3xl font-display text-primary mb-1">{p.seuil}</div>
              <div className="text-xs text-muted-foreground mb-4">points requis</div>
              <ul className="space-y-2 text-sm">
                {p.avantages.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="font-display text-xl">Récompenses disponibles</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { pts: 200, gift: "Thé à la menthe offert" },
            { pts: 500, gift: "Dessert marocain offert" },
            { pts: 1000, gift: "Livraison offerte à vie" },
            { pts: 1500, gift: "Tajine offert" },
            { pts: 2500, gift: "Pack famille -50%" },
            { pts: 5000, gift: "Dîner chef à domicile" },
          ].map((r) => (
            <div key={r.pts} className="p-4 rounded-xl bg-secondary/40 border border-border/50 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{r.gift}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.pts} points</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Récompense activée")}>Activer</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
