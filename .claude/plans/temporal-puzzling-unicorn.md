# Plan: Extraction 3D Printing Tracker vers Repo Independant

**Objectif**: Separer le systeme 3D printing d'UltraCTO-OS en repo standalone
**Contrainte**: Partager la meme instance Supabase (ucto-crm)
**Resultat**: Projet independant utilisable sans UltraCTO-OS

---

## Architecture Cible

```
~/3d-printing-tracker/              # Nouveau repo
├── scripts/
│   ├── supabase_config.py          # Config Supabase (copie modifiee)
│   ├── print_tracker.py            # CLI principal
│   └── import_stl_library.py       # Import STL (deja fait)
├── sql/
│   └── schema.sql                  # Reference schema (deja deploye)
├── docs/
│   ├── USAGE.md                    # Guide commandes
│   └── market-research/            # Analyses marche QC
├── .env.local                      # Credentials Supabase
├── .env.local.example              # Template sans secrets
├── requirements.txt                # supabase + python-dotenv
├── .gitignore
└── README.md

~/3D-Printing-Business/             # STL Library (reste en place)
└── [3,722 fichiers organises]
```

---

## Fichiers a Extraire

| Source (UltraCTO-OS) | Destination | Modifications |
|----------------------|-------------|---------------|
| `scripts/supabase_config.py` | `scripts/supabase_config.py` | Chemin .env.local |
| `scripts/print_tracker.py` | `scripts/print_tracker.py` | Aucune |
| `scripts/import_stl_library.py` | `scripts/import_stl_library.py` | Path configurable |
| `sql/3d_printing_tables.sql` | `sql/schema.sql` | Reference only |
| `.claude/commands/print.md` | `docs/USAGE.md` | Adapter format |

---

## Modifications Requises

### 1. supabase_config.py
```python
# AVANT (UltraCTO-OS):
env_file = Path(__file__).parent.parent / '.env.local'

# APRES (standalone):
env_file = Path(__file__).parent.parent / '.env.local'
# ou
env_file = Path(os.getenv('ENV_FILE', str(Path(__file__).parent.parent / '.env.local')))
```
**Note**: Structure identique = pas de changement necessaire.

### 2. import_stl_library.py
```python
# AVANT:
STL_LIBRARY_PATH = Path('/home/chris/3D-Printing-Business')

# APRES:
STL_LIBRARY_PATH = Path(os.getenv(
    'STL_LIBRARY_PATH',
    str(Path.home() / '3D-Printing-Business')
))
```

---

## Etapes d'Implementation

### Etape 1: Creer structure repo (2 min)
```bash
mkdir -p ~/3d-printing-tracker/{scripts,sql,docs/market-research}
cd ~/3d-printing-tracker
git init
```

### Etape 2: Copier fichiers core (2 min)
```bash
cp ~/UltraCTO-OS/scripts/supabase_config.py scripts/
cp ~/UltraCTO-OS/scripts/print_tracker.py scripts/
cp ~/UltraCTO-OS/scripts/import_stl_library.py scripts/
cp ~/UltraCTO-OS/sql/3d_printing_tables.sql sql/schema.sql
```

### Etape 3: Copier documentation (1 min)
```bash
cp ~/UltraCTO-OS/.claude/commands/print.md docs/USAGE.md
cp ~/UltraCTO-OS/history/research/2025-12/3d-printing-*.md docs/market-research/
```

### Etape 4: Creer fichiers config (3 min)

**requirements.txt:**
```
supabase>=2.0.0
python-dotenv>=1.0.0
```

**.env.local.example:**
```bash
# Supabase (meme instance que UltraCTO-OS)
SUPABASE_URL=https://jxxpriwvvpzlcolfjkri.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_USER_ID=your_user_uuid

# STL Library (optionnel, default: ~/3D-Printing-Business)
# STL_LIBRARY_PATH=/custom/path/to/stl/library
```

**.gitignore:**
```
.env.local
__pycache__/
*.pyc
.venv/
```

### Etape 5: Modifier import_stl_library.py (1 min)
Rendre le chemin STL configurable via env var.

### Etape 6: Creer README.md (2 min)
Documentation setup et usage.

### Etape 7: Copier .env.local (1 min)
```bash
cp ~/UltraCTO-OS/.env.local .env.local
# Extraire seulement les vars Supabase
```

### Etape 8: Tester (2 min)
```bash
cd ~/3d-printing-tracker
python scripts/print_tracker.py stats
python scripts/print_tracker.py models --limit 3
```

### Etape 9: Cleanup UltraCTO-OS (optionnel)
Supprimer fichiers 3D printing d'UltraCTO-OS apres validation.

---

## Partage Supabase

**Tables partagees** (dans ucto-crm):
- `stl_models` - 3,722 fichiers indexes
- `print_jobs` - Logs impression
- `sales` - Ventes

**Isolation**: Par `user_id` (RLS policies)

**Avantage**: Une seule source de verite, pas de sync a gerer.

---

## Fichiers a Creer

| Fichier | Contenu |
|---------|---------|
| `README.md` | Setup + usage + architecture |
| `requirements.txt` | Dependencies Python |
| `.env.local.example` | Template credentials |
| `.gitignore` | Exclure .env.local et __pycache__ |

---

## Validation

- [ ] `python scripts/print_tracker.py stats` fonctionne
- [ ] `python scripts/print_tracker.py models` liste les modeles
- [ ] Pas d'import UltraCTO-OS dans les scripts
- [ ] .env.local separe mais memes credentials Supabase

---

## Temps Total Estime: 15 minutes
