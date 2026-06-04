# Prawda Sumienia — World-Class Pages Blueprint

Status: strategic implementation standard for the Prawda Sumienia page system.

This document defines the quality bar for the next implementation PRs. It is intentionally not a public page. It is the internal contract for building a museum-grade, institution-ready, mobile-first web experience around **Rap-Ort: Prawda Sumienia**.

## North Star

The page system must feel like an extension of the screening, not a marketing landing page.

A visitor should understand within seconds that this is:

- a serious audiovisual historical work,
- connected with testimony, memory and moral reflection,
- appropriate for universities, museums, cultural institutions, schools and diaspora contexts,
- restrained, source-aware and free from sensationalism,
- designed with enough care to be trusted by an institution.

The standard is not “nice website”. The standard is: **credible enough for a rector, clear enough for a student, quiet enough for memory, strong enough for a museum.**

## Strategic Routes

### Public institutional page

- `/rap-ort/prawda-sumienia/`
- `/rap-ort/prawda-sumienia/pl/`

Purpose: before a screening, for institutions, partners, educators, cultural organisers and press/context readers.

Primary goals:

1. Explain what the work is.
2. Show format and seriousness.
3. Establish source and ethical credibility.
4. Present event formats and licensing possibilities.
5. Lead to contact or screening enquiry.

### Exclusive post-screening portal

- `/rap-ort/prawda-sumienia/exclusive/`
- `/rap-ort/prawda-sumienia/exclusive/pl/`

Purpose: after a screening, accessed by QR or direct invitation.

Primary goals:

1. Let participants leave a Witness Report.
2. Let participants download a Record of Participation.
3. Let participants return to selected context.
4. Preserve a quiet, reflective atmosphere.
5. Avoid pressure, gamification or forced interaction.

### Generator routes

Current routes remain legacy/current flow until unified generator work is implemented.

- `/rap-ort/witness-report/generator/`
- `/rap-ort/raport-swiadka/generator/`
- `/rap-ort/participation/`
- `/rap-ort/uczestnictwo/`

Future unified routes should be introduced only after PR-level design approval.

## Page Types

### 1. Public Landing Page

Required sections:

1. Hero: title, subtitle, one-line format, one primary action.
2. Work definition: what Rap-Ort: Prawda Sumienia is and is not.
3. Source foundation: reports, testimony, published studies, documentary restraint.
4. Chapter architecture: 15/16-part audiovisual structure without overexplaining the ending.
5. Institutional use cases: university, museum, school, diaspora, commemorative event.
6. Screening formats: full projection, selected chapters, projection + discussion, educational session.
7. Visual/audio language: cinematic, musical, reflective, AI-assisted but ethically framed.
8. Trust proof: previous event context, Oświęcim/MUP reference, diaspora context where appropriate.
9. Contact path: simple enquiry, no hard sales language.

Forbidden tone:

- “viral”,
- “mind-blowing”,
- “the best”,
- “revolutionary”,
- overdramatic Auschwitz language,
- claims that sound institutional without evidence.

Preferred tone:

- restrained,
- precise,
- reflective,
- serious,
- historically cautious,
- emotionally present but not manipulative.

### 2. Exclusive Portal

Required sections:

1. Hero: quiet post-screening identity.
2. Event banner when `?event=` is known.
3. Two dominant actions: Witness Report, Record of Participation.
4. Return-later note.
5. Participant path cards.
6. Ritual pause / reflective sentence.
7. Report journey orientation.
8. Selected chapters.
9. Anonymous archive note.
10. Historical context entry points.

Rules:

- No sales language.
- No public indexing if the page is event/QR-only.
- No request for personal data in the reflective flow.
- Any archive language must explicitly state anonymity.
- The page must still make sense without an `event` parameter.

### 3. Journey Map

The map must be implemented as an interpretive route, not as a decorative timeline.

Required layers:

1. Simple participant orientation.
2. Historical milestone cards.
3. Source-aware expansion.
4. Optional visual map treatment.
5. Link back to relevant chapter cards.

Minimum historical nodes:

- 1901 — birth and early formation.
- 1918–1920 — reborn Poland and military service context.
- 1939 — invasion and underground reality.
- 1940 — entry into Auschwitz under false identity.
- 1940–1943 — ZOW and intelligence/reporting.
- 1943 — escape and report continuation.
- 1944 — Warsaw Uprising context.
- 1945–1948 — Soviet-dominated Poland, arrest, trial, execution.
- After 1989 — return of memory.
- Today — participant responsibility and memory transmission.

Historical wording must avoid false precision unless verified in source notes.

### 4. Chapter System

Each chapter card must eventually include:

- title PL,
- title EN,
- short synopsis,
- historical function,
- artistic function,
- emotional tone,
- visual motif,
- source note,
- screening relevance,
- optional link to video/audio if public.

Card tone:

- museum label, not Spotify marketing.
- one clear idea per card.
- no overclaiming.
- no spoilers for first-time institutional readers unless on exclusive page.

### 5. Educator / Institution Layer

Future pages should include a separate path for educators and institutions.

Minimum content:

- recommended age/context note,
- discussion themes,
- screening formats,
- Q&A prompts,
- content sensitivity note,
- technical requirements,
- contact path,
- optional downloadable one-page summary.

## World-Class Quality Pillars

### Pillar 1 — Trust before beauty

Every visual choice must support credibility. Beauty that weakens trust is a failure.

Checks:

- Is the claim source-aware?
- Is the tone institution-safe?
- Would a historian, rector or museum educator feel the page is respectful?
- Does the page avoid sensationalism?

### Pillar 2 — Mobile-first ritual

The QR experience is not a website visit; it is a post-screening moment.

Checks:

- Can a participant understand the page in 3 seconds?
- Are the first two actions visible without confusion?
- Can the user leave and return later?
- Is the page calm on a small screen?

### Pillar 3 — Cinematic restraint

The visual system should feel archival, premium and reflective.

Allowed language:

- black / charcoal,
- antique gold / muted ivory,
- archival paper / shadow / quiet light,
- cinematic but not theatrical,
- slow reveal, not aggressive animation.

Avoid:

- too many gradients,
- excessive glow,
- fast motion,
- heavy parallax on mobile,
- decorative effects that fight the text.

### Pillar 4 — Bilingual parity

PL and EN pages must be equivalents, not rough translations.

Rules:

- PL may be more intimate and ceremonial.
- EN may be slightly clearer and more institutional.
- Both must preserve the same ethical meaning.
- No automatic translation language.
- No false friend phrasing.

### Pillar 5 — Maintainable architecture

World-class means maintainable.

Rules:

- CSS files should be scoped by feature.
- Event configuration should move toward a registry.
- Copy should be reusable where possible.
- HTML should stay readable.
- Future generator logic should not be duplicated across multiple pages.

## Design Standards

### Typography

- Use existing site type system unless a specific brand refinement is introduced.
- Hero headline can be cinematic, but body text must remain highly readable.
- Long institutional copy should be broken into short blocks.

### Colour

Use the current Prawda Sumienia palette as the reference:

- deep black / charcoal background,
- muted gold accents,
- ivory text,
- dim secondary text,
- restrained borders.

Gold is an accent, not a background.

### Motion

- Motion should be subtle and optional.
- Reduced motion support is mandatory.
- No essential information may depend on animation.

### Imagery

Preferred imagery:

- archival room,
- document texture,
- quiet screen light,
- empty chair / witness space,
- report/map/trace motifs,
- no gratuitous camp imagery.

Image rules:

- no sensationalised suffering,
- no fake documentary claims,
- no faces pretending to be historical people unless clearly stylised and ethically justified,
- no visual clutter behind important text.

## Copy Standards

### The one-sentence definition

EN:

> Rap-Ort: Prawda Sumienia is a feature-length audiovisual work inspired by the reports of rotmistrz Witold Pilecki and the moral question of testimony under totalitarian pressure.

PL:

> Rap-Ort: Prawda Sumienia to długometrażowe dzieło audiowizualne inspirowane raportami rtm. Witolda Pileckiego i pytaniem o świadectwo pod presją totalitaryzmu.

### What it is not

It is not:

- a concert,
- a classical documentary,
- a fictional feature film,
- a political campaign,
- a sensational reconstruction.

It is:

- an audiovisual reflection,
- a screening format,
- a narrative musical work,
- a public-history and memory project,
- an institutional/cultural/educational experience.

## SEO and Indexing

Public pages:

- indexable,
- canonical,
- strong title/description,
- Open Graph image,
- structured content,
- contact path.

Exclusive pages:

- noindex by default,
- canonical to exclusive route,
- event-aware but not event-indexed,
- privacy-first.

## Performance Targets

Targets for public and exclusive pages:

- no blocking nonessential scripts,
- images compressed and responsive,
- mobile first paint must feel immediate,
- no layout shift around hero CTA,
- no autoplay audio/video,
- no heavy animation on first load.

## Accessibility Targets

Minimum:

- semantic headings,
- skip link,
- focus states,
- readable contrast,
- reduced motion support,
- meaningful link labels,
- no CTA represented only by colour,
- no hidden event data required to understand the page.

## Implementation Order

1. Merge exclusive foundation.
2. Merge QR hardening.
3. Build unified generator plan.
4. Build public institutional page shell.
5. Build full journey map.
6. Build full chapter system.
7. Build educator/institution layer.
8. Add final visual QA and content proofread.

## Definition of Done for a World-Class Page

A page is not complete until it passes all of the following:

- clear within 3 seconds,
- mobile-first tested,
- PL and EN checked separately,
- all links tested with and without `?event=`,
- no personal data collected by default,
- no sensational language,
- no unsupported historical claim,
- keyboard navigation works,
- reduced motion works,
- content hierarchy makes sense without images,
- page is readable by an institution and meaningful for a participant.
