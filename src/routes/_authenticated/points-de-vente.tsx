import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Store, Plus, MapPin, Phone, Clock, User, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { pointsVente as seed, type PointVente } from "@/lib/mock/data";
import { toast } from "sonner";
import { FormShell, FieldGroup, Row } from "@/components/backoffice/FormShell";

export const Route = createFileRoute("/_authenticated/points-de-vente")({ component: Page });

const empty: PointVente = { id: "", nom: "", adresse: "", ville: "Kénitra", telephone: "", horaires: "11h00 – 23h30", manager: "", actif: true };

function Page() {
  const [data, setData] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PointVente | null>(null);
  const [form, setForm] = useState<PointVente>(empty);

  function openAdd() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(p: PointVente) { setEditing(p); setForm(p); setOpen(true); }

  function save() {
    if (!form.nom || !form.adresse) { toast.error("Nom et adresse obligatoires"); return; }
    if (editing) {
      setData((d) => d.map((x) => x.id === editing.id ? { ...form, id: editing.id } : x));
      toast.success("Point de vente mis à jour");
    } else {
      setData((d) => [{ ...form, id: `pv${Date.now()}` }, ...d]);
      toast.success("Nouveau point de vente ouvert");
    }
    setOpen(false);
  }

  function remove(p: PointVente) {
    setData((d) => d.filter((x) => x.id !== p.id));
    toast.success(`${p.nom} fermé définitivement`);
  }

  return (
    <div>
      <PageHeader
        icon={Store}
        title="Points de vente"
        description={`${data.length} restaurants Ladid Food · ${data.filter((p) => p.actif).length} ouverts`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Ajouter un point de vente</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((p) => (
          <Card key={p.id} className="glass p-6 group hover:glow transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center"><Store className="h-6 w-6" /></div>
              <Switch checked={p.actif} onCheckedChange={() => { setData((d) => d.map((x) => x.id === p.id ? { ...x, actif: !x.actif } : x)); toast.success("Statut mis à jour"); }} />
            </div>
            <h3 className="font-display text-lg mb-3">{p.nom}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /><span>{p.adresse}, {p.ville}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{p.telephone}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{p.horaires}</div>
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />{p.manager}</div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4">
              <Badge className={p.actif ? "bg-chart-5/20 text-chart-5 border border-chart-5/30" : "bg-muted"}>{p.actif ? "Ouvert" : "Fermé"}</Badge>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(p)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <FormShell
          title={editing ? `Modifier ${editing.nom}` : "Nouveau point de vente"}
          subtitle="Ajoutez un nouveau restaurant au réseau Ladid Food."
          icon={<Store className="h-5 w-5" />}
          onSubmit={save}
          onCancel={() => setOpen(false)}
          submitLabel={editing ? "Enregistrer" : "Ouvrir le restaurant"}
        >
          <FieldGroup title="Établissement">
            <div><Label>Nom du restaurant</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ladid Food – Kénitra Centre" /></div>
            <Row>
              <div><Label>Adresse</Label><Input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="12 Avenue Mohammed V" /></div>
              <div><Label>Ville</Label><Input value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} /></div>
            </Row>
          </FieldGroup>

          <FieldGroup title="Contact & horaires">
            <Row>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="05 37 12 34 56" /></div>
              <div><Label>Horaires d'ouverture</Label><Input value={form.horaires} onChange={(e) => setForm({ ...form, horaires: e.target.value })} placeholder="11h00 – 23h30" /></div>
            </Row>
          </FieldGroup>

          <FieldGroup title="Équipe">
            <Row>
              <div><Label>Responsable du site</Label><Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="Karim El Amrani" /></div>
              <div className="flex items-end"><label className="flex items-center gap-3 pb-2 text-sm"><Switch checked={form.actif} onCheckedChange={(v) => setForm({ ...form, actif: v })} />Ouvert au public</label></div>
            </Row>
          </FieldGroup>
        </FormShell>
      </Dialog>
    </div>
  );
}
