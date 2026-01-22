# CLAUDE.md

This file provides guidance to Claude Code when working with the rtmx.ai website codebase.

## Repository Ecosystem

This is part of the RTMX multi-repo system:

| Repo | Purpose | Dependency |
|------|---------|------------|
| **rtmx.ai** (this) | Website & docs | Submodule: rtmx |
| rtmx | CLI client | None |
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

## Project Structure

```
rtmx.ai/
├── src/
│   ├── components/    # Astro components
│   ├── content/       # Content collections (docs)
│   ├── pages/         # Page routes
│   └── styles/        # Global styles
├── public/            # Static assets
├── rtmx/              # Git submodule → rtmx-ai/rtmx (for docs)
├── astro.config.mjs   # Astro configuration
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
- **Styling**: Tailwind CSS
- **Dark Mode**: Default theme (forced dark)
- **Deployment**: GitHub Pages via GitHub Actions

## Content Updates

Documentation lives in the rtmx submodule. To update docs:
1. Make changes in the rtmx-ai/rtmx repository
2. Update the submodule pointer in this repo
3. Deploy will automatically pull latest docs

## CI/CD

- **deploy.yml**: Builds Astro and deploys to GitHub Pages on push to main
- Source is set to "GitHub Actions" in Pages settings

## Contact

ioTACTICAL Engineering - engineering@iotactical.co
