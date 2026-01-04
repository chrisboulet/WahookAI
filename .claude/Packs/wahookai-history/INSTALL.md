# Installation: wahookai-history

**Prerequisites:**
- PAI_DIR configured
- File system permissions for directory creation

**Installation Time:** ~5 minutes

---

## Step 1: Verify History Directory Exists

The history directory should already exist at `$PAI_DIR/history/`. If migrating from v1.0, your existing history is already in place.

```bash
ls -la $PAI_DIR/history/
```

If it doesn't exist:
```bash
mkdir -p $PAI_DIR/history
```

---

## Step 2: Create Standard Subdirectories

Ensure all standard history categories exist:

```bash
cd $PAI_DIR

# Create main categories
mkdir -p history/sessions
mkdir -p history/learnings
mkdir -p history/research
mkdir -p history/decisions
mkdir -p history/security
mkdir -p history/backups
mkdir -p history/raw-outputs

# Create execution subcategories
mkdir -p history/execution/features
mkdir -p history/execution/bugs
mkdir -p history/execution/refactors

# Create year-month subdirectories for current month
CURRENT_MONTH=$(date +%Y-%m)
mkdir -p history/sessions/$CURRENT_MONTH
mkdir -p history/learnings/$CURRENT_MONTH
mkdir -p history/research/$CURRENT_MONTH
mkdir -p history/decisions/$CURRENT_MONTH
mkdir -p history/raw-outputs/$CURRENT_MONTH
mkdir -p history/execution/features/$CURRENT_MONTH
mkdir -p history/execution/bugs/$CURRENT_MONTH
mkdir -p history/execution/refactors/$CURRENT_MONTH
```

---

## Step 3: Install Documentation

Copy the history system documentation to CORE skill:

```bash
cp $PAI_DIR/Packs/wahookai-history/src/docs/HistorySystem.md $PAI_DIR/skills/CORE/
```

---

## Step 4: Preserve Existing History

**IMPORTANT:** If you have existing history files, they are already in place. Do NOT overwrite.

Check existing history:
```bash
find $PAI_DIR/history -name "*.md" | wc -l
```

Your existing learnings, sessions, and other captured work will continue to work with the pack system.

---

## Step 5: Configure Automatic Capture (Optional)

For automatic history population, ensure wahookai-hooks is installed with these hooks:

- `capture-session-summary.ts` - Populates sessions/
- `capture-learning.ts` - Populates learnings/
- `capture-tool-output.ts` - Populates raw-outputs/

See wahookai-hooks INSTALL.md for hook configuration.

---

## Verification

See VERIFY.md for complete checklist.

**Quick Test:**
```bash
# Check structure
ls -la $PAI_DIR/history/

# Should see: sessions, learnings, research, decisions, execution, security, backups, raw-outputs

# Count existing entries
find $PAI_DIR/history -name "*.md" -type f | wc -l
```

---

## Troubleshooting

### Missing directories

**Solution:**
```bash
# Re-run directory creation from Step 2
```

### Permission errors

**Solution:**
```bash
chmod 755 $PAI_DIR/history
chmod -R 755 $PAI_DIR/history/*
```

### Existing history not visible

**Symptom:** Old sessions/learnings missing after migration

**Solution:** Check if history was backed up during migration:
```bash
ls -la $PAI_DIR/history/backups/pre-v2-migration-*/
# If found, history is safe in backup, not lost
```

---

**Next:** Complete VERIFY.md to confirm installation success.
