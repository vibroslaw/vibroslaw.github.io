# Rap-Ort Premium Cinematic Assets

PR77 connects the event shell and generators to a shared cinematic asset system. The site works without the files, but the true premium effect depends on these assets being present and visually consistent.

## Required for WOW

Place these files in:

`public/assets/events/rap-ort/shared/experience/`

- `event-lobby-cinematic-hero.webp`
- `event-pass-premium.webp`
- `witness-writing-desk.webp`
- `document-atelier.webp`
- `memory-case.webp`
- `archive-wall-empty.webp`
- `final-question-dark-room.webp`

## Strongly recommended

- `event-lobby-cinematic-mobile.webp`
- `projection-beam-overlay.webp`
- `event-pass-texture.webp`
- `witness-report-paper-closeup.webp`
- `document-print-samples.webp`
- `memory-card-stack.webp`
- `archive-wall.webp`
- `archival-dark-texture.webp`
- `subtle-gold-line-ornament.webp`

## Event-specific hero assets

Oświęcim / MUP:

`public/assets/events/rap-ort/oswiecim20260525/experience/`

- `oswiecim-event-lobby.webp`
- `oswiecim-event-lobby-mobile.webp`

Sydney 2026:

`public/assets/events/rap-ort/syd2026/experience/`

- `sydney-event-lobby.webp`
- `sydney-event-lobby-mobile.webp`

## Visual consistency rules

All assets should feel like one cinematic world:

- deep charcoal / black
- aged ivory
- subtle antique gold
- soft projection light
- archival paper
- dark wood
- dust particles
- museum-grade restraint
- no readable text inside images
- no logos
- no faces
- no gore
- no propaganda symbols
- no modern UI elements

## Quality notes

The site includes CSS and JS fallbacks if assets are missing. Missing assets should not break the layout, but the visual level will remain limited until the final images are present.

Use this rule when reviewing:

- Shell + fallback visuals = structurally correct, visually improved.
- Shell + premium generated assets = intended cinematic world-class effect.

## Asset manifest

Runtime manifest:

- `assets/js/event-asset-manifest.js`

Runtime loader:

- `assets/js/event-asset-loader.js`

Integration CSS:

- `assets/css/premium-asset-integration.css`
