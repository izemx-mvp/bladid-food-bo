import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Wallet, CheckCircle2, XCircle, Plus, Search, Eye, MoreHorizontal, CreditCard, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { remboursements as seed, formatMAD, formatDate, type Remboursement } from "@/lib/mock/data";
import { toast } from "sonner";
import { FormShell, FieldGroup, Row } from "@/components/backoffice/FormShell";

export const Route = createFileRoute("/_authenticated/remboursements")({ component: Page });

const statutColor: Record<Remboursement["statut"], string> = {
  "En attente": "bg-accent/20 text-accent border-accent/30",
  "Approuvé": "bg-primary/20 text-primary border-primary/30",
  "Remboursé": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "Refusé": "bg-destructive/20 text-destructive border-destructive/30",
};

type NewR = { commande: string; client: string; montant: number; motif: string };
const emptyNew: NewR = { commande: "#LDF-", client: "", montant: 0, motif: "Commande non reçue" };

function Page() {
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [statutF, setStatutF] = useState("all");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Remboursement | null>(null);
  const [form, setForm] = useState<NewR>(emptyNew);

  const filtered = data.filter((r) => {
    if (statutF !== "all" && r.statut !== statutF) return false;
    if (q && !r.client.toLowerCase().includes(q.toLowerCase()) && !r.commande.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function act(r: Remboursement, s: Remboursement["statut"]) {
    setData((d) => d.map((x) => x.id === r.id ? { ...x, statut: s, traiteBy: "Yassine Amrani" } : x));
    setCurrent((cur) => cur?.id === r.id ? { ...cur, statut: s, traiteBy: "Yassine Amrani" } : cur);
    toast.success(s === "Approuvé" ? "Remboursement approuvé" : s === "Refusé" ? "Refusé" : "Remboursement effectué");
  }

  function create() {
    if (!form.client || !form.commande || form.montant <= 0) return toast.error("Renseignez client, commande et montant");
    const nr: Remboursement = {
      id: `rem_${Date.now()}`,
      commande: form.commande,
      client: form.client,
      montant: form.montant,
      motif: form.motif,
      statut: "En attente",
      date: new Date().toISOString(),
    };
    setData((d) => [nr, ...d]);
    setOpen(false);
    setForm(emptyNew);
    toast.success("Demande de remboursement créée");
  }

  const total = data.filter((r) => r.statut === "Remboursé").reduce((s, r) => s + r.montant, 0);
  const pending = data.filter((r) => r.statut === "En attente").length;

  return (
    <div>
      <PageHeader
        icon={Wallet}
        title="Demandes de remboursement"
        description={`${pending} en attente · ${formatMAD(total)} remboursés au total`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground" onClick={() => { setForm(emptyNew); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />Nouvelle demande</Button>}
      />

      <Card className="glass p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher client ou n° commande…" className="pl-9 bg-secondary/60 border-0" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={statutF} onValueChange={setStatutF}>
          <SelectTrigger className="w-48 bg-secondary/60 border-0"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {(["En attente","Approuvé","Refusé","Remboursé"] as const).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

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
            {filtered.map((r) => (
              <TableRow key={r.id} className="border-border/30">
                <TableCell className="font-mono text-xs text-primary">{r.commande}</TableCell>
                <TableCell className="font-medium">{r.client}</TableCell>
                <TableCell className="font-semibold">{formatMAD(r.montant)}</TableCell>
                <TableCell className="text-sm">{r.motif}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(r.date)}</TableCell>
                <TableCell><Badge className={statutColor[r.statut] + " border"}>{r.statut}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.traiteBy ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCurrent(r)}><Eye className="h-4 w-4 mr-2" />Voir détails</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled={r.statut !== "En attente"} onClick={() => act(r, "Approuvé")}><CheckCircle2 className="h-4 w-4 mr-2" />Approuver</DropdownMenuItem>
                      <DropdownMenuItem disabled={r.statut !== "Approuvé"} onClick={() => act(r, "Remboursé")}><CreditCard className="h-4 w-4 mr-2" />Rembourser</DropdownMenuItem>
                      <DropdownMenuItem disabled={r.statut === "Remboursé"} className="text-destructive" onClick={() => act(r, "Refusé")}><XCircle className="h-4 w-4 mr-2" />Refuser</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">Aucune demande.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <FormShell
          title="Nouvelle demande de remboursement"
          subtitle="Créez une demande manuelle pour un client insatisfait."
          icon={<Wallet className="h-5 w-5" />}
          onSubmit={create}
          onCancel={() => setOpen(false)}
          submitLabel="Créer la demande"
        >
          <FieldGroup title="Commande concernée">
            <Row>
              <div><Label>Numéro de commande</Label><Input value={form.commande} onChange={(e) => setForm({ ...form, commande: e.target.value })} placeholder="#LDF-2615" /></div>
              <div><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Karim El Amrani" /></div>
            </Row>
          </FieldGroup>
          <FieldGroup title="Détails du remboursement">
            <Row>
              <div><Label>Montant (MAD)</Label><Input type="number" value={form.montant} onChange={(e) => setForm({ ...form, montant: +e.target.value })} /></div>
              <div>
                <Label>Motif</Label>
                <Select value={form.motif} onValueChange={(v) => setForm({ ...form, motif: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Commande non reçue","Plat incorrect","Qualité médiocre","Livraison trop tardive","Annulation restaurant","Autre"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </Row>
          </FieldGroup>
        </FormShell>
      </Dialog>

      <Sheet open={!!current} onOpenChange={(o) => !o && setCurrent(null)}>
        {current && (
          <SheetContent className="glass w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">Remboursement {current.commande}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between">
                <Badge className={statutColor[current.statut] + " border"}>{current.statut}</Badge>
                <div className="font-display text-2xl text-primary">{formatMAD(current.montant)}</div>
              </div>
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
                  <div className="text-[10px] uppercase text-muted-foreground">Date demande</div>
                  <div className="text-sm font-medium">{formatDate(current.date)}</div>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40">
                  <div className="text-[10px] uppercase text-muted-foreground">Traitée par</div>
                  <div className="text-sm font-medium">{current.traiteBy ?? "Non traitée"}</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40 text-sm">
                <div className="text-[10px] uppercase text-muted-foreground mb-1">Motif</div>
                {current.motif}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" disabled={current.statut !== "En attente"} onClick={() => act(current, "Approuvé")}><CheckCircle2 className="h-4 w-4 mr-1" />Approuver</Button>
                <Button className="rounded-full bg-primary text-primary-foreground" disabled={current.statut !== "Approuvé"} onClick={() => act(current, "Remboursé")}><CreditCard className="h-4 w-4 mr-1" />Rembourser</Button>
                <Button variant="outline" className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10" disabled={current.statut === "Remboursé"} onClick={() => act(current, "Refusé")}><XCircle className="h-4 w-4 mr-1" />Refuser</Button>
                <Button variant="ghost" className="rounded-full" onClick={() => { setCurrent({ ...current, traiteBy: "Yassine Amrani" }); setData((d) => d.map((x) => x.id === current.id ? { ...x, traiteBy: "Yassine Amrani" } : x)); toast.success("Dossier assigné à votre compte"); }}><UserCheck className="h-4 w-4 mr-1" />M'assigner</Button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}
