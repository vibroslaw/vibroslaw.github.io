# PR6.4 — Architecture Cleanup / Museum Polish

## Status

PR6.3 moved the Companion Guide in the right direction: the Memory Atlas is now closer to a museum exhibit than a standard web section. The most important interaction bug has been removed: the right-side Memory Atlas panel no longer changes state on hover and no longer behaves as a shifting list of cards.

This PR6.4 note freezes the current stable direction before larger CSS consolidation.

## Current working model

### Memory Atlas

The intended model is:

- left side: interactive map with points,
- right side: one stable exhibit card,
- navigation: map points only,
- right card: visual field + curatorial text,
- no oversized route buttons,
- no shifting right-side list.

The right-side card is intentionally passive. It should read like a museum label / exhibit panel, not like application UI.

### Timeline

The timeline should continue moving toward:

- one active interpretive card,
- compact date rail,
- no oversized text blocks inside every node,
- stable horizontal scanning.

## Files currently involved

Primary CSS:

- `assets/css/prawda-sumienia-companion-guide.css`

Temporary / polish CSS layers:

- `assets/css/prawda-sumienia-pr61-stabilize.css`
- `assets/css/prawda-sumienia-pr63-route-deck.css`

Primary JS:

- `assets/js/prawda-sumienia-exclusive.js`

Current JS loads the additional PR6.1 / PR6.3 polish stylesheets dynamically. This works, but it is not the final clean architecture.

## Do not do next

Do not immediately rewrite the full JS file unless absolutely necessary. Recent edits showed SHA conflicts during full-file replacement. The current Memory Atlas behavior is stable enough to avoid unnecessary risk.

Do not reintroduce right-side route buttons in Memory Atlas. They make the section feel like a web app rather than a museum object.

Do not restore the right-side card list. The shifting-list behavior was interesting but not premium enough for the final experience.

## Recommended next technical step

Create a single final polish stylesheet, for example:

- `assets/css/prawda-sumienia-museum-polish.css`

Then migrate into it, in order:

1. word wrapping / no broken Polish words,
2. hero visibility fixes,
3. navigation polish,
4. final CTA alignment,
5. timeline artifact rules,
6. Memory Atlas exhibit-card rules,
7. mobile overflow fixes.

After visual verification, update the page or JS to load only:

- `prawda-sumienia-companion-guide.css`
- `prawda-sumienia-museum-polish.css`

Then retire the PR-numbered temporary CSS files.

## Visual QA checklist

Before consolidation, manually check:

- Hero visible on EN and PL,
- no broken word: “prezentacja”,
- top navigation does not overflow,
- Timeline active card works,
- Memory Atlas map hover works,
- Memory Atlas right card does not flicker,
- Memory Atlas right card has no visible route buttons,
- Chapter Guide accordions work,
- Sources drawer works,
- Final CTA buttons align,
- mobile layout does not overflow horizontally.

## Design direction

The target is not “interactive dashboard”.

The target is:

- museum companion,
- digital exhibition label,
- memory atlas,
- guided reflection,
- calm, premium, educational experience.
