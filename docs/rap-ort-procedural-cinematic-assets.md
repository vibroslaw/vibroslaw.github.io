# Rap-Ort Procedural Cinematic Asset Pack

PR78 adds lightweight SVG fallback assets for the cinematic event experience.

These are **not** the final photorealistic WebP images. They are a premium procedural fallback layer so the event shell and generator pages do not rely only on gradients while waiting for final generated artwork.

## Added procedural assets

Folder:

`public/assets/events/rap-ort/shared/experience/`

Files:

- `event-lobby-cinematic-hero.svg`
- `event-lobby-cinematic-mobile.svg`
- `event-pass-premium.svg`
- `witness-writing-desk.svg`
- `document-atelier.svg`
- `memory-case.svg`
- `archive-wall-empty.svg`
- `final-question-dark-room.svg`

## Visual purpose

The SVGs represent the core cinematic scenes:

1. dark screening room / lobby
2. premium event pass
3. witness writing desk
4. document atelier
5. memory case
6. anonymous archive wall
7. final question room

They are deliberately:

- text-free
- face-free
- symbol-free
- lightweight
- static-site safe
- respectful in tone
- compatible with the existing CSS overlays

## Runtime behaviour

The manifest now defines WebP-first candidates and procedural SVG fallbacks.

The loader resolves assets in this order:

1. event-specific WebP, if available
2. shared final WebP, if available
3. procedural SVG fallback

Runtime classes:

- `has-premium-assets` — final required WebP files exist
- `has-missing-premium-assets` — one or more final WebP files are missing
- `has-procedural-cinematic-assets` — procedural fallback pack is present
- `has-missing-procedural-assets` — one or more SVG fallbacks are missing
- `has-resolved-cinematic-assets` — loader resolved usable scene assets

## Review rule

PR78 is a bridge.

It should improve the page immediately, but the final target remains:

- photorealistic cinematic WebP hero images
- event-specific Oświęcim and Sydney lobby images
- final document atelier / witness desk / memory case / archive wall artwork

Do not treat the procedural SVGs as the final visual identity. Treat them as a dignified, lightweight cinematic placeholder system.

## Next step

PR79 should add or replace with final generated WebP artwork and run visual QA on:

- `/rap-ort/experience/oswiecim20260525/`
- `/rap-ort/experience/syd2026/`
- `/rap-ort/uczestnictwo/?event=oswiecim20260525`
- `/rap-ort/participation/?event=syd2026`
- `/rap-ort/raport-swiadka/generator/?event=oswiecim20260525`
- `/rap-ort/witness-report/generator/?event=syd2026`
