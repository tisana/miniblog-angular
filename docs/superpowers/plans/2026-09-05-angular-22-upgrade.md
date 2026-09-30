# Angular 22 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILLS: Use `superpowers:using-git-worktrees`, then `superpowers:subagent-driven-development`. Execute sequentially with one implementation writer and an independent review at each checkpoint. Stop on failure. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade miniblog-angular from Angular 20.3.x to the latest stable Angular 22.x while preserving application behavior and maintaining strict dependency resolution.

**Architecture:** Upgrade sequentially through Angular 21 and 22. Keep NgModules, Zone.js, Karma, and existing APIs during the version migration. Apply the modern application-builder migration only after Angular 22 passes its own verification gate.

**Tech Stack:** Angular, Angular CLI, Angular Material/CDK, TypeScript 6.0.x, RxJS 7.8.x, Zone.js, Karma/Jasmine, Node.js 24.

**Spec:** This document is the authoritative upgrade specification and implementation plan; no separate design document exists.

## Global Constraints

- Use branch `codex/angular-22-upgrade` in an isolated worktree.
- Do not commit, push, or create a PR without explicit user authorization.
- Never use `--force`, `--legacy-peer-deps`, or peer-dependency overrides.
- Upgrade one Angular major at a time: latest 20.x -> latest 21.x -> latest 22.x.
- Upgrade Angular framework packages as one compatible group.
- Upgrade Angular Material and CDK together.
- Keep Karma/Jasmine; decline the optional Vitest migration.
- Keep NgModules, Zone.js, and `BrowserAnimationsModule`.
- Preserve current browser support and REST API behavior.
- Target Node engine `^22.22.3 || ^24.15.0 || ^26.0.0`; use Node `24.15.0` in CI.
- A checkpoint is accepted only after `npm ci`, unit tests, production build, and diff validation pass.
- The no-commit rule overrides skill defaults for checkpoint commits, commit-based reviews, and branch finishing. Do not enable automatic migration commits.
- Use `--allow-dirty` only after the plan-owned-change guard below passes; it is not permission to bypass dependency checks.

## Subagent Execution and Model Routing

### 1. Sequential execution with review gates

Use this order:

`Task 1 -> review -> Task 2 -> review -> Task 3 -> review -> Task 4 -> review -> Task 5 -> review -> Task 6a -> Task 6b -> review -> final whole-change review`

Tasks 2-5 mutate the same dependency graph, lockfile, installed packages, and configuration. Never run their implementers, migrations, installs, tests, or builds concurrently. Use one isolated worktree on `codex/angular-22-upgrade` and one implementation writer at a time. Do not create a separate worktree for each task or split the two small regression-test files into parallel tasks.

Independent read-only research may run in parallel if it does not depend on a changing checkout. Reviews operate on a frozen completed checkpoint; implementation pauses until review finishes. On a failed command or rejected review, stop advancement, record the failure, and diagnose within that checkpoint. Do not begin the next task until the current gate passes.

### 2. Models, ownership, and progress ledger

These are recommended task-specific allocations, not measured cost or performance guarantees. Confirm model IDs against the execution session's available models; if unavailable, ask before substituting. Start the coordinating session with the recommended model where available; changing a child model does not change the coordinator.

| Role / task | Model | Reasoning | Exclusive write ownership while active |
|---|---|---|---|
| Coordinator | `gpt-6.1-sol` | medium | Plan checkboxes, progress ledger, task briefs, review packages; no concurrent source edits |
| Task 1: baseline and regression tests | `gpt-6.1-sol` | high | The two component spec files listed in Task 1 |
| Task 2: latest Angular 20 patch | `gpt-6.1-sol` | medium | Package manifests and official migration changes |
| Task 3: Angular 20 to 21 | `gpt-6.1-sol` | high | Package manifests and official migration changes |
| Task 4: Angular 21 to 22 | `gpt-6.1-sol` | high | Package manifests, migration changes, and CI Node settings |
| Task 5: application builder | `gpt-6.1-sol` | high | Builder configuration, manifests, and official migration changes |
| Task 6a: README (Task 6, Step 1) | `gpt-6-luna` | medium | `README.md` only |
| Task 6b: final validation (Task 6, Steps 2-5) | `gpt-6.1-sol` | high | Validation/smoke-test report only; return source fixes to the relevant implementer |
| Independent checkpoint reviewer | `gpt-6.1-sol` | high | Own review report only; no source edits |
| Final whole-change reviewer | `gpt-6-astra` | high | Final review report only; no source edits |

- Dispatch a fresh implementer per task with `fork_turns: "none"` and explicit `model` and `reasoning_effort`. Provide the absolute worktree path, exact task text, global constraints, allowed files, required prior evidence, and report path. Do not copy the full conversation history. Task 6a and 6b are sequential assignments within one Task 6 checkpoint.
- Children must not delegate further. The coordinator owns task dispatch and integration. Any migration touching an unexpected file must be reported and reviewed before that checkpoint is accepted; it does not authorize unrelated modernization.
- Resume the original implementer for review fixes. Escalate a substantive unresolved reasoning blocker from `gpt-6.1-sol` to `gpt-6-astra` with the failing evidence and attempts already made. Permission or runtime availability failures require environment resolution, not a model upgrade.
- Store execution evidence under `.superpowers/sdd/2026-09-05-angular-22-upgrade/`: `ledger.md`, task briefs, before/after snapshots, command logs, and implementer/reviewer reports. If this directory is not already ignored, use a documented external scratch directory and record its absolute path instead of changing shared ignore rules just for execution evidence.
- The ledger records worktree/branch/base SHA, task owner/model/effort, owned files, status (`PENDING`, `RUNNING`, `FAILED`, `REVIEW`, `ACCEPTED`), snapshot identifiers, commands/exit codes/log paths, both review verdicts, adjudications, residual risks, and next action. Track local automated validation, backend smoke acceptance, and remote CI separately.
- On resume, read the ledger and reconcile actual file hashes/status before dispatch. Do not repeat accepted tasks unless their evidence was invalidated. Keep detailed reports in files and return concise summaries with paths.

### 3. Review uncommitted and untracked work

No commit, push, or PR is authorized by this plan. Do not stage files solely to make a review tool see them. A `HEAD`-to-`HEAD` comparison or commit-only review is insufficient because the implementation remains uncommitted.

Before and after each task, capture source-file snapshots and SHA-256 manifests (including relevant new untracked files, excluding generated output, dependencies, and evidence directories). Preserve the original baseline and the previous accepted checkpoint. Supply each reviewer with both the task delta against the previous snapshot and the cumulative change against the original baseline, including complete contents of newly created files.

Use all of the following inventories when assembling the review package:

```powershell
git status --short --untracked-files=all
git diff --binary HEAD
git diff --cached --name-only
git ls-files --others --exclude-standard
git diff --check
git diff --cached --check
```

`git diff` does not include untracked content. Inspect every in-scope untracked file explicitly and check its whitespace/content separately; include those files in the snapshots and reviewer package. Keep report/snapshot data outside its own snapshot inventory.

Each checkpoint gets a fresh independent reviewer who assesses both specification compliance and code quality and returns separate `Spec: ACCEPT` and `Quality: ACCEPT` verdicts, or actionable rejection findings. The coordinator may accept the checkpoint only after both verdicts and its required verification gate pass. Task 6a is reviewed together with Task 6b as Task 6. Reuse command evidence only when it covers the exact unchanged source/configuration/dependency state under review; fixes invalidate affected evidence and require reruns. The final reviewer checks the entire cumulative change, not merely Task 6.

### 4. Plan-owned-change guard for `ng update --allow-dirty`

Task 1 leaves regression tests uncommitted, and later checkpoints accumulate migration changes. Use the `--allow-dirty` variants below only after this guard passes before **each** migration invocation:

1. Inspect `git status --short --untracked-files=all`, tracked/staged diffs, and every untracked source/document file.
2. Match every dirty file to the handoff document or a recorded task-owned change in the ledger, and compare against the last recorded snapshot. Include changes from an earlier migration in the same task; inspect and snapshot them before the next invocation.
3. Confirm there are no unexplained or unrelated edits, no concurrent writer, and the previous checkpoint was accepted. Save the pre-invocation snapshot and record authorization to use the flag in the ledger.
4. If ownership is uncertain, stop and ask for direction. Do not stash, reset, delete, or commit someone else's work to make the guard pass.

On a clean tree, omit `--allow-dirty`. This flag only permits an understood dirty working tree; strict peer resolution and all install/test/build/review gates remain mandatory. Never combine it with `--force`, `--legacy-peer-deps`, peer overrides, or automatic commit options. A migration failure stops the checkpoint even if earlier migrations succeeded.

### 5. Local completion versus remote acceptance

Local automated completion requires all checkpoint commands and both review verdicts, plus final whole-change review. Backend CRUD smoke acceptance is a separate gate and stays pending if the backend is unavailable. Passing local commands does not prove GitHub Actions or CodeQL passed.

Remote acceptance remains `PENDING - user authorization required` until the user authorizes the necessary commit/push/PR actions. After authorized publication, record the exact tested commit, workflow run links, and results for Unit Tests, Build & Upload Artifact, and CodeQL. Do not infer success from older runs or a local build. Until then, hand off the preserved uncommitted work and report local results, smoke-test status, and pending remote CI independently. Do not claim full production acceptance while either smoke testing or remote CI is pending.

---

## Risk Controls

| Risk | Level | Control |
|---|---:|---|
| Angular peer mismatch or `ERESOLVE` | High | Use `ng update`, upgrade coherent package groups, and require `npm ci` after every major. |
| Angular 22 OnPush default | High | Keep the generated `ChangeDetectionStrategy.Eager` metadata and add async rendering tests before upgrading. |
| Weak regression coverage | High | Add component tests for card and category data arriving asynchronously. |
| TypeScript 6/Node compatibility | Medium | Update engines and CI; reject any TypeScript version outside `>=6.0 <6.1`. |
| Webpack-to-application builder | Medium | Perform it only after Angular 22 passes; verify output paths and development serving separately. |
| Material rendering changes | Medium | Run route, form-control, layout, and CRUD smoke tests. |
| Vitest migration churn | Avoided | Explicitly decline it and retain the current Karma test command. |

## Task 1: Establish the Baseline and Regression Coverage

**Files:**

- Create: `src/app/cards/cards.component.spec.ts`
- Create: `src/app/cards/card-detail/card-detail.component.spec.ts`
- Reference: `src/app/cards/cards.component.ts`
- Reference: `src/app/cards/card-detail/card-detail.component.ts`

**Interfaces:**

- Consumes: `CardService`, `ActivatedRoute`, `Router`, `Location`, and the existing component templates.
- Produces: Karma/Jasmine regression coverage for asynchronous card/category loading and CRUD navigation.

- [ ] **Step 1: Confirm the isolated worktree starts clean**

  ```powershell
  git status --short
  node -v
  npm -v
  npm run ng -- version
  npm ci
  npm test
  npm run build
  ```

  Expected baseline: Angular 20.3.x, Node 24.15.0 or another supported current runtime, three existing tests passing, and a successful production build.

  Record the clean checkout status before introducing plan files. If this handoff is untracked in the original checkout, it will not be copied automatically into a new worktree: copy it explicitly after the clean-baseline check, without committing, and record it as a known plan-owned document change. Do not assume the expected versions/test count are current; record the observed baseline and stop on an unexpected failing gate.

- [ ] **Step 2: Add `CardsComponent` tests**

  Create `src/app/cards/cards.component.spec.ts` using Karma/Jasmine with these cases:

  - `calls CardService.getCards on initialization`
  - `renders cards emitted asynchronously by CardService`
  - Use a `Subject<Card[]>`, emit after the initial `fixture.detectChanges()`, and assert the rendered title, content, author, and status icon.

- [ ] **Step 3: Add `CardDetailComponent` tests**

  Create `src/app/cards/card-detail/card-detail.component.spec.ts` using Karma/Jasmine with these cases:

  - Edit route `id=7` requests card 7 and categories.
  - Card and category values emitted asynchronously populate component state and form controls.
  - Add route without an ID creates a new card and does not call `getCard`.
  - Save in add mode calls `addCard` and navigates to `/cards`.
  - Delete in edit mode calls `deleteCard` and navigates to `/cards`.

  Use Jasmine spy objects for `CardService`, `Router`, and `Location`; use `convertToParamMap` for the `ActivatedRoute` stub. Import only the Angular Material, Forms, and Router modules required by the component templates.

- [ ] **Step 4: Verify the regression tests**

  ```powershell
  npm test
  npm run build
  git diff --check
  ```

  Do not begin dependency updates until all new tests pass.

## Task 2: Normalize to the Latest Angular 20 Patch

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Review: all files changed by official Angular migrations

**Interfaces:**

- Consumes: the passing Angular 20 baseline from Task 1.
- Produces: a strict-installable latest Angular 20.x dependency graph.

- [ ] **Step 1: Run the official Angular 20 migrations**

  ```powershell
  npx ng update @angular/cli@^20 @angular/core@^20 --allow-dirty
  npx ng update @angular/material@^20 --allow-dirty
  ```

- [ ] **Step 2: Review dependency coherence**

  Confirm Angular core/runtime/compiler packages form a compatible 20.x group and Material/CDK share the same version. Do not accept forced peer resolutions.

- [ ] **Step 3: Verify the Angular 20 checkpoint**

  ```powershell
  npm ci
  npm ls @angular/core @angular/compiler @angular/compiler-cli @angular/cli @angular/build @angular-devkit/build-angular @angular/material @angular/cdk typescript --depth=0
  npm test
  npm run build
  git diff --check
  ```

  Stop and diagnose any invalid dependency, peer warning, failed migration, test failure, or build failure before continuing.

## Task 3: Upgrade Angular 20 to Angular 21

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Review: `src/app/app.module.ts`
- Review: TypeScript configuration and all migration-edited sources

**Interfaces:**

- Consumes: the verified latest Angular 20.x checkpoint.
- Produces: a verified Angular 21.x application without top-level Angular 20 dependencies.

- [ ] **Step 1: Run the Angular 21 migrations**

  ```powershell
  npx ng update @angular/cli@^21 @angular/core@^21 --allow-dirty
  npx ng update @angular/material@^21 --allow-dirty
  ```

- [ ] **Step 2: Review migration output**

  Review `provideZoneChangeDetection` compatibility changes, TypeScript/compiler configuration changes, host-binding diagnostics, and Material/CDK removals. Confirm the application does not reference removed v21 APIs.

- [ ] **Step 3: Confirm no Angular 20 package remains at the top level**

  ```powershell
  npm ls @angular/core @angular/compiler @angular/compiler-cli @angular/cli @angular/build @angular-devkit/build-angular @angular/material @angular/cdk typescript --depth=0
  ```

- [ ] **Step 4: Verify the Angular 21 checkpoint**

  ```powershell
  npm ci
  npm test
  npm run build
  git diff --check
  ```

## Task 4: Upgrade Angular 21 to Angular 22

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify via migration: `src/app/app.component.ts`
- Modify via migration: `src/app/cards/cards.component.ts`
- Modify via migration: `src/app/cards/card-detail/card-detail.component.ts`
- Modify: `.github/workflows/ci.yml`
- Review: TypeScript configuration and all migration-edited sources

**Interfaces:**

- Consumes: the verified Angular 21.x checkpoint.
- Produces: a verified Angular 22.x application that still uses the existing build system and Karma.

- [ ] **Step 1: Run the Angular 22 framework migrations**

  ```powershell
  npx ng update @angular/cli@^22 @angular/core@^22 --allow-dirty
  ```

  When optional migrations are offered:

  - Decline `migrate-karma-to-vitest`.
  - Defer `use-application-builder`.
  - Allow all mandatory Angular core and workspace migrations.

- [ ] **Step 2: Upgrade Material and CDK**

  ```powershell
  npx ng update @angular/material@^22 --allow-dirty
  ```

- [ ] **Step 3: Review Angular 22 compatibility changes**

  Require these outcomes:

  - `AppComponent`, `CardsComponent`, and `CardDetailComponent` explicitly use `ChangeDetectionStrategy.Eager`; retain it to preserve current behavior.
  - TypeScript resolves to `>=6.0 <6.1`.
  - Retain generated temporary `strictTemplates` or extended-diagnostic compatibility settings.
  - Keep RxJS 7.8.x and a supported Zone.js 0.15.x or 0.16.x version.
  - Keep `@angular/animations` while `BrowserAnimationsModule` remains in use.
  - Material and CDK resolve to the same 22.x version.

- [ ] **Step 4: Update the supported Node contract**

  Set the `package.json` engine to:

  ```json
  {
    "node": "^22.22.3 || ^24.15.0 || ^26.0.0"
  }
  ```

  Set both Node setup steps in `.github/workflows/ci.yml` to:

  ```yaml
  node-version: "24.15.0"
  ```

- [ ] **Step 5: Verify Angular 22 before changing the build system**

  ```powershell
  npm ci
  npm ls @angular/core @angular/compiler @angular/compiler-cli @angular/cli @angular/build @angular-devkit/build-angular @angular/material @angular/cdk typescript rxjs zone.js --depth=0
  npm test
  npm run build
  git diff --check
  ```

## Task 5: Migrate from Webpack to the Application Builder

**Files:**

- Modify via migration: `angular.json`
- Modify via migration: `package.json`
- Modify via migration: `package-lock.json`
- Review: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: the verified Angular 22.x application from Task 4.
- Produces: production and development builds using `@angular/build:application`, while retaining Karma.

- [ ] **Step 1: Run the deferred builder migration**

  ```powershell
  npx ng update @angular/cli --name use-application-builder --allow-dirty
  ```

- [ ] **Step 2: Review `angular.json`**

  Require these outcomes:

  - Build target uses `@angular/build:application`.
  - `main` is converted to `browser`.
  - `polyfills` uses array form.
  - Obsolete `buildOptimizer` and `vendorChunk` options are removed.
  - Serve and extract-i18n targets reference valid Angular 22 builders.
  - `@angular-devkit/build-angular` is removed only if no target still references it.
  - Karma remains the unit-test runner.

- [ ] **Step 3: Verify output and CI artifact coverage**

  Build and locate the emitted `index.html`. The expected application-builder location is `dist/miniblog-ang/browser/`; use the actual verified location in documentation. Confirm the CI artifact upload remains `dist/` so it includes the nested output.

- [ ] **Step 4: Verify the application-builder checkpoint**

  ```powershell
  npm ci
  npm test
  npm run build
  npm run ng -- version
  git diff --check
  ```

## Task 6: Update Documentation and Perform Final Validation

**Assignments:** Task 6a owns Step 1 (`gpt-6-luna`, medium); after it finishes, Task 6b owns Steps 2-5 (`gpt-6.1-sol`, high). Review them as one checkpoint after the full verification gate. No concurrent README edits during final validation.

**Files:**

- Modify: `README.md`
- Preserve unless officially migrated: `.browserslistrc`

**Interfaces:**

- Consumes: verified Angular 22 dependencies and application-builder output.
- Produces: accurate setup/build documentation and final upgrade evidence.

- [ ] **Step 1: Update `README.md`**

  Document:

  - Angular CLI 22.x.
  - The supported Node engine range.
  - Node 24.15.0 as the CI reference runtime.
  - Karma/Jasmine remains the test runner.
  - The verified application-builder output directory.
  - The backend remains at `http://localhost:8081`.

- [ ] **Step 2: Preserve browser support intentionally**

  Preserve `.browserslistrc` unless an official migration changes it or Angular 22 reports an unsupported query. Do not silently broaden or narrow browser support.

- [ ] **Step 3: Run the final automated gate**

  ```powershell
  npm ci
  npm ls @angular/core @angular/compiler @angular/compiler-cli @angular/cli @angular/build @angular/material @angular/cdk typescript rxjs zone.js --depth=0
  npm test
  npm run build
  git diff --check
  git status --short
  git diff --name-only
  git ls-files --others --exclude-standard
  ```

  Confirm every changed file belongs to the upgrade, regression tests, CI runtime, or documentation.

- [ ] **Step 4: Run the application smoke test**

  Start the app with the backend on port 8081 and verify:

  - `/cards` renders cards received from HTTP.
  - `/card/add` loads categories and submits a new card.
  - `/card/edit/:id` loads and updates the selected card.
  - Delete returns to `/cards`.
  - Material grid, cards, inputs, select controls, icons, and buttons render correctly.
  - Browser console contains no Angular, Material, dependency-injection, or change-detection errors.

  If the backend is unavailable, record the CRUD smoke test as an explicit residual risk; automated tests and build may pass, but production acceptance is not complete.

- [ ] **Step 5: Record acceptance status and hand off**

  Record local command evidence, Task 6 review verdicts, final whole-change review, and backend smoke status in the ledger. Leave remote CI pending until publication is explicitly authorized. If authorization is later provided, verify Unit Tests, Build & Upload Artifact, and CodeQL against the published upgrade commit and record run links/results. Otherwise stop with a handoff of the uncommitted changes and remaining acceptance gates; do not commit, push, or create a PR automatically.

## Public Interface and Compatibility Impact

- REST endpoints and application routes remain unchanged.
- Component and service public APIs remain unchanged.
- Node support drops Node 20 and older Node 22/24 patch releases.
- Build output moves under the application builder's browser output directory.
- Existing components explicitly retain eager change detection; adopting OnPush is a separate modernization task.
- Vitest, standalone bootstrap, zoneless operation, signal conversion, and animation refactoring are out of scope.

## Acceptance Criteria

- Every direct Angular framework package resolves to stable 22.x with no invalid peers.
- Angular Material and CDK resolve to the same stable 22.x version.
- TypeScript resolves within `>=6.0 <6.1`.
- `npm ci` succeeds without force flags or peer overrides.
- All existing and newly added Karma tests pass.
- Production build succeeds using `@angular/build:application`.
- Async card and category updates render correctly.
- CI configuration uses Node `24.15.0`; actual Unit Tests, Build & Upload Artifact, and CodeQL runs must pass on the published upgrade commit for remote acceptance. This gate remains pending without explicit authorization to publish and cannot be satisfied by local commands.
- The diff contains no unrelated dependency, source, or generated-file churn.
- Every checkpoint has `Spec: ACCEPT` and `Quality: ACCEPT`, backed by complete tracked/untracked review packages and same-state verification evidence; the final cumulative review is accepted.
- Local automated completion, backend smoke acceptance, and remote CI acceptance are reported separately. Full production acceptance requires all three; pending gates are not silently waived.
