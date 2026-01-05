---
date: 2026-01-04
capture_type: LEARNING
category: auto-captured
severity: high
tags: [configuration, verification]
session_context: total 32
drwxr-xr-x 2 chris chris 4096 Dec 27 13:05 .
drwxr-xr-x 5 chris chris 4096 Dec 27 13:08 ..

auto_captured: true
---

# Apprentissage Automatique - 2026-01-04

## Points Clés (Haute Confiance)

### CAPTURE

** Audiobook-deploy-kit créé le 27/12/2024 - Système auto-hébergé Audiobookshelf + Libation + AAX converter + MCP server, accessible via Tailscale, avec installation multi-OS automatisée et scripts utilitaires complets. Architecture: disque externe `/mnt/audiobooks/`, 4 services Docker, sécurité par VPN, apps mobiles pour enfants, API pour agents AI.

**NEXT:** 
- Veux-tu qu'on déploie le kit sur un serveur?
- Besoin de modifications ou améliorations?
- Tu veux revoir la configuration de certains services?
- On pourrait aussi créer une version du MCP server pour l'intégrer directement à ton setup PAI

**STORY EXPLANATION:**
1. Tu m'as demandé de créer un kit pour auto-héberger tes audiobooks Audible
2. On a conçu une architecture Tailscale (VPN privé, zéro config réseau complexe)
3. On a choisi Audiobookshelf comme serveur de streaming (apps mobiles excellentes)
4. On a intégré Libation en mode headless pour synchroniser automatiquement ta bibliothèque Audible
5. On a créé un service AAX converter pour convertir automatiquement les fichiers propriétaires
6. On a ajouté un MCP server pour permettre à Claude d'accéder à ta bibliothèque
7. On a développé un installeur multi-OS intelligent et des scripts utilitaires (backup, health-check, etc.)
8. Le résultat: un kit clé-en-main pour un serveur audiobook familial sécurisé et accessible partout

**COMPLETED:** Retrieved audiobook deployment kit with complete architecture and documentation

`★ Insight ─────────────────────────────────────`
**Architecture VPN-First**: Le choix Tailscale élimine complètement la complexité du reverse-proxy, SSL, DNS dynamique, et port-forwarding. Les enfants se connectent comme si le serveur était sur leur réseau local, même en 4G.

**Libation Headless**: Libation peut tourner sans interface graphique (mode CLI) dans Docker, synchronisant automatiquement avec Audible selon un schedule. Le service AAX converter surveille le répertoire `raw/` et convertit automatiquement.

**MCP Server Custom**: Le service expose l'API d'Audiobookshelf dans un format compatible MCP, permettant à Claude de répondre à des questions comme "Quels audiobooks j'ai de Brandon Sanderson?" ou "Recommande-moi quelque chose pour un road trip".
`─────────────────────────────────────────────────`

Tu veux qu'on travaille dessus aujourd'hui?

> Contexte: Response format CAPTURE field

---

*Capturé automatiquement par capture-learning.ts*
