---
date: 2026-01-05
capture_type: LEARNING
category: auto-captured
severity: high
tags: []
session_context: [object Object],[object Object]
auto_captured: true
---

# Apprentissage Automatique - 2026-01-05

## Points Clés (Haute Confiance)

### CAPTURE

** Statusline cross-platform compatibility requires `stat -c%Y` for Linux and `stat -f%m` for macOS. The fix uses command chaining with `||` to attempt both syntaxes gracefully.

**NEXT:** Your statusline should now display correctly. If you want to customize the content or layout, ask me to use the statusline-setup agent again.

**STORY EXPLANATION:**
1. Your statusline wasn't working because it used macOS-specific commands
2. The `stat -f%m` command syntax only works on macOS, not Linux
3. The statusline-setup agent diagnosed the platform incompatibility issue
4. We updated the script to try Linux syntax first (`stat -c%Y`)
5. If Linux syntax fails, it falls back to macOS syntax automatically
6. This makes the script work seamlessly on both operating systems
7. The statusline displays your WahookAI identity, MCP servers, and token usage
8. Your custom statusline is now fully functional on your Linux system

**COMPLETED:** Statusline fixed with cross-platform stat command compatibility

> Contexte: Response format CAPTURE field

---

*Capturé automatiquement par capture-learning.ts*
