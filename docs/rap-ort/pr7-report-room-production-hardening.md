# PR7 — Report Room cleanup & production hardening

## Purpose

Harden the current `RAP-ORT: Truth of Conscience / Prawda Sumienia` Report Room without adding new visual spectacle.

The goal of PR7 is production confidence: privacy-safe controls, clearer QA boundaries, reduced hidden browser state, and a practical checklist for the next HTML/CSS cleanup pass.

## Runtime changes in this PR

### 1. Remove Report Room session storage from core controls

Updated:

- `assets/js/prawda-sumienia-report-room.js`
- `assets/js/prawda-sumienia-report-room-artifact.js`

The Report Room no longer stores visual, reading, or display mode preferences in `sessionStorage`.

Current behaviour:

- visual mode defaults to `cinematic`;
- if the visitor prefers reduced motion, visual mode defaults to `lite`;
- reading mode defaults to `viewer`;
- display mode defaults to `standard`;
- any user change applies only to the current page view and is not persisted.

This keeps the page aligned with the no-tracking / no-data-collection posture expected from a museum-grade post-screening companion.

### 2. Keep all interactions local

No network calls, analytics calls, cookies, `localStorage`, `sessionStorage`, `fetch`, XHR or `sendBeacon` were added by PR7.

Clipboard use remains only for the explicit `Copy description` tool, triggered by the user.

## Production hardening still recommended before final merge

The following items were intentionally not edited automatically in this PR because the current HTML and CSS files are large, compressed, and should not be rewritten without live render QA:

### A. Clean public title strings

Recommended EN title:

```html
<title>RAP-ORT: Truth of Conscience — The Report Room</title>
```

Recommended PL title:

```html
<title>RAP-ORT: Prawda Sumienia — Sala Raportu</title>
```

Remove visible release-engineering terms from public metadata, especially:

- `Final Release Cleanup 14.2`
- `Finalny cleanup wydania 14.2`

The version number can remain in internal attributes or comments, but should not be exposed as public page title copy.

### B. Simplify body version classes

Current body classes include many historical artifact version classes. Recommended final public class model:

```html
<body class="veritas-universe vh-page rr-page rr-report-room rr-cinematic rr-release-ready" data-rr-version="14.2">
```

Keep detailed version history in documentation, not in public body class sprawl.

### C. Reformat final CSS layer

Recommended file:

- `assets/css/prawda-sumienia-report-room-final.css`

The visual layer is strong, but it should be reformatted into readable sections before future development:

1. tokens / variables;
2. body and background;
3. topbar / rail / progress;
4. hero;
5. visual frames;
6. map;
7. people wall;
8. chapters;
9. source chamber;
10. final room;
11. responsive rules;
12. reduced-motion / no-script rules.

Do not change the visual design during this cleanup unless render QA is available.

### D. Add exclusive route language pairs to global navigation

Recommended addition to `assets/js/navigation.js` language pair map:

```js
["/rap-ort/prawda-sumienia/exclusive/", "/rap-ort/prawda-sumienia/exclusive/pl/"],
["/rap-ort/prawda-sumienia/exclusive/pl/", "/rap-ort/prawda-sumienia/exclusive/"],
```

The Report Room already has its own language switch, but the global navigation system should still know the EN/PL pair.

### E. Add OW / ZOW terminology note

Recommended EN note:

> This room uses OW — Organizacja Wojskowa / Military Organization — where it follows the Report W source route. Some secondary literature uses ZOW terminology; the guide acknowledges the variant terminology used in scholarship.

Recommended PL note:

> Ta sala używa formy OW — Organizacja Wojskowa — tam, gdzie podąża za przyjętą ścieżką źródłową Raportu W. W literaturze funkcjonuje również forma ZOW; przewodnik powinien jasno zaznaczać istnienie tego wariantu terminologicznego.

### F. Add source register file

Recommended future file:

```text
docs/rap-ort/report-room-sources.md
```

It should preserve:

- checked date;
- source ID;
- source type;
- source confidence level;
- public URL or printed reference;
- what the source supports;
- what the source does not imply.

## Manual QA checklist

Before marking the PR ready for merge, check:

- `/rap-ort/prawda-sumienia/exclusive/`
- `/rap-ort/prawda-sumienia/exclusive/pl/`

Widths:

- 360px
- 390px
- 430px
- 768px
- 1024px
- 1440px

States:

- JavaScript enabled;
- no JavaScript;
- prefers-reduced-motion;
- print / save to PDF;
- EN → PL language switch with hash;
- PL → EN language switch with hash;
- map pins;
- atlas layer filters;
- people relation filters;
- source shelves;
- display mode buttons;
- copy description button.

Pass criteria:

- no horizontal overflow;
- hero title readable;
- primary hero image loads eagerly;
- no hidden required content in no-JS mode;
- focus states visible;
- all interactive buttons update `aria-pressed` correctly;
- no console errors;
- no storage writes from Report Room scripts;
- no data transmission from Report Room scripts.

## PR7 status

This PR performs the safest runtime hardening first. The public HTML title/body cleanup and compressed CSS reformat should be handled as a follow-up commit only with render QA available.
