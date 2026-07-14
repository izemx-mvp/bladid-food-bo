import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { livreurs, commandes, formatMAD, formatDate } from "@/lib/mock/data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ArrowLeft, Bike, Phone, MapPin, Star, Clock, Route as RouteIcon, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveCityMap, buildMapLivreurs } from "@/components/backoffice/LiveCityMap";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/livreurs/$id")({ component: Detail });

function Detail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const l = livreurs.find((x) => x.id === id);

  const activeCourse = useMemo(
    () => commandes.find((c) => c.livreur === l?.nom && (c.statut === "En livraison" || c.statut === "Prête")),
    [l]
  );

  const commandesByLivreur = useMemo(() => {
    const m: Record<string, { numero: string; client: string; adresse: string }> = {};
    if (l && activeCourse) m[l.nom] = { numero: activeCourse.numero, client: activeCourse.client, adresse: activeCourse.adresse };
    return m;
  }, [l, activeCourse]);

  const mapPoints = useMemo(
    () => (l ? buildMapLivreurs([l], commandesByLivreur) : []),
    [l, commandesByLivreur]
  );

  if (!l) return <div className="p-8">Introuvable</div>;

  // force focus in delivery mode when livreur has an active course
  const focused = mapPoints[0]
    ? {
        ...mapPoints[0],
        statut: activeCourse ? ("En livraison" as const) : mapPoints[0].statut,
      }
    : null;

  const courses = commandes.filter((c) => c.livreur === l.nom).slice(0, 10);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/livreurs" })} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" />Retour aux livreurs</Button>
      <PageHeader
        icon={Bike}
        title={l.nom}
        description={`${l.vehicule} · ${l.zone} · ${l.immatriculation}`}
        actions={
          <>
            <Button variant="outline" className="rounded-full" onClick={() => toast.success(`Appel vers ${l.telephone}`)}><Phone className="h-4 w-4 mr-1" />Appeler</Button>
            <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => toast.success("Message envoyé au livreur")}>Message</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* MAP - big, spans 2 cols */}
        <Card className="glass p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-lg">Suivi en direct</h3>
              <p className="text-xs text-muted-foreground">
                {activeCourse ? `Course ${activeCourse.numero} en cours` : "Livreur disponible — aucune course active"}
              </p>
            </div>
            <Badge className="bg-primary/20 text-primary border border-primary/30">{l.statut}</Badge>
          </div>
          <LiveCityMap livreurs={mapPoints} focus={focused} height={520} />
        </Card>

        {/* SIDE: Course details + stats */}
        <div className="space-y-4">
          {activeCourse ? (
            <Card className="glass p-6">
              <div className="text-xs uppercase text-primary font-semibold mb-2">Course active</div>
              <div className="font-mono text-lg text-primary mb-3">{activeCourse.numero}</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />{activeCourse.client}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{activeCourse.telephone}</div>
                <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /><span className="flex-1">{activeCourse.adresse}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/50 text-center">
                <div>
                  <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-sm font-semibold">14 min</div>
                  <div className="text-[10px] text-muted-foreground">ETA</div>
                </div>
                <div>
                  <RouteIcon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-sm font-semibold">2.4 km</div>
                  <div className="text-[10px] text-muted-foreground">Distance</div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-base">{formatMAD(activeCourse.total)}</div>
                  <div className="text-[10px] text-muted-foreground">Panier</div>
                </div>
              </div>
              <Button className="w-full rounded-full bg-primary text-primary-foreground mt-3" asChild>
                <Link to="/commandes/$id" params={{ id: activeCourse.id }}>Voir la commande</Link>
              </Button>
            </Card>
          ) : (
            <Card className="glass p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-chart-5/20 text-chart-5 flex items-center justify-center">
                  <Bike className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Disponible</div>
                  <div className="text-xs text-muted-foreground">Prêt à recevoir une commande</div>
                </div>
              </div>
              <Button className="w-full rounded-full bg-primary text-primary-foreground mt-4" onClick={() => navigate({ to: "/commandes" })}>Voir les commandes à assigner</Button>
            </Card>
          )}

          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-display text-xl">
                {l.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent"><Star className="h-4 w-4 fill-current" /><span className="font-semibold">{l.note.toFixed(1)}</span></div>
                <div className="text-xs text-muted-foreground">{l.livraisonsAujourdhui} livraisons aujourd'hui</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Gains jour</span><span className="font-semibold text-primary">{formatMAD(l.gainsJour)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gains mois</span><span className="font-semibold">{formatMAD(l.gainsMois)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Temps moyen</span><span className="font-semibold">18 min</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Taux réussite</span><span className="font-semibold text-chart-5">98,4%</span></div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="glass p-6 mt-4">
        <h3 className="font-display text-lg mb-4">Courses récentes</h3>
        <div className="space-y-2">
          {courses.length === 0 ? <div className="text-sm text-muted-foreground">Aucune course récente</div> :
            courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition">
                <div>
                  <div className="font-mono text-xs text-primary">{c.numero}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(c.date)} · {c.adresse.split(",")[1]?.trim()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">{formatMAD(c.total)}</div>
                  <Badge variant="outline">{c.statut}</Badge>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
