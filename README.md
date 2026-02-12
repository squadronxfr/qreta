# Qreta

A modern storefront and subscription-enabled web app built with Next.js (App Router). It uses Firebase (Auth, Firestore,
Storage) for data and authentication, Stripe for billing/subscriptions, Tailwind CSS for styling, and Zustand for state
management.

The project includes both customer-facing pages and a dashboard with admin/superadmin functionality. It also exposes API
routes for Stripe checkout, billing portal, invoices, and webhooks.

## Tech Stack

- Language: TypeScript
- Framework: Next.js 16 (App Router), React 19
- Styling: Tailwind CSS 4
- State: Zustand
- UI/Utils: shadcn, Radix UI, lucide-react, framer-motion, sonner, clsx, class-variance-authority, tailwind-merge
- Backend services: Firebase (client SDK) and Firebase Admin SDK
- Payments: Stripe (webhooks, checkout, portal)
- Linting: ESLint 9, eslint-config-next

## Requirements

- Node.js 20+ (recommended) and npm 10+
- Stripe account and Stripe CLI (for local webhook testing) — optional for basic development
- Firebase project (for Auth/Firestore/Storage)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Create a `.env.local` in the project root:
   ```bash
   # Public Firebase config (used on client)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin credentials (server-only)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=service_account_email@your-project.iam.gserviceaccount.com
   # Note: keep newlines escaped as \n when pasting JSON private key
   FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   # Stripe secrets
   STRIPE_SECRET_KEY=sk_live_or_test
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Available Scripts

- `npm run dev` — start Next.js in development mode
- `npm run build` — production build
- `npm start` — start the production server (after build)
- `npm run lint` — run ESLint

## Entry Points & Routing

- App shell and global styles: `src/app/layout.tsx`, `src/app/globals.css`
- Routes (App Router):
    - Public landing: `src/app/(landing)/page.tsx`
    - Auth: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`
    - Dashboard: `src/app/(dashboard)/...` (account, billing, admin, stores, superadmin)
    - Dynamic store pages: `src/app/[slug]/page.tsx`
- API routes (server):
    - `src/app/api/stripe/checkout/route.ts`
    - `src/app/api/stripe/invoices/route.ts`
    - `src/app/api/stripe/portal/route.ts`
    - `src/app/api/stripe/webhooks/stripe/route.ts`

## Configuration & Services

- Firebase client initialization: `src/lib/firebase/config.ts`
- Firebase Admin initialization: `src/lib/firebase/admin.ts`
- Stripe SDK and configuration: `src/lib/stripe.ts`
- Subscription plan mapping: `src/config/subscription.ts`

## Environment Variables

Required for running locally and in production:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY` (escape newlines as `\n` in `.env.*` files)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (required if Stripe webhooks are enabled)

## Stripe Webhooks (Local Development)

- Install the Stripe CLI and log in.
- Start a listener and forward events to the Next.js route:
  ```bash
  # Example command — confirm/adjust the events for your use case (TODO)
  stripe listen --events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted \
    --forward-to localhost:3000/api/stripe/webhooks/stripe
  ```
- Copy the signing secret from the CLI output into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## Project Structure (selected)

```
src/
  app/
    (landing)/
    (auth)/
    (dashboard)/
    [slug]/
    api/stripe/...           # Checkout, invoices, portal, webhooks
    globals.css
    layout.tsx
  components/                # UI and feature components
  context/                   # React contexts
  hooks/                     # Custom hooks
  lib/
    firebase/                # Client and admin Firebase helpers
    stripe.ts
    utils/
  providers/                 # App/store providers
  stores/                    # Zustand stores
  types/                     # Shared TypeScript types
```

## Testing

- No automated test setup is currently present in `package.json`.
- TODO: Add unit/integration tests (e.g., Vitest/Jest) and/or E2E (e.g., Playwright).

## Deployment

- Standard Next.js deployment flow. Build with `npm run build` and run with `npm start`.
- TODO: Document target hosting provider, environment variable management, and webhook configuration for production.

## License

- No `LICENSE` file found.
- TODO: Add a license (e.g., MIT) or clarify the project’s licensing terms.
