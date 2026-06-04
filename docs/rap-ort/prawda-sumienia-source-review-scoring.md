# Prawda Sumienia — Source, Review and Scoring Standard

Status: final quality gate for Prawda Sumienia implementation PRs.

This document upgrades the page-system blueprint with the missing final layer: source discipline, institutional review, scoring and the immediate PR roadmap.

It should be used together with:

- [`prawda-sumienia-world-class-pages.md`](./prawda-sumienia-world-class-pages.md)
- [`prawda-sumienia-unified-generator-plan.md`](./prawda-sumienia-unified-generator-plan.md)
- [`prawda-sumienia-qa-gates.md`](./prawda-sumienia-qa-gates.md)

## Why this exists

A page can be beautiful, technically correct and still fail the project if it is historically weak, institutionally vague or emotionally manipulative.

The final standard is therefore:

> No public Prawda Sumienia page should ship unless it can defend its historical claims, survive institutional review and score strongly across trust, mobile experience, bilingual quality, privacy and maintainability.

## Gate 13 — Source Pack

Every implementation PR that adds or changes historical content must include a short source pack in the PR body or in a linked document.

### Required source pack fields

```markdown
## Source Pack

### Historical claims changed

### Primary sources used

### Secondary sources used

### Artistic interpretation notes

### Claims intentionally avoided

### Reviewer attention needed
```

### Source categories

Use clear categories:

1. **Primary source** — report, testimony, prison note, letter, document, archival material.
2. **Secondary source** — historian, museum publication, scholarly book, institutional article.
3. **Project interpretation** — artistic or educational framing based on sources.
4. **Participant reflection** — user-generated or post-screening text, never treated as historical evidence.

### Minimum rules

- Do not introduce a specific historical claim without a source trail.
- Do not turn artistic interpretation into factual assertion.
- Do not use participant reflections as evidence.
- Do not imply institutional endorsement from an event unless explicitly approved.
- Distinguish Pilecki’s reports, later publications and project narration.
- Mark uncertain or interpretive language clearly.

### Red-flag phrases

Avoid or justify carefully:

- “the world knew everything”,
- “nobody listened”,
- “the first”,
- “the only”,
- “proved forever”,
- “officially recognised by”,
- “certified by”,
- “museum-approved”,
- “unseen truth”,
- “hidden from everyone”.

These may be emotionally effective but institutionally risky if unsupported.

## Gate 14 — Institutional Review Mode

Before merging a public-facing Prawda Sumienia page, run the content through five imagined reviewers.

### Reviewer 1 — University rector

Questions:

- Is the tone serious enough?
- Is it appropriate for an academic event?
- Does it avoid self-promotion that weakens the subject?
- Is the project description clear and credible?

### Reviewer 2 — Museum educator

Questions:

- Is the page historically cautious?
- Does it avoid spectacle?
- Can it support a guided visit, screening or discussion?
- Are sensitive topics handled with restraint?

### Reviewer 3 — Historian

Questions:

- Which factual claims require citations?
- Are dates, names and terms used carefully?
- Is artistic interpretation separated from historical fact?
- Are simplified claims still defensible?

### Reviewer 4 — Student / young participant

Questions:

- Is the page understandable in the first 10 seconds?
- Does it explain why this matters now?
- Is the call to action clear without feeling forced?
- Does it respect silence and uncertainty?

### Reviewer 5 — Polish diaspora organiser

Questions:

- Is the English version culturally clear?
- Does it avoid insider-only Polish references without explanation?
- Does it work for audiences outside Poland?
- Does it feel dignified enough for a commemorative setting?

## Gate 15 — Public Claim Safety

Every public page should classify its claims.

### Claim types

| Type | Example | Requirement |
|---|---|---|
| Direct historical fact | Pilecki entered Auschwitz in 1940 | Source required |
| Contextual fact | ZOW operated inside the camp | Source required |
| Interpretive statement | The report continues as a moral question | Mark as project interpretation |
| Project description | A 65-minute audiovisual work | Verify internally |
| Event statement | Presented at a named institution | Use only if true and public-safe |
| Emotional line | Truth begins again in conscience | No citation, but must not imply fact |

### Safety rule

If a sentence sounds like history, it needs a source trail. If it sounds like interpretation, it must not masquerade as history.

## Gate 16 — Scoring Matrix

Use this scoring matrix before marking a Prawda Sumienia implementation PR ready for review.

| Category | Score /10 | Merge threshold | Notes |
|---|---:|---:|---|
| Historical trust | /10 | 9 | Claims are source-aware and cautious |
| Institutional clarity | /10 | 9 | Rector/museum/organiser can understand use case |
| Mobile QR experience | /10 | 9 | Clear in first seconds on phone |
| Bilingual quality | /10 | 9 | PL and EN both feel native and equivalent |
| Privacy and data safety | /10 | 10 | No ambiguity around personal data |
| Visual restraint | /10 | 9 | Premium, quiet, readable, not theatrical |
| Accessibility | /10 | 8.5 | Semantic, keyboard-safe, reduced motion |
| Performance | /10 | 8.5 | No unnecessary heavy assets or blocking logic |
| Maintainability | /10 | 9 | Scoped CSS/JS, clear structure, no huge files |
| Merge discipline | /10 | 9 | PR body, dependencies and QA are clear |

### Minimum merge rule

- Privacy must be **10/10** for generator/archive work.
- Historical trust must be at least **9/10** for public pages.
- Mobile QR must be at least **9/10** for exclusive/event pages.
- If any category is below threshold, the PR stays draft.

## Gate 17 — Red Team Pass

Before merging a public or exclusive implementation PR, ask:

1. What could be misunderstood?
2. What could be called overclaiming?
3. What could look too promotional?
4. What could expose private data?
5. What would break on mobile?
6. What would a historian challenge?
7. What would a rector ask us to soften?
8. What would a participant feel pressured by?

A world-class page survives not because it is louder, but because it is harder to misunderstand.

## Immediate PR Roadmap

This is the recommended implementation sequence after PRs #143–#145.

### PR #146 — Public Prawda Sumienia institutional shell

Goal:

- create or rebuild the public Prawda Sumienia page shell,
- define what the work is,
- make it institution-ready,
- keep it source-aware and restrained.

Must include:

- hero,
- definition,
- what it is / is not,
- format,
- institutional use cases,
- contact path,
- no full generator rebuild.

Quality gates:

- Gate 2 — Historical and Ethical Tone,
- Gate 6 — Bilingual Quality,
- Gate 8 — Visual Restraint,
- Gate 13 — Source Pack,
- Gate 14 — Institutional Review Mode,
- Gate 16 — Scoring Matrix.

### PR #147 — Report Journey Map

Goal:

- replace basic timeline with a proper interpretive map,
- connect historical nodes with testimony and memory,
- avoid decorative-only chronology.

Must include:

- PL/EN parity,
- source notes,
- clear historical/interpretive split,
- mobile-safe layout.

Quality gates:

- Gate 13 — Source Pack,
- Gate 15 — Public Claim Safety,
- Gate 16 — Scoring Matrix.

### PR #148 — Full Chapter System

Goal:

- create a full chapter architecture for the audiovisual work,
- present chapters as museum-style cards, not album marketing.

Must include:

- chapter title PL/EN,
- synopsis,
- historical function,
- artistic function,
- visual motif,
- source note or interpretation label.

Quality gates:

- Gate 6 — Bilingual Quality,
- Gate 13 — Source Pack,
- Gate 15 — Public Claim Safety,
- Gate 16 — Scoring Matrix.

### PR #149 — Educator and institution layer

Goal:

- create a dedicated layer for schools, universities, museums and organisers.

Must include:

- screening formats,
- content sensitivity note,
- discussion themes,
- Q&A prompts,
- technical requirements,
- contact path.

Quality gates:

- Gate 14 — Institutional Review Mode,
- Gate 16 — Scoring Matrix,
- Gate 17 — Red Team Pass.

### PR #150 — Event registry foundation

Goal:

- move event labels and event-specific behaviour toward one registry,
- prepare for unified generator without breaking legacy links.

Must include:

- event registry file,
- known event definitions,
- unknown event fallback,
- exclusive portal integration,
- no legacy redirect yet.

Quality gates:

- Gate 4 — Event Propagation,
- Gate 5 — Privacy,
- Gate 9 — Performance,
- Gate 10 — Link Integrity,
- Gate 16 — Scoring Matrix.

### PR #151 — Unified generator shell

Goal:

- introduce the new unified generator route,
- support `mode` and `event`,
- keep legacy routes operational.

Must include:

- generator shell,
- mode parser,
- copy dictionary,
- event context display,
- empty states,
- privacy notes.

Quality gates:

- Gate 5 — Privacy,
- Gate 7 — Accessibility,
- Gate 10 — Link Integrity,
- Gate 11 — Document / Generator Output,
- Gate 16 — Scoring Matrix.

## Required PR Body Addition for Implementation PRs

Every implementation PR after this should add:

```markdown
## World-Class Review

### Source Pack

### Institutional Review Mode

- [ ] Rector
- [ ] Museum educator
- [ ] Historian
- [ ] Student / young participant
- [ ] Diaspora organiser

### Scoring Matrix

| Category | Score |
|---|---:|
| Historical trust | /10 |
| Institutional clarity | /10 |
| Mobile QR experience | /10 |
| Bilingual quality | /10 |
| Privacy and data safety | /10 |
| Visual restraint | /10 |
| Accessibility | /10 |
| Performance | /10 |
| Maintainability | /10 |
| Merge discipline | /10 |

### Red Team Pass
```

## Final Rule

World-class does not mean more effects, more pages or more text.

World-class means:

- fewer weak claims,
- clearer routes,
- stronger privacy,
- better mobile flow,
- quieter visuals,
- source-aware language,
- maintainable implementation,
- an experience that still feels dignified after the screening ends.
