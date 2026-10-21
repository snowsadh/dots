# Running dots

dots turns a floor plan image into a 3D-printable tactile map for blind
navigation. This guide takes you from a clean machine to a downloaded STL.

## Prerequisites

- [Bun](https://bun.sh) 1.3 or newer (runs the API, the web app, and all tests)
- PostgreSQL 17; see the [local database setup](README.md#3-start-postgresql)
- A model API key and a vision model supporting Chat Completions. OpenRouter
  and OpenAI use the same transport with different environment values.

## Setup

From the repository root:

```bash
bun install --frozen-lockfile
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Set `DATABASE_URL` for your database and configure the model in `apps/api/.env`.
For OpenRouter:

```bash
MODEL_PROVIDER=openai-compatible
MODEL_BASE_URL=https://openrouter.ai/api/v1
MODEL_API_KEY=your-key
MODEL_CRITICAL=google/gemma-4-26b-a4b-it
MODEL_MAX_OUTPUT_TOKENS=32768
```

The Gemma model is an initial open-weight candidate awaiting full pipeline
verification. For OpenAI directly, use the same configuration with
`MODEL_BASE_URL=https://api.openai.com/v1`, an OpenAI key, and your chosen
vision model ID. Set an output limit supported by that model. Use the API root
without `/chat/completions`; no source edits are needed to change providers.

Native Gemini is also available:

```bash
MODEL_PROVIDER=gemini
GEMINI_API_KEY=your-key
MODEL_CRITICAL=gemini-3.7-flash
```

Keep keys server-side in `apps/api/.env`. Both local environment files are
ignored by Git. Restart the services after changing them. Set
`NEXT_PUBLIC_API_URL` in the web environment to the dots backend origin.

After configuring the database, apply migrations:

```bash
cd apps/api
bun run db:migrate
cd ../..
```

## Run

```bash
bun run dev
```

- Web app: http://localhost:3000
- API: http://localhost:3003

## Using it

1. **Upload** a floor plan (PDF, PNG, JPG, or WebP, up to 10 MB) on the home
   page. Not sure what to upload? Click **"Good and bad floor-plan examples"**
   right under the upload button (the `/input-guide` page). Clean, top-down 2D
   plans work best; the same page shows the inputs that get rejected, such as
   3D renders and perspective drawings. Ready-to-use samples also live in
   `test-assets/floor-plans/`.
2. **Parse.** A team of agents extracts walls, doors, rooms, stairs, and
   furniture, critiques its own work against the image, and audits every
   doorway against magnified crops. Expect 1 to 4 minutes and roughly 3 to 8
   model calls depending on plan complexity (each call is logged in the API
   terminal as `[llm] call #N`).
3. **Edit.** Review the extracted map on the canvas. Elements the pipeline is
   unsure about are flagged for review. Fix anything by direct manipulation or
   with a plain-English prompt in the side panel.
4. **Tactile.** One click converts the model into a BANA 2022 / ADA 703
   compliant tactile design and validates it rule by rule. Export is blocked
   until there are zero violations.
5. **Export.** Preview the plate in 3D and download the binary STL (plus a
   braille legend plate). Print flat on the bed, 0.4 mm nozzle, no supports.

## Verify the code

```bash
bun run typecheck
bun run lint
bun test packages/floor-model apps/api/src apps/web/src
```

## Environment reference

| Variable | Where | Purpose |
|---|---|---|
| `MODEL_PROVIDER` | `apps/api/.env` | `openai-compatible`, native `gemini`, or legacy `openrouter` |
| `MODEL_BASE_URL` | `apps/api/.env` | Required API root for compatible providers; examples: `https://openrouter.ai/api/v1`, `https://api.openai.com/v1` |
| `MODEL_API_KEY` | `apps/api/.env` | Server-side bearer token for compatible providers |
| `GEMINI_API_KEY` | `apps/api/.env` | AI Studio key (gemini provider) |
| `OPENROUTER_API_KEY` | `apps/api/.env` | Legacy key alias only when `MODEL_PROVIDER=openrouter` |
| `MODEL_CRITICAL` | `apps/api/.env` | Required model ID for `openai-compatible` |
| `MODEL_FAST` / `MODEL_LAYOUT` / `MODEL_COMPARE` | `apps/api/.env` | Optional per-role model IDs; compatible providers otherwise use `MODEL_CRITICAL` |
| `MODEL_MAX_OUTPUT_TOKENS` | `apps/api/.env` | Positive integer completion cap per compatible call (default 32768) |
| `DATABASE_URL` | `apps/api/.env` | PostgreSQL connection string |
| `NEXT_PUBLIC_API_URL` | `apps/web/.env.local` | Required dots API origin, locally `http://localhost:3003` |

The `.env.example` files document the configuration without credentials.

## Evidence and study

`pipeline_tests/REPORT.md` documents the full validation study: the standards
audit, ten real-venue runs with before/after comparisons, and the improvement
changelog that produced the current pipeline.
