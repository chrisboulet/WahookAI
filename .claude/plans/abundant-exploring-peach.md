# Plan: Site Prospector v2.0 - Améliorations Complètes

## Objectif
Transformer Site Prospector en outil de prospection complet avec scoring intelligent, détection avancée, intégration CRM Supabase, crawl parallèle, et dashboard web avec cartographie.

---

## Phase 1: Scoring Intelligent (2 fichiers)

### 1.1 Nouveau moteur de scoring configurable

**Fichier:** `src/score/scoring-engine.js`

**Améliorations:**
- Extraire les poids dans un fichier config `src/config/scoring-weights.json`
- Ajouter critères:
  - Âge du domaine (via WHOIS API ou fallback)
  - Présence réseaux sociaux (détection liens Facebook/Instagram dans HTML)
  - Tech stack détection (WordPress, Wix, Squarespace = facile à remplacer)
  - Ratio images/texte (sites avec peu de contenu = facile à améliorer)
- Scoring par catégorie (restaurants ont des attentes différentes que dentistes)

**Nouveau fichier:** `src/config/scoring-weights.json`
```json
{
  "base": {
    "no_website": 30,
    "domain_parked": 30,
    "under_construction": 25
  },
  "technical": {
    "no_ssl": 10,
    "not_mobile_friendly": 15,
    "slow_load": 10,
    "poor_lighthouse": 15
  },
  "design": {
    "obsolete_high": 20,
    "obsolete_medium": 10
  },
  "business": {
    "good_rating": 10,
    "many_reviews": 10,
    "few_reviews_penalty": -10
  },
  "category_multipliers": {
    "restaurant": 1.0,
    "hair_care": 1.2,
    "dentist": 0.8
  }
}
```

---

## Phase 2: Détection Design Obsolète Améliorée (2 fichiers)

### 2.1 Heuristiques enrichies

**Fichier:** `src/analyze/design-heuristics.js`

**Nouveaux patterns:**
- Bootstrap 2/3 detection (classes `span4`, `row-fluid`)
- jQuery UI widgets (`.ui-widget`, `.ui-dialog`)
- Vieilles librairies JS (`mootools`, `prototype.js`, `scriptaculous`)
- Google Analytics Universal (vs GA4)
- Meta tags obsolètes (`<meta http-equiv="X-UA-Compatible"`)
- Fonts non-optimisées (pas de `font-display: swap`)

### 2.2 Tech stack detection

**Nouveau fichier:** `src/analyze/tech-detector.js`
- Détecter WordPress, Wix, Squarespace, Shopify via patterns HTML
- Détecter React/Vue/Angular (sites modernes = SKIP)
- Détecter CMS custom vs builder

---

## Phase 3: Intégration CRM Supabase (3 fichiers)

### 3.1 Module sync Supabase

**Nouveau fichier:** `src/sync/supabase-sync.js`

```javascript
// Fonctions principales
export async function syncProspectsToSupabase(prospects, options);
export async function getExistingProspects();
export async function updateProspectStatus(placeId, status);
```

**Mapping site-prospector → Supabase:**
| Site-Prospector | Supabase Field |
|-----------------|----------------|
| name | company |
| phone | phone |
| category | industry |
| opportunity_score | score |
| priority | (notes ou custom field) |
| issues array | pain_points |
| "site-prospector" | source |
| google_maps_url | (custom field ou notes) |

**Stage automatique:**
- No website → `lead`
- Domain parked → `lead`
- Under construction → `qualified`
- Old design score > 40 → `qualified`
- Sinon → `qualified`

### 3.2 CLI command sync

**Fichier:** `src/index.js` - Ajouter commande

```bash
node src/index.js sync [--dry-run] [--priority HOT]
```

### 3.3 Config Supabase

**Fichier:** `.env` - Ajouter
```
SUPABASE_URL=https://jxxpriwvpzlcolfjkri.supabase.co
SUPABASE_SERVICE_KEY=...
SUPABASE_USER_ID=...
```

---

## Phase 4: Parallélisation Crawl (2 fichiers)

### 4.1 Crawler concurrent

**Fichier:** `src/crawl/site-crawler.js`

**Améliorations:**
- Pool de browsers Playwright (3-5 instances)
- p-limit ou p-queue pour contrôle concurrence
- Batch processing avec progress bar

```javascript
import pLimit from 'p-limit';

export async function analyzeMultipleSitesConcurrent(sites, options = {}) {
  const { concurrency = 3, onProgress } = options;
  const limit = pLimit(concurrency);

  const tasks = sites.map((site, i) =>
    limit(async () => {
      const result = await analyzeSite(site.website, { businessId: site.id });
      onProgress?.(i + 1, sites.length, site.name);
      return result;
    })
  );

  return Promise.all(tasks);
}
```

### 4.2 Dépendances

**Fichier:** `package.json` - Ajouter
```json
"p-limit": "^6.1.0"
```

**Gain estimé:** 3-5x plus rapide (de 5 min pour 50 sites → 1-2 min)

---

## Phase 5: Dashboard Web avec Cartographie (Nouveau dossier)

### 5.1 Structure

```
src/dashboard/
├── package.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Map.tsx              # Google Maps avec marqueurs
│   │   ├── ProspectList.tsx     # Liste triable/filtrable
│   │   ├── ProspectCard.tsx     # Détail prospect
│   │   ├── Stats.tsx            # Métriques globales
│   │   └── Filters.tsx          # Filtres catégorie/priorité
│   ├── hooks/
│   │   └── useProspects.ts      # Fetch API
│   └── api/
│       └── server.ts            # Express API
```

### 5.2 Backend API

**Fichier:** `src/api/server.ts`

```typescript
// Endpoints
GET /api/prospects          // Liste avec filtres
GET /api/prospects/:id      // Détail + screenshots
GET /api/stats              // Métriques agrégées
GET /api/categories         // Liste catégories
POST /api/prospects/:id/sync // Sync vers Supabase
```

### 5.3 Frontend React

**Technologies:**
- React 18 + TypeScript
- Vite (build rapide)
- @react-google-maps/api (Google Maps)
- Tailwind CSS (styling rapide)
- TanStack Query (data fetching)

**Fonctionnalités carte:**
- Marqueurs colorés par priorité (HOT=rouge, WARM=orange, COOL=bleu, SKIP=gris)
- Clustering si beaucoup de points
- Popup au clic avec nom, score, bouton "Voir détails"
- Centré sur Québec City par défaut

### 5.4 Dépendances dashboard

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@react-google-maps/api": "^2.20.3",
    "@tanstack/react-query": "^5.61.0",
    "express": "^4.21.0"
  },
  "devDependencies": {
    "vite": "^6.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "tailwindcss": "^3.4.16"
  }
}
```

### 5.5 Commande CLI

**Fichier:** `src/index.js` - Ajouter

```bash
node src/index.js dashboard [--port 3000]
```

---

## Ordre d'implémentation recommandé

1. **Phase 4: Parallélisation** (rapide, impact immédiat)
2. **Phase 2: Détection design** (améliore qualité données)
3. **Phase 1: Scoring intelligent** (utilise nouvelles détections)
4. **Phase 3: Supabase sync** (données prêtes pour CRM)
5. **Phase 5: Dashboard** (visualisation finale)

---

## Fichiers à créer/modifier

### Nouveaux fichiers (8)
- `src/config/scoring-weights.json`
- `src/analyze/tech-detector.js`
- `src/sync/supabase-sync.js`
- `src/dashboard/package.json`
- `src/dashboard/vite.config.ts`
- `src/dashboard/src/main.tsx`
- `src/dashboard/src/App.tsx`
- `src/api/server.ts`

### Fichiers à modifier (4)
- `src/score/scoring-engine.js` (config externe + nouveaux critères)
- `src/analyze/design-heuristics.js` (patterns enrichis)
- `src/crawl/site-crawler.js` (concurrence)
- `src/index.js` (nouvelles commandes: sync, dashboard)
- `package.json` (dépendances)
- `.env` (Supabase config)

---

## Estimation effort

| Phase | Complexité | Fichiers |
|-------|------------|----------|
| Phase 1: Scoring | Moyenne | 2 |
| Phase 2: Détection | Moyenne | 2 |
| Phase 3: Supabase | Moyenne | 3 |
| Phase 4: Parallèle | Faible | 2 |
| Phase 5: Dashboard | Élevée | 8+ |

**Total:** ~17 fichiers, complexité globale moyenne-élevée

---

## Questions résolues

- CRM: Supabase existant (UltraCTO-OS)
- Carte: Google Maps (avancé)
- Frontend: React/Vite
- Mapping CRM: company, phone, industry, score, pain_points, source="site-prospector"
