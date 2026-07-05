<p align="center">
  <h1 align="center">my-blogs</h1>
  <p align="center"><em>code less, architect more</em></p>
  <p align="center">A personal blog and frontend playground for <strong>threetwoa</strong>.<br>Content lives on GitHub — write in the browser, skip the IDE for everyday posts.</p>
</p>

<p align="center">
  <img src="docs/images/readme/banner.png" alt="my-blogs banner" width="100%">
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/README-中文-de4331?style=for-the-badge&labelColor=0f172a" alt="中文"></a>
  <a href="README.en.md"><img src="https://img.shields.io/badge/README-English-3B82F6?style=for-the-badge&labelColor=0f172a" alt="English"></a>
  <a href="https://my-blogs-roan-seven.vercel.app"><img src="https://img.shields.io/badge/Site-Live-059669?style=for-the-badge&labelColor=0f172a" alt="Live Site"></a>
  <a href="https://github.com/Aafff623/my-blogs"><img src="https://img.shields.io/github/stars/Aafff623/my-blogs.svg?style=for-the-badge&labelColor=0f172a" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&labelColor=0f172a" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&labelColor=0f172a" alt="React">
  <img src="https://img.shields.io/badge/Dev-Port-8123-8B5CF6?style=for-the-badge&labelColor=0f172a" alt="Dev Port">
</p>

<p align="center">
  <a href="#why-this-exists">Why</a> ·
  <a href="#what-it-does">Features</a> ·
  <a href="#screenshots">Screenshots</a> ·
  <a href="#get-started">Get Started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#stack">Stack</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#docs">Docs</a>
</p>

---

## Why This Exists

I wanted a corner of the web that actually feels mine — somewhere to dump learning notes, Three.js / shader experiments, and occasional life updates, without wrestling a heavy CMS.

The fork of [YYsuni/2025-blog-public](https://github.com/YYsuni/2025-blog-public) wasn't about picking another template. It was this simple loop:

```text
Write in browser → commit to GitHub → Vercel deploys → site updates
```

After wiring up my own repo and GitHub App, it grew into what you see now: **card-based home, article timeline, in-browser editor, multi-cover carousel**. Blogging shouldn't feel like homework; tweaking the UI can be a side project on its own.

> In short: **less boilerplate, more room for things worth building.**

---

## What It Does

| Feature | In one line |
|---|---|
| **Card home** | Draggable modules; theme, background, and art — all editable online |
| **Article timeline** | Browse by day / week / month / year / category, with a calendar heatmap |
| **Markdown reading** | Syntax highlight, math, TOC sidebar, cover carousel |
| **Browser editor** | `/write` with live preview; covers, tags, images included |
| **GitHub as CMS** | Import a Private Key, hit save → that's a commit with full history |
| **Other fragments** | about, projects, pictures, share — also editable from the site |
| **Read tracking** | Remembers what you've read; shows it quietly on the timeline |

---

## Screenshots

Live: [my-blogs-roan-seven.vercel.app](https://my-blogs-roan-seven.vercel.app)

Assets in `docs/images/readme/` (Playwright captures — click to enlarge):

| | | |
|:---:|:---:|:---:|
| [![Home](docs/images/readme/home.jpg)](docs/images/readme/home.jpg)<br><br>**Home**<br>Card layout · art panel · social links | [![Blog](docs/images/readme/blog.jpg)](docs/images/readme/blog.jpg)<br><br>**Timeline**<br>Two-column layout · multi-view archive | [![Article](docs/images/readme/article.jpg)](docs/images/readme/article.jpg)<br><br>**Article**<br>Markdown body · sidebar TOC & cover<br>[Example](https://my-blogs-roan-seven.vercel.app/blog/curve-arrow) |

Quick tour: home → `/blog` (try a few views) → open any article → run locally and peek at `/write`

---

## Get Started

```bash
git clone https://github.com/Aafff623/my-blogs.git
cd my-blogs
pnpm install
pnpm dev
```

Open [http://localhost:8123](http://localhost:8123). Dev port is **8123** in `package.json`.

| Command | What |
|---|---|
| `pnpm dev` | Dev server at `localhost:8123` |
| `pnpm build` | Production build |
| `pnpm start` | Run the build |
| `pnpm run svg` | Regenerate SVG index |
| `pnpm run build:cf` | Cloudflare build |

<details>
<summary>Windows notes</summary>

```powershell
git clone https://github.com/Aafff623/my-blogs.git
cd my-blogs
pnpm install
pnpm dev
```

If 8123 is taken, kill the old process or run:

```powershell
pnpm exec next dev --turbopack -p 8123
```

</details>

<details>
<summary>Env vars (deploy / online editing)</summary>

```bash
cp .env.example .env.local
```

| Variable | Current value |
|---|---|
| `NEXT_PUBLIC_GITHUB_OWNER` | `Aafff623` |
| `NEXT_PUBLIC_GITHUB_REPO` | `my-blogs` |
| `NEXT_PUBLIC_GITHUB_BRANCH` | `main` |
| `NEXT_PUBLIC_GITHUB_APP_ID` | `4213335` |

The `.pem` private key is imported in the browser only when editing — **never commit it or put it in Vercel**.

</details>

<details>
<summary>Editing posts on the live site</summary>

```text
Open site → Edit → import .pem → change content → Save
→ GitHub gets a commit → wait for Vercel (~1 min)
```

Posts, covers, home config — do it online. Components, architecture — do it locally, then merge.

Upstream guide: [yysuni.com/blog/readme](https://www.yysuni.com/blog/readme)

</details>

---

## Architecture

### System Overview

![System architecture](docs/images/readme/architecture.png)

```text
[Read]  Browser → Next.js → public/blogs/ static files → rendered pages
[Write] /write → .pem → JWT → GitHub App → Git API → commit → Vercel deploy
```

### Directory Layout

![Project structure](docs/images/readme/structure.png)

| Path | Role |
|---|---|
| `public/blogs/` | CMS root — posts, index, categories |
| `public/blogs/{slug}/` | Single post: `index.md` + `config.json` + images |
| `src/app/(home)/` | Card-based home |
| `src/app/blog/` | Timeline list + article detail |
| `src/app/write/` | In-browser editor |
| `src/lib/github-client.ts` | GitHub writes (JWT, commits) |
| `src/lib/markdown-renderer.ts` | Single Markdown entry point |
| `src/config/site-content.json` | Theme, social links, card config |

### Content Write Flow

![Write workflow](docs/images/readme/workflow.png)

```text
Open site → /write → import .pem → edit → save
  → GitHub commit → Vercel deploy (~60s) → refresh to see changes
```

---

## Stack

![Tech stack layers](docs/images/readme/tech-stack.png)

| Layer | Tech | Role |
|---|---|---|
| **UI** | Next.js 16 · React 19 · Tailwind v4 · motion · lucide-react | Routing, components, animation |
| **State** | zustand · SWR · dayjs | Editor state, blog index cache, dates |
| **Rendering** | marked · shiki · katex · html-react-parser | Markdown, highlighting, math |
| **Writes** | jsrsasign · GitHub App API · AES-GCM | Browser JWT, tokens, optional key cache |
| **Content** | `public/blogs/` · JSON config | Static CMS data |
| **Deploy** | Vercel · OpenNext + Cloudflare (alt) | Production builds |

**Tooling**: TypeScript · pnpm · React Compiler · Turbopack (dev port `8123`)

---

## Roadmap

| Phase | Status | Notes |
|---|---|---|
| Own repo & deploy | ✅ | GitHub App, Vercel, env vars switched |
| Article timeline | ✅ | Two-column layout, heatmap, category tree |
| Multi-cover | 🔄 | `covers` + sidebar carousel |
| README & assets | ✅ | Banner · screenshots · architecture / stack / workflow / structure diagrams |
| Visual polish | 🔜 | Dark mode, motion, home cards |

---

## Docs

| File | About |
|---|---|
| [`README.md`](README.md) | Chinese version |
| [`CONTEXT.md`](CONTEXT.md) | Terms, constraints, layout |
| [`CLAUDE.md`](CLAUDE.md) | Agent collaboration |
| [`.env.example`](.env.example) | Env template |
| [`docs/output/reports/readme-diagrams/readme-diagram-brief.md`](docs/output/reports/readme-diagrams/readme-diagram-brief.md) | Diagram brief for GPT image generation |
| [`docs/adr/`](docs/adr/) | Architecture decisions |
| [`src/config/site-content.json`](src/config/site-content.json) | Theme & site copy |

---

## Credits

- Built on [YYsuni/2025-blog-public](https://github.com/YYsuni/2025-blog-public)
- License: [`LICENSE`](LICENSE)

---

[threetwoa](https://github.com/Aafff623) · _code less, architect more_
