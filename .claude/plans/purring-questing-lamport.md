# Plan: Écran Prévisions 90 Jours

## Résumé

Créer un écran PyQt6 affichant les prévisions de ventes sur 90 jours avec:
- **Vue**: Tableau + Graphique matplotlib
- **Granularité**: Par produit global (agrégé tous entrepôts)
- **Algorithmes**: Moyennes mobiles 13 semaines ET Prophet ML comparés côte à côte

---

## Fichiers à Créer

### 1. `app/business/prevision_service.py`
Service de calcul des prévisions avec:

```python
class PrevisionService:
    def get_historical_sales(id_produit, nb_jours=91) -> list[dict]
    def calculer_moyennes_mobiles_90j(id_produit, date_debut) -> list[dict]
    def calculer_prophet_90j(id_produit, date_debut) -> list[dict]
    def generer_previsions_comparaison(id_produit, date_debut) -> dict
    def get_all_produits_actifs() -> list[dict]
    def exporter_previsions_excel(data, filepath) -> str
```

**Données retournées**:
- Prévisions: `{date, prevision_faible, prevision_moyenne, prevision_forte, algorithme}`
- KPIs: `{total_ma_moyen, total_prophet_moyen, ecart_pourcent, pic_journalier}`

### 2. `app/ui/widgets/matplotlib_widget.py`
Widget matplotlib réutilisable avec thème Bergeron:

```python
class MatplotlibWidget(FigureCanvasQTAgg):
    def plot_dual_forecast(dates, ma_data, prophet_data, produit_nom)
```

- Fond sombre (`BG_PRIMARY`)
- Lignes: Or (MA) vs Vert (Prophet)
- Bandes de confiance semi-transparentes
- Légende intégrée

### 3. `app/ui/prevision_window.py`
Écran principal:

```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar: [Date] [Produit ▼] [Algorithme ▼] [Calculer] [Export] │
├─────────────────────────────────────────────────────────────┤
│ KPIs: [Total MA] [Total Prophet] [Écart %] [Pic Max]        │
├─────────────────────────────────────────────────────────────┤
│ Graphique Matplotlib (60% hauteur)                          │
├─────────────────────────────────────────────────────────────┤
│ Tableau 90 lignes - Date|Jour|MA(3)|Prophet(3)|Écart%       │
└─────────────────────────────────────────────────────────────┘
```

---

## Fichiers à Modifier

### `app/ui/main_window.py`
5 modifications:
1. Import: `from app.ui.prevision_window import PrevisionWindow`
2. Bouton nav: `self.btn_previsions = self.create_nav_btn(Icons.CHART, "Prévisions 90j")`
3. Layout sidebar: `sidebar_layout.addWidget(self.btn_previsions)`
4. Page: `self.page_previsions = PrevisionWindow(); self.stacked_widget.addWidget(...)`
5. Connect: `self.btn_previsions.clicked.connect(lambda: self.switch_page(7, "Prévisions"))`

---

## Algorithmes

### Moyennes Mobiles (adapté de forecasting_service.py)
1. Récupérer 13 semaines d'historique
2. Grouper par jour de semaine (0-6)
3. Calculer percentiles P25/P50/P75 par jour
4. Mapper les 90 jours futurs sur leurs prévisions jour-de-semaine

### Prophet ML
1. Préparer DataFrame avec colonnes `ds` (date) et `y` (ventes)
2. Configurer: `daily_seasonality=True, weekly_seasonality=True`
3. Entraîner modèle sur historique
4. Prédire 90 jours avec intervalles de confiance 80%

---

## Séquence d'Implémentation

| Étape | Fichier | Durée |
|-------|---------|-------|
| 1 | `prevision_service.py` - Historique + MA | 1h |
| 2 | `prevision_service.py` - Prophet | 1h |
| 3 | `matplotlib_widget.py` | 30min |
| 4 | `prevision_window.py` - UI | 1.5h |
| 5 | `main_window.py` - Navigation | 15min |
| 6 | Tests unitaires | 1h |
| 7 | Export Excel | 30min |

**Total estimé**: ~6 heures

---

## Dépendances

Déjà dans `requirements.txt`:
- `prophet==1.1.5`
- `matplotlib==3.8.2`
- `pandas==2.1.4`
- `openpyxl==3.1.2`

---

## Points d'Attention

1. **Performance Prophet**: Afficher indicateur de chargement pendant l'entraînement (5-30s)
2. **Données insuffisantes**: Alerter si < 13 semaines d'historique
3. **Dates manquantes**: Forward-fill pour Prophet, 0 pour jours sans ventes
4. **Thème matplotlib**: Forcer fond sombre via `figure.patch.set_facecolor()`

---

## Fichiers de Référence

- `costco_unified/services/forecasting_service.py` - Logique MA/percentiles
- `app/ui/generation_commandes.py` - Patterns UI (toolbar, KPIs, table)
- `app/ui/theme.py` - Constantes couleurs Bergeron
- `app/business/capacity_service.py` - Pattern service standard
