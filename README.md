# Nexus AI

Nexus AI brings creative and productivity tools together in one workspace. Generate articles and titles, create and edit images, and get structured feedback on resumes.

## Features

- **Writing:** generate articles and headline ideas with configurable tone and category.
- **Image tools:** generate images, remove backgrounds, and remove selected objects.
- **Resume analysis:** upload a PDF and receive structured feedback for a target role.
- **Accounts and plans:** Clerk authentication, monthly free usage limits, and premium features.
- **History and usage:** review past creations and track usage from your account.

## Technology

| Area | Stack |
| --- | --- |
| Client | React 18, Vite, React Router, Framer Motion |
| API | Node.js, Express |
| Authentication and billing | Clerk |
| Database | Neon Postgres |
| AI and image services | Gemini, ClipDrop, Cloudinary |

The repository is organized as two independently deployable applications:

```text
client/   React single-page application
server/   Express API
```

## Getting started

### Requirements

- Node.js 18.18 or later and npm
- A Clerk application and a Neon Postgres database
- API credentials for whichever AI and image tools you want to enable

### Configure environment variables

Create local environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set the following values:

- **Clerk:** Configure `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `server/.env`, and `VITE_CLERK_PUBLISHABLE_KEY` in `client/.env`. To enable premium billing, create a Clerk Billing plan with the slug in `PREMIUM_PLAN_SLUG` and set the displayed price with `VITE_PREMIUM_PRICE`.
- **Neon:** Set `DATABASE_URL` in `server/.env` to your database connection string.
- **Gemini:** Set `GEMINI_API_KEY` to enable article writing, title generation, and resume analysis.
- **ClipDrop:** Set `CLIPDROP_API_KEY` to enable image generation and background removal.
- **Cloudinary:** Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to enable image storage and object removal. Object removal also requires Cloudinary's Generative AI Remove add-on.
- **Origins:** Set `CLIENT_URL` in `server/.env` to the client origin. The local default is `http://localhost:8080`.

Provider credentials can be left blank when you do not need those tools. Never commit `.env` files or put server-side secrets in client environment variables.

### Run locally

Start the API in one terminal:

```bash
cd server
npm install
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm install
npm run dev
```

The client runs at `http://localhost:8080` and the API at `http://localhost:3000`. The API health endpoint is `http://localhost:3000/api/health`.

## Deployment

The client and API can be deployed as separate Vercel projects from this repository.

1. **API project:** set the Root Directory to `server`, configure the variables from `server/.env.example`, and set `CLIENT_URL` to the deployed client origin. The Vercel configuration is in `server/vercel.json`.
2. **Client project:** set the Root Directory to `client`, select Vite, and configure `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL` (the API base URL, without `/api`), and `VITE_PREMIUM_PRICE`. The Vercel configuration is in `client/vercel.json`.
3. Add the deployed client domain to Clerk and use production Clerk keys for a live deployment.

Vercel functions have request-body and execution-time limits. Keep `MAX_UPLOAD_MB` within the platform's request-size limit and check the selected Vercel plan against the expected generation time.

## Plans

| Capability | Free | Premium |
| --- | --- | --- |
| Article writing, title generation, and resume analysis | 10 generations per calendar month by default | Unlimited |
| Image generation, background removal, and object removal | Not included | Included |

The free limit is configured by `FREE_MONTHLY_LIMIT`. Usage is calculated from the `creations` table, and premium access is checked by the API before paid provider requests.

## API overview

Except for `GET /api/health`, all routes require a valid Clerk session token in the `Authorization` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API and provider configuration status |
| `GET` | `/api/user/me` | Account plan, usage, and reset date |
| `GET` | `/api/user/stats` | Creation totals and recent activity |
| `GET` | `/api/user/creations` | Search and page through creation history |
| `DELETE` | `/api/user/creations/:id` | Delete a creation |
| `POST` | `/api/ai/article` | Generate an article |
| `POST` | `/api/ai/titles` | Generate title ideas |
| `POST` | `/api/ai/resume` | Analyze a PDF resume (`resume` file; optional `role`) |
| `POST` | `/api/ai/image` | Generate an image (premium) |
| `POST` | `/api/ai/remove-background` | Remove an image background (premium; `image` file) |
| `POST` | `/api/ai/remove-object` | Remove an image object (premium; `image` file and `object`) |

Errors use the shape `{ "success": false, "message": "...", "code": "..." }`. Common codes include `PREMIUM_REQUIRED`, `LIMIT_REACHED`, `NOT_CONFIGURED`, `VALIDATION`, and `UPSTREAM_*`.

## Project structure

```text
client/src/
  components/   Shared interface components
  lib/          API client, session state, and generation hooks
  pages/        Application pages and AI tools
server/src/
  middleware/   Authentication, uploads, usage limits, and errors
  models/       Database access
  routes/       User and AI API endpoints
  services/     AI, image, writing, and PDF integrations
```

The provider integrations live in `server/src/services/`; routes use those services rather than calling providers directly. The client shares request, loading, and error handling through `client/src/lib/useGenerate.js`.

## Before launch

- Replace sample testimonials on the landing page with real customer feedback.
- Test the premium purchase flow with Clerk test credentials before enabling live billing.
- Review provider terms, deployment limits, and privacy requirements for your use case.
