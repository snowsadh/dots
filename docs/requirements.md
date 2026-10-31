# Requirements — local prototype

The web app, API, and database run locally. Gemini calls still use the configured Vertex AI project. Hosting setup and a public URL are not required for this project.

Product brief: [idea.md](idea.md). This document defines the current local acceptance target; older deployment and submission notes are historical.

## Stack

| Layer | Choice | Purpose |
|---|---|---|
| Model | **Gemini 3.7 Flash through Vertex AI**; env-selectable `MODEL_CRITICAL`/`MODEL_FAST`/`MODEL_LAYOUT`/`MODEL_COMPARE` | Model calls from the locally running API |
| Agent framework | **Google ADK for TypeScript** (`@google/adk`) — ParserAgent, EditAgent, TactileAgent, ValidatorAgent | Agent orchestration inside the API |
| Web app | **Next.js (App Router) + shadcn/ui** (existing starter `apps/web`): landing, wizard UI, canvas editor, three.js STL preview | Repo convention |
| API / agents host | **Bun + Hono** (existing starter `apps/api`): uploads, ADK agents, geometry, persistence | Runs on localhost |
| Geometry | **Deterministic TypeScript** in `apps/api` — tactile transform + extrusion + binary STL writer, manifold-3d (WASM) for booleans | Standards compliance must never depend on model output |
| Persistence | **Local PGlite via Drizzle** (uploads and exports on disk) | Keeps project data on the local machine |

Agents run in-process inside `apps/api` — no extra service beyond the web/API split. The versioned floor-model JSON remains the contract between agents and geometry code.

Execution plan: [phases/](phases/) — 10 core phases and one later stretch.

## Agent quality loop (must-have, not stretch)

Both critical stages run as bounded ADK **LoopAgents** — generate → critique → refine:

- **Parse loop:** ParserAgent produces the floor model → CritiqueAgent compares a rendering of the model against the original plan image and reports missing/extra/misplaced elements → ParserAgent refines. Exit when critique passes or iterations exhaust.
- **Tactile loop:** TactileAgent proposes the layout → the deterministic validator (exposed as an ADK tool) reports every standards violation (spacing, sizes, collisions) → TactileAgent re-lays-out. Exit only at **zero violations**; violations are hard fails, never warnings.

**Confidence scoring (must-have):**

- Every element in the floor model carries `confidence: 0–1`, assigned by ParserAgent and updated by the critique loop.
- Elements below **0.7** are flagged on the edit canvas and listed in a "needs review" panel; the wizard's Next is gated on the user confirming or fixing them.
- Loop continuation is confidence-driven: keep iterating while aggregate confidence < **0.85** and iterations remain.
- Confidence is for AI uncertainty only — deterministic validator failures are binary and never expressed as confidence.

The local demo should show the agent correcting its own extraction and flagging uncertainty for review.

## Out of scope (locked)

Deployment, auth, multi-floor, embosser/swell outputs, print-service integration, non-English labels, hand-drawn plan support, and durable object storage.

## Local acceptance checklist

- [x] README explains how to install and run both services locally with PGlite.
- [ ] A fresh local run can upload a sample plan, complete review and validation, preview the map, and download the STL bundle.
- [ ] Relevant type checks, lint, and tests pass on the local checkout.
