# RAP-ORT: Prawda Sumienia — Ultimate World-Class Experience Blueprint

Date: 2026-06-08
Scope: strategic visual, technical and educational blueprint for turning the Companion Guide into a world-class digital memory experience.

## 1. Core diagnosis

The current Companion Guide is no longer just a webpage. It has the beginnings of a digital museum room: hero threshold, questions before watching, historical route, memory map, people, chapters, sources, reflection and participation paths.

The strongest current idea is not the design itself. The strongest idea is the moral structure:

> Report → Route → Response.

This should become the operating system of the whole experience.

The page should not try to be a standard landing page, a dashboard, a blog, or a simple educational handout. It should become a digital memory installation: a place where the viewer enters after the screening and leaves with a question that does not disappear.

## 2. What the site must become

Target identity:

- not a website,
- not only an educational guide,
- not only an event companion,
- not only a portfolio page,
- but a post-screening digital memorial-experience.

Working name:

> The Report Room

Alternative:

> The Memory Room

Best strategic identity:

> Companion Guide as a digital room of testimony.

The user should feel:

1. I have entered a quiet space.
2. This is connected to the work I just saw.
3. I can orient myself without being overwhelmed.
4. I can go deeper if I want.
5. The project respects history.
6. I can return later.
7. Something remains with me.

## 3. The central principle

Every section must answer one of three questions:

### REPORT

What was witnessed?

### ROUTE

Where did this testimony travel — historically, geographically, morally, culturally?

### RESPONSE

What does the viewer do with truth after receiving it?

If a section does not clearly support one of these three movements, it should be simplified, moved, or removed.

## 4. Proposed world-class structure

### Room 0 — Threshold

Purpose: emotional and spatial entry.

Current equivalent: Hero.

Target:

- full cinematic threshold,
- one line of moral orientation,
- one quiet primary action,
- event context card,
- clear language switch,
- no clutter.

Key interaction:

> Enter the Report Room.

This replaces generic “Begin the guide”.

### Room 1 — Before You Enter

Purpose: prepare the viewer morally and historically.

Current equivalent: Seven questions before watching.

Target:

- seven questions remain,
- each opens as a museum label,
- each label has three layers:
  - fact,
  - safeguard,
  - meaning.

This section is already strong. It should become visually calmer and more ceremonial.

### Room 2 — The Man Before the Report

Purpose: protect Pilecki from becoming only a symbol.

Target:

- biography as human formation,
- family, land, duty, faith, service,
- no over-heroic language,
- a quiet portrait-card structure.

### Room 3 — The Camp and the Report

Purpose: core testimony layer.

Target:

- KL Auschwitz chronology protected,
- OW/ZOW explained carefully,
- report fragments introduced as source evidence,
- artistic compression separated from historical source.

This should be the factual anchor of the entire page.

### Room 4 — Map of Memory

Purpose: spatial memory.

Current equivalent: Memory Atlas.

Target:

- left: map / route / places,
- right: stable exhibit card,
- no app-like controls,
- no shifting list,
- each place has a dedicated visual identity,
- later: real archival or generated-but-clearly-symbolic visual per place.

Future enhancement:

- map route reveals as the viewer scrolls,
- the active place can be synced with chapter/storyline,
- each place has “fact / memory / project relation”.

### Room 5 — People Behind the Story

Purpose: human network.

Current equivalent: People section.

Target:

- turn people grid into a relationship constellation,
- not just cards,
- show relationships:
  - Pilecki → family,
  - Pilecki → OW,
  - Pilecki → escape companions,
  - Pilecki → postwar repression,
  - archivists/researchers → memory restoration,
  - viewer → responsibility.

This can become one of the most original parts of the site.

### Room 6 — Chapter-by-Chapter Guide

Purpose: viewing companion.

Target:

- not a long accordion list only,
- chapter cards grouped by movement:
  - Formation,
  - Camp,
  - Escape,
  - Postwar,
  - Memory,
  - Your Report.

Each chapter should have:

- what happens,
- what to notice,
- historical anchor,
- moral question,
- source layer.

### Room 7 — Source Table / Trust Layer

Purpose: credibility.

Target:

- not just sources,
- source-trust architecture:
  - primary sources,
  - scholarly sources,
  - institutional sources,
  - project interpretation,
  - artistic compression.

This section must make institutions feel safe sharing the project.

### Room 8 — Your Report

Purpose: emotional ending.

Target:

- no heavy CTA cluster,
- one quiet ritual:
  - “What remains with you?”
- optional participation path,
- optional witness/reflection document,
- optional archive/gallery.

This should feel like a closing room in a museum, not like a marketing funnel.

## 5. The unique feature that can make this unforgettable

### The Living Report Thread

A thin visual line should connect the whole site.

It begins in the hero, travels through the questions, crosses the timeline, enters the map, passes through people and chapters, reaches sources, and ends in Your Report.

It should not be decorative only. It should function as narrative continuity.

Possible implementation:

- CSS variable scroll progress,
- subtle vertical/horizontal gold line,
- section anchors as report stations,
- current section label in orbit nav,
- active memory point connected to current chapter.

The user should unconsciously feel:

> I am following the report.

## 6. The second unique feature

### Visitor Modes

Not login. Not complicated. A simple mode selector:

- Viewer
- Student
- Educator
- Researcher

Each mode changes emphasis:

### Viewer

- shortest text,
- emotional orientation,
- one primary route.

### Student

- questions,
- glossary,
- chapter guide,
- discussion prompts.

### Educator

- lesson structure,
- Q&A prompts,
- source layers,
- downloadable guide.

### Researcher

- sources,
- chronology,
- terminology safeguards,
- archival notes.

This would make the same page useful for several audiences without duplicating content.

## 7. The third unique feature

### Memory Return

The page should invite return.

Not through notifications. Through structure.

Possible return mechanisms:

- “Return to the room” link after event,
- “Continue from your last room” stored locally/session-only,
- “One question to carry today”,
- rotating quiet quote / source note,
- archive wall that slowly grows after events.

The goal is not engagement for metrics. The goal is repeated moral contact.

## 8. Visual system target

The project should use a restrained visual grammar:

- charcoal black,
- aged ivory,
- antique gold,
- archival paper,
- projection beam,
- map lines,
- dust and grain,
- dark museum room,
- subtle light, not spectacle.

Avoid:

- excessive glow,
- too many buttons,
- dashboard feel,
- app-like tabs everywhere,
- oversized CTA clusters,
- sensational visuals,
- modern glossy UI language.

Best visual metaphor:

> a dark exhibition room where documents are illuminated one by one.

## 9. Interaction principles

Every interaction must feel like touching an exhibit, not operating software.

Good interactions:

- click a question → curatorial label opens,
- hover/click a map point → exhibit card changes,
- open a chapter → chapter label unfolds,
- source drawer → source trust layer opens,
- final question → reflection path begins.

Bad interactions:

- carousels that feel like marketing,
- huge next/previous buttons,
- jumping card lists,
- too many CTAs,
- hidden state that surprises the user,
- interactions that require explanation.

## 10. Technical architecture target

Current risk: CSS and JS are fragmented across core files, PR-numbered patches, runtime inserts and page-specific overrides.

Target architecture:

### CSS

- `prawda-sumienia-companion-guide.css` — base visual system,
- `prawda-sumienia-museum-polish.css` — final premium refinements,
- no long-term PR-numbered CSS files,
- no unnecessary runtime style patches,
- no repeating `!important` unless absolutely necessary.

### JS

Break the current monolithic exclusive JS into modules later:

- `psx-routing.js`
- `psx-reveal.js`
- `psx-modal.js`
- `psx-timeline.js`
- `psx-memory-atlas.js`
- `psx-source-drawer.js`
- `psx-bfcache-restore.js`

Do not do this all at once. First stabilize behavior, then extract modules.

### Manifest system

Create:

- route metadata manifest,
- asset manifest,
- source manifest,
- event manifest.

The site should know:

- what hero image belongs to each route,
- what social image belongs to each route,
- what source labels belong to each section,
- what event context is active.

## 11. Priority roadmap

### Phase 1 — Stabilize world-class foundation

- social previews for key routes,
- route metadata consistency,
- language pairs + safe parameter preservation,
- hero fallback images,
- mobile QA,
- BFCache/back-navigation restore.

### Phase 2 — Museum room design

- final hero threshold,
- Memory Atlas exhibit card final visual,
- Timeline artifact final layout,
- People constellation,
- chapter guide as exhibition catalogue.

### Phase 3 — Educational depth

- viewer/student/educator/researcher modes,
- source trust layer,
- downloadable teacher guide,
- Q&A paths,
- glossary as interactive reference.

### Phase 4 — Return and legacy

- archive wall,
- event memory pages,
- reflection document,
- institutional pack,
- international version.

## 12. What would make people return

People return when a page is not only useful but meaningful.

Return triggers:

- the map feels alive,
- sources are worth exploring,
- the final question stays unresolved,
- educators can use it again,
- students can quote from it,
- institutions can trust it,
- diaspora viewers can share it,
- the page changes after events without losing restraint.

## 13. What would make it unforgettable

The page becomes unforgettable if it stops trying to explain everything and instead creates an encounter.

The encounter is:

> Here is testimony. Here is the route it travelled. Here is what it asks of you.

Everything else should serve that.

## 14. North-star sentence

Use this to judge every future change:

> The Companion Guide should feel like entering a quiet museum room after the screening, following the report through places, people and sources, and leaving with a question that continues inside the viewer.
