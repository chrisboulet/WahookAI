# PolishChapter Workflow - ReviseurLitteraire

## Objectif
Polissage littéraire approfondi d'un chapitre: style, rythme, répétitions, fluidité.

## Input
- Numéro de chapitre (1-30)
- Ou: fichier acte complet (MANUSCRIT_ACTE_X.md)
- **Prérequis**: Grammaire déjà corrigée (GrammaireExpert passé)

## Procédure

### 1. Préparation (30 sec)
```bash
# Notification workflow
~/.claude/tools/SkillWorkflowNotification PolishChapter ReviseurLitteraire
```

Annoncer:
```
Running the **PolishChapter** workflow from the **ReviseurLitteraire** skill...

✨ Polissage littéraire du chapitre [X]
```

### 2. Chargement contexte (1 min)

**Lire dans cet ordre:**
1. Chapitre ciblé:
   - Ch 1-10: `/home/chris/Documents/EcartDeTolerance/MANUSCRIT_ACTE_1.md`
   - Ch 11-20: `/home/chris/Documents/EcartDeTolerance/MANUSCRIT_ACTE_2.md`
   - Ch 21-30: `/home/chris/Documents/EcartDeTolerance/MANUSCRIT_ACTE_3.md`

2. Style Guide (essentiel pour voix):
   - `/home/chris/Documents/EcartDeTolerance/STYLE_GUIDE.md`

3. Personnages (voix distinctives):
   - `/home/chris/Documents/EcartDeTolerance/BIBLE_2_CHARACTERS.md`

### 3. Analyse littéraire multi-passes

#### PASSE 1: Détection répétitions (2-3 min)

**A. Mots répétés:**
```python
# Algorithme mental:
Pour chaque mot significatif (>4 lettres, pas mot-outil):
  - Compter occurrences dans fenêtre 50 mots
  - Si ≥3 occurrences: SIGNALER
  - Si distance <20 mots: SIGNALER (trop proche)
  - Exception: termes techniques irremplaçables
```

**Exemples à détecter:**
```
"Armand regarda le connecteur. Klaus regarda les données.
Sofia regarda le schéma."
→ "regarda" 3× en 15 mots = RÉPÉTITION

"Le système était complexe. Le connecteur était incompatible.
La situation était critique."
→ "était" 3× en 12 mots (acceptable verbe être) mais pattern "X était Y" répété = LOURDEUR STRUCTURE
```

**B. Structures syntaxiques répétées:**
```
Détecter patterns:
- "Il + verbe" consécutifs (Il ouvrit. Il regarda. Il prit.)
- Subordonnées similaires (qui...qui...qui / quand...quand...)
- Constructions passives successives
```

**C. Images/métaphores recyclées:**
```
Scanner:
- Même comparaison 2× ("comme une pierre", "tel un...")
- Même métaphore proche ("cœur serré" × 2)
- Champ lexical saturé (10× "rouge/rougeâtre/rougi" en 1 page)
```

#### PASSE 2: Analyse rythme (3-4 min)

**A. Variation longueur phrases:**
```
Calculer pour le chapitre:
- Longueur moyenne phrase
- Écart-type (variation)
- Plages monotones (10+ phrases ±2 mots même longueur)

Cibles santé:
- Moyenne: 15-25 mots/phrase (hard SF)
- Écart-type: >8 (variation suffisante)
- Monotonie: <5% du chapitre
```

**B. Tempo narratif:**
```
Identifier zones:
- Action (phrases courtes 8-15 mots) → Doit accélérer
- Réflexion (phrases longues 25-40 mots) → Peut ralentir
- Description (moyennes 18-25 mots) → Équilibré

Vérifier cohérence:
- Scène action = tempo rapide? ✅
- Scène introspection = tempo lent OK? ✅
- Transition = variation? ✅
```

**C. Structures syntaxiques:**
```
Évaluer diversité:
- Début phrase: Sujet / Complément / Verbe / Adverbe (varier!)
- Complexité: Simple / Complexe / Composée (alterner!)
- Phrase nominale: Utilisée judicieusement? (max 10% chapitre)
```

#### PASSE 3: Lourdeurs syntaxiques (3-4 min)

**A. Constructions faibles:**
```regex
Détecter patterns:
- "Il y a" → Souvent remplaçable par verbe fort
- "C'est...qui/que" → Construction emphatique sur-utilisée?
- "Commencer à", "se mettre à" → Action directe meilleure
- "Faire", "mettre", "avoir" → Verbe générique vs précis?
```

**Exemples transformations:**
```
AVANT: "Il y avait un connecteur sur la table."
APRÈS: "Un connecteur reposait sur la table."

AVANT: "C'est Armand qui a découvert le problème."
APRÈS: "Armand découvrit le problème."

AVANT: "Il commença à analyser les données."
APRÈS: "Il analysa les données."
```

**B. Adverbes excessifs:**
```
Scanner adverbes -ment:
- Compter densité: adverbes/1000 mots
- Cible: <15/1000 (hard SF peut tolérer 20 si technique)
- Identifier intensificateurs redondants (très/vraiment/absolument)
```

**C. Passif vs actif:**
```
Compter constructions passives:
- "Le connecteur fut inspecté par Armand" vs "Armand inspecta le connecteur"
- Passif acceptable: sujet vrai inconnu ou peu important
- Passif excessif: >10% phrases = prose molle
```

#### PASSE 4: Choix lexicaux (2-3 min)

**A. Précision:**
```
Vérifier:
- Verbe générique → Verbe spécifique
  ("bouger" → "glisser/rouler/basculer")
- Nom vague → Nom précis
  ("machine" → "servo-mécanisme" si approprié contexte)
- Adjectif banal → Adjectif évocateur
  ("grand" → "imposant/massif/titanesque" selon contexte)
```

**B. Clichés:**
```
Détecter expressions toutes faites:
- "Blanc comme neige" (cliché)
- "Noir comme la nuit" (cliché)
- "Rapide comme l'éclair" (cliché SF spatial)

Proposer alternatives fraîches ou élimination.
```

**C. Cohérence terminologique:**
```
Vérifier un objet = un nom:
- "Le connecteur" → toujours "connecteur" (pas "pièce", "élément", "composant" aléatoire)
- Exceptions: variation intentionnelle pour éviter répétition
```

#### PASSE 5: Dialogues (si applicable) (2 min)

**A. Naturalité:**
```
Vérifier:
- Interruptions/hésitations présentes? (naturel)
- Phrases complètes parfaites? (irréaliste)
- Sous-texte: non-dit > dit explicitement?
```

**B. Attribution:**
```
Équilibre:
- Trop de tags ("dit-il" × 10) = lourd
- Pas assez = confusion qui parle
- Action intercalée > tag répétitif
```

**C. Voix distinctes (via BIBLE_2):**
```
Valider:
- ORACLE: Sarcastique, précis, chiffres ✅
- Armand: Québécois, émotionnel retenu ✅
- Philippe: Méthodique, introspectif ✅
```

### 4. Génération rapport

Format standard ReviseurLitteraire:

```markdown
## RÉVISION LITTÉRAIRE — CHAPITRE [X]: [Titre]

### Impression générale
**Qualité prose**: [Excellent / Bon / Nécessite polissage]

[2-3 phrases: ton général, forces, axes amélioration]

### 🔁 Répétitions détectées

**Mots sur-utilisés:**
| Mot | Occurrences | Distance min | Alternatives suggérées |
|-----|-------------|--------------|------------------------|
| regarda | 12× | 8 mots | examina, scrutait, fixait, observait |

**Structures répétées:**
- Lignes XXX-YYY: Débuts "Il + verbe" 7× consécutifs → Varier
- Lignes ZZZ: Pattern "était + adjectif" 4× proche → Restructurer

**Images recyclées:**
- "Cœur serré" apparaît lignes XXX et YYY (45 mots distance)

### 🎵 Analyse du rythme

**Statistiques:**
- Moyenne: 22 mots/phrase ✅
- Écart-type: 11 (variation excellente) ✅
- Monotonie: 3% du chapitre ✅

**Tempo narratif:**
- Lignes XXX-YYY (scène action): Phrases courtes 12-18 mots ✅ Rythme adéquat
- Lignes ZZZ (introspection): Phrases longues 28-35 mots ✅ Ralentissement intentionnel
- Transition ligne AAA: Rupture rythme efficace ✅

### ⚖️ Lourdeurs syntaxiques

| Ligne | Passage lourd | Type | Suggestion allégée |
|-------|---------------|------|---------------------|
| XXX | "Il y avait trois connecteurs" | Il y a | "Trois connecteurs reposaient..." |
| YYY | "commença à analyser" | Périphrase | "analysa" |

**Densité adverbes**: 18/1000 mots (acceptable hard SF) ⚠️
**Passif**: 8% phrases (bon équilibre) ✅

### 💎 Choix lexicaux

**À préciser:**
- Ligne XXX: "machine" → "servo-mécanisme" (contexte technique)
- Ligne YYY: "bouger" → "pivoter" (mouvement spécifique)

**Clichés détectés:**
- Ligne ZZZ: "noir comme la nuit" → Éliminer ou reformuler

**Cohérence terminologique:**
✅ "Connecteur" utilisé consistemment (pas alternance aléatoire)

### 💬 Dialogues

**Naturalité**: ✅ Excellente (interruptions, ellipses présentes)
**Attribution**: ⚠️ Tags "dit-il" 7× consécutifs lignes XXX-YYY → Intercaler action
**Voix**: ✅ ORACLE sarcastique authentique, Armand québécois naturel

### ✨ Ce qui brille

- Ligne XXX: Métaphore Mars/solitude exceptionnellement évocatrice
- Lignes YYY-ZZZ: Variation rythmique parfaite (8 → 24 → 12 mots)
- Ligne AAA: Tournure "L'aube martienne..." élégante et précise

### 🎯 Recommandations prioritaires

1. **IMPORTANT**: Réduire répétition "regarda" (12× → 6×)
2. **IMPORTANT**: Varier débuts phrases lignes XXX-YYY
3. **SUGGESTION**: Alléger 3 constructions "Il y a"
4. **SUGGESTION**: Remplacer cliché ligne ZZZ

**Score fluidité global**: 82/100 ✅ (Très bon, publication-ready après ajustements)
```

### 5. Métriques quantitatives

Calculer et rapporter:
```python
# Métriques clés
taux_repetition = mots_uniques / mots_totaux  # Cible: >0.60
variation_rythme = ecart_type_longueur_phrases  # Cible: >8
densite_adverbes = adverbes_ment / (mots_totaux / 1000)  # Cible: <15
ratio_passif = phrases_passives / phrases_totales  # Cible: <0.10
score_fluidite = formule_combinee  # 0-100

# Rapport final
if score_fluidite >= 80:
    verdict = "Excellent - Publication ready"
elif score_fluidite >= 65:
    verdict = "Bon - Polissage mineur recommandé"
else:
    verdict = "Nécessite révision approfondie"
```

### 6. Validation finale (1 min)

**Checklist:**
- [ ] Répétitions documentées avec alternatives
- [ ] Analyse rythme quantifiée (pas juste "ça coule")
- [ ] Lourdeurs identifiées avec réécriture suggérée
- [ ] Voix de l'auteur respectée (pas réécrit dans autre style)
- [ ] Distinction claire Important vs Suggestion
- [ ] Passages brillants soulignés (feedback positif)

### 7. Livraison

**Output au user:**
1. Rapport markdown formaté complet
2. Score fluidité: X/100 avec verdict
3. Top 3 actions prioritaires

**Si score <65:**
```
⚠️ ATTENTION: Qualité prose nécessite polissage avant publication.
Recommandation: Appliquer corrections prioritaires, relancer PolishChapter.
```

**Si score ≥80:**
```
✅ EXCELLENT: Prose publication-ready.
Recommandation: Validation finale AsimovReviewer (cohérence narrative).
```

## Notes d'implémentation

### Exemples détection automatique

**Répétition mot:**
```python
# Pseudo-code mental
words = extract_significant_words(chapter)
for word in words:
    occurrences = find_all_positions(word)
    if len(occurrences) >= 3:
        distances = calculate_distances(occurrences)
        if min(distances) < 50:  # mots entre occurrences
            flag_repetition(word, occurrences, distances)
```

**Variation rythme:**
```python
sentences = split_into_sentences(chapter)
lengths = [count_words(s) for s in sentences]
mean = average(lengths)  # Ex: 22 mots
std_dev = std_deviation(lengths)  # Ex: 11 mots

if std_dev < 5:
    flag_monotony("Rythme uniforme - varier longueur phrases")
```

### Parallélisation

Pour révision complète manuscrit:
```bash
# Lancer 3 agents ReviseurLitteraire en parallèle
Agent 1: PolishChapter ACTE_1 (Ch 1-10)
Agent 2: PolishChapter ACTE_2 (Ch 11-20)
Agent 3: PolishChapter ACTE_3 (Ch 21-30)

Durée: ~60 min vs 3h séquentiel (3× plus rapide)
```

## Durée estimée
- Chapitre court (2,000 mots): 10-12 min
- Chapitre moyen (2,500 mots): 12-15 min
- Chapitre long (3,000+ mots): 15-20 min

## Success Criteria
- Toutes répétitions significatives identifiées
- Rythme analysé quantitativement
- Lourdeurs avec alternatives concrètes
- Score fluidité calculé et justifié
- Rapport actionnable (pas juste "c'est bien/pas bien")
