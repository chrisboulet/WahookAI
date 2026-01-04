# ReviseChapter Workflow - GrammaireExpert

## Objectif
Révision grammaticale et syntaxique approfondie d'un chapitre spécifique du manuscrit "Écart de Tolérance".

## Input
- Numéro de chapitre (1-30)
- Ou: fichier acte complet (MANUSCRIT_ACTE_X.md)

## Procédure

### 1. Préparation (30 sec)
```bash
# Notification workflow
~/.claude/tools/SkillWorkflowNotification ReviseChapter GrammaireExpert
```

Annoncer:
```
Running the **ReviseChapter** workflow from the **GrammaireExpert** skill...

📖 Révision grammaticale du chapitre [X]
```

### 2. Chargement contexte (1 min)

**Lire dans cet ordre:**
1. Chapitre ciblé dans manuscrit approprié:
   - Ch 1-10: `/home/chris/Documents/EcartDeTolerance/MANUSCRIT_ACTE_1.md`
   - Ch 11-20: `/home/chris/Documents/EcartDeTolerance/MANUSCRIT_ACTE_2.md`
   - Ch 21-30: `/home/chris/Documents/EcartDeTolerance/MANUSCRIT_ACTE_3.md`

2. Style Guide pour contexte voix:
   - `/home/chris/Documents/EcartDeTolerance/STYLE_GUIDE.md`

3. Personnages pour validation dialogues:
   - `/home/chris/Documents/EcartDeTolerance/BIBLE_2_CHARACTERS.md`

### 3. Analyse grammaticale (5-10 min par chapitre)

Scanner le chapitre en cherchant:

#### A. Accords grammaticaux
```regex
Patterns à vérifier:
- Sujet pluriel + verbe singulier (et inverse)
- Participes passés (avoir + COD, être, pronominaux)
- Adjectifs (genre/nombre vs nom qualifié)
- Qui/que/dont (accord avec antécédent)
```

#### B. Conjugaison et temps
```
Vérifier:
- Concordance des temps (flashback = imparfait/plus-que-parfait)
- Subjonctif vs indicatif (bien que, après que, pour que...)
- Passé simple (rare, mais acceptable hard SF)
- Participe présent vs gérondif
```

#### C. Syntaxe
```
Détecter:
- Phrases mal construites (sujet orphelin, verbe manquant)
- Propositions relatives enchâssées (3+ niveaux = lourd)
- Négations incomplètes (ne...pas)
- Constructions ambiguës (double interprétation)
```

#### D. Ponctuation
```
Vérifier:
- Virgules énumération (X, Y et Z) pas (X, Y, et Z)
- Dialogue: — cadratin (pas - trait d'union)
- Guillemets français: « texte » pas "texte"
- Points-virgules (rares mais puissants)
```

#### E. Spécificités québécoises
```
Valider:
- Québécismes en dialogue Armand/Philippe (légitime)
- "Ta yeule, Ori" = signature Armand (max 3-4× roman)
- Représentant vs commercial
- Registre familier dialogue ≠ narration
```

### 4. Classification erreurs

**Critique** (bloque publication):
- Accord sujet-verbe faux
- Temps incohérent (passé/présent mélangés sans raison)
- Syntaxe inintelligible
- Ambiguïté de sens

**Important** (réduit qualité):
- Participe passé mal accordé
- Mode inapproprié (subjonctif manquant/excédentaire)
- Ponctuation confuse
- Négation incomplète systématique

**Suggestion** (amélioration):
- Syntaxe lourde mais correcte
- Ponctuation acceptable mais perfectible
- Formulation maladroite mais compréhensible

### 5. Génération rapport

Utiliser le format standard GrammaireExpert:

```markdown
## RÉVISION GRAMMATICALE — CHAPITRE [X]: [Titre]

### Résumé exécutif
- Erreurs critiques: [N]
- Erreurs importantes: [N]
- Suggestions: [N]
- **Qualité globale**: [Excellent/Bon/Nécessite révision]

### ❌ Erreurs critiques (blocage publication)

| Ligne | Erreur | Type | Correction | Explication |
|-------|--------|------|------------|-------------|
| XXX | [texte fautif] | Accord sujet-verbe | [correction] | [pourquoi] |

### ⚠️ Erreurs importantes (clarté affectée)

[Même format]

### 💡 Suggestions stylistiques (optionnel)

[Améliorations syntaxe sans être erreurs strictes]

### ✅ Québécismes validés

- Ligne XXX: "Ta yeule, Ori" → Signature Armand ✅
- Ligne YYY: "représentant" (pas "commercial") → Québec ✅

### 🤔 Passages ambigus

[Syntaxe créant confusion potentielle]

### ⭐ Ce qui fonctionne bien

[Tournures élégantes, syntaxe maîtrisée]
```

### 6. Validation finale (1 min)

**Checklist:**
- [ ] Toutes les erreurs sont expliquées (pas juste "c'est faux")
- [ ] Distinction claire Critique/Important/Suggestion
- [ ] Québécismes légitimes non signalés comme erreurs
- [ ] Choix stylistiques respectés (phrase nominale, etc.)
- [ ] Références ligne précises (numérotation cat -n)

### 7. Livraison

**Output au user:**
1. Rapport markdown formaté
2. Statistiques: X erreurs sur Y lignes = Z% qualité
3. Recommandation: "Prêt publication" vs "Révision nécessaire"

**Si erreurs critiques:**
```
⚠️ ATTENTION: [N] erreurs critiques bloquent publication.
Recommandation: Corriger avant étape suivante (ReviseurLitteraire).
```

**Si aucune erreur:**
```
✅ EXCELLENT: Aucune erreur grammaticale détectée.
Recommandation: Procéder à révision littéraire (ReviseurLitteraire).
```

## Notes d'implémentation

### Gestion mémoire
- Chapitre typique: ~2,400 mots = ~15,000 tokens
- Bible context: ~5,000 tokens
- Total: ~20,000 tokens confortable pour Sonnet

### Parallélisation
- Pour révision complète (30 chapitres): lancer 3 agents en parallèle
- Agent 1: Acte 1 (Ch 1-10)
- Agent 2: Acte 2 (Ch 11-20)
- Agent 3: Acte 3 (Ch 21-30)
- Temps total: ~45 min vs 2h30 séquentiel

### Exemples de détection

**Accord sujet-verbe:**
```
FAUX: "Les données qu'il a récupéré étaient corrompues."
VRAI: "Les données qu'il a récupérées étaient corrompues."
RAISON: COD "les données" (féminin pluriel) précède le verbe
```

**Concordance des temps:**
```
FAUX (flashback Ch4):
"Armand rentre chez lui. Il ouvre la porte. Lucille est sur le divan."

VRAI (flashback Ch4):
"Armand rentra chez lui. Il ouvrit la porte. Lucille était sur le divan."

RAISON: Flashback 2038 dans narration 2042 = passé simple/imparfait
```

**Québécisme légitime (pas erreur):**
```
TEXTE: "Philippe rencontra le représentant d'AstraCAN."
STATUT: ✅ Correct (français québécois)
NOTE: "commercial" = anglicisme au Québec, "représentant" préféré
```

## Durée estimée
- Chapitre court (2,000 mots): 5-7 min
- Chapitre moyen (2,500 mots): 8-10 min
- Chapitre long (3,000+ mots): 12-15 min

## Success Criteria
- Toutes erreurs grammaticales identifiées
- Chaque correction expliquée clairement
- Québécismes respectés
- Rapport structuré et actionnable
