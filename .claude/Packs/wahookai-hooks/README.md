# wahookai-hooks

**Version:** 1.0.0
**Category:** Core Infrastructure
**Status:** Production
**Dependencies:** None (foundation pack)

---

## Problem

Claude Code hooks provide event-driven automation, but out-of-the-box hooks are basic. WahookAI needs sophisticated session management, learning capture, voice notifications, observability, and security validation.

---

## Solution

A comprehensive hook system with 19 custom hooks plus 3 shared libraries, providing:

- **Session Management** - Initialization, tab titles, context loading
- **Learning Capture** - Automatic documentation of decisions, learnings, sessions
- **Voice Integration** - Prosody-enhanced voice notifications for main + subagents
- **Security** - Protected file validation, sensitive data checks
- **Observability** - Event tracking for dashboard integration
- **Context Management** - Dynamic requirements, compression, core context injection

---

## What's Inside

### Core Hooks (19)

**Session Management:**
- `initialize-session.ts` - Main session startup orchestrator
- `load-core-context.ts` - Injects CORE skill context at session start
- `load-dynamic-requirements.ts` - Dynamic context loading based on session type
- `update-tab-titles.ts` - Sets terminal tab title to current task
- `update-tab-on-action.ts` - Updates tab on specific actions

**Learning & Documentation:**
- `capture-learning.ts` - Captures learnings to history system
- `capture-session-summary.ts` - Generates end-of-session summaries
- `capture-all-events.ts` - Comprehensive event logging
- `capture-tool-output.ts` - Logs tool execution for analysis
- `update-documentation.ts` - Auto-updates documentation files

**Voice System:**
- `stop-hook-voice.ts` - Main agent voice notifications with prosody enhancement
- `subagent-stop-hook-voice.ts` - Subagent voice notifications

**Security:**
- `security-validator.ts` - Validates protected files aren't exposed
- `validate-protected.ts` - Additional protected file checks
- `validate-docs.ts` - Documentation integrity validation

**Utility:**
- `stop-hook.ts` - General cleanup and finalization
- `subagent-stop-hook.ts` - Subagent cleanup
- `context-compression-hook.ts` - Compresses large context for efficiency
- `self-test.ts` - Hook system self-diagnostics

### Shared Libraries (3)

- `lib/prosody-enhancer.ts` - SSML prosody enhancement for natural speech (8.5KB)
- `lib/metadata-extraction.ts` - Extracts metadata from conversation transcripts
- `lib/pai-paths.ts` - Centralized path management for PAI directories

---

## Architecture

### Hook Event Flow

```
SessionStart
    ↓
initialize-session.ts
    ↓
load-core-context.ts
    ↓
[User Interaction]
    ↓
update-tab-on-action.ts (on specific tools)
    ↓
SessionStop
    ↓
capture-session-summary.ts
stop-hook-voice.ts (if voice enabled)
capture-learning.ts
```

### Prosody Enhancement System

The `prosody-enhancer.ts` library provides natural speech through:
- Emphasis detection (`**bold**` → emphasis)
- Pause injection (periods, commas → pauses)
- Code block handling (spoken naturally, not read character-by-character)
- Rate/pitch/volume adjustment
- Voice personality mapping

---

## Dependencies

**Runtime:**
- Bun runtime (all hooks use `#!/usr/bin/env bun`)
- Claude Code hook system
- File system access

**Optional Integrations:**
- Voice server (for voice notifications)
- Observability server (for event tracking)
- History system (for learning capture)

---

## Installation

See INSTALL.md for complete installation instructions.

**Quick Install:**
```bash
cd $PAI_DIR/Packs/wahookai-hooks
cp -r src/hooks/*.ts $PAI_DIR/hooks/
cp -r src/lib/*.ts $PAI_DIR/hooks/lib/
# Configure settings.json hooks (see INSTALL.md)
```

---

## Configuration

All hooks read from environment variables in `settings.json`:

```json
{
  "env": {
    "PAI_DIR": "/path/to/.claude",
    "DA": "WahookAI",
    "DA_VOICE_ID": "your-elevenlabs-voice-id"
  }
}
```

---

## Examples

### Session Initialization
```
User starts Claude Code session
→ initialize-session.ts runs
→ Checks for subagent (skips if subagent)
→ Sets tab title to "WahookAI Ready"
→ Sends voice notification: "System ready"
→ Calls load-core-context.ts
→ CORE skill context injected
```

### Voice Notification with Prosody
```
User completes task
→ stop-hook-voice.ts triggered
→ Reads COMPLETED line from response format
→ Enhances with prosody (emphasis, pauses)
→ Sends to voice server
→ User hears natural speech
```

### Learning Capture
```
Session ends
→ capture-session-summary.ts runs
→ Analyzes full transcript
→ Extracts key learnings
→ Writes to history/learnings/YYYY-MM/
→ Future sessions can reference this knowledge
```

---

## Key Features

### 🎯 Enhancements Over Upstream

**vs. kai-hook-system:**
- 19 hooks vs. upstream's base implementation
- Prosody-enhanced voice (8.5KB SSML engine)
- Subagent voice support
- Comprehensive learning capture
- Security validation
- Dynamic context loading
- Observability integration

### 🔒 Security Features

- Protected file validation before git operations
- Sensitive data detection (API keys, credentials)
- Documentation integrity checks
- Automatic sanitization warnings

### 🎤 Voice Intelligence

- Natural speech patterns (emphasis, pauses, rate)
- Code block spoken naturally ("the function returns true" not "t-h-e f-u-n-c...")
- Voice personality support (multiple voice IDs)
- Prosody enhancement for engagement

---

## Related

- **wahookai-voice** - Voice server that receives notifications from these hooks
- **wahookai-core** - CORE skill loaded by `load-core-context.ts`
- **wahookai-history** - History system populated by capture hooks
- **wahookai-observability** - Dashboard that displays hook events

---

## Verification

After installation, verify with:

```bash
# Test initialize-session
claude-code # Should see tab title change + voice notification

# Test voice hooks
# Complete a task, check voice notification

# Test learning capture
# End session, check history/learnings/ for new file
```

See VERIFY.md for complete checklist.

---

*Part of WahookAI Personal AI Infrastructure - Enhanced hook system for intelligent automation*
