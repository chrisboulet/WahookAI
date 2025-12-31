# Instacup Calculator - État du Projet

**Date:** 2025-12-31
**Client:** Instacup (service de café récurrent pour entreprises)
**Développeur:** Christian Boulet - Boulet Stratégies TI
**Temps de développement:** ~2 heures avec PAI/Claude Code

---

## Résumé du Projet

Application web de calcul de soumissions pour service de café B2B récurrent. Permet de générer des soumissions professionnelles avec export PDF.

## URLs et Accès

- **Repository:** https://github.com/chrisboulet/instacup-calculator
- **Hébergement:** Cloudflare Pages (à configurer)
- **Mot de passe:** `instacup2024` (SHA-256 hashé côté client)

## Stack Technique

| Technologie | Version |
|-------------|---------|
| Runtime | Bun |
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| PDF | @react-pdf/renderer |
| Icons | Lucide React |

## Fonctionnalités Implémentées

### Core
- [x] Calcul en temps réel des soumissions
- [x] Multi-machines avec quantités (sélection +/-)
- [x] Types de café configurables (CRUD)
- [x] Types de machines configurables (CRUD)
- [x] Prix par tasse final (tout inclus)
- [x] Export PDF professionnel
- [x] Authentification par mot de passe

### Configuration
- [x] Paramètres persistants (localStorage)
- [x] Export/Import JSON des paramètres
- [x] Tasses par kg configurable
- [x] Multiplicateur de marge configurable
- [x] Tarif de service par visite configurable
- [x] Durée d'engagement configurable

### Documentation
- [x] README.md complet
- [x] Guide utilisateur intégré (UserGuide.tsx)
- [x] Bouton d'aide dans l'application

## Formule de Calcul

```
Prix par tasse = (Prix/kg ÷ Tasses/kg) × Multiplicateur de marge

Total mensuel = Café + Service + Machines
  - Café    = Tasses/mois × Prix/tasse
  - Service = Visites/mois × Tarif/visite
  - Machines = Σ(Coût machine × Quantité) ÷ Mois d'engagement

Prix final/tasse = Total mensuel ÷ Tasses/mois
```

## Structure des Fichiers Clés

```
src/
├── components/
│   ├── Calculator.tsx    # Formulaire principal + logique calcul
│   ├── PricingTable.tsx  # Affichage résultats + bouton PDF
│   ├── QuotePDF.tsx      # Template PDF (@react-pdf/renderer)
│   ├── Settings.tsx      # Page configuration (CRUD café/machines)
│   ├── Login.tsx         # Auth simple SHA-256
│   └── UserGuide.tsx     # Guide utilisateur intégré
├── config/
│   └── pricing.ts        # Valeurs par défaut
├── lib/
│   ├── calculations.ts   # Fonctions de calcul (standalone)
│   ├── types.ts          # Types TypeScript
│   └── useSettings.tsx   # Context + hooks settings
└── App.tsx               # Router simple (calculator/settings/guide)
```

## Paramètres par Défaut

```typescript
{
  coffeeTypes: [
    { id: "regular", name: "Régulier", pricePerKg: 18 },
    { id: "premium", name: "Premium", pricePerKg: 24 },
    { id: "organic", name: "Bio/Équitable", pricePerKg: 28 }
  ],
  machines: [
    { id: "essential", name: "Essential", cost: 1200 },
    { id: "pro", name: "Pro", cost: 2400 },
    { id: "premium", name: "Premium", cost: 3600 }
  ],
  cupsPerKg: 71,
  markupMultiplier: 2,        // 100% marge
  serviceRatePerVisit: 100,   // $/visite
  weeksPerMonth: 4.33,
  minimumEngagementMonths: 12
}
```

## Commits Récents

```
9783040 docs: add README, user guide and help button
81b8522 fix: show service rate per visit from settings in calculator
9622baa feat: add dynamic machines with multi-selection and final price per cup
e75c668 feat: add export/import JSON for settings portability
```

## Tarification Recommandée

| Option | Prix |
|--------|------|
| Forfait minimum | 1,500$ |
| Sweet spot | 2,000$ + 50$/mois support |
| Stratégique (relation long terme) | 1,200$ |

**Justification:** Outil métier utilisé quotidiennement, ROI immédiat pour Instacup, code moderne et maintenable.

## Points d'Attention pour le Client

1. **Déploiement Cloudflare Pages** - À configurer avec le client
2. **Mot de passe** - Peut être changé dans Login.tsx (hash SHA-256)
3. **Logo** - Utilise texte "INSTACUP" dans le PDF, pas d'image logo
4. **Données** - 100% localStorage, aucun serveur backend

## Prochaines Étapes Potentielles

- [ ] Déploiement sur Cloudflare Pages
- [ ] Personnalisation du logo/branding
- [ ] Historique des soumissions générées
- [ ] Envoi PDF par email (nécessiterait backend)
- [ ] Mode multi-utilisateur (nécessiterait backend)

---

**Session sauvegardée pour référence future.**
