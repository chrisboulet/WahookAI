# Instacup - Outil de Calcul de Soumission

## Validation Académique & Industrie

### Recherche Académique

| Source | Validation |
|--------|------------|
| [Pricing and Consumption in Subscription Settings](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5266308) (SSRN 2025) | Valide que le pricing par usage affecte l'intensité d'utilisation - modèle linéaire approprié |
| [Dynamic Pricing for Subscription Services](https://www.sciencedirect.com/science/article/abs/pii/S0165188913000961) (ScienceDirect) | Confirme les schémas activation + abonnement + frais d'usage pour services récurrents |
| [Unit Pricing in B2B Marketing](https://www.sciencedirect.com/science/article/abs/pii/S0019850118300415) (ScienceDirect) | Prix par unité standardisée = pratique B2B validée |
| [Optimal Pricing for Leased Equipment](https://www.sciencedirect.com/science/article/abs/pii/S0925527324000148) (ScienceDirect 2024) | Modèle game-théorique validant amortissement équipement + maintenance dans contrats |

### Benchmarks Industrie OCS (Office Coffee Service)

| Métrique | Benchmark | Source |
|----------|-----------|--------|
| **Prix par tasse** | $0.07 - $0.48 USD | [Office Coffee Deals](https://officecoffeedeals.net/cost/) |
| **Coût par employé/mois** | $7 - $14 USD | [360Connect](https://www.360connect.com/product-blog/how-much-does-an-office-coffee-service-cost/) |
| **Coût annuel/employé** | ~$98 USD | [BuyerZone](https://www.buyerzone.com/facilities/office-coffee-services/ar-prices-office-coffee-services/) |
| **Équipement** | Souvent gratuit si volume minimum | Pratique industrie standard |
| **Marché US** | $2.49B, croissance 17%/an | [Vending Market Watch](https://www.vendingmarketwatch.com/coffee-service/article/55136791/the-state-of-the-office-coffee-industry-report-for-vending-and-micro-market-operators-despite-inflation-driven-headwinds-the-ocs-market-grows-again) |

### Conclusion Méthodologique

✅ **Le modèle linéaire simple est validé par l'industrie:**
```
Total = (Prix/tasse × Volume) + (Frais service × Fréquence) + (Coût machine ÷ 12)
```

Cette formule correspond aux pratiques standard de l'industrie OCS. Pas besoin de modèles complexes - la simplicité est la norme.

---

## Résumé du Projet

Créer un calculateur de soumissions pour Instacup, un service récurrent de café pour entreprises.

## Modèle d'Affaires

### 3 Composantes de Prix

| Composante | Calcul | Facturation |
|------------|--------|-------------|
| **Café** | Prix par tasse × volume mensuel estimé | Mensuelle |
| **Service** | Tarif selon fréquence de visite | Mensuelle |
| **Machine** | Coût machine ÷ 12 mois | Amortie sur 12 mois |

## Architecture Technique

### Stack
- **Runtime**: Bun
- **Framework**: React + Vite (SPA légère)
- **Styling**: Tailwind CSS
- **PDF**: @react-pdf/renderer
- **Hébergement**: Cloudflare Pages

### Structure du Projet

```
instacup-calculator/
├── src/
│   ├── components/
│   │   ├── Calculator.tsx      # Formulaire principal
│   │   ├── PricingTable.tsx    # Affichage détaillé des prix
│   │   ├── QuotePDF.tsx        # Template PDF
│   │   └── ui/                 # Composants réutilisables
│   ├── config/
│   │   └── pricing.ts          # Grille tarifaire (modifiable)
│   ├── lib/
│   │   ├── calculations.ts     # Logique de calcul
│   │   └── types.ts            # Types TypeScript
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── logo.svg                # Logo Instacup
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── wrangler.toml               # Config Cloudflare
```

## Implémentation

### Phase 1: Setup Projet
- [ ] Initialiser projet Bun + Vite + React
- [ ] Configurer Tailwind CSS
- [ ] Créer structure de dossiers

### Phase 2: Logique de Calcul
- [ ] Définir types (QuoteInput, QuoteResult, PricingConfig)
- [ ] Créer fichier pricing.ts avec tarifs configurables
- [ ] Implémenter calculations.ts avec formules

### Phase 3: Interface Utilisateur
- [ ] Formulaire de saisie (nombre employés, fréquence service, type machine)
- [ ] Affichage dynamique du prix (mise à jour en temps réel)
- [ ] Tableau récapitulatif détaillé

### Phase 4: Export PDF
- [ ] Template PDF professionnel avec @react-pdf/renderer
- [ ] Inclure: logo, détails client, breakdown des prix, total
- [ ] Bouton de téléchargement

### Phase 5: Déploiement
- [ ] Configurer wrangler.toml
- [ ] Déployer sur Cloudflare Pages

## Fichier de Configuration Tarifaire

```typescript
// src/config/pricing.ts
export const PRICING = {
  coffee: {
    pricePerCup: 0.45, // $ par tasse
  },
  service: {
    weekly: 80,      // $ par mois
    biweekly: 50,    // $ par mois
    monthly: 30,     // $ par mois
  },
  machines: {
    basic: { name: "Essential", cost: 1200 },     // Amorti sur 12 mois = 100$/mois
    standard: { name: "Pro", cost: 2400 },        // 200$/mois
    premium: { name: "Premium", cost: 3600 },     // 300$/mois
  },
} as const;
```

## Inputs du Formulaire

1. **Nom du client** (texte)
2. **Nombre d'employés** (slider ou input numérique)
3. **Tasses estimées par jour** (calculé auto ou override)
4. **Jours de travail par semaine** (défaut: 5)
5. **Type de machine** (dropdown: Essential/Pro/Premium)
6. **Fréquence de service** (radio: Hebdo/Bi-mensuel/Mensuel)

## Output Calculé

```
Café:      [tasses/jour] × [jours/sem] × 4.33 × [prix/tasse] = XX$/mois
Service:   [tarif selon fréquence] = XX$/mois
Machine:   [coût machine] ÷ 12 = XX$/mois
─────────────────────────────────────────
TOTAL MENSUEL: XXX$/mois

Engagement minimum: 12 mois
Total annuel: X,XXX$
```

## Livrables

1. ✅ Application web fonctionnelle
2. ✅ Export PDF professionnel
3. ✅ Tarifs facilement modifiables
4. ✅ Déployé sur Cloudflare Pages

## Dépendances

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "@react-pdf/renderer": "^3",
    "lucide-react": "^0.300"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "tailwindcss": "^3",
    "typescript": "^5",
    "wrangler": "^3"
  }
}
```
