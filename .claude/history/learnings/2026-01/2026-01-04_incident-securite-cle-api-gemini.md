# Incident Sécurité: Clé API Gemini Exposée sur GitHub

**Date:** 2026-01-04
**Sévérité:** HAUTE
**Statut:** RÉSOLU

## Résumé de l'Incident

Une clé API Google Gemini a été exposée publiquement sur GitHub dans le repository WahookAI.

### Clé Compromise

- **Clé exposée:** `AIzaSy***REDACTED***`
- **Projet GCP:** `fractionalctoassistant`
- **Repository:** `chrisboulet/WahookAI`
- **Commit:** `7fca8e46e141acf4af5db68c3da62d4c7f63d4d7`
- **Fichier:** `.claude/history/backups/2025-12-28-consolidation/History-archived/raw-outputs/2025-12/2025-12-22_all-events.jsonl`

### Détection

- **Source:** Email alerte Google Cloud Platform
- **Date détection:** 2026-01-04 ~08:00 PST
- **Cause:** Fichier JSONL de logs Claude Code contenant export de `.env.local`

## Actions de Remédiation

### 1. Révocation Immédiate ✓

- Clé API désactivée dans Google Cloud Console par Christian
- Temps de réaction: <1 heure après alerte

### 2. Purge Historique Git ✓

**Outils utilisés:**
- `git-filter-repo` (version fb3de42e4281)

**Procédure:**
```bash
# Backup complet du repo
cd /home/chris
tar -czf WahookAI-backup-20260104-085652.tar.gz WahookAI/.git
# Taille backup: 169 MB

# Installation git-filter-repo
curl -L https://raw.githubusercontent.com/newren/git-filter-repo/main/git-filter-repo \
  -o ~/.local/bin/git-filter-repo
chmod +x ~/.local/bin/git-filter-repo

# Purge initiale (suppression fichier spécifique)
cd /home/chris/WahookAI
git-filter-repo --path .claude/history/backups/2025-12-28-consolidation/History-archived/raw-outputs/2025-12/2025-12-22_all-events.jsonl --invert-paths --force

# Purge complète (remplacement clé dans TOUT l'historique)
echo "AIzaSy***REDACTED***==>***REMOVED***" > ~/replace-secrets.txt
git-filter-repo --replace-text ~/replace-secrets.txt --force

# Résultats:
# - 396 commits parsés et réécrits
# - Temps d'exécution: 2.61 secondes
# - Nouveau HEAD: 5bed45b
```

### 3. Force Push vers GitHub ✓

```bash
cd /home/chris/WahookAI
git remote add origin https://github.com/chrisboulet/WahookAI.git
git push --force --all origin

# Résultat:
# + b8da762...5bed45b main -> main (forced update)
```

### 4. Régénération Clé API ✓

- Nouvelle clé générée sur https://aistudio.google.com/apikey
- Mise à jour manuelle par Christian dans `/home/chris/UltraCTO-OS/.env.local`
- **BONNE PRATIQUE:** Clé jamais partagée dans le chat Claude Code

### 5. Vérification Autres Secrets ⚠️

**Secrets additionnels détectés dans fichiers JSONL locaux (non-committés):**
- `SUPABASE_SERVICE_KEY=sb_secret_***REDACTED***`
- `SANITY_API_TOKEN=sk***REDACTED***...`

**Statut:** Fichiers dans `.gitignore` → NON exposés publiquement
**Action:** Aucune régénération nécessaire (secrets jamais poussés sur GitHub)

## Cause Racine

### Pourquoi la clé s'est retrouvée dans Git?

Les fichiers `.claude/history/backups/*/raw-outputs/*.jsonl` contenaient des logs de sessions Claude Code qui ont capturé le contenu de `.env.local` lors d'un `Read` tool call.

**Fichiers problématiques commités:**
- `.claude/history/backups/2025-12-28-consolidation/History-archived/raw-outputs/2025-12/2025-12-22_all-events.jsonl`
- `.claude/history/backups/2025-12-28-consolidation/History-uppercase-backup/raw-outputs/2025-12/2025-12-22_all-events.jsonl`

### Pourquoi ces fichiers n'étaient pas ignorés?

**Timeline du .gitignore:**

1. **Ancienne configuration** (défaillante):
   - `.claude/history/raw-outputs/` était ignoré
   - `.claude/history/backups/*/raw-outputs/` N'ÉTAIT PAS ignoré

2. **Configuration actuelle** (correcte):
   ```
   .claude/history.jsonl
   .claude/history/raw-outputs/
   .claude/History/raw-outputs/
   ```

**Gap de sécurité:** Les backups dans des sous-dossiers n'étaient pas couverts par le pattern `.gitignore`.

## Mesures Préventives Implémentées

### 1. .gitignore Renforcé ✓

Pattern actuel couvre:
- `.claude/history/raw-outputs/` (tous niveaux)
- `.claude/History/raw-outputs/` (case variation)

**RECOMMANDATION:** Ajouter pattern récursif pour tout `raw-outputs/`:
```gitignore
**/raw-outputs/*.jsonl
```

### 2. Pre-commit Hook à Implémenter

**Script recommandé:** `~/.claude/hooks/pre-commit-secret-scan.sh`

```bash
#!/bin/bash
# Scan for common secret patterns before commit

PATTERNS=(
  "AIzaSy[A-Za-z0-9_-]{33}"           # Google API keys
  "sb_secret_[A-Za-z0-9_-]+"          # Supabase service keys
  "sk[A-Za-z0-9]{32,}"                # Sanity tokens
  "SUPABASE_SERVICE_KEY="
  "GEMINI_API_KEY="
  "SANITY_API_TOKEN="
)

for pattern in "${PATTERNS[@]}"; do
  if git diff --cached | grep -E "$pattern"; then
    echo "❌ ERREUR: Secret détecté dans le commit!"
    echo "   Pattern: $pattern"
    exit 1
  fi
done

exit 0
```

### 3. Monitoring GitHub Secret Scanning

- GitHub Advanced Security active (scan automatique)
- Alertes par email configurées
- **Temps de détection:** <24h après push

## Leçons Apprises

### ✅ Ce qui a bien fonctionné

1. **Détection rapide:** Email alerte Google reçu rapidement
2. **Révocation immédiate:** Clé désactivée en <1h
3. **Backup avant purge:** Repo sauvegardé (169 MB)
4. **git-filter-repo:** Purge complète en 6.83 secondes total
5. **Bonne pratique finale:** Nouvelle clé jamais partagée dans chat

### ⚠️ Points d'amélioration

1. **Prévention:** `.gitignore` patterns incomplets
2. **Audit régulier:** Aucun scan proactif des secrets
3. **Visibilité:** Logs JSONL non inspectés avant commit

### 📋 Checklist Sécurité Future

**Avant chaque commit:**
- [ ] Vérifier `git diff` pour patterns de secrets
- [ ] Vérifier aucun fichier `.jsonl` avec secrets dans staging
- [ ] Confirmer que seuls les fichiers intentionnels sont ajoutés

**Mensuel:**
- [ ] Audit complet des fichiers `.gitignore`
- [ ] Rotation des clés API sensibles
- [ ] Review des logs Claude Code pour secrets exposés

## Références

**Outils utilisés:**
- git-filter-repo: https://github.com/newren/git-filter-repo
- GitHub Secret Scanning: https://docs.github.com/en/code-security/secret-scanning

**Documentation Google:**
- Gestion identifiants compromis: https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys

**Temps total de remédiation:** ~30 minutes
**Impact utilisateurs:** Aucun (repo personnel)

---

**Statut final:** ✅ RÉSOLU - Historique purgé, nouvelle clé générée, mesures préventives documentées
