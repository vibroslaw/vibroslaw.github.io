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

## Locked document language rules

PR51 introduces a locked copy layer in `assets/js/document-config.js`.

Rules:

- Keep central document copy short, ceremonial and printable.
- Keep legal / official-status disclaimers as microprint where possible.
- Do not imply institutional endorsement, patronage, approval or official certification.
- Keep the Record of Participation as a document of presence, not achievement.
- Keep the Witness Report as a personal reflection document, not a test or survey.
- Use authorial Veritas Humanum / Rap-Ort starting thoughts instead of uncertain historical quotations.
- Do not expand the document body into explanatory website copy.

### Record of Participation copy tone

The Record of Participation should feel:

- commemorative,
- ceremonial,
- event-specific,
- suitable for framing,
- non-official in legal meaning.

### Witness Report copy tone

The Witness Report should feel:

- quiet,
- personal,
- archival,
- reflective,
- suitable for keeping in a folder, on a desk, or framed as a personal trace.

## Premium quality guidance layer

PR52 adds a lightweight quality guidance layer:

- `assets/css/document-quality.css`
- `assets/js/document-quality.js`

The layer is auto-loaded from `document-preflight.js` only on document-generator pages.

Its purpose is not to replace the PDF engine. It improves the participant experience by explaining:

- which variant is best for framing,
- which format should be used for wall print,
- which paper is recommended,
- why mobile is good for QR access but laptop / desktop is better for final export,
- that privacy is local-browser based,
- how to copy or share the generator link.

This supports the real event flow:

1. participant scans QR on mobile,
2. saves / shares the event link,
3. later opens the generator on a laptop or desktop,
4. exports the print-ready PDF with more confidence.

## Premium handoff layer

PR53 extends the quality panel with a print handoff note.

The handoff note is generated locally in the browser and can be copied or downloaded as `.txt`. It is meant for:

- participants sending the file to themselves,
- participants preparing a print-shop order,
- organisers helping less technical participants understand how to print the document,
- avoiding confusion between mobile QR access and desktop-quality export.

The handoff note includes:

- document type,
- event context,
- selected variant,
- recommended format,
- paper recommendation,
- framing / archival recommendation,
- document number when available,
- generator link,
- privacy and non-official document reminder.

Important rules:

- do not preserve stale `event=syd2026` when the user switches to custom event mode,
- do not store handoff data on the server,
- do not make the handoff note sound like a certificate, licence, patronage or institutional approval,
- keep the handoff note practical and print-focused.

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

The current PR47–PR53 architecture documents the font roles. Later print-engine PRs should embed licensed fonts locally.

Recommended roles:

- Monumental title serif: Veritas Humanum custom serif / Cormorant / EB Garamond / Cinzel style
- Participation body: premium serif or restrained humanist sans
- Witness Report reflection: premium typewriter style
- Metadata / numbering: clean sans or mono

Never commit private or unlicensed commercial font files without verifying licensing.
