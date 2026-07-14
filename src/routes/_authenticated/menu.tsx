import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { UtensilsCrossed, Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platsData as seed, formatMAD, type Plat } from "@/lib/mock/data";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/menu")({ component: Page });

const categories = ["Tajines","Pastilla","Couscous","Petit-déjeuner","Packs & Formules","Boissons","Desserts"] as const;

function Page() {
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plat | null>(null);

  const filtered = data.filter((p) => (cat === "all" || p.categorie === cat) && p.nom.toLowerCase().includes(q.toLowerCase()));

  function save(p: Plat) {
    if (editing) {
      setData((d) => d.map((x) => x.id === p.id ? p : x));
      toast.success("Plat modifié");
    } else {
      setData((d) => [{ ...p, id: `p${Date.now()}`, ventes: 0 }, ...d]);
      toast.success("Nouveau plat ajouté au menu");
    }
    setOpen(false); setEditing(null);
  }

  function toggle(p: Plat) {
    setData((d) => d.map((x) => x.id === p.id ? { ...x, disponible: !x.disponible } : x));
    toast.success(`${p.nom} : ${!p.disponible ? "disponible" : "indisponible"}`);
  }

  function remove(p: Plat) {
    setData((d) => d.filter((x) => x.id !== p.id));
    toast.success("Plat retiré du menu");
  }

  return (
    <div>
      <PageHeader
        icon={UtensilsCrossed}
        title="Menu & Plats"
        description={`${data.length} plats · ${data.filter((p) => p.disponible).length} disponibles`}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Ajouter un plat</Button>
            </DialogTrigger>
            <PlatDialog plat={editing} onSave={save} />
          </Dialog>
        }
      />

      <Card className="glass p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un plat…" className="pl-9 bg-secondary/60 border-0" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Tabs value={cat} onValueChange={setCat}>
          <TabsList className="bg-secondary/60">
            <TabsTrigger value="all">Tous</TabsTrigger>
            {categories.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="glass p-5 group hover:glow transition-all">
            <div className="flex items-start justify-between mb-3">
              <Badge variant="outline" className="border-primary/30 text-primary">{p.categorie}</Badge>
              <Switch checked={p.disponible} onCheckedChange={() => toggle(p)} />
            </div>
            <h3 className="font-display text-lg mb-1">{p.nom}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-display font-semibold text-primary">{formatMAD(p.prix)}</div>
              <div className="text-xs text-muted-foreground">⏱ {p.tempsPreparation} min</div>
            </div>
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {p.halal && <Badge className="bg-chart-5/20 text-chart-5 border border-chart-5/30 text-[10px]">100% Halal</Badge>}
              {p.allergenes.map((a) => <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>)}
              {!p.disponible && <Badge className="bg-destructive/20 text-destructive border border-destructive/30 text-[10px]">Indisponible</Badge>}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
              <span>🔥 {p.ventes} ventes ce mois</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(p); setOpen(true); }}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggle(p)}>{p.disponible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(p)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PlatDialog({ plat, onSave }: { plat: Plat | null; onSave: (p: Plat) => void }) {
  const [form, setForm] = useState<Plat>(plat ?? {
    id: "", nom: "", categorie: "Tajines", prix: 0, description: "", disponible: true, tempsPreparation: 15, allergenes: [], halal: true, ventes: 0,
  });

  return (
    <DialogContent className="glass max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">{plat ? "Modifier le plat" : "Nouveau plat"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Nom du plat</Label>
          <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Catégorie</Label>
            <Select value={form.categorie} onValueChange={(v) => setForm({ ...form, categorie: v as Plat["categorie"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prix (MAD)</Label>
            <Input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: +e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Temps préparation (min)</Label>
            <Input type="number" value={form.tempsPreparation} onChange={(e) => setForm({ ...form, tempsPreparation: +e.target.value })} />
          </div>
          <div className="flex items-end gap-4">
            <div className="flex items-center gap-2"><Switch checked={form.halal} onCheckedChange={(v) => setForm({ ...form, halal: v })} /><Label>Halal</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.disponible} onCheckedChange={(v) => setForm({ ...form, disponible: v })} /><Label>Disponible</Label></div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => onSave(form)}>Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  );
}
