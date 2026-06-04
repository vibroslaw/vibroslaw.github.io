# Prawda Sumienia — QA Gates for World-Class Pages

Status: release checklist for the Prawda Sumienia page system.

This checklist must be used before merging any PR that changes public pages, exclusive pages, generator flows, event pages, archive behaviour or participant documents.

## Gate 1 — Scope Discipline

A PR must answer:

- What exact experience is improved?
- What routes are touched?
- What routes are intentionally untouched?
- Is this public, exclusive, generator, event, archive or documentation work?
- Does this PR introduce any privacy/data implication?

Fail conditions:

- PR mixes unrelated public page, generator and archive work.
- PR silently changes legacy generator behaviour.
- PR adds event-specific assumptions without documenting them.

## Gate 2 — Historical and Ethical Tone

Check every visible sentence for:

- historical caution,
- no sensationalism,
- no invented institutional endorsement,
- no overclaiming,
- no political simplification,
- no Auschwitz imagery or language used as shock effect.

Required question:

> Would this wording be safe in front of a historian, rector, museum educator and family audience?

Fail conditions:

- emotional language replaces historical clarity,
- promotional language weakens trust,
- page implies official approval not present in the repo/context,
- participant reflections are presented as historical evidence.

## Gate 3 — Mobile QR Experience

For exclusive and event routes, test the first 10 seconds on phone.

Required checks:

- first screen loads clearly,
- primary CTA visible or easily reachable,
- no modal blocks the experience,
- event context appears when expected,
- page still works without event parameter,
- return-later note is visible near primary actions,
- touch targets feel safe,
- no horizontal scroll.

Test URLs:

```text
/rap-ort/prawda-sumienia/exclusive/?event=syd2026
/rap-ort/prawda-sumienia/exclusive/pl/?event=oswiecim20260525
/rap-ort/prawda-sumienia/exclusive/
/rap-ort/prawda-sumienia/exclusive/pl/
```

Fail conditions:

- user cannot understand purpose in 3 seconds,
- CTA hierarchy is unclear,
- event parameter breaks links,
- page feels like a marketing landing page instead of a post-screening portal.

## Gate 4 — Event Propagation

When `?event=` is present:

- banner should show for known events,
- unknown events should not display misleading labels,
- links with `data-psx-event-link` should preserve/update event parameter,
- hash links should remain intact,
- internal anchors must still work.

Fail conditions:

- event parameter is dropped between exclusive and generator,
- event label appears for unknown event,
- hash link breaks after propagation,
- event-specific copy appears on non-event routes without reason.

## Gate 5 — Privacy

Required checks:

- No personal data is requested by default.
- If a name field exists, purpose is explained.
- If text may be archived, explicit consent exists.
- Anonymous archive copy warns against names and identifying details.
- Local-only behaviour is described as local-only.
- Reset behaviour is honest.

Fail conditions:

- archive implies storage without explanation,
- user text is displayed publicly by default,
- name/contact fields are required without strong reason,
- privacy note is hidden below nonessential content.

## Gate 6 — Bilingual Quality

PL and EN must be checked separately.

Required checks:

- same meaning,
- appropriate tone in each language,
- no machine-translation feel,
- no missing CTA parity,
- links point to correct language routes where available,
- `data-lang` is correct,
- `hreflang` is correct where relevant.

Fail conditions:

- EN is a literal Polish translation with awkward phrasing,
- PL loses emotional depth,
- one language has privacy warnings and the other does not,
- PL routes point to EN pages without reason.

## Gate 7 — Accessibility

Required checks:

- skip link exists,
- headings are semantic and ordered,
- important dynamic content has accessible treatment where needed,
- focus styles remain visible,
- links have meaningful labels,
- reduced motion support remains available,
- contrast is readable,
- keyboard navigation works.

Fail conditions:

- CTA only distinguished by colour,
- dynamic event label cannot be perceived,
- keyboard user cannot reach primary actions,
- motion is mandatory for comprehension.

## Gate 8 — Visual Restraint

Required checks:

- page supports reading,
- visual atmosphere is serious,
- hero image does not overpower text,
- gold remains accent only,
- no excessive glow,
- no gratuitous camp imagery,
- no fake document/seal effect unless clearly an artistic artifact.

Fail conditions:

- design looks like entertainment marketing,
- design makes text hard to read,
- archive/certificate visuals imply official certification without approval.

## Gate 9 — Performance

Required checks:

- no unnecessary new libraries,
- no autoplay media,
- images compressed,
- CSS scoped and not duplicated wildly,
- no major layout shift around hero or CTA,
- mobile first view feels immediate.

Fail conditions:

- new heavy dependency for simple UI,
- massive image used without responsive handling,
- script blocks initial content,
- page depends on animation for layout.

## Gate 10 — Link Integrity

Check all visible links manually.

Required route groups:

- public Rap-Ort routes,
- exclusive routes,
- Witness Report routes,
- Record/Zapis routes,
- institution/contact routes,
- anchor links.

Fail conditions:

- CTA 404,
- PL links lead unexpectedly to EN where PL exists,
- event parameter removed from generator CTA,
- anchor scrolls to wrong section.

## Gate 11 — Document / Generator Output

For generator work, test:

- empty field,
- short reflection,
- long reflection,
- Polish characters,
- English text,
- name with diacritics if name field exists,
- mobile download,
- desktop download,
- reset,
- repeated generation.

Fail conditions:

- mobile download silently fails,
- generated document text overflows,
- diacritics break,
- user loses text unexpectedly,
- output looks unofficially official.

## Gate 12 — Merge Readiness

Before marking ready:

- PR title describes outcome, not implementation detail only,
- PR body lists touched and untouched routes,
- screenshots or manual QA notes are added for visual PRs,
- stacked base is correct,
- merge order is documented,
- no unrelated formatting churn unless it improves maintainability.

Fail conditions:

- PR cannot be reviewed without guessing context,
- stacked dependency is not documented,
- no manual QA notes for user-facing page changes.

## Required PR Body Template

```markdown
## Purpose

## Routes changed

## Routes intentionally untouched

## What this improves

## Privacy / data impact

## Manual QA

- [ ] Mobile EN
- [ ] Mobile PL
- [ ] Desktop EN
- [ ] Desktop PL
- [ ] Event parameter known
- [ ] Event parameter missing
- [ ] Links tested

## Merge order / dependency
```

## World-Class Merge Rule

A PR may be functional and still not merge-ready.

Merge only when it is:

- functional,
- readable,
- maintainable,
- ethically safe,
- institution-safe,
- mobile-safe,
- bilingual-safe.
