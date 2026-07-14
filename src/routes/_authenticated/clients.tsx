import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Users, Search, Plus, Eye, MoreHorizontal, Ban, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { clients as seed, formatMAD, formatDate, type Client } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clients")({ component: Page });

const niveauColor: Record<Client["niveau"], string> = {
  Bronze: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Argent: "bg-muted text-foreground border-border",
  Or: "bg-accent/20 text-accent border-accent/30",
  Platine: "bg-primary/20 text-primary border-primary/30",
};

function Page() {
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");

  const filtered = data.filter((c) => c.nom.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()));

  function toggle(c: Client) {
    setData((d) => d.map((x) => x.id === c.id ? { ...x, actif: !x.actif } : x));
    toast.success(`Client ${c.actif ? "bloqué" : "débloqué"}`);
  }

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Clients"
        description={`${data.length} clients enregistrés · ${data.filter((c) => c.niveau === "Platine").length} Platine`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Ajouter</Button>}
      />

      <Card className="glass p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un client…" className="pl-9 bg-secondary/60 border-0 max-w-md" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Commandes</TableHead>
              <TableHead>Total dépensé</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} className="border-border/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground text-xs font-semibold">
                      {c.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="font-medium">{c.nom}</div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div>{c.email}</div>
                  <div>{c.telephone}</div>
                </TableCell>
                <TableCell><Badge className={niveauColor[c.niveau] + " border"}><Award className="h-3 w-3 mr-1" />{c.niveau}</Badge></TableCell>
                <TableCell className="font-semibold text-primary">{c.points.toLocaleString("fr-FR")}</TableCell>
                <TableCell>{c.commandes}</TableCell>
                <TableCell className="font-semibold">{formatMAD(c.totalDepense)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(c.inscription)}</TableCell>
                <TableCell>{c.actif ? <Badge className="bg-chart-5/20 text-chart-5 border border-chart-5/30">Actif</Badge> : <Badge className="bg-destructive/20 text-destructive border border-destructive/30">Bloqué</Badge>}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link to="/clients/$id" params={{ id: c.id }}><Eye className="h-4 w-4 mr-2" />Voir la fiche</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("+100 points ajoutés")}><Award className="h-4 w-4 mr-2" />+100 points</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => toggle(c)}><Ban className="h-4 w-4 mr-2" />{c.actif ? "Bloquer" : "Débloquer"}</DropdownMenuItem>
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
