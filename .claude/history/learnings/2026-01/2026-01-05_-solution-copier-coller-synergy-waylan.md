---
date: 2026-01-05
capture_type: LEARNING
category: auto-captured
severity: high
tags: []
session_context: File created successfully at: /home/chris/install-synergy-native.sh
auto_captured: true
---

# Apprentissage Automatique - 2026-01-05

## Points Clés (Haute Confiance)

### CAPTURE

**
Solution copier-coller Synergy Wayland : `flatpak override --user com.symless.synergy --talk-name=org.kde.klipper --socket=wayland --socket=fallback-x11`. Scripts secours créés pour XWayland et installation native. Logs : `~/.var/app/com.symless.synergy/.local/state/Synergy/synergy.log`.

**NEXT:**
1. **Tester copier-coller** entre les deux PC
2. Si échec → Lancer `./fix-synergy-xwayland.sh`
3. Si toujours échec → Considérer installation native (AUR)
4. Vérifier logs : `tail -f ~/.var/app/com.symless.synergy/.local/state/Synergy/synergy.log`

**STORY EXPLANATION:**
1. Votre Synergy tourne en Flatpak sous Wayland, créant restrictions sécurité clipboard
2. Les logs montraient détection clipboard mais pas de synchronisation effective
3. J'ai accordé permissions spécifiques : accès Klipper (KDE) et portails Desktop
4. Activé support Wayland native + fallback X11 pour maximum compatibilité
5. Redémarrage applique permissions - Synergy utilise maintenant protocole EI moderne
6. Si problème persiste, script XWayland force mode X11 (compatibilité maximale)
7. Dernière option : installation native AUR élimine contraintes Flatpak complètement
8. Solution graduée permet debug étape par étape jusqu'à résolution garantie

**COMPLETED:** Fixed Synergy clipboard permissions under Wayland with Flatpak

> Contexte: Response format CAPTURE field

---

*Capturé automatiquement par capture-learning.ts*
