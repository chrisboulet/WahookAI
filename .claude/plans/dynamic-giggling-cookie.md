# Audiobook Server - Kit de Déploiement Portable

**Date:** 2025-12-27
**Objectif:** Kit portable à copier sur disque externe pour déployer sur serveur dédié

---

## Architecture Simplifiée (Tailscale)

```
┌─────────────────────────────────────────────────────────────┐
│                    TAILSCALE NETWORK                        │
│  (VPN privé - pas de ports à ouvrir, pas de SSL à gérer)   │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         v                    v                    v
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │ Enfants  │        │ Serveur  │        │ Agents   │
   │ (Mobile) │        │ Audiobook│        │   AI     │
   └──────────┘        └──────────┘        └──────────┘
                              │
         ┌────────────────────┼────────────────────┐
         v                    v                    v
   ┌───────────┐      ┌───────────────┐     ┌──────────┐
   │Audiobookshelf│   │ Libation      │     │ MCP      │
   │  :13378   │      │ (Headless)    │     │ Server   │
   └───────────┘      └───────────────┘     └──────────┘
         │                    │
         v                    v
   ┌─────────────────────────────────────────────┐
   │       DISQUE EXTERNE USB/Thunderbolt        │
   │  /mnt/audiobooks/                           │
   │  ├── library/   (bibliothèque finale)       │
   │  ├── inbox/     (conversion output)         │
   │  └── config/    (configurations)            │
   └─────────────────────────────────────────────┘
```

---

## Contenu du Kit (à créer)

```
~/audiobook-deploy-kit/
├── README.md                    # Guide d'installation
├── install.sh                   # Script d'installation auto (multi-distro)
├── docker-compose.yml           # Stack complète
├── .env.example                 # Template des variables
├── Caddyfile                    # (optionnel, si pas Tailscale)
│
├── services/
│   ├── aax-converter/
│   │   ├── Dockerfile
│   │   └── watcher.sh
│   └── mcp-server/
│       ├── Dockerfile
│       ├── main.py
│       └── requirements.txt
│
├── scripts/
│   ├── setup-disk.sh            # Formatage/montage disque externe
│   ├── setup-tailscale.sh       # Installation Tailscale
│   ├── generate-secrets.sh      # Génération JWT, tokens
│   ├── backup.sh                # Backup automatisé
│   └── health-check.sh          # Vérification santé services
│
└── docs/
    ├── MOBILE_SETUP.md          # Guide apps iOS/Android pour enfants
    ├── TROUBLESHOOTING.md       # Dépannage
    └── MCP_USAGE.md             # Utilisation avec Claude
```

---

## Phases d'Implémentation

### Phase 1: Créer le Kit (sur ta machine actuelle)
- [ ] Créer structure `~/audiobook-deploy-kit/`
- [ ] Écrire `install.sh` multi-distro (Arch/Ubuntu/Debian)
- [ ] Créer `docker-compose.yml` avec 4 services
- [ ] Écrire Dockerfile pour `aax-converter`
- [ ] Écrire MCP server FastAPI (`mcp-server/`)
- [ ] Créer scripts utilitaires
- [ ] Écrire documentation

### Phase 2: Déploiement (sur serveur cible)
1. Copier kit sur disque externe
2. Brancher disque sur serveur
3. Exécuter `./install.sh`
4. Configurer Audible credentials
5. Installer Tailscale
6. Tester accès mobile

---

## Fichiers Clés à Créer

### 1. install.sh (Script Principal)
```bash
#!/bin/bash
# Détection OS et installation Docker + dépendances
# Support: Arch, Ubuntu, Debian, Raspberry Pi OS
```

### 2. docker-compose.yml
```yaml
services:
  audiobookshelf:
    image: advplyr/audiobookshelf:latest
    ports:
      - "13378:80"
    volumes:
      - ${STORAGE_PATH}/config/audiobookshelf:/config
      - ${STORAGE_PATH}/library:/audiobooks
    restart: unless-stopped

  libation:
    image: rmcrackan/libation:latest
    environment:
      - SLEEP_TIME=30m
    volumes:
      - ${STORAGE_PATH}/config/libation:/config
      - ${STORAGE_PATH}/raw:/data
    restart: unless-stopped

  aax-converter:
    build: ./services/aax-converter
    environment:
      - ACTIVATION_BYTES=${ACTIVATION_BYTES}
    volumes:
      - ${STORAGE_PATH}/raw:/raw:ro
      - ${STORAGE_PATH}/inbox:/inbox
    depends_on:
      - libation
    restart: unless-stopped

  mcp-server:
    build: ./services/mcp-server
    ports:
      - "8765:8000"
    environment:
      - AUDIOBOOKSHELF_URL=http://audiobookshelf:80
      - AUDIOBOOKSHELF_TOKEN=${AUDIOBOOKSHELF_TOKEN}
    volumes:
      - ${STORAGE_PATH}/library:/library:ro
    depends_on:
      - audiobookshelf
    restart: unless-stopped
```

### 3. MCP Server pour Agents AI
8 outils MCP:
- `list_libraries` - Lister bibliothèques
- `search_audiobooks` - Recherche full-text
- `get_audiobook_details` - Métadonnées détaillées
- `get_user_progress` - Progression écoute
- `get_library_stats` - Statistiques
- `read_file_metadata` - FFprobe sur fichiers
- `list_directory` - Explorer fichiers
- `recommend_audiobooks` - Recommandations AI

---

## Avantages Tailscale vs Caddy/Let's Encrypt

| Aspect | Tailscale | Caddy + Let's Encrypt |
|--------|-----------|----------------------|
| **Ports à ouvrir** | Aucun | 80, 443 |
| **Certificat SSL** | Automatique MagicDNS | Configuration requise |
| **DNS** | Pas besoin de domaine | Domaine requis |
| **Sécurité** | VPN chiffré E2E | HTTPS standard |
| **Setup** | 2 minutes | 30+ minutes |
| **Mobile** | App Tailscale + app audio | Direct HTTPS |

**Pour tes enfants:** Installer Tailscale sur leurs appareils → accès automatique au serveur via `audiobooks.tailnet-name.ts.net:13378`

---

## Estimation Temps

| Phase | Durée |
|-------|-------|
| Créer kit complet | 3-4h |
| Copier sur disque externe | 5 min |
| Déploiement sur serveur | 30-45 min |
| Configuration Audible | 15 min |
| Setup Tailscale | 10 min |
| Test mobile enfants | 15 min |
| **Total** | **~5h** |

---

## Prochaines Actions

1. **Approuver ce plan** → Je crée le kit complet
2. **Tu copies** le dossier sur ton disque externe
3. **Tu branches** le disque sur le serveur cible
4. **Tu exécutes** `./install.sh`
5. **Done** - Serveur audiobook opérationnel

---

## Questions Résolues

- **OS cible:** Multi-distro (install.sh détecte automatiquement)
- **Accès externe:** Tailscale (VPN privé, zéro config réseau)
- **Stockage:** Disque externe USB/Thunderbolt
- **AI Agents:** MCP Server avec 8 outils
- **Enfants:** Apps mobile via Tailscale
