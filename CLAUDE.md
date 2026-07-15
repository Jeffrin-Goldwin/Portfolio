# Portfolio — project context

Personal developer portfolio, hosted as static files on **AWS S3**.

## Key constraint: (almost) zero-build
- The machine has **no Node, npm, or Python** (only `winget`). Do **not** suggest `npm install` / Vite dev-server steps. The build uses a **standalone `esbuild.exe`** that `build.ps1` self-downloads (no Node runtime).
- **Content edits (`src/data.js`) need NO build** — edit, re-upload to S3, invalidate CloudFront. `data.js` loads at runtime via the `@data` import-map entry (kept external from the bundle).
- **`src/App.jsx` is bundled to `src/app.bundle.js`** — esbuild inlines React, ReactDOM and Framer Motion into one minified file (~270 KB / ~87 KB gzipped). The page loads only that bundle + `data.js`: **no esm.sh, no CDN modules, no in-browser Babel.** This was done to kill a 50+ request esm.sh waterfall that made first load slow.
- After editing `App.jsx`, regenerate the bundle: `powershell -ExecutionPolicy Bypass -File .\build.ps1` (fetches `esbuild.exe` + the library tarballs on first run; still no Node/npm). **`app.bundle.js` is generated — never hand-edit it.**

## Layout
```
index.html      page shell, SEO meta, import map (versions pinned here)
favicon.svg     gradient </> mark (no background)
serve.ps1       zero-install local preview (PowerShell HTTP server, port 8000)
build.ps1       bundle App.jsx (+React/Framer) -> app.bundle.js (self-fetches esbuild + libs; no Node)
src/data.js     ★ all content: profile, skills, socials, projects/experience, certifications, posts
src/App.jsx     the whole React app + Framer Motion (SINGLE source file — see gotcha)
src/app.bundle.js  GENERATED from App.jsx by build.ps1 — do not hand-edit; this is what the page loads
src/styles.css  theme; all colors are CSS vars in :root at the top
assets/         profile.jpg + resume.pdf go here
.tools/         cached esbuild.exe (created by build.ps1; git-ignored / don't upload)
node_modules/   cached library tarballs for bundling (created by build.ps1; git-ignored / don't upload)
```

## Gotchas / conventions
- **All JSX must stay in `src/App.jsx`.** The build bundles that single entry file; extra `.jsx` files won't be picked up unless imported from it. `data.js` is imported via the bare specifier **`@data`** (mapped in the import map + marked external in the bundle), not `./data.js` — this is what keeps content edits build-free.
- **`src/app.bundle.js` is a build artifact.** Edit `App.jsx`, then run `build.ps1`. If you edit `App.jsx` and forget to rebuild, the site won't reflect your change (it loads the stale bundle).
- **Library versions live in `build.ps1`** (the `$deps` map), not in `index.html` anymore. Bump them there and rebuild.
- Content edits happen in **`src/data.js`** only — don't hardcode content in App.jsx.
- **Preview** with `powershell -ExecutionPolicy Bypass -File .\serve.ps1` (a local http server is required; `file://` won't load the ES modules). No headless browser is available in-session, so verify visually via the preview before shipping.
- If a CDN version changes, update the pins in `index.html` and confirm they return 200.

## Design
- **Warm cream / beige light theme**, techie feel: mono `// section` labels, faint grid backdrop, terminal touches (`$ whoami`).
- Accent is a **muted terracotta/amber** — tune via `--accent`, `--accent-2`, `--accent-ink` (and `--accent-grad`) in `styles.css`. Keep it subtle; the user dislikes a strong accent.
- Background has a **cursor-reactive grid** (`.grid-reveal` + `.spotlight`, mouse-only) and gentle ambient motion (drifting orbs + slow grid pan). All motion respects `prefers-reduced-motion`.
- **Tone: confident, not needy.** No "available for hire" / "open to opportunities" / "looking for work" language anywhere.

## Deploy
S3 static website hosting; upload the folder (exclude `serve.ps1`, `README.md`, `.git`). CloudFront recommended for HTTPS/custom domain. Full steps in `README.md`.
```
aws s3 sync . s3://YOUR-BUCKET --exclude "serve.ps1" --exclude "build.ps1" --exclude ".tools/*" --exclude "node_modules/*" --exclude "src/App.jsx" --exclude "README.md" --exclude ".git/*"
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```
Every deploy needs the CloudFront invalidation, or edge caches keep serving old files.
