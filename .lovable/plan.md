
# Ladid Food — Backoffice Admin Panel

A demo-ready admin dashboard reusing Ladid Food's visual identity (teal accent on dark navy, cream highlights, rounded pill buttons, logo from the marketing site). Fully mock-data driven so the client can click through every scenario.

## Visual identity (from ladid-food.izemxlab.com)
- Primary: teal `#2DD4BF` / cyan glow
- Background: deep navy `#0B1220` with subtle gradient mesh + noise
- Cream accent `#FEF9E7` for highlights/badges
- Logo: `https://ladid-food.izemxlab.com/` header logo (embedded via URL)
- Typography: serif display ("Playfair Display") for titles + Inter for UI — matches the "Ladid Food" heading style
- Advanced effects: glassmorphism cards, soft glow shadows, animated gradient background, motion on hover, sidebar with active glow, French copywriting throughout

## Auth
- Route `/login` with pre-filled credentials (`admin@ladidfood.ma` / `admin123`) shown in a hint card
- On submit → localStorage flag → redirect to `/dashboard`
- Guard layout `_authenticated` redirects to `/login` if flag missing
- Logout in header

## Modules (all CRUD + view details + working actions via mock state in Zustand/React state)

1. **Dashboard** — KPIs (CA du jour, commandes, clients actifs, livreurs en ligne), charts (ventes 7j, top plats), flux temps réel commandes, alertes réclamations
2. **Commandes** — liste filtrable (statut, canal app/whatsapp, date), détail avec timeline (reçue → préparation → prête → en livraison → livrée), actions: assigner livreur, changer statut, imprimer ticket, rembourser
3. **Menu / Plats** — catégories (Tajines, Pastilla, Couscous, Petit-déj, Packs), CRUD plat avec image, prix, dispo, allergènes, temps prépa, badge "Halal"
4. **Clients** — liste, fiche détail: historique commandes, points fidélité (ajuster manuellement), niveau (Bronze/Argent/Or), adresses, bloquer/débloquer
5. **Réclamations** — depuis app mobile, statuts (nouvelle, en cours, résolue), réponse, pièces jointes, escalade
6. **Demandes de remboursement** — approuver/refuser, montant, motif, historique, lien vers commande
7. **Programme fidélité** — règles (X pts / MAD), paliers, récompenses, historique attribution
8. **Promotions & Codes promo** — CRUD codes (%, montant fixe, livraison offerte), planification, usage stats
9. **Livreurs** — liste, statut (en ligne/pause/hors ligne), commandes assignées, carte position mock, notation, gains journaliers, CRUD
10. **Points de vente** — CRUD adresses, horaires, gestionnaire
11. **Utilisateurs (staff)** — CRUD admin/manager/caissier/support, rôles & permissions, activer/désactiver
12. **Avis clients** — modération, réponse
13. **Notifications push** — composer campagne (clients / livreurs), historique
14. **Rapports** — export CSV mock (ventes, produits, livreurs)
15. **Paramètres** — infos restaurant, TVA, frais livraison, horaires, intégrations

## Layout
- Collapsible sidebar (shadcn sidebar) with logo, sections groupées, icônes Lucide, active glow teal
- Topbar: search command palette (⌘K mock), notifications bell with dropdown, profil admin avec menu logout
- Breadcrumbs sur chaque page
- Toasts (sonner) sur chaque action mock ("Commande #1234 assignée à Youssef ✓")
- Confirm dialogs pour delete/refund
- Sheet/drawer pour édition rapide, Dialog pour create

## Technical details
- Route structure:
  - `/login`
  - `/_authenticated/dashboard`
  - `/_authenticated/commandes`, `/commandes/$id`
  - `/_authenticated/menu`, `/clients`, `/clients/$id`
  - `/_authenticated/reclamations`, `/remboursements`, `/fidelite`, `/promotions`
  - `/_authenticated/livreurs`, `/livreurs/$id`
  - `/_authenticated/points-de-vente`, `/utilisateurs`, `/avis`, `/notifications`, `/rapports`, `/parametres`
- Mock data in `src/lib/mock/*.ts` (commandes, clients, plats, livreurs, etc. — 20-50 items each, realistic Moroccan names, MAD currency, Kénitra addresses)
- State: Zustand stores per module so CRUD persists in memory during session
- Design tokens updated in `src/styles.css` (teal primary, navy bg, cream accent, serif display font via Google Fonts link)
- shadcn components: sidebar, table, dialog, sheet, form, select, badge, tabs, chart (recharts), sonner, command
- Framer Motion for page transitions, card hovers, sidebar

## Deliverable per screen
Each module page includes: header with title + primary action, filter/search bar, data table with sort/pagination, row actions dropdown (Voir / Modifier / Supprimer / actions métier), create dialog, detail sheet/page with tabs, empty & loading states.
