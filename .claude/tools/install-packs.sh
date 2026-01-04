#!/usr/bin/env bash
# Install all packs from Packs/ to installed/

set -euo pipefail

PAI_DIR="${PAI_DIR:-/home/chris/WahookAI/.claude}"
cd "$PAI_DIR"

echo "Installing WahookAI Packs v2.0..."

# Create installed directories
mkdir -p installed/skills

# Install packs by copying (not symlinks for simplicity)
echo "=== Installing Packs ==="
for pack in Packs/wahookai-*/src/skills/*; do
    skill_name=$(basename "$pack")
    echo "Installing skill: $skill_name"
    cp -r "$pack" "installed/skills/$skill_name"
done

# Install Écart bundle
echo -e "\n=== Installing Écart Manuscript Bundle ==="
for skill in Bundles/ecart-manuscript/src/skills/*; do
    skill_name=$(basename "$skill")
    echo "Installing Écart skill: $skill_name"
    cp -r "$skill" "installed/skills/$skill_name"
done

# Install voice server
echo -e "\n=== Installing Voice Server ==="
cp -r Packs/wahookai-voice/src/voice-server ./

# Install Observability
echo -e "\n=== Installing Observability ==="
cp -r Packs/wahookai-observability/src/Observability ./

echo -e "\n✅ All packs installed!"
echo "Total skills: $(ls -1 installed/skills | wc -l)"
