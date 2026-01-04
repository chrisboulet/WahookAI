---
date: 2026-01-04
capture_type: LEARNING
category: auto-captured
severity: high
tags: []
session_context: Todos have been modified successfully. Ensure that you continue to use the todo list to track your p
auto_captured: true
---

# Apprentissage Automatique - 2026-01-04

## Points Clés (Haute Confiance)

### CAPTURE

**
- Clé API Gemini exposée sur GitHub (désactivée par Christian)
- `.gitignore` contient `.env.local` (protection en place)
- Historique Git analysé - aucune clé visible dans commits récents master
- Besoin d'identifier commit exact pour purger historique si nécessaire
- Procédure complète de remédiation prête (BFG + nouvelle clé + audit)

**STORY EXPLANATION:**
1. Une clé API Gemini a été accidentellement poussée sur GitHub public
2. Christian l'a immédiatement désactivée dans Google Cloud Console (réaction rapide ✓)
3. Cependant, la clé reste dans l'historique Git - toute personne qui clone le repo peut la voir
4. Même désactivée, c'est une mauvaise pratique de laisser des secrets dans l'historique
5. Il faut purger l'historique Git avec BFG Repo-Cleaner (outil officiel GitHub)
6. Puis force-push pour réécrire l'historique du repo distant
7. Ensuite, générer une nouvelle clé API et l'ajouter uniquement dans `.env.local`
8. Finalement, documenter l'incident pour éviter la répétition

**COMPLETED:** Clé désactivée ✓ - Analyse historique Git complète - Attente localisation exacte

> Contexte: Response format CAPTURE field

---

*Capturé automatiquement par capture-learning.ts*
