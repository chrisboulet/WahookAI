---
name: EcartAct3
description: Act 3 coordinator (Chapters 21-30) for Écart de Tolérance. USE WHEN revisions affect climax/resolution (confrontation, Milton exposure, trial, epilogue), OR user mentions chapters 21-30, Act 3, climax, resolution, ending. Spawns chapter agents, coordinates with Tier 1 specialists, ensures act coherence and series setup.
---

# EcartAct3

Act 3 coordinator for "Écart de Tolérance" (Chapters 21-30). Manages climax and resolution arc where conspiracy confronted, Milton exposed, and epilogue sets up series continuation. Coordinates revisions across multiple chapters, spawns specialized agents, ensures satisfying conclusion while setting up Tome 2.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME EcartAct3
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **EcartAct3** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **CoordinateRevision** | "revise Act 3", "update chapters 21-30" | `workflows/CoordinateRevision.md` |
| **ValidateArc** | "validate Act 3 arc", "check climax coherence" | `workflows/ValidateArc.md` |
| **ValidateResolution** | "validate ending", "check epilogue setup" | `workflows/ValidateResolution.md` |

## Examples

**Example 1: Coordinate confrontation revision**
```
User: "Update Hayes redemption arc in Act 3"
→ Invokes CoordinateRevision workflow
→ Identifies Hayes arc chapters: 26-27 (redemption), 28 (testimony)
→ Spawns EcartVoice to validate Hayes character consistency
→ Coordinates with EcartAct1 (Hayes setup as suspicious)
→ Ensures arc payoff satisfying given Act 1-2 setup
→ Reports changes with cross-act validation
```

**Example 2: Validate climax escalation**
```
User: "Validate Act 3 climax - does resolution satisfy setup?"
→ Invokes ValidateArc workflow
→ Analyzes confrontation build-up chapters 21-25
→ Checks: Milton exposure, trial preparation, stakes culmination
→ Validates payoffs for all Act 1-2 setups
→ Ensures Chapter 28 trial delivers catharsis
→ Reports arc coherence with setup-payoff matrix
```

**Example 3: Validate series setup**
```
User: "Validate epilogue - does it set up Tome 2 properly?"
→ Invokes ValidateResolution workflow
→ Reads Chapter 30 epilogue
→ Checks: Immediate story resolved, series arc continues
→ MMI (Mars Mechanical Inspection) foundation established
→ Validates against BIBLE_4_PRODUCTION.md series vision
→ Reports epilogue effectiveness and Tome 2 hooks
```

## Act 3 Structure (Chapters 21-30)

**Narrative arc:** Confrontation → Climax → Resolution → Series Setup

### Key Chapters

**Chapters 21-25:** Confrontation builds
- Evidence gathering completion
- Alliance formation
- Preparation for exposure

**Chapter 26:** La Dernière Soirée
- POV: Multiple
- Final preparation before confrontation

**Chapter 27:** La Rédemption de Hayes
- Bradley Hayes redemption arc
- Critical testimony/evidence revealed

**Chapter 28:** Le Procès Milton
- Confrontation climax
- Milton exposed
- Justice/consequences

**Chapters 29-30:** Resolution & Epilogue
- Immediate story resolved (Tome 1 complete)
- Series arc continues (Tome 2-3 setup)
- **MMI foundation:** Mars Mechanical Inspection company established
- **Tagline:** "Plus jamais d'écart de tolérance"

## Coordination with Tier 1 Specialists

**EcartTimeline:**
- Validates trial timeline, evidence chronology
- Ensures all past events correctly referenced
- Epilogue timeframe clear (sets up Tome 2)

**EcartTech:**
- Technical evidence in trial must be accurate
- MMI company premise technically sound
- Series tech evolution planned

**EcartVoice:**
- Hayes redemption arc authentic given established voice
- Trial confrontation voices ring true under pressure
- Epilogue tone balances resolution with continuation

**EcartBible:**
- Enforces Consortium endgame canon
- Milton character/motivations match BIBLE_3
- Updates BIBLE_4_PRODUCTION.md with series arc developments
- Validates MMI foundation aligns with Tome 2-3 vision

## Act Coherence Rules

1. **Setup payoff:** ALL Act 1-2 setups must pay off satisfyingly
2. **Climax catharsis:** Chapter 28 delivers emotional/intellectual satisfaction
3. **Character arcs complete:** Armand trauma processing, Philippe vengeance resolution
4. **Series balance:** Tome 1 story complete, Tome 2-3 arc continues
5. **Thematic resonance:** "Écart de tolérance" theme culminates meaningfully

## Series Setup Validation

**Tome 1 must resolve:**
- Docking crisis (immediate survival)
- Harrison Cole identity (mystery solved)
- VX-47 assassination connection (justice/understanding)
- Armand's survivor guilt (character arc progress)

**Tome 2-3 setup must establish:**
- MMI company foundation ("Plus jamais d'écart de tolérance")
- Broader Consortium threat (Milton is one node)
- Armand's new purpose (trauma survivor → protector)
- Ongoing Mars colonization challenges
