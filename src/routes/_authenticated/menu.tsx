import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { UtensilsCrossed, Plus, Search, Edit, Trash2, Eye, EyeOff, Info, Clock, Flame, ShieldCheck, ImageIcon, X, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platsData as seed, formatMAD, type Plat, type Supplement } from "@/lib/mock/data";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormShell, FieldGroup, Row } from "@/components/backoffice/FormShell";

export const Route = createFileRoute("/_authenticated/menu")({ component: Page });

const categories = ["Tajines","Pastilla","Couscous","Petit-déjeuner","Packs & Formules","Boissons","Desserts"] as const;

function Page() {
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plat | null>(null);
  const [details, setDetails] = useState<Plat | null>(null);

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
          <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" />Ajouter un plat
          </Button>
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
          <Card key={p.id} className="glass overflow-hidden group hover:glow transition-all flex flex-col">
            <div className="relative aspect-[16/10] bg-secondary/40 overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className="border-primary/40 text-primary bg-background/80 backdrop-blur">{p.categorie}</Badge>
              </div>
              <div className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur px-1.5 py-1">
                <Switch checked={p.disponible} onCheckedChange={() => toggle(p)} />
              </div>
              {!p.disponible && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                  <Badge className="bg-destructive/90 text-destructive-foreground">Indisponible</Badge>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-display text-lg mb-1 line-clamp-1">{p.nom}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-display font-semibold text-primary">{formatMAD(p.prix)}</div>
                <div className="text-xs text-muted-foreground">⏱ {p.tempsPreparation} min</div>
              </div>
              <div className="flex items-center gap-1 mb-3 flex-wrap">
                {p.halal && <Badge className="bg-chart-5/20 text-chart-5 border border-chart-5/30 text-[10px]">100% Halal</Badge>}
                {p.supplements && p.supplements.length > 0 && <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">+{p.supplements.length} suppléments</Badge>}
                {p.allergenes.map((a) => <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>)}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3 mt-auto">
                <span>🔥 {p.ventes} ventes</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDetails(p)}><Info className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(p); setOpen(true); }}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggle(p)}>{p.disponible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(p)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <PlatForm key={editing?.id ?? "new"} plat={editing} onSave={save} onCancel={() => { setOpen(false); setEditing(null); }} />
      </Dialog>

      <Sheet open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        {details && (
          <SheetContent className="glass w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">{details.nom}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-5">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-secondary/40 border border-border/60">
                {details.image ? (
                  <img src={details.image} alt={details.nom} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/40"><ImageIcon className="h-12 w-12" /></div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary">{details.categorie}</Badge>
                <Badge className={details.disponible ? "bg-chart-5/20 text-chart-5 border border-chart-5/30" : "bg-destructive/20 text-destructive border border-destructive/30"}>{details.disponible ? "Disponible" : "Indisponible"}</Badge>
                {details.halal && <Badge className="bg-primary/15 text-primary border border-primary/30">Halal</Badge>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-secondary/40">
                  <div className="text-[10px] uppercase text-muted-foreground">Prix</div>
                  <div className="font-display text-lg text-primary">{formatMAD(details.prix)}</div>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40">
                  <div className="text-[10px] uppercase text-muted-foreground">Préparation</div>
                  <div className="font-semibold flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" />{details.tempsPreparation} min</div>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40">
                  <div className="text-[10px] uppercase text-muted-foreground">Ventes</div>
                  <div className="font-semibold flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-primary" />{details.ventes}</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40 text-sm leading-relaxed">{details.description}</div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">Allergènes</div>
                <div className="flex flex-wrap gap-2">
                  {details.allergenes.length ? details.allergenes.map((a) => <Badge key={a} variant="outline">{a}</Badge>) : <span className="text-sm text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Aucun allergène déclaré</span>}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">Choix supplémentaires</div>
                {details.supplements && details.supplements.length > 0 ? (
                  <div className="space-y-2">
                    {details.supplements.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40">
                        <span className="text-sm">{s.nom}</span>
                        <Badge className="bg-primary/15 text-primary border border-primary/30">+{formatMAD(s.prix)}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Aucun supplément proposé</span>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-full bg-primary text-primary-foreground" onClick={() => { setEditing(details); setOpen(true); setDetails(null); }}><Edit className="h-4 w-4 mr-1" />Modifier</Button>
                <Button variant="outline" className="rounded-full" onClick={() => { toggle(details); setDetails((p) => p ? { ...p, disponible: !p.disponible } : p); }}>{details.disponible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}{details.disponible ? "Masquer" : "Publier"}</Button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}

function PlatForm({ plat, onSave, onCancel }: { plat: Plat | null; onSave: (p: Plat) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Plat>(plat ?? {
    id: "", nom: "", categorie: "Tajines", prix: 0, description: "", disponible: true, tempsPreparation: 15, allergenes: [], halal: true, ventes: 0,
  });
  const [allergene, setAllergene] = useState("");

  function addAllergene() {
    if (!allergene.trim()) return;
    setForm({ ...form, allergenes: [...form.allergenes, allergene.trim()] });
    setAllergene("");
  }

  return (
    <FormShell
      title={plat ? `Modifier « ${plat.nom} »` : "Nouveau plat au menu"}
      subtitle={plat ? "Ajustez la recette, le prix ou la disponibilité." : "Ajoutez un plat aux saveurs du royaume."}
      icon={<UtensilsCrossed className="h-5 w-5" />}
      onSubmit={() => onSave(form)}
      onCancel={onCancel}
      submitLabel={plat ? "Enregistrer" : "Ajouter au menu"}
    >
      <FieldGroup title="Identité du plat">
        <div><Label>Nom du plat</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Tajine Poulet aux Olives" /></div>
        <Row>
          <div>
            <Label>Catégorie</Label>
            <Select value={form.categorie} onValueChange={(v) => setForm({ ...form, categorie: v as Plat["categorie"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Prix (MAD)</Label><Input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: +e.target.value })} /></div>
        </Row>
        <div>
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Décrivez les ingrédients et la préparation…" />
        </div>
      </FieldGroup>

      <FieldGroup title="Préparation">
        <Row>
          <div><Label>Temps préparation (min)</Label><Input type="number" value={form.tempsPreparation} onChange={(e) => setForm({ ...form, tempsPreparation: +e.target.value })} /></div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 pb-2 text-sm"><Switch checked={form.halal} onCheckedChange={(v) => setForm({ ...form, halal: v })} />Halal</label>
            <label className="flex items-center gap-2 pb-2 text-sm"><Switch checked={form.disponible} onCheckedChange={(v) => setForm({ ...form, disponible: v })} />Disponible</label>
          </div>
        </Row>
      </FieldGroup>

      <FieldGroup title="Allergènes">
        <div className="flex gap-2">
          <Input value={allergene} onChange={(e) => setAllergene(e.target.value)} placeholder="Gluten, Œufs, Fruits à coque…" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAllergene(); } }} />
          <Button type="button" variant="outline" className="rounded-full shrink-0" onClick={addAllergene}>Ajouter</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.allergenes.map((a, i) => (
            <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => setForm({ ...form, allergenes: form.allergenes.filter((_, j) => j !== i) })}>
              {a} ×
            </Badge>
          ))}
          {form.allergenes.length === 0 && <span className="text-xs text-muted-foreground">Aucun allergène déclaré</span>}
        </div>
      </FieldGroup>
    </FormShell>
  );
}
