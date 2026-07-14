import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { LayoutDashboard, TrendingUp, ShoppingBag, Users, Bike, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { commandes, ventes7j, canauxData, platsData, livreurs, formatMAD, formatDate } from "@/lib/mock/data";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const COLORS = ["oklch(0.78 0.14 190)", "oklch(0.85 0.15 90)", "oklch(0.7 0.18 30)", "oklch(0.65 0.2 320)"];

function Dashboard() {
  const caJour = ventes7j[ventes7j.length - 1]?.ventes ?? 0;
  const cmdJour = ventes7j[ventes7j.length - 1]?.commandes ?? 0;
  const clientsActifs = 1247;
  const livreursOnline = livreurs.filter((l) => l.statut === "En ligne" || l.statut === "En livraison").length;
  const recentes = [...commandes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const topPlats = [...platsData].sort((a, b) => b.ventes - a.ventes).slice(0, 5);

  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title="Bienvenue, Yassine 👋"
        description="Voici l'activité de Ladid Food en temps réel."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Chiffre d'affaires du jour" value={formatMAD(caJour)} trend="+12,4%" up icon={TrendingUp} />
        <StatCard label="Commandes aujourd'hui" value={String(cmdJour)} trend="+8" up icon={ShoppingBag} />
        <StatCard label="Clients actifs (30j)" value={clientsActifs.toLocaleString("fr-FR")} trend="+3,2%" up icon={Users} />
        <StatCard label="Livreurs en ligne" value={`${livreursOnline}/${livreurs.length}`} trend="-2" up={false} icon={Bike} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="glass p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg">Ventes des 7 derniers jours</h3>
              <p className="text-xs text-muted-foreground">Chiffre d'affaires et volumes</p>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">MAD</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={ventes7j}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="jour" stroke="oklch(0.72 0.02 240)" fontSize={12} />
              <YAxis stroke="oklch(0.72 0.02 240)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.78 0.14 190 / 0.3)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="ventes" stroke="oklch(0.78 0.14 190)" strokeWidth={3} dot={{ fill: "oklch(0.78 0.14 190)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6">
          <h3 className="font-display text-lg mb-1">Canaux de commande</h3>
          <p className="text-xs text-muted-foreground mb-4">Répartition sur 30 jours</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={canauxData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                {canauxData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.78 0.14 190 / 0.3)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {canauxData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span>{c.name}</span>
                </div>
                <span className="text-muted-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg">Flux de commandes en direct</h3>
              <p className="text-xs text-muted-foreground">Dernières activités</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              En direct
            </div>
          </div>
          <div className="space-y-3">
            {recentes.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition">
                <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
                  {c.numero.slice(-3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.client}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />{formatDate(c.date)} · {c.canal}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatMAD(c.total)}</div>
                  <Badge variant="outline" className="text-[10px] mt-1">{c.statut}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="font-display text-lg mb-1">Top plats</h3>
          <p className="text-xs text-muted-foreground mb-4">Meilleures ventes du mois</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topPlats} layout="vertical" margin={{ left: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="nom" width={120} stroke="oklch(0.72 0.02 240)" fontSize={11} tickFormatter={(v) => v.split(" ").slice(0, 2).join(" ")} />
              <Bar dataKey="ventes" fill="oklch(0.78 0.14 190)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, up, icon: Icon }: { label: string; value: string; trend: string; up: boolean; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="glass p-5 relative overflow-hidden group hover:glow transition-all">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition" />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="outline" className={up ? "border-primary/30 text-primary" : "border-destructive/30 text-destructive"}>
            {up ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {trend}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className="text-2xl font-display font-semibold">{value}</div>
      </div>
    </Card>
  );
}
