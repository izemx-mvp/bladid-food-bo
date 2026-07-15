// Mock data for Ladid Food backoffice
// All amounts are in MAD (Moroccan Dirham)

import logoAsset from "@/assets/ladid-logo.png.asset.json";
export const LOGO_URL = logoAsset.url;

export type Commande = {
  id: string;
  numero: string;
  client: string;
  telephone: string;
  canal: "App Mobile" | "WhatsApp" | "Site Web" | "Téléphone";
  items: { plat: string; qte: number; prix: number }[];
  total: number;
  statut: "Reçue" | "En préparation" | "Prête" | "En livraison" | "Livrée" | "Annulée";
  paiement: "Espèces" | "Carte" | "En ligne";
  livreur: string | null;
  adresse: string;
  date: string;
  note?: string;
};

export type Supplement = {
  id: string;
  nom: string;
  prix: number;
};

export type Plat = {
  id: string;
  nom: string;
  categorie: "Tajines" | "Pastilla" | "Couscous" | "Petit-déjeuner" | "Packs & Formules" | "Boissons" | "Desserts";
  prix: number;
  description: string;
  disponible: boolean;
  tempsPreparation: number;
  allergenes: string[];
  halal: boolean;
  ventes: number;
  image?: string;
  supplements?: Supplement[];
};

export type Client = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresses: string[];
  points: number;
  niveau: "Bronze" | "Argent" | "Or" | "Platine";
  commandes: number;
  totalDepense: number;
  inscription: string;
  actif: boolean;
};

export type Reclamation = {
  id: string;
  client: string;
  commande: string;
  sujet: string;
  message: string;
  statut: "Nouvelle" | "En cours" | "Résolue" | "Fermée";
  priorite: "Basse" | "Moyenne" | "Haute" | "Urgente";
  date: string;
  assignee: string | null;
};

export type Remboursement = {
  id: string;
  commande: string;
  client: string;
  montant: number;
  motif: string;
  statut: "En attente" | "Approuvé" | "Refusé" | "Remboursé";
  date: string;
  traiteBy?: string;
};

export type Livreur = {
  id: string;
  nom: string;
  telephone: string;
  vehicule: "Scooter" | "Moto" | "Vélo" | "Voiture";
  immatriculation: string;
  statut: "En ligne" | "En pause" | "Hors ligne" | "En livraison";
  note: number;
  livraisonsAujourdhui: number;
  gainsJour: number;
  gainsMois: number;
  zone: string;
  actif: boolean;
};

export type Promotion = {
  id: string;
  code: string;
  type: "Pourcentage" | "Montant fixe" | "Livraison offerte";
  valeur: number;
  utilisations: number;
  limite: number;
  debut: string;
  fin: string;
  actif: boolean;
};

export type Utilisateur = {
  id: string;
  nom: string;
  email: string;
  role: "Super Admin" | "Manager" | "Caissier" | "Support" | "Chef cuisine";
  actif: boolean;
  dernier: string;
};

export type PointVente = {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
  horaires: string;
  manager: string;
  actif: boolean;
};

export type Avis = {
  id: string;
  client: string;
  note: number;
  commentaire: string;
  date: string;
  publie: boolean;
  reponse?: string;
};

export type NotifPush = {
  id: string;
  titre: string;
  message: string;
  cible: "Tous les clients" | "Clients VIP" | "Livreurs" | "Clients inactifs";
  envoyee: number;
  ouvertes: number;
  date: string;
};

export type PaliersFidelite = {
  niveau: string;
  seuil: number;
  avantages: string[];
};

const noms = ["Youssef Benali", "Fatima Zahra Idrissi", "Karim El Amrani", "Salma Bouzid", "Omar Rachidi", "Nadia Benkirane", "Mehdi Tazi", "Amina Chraibi", "Rachid Alaoui", "Leila Berrada", "Hassan Fassi", "Zineb Kettani", "Anas Cherkaoui", "Ghita Sqalli", "Amine Ouazzani", "Sara Bennani", "Ilyas Filali", "Meryem Kadiri", "Adnan Belhaj", "Houda Slaoui"];

const plats = ["Tajine Poulet Olives", "Tajine Kefta Œuf", "Tajine Agneau Pruneaux", "Pastilla au Poulet", "Pastilla Fruits de Mer", "Couscous Royal", "Couscous Sept Légumes", "Rfissa", "Msemmen Garni", "Harira Traditionnelle"];

const zones = ["Kénitra Centre", "Mimosas", "Val Fleuri", "Bir Rami", "Ouled Oujih", "Maamoura", "Fouarat"];

let seed = 1;
const rand = (max: number) => {
  seed = (seed * 9301 + 49297) % 233280;
  return Math.floor((seed / 233280) * max);
};

const pick = <T>(arr: T[]) => arr[rand(arr.length)]!;

const dateAgo = (days: number, hours = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

export const commandes: Commande[] = Array.from({ length: 32 }, (_, i) => {
  const nb = 1 + rand(4);
  const items = Array.from({ length: nb }, () => ({
    plat: pick(plats),
    qte: 1 + rand(3),
    prix: 45 + rand(120),
  }));
  const total = items.reduce((s, it) => s + it.prix * it.qte, 0);
  const statuts: Commande["statut"][] = ["Reçue", "En préparation", "Prête", "En livraison", "Livrée", "Livrée", "Livrée", "Annulée"];
  const canaux: Commande["canal"][] = ["App Mobile", "App Mobile", "WhatsApp", "Site Web", "Téléphone"];
  return {
    id: `cmd_${i + 1}`,
    numero: `#LDF-${2600 + i}`,
    client: pick(noms),
    telephone: `06${String(10000000 + rand(89999999)).slice(0, 8)}`,
    canal: pick(canaux),
    items,
    total,
    statut: pick(statuts),
    paiement: pick(["Espèces", "Carte", "En ligne"] as const),
    livreur: rand(10) > 3 ? pick(noms.slice(0, 6)) : null,
    adresse: `${10 + rand(200)} Rue ${pick(["Mohammed V", "Hassan II", "Al Massira", "Ibn Khaldoun", "Al Baraka"])}, ${pick(zones)}`,
    date: dateAgo(rand(7), rand(24)),
    note: rand(3) === 0 ? "Sans oignons, bien cuit svp" : undefined,
  };
});

export const platsData: Plat[] = [
  { id: "p1", nom: "Tajine Poulet aux Olives & Citron Confit", categorie: "Tajines", prix: 85, description: "Poulet fermier mijoté aux olives violettes et citron confit maison", disponible: true, tempsPreparation: 25, allergenes: [], halal: true, ventes: 342 },
  { id: "p2", nom: "Tajine Kefta aux Œufs", categorie: "Tajines", prix: 75, description: "Boulettes de bœuf haché, sauce tomate épicée, œufs pochés", disponible: true, tempsPreparation: 22, allergenes: ["Œufs"], halal: true, ventes: 289 },
  { id: "p3", nom: "Tajine Agneau aux Pruneaux & Amandes", categorie: "Tajines", prix: 110, description: "Épaule d'agneau confite, pruneaux moelleux, amandes grillées", disponible: true, tempsPreparation: 35, allergenes: ["Fruits à coque"], halal: true, ventes: 198 },
  { id: "p4", nom: "Pastilla au Poulet & Amandes", categorie: "Pastilla", prix: 95, description: "Feuilles de brick croustillantes, poulet, amandes, cannelle, sucre glace", disponible: true, tempsPreparation: 30, allergenes: ["Gluten", "Fruits à coque"], halal: true, ventes: 267 },
  { id: "p5", nom: "Pastilla Fruits de Mer", categorie: "Pastilla", prix: 120, description: "Crevettes, calamars, poisson blanc, vermicelle, herbes fraîches", disponible: true, tempsPreparation: 30, allergenes: ["Gluten", "Fruits de mer"], halal: true, ventes: 145 },
  { id: "p6", nom: "Couscous Royal", categorie: "Couscous", prix: 130, description: "Semoule fine, agneau, poulet, merguez, 7 légumes, bouillon parfumé", disponible: true, tempsPreparation: 40, allergenes: ["Gluten"], halal: true, ventes: 421 },
  { id: "p7", nom: "Couscous Sept Légumes", categorie: "Couscous", prix: 75, description: "Semoule, courgette, carotte, navet, potiron, chou, pois chiches, oignon", disponible: true, tempsPreparation: 35, allergenes: ["Gluten"], halal: true, ventes: 312 },
  { id: "p8", nom: "Msemmen Garni Kefta", categorie: "Petit-déjeuner", prix: 35, description: "Crêpe feuilletée farcie kefta, oignon, tomate, herbes", disponible: true, tempsPreparation: 12, allergenes: ["Gluten"], halal: true, ventes: 234 },
  { id: "p9", nom: "Harira Traditionnelle", categorie: "Petit-déjeuner", prix: 25, description: "Soupe tomate, lentilles, pois chiches, herbes fraîches, dattes", disponible: true, tempsPreparation: 10, allergenes: ["Gluten", "Céleri"], halal: true, ventes: 578 },
  { id: "p10", nom: "Pack Famille (4 pers.)", categorie: "Packs & Formules", prix: 320, description: "1 tajine + 1 couscous + entrée + dessert + boisson pour 4 personnes", disponible: true, tempsPreparation: 45, allergenes: ["Gluten"], halal: true, ventes: 89 },
  { id: "p11", nom: "Formule Déjeuner", categorie: "Packs & Formules", prix: 95, description: "Entrée + plat du jour + dessert + thé à la menthe", disponible: true, tempsPreparation: 25, allergenes: [], halal: true, ventes: 456 },
  { id: "p12", nom: "Thé à la menthe", categorie: "Boissons", prix: 15, description: "Thé vert, menthe fraîche, sucre selon goût", disponible: true, tempsPreparation: 5, allergenes: [], halal: true, ventes: 892 },
  { id: "p13", nom: "Jus d'orange pressé", categorie: "Boissons", prix: 20, description: "100% oranges fraîches pressées minute", disponible: true, tempsPreparation: 3, allergenes: [], halal: true, ventes: 234 },
  { id: "p14", nom: "Chebakia au miel", categorie: "Desserts", prix: 30, description: "Pâtisserie traditionnelle sésame et miel", disponible: false, tempsPreparation: 5, allergenes: ["Gluten", "Sésame"], halal: true, ventes: 167 },
  { id: "p15", nom: "Cornes de gazelle", categorie: "Desserts", prix: 35, description: "Pâtisserie amande, fleur d'oranger", disponible: true, tempsPreparation: 5, allergenes: ["Gluten", "Fruits à coque"], halal: true, ventes: 143 },
];

export const clients: Client[] = Array.from({ length: 24 }, (_, i) => {
  const nom = pick(noms);
  const nb = 1 + rand(45);
  const points = 50 + rand(4500);
  const niveau: Client["niveau"] = points > 3000 ? "Platine" : points > 1500 ? "Or" : points > 500 ? "Argent" : "Bronze";
  return {
    id: `cli_${i + 1}`,
    nom,
    email: `${nom.toLowerCase().replace(/\s|'/g, ".")}@${pick(["gmail.com", "yahoo.fr", "outlook.com", "menara.ma"])}`,
    telephone: `06${String(10000000 + rand(89999999)).slice(0, 8)}`,
    adresses: [`${10 + rand(300)} Rue ${pick(["Al Andalous", "Mohammed VI", "Ibn Sina"])}, ${pick(zones)}`],
    points,
    niveau,
    commandes: nb,
    totalDepense: nb * (80 + rand(180)),
    inscription: dateAgo(rand(400)),
    actif: rand(10) > 1,
  };
});

export const reclamations: Reclamation[] = Array.from({ length: 14 }, (_, i) => ({
  id: `rec_${i + 1}`,
  client: pick(noms),
  commande: `#LDF-${2600 + rand(32)}`,
  sujet: pick(["Plat froid à l'arrivée", "Article manquant", "Retard de livraison", "Erreur dans la commande", "Emballage endommagé", "Qualité insatisfaisante"]),
  message: "Bonjour, ma commande présentait un problème et je souhaiterais un dédommagement. Merci de votre attention.",
  statut: pick(["Nouvelle", "Nouvelle", "En cours", "Résolue", "Fermée"] as const),
  priorite: pick(["Basse", "Moyenne", "Moyenne", "Haute", "Urgente"] as const),
  date: dateAgo(rand(15), rand(24)),
  assignee: rand(2) === 0 ? pick(noms.slice(0, 4)) : null,
}));

export const remboursements: Remboursement[] = Array.from({ length: 10 }, (_, i) => ({
  id: `rem_${i + 1}`,
  commande: `#LDF-${2600 + rand(32)}`,
  client: pick(noms),
  montant: 50 + rand(250),
  motif: pick(["Commande non reçue", "Plat incorrect", "Qualité médiocre", "Livraison trop tardive", "Annulation restaurant"]),
  statut: pick(["En attente", "En attente", "Approuvé", "Refusé", "Remboursé"] as const),
  date: dateAgo(rand(20)),
  traiteBy: rand(2) === 0 ? "Yanis" : undefined,
}));

export const livreurs: Livreur[] = Array.from({ length: 12 }, (_, i) => ({
  id: `liv_${i + 1}`,
  nom: pick(noms),
  telephone: `06${String(10000000 + rand(89999999)).slice(0, 8)}`,
  vehicule: pick(["Scooter", "Scooter", "Moto", "Vélo", "Voiture"] as const),
  immatriculation: `${10000 + rand(89999)}-A-${1 + rand(80)}`,
  statut: pick(["En ligne", "En ligne", "En livraison", "En pause", "Hors ligne"] as const),
  note: 3.5 + rand(15) / 10,
  livraisonsAujourdhui: rand(15),
  gainsJour: 80 + rand(320),
  gainsMois: 2400 + rand(4000),
  zone: pick(zones),
  actif: rand(10) > 0,
}));

export const promotions: Promotion[] = [
  { id: "pr1", code: "BIENVENUE10", type: "Pourcentage", valeur: 10, utilisations: 234, limite: 1000, debut: dateAgo(30), fin: dateAgo(-60), actif: true },
  { id: "pr2", code: "LIVRAISON0", type: "Livraison offerte", valeur: 0, utilisations: 456, limite: 2000, debut: dateAgo(60), fin: dateAgo(-30), actif: true },
  { id: "pr3", code: "RAMADAN25", type: "Pourcentage", valeur: 25, utilisations: 89, limite: 500, debut: dateAgo(15), fin: dateAgo(-15), actif: true },
  { id: "pr4", code: "FAMILLE50", type: "Montant fixe", valeur: 50, utilisations: 34, limite: 200, debut: dateAgo(10), fin: dateAgo(-45), actif: true },
  { id: "pr5", code: "WEEKEND15", type: "Pourcentage", valeur: 15, utilisations: 178, limite: 500, debut: dateAgo(90), fin: dateAgo(30), actif: false },
];

export const utilisateurs: Utilisateur[] = [
  { id: "u1", nom: "Yanis", email: "admin@ladidfood.ma", role: "Super Admin", actif: true, dernier: dateAgo(0, 1) },
  { id: "u2", nom: "Khadija Rifi", email: "khadija.rifi@ladidfood.ma", role: "Manager", actif: true, dernier: dateAgo(0, 3) },
  { id: "u3", nom: "Mustapha El Idrissi", email: "mustapha.chef@ladidfood.ma", role: "Chef cuisine", actif: true, dernier: dateAgo(0, 8) },
  { id: "u4", nom: "Sanaa Bakkali", email: "sanaa.caisse@ladidfood.ma", role: "Caissier", actif: true, dernier: dateAgo(1) },
  { id: "u5", nom: "Youness Tahiri", email: "youness.support@ladidfood.ma", role: "Support", actif: true, dernier: dateAgo(0, 12) },
  { id: "u6", nom: "Imane Naciri", email: "imane.support@ladidfood.ma", role: "Support", actif: false, dernier: dateAgo(45) },
];

export const pointsVente: PointVente[] = [
  { id: "pv1", nom: "Ladid Food — Kénitra Centre", adresse: "23 Avenue Mohammed V", ville: "Kénitra", telephone: "0537-000-001", horaires: "10h00 – 22h00", manager: "Khadija Rifi", actif: true },
  { id: "pv2", nom: "Ladid Food — Mimosas", adresse: "156 Rue Al Massira", ville: "Kénitra", telephone: "0537-000-002", horaires: "11h00 – 23h00", manager: "Mustapha El Idrissi", actif: true },
  { id: "pv3", nom: "Ladid Food — Bir Rami", adresse: "8 Boulevard Hassan II", ville: "Kénitra", telephone: "0537-000-003", horaires: "10h00 – 22h00", manager: "Sanaa Bakkali", actif: true },
];

export const avis: Avis[] = Array.from({ length: 14 }, (_, i) => ({
  id: `av_${i + 1}`,
  client: pick(noms),
  note: 3 + rand(3),
  commentaire: pick([
    "Excellent tajine, cuisson parfaite ! Je recommande vivement.",
    "Livraison rapide, plats encore chauds. Merci Ladid Food !",
    "La pastilla était délicieuse, un vrai régal familial.",
    "Bon rapport qualité/prix, portions généreuses.",
    "Service client au top, remboursement rapide sur une erreur.",
    "Un peu long à l'attente mais la qualité était au rendez-vous.",
  ]),
  date: dateAgo(rand(45)),
  publie: rand(5) > 0,
  reponse: rand(3) === 0 ? "Merci beaucoup pour votre retour, à très bientôt !" : undefined,
}));

export const notifsPush: NotifPush[] = [
  { id: "n1", titre: "🍲 Offre du soir", message: "-20% sur tous les tajines jusqu'à 22h", cible: "Tous les clients", envoyee: 2340, ouvertes: 1120, date: dateAgo(1) },
  { id: "n2", titre: "🎉 Nouveau plat", message: "Découvrez notre Rfissa aux Msemmens", cible: "Clients VIP", envoyee: 456, ouvertes: 289, date: dateAgo(3) },
  { id: "n3", titre: "🚚 Bonus livreurs", message: "10 MAD offerts sur chaque livraison ce weekend", cible: "Livreurs", envoyee: 12, ouvertes: 12, date: dateAgo(5) },
  { id: "n4", titre: "❤️ Vous nous manquez", message: "Un cadeau vous attend : LIVRAISON0", cible: "Clients inactifs", envoyee: 234, ouvertes: 45, date: dateAgo(10) },
];

export const paliersFidelite: PaliersFidelite[] = [
  { niveau: "Bronze", seuil: 0, avantages: ["1 pt / 10 MAD dépensés", "Newsletter exclusive"] },
  { niveau: "Argent", seuil: 500, avantages: ["1.2 pt / 10 MAD", "Livraison offerte dès 150 MAD", "Cadeau anniversaire"] },
  { niveau: "Or", seuil: 1500, avantages: ["1.5 pt / 10 MAD", "Livraison toujours offerte", "Dessert offert / mois", "Ligne prioritaire"] },
  { niveau: "Platine", seuil: 3000, avantages: ["2 pts / 10 MAD", "Chef à domicile 1x/an", "Cadeaux exclusifs", "Service VIP dédié"] },
];

// Charts
export const ventes7j = [
  { jour: "Lun", ventes: 4200, commandes: 42 },
  { jour: "Mar", ventes: 3800, commandes: 38 },
  { jour: "Mer", ventes: 5100, commandes: 51 },
  { jour: "Jeu", ventes: 4800, commandes: 46 },
  { jour: "Ven", ventes: 7200, commandes: 68 },
  { jour: "Sam", ventes: 8900, commandes: 82 },
  { jour: "Dim", ventes: 7800, commandes: 74 },
];

export const canauxData = [
  { name: "App Mobile", value: 52 },
  { name: "WhatsApp", value: 28 },
  { name: "Site Web", value: 14 },
  { name: "Téléphone", value: 6 },
];

export function formatMAD(n: number) {
  return `${n.toLocaleString("fr-FR")} MAD`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
