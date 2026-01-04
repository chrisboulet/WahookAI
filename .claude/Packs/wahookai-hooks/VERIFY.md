# Verification: wahookai-hooks

Complete this checklist to verify successful installation.

---

## Installation Verification

- [ ] All 19 hook files copied to `$PAI_DIR/hooks/`
- [ ] All 3 lib files copied to `$PAI_DIR/hooks/lib/`
- [ ] All hooks are executable (`chmod +x`)
- [ ] settings.json updated with hook configuration
- [ ] Environment variables set (PAI_DIR, DA, DA_VOICE_ID)
- [ ] No syntax errors in settings.json

**Verification Commands:**
```bash
ls -la $PAI_DIR/hooks/*.ts | wc -l  # Should be 19
ls -la $PAI_DIR/hooks/lib/*.ts | wc -l  # Should be 3
test -x $PAI_DIR/hooks/initialize-session.ts && echo "✅ Hooks executable" || echo "❌ Not executable"
```

---

## Functional Verification

### Session Initialization

- [ ] Start new Claude Code session
- [ ] Tab title changes to include AI name
- [ ] Voice notification plays (if voice enabled): "System ready" or similar
- [ ] CORE context loaded (check for CORE skill auto-load message)

**Test:**
```bash
claude-code
# Observe tab title, listen for voice, check for CORE context
```

### Session Stop Hooks

- [ ] Complete a task and exit session
- [ ] Voice notification plays with task summary (if voice enabled)
- [ ] Session summary created in `history/sessions/YYYY-MM/`
- [ ] Learning file created in `history/learnings/YYYY-MM/` (if significant learning)

**Test:**
```bash
# Do some work
# Exit session
ls -lt $PAI_DIR/history/sessions/$(date +%Y-%m)/ | head -5
ls -lt $PAI_DIR/history/learnings/$(date +%Y-%m)/ | head -5
```

### Tab Title Updates

- [ ] Run Edit, Write, or Bash tool
- [ ] Tab title updates to reflect action
- [ ] Title remains readable and informative

**Test:**
```bash
# In Claude Code session
echo "test" > /tmp/test.txt
# Check if tab title updated
```

### Voice Notifications (if voice system installed)

- [ ] Main agent voice notifications work
- [ ] Subagent voice notifications work
- [ ] Prosody enhancement active (speech sounds natural, not robotic)
- [ ] Code blocks spoken naturally (not character-by-character)
- [ ] Emphasis on bold text (`**important**`)

**Test:**
```bash
# Complete a task with COMPLETED line containing **emphasis**
# Listen for natural speech with proper emphasis
```

### Security Validation

- [ ] Protected files detected (if validation enabled)
- [ ] Warnings shown for sensitive data
- [ ] Documentation validation works

**Test:**
```bash
# Try to commit a file with "API_KEY" in it
# Should see security warning
```

---

## Integration Verification

### With wahookai-voice

- [ ] Voice server running (`curl http://localhost:3000/health`)
- [ ] Hooks successfully send notifications
- [ ] Speech output audible
- [ ] Prosody enhancements applied

### With wahookai-history

- [ ] Learning capture creates files
- [ ] Session summaries generated
- [ ] Files contain relevant information
- [ ] Timestamps correct

### With wahookai-observability

- [ ] Hook events appear in dashboard
- [ ] Event tracking functional
- [ ] Real-time updates working

### With wahookai-core

- [ ] CORE context loaded at session start
- [ ] load-core-context.ts executes successfully
- [ ] No errors in hook output

---

## Performance Verification

- [ ] Hooks complete within 2 seconds
- [ ] No noticeable session startup delay
- [ ] Tab title updates are immediate
- [ ] Voice notifications don't block workflow

**Test:**
```bash
time bun $PAI_DIR/hooks/initialize-session.ts
# Should complete in < 2 seconds
```

---

## Error Handling Verification

- [ ] Hooks gracefully handle missing dependencies
- [ ] Failed voice server doesn't crash hooks
- [ ] Missing history directory auto-created
- [ ] Invalid environment variables logged with helpful message

**Test:**
```bash
# Temporarily rename voice server port
# Hooks should continue working without voice
```

---

## File Integrity Check

Verify all hooks are complete (not truncated):

```bash
# Check file sizes
ls -lh $PAI_DIR/hooks/*.ts

# Check for common issues
grep -L "#!/usr/bin/env bun" $PAI_DIR/hooks/*.ts
# Should return nothing (all hooks have shebang)

# Verify lib files have exports
grep -L "export" $PAI_DIR/hooks/lib/*.ts
# Should return nothing (all libs export functions)
```

- [ ] All hook files start with `#!/usr/bin/env bun`
- [ ] All lib files have export statements
- [ ] No truncated files
- [ ] No syntax errors (`bun --check` on each file)

---

## Final Checklist

- [ ] ✅ All 19 hooks installed and executable
- [ ] ✅ All 3 lib files installed
- [ ] ✅ settings.json configured correctly
- [ ] ✅ Session initialization works
- [ ] ✅ Session stop hooks work
- [ ] ✅ Voice notifications work (if enabled)
- [ ] ✅ Learning capture works
- [ ] ✅ Tab title updates work
- [ ] ✅ Security validation active
- [ ] ✅ No errors in Claude Code logs
- [ ] ✅ Performance acceptable (< 2s hooks)

---

## Common Issues & Solutions

### Issue: "PAI_DIR not defined"

**Solution:**
```json
{
  "env": {
    "PAI_DIR": "/full/path/to/.claude"
  }
}
```

### Issue: "Permission denied"

**Solution:**
```bash
chmod +x $PAI_DIR/hooks/*.ts
```

### Issue: "Voice server connection failed"

**This is OK** - hooks work without voice, just no audio notifications.

### Issue: "Cannot find module './lib/prosody-enhancer'"

**Solution:**
```bash
ls $PAI_DIR/hooks/lib/prosody-enhancer.ts
# If missing:
cp $PAI_DIR/Packs/wahookai-hooks/src/lib/*.ts $PAI_DIR/hooks/lib/
```

---

## Success Criteria

**Minimum (Core Functionality):**
- ✅ Session hooks run without errors
- ✅ Tab title updates work
- ✅ Settings properly configured

**Full (All Features):**
- ✅ All 19 hooks functional
- ✅ Voice notifications working
- ✅ Learning capture active
- ✅ Security validation enabled
- ✅ Integrations with other packs working

---

**Status:**

- [ ] ✅ VERIFIED - All checks passed
- [ ] ⚠️ PARTIAL - Some features not working (document which)
- [ ] ❌ ISSUES FOUND - Installation needs fixing

**Issues Found:** (if any)

---

**Installation complete!** ✅

Your enhanced hook system is now active and will:
- Initialize sessions intelligently
- Provide voice feedback
- Capture learnings automatically
- Validate security
- Track all events for observability
