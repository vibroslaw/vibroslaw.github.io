# Veritas Humanum Print Master Assets

This folder contains the visual assets used by the post-screening document system.

The documents are not treated as screenshots of a web form. They are treated as printable artefacts of the Veritas Humanum / Rap-Ort experience.

## Required final asset names

### Record of Participation / Zapis Uczestnictwa

A4 landscape print backgrounds:

- `participation-record-bg-01-archival-cinema-a4.jpg`
- `participation-record-bg-02-museum-line-a4.jpg`
- `participation-record-bg-03-ceremonial-frame-a4.jpg`

Preview backgrounds:

- `participation-record-bg-01-archival-cinema-preview.webp`
- `participation-record-bg-02-museum-line-preview.webp`
- `participation-record-bg-03-ceremonial-frame-preview.webp`

### Witness Report / Raport Świadka

A4 portrait print background:

- `witness-report-bg-01-archival-paper-a4.jpg`

Preview background:

- `witness-report-bg-01-archival-paper-preview.webp`

### Signature

- `author-signature-placeholder.svg`

The author signature should appear only once in the final Participation Record print layout. The Witness Report should use a participant signature line, not the author signature, unless a future event explicitly requires author signing.

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

## Future font plan

The current PR47–PR49 architecture documents the font roles. Later print-engine PRs should embed licensed fonts locally.

Recommended roles:

- Monumental title serif: Veritas Humanum custom serif / Cormorant / EB Garamond / Cinzel style
- Participation body: premium serif or restrained humanist sans
- Witness Report reflection: premium typewriter style
- Metadata / numbering: clean sans or mono

Never commit private or unlicensed commercial font files without verifying licensing.
