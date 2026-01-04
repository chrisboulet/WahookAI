# Workflow: CRM Operations

## Trigger
- `/crm` commands
- Mentions of "prospect", "client", "pipeline", "revenue"

## Available Actions

### Pipeline View (`/crm pipeline`)

```bash
python ~/UltraCTO-OS/scripts/prospect_supabase.py list
```

Display as Kanban:
```
LEAD (5%)     | QUALIFIED (20%) | PROPOSAL (40%) | NEGOTIATION (70%) | WON (100%)
--------------|-----------------|----------------|-------------------|------------
Prospect A    | Prospect B      | Prospect C     |                   | Client X
              | Prospect D      |                |                   | Client Y
```

Include weighted forecast: `Σ (revenue_potential × win_probability)`

### View Prospect/Client (`/crm view "Company"`)

```bash
python ~/UltraCTO-OS/scripts/prospect_supabase.py get "Company"
```

Display full context:
- Company info (size, industry, location)
- Contact details
- ICP score
- Stage + revenue potential
- Interaction history
- Next action

### Add Prospect (`/crm add "Name" "Company"`)

```bash
python ~/UltraCTO-OS/scripts/prospect_supabase.py create "Name" "Company" --stage lead
```

Prompt for optional:
- Industry (--industry)
- Size (--size)
- ICP score (--score)

### Update Prospect (`/crm update "Company"`)

```bash
python ~/UltraCTO-OS/scripts/prospect_supabase.py update "Company" --stage qualified --score 85
```

### Convert to Client (`/crm convert "Company"`)

```bash
python ~/UltraCTO-OS/scripts/prospect_supabase.py convert "Company" fractional-cto 5000
```

Arguments:
- Company name
- Client type (fractional-cto, project, consulting)
- Monthly value (CAD)

### Revenue Dashboard (`/crm revenue`)

```bash
python ~/UltraCTO-OS/scripts/prospect_supabase.py revenue
```

Display:
```
REVENUE DASHBOARD
─────────────────
MRR Actuel:     8 500 $ CAD
Objectif:      12 000 $ CAD
Gap:            3 500 $ CAD

Pipeline Pondéré: 4 200 $ (potentiel)
Clients Actifs: 2
```

## Prospect Research (`/prospect`)

### Search (`/prospect search "sector"`)

```bash
# Parallel execution
WebSearch: "[sector] entreprises Quebec 50-300 employés"
WebSearch: "[sector] PME Montreal décideurs technologie"
WebSearch: "LinkedIn [sector] CTO DSI Quebec"
```

Score against ICP criteria:
- Size: 50-300 employees (sweet spot)
- Location: Quebec
- Tech decision maker accessible
- Growth signals

### Brief (`/prospect brief "Company"`)

Execute in parallel:
```bash
# CRM lookup
python ~/UltraCTO-OS/scripts/prospect_supabase.py get "Company"

# Web research (parallel)
WebFetch: company website
WebSearch: "Company news 2025"
WebSearch: "Company LinkedIn CEO CTO"
```

Synthesize into 1-page brief:
- Company overview
- Key decision makers
- Pain points / opportunities
- Recommended approach
- Talking points

## ADHD Optimization

- Always show ONE next action
- Revenue context in every view
- Quick capture for new prospects
