import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { FileBarChart, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ventes7j } from "@/lib/mock/data";

export const Route = createFileRoute("/_authenticated/rapports")({ component: Page });

const rapports = [
  { titre: "Rapport de ventes", desc: "CA, panier moyen, commandes par jour", icon: FileSpreadsheet },
  { titre: "Rapport produits", desc: "Ventes par plat, marges, popularité", icon: FileSpreadsheet },
  { titre: "Rapport livreurs", desc: "Livraisons, gains, temps moyen", icon: FileSpreadsheet },
  { titre: "Rapport fidélité", desc: "Points distribués, récompenses utilisées", icon: FileText },
  { titre: "Rapport promotions", desc: "Codes utilisés, ROI par campagne", icon: FileText },
  { titre: "Rapport TVA", desc: "Détail fiscal mensuel", icon: FileText },
];

function Page() {
  function downloadReport(title: string, type: "csv" | "pdf") {
    const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const content = type === "csv"
      ? ["jour,ventes,commandes", ...ventes7j.map((v) => `${v.jour},${v.ventes},${v.commandes}`)].join("\n")
      : `${title}\n\nLadid Food Backoffice\n\n${ventes7j.map((v) => `${v.jour} — ${v.ventes} MAD — ${v.commandes} commandes`).join("\n")}`;
    const blob = new Blob([content], { type: type === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.${type === "csv" ? "csv" : "pdf.txt"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Export ${type.toUpperCase()} téléchargé`, { description: title });
  }

  return (
    <div>
      <PageHeader icon={FileBarChart} title="Rapports & Exports" description="Analysez la performance de votre restaurant." />

      <Card className="glass p-6 mb-6">
        <h3 className="font-display text-lg mb-4">Ventes vs Commandes (7 derniers jours)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={ventes7j}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
            <XAxis dataKey="jour" stroke="oklch(0.72 0.02 240)" fontSize={12} />
            <YAxis stroke="oklch(0.72 0.02 240)" fontSize={12} />
            <Tooltip contentStyle={{ background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.78 0.14 190 / 0.3)", borderRadius: 12 }} />
            <Bar dataKey="ventes" fill="oklch(0.78 0.14 190)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="commandes" fill="oklch(0.85 0.15 90)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rapports.map((r) => (
          <Card key={r.titre} className="glass p-6 group hover:glow transition-all">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4"><r.icon className="h-6 w-6" /></div>
            <h3 className="font-display text-lg mb-1">{r.titre}</h3>
            <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => downloadReport(r.titre, "csv")}><Download className="h-3 w-3 mr-1" />CSV</Button>
              <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => downloadReport(r.titre, "pdf")}><Download className="h-3 w-3 mr-1" />PDF</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
