---
date: 2026-01-04
capture_type: LEARNING
category: auto-captured
severity: high
tags: []
session_context: Todos have been modified successfully. Ensure that you continue to use the todo list to track your p
auto_captured: true
---

# Apprentissage Automatique - 2026-01-04

## Points Clés (Haute Confiance)

### CAPTURE

**
Upstream PAI v2.1.0 replaced monolithic structure with Packs system. WahookAI staying on legacy format by design—16 custom skills, full customizations, hybrid pack adoption strategy. First pack installed: kai-voice-system (TTS notifications). Decision documented in `.claude/history/decisions/2026-01/pai-v2-architectural-decision.md` for future reference.

**NEXT:**
1. Test voice notifications by completing a task (you should hear TTS)
2. Optionally set `TTS_PROVIDER=google` in `.env` for 400x more free chars
3. Monitor upstream quarterly for genuinely new packs worth adding
4. Consider kai-browser-skill pack if browser automation interests you

**STORY EXPLANATION:**
1. Upstream PAI completely restructured from `.claude/` directory to modular Packs system with 9 installable components
2. Your WahookAI has 16 custom skills (Écart manuscript tools, business trackers, dev utilities) worth protecting
3. The "update" would require complete reinstall and manual migration of all customizations—not an upgrade path
4. Decided on hybrid strategy: keep legacy structure, selectively install NEW packs that don't replace existing work
5. Installed kai-voice-system pack as proof-of-concept—adds TTS notifications without touching existing infrastructure
6. Voice server now running on port 8888, integrated with your hooks, using ElevenLabs API for natural speech
7. Documented this as conscious architectural decision (not technical debt) with quarterly review cycle
8. WahookAI remains stable, customized, and functional while gaining access to valuable new pack features

**COMPLETED:** Voice system installed, legacy format decision documented and future-proofed

> Contexte: Response format CAPTURE field

---

*Capturé automatiquement par capture-learning.ts*
