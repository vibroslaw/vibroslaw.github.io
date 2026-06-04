# PR #148 — Prawda Sumienia Chapter System

## Purpose

Adds a bilingual chapter-system layer for `Rap-Ort: Prawda Sumienia`.

The goal is to help institutions, educators, diaspora audiences and international viewers understand the internal structure of the audiovisual work without turning the screening into a simplified plot summary or a full historical reconstruction.

## Routes added

- `/rap-ort/prawda-sumienia/chapters/`
- `/rap-ort/prawda-sumienia/pl/rozdzialy/`

## Existing routes linked

- `/rap-ort/prawda-sumienia/`
- `/rap-ort/prawda-sumienia/pl/`
- `/rap-ort/prawda-sumienia/report-journey/`
- `/rap-ort/prawda-sumienia/pl/sciezka-raportu/`

## Scope

This PR adds static public orientation pages and link integration from existing Prawda Sumienia pages.

It does not change:

- generator flows,
- QR flows,
- archive flows,
- participation forms,
- exclusive portal logic,
- data collection,
- JavaScript behaviour.

## Editorial guardrails

The chapter system is framed as:

- interpretive,
- orientation-focused,
- screening-supportive,
- institution-safe,
- non-sensational.

It is not framed as:

- a full historical chronology,
- a transcript,
- a scholarly edition,
- a museum-approved structure,
- an official institutional endorsement,
- a replacement for historical study.

## Historical caution

The page avoids introducing new detailed historical claims. It describes the work's internal moral and narrative architecture.

Sensitive areas are handled cautiously:

- Auschwitz is not used for spectacle.
- Pilecki's mission is framed as a moral and historical anchor.
- Post-war material is framed as pressure, silence and political machinery without overclaiming.
- Chapter seven is deliberately marked as an interlude / title-to-confirm because the final public title is not yet locked.

## UX refinements added after audit

- Chapter cards are grouped into acts instead of one uninterrupted list.
- EN and PL pages now include Open Graph and Twitter card metadata.
- Public Prawda Sumienia pages link directly to the chapter system.
- Journey of the Report pages link directly to the chapter system.
- Chapter Seven / Rozdział siódmy is presented as an interlude to reduce the unfinished feel.

## Bilingual approach

The Polish page is not a literal translation of the English page. It is native Polish institutional copy aligned with the same structure.

## Manual QA checklist

- [x] EN route added.
- [x] PL route added.
- [x] Canonical URLs added.
- [x] hreflang alternates added.
- [x] Open Graph metadata added.
- [x] Twitter card metadata added.
- [x] Pages grouped into acts for better mobile scanning.
- [x] Public EN Prawda Sumienia page linked.
- [x] Public PL Prawda Sumienia page linked.
- [x] EN Journey of the Report page linked.
- [x] PL Ścieżka Raportu page linked.
- [x] Mailto only, no data collection.
- [x] No new JS.
- [x] No new external dependencies.
- [x] No claim of official endorsement.
- [x] No graphic/sensational language.
- [ ] Mobile visual QA.
- [ ] Desktop visual QA.
- [ ] Link click-through QA after deploy.

## Recommended next step

Run final PR audit. If no content issues appear, mark the PR ready for review and merge after visual QA.
