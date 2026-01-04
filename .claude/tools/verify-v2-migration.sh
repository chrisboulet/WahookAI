#!/usr/bin/env bash
# Verify WahookAI v2.0 Migration

set -euo pipefail

PAI_DIR="${PAI_DIR:-/home/chris/WahookAI/.claude}"

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                WahookAI v2.0 Migration Verification                ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Counter for checks
PASSED=0
FAILED=0

check() {
    local description="$1"
    local command="$2"

    echo -n "Checking: $description... "
    if eval "$command" &>/dev/null; then
        echo "✅ PASS"
        ((PASSED++))
    else
        echo "❌ FAIL"
        ((FAILED++))
    fi
}

echo "=== Directory Structure ==="
check "Packs directory exists" "test -d $PAI_DIR/Packs"
check "Bundles directory exists" "test -d $PAI_DIR/Bundles"
check "Archive directory exists" "test -d $PAI_DIR/archive"
check "Skills directory exists" "test -d $PAI_DIR/skills"
check "Hooks directory exists" "test -d $PAI_DIR/hooks"
check "History directory exists" "test -d $PAI_DIR/history"

echo ""
echo "=== Pack Counts ==="
PACK_COUNT=$(ls -1 $PAI_DIR/Packs | wc -l)
BUNDLE_COUNT=$(ls -1 $PAI_DIR/Bundles | wc -l)
SKILL_COUNT=$(ls -1 $PAI_DIR/skills | wc -l)

echo "Packs created: $PACK_COUNT (expected: 20)"
echo "Bundles created: $BUNDLE_COUNT (expected: 1)"
echo "Active skills: $SKILL_COUNT (expected: 23)"

check "20 packs created" "test $PACK_COUNT -eq 20"
check "1 bundle created" "test $BUNDLE_COUNT -eq 1"
check "23 skills active" "test $SKILL_COUNT -ge 23"

echo ""
echo "=== Core Infrastructure Packs ==="
check "wahookai-hooks exists" "test -d $PAI_DIR/Packs/wahookai-hooks"
check "wahookai-history exists" "test -d $PAI_DIR/Packs/wahookai-history"
check "wahookai-core exists" "test -d $PAI_DIR/Packs/wahookai-core"
check "wahookai-voice exists" "test -d $PAI_DIR/Packs/wahookai-voice"
check "wahookai-observability exists" "test -d $PAI_DIR/Packs/wahookai-observability"

echo ""
echo "=== Pack Documentation ==="
check "wahookai-hooks README" "test -f $PAI_DIR/Packs/wahookai-hooks/README.md"
check "wahookai-hooks INSTALL" "test -f $PAI_DIR/Packs/wahookai-hooks/INSTALL.md"
check "wahookai-hooks VERIFY" "test -f $PAI_DIR/Packs/wahookai-hooks/VERIFY.md"
check "wahookai-history README" "test -f $PAI_DIR/Packs/wahookai-history/README.md"

echo ""
echo "=== Écart Manuscript Bundle ==="
check "écart-manuscript bundle exists" "test -d $PAI_DIR/Bundles/ecart-manuscript"
check "EcartAct1 in bundle" "test -d $PAI_DIR/Bundles/ecart-manuscript/src/skills/EcartAct1"
check "EcartAct2 in bundle" "test -d $PAI_DIR/Bundles/ecart-manuscript/src/skills/EcartAct2"
check "EcartAct3 in bundle" "test -d $PAI_DIR/Bundles/ecart-manuscript/src/skills/EcartAct3"
check "EcartBible in bundle" "test -d $PAI_DIR/Bundles/ecart-manuscript/src/skills/EcartBible"
check "EcartTech in bundle" "test -d $PAI_DIR/Bundles/ecart-manuscript/src/skills/EcartTech"
check "EcartTimeline in bundle" "test -d $PAI_DIR/Bundles/ecart-manuscript/src/skills/EcartTimeline"
check "EcartVoice in bundle" "test -d $PAI_DIR/Bundles/ecart-manuscript/src/skills/EcartVoice"

echo ""
echo "=== Hook System ==="
HOOK_COUNT=$(ls -1 $PAI_DIR/hooks/*.ts 2>/dev/null | wc -l)
LIB_COUNT=$(ls -1 $PAI_DIR/hooks/lib/*.ts 2>/dev/null | wc -l)

echo "Active hooks: $HOOK_COUNT (expected: 19)"
echo "Hook libraries: $LIB_COUNT (expected: 3)"

check "19 hooks active" "test $HOOK_COUNT -eq 19"
check "3 lib files active" "test $LIB_COUNT -eq 3"
check "Hooks are executable" "test -x $PAI_DIR/hooks/initialize-session.ts"

echo ""
echo "=== Active Skills ==="
check "CORE skill active" "test -d $PAI_DIR/skills/CORE"
check "Agents skill active" "test -d $PAI_DIR/skills/Agents"
check "UltraCTO skill active" "test -d $PAI_DIR/skills/UltraCTO"
check "AsimovReviewer skill active" "test -d $PAI_DIR/skills/AsimovReviewer"

echo ""
echo "=== Backup Integrity ==="
BACKUP_DIR="$PAI_DIR/history/backups/pre-v2-migration-2026-01-03_232133"
check "Pre-migration backup exists" "test -d $BACKUP_DIR"
check "Backup contains skills" "test -d $BACKUP_DIR/skills"
check "Backup contains hooks" "test -d $BACKUP_DIR/hooks"

echo ""
echo "=== Git Status ==="
cd /home/chris/WahookAI
COMMIT_COUNT=$(git log --oneline --since="2026-01-03 23:00" | wc -l)
echo "Commits since migration start: $COMMIT_COUNT"
check "Pre-migration commit exists" "git log --oneline | grep -q '321d7b0'"

echo ""
echo "=== Architecture Documentation ==="
check "WAHOOKAI-ARCHITECTURE.md exists" "test -f $PAI_DIR/WAHOOKAI-ARCHITECTURE.md"
check "Migration log exists" "test -f $PAI_DIR/scratchpad/migration-log.md"
check "Migration plan exists" "test -f $PAI_DIR/scratchpad/MIGRATION-PLAN-V2.md"

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                        Verification Summary                        ║"
echo "╠═══════════════════════════════════════════════════════════════════╣"
echo "║  PASSED: $PASSED checks                                                    "
echo "║  FAILED: $FAILED checks                                                    "
echo "╚═══════════════════════════════════════════════════════════════════╝"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo "✅ All checks passed! WahookAI v2.0 migration successful."
    exit 0
else
    echo ""
    echo "⚠️  Some checks failed. Review above output."
    exit 1
fi
