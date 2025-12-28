---
date: 2025-12-28
capture_type: LEARNING
category: best-practice
severity: high
tags: [profile, user-info, fabrication, verification]
session_context: VMware alternatives blog post creation
---

# Apprentissage: Toujours vérifier profile.json pour les informations utilisateur

## Le Problème

Lors de la rédaction d'un blog pour Boulet Stratégies TI, j'ai inventé le prénom "Daniel Boulet" au lieu de vérifier les informations disponibles dans le système.

## L'Erreur

- J'ai écrit "Daniel Boulet, Fractional CTO" dans le blog
- L'utilisateur a demandé: "tu as trouvé le prénom Daniel a quel endroit?"
- J'avais **fabriqué** ce prénom - c'est une erreur grave

## La Solution

Le fichier `${PAI_DIR}/config/profile.json` contient les informations correctes:

```json
{
  "user": {
    "name": "Christian Boulet",
    "email": "chrisboulet@gmail.com"
  }
}
```

## La Règle

**AVANT d'utiliser des informations personnelles de l'utilisateur dans un document:**

1. Vérifier `${PAI_DIR}/config/profile.json`
2. Si l'info n'est pas là, DEMANDER à l'utilisateur
3. JAMAIS inventer ou assumer des informations personnelles

## Pourquoi c'est Important

- Un blog est une vitrine publique - les erreurs de nom sont embarrassantes
- La fabrication de données détruit la crédibilité
- Le système PAI existe précisément pour éviter ce type d'erreur

## Fichiers Concernés

- `/home/chris/WahookAI/.claude/config/profile.json` - Source de vérité pour user info
- `/home/chris/WahookAI/history/research/2025-12/vmware-alternatives/blog-vmware-alternatives-2026.md` - Blog corrigé

## Résumé

**Ne jamais fabriquer d'informations personnelles. Toujours vérifier profile.json ou demander.**
