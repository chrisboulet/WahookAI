---
name: 3DPrinting
description: 3D Printing Business Tracker for side business management. USE WHEN user mentions 3D printing, print tracking, STL models, bestsellers, duds, print costs, sales tracking, OR asks about what to print next. Standalone CLI at ~/3d-printing-tracker/.
location: user
---

# 3DPrinting

**Side Business Tracker for 3D Printing Operations**

Track prints, sales, costs, and make data-driven business decisions. ADHD-optimized CLI with commands < 10 seconds.

---

## Workflow Routing

### Log a Print
**Triggers:** "log print", "finished printing", "print done", "logger impression"
**Action:** Run print_tracker.py log command

```bash
cd ~/3d-printing-tracker && python scripts/print_tracker.py log "MODEL" TIME WEIGHT MATERIAL [--color COLOR]
```

**Examples:**
```bash
python scripts/print_tracker.py log "dragon" 2h30 45g PLA
python scripts/print_tracker.py log "octopus" 1h15 22g PETG --color blue
python scripts/print_tracker.py log "failed" 30m 10g PLA --failed
```

### Log a Sale
**Triggers:** "sold", "vente", "sale", "customer bought"
**Action:** Run print_tracker.py sold command

```bash
cd ~/3d-printing-tracker && python scripts/print_tracker.py sold "MODEL" QUANTITY PRICE [--channel CHANNEL]
```

**Examples:**
```bash
python scripts/print_tracker.py sold "dragon" 1 25.00
python scripts/print_tracker.py sold "octopus" 3 15.00 --channel etsy
```

### View Statistics
**Triggers:** "print stats", "3D stats", "printing statistics", "how's the business"
**Action:** Run print_tracker.py stats command

```bash
cd ~/3d-printing-tracker && python scripts/print_tracker.py stats [DAYS]
```

### Identify Bestsellers
**Triggers:** "bestsellers", "what sells", "top products", "quoi imprimer", "what to print"
**Action:** Run print_tracker.py bestsellers command

```bash
cd ~/3d-printing-tracker && python scripts/print_tracker.py bestsellers [LIMIT]
```

**Business Decision:** Print MORE of these models!

### Identify Duds
**Triggers:** "duds", "waste", "never sold", "stop printing", "gaspillage"
**Action:** Run print_tracker.py duds command

```bash
cd ~/3d-printing-tracker && python scripts/print_tracker.py duds [LIMIT]
```

**Business Decision:** STOP printing these models!

### Browse STL Library
**Triggers:** "list models", "STL library", "what models", "browse library"
**Action:** Run print_tracker.py models command

```bash
cd ~/3d-printing-tracker && python scripts/print_tracker.py models [CATEGORY] [--limit N]
```

---

## Cost Calculation

Automatic cost calculation:
- **Material:** $0.05/gram (PLA)
- **Electricity:** $0.30/hour (Bambu P1S)

Example: Dragon (45g, 2.5h) = $2.25 + $0.75 = **$3.00 cost**

---

## Database

Uses Supabase (shared with UltraCTO-OS):
- `stl_models` - 3,722 STL files indexed
- `print_jobs` - Print logs with costs
- `sales` - Sales with profit calculation

---

## STL Library

Location: `~/3D-Printing-Business/`

Categories:
- Flexi-Dragons (394 files)
- Flexi-Wild-Animals (275 files)
- Flexi-Sea-Creatures (222 files)
- Organizers-Storage (103 files)
- Organizers-Desk (80 files)
- ... and 18 more categories

---

## ADHD Daily Workflow

```bash
# Bambu beeps = print done
/3d log "dragon" 2h30 45g PLA

# Shopify notification = sale
/3d sold "dragon" 1 25.00

# Sunday review
/3d stats 7
/3d bestsellers  # Print MORE
/3d duds         # STOP these
```

---

## Quick Reference

| Command | Usage |
|---------|-------|
| `log` | Log completed print with time/weight/material |
| `sold` | Log sale with quantity and price |
| `stats` | View prints/sales statistics |
| `bestsellers` | Top sellers to prioritize |
| `duds` | Models to stop printing |
| `models` | Browse STL library |

---

## File Locations

- **Tracker repo:** `~/3d-printing-tracker/`
- **STL library:** `~/3D-Printing-Business/`
- **Main script:** `~/3d-printing-tracker/scripts/print_tracker.py`
