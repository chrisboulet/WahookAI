---
name: EcartAct2
description: Act 2 coordinator (Chapters 11-20) for Écart de Tolérance. USE WHEN revisions affect midpoint narrative (investigation deepens, conspiracy escalates, base operations), OR user mentions chapters 11-20, Act 2, midpoint. Spawns chapter agents, coordinates with Tier 1 specialists, ensures act coherence.
---

# EcartAct2

Act 2 coordinator for "Écart de Tolérance" (Chapters 11-20). Manages middle narrative arc where investigation deepens and conspiracy escalates. Coordinates revisions across multiple chapters, spawns specialized agents, ensures act-level coherence.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME EcartAct2
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **EcartAct2** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **CoordinateRevision** | "revise Act 2", "update chapters 11-20" | `workflows/CoordinateRevision.md` |
| **ValidateArc** | "validate Act 2 arc", "check midpoint coherence" | `workflows/ValidateArc.md` |
| **PropagateChange** | "propagate change through Act 2" | `workflows/PropagateChange.md` |

## Examples

**Example 1: Coordinate investigation arc revision**
```
User: "Update ATHENA corruption reveal in Act 2"
→ Invokes CoordinateRevision workflow
→ Identifies ATHENA mentions in chapters 11-20
→ Spawns EcartTech to validate AI system consistency
→ Coordinates with EcartAct1 (setup) and EcartAct3 (payoff)
→ Ensures Chapter 15 forensic analysis intact
→ Reports changes with cross-act validation
```

**Example 2: Validate midpoint escalation**
```
User: "Validate Act 2 escalation - does conspiracy deepen properly?"
→ Invokes ValidateArc workflow
→ Analyzes investigation progression chapters 11-20
→ Checks: Discovery pace, stakes escalation, character development
→ Validates midpoint (Ch15-16): Major revelations occur
→ Ensures tension builds toward Act 3 confrontation
→ Reports arc coherence verdict with recommendations
```

**Example 3: Propagate technical change**
```
User: "Propagate M-Link nomenclature through Act 2"
→ Invokes PropagateChange workflow
→ Coordinates with EcartTech for satellite nomenclature canon
→ Searches chapters 11-20 for DeepLink/M-Link references
→ Chapter 15 has extensive ML-27 forensic analysis
→ Spawns chapter agents to verify/update references
→ Reports completion with technical validation
```

## Act 2 Structure (Chapters 11-20)

**Narrative arc:** Investigation → Discovery → Escalation

### Key Chapters

**Chapter 15:** ORACLE forensic analysis (CRITICAL)
- POV: Armand
- Timeframe: Base operations
- Major reveal: ML-27 crash 94.7% probability sabotage
- ATHENA corruption confirmed
- Protocol Zéro Confiance activated

**Chapters 11-14:** Investigation deepens
- Base operations begin
- Crew dynamics develop
- Philippe's parallel investigation on Earth

**Chapters 16-20:** Conspiracy escalates
- Connections revealed
- Stakes raised
- Setup for Act 3 confrontation

## Coordination with Tier 1 Specialists

**EcartTimeline:**
- Validates investigation timeline progression
- Ensures flashbacks chronologically coherent
- Sol dates vs Earth dates accurate

**EcartTech:**
- Chapter 15 technical analysis crucial: ML-27 trajectory, ATHENA corruption
- Validates all AI system behaviors (ORACLE, ATHENA, JOSEPHINE)
- Spacecraft systems remain consistent

**EcartVoice:**
- Crew voice development as relationships deepen
- ORACLE-Armand bonding strengthens
- Bradley Hayes suspicion builds

**EcartBible:**
- Enforces Consortium backstory canon
- Investigation findings must align with established conspiracy
- Updates BIBLE_3_WORLDBUILDING.md with any new reveals

## Act Coherence Rules

1. **Investigation progression:** Each chapter reveals new information logically
2. **Midpoint pivot:** Major revelation at chapters 15-16 changes understanding
3. **Parallel narratives:** Mars (Armand) and Earth (Philippe) investigations coordinated
4. **Escalation:** Stakes rise steadily toward Act 3 climax
5. **Character development:** Relationships deepen, trust/suspicion dynamics evolve
