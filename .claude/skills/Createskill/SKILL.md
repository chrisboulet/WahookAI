---
name: Createskill
description: Create and validate skills. USE WHEN create skill, new skill, skill structure, canonicalize. SkillSearch('createskill') for docs.
---

# Createskill

MANDATORY skill creation framework for ALL skill creation requests.

## Authoritative Source

**Before creating ANY skill, READ:** `$PAI_DIR/skills/CORE/SkillSystem.md`

This document contains the complete specification for:
- Skill directory structure
- SKILL.md format and required sections
- Workflow file conventions
- Naming conventions (TitleCase)
- Examples section requirements

## How to Create a Skill

1. **Read the spec:** `$PAI_DIR/skills/CORE/SkillSystem.md`
2. **Create directory:** `$PAI_DIR/skills/SkillName/`
3. **Create SKILL.md** with required frontmatter and sections
4. **Add Workflows/** directory if needed
5. **Validate** by checking all workflow references resolve

## How to Validate a Skill

Run the pack validator:
```bash
bun run $PAI_DIR/Tools/validate-pack.ts
```

Or manually check:
- SKILL.md exists with valid frontmatter
- All `Workflows/*.md` references in SKILL.md exist
- Examples section is present

## How to Canonicalize a Skill

1. Rename files/directories to TitleCase
2. Ensure SKILL.md has required sections
3. Verify workflow references resolve
4. Add Examples section if missing

## Examples

**Example 1: Create a new skill**
```
User: "Create a skill for managing my blog posts"
→ Read SkillSystem.md for structure requirements
→ Create Blogging/ directory
→ Create SKILL.md with USE WHEN triggers
→ Create Workflows/ with Create.md, Publish.md
→ Validate all references resolve
```

**Example 2: Validate a skill**
```
User: "Validate the Research skill"
→ Check SKILL.md frontmatter format
→ Verify Workflows/*.md files exist
→ Check TitleCase naming conventions
→ Report compliance issues
```

**Example 3: Canonicalize a skill**
```
User: "Fix the daemon skill structure"
→ Rename workflow files to TitleCase
→ Update SKILL.md references
→ Add missing Examples section
→ Verify against SkillSystem.md spec
```
