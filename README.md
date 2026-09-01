# ScamWatch

Registre public de signalements de sites suspectés de fraude. Aucun compte
utilisateur : n'importe qui peut consulter ou publier un signalement. Chaque
signalement est modéré automatiquement par l'API Claude (Anthropic) avant
publication. Un site atteignant **100 signalements approuvés** passe
automatiquement au statut **confirmé**.

Stack : Next.js 14 (App Router) · Firebase Admin / Firestore · API Claude
(modération) · Brevo (email) · déploiement Vercel.

## ⚠️ Avant toute chose : sécurité

Le token GitHub que tu as collé dans le chat doit être **révoqué
immédiatement** sur https://github.com/settings/tokens (il a été exposé et ne
doit plus jamais être utilisé). Ne colle jamais de clé secrète (GitHub,
Firebase, Anthropic, Brevo) directement dans une conversation : utilise
toujours des variables d'environnement.

## 1. Créer le dépôt GitHub toi-même

```bash
cd scamwatch
git init
git add .
git commit -m "Initial commit — ScamWatch"
git branch -M main
git remote add origin https://github.com/<ton-compte>/scamwatch.git
git push -u origin main
```

Pour le compte `lfdweb123@gmail.com` : connecte-toi à ce compte GitHub, crée
un nouveau token dans **Settings > Developer settings > Personal access
tokens > Fine-grained tokens**, avec accès en écriture uniquement sur ce
dépôt, et utilise-le localement (ou via `gh auth login`) — jamais collé en
clair dans un chat.

## 2. Configurer Firebase

1. Créer un projet sur https://console.firebase.google.com
2. Activer **Firestore Database** (mode production)
3. Aller dans **Paramètres du projet > Comptes de service > Générer une
   nouvelle clé privée** → récupère `project_id`, `client_email`,
   `private_key`
4. Déployer les règles et index fournis :
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,firestore:indexes --project <ton-project-id>
   ```
   Les règles (`firestore.rules`) bloquent tout accès direct depuis le
   navigateur : toutes les écritures passent par le serveur Next.js (SDK
   Admin), ce qui empêche de falsifier le compteur de signalements.

## 3. Configurer l'API Claude (modération)

1. Créer une clé sur https://console.anthropic.com
2. La renseigner dans `ANTHROPIC_API_KEY`

Le prompt de modération (`lib/moderation.ts`) est volontairement permissif :
il rejette seulement le spam, le hors-sujet, le harcèlement personnel ou les
données sensibles — pas le manque de preuve formelle. Ajustable directement
dans ce fichier.

## 4. Configurer Brevo (notifications email)

1. Créer un compte sur https://www.brevo.com et une clé API (SMTP & API >
   Clés API)
2. Renseigner `BREVO_API_KEY`, `NOTIFICATION_EMAIL` (adresse qui reçoit les
   alertes) et `NOTIFICATION_SENDER_EMAIL` (adresse expéditrice, à valider
   dans Brevo)

## 5. Déployer sur Vercel

1. Importer le dépôt GitHub sur https://vercel.com/new
2. Dans **Settings > Environment Variables**, ajouter toutes les variables
   de `.env.example` (voir ci-dessous pour `FIREBASE_PRIVATE_KEY`)
3. Déployer

### À propos de `FIREBASE_PRIVATE_KEY` sur Vercel

Colle la clé privée telle quelle, avec les vrais retours à la ligne
(Vercel gère ça correctement dans son éditeur de variables) — le code gère
aussi le cas où ils sont échappés en `\n`.

## 6. Avant de demander l'accès Google AdSense

- Complète les informations manquantes dans `/mentions-legales` (adresse,
  statut juridique, email de contact) — actuellement en placeholder
  `[À compléter]`
- Publie quelques dizaines de pages de contenu réel (signalements) avant de
  soumettre le site : un registre vide est généralement refusé
- AdSense est strict sur le contenu utilisateur non modéré : garde la
  modération automatique active et surveille les premiers signalements
  manuellement pendant les premières semaines

## Développement local

```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run dev
```

## Structure

```
app/
  page.tsx                 → page d'accueil (registre)
  site/[domain]/page.tsx    → fiche d'un site signalé
  signaler/page.tsx         → formulaire de signalement
  api/reports/route.ts      → réception + modération + publication
  mentions-legales, cgu, a-propos, comment-ca-marche
lib/
  firebase-admin.ts         → connexion Firestore (Admin SDK)
  moderation.ts             → modération automatique via Claude
  brevo.ts                  → notification email
  rate-limit.ts             → anti-abus (sans compte utilisateur)
  domain.ts, data.ts, types.ts
```

## Modèle de données Firestore

- `sites/{domainId}` — `domain`, `reportCount`, `status`
  (`surveillance` | `confirme`), `firstReportedAt`, `lastReportedAt`,
  `confirmedAt`, `categories`
- `reports/{id}` — `domainId`, `domain`, `description`, `evidenceUrl`,
  `category`, `createdAt`, `moderation: { status, reason, severity }`
- `throttle/{fingerprint}` — anti-abus, IP hashée uniquement, jamais en clair
