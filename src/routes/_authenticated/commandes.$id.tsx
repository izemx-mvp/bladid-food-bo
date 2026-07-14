import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { commandes, formatMAD, formatDate } from "@/lib/mock/data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ArrowLeft, MapPin, Phone, User, Wallet, Bike, ChefHat, PackageCheck, CheckCircle2, ClipboardList, XCircle, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AssignerLivreurDialog } from "@/components/backoffice/AssignerLivreurDialog";

export const Route = createFileRoute("/_authenticated/commandes/$id")({
  component: Detail,
  notFoundComponent: () => <div className="p-8 text-center text-muted-foreground">Commande introuvable</div>,
});

const timeline = [
  { key: "Reçue", icon: ClipboardList, label: "Commande reçue" },
  { key: "En préparation", icon: ChefHat, label: "En préparation" },
  { key: "Prête", icon: PackageCheck, label: "Prête à livrer" },
  { key: "En livraison", icon: Bike, label: "En livraison" },
  { key: "Livrée", icon: CheckCircle2, label: "Livrée" },
];

function Detail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const initial = commandes.find((x) => x.id === id);
  const [c, setC] = useState(initial);
  const [assignOpen, setAssignOpen] = useState(false);
  if (!c) return <div className="p-8">Introuvable</div>;
  const commande = c;

  const currentStep = timeline.findIndex((t) => t.key === commande.statut);

  function printTicket() {
    const lines = commande.items.map((it) => `${it.qte} × ${it.plat} — ${formatMAD(it.qte * it.prix)}`).join("\n");
    const ticket = `LADID FOOD\n${commande.numero}\n${formatDate(commande.date)}\n\nClient: ${commande.client}\nTel: ${commande.telephone}\nAdresse: ${commande.adresse}\n\n${lines}\n\nTOTAL: ${formatMAD(commande.total)}\nPaiement: ${commande.paiement}`;
    const blob = new Blob([ticket], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${commande.numero.replace("#", "")}-ticket.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Ticket téléchargé", { description: commande.numero });
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/commandes" })} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" />Retour aux commandes</Button>

      <PageHeader
        title={`Commande ${c.numero}`}
        description={`${c.canal} · ${formatDate(c.date)}`}
        actions={
          <>
            <Button variant="outline" className="rounded-full" onClick={printTicket}><Printer className="h-4 w-4 mr-1" />Imprimer</Button>
            <Button className="rounded-full bg-destructive text-destructive-foreground" onClick={() => { setC((p) => p ? { ...p, statut: "Annulée" } : p); toast.warning("Commande annulée"); }}><XCircle className="h-4 w-4 mr-1" />Annuler</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass p-6 lg:col-span-2">
          <h3 className="font-display text-lg mb-4">Suivi de la commande</h3>
          <div className="relative">
            <div className="absolute left-5 top-6 bottom-6 w-px bg-border" />
            <div className="space-y-4">
              {timeline.map((t, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={t.key} className="flex items-center gap-4 relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center relative z-10 border-2 ${done ? "bg-primary border-primary text-primary-foreground" : "bg-secondary border-border text-muted-foreground"} ${active ? "glow" : ""}`}>
                      <t.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${done ? "" : "text-muted-foreground"}`}>{t.label}</div>
                      {active && <div className="text-xs text-primary">En cours…</div>}
                    </div>
                    {done && <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Fait</Badge>}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="my-6" />

          <h4 className="font-display text-lg mb-3">Articles</h4>
          <div className="space-y-2">
            {c.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                <div>
                  <div className="text-sm font-medium">{it.plat}</div>
                  <div className="text-xs text-muted-foreground">{it.qte} × {formatMAD(it.prix)}</div>
                </div>
                <div className="font-semibold">{formatMAD(it.prix * it.qte)}</div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Sous-total</span><span>{formatMAD(c.total)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Livraison</span><span>Gratuite</span></div>
            <div className="flex justify-between text-lg font-display font-semibold mt-2"><span>Total</span><span className="text-primary">{formatMAD(c.total)}</span></div>
          </div>
          {c.note && <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm"><span className="text-accent font-semibold">Note client : </span>{c.note}</div>}
        </Card>

        <div className="space-y-4">
          <Card className="glass p-6">
            <h3 className="font-display text-lg mb-3">Client</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />{c.client}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{c.telephone}</div>
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /><span className="flex-1">{c.adresse}</span></div>
            </div>
          </Card>

          <Card className="glass p-6">
            <h3 className="font-display text-lg mb-3">Livraison</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Bike className="h-4 w-4 text-primary" />{c.livreur ?? "Non assigné"}</div>
              <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground mt-2" onClick={() => setAssignOpen(true)}>{c.livreur ? "Réassigner un livreur" : "Assigner un livreur"}</Button>
            </div>
          </Card>

          <Card className="glass p-6">
            <h3 className="font-display text-lg mb-3">Paiement</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" />{c.paiement}</div>
              <Badge className="bg-chart-5/20 text-chart-5 border-chart-5/30 border">Payé</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full rounded-full mt-3" asChild>
              <Link to="/remboursements">Créer un remboursement</Link>
            </Button>
          </Card>
        </div>
      </div>

      <AssignerLivreurDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        numero={c.numero}
        onAssign={(l) => { setC((p) => p ? { ...p, livreur: l.nom, statut: p.statut === "Reçue" ? "En préparation" : p.statut } : p); toast.success(`${l.nom} assigné à ${c.numero}`); }}
      />
    </div>
  );
}
