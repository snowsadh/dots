# dots: open-source migration and single-track submission plan

Status: **Model migration plan for review. dots is published; the open-weight model integration remains pending.**

Researched on **21 October 2026, IST** against the official event pages and this checkout. Source-based summaries below are paraphrases; recommendations, proposed acceptance criteria, and estimates are identified separately. This is a new event plan, not a claim that the earlier hackathon requirements have been met again.

Scope: enter **Best Open-Source AI Project only** with [snowsadh/dots](https://github.com/snowsadh/dots). The open-weight model integration and remaining release requirements are pending. See [development status](development-status.md) for the latest recorded checks.

## 1. Direction

Use an open-weight vision model for dots' core pipeline. Gemma 4 through the Gemini API remains the first integration candidate; Qwen3-VL and Mistral Small are alternatives. Preserve the existing floor-model contract, editor, tactile validation, and STL generation. This track does not require Gemma or DigitalOcean hosting.

- [x] Host permission to proceed confirmed by Vansh on 21 October 2026. Do not request the same permission again.
- [ ] Confirm any remaining work-window and demo-format details; the published submission cutoff is 5:00 PM IST on 21 October.
- [ ] Finalize the model, application license, and working-demo evidence.

Third-party asset rights remain separate from event permission. The excluded research corpus stays excluded.

## 2. Event brief

**Verified event facts, paraphrased:**

| Item | Published information |
| --- | --- |
| Event | Hacktoberfest Hack Day New Delhi x ACTS EDC |
| When | Wednesday, 21 October 2026, 9:00 AM–5:00 PM IST |
| Format | In person, New Delhi, Asia Pacific |
| Venue | Auditorium, University School of Automation and Robotics, GGSIPU East Delhi Campus, New Delhi 110032 |
| Organizer | ACTS EDC; event host listed as Aditya Singh |
| Attendance | University/other students listed; registration text limits offline attendance to shortlisted participants with RSVP confirmation |
| Registration | OrganizerHQ event page; each teammate must register and check in |

Sources: [MLH event listing](https://www.mlh.com/events/hacktoberfest-hack-day-new-delhi-x-acts-edc), [OrganizerHQ event and registration](https://events.mlh.com/events/14935-hacktoberfest-hack-day-new-delhi-x-acts-edc), [2026 participant FAQ](https://hacktoberfest.com/questions).

The registration form requests name, email, leader/member role, phone, shared team name, university/organization, LinkedIn, GitHub, and RSVP. This draft does not collect those details or register either teammate. The event page also links Gemma resources, a quickstart, API documentation, and a beginner guide.

**Selected track description, paraphrased:**

| Track | What matters | dots proposal |
| --- | --- | --- |
| [Best Open-Source AI Project](https://www.mlh.com/events/hacktoberfest-hack-day-new-delhi-x-acts-edc/challenges/01a0d987-0c41-12ea-13ac-5b85755dc2f3) | Original project with a substantial open-source/open-weight AI contribution. Listed prize: winner DEV badge and MLH swag bag. | Open the application and make the selected open-weight vision model responsible for interpreting and reviewing floor plans. |

MLH's general AI challenge guidance requires public GitHub source, an open-source license, and a README explaining setup, models, and dependencies. DigitalOcean hosting is optional. The selected category page now lists **submissions closing 21 October at 5:00 PM IST** and a submission link; that link leads to MLH sign-in. This supersedes the earlier observation that submissions were not open. [Paraphrased: AI challenge guidance](https://www.mlh.com/opensource-ai), [local category and deadline](https://www.mlh.com/events/hacktoberfest-hack-day-new-delhi-x-acts-edc/challenges/01a0d987-0c41-12ea-13ac-5b85755dc2f3).

**Still unverified locally:** permitted hacking window, judging slots and weights, demo duration or required video, team-size restrictions, and additional host instructions. Host permission is confirmed by Vansh's report above. The submission cutoff is explicitly published rather than inferred from event end. Do not reuse the older project's August deadline, four-minute video requirement, or judging percentages.

Hacktoberfest 2026 no longer counts PRs toward rewards. Useful contributor issues remain worthwhile, but manufacturing PR counts is not part of this plan. [Paraphrased: official FAQ](https://hacktoberfest.com/questions).

## 3. What “open source” means for this project

There are three separate decisions:

1. **Application source:** dots needs a license, redistribution rights, public source, and reproducible setup. Using Gemini does not by itself determine whether application code is open source. A project license has not yet been selected; see [development status](development-status.md).
2. **Model:** replace proprietary Gemini model calls with a selected open-weight vision model. Google's current Gemma 4 model card identifies Apache 2.0 licensing; retain the selected model's references and notices separately from the application's license. [Paraphrased: Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4).
3. **Inference hosting:** a Google-hosted API is still an external service. Choosing an open-weight model does not make the deployed service offline, private to the device, or fully self-hosted.

**Proposed claim after verification:** “dots is an open-source floor-plan-to-tactile-map application powered by [tested model], with schema-checked AI output and deterministic tactile validation.” Substitute the model actually used. Describe hosted inference and prototype limitations alongside that claim. Do not claim certification, guaranteed navigational safety, or validation by blind readers without evidence.

## 4. Current implementation

Verified through source inspection; these are not fresh runtime test results.

| Area | Current implementation | Migration consequence |
| --- | --- | --- |
| Product | Upload → parse/review → edit → tactile conversion → STL export | Preserve the user flow and existing components. |
| Shared model boundary | `apps/api/src/agents/llm.ts`: `gemini`/`openrouter`, model selectors, ADK runner, multimodal message parts, JSON/Zod validation | Main integration point; avoid rewriting each agent. |
| Production AI | Parser, critique, openings audit, prompt edit, tactile layout | Proposed default: all five use the chosen open-weight model. This is a project scope choice, not a rule that every component must be open. |
| Evaluation AI | `agents/compare.ts`, invoked by `apps/api/scripts/compare-maps.ts` and `run-corpus.ts` | Sixth role; migrate if used, including its ordered three-image input. |
| Study config | `apps/api/scripts/run-corpus.ts` duplicates model defaults/configuration | Update its independent defaults and attribution too. |
| Geometry | Shared `packages/floor-model`, deterministic validator, API mesh generation | Keep schemas, units, geometry checks, and export gates. |
| Data/runtime | Bun 1.3.14, Hono, PostgreSQL/Drizzle; Next.js 16.3.1 and React 19.2.8 | Keep the existing stack; no database migration is inherent to changing models. |
| Storage | Source files and exports on service filesystem | Document persistence limits; PostgreSQL alone does not preserve those files across container replacement. |
| Access | Optional Google sign-in UI; API routes lack project-owner enforcement | Sign-in is not protection for uploaded plans. Use non-sensitive demo inputs; do not present the hosted prototype as private storage. |
| Publication | No tracked LICENSE/NOTICE/CONTRIBUTING found | Licensing and reproducibility are actual release tasks. |

The model selectors are `MODEL_CRITICAL` for parser/critique/openings, `MODEL_FAST` for edit, `MODEL_LAYOUT` for tactile placement, and `MODEL_COMPARE` for the study judge. Parser requests can include the source plus multiple detail crops; critique also compares images. A text-only compatibility test is insufficient.

The existing openings-audit failure path can retain an accepted model without a completed audit. Test this path and make its outcome explicit before claiming every map was independently audited. A model's confidence is also not proof of extraction accuracy.

Historical documents: [product brief](idea.md), [older requirements](requirements.md), [deployment notes](deploy.md), and [README](../README.md). The older requirements lock Gemini/Vertex and describe ADK LoopAgents; current orchestration uses bounded TypeScript loops. Their earlier hackathon obligations must not be copied into this event's checklist. Preserve product requirements while updating model and event claims after review.

## 5. Model and integration choices

### Can we keep Gemini?

The requirement is a substantial **open-source/open-weight AI contribution**, not a particular brand or hosting provider. An ordinary Gemini-only application does not establish that contribution merely because its application code is published. Gemini model weights are proprietary; **Gemma is a different model family**. Calling Gemma through the Gemini API still uses Gemma, so the API name is not the eligibility test.

The guidance does not explicitly forbid every proprietary component. A hybrid could meet its wording if the open AI performs important work, but a token open-model feature beside a Gemini-powered core is a weak basis for entry. The category also permits original/meaningfully improved open-source harnesses; it does not say every harness must use open weights. Do not assume a renamed app or simply using ADK proves that alternative route. Obtain organizer confirmation for a Gemini-backed harness interpretation. **Our recommendation is the clearer application route: an open-weight model performs actual floor-plan extraction and review.** This is an interpretation of the [published challenge guidance](https://www.mlh.com/opensource-ai), not a host ruling on dots.

### Vision model shortlist

These are researched candidates, not floor-plan benchmark winners. dots needs image understanding, ordered multiple-image support, geometry-rich JSON, and reliable schema validation. A text-only model cannot directly replace the current multimodal parser without a different architecture.

| Candidate | Verified model facts, paraphrased | Practical choice for dots |
| --- | --- | --- |
| [Gemma 4 26B A4B / 31B](https://ai.google.dev/gemma/docs/core/model_card_4) | Open weights, image input, Apache 2.0; Google's hosted API documents both instruction-tuned IDs | First hosted integration candidate because the current app already uses Google's generation interfaces. Still requires compatibility tests. |
| [Qwen3-VL-8B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct) | Downloadable vision-language weights, Apache 2.0; official examples include multi-image use and serving | Alternative if we prefer its visual extraction results or a smaller self-hosted candidate. Test actual hardware/runtime and output quality. |
| [Mistral-Small-3.2-24B-Instruct-2506](https://huggingface.co/mistralai/Mistral-Small-3.2-24B-Instruct-2506) | Downloadable Apache 2.0 weights, vision and function-calling support | Another multimodal alternative; verify endpoint availability, multi-image handling, and structured-output behavior. |

Choose **one** initially. Hosted provider availability, quotas, prices, and dots accuracy for Qwen/Mistral have not been tested. No requirement to fine-tune a model, train from scratch, create an agent skill, or implement a harness applies to choosing the ordinary model-powered application route.

### Inference route

| Choice | Benefit | Cost/constraint | Proposal |
| --- | --- | --- | --- |
| Gemma 4 through Gemini API | Official event-aligned path; no model-serving infrastructure to build | API key, network access, quota, external data processing; compatibility still needs testing | **Start here.** |
| Locally/self-hosted Gemma 4 | Control over inference environment; possible local handling of plan images | Hardware capacity, downloads, vision support, runtime/version compatibility, deployment work | Later milestone, unless local inference is an explicit requirement. |

Google documents hosted IDs `gemma-4-26b-a4b-it` and `gemma-4-31b-it`, image input, system instructions, function calling, and `@google/genai`'s `models.generateContent`. Gemma thinking uses on/off levels rather than assuming Gemini's numeric thinking budget transfers unchanged. This documentation does not prove compatibility with this pinned ADK version or all dots schemas. [Paraphrased: official hosted Gemma guide](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api).

**Proposed first candidate:** `gemma-4-26b-a4b-it` for every role, to minimize configuration variables. Compare 31B only if quality or request behavior warrants it. No claim that either is faster, cheaper, or more accurate on dots has been established. Select and record the tested model before release.

### Integration seam

The steps below describe the first-choice Gemma experiment. If Qwen or Mistral is selected instead, use one verified hosted vision endpoint or self-hosted compatible server at the same shared call boundary. Reuse the existing multimodal serialization where compatible; verify the exact model ID and schema options. Do not implement all candidates just to keep options open.

1. First test whether the existing ADK path can accept the exact Gemma ID, multi-image input, output schema, and supported generation settings. If it works, reuse it.
2. If it fails, add one direct hosted Gemma path at `runAgentTurn` in `llm.ts`, following the existing provider switch. Keep the agents' message and result contracts. Declare `@google/genai` as a direct dependency and update `bun.lock` if importing it directly; do not rely on a transitive SDK.
3. Verify provider-supported JSON MIME/schema options. If server-side enforcement is unavailable, document application-side validation and use the existing schema parser and bounded retries. Never accept unvalidated output or describe prompt-only JSON as server-enforced.

Do not build a generic multi-provider framework, remove ADK just because it is Google software, or route failures silently back to proprietary Gemini. Missing keys, unsupported models/settings, quota errors, truncation, and exhausted retries must produce actionable failures. Keep all four model selectors explicit and reject accidental Gemini IDs in the Gemma configuration.

## 6. Publication blockers and license choice

### Application license

`apps/api/package.json` declares MuPDF, and `bun.lock` resolves **1.28.0**. PDF upload rasterization uses it. Artifex offers MuPDF under AGPL or commercial terms; adding an MIT file alone does not resolve the combined application's obligations. This is supported by both the versioned license documentation and the maintainer's JavaScript repository. [Paraphrased: MuPDF 1.28.0 license](https://mupdf.readthedocs.io/en/1.28.0/license.html), [Artifex MuPDF.js](https://github.com/ArtifexSoftware/mupdf.js/).

| Option | Scope | Recommendation for review |
| --- | --- | --- |
| Keep MuPDF; release compatible application under AGPL-3.0-or-later | Verify ownership/dependency compatibility, add license and third-party notices, provide corresponding source for the deployed version | Smallest proposed route if both authors accept copyleft. |
| Use a permissive application license | First replace MuPDF with a suitable licensed renderer and verify PDFs, crops, scaling, errors, packaging, and deployment | Larger scope; choose only if permissive licensing is a requirement. |

Final licensing must cover contributions from every existing author and relevant dependencies. Neither the model's Apache license nor the application license grants rights to third-party floor plans or photos. Do not distribute model weights unless separately needed and their distribution requirements are satisfied.

### Files, assets, and history

Publication requires an inventory, not just changing repository visibility:

- The CCH visual reference plans marked local-only are excluded. Retain the remaining reference assets' source and attribution records.
- Publisher-owned evaluation assets and their gallery derivatives are excluded. Optional corpus scripts require separately supplied, permitted inputs.
- Keep only rights-cleared assets, with exact licenses/attributions. Prefer a newly authored simple plan for the event demo and repeatable tests.
- Rasterization and parser tests use authored synthetic PNG/PDF fixtures instead of external evaluation assets.
- Scan intended source **and history** for credentials, private uploads, logs, personal data, and restricted assets. Deleting from the current tree does not remove prior history. Rotate any exposed credentials before publishing.

Proposed release files: `LICENSE`, `THIRD_PARTY_NOTICES.md`, `CONTRIBUTING.md`, `SECURITY.md`, and one small CI workflow using the existing Bun commands. Keep contribution guidance short: setup, checks, fixture rights, bug reports, and the rule that model output cannot bypass geometry validation. Create a few real contributor tasks only after the basic release works.

## 7. Sequenced execution plan

| Step | Work and likely files | Completion check |
| --- | --- | --- |
| 0. Confirm scope | Host permission and deadline recorded; license choice and any remaining work-window details pending | Accept the permission already reported; resolve the remaining release decisions. |
| 1. Establish baseline | Complete dependency installation and repeat the blocked checks | Record results in development-status.md. |
| 2. Prove Gemma compatibility | Small live image request, source-plus-crops request, strict floor-model output, edit operation, layout response | Exact model/endpoint/settings recorded; schema-valid results; unsupported features fail explicitly. Stop here if feasibility fails. |
| 3. Migrate model calls | `agents/llm.ts`, `llm.test.ts`, role configs only where necessary, API env example; API manifest/lockfile if needed | All five production roles use the chosen open-weight model; study comparison and duplicated corpus settings are covered; no implicit proprietary-model path. |
| 4. Verify full behavior | Existing parse/edit/tactile/export flow; adapter and affected tests | Correct source geometry, valid edits, visible uncertainty, zero encoded tactile violations, downloadable map/legend STLs. |
| 5. Prepare public source | License/notices, rights-cleared fixtures and gallery, example envs, setup/docs, minimal CI | A fresh checkout can install, migrate, run, and execute checks without access to the authors' cloud accounts or private files. A hosted model key is still required. |
| 6. Prepare demo and entry | README, new event submission text, truthful model copy in `apps/web/src/data/landing.ts`, current architecture labels | Anonymous reviewer can inspect source/license and reproduce the demonstrated result. Demo evidence identifies model and new work. |
| 7. Publish and submit | Approved source release to `snowsadh/dots`, deployed configuration, event submission form | Verify public accessibility, select Best Open-Source AI Project only, submit before 5:00 PM IST, save receipt/status. This is a later execution step. |

OAuth should stay optional for local use. Document Bun 1.3.14, PostgreSQL, `DATABASE_URL`, the tested model credential/settings, API URL, and upload directory. The default hosted Gemma setup should not require Vertex ADC or access to the original Google Cloud project. Keep existing hosting unless a demonstrated requirement forces a move; DigitalOcean is not a compulsory migration.

Check the actual API configuration and an inference request after deployment. A new README does not prove an existing live URL has switched models. Use only public/non-sensitive demo plans until project access control is addressed; a broader production security and durable-storage release is separate scope.

## 8. Verification and evidence

Run from the repository root after implementation; record failures and their causes:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run lint
bun test packages/floor-model apps/api/src apps/web/src
bun run build
```

Use the existing PostgreSQL migration instructions for the isolated demo database. On macOS, check/start Colima before Docker commands; do not use Docker Desktop. Never point a test migration or destructive fixture cleanup at the current deployed database.

**Minimum new automated checks:**

- Exact Gemma model, system instruction, ordered source/crop image parts, and supported generation options reach the provider.
- Invalid JSON/schema, no output, truncation, provider rejection, and exhausted retries cannot become a successful map or silent Gemini call.
- The migrated provider retains the existing edit-operation and tactile-validation contracts. Add focused regressions only where behavior changes.

**Proposed live acceptance set:** a simple newly authored plan, a second distinct permitted plan, one PDF, and a deliberately unsuitable input. Some may overlap. Record model ID, input provenance, latency, call count, review iterations, human corrections, final violations, and outcome. Include every production role; deliberately exercise layout repair rather than assuming a no-collision run tested it. Run the study judge on permitted images only if that evaluation is part of the submission.

Manually compare entrances, doors, room adjacency, labels, and navigation-critical features against each input. Schema validity and a zero-violation tactile design do not prove the source was interpreted correctly. Inspect a downloaded STL in the existing 3D preview or a slicer. Physical print/readability testing is separate evidence; state clearly if it was not done. Do not report a Gemma-versus-Gemini improvement without a comparable measured baseline, or use the model judge's score as a substitute for human validation.

## 9. Two-person work split and time budget

**Proposed ownership, adjustable after review:**

- **Vansh:** Gemma compatibility spike, shared provider change, model settings, automated checks, deployed model verification.
- **Snow:** host-rule confirmation, asset/license inventory, fresh-install rehearsal, demo inputs and manual review, submission draft and demo rehearsal.
- **Together:** license choice, navigation-quality review, demo, and final public-source/submission checks. These assignments are a proposal, not assumptions about either person's experience.

After the compatibility decision, model work and documentation/rights review can run concurrently with separate file ownership.

**Estimated remaining implementation effort, not a promise:** rules/scope 10–15 minutes; compatibility spike 20–30; focused integration 45–75; full-flow verification 30–45; documentation/rights/release preparation 45–60 in parallel; final demo/submission buffer at least 20–30. Missing asset rights, incompatible ADK behavior, or broken baseline checks can exceed this budget.

The event and published submission cutoff are today, **21 October 2026, 5:00 PM IST**. Recompute available time when this plan is approved. Prioritize a working permitted demo and required publication over local model serving, a host migration, UI redesign, or a large benchmark. If safe publication or eligibility cannot be resolved in time, do not imply readiness.

## 10. Demo and submission preparation

Proposed pitch, to use only after the described behavior is verified:

> dots turns a floor plan into an editable tactile-map design and printable STL files. [Tested open-weight model] interprets and reviews the visual plan, while deterministic code checks tactile geometry before export. The source, model configuration, and reproducible examples are available for others to inspect and improve.

Suggested demonstration sequence; adapt to the host's duration:

1. State the accessibility problem and the project scope.
2. Show a permitted source plan and the actual open-weight model configuration.
3. Show its extraction, an uncertain/mistaken feature, and a real correction.
4. Show deterministic validation, the tactile preview, and downloaded STL output.
5. Show the public license/setup and identify the work completed during this event.

A recorded successful run may back up a slow live pipeline if clearly labeled. Earlier Gemini-generated gallery outputs cannot be presented as results of the new model. Disclose coding assistants used and distinguish tested behavior from intended features.

**Submission preparation, paraphrased from MLH guidance:** one teammate uses the event's Challenges form, supplies the repository, project details and technologies, adds a demo URL if available, and selects **Best Open-Source AI Project only**. Verify acceptance afterward. Do not assume Devpost is this event's submission destination. [Official submission guidance](https://www.mlh.com/opensource-ai).

## 11. Review decisions

| Decision | Proposed answer | Final answer/evidence |
| --- | --- | --- |
| Repository? | `snowsadh/dots` | Published; write access confirmed |
| Is the goal an open application + open-weight AI, or mandatory offline inference? | Hosted Gemma first; no offline claim | Pending review |
| Application license? | Retain MuPDF and use compatible AGPL-3.0-or-later, subject to rights review | Pending author agreement |
| Initial model? | Hosted `gemma-4-26b-a4b-it` first; Qwen3-VL/Mistral alternatives; no Gemma track obligation | Selection and live tests pending |
| Integration? | Existing ADK if proven; otherwise one direct Gemma path | Untested |
| Which source history and assets can be published? | Rights-cleared source only, with provenance | Inventory pending |
| Submission cutoff and demo requirements? | Published cutoff 21 October, 5:00 PM IST; ask locally about demo format and work window | Cutoff verified; other details pending |
| Team ownership? | Vansh model work; Snow release/demo work; shared quality review | Pending review |

## 12. What has and has not been verified in this draft

Completed: official event/category/OrganizerHQ/MLH rule research; official Gemma 4 model/API documentation review; versioned MuPDF licensing cross-check; inspection of dots' model boundary, callers, scripts, manifests, documentation, fixture provenance, and repository state.

Host permission: confirmed by Vansh on 21 October 2026. The repository is published and GitHub write access is confirmed.

Pending: registration/check-in checks, exhaustive dependency/asset-license review, author licensing consent, complete dependency installation and passing checks, live model calls, deployment, physical prints, and submission. See [development status](development-status.md#verification) for the attempted checks and their dependency limitations. This draft makes no passing-test or working-model claim.

Review and revise this plan before implementing the model migration.
