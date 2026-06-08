# PR6.1 — Companion Guide Stabilization QA Notes

Scope: `RAP-ORT: Prawda Sumienia / Truth of Conscience` Companion Guide exclusive pages.

Routes to verify:

- `/rap-ort/prawda-sumienia/exclusive/`
- `/rap-ort/prawda-sumienia/exclusive/pl/`
- `/rap-ort/prawda-sumienia/exclusive/?event=syd2026`
- `/rap-ort/prawda-sumienia/exclusive/pl/?event=oswiecim20260525`

## What PR6.1 stabilizes

1. Adds a dedicated runtime stabilization stylesheet: `/assets/css/prawda-sumienia-pr61-stabilize.css`.
2. Preserves safe URL parameters when switching language: `event`, `ref`, `utm_source`, `utm_medium`, `utm_campaign`, `screening`.
3. Preserves the current hash/anchor when switching language.
4. Restores the Polish default hero image to the Oświęcim/MUP visual context.
5. Adds BFCache/pageshow cleanup for transient UI: modals, source panels and expandable panels.
6. Hardens mobile overflow and prevents normal UI words from breaking letter-by-letter.

## Desktop checklist

Test at 1440px and 1920px.

- Hero image is visible and text remains readable.
- Topbar does not collide with the language switch.
- Orbit navigation remains usable and sticky.
- `Before You Watch / Przed projekcją` cards open and close modals.
- Timeline cards remain scrollable and do not break the page width.
- Memory Atlas pins and ledger items are focusable/clickable.
- Chapter accordions open/close normally.
- Source cards remain readable; long URLs wrap only inside links.
- Final `Your Report / Twój Raport` CTA is centered.

## Mobile checklist

Test at 360px, 390px, 430px and 820px.

- No page-level horizontal scrolling.
- The word `Prezentacja` is not broken letter-by-letter.
- Buttons do not overflow the viewport.
- Topbar links scroll horizontally if needed.
- Orbit navigation scrolls horizontally without pushing the page wider.
- Timeline uses horizontal snap/scroll and remains contained.
- Memory Atlas does not exceed viewport width.
- Modals fit within the viewport and close with `×`, backdrop click and Escape.
- Back navigation after opening a modal or source panel restores a clean page state.

## Source and metadata follow-up

Still recommended for the next PR:

- Static `og:image` and `twitter:image` tags for EN/PL exclusive pages.
- Curated source-card bibliography polish, especially separating Adam Cyra and Józef Garliński entries.
- Asset manifest validation for hero/social images.
- Real social preview validation in LinkedIn, Facebook/Messenger and WhatsApp.
