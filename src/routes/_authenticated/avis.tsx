import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { Star, MessageSquare, Eye, EyeOff, Reply } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { avis as seed, formatDate, type Avis } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/avis")({ component: Page });

function Page() {
  const [data, setData] = useState(seed);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [text, setText] = useState("");
  const moyenne = (data.reduce((s, a) => s + a.note, 0) / data.length).toFixed(2);

  return (
    <div>
      <PageHeader
        icon={Star}
        title="Avis clients"
        description={`Note moyenne : ${moyenne}/5 · ${data.length} avis reçus`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((a) => (
          <Card key={a.id} className="glass p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground text-xs font-semibold">
                  {a.client.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-sm">{a.client}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(a.date)}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < a.note ? "text-accent fill-accent" : "text-muted"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm mb-3">« {a.commentaire} »</p>
            {a.reponse && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm mb-3">
                <div className="text-xs text-primary font-semibold mb-1">Réponse Ladid Food</div>
                {a.reponse}
              </div>
            )}
            {replyTo === a.id && (
              <div className="space-y-2 mb-3">
                <Textarea placeholder="Merci pour votre retour…" value={text} onChange={(e) => setText(e.target.value)} rows={3} />
                <Button size="sm" className="rounded-full bg-primary text-primary-foreground" onClick={() => { setData((d) => d.map((x) => x.id === a.id ? { ...x, reponse: text } : x)); setReplyTo(null); setText(""); toast.success("Réponse publiée"); }}>Publier la réponse</Button>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <Badge variant="outline">{a.publie ? "Publié" : "Masqué"}</Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setReplyTo(a.id)}><Reply className="h-3 w-3 mr-1" />Répondre</Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setData((d) => d.map((x) => x.id === a.id ? { ...x, publie: !x.publie } : x)); toast.success("Visibilité mise à jour"); }}>
                  {a.publie ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
