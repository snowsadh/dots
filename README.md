<p align="center">
  <img src="apps/web/public/devpost-banner-v2.png" alt="A floor plan transformed into a raised tactile map with braille labels" width="100%" />
</p>

<h1 align="center">dots</h1>

<p align="center">
  <strong>Floor plan in. Tactile map out.</strong><br />
  A web app that helps building owners create standards-validated, 3D-printable tactile maps for blind and low-vision visitors.
</p>

<p align="center">
  <a href="output/pdf/bumps-technical-agent-architecture.pdf">Architecture PDF</a>
</p>

## Project description

dots turns a floor plan into a 3D-printable tactile map. A tactile map is a raised floor plan that people read with their fingertips. It helps blind and low-vision visitors understand a building before they enter it. However, most buildings do not have tactile maps. Custom maps require specialist work, can take weeks, and often cost too much for small organizations. dots makes this process faster and more affordable.

Upload a PDF, an architectural drawing, or a photo of an evacuation plan. A coordinated multi-agent vision pipeline converts the image into a structured spatial model. A parser agent identifies walls, rooms, doors, stairs, and other important features. A critic agent compares this model with the source image and identifies extraction errors. The pipeline repeats this process up to five times to improve the model and flags remaining uncertainty for review.

A dedicated doorway auditor then examines every entrance against an enlarged crop of the original image. This independent verification stage reduces the risk of missing, misplaced, or incorrectly oriented doors. You can review the verified model on an editable canvas. Select an element to correct it, or describe the correction in plain English. The agents then update the spatial model while preserving the remaining layout.

Deterministic geometry code converts the approved model into a tactile design. It validates relief height, element spacing, minimum feature size, braille geometry, and printability against BANA 2022 and ADA 703 specifications. The AI agents interpret and refine the floor plan, but deterministic code controls compliance and export. The system produces a watertight STL file and a matching braille legend plate only after every validation check passes. You can print both files on a consumer 3D printer with a few dollars of material.

## What dots does

1. **Upload:** Accept a PDF, PNG, JPG, or WebP floor plan up to 10 MB. PDFs are rasterized from the first page and large images are normalized for analysis.
2. **Extract:** Gemini agents on Vertex AI identify walls, rooms, doorways, stairs, elevators, entrances, labels, and other navigational features as structured JSON.
3. **Review:** The system critiques its extraction against the source image, rechecks doorway crops, and presents the latest version on an editable canvas. Users can edit directly or describe a correction in plain English.
4. **Convert:** Deterministic TypeScript creates the tactile plate, braille keys, symbols, relief layers, and legend, then validates the result against the encoded BANA 2022 and ADA §703 geometry rules.
5. **Export:** Only a design with zero remaining violations reaches Manifold mesh generation and becomes a watertight STL bundle.

### A real repository example

| Uploaded floor plan | Generated tactile design |
| --- | --- |
| ![A clear top-down library floor plan used as parser input](apps/web/public/gallery/test-library-floor-plan-source.png) | ![The corresponding raised tactile library design with braille keys and symbols](apps/web/public/gallery/test-library-floor-plan-design.svg) |

The gallery includes downloadable STLs for libraries, museums, offices, public restrooms, and other test plans. Each entry pairs its source plan with the printable result.

## AI proposes. Geometry disposes.

The agent system does work that benefits from visual and semantic judgment, while deterministic code owns every safety-critical geometry decision.

- **ParserAgent** produces the typed `FloorModel` from the plan and detail crops.
- **CritiqueAgent** compares the source, model rendering, topology audit, and coverage evidence. A bounded TypeScript loop can refine the parse up to five times.
- **OpeningsAuditAgent** independently re-verifies doorways using magnified crops and proposes keep, move, delete, or add operations.
- **EditAgent** translates a user prompt into schema-checked operations against real element IDs; it cannot emit unrestricted geometry.
- **TactileLayoutAgent** may reposition labels and symbols when deterministic validation finds conflicts. The layout loop runs at most four times and never accepts a candidate with more violations.

The validator checks scale, minimum feature sizes, margins, seams, clearances, braille footprints, and label fit in millimetres. Mechanical repairs run before agent-assisted layout, and the export endpoint rejects unfinished or invalid designs.

## Architecture

[![Technical architecture showing the browser, Bun and Hono API, five Vertex AI agents, bounded review loops, Postgres persistence, deterministic tactile validation, and STL export](docs/graphs/technical-agent-architecture-readme.svg)](output/pdf/bumps-technical-agent-architecture.pdf)

The locally running Next.js app communicates with a Bun and Hono API on localhost. Background parse and tactile jobs persist their status and versioned JSON in PGlite. Google ADK agents call Gemini through Vertex AI, while the shared floor-model package, validation engine, and Manifold mesh generator remain deterministic. Source images and generated STL files remain on the local API filesystem.

## Built with

- **AI:** Google ADK for TypeScript, Gemini 3.7 Flash, Vertex AI
- **Web:** Next.js 16, React 19, TypeScript, Tailwind CSS, Three.js
- **API:** Bun, Hono, Zod, MuPDF, Resvg
- **Geometry:** deterministic TypeScript, Manifold 3D, binary STL generation
- **Data:** local PGlite, Drizzle ORM, versioned floor-model JSON

## What floor plans can I use?

dots is designed for many single-floor architectural plans, not one hard-coded demo image. Upload a PDF, PNG, JPG, or WebP file up to 10 MB. For PDFs, the first page is used. The strongest inputs are:

- A straight, top-down view of one floor
- Clearly visible walls and doorway gaps
- High contrast with readable room labels
- Minimal shadows, perspective distortion, decorative rendering, or overlapping floors

The repository includes several different houses, schools, hotels, museums, and office plans under `test-assets/floor-plans/`. Start with the known-good sample below, then replace it with your own plan. The in-app guide at `/input-guide` shows supported and unsuitable examples side by side.

## Run locally and reproduce the demo

### 1. Prerequisites

- Bun 1.3 or newer
- Git
- Google Cloud CLI
- A Google Cloud project with Vertex AI access

Verify the required tools:

```bash
bun --version
gcloud --version
git --version
```

### 2. Clone and install the exact dependency set

```bash
git clone https://github.com/snowsadh/dots.git
cd dots
bun install --frozen-lockfile
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

The frozen lockfile keeps the installed versions consistent with the tested repository state.

### 3. Use the local database

The API uses PGlite in `apps/api/data/pglite` when `DATABASE_URL` is unset. It needs no database server or container.

### 4. Authenticate with Vertex AI

```bash
gcloud auth application-default login
gcloud config set project <your-project-id>
gcloud services enable aiplatform.googleapis.com
```

Your Google account or service account needs permission to invoke Vertex AI models in that project. dots uses Gemini through Vertex AI; no third-party model gateway is required.

### 5. Configure the API and web app

Paste the following values into `apps/api/.env`:

```env
MODEL_PROVIDER=gemini
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=<your-project-id>
GOOGLE_CLOUD_LOCATION=global
USE_INTERACTIONS_API=false
MODEL_CRITICAL=gemini-3.7-flash
MODEL_FAST=gemini-3.7-flash
MODEL_LAYOUT=gemini-3.7-flash
MODEL_COMPARE=gemini-3.7-flash
UPLOADS_DIR=data/uploads
```

Keep this value in `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

Do not commit either environment file.

Leave `DATABASE_URL` unset for local PGlite. Set it to a PostgreSQL connection URL only when you intentionally use an external database.

### 6. Migrate and start both services

```bash
cd apps/api
bun run db:migrate
cd ../..
bun run dev
```

The root command starts the Next.js web app and Bun/Hono API in parallel:

- Web app: `http://localhost:3000`
- API: `http://localhost:3003`
- Input guide: `http://localhost:3000/input-guide`

In another terminal, verify the backend before uploading a plan:

```bash
curl http://localhost:3003/
```

A healthy response contains `"ok":true` and the active Gemini model configuration.

### 7. Reproduce the complete map pipeline

1. Open `http://localhost:3000`.
2. Upload `test-assets/floor-plans/house-bolduc.png`.
3. Wait for parsing. The progress view shows parsing, critique, and refinement stages.
4. Review the extracted rooms, walls, doors, and confidence flags on the canvas. Make a direct edit or try a prompt such as `rename the lobby Reception`.
5. Continue to tactile conversion. The deterministic validator and layout repair loop must reach zero violations.
6. Open the 3D preview and download the map and legend STL files.

A complete, error-free run can take approximately 10 minutes because Vertex AI may perform several multimodal review passes. Generated source files, intermediate artifacts, and STLs are stored under `apps/api/data/uploads/<project-id>/` when the API starts from `apps/api`.

After the known-good sample succeeds, repeat the same steps with another top-down plan from `test-assets/floor-plans/` or your own building. If a plan fails the input-quality check, use the in-app guide to remove perspective, isolate one floor, or export a clearer image.

### 8. Verify the repository

```bash
bun run typecheck
bun run lint
bun test packages/floor-model apps/api/src apps/web/src
```

The current repository passes type checking, linting, and 111 tests. The tests cover floor-model schemas, parser review gates, doorway auditing, tactile conversion, standards validation, mechanical repair, rasterization, braille geometry, editor constraints, and STL preview rendering.

### Adjusting the bounded loops

- Parse review: `MAX_ITERATIONS = 5` in `apps/api/src/agents/parse-loop.ts`
- Tactile layout: `MAX_LAYOUT_ITERATIONS = 4` in `apps/api/src/agents/tactile-layout.ts`

Increasing either limit allows more agent repair attempts but also increases Vertex AI calls and total processing time. Restart `bun run dev` after changing a limit.

## Prototype boundaries and next steps

The current product handles one floor per uploaded map and works best with clear, top-down architectural plans. Local PGlite preserves project metadata and model versions; source images and STL files remain on local disk.

Next steps are multi-floor navigation, contracted braille and additional languages, more physical print testing with blind readers, and outdoor public-space input.

## Standards and project documents

- [BANA Guidelines and Standards for Tactile Graphics, 2022](https://www.brailleauthority.org/tg/)
- [ADA Chapter 7: Signs and braille specifications](https://www.access-board.gov/ada/guides/chapter-7-signs/)
- [Product brief](docs/idea.md)
- [Local requirements](docs/requirements.md)
