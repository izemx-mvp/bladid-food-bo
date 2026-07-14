import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ShieldCheck, Plus, Edit, Trash2, KeyRound, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { utilisateurs as seed, formatDate, type Utilisateur } from "@/lib/mock/data";
import { toast } from "sonner";
import { FormShell, FieldGroup, Row } from "@/components/backoffice/FormShell";

export const Route = createFileRoute("/_authenticated/utilisateurs")({ component: Page });

const roles: Utilisateur["role"][] = ["Super Admin", "Manager", "Chef cuisine", "Caissier", "Support"];
const roleColor: Record<Utilisateur["role"], string> = {
  "Super Admin": "bg-primary/20 text-primary border-primary/30",
  "Manager": "bg-accent/20 text-accent border-accent/30",
  "Chef cuisine": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  "Caissier": "bg-chart-2/20 text-chart-2 border-chart-2/30",
  "Support": "bg-chart-4/20 text-chart-4 border-chart-4/30",
};

const empty: Utilisateur = { id: "", nom: "", email: "", role: "Manager", actif: true, dernier: new Date().toISOString() };

function Page() {
  const [data, setData] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Utilisateur | null>(null);
  const [form, setForm] = useState<Utilisateur>(empty);
  const [password, setPassword] = useState("");

  function openAdd() { setEditing(null); setForm(empty); setPassword(""); setOpen(true); }
  function openEdit(u: Utilisateur) { setEditing(u); setForm(u); setPassword(""); setOpen(true); }

  function save() {
    if (!form.nom || !form.email) return toast.error("Renseignez tous les champs");
    if (editing) {
      setData((d) => d.map((x) => x.id === editing.id ? { ...form, id: editing.id } : x));
      toast.success("Utilisateur mis à jour");
    } else {
      setData((d) => [{ ...form, id: `u${Date.now()}` }, ...d]);
      toast.success("Utilisateur créé");
    }
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        icon={ShieldCheck}
        title="Utilisateurs & Rôles"
        description={`${data.filter((u) => u.actif).length} utilisateurs actifs sur ${data.length}`}
        actions={<Button className="rounded-full bg-primary text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Ajouter un utilisateur</Button>}
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
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.success(`Lien de réinitialisation envoyé à ${u.email}`)}><KeyRound className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(u)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { setData((d) => d.filter((x) => x.id !== u.id)); toast.success("Utilisateur supprimé"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <FormShell
          title={editing ? `Modifier ${editing.nom}` : "Nouvel utilisateur"}
          subtitle={editing ? "Ajustez le rôle et les accès de ce membre de l'équipe." : "Invitez un nouveau membre à rejoindre le backoffice."}
          icon={<ShieldCheck className="h-5 w-5" />}
          onSubmit={save}
          onCancel={() => setOpen(false)}
          submitLabel={editing ? "Enregistrer" : "Créer et envoyer l'invitation"}
        >
          <FieldGroup title="Identité">
            <Row>
              <div><Label>Nom complet</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Yassine Amrani" /></div>
              <div><Label>Adresse email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="yassine@ladidfood.ma" /></div>
            </Row>
          </FieldGroup>

          <FieldGroup title="Accès & permissions">
            <Row>
              <div>
                <Label>Rôle</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Utilisateur["role"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end"><label className="flex items-center gap-3 pb-2 text-sm"><Switch checked={form.actif} onCheckedChange={(v) => setForm({ ...form, actif: v })} />Compte actif</label></div>
            </Row>
            {!editing && (
              <div>
                <Label>Mot de passe temporaire</Label>
                <Input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Généré automatiquement si vide" />
                <p className="text-[10px] text-muted-foreground mt-1">Un e-mail d'invitation avec ce mot de passe sera envoyé à l'utilisateur.</p>
              </div>
            )}
          </FieldGroup>
        </FormShell>
      </Dialog>
    </div>
  );
}
