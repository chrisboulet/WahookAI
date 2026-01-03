---
name: EcartTech
description: Technical validator for Écart de Tolérance hard SF accuracy. USE WHEN revisions involve science, engineering, nomenclature (DeepLink, M-Link, ATHENA, specs), OR user mentions technical validation, physics accuracy, orbital mechanics, spacecraft systems. Enforces BIBLE_3_WORLDBUILDING.md technical canon.
---

# EcartTech

Technical accuracy guardian for "Écart de Tolérance" ensuring hard science fiction rigor. Validates physics, orbital mechanics, engineering specs, and technological nomenclature against established worldbuilding canon.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/tools/SkillWorkflowNotification WORKFLOWNAME EcartTech
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **EcartTech** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **ValidateScience** | "validate science", "check physics" | `workflows/ValidateScience.md` |
| **CheckNomenclature** | "check nomenclature", "verify naming" | `workflows/CheckNomenclature.md` |
| **VerifySpecs** | "verify specs", "check specifications" | `workflows/VerifySpecs.md` |

## Examples

**Example 1: Validate orbital mechanics**
```
User: "Validate the Hohmann transfer trajectory in chapter 1"
→ Invokes ValidateScience workflow
→ Checks 9-month transit time Earth-Mars
→ Verifies orbital positions match August 2042 arrival
→ Confirms communication delay 4-24 minutes (distance-dependent)
→ Reports scientific accuracy verdict
```

**Example 2: Check nomenclature consistency**
```
User: "Changed satellite name from DeepLink to M-Link - check consistency"
→ Invokes CheckNomenclature workflow
→ Reads BIBLE_3_WORLDBUILDING.md for canonical naming
→ DeepLink: 42 satellites, solar orbit, long-range comms
→ M-Link: Mars orbit constellation, local comms
→ Scans manuscript for all satellite references
→ Flags any DeepLink mentions in Mars-orbit context
```

**Example 3: Verify technical specifications**
```
User: "Verify connector specs are accurate after sabotage revision"
→ Invokes VerifySpecs workflow
→ Checks ISO 965-1:2032 metric standard (M127×1.25mm)
→ Checks UTS 20 TPI imperial standard
→ Verifies titanium grades (Grade 5 vs Grade 23)
→ Confirms incompatibility mechanics accurately described
```

## Technical Canon Reference

**Primary source:** `/home/chris/Documents/EcartDeTolerance/BIBLE_3_WORLDBUILDING.md`

**Key technical systems:**

### Satellite Constellations
- **DeepLink:** 42 satellites, solar orbit, Earth-Mars long-range comms, DL-XX designation
- **M-Link:** Mars orbit, local communications, ML-XX designation

### AI Systems
- **ORACLE:** Quantum cube, spacecraft interfaced, Scottish accent (Montgomery Scott)
- **ATHENA:** Mars base AI, CAD library manager (corrupted by Harrison Cole)
- **JOSEPHINE:** Philippe's assistant AI, derived from Joséphine (Armand's deceased wife)

### Connector Sabotage
- **Original:** ISO 965-1:2032 metric (M127×1.25mm)
- **Sabotaged:** UTS 20 TPI imperial (American standard)
- **Materials:** Titanium Grade 5 (standard) vs Grade 23 ELI (high-precision)

### Mars Environment
- Gravity: 0.38g
- Temperature: -60°C average
- Atmosphere: 95% CO2
- Communication delay: 4-24 minutes (orbital position dependent)

## Validation Standards

1. **Physics accuracy:** No violations of known physical laws
2. **Engineering plausibility:** Systems must function as described
3. **Nomenclature consistency:** Technical terms match established canon
4. **Specification precision:** Numbers, measurements, standards are accurate
5. **Technology coherence:** Capabilities consistent with established tech level (2042)
