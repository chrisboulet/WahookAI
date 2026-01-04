---
name: EcartBible
description: Bible keeper for Écart de Tolérance canonical decisions. USE WHEN major revisions made, OR user asks to update Bible, enforce canon, document decisions, propagate changes. Masters all 4 Bible documents (REFERENCE, CHARACTERS, WORLDBUILDING, PRODUCTION). Updates Bible after all manuscript changes.
---

# EcartBible

Canonical decision keeper for "Écart de Tolérance". Maintains and updates all 4 Bible documents, enforces canonical decisions, and ensures Bible-manuscript coherence.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME EcartBible
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **EcartBible** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **UpdateBible** | "update Bible", "document decision" | `workflows/UpdateBible.md` |
| **EnforceCanon** | "enforce canon", "check Bible compliance" | `workflows/EnforceCanon.md` |
| **PropagateChange** | "propagate change", "update manuscript from Bible" | `workflows/PropagateChange.md` |

## Examples

**Example 1: Update Bible after major revision**
```
User: "Update Bible - we changed DL-27 to ML-27 (M-Link constellation)"
→ Invokes UpdateBible workflow
→ Identifies affected Bible: BIBLE_3_WORLDBUILDING.md
→ Adds M-Link constellation definition
→ Updates satellite nomenclature section
→ Documents decision in BIBLE_MASTER.md revision log
→ Commits change with timestamp
```

**Example 2: Enforce canonical decision**
```
User: "Enforce canon - ensure all VX-47 assassination details match Bible"
→ Invokes EnforceCanon workflow
→ Reads BIBLE_1_REFERENCE.md for canonical VX-47 details
→ March 12, 2038, 5 deaths, timeline documented
→ Scans manuscript for all assassination references
→ Flags deviations from canonical version
→ Reports inconsistencies with correction suggestions
```

**Example 3: Propagate Bible change to manuscript**
```
User: "Propagate Armand's age change (41→54) throughout manuscript"
→ Invokes PropagateChange workflow
→ Confirms BIBLE_2_CHARACTERS.md shows Armand: 54 (born 1988)
→ Searches manuscript for age references, career timeline
→ Coordinates with EcartTimeline to verify cascading changes
→ Updates all affected passages
→ Reports completion with line numbers changed
```

## Bible Structure (4 Documents)

**Location:** `/home/chris/Documents/EcartDeTolerance/`

### BIBLE_1_REFERENCE.md (~8,500 tokens)
- Concept and pitch
- **Timeline complète 2025-2042**
- Structure narrative (3 actes, 30 chapitres)
- Résumé des 30 chapitres
- Thèmes et motifs

### BIBLE_2_CHARACTERS.md (~12,000 tokens)
- **Personnages principaux** (Armand, ORACLE, Philippe, ATHENA, DRAPO, JOSEPHINE)
- **Équipage complet** (10 membres avec backgrounds)
- Dynamiques d'équipage
- Dialogues types et voix distinctes

### BIBLE_3_WORLDBUILDING.md (~11,000 tokens)
- **Organisations** (VEGA, AstraCAN, structure corporative)
- **Le Consortium** (backstory, opérations)
- **Worldbuilding technique** (orbites, bases, technologies)
- **Science dure** (DeepLink, M-Link, ORACLE, ATHENA, blockchain)
- **Terminologie technique** (filetage, ISO standards, satellite nomenclature)

### BIBLE_4_PRODUCTION.md (~6,000 tokens)
- Vision série (Tomes 1-3)
- Conseils d'écriture
- Stratégie publication KDP
- Plan d'expansion (41K → 85K mots)
- **Révisions et corrections** (journal de bord)

### BIBLE_MASTER.md (Index)
- Navigation rapide entre 4 documents
- État actuel manuscrit
- **Dernières corrections** (journal chronologique)
- Historique des versions

## Bible Keeper Responsibilities

1. **Document all canonical decisions:** Every major revision logged in BIBLE_MASTER.md
2. **Maintain coherence:** Ensure 4 Bible documents don't contradict each other
3. **Enforce authority:** Bible is source of truth, manuscript must conform
4. **Propagate changes:** When Bible updated, coordinate manuscript updates
5. **Track revisions:** Maintain chronological log of all decisions (BIBLE_MASTER.md lines 133-332)

## Canonical Decision Log Format

When documenting in BIBLE_MASTER.md:

```markdown
✅ **[Category] - Décision canonique (DATE):**
- **Problème identifié:** [What was wrong]
- **Solution approuvée:** [What was decided]
- **Impact manuscrit:** [What needs changing in manuscript]
- **Documents Bible mis à jour:** [Which Bible files were updated]
```

## Update Priority

1. **BIBLE_MASTER.md:** Always update first (decision log)
2. **Specific Bible:** Update relevant document (1-4)
3. **Coordinate specialists:** Notify EcartTimeline/EcartTech/EcartVoice of changes
4. **Manuscript propagation:** Work with Act coordinators to update chapters
