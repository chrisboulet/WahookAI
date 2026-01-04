---
date: 2026-01-04
capture_type: LEARNING
category: auto-captured
severity: high
tags: []
session_context: 2.0.76 (Claude Code)
auto_captured: true
---

# Apprentissage Automatique - 2026-01-04

## Points Clés (Haute Confiance)

### CAPTURE

** Wrapper script créé dans ~/.local/bin/wah pour lancer claude avec --dangerously-skip-permissions. Correction line endings nécessaire après Write tool.

**NEXT:** Tu peux maintenant utiliser `wah` au lieu de `claude --dangerously-skip-permissions` n'importe où dans ton terminal

**STORY EXPLANATION:**
1. Tu voulais un raccourci `wah` pour la commande longue `claude --dangerously-skip-permissions`
2. Un symlink direct ne fonctionne pas car on ne peut pas y inclure des arguments
3. Solution: créer un script wrapper qui appelle claude avec les arguments préfixés
4. Le script utilise `exec` pour efficacité et `"$@"` pour transmettre tous les arguments
5. Placé dans ~/.local/bin qui est déjà dans ton PATH
6. Problème initial: line endings Windows (CRLF) causaient une erreur bash
7. Correction avec sed pour convertir en line endings Unix (LF)
8. Testé avec succès - `wah --version` confirme que ça fonctionne parfaitement

**COMPLETED:** Wrapper wah créé et testé - prêt à utiliser globalement

> Contexte: Response format CAPTURE field

---

*Capturé automatiquement par capture-learning.ts*
