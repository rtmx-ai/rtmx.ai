# CLAUDE.md

This file provides guidance to Claude Code when working with the rtmx.ai website codebase.

## Repository Ecosystem

This is part of the RTMX multi-repo system:

| Repo | Purpose | Dependency |
|------|---------|------------|
| **rtmx.ai** (this) | Website & docs | Submodule: rtmx |
| rtmx | CLI client (Python) | None |
| rtmx-go | CLI client (Go) | None |
| rtmx-sync | Real-time coordination | Depends on rtmx |

When working across repos:
- Changes to rtmx docs → update submodule here
- Website features → coordinate with rtmx CLI docs

## Quick Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Requirements Tracking

```bash
source .venv/bin/activate
rtmx status       # Show RTM status
rtmx backlog      # Show prioritized backlog
```

## Project Structure

```
rtmx.ai/
├── src/
│   ├── components/    # Astro components (Hero, Terminal, PricingCard, etc.)
│   ├── content/       # Content collections (docs, blog)
│   ├── pages/         # Page routes (pricing, roadmap, index)
│   └── styles/        # Global styles (custom.css)
├── docs/
│   ├── rtm_database.csv       # Requirements traceability matrix
│   └── requirements/WEBSITE/  # Requirement specification files
├── public/            # Static assets (icons, whitepapers, screenshots)
├── rtmx/              # Git submodule → rtmx-ai/rtmx (for CLI docs)
├── astro.config.mjs   # Astro + Starlight configuration
├── rtmx.yaml          # RTMX requirements tracking config
└── package.json
```

## Git Submodule

The `rtmx/` directory is a git submodule pointing to `rtmx-ai/rtmx`. This provides access to CLI documentation.

To update the submodule to latest:
```bash
git submodule update --remote rtmx
git add rtmx
git commit -m "chore: Update rtmx submodule"
```

## Development Guidelines

- **Framework**: Astro with Starlight for documentation
- **Styling**: Custom CSS with CSS variables (no Tailwind)
- **Dark Mode**: Forced dark via CSS variable overrides and inline script
- **Deployment**: GitHub Pages via GitHub Actions
- **Search**: Pagefind, indexed at build time

### Starlight Integration

When adding grid or flex containers inside Starlight content areas, always add the `not-content` class to prevent Starlight's adjacent sibling margin rule from distorting grid item alignment. See REQ-SITE-025.

### CSS Conventions

- Colors use the emerald accent palette (#10b981, #6ee7b7) on dark backgrounds (#0a0a0a, #171717)
- Starlight CSS variables (--sl-color-*) are overridden in src/styles/custom.css
- Component styles use `<style is:global>` for grid containers and `<style>` (scoped) for component internals

## Content Updates

Documentation content lives in:
- `src/content/docs/` — website-specific docs and blog posts
- `rtmx/` submodule — CLI documentation (guides, adapters, reference)

To update CLI docs:
1. Make changes in the rtmx-ai/rtmx repository
2. Update the submodule pointer in this repo
3. Deploy will automatically pull latest docs

## CI/CD

- **deploy.yml**: Builds Astro, runs Pagefind indexing, deploys to GitHub Pages on push to main
- Source is set to "GitHub Actions" in Pages settings

## Contact

RTMX Engineering — dev@rtmx.ai
