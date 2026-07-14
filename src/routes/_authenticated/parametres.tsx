import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/parametres")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader icon={Settings2} title="Paramètres" description="Configuration générale du restaurant." />

      <Tabs defaultValue="general">
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="livraison">Livraison</TabsTrigger>
          <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="glass p-6 space-y-4 max-w-2xl">
            <div><Label>Nom du restaurant</Label><Input defaultValue="Ladid Food" /></div>
            <div><Label>Slogan</Label><Input defaultValue="Cuisine marocaine maison, préparée fraîche chaque jour." /></div>
            <div><Label>Description</Label><Textarea rows={3} defaultValue="Ladid Food est un restaurant de cuisine marocaine authentique situé à Kénitra…" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Téléphone</Label><Input defaultValue="0537-000-000" /></div>
              <div><Label>Email</Label><Input defaultValue="contact@ladidfood.ma" /></div>
            </div>
            <div><Label>Adresse principale</Label><Input defaultValue="23 Avenue Mohammed V, Kénitra, Maroc" /></div>
            <div><Label>Horaires</Label><Input defaultValue="10h00 – 22h00 tous les jours" /></div>
            <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => toast.success("Paramètres enregistrés")}>Enregistrer</Button>
          </Card>
        </TabsContent>

        <TabsContent value="livraison">
          <Card className="glass p-6 space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Frais de livraison (MAD)</Label><Input type="number" defaultValue="15" /></div>
              <div><Label>Livraison offerte dès (MAD)</Label><Input type="number" defaultValue="150" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Rayon de livraison (km)</Label><Input type="number" defaultValue="8" /></div>
              <div><Label>Temps moyen (min)</Label><Input type="number" defaultValue="35" /></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
              <div><div className="font-medium">Livraison le dimanche</div><div className="text-xs text-muted-foreground">Activer la livraison le dimanche</div></div>
              <Switch defaultChecked />
            </div>
            <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => toast.success("Enregistré")}>Enregistrer</Button>
          </Card>
        </TabsContent>

        <TabsContent value="fiscal">
          <Card className="glass p-6 space-y-4 max-w-2xl">
            <div><Label>Raison sociale</Label><Input defaultValue="LADID FOOD SARL AU" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>ICE</Label><Input defaultValue="002438572000045" /></div>
              <div><Label>RC</Label><Input defaultValue="45892" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Taux TVA (%)</Label><Input type="number" defaultValue="20" /></div>
              <div><Label>IF</Label><Input defaultValue="40125874" /></div>
            </div>
            <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => toast.success("Enregistré")}>Enregistrer</Button>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {[
              { nom: "WhatsApp Business API", desc: "Recevoir les commandes WhatsApp", actif: true },
              { nom: "Stripe", desc: "Paiement en ligne par carte", actif: true },
              { nom: "CMI (Maroc)", desc: "Paiement bancaire local", actif: true },
              { nom: "Google Maps", desc: "Géolocalisation livreurs", actif: true },
              { nom: "Twilio SMS", desc: "SMS de confirmation", actif: false },
              { nom: "Firebase Push", desc: "Notifications app mobile", actif: true },
            ].map((i) => (
              <Card key={i.nom} className="glass p-5 flex items-center justify-between">
                <div>
                  <div className="font-medium">{i.nom}</div>
                  <div className="text-xs text-muted-foreground">{i.desc}</div>
                </div>
                <Switch defaultChecked={i.actif} />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
