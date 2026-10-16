# DriftWise — Intelligent Configuration Drift Triage

A runnable React + TypeScript prototype for PS08. DriftWise shows what changed on a server, whether the change was approved, its policy risk, and the evidence behind its priority.

The interface includes a blue-and-white dashboard, responsive cards, light/dark themes, and five interactive demo scenarios. The Architecture page has been removed from the UI; `ARCHITECTURE.md` remains the full product design document.

## Requirements

- Node.js 22.12 or newer (Node 22 LTS recommended)
- npm, included with Node.js
- A modern browser

No API keys, database, Python installation, or LLM download is required.

## Run locally

Open a terminal inside this folder:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal (normally http://127.0.0.1:5173).

Alternatively, use the pinned pnpm version from `package.json` with the included lockfile:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Build and check

```sh
npm test
npm run build
npm run preview
```

`npm test` runs six decision-engine and canonicalization tests. The build checks TypeScript and generates the static website in `dist/`. Preview serves that production build locally.

## How to use the demo

1. **Overview:** See the fleet summary and priority counts. Click a priority card to filter findings.
2. **Drift findings:** Search or filter, then open a finding.
3. **Investigation:** Read Configuration diff and Evidence & explanation. Acknowledge or resolve the finding to update its session status.
4. **Server fleet:** Select a server to inspect its findings.
5. **Scenarios:** Choose an example to preview its decision. Click **Load scenario** to replace the visible findings and open the investigation drawer. **Reset demo** restores all fixtures.
6. **Activity:** Review scans and status changes from this browser session.
7. **Monitoring:** Run a demo scan manually or start the 60-second cycle in the footer. Unchanged resolved drift reopens on the next scan; acknowledgment is preserved.

Search in the top bar and press Enter to open matching findings. Theme preference persists in browser storage. Demo state and audit events reset on refresh.

## Included scenarios

| Scenario | Expected result |
|---|---|
| Approved safe timeout change | Expected change |
| Explicitly rejected audit-logging change | High risk |
| Approved root-login change | High risk despite approval |
| Approved worker-specific timeout variation | Expected change |
| Coordinated TLS downgrade on seven servers | High risk despite majority peer agreement |

The full dataset also includes an unknown-approval retry-limit change requiring review. There are 12 simulated assets and six grouped findings.

## What actually runs

- **React + TypeScript:** Dashboard, search, navigation, scenario loading, investigation drawers, and session status changes.
- **Deterministic TypeScript rules:** Priority classification from the supplied risk, authorization, evidence-completeness, and anomaly fields.
- **Web Crypto SHA-256:** Real hashes of canonical demo field evidence, calculated in the browser. These are not full server snapshots.
- **CSS + Lucide:** Responsive styling, themes, and icons.
- **Vite:** Local development and production build.
- **Browser timer:** Simulated repeated scans.

### Decision rules

1. High policy risk always produces **High risk**.
2. Incomplete evidence, unknown/medium risk, missing authorization, or an unexplained anomaly produces **Review required**.
3. Otherwise the change is **Expected change**.

Missing approval is **Unknown**, not automatically **Unauthorized**. Authorization never overrides high policy risk.

## Prototype boundaries

Server settings, exact differences, approval records, policy results, and peer signals are seeded fixtures. The classifier executes real rules over these fixtures; the prototype does not collect live configuration or evaluate real approval systems.

Explanations are evidence-linked templates. **No ML model or LLM is deployed.** No server configuration is changed, and no baseline approval or automatic remediation is implemented. Monitoring is browser-only and can be throttled in background tabs.

The target architecture describes Python collectors, Docker server simulations, scikit-learn DBSCAN clustering, FastAPI, PostgreSQL, a background worker, and an open-weight LLM explanation service. These are planned components, not included implementations. The LLM would explain decisions, not assign priorities.

## Project structure

```text
DriftWise/
├── src/
│   ├── main.tsx             # Dashboard, navigation, drawers, and session state
│   ├── ScenarioStudio.tsx   # Interactive scenario explorer
│   ├── engine.ts            # Fixtures, classification, and SHA-256 helpers
│   ├── engine.test.ts       # Six deterministic checks
│   ├── style.css            # Base component styles
│   ├── refined.css          # Layout and typography refinements
│   └── dashboard.css        # Current blue dashboard theme
├── ARCHITECTURE.md          # Full target system specification
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── .gitignore
```

## Push to GitHub

Create a new, empty repository on GitHub. Do not initialize it with a README because this folder already includes one. Then run these commands inside this folder, replacing the repository URL:

```sh
git init
git add .
git commit -m "Add DriftWise prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Authenticate with GitHub when prompted. `node_modules`, build output, environment files, and logs are excluded by `.gitignore`. This export contains no existing Git history or private Sites deployment binding.

## Hosting

For a static hosting service, use `npm run build` as the build command and `dist` as the output directory. Navigation uses hash links such as `#overview` and `#scenarios`.

For GitHub Pages under a repository subpath, build using:

```sh
npm run build -- --base=./
```

Publish the generated `dist` directory through your chosen Pages deployment workflow; pushing source alone does not publish the app.

Fonts load from Google Fonts with system fallbacks. No configuration evidence is sent to an external model service.
