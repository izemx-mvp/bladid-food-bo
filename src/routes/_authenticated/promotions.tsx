import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { TicketPercent, Plus, Copy, Trash2, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { promotions as seed, formatDate, type Promotion } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/promotions")({ component: Page });

function Page() {
  const [data, setData] = useState(seed);
  const [open, setOpen] = useState(false);

  function add(p: Promotion) {
    setData((d) => [{ ...p, id: `pr${Date.now()}`, utilisations: 0 }, ...d]);
    toast.success("Code promo créé");
    setOpen(false);
  }

  function toggle(p: Promotion) {
    setData((d) => d.map((x) => x.id === p.id ? { ...x, actif: !x.actif } : x));
    toast.success(`${p.code} ${!p.actif ? "activé" : "désactivé"}`);
  }

  function remove(p: Promotion) {
    setData((d) => d.filter((x) => x.id !== p.id));
    toast.success("Code supprimé");
  }

  return (
    <div>
      <PageHeader
        icon={TicketPercent}
        title="Promotions & Codes"
        description={`${data.filter((p) => p.actif).length} codes actifs`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nouveau code</Button></DialogTrigger>
            <PromoDialog onSave={add} />
          </Dialog>
        }
      />

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Utilisations</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id} className="border-border/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-primary">{p.code}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { navigator.clipboard?.writeText(p.code); toast.success("Copié"); }}><Copy className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                <TableCell className="font-semibold">
                  {p.type === "Pourcentage" ? `${p.valeur}%` : p.type === "Montant fixe" ? `${p.valeur} MAD` : "—"}
                </TableCell>
                <TableCell>
                  <div className="text-sm">{p.utilisations} <span className="text-muted-foreground text-xs">/ {p.limite}</span></div>
                  <div className="h-1 rounded-full bg-secondary overflow-hidden mt-1 w-24">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (p.utilisations / p.limite) * 100)}%` }} />
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(p.debut).slice(0, 10)} → {formatDate(p.fin).slice(0, 10)}</TableCell>
                <TableCell><Switch checked={p.actif} onCheckedChange={() => toggle(p)} /></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(p)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function PromoDialog({ onSave }: { onSave: (p: Promotion) => void }) {
  const [form, setForm] = useState<Promotion>({ id: "", code: "", type: "Pourcentage", valeur: 10, utilisations: 0, limite: 500, debut: new Date().toISOString(), fin: new Date(Date.now() + 30 * 864e5).toISOString(), actif: true });
  return (
    <DialogContent className="glass">
      <DialogHeader><DialogTitle className="font-display text-2xl">Nouveau code promo</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Code</Label>
          <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="ETE2026" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Promotion["type"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pourcentage">Pourcentage</SelectItem>
                <SelectItem value="Montant fixe">Montant fixe</SelectItem>
                <SelectItem value="Livraison offerte">Livraison offerte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Valeur</Label>
            <Input type="number" value={form.valeur} onChange={(e) => setForm({ ...form, valeur: +e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Limite d'utilisation</Label>
          <Input type="number" value={form.limite} onChange={(e) => setForm({ ...form, limite: +e.target.value })} />
        </div>
      </div>
      <DialogFooter>
        <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => onSave(form)}>Créer le code</Button>
      </DialogFooter>
    </DialogContent>
  );
}
