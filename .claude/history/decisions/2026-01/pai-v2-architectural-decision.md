# PAI v2.1.0 Architectural Decision
**Date:** 2026-01-03
**Decision:** Stay on Legacy Format with Selective Pack Adoption

## Context

Upstream PAI repository underwent a complete architectural transformation from monolithic `.claude/` directory structure to modular "Packs" system (v2.1.0).

**Upstream Changes:**
- 200+ files removed from upstream
- Complete migration to `Packs/` directory structure
- Skills, hooks, agents now distributed as installable packs
- 9 packs available: kai-core-install, kai-hook-system, kai-history-system, kai-observability-server, kai-voice-system, kai-prompting-skill, kai-agents-skill, kai-art-skill, kai-browser-skill

**Last Sync:** f8a04c3 (2025-12-21)
**Current Upstream:** c38a43c (2026-01-03)

## WahookAI System Inventory

### Custom Skills (16 total)
**Écart de Tolérance Suite (7):** EcartVoice, EcartTimeline, EcartBible, EcartAct1, EcartAct2, EcartAct3, EcartTech, AsimovReviewer
**Business Tools (3):** UltraCTO, 3DPrinting, AlexHormoziPitch
**Development Tools (4):** CreateCLI, Createskill, Fabric, Research
**Specialized (2):** BrightData, Ffuf, StoryExplanation

### Customizations
- **Identity:** WahookAI (DA environment variable)
- **Hooks:** 15+ custom hooks with observability integration
- **FOCUS-2026:** Project filtering system
- **French Support:** Bilingual integration throughout
- **History System:** Active and populated with session data

## Decision: Stay Legacy + Selective Adoption

### Reasoning

1. **Working System** - WahookAI is highly customized and fully functional
2. **Significant Investment** - 16 custom skills represent substantial development
3. **No Migration Path** - v2.1.0 requires complete reinstall, not upgrade
4. **Upstream Stability** - Let new pack architecture mature before full migration
5. **Selective Benefits** - Can still add genuinely new packs manually

### Options Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **A: Stay Legacy** | Zero risk, all customizations preserved | Won't get upstream updates easily | ✅ **SELECTED** |
| **B: Hybrid Approach** | Get new features, keep customizations | Manual integration work required | ✅ **ADOPTED** |
| **C: Full Reinstall** | Aligned with upstream | Lose all customizations, 8-12 hrs work | ❌ **REJECTED** |

## Hybrid Strategy

**Keep Legacy Structure:**
- Entire `.claude/` directory remains intact
- All 16 custom skills preserved
- All hooks, agents, commands unchanged
- WahookAI identity maintained

**Selective Pack Installation:**
- Evaluate NEW packs from upstream (not replacements)
- Install manually into `.claude/` structure
- Test compatibility before full integration

## Packs Installed (Session: 2026-01-03)

### 1. kai-voice-system v1.3.0
**Installed:** 2026-01-03 (First pack)

**Why This Pack:**
- Genuinely NEW feature (not in existing system)
- Low integration risk (adds hooks, doesn't replace)
- Useful functionality (TTS notifications)

**Installation:**
- Files: `hooks/lib/prosody-enhancer.ts`, `hooks/stop-hook-voice.ts`, `hooks/subagent-stop-hook-voice.ts`, `voice-server/server.ts`, `config/voice-personalities.json`
- Hooks: Registered Stop and SubagentStop voice hooks
- Server: Running on port 8888 with ElevenLabs TTS
- Status: ✅ Verified and operational

### 2. Generate.ts Tool (Art Skill Enhancement)
**Installed:** 2026-01-03

**What:**
- Cherry-picked Generate.ts CLI tool from kai-art-skill
- Multi-model image generator (Flux, GPT-image-1, Gemini)
- 560 lines, deterministic CLI design

**Why:**
- Enhances existing Art skill workflows
- Adds background removal, thumbnails, multi-model support
- Complements rather than replaces

**Installation:**
- File: `skills/Art/Tools/Generate.ts` (executable)
- Status: ✅ Installed (dependencies via Art skill)

### 3. kai-browser-skill v1.1.0
**Installed:** 2026-01-03

**What:**
- Playwright-based browser automation
- 99% token savings vs MCP (13,700 → 50-200 tokens)
- Code-first interface

**Why:**
- Genuinely NEW capability (not in system)
- High value for web scraping, testing, screenshots
- Low integration risk (additive only)

**Installation:**
- Directory: `skills/Browser/`
- Files: `index.ts`, `Tools/Browse.ts`, 4 workflows, examples
- Dependencies: Playwright + Chromium installed
- Status: ✅ Verified and operational

### 4. kai-agents-skill v1.1.0
**Installed:** 2026-01-03

**What:**
- Dynamic agent composition system
- 800 unique combinations (Expertise × Personality × Approach)
- Trait-based agent generation

**Why:**
- Existing agents are static
- Enables on-the-fly specialist creation
- Voice differentiation for multiple agents

**Installation:**
- Directory: `skills/Agents/`
- Files: `SKILL.md`, `AgentPersonalities.md`, `Tools/AgentFactory.ts`, `Data/Traits.yaml`, template
- Workflows: CreateCustomAgent, ListTraits, SpawnParallelAgents
- Status: ✅ Verified and operational

## Future Pack Evaluation Criteria

**Consider Installing When:**
- Pack provides genuinely NEW functionality
- Pack doesn't replace existing customizations
- Integration risk is low (additive, not replacement)
- Value proposition is clear

**Candidates for Future Consideration:**
- kai-browser-skill - Browser automation (new capability)
- Future packs with novel features

**Do NOT Install:**
- Packs that replace existing customizations (kai-core-install, kai-hook-system, etc.)
- Packs that conflict with WahookAI identity
- Packs that would break FOCUS-2026 or French support

## Reconsider Full Migration When

1. Upstream releases v3.0 with migration tooling
2. Pack architecture becomes industry standard
3. Maintaining legacy becomes painful
4. Critical pack requires new architecture

## Documentation

- **Divergence Point:** f8a04c3 → c38a43c (2025-12-21 to 2026-01-03)
- **Architecture:** Legacy monolithic (WahookAI custom) vs. Packs modular (upstream)
- **Sync Strategy:** Manual evaluation and selective installation
- **Decision Review:** Quarterly (next: 2026-04-01)

## Commands for Future Updates

```bash
# Check upstream for new packs
git fetch upstream main
git ls-tree -d --name-only upstream/main:Packs/

# Evaluate specific pack
git show upstream/main:Packs/[pack-name]/README.md

# Manual pack installation (if approved)
# Follow pack's INSTALL.md and VERIFY.md
```

## Conclusion

WahookAI remains on legacy format as a **conscious architectural decision**, not technical debt. The system is stable, customized, and functional. We will selectively adopt genuinely new packs while preserving the core infrastructure that makes WahookAI unique.

**Session Results (2026-01-03):**
- ✅ 4 upstream packs successfully integrated
- ✅ Voice notifications operational (kai-voice-system)
- ✅ Multi-model image generation added (Generate.ts)
- ✅ Browser automation capability added (kai-browser-skill)
- ✅ Dynamic agent composition enabled (kai-agents-skill)
- ✅ All 16 custom skills preserved
- ✅ WahookAI identity intact
- ✅ FOCUS-2026 and French support unchanged

**New Capabilities:**
- TTS notifications with prosody enhancement
- Playwright browser automation (99% token savings)
- 800 unique agent trait combinations
- Multi-model image generation (Flux, GPT, Gemini)

This decision balances **stability** (keep what works) with **innovation** (adopt what's valuable).

**Total Skills:** 24 (was 22) → +2 new skills (Browser, Agents)
**Total Packs:** 4 upstream packs integrated via hybrid strategy

---
**Documented by:** WahookAI PAI Update System
**Last Updated:** 2026-01-03 22:07 PST
**Review Date:** 2026-04-01 (Quarterly)
