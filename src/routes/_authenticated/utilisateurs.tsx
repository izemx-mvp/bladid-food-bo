import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ShieldCheck, Plus, Edit, Trash2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { utilisateurs as seed, formatDate, type Utilisateur } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/utilisateurs")({ component: Page });

const roles: Utilisateur["role"][] = ["Super Admin", "Manager", "Chef cuisine", "Caissier", "Support"];
const roleColor: Record<Utilisateur["role"], string> = {
  "Super Admin": "bg-primary/20 text-primary border-primary/30",
  "Manager": "bg-accent/20 text-accent border-accent/30",
  "Chef cuisine": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  "Caissier": "bg-chart-2/20 text-chart-2 border-chart-2/30",
  "Support": "bg-chart-4/20 text-chart-4 border-chart-4/30",
};

function Page() {
  const [data, setData] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Utilisateur>({ id: "", nom: "", email: "", role: "Manager", actif: true, dernier: new Date().toISOString() });

  function add() {
    if (!form.nom || !form.email) return toast.error("Renseignez tous les champs");
    setData((d) => [{ ...form, id: `u${Date.now()}` }, ...d]);
    toast.success("Utilisateur créé"); setOpen(false); setForm({ id: "", nom: "", email: "", role: "Manager", actif: true, dernier: new Date().toISOString() });
  }

  return (
    <div>
      <PageHeader
        icon={ShieldCheck}
        title="Utilisateurs & Rôles"
        description={`${data.filter((u) => u.actif).length} utilisateurs actifs`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Ajouter</Button></DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader><DialogTitle className="font-display text-2xl">Nouvel utilisateur</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Nom complet</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div>
                  <Label>Rôle</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Utilisateur["role"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter><Button className="rounded-full bg-primary text-primary-foreground" onClick={add}>Créer</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((u) => (
              <TableRow key={u.id} className="border-border/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-semibold text-xs">
                      {u.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="font-medium">{u.nom}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell><Badge className={roleColor[u.role] + " border"}>{u.role}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(u.dernier)}</TableCell>
                <TableCell><Switch checked={u.actif} onCheckedChange={() => { setData((d) => d.map((x) => x.id === u.id ? { ...x, actif: !x.actif } : x)); toast.success("Statut mis à jour"); }} /></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.success("Lien de réinitialisation envoyé")}><KeyRound className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { setData((d) => d.filter((x) => x.id !== u.id)); toast.success("Supprimé"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
