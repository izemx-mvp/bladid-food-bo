import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { MessageSquareWarning, Search, MoreHorizontal, CheckCircle2, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { reclamations as seed, formatDate, type Reclamation } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reclamations")({ component: Page });

const statutColor: Record<Reclamation["statut"], string> = {
  "Nouvelle": "bg-destructive/20 text-destructive border-destructive/30",
  "En cours": "bg-accent/20 text-accent border-accent/30",
  "Résolue": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "Fermée": "bg-muted text-muted-foreground border-border",
};
const prioColor: Record<Reclamation["priorite"], string> = {
  Basse: "text-muted-foreground",
  Moyenne: "text-accent",
  Haute: "text-chart-3",
  Urgente: "text-destructive",
};

function Page() {
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState<Reclamation | null>(null);
  const [reponse, setReponse] = useState("");

  const filtered = data.filter((r) => r.client.toLowerCase().includes(q.toLowerCase()) || r.sujet.toLowerCase().includes(q.toLowerCase()));

  function setStatut(r: Reclamation, s: Reclamation["statut"]) {
    setData((d) => d.map((x) => x.id === r.id ? { ...x, statut: s } : x));
    toast.success(`Réclamation ${s.toLowerCase()}`);
  }

  return (
    <div>
      <PageHeader
        icon={MessageSquareWarning}
        title="Réclamations"
        description={`${data.filter((r) => r.statut === "Nouvelle").length} nouvelles · ${data.filter((r) => r.priorite === "Urgente").length} urgentes`}
      />

      <Card className="glass p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher…" className="pl-9 bg-secondary/60 border-0 max-w-md" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Client</TableHead>
              <TableHead>Commande</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Assignée à</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} className="border-border/30">
                <TableCell className="font-medium">{r.client}</TableCell>
                <TableCell className="font-mono text-xs text-primary">{r.commande}</TableCell>
                <TableCell className="max-w-xs truncate">{r.sujet}</TableCell>
                <TableCell><span className={prioColor[r.priorite] + " text-xs font-semibold"}>● {r.priorite}</span></TableCell>
                <TableCell><Badge className={statutColor[r.statut] + " border"}>{r.statut}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.assignee ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(r.date)}</TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setCurrent(r)}>Traiter</Button>
                    </SheetTrigger>
                    {current && <SheetContent className="glass w-full sm:max-w-lg">
                      <SheetHeader><SheetTitle className="font-display text-2xl">{current.sujet}</SheetTitle></SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Client</span><span className="font-medium">{current.client}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Commande</span><span className="font-mono text-primary">{current.commande}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Priorité</span><span className={prioColor[current.priorite]}>{current.priorite}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/40 text-sm">{current.message}</div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Réponse au client</label>
                          <Textarea rows={4} placeholder="Bonjour, nous sommes désolés…" value={reponse} onChange={(e) => setReponse(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1 rounded-full bg-primary text-primary-foreground" onClick={() => { toast.success("Réponse envoyée au client"); setReponse(""); }}><Send className="h-4 w-4 mr-1" />Envoyer</Button>
                          <Button variant="outline" className="rounded-full" onClick={() => setStatut(current, "Résolue")}><CheckCircle2 className="h-4 w-4 mr-1" />Résoudre</Button>
                        </div>
                      </div>
                    </SheetContent>}
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
