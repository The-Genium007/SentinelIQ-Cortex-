# SentinelIQ Cortex

Ce projet permet de scraper des articles web, de vérifier leur unicité via leur URL, puis de les insérer dans une base Supabase.

## Fonctionnalités principales

- Scraping d’articles web avec Puppeteer
- Nettoyage du contenu (suppression des retours à la ligne)
- Vérification d’unicité par URL avant insertion
- Insertion dans une table Supabase (structure : id, created_at, url, title, content, date)
- Limitation du nombre de requêtes simultanées (p-limit)
- Logging détaillé dans la console et dans le fichier `scrap.log`

## Prérequis

- Node.js 18+ (ARM64 recommandé sur Mac M1/M2)
- Un projet Supabase avec une table `articles` (voir structure ci-dessous)
- Un fichier `key.env` avec vos clés Supabase :
  ```env
  SUPABASE_URL=...
  SUPABASE_KEY=...
  ```

## Structure de la table `articles`

| Colonne    | Type        | Contraintes                 |
| ---------- | ----------- | --------------------------- |
| id         | int8        | PRIMARY KEY, auto-incrément |
| created_at | timestamptz | DEFAULT now()               |
| url        | text        | UNIQUE                      |
| title      | text        |                             |
| content    | text        |                             |
| date       | date        |                             |

## Utilisation locale

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez le script :
   ```bash
   node scrapArticles.js
   ```

## Utilisation avec Docker (Coolify, etc.)

1. Construisez l’image :
   ```bash
   docker build -t sentineliq-cortex .
   ```
2. Lancez le conteneur (en important vos variables d’environnement) :
   ```bash
   docker run --env-file key.env sentineliq-cortex
   ```

## Personnalisation

- Modifiez la source des URLs à scraper dans `scrapArticles.js` (ligne avec `getUrlArticle()` ou tableau de test).
- Adaptez la limite de requêtes simultanées avec `p-limit`.

## Logs

- Tous les logs sont enregistrés dans le fichier `scrap.log` à la racine du projet.

## Dépendances principales

- [puppeteer](https://pptr.dev/)
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript)
- [p-limit](https://www.npmjs.com/package/p-limit)

---

_Projet développé par Lucas Giza – 2025_
