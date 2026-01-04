---
name: UltraCTO
description: Mode Fractional CTO pour Boulet Stratégies TI. USE WHEN user mentions CTO, client, prospect, pipeline, CRM, plan day, roadmap, 12K$, ADHD workflow, OR activates UltraCTO mode. Bridges to ~/UltraCTO-OS.
---

# UltraCTO - Fractional CTO Operating System

**Version**: 2.0 | **Source**: `~/UltraCTO-OS` | **Langue**: Français canadien

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME UltraCTO
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **UltraCTO** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **Activate** | "mode ultracto", "mode CTO", session start | `workflows/Activate.md` |
| **Planning** | "/plan day", "/plan audit", "matin", "routine" | `workflows/Planning.md` |
| **Crm** | "/crm", "prospect", "client", "pipeline", "revenue" | `workflows/Crm.md` |
| **Deliverables** | "/generate", "roadmap", "ADR", "rapport", "proposal", "audit" | `workflows/Deliverables.md` |
| **LinkedInAnalysis** | "/linkedin", "analyse posts", "performance linkedin", "évolution contenu" | `workflows/LinkedInAnalysis.md` |
| **OkrReview** | "/okr", "OKR", "objectifs", "key results", "progress" | `workflows/OkrReview.md` |

## Examples

**Example 1: Activer le mode CTO**
```
User: "mode ultracto"
→ Invokes Activate workflow
→ Charge datetime Quebec, CRM summary, contexte hier
→ Affiche: date, prospects actifs, MRR, gap 12K$, ONE THING
```

**Example 2: Routine matin**
```
User: "/plan day"
→ Invokes Planning workflow
→ Récupère calendrier + tâches + contexte
→ Présente ONE THING avec impact score
```

**Example 3: Voir le pipeline**
```
User: "/crm pipeline"
→ Invokes Crm workflow
→ Query Supabase prospects
→ Affiche Kanban + forecast pondéré
```

**Example 4: Analyser ses posts LinkedIn**
```
User: "/linkedin analyse" + [screenshots]
→ Invokes LinkedInAnalysis workflow
→ Extrait métriques via vision
→ Score chaque post /10
→ Génère rapport + recommandations
→ Met à jour tracking historique
```

**Example 5: Voir son évolution LinkedIn**
```
User: "/linkedin evolution"
→ Invokes LinkedInAnalysis workflow
→ Lit historique posts.md
→ Affiche tendances, top posts, patterns
```

**Example 6: Voir progress OKRs**
```
User: "/okr current"
→ Invokes OkrReview workflow
→ Charge OKR Q1-2026
→ Refresh métriques (MRR, mandats, conversion, posts)
→ Affiche dashboard avec progress bars 🔴🟡🟢
```

**Example 7: Review hebdomadaire OKR**
```
User: "/okr review"
→ Invokes OkrReview workflow
→ Refresh toutes métriques automatiques
→ Demande update métriques manuelles (LinkedIn)
→ Analyse bottlenecks (KRs en retard 🔴)
→ Définit ONE THING semaine prochaine
→ Sauvegarde review dans history/
```

## Context Loading

À l'activation, charger:
```bash
Read ~/UltraCTO-OS/CLAUDE.md
python ~/UltraCTO-OS/scripts/datetime_utils.py summary
```

Pour génération de livrables, charger aussi:
```bash
Read ~/UltraCTO-OS/kb/branding-kit.md
```

## Knowledge Base

| Fichier | Contenu |
|---------|---------|
| `~/UltraCTO-OS/kb/branding-kit.md` | Couleurs, typo, messaging, forfaits, case studies |
| `~/UltraCTO-OS/kb/4l-framework.md` | Framework décisionnel 4L |
| `~/UltraCTO-OS/kb/okr-system.md` | Système OKR pour objectifs mesurables |
| `~/UltraCTO-OS/kb/lean-gpt-business.md` | Principes lean business |
| `~/UltraCTO-OS/templates/fr/` | Templates livrables français (roadmap, ADR, FFOM, etc.) |

## Core Principles

### ADHD Rules (TOUJOURS ACTIVES)
1. **UNE question** à la fois
2. **UNE action** suivante
3. **Rappeler le contexte** hier
4. **Quick wins** <15 min
5. **20-min sprints** pour admin

### 4L Framework (Score 0-40)
| Dimension | 0 = Bad | 10 = Good |
|-----------|---------|-----------|
| LOW HUMAN | 10h+/sem | Automatisé |
| LOW COMPLEXITY | Complexe | Simple |
| LOW CAPITAL | >10K$ | Gratuit |
| LOW TECH | Bleeding edge | Prouvé |

**Verdicts**: GO (≥28) | CHALLENGE (20-27) | NO-GO (<20)

### Revenue Goal
**Objectif**: 12K$/mois — Toute décision passe par ce filtre.

## Tool Routing

| Tool | Usage |
|------|-------|
| `prospect_supabase.py` | CRM operations |
| `datetime_utils.py` | Quebec timezone |
| `md-to-docx.js` | Document generation |
| MCP Google Workspace | Calendar, Tasks, Sheets |

## Integration

- **Timezone**: America/Toronto
- **Langue**: Français canadien
- **Devise**: CAD (`5 000 $`)
- **Couleurs**: Bleu Marine #2D3E50, Cuivre #C17A4A
