import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ShoppingBag, Search, Eye, MoreHorizontal, Printer, XCircle, CheckCircle2, Bike, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { commandes as seed, formatMAD, formatDate, type Commande } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/commandes")({ component: Page });

const statutColor: Record<Commande["statut"], string> = {
  "Reçue": "bg-accent/20 text-accent border-accent/30",
  "En préparation": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  "Prête": "bg-chart-2/20 text-chart-2 border-chart-2/30",
  "En livraison": "bg-primary/20 text-primary border-primary/30",
  "Livrée": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "Annulée": "bg-destructive/20 text-destructive border-destructive/30",
};

function Page() {
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<string>("all");
  const [canal, setCanal] = useState<string>("all");

  const filtered = data.filter((c) => {
    if (statut !== "all" && c.statut !== statut) return false;
    if (canal !== "all" && c.canal !== canal) return false;
    if (q && !c.numero.toLowerCase().includes(q.toLowerCase()) && !c.client.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function updateStatut(id: string, s: Commande["statut"]) {
    setData((d) => d.map((c) => c.id === id ? { ...c, statut: s } : c));
    toast.success(`Commande mise à jour`, { description: `Nouveau statut : ${s}` });
  }

  return (
    <div>
      <PageHeader
        icon={ShoppingBag}
        title="Commandes"
        description={`${filtered.length} commandes · CA total ${formatMAD(filtered.reduce((s, c) => s + c.total, 0))}`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nouvelle commande</Button>}
      />

      <Card className="glass p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher n° ou client…" className="pl-9 bg-secondary/60 border-0" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={statut} onValueChange={setStatut}>
          <SelectTrigger className="w-44 bg-secondary/60 border-0"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {(["Reçue","En préparation","Prête","En livraison","Livrée","Annulée"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={canal} onValueChange={setCanal}>
          <SelectTrigger className="w-44 bg-secondary/60 border-0"><SelectValue placeholder="Canal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les canaux</SelectItem>
            {["App Mobile","WhatsApp","Site Web","Téléphone"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>N°</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Livreur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} className="border-border/30">
                <TableCell className="font-mono text-xs">{c.numero}</TableCell>
                <TableCell>
                  <div className="font-medium">{c.client}</div>
                  <div className="text-xs text-muted-foreground">{c.telephone}</div>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{c.canal}</Badge></TableCell>
                <TableCell className="font-semibold">{formatMAD(c.total)}</TableCell>
                <TableCell><Badge className={statutColor[c.statut] + " border"}>{c.statut}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.livreur ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(c.date)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link to="/commandes/$id" params={{ id: c.id }}><Eye className="h-4 w-4 mr-2" />Voir détails</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { toast.success("Ticket envoyé à l'imprimante"); }}><Printer className="h-4 w-4 mr-2" />Imprimer ticket</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { toast.success("Livreur assigné automatiquement"); }}><Bike className="h-4 w-4 mr-2" />Assigner livreur</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateStatut(c.id, "En préparation")}><CheckCircle2 className="h-4 w-4 mr-2" />Passer en préparation</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatut(c.id, "Livrée")}><CheckCircle2 className="h-4 w-4 mr-2" />Marquer livrée</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => updateStatut(c.id, "Annulée")}><XCircle className="h-4 w-4 mr-2" />Annuler</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
