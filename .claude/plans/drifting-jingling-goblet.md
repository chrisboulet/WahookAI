# BOULET-Finances - Plan d'Implémentation

Application de comptabilité simplifiée pour Boulet Stratégies TI.

## Décisions

- **Nom:** BOULET-Finances
- **Location:** `~/Projects/boulet-compta`
- **Stack:** React 19 + Vite + Tailwind 4 + Cloudflare (Workers + D1 + Pages)
- **Runtime:** Bun

---

## Phase 1: Infrastructure (étapes 1-4)

### 1. Initialisation projet
```bash
cd ~/Projects
mkdir boulet-compta && cd boulet-compta
bun create vite . --template react-ts
```

### 2. Structure de base
```
boulet-compta/
├── workers/api/src/           # Backend Cloudflare Workers
│   ├── index.ts               # Entry Hono
│   ├── routes/                # Endpoints par module
│   ├── db/schema.sql          # Schéma D1
│   └── lib/taxes.ts           # Calculs TPS/TVQ
├── shared/types.ts            # Types partagés
├── src/                       # Frontend React
│   ├── components/            # UI components
│   ├── pages/                 # Pages principales
│   └── lib/api.ts             # Client API
└── wrangler.toml
```

### 3. Base de données D1
- Créer DB: `wrangler d1 create boulet-finances-db`
- Tables: `clients`, `invoices`, `invoice_items`, `time_entries`, `expenses`, `tax_reports`, `settings`

### 4. Dépendances
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-router-dom": "^7.1.3",
    "@react-pdf/renderer": "^4.3.2",
    "lucide-react": "^0.562.0",
    "recharts": "^2.15.0",
    "zustand": "^5.0.3",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "hono": "^4.7.11",
    "tailwindcss": "^4.1.18",
    "wrangler": "^4.54.0"
  }
}
```

---

## Phase 2: Backend API (étapes 5-9)

### 5. Setup Worker Hono
- `workers/api/src/index.ts` - Entry point avec routes modulaires
- Middleware: CORS, error handling, auth simple

### 6. Endpoints Clients
- `GET/POST/PUT/DELETE /api/clients`
- Stats par client (revenus, factures)

### 7. Endpoints Factures
- CRUD complet avec items
- Calcul auto TPS (5%) + TVQ (9.975%)
- Numérotation: `FAC-2026-001`
- Statuts: draft → sent → paid/overdue

### 8. Endpoints Time Entries
- CRUD heures
- Query heures non facturées
- Génération facture depuis heures

### 9. Endpoints Expenses + Reports
- CRUD dépenses/abonnements
- Rapport taxes trimestriel
- Revenus par période/client

---

## Phase 3: Frontend (étapes 10-14)

### 10. UI Components
- `src/components/ui/` - Button, Input, Card, Table, Modal, Badge
- Layout: Sidebar + Header

### 11. Pages principales
| Page | Fonctionnalité |
|------|----------------|
| Dashboard | KPIs, alertes, graphique revenus |
| Clients | Liste, création, détails |
| Factures | Liste, création, PDF |
| Heures | Tracker, heures non facturées |
| Dépenses | Liste, abonnements |
| Rapports | Taxes, revenus, graphiques |
| Settings | Infos entreprise |

### 12. State Management
- Zustand pour state global
- Custom hooks: `useClients`, `useInvoices`, etc.

### 13. API Client
- `src/lib/api.ts` - Fetch wrapper typé

### 14. Routing
- React Router v6
- Routes protégées

---

## Phase 4: Features Avancées (étapes 15-18)

### 15. Génération PDF Factures
- @react-pdf/renderer
- Template professionnel avec logo

### 16. Rapport Taxes TPS/TVQ
- Calcul trimestriel
- TPS/TVQ collectée vs payée
- Export pour déclaration

### 17. Banque d'heures → Facture
- Sélection heures non facturées
- Génération facture automatique

### 18. Rappels abonnements
- Query `next_renewal_date`
- Affichage dashboard

---

## Phase 5: Déploiement (étapes 19-20)

### 19. Configuration Cloudflare
```toml
# wrangler.toml
name = "boulet-finances-api"
[[d1_databases]]
binding = "DB"
database_name = "boulet-finances-db"
```

### 20. Deploy
- Frontend: Cloudflare Pages
- API: Cloudflare Workers
- DB: D1 production

---

## Schéma DB Résumé

```sql
clients (id, name, email, phone, company_name, status, hourly_rate, ...)
invoices (id, invoice_number, client_id, status, subtotal, tps_amount, tvq_amount, total, ...)
invoice_items (id, invoice_id, description, quantity, unit_price, amount, type)
time_entries (id, client_id, description, date, hours, hourly_rate, amount, billable, invoiced, invoice_id)
expenses (id, vendor_name, description, category, amount, tps_amount, tvq_amount, is_recurring, next_renewal_date, ...)
tax_reports (id, period_start, period_end, tps_collected, tps_paid, tps_balance, tvq_collected, tvq_paid, tvq_balance, ...)
settings (key, value)
```

---

## Constantes Fiscales Québec

```typescript
export const TAX_RATES = {
  TPS: 0.05,      // 5%
  TVQ: 0.09975    // 9.975%
};
```

---

## Fichiers Critiques à Créer

1. `~/Projects/boulet-compta/workers/api/src/db/schema.sql`
2. `~/Projects/boulet-compta/shared/types.ts`
3. `~/Projects/boulet-compta/workers/api/src/index.ts`
4. `~/Projects/boulet-compta/workers/api/src/lib/taxes.ts`
5. `~/Projects/boulet-compta/src/lib/api.ts`
6. `~/Projects/boulet-compta/src/App.tsx`
7. `~/Projects/boulet-compta/wrangler.toml`

---

## Estimation Effort

- **Phase 1-2 (Infrastructure + API):** Fondation solide
- **Phase 3 (Frontend base):** Interface fonctionnelle
- **Phase 4 (Features avancées):** PDF, rapports, automatisation
- **Phase 5 (Deploy):** Production ready

**MVP fonctionnel:** Phases 1-3
**Version complète:** Phases 1-5
