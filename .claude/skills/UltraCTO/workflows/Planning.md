# Workflow: Daily Planning (ADHD Optimized)

## Trigger
- `/plan day` - Morning routine
- `/plan audit` - End of day audit
- Mentions of "matin", "routine", "planning"

## Morning Routine (`/plan day`)

**Time**: <3 minutes
**Goal**: ONE THING for the day

### Step 1: Get Current State

Execute in parallel:
```bash
# DateTime
python ~/UltraCTO-OS/scripts/datetime_utils.py summary

# Calendar today
mcp__ultracto-google-workspace__list_calendar_events (today only)

# Tasks with impact
mcp__ultracto-google-workspace__list_tasks_with_impact

# Yesterday's context
mcp__ultracto-google-workspace__get_session_context
```

### Step 2: Analyze & Prioritize

Score tasks by business impact (0-10):
- Revenue-generating → 8-10
- Client deliverable → 7-9
- Pipeline advancement → 6-8
- Admin/overhead → 1-5

### Step 3: Present ONE THING

```
Bonjour Christian!

**[Jour] [Date], [Heure]**

📅 Aujourd'hui:
- [Meeting 1] à [time]
- [Meeting 2] à [time]

🎯 ONE THING: [Highest impact task]
   Impact: [score]/10 — [Why this matters for 12K$ goal]

⏱️ Temps disponible: [X]h entre meetings

Prêt à commencer?
```

### ADHD Rules Applied
- ONE action, not a list
- Context from yesterday included
- Clear time blocks
- Revenue connection explicit

## End of Day Audit (`/plan audit`)

**Time**: <3 minutes
**Goal**: Capture wins + set tomorrow

### Step 1: Review Accomplishments

```
Qu'as-tu accompli aujourd'hui?
(Liste tes wins, même les petits)
```

### Step 2: Log & Save Context

```bash
# Log accomplishments
python ~/UltraCTO-OS/scripts/log_accomplishments.py "[accomplishments]"

# Save session context
mcp__ultracto-google-workspace__save_session_context
```

### Step 3: Set Tomorrow's ONE THING

```
🎉 Wins aujourd'hui:
- [Accomplishment 1]
- [Accomplishment 2]

💾 Contexte sauvegardé pour demain.

🎯 ONE THING demain: [Suggested based on pipeline/calendar]

Bonne soirée!
```

## Quick Wins

For tasks that feel overwhelming:

```
Cette tâche semble grosse. Décomposons:

⏱️ Sprint 1 (20 min): [Micro-task 1]
⏱️ Sprint 2 (20 min): [Micro-task 2]
⏱️ Sprint 3 (20 min): [Micro-task 3]

On commence par le Sprint 1?
Timer, GO!
```

## Calendar Integration

### Check Availability
```
mcp__ultracto-google-workspace__list_calendar_events
```

### Block Focus Time
```
mcp__ultracto-google-workspace__create_calendar_event
- Title: "🎯 Focus: [ONE THING]"
- Duration: 90 min (optimal ADHD focus block)
- No notifications during block
```

## ADHD Compensation Patterns

| Pattern | Application |
|---------|-------------|
| ONE THING | Single priority, not a list |
| Context Recall | Always remind yesterday's state |
| Time Boxing | 20-min sprints for admin |
| Quick Wins | Celebrate small accomplishments |
| Sandwich | Positive-improvement-positive feedback |
