import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Bike, Zap } from "lucide-react";
import { livreurs, type Livreur } from "@/lib/mock/data";

export function AssignerLivreurDialog({
  open,
  onOpenChange,
  onAssign,
  numero,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAssign: (l: Livreur) => void;
  numero?: string;
}) {
  const [q, setQ] = useState("");
  const eligible = useMemo(
    () => livreurs.filter((l) => l.actif && l.statut !== "Hors ligne"),
    []
  );
  const filtered = eligible.filter(
    (l) => l.nom.toLowerCase().includes(q.toLowerCase()) || l.zone.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Bike className="h-5 w-5 text-primary" />
            Assigner un livreur {numero ? <span className="font-mono text-sm text-primary/80">{numero}</span> : null}
          </DialogTitle>
          <DialogDescription>Choisissez un livreur disponible dans votre équipe.</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou zone…"
            className="pl-9 bg-secondary/60 border-0"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-6">Aucun livreur ne correspond.</div>
          )}
          {filtered.map((l) => {
            const busy = l.statut === "En livraison";
            return (
              <div
                key={l.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/70 border border-border/40 transition"
              >
                <div className="relative">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-display text-sm">
                    {l.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  {l.statut === "En ligne" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-chart-5 border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.nom}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-accent">
                      <Star className="h-3 w-3 fill-current" />
                      {l.note.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {l.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bike className="h-3 w-3" />
                      {l.vehicule}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    busy
                      ? "border-accent/40 text-accent"
                      : "border-chart-5/40 text-chart-5"
                  }
                >
                  {busy ? `Occupé · ${l.livraisonsAujourdhui} courses` : "Disponible"}
                </Badge>
                <Button
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground"
                  onClick={() => {
                    onAssign(l);
                    onOpenChange(false);
                  }}
                >
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Assigner
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
