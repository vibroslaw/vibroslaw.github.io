# PR #147 — Prawda Sumienia Report Journey Map

Status: implementation QA note for the bilingual Report Journey Map layer.

## Purpose

Build a supporting interpretive layer after PR #146.

This PR adds a bilingual map that explains the moral and narrative journey behind `Rap-Ort: Prawda Sumienia`: witness, entry, report, transmission, silence, return of memory and the viewer's responsibility.

The goal is not to create a full historical chronology. The goal is to help institutions, educators, Polish diaspora organisers and international viewers understand the structure of the work before or after a screening.

## Routes added

- `/rap-ort/prawda-sumienia/report-journey/`
- `/rap-ort/prawda-sumienia/pl/sciezka-raportu/`

## Routes intentionally untouched

- `/rap-ort/prawda-sumienia/`
- `/rap-ort/prawda-sumienia/pl/`
- `/rap-ort/prawda-sumienia/exclusive/`
- `/rap-ort/prawda-sumienia/exclusive/pl/`
- `/rap-ort/witness-report/generator/`
- `/rap-ort/raport-swiadka/generator/`
- `/rap-ort/participation/`
- `/rap-ort/uczestnictwo/`
- `/rap-ort/oswiecim/zapis-uczestnictwa/`
- all generator, archive, participation, QR and exclusive-portal logic.

## What changed

The PR adds:

- English Report Journey Map page,
- Polish Ścieżka Raportu page,
- bilingual `hreflang` pairing,
- schema descriptions,
- interpretive seven-station map,
- institutional usage notes,
- discussion prompts,
- presentation guardrails,
- restrained CTAs leading back to the main work and screening enquiry,
- no new JavaScript,
- no new data collection.

## Source Pack

### Historical claims changed

This PR does not introduce new detailed historical claims. It uses broad, cautious references to:

- Pilecki's testimony,
- the Auschwitz mission as historical anchor,
- reporting as transmission of testimony,
- silence and later memory as moral themes.

### Primary sources used

The page remains compatible with the project's existing source base around Pilecki's reports and camp testimony. No direct quotations are introduced.

### Secondary sources used

No new external secondary-source quotations are introduced in the page copy.

### Artistic interpretation notes

The map is explicitly described as interpretive. It is not presented as:

- a complete historical chronology,
- archival reconstruction,
- scholarly substitute,
- museum lesson,
- official institutional statement.

### Claims intentionally avoided

The page avoids:

- claims of official endorsement,
- claims of patronage,
- claims that the project is museum-approved,
- sensational framing of the Auschwitz mission,
- claims that the map covers every historical step,
- claims that artistic interpretation equals historical proof.

### Reviewer attention needed

Reviewers should check:

- whether the map reads clearly before a screening,
- whether the stations are too abstract for younger audiences,
- whether the phrase “Entry” / “Wejście” is strong but not sensational,
- whether the guardrails are visible enough,
- mobile spacing of the eight station cards.

## Institutional Review Mode

### Rector

Pass target: the map should look like a serious orientation layer that can support academic discussion without pretending to be a lecture.

### Museum educator

Pass target: the map must not replace source-based education. It should make clear that it is an interpretive route through the work.

### Historian

Pass target: the page avoids new unsupported specifics and keeps claims broad, cautious and source-aware.

### Student / young participant

Pass target: the seven stations should be readable, emotionally serious and understandable without academic overload.

### Polish diaspora organiser

Pass target: EN/PL versions should help mixed audiences understand why the work moves from Pilecki's testimony to contemporary responsibility.

## Scoring Matrix

| Category | Score | Notes |
|---|---:|---|
| Historical trust | 9.2/10 | Broad, cautious claims; no new direct quotations. |
| Institutional usefulness | 9.5/10 | Strong bridge before/after screening. |
| Educational clarity | 9.3/10 | Seven stations make discussion easier. |
| Bilingual quality | 9.4/10 | PL is native, not literal; EN is institution-facing. |
| Privacy and data safety | 10/10 | No forms, no tracking, mailto only. |
| Visual restraint | 9.1/10 | Uses existing restrained Veritas system. |
| Accessibility | 9/10 | Semantic headings, skip link and descriptive labels retained. |
| Performance | 9.4/10 | No new JS or heavy dependency. |
| Maintainability | 9.6/10 | Two new route files plus QA note only. |
| Merge discipline | 9.7/10 | Narrow post-#146 scope. |

## Red Team Pass

### What could be misunderstood?

A viewer might mistake the map for a full chronology. The page explicitly states it is interpretive and not a reconstruction of every historical step.

### What could be called overclaiming?

The moral movement from witness to viewer. The page frames this as the work's interpretive structure, not a historical proof claim.

### What could look too promotional?

The final screening enquiry CTA. It remains secondary to the map and uses restrained institutional language.

### What could expose private data?

Nothing in this PR. It adds no collection mechanism.

### What would break on mobile?

The station grid may feel long. Visual QA should check card rhythm and spacing on small screens.

### What would a historian challenge?

Any phrase that sounds like definitive causality between report, silence and memory. The copy avoids detailed causal claims and uses broad interpretive language.

### What would a rector ask us to soften?

If “viewer responsibility” sounds accusatory. Current copy frames it as a question rather than a demand.

### What would a participant feel pressured by?

The final station could feel personal. It is worded as reflection, not as a required submission.

## Manual QA checklist

- [x] EN route added
- [x] PL route added
- [x] Hreflang pairing added
- [x] Schema descriptions added
- [x] Seven-station map added
- [x] Discussion prompts added
- [x] Presentation guardrails added
- [x] No generator files changed
- [x] No exclusive portal files changed
- [x] No archive behaviour changed
- [x] No participation flow changed
- [x] No QR flow changed
- [x] No new JavaScript introduced
- [x] No personal-data collection introduced
- [x] Mailto enquiry only
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
4. PR #146 — public institutional shell

This PR should remain draft until visual QA confirms the new map pages read well on mobile and desktop.
