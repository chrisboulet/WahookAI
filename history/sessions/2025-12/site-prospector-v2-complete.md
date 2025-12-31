# Site Prospector v2.0 - Session Summary

**Date:** 2025-12-31
**Project:** ~/UltraCTO-OS/products/site-prospector
**Status:** COMPLETE - All 5 phases implemented

## What is Site Prospector?

Pipeline de prospection web pour identifier les PME avec des sites obsolètes dans la région de Québec City. Conçu pour Boulet Stratégies TI (services Fractional CTO).

## Architecture

```
site-prospector/
├── src/
│   ├── index.js              # CLI principal (yargs)
│   ├── collect/
│   │   ├── google-places.js  # API Google Places
│   │   ├── categories.js     # Catégories cibles
│   │   └── database.js       # SQLite (better-sqlite3)
│   ├── crawl/
│   │   └── site-crawler.js   # Playwright + p-limit concurrent
│   ├── analyze/
│   │   ├── design-heuristics.js  # 20+ patterns obsolescence
│   │   ├── tech-detector.js      # React/Vue/WordPress/Wix detection
│   │   └── lighthouse.js         # Lighthouse API (optional)
│   ├── score/
│   │   └── scoring-engine.js # Score 0-100, priorités HOT/WARM/COOL/SKIP
│   ├── export/
│   │   └── sheets-export.js  # Export CSV
│   ├── sync/
│   │   └── supabase-sync.js  # Sync vers ucto-crm Supabase
│   └── dashboard/            # React + Vite + TypeScript
│       ├── src/
│       │   ├── api/server.ts       # Express API
│       │   ├── components/         # Stats, Filters, Map, ProspectList
│       │   ├── hooks/useProspects.ts
│       │   └── types.ts
│       └── package.json
├── data/
│   ├── prospects.db          # SQLite database
│   └── screenshots/          # Desktop/mobile captures
└── output/                   # CSV exports
```

## CLI Commands

```bash
# Pipeline complet
node src/index.js full --category restaurant --limit 50

# Commandes individuelles
node src/index.js collect --category hair_care --limit 20
node src/index.js crawl --concurrency 5
node src/index.js score --verbose
node src/index.js export --output prospects.csv
node src/index.js stats

# Sync CRM
node src/index.js sync --dry-run
node src/index.js sync --priority HOT --limit 10

# Dashboard web
node src/index.js dashboard --port 3000
```

## Database Schema (SQLite)

```sql
-- businesses: Google Places data
-- site_analysis: crawl results (status, screenshots, design_score, tech_stack)
-- prospect_scores: opportunity_score, priority (HOT/WARM/COOL/SKIP)
```

## Scoring System

**Score 0-100** basé sur:
- Pas de site web: +30
- Domaine parking: +30
- Site en construction: +25
- Pas de SSL: +10
- Non mobile-friendly: +15
- Design obsolète (score 40+): +15 à +25
- Site builder DIY (Wix/Weebly): +10
- Site moderne (React/Vue): -15
- Bon rating Google (4+): +10
- Business peu actif (<5 avis): -10

**Priorités:**
- HOT (80+): Contacter immédiatement
- WARM (60-79): Bon potentiel
- COOL (40-59): Opportunité moyenne
- SKIP (<40): Ignorer

## Design Obsolescence Detection

20+ patterns détectés:
- Tables pour layout, Flash, inline styles excessifs
- Balises dépréciées: `<marquee>`, `<blink>`, `<center>`, `<font>`
- Bootstrap 2/3, jQuery UI, MooTools/Prototype
- Google Analytics Universal (vs GA4)
- Meta IE compatibility, DOCTYPE XHTML
- Copyright < 2020, fonts non-pro (Comic Sans)
- Pas de WebP/AVIF, pas de lazy loading

## Tech Stack Detection

Détecte:
- **Moderne (SKIP):** React, Vue, Angular, Svelte, Next.js, Nuxt
- **CMS:** WordPress, Joomla, Drupal, Magento
- **DIY Builders (opportunité):** Wix, Squarespace, Weebly, GoDaddy

## Supabase CRM Sync

Mapping vers table `prospects`:
- name → company
- opportunity_score → score
- issues → pain_points (array)
- category → industry
- source = "website"
- stage = "lead" ou "qualified"

Config requise dans `.env` ou `~/.env.local`:
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_xxx
SUPABASE_USER_ID=uuid
```

## Dashboard Web

- **Frontend:** React 18 + TypeScript + Vite + Tailwind v4
- **API:** Express + better-sqlite3 (readonly)
- **Map:** Google Maps avec marqueurs colorés par priorité
- **Features:** Filtres priorité/catégorie, vue détaillée, screenshots

Config Maps dans `src/dashboard/.env.local`:
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

## APIs Required

1. **Google Places API** - Collecte des businesses
2. **Maps JavaScript API** - Dashboard carte (même clé)

## Current Data

- 25 prospects dans la DB
- Catégories: restaurant (10), hair_care (15)
- 3 COOL, 22 SKIP
- 5 sites analysés avec screenshots

## Key Files to Remember

- `src/index.js:336-386` - Commande dashboard
- `src/analyze/design-heuristics.js` - Patterns obsolescence
- `src/sync/supabase-sync.js:72-116` - Mapping CRM
- `src/dashboard/src/api/server.ts` - API endpoints

## Lessons Learned

1. SQLite requiert guillemets simples pour strings (`''` pas `""`)
2. Tailwind v4 utilise `@import "tailwindcss"` en CSS (pas de config JS)
3. Express 5 avec TypeScript: attention aux types d'erreur (`error: unknown`)
4. p-limit pour crawl concurrent: 3x plus rapide

## Next Steps (Future Work)

- [ ] Geocoding API pour positions exactes sur la carte
- [ ] Filtres avancés (rating, reviews count)
- [ ] Export direct vers Google Sheets
- [ ] Webhook Supabase pour notifications
- [ ] Mode "re-crawl" pour mettre à jour les analyses
