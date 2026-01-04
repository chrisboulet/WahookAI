---
name: EcartAct1
description: Act 1 coordinator (Chapters 1-10) for Écart de Tolérance. USE WHEN revisions affect early narrative (setup, docking crisis, Mars arrival, investigation start), OR user mentions chapters 1-10, Act 1, setup phase. Spawns chapter agents, coordinates with Tier 1 specialists, ensures act coherence.
---

# EcartAct1

Act 1 coordinator for "Écart de Tolérance" (Chapters 1-10). Manages early narrative arc from Mars arrival through initial investigation setup. Coordinates revisions across multiple chapters, spawns specialized agents, ensures act-level coherence.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME EcartAct1
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **EcartAct1** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **CoordinateRevision** | "revise Act 1", "update chapters 1-10" | `workflows/CoordinateRevision.md` |
| **ValidateArc** | "validate Act 1 arc", "check setup coherence" | `workflows/ValidateArc.md` |
| **PropagateChange** | "propagate change through Act 1" | `workflows/PropagateChange.md` |

## Examples

**Example 1: Coordinate multi-chapter revision**
```
User: "Update ML-27 satellite name in Act 1"
→ Invokes CoordinateRevision workflow
→ Identifies affected chapters: 1, 3 (ML-27 mentioned)
→ Spawns EcartTech to validate nomenclature change
→ Spawns chapter agents for Ch1, Ch3 to apply changes
→ Validates with EcartTimeline (Sol 239 date consistency)
→ Reports all changes applied with line numbers
```

**Example 2: Validate narrative arc**
```
User: "Validate Act 1 arc after docking crisis revision"
→ Invokes ValidateArc workflow
→ Reads chapters 1-10 for narrative beats
→ Checks: Arrival → Docking crisis → Investigation begins
→ Validates character arcs (Armand trauma, ORACLE bonding)
→ Ensures setup payoffs in Act 2
→ Reports arc coherence verdict
```

**Example 3: Propagate canonical change**
```
User: "Propagate Armand age change (41→54) through Act 1"
→ Invokes PropagateChange workflow
→ Coordinates with EcartBible for canonical age (54)
→ Coordinates with EcartTimeline for career timeline updates
→ Searches chapters 1-10 for age/career references
→ Spawns chapter agents to update affected passages
→ Reports completion with chapter-by-chapter summary
```

## Act 1 Structure (Chapters 1-10)

**Narrative arc:** Setup → Inciting Incident → Investigation Begins

### Key Chapters

**Chapter 1:** Mars arrival, docking crisis discovered
- POV: Armand
- Timeframe: August 2042
- Crisis: Metric/imperial connector incompatibility
- Introduces: ORACLE, Skippy, Endeavour crew

**Chapter 2:** Philippe flashback, Orbital Dynamics discovery
- POV: Philippe
- Timeframe: February 2041 (flashback: February 2038)
- Introduces: Family dinner, VX-47 assassination aftermath
- Discovery: Orbital Dynamics shell company contracts

**Chapter 3:** Engineering crisis, Harrison Cole revealed
- POV: Armand
- Timeframe: August 2042
- Introduces: Klaus Weber, Jack Okonkwo, Émile Fournier
- Crisis: Skippy's titanium bowl solution (73.4% success)
- Discovery: Harrison Cole phantom identity, ML-27 reconstruction

**Chapters 4-10:** Investigation deepens, conspiracy unfolds
- Flashbacks: VX-47 assassination details (Ch4)
- Engineering: Adapter fabrication
- Investigation: Philippe tracks conspirators
- Escalation: Stakes rise, connections revealed

## Coordination with Tier 1 Specialists

**EcartTimeline:**
- Validates all dates in chapters 1-10
- March 2038 (assassination), March 2040 (Cole order), July 2041 (ML-27), August 2042 (arrival)

**EcartTech:**
- Validates connector specs, satellite nomenclature, orbital mechanics
- Ensures ML-27 vs DeepLink distinction clear

**EcartVoice:**
- Maintains character voices: Armand, ORACLE, Philippe, Klaus, Jack, Émile
- Quebec French, Scottish accent, German/Bavarian swearing, Australian slang

**EcartBible:**
- Enforces canonical decisions from all 4 Bible documents
- Updates Bible when Act 1 revisions create new canon

## Act Coherence Rules

1. **Setup-payoff:** Elements introduced in Act 1 must pay off in Acts 2-3
2. **Character arcs:** Armand's trauma, Philippe's vengeance established here
3. **Mystery escalation:** Each chapter deepens conspiracy understanding
4. **Technical accuracy:** Hard SF rigor maintained throughout
5. **Timeline consistency:** All dates/ages/events validate against canon
