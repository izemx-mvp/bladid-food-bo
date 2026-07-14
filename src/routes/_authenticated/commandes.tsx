import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ShoppingBag, Search, Eye, MoreHorizontal, Printer, XCircle, CheckCircle2, Bike, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { commandes as seed, formatMAD, formatDate, type Commande } from "@/lib/mock/data";
import { toast } from "sonner";
import { FormShell, FieldGroup, Row } from "@/components/backoffice/FormShell";
import { AssignerLivreurDialog } from "@/components/backoffice/AssignerLivreurDialog";

export const Route = createFileRoute("/_authenticated/commandes")({ component: Page });

const statutColor: Record<Commande["statut"], string> = {
  "Reçue": "bg-accent/20 text-accent border-accent/30",
  "En préparation": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  "Prête": "bg-chart-2/20 text-chart-2 border-chart-2/30",
  "En livraison": "bg-primary/20 text-primary border-primary/30",
  "Livrée": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "Annulée": "bg-destructive/20 text-destructive border-destructive/30",
};

type NewOrder = { client: string; telephone: string; canal: Commande["canal"]; plat: string; qte: number; prix: number; adresse: string; paiement: Commande["paiement"]; note: string };
const emptyNew: NewOrder = { client: "", telephone: "", canal: "Téléphone", plat: "Tajine Poulet aux Olives", qte: 1, prix: 85, adresse: "", paiement: "Espèces", note: "" };

function Page() {
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<string>("all");
  const [canal, setCanal] = useState<string>("all");
  const [assignFor, setAssignFor] = useState<Commande | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState<NewOrder>(emptyNew);

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

  function assign(c: Commande, livreurNom: string) {
    setData((d) => d.map((x) => x.id === c.id ? { ...x, livreur: livreurNom, statut: x.statut === "Reçue" ? "En préparation" : x.statut } : x));
    toast.success(`${livreurNom} assigné à ${c.numero}`);
  }

  function printTicket(c: Commande) {
    const lines = c.items.map((it) => `${it.qte} × ${it.plat} — ${formatMAD(it.qte * it.prix)}`).join("\n");
    const ticket = `LADID FOOD\n${c.numero}\n${formatDate(c.date)}\n\nClient: ${c.client}\nTel: ${c.telephone}\nAdresse: ${c.adresse}\n\n${lines}\n\nTOTAL: ${formatMAD(c.total)}\nPaiement: ${c.paiement}`;
    const blob = new Blob([ticket], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.numero.replace("#", "")}-ticket.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Ticket téléchargé", { description: c.numero });
  }

  function createOrder() {
    if (!form.client || !form.telephone) return toast.error("Client et téléphone obligatoires");
    const nb = data.length + 1;
    const total = form.qte * form.prix;
    const cmd: Commande = {
      id: `cmd_${Date.now()}`,
      numero: `#LDF-${2600 + nb}`,
      client: form.client,
      telephone: form.telephone,
      canal: form.canal,
      items: [{ plat: form.plat, qte: form.qte, prix: form.prix }],
      total,
      statut: "Reçue",
      paiement: form.paiement,
      livreur: null,
      adresse: form.adresse || "Adresse à préciser, Kénitra",
      date: new Date().toISOString(),
      note: form.note || undefined,
    };
    setData((d) => [cmd, ...d]);
    setOpenNew(false);
    setForm(emptyNew);
    toast.success(`Commande ${cmd.numero} créée`);
  }

  return (
    <div>
      <PageHeader
        icon={ShoppingBag}
        title="Commandes"
        description={`${filtered.length} commandes · CA total ${formatMAD(filtered.reduce((s, c) => s + c.total, 0))}`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground" onClick={() => { setForm(emptyNew); setOpenNew(true); }}><Plus className="h-4 w-4 mr-1" />Nouvelle commande</Button>}
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
        {(q || statut !== "all" || canal !== "all") && (
          <Button variant="ghost" size="sm" onClick={() => { setQ(""); setStatut("all"); setCanal("all"); }}>Réinitialiser</Button>
        )}
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
                      <DropdownMenuItem onClick={() => printTicket(c)}><Printer className="h-4 w-4 mr-2" />Imprimer ticket</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAssignFor(c)}><Bike className="h-4 w-4 mr-2" />Assigner un livreur</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateStatut(c.id, "En préparation")}><CheckCircle2 className="h-4 w-4 mr-2" />Passer en préparation</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatut(c.id, "Prête")}><CheckCircle2 className="h-4 w-4 mr-2" />Marquer prête</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatut(c.id, "Livrée")}><CheckCircle2 className="h-4 w-4 mr-2" />Marquer livrée</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => updateStatut(c.id, "Annulée")}><XCircle className="h-4 w-4 mr-2" />Annuler</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">Aucune commande ne correspond à ces filtres.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AssignerLivreurDialog
        open={!!assignFor}
        onOpenChange={(o) => !o && setAssignFor(null)}
        numero={assignFor?.numero}
        onAssign={(l) => assignFor && assign(assignFor, l.nom)}
      />

      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <FormShell
          title="Nouvelle commande manuelle"
          subtitle="Enregistrez une commande reçue par téléphone ou en salle."
          icon={<ShoppingBag className="h-5 w-5" />}
          onSubmit={createOrder}
          onCancel={() => setOpenNew(false)}
          submitLabel="Enregistrer la commande"
        >
          <FieldGroup title="Client">
            <Row>
              <div><Label>Nom du client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Fatima Zahra Idrissi" /></div>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="06 12 34 56 78" /></div>
            </Row>
            <div><Label>Adresse de livraison</Label><Input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="12 Rue Mohammed V, Kénitra Centre" /></div>
          </FieldGroup>

          <FieldGroup title="Détail de la commande">
            <div><Label>Plat commandé</Label><Input value={form.plat} onChange={(e) => setForm({ ...form, plat: e.target.value })} /></div>
            <Row>
              <div><Label>Quantité</Label><Input type="number" min={1} value={form.qte} onChange={(e) => setForm({ ...form, qte: +e.target.value })} /></div>
              <div><Label>Prix unitaire (MAD)</Label><Input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: +e.target.value })} /></div>
            </Row>
            <div className="text-right text-sm text-muted-foreground">Total : <span className="font-display text-lg text-primary">{formatMAD(form.qte * form.prix)}</span></div>
          </FieldGroup>

          <FieldGroup title="Paiement & canal">
            <Row>
              <div>
                <Label>Canal</Label>
                <Select value={form.canal} onValueChange={(v) => setForm({ ...form, canal: v as Commande["canal"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(["Téléphone","WhatsApp","App Mobile","Site Web"] as const).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Paiement</Label>
                <Select value={form.paiement} onValueChange={(v) => setForm({ ...form, paiement: v as Commande["paiement"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(["Espèces","Carte","En ligne"] as const).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Row>
            <div><Label>Note client (optionnelle)</Label><Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Sans oignons, bien cuit, sonner à la porte…" /></div>
          </FieldGroup>
        </FormShell>
      </Dialog>
    </div>
  );
}
