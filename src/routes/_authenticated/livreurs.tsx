import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Bike, Star, MapPin, Phone, Eye, Power, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { livreurs as seed, formatMAD, type Livreur } from "@/lib/mock/data";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormShell, FieldGroup, Row } from "@/components/backoffice/FormShell";

export const Route = createFileRoute("/_authenticated/livreurs")({ component: Page });

const statutColor: Record<Livreur["statut"], string> = {
  "En ligne": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "En livraison": "bg-primary/20 text-primary border-primary/30",
  "En pause": "bg-accent/20 text-accent border-accent/30",
  "Hors ligne": "bg-muted text-muted-foreground border-border",
};

const empty: Livreur = { id: "", nom: "", telephone: "", vehicule: "Scooter", immatriculation: "", statut: "Hors ligne", note: 5, livraisonsAujourdhui: 0, gainsJour: 0, gainsMois: 0, zone: "Kénitra Centre", actif: true };

function Page() {
  const [data, setData] = useState(seed);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Livreur | null>(null);
  const [form, setForm] = useState<Livreur>(empty);

  const filtered = filter === "all" ? data : data.filter((l) => l.statut === filter);

  function openAdd() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(l: Livreur) { setEditing(l); setForm(l); setOpen(true); }

  function save() {
    if (!form.nom || !form.telephone) { toast.error("Nom et téléphone obligatoires"); return; }
    if (editing) {
      setData((d) => d.map((x) => x.id === editing.id ? { ...form, id: editing.id } : x));
      toast.success("Livreur mis à jour");
    } else {
      setData((d) => [{ ...form, id: `lv${Date.now()}` }, ...d]);
      toast.success("Nouveau livreur ajouté à l'équipe");
    }
    setOpen(false);
  }

  function toggle(l: Livreur) {
    setData((d) => d.map((x) => x.id === l.id ? { ...x, actif: !x.actif } : x));
    toast.success(`${l.nom} ${!l.actif ? "réactivé" : "désactivé"}`);
  }

  function remove(l: Livreur) {
    setData((d) => d.filter((x) => x.id !== l.id));
    toast.success(`${l.nom} retiré de l'équipe`);
  }

  return (
    <div>
      <PageHeader
        icon={Bike}
        title="Livreurs"
        description={`${data.length} livreurs · ${data.filter((l) => l.statut === "En ligne").length} en ligne · ${data.filter((l) => l.statut === "En livraison").length} en course`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Nouveau livreur</Button>}
      />

      <Tabs value={filter} onValueChange={setFilter} className="mb-4">
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="En ligne">En ligne</TabsTrigger>
          <TabsTrigger value="En livraison">En livraison</TabsTrigger>
          <TabsTrigger value="En pause">En pause</TabsTrigger>
          <TabsTrigger value="Hors ligne">Hors ligne</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((l) => (
          <Card key={l.id} className="glass p-5 group hover:glow transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-display text-sm">
                    {l.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  {l.statut === "En ligne" && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-chart-5 border-2 border-card" />}
                </div>
                <div>
                  <div className="font-medium">{l.nom}</div>
                  <div className="flex items-center gap-1 text-xs text-accent"><Star className="h-3 w-3 fill-current" />{l.note.toFixed(1)}</div>
                </div>
              </div>
              <Badge className={statutColor[l.statut] + " border"}>{l.statut}</Badge>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{l.telephone}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{l.zone}</div>
              <div className="flex items-center gap-2"><Bike className="h-3 w-3" />{l.vehicule} · {l.immatriculation}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Livraisons</div>
                <div className="text-sm font-semibold">{l.livraisonsAujourdhui}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Jour</div>
                <div className="text-sm font-semibold text-primary">{formatMAD(l.gainsJour)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Mois</div>
                <div className="text-sm font-semibold">{formatMAD(l.gainsMois)}</div>
              </div>
            </div>

            <div className="flex gap-1 mt-3">
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-full"><Link to="/livreurs/$id" params={{ id: l.id }}><Eye className="h-3 w-3 mr-1" />Voir</Link></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(l)}><Edit className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggle(l)}><Power className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(l)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <FormShell
          title={editing ? `Modifier ${editing.nom}` : "Nouveau livreur"}
          subtitle="Attribuez un véhicule et une zone de livraison au coursier."
          icon={<Bike className="h-5 w-5" />}
          onSubmit={save}
          onCancel={() => setOpen(false)}
          submitLabel={editing ? "Enregistrer" : "Ajouter le livreur"}
        >
          <FieldGroup title="Identité">
            <Row>
              <div><Label>Nom complet</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Mehdi Tazi" /></div>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="06 12 34 56 78" /></div>
            </Row>
          </FieldGroup>

          <FieldGroup title="Véhicule">
            <Row>
              <div>
                <Label>Type de véhicule</Label>
                <Select value={form.vehicule} onValueChange={(v) => setForm({ ...form, vehicule: v as Livreur["vehicule"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Scooter","Moto","Vélo","Voiture"] as const).map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Immatriculation</Label><Input value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} placeholder="12345 - A - 1" /></div>
            </Row>
          </FieldGroup>

          <FieldGroup title="Zone d'activité">
            <Row>
              <div>
                <Label>Zone principale</Label>
                <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Kénitra Centre","Mimosas","Val Fleuri","Bir Rami","Ouled Oujih","Maamoura","Fouarat"].map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut initial</Label>
                <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as Livreur["statut"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["En ligne","En pause","Hors ligne"] as const).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </Row>
          </FieldGroup>
        </FormShell>
      </Dialog>
    </div>
  );
}
