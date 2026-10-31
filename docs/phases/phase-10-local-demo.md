# Phase 10 — Local demo and verification

**Goal:** run the complete floor-plan-to-STL flow locally and verify its output.

**Depends on:** everything demoable end to end (Phases 1–5 + 7–9 minimum).

## Work

- Start `apps/web` and `apps/api` locally with PGlite and the configured Gemini credentials.
- Smoke-test the complete flow at `http://localhost:3000` using a sample floor plan.
- Verify parse review, a canvas or prompt edit, tactile validation, STL preview, and download.
- Run the repository's type checks, lint, and tests. Keep the README's local setup steps reproducible.

## Done when

A fresh local setup completes the flow and produces a printable map and legend STL bundle without a hosted web app, API, or database.
