# Prawda Sumienia / Rap-Ort World-Class Experience Readiness Audit

Audit date: 2026-06-06
Branch: `feature/prawda-sumienia-world-class-experience-audit`
Scope: audit-only. No production UX, route, dependency, tracking, storage, media-system, or historical-copy changes were made.

## Executive Summary

This audit treats the current site as a serious historical/cultural experience, not as a conventional website. The target is a premium cinematic museum-room threshold after the screening: mobile-first, restrained, source-aware, smooth across language and back navigation, and credible for institutional sharing.

All requested routes exist. The experience already has a strong cinematic vocabulary and useful source-trust intent. It is not Top 5 world-class-ready because the core contracts are inconsistent: social previews, language switching, hero governance, cinematic/lite mode, back navigation, mobile practical behavior, and asset validation.

Current overall score: **6.1 / 10**
Target score: **9.2 / 10**

Top 5 blockers:

1. Core social previews are missing on the routes most likely to be shared after screenings.
2. Deep language switching falls back to home on several flows and drops safe params and anchors.
3. Cinematic/lite mode is a feature, not yet a coherent route-wide system; exclusive pages do not load the cinematic toggle implementation.
4. Hero and image assets are fragmented across HTML, CSS, JS, runtime patches, and manifests, with some missing or mismapped references.
5. BFCache/back-navigation restore is incomplete for drawers, reveal state, scroll progress, rail state, and mobile overlays.

Fastest 5 wins:

1. Add a social metadata pack using existing OG assets.
2. Add missing language pairs plus a safe-param preservation contract.
3. Add source-level BFCache/pageshow restore for major transient UI.
4. Add static hero/social fallback mappings for exclusive and generator routes.
5. Add an asset-reference validation script.

Highest-impact 5 improvements:

1. Central route metadata and asset manifest.
2. Cinematic/lite CSS variable contract.
3. Mobile practical polish at 360, 390, 430, tablet, 1440, and 1920 widths.
4. Source-trust manifest with reviewed source labels, URLs, and disclaimers.
5. Runtime style/reveal consolidation.

## Methodology And Limits

Reviewed:

- requested route files
- HTML metadata, canonical, hreflang, and social tags
- CSS and JS includes
- hero/social/event image references in HTML, CSS, JS, manifests, and docs-like files
- language switch code in `assets/js/navigation.js` and `assets/js/prawda-sumienia-exclusive.js`
- cinematic mode in `assets/js/cinematic.js`, `assets/js/veritas.js`, and route CSS
- reveal, pageshow, drawer, rail, modal, and scroll-progress behavior
- repository tree image paths and file sizes

Not verified:

- live rendering at requested breakpoints
- real mobile Safari BFCache behavior
- final contrast ratios over composited hero imagery
- decoded image dimensions
- external social preview validators

Reason: the in-app browser / Node REPL kernel failed in this environment with a Windows sandbox spawn setup error. Findings are source-level unless marked otherwise. Manual mobile/browser QA is still required.

## Route And Page Inventory

Legend:

- `global css`: `main.css`, `navbar.css`, `mobile-nav.css`, `cinematic.css`, `hub.css`, `veritas.css`
- `global js`: `main.js`, `navigation.js`, `transitions.js`, `cinematic.js`, `veritas.js`
- `psx css`: `prawda-sumienia-exclusive.css`
- `psx js`: `events-config.js`, `prawda-sumienia-exclusive.js`
- `event css`: `event-experience.css`, `event-shell.css`
- `event js`: `event-shell.js`
- `present-broken`: control exists but target/contract is broken or incomplete
- `partial`: present but below target contract

| Route | Lang | Purpose | Hero system | Hero image | Mobile hero | CSS | JS | Language switch | Cinematic toggle | og:image | twitter:image | Canonical | hreflang | No-JS fallback | Reduced motion | Mobile risk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | en | Veritas entry hub | `vh-hero` with JS patch | `veritas-humanum-hero.webp` plus portal cards | none explicit | global css | global js | yes | yes | no | no | yes | yes | yes | yes | medium |
| `/pl/` | pl | Polish Veritas entry hub | `vh-hero` with JS patch | `veritas-humanum-hero.webp` plus portal cards | none explicit | global css | global js | yes | yes | no | no | yes | yes | yes | yes | medium |
| `/rap-ort/prawda-sumienia/` | en | public Prawda guide | `vh-hero` | `english-guide-hero.webp` | none explicit | global css | global js | yes | yes | no | no | yes | yes | no | yes | medium |
| `/rap-ort/prawda-sumienia/pl/` | pl | Polish public Prawda guide | `vh-hero` | `prawda-sumienia-hero.webp` | none explicit | global css | global js | yes | yes | no | no | yes | yes | no | yes | medium |
| `/rap-ort/prawda-sumienia/exclusive/` | en | post-screening hub | `psx-hero`, JS picture layer | event-specific, default `syd2026` | shared event mobile | `cinematic.css`, psx css | psx js | yes partial | no | no | no | yes | yes | no | partial | high |
| `/rap-ort/prawda-sumienia/exclusive/pl/` | pl | Polish post-screening hub | `psx-hero`, JS picture layer | event-specific, default `oswiecim20260525` | shared event mobile | `cinematic.css`, psx css | psx js | yes partial | no | no | no | yes | yes | no | partial | high |
| `/rap-ort/witness-report/generator/` | en | Witness Report generator | report/generator shell | no clear static hero | none explicit | global plus generator/report css | global plus pdf/report js | present-broken | yes | no | no | yes | partial | no | yes | high |
| `/rap-ort/raport-swiadka/generator/` | pl | Polish Witness Report generator | report/generator shell | no clear static hero | none explicit | global plus generator/report css | global plus pdf/report js | present-broken | yes | no | no | yes | partial | no | yes | high |
| `/rap-ort/participation/` | en | Participation Record path | document/participation shell | `witness-report-hero.webp`, document previews | none explicit | global plus participation css | global plus document/participation js | present-broken | yes | no | no | yes | partial | no | yes | high |
| `/rap-ort/uczestnictwo/` | pl | Polish Participation Record path | document/participation shell | `witness-report-hero.webp`, document previews | none explicit | global plus participation css | global plus document/participation js | present-broken | yes | no | no | yes | partial | no | yes | high |
| `/rap-ort/experience/` | en | event experience lobby | `event-shell-hero` | `event-lobby-cinematic-hero.webp` | `event-lobby-cinematic-mobile.webp` | global plus event css | global plus event js | present-broken | yes | no | no | yes | no | no | partial | high |
| `/rap-ort/experience/oswiecim20260525/` | mixed | event experience | `event-shell-hero` | `oswiecim-event-lobby.webp` | shared event mobile | global plus event css | global plus event js | present-broken | yes | no | no | yes | no | no | partial | high |
| `/rap-ort/experience/syd2026/` | en | Sydney event experience | `event-shell-hero` | `sydney-event-lobby.webp` | shared event mobile | global plus event css | global plus event js | present-broken | yes | no | no | yes | no | no | partial | high |
| `/events/sydney-2026/` | en | public Sydney event page | public event page | no clear static hero, external QR | none explicit | global plus event page css | global js | no clear switch | yes | no | no | yes | no | no | partial | medium |
| `/music/` | en | music page | `vh-hero` | music-related imagery | none explicit | global css | global js | yes | yes | yes | yes | yes | yes | no | yes | medium |
| `/music/pl/` | pl | Polish music page | `vh-hero` | music-related imagery | none explicit | global css | global js | yes | yes | yes | yes | yes | yes | no | yes | medium |
| `/contact/` | en | contact page | `vh-hero` | contact/social image only | none explicit | global css | global js | yes | yes | yes | yes | yes | yes | no | yes | low |
| `/contact/pl/` | pl | Polish contact page | `vh-hero` | contact/social image only | none explicit | global css | global js | yes | yes | yes | yes | yes | yes | no | yes | low |
| `/for-institutions/` | en | institutional offer | `vh-hero` | institution/social image only | none explicit | global css | global js | yes | yes | yes | yes | yes | yes | no | yes | medium |
| `/for-institutions/pl/` | pl | Polish institutional offer | `vh-hero` | EN institution/social image; PL asset exists unused | none explicit | global css | global js | yes | yes | yes | yes | yes | yes | no | yes | medium |

Route existence result: all requested routes exist.

## Hero And Image Audit

Repository search found references in HTML, CSS, JS, and manifest files. The tree allowed full path and file-size listing; binary visual inspection was not verified.

Priority findings:

- Home and public Prawda hero assets exist, but the matching OG assets are not wired.
- Exclusive hub hero imagery is installed by JS through `assets/js/prawda-sumienia-exclusive.js`; HTML does not provide the equivalent fallback image.
- Event shell uses strong hero imagery but no social preview image contract.
- Generator routes do not have a clear static hero fallback.
- `/music/pl/` and `/for-institutions/pl/` have localized OG assets available but use non-localized images.
- Multiple `/assets/events/...` references appear while the repository tree contains `/public/assets/events/...`.
- Referenced event-specific mobile assets such as `oswiecim-event-lobby-mobile.webp` and `sydney-event-lobby-mobile.webp` were not found in the tree; the shared mobile event lobby image exists.
- `event-pass-texture.webp`, `participation-record-bg-preview2.webp`, and `participation-record-bg-preview3.webp` were referenced but not found in the tree-level check.
- Large print/document assets above 10 MB exist and must remain generation-only.

Prioritized asset inventory is in `docs/audits/prawda-sumienia-asset-inventory.md`.

## Social Preview Audit

Classification:

- A: strong preview ready
- B: preview exists but weak or inconsistent
- C: missing or unsafe preview

| Route group | Classification | Finding |
|---|---|---|
| `/`, `/pl/` | C | OG assets exist but `og:image` and `twitter:image` are not active. |
| public Prawda EN/PL | C | strong heroes exist but no social image. |
| exclusive EN/PL | C | no social image on the post-screening hub. |
| generator EN/PL | C | missing complete OG/Twitter metadata. |
| participation EN/PL | C | missing complete OG/Twitter metadata. |
| experience/event routes | C | missing preview image and often no language/hreflang contract. |
| `/events/sydney-2026/` | C | public event page lacks reliable event preview metadata. |
| music EN/PL | B | previews exist, but Twitter title/description are incomplete and PL image mapping is weak. |
| contact EN/PL | B | previews exist, but Twitter title/description are incomplete. |
| institutions EN/PL | B | previews exist, but PL image mapping is weak and Twitter fields are incomplete. |

Recommended social image set:

| Key | Ratio | Subject | Embedded text | Routes |
|---|---:|---|---|---|
| `home-og` | 1200x630 | Veritas identity, archival room cue | minimal title only | `/`, `/pl/` |
| `prawda-sumienia-og` | 1200x630 | report/archival threshold | project title acceptable | public Prawda EN/PL |
| `prawda-sumienia-exclusive-og` | 1200x630 | post-screening museum room | no dense text | exclusive EN/PL |
| `witness-report-og` | 1200x630 | writing desk/report paper | title optional | generator EN/PL |
| `participation-og` | 1200x630 | participation record/pass | no personal-data fields | participation EN/PL |
| `sydney-2026-og` | 1200x630 | Sydney screening/event pass/map | event title/date acceptable | Sydney event routes |
| `music-og` | 1200x630 | music identity | current title-only approach acceptable | music EN/PL |
| `contact-og` | 1200x630 | contact threshold | no dense text | contact EN/PL |
| `institution-og` | 1200x630 | institutional dossier/screening kit | title only | institutions EN/PL |

## Language Switch Audit

Evidence:

- `assets/js/navigation.js` defines the global `languagePairs` map.
- Missing pairs fall back to `/` or `/pl/`.
- `assets/js/prawda-sumienia-exclusive.js` preserves only `event` on exclusive language links.
- Global switch does not preserve `event`, `ref`, UTM params, `screening`, or hash anchors.

Findings:

| Pair | Status | Risk |
|---|---|---|
| `/` <-> `/pl/` | works | params/hash dropped |
| public Prawda EN/PL | works | params/hash dropped |
| exclusive EN/PL | partial | preserves `event` only; safe params and anchors dropped |
| generator EN/PL | broken | pair missing from global map, likely fallback home |
| participation EN/PL | broken | pair missing from global map, likely fallback home |
| experience routes | broken | switch present through global nav but no equivalent mapping/hreflang |
| `/events/sydney-2026/` | unclear | no clear localized route contract |
| music/contact/institutions | works | params/hash dropped |

Ideal contract:

- Preserve safe params: `event`, `ref`, `utm_source`, `utm_medium`, `utm_campaign`, `screening`.
- Drop unsafe/random params by default.
- Preserve anchors when the target route has the same semantic section.
- Add every EN/PL pair or intentionally hide the switch when no equivalent exists.
- Keep labels consistent: either `PL` / `EN` everywhere or full language names everywhere.
- Event-specific routes must not silently change event edition during switching.

## Back Navigation And BFCache Audit

Evidence:

- `assets/js/main.js` has a `pageshow` handler but does not branch on persisted BFCache restores.
- `assets/js/cinematic.js` has pageshow/pagehide handling but not a route-wide restore contract.
- `assets/js/prawda-sumienia-exclusive.js` has reveal, scroll progress, source drawer, and track rail state without a `pageshow` restore handler.
- Source drawer state uses `hidden`, body classes, and `aria-expanded`, but is not reset on BFCache restore.

Risks:

| Scenario | Risk |
|---|---|
| direct anchor navigation | medium; anchors are not part of language contract |
| open source drawer, click CTA, go back | high; drawer may remain stale/open |
| open track rail, click CTA, go back | medium; active rail/source state can be stale |
| switch language, go back | high; params/hash can be lost |
| generator/participation back to exclusive hub | high; event/state behavior not verified |
| reveal animations after back | medium; exclusive lacks persisted restore |
| scroll progress after back | medium; progress updates only on scroll |
| mobile Safari BFCache | high; not verified |

Recommended pattern for follow-up PR:

```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // restore reveal visibility, scroll progress, drawer safety,
    // rail state, modal/mobile-menu closed state, and focus safety
  }
});
```

Do not implement until the target state matrix is defined.

## Cinematic / Lite Mode Audit

Evidence:

- Global implementation is in `assets/js/cinematic.js`.
- Persistence uses `localStorage` key `siteCinematicMode` and `sessionStorage` key `siteCinematicArrival`.
- Exclusive pages load `cinematic.css` but do not load `cinematic.js`; no toggle button appears there.
- Reduced-motion handling exists, but expensive effects are not consistently governed by one route-level mode contract.

Cinematic difference score:

| Route group | Toggle | Visible difference | Score |
|---|---|---|---:|
| home EN/PL | yes | visible but runtime overlays dominate | 2 |
| public Prawda EN/PL | yes | visible but not fully page-specific | 2 |
| exclusive EN/PL | no | no implemented toggle | 0 |
| generator EN/PL | yes | likely limited, not rendered | 1 |
| participation EN/PL | yes | likely limited to global surfaces | 1 |
| experience routes | yes | already cinematic, lite not clearly lighter | 2 |
| Sydney event page | yes/global | not clearly page-specific | 1 |
| music/contact/institutions | yes | visible on global surfaces, not always meaningful | 1-2 |

Target: every major page should reach 3.

Desired behavior:

- Cinematic ON: premium look, stronger depth, cinematic light, controlled vignette, subtle movement, richer shadows, 2.5D where appropriate, immersive but readable.
- Cinematic OFF / Lite: brighter, faster, fewer overlays, reduced blur and shadows, less motion, stronger readability, still elegant.

Storage risk: mode preference storage is low sensitivity, but if the no-storage principle is strict on sensitive post-screening pages, persistence should be route-scoped, session-only, or disabled there.

## Overlay And Readability Audit

Source-level findings:

| Route group | Evidence | Risk | Options |
|---|---|---|---|
| exclusive | `.psx-hero-bg`, `::before`, `::after` stack dark gradients, vignette, beam, and scanlines; mobile uses `100svh` | hero image may be killed; CTA may sit too low | reduce overlay alpha; add mode variables; adjust crop/text zone |
| event shell | `event-shell-hero` uses dark gradients, beam, and `92svh` mobile hero | mobile first action delayed | reduce mobile height; split action band; define lite variables |
| global hero | `veritas.css` plus runtime patches add multiple overlays and `!important` hero rules | asset differences get hidden | centralize hero overlay tokens |
| generator/participation | task surfaces sit inside cinematic systems | usability can lose to atmosphere | separate ceremonial intro from work area |
| final CTAs | cinematic CTA clusters recur | hierarchy can blur under translucent layers | consistent final ritual CTA component |

Conservative option: small brightness/contrast tweak.
Premium option: CSS variables controlling overlay strength per mode.
Structural option: move text panel, crop, or action band where mobile needs it.

## Mobile Practical Audit

Requested breakpoints were not rendered. Static risks:

- 360px: exclusive and event heroes risk excessive height before first CTA; drawer and rail usability need verification.
- 390px: same risks with slightly more room.
- 430px: CTA stacking, source drawer, and image crop remain important.
- tablet: rail/card density and hero proportions need QA.
- desktop 1440: likely strong visually, but runtime overlays and inconsistent metadata remain.
- desktop 1920: crop and overlaid readability need QA.

Required manual checks:

- horizontal overflow
- hero readability
- CTA tap size
- nav usability
- language switch access
- cinematic toggle tap target
- source drawer usability
- final CTA stacking
- track rail swipe usability
- map/timeline readability
- forms/generator usability
- visible focus
- scrolling smoothness
- sticky/floating controls blocking content
- safe-area issues on iOS
- excessive height before first CTA

Recommended mobile improvements:

- reduce post-screening hero vertical weight
- tune crop before adding darker overlays
- stack final CTAs with one clear primary action
- add swipe hints for horizontal rails
- reduce overlays in Lite mode
- avoid sticky bottom CTA unless proved necessary
- reduce heavy blur/shadows on 360px
- fix overflow rather than masking with `overflow-x: hidden` or `clip`

## Performance Audit

Evidence:

- Multiple document/PDF assets exceed 10 MB.
- Exclusive and event heroes use many background layers, filters, shadows, and textures.
- Global scripts inject runtime CSS with many `!important` rules and repeated scheduling.
- Reveal behavior exists in more than one global script.
- CSS background heroes cannot use image loading controls as cleanly as HTML `picture`.

Largest risk assets:

| Asset | Approx. size | Risk |
|---|---:|---|
| `witness-report-paper-texture.svg` | 22.3 MB | generation-only asset must never load on normal view |
| `title-zapis-uczestnictwa-anniversary-gold.svg` | 17.0 MB | huge title plate must be lazy/generation-only |
| `participation-record-bg-final.svg` | 16.6 MB | generation-only |
| `witness-report-bg-a4.svg` | 14.8 MB | generation-only |
| `witness-report-bg-final.svg` | 14.2 MB | generation-only |
| `participation-record-bg-04-wall-edition-a4.png` | 12.8 MB | generation-only or optimized preview |

Performance recommendations:

- keep print/PDF assets generation-only
- add asset budget validation
- avoid eager loading non-hero decorative textures
- disable/reduce expensive filters, blur, and shadows in Lite and reduced-motion modes
- consolidate runtime CSS patches into source CSS
- validate hero loading strategy per route

## Accessibility Audit

Positive evidence:

- many routes include skip links
- several controls use `aria-expanded` and `aria-controls`
- hidden panels are generally controlled with `hidden`
- track rail has keyboard support
- generator/participation flows include status/live regions
- reduced-motion behavior exists globally

Risks:

- many major routes lack `<noscript>` fallback while reveal CSS can hide content until JS runs
- global header/nav is JS-injected
- mobile menu lacks a fully proven focus trap/inert-background contract
- manifesto/modal/source drawer surfaces need focus return and Escape close
- source drawer should move focus on open and restore focus on close
- horizontal rail needs clearer accessible semantics and visible swipe affordance
- contrast over final composited images is not verified
- language labels are inconsistent across route families

Accessibility classification:

| Route group | Class | Reason |
|---|---|---|
| home/global Veritas | B | structured but JS/nav/reveal concerns remain |
| public Prawda | B | strong structure, missing no-JS and metadata |
| exclusive hub | C | source drawer, rail, reveal, no-JS, BFCache, focus risks |
| generator routes | C | complex forms and generated documents need full QA |
| participation routes | C | access/document flow needs keyboard/mobile QA |
| experience routes | C | large visual surfaces, weak metadata, no language contract |
| music/contact/institutions | B | lower complexity; still needs metadata/focus/no-JS hardening |

## Historical And Institutional Safety Audit

Do not rewrite historical copy in implementation PRs without separate review.

Positive findings:

- no obvious Polish death camp phrasing found in inspected source
- exclusive source guidance distinguishes cinematic compression from verbatim quotation
- some source descriptions state that listings are not institutional endorsements
- the tone is generally restrained

Risks:

- `source-s06` is labelled as Auschwitz Prisoners Database but links to an Auschwitz resistance history page; this is a source-trust mismatch.
- Sydney experience wording uses `Rap-Ort: The Conscience Report` while the broader route family is `Prawda Sumienia / Truth of Conscience`; standardize terminology before institutional outreach.
- `Exclusive` can read as access-marketing rather than a museum threshold; review tone in a content-safety pass.
- fact / interpretation / artistic compression distinctions need consistent coverage across route families.
- avoid any future copy implying museum/university endorsement unless formally true.

## Experience Flow Audit

Entry points:

- social link
- QR after screening
- direct exclusive hub
- language switch
- event-specific URL
- source section
- generator
- participation/archive

Findings:

- social entry is weak because core previews are missing
- QR/event entry is fragile because event params are only partially preserved
- EN exclusive defaults to `syd2026`; PL exclusive defaults to `oswiecim20260525`; without explicit event param, switching can change the edition context
- exclusive hub offers several strong paths, but Witness Report, Participation Record, Anonymous Archive, journey, and source exploration can blur together
- generator and participation routes are task surfaces and need clearer relation to the exclusive hub and final ritual
- returning back from source/generator/participation paths is not yet proven smooth
- final CTA hierarchy should make first and second actions unmistakable

Target flow:

1. User arrives from QR/social and immediately understands the room they entered.
2. One primary next action is clear.
3. One quieter source-trust action is available.
4. One later participation/archive action is available.
5. Language switching preserves event context.
6. Back navigation feels invisible.
7. The ending is restrained, not confusing.

## World-Class Scoring

| Category | Current | Target | Main reason |
|---|---:|---:|---|
| First impression | 7 | 9 | strong visuals, weak previews and mobile risk |
| Cinematic identity | 6 | 9 | vocabulary exists, system contract missing |
| Mobile experience | 5 | 9 | source-level high risk, not rendered |
| Navigation clarity | 5 | 9 | deep flow and event context fragile |
| Language consistency | 5 | 9 | missing pairs and param/hash preservation |
| Source trust | 7 | 9 | promising layer, one source mismatch |
| Historical restraint | 8 | 9 | generally restrained, terminology review needed |
| Accessibility | 5 | 9 | focus, no-JS, drawer, rail, form QA needed |
| Social sharing readiness | 3 | 9 | missing on core routes |
| Performance | 5 | 9 | heavy assets/effects need governance |
| Interaction smoothness | 5 | 9 | BFCache/back state not proven |
| Emotional ending | 6 | 9 | strong intent, CTA hierarchy needs work |
| Institutional credibility | 7 | 9 | tone close; metadata/source consistency blocks readiness |
| Visual uniqueness | 7 | 9 | strong assets, overlays and inconsistency reduce distinction |
| Maintainability | 4 | 8 | runtime patches and fragmented mapping |

## Issue Table

| ID | Severity | Category | Summary | Suggested PR |
|---|---|---|---|---|
| UX-001 | P1 | social-preview | Missing OG/Twitter images and incomplete metadata on core routes | PR #156 |
| UX-002 | P1 | language | Deep language switch falls back home and drops safe params/hash | PR #156 |
| UX-003 | P1 | language/flow | Exclusive default event can change across EN/PL switch | PR #156 |
| UX-004 | P1 | hero/asset | Critical hero imagery lacks static fallback | PR #159 |
| UX-005 | P1 | asset | Missing or mismapped event asset references | PR #159 |
| UX-006 | P1 | cinematic | Cinematic/lite is not coherent; exclusive has no toggle | PR #157 |
| UX-007 | P2 | back-navigation | BFCache/pageshow restore is incomplete | PR #160 |
| UX-008 | P1 | mobile/overlay | Mobile hero height and overlay risk | PR #158 |
| UX-009 | P2 | performance/maintainability | Runtime `!important` style patches and duplicate reveal systems | PR #157 |
| UX-010 | P2 | performance | Large document assets need loading discipline | PR #158 |
| UX-011 | P2 | accessibility | No-JS/reveal fallback incomplete | PR #158 |
| UX-012 | P2 | accessibility | Focus management gaps in menu/modal/source drawer | PR #160 |
| UX-013 | P2 | content-risk/source | Source label/link mismatch | PR #156 |
| UX-014 | P2 | experience-flow | Report vs participation vs archive path clarity | PR #158 |
| UX-015 | P3 | social-preview/asset | Localized OG assets exist but are unused | PR #156 |
| UX-016 | P1 | social/event | Public event and experience routes lack preview contract | PR #156 |

## Detailed Issues

### UX-001

Page: core entry and Prawda Sumienia pages
Route: `/`, `/pl/`, public Prawda, exclusive, generator, participation, event, experience routes

Severity: P1
Category: social-preview

Finding: Most critical routes lack `og:image` and `twitter:image`; generator, participation, event, and experience pages often lack complete OG/Twitter metadata.

Evidence: route inventory and existing unused OG assets under `/public/assets/og/`.

Why it matters: Social links, QR follow-ups, institutional sharing, and private message previews are weak or generic.

Recommended fix: Add complete OG/Twitter metadata for every important route.

Alternative A: wire existing OG assets immediately.
Alternative B: create the recommended social image set.
Alternative C: central route metadata manifest.

Implementation risk: low
Suggested PR: PR #156

### UX-002

Page: deep EN/PL route families
Route: generator, participation, experience, event-related paths

Severity: P1
Category: language

Finding: Missing global language pairs fall back to home and safe params/hash anchors are dropped.

Evidence: `assets/js/navigation.js` `languagePairs` map and fallback behavior.

Why it matters: Users lose event, campaign, form, or section context during language switching.

Recommended fix: add explicit route pairs and safe-param preservation for `event`, `ref`, `utm_source`, `utm_medium`, `utm_campaign`, and `screening`.

Alternative A: add missing pairs only.
Alternative B: add pairs plus safe params.
Alternative C: central route contract with language, canonical, hreflang, and metadata.

Implementation risk: medium
Suggested PR: PR #156

### UX-003

Page: exclusive hub
Route: exclusive EN/PL

Severity: P1
Category: language

Finding: EN exclusive defaults to `syd2026`; PL exclusive defaults to `oswiecim20260525`. Without an explicit `event` param, language switch can change event context.

Evidence: `data-default-event` in exclusive HTML and event logic in `assets/js/prawda-sumienia-exclusive.js`.

Why it matters: QR and post-screening links must not change screening edition silently.

Recommended fix: make event context explicit and preserve it across language switching.

Alternative A: add `event` to rendered language links.
Alternative B: infer default event from route-independent config.
Alternative C: event-specific localized canonical routes.

Implementation risk: medium
Suggested PR: PR #156

### UX-004

Page: exclusive hub and generator routes
Route: exclusive EN/PL, generator EN/PL

Severity: P1
Category: hero

Finding: Critical hero imagery is CSS/JS-installed and lacks clear static HTML fallback on some routes.

Evidence: exclusive hero picture is created in `assets/js/prawda-sumienia-exclusive.js`; generator routes have no clear static hero image in source inventory.

Why it matters: no-JS, slow-JS, preview bots, and assistive edge cases get a weaker first viewport.

Recommended fix: add static fallback hero markup or a central hero manifest that renders into HTML.

Alternative A: add `<picture>` fallback in exclusive HTML.
Alternative B: define route-level hero variables and fallback images.
Alternative C: central typed hero/social manifest validated in CI.

Implementation risk: medium
Suggested PR: PR #159

### UX-005

Page: event and exclusive routes
Route: `/rap-ort/experience/*`, exclusive, participation/generator asset configs

Severity: P1
Category: asset

Finding: Several references use `/assets/events/...` while the tree contains `/public/assets/events/...`; some mobile and texture references appear missing.

Evidence: CSS/JS/manifest search output; see asset inventory.

Why it matters: missing premium assets can silently collapse the cinematic layer.

Recommended fix: add asset-reference validation and correct path policy.

Alternative A: patch broken references only.
Alternative B: add path alias policy and CI validation.
Alternative C: central asset registry with roles and route usage.

Implementation risk: medium
Suggested PR: PR #159

### UX-006

Page: major route families
Route: all audited routes

Severity: P1
Category: cinematic

Finding: Cinematic/lite mode lacks a consistent visual contract; exclusive pages load CSS but not the JS/toggle.

Evidence: `assets/js/cinematic.js`; exclusive HTML includes `cinematic.css` and psx scripts only.

Why it matters: the requested visible cinematic/lite difference is route-dependent and inconsistent.

Recommended fix: define mode variables for overlay, motion, blur, shadow, texture, and hero depth; implement consistently.

Alternative A: add exclusive toggle support only.
Alternative B: route-level CSS variables.
Alternative C: shared cinematic system contract.

Implementation risk: medium
Suggested PR: PR #157

### UX-007

Page: exclusive and global animated pages
Route: exclusive, event, generator, participation, global Veritas pages

Severity: P2
Category: back-navigation

Finding: BFCache/back restore is partial; exclusive drawer/rail/reveal/scroll state has no `pageshow` restore contract.

Evidence: `assets/js/main.js` and `assets/js/cinematic.js` have pageshow handlers; exclusive JS does not.

Why it matters: mobile Safari and in-app browsers commonly restore pages from BFCache.

Recommended fix: add persisted `pageshow` restore for reveal, drawer, scroll progress, modal/menu state, and focus safety.

Alternative A: reset exclusive drawer and reveal classes only.
Alternative B: shared BFCache utility.
Alternative C: full route-state lifecycle.

Implementation risk: medium
Suggested PR: PR #160

### UX-008

Page: exclusive, event shell, generator/participation
Route: post-screening and event routes

Severity: P1
Category: mobile

Finding: Source inspection shows high mobile risk from `100svh`/`92svh` heroes, large clamp titles, dark overlays, rails, drawers, and forms.

Evidence: `prawda-sumienia-exclusive.css`, `event-shell.css`, generator/participation structures.

Why it matters: the final target is mobile-first after a screening.

Recommended fix: rendered mobile QA and tuning for hero height, title clamp, CTA stacking, drawer ergonomics, and rail affordance.

Alternative A: conservative height/overlay tweaks.
Alternative B: mobile mode variables.
Alternative C: separate ceremonial hero from task-first mobile content.

Implementation risk: medium
Suggested PR: PR #158

### UX-009

Page: global Veritas routes
Route: global pages using `main.js`, `veritas.js`, and global CSS

Severity: P2
Category: performance

Finding: Runtime style injection with many `!important` rules and multiple reveal systems increases maintenance and performance risk.

Evidence: `assets/js/main.js` hero patch and `assets/js/veritas.js` runtime fixes.

Why it matters: premium core behavior should not depend on layered emergency patches.

Recommended fix: move stable runtime CSS into source CSS and consolidate reveal logic.

Alternative A: document and reduce worst overlap.
Alternative B: consolidate reveal and hero patch logic.
Alternative C: tokenized route design system.

Implementation risk: medium
Suggested PR: PR #157

### UX-010

Page: generator and participation flows
Route: generator, participation

Severity: P2
Category: performance

Finding: very large print/document assets exist and must stay generation-only or lazy-loaded.

Evidence: tree sizes show multiple SVG/PNG assets above 10 MB.

Why it matters: accidental page-view loading would be a severe mobile performance trap.

Recommended fix: audit loading paths and add assertions that print/PDF assets are not requested before generation.

Alternative A: manual route QA with network panel.
Alternative B: preload/lazy rules and manifest comments.
Alternative C: asset budget script.

Implementation risk: low
Suggested PR: PR #158

### UX-011

Page: major route families
Route: public Prawda, exclusive, generator, participation, event pages

Severity: P2
Category: accessibility

Finding: many major routes lack no-JS fallback while reveal systems can hide content until JS runs.

Evidence: route inventory and `.reveal` rules.

Why it matters: slow-JS, no-JS, validators, and assistive edge cases can see incomplete content.

Recommended fix: add no-JS visibility guarantees.

Alternative A: add `<noscript>` messages and reveal-visible fallback.
Alternative B: make content visible by default, hide only after JS readiness.
Alternative C: static render first viewport and progressively enhance.

Implementation risk: low
Suggested PR: PR #158

### UX-012

Page: mobile menu, modal surfaces, source drawer
Route: global pages and exclusive hub

Severity: P2
Category: accessibility

Finding: focus management for dialog-like surfaces is incomplete.

Evidence: menu, modal, and source drawer open/close code lacks robust focus trap, Escape close, inert background, and focus return in all cases.

Why it matters: keyboard and screen-reader users can lose context or interact with background content.

Recommended fix: add focus trap/return and Escape-close behavior.

Alternative A: fix source drawer only.
Alternative B: shared accessible overlay helper.
Alternative C: route lifecycle state manager.

Implementation risk: medium
Suggested PR: PR #160

### UX-013

Page: exclusive source layer
Route: exclusive EN/PL

Severity: P2
Category: content-risk

Finding: source `S06` is labelled as Auschwitz Prisoners Database but links to the Auschwitz resistance history page.

Evidence: exclusive source detail link for `source-s06`.

Why it matters: source trust is central to institutional credibility.

Recommended fix: correct the URL or relabel after historical/source review.

Alternative A: update only URL.
Alternative B: update label and description.
Alternative C: source manifest with review status.

Implementation risk: medium
Suggested PR: PR #156

### UX-014

Page: exclusive, generator, participation, archive paths
Route: post-screening flows

Severity: P2
Category: experience-flow

Finding: Witness Report, Participation Record, archive, and continuation paths are not yet structurally unmistakable.

Evidence: exclusive hub action taxonomy and separated generator/participation routes.

Why it matters: post-screening users need clarity and emotional confidence.

Recommended fix: define a flow model with one primary action, one source action, and one participation/archive action per screen.

Alternative A: clarify CTA groups after content review.
Alternative B: shared final-action component.
Alternative C: formal post-screening route map.

Implementation risk: medium
Suggested PR: PR #158

### UX-015

Page: localized public pages
Route: `/music/pl/`, `/for-institutions/pl/`

Severity: P3
Category: social-preview

Finding: PL-specific OG assets exist but localized pages use EN/default images.

Evidence: `music-og-pl.jpg` and `for-institutions-og-pl.jpg` exist.

Why it matters: weakens language polish and diaspora/institutional sharing.

Recommended fix: wire localized OG images.

Alternative A: use existing PL images.
Alternative B: regenerate localized OG set.
Alternative C: metadata manifest maps language to image variant.

Implementation risk: low
Suggested PR: PR #156

### UX-016

Page: Sydney event and event experience pages
Route: `/events/sydney-2026/`, `/rap-ort/experience/syd2026/`, `/rap-ort/experience/`

Severity: P1
Category: social-preview

Finding: public event and event experience routes lack reliable social/event preview metadata.

Evidence: route inventory shows missing OG/Twitter images and weak language/hreflang contract.

Why it matters: event links are commonly shared through QR, messages, and institutions.

Recommended fix: add `sydney-2026-og` and route metadata; define public/private preview rules.

Alternative A: use existing Sydney lobby image temporarily.
Alternative B: produce dedicated 1200x630 event image.
Alternative C: event metadata manifest with public/private, social, language, date, venue, and QR rules.

Implementation risk: low
Suggested PR: PR #156

## Follow-Up PR Plan

### PR #156 - Social Preview and Metadata Pack

Goal: `og:image`, `twitter:image`, canonical, hreflang, title, description, and language-pair consistency.

Scope:

- add missing metadata to all important routes
- use existing OG assets where possible
- wire PL-specific social images
- add missing language pairs and safe-param preservation
- correct or review the `S06` source link mismatch

### PR #157 - Cinematic/Lite Consistency System

Goal: make cinematic ON/OFF visibly different and consistent across routes.

Scope:

- define cinematic/lite CSS variables
- add exclusive toggle implementation or intentional exclusion
- reduce runtime `!important` style patches
- consolidate reveal/mode behavior where safe

### PR #158 - Mobile Practical Polish

Goal: hero heights, source drawer, final CTA stacking, track rail hints, overflow fixes.

Scope:

- render QA at 360, 390, 430, tablet, 1440, and 1920
- tune mobile hero height and title clamps
- clarify generator/participation task hierarchy
- add rail swipe hints and improve drawer ergonomics
- verify focus and tap sizes

### PR #159 - Asset Governance and Hero Mapping

Goal: central hero/social image manifest and orphaned asset cleanup.

Scope:

- add image manifest for hero, mobile, social, decorative, generation-only, and fallback roles
- validate referenced files exist
- identify orphaned premium assets
- fix `/assets/events` versus `/public/assets/events` path inconsistencies

### PR #160 - Back Navigation and BFCache Resilience

Goal: pageshow/back restore, reveal safety, drawer state reset, scroll progress restore.

Scope:

- add persisted `pageshow` handling
- reset source drawer, mobile menu, modal, and rail state
- restore scroll progress and reveal visibility
- verify mobile Safari BFCache manually

## Final Readiness Judgment

The current experience is a good cinematic website with serious potential. It is not yet a Top 5 world-class historical digital experience because the delivery contracts are inconsistent: metadata, language switching, hero governance, mobile practical behavior, cinematic/lite mode, asset references, and back-navigation resilience.

Do not redesign first. Fix the contracts first:

1. route metadata and social previews
2. language/event parameter behavior
3. cinematic/lite mode contract
4. mobile practical issues
5. asset governance and BFCache restore

Only after those contracts are stable should visual redesign or premium polish begin.
