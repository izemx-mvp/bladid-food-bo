import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { BellRing, Send, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notifsPush as seed, formatDate, type NotifPush } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications")({ component: Page });

function Page() {
  const [data, setData] = useState(seed);
  const [titre, setTitre] = useState("🎉 Offre spéciale");
  const [message, setMessage] = useState("");
  const [cible, setCible] = useState<NotifPush["cible"]>("Tous les clients");

  function send() {
    if (!message) return toast.error("Écrivez un message");
    const n: NotifPush = { id: `n${Date.now()}`, titre, message, cible, envoyee: 500 + Math.floor(Math.random() * 2000), ouvertes: 0, date: new Date().toISOString() };
    setData((d) => [n, ...d]);
    toast.success("Notification envoyée !");
    setMessage("");
  }

  return (
    <div>
      <PageHeader icon={BellRing} title="Notifications push" description="Communiquez avec vos clients et livreurs en temps réel." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass p-6 lg:col-span-1">
          <h3 className="font-display text-lg mb-4">Nouvelle campagne</h3>
          <div className="space-y-3">
            <div>
              <Label>Titre</Label>
              <Input value={titre} onChange={(e) => setTitre(e.target.value)} />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ex : -20% sur les tajines ce soir !" />
            </div>
            <div>
              <Label>Cible</Label>
              <Select value={cible} onValueChange={(v) => setCible(v as NotifPush["cible"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Tous les clients","Clients VIP","Livreurs","Clients inactifs"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full rounded-full bg-primary text-primary-foreground" onClick={send}><Send className="h-4 w-4 mr-1" />Envoyer maintenant</Button>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-accent/10 border border-accent/20">
            <div className="text-xs uppercase text-accent mb-2 font-semibold">Aperçu</div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display shrink-0">L</div>
              <div>
                <div className="text-xs text-muted-foreground">Ladid Food · maintenant</div>
                <div className="font-semibold text-sm">{titre}</div>
                <div className="text-xs text-muted-foreground">{message || "Votre message apparaîtra ici"}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass p-6 lg:col-span-2">
          <h3 className="font-display text-lg mb-4">Historique des campagnes</h3>
          <div className="space-y-3">
            {data.map((n) => (
              <div key={n.id} className="p-4 rounded-xl bg-secondary/40 border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{n.titre}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(n.date)}</div>
                  </div>
                  <Badge variant="outline"><Users className="h-3 w-3 mr-1" />{n.cible}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-3">{n.message}</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Envoyée : </span><span className="font-semibold">{n.envoyee.toLocaleString("fr-FR")}</span></div>
                  <div><span className="text-muted-foreground">Ouvertes : </span><span className="font-semibold text-primary">{n.ouvertes.toLocaleString("fr-FR")}</span></div>
                  <div><span className="text-muted-foreground">Taux : </span><span className="font-semibold">{n.envoyee > 0 ? Math.round((n.ouvertes / n.envoyee) * 100) : 0}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
