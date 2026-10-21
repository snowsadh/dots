<p align="center">
  <img src="apps/web/public/devpost-banner-v2.png" alt="A floor plan transformed into a raised tactile map with braille labels" width="100%" />
</p>

<h1 align="center">dots</h1>

<p align="center">
  <strong>Floor plan in. Tactile map out.</strong><br />
  A web app that helps building owners create standards-validated, 3D-printable tactile maps for blind and low-vision visitors.
</p>

<p align="center">
  <a href="https://dots-mu-eosin.vercel.app/">Frontend preview</a> ·
  <a href="https://dots-mu-eosin.vercel.app/gallery">Gallery and print demos</a> ·
  <a href="output/pdf/dots-technical-agent-architecture.pdf">Architecture PDF</a>
</p>

<!-- README-HACK:NEEDS-OWNER key="demo-video" instruction="Add the final public YouTube or Vimeo demo URL here." -->

## Why dots

A sighted visitor can glance at a lobby map before entering an unfamiliar building. A blind visitor often has to ask for directions, memorize a verbal description, or learn the space by trial and error. A tactile map provides that missing mental model, but producing one is usually a slow, specialist commission that many libraries, schools, clinics, and small businesses cannot justify.

dots automates the design bottleneck. A building owner uploads the floor plan they already have, reviews what the system understood, and receives printable map and braille-legend STL files. The goal is not to replace human judgment: it is to make a useful accessibility tool practical for far more buildings.

## What dots does

1. **Upload:** Accept a PDF, PNG, JPG, or WebP floor plan up to 10 MB. PDFs are rasterized from the first page and large images are normalized for analysis.
2. **Extract:** Vision-language model calls identify walls, rooms, doorways, stairs, elevators, entrances, labels, and other navigational features as structured JSON.
3. **Review:** The system critiques its extraction against the source image, rechecks doorway crops, and presents the latest version on an editable canvas. Users can edit directly or describe a correction in plain English.
4. **Convert:** Deterministic TypeScript creates the tactile plate, braille keys, symbols, relief layers, and legend, then validates the result against the encoded [BANA 2022 (PDF)](https://www.brailleauthority.org/sites/default/files/tg/Tactile%20Graphics%20Standards%20and%20Guidelines%202022_a11y.pdf) and [ADA §703 (PDF)](https://www.access-board.gov/files/ada/ADA-Standards.pdf) geometry rules.
5. **Export:** Only a design with zero remaining violations reaches Manifold mesh generation and becomes a watertight STL bundle.

### A real repository example

| Uploaded floor plan | Generated tactile design |
| --- | --- |
| ![A clear top-down library floor plan used as parser input](apps/web/public/gallery/test-library-floor-plan-source.png) | ![The corresponding raised tactile library design with braille keys and symbols](apps/web/public/gallery/test-library-floor-plan-design.svg) |

The public gallery includes downloadable STLs for libraries, museums, offices, public restrooms, and other test plans. Each entry pairs its source plan with the printable result.

## How to use dots

The [hosted site](https://dots-mu-eosin.vercel.app/) is a frontend preview. Use the [local setup below](#run-locally-and-reproduce-the-demo) for upload, AI generation, editing, and export.

1. **Have a floor plan ready.** Use a clear, top-down plan of one floor. If you do not have one, [create one with Floor Plan Creator](https://floorplancreator.net/) and export an image, or choose an image from [demo-inputs](demo-inputs/README.md). The landing page also shows five downloadable examples.
2. **Upload the file.** Open `http://localhost:3000`, select **Upload floor plan**, and choose a PDF, PNG, JPG, or WebP up to 10 MB. For a plan at a URL, download the PDF/image first and upload that file; pasting a URL is not currently supported. Only the first PDF page is processed.
3. **Wait for parsing and review.** The progress screen tracks the model's extraction and review passes. Allow roughly 15–20 minutes for a local run; this is an estimate, not a guaranteed duration. Provider latency, model choice, and plan complexity affect the time.
4. **Edit the extracted plan.** In **Edit**, compare the canvas with the source. Correct walls, door openings, rooms, and labels using the canvas tools, or describe a correction in the prompt panel. Review low-confidence items and confirm them after checking the source. Fix the layout before selecting **Next**.
5. **Review the tactile design.** In **Tactile**, inspect the raised-map preview, braille keys, and legend. Open **Checks** to see each implemented rule's requirement, measured result, and pass/fail status. Resolve remaining violations before continuing; use **Back to edit** if the source interpretation needs correction.
6. **Download the output.** In **Export**, inspect the 3D preview and download the map or individual plate STLs, plus every legend STL offered. Follow the printing steps below.

### How to use the STL files

An STL contains the printable geometry. Open it in your printer's slicer to produce the printer-specific toolpath; the printer does not run the web app.

1. **Choose the right files.** For a single-tile result, use the map STL. For a multi-tile result, download every numbered `plate-…of….stl`; the assembled `map.stl` is the preview, which can exceed your print bed. Download the separate legend file(s) too.
2. **Import into your slicer in millimetres at 100% scale.** Each printable map tile is 200 × 200 mm with a 3 mm base. Check the displayed dimensions and your printer's usable bed area. Do not shrink the model to fit: resizing also changes the braille and tactile spacing.
3. **Use the app's starting print settings:** flat base on the bed, raised features facing upward, 0.4 mm nozzle, layers no higher than 0.2 mm, and no supports. Use your printer's material profile and inspect the sliced preview to ensure the braille dots and thin features remain present.
4. **Slice, print, and inspect.** Print a trial before making a full set. Check for missing or merged dots, rough edges, warping, and blocked doorway gaps. Digital checks do not measure the physical print; printer calibration and material affect the result.
5. **Assemble and use with the legend.** Arrange numbered map tiles in row-major order: left to right across the first row, then the next row, matching the assembled preview. Join tiles edge-to-edge without covering raised features. Keep the braille legend with the map and verify the orientation against the building before use. Have blind or low-vision readers evaluate tactile readability before putting it into service.

For an existing output to inspect without running inference, download the [single-tile library STL](apps/web/public/gallery/test-library-floor-plan.stl) and compare it with its [source plan](demo-inputs/test-library-floor-plan-source.png) and [tactile design](apps/web/public/gallery/test-library-floor-plan-design.svg).

## AI proposes. Geometry disposes.

The agent system does work that benefits from visual and semantic judgment, while deterministic code owns every safety-critical geometry decision.

- **ParserAgent** produces the typed `FloorModel` from the plan and detail crops.
- **CritiqueAgent** compares the source, model rendering, topology audit, and coverage evidence. A bounded TypeScript loop can refine the parse up to five times.
- **OpeningsAuditAgent** independently re-verifies doorways using magnified crops and proposes keep, move, delete, or add operations.
- **EditAgent** translates a user prompt into schema-checked operations against real element IDs; it cannot emit unrestricted geometry.
- **TactileLayoutAgent** may reposition labels and symbols when deterministic validation finds conflicts. The layout loop runs at most four times and never accepts a candidate with more violations.

The validator checks scale, minimum feature sizes, margins, seams, clearances, braille footprints, and label fit in millimetres. Mechanical repairs run before agent-assisted layout, and the export endpoint rejects unfinished or invalid designs.

## Architecture

[![Technical architecture showing the browser, Bun and Hono API, five Vertex AI agents, bounded review loops, Postgres persistence, deterministic tactile validation, and STL export](docs/graphs/technical-agent-architecture-readme.svg)](output/pdf/dots-technical-agent-architecture.pdf)

The Next.js browser app communicates with a Bun and Hono API. Background parse and tactile jobs persist their status and versioned JSON in PostgreSQL. All model roles share one configurable transport: an OpenAI-compatible Chat Completions API, or native Gemini through Google ADK. The shared floor-model package, validation engine, and Manifold mesh generator remain deterministic. Source images and generated STL files currently use the service filesystem and are therefore prototype-only across container replacements. The architecture diagram above depicts the original native Gemini configuration.

## Built with

- **AI:** configurable vision model through OpenRouter, OpenAI, or another Chat Completions endpoint; optional native Gemini through Google ADK
- **Web:** Next.js 16, React 19, TypeScript, Tailwind CSS, Three.js
- **API:** Bun, Hono, Zod, MuPDF, Resvg
- **Geometry:** deterministic TypeScript, Manifold 3D, binary STL generation
- **Data:** PostgreSQL, Drizzle ORM, versioned floor-model JSON
- **Cloud:** Vercel and Google Cloud Run; Render and Cloud SQL deployments; Cloud Build, Artifact Registry, Secret Manager

## What floor plans can I use?

dots is designed for many single-floor architectural plans, not one hard-coded demo image. Upload a PDF, PNG, JPG, or WebP file up to 10 MB. For PDFs, the first page is used. The strongest inputs are:

- A straight, top-down view of one floor
- Clearly visible walls and doorway gaps
- High contrast with readable room labels
- Minimal shadows, perspective distortion, decorative rendering, or overlapping floors

The repository includes several different houses, schools, hotels, museums, and office plans under `test-assets/floor-plans/`. Start with a [gallery demo input](demo-inputs/README.md), then replace it with your own plan. The in-app guide at `/input-guide` shows supported and unsuitable examples side by side.

## Run locally and reproduce the demo

### 1. Prerequisites

- Bun 1.4.3 (the version pinned in `package.json`)
- Git
- A model API key and a vision model supporting Chat Completions (or native Gemini credentials)
- PostgreSQL 17, either installed locally or running in a container

Verify the required tools:

```bash
bun --version
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

### 3. Start PostgreSQL

Use any reachable PostgreSQL database. On macOS, use Colima as the Docker runtime and start it first if necessary:

```bash
colima status || colima start
```

Then start a disposable PostgreSQL 17 database:

```bash
docker --context colima run --name dots-postgres \
  -e POSTGRES_USER=dots \
  -e POSTGRES_PASSWORD=dots \
  -e POSTGRES_DB=dots \
  -p 127.0.0.1:5432:5432 \
  -v dots-postgres-data:/var/lib/postgresql/data \
  -d postgres:17-alpine
```

If port 5432 is already occupied, use your existing PostgreSQL instance and change `DATABASE_URL` accordingly.

### 4. Configure the model and database

Set these values in `apps/api/.env`. The example uses OpenRouter with an open-weight vision model candidate; a full map-generation run with this model still needs validation.

```env
MODEL_PROVIDER=openai-compatible
MODEL_BASE_URL=https://openrouter.ai/api/v1
MODEL_API_KEY=<your-openrouter-key>
MODEL_CRITICAL=google/gemma-4-26b-a4b-it
MODEL_MAX_OUTPUT_TOKENS=32768
DATABASE_URL=postgresql://dots:dots@localhost:5432/dots
UPLOADS_DIR=data/uploads
```

`MODEL_BASE_URL` is the API root, without `/chat/completions`. To use OpenAI directly, change it to `https://api.openai.com/v1`, use an OpenAI key, and set `MODEL_CRITICAL` to your chosen vision model ID. The model must support image input, Chat Completions, and the configured output limit. Optional `MODEL_FAST`, `MODEL_LAYOUT`, and `MODEL_COMPARE` overrides otherwise use `MODEL_CRITICAL`.

To reproduce the current local Gemini configuration through OpenRouter, keep the compatible provider and base URL above and set `MODEL_CRITICAL=google/gemini-3.8-flash`. Gemini is proprietary; choosing it does not satisfy an open-weight model requirement. The example environment retains Gemma as an alternative candidate.

Native Gemini remains available with `MODEL_PROVIDER=gemini`, a Gemini model ID, and either `GEMINI_API_KEY` or the Vertex AI settings documented in `apps/api/.env.example`.

Keep this value in `apps/web/.env.local` and generate `AUTH_SECRET` with `bunx auth secret` if using sign-in:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

Keep `MODEL_API_KEY` in the API environment only. Both environment files are ignored by Git. Restart the services after changing environment values; the web API origin is included in the browser bundle at build time.

### 5. Migrate and start both services

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

A healthy response contains `"ok":true` and the active provider, API base URL, and model IDs. It does not expose the API key. The services can start without a model key; an inference request then returns a configuration error.

### 6. Reproduce the complete map pipeline

1. Open `http://localhost:3000`.
2. Upload [the library demo input](demo-inputs/test-library-floor-plan-source.png), or another plan from [demo-inputs](demo-inputs/README.md).
3. Wait for parsing. The progress view shows parsing, critique, and refinement stages.
4. Review the extracted rooms, walls, doors, and confidence flags on the canvas. Make a direct edit or try a prompt such as `rename the lobby Reception`.
5. Continue to tactile conversion. The deterministic validator and layout repair loop must reach zero violations.
6. Open the 3D preview and download the map and legend STL files.

A complete run can take several minutes because the pipeline performs multiple multimodal review passes. Duration and accuracy depend on the selected model and provider. Generated source files, intermediate artifacts, and STLs are stored under `apps/api/data/uploads/<project-id>/` when the API starts from `apps/api`.

After the sample succeeds, repeat the same steps with another top-down plan from `test-assets/floor-plans/` or your own building. If a plan fails the input-quality check, use the in-app guide to remove perspective, isolate one floor, or export a clearer image.

### 7. Verify the repository

```bash
bun run typecheck
bun run lint
bun test packages/floor-model apps/api/src apps/web/src
```

The tests cover model-provider configuration and transport, floor-model schemas, parser review gates, doorway auditing, tactile conversion, standards validation, mechanical repair, rasterization, braille geometry, editor constraints, and STL preview rendering. See [development status](docs/development-status.md#verification) for the recorded checks and remaining live-inference verification.

### Adjusting the bounded loops

- Parse review: `MAX_ITERATIONS = 5` in `apps/api/src/agents/parse-loop.ts`
- Tactile layout: `MAX_LAYOUT_ITERATIONS = 4` in `apps/api/src/agents/tactile-layout.ts`

Increasing either limit allows more agent repair attempts but also increases model calls and total processing time. Restart `bun run dev` after changing a limit.

## Prototype boundaries and next steps

The current product handles one floor per uploaded map and works best with clear, top-down architectural plans. PostgreSQL preserves project metadata and model versions, but source images and STL files still use ephemeral container storage.

Next steps are durable object storage, multi-floor navigation, contracted braille and additional languages, more physical print testing with blind readers, and outdoor public-space input.

## Evidence and standards references

These links let reviewers inspect the source requirements, implementation, examples, and recorded checks. They are not an independent compliance certificate. Zero violations means the design passes the rules encoded in this repository; it does not establish complete BANA/ADA compliance, correct AI interpretation, or physical braille readability.

| Evidence | Where to inspect it | What it establishes |
| --- | --- | --- |
| Official standards | The BANA and ADA PDFs linked below | Source guidance used when implementing the geometry rules. |
| Encoded checks | [Validator](packages/floor-model/src/validate.ts), [braille geometry](packages/floor-model/src/braille.ts), [per-rule report](packages/floor-model/src/validation-report.ts) | The exact rules, fixed dimensions, and measurements the app implements. |
| Reproducible automated checks | [Validator tests](packages/floor-model/test/validate.test.ts), [report tests](packages/floor-model/test/validation-report.test.ts), [tactile conversion tests](packages/floor-model/test/tactile.test.ts) | Executable examples of passing designs and rejected violations. Run the verification commands above to reproduce them. |
| Export restriction | [Export endpoint](apps/api/src/export.ts) | Export rejects a design whose stored validation result has remaining violations. |
| Input/output artifacts | [Demo inputs](demo-inputs/README.md), [library design](apps/web/public/gallery/test-library-floor-plan-design.svg), [library STL](apps/web/public/gallery/test-library-floor-plan.stl), [gallery](https://dots-mu-eosin.vercel.app/gallery) | Inspectable plans and existing generated outputs; these are not a benchmark of the currently selected model. |
| Physical print examples | [Handheld print photo](apps/web/public/gallery/demo-print-handheld.jpg), [printer-bed photo](apps/web/public/gallery/demo-print-printer-bed.jpg) | Physical demo prints exist; photos alone do not establish dimensions or user-tested readability. |
| Recorded verification | [Development status](docs/development-status.md#verification) | Previously recorded checks and remaining live-inference limitations, rather than a report from every new run. |
| Architecture | [Architecture PDF](output/pdf/dots-technical-agent-architecture.pdf) | System components and processing flow; the diagram depicts the original native Gemini configuration. |

### Official PDFs

- [BANA Guidelines and Standards for Tactile Graphics, 2022 — accessible PDF](https://www.brailleauthority.org/sites/default/files/tg/Tactile%20Graphics%20Standards%20and%20Guidelines%202022_a11y.pdf)
- [ADA Accessibility Standards — official PDF](https://www.access-board.gov/files/ada/ADA-Standards.pdf): see §703 for raised characters and braille requirements.
- [ADA Chapter 7: Signs and braille specifications — illustrated guide PDF](https://www.access-board.gov/files/ada/guides/signs-ADA.pdf)

### Project documents

- [Product brief](docs/idea.md)
- [Requirements and hackathon alignment](docs/requirements.md)
- [Deployment notes](docs/deploy.md)
- [DigitalOcean demo deployment](docs/digitalocean.md)
