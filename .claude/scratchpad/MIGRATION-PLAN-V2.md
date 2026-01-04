# WahookAI Migration Plan: v1.0 → v2.0 Packs Architecture

**Date:** 2026-01-03 22:51
**Status:** Planning Phase
**Risk Level:** HIGH (Major architectural change)
**Estimated Duration:** 2-4 hours

---

## Executive Summary

Migrating WahookAI from flat v1.0 structure to modular v2.0 Packs architecture. This enables:
- Clean separation between upstream PAI packs and custom WahookAI packs
- Independent updates for each pack
- Self-documenting capabilities (README, INSTALL, VERIFY per pack)
- Easier sharing of custom packs with others

---

## Current Inventory

### Core Infrastructure (5 components)
- **hooks/** - 19 custom hooks (enhanced vs upstream)
- **history/** - History system (v1.0 compatible)
- **skills/CORE/** - Core identity and routing (enhanced with FOCUS-2026, IDENTITY, etc.)
- **voice-server/** - Enhanced voice system with prosody
- **Observability/** - Real-time monitoring dashboard

### Custom Skills - Écart de Tolérance (7 skills)
- **EcartAct1** - Act 1 coordinator (Chapters 1-10)
- **EcartAct2** - Act 2 coordinator (Chapters 11-20)
- **EcartAct3** - Act 3 coordinator (Chapters 21-30)
- **EcartBible** - Canon keeper for all 4 Bible documents
- **EcartTech** - Technical validator for hard SF accuracy
- **EcartTimeline** - Timeline guardian (2025-2042)
- **EcartVoice** - Character voice consistency

### Custom Skills - Business Tools (2 skills)
- **UltraCTO** - Fractional CTO mode for Boulet Stratégies TI
- **3DPrinting** - 3D printing business tracker

### Custom Skills - Utilities (6 skills)
- **AsimovReviewer** - Hard SF manuscript reviewer
- **Research** - Multi-source parallel research system
- **StoryExplanation** - Narrative summary generation
- **Fabric** - Native Fabric pattern execution
- **Ffuf** - Web fuzzing guidance (minimal)
- **CreateCLI** - CLI generation tool
- **AlexHormoziPitch** - Alex Hormozi methodology
- **BrightData** - (appears minimal/placeholder)
- **Createskill** - Skill creation tool

### Other Infrastructure
- **agents/** - Agent definitions
- **commands/** - Custom commands
- **config/** - Configuration files
- **tools/** - CLI tools and utilities
- **plugins/** - Plugin system

---

## New Directory Structure

```
WahookAI/
├── .claude/
│   ├── Packs/                          # NEW: Custom WahookAI packs
│   │   ├── wahookai-core/              # Enhanced core (vs upstream kai-core)
│   │   ├── wahookai-hooks/             # Enhanced hooks (19 custom)
│   │   ├── wahookai-voice/             # Enhanced voice with prosody
│   │   ├── wahookai-observability/     # Observability server
│   │   ├── wahookai-history/           # History system
│   │   │
│   │   ├── ecart-manuscript/           # Bundle for all Écart skills
│   │   │   ├── README.md
│   │   │   ├── INSTALL.md
│   │   │   └── src/
│   │   │       ├── skills/
│   │   │       │   ├── EcartAct1/
│   │   │       │   ├── EcartAct2/
│   │   │       │   ├── EcartAct3/
│   │   │       │   ├── EcartBible/
│   │   │       │   ├── EcartTech/
│   │   │       │   ├── EcartTimeline/
│   │   │       │   └── EcartVoice/
│   │   │       └── config/
│   │   │
│   │   ├── wahookai-cto/               # UltraCTO business tools
│   │   ├── wahookai-3dprinting/        # 3D printing tracker
│   │   ├── wahookai-research/          # Research system
│   │   ├── wahookai-asimov-reviewer/   # SF manuscript reviewer
│   │   ├── wahookai-story-tools/       # StoryExplanation
│   │   ├── wahookai-fabric/            # Fabric integration
│   │   ├── wahookai-createcli/         # CLI generator
│   │   ├── wahookai-createskill/       # Skill creator
│   │   ├── wahookai-prompting/         # Prompting skill (enhanced)
│   │   └── wahookai-agents/            # Agents skill (enhanced)
│   │
│   ├── Bundles/                        # NEW: Curated collections
│   │   └── WahookAI/                   # Complete WahookAI bundle
│   │       ├── README.md
│   │       └── INSTALL.md
│   │
│   ├── pai_upstream/                   # RENAMED: Upstream PAI packs (reference)
│   │   └── Packs/
│   │       ├── kai-core-install/
│   │       ├── kai-hook-system/
│   │       ├── kai-voice-system/
│   │       └── ...
│   │
│   ├── installed/                      # NEW: Active installation (symlinks)
│   │   ├── skills/                     # Symlinks to pack skills
│   │   ├── hooks/                      # Symlinks to pack hooks
│   │   ├── tools/                      # Symlinks to pack tools
│   │   └── config/                     # Merged configurations
│   │
│   ├── agents/                         # Kept as-is
│   ├── commands/                       # Kept as-is
│   ├── history/                        # Kept as-is (or symlink to pack)
│   ├── scratchpad/                     # Kept as-is
│   ├── settings.json                   # Updated with new paths
│   └── archive/                        # NEW: Old v1.0 structure backup
│       └── v1.0-pre-migration/
│           ├── skills/
│           ├── hooks/
│           └── ...
```

---

## Migration Phases

### Phase 0: Pre-Flight Checks ✈️
**Duration:** 15 minutes

- [ ] Create comprehensive backup in `history/backups/`
- [ ] Create migration log file
- [ ] Verify git status (commit current state)
- [ ] Document all active integrations
- [ ] Check disk space (need ~500MB for duplication)

### Phase 1: Infrastructure Setup 🏗️
**Duration:** 20 minutes

- [ ] Create new directory structure
- [ ] Set up pack template system
- [ ] Create WahookAI pack naming convention
- [ ] Initialize migration tracking

### Phase 2: Core Infrastructure Migration 🔧
**Duration:** 45 minutes

**2.1 wahookai-hooks** (Priority: CRITICAL)
- [ ] Create pack structure (README, INSTALL, VERIFY, src/)
- [ ] Document all 19 hooks with purpose
- [ ] Copy hook files to src/hooks/
- [ ] Document hook dependencies
- [ ] Create installation script
- [ ] Test hook loading

**2.2 wahookai-history** (Priority: CRITICAL)
- [ ] Create pack structure
- [ ] Migrate history system
- [ ] Preserve all existing history files
- [ ] Update history tracking paths
- [ ] Verify history writing works

**2.3 wahookai-core** (Priority: CRITICAL)
- [ ] Create pack structure
- [ ] Migrate CORE skill with all enhancements
- [ ] Include: CONSTITUTION.md, FOCUS-2026.md, IDENTITY.md, etc.
- [ ] Update routing system
- [ ] Verify auto-load mechanism

**2.4 wahookai-voice** (Priority: HIGH)
- [ ] Create pack structure
- [ ] Migrate voice-server with prosody enhancements
- [ ] Document voice personality configurations
- [ ] Preserve ElevenLabs integration
- [ ] Test voice notifications

**2.5 wahookai-observability** (Priority: MEDIUM)
- [ ] Create pack structure
- [ ] Migrate Observability server
- [ ] Update WebSocket configurations
- [ ] Test dashboard access

### Phase 3: Custom Skills Migration 📚
**Duration:** 60 minutes

**3.1 ecart-manuscript Bundle** (Priority: HIGH)
- [ ] Create bundle structure (contains 7 skills)
- [ ] Migrate EcartAct1 (with workflows)
- [ ] Migrate EcartAct2 (with workflows)
- [ ] Migrate EcartAct3 (with workflows)
- [ ] Migrate EcartBible (with Bible docs)
- [ ] Migrate EcartTech (with worldbuilding)
- [ ] Migrate EcartTimeline (with timeline data)
- [ ] Migrate EcartVoice (with character profiles)
- [ ] Create unified INSTALL.md for whole bundle
- [ ] Document inter-skill dependencies

**3.2 wahookai-cto** (Priority: HIGH)
- [ ] Create pack structure
- [ ] Migrate UltraCTO skill
- [ ] Migrate workflows (4L Framework, OKR, etc.)
- [ ] Preserve client tracking
- [ ] Document CRM integration

**3.3 wahookai-3dprinting** (Priority: MEDIUM)
- [ ] Create pack structure
- [ ] Migrate 3DPrinting skill
- [ ] Preserve tracking data
- [ ] Document CLI integration

**3.4 Utility Skills** (Priority: MEDIUM)
- [ ] wahookai-research (multi-source research)
- [ ] wahookai-asimov-reviewer (SF reviewer)
- [ ] wahookai-story-tools (StoryExplanation)
- [ ] wahookai-fabric (Fabric integration)
- [ ] wahookai-createcli (CLI generator)
- [ ] wahookai-createskill (Skill creator)
- [ ] wahookai-prompting (enhanced prompting)
- [ ] wahookai-agents (enhanced agents)

### Phase 4: Integration & Configuration ⚙️
**Duration:** 30 minutes

- [ ] Update settings.json with new paths
- [ ] Update hook configurations
- [ ] Update skill routing
- [ ] Create symlink structure in `installed/`
- [ ] Verify all environment variables
- [ ] Update PAI_DIR references

### Phase 5: Verification & Testing ✅
**Duration:** 45 minutes

- [ ] Test CORE skill auto-loading
- [ ] Test hook system functionality
- [ ] Test voice notifications
- [ ] Test observability dashboard
- [ ] Test Écart manuscript skills (sample workflow)
- [ ] Test UltraCTO mode activation
- [ ] Test research skill
- [ ] Test skill creation (create a test skill)
- [ ] Run complete workflow: user request → multiple skills → completion
- [ ] Verify history tracking works
- [ ] Check all file paths resolve correctly

### Phase 6: Documentation & Cleanup 📝
**Duration:** 30 minutes

- [ ] Create WAHOOKAI-ARCHITECTURE.md
- [ ] Document pack installation order
- [ ] Create WahookAI bundle README
- [ ] Update .claude/.pai-sync-history
- [ ] Archive old v1.0 structure
- [ ] Clean up temporary files
- [ ] Update git status
- [ ] Create migration completion report

---

## Pack Naming Convention

**WahookAI Packs:** `wahookai-[capability]`
- Distinguishes from upstream `kai-` packs
- Clear ownership and customization
- Examples: `wahookai-core`, `wahookai-hooks`, `wahookai-cto`

**Bundle:** `ecart-manuscript`
- Special case: cohesive multi-skill system
- All 7 Écart skills bundled together
- Single INSTALL.md for the whole system

---

## Risk Mitigation

### Backup Strategy
1. **Git commit** - Current state before any changes
2. **Full directory backup** - Copy entire `.claude/` to `history/backups/pre-v2-migration/`
3. **Incremental backups** - After each major phase
4. **Rollback plan** - Can restore from any backup point

### Testing Strategy
1. **Component testing** - Each pack individually
2. **Integration testing** - Packs working together
3. **Workflow testing** - Real-world usage scenarios
4. **Regression testing** - Ensure nothing broke

### Rollback Plan
If migration fails at any point:
1. Stop immediately
2. Restore from latest backup
3. Document failure point
4. Analyze issue
5. Fix and retry, or abort

---

## Success Criteria

✅ **All 24+ capabilities migrated to packs**
✅ **Each pack has complete documentation (README, INSTALL, VERIFY)**
✅ **All integrations working (hooks, voice, observability)**
✅ **All custom skills functional**
✅ **Settings and configurations updated**
✅ **Full test suite passes**
✅ **Architecture documented**
✅ **Old structure safely archived**
✅ **Can install/uninstall individual packs**
✅ **Ready for future upstream merges**

---

## Post-Migration Benefits

1. **Modularity** - Install/remove capabilities independently
2. **Clarity** - Each pack self-documenting
3. **Updates** - Merge upstream packs without affecting custom ones
4. **Sharing** - Can publish individual WahookAI packs
5. **Maintenance** - Easier to understand and modify
6. **Scalability** - Add new packs without touching existing ones

---

## Questions for User

Before proceeding, confirm:

1. **Timing:** This will take 2-4 hours. Good time to start?
2. **Backup location:** Use `history/backups/pre-v2-migration/` or different location?
3. **Écart bundle:** Keep all 7 skills as single bundle, or separate packs?
4. **Testing depth:** Full workflow testing, or just component testing?
5. **Archive strategy:** Keep old structure, or delete after successful migration?

---

**Ready to begin surgical migration. Awaiting final confirmation.**
