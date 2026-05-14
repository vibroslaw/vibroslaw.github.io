# Veritas Humanum Print Master Assets

This folder contains the visual assets used by the post-screening document system.

The documents are not treated as screenshots of a web form. They are treated as printable artefacts of the Veritas Humanum / Rap-Ort experience.

## PR54 hybrid vector print-master status

PR54 introduces a hybrid print-master direction:

- background remains a high-resolution raster image,
- text is drawn as a PDF text layer whenever PDFLib is available,
- local fonts are embedded when `fontkit` and the print font files are available,
- StandardFonts are used only as a compatibility fallback,
- A3 Wall Edition prefers native A3 backgrounds and warns when A4 fallback is used,
- final signature and title assets are expected as separate production files.

This is the key move away from treating the final PDF as a single screenshot-style canvas image.

## Required final asset names

### Record of Participation / Zapis Uczestnictwa

A4 landscape print backgrounds:

- `participation-record-bg-01-archival-cinema-a4.jpg`
- `participation-record-bg-02-museum-line-a4.jpg`
- `participation-record-bg-03-ceremonial-frame-a4.jpg`

A3 landscape Wall Edition backgrounds:

- `participation-record-bg-01-archival-cinema-a3.jpg`
- `participation-record-bg-02-museum-line-a3.jpg`
- `participation-record-bg-03-ceremonial-frame-a3.jpg`

Optional bleed backgrounds:

- `participation-record-bg-01-archival-cinema-a4-bleed.jpg`
- `participation-record-bg-02-museum-line-a4-bleed.jpg`
- `participation-record-bg-03-ceremonial-frame-a4-bleed.jpg`
- `participation-record-bg-01-archival-cinema-a3-bleed.jpg`
- `participation-record-bg-02-museum-line-a3-bleed.jpg`
- `participation-record-bg-03-ceremonial-frame-a3-bleed.jpg`

Preview backgrounds:

- `participation-record-bg-01-archival-cinema-preview.webp`
- `participation-record-bg-02-museum-line-preview.webp`
- `participation-record-bg-03-ceremonial-frame-preview.webp`

Thumbnail backgrounds:

- `participation-record-bg-01-archival-cinema-thumb.webp`
- `participation-record-bg-02-museum-line-thumb.webp`
- `participation-record-bg-03-ceremonial-frame-thumb.webp`

### Witness Report / Raport Świadka

A4 portrait print background:

- `witness-report-bg-01-archival-paper-a4.jpg`

Optional bleed background:

- `witness-report-bg-01-archival-paper-a4-bleed.jpg`

Preview background:

- `witness-report-bg-01-archival-paper-preview.webp`

Thumbnail background:

- `witness-report-bg-01-archival-paper-thumb.webp`

Optional paper texture:

- `witness-report-paper-texture.webp`

### Signature

Final author signature assets:

- `author-signature-gold.svg`
- `author-signature-dark.svg`
- `author-signature-gold@2x.png`
- `author-signature-dark@2x.png`

Rules:

- signature SVGs must be path-only,
- no `<text>` elements,
- no `AUTOR PROJEKTU` label inside the SVG,
- no `project author` label inside the SVG,
- transparent background,
- the PDF engine adds the author role label separately.

The legacy file `author-signature-placeholder.svg` is only a fallback and should not be treated as the final signature.

### Title plates

Title plates should be path-only SVGs in:

- `title-plates/title-zapis-uczestnictwa-gold.svg`
- `title-plates/title-record-of-participation-gold.svg`
- `title-plates/title-raport-swiadka-dark.svg`
- `title-plates/title-witness-report-dark.svg`

Optional PNG fallbacks:

- `title-plates/title-zapis-uczestnictwa-gold@2x.png`
- `title-plates/title-record-of-participation-gold@2x.png`
- `title-plates/title-raport-swiadka-dark@2x.png`
- `title-plates/title-witness-report-dark@2x.png`

### Event accents

Sydney 2026 accents:

- `event-accents/event-accent-syd2026-gold.svg`
- `event-accents/event-accent-syd2026-dark.svg`

Event accents must remain subtle and must not use tourist-style graphics, flags or fake seals.

## Recommended dimensions

### A4 landscape

Minimum:

- `3508 × 2480 px`
- 300 DPI equivalent

Professional print / bleed candidate:

- `3579 × 2551 px`
- A4 landscape + 3 mm bleed
- 300 DPI equivalent

### A3 landscape Wall Edition

Minimum render target:

- `4961 × 3508 px`
- 300 DPI equivalent

If the background is only A4 landscape (`3508 × 2480 px`), the Wall Edition can still be generated, but it is an enlarged wall layout rather than a true native A3 print background. For final public use, prepare native A3 or bleed-safe backgrounds for the most important editions.

### A4 portrait

Minimum:

- `2480 × 3508 px`
- 300 DPI equivalent

Professional print / bleed candidate:

- `2551 × 3579 px`
- A4 portrait + 3 mm bleed
- 300 DPI equivalent

## Recommended file weight

Print backgrounds:

- JPG quality 90–95%
- usually 3–8 MB per A4 background
- A3 backgrounds may be 6–14 MB depending on texture and compression
- avoid oversharpening and excessive compression artefacts

Preview backgrounds:

- WebP
- approximately 1200–1800 px wide
- usually 250–700 KB

## Design rules

- Keep central text areas calm and readable.
- Do not place strong ornaments directly behind body copy.
- Gold elements should feel printed / archival, not neon.
- The Participation Record can be dark, ceremonial and black-gold.
- The Witness Report should feel like light archival paper, not a certificate.
- Event accents should be subtle: edition label, venue, date, micro-line, optional coordinates.
- Avoid tourist-style graphics, large flags or decorative clutter.

## Vendor files

The PR54 no-CDN target requires:

- `/assets/vendor/pdf-lib.min.js`
- `/assets/vendor/fontkit.umd.min.js`
- `/assets/vendor/licenses/pdf-lib-LICENSE.md`
- `/assets/vendor/licenses/pdf-lib-fontkit-LICENSE.md`
- `/assets/vendor/VENDOR_MANIFEST.json`

Vendor JavaScript files must be official distribution files from npm packages. Do not create placeholders.

## Print fonts

The print font stack is documented in:

- `/public/assets/fonts/print/FONT_MANIFEST.json`

Expected font roles:

- Cinzel: monumental titles,
- Source Serif 4: body copy,
- EB Garamond: optional quotes,
- IBM Plex Sans: metadata,
- IBM Plex Mono: document numbers,
- Courier Prime: Witness Report typewriter reflections.

Each font folder must retain its own `OFL.txt` or license file.

## Wall Edition rules

The Wall Edition is intended for participants who want a document worth printing, framing and keeping.

Recommended finish:

- A3 landscape or A4 landscape depending on home printer / print shop
- matte or silk matte paper
- 250–300 gsm
- high quality colour print
- black frame or warm ivory passe-partout

Design requirements:

- use the Ceremonial Frame / Rama Uroczysta variant as the recommended wall variant
- reduce central copy compared with the standard version
- keep the disclaimer as microprint, not as a central message
- keep the signature singular and calm
- keep event accent subtle
- avoid any random visual effect that changes the same document on each export

## Privacy rule

All participant data must remain local in the browser. The generator must not submit names, places, reflections, document numbers or handoff notes to a server.
