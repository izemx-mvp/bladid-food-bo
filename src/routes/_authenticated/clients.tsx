import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Users, Search, Plus, Eye, MoreHorizontal, Ban, Award, Edit, Trash2, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { clients as seed, formatMAD, formatDate, type Client } from "@/lib/mock/data";
import { toast } from "sonner";
import { FormShell, FieldGroup, Row } from "@/components/backoffice/FormShell";

export const Route = createFileRoute("/_authenticated/clients")({ component: Page });

const niveauColor: Record<Client["niveau"], string> = {
  Bronze: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Argent: "bg-muted text-foreground border-border",
  Or: "bg-accent/20 text-accent border-accent/30",
  Platine: "bg-primary/20 text-primary border-primary/30",
};

const empty: Client = { id: "", nom: "", email: "", telephone: "", adresses: [""], points: 0, niveau: "Bronze", commandes: 0, totalDepense: 0, inscription: new Date().toISOString(), actif: true };

function Page() {
  const navigate = useNavigate();
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [niveauF, setNiveauF] = useState("all");
  const [statutF, setStatutF] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<Client>(empty);

  const filtered = data.filter((c) => {
    if (niveauF !== "all" && c.niveau !== niveauF) return false;
    if (statutF === "actifs" && !c.actif) return false;
    if (statutF === "bloques" && c.actif) return false;
    if (q && !c.nom.toLowerCase().includes(q.toLowerCase()) && !c.email.toLowerCase().includes(q.toLowerCase()) && !c.telephone.includes(q)) return false;
    return true;
  });

  function openAdd() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(c: Client) { setEditing(c); setForm(c); setOpen(true); }

  function save() {
    if (!form.nom || !form.email) { toast.error("Nom et email obligatoires"); return; }
    if (editing) {
      setData((d) => d.map((x) => x.id === editing.id ? form : x));
      toast.success("Fiche client mise à jour");
    } else {
      setData((d) => [{ ...form, id: `c${Date.now()}` }, ...d]);
      toast.success("Nouveau client ajouté");
    }
    setOpen(false);
  }

  function toggle(c: Client) {
    setData((d) => d.map((x) => x.id === c.id ? { ...x, actif: !x.actif } : x));
    toast.success(`Client ${c.actif ? "bloqué" : "débloqué"}`);
  }

  function remove(c: Client) {
    setData((d) => d.filter((x) => x.id !== c.id));
    toast.success("Client supprimé");
  }

  function addPoints(c: Client) {
    setData((d) => d.map((x) => x.id === c.id ? { ...x, points: x.points + 100 } : x));
    toast.success(`+100 points ajoutés à ${c.nom}`);
  }

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Clients"
        description={`${data.length} clients enregistrés · ${data.filter((c) => c.niveau === "Platine").length} Platine`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Ajouter un client</Button>}
      />

      <Card className="glass p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher nom, email ou téléphone…" className="pl-9 bg-secondary/60 border-0" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={niveauF} onValueChange={setNiveauF}>
          <SelectTrigger className="w-40 bg-secondary/60 border-0"><SelectValue placeholder="Niveau" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous niveaux</SelectItem>
            {(["Bronze","Argent","Or","Platine"] as const).map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statutF} onValueChange={setStatutF}>
          <SelectTrigger className="w-40 bg-secondary/60 border-0"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="actifs">Actifs</SelectItem>
            <SelectItem value="bloques">Bloqués</SelectItem>
          </SelectContent>
        </Select>
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
                      <DropdownMenuItem onClick={() => navigate({ to: "/clients/$id", params: { id: c.id } })}><Eye className="h-4 w-4 mr-2" />Voir la fiche</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(c)}><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addPoints(c)}><Award className="h-4 w-4 mr-2" />+100 points</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggle(c)}><Ban className="h-4 w-4 mr-2" />{c.actif ? "Bloquer" : "Débloquer"}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => remove(c)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <FormShell
          title={editing ? "Modifier le client" : "Nouveau client"}
          subtitle={editing ? "Mettez à jour les informations de fidélité et de contact." : "Créez une fiche client pour l'application mobile Ladid Food."}
          icon={<UserIcon className="h-5 w-5" />}
          onSubmit={save}
          onCancel={() => setOpen(false)}
          submitLabel={editing ? "Enregistrer les modifications" : "Créer le client"}
        >
          <FieldGroup title="Identité">
            <Row>
              <div><Label>Nom complet</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Fatima Zahra Idrissi" /></div>
              <div>
                <Label>Niveau de fidélité</Label>
                <Select value={form.niveau} onValueChange={(v) => setForm({ ...form, niveau: v as Client["niveau"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Bronze","Argent","Or","Platine"] as const).map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </Row>
          </FieldGroup>

          <FieldGroup title="Coordonnées">
            <Row>
              <div><Label>Adresse email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@example.com" /></div>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="06 12 34 56 78" /></div>
            </Row>
            <div>
              <Label>Adresse de livraison</Label>
              <Input value={form.adresses[0] ?? ""} onChange={(e) => setForm({ ...form, adresses: [e.target.value] })} placeholder="Rue Hassan II, Kénitra" />
            </div>
          </FieldGroup>

          <FieldGroup title="Fidélité & historique">
            <Row>
              <div><Label>Points de fidélité</Label><Input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: +e.target.value })} /></div>
              <div><Label>Total dépensé (MAD)</Label><Input type="number" value={form.totalDepense} onChange={(e) => setForm({ ...form, totalDepense: +e.target.value })} /></div>
            </Row>
          </FieldGroup>
        </FormShell>
      </Dialog>
    </div>
  );
}
