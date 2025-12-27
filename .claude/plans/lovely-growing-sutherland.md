# Plan: Yarn Swift avec Manivelle en Bas (Dual-Purpose)

## Objectif
Créer un yarn swift 3D printable avec une manivelle en bas permettant:
1. **Mode passif (swift):** Dérouler un skein → cake (tourne librement)
2. **Mode actif (skein winder):** Rembobiner en hank/tresse (avec manivelle)

## Analyse du Marché
- **Knitter's Pride Natural:** $100-145 CAD (manivelle en HAUT)
- **Notre design:** ~$70-90 CAD avec manivelle en BAS (meilleure ergonomie)
- **Coût production:** ~$15 (1kg filament + 2x 608 bearings)
- **Marge:** 4-6x

## Architecture du Design

### Composants Principaux

```
        ╱ ╲  ← Bras umbrella (12-24 bras)
       ╱   ╲
      ╱     ╲
     ════════════  ← Mécanisme expansion (collet)
          │
          │ (axe central - tourne sur 608 bearing)
          │
    ┌─────┴─────┐
    │  CLAMP    │ ← Fixation table (jusqu'à 1.5")
    └─────┬─────┘
          │
       [GEAR] ← Engrenage récepteur (grande roue)
          │
      [CRANK] ← Manivelle avec petit engrenage + 608 bearing
```

### Mécanisme de Rotation

**Option recommandée: Engrenages Spur 1:2 ou 1:3**
- Petite roue (manivelle): 20 dents
- Grande roue (axe): 40-60 dents
- Module: 2.0mm
- Avantage: 1 tour de manivelle = 2-3 tours du swift

**Bearings requis:**
- 2x 608 bearings (22x8x7mm) - standard skateboard
- 1 pour l'axe central
- 1 pour la manivelle

### Mécanisme Umbrella/Collapse

**Basé sur le design "Amish Style" avec collet:**
- Vis centrale M5 pour expansion/collapse
- 12 bras (ou 6 paires jointes)
- Circonférence ajustable: 45-60 pouces

## Approche de Développement

### Phase 1: Base Rotative avec Crank (Priorité)
1. Designer le clamp de table avec bearing intégré
2. Créer le système d'engrenages 1:2
3. Ajouter la manivelle ergonomique
4. Tester la rotation fluide

### Phase 2: Mécanisme Umbrella
1. Adapter le design Amish Style existant
2. Connecter à l'axe rotatif
3. Implémenter le système de collapse

### Phase 3: Intégration & Test
1. Assembler les deux systèmes
2. Tester avec vrai fil (ta femme!)
3. Itérer selon feedback

## Stack Technique

- **CAD:** OpenSCAD (paramétrique, installé)
- **Gears:** Générateur d'engrenages OpenSCAD (MCAD library ou custom)
- **Bearings:** 608 (22x8x7mm) - tolérance housing +0.2mm
- **Hardware minimal:**
  - 2x 608 bearings (~$2)
  - 1x M5x40 bolt + nut
  - 1x M5x20 bolt + nut

## Fichiers à Créer

```
~/3d-printing-tracker/designs/yarn-swift-crank/
├── yarn_swift_crank.scad      # Design principal paramétrique
├── parts/
│   ├── clamp_base.scad        # Clamp de table
│   ├── gear_system.scad       # Engrenages + manivelle
│   ├── central_axis.scad      # Axe avec bearing
│   └── umbrella_arms.scad     # Bras collapsibles
├── libs/
│   └── gears.scad             # Librairie engrenages
└── exports/
    └── *.stl                  # Fichiers pour impression
```

## Paramètres Configurables (OpenSCAD)

```scad
// Dimensions principales
swift_diameter = 150;        // mm - diamètre max déployé (en cm: 60" circ)
arm_count = 12;              // nombre de bras
collapse_ratio = 0.4;        // ratio replié

// Engrenages
gear_ratio = 2;              // 1:2 multiplication
gear_module = 2.0;           // mm
pinion_teeth = 20;
gear_teeth = pinion_teeth * gear_ratio;

// Bearings
bearing_od = 22;             // 608 outer diameter
bearing_id = 8;              // 608 inner diameter
bearing_width = 7;           // 608 width
bearing_tolerance = 0.2;     // mm clearance

// Clamp
clamp_max_thickness = 40;    // mm (1.5")
clamp_opening = 50;          // mm
```

## Risques & Mitigations

| Risque | Mitigation |
|--------|------------|
| Engrenages qui sautent | Module 2.0+, test de mesh avant assemblage |
| Bearing trop serré/lâche | Imprimer pièce test de tolérance d'abord |
| Bras qui cassent | PETG au lieu de PLA pour les bras |
| Trop de friction | Graisser les bearings, smooth surfaces |

## Paramètres Confirmés

- **Gear ratio:** 1:2 (20 dents → 40 dents)
- **Approche:** Incrémentale (Phase 1 = base + crank, puis Phase 2 = umbrella)
- **Bearings:** 608 disponibles (2x requis)
- **Diamètre swift:** Standard 60" circonférence (~19" diamètre)
- **Clamp:** Standard 1.5" max thickness

## Phase 1: Implémentation Immédiate

### Fichiers à créer:

```
~/3d-printing-tracker/designs/yarn-swift-crank/
├── yarn_swift_base.scad       # Design principal Phase 1
├── libs/
│   └── gears.scad             # Librairie engrenages (MCAD ou custom)
└── exports/
    ├── clamp_base.stl
    ├── gear_large.stl         # 40 dents (axe)
    ├── gear_small.stl         # 20 dents (manivelle)
    ├── crank_handle.stl
    └── axle_tube.stl
```

### Composants Phase 1:
1. **Clamp base** - fixation table avec logement bearing 608
2. **Axle tube** - tube central avec bearing 608 en bas
3. **Large gear (40t)** - fixé sur l'axle
4. **Small gear (20t)** - sur l'axe de la manivelle
5. **Crank handle** - manivelle ergonomique

### Dimensions clés:
- Bearing 608: OD=22mm, ID=8mm, W=7mm
- Gear module: 2.0mm
- Clamp opening: 50mm (pour tables jusqu'à 40mm)
- Axle diameter: 8mm (pour bearing ID)

## Prochaines Actions

1. [x] Confirmer les paramètres avec l'utilisateur
2. [ ] Créer la structure de fichiers
3. [ ] Coder yarn_swift_base.scad avec:
   - Clamp de table paramétrique
   - Système d'engrenages 1:2
   - Logements pour 608 bearings
   - Manivelle ergonomique
4. [ ] Générer les STL pour impression test
5. [ ] Imprimer et tester la rotation
6. [ ] Phase 2: Ajouter mécanisme umbrella
