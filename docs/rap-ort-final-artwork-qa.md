# Rap-Ort Final Artwork QA

Use this checklist after replacing the procedural SVGs with final photorealistic WebP artwork.

## Test URLs

Use normal pages:

- `/rap-ort/experience/oswiecim20260525/`
- `/rap-ort/experience/syd2026/`
- `/rap-ort/uczestnictwo/?event=oswiecim20260525`
- `/rap-ort/participation/?event=syd2026`
- `/rap-ort/raport-swiadka/generator/?event=oswiecim20260525`
- `/rap-ort/witness-report/generator/?event=syd2026`

Use artwork audit mode:

- `/rap-ort/experience/oswiecim20260525/?artworkAudit=1`
- `/rap-ort/experience/syd2026/?artworkAudit=1`
- `/rap-ort/uczestnictwo/?event=oswiecim20260525&artworkAudit=1`
- `/rap-ort/participation/?event=syd2026&artworkAudit=1`
- `/rap-ort/raport-swiadka/generator/?event=oswiecim20260525&artworkAudit=1`
- `/rap-ort/witness-report/generator/?event=syd2026&artworkAudit=1`

## Required visual pass criteria

- [ ] All required final WebP files are present.
- [ ] Pages receive `has-premium-assets`.
- [ ] Pages still receive `has-resolved-cinematic-assets`.
- [ ] Artwork audit panel reports all required WebP files as present.
- [ ] Procedural SVGs remain available as fallback.
- [ ] No visible text, fake letters or symbols appear inside images.
- [ ] No faces, logos, flags, gore or propaganda symbols appear in images.
- [ ] Hero image has safe empty space for overlay copy.
- [ ] Mobile hero crop remains readable and atmospheric.
- [ ] Document preview remains legible against the background.
- [ ] Witness Report feels like a writing desk, not a web form.
- [ ] Memory Pack feels like a curated event case.
- [ ] Archive Gallery feels like a quiet museum wall.
- [ ] Final scene feels like an ending, not another card section.

## Technical pass criteria

- [ ] No 404 requests for required WebP files.
- [ ] No JavaScript errors in console.
- [ ] Missing optional/recommended assets only log info, not hard errors.
- [ ] PDF export still works.
- [ ] Anonymous JPG export still works.
- [ ] Typewriter sound still works.
- [ ] Mobile layout has no horizontal overflow.
- [ ] Reduced motion mode disables breathing projection animation.
- [ ] Page load remains acceptable on mobile.

## File size guidance

Recommended WebP targets:

- 3840x2160 hero scenes: ideally under 650 KB each, maximum around 1 MB if visually necessary.
- 2160x3840 mobile hero: ideally under 650 KB.
- 2400x1600 event pass: ideally under 450 KB.

Prefer visual quality over extreme compression, but avoid multi-megabyte images on GitHub Pages.

## Final acceptance statement

The final artwork pass is complete only when the experience no longer feels like a styled interface, but like a cinematic museum installation connected to the post-screening ritual.
