# ValidateScience Workflow

Focused scientific and technical validation with hard SF rigor.

## Scope

This workflow focuses ONLY on scientific accuracy:
- Physics (gravity, orbital mechanics, radiation, thermodynamics)
- Chemistry (MOXIE, life support, propellants, materials)
- Engineering (systems design, failure modes, redundancy)
- Biology (human physiology, medicine, psychology in isolation)
- Astronomy (Mars facts, solar system, communication delays)

## Reference Data

### Mars Facts (validate against these)
- Surface gravity: 0.38g (3.72 m/s²)
- Atmospheric pressure: 0.6% of Earth (610 Pa)
- Atmosphere: 95% CO2, 2.7% N2, 1.6% Ar
- Temperature: -60°C average (-125°C to +20°C range)
- Day length: 24h 37min (sol)
- Distance from Earth: 55-400 million km (varies)
- Communication delay: 3-22 minutes one-way

### MOXIE (Mars Oxygen In-Situ Resource Utilization Experiment)
- Converts CO2 → CO + O2 via solid oxide electrolysis
- Real NASA tech, tested on Perseverance
- Operates at 800°C
- Produces ~10g O2/hour (current tech)
- For novel: scaled up version producing enough for colony

### Hohmann Transfer
- Earth-Mars: ~9 months transit
- Launch windows: every 26 months
- Delta-v requirement: ~4 km/s from LEO

### Human Factors
- Radiation exposure limits
- Bone/muscle loss in low-g
- Psychological effects of isolation
- Medical emergencies with limited supplies

## Process

### Step 1: Extract Technical Passages

Identify all passages with scientific/technical content:
- Numbers (distances, times, pressures)
- Technology descriptions
- Physical phenomena
- Medical/biological references

### Step 2: Validate Each Element

For each technical element:

| Element | Stated Value | Actual Value | Verdict | Fix |
|---------|--------------|--------------|---------|-----|
| Mars gravity | "0.38g" | 0.38g | ✅ | - |
| Comm delay | "real-time" | 3-22 min | ❌ | Add delay |

### Step 3: Flag Violations

Categories:
- **❌ PHYSICS VIOLATION:** Breaks laws of physics
- **⚠️ IMPLAUSIBLE:** Technically possible but unlikely
- **ℹ️ SIMPLIFICATION:** Acceptable for narrative (note it)
- **✅ ACCURATE:** Correct hard SF

### Step 4: Asimov Commentary

For each issue, channel Asimov:

> "I must object to this passage. You have your character feeling 'the sudden weightlessness' upon reaching Mars orbit. But they've been in microgravity for nine months! The transition would be imperceptible. What they WOULD feel is the slight tug of Mars's gravity beginning to affect them during orbital insertion maneuvers. Small detail, but your scientifically literate readers will notice."

## Output Format

```markdown
## VALIDATION SCIENTIFIQUE — [Chapter/Section]

### Résumé
[X] éléments vérifiés: [Y] corrects, [Z] à corriger

### Violations critiques (❌)
| Ligne | Problème | Correction |
|-------|----------|------------|

### Points d'attention (⚠️)
[List with explanations]

### Simplifications acceptables (ℹ️)
[List - things that are wrong but OK for narrative]

### Éléments exemplaires (✅)
[Praise for good hard SF details]

### Note d'Asimov
> [Final comment in character]
```
