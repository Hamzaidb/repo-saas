# Architecture

Ce document décrit les choix techniques, l’architecture logicielle et les principaux flux (authentification, données, paiement) du projet.

## Périmètre
- Frontend: `apps/frontend/` — Next.js (App Router), Tailwind CSS, Supabase Auth
- Backend: `apps/backend/` — Fastify, Prisma (PostgreSQL), Stripe, Zod
- Monorepo: Turborepo (scripts partagés via root `package.json`)

## Choix techniques
- **Next.js (App Router)**: Server/Client Components, structure /app, performances et DX.
- **Supabase Auth**: gestion des sessions côté navigateur (email/password, OAuth Google). Simplicité d’intégration pour le frontend et compatibilité avec RLS si DB Supabase utilisée.
- **Fastify**: serveur Node rapide, système de plugins, intégration simple de Prisma et Stripe, schemas Zod côté validation.
- **Prisma**: accès aux données typé, migrations, DX.
- **Stripe**: Checkout (payment/subscription) et Customer Portal. Webhook vérifié via signature et body brut.
- **Tailwind CSS**: productivité UI.
- **Zod**: validation d’entrées et des variables d’environnement (`apps/backend/src/config/env.ts`).

## Structure des dossiers
- `apps/frontend/`
  - `src/app/` pages (App Router): `login`, `register`, `forgot-password`, `reset-password`, `auth/callback`, `dashboard`, `products`, etc.
  - `src/contexts/AuthContext.tsx` — gestion de session Supabase côté client
  - `src/lib/stripe.ts` — démarrage de Checkout côté client
  - `public/` — assets statiques (background, placeholder)
- `apps/backend/`
  - `src/app.ts` — build Fastify, parsers (JSON + raw Stripe)
  - `src/routes/` — routes REST (`products`, `categories`, `billing`, `users`)
  - `src/plugins/` — `prisma` et `cors`
  - `src/config/env.ts` — validation `.env` avec Zod
  - `src/lib/stripe.ts` — client Stripe serveur

## Flux d’authentification (Supabase)
1. **Login email/password**: `supabase.auth.signInWithPassword()` depuis `apps/frontend/src/app/login/page.tsx`. La session est stockée par `supabase-js` (persistante). 
2. **OAuth Google**: `signInWithOAuth({ provider: 'google', redirectTo: '/auth/callback' })`. À l’arrivée, `/auth/callback` vérifie la session et redirige vers `/dashboard` => pas encore au point
3. **Mot de passe oublié**: `/forgot-password` appelle `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })`. `/reset-password` permet de définir un nouveau mot de passe via `supabase.auth.updateUser({ password })`.
4. **Protection routes**: `apps/frontend/src/app/dashboard/layout.tsx` redirige vers `/login` si pas authentifié.

## Flux de données (produits, catégories)
- Frontend appelle le backend via `NEXT_PUBLIC_API_URL`.
- Backend `products` et `categories` interrogent Prisma et normalisent les champs (prix `Decimal` → `number`, dates → ISO string) avant de renvoyer `JSON`.

## Flux de paiement (Stripe)
- Frontend utilise `startCheckout()` (`apps/frontend/src/lib/stripe.ts`) → `POST {API}/billing/create-checkout-session`.
- Backend compose des `line_items` depuis la base et renvoie l’URL `session.url`.
- Webhook `/webhooks/stripe` (body brut + vérification signature) permet de traiter `checkout.session.completed`, factures, abonnements. À compléter pour persister statut/commande.

## Sécurité
- **CORS**: plugin `@fastify/cors` (`apps/backend/src/plugins/cors.ts`) avec liste d’origines autorisées.
- **.env + validation**: `apps/backend/src/config/env.ts` (Zod) assure la présence de `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, etc.
- **Validation des entrées**: Zod sur certaines routes (`products` params, `users` payload) => À étendre.
- **Stripe webhook**: Raw body + signature.


## Évolutions futures
- RLS Supabase + tables alignées (si migration complète vers DB Supabase) ou unifier l’auth côté backend.
- Admin UI pour produits, upload d’images (Supabase Storage).
- Rate limiting, audit logs, observabilité (pino transport, OpenTelemetry).
