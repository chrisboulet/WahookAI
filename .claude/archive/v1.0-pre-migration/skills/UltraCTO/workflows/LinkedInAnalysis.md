# LinkedInAnalysis Workflow

Analyse de posts LinkedIn via screenshots avec tracking historique.

## Triggers
- `/linkedin analyse` + screenshots
- `/linkedin evolution`
- `/linkedin top`
- "analyse mes posts", "performance linkedin"

## Workflow Principal: Analyse

### Étape 1: Réception des screenshots

L'utilisateur fournit 1 ou plusieurs screenshots de posts LinkedIn montrant:
- Le contenu du post
- Les statistiques (likes, comments, reposts)
- Les impressions (si disponibles dans les analytics)

### Étape 2: Extraction via Vision

Pour chaque screenshot, extraire:

```yaml
post:
  date: YYYY-MM-DD
  excerpt: "Les 50 premiers caractères..."
  full_text: "Texte complet du post"
  format: texte|image|carrousel|video|document

metrics:
  likes: X
  comments: X
  reposts: X
  impressions: X (si visible)

analysis:
  hook_quality: 1-10 (première ligne accrocheuse?)
  length: court|moyen|long
  has_cta: true|false
  theme: [stratégie-ti|leadership|conseil|personnel|actualité]
```

### Étape 3: Calcul des scores

**Taux d'engagement:**
```
engagement_rate = (likes + comments*3 + reposts*2) / impressions * 100
```
*Note: Comments valent 3x car plus d'effort, reposts 2x car visibilité*

**Score global /10:**
| Critère | Points |
|---------|--------|
| Hook accrocheur | 0-2 |
| Engagement > 2% | 0-2 |
| Comments > 5 | 0-2 |
| Format optimisé | 0-2 |
| CTA clair | 0-2 |

### Étape 4: Mise à jour du tracking

Ajouter les données extraites à:
- `~/UltraCTO-OS/data/linkedin/posts.md`

Créer rapport dans:
- `~/UltraCTO-OS/data/linkedin/analyses/YYYY-MM-DD.md`

### Étape 5: Génération du rapport

```markdown
## Rapport LinkedIn - [Date]

### Résumé
- Posts analysés: X
- Engagement moyen: X%
- Meilleur post: "[excerpt]" (score X/10)
- Impressions totales: X

### Détail par post

| # | Date | Excerpt | Format | Eng. | Score |
|---|------|---------|--------|------|-------|
| 1 | ... | "..." | Texte | 3.2% | 8/10 |

### Patterns identifiés

**Ce qui marche:**
- [Pattern 1]
- [Pattern 2]

**Ce qui marche moins:**
- [Pattern 1]

### Recommandations

1. **[Recommandation prioritaire]**
   - Pourquoi: ...
   - Action: ...

2. **[Recommandation secondaire]**
   - Pourquoi: ...
   - Action: ...

### Calendrier suggéré

| Jour | Créneau | Type de contenu suggéré |
|------|---------|-------------------------|
| Mardi | 8h-9h | Post éducatif (ton meilleur format) |
| Jeudi | 12h-13h | Conseil pratique |
```

---

## Workflow: Évolution

**Trigger:** `/linkedin evolution`

Lit `~/UltraCTO-OS/data/linkedin/posts.md` et génère:

```markdown
## Évolution LinkedIn - Boulet Stratégies TI

### Tendance engagement (3 derniers mois)

Déc 2025: ████████░░ 2.1%
Nov 2025: ██████░░░░ 1.5%
Oct 2025: █████░░░░░ 1.2%

📈 Progression: +75%

### Top 5 All-Time

| # | Post | Date | Engagement |
|---|------|------|------------|
| 1 | "..." | ... | 5.2% |

### Formats les plus performants

1. Carrousel: 3.5% engagement moyen
2. Texte long: 2.8%
3. Image: 2.1%

### Thèmes gagnants

1. Erreurs courantes PME (4.1%)
2. Conseils pratiques (3.2%)
3. Behind-the-scenes (2.9%)
```

---

## Workflow: Top Posts

**Trigger:** `/linkedin top`

Affiche les 10 meilleurs posts avec leur score et pourquoi ils ont performé.

---

## Storage Structure

```
~/UltraCTO-OS/data/linkedin/
├── posts.md              # Base de données principale
├── evolution.md          # Dashboard auto-généré
└── analyses/
    ├── 2025-12-26.md     # Rapport du jour
    └── ...
```

## Notes importantes

- **Screenshots requis:** Les analytics LinkedIn ne sont pas accessibles via API pour profils personnels
- **Vision Claude:** Utilise les capacités multimodales pour extraire les données
- **Précision:** Si un chiffre n'est pas visible clairement, demander confirmation
- **Historique:** Toujours mettre à jour posts.md après chaque analyse pour le tracking long terme
