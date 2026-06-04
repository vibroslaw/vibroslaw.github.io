# Prawda Sumienia — Unified Generator Plan

Status: implementation blueprint for future generator consolidation.

This document defines the target architecture for a unified generator system that can support Witness Report, Record of Participation, event-specific certificates, anonymous archive traces and future institutional variants without duplicating fragile code across pages.

## Problem

The current project has multiple working routes for participant output:

- Witness Report generator,
- Raport Świadka generator,
- Record of Participation,
- Zapis Uczestnictwa,
- event-specific Oświęcim flow,
- future Sydney / diaspora flow.

This is useful for fast delivery, but it creates long-term risk:

- duplicated event logic,
- inconsistent copy,
- inconsistent privacy rules,
- difficult QA,
- separate fixes for mobile download,
- unclear relationship between public, exclusive and event-specific pages.

The unified generator must solve that without breaking existing links.

## North Star

One generator system. Multiple outputs. Event-aware. Language-aware. Privacy-first. Mobile-stable.

The user should never feel they are using a technical form. The experience should feel like writing or receiving a quiet document after a serious screening.

## Target User Flows

### Flow 1 — Witness Report

Entry:

- exclusive portal CTA,
- direct QR,
- public page optional link,
- event-specific route.

Steps:

1. User enters a short reflection.
2. User sees privacy note before submitting/generating.
3. User can generate a downloadable visual/PDF record.
4. User can optionally keep it private.
5. If archive feature is enabled, user can choose anonymous archive display.

Rules:

- no forced name,
- no forced email,
- no public submission by default,
- reflection must be allowed to be short,
- user must be able to abandon without data loss pressure.

### Flow 2 — Record of Participation

Entry:

- exclusive portal CTA,
- event QR,
- event organiser link.

Steps:

1. User sees event-specific context.
2. User optionally enters name only if the document is purely local/downloadable.
3. User generates a premium document.
4. User downloads as PDF or image.
5. User receives no implication that the name is stored unless storage exists and is explicitly described.

Rules:

- if name is typed locally, say so clearly,
- no hidden storage,
- no confusing archive relationship,
- event identity must be visible.

### Flow 3 — Anonymous Archive

Entry:

- exclusive portal archive card,
- generator post-output screen,
- future archive route.

Steps:

1. User sees a strict anonymity note.
2. User writes a short trace.
3. User previews the trace.
4. User explicitly chooses whether it may appear anonymously.
5. If the current implementation is local-only/foundation-only, the UI must state that.

Rules:

- no names,
- no contact details,
- no third-party identifiers,
- no full testimonies pretending to be verified sources,
- no user-generated claims presented as historical evidence.

## Route Strategy

### Current routes to preserve

Do not break:

- `/rap-ort/witness-report/generator/`
- `/rap-ort/raport-swiadka/generator/`
- `/rap-ort/participation/`
- `/rap-ort/uczestnictwo/`
- `/rap-ort/oswiecim/zapis-uczestnictwa/`

### Future unified routes

Recommended target routes:

- `/rap-ort/prawda-sumienia/generator/`
- `/rap-ort/prawda-sumienia/generator/pl/`

Optional output mode parameter:

- `?mode=witness-report`
- `?mode=record`
- `?mode=archive-trace`

Optional event parameter:

- `?event=oswiecim20260525`
- `?event=syd2026`
- future events as registry entries.

Example:

```text
/rap-ort/prawda-sumienia/generator/pl/?mode=record&event=oswiecim20260525
```

Legacy routes should redirect only when the unified generator is fully tested.

## Event Registry

Event data should not be hardcoded in multiple JS files.

Target event registry shape:

```js
const PRAWDA_SUMIENIA_EVENTS = {
  oswiecim20260525: {
    label: {
      pl: 'Oświęcim / 25 maja 2026',
      en: 'Oświęcim / 25 May 2026'
    },
    institution: {
      pl: 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu',
      en: 'Cavalry Captain Witold Pilecki State University of Małopolska in Oświęcim'
    },
    defaultLanguage: 'pl',
    allowedModes: ['witness-report', 'record', 'archive-trace'],
    archiveEnabled: false,
    publicIndexing: false
  }
};
```

Event fields:

- `label`,
- `institution`,
- `location`,
- `date`,
- `defaultLanguage`,
- `allowedModes`,
- `archiveEnabled`,
- `privacyMode`,
- `documentTheme`,
- `organiserNote`,
- `qrShortLabel`.

## Generator Modes

### Mode: `witness-report`

Required UI:

- title,
- event context if available,
- reflective prompt,
- text area,
- privacy note,
- generate button,
- download button,
- reset button.

Output:

- premium visual report,
- optional PDF,
- optional image.

### Mode: `record`

Required UI:

- event context,
- document explanation,
- optional participant name field,
- privacy/local-use note,
- generate/download actions.

Output:

- commemorative record,
- PDF first,
- image optional.

### Mode: `archive-trace`

Required UI:

- anonymity warning,
- strict no-personal-data instruction,
- short reflection field,
- preview,
- explicit consent control if archive publishing is enabled.

Output:

- local preview or stored anonymous trace depending on implementation phase.

## Privacy Principles

1. No hidden collection.
2. No personal data by default.
3. Name fields must be optional unless explicitly needed for local document output.
4. Archive text must be anonymous.
5. User text is not historical evidence.
6. Local-only generation must be described as local-only.
7. If future storage is added, the page must show what is stored, why, where and for how long.

## Document Output Standards

Generated documents must match the tone of the project:

- archival,
- premium,
- black/charcoal/gold/ivory,
- restrained,
- printable,
- readable at A4,
- appropriate for wall or personal archive.

Output types:

- PDF for official/premium output,
- PNG/JPG for phone sharing or saving,
- accessible text fallback where possible.

Document content must include:

- project identity,
- event identity if available,
- date/location if event registry provides it,
- participant reflection or record title,
- privacy-safe wording,
- no fake certification language unless institution approved.

Avoid:

- fake seals,
- fake official signatures,
- overdecorated certificates,
- claims of attendance verification unless verified.

## UX Requirements

### First screen

The user must see:

- where they are,
- what they can create,
- whether an event is attached,
- whether data is private/local/anonymous.

### Mobile download

Must support:

- iOS Safari,
- Android Chrome,
- desktop Chrome/Edge,
- fallback if automatic download fails.

### Error states

Must include:

- empty reflection warning,
- too-long text warning,
- download failure fallback,
- missing event fallback,
- unknown mode fallback.

### Reset states

Reset must:

- clearly warn before clearing text,
- not delete anything already downloaded,
- not imply server deletion if no server exists.

## Technical Architecture

Recommended files:

```text
assets/js/prawda-sumienia-events.js
assets/js/prawda-sumienia-generator.js
assets/js/prawda-sumienia-generator-renderers.js
assets/css/prawda-sumienia-generator.css
rap-ort/prawda-sumienia/generator/index.html
rap-ort/prawda-sumienia/generator/pl/index.html
```

Architecture split:

- event registry,
- mode parser,
- copy dictionary,
- renderer,
- download/export helpers,
- privacy/validation helpers,
- UI state controller.

Do not build one huge file.

## Migration Plan

### Phase 1 — Registry only

- Introduce event registry.
- Keep existing pages.
- Make exclusive portal read event labels from registry.

### Phase 2 — Unified generator shell

- Create new generator route.
- Implement `mode` and `event` parsing.
- Add placeholder modes with no legacy redirects yet.

### Phase 3 — Record output

- Move Record/Zapis logic into unified generator.
- Keep old routes as wrappers or redirects only after testing.

### Phase 4 — Witness Report output

- Move Witness Report/Raport Świadka logic.
- Preserve existing QR links through redirects or compatibility wrappers.

### Phase 5 — Archive trace

- Implement local/foundation archive safely.
- Add storage only if privacy policy and consent model are ready.

### Phase 6 — Legacy cleanup

- Redirect legacy routes.
- Keep canonical route clear.
- Update exclusive/public CTAs.

## QA Matrix

Test every mode with:

- no event,
- known event,
- unknown event,
- PL language,
- EN language,
- mobile small screen,
- desktop,
- long text,
- empty text,
- download success,
- download failure fallback.

Required URLs:

```text
/rap-ort/prawda-sumienia/generator/?mode=witness-report
/rap-ort/prawda-sumienia/generator/?mode=witness-report&event=syd2026
/rap-ort/prawda-sumienia/generator/pl/?mode=record&event=oswiecim20260525
/rap-ort/prawda-sumienia/generator/pl/?mode=archive-trace&event=oswiecim20260525
```

## Definition of Done

The unified generator is not ready until:

- existing QR routes still work,
- old generators are not broken,
- event context is visible,
- privacy language is unambiguous,
- document download works on mobile,
- PL and EN are both checked manually,
- unknown events fail gracefully,
- no personal data is stored without explicit disclosure,
- output documents look premium enough for institutional use.
