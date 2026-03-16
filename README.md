# rtmx.ai

The marketing website and documentation for [RTMX](https://github.com/rtmx-ai/rtmx-go) — the intent layer for agentic engineering.

**Live site**: [https://rtmx.ai](https://rtmx.ai)

## Quick Start

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at localhost:4321
npm run build     # Build for production
npm run preview   # Preview production build
```

## Project Structure

```
rtmx.ai/
├── src/
│   ├── components/    # Astro components (Hero, Terminal, PricingCard)
│   ├── content/       # Content collections (docs, blog)
│   ├── pages/         # Page routes (pricing, roadmap)
│   └── styles/        # Global styles (custom.css)
├── docs/
│   ├── rtm_database.csv       # Requirements traceability matrix
│   └── requirements/WEBSITE/  # Requirement specifications
├── public/            # Static assets (icons, whitepapers, screenshots)
├── rtmx/              # Git submodule → rtmx-ai/rtmx (CLI docs)
├── astro.config.mjs   # Astro + Starlight configuration
├── rtmx.yaml          # RTMX requirements tracking config
└── package.json
```

## Requirements Tracking

This repo manages its own requirements with RTMX. To view status:

```bash
source .venv/bin/activate
rtmx status         # Overall progress
rtmx backlog        # Prioritized work items
```

25 requirements across 4 phases:

| Phase | Name | Description |
|-------|------|-------------|
| 1 | Website Foundation | Framework, docs, deployment, roadmap, theme |
| 2 | Content & Marketing | Pricing clarity, about page, social proof, blog, community |
| 3 | Frontend Engineering | SEO, security headers, CSS consolidation, nav component |
| 4 | Accessibility & UX | Keyboard nav, theme toggle, carousel a11y, form UX |

## Stack

- **Framework**: [Astro](https://astro.build) with [Starlight](https://starlight.astro.build)
- **Styling**: Custom CSS with CSS variables (dark mode forced)
- **Deployment**: GitHub Pages via GitHub Actions
- **Search**: Pagefind (built at deploy time)

## Git Submodule

The `rtmx/` directory is a submodule pointing to [rtmx-ai/rtmx](https://github.com/rtmx-ai/rtmx). It provides CLI documentation content.

```bash
git submodule update --remote rtmx   # Pull latest docs
git add rtmx
git commit -m "chore: Update rtmx submodule"
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow which builds the Astro site, indexes with Pagefind, and deploys to GitHub Pages.

## Contact

RTMX Engineering — [dev@rtmx.ai](mailto:dev@rtmx.ai)
