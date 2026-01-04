#!/usr/bin/env bash
# Create new WahookAI pack structure

set -euo pipefail

PACK_NAME="$1"
CATEGORY="${2:-Utility}"

if [ -z "$PACK_NAME" ]; then
    echo "Usage: create-pack.sh <pack-name> [category]"
    exit 1
fi

PAI_DIR="${PAI_DIR:-$HOME/WahookAI/.claude}"
PACK_DIR="$PAI_DIR/Packs/$PACK_NAME"

# Create pack structure
mkdir -p "$PACK_DIR/src"/{skills,hooks,tools,config}

# Copy templates
cp "$PAI_DIR/scratchpad/pack-template-README.md" "$PACK_DIR/README.md"
cp "$PAI_DIR/scratchpad/pack-template-INSTALL.md" "$PACK_DIR/INSTALL.md"
cp "$PAI_DIR/scratchpad/pack-template-VERIFY.md" "$PACK_DIR/VERIFY.md"

# Replace placeholders
sed -i "s/\[PACK_NAME\]/$PACK_NAME/g" "$PACK_DIR"/*.md
sed -i "s/\[CATEGORY\]/$CATEGORY/g" "$PACK_DIR/README.md"
sed -i "s/\[pack-name\]/$PACK_NAME/g" "$PACK_DIR"/*.md"

echo "✅ Pack created: $PACK_DIR"
echo "Next steps:"
echo "  1. Edit README.md with pack details"
echo "  2. Add source files to src/"
echo "  3. Complete INSTALL.md steps"
echo "  4. Define VERIFY.md checklist"
