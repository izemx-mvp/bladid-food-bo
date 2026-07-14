import { useEffect, useMemo, useState } from "react";
import { Home, Bike as BikeIcon, Clock, Zap, Route as RouteIcon, Phone, Navigation2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

export type MapLivreur = {
  id: string;
  nom: string;
  telephone?: string;
  x: number; // 0..100 legacy virtual coord
  y: number;
  destX?: number;
  destY?: number;
  statut: "En ligne" | "En livraison" | "En pause" | "Hors ligne";
  vehicule?: string;
  commande?: string;
  client?: string;
  eta?: number;
  distance?: number;
  adresse?: string;
};

// Kénitra center + bounds used to project the pseudo-coords into real geo
const CENTER: [number, number] = [34.261, -6.5802];
const LAT_SPAN = 0.05;
const LNG_SPAN = 0.07;

function toLatLng(x: number, y: number): [number, number] {
  // x,y in 0..100 -> around center
  const lat = CENTER[0] + LAT_SPAN * (0.5 - y / 100);
  const lng = CENTER[1] + LNG_SPAN * (x / 100 - 0.5);
  return [lat, lng];
}

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
        adresse: cmd?.adresse ?? "Av. Mohammed V, Kénitra",
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

const statutColor: Record<MapLivreur["statut"], string> = {
  "En ligne": "#10b981",
  "En livraison": "#0d9488",
  "En pause": "#f59e0b",
  "Hors ligne": "#6b7280",
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-border/50 shadow-inner"
      style={{ height }}
    >
      {mounted ? (
        <LeafletMap
          livreurs={livreurs}
          focus={focus ?? null}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
          Chargement de la carte…
        </div>
      )}

      {/* Legend */}
      <div className="pointer-events-none absolute top-3 left-3 z-[500] bg-background/90 backdrop-blur-md rounded-2xl border border-border/50 px-3 py-2 flex items-center gap-3 text-[11px] shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: statutColor["En ligne"] }} />
          En ligne
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: statutColor["En livraison"] }} />
          En livraison
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: statutColor["En pause"] }} />
          En pause
        </span>
      </div>

      <div className="pointer-events-none absolute top-3 right-3 z-[500] bg-background/90 backdrop-blur-md rounded-2xl border border-border/50 px-3 py-2 flex items-center gap-2 text-[11px] shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        Suivi GPS temps réel · Kénitra
      </div>

      {/* Focus panel */}
      {focus && (
        <div className="absolute bottom-3 left-3 right-3 md:right-auto md:w-96 z-[500] bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl p-4 shadow-2xl">
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
              {focus.adresse && (
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Navigation2 className="h-3 w-3" /> {focus.adresse}
                </div>
              )}
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

function LeafletMap({
  livreurs,
  focus,
  onSelect,
  selectedId,
}: {
  livreurs: MapLivreur[];
  focus: MapLivreur | null;
  onSelect?: (l: MapLivreur) => void;
  selectedId?: string;
}) {
  // Import react-leaflet only on client to avoid SSR "window is not defined"
  const RL = require("react-leaflet") as typeof import("react-leaflet");
  const L = require("leaflet") as typeof import("leaflet");
  const { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } = RL;

  const restaurantPos = CENTER;

  const bikeIcon = (color: string, pulse: boolean, selected: boolean) =>
    L.divIcon({
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      html: `
        <div style="position:relative;width:36px;height:36px;">
          ${pulse ? `<span style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:.35;animation:ldfPing 1.6s cubic-bezier(0,0,.2,1) infinite;"></span>` : ""}
          <div style="position:absolute;inset:4px;border-radius:9999px;background:${color};box-shadow:0 4px 14px ${color}55, 0 0 0 3px #fff;display:flex;align-items:center;justify-content:center;color:#fff;transform:scale(${selected ? 1.15 : 1});transition:transform .2s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
          </div>
        </div>`,
    });

  const restaurantIcon = L.divIcon({
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
      <div style="position:relative;width:44px;height:44px;">
        <div style="position:absolute;inset:0;border-radius:9999px;background:linear-gradient(135deg,#0d9488,#14b8a6);box-shadow:0 6px 18px rgba(13,148,136,.45),0 0 0 4px #fff;display:flex;align-items:center;justify-content:center;color:#fff;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      </div>`,
  });

  const destIcon = L.divIcon({
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    html: `<div style="filter:drop-shadow(0 3px 6px rgba(0,0,0,.35));"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.4 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.4 18.6 0 12 0z" fill="#f59e0b"/><circle cx="12" cy="12" r="4.5" fill="#fff"/></svg></div>`,
  });

  const focusLine: [number, number][] | null = useMemo(() => {
    if (!focus || focus.destX === undefined || focus.destY === undefined) return null;
    const a = toLatLng(focus.x, focus.y);
    const b = toLatLng(focus.destX, focus.destY);
    // curve via midpoint offset
    const mid: [number, number] = [(a[0] + b[0]) / 2 + 0.004, (a[1] + b[1]) / 2 + 0.004];
    return [a, mid, b];
  }, [focus]);

  function Recenter() {
    const map = useMap();
    useEffect(() => {
      if (focus) {
        const target = toLatLng(focus.x, focus.y);
        map.flyTo(target, 14, { duration: 0.8 });
      } else if (livreurs.length) {
        const pts = livreurs.map((l) => toLatLng(l.x, l.y));
        const bounds = L.latLngBounds([restaurantPos, ...pts]);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      }
    }, [focus?.id, livreurs.length, map]);
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes ldfPing { 75%,100% { transform:scale(2); opacity:0; } }
        .leaflet-container { background:#e8f1ef; font-family:inherit; }
        .leaflet-popup-content-wrapper { border-radius:14px; box-shadow:0 12px 32px rgba(0,0,0,.18); }
        .leaflet-popup-content { margin:12px 14px; font-size:12px; }
        .leaflet-control-attribution { font-size:9px !important; opacity:.7; }
      `}</style>
      <MapContainer
        center={restaurantPos}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{y}/{x}{r}.png"
        />

        <Marker position={restaurantPos} icon={restaurantIcon}>
          <Popup>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Ladid Food — Kénitra</div>
              <div style={{ color: "#64748b" }}>Restaurant · Point de départ</div>
            </div>
          </Popup>
        </Marker>

        {livreurs.map((l) => {
          const pos = toLatLng(l.x, l.y);
          const color = statutColor[l.statut];
          const pulse = l.statut === "En livraison" || focus?.id === l.id;
          const selected = selectedId === l.id || focus?.id === l.id;
          return (
            <Marker
              key={l.id}
              position={pos}
              icon={bikeIcon(color, pulse, selected)}
              eventHandlers={{
                click: () => onSelect?.(l),
              }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{l.nom}</div>
                  <div style={{ color: color, fontWeight: 600, fontSize: 11, marginTop: 2 }}>
                    ● {l.statut}
                  </div>
                  <div style={{ marginTop: 6, color: "#475569" }}>
                    {l.vehicule ?? "Scooter"} {l.telephone ? `· ${l.telephone}` : ""}
                  </div>
                  {l.commande && (
                    <div style={{ marginTop: 6, padding: "6px 8px", background: "#f1f5f9", borderRadius: 8 }}>
                      <div style={{ fontFamily: "monospace", color: "#0d9488", fontWeight: 700 }}>{l.commande}</div>
                      <div style={{ color: "#334155" }}>{l.client}</div>
                      {l.adresse && <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{l.adresse}</div>}
                      <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: 11, color: "#0f172a" }}>
                        <span>⏱ {l.eta} min</span>
                        <span>📍 {l.distance} km</span>
                        <span>⚡ 42 km/h</span>
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {focus && focusLine && (
          <>
            <Polyline
              positions={focusLine}
              pathOptions={{ color: "#0d9488", weight: 4, opacity: 0.85, dashArray: "8 8" }}
            />
            <Marker position={toLatLng(focus.destX!, focus.destY!)} icon={destIcon}>
              <Popup>
                <div>
                  <div style={{ fontWeight: 700 }}>Destination</div>
                  <div style={{ color: "#64748b" }}>{focus.adresse ?? "Client"}</div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        <Recenter />
      </MapContainer>
    </>
  );
}
