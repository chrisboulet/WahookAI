# Workflow: OKR Management

## Trigger
- `/okr current` - Show current quarter OKRs with progress
- `/okr set Q1-2026` - Create new quarterly OKRs
- `/okr update KR2 50%` - Update specific Key Result progress
- `/okr review` - Weekly review (Friday 17h routine)
- Mentions of "OKR", "objectifs", "key results"

## `/okr current` - Display Current OKRs

**Time**: <1 minute
**Goal**: Quick snapshot of OKR progress

### Step 1: Load Current OKR File

```bash
# Determine current quarter
python ~/UltraCTO-OS/scripts/datetime_utils.py summary

# Read OKR file (format: YYYY-QX.md)
Read ~/UltraCTO-OS/data/okrs/2026-Q1.md
```

### Step 2: Fetch Real-time Metrics

Execute in parallel:
```bash
# MRR and mandate count (KR1, KR2)
python ~/UltraCTO-OS/scripts/prospect_supabase.py revenue

# Conversion rate (KR3)
python ~/UltraCTO-OS/scripts/prospect_supabase.py list
```

### Step 3: Display Formatted Output

```markdown
## OKR Q1-2026 (2026-01-01 → 2026-03-31)

**Objective**: Atteindre revenus récurrents de 12K$/mois

**Progress Global**: [X%] 🔴🟡🟢

### Key Results

**KR1**: MRR 12K$ CAD
├─ Baseline: 5 000 $
├─ Target: 12 000 $
├─ Actuel: [from revenue script] $
└─ Progress: [X%] 🔴🟡🟢 [████████████████████]

**KR2**: 3 mandats fractional CTO @3K$/mois
├─ Baseline: 0
├─ Target: 3
├─ Actuel: [from revenue script]
└─ Progress: [X%] 🔴🟡🟢 [████████████████████]

**KR3**: Taux conversion 30%
├─ Baseline: 15%
├─ Target: 30%
├─ Actuel: [calculated from pipeline]%
└─ Progress: [X%] 🔴🟡🟢 [████████████████████]

**KR4**: 8 articles LinkedIn @500 vues avg
├─ Baseline: 0
├─ Target: 8
├─ Actuel: [manual count from file]
└─ Progress: [X%] 🔴🟡🟢 [████████████████████]

**Jours restants**: [X]/90 ([Y%])

**ONE THING cette semaine**:
[Action from OKR file]
```

**Progress Bar Legend**:
- 🔴 0-39% - En retard (needs intervention)
- 🟡 40-69% - On track
- 🟢 70-100% - Ahead/Done

---

## `/okr set Q2-2026` - Create New Quarterly OKRs

**Time**: 15-20 minutes (interactive)
**Goal**: Define OKRs for new quarter

### Step 1: Archive Previous Quarter

```bash
# Check if previous OKR exists
ls ~/UltraCTO-OS/data/okrs/

# If exists, move to archive
mv ~/UltraCTO-OS/data/okrs/2026-Q1.md ~/UltraCTO-OS/data/okrs/archive/
```

### Step 2: Interactive Wizard

Ask user sequentially (ONE question at a time - ADHD rule):

1. **Objectif principal ce trimestre?**
   - Example: "Atteindre 12K$ MRR", "Automatiser opérations", "Thought leadership"

2. **Key Result 1 - MRR/Revenue**:
   - Baseline actuelle? (fetch from `/crm revenue`)
   - Target fin trimestre? (suggest realistic +50-100%)

3. **Key Result 2 - Mandats/Clients**:
   - Combien mandats veux-tu signer?
   - À quel prix moyen? (suggest 3K$/mois minimum)

4. **Key Result 3 - Pipeline/Conversion**:
   - Baseline conversion actuelle? (calculate from CRM)
   - Target conversion? (suggest +10-15 points percentage)

5. **Key Result 4 - Marketing/Visibility**:
   - Métrique? (LinkedIn posts, followers, inbound leads, etc.)
   - Baseline et target?

### Step 3: Validate with 4L Framework

Score each KR for complexity:
- Can it be measured automatically? (+2 points)
- Does it require external dependencies? (-3 points)
- Aligned with 12K$ goal? (+2 points)

**REJECT if**: Any KR scores <5/10 on Low Complexity

### Step 4: Generate OKR File

```bash
# Create from template
cp ~/UltraCTO-OS/data/okrs/template.md ~/UltraCTO-OS/data/okrs/2026-Q2.md

# Fill with user responses
# Save file
```

### Step 5: Confirmation

```markdown
✅ OKR Q2-2026 créé avec succès!

**Objective**: [user objective]

**Key Results**:
1. [KR1 description]
2. [KR2 description]
3. [KR3 description]
4. [KR4 description]

**Next**: Use `/okr current` pour voir progress ou `/plan day` pour intégrer dans routine quotidienne.
```

---

## `/okr update KR2 50%` - Update Key Result Progress

**Time**: <30 seconds
**Goal**: Manual update for non-automated metrics

### Step 1: Parse Command

Extract:
- KR number (1-4)
- Progress percentage (0-100)

### Step 2: Update OKR File

```bash
# Read current OKR
Read ~/UltraCTO-OS/data/okrs/2026-Q1.md

# Find KR line
# Update progress value
# Recalculate color (🔴🟡🟢)
# Save file
```

### Step 3: Confirmation

```markdown
✅ KR[X] updated to [Y%] 🔴🟡🟢

**KR[X]**: [description]
├─ Progress: [old%] → [new%]
└─ Status: [color with explanation]

Run `/okr current` to see full OKR dashboard.
```

---

## `/okr review` - Weekly Review (Friday 17h)

**Time**: 15 minutes
**Goal**: Refresh metrics, identify bottlenecks, plan next week

### Step 1: Auto-Refresh Metrics (3 min)

Execute in parallel:
```bash
# Revenue metrics (KR1, KR2)
python ~/UltraCTO-OS/scripts/prospect_supabase.py revenue

# Pipeline metrics (KR3)
python ~/UltraCTO-OS/scripts/prospect_supabase.py list

# LinkedIn metrics (KR4) - check history file
Read ~/UltraCTO-OS/history/linkedin-posts.md
```

### Step 2: Manual Input (2 min)

Ask user for non-automated KRs:
- **KR4**: "Combien d'articles LinkedIn publiés cette semaine? Vues moyennes?"

Update OKR file with new values.

### Step 3: Scoring & Analysis (5 min)

Calculate:
1. **Progress % per KR**
2. **Color assignment** (🔴🟡🟢)
3. **Global progress** (average)
4. **Trend vs last week**: Improving? Stagnant? Declining?

Identify:
- **Bottleneck KR**: Lowest progress %
- **Why?**: Blocker, wrong strategy, lack of time?
- **Risk level**: If trend continues, will we hit target?

### Step 4: Plan Next Week (5 min)

Define **ONE THING** for next week:
- Focus on bottleneck KR (🔴 priority)
- Must be actionable (not vague)
- Estimate impact: "If done, KR moves from X% to Y%"
- Time-boxed: 5-10h max

Add to Google Tasks:
```bash
mcp__ultracto-google-workspace__create_task
  title: "ONE THING: [action]"
  notes: "OKR Impact: KR[X] +[Y%]"
  due: [next Friday]
  priority: HIGH
```

### Step 5: Save Review Report

```bash
# Create review file
Write ~/UltraCTO-OS/history/okr-reviews/2026-W[XX].md
```

**Template**:
```markdown
# OKR Review - Semaine [XX] (2026-[date])

## Progress Snapshot

**Global**: [X%] 🔴🟡🟢 (vs [Y%] semaine dernière)

### KRs
- KR1: [X%] 🔴🟡🟢 ([+/- Z%] vs last week)
- KR2: [X%] 🔴🟡🟢 ([+/- Z%] vs last week)
- KR3: [X%] 🔴🟡🟢 ([+/- Z%] vs last week)
- KR4: [X%] 🔴🟡🟢 ([+/- Z%] vs last week)

## Bottleneck Analysis

**KR le plus en retard**: KR[X] ([Y%])

**Raison**: [Why it's lagging]

**Blockers**:
- [Blocker 1]
- [Blocker 2]

## ONE THING Next Week

**Action**: [Specific actionable task]

**KR Impact**: KR[X] from [Y%] → [Z%] (estimated)

**Time estimate**: [X] hours

**Added to**: Google Tasks (due [date])

## Notes

[Any observations, adjustments needed, etc.]
```

### Step 6: Output Summary

```markdown
✅ OKR Review Semaine [XX] complété!

**Global Progress**: [X%] 🔴🟡🟢

**Biggest win cette semaine**: [KR with most progress]
**Needs attention**: KR[X] at [Y%] 🔴

**ONE THING next week**:
🎯 [Action] → Impact: KR[X] +[Z%]

**Review saved**: `history/okr-reviews/2026-W[XX].md`
```

---

## Integration with Existing Workflows

### `/plan day` Enhancement

Add OKR snapshot to morning routine:

```markdown
📊 OKR Q1-2026 Snapshot:
- Global: [X%] 🔴🟡🟢
- Most behind: KR[X] at [Y%] 🔴

🎯 ONE THING (aligned with OKR):
[Task that advances bottleneck KR]
```

### `/crm revenue` Enhancement

Add OKR section:

```markdown
## OKR Tracking

**KR1 - MRR Target**: [current] / 12 000 $ ([X%]) 🔴🟡🟢
**KR2 - Mandats signés**: [X]/3 ([Y%]) 🔴🟡🟢

**Gap Analysis**:
- Besoin [X] $ MRR additionnel
- Si 3K$/mandat → besoin [Y] mandats restants
- Pipeline actuel: [Z] prospects × [conv%] = [N] mandats prévus
- **ACTION**: [What's needed to close gap]
```

---

## Files Structure

```
~/UltraCTO-OS/data/okrs/
├── 2026-Q1.md              # Current OKR (active)
├── template.md             # Template for new quarters
├── archive/
│   ├── 2025-Q4.md         # Archived OKRs
│   └── 2025-Q3.md
└── README.md              # Quick guide

~/UltraCTO-OS/history/okr-reviews/
├── 2026-W01.md            # Weekly reviews
├── 2026-W02.md
└── ...
```

---

## ADHD Optimizations

### Rules Applied

1. **ONE question at a time** - `/okr set` wizard asks sequentially
2. **<3 min quick checks** - `/okr current` ultra-fast
3. **<15 min reviews** - `/okr review` time-boxed
4. **Visual progress** - Progress bars + colors 🔴🟡🟢
5. **ONE THING focus** - Always surfaces single priority action

### Automation

- KR1, KR2 auto-updated from Supabase CRM
- KR3 auto-calculated from pipeline
- KR4 manual (LinkedIn stats not automated yet)
- Weekly review reminder (Google Calendar event Friday 17h)

---

## Example Usage Session

```bash
# Friday 17h - Weekly review
/okr review
→ Refreshes all metrics
→ Identifies KR2 (mandats signés) is 🔴
→ ONE THING: "Contacter 3 prospects qualifiés pour discovery calls"
→ Saved to Google Tasks

# Monday morning
/plan day
→ Shows OKR snapshot
→ ONE THING today aligned with OKR: "Call prospect #1"

# Mid-week - Quick check
/okr current
→ See I'm on track globally 🟡

# Manual update after LinkedIn post
/okr update KR4 50%
→ Published 4/8 articles

# End of quarter
/okr set Q2-2026
→ Archive Q1, create new OKRs
```

---

**Last updated**: 2026-01-02
**Version**: 1.0
**Author**: Christian Boulet, Boulet Stratégies TI
