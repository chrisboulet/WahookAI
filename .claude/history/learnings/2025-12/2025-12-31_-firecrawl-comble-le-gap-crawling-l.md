---
date: 2025-12-31
capture_type: LEARNING
category: auto-captured
severity: high
tags: []
session_context: Todos have been modified successfully. Ensure that you continue to use the todo list to track your p
auto_captured: true
---

# Apprentissage Automatique - 2025-12-31

## Points Clés (Haute Confiance)

### CAPTURE

** Firecrawl comble le gap "crawling + LLM-ready output" absent du stack actuel. Ne remplace pas BrightData mais le complète. Free tier = 0 risque à essayer.

**NEXT:**
1. Créer compte Firecrawl → firecrawl.dev
2. Ajouter à `.mcp.json`:
```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
}
```
3. Mettre à jour le workflow `BrightData/workflows/FourTierScrape.md` pour inclure Firecrawl comme Tier 2

**STORY EXPLANATION:**
1. Tu as déjà un stack solide avec BrightData, Apify et Playwright pour le scraping
2. Mais BrightData est optimisé pour les proxies et le bypass, pas pour l'output AI
3. Firecrawl est né en 2024 chez Y Combinator spécifiquement pour les workflows LLM
4. Sa killer feature: transformer n'importe quel site en markdown propre pour Claude
5. Bonus: il peut crawler des sites entiers, pas juste une page à la fois
6. Le free tier de 500 crédits/mois = zéro risque financier pour tester
7. Stratégie optimale: l'ajouter comme Tier 2, entre WebFetch et Playwright
8. BrightData reste ton arme lourde pour les sites vraiment protégés

**COMPLETED:** Recommande Firecrawl MCP comme complément, pas remplacement.

---

**Sources:**
- [Firecrawl MCP Server GitHub](https://github.com/firecrawl/firecrawl-mcp-server)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing)
- [Firecrawl vs Bright Data Comparison](https://medium.com/@sergey.prusov/the-ultimate-web-scraping-showdown-firecrawl-vs-bright-data-2025-ec9b9d82c7a6)
- [Daniel Miessler's Scraping Stack](https://danielmiessler.com/blog/webscraping-with-brightdata-claude-code)
- [AI Scraping Tools Comparison](https://brightdata.com/blog/ai/firecrawl-alternatives)

> Contexte: Response format CAPTURE field

---

*Capturé automatiquement par capture-learning.ts*
