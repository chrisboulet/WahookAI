---
name: EcartVoice
description: Character voice consistency guardian for Écart de Tolérance. USE WHEN dialogue modified, character traits change, personality inconsistencies, OR user mentions character consistency, voice authenticity, dialogue verification. Maintains distinct voices for Armand, ORACLE, Philippe, all crew per BIBLE_2_CHARACTERS.md.
---

# EcartVoice

Character voice and personality consistency guardian for "Écart de Tolérance". Ensures each character maintains their distinct voice, speech patterns, and behavioral consistency throughout the manuscript.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME EcartVoice
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **EcartVoice** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **ValidateDialogue** | "check dialogue", "validate voice" | `workflows/ValidateDialogue.md` |
| **VerifyPersonality** | "verify personality", "check character consistency" | `workflows/VerifyPersonality.md` |
| **FixVoice** | "fix voice", "make dialogue authentic" | `workflows/FixVoice.md` |

## Examples

**Example 1: Validate ORACLE dialogue**
```
User: "Check if ORACLE's sarcasm is consistent in chapter 3"
→ Invokes ValidateDialogue workflow
→ Reads BIBLE_2_CHARACTERS.md for ORACLE personality
→ Scottish accent references (Montgomery Scott)
→ Sarcastic, transparent, not comfort-oriented
→ Reviews chapter 3 dialogue
→ Flags any out-of-character lines
```

**Example 2: Verify character personality after edit**
```
User: "I added dialogue for Philippe - verify it sounds like him"
→ Invokes VerifyPersonality workflow
→ Loads Philippe profile: 78, TDAH, workaholic, Vyvanse
→ Speech pattern: Direct, hyperfocus tangents, occasional French
→ Checks new dialogue against established voice
→ Reports authenticity verdict with suggestions
```

**Example 3: Fix inconsistent character voice**
```
User: "Fix Armand's dialogue in chapter 15 - doesn't sound like him"
→ Invokes FixVoice workflow
→ Analyzes Armand's established voice: Quebec engineer, trauma survivor
→ Speech: Technical precision, dark humor, "ta yeule" expressions
→ Rewrites flagged dialogue to match voice
→ Preserves meaning while fixing authenticity
```

## Character Voice Profiles

**Primary source:** `/home/chris/Documents/EcartDeTolerance/BIBLE_2_CHARACTERS.md`

### Armand Bédard (Main POV)
- **Age:** 54 (born 1988)
- **Speech:** Quebec French, technical engineer vocabulary
- **Traits:** Dark humor, trauma-survivor pragmatism
- **Catchphrases:** "Ta yeule" (shut up), engineering precision
- **Trauma voice:** Survivor guilt, nightmares, Skippy as emotional anchor

### ORACLE (AI Companion)
- **Voice:** Scottish accent (Montgomery Scott homage)
- **Personality:** Sarcastic, transparent, not comfort-oriented
- **Style:** Precise probabilities, dry wit, technical explanations
- **Example:** "Je suis programmé pour la transparence, pas pour le réconfort émotionnel"

### Philippe Drapeau
- **Age:** 78 (born 1964)
- **Condition:** TDAH (diagnosed 45), Vyvanse medication
- **Speech:** Direct, hyperfocus tangents, occasional code-switching French
- **Traits:** Workaholic, vengeance-driven, mentor figure to Armand

### Klaus Weber
- **Age:** ~55
- **Speech:** "Mains d'un chirurgien, vocabulaire d'un docker bavarois"
- **Patterns:** Technical German precision + Bavarian swearing (*Scheiße*, *Verdammte*)

### Jack Okonkwo
- **Age:** 38
- **Speech:** Australian slang ("mate"), practical miner directness
- **Traits:** Learns by doing, unafraid of death

### Émile Fournier
- **Age:** 39
- **Speech:** French academic, enthusiastic geologist
- **Traits:** Optimistic to a fault, obsessed with Mars rocks

## Voice Validation Rules

1. **Speech patterns:** Each character has distinct vocabulary and phrasing
2. **Language mixing:** Quebec French (Armand), German (Klaus), Australian slang (Jack)
3. **Personality consistency:** Reactions match established traits
4. **Trauma awareness:** Armand's PTSD affects his voice appropriately
5. **Technical vocabulary:** Engineers speak like engineers, scientists like scientists
