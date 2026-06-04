# PR #146 — Public Prawda Sumienia Institutional Shell

Status: implementation QA note for the public Prawda Sumienia page shell.

## Purpose

Build the first implementation PR after the world-class standards work.

This PR transforms the public Prawda Sumienia routes from short orientation pages into serious institutional landing pages for screening enquiries, educational/cultural use and international context.

## Routes changed

- `/rap-ort/prawda-sumienia/`
- `/rap-ort/prawda-sumienia/pl/`

## Routes intentionally untouched

- `/rap-ort/prawda-sumienia/exclusive/`
- `/rap-ort/prawda-sumienia/exclusive/pl/`
- `/rap-ort/witness-report/generator/`
- `/rap-ort/raport-swiadka/generator/`
- `/rap-ort/participation/`
- `/rap-ort/uczestnictwo/`
- `/rap-ort/oswiecim/zapis-uczestnictwa/`
- all generator, archive and QR-specific logic.

## What changed

The public EN and PL pages now include:

- stronger meta titles and descriptions,
- bilingual `hreflang` pairing,
- clearer schema description,
- institutional hero,
- one-sentence definition,
- at-a-glance organiser briefing,
- what the work is / is not,
- source-aware foundation,
- screening format,
- screening pathways,
- institutional use cases,
- organiser notes,
- previous presentation context,
- responsible presentation note,
- screening enquiry section,
- restrained CTA hierarchy.

## Source Pack

### Historical claims changed

This PR introduces cautious public-facing claims that the work is inspired by:

- the reports of rotmistrz Witold Pilecki,
- the history of KL Auschwitz,
- prison testimony connected with the camp experience,
- later historical remembrance.

It also references Pilecki’s voluntary mission to Auschwitz, underground reporting and the moral burden of testimony.

### Primary sources used

The page language is written to remain compatible with the project’s existing source base around Pilecki’s reports and camp testimony. This PR does not add direct quotations.

### Secondary sources used

No new external secondary-source quotations are introduced in the page copy.

### Artistic interpretation notes

The page explicitly describes the work as an authorial audiovisual form and separates:

- historical anchor,
- artistic form,
- ethical rule.

It states that the project does not replace scholarship, archival research or museum education.

### Claims intentionally avoided

The page avoids:

- claims of official endorsement,
- claims of patronage,
- claims that the project is museum-approved,
- exaggerated claims such as “the world knew everything”,
- sensational language,
- user reflections as historical evidence.

### Reviewer attention needed

Reviewers should check:

- wording around the May 2026 Oświęcim presentation,
- whether “approximately 65 minutes” matches the final exported version,
- whether future public proof links should be added after #143–#145 are merged,
- visual spacing of the longer at-a-glance and screening-pathway sections on small mobile screens.

## Institutional Review Mode

### Rector

Pass target: the page should read as serious, careful and useful for an academic screening enquiry. The at-a-glance block now gives a fast institutional summary before deeper reading.

### Museum educator

Pass target: the page avoids spectacle and describes the project as a reflective audiovisual form, not as replacement for museum education. Organiser notes reinforce responsible presentation.

### Historian

Pass target: no unsupported date-heavy claims, no overclaiming, no sensational statements. The copy remains interpretive and source-aware rather than quote-heavy.

### Student / young participant

Pass target: the first screen explains what the work is and why it matters without academic overload. The page avoids turning the work into a test or campaign.

### Polish diaspora organiser

Pass target: EN page explains the project clearly for non-Polish institutional readers while retaining Polish memory context. PL page remains native rather than literal.

## Scoring Matrix

| Category | Score | Notes |
|---|---:|---|
| Historical trust | 9.3/10 | Claims are cautious and source-aware; no direct quotations added. |
| Institutional clarity | 9.8/10 | At-a-glance, screening pathways and organiser notes make the page substantially more usable. |
| Mobile QR experience | 9.1/10 | Public page is not a QR route, but now gives fast mobile summary and direct anchors. |
| Bilingual quality | 9.5/10 | PL and EN are equivalent, native and institution-facing. |
| Privacy and data safety | 10/10 | No data collection, no forms, mailto only. |
| Visual restraint | 9.2/10 | Uses existing restrained Veritas visual system without adding decorative noise. |
| Accessibility | 9/10 | Keeps skip link, semantic sections, descriptive headings and clear CTA labels. |
| Performance | 9.2/10 | No new JS, no new heavy dependency, existing CSS only. |
| Maintainability | 9.2/10 | Only two route files plus QA note; no shared logic touched. |
| Merge discipline | 9.6/10 | Scope is narrow, PR is stacked after #145 and unchanged routes are explicit. |

## Red Team Pass

### What could be misunderstood?

That the Oświęcim presentation implies formal endorsement. The page explicitly says it is development context, not formal patronage.

### What could be called overclaiming?

The project’s source foundation. The page uses “inspired by” and avoids direct claims beyond the source-aware framing.

### What could look too promotional?

The screening CTA. It is framed as an enquiry, not as sales language. The new organiser content makes the page more useful rather than louder.

### What could expose private data?

Nothing in this PR. It adds no form and no collection mechanism.

### What would break on mobile?

Potentially long content blocks. The new at-a-glance section improves first-screen usefulness, but visual QA should still check small screens.

### What would a historian challenge?

Any too-compressed statement about reports, testimony and memory. The page avoids detailed contested claims and preserves cautious language.

### What would a rector ask us to soften?

Any implication of institutional endorsement. The copy already softens and qualifies the Oświęcim reference.

### What would a participant feel pressured by?

Nothing; public page has enquiry CTAs aimed at institutions, not participant submission pressure.

## Manual QA checklist

- [x] EN route updated
- [x] PL route updated
- [x] At-a-glance section added
- [x] Screening pathways added
- [x] Organiser notes added
- [x] No generator files changed
- [x] No exclusive portal files changed
- [x] No archive behaviour changed
- [x] No new JavaScript introduced
- [x] No personal-data collection introduced
- [x] Mailto enquiry only
- [x] Bilingual route pairing preserved
- [ ] Visual QA on mobile EN
- [ ] Visual QA on mobile PL
- [ ] Visual QA on desktop EN
- [ ] Visual QA on desktop PL
- [ ] Link click-through QA after preview deploy

## Merge order / dependency

Stacked after:

1. PR #143 — exclusive foundation
2. PR #144 — QR hardening
3. PR #145 — world-class page standards

This PR should remain draft until the stack order is confirmed and preview QA is complete.
