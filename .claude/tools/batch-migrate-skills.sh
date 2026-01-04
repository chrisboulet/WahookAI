#!/usr/bin/env bash
# Batch migrate skills from v1.0 flat structure to v2.0 packs

set -euo pipefail

PAI_DIR="${PAI_DIR:-/home/chris/WahookAI/.claude}"

# Function to create a skill pack
create_skill_pack() {
    local skill_name="$1"
    local category="${2:-Utility}"
    local pack_name="wahookai-$(echo $skill_name | tr '[:upper:]' '[:lower:]')"

    echo "Creating pack: $pack_name from skill: $skill_name"

    # Create pack structure
    mkdir -p "$PAI_DIR/Packs/$pack_name/src/skills/$skill_name"

    # Copy skill files
    if [ -d "$PAI_DIR/skills/$skill_name" ]; then
        cp -r "$PAI_DIR/skills/$skill_name"/* "$PAI_DIR/Packs/$pack_name/src/skills/$skill_name/"

        # Create basic README
        cat > "$PAI_DIR/Packs/$pack_name/README.md" <<EOF
# $pack_name

**Version:** 1.0.0
**Category:** $category
**Status:** Production

---

## Overview

Migrated from v1.0 skill: $skill_name

---

## Installation

\`\`\`bash
cp -r src/skills/$skill_name \$PAI_DIR/skills/
\`\`\`

---

*Part of WahookAI Personal AI Infrastructure*
EOF

        echo "✅ Created: $pack_name"
    else
        echo "❌ Skill not found: $skill_name"
    fi
}

# Migrate all utility skills
echo "=== Migrating Utility Skills ==="
create_skill_pack "Fabric" "Utility"
create_skill_pack "Ffuf" "Security"
create_skill_pack "CreateCLI" "Development"
create_skill_pack "AlexHormoziPitch" "Business"
create_skill_pack "BrightData" "Utility"

# Migrate specialized skills
echo -e "\n=== Migrating Specialized Skills ==="
create_skill_pack "AsimovReviewer" "Writing"
create_skill_pack "Research" "Research"
create_skill_pack "StoryExplanation" "Writing"
create_skill_pack "Createskill" "Development"

# Migrate business tools
echo -e "\n=== Migrating Business Tools ==="
create_skill_pack "UltraCTO" "Business"
create_skill_pack "3DPrinting" "Business"

# Migrate enhanced PAI skills
echo -e "\n=== Migrating Enhanced PAI Skills ==="
create_skill_pack "Prompting" "Core"
create_skill_pack "Agents" "Core"
create_skill_pack "Art" "Creativity"
create_skill_pack "Browser" "Automation"

echo -e "\n✅ Batch migration complete!"
