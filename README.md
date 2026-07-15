# Portfolio

A fast, techie developer portfolio built with **React + Framer Motion**, delivered as **static files** on S3. Editing your **content** needs no build and no Node; only structural changes to the app itself need a one-command recompile (which fetches its own tool).

## What's inside

```
Portfolio/
├─ index.html        ← page shell, SEO meta, import map (edit <title>/meta here)
├─ favicon.svg       ← gradient </> favicon
├─ serve.ps1         ← zero-install local preview server (PowerShell)
├─ build.ps1         ← bundle App.jsx (+React/Framer) → app.bundle.js (only for app changes)
├─ src/
│  ├─ data.js        ← ★ EDIT THIS: your name, bio, experience, certs, blog posts
│  ├─ App.jsx        ← the React app + all Framer Motion animations (source)
│  ├─ app.bundle.js  ← GENERATED from App.jsx by build.ps1 — the page loads this; don't hand-edit
│  └─ styles.css     ← theme + layout (colors live in the :root block at the top)
└─ assets/
   ├─ profile.jpg    ← add your photo here (see assets/README.txt)
   └─ resume.pdf     ← add your resume here (optional)
```

## Make it yours (2 minutes)

1. **Content** — open `src/data.js` and replace the placeholders: name, role, tagline, bio,
   `socials`, `projects`, `certifications`, and `posts`. The comments explain each field.
2. **Photo** — drop a square image at `assets/profile.jpg`. No photo? A gradient monogram of
   your initials shows automatically.
3. **Resume** — drop `assets/resume.pdf` (or set `resume: null` in `data.js` to hide the button).
4. **Page title / SEO** — edit the `<title>` and `<meta>` tags near the top of `index.html`.
5. **Colors** — tweak the CSS variables in the `:root { … }` block at the top of `src/styles.css`
   (`--cyan`, `--indigo`, `--violet`, `--accent-grad`).

## Preview locally (no installs)

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Opens `http://localhost:8000` in your browser. Stop with **Ctrl+C**.

> A local server is required (not `file://`) because the browser loads the app as an ES module.
> `serve.ps1` uses built-in Windows .NET — nothing to install. Alternatives: VS Code's
> **Live Server** extension, or any static server.

## Editing the app (structural changes)

Changing **content** (`src/data.js`) needs no build — just save and re-upload.

Changing the **app itself** (`src/App.jsx` — layout, sections, animations) requires rebuilding the
bundle that the page actually loads (`src/app.bundle.js`):

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

The first run downloads a standalone `esbuild.exe` plus the React / Framer Motion tarballs into
`.tools/` and `node_modules/` (no Node/npm needed); later runs reuse them. **Never hand-edit
`src/app.bundle.js`** — it's regenerated and your changes would be overwritten. To upgrade a
library, bump its version in the `$deps` map inside `build.ps1` and rebuild.

## Deploy to S3

1. **Create a bucket** (name it e.g. `yourname-portfolio`).
2. **Enable static website hosting**: bucket → *Properties* → *Static website hosting* → Enable,
   set **Index document** = `index.html`.
3. **Allow public reads**: *Permissions* → turn **off** "Block all public access", then add this
   bucket policy (replace `YOUR-BUCKET`):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicRead",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::YOUR-BUCKET/*"
     }]
   }
   ```
4. **Upload** everything in this folder — keep the structure (`index.html`, `favicon.svg`,
   `src/`, `assets/`). *Don't* upload `serve.ps1`, `build.ps1`, `.tools/`, `node_modules/`,
   `README.md` (harmless if you do). `src/App.jsx` isn't needed at runtime either — only
   `src/app.bundle.js` is.
5. Visit the **bucket website endpoint** shown under *Static website hosting*.

Or with the AWS CLI:

```bash
aws s3 sync . s3://YOUR-BUCKET --exclude "serve.ps1" --exclude "build.ps1" --exclude ".tools/*" --exclude "node_modules/*" --exclude "README.md" --exclude ".git/*"
```

### Recommended: put CloudFront in front
For HTTPS, a custom domain, and caching, create a **CloudFront** distribution with the S3 bucket
as origin (set the default root object to `index.html`). This also lets you keep the bucket private
via Origin Access Control.

## Updating later
Edit `src/data.js` (content), re-run the S3 upload — no rebuild. If you changed `src/App.jsx`,
run `build.ps1` first so `src/app.bundle.js` is regenerated. **If you use CloudFront, create an
invalidation for `/*` after every upload** or the edge cache keeps serving the old files:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Notes
- React, ReactDOM, and Framer Motion are **bundled** into `src/app.bundle.js` (built from
  `src/App.jsx` by `build.ps1`). The page makes **no third-party module requests** — just the
  bundle and `data.js`, both served from your own bucket/CDN. This replaced a 50+ request CDN
  waterfall and is the main reason first load is fast.
- Fully responsive, keyboard-accessible, and respects `prefers-reduced-motion`.
