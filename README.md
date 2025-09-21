# Lootz - Boilerplate e-commerce

Boilerplate de monorepo d'un site e-commerce sur le thème des figurines construite avec Next.js (App Router) pour le frontend et Fastify + Prisma pour le backend. L’authentification est gérée côté frontend avec Supabase. Les flux de paiement (Checkout et Customer Portal) sont assurés via Stripe.

## Sommaire
- [Description du projet](#description-du-projet)
- [Prérequis système](#prérequis-système)
- [Installation](#installation)
- [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
- [Lancer le projet en développement](#lancer-le-projet-en-développement)
- [Commandes disponibles](#commandes-disponibles)
- [Tests](#tests)
- [Dépannage](#dépannage)

## Description du projet
- Frontend: `apps/frontend/` (Next.js App Router, Tailwind CSS)
  - Auth Supabase (email/password + Google OAuth)
  - Store pages: produits, catégories, panier, checkout Stripe
  - Pages d’auth: login, register, forgot/reset password, callback OAuth
- Backend: `apps/backend/` (Fastify, Prisma, Stripe)
  - Routes REST: `products`, `categories`, `billing`, `users`
  - Webhook Stripe (signature vérifiée avec raw body)
  - Accès DB via Prisma
- Monorepo: `turbo.json` + `package.json` à la racine

## Prérequis système
- Node.js 18+
- npm 9+ (ou pnpm/yarn)
- PostgreSQL (si vous utilisez Prisma localement)
- Compte Supabase (Auth + éventuellement Storage)
- Compte Stripe (clés test et webhook secret)

## Installation
```bash
# Cloner le repo
git clone https://github.com/Hamzaidb/repo-saas.git
cd repo-saas

# Installer les dépendances à la racine (Turborepo gère les workspaces)
npm install
```

## Configuration des variables d'environnement
Des exemples sont fournis:
- Racine: `/.env.example`
- Backend: `/apps/backend/.env.example`
- Frontend: `/apps/frontend/ENV_EXAMPLE.txt` (copiez le contenu dans `/apps/frontend/.env`)

Étapes recommandées:
1. Backend
   - Copier `/apps/backend/.env.example` vers `/apps/backend/.env`
   - Renseigner `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `APP_URL`
2. Frontend
   - Créer `/apps/frontend/.env` et coller le contenu de `ENV_EXAMPLE.txt`
   - Renseigner `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_URL`
3. Supabase
   - Dashboard → Auth → URL configuration: `Site URL = http://localhost:3000`
   - Ajouter `http://localhost:3000/auth/callback` dans les Redirect URLs
   - Activer Google Provider (si utilisé) et renseigner Client ID/Secret
4. Stripe
   - Clé publique (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` côté frontend)
   - Clé secrète (`STRIPE_SECRET_KEY` côté backend)
   - Webhook: `http://localhost:3001/webhooks/stripe` + `STRIPE_WEBHOOK_SECRET`

## Lancer le projet en développement
```bash
# Démarrer frontend + backend en parallèle (workspace root)
npm run dev

# ou lancer chaque app séparément
npm run dev --workspace=backend
npm run dev --workspace=frontend
```
- Frontend: http://localhost:3000
- Backend:  http://localhost:3001
- Healthcheck backend: `GET /health`

## Commandes disponibles
Au niveau racine (`package.json`):
- `npm run dev` — lance `dev` en parallèle dans `apps/backend` et `apps/frontend`
- `npm run build` — build des apps
- `npm run lint` — lint des apps

Backend (`apps/backend/`):
- `npm run dev` — lance Fastify en dev (ts-node/tsup selon config)
- `npm run build` — build
- `npm run start` — start en prod (si applicable)

Frontend (`apps/frontend/`):
- `npm run dev` — lance Next.js en dev
- `npm run build` — build Next.js
- `npm run start` — start Next.js en prod

## Tests
- Un plan de tests unitaires est prévu pour les fonctions critiques (ex. transformation de données, services Stripe, validation). Voir `ARCHITECTURE.md` pour la liste des modules à tester et `API.md` pour les contrats REST.
- Suggestion: Jest + ts-jest pour le backend (unit/integration), Playwright/Cypress pour e2e côté frontend.

## Dépannage
- Images produits externes: ajouter le domaine à `apps/frontend/next.config.ts` → `images.remotePatterns`.
- Webhook Stripe: `STRIPE_WEBHOOK_SECRET` requis. S’assurer que `app.ts` préserve le raw body pour `/webhooks/stripe` (déjà fait).
