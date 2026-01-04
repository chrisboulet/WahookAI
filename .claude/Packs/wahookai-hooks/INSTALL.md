# Installation: wahookai-hooks

**Prerequisites:**
- PAI_DIR configured in settings.json
- Bun runtime installed
- Claude Code 1.0+

**Installation Time:** ~10 minutes

---

## Step 1: Copy Hook Files

Copy all hook scripts to your PAI hooks directory:

```bash
# Navigate to pack
cd $PAI_DIR/Packs/wahookai-hooks

# Copy all hooks
cp src/hooks/*.ts $PAI_DIR/hooks/

# Create lib directory if it doesn't exist
mkdir -p $PAI_DIR/hooks/lib

# Copy shared libraries
cp src/lib/*.ts $PAI_DIR/hooks/lib/

# Make hooks executable
chmod +x $PAI_DIR/hooks/*.ts
```

**Verification:**
```bash
ls -la $PAI_DIR/hooks/*.ts | wc -l  # Should show 19
ls -la $PAI_DIR/hooks/lib/*.ts | wc -l  # Should show 3
```

---

## Step 2: Configure settings.json

Edit your `$PAI_DIR/settings.json` to configure hook events:

```json
{
  "env": {
    "PAI_DIR": "/home/your-user/WahookAI/.claude",
    "DA": "WahookAI",
    "DA_VOICE_ID": "your-elevenlabs-voice-id"
  },
  "hooks": {
    "SessionStart": [
      {
        "command": "bun",
        "args": ["${PAI_DIR}/hooks/initialize-session.ts"]
      }
    ],
    "SessionStop": [
      {
        "command": "bun",
        "args": ["${PAI_DIR}/hooks/capture-session-summary.ts"]
      },
      {
        "command": "bun",
        "args": ["${PAI_DIR}/hooks/stop-hook-voice.ts"]
      }
    ],
    "SubagentStop": [
      {
        "command": "bun",
        "args": ["${PAI_DIR}/hooks/subagent-stop-hook-voice.ts"]
      }
    ],
    "AfterToolCall": [
      {
        "command": "bun",
        "args": ["${PAI_DIR}/hooks/update-tab-on-action.ts"],
        "tools": ["Edit", "Write", "Bash"]
      }
    ]
  }
}
```

**Note:** Adjust hook configuration based on your needs. The above is the recommended minimum.

---

## Step 3: Environment Variables

Ensure these environment variables are set in `settings.json`:

| Variable | Purpose | Example |
|----------|---------|---------|
| `PAI_DIR` | Path to your .claude directory | `/home/chris/WahookAI/.claude` |
| `DA` | Your AI's name | `WahookAI` |
| `DA_VOICE_ID` | ElevenLabs voice ID (optional) | `21m00Tcm4TlvDq8ikWAM` |

---

## Step 4: Optional Integrations

### Voice System Integration

If you have wahookai-voice installed:

1. Ensure voice server is running
2. Voice hooks will automatically connect
3. Test with `curl http://localhost:3000/health`

### Observability Integration

If you have wahookai-observability installed:

1. Add observability calls to hooks (optional)
2. Events will appear in dashboard
3. Access at `http://localhost:3001`

### History System Integration

If you have wahookai-history installed:

1. Learning capture hooks will automatically populate history
2. Check `$PAI_DIR/history/learnings/` for captured learnings
3. Session summaries in `$PAI_DIR/history/sessions/`

---

## Step 5: Restart Claude Code

For hooks to take effect:

```bash
# Exit current session
exit

# Start new session
claude-code

# You should see:
# - Tab title updated
# - Voice notification (if voice enabled)
# - CORE context loaded
```

---

## Verification

See VERIFY.md for complete verification checklist.

**Quick Test:**
```bash
# Should see tab title change
echo "Tab should show current task"

# End session - should trigger voice + learning capture
# Check history/sessions/ for new session file
```

---

## Troubleshooting

### Hooks not running

**Symptom:** No tab title change, no voice notifications

**Solutions:**
1. Check settings.json syntax (valid JSON)
2. Verify PAI_DIR path is correct
3. Ensure hooks are executable (`chmod +x`)
4. Check Claude Code logs for hook errors

### Voice notifications not working

**Symptom:** No speech output

**Solutions:**
1. Verify voice server is running (`curl http://localhost:3000/health`)
2. Check DA_VOICE_ID is set
3. Verify ElevenLabs API key in `.env`
4. Test voice server directly

### Learning capture not working

**Symptom:** No files in history/learnings/

**Solutions:**
1. Verify history directory exists
2. Check write permissions on history/
3. Ensure SessionStop hooks are configured
4. Complete a full session (not just exit immediately)

### Permission errors

**Symptom:** "Permission denied" when running hooks

**Solutions:**
```bash
chmod +x $PAI_DIR/hooks/*.ts
chmod +x $PAI_DIR/hooks/lib/*.ts
```

---

## Advanced Configuration

### Custom Hook Combinations

You can add hooks to other events:

```json
{
  "hooks": {
    "BeforeToolCall": [...],
    "AfterToolCall": [...],
    "SessionStart": [...],
    "SessionStop": [...],
    "SubagentStart": [...],
    "SubagentStop": [...]
  }
}
```

### Selective Hook Loading

Enable/disable hooks by commenting them out:

```json
{
  "hooks": {
    "SessionStart": [
      // Disabled: { "command": "bun", "args": ["..."] },
      { "command": "bun", "args": ["${PAI_DIR}/hooks/initialize-session.ts"] }
    ]
  }
}
```

---

**Next:** Complete VERIFY.md checklist to ensure successful installation.
