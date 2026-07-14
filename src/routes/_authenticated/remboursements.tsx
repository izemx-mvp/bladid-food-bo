import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Wallet, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { remboursements as seed, formatMAD, formatDate, type Remboursement } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/remboursements")({ component: Page });

const statutColor: Record<Remboursement["statut"], string> = {
  "En attente": "bg-accent/20 text-accent border-accent/30",
  "Approuvé": "bg-primary/20 text-primary border-primary/30",
  "Remboursé": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "Refusé": "bg-destructive/20 text-destructive border-destructive/30",
};

function Page() {
  const [data, setData] = useState(seed);

  function act(r: Remboursement, s: Remboursement["statut"]) {
    setData((d) => d.map((x) => x.id === r.id ? { ...x, statut: s, traiteBy: "Yassine Amrani" } : x));
    toast.success(s === "Approuvé" ? "Remboursement approuvé" : s === "Refusé" ? "Refusé" : "Remboursement effectué");
  }

  const total = data.filter((r) => r.statut === "Remboursé").reduce((s, r) => s + r.montant, 0);
  const pending = data.filter((r) => r.statut === "En attente").length;

  return (
    <div>
      <PageHeader
        icon={Wallet}
        title="Demandes de remboursement"
        description={`${pending} en attente · ${formatMAD(total)} remboursés au total`}
      />

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Traitée par</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r) => (
              <TableRow key={r.id} className="border-border/30">
                <TableCell className="font-mono text-xs text-primary">{r.commande}</TableCell>
                <TableCell className="font-medium">{r.client}</TableCell>
                <TableCell className="font-semibold">{formatMAD(r.montant)}</TableCell>
                <TableCell className="text-sm">{r.motif}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(r.date)}</TableCell>
                <TableCell><Badge className={statutColor[r.statut] + " border"}>{r.statut}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.traiteBy ?? "—"}</TableCell>
                <TableCell className="text-right">
                  {r.statut === "En attente" && (
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" className="rounded-full text-chart-5 border-chart-5/30 hover:bg-chart-5/10" onClick={() => act(r, "Approuvé")}><CheckCircle2 className="h-3 w-3 mr-1" />Approuver</Button>
                      <Button size="sm" variant="outline" className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => act(r, "Refusé")}><XCircle className="h-3 w-3 mr-1" />Refuser</Button>
                    </div>
                  )}
                  {r.statut === "Approuvé" && (
                    <Button size="sm" className="rounded-full bg-primary text-primary-foreground" onClick={() => act(r, "Remboursé")}>Rembourser</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
