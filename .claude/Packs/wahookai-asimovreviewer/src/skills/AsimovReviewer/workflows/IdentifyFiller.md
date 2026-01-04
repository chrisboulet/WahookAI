# IdentifyFiller Workflow

Ruthless identification of unnecessary content - the Asimov efficiency test.

## Philosophy

Isaac Asimov was famously prolific AND efficient. He believed:

> "Every scene must do at least one of two things: reveal character or advance the action. Preferably both."

Filler is content that:
- Repeats information already established
- Describes things the reader can infer
- Exists only to pad word count
- Slows pacing without purpose
- Explains what should be shown

## The Asimov Test

For each scene/passage, ask:

1. **Does this advance the plot?** (Events that matter happen)
2. **Does this reveal character?** (We learn something new about someone)
3. **Does this establish necessary worldbuilding?** (First mention only)
4. **Would cutting this confuse readers?** (If no, consider cutting)
5. **Is this emotional payoff for earlier setup?** (If no setup, it's filler)

If a passage fails ALL tests = definite filler
If it passes only one weakly = potential filler
If it passes two or more strongly = keep

## Red Flags for Filler

### 1. "As You Know, Bob"
Characters explaining things they both already know.
> "As you know, Bob, Mars has only 38% of Earth's gravity..."

Fix: Show it through action, or cut entirely.

### 2. Redundant Descriptions
Describing the same thing multiple ways.
> "The red planet stretched before them. Mars, in all its rusty glory. The fourth planet from the sun, named after the Roman god of war..."

Fix: Choose the best description, delete the rest.

### 3. Unnecessary Transitions
Every entry/exit, every walk down a corridor.
> "He stood up. He walked to the door. He opened it. He stepped through. He closed it behind him. He walked down the corridor..."

Fix: Jump cut to the next important moment.

### 4. Emotional Repetition
Same emotion stated multiple ways.
> "He was sad. Grief washed over him. The sorrow was unbearable. He felt the weight of loss..."

Fix: Show once through action/dialogue, not telling.

### 5. Research Dumps
Author showing off research that doesn't serve story.
> [Two paragraphs explaining how CO2 scrubbers work when the plot just needs "the air recycler broke"]

Fix: Include only what's plot-relevant.

## Process

### Step 1: Scene Inventory

List every scene in the chapter(s):
| Scene | Location | Characters | Word Count | Purpose |

### Step 2: Purpose Test

For each scene, identify:
- Plot advancement: [None / Minor / Major]
- Character development: [None / Minor / Major]
- Worldbuilding: [None / First mention / Repetition]
- Emotional purpose: [Setup / Payoff / Neither]

### Step 3: Flag Suspects

Mark scenes that score:
- All "None" = ❌ DEFINITE FILLER
- Mostly "None/Minor" = ⚠️ POTENTIAL FILLER
- "Repetition" in worldbuilding = ⚠️ CHECK FOR NECESSITY

### Step 4: Paragraph-Level Analysis

Within flagged scenes, identify specific passages that could be:
- Cut entirely
- Condensed
- Merged with another scene

### Step 5: Asimov Verdict

For each flagged element:

> "This two-page description of the sunrise on Mars is beautifully written. It's also the third sunrise we've seen described in detail. The first established the alien beauty; the second reinforced it. This one adds nothing. Cut it, or give it narrative purpose - perhaps the character notices something different this time that becomes plot-relevant."

## Output Format

```markdown
## ANALYSE REMPLISSAGE — [Chapters]

### Statistiques
- Scènes analysées: [X]
- Scènes efficaces: [Y]
- Remplissage potentiel: [Z]
- Mots récupérables: ~[N]

### Remplissage confirmé (❌)
| Lignes | Description | Raison | Recommandation |
|--------|-------------|--------|----------------|

### Remplissage potentiel (⚠️)
[List with justification and suggestion]

### Scènes à fusionner
[Pairs of scenes that could be combined]

### Passages à condenser
[Long passages that could be shorter]

### Verdict d'Asimov
> [Overall assessment of narrative efficiency]

### Ce qui est justifié
[Defense of passages that LOOK like filler but serve purpose]
```
