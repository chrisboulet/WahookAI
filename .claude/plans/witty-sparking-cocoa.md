# Plan: Workflow LinkedIn Analysis pour UltraCTO

## Objectif
Ajouter un workflow d'analyse de posts LinkedIn au skill UltraCTO, utilisant les capacités de vision de Claude pour analyser des screenshots de stats LinkedIn.

## Contexte
- **Skill existant:** `/home/chris/.claude/skills/UltraCTO/`
- **Workflows actuels:** Activate, Planning, Crm, Deliverables
- **Contrainte:** API LinkedIn restrictive pour profils personnels → approche screenshots + AI

## Fichiers à modifier/créer

### 1. Nouveau workflow
**Fichier:** `/home/chris/.claude/skills/UltraCTO/workflows/LinkedInAnalysis.md`

**Contenu:**
- Instructions pour analyser screenshots LinkedIn
- Extraction des métriques (likes, comments, impressions, etc.)
- Analyse du contenu (thème, longueur, format, hook)
- Scoring système (note /10 par post)
- Génération de recommandations
- Identification des patterns (meilleurs jours, formats, thèmes)

### 2. Mise à jour SKILL.md
**Fichier:** `/home/chris/.claude/skills/UltraCTO/SKILL.md`

**Modifications:**
- Ajouter entrée dans la table Workflow Routing
- Trigger: `"linkedin", "posts", "analyse posts", "performance contenu"`
- Ajouter exemple d'utilisation

### 3. Système de tracking historique
**Dossier:** `~/UltraCTO-OS/data/linkedin/`

**Fichiers:**
- `posts.md` - Base de données des posts analysés
- `analyses/YYYY-MM-DD.md` - Rapports d'analyse datés
- `evolution.md` - Dashboard d'évolution (auto-généré)

**Structure posts.md:**
```markdown
## Post History

| Date | Post (excerpt) | Format | Likes | Comments | Impressions | Engagement | Score |
|------|----------------|--------|-------|----------|-------------|------------|-------|
| 2025-01-15 | "Les 3 erreurs..." | Texte | 45 | 12 | 2500 | 3.2% | 7/10 |
```

**Dashboard evolution.md:**
- Engagement moyen par mois (graphique ASCII)
- Top 5 posts all-time
- Formats les plus performants
- Progression vs objectifs

## Workflow LinkedInAnalysis - Détail

### Input attendu
- 1 ou plusieurs screenshots de posts LinkedIn avec leurs stats
- Période d'analyse (optionnel)

### Processing
1. **Extraction vision:** Lire les screenshots pour extraire:
   - Texte du post
   - Likes, comments, reposts
   - Impressions (si visible)
   - Date de publication

2. **Analyse par post:**
   - Hook score (première ligne accrocheuse?)
   - Longueur (court <500 chars, moyen, long >1500)
   - Format (texte seul, avec image, carrousel, vidéo)
   - Thème/catégorie
   - CTA présent?
   - Taux d'engagement = (likes + comments*3 + reposts*2) / impressions

3. **Analyse globale:**
   - Top performers vs under-performers
   - Patterns: quels formats/thèmes marchent
   - Meilleurs jours/heures (si data suffisante)
   - Tendances d'engagement

### Output
```markdown
## Rapport LinkedIn - [Date]

### Résumé
- Posts analysés: X
- Engagement moyen: X%
- Top performer: [Post title]

### Score par post
| Post | Date | Format | Engagement | Score |
|------|------|--------|------------|-------|
| ... | ... | ... | ... | /10 |

### Patterns identifiés
- ✅ Ce qui marche: ...
- ❌ Ce qui marche moins: ...

### Recommandations
1. ...
2. ...
3. ...

### Calendrier suggéré
| Jour | Créneau | Type de contenu |
|------|---------|-----------------|
```

## Commandes utilisateur

```
/linkedin analyse [screenshots]
/linkedin rapport
/linkedin tendances
```

## Critères de succès
- [ ] Workflow déclenché par triggers appropriés
- [ ] Extraction correcte des métriques depuis screenshots
- [ ] Scoring cohérent et actionnable
- [ ] Recommandations personnalisées basées sur les données
- [ ] Format de rapport clair et utilisable

## Sources
- [LinkedIn Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api)
- [LinkedIn Developer](https://developer.linkedin.com/)
