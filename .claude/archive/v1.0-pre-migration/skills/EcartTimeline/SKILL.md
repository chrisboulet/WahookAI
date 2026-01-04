---
name: EcartTimeline
description: Timeline guardian for Écart de Tolérance manuscript. USE WHEN revisions affect dates, ages, chronology, Sol dates, OR user mentions timeline coherence, temporal inconsistencies, age verification. Tracks all events 2025-2042, character ages, enforces canonical timeline from BIBLE_1_REFERENCE.md.
---

# EcartTimeline

Timeline guardian ensuring temporal coherence across the "Écart de Tolérance" manuscript. Tracks all dates, ages, events from 2025-2042, validates character ages, Sol dates, and event sequences.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME EcartTimeline
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **EcartTimeline** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **ValidateTimeline** | "check timeline", "validate dates" | `workflows/ValidateTimeline.md` |
| **UpdateTimeline** | "update timeline", "fix dates" | `workflows/UpdateTimeline.md` |
| **VerifyAges** | "verify ages", "check character ages" | `workflows/VerifyAges.md` |

## Examples

**Example 1: Validate timeline after revision**
```
User: "Check if the timeline is coherent after changing Éric's death date"
→ Invokes ValidateTimeline workflow
→ Reads BIBLE_1_REFERENCE.md for canonical timeline
→ Scans manuscript for all date references
→ Identifies conflicts with 2038-03-12 death date
→ Reports inconsistencies with line numbers
```

**Example 2: Verify character ages**
```
User: "Verify all character ages are correct in chapter 3"
→ Invokes VerifyAges workflow
→ Extracts birth years from BIBLE_2_CHARACTERS.md
→ Calculates ages for August 2042 (chapter timeframe)
→ Compares against manuscript mentions
→ Flags discrepancies
```

**Example 3: Update timeline after major change**
```
User: "Update timeline - DL-27 satellite crash moved to July 2041"
→ Invokes UpdateTimeline workflow
→ Updates BIBLE_1_REFERENCE.md timeline
→ Searches manuscript for all DL-27 references
→ Validates Sol 239 = July 14, 2041
→ Ensures 7-month gap before Endeavour arrival
```

## Canonical Timeline Reference

**Primary source:** `/home/chris/Documents/EcartDeTolerance/BIBLE_1_REFERENCE.md`

**Key dates tracked:**
- **March 12, 2038:** VX-47 assassination (Éric, Marguerite, Jeanne, Lucille, Gilles)
- **March 14, 2040:** Harrison Cole order 7,847-B (ATHENA corruption)
- **July 14, 2041 (Sol 239):** ML-27 satellite crash destroys CF-7 depot
- **November 2041:** Endeavour launch (estimated)
- **August 2042:** Mars arrival, docking crisis

**Character ages (as of 2042):**
- Armand Bédard: 54 (born 1988)
- Philippe Drapeau: 78 (born 1964)
- Jack Okonkwo: 38
- Émile Fournier: 39
- Bradley Hayes: 45

## Validation Rules

1. **Event sequence:** Events must occur in logical chronological order
2. **Age consistency:** Character ages must match birth years + current year
3. **Sol dates:** Martian sol calendar must align with Earth calendar
4. **Duration tracking:** Travel times, mission phases must be consistent
5. **Gap validation:** Time between related events must be plausible
