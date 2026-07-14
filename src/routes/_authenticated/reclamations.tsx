import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { MessageSquareWarning, Search, CheckCircle2, Send, UserCheck, XCircle, Eye, MoreHorizontal, Clock, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const [statutF, setStatutF] = useState("all");
  const [prioF, setPrioF] = useState("all");
  const [current, setCurrent] = useState<Reclamation | null>(null);
  const [reponse, setReponse] = useState("");

  const filtered = data.filter((r) => {
    if (statutF !== "all" && r.statut !== statutF) return false;
    if (prioF !== "all" && r.priorite !== prioF) return false;
    if (q && !r.client.toLowerCase().includes(q.toLowerCase()) && !r.sujet.toLowerCase().includes(q.toLowerCase()) && !r.commande.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function setStatut(r: Reclamation, s: Reclamation["statut"]) {
    setData((d) => d.map((x) => x.id === r.id ? { ...x, statut: s } : x));
    setCurrent((cur) => cur?.id === r.id ? { ...cur, statut: s } : cur);
    toast.success(`Réclamation ${s.toLowerCase()}`);
  }

  function assignToMe(r: Reclamation) {
    setData((d) => d.map((x) => x.id === r.id ? { ...x, assignee: "Yassine Amrani", statut: x.statut === "Nouvelle" ? "En cours" : x.statut } : x));
    setCurrent((cur) => cur?.id === r.id ? { ...cur, assignee: "Yassine Amrani", statut: cur.statut === "Nouvelle" ? "En cours" : cur.statut } : cur);
    toast.success("Réclamation assignée à votre compte");
  }

  function sendResponse() {
    if (!current) return;
    if (!reponse.trim()) return toast.error("Écrivez une réponse avant l'envoi");
    setData((d) => d.map((x) => x.id === current.id ? { ...x, statut: "En cours", assignee: x.assignee ?? "Yassine Amrani" } : x));
    setCurrent({ ...current, statut: "En cours", assignee: current.assignee ?? "Yassine Amrani" });
    toast.success("Réponse envoyée au client", { description: current.client });
    setReponse("");
  }

  return (
    <div>
      <PageHeader
        icon={MessageSquareWarning}
        title="Réclamations"
        description={`${data.filter((r) => r.statut === "Nouvelle").length} nouvelles · ${data.filter((r) => r.priorite === "Urgente").length} urgentes`}
      />

      <Card className="glass p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher client, sujet ou n° commande…" className="pl-9 bg-secondary/60 border-0" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={statutF} onValueChange={setStatutF}>
          <SelectTrigger className="w-40 bg-secondary/60 border-0"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {(["Nouvelle","En cours","Résolue","Fermée"] as const).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={prioF} onValueChange={setPrioF}>
          <SelectTrigger className="w-40 bg-secondary/60 border-0"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes priorités</SelectItem>
            {(["Basse","Moyenne","Haute","Urgente"] as const).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setCurrent(r); setReponse(""); }}><Eye className="h-4 w-4 mr-2" />Voir / traiter</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => assignToMe(r)}><UserCheck className="h-4 w-4 mr-2" />M'assigner</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatut(r, "En cours")}><Clock className="h-4 w-4 mr-2" />Mettre en cours</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatut(r, "Résolue")}><ClipboardCheck className="h-4 w-4 mr-2" />Marquer résolue</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setStatut(r, "Fermée")}><XCircle className="h-4 w-4 mr-2" />Fermer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">Aucune réclamation ne correspond aux filtres.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!current} onOpenChange={(open) => { if (!open) setCurrent(null); }}>
        {current && <SheetContent className="glass w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle className="font-display text-2xl">{current.sujet}</SheetTitle></SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-secondary/40">
                <div className="text-[10px] uppercase text-muted-foreground">Client</div>
                <div className="text-sm font-medium">{current.client}</div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40">
                <div className="text-[10px] uppercase text-muted-foreground">Commande</div>
                <div className="font-mono text-sm text-primary">{current.commande}</div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40">
                <div className="text-[10px] uppercase text-muted-foreground">Priorité</div>
                <div className={prioColor[current.priorite] + " text-sm font-semibold"}>{current.priorite}</div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40">
                <div className="text-[10px] uppercase text-muted-foreground">Assignée à</div>
                <div className="text-sm font-medium">{current.assignee ?? "Non assignée"}</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/40 text-sm leading-relaxed">{current.message}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full" onClick={() => assignToMe(current)}><UserCheck className="h-4 w-4 mr-1" />M'assigner</Button>
              <Button variant="outline" className="rounded-full" onClick={() => setStatut(current, "En cours")}>Mettre en cours</Button>
              <Button variant="outline" className="rounded-full" onClick={() => setStatut(current, "Fermée")}><XCircle className="h-4 w-4 mr-1" />Fermer</Button>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Réponse au client</label>
              <Textarea rows={4} placeholder="Bonjour, nous sommes désolés…" value={reponse} onChange={(e) => setReponse(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 rounded-full bg-primary text-primary-foreground" onClick={sendResponse}><Send className="h-4 w-4 mr-1" />Envoyer</Button>
              <Button variant="outline" className="rounded-full" onClick={() => setStatut(current, "Résolue")}><CheckCircle2 className="h-4 w-4 mr-1" />Résoudre</Button>
            </div>
          </div>
        </SheetContent>}
      </Sheet>
    </div>
  );
}
