# Rap-Ort Events Asset Requirements

This folder contains the future event-specific asset system for Rap-Ort: Prawda Sumienia.

## Core principle

Do not treat the Participation Record as one certificate with a replaceable background. Treat every edition as a document pack:

- background A4 / A3
- preview and thumbnail
- title plate
- seal or accent
- event layout
- event copy
- document number prefix
- access mode
- memory pack files

## Shared assets

`shared/audio/`

- `typewriter-key.mp3` — 40–120 ms, dry typewriter key, preferably below 50 KB
- `typewriter-key-soft.mp3` — optional softer variant
- `typewriter-return.mp3` — optional carriage return
- `typewriter-bell.mp3` — optional bell
- `AUDIO_MANIFEST.json` — optional audio map

`shared/seals/`

- `vh-seal-gold.svg` — path-only SVG, transparent background
- `rap-ort-seal-gold.svg` — path-only SVG, transparent background
- `anniversary-edition-seal-gold.svg` — path-only SVG
- `international-screening-seal-gold.svg` — path-only SVG

`shared/title-plates/`

- `title-zapis-uczestnictwa-gold.svg`
- `title-record-of-participation-gold.svg`
- `title-raport-swiadka-dark.svg`
- `title-witness-report-dark.svg`

Recommended SVG: path-only, transparent background, viewBox around 3000 × 900 for title plates, 1000 × 1000 or 1600 × 1600 for seals.

`shared/watermarks/`

- `watermark-preview-gold.svg`
- `watermark-preview-dark.svg`

## Standard document packs

Each standard pack should include:

- `participation-record-bg-a4.jpg` — 3508 × 2480 px, JPG 92–96%, sRGB
- `participation-record-bg-a3.jpg` — 4961 × 3508 px, JPG 92–96%, sRGB
- `participation-record-preview.webp` — 1600 × 1131 px, WebP
- `participation-record-thumb.webp` — 800 × 566 px, WebP

Folders:

- `standard/archival-cinema/`
- `standard/museum-line/`
- `standard/ceremonial-frame/`

## Oświęcim / MUP event pack

Folder: `oswiecim20260525/`

Recommended files:

`backgrounds/`

- `event-hero.webp` — 2400 × 1350 px
- `participation-record-bg-a4.jpg` — 3508 × 2480 px
- `participation-record-bg-a3.jpg` — 4961 × 3508 px
- `participation-record-wall-special-a3.jpg` — 4961 × 3508 px
- `participation-record-preview.webp` — 1600 × 1131 px
- `participation-record-thumb.webp` — 800 × 566 px
- `witness-report-bg-a4.jpg` — 2480 × 3508 px
- `witness-report-preview.webp` — 1000 × 1414 px

`title-plates/`

- `title-zapis-uczestnictwa-gold.svg`
- `title-record-of-participation-gold.svg`
- `title-zapis-uczestnictwa-anniversary-gold.svg`
- `title-record-of-participation-anniversary-gold.svg`
- `title-raport-swiadka-dark.svg`
- `title-witness-report-dark.svg`

`accents/`

- `event-accent-gold.svg`
- `event-seal-gold.svg`
- `anniversary-edition-seal-gold.svg`

`memory-pack/`

- `memory-pack-cover-story.jpg` — 1080 × 1920 px
- `phone-wallpaper.jpg` — 1080 × 1920 px
- `desktop-wallpaper.jpg` — 3840 × 2160 px
- `social-post-4x5.jpg` — 1080 × 1350 px
- `social-story.jpg` — 1080 × 1920 px
- `quote-card-4x5.jpg` — 1080 × 1350 px
- `reflection-card-template.jpg` — 1080 × 1350 px
- `thank-you-story.jpg` — 1080 × 1920 px
- `project-note-cover.jpg` — 2480 × 3508 px
- `memory-pack-og.jpg` — 1200 × 630 px

`workshop/`

- `workshop-cover.jpg`
- `workshop-section-memory.jpg`
- `workshop-section-moral-choice.jpg`
- `workshop-section-ai.jpg`
- `workshop-section-patriotism.jpg`

`archive/anonymous/`

Static anonymous Witness Report JPG archive. Files should contain no name, no signature, no personal data.

Suggested naming:

- `wr-osw20260525-anon-0001.jpg`
- `wr-osw20260525-anon-0002.jpg`

`archive/ARCHIVE_MANIFEST.json` should list visible archive items.

## Sydney event pack

Folder: `syd2026/`

Use the same structure as Oświęcim, adapted to international screening assets.

## GitHub Pages limitation

GitHub Pages is static hosting. It cannot automatically save new JPG/PDF files into this archive without an external endpoint. The first safe implementation is local anonymous JPG generation and manual upload to the static archive folder after the event.
