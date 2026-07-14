import { useEffect, useState } from "react";
import { MapPin, Navigation2, Home, Bike as BikeIcon, Clock, Zap, Route as RouteIcon, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type MapLivreur = {
  id: string;
  nom: string;
  telephone?: string;
  x: number; // 0..100 position on map
  y: number;
  destX?: number;
  destY?: number;
  statut: "En ligne" | "En livraison" | "En pause" | "Hors ligne";
  vehicule?: string;
  commande?: string;
  client?: string;
  eta?: number; // minutes
  distance?: number; // km
};

const RESTAURANT = { x: 50, y: 50, label: "Ladid Food — Kénitra Centre" };

// deterministic pseudo positions across the "city"
function seedPos(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 131 + id.charCodeAt(i)) >>> 0;
  const x = 12 + (h % 76);
  const y = 12 + ((h >>> 8) % 76);
  const dx = 12 + ((h >>> 16) % 76);
  const dy = 12 + ((h >>> 24) % 76);
  return { x, y, dx, dy };
}

export function buildMapLivreurs(
  livreurs: { id: string; nom: string; statut: MapLivreur["statut"]; vehicule?: string; telephone?: string }[],
  commandesByLivreur?: Record<string, { numero: string; client: string; adresse: string }>
): MapLivreur[] {
  return livreurs.map((l) => {
    const p = seedPos(l.id);
    const cmd = commandesByLivreur?.[l.nom];
    const eta = 4 + (p.x % 22);
    const distance = +(0.4 + ((p.y % 40) / 10)).toFixed(1);
    if (l.statut === "En livraison") {
      return {
        id: l.id,
        nom: l.nom,
        telephone: l.telephone,
        vehicule: l.vehicule,
        statut: l.statut,
        x: p.x,
        y: p.y,
        destX: p.dx,
        destY: p.dy,
        commande: cmd?.numero ?? `#LDF-${2600 + (p.x % 32)}`,
        client: cmd?.client ?? "Client Ladid",
        eta,
        distance,
      };
    }
    return {
      id: l.id,
      nom: l.nom,
      telephone: l.telephone,
      vehicule: l.vehicule,
      statut: l.statut,
      x: p.x,
      y: p.y,
    };
  });
}

const statutFill: Record<MapLivreur["statut"], string> = {
  "En ligne": "var(--chart-5)",
  "En livraison": "var(--primary)",
  "En pause": "var(--accent)",
  "Hors ligne": "var(--muted-foreground)",
};

export function LiveCityMap({
  livreurs,
  height = 520,
  focus,
  onSelect,
  selectedId,
}: {
  livreurs: MapLivreur[];
  height?: number;
  focus?: MapLivreur | null;
  onSelect?: (l: MapLivreur) => void;
  selectedId?: string;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1500);
    return () => clearInterval(t);
  }, []);

  // when tracking a single livreur, smoothly move him toward destination
  const focusLive = focus
    ? (() => {
        if (!focus.destX || !focus.destY) return focus;
        const progress = Math.min(0.95, ((tick % 30) / 30) * 0.9 + 0.05);
        return {
          ...focus,
          x: focus.x + (focus.destX - focus.x) * progress,
          y: focus.y + (focus.destY - focus.y) * progress,
        };
      })()
    : null;

  const shown = focus ? livreurs.map((l) => (l.id === focus.id ? focusLive! : l)) : livreurs;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-border/50"
      style={{
        height,
        background:
          "radial-gradient(1200px 500px at 50% 100%, color-mix(in oklab, var(--primary) 10%, transparent), transparent), linear-gradient(180deg, color-mix(in oklab, var(--card) 88%, transparent), color-mix(in oklab, var(--secondary) 60%, transparent))",
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* subtle grid = blocks */}
        <defs>
          <pattern id="blocks" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="none" />
            <path d="M8 0H0v8" stroke="color-mix(in oklab, var(--primary) 12%, transparent)" strokeWidth="0.15" fill="none" />
          </pattern>
          <linearGradient id="road" x1="0" x2="1">
            <stop offset="0" stopColor="color-mix(in oklab, var(--foreground) 8%, transparent)" />
            <stop offset="1" stopColor="color-mix(in oklab, var(--foreground) 4%, transparent)" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#blocks)" />

        {/* parks / squares */}
        <circle cx="22" cy="28" r="6" fill="color-mix(in oklab, var(--chart-5) 18%, transparent)" />
        <circle cx="78" cy="72" r="8" fill="color-mix(in oklab, var(--chart-5) 15%, transparent)" />
        <rect x="60" y="18" width="14" height="10" rx="1.5" fill="color-mix(in oklab, var(--accent) 18%, transparent)" />

        {/* main avenues */}
        <path d="M0 50 L100 50" stroke="url(#road)" strokeWidth="2.2" />
        <path d="M50 0 L50 100" stroke="url(#road)" strokeWidth="2.2" />
        <path d="M0 20 L100 20" stroke="url(#road)" strokeWidth="1.2" />
        <path d="M0 80 L100 80" stroke="url(#road)" strokeWidth="1.2" />
        <path d="M20 0 L20 100" stroke="url(#road)" strokeWidth="1.2" />
        <path d="M80 0 L80 100" stroke="url(#road)" strokeWidth="1.2" />
        {/* diagonals */}
        <path d="M0 0 L100 100" stroke="url(#road)" strokeWidth="0.6" opacity="0.6" />
        <path d="M0 100 L100 0" stroke="url(#road)" strokeWidth="0.6" opacity="0.6" />

        {/* route line for focus */}
        {focus?.destX !== undefined && focus?.destY !== undefined && (
          <>
            <path
              d={`M ${focus.x} ${focus.y} Q ${(focus.x + focus.destX) / 2 + 6} ${(focus.y + focus.destY) / 2 - 8}, ${focus.destX} ${focus.destY}`}
              stroke="var(--primary)"
              strokeWidth="0.8"
              fill="none"
              strokeDasharray="1.5 1.2"
              opacity="0.9"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1.2s" repeatCount="indefinite" />
            </path>
            {/* destination marker */}
            <circle cx={focus.destX} cy={focus.destY} r="1.2" fill="var(--accent)" />
            <circle cx={focus.destX} cy={focus.destY} r="3" fill="none" stroke="var(--accent)" strokeWidth="0.4" opacity="0.6">
              <animate attributeName="r" from="1.5" to="5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>

      {/* Restaurant pin */}
      <MapNode x={RESTAURANT.x} y={RESTAURANT.y}>
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground shadow-lg ring-4 ring-background">
            <Home className="h-4 w-4" />
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-semibold bg-background/90 backdrop-blur px-2 py-0.5 rounded-full border border-border">
            Ladid Food
          </div>
        </div>
      </MapNode>

      {/* Livreurs */}
      {shown.map((l) => {
        const isFocus = focus?.id === l.id;
        const isSelected = selectedId === l.id;
        return (
          <MapNode key={l.id} x={l.x} y={l.y}>
            <button
              type="button"
              onClick={() => onSelect?.(l)}
              className="group relative -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ cursor: onSelect ? "pointer" : "default" }}
            >
              {(l.statut === "En livraison" || isFocus) && (
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: `color-mix(in oklab, ${statutFill[l.statut]} 60%, transparent)` }}
                />
              )}
              <div
                className={`relative h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-background transition ${isSelected ? "scale-125" : "group-hover:scale-110"}`}
                style={{ background: statutFill[l.statut] }}
                title={l.nom}
              >
                <BikeIcon className="h-3.5 w-3.5" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] bg-background/90 backdrop-blur px-1.5 py-0.5 rounded-full border border-border opacity-0 group-hover:opacity-100 transition">
                {l.nom.split(" ")[0]}
              </div>
            </button>
          </MapNode>
        );
      })}

      {/* Legend / overlays */}
      <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md rounded-2xl border border-border/50 px-3 py-2 flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--chart-5)" }} />
          En ligne
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
          En livraison
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
          En pause
        </span>
      </div>

      <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md rounded-2xl border border-border/50 px-3 py-2 flex items-center gap-2 text-[11px]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        Suivi GPS temps réel · Kénitra
      </div>

      {/* Focus panel */}
      {focus && (
        <div className="absolute bottom-3 left-3 right-3 md:right-auto md:w-96 bg-background/90 backdrop-blur-xl border border-border/60 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-teal-glow flex items-center justify-center text-primary-foreground font-display">
              {focus.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{focus.nom}</span>
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                  {focus.statut}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {focus.commande ? (
                  <>
                    Course <span className="font-mono text-primary">{focus.commande}</span> · {focus.client}
                  </>
                ) : (
                  <>{focus.vehicule ?? "Scooter"} · Zone Kénitra</>
                )}
              </div>
            </div>
          </div>

          {focus.statut === "En livraison" && (
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-secondary/60">
                <Clock className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold">{focus.eta} min</div>
                <div className="text-[10px] text-muted-foreground">ETA</div>
              </div>
              <div className="p-2 rounded-xl bg-secondary/60">
                <RouteIcon className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold">{focus.distance} km</div>
                <div className="text-[10px] text-muted-foreground">Restant</div>
              </div>
              <div className="p-2 rounded-xl bg-secondary/60">
                <Zap className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold">42 km/h</div>
                <div className="text-[10px] text-muted-foreground">Vitesse</div>
              </div>
            </div>
          )}

          {focus.telephone && (
            <Button size="sm" variant="outline" className="w-full rounded-full mt-3">
              <Phone className="h-3.5 w-3.5 mr-1" /> Appeler {focus.telephone}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function MapNode({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {children}
    </div>
  );
}

// silence unused import warning
export const _mapUnused = { MapPin, Navigation2 };
