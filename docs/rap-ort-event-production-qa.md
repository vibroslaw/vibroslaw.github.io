# Rap-Ort Event Production QA

Internal checklist for final event testing before using the participant flow at Oświęcim / MUP, Sydney 2026, or future Rap-Ort screenings.

## Test URLs

### Oświęcim / MUP

- `/rap-ort/uczestnictwo/?event=oswiecim20260525`
- `/rap-ort/raport-swiadka/generator/?event=oswiecim20260525`
- `/rap-ort/participation/?event=oswiecim20260525`
- `/rap-ort/witness-report/generator/?event=oswiecim20260525`

### Sydney 2026

- `/rap-ort/participation/?event=syd2026`
- `/rap-ort/witness-report/generator/?event=syd2026`
- `/rap-ort/uczestnictwo/?event=syd2026`
- `/rap-ort/raport-swiadka/generator/?event=syd2026`

### Fallbacks

- `/rap-ort/uczestnictwo/`
- `/rap-ort/participation/`
- `/rap-ort/uczestnictwo/?event=unknown`
- `/rap-ort/raport-swiadka/generator/`

## Pre-event pass criteria

### Access Flow

- [ ] The event label is correct.
- [ ] Copy link works or shows graceful fallback.
- [ ] Native share works where supported or shows graceful fallback.
- [ ] QR-ready visual does not imply real security.
- [ ] No console errors.

### Participant Portal

- [ ] Event Access, Witness Report, Participation Record, Memory Pack and Archive Gallery links are visible.
- [ ] The active event is preserved in links.
- [ ] Privacy note is visible.
- [ ] Facilitator note is visible.
- [ ] Mobile layout is clean.

### Participation Record

- [ ] Place/date autofill correctly for Oświęcim.
- [ ] Place/date autofill correctly for Sydney.
- [ ] Default/public fallback works.
- [ ] PDF exports locally.
- [ ] PDF filename uses the active event pack where available.
- [ ] Typewriter sound still works.

### Witness Report

- [ ] Event badge appears.
- [ ] Empty reflection blocks export.
- [ ] Private PDF exports locally.
- [ ] Anonymous JPG exports locally.
- [ ] Oświęcim PDF filename uses `Oswiecim-2026-05-25`.
- [ ] Sydney PDF filename uses `Sydney-2026`.
- [ ] Oświęcim anonymous JPG uses `wr-osw20260525-anon`.
- [ ] Sydney anonymous JPG uses `wr-syd2026-anon`.
- [ ] Anonymous JPG contains no name, surname or signature.
- [ ] Typewriter sound remains optional.

### Memory Pack

- [ ] Correct event-specific pack appears.
- [ ] Missing assets become intentional placeholders.
- [ ] `#memory-pack` anchor works.
- [ ] No broken layout on mobile.

### Archive Gallery

- [ ] Correct event-specific gallery appears.
- [ ] Placeholder cards appear when manifest has no items.
- [ ] Archive manifest JSON loads or fails gracefully.
- [ ] Privacy principle is visible.
- [ ] No upload or automatic storage is present.

### Cross-device

- [ ] Chrome desktop.
- [ ] Edge desktop.
- [ ] Safari or iOS Safari if available.
- [ ] Android Chrome if available.
- [ ] Mobile width around 390px.
- [ ] Keyboard tab navigation through primary buttons/links.

## Manual archive workflow

1. Participant creates Witness Report locally.
2. Participant downloads private PDF for themselves.
3. Participant optionally downloads anonymous JPG.
4. Participant may pass the anonymous JPG to the facilitator.
5. Maintainer manually reviews the JPG to confirm no personal data.
6. Maintainer uploads approved JPG to `archive/anonymous/`.
7. Maintainer updates `ARCHIVE_MANIFEST.json`.
8. Archive Gallery renders the approved static files.

## Non-goals

- No backend.
- No database.
- No upload endpoint.
- No automatic archive submission.
- No password system.
- No QR token security.
- No analytics.
- No personal data collection.
