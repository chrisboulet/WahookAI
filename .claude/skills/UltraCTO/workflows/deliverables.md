# Workflow: Client Deliverables

## Trigger
- `/generate` commands
- Mentions of "roadmap", "ADR", "rapport", "politique", "proposal"

## Available Deliverables

### Roadmap (`/generate roadmap "Client" "Period"`)

**Template**: `~/UltraCTO-OS/templates/fr/roadmap-template.md`

#### Steps:
1. Load client context from CRM
2. Read template
3. Fill placeholders:
   - `{{client}}` - Client name
   - `{{period}}` - Q1-2026, etc.
   - `{{objectives}}` - Strategic objectives
   - `{{phases}}` - Implementation phases
   - `{{milestones}}` - Key milestones
   - `{{dependencies}}` - Dependencies/risks

4. Generate DOCX:
```bash
node ~/UltraCTO-OS/scripts/md-to-docx.js roadmap.md output/roadmap.docx
```

5. Upload to Drive:
```bash
python ~/UltraCTO-OS/scripts/upload_to_drive.py output/roadmap.docx "CLIENTS/[Client]/Livrables"
```

6. Cleanup temp file

### ADR (`/generate adr "Decision Title"`)

**Template**: `~/UltraCTO-OS/templates/fr/adr-template.md`

#### Structure:
- **Titre**: ADR-XXX: [Decision]
- **Statut**: Proposé / Accepté / Déprécié
- **Contexte**: Pourquoi cette décision?
- **Décision**: Qu'avons-nous décidé?
- **Conséquences**: Impacts positifs/négatifs
- **Alternatives**: Options considérées

#### Steps:
1. Generate ADR number (sequential)
2. Fill template with decision details
3. Save to `clients/[Client]/ADRs/` or `docs/ADRs/`
4. Generate DOCX if needed for client

### Monthly Report (`/generate report "Client" "Month"`)

**Template**: `~/UltraCTO-OS/templates/fr/status-report-template.md`

#### Sections:
- Résumé exécutif
- Accomplissements du mois
- Métriques clés
- Risques et enjeux
- Plan mois suivant
- Heures consommées vs budget

#### Steps:
1. Gather data from:
   - CRM interactions this month
   - Calendar events with client
   - Completed deliverables
2. Fill template
3. Generate DOCX
4. Upload to client Drive folder

### Policy Documents (`/generate policy "type" "Client"`)

**Available Types**:
- `protection-donnees` - Loi 25 Quebec compliance
- `securite-informatique` - IT Security policy
- `attribution-materiel` - Equipment policy
- `teletravail` - Remote work policy

#### Steps:
1. Load policy template from `templates/fr/`
2. Customize for client:
   - Company name
   - Specific requirements
   - Contact information
3. Generate DOCX:
```bash
node ~/UltraCTO-OS/scripts/generate-policy-packs.js [pack-name]
```

### Proposal (`/generate proposal "Client"`)

**Template**: `~/UltraCTO-OS/templates/fr/proposition-template.md`

#### Sections:
- Contexte et besoins
- Solution proposée
- Approche Fractional CTO
- Livrables inclus
- Investissement (CAD)
- Conditions et garanties
- Prochaines étapes

#### Steps:
1. Load prospect from CRM
2. Research company (parallel WebSearch)
3. Customize proposal:
   - Pain points identified
   - Tailored solution
   - Pricing based on scope
4. Apply 4L Framework check
5. Generate DOCX
6. Optional: Upload to Drive

### Kickoff One-Pager (`/generate kickoff "Client"`)

**Template**: `~/UltraCTO-OS/templates/fr/kickoff-onepager-template.md`

#### Structure (4DX):
- WIG (Wildly Important Goal)
- Lead Measures
- Scoreboard
- Cadence of Accountability

```bash
python ~/UltraCTO-OS/scripts/generate_kickoff_pdf_template.py "Client" "Contact" "Role" "2025-01-15" 20 250
```

## Brand Guidelines

All documents MUST follow:

| Element | Value |
|---------|-------|
| Primary Color | #2D3E50 (Bleu Marine) |
| Accent Color | #C17A4A (Cuivre) |
| Title Font | Georgia Bold |
| Body Font | Calibri 11pt |
| Code Font | Consolas 10pt |

**Interdictions**:
- Pas d'emojis dans documents pro
- Pas d'autres bleus que #2D3E50 ou #4A6178
- Pas de polices autres que Georgia/Calibri/Consolas

## Pricing Rules

- Always use CAD: `X $` or `X $ CAD`
- Never USD unless explicit comparison
- Format: `5 000 $` (space as thousands separator)

## Output Workflow

```
1. Generate markdown → clients/[Client]/[doc].md (Git OK)
2. Convert to DOCX → output/[doc].docx (temporary)
3. Upload to Drive → CLIENTS/[Client]/Livrables/
4. Delete temp file
5. Confirm with user
```

## ADHD Optimization

- Auto-generate from CRM data when possible
- Templates reduce decision fatigue
- One deliverable at a time
- Celebrate completion: "Document livré!"
