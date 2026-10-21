# Development status

dots supports an environment-configured OpenAI-compatible Chat Completions endpoint, including OpenRouter and OpenAI, plus native Gemini through Google ADK. The example environment selects `google/gemma-4-26b-a4b-it` on OpenRouter as an initial open-weight candidate. Live model quality and application-license selection remain pending; see the [model migration plan](hacktoberfest-open-source-plan.md).

## Verification

Latest recorded checks on 21 October 2026:

- Frozen dependency installation completed. Large package downloads were slow; the successful attempt used Bun with network concurrency 4 and the copyfile backend.
- `bun run build`, `bun run lint`, and `bun run typecheck` passed for the repository.
- `bun test packages/floor-model apps/api/src apps/web/src` passed: 154 tests, zero failures. This includes 44 mocked model-transport/configuration tests covering both provider roots, ordered multimodal inputs, and failure handling.
- The web API-origin checks passed for trailing-slash normalization and a missing environment value.
- Local PostgreSQL migrations passed. The API health check, image upload (201), source retrieval (200), parse start (202), and persisted missing-key failure passed. The browser landing page rendered locally.
- Git whitespace checks and environment-file ignore checks passed. Earlier secret scanning, static asset references, and synthetic-fixture structure checks also passed.

A live image-input connectivity check through OpenRouter with `google/gemma-4-26b-a4b-it` returned the requested JSON successfully. A complete map-generation run with this model remains unverified. These checks do not establish model accuracy or a verified deployment. Optional corpus validation requires the separately supplied `pipeline_tests/corpus-v2.json` and permitted evaluation assets.

## Test and evaluation inputs

Parser and rasterization tests use authored synthetic PNG/PDF fixtures under `test-assets/synthetic/`. The input guide and pitch use an authored perspective SVG.

Publisher-owned evaluation assets, local-only CCH reference plans, and their gallery derivatives are excluded. The optional corpus scripts require separately supplied, permitted inputs. Preserve the remaining reference assets' source and attribution records.

## Release requirements

- Select and verify the open-weight model and endpoint.
- Complete a full map-generation run with the selected model.
- Finalize the application license and dependency notices; MuPDF remains an AGPL/commercial dependency.
- Complete the remaining asset-rights review and prepare the demonstration.
