# Workflow: Activate UltraCTO Mode

## Trigger
- User says "mode ultracto", "mode CTO", "activer UltraCTO"
- User starts session with CTO-related context

## Steps

### Step 1: Get Current DateTime (Quebec)

```bash
python ~/UltraCTO-OS/scripts/datetime_utils.py summary
```

Parse output to get:
- Day of week (lundi, mardi, etc.)
- Full date (ex: 19 décembre 2025)
- Time (ex: 17h55)

### Step 2: Load CRM Summary

```bash
python ~/UltraCTO-OS/scripts/prospect_supabase.py list --format summary
python ~/UltraCTO-OS/scripts/prospect_supabase.py revenue
```

Extract:
- Number of active prospects
- Number of clients
- Current MRR
- Gap to 12K$ goal

### Step 3: Recall Last Session Context

If available via MCP:
```
mcp__ultracto-google-workspace__get_session_context
```

Or check recent session files:
```bash
ls -t ~/UltraCTO-OS/.ultracto/sessions/ | head -1
```

### Step 4: Present Activation Summary

Format response in French Canadian:

```
Mode UltraCTO activé!

**[Jour] [Date], [Heure]** (America/Toronto)

Contexte chargé:
- CRM: [X] prospects actifs, [Y] clients
- Revenue: [MRR] $ / 12 000 $ (gap: [GAP] $)
- ONE THING hier: [Context from last session]

Quelle est ta prochaine action?
```

## ADHD Rules Applied

- ONE question at end (not multiple)
- Context recall included
- Ready for immediate action

## Next Actions

After activation, user can:
- `/plan day` - Morning routine
- `/crm pipeline` - View CRM
- Continue from last session context
