# Prawda Sumienia / Rap-Ort Asset Inventory

Audit date: 2026-06-06  
Scope: prioritized image inventory for the Prawda Sumienia / Rap-Ort world-class experience audit.

This is not a redesign document. It is an asset-governance inventory to support follow-up implementation PRs.

## Method

Reviewed:

- repository tree image paths and file sizes
- image references in HTML, CSS, JS, and manifest files
- route-level hero/social metadata usage

Not verified:

- decoded image dimensions
- final visual crop quality
- live browser rendering
- network waterfall
- external social validators

## Summary

The repository contains strong hero, event, report, and OG assets, but they are not governed through one route-level manifest. Hero images are currently referenced through a mix of HTML inline styles, CSS variables, JS installation, runtime patches, and static metadata. That makes it easy for a route to have a premium hero but no social image, or a social image asset to exist but never be used.

Highest priority asset issues:

1. Core OG assets exist but are not wired to home, Prawda Sumienia, exclusive, generator, participation, and event routes.
2. Exclusive hub hero imagery is installed by JS and lacks equivalent static fallback.
3. Several event paths are referenced as `/assets/events/...` while the repository tree contains `/public/assets/events/...`.
4. Event-specific mobile images are referenced in CSS/manifests but are not all present in the tree.
5. Large print/PDF assets must stay generation-only and should never load during normal page view.

## Prioritized Hero, Social, and Event Assets

| Image path | Used where | Role | Desktop/mobile | Mobile variant | Social preview variant | Likely orphaned | Recommendation |
|---|---|---|---|---|---|---|---|
| `/public/assets/heroes/veritas-humanum-hero.webp` | `/`, `/pl/` | home hero | desktop/general | none explicit | `/public/assets/og/veritas-humanum-og.jpg` exists | no | Wire home OG metadata and define mobile crop policy. |
| `/public/assets/heroes/english-guide-hero.webp` | `/rap-ort/prawda-sumienia/` | EN Prawda hero | desktop/general | none explicit | `/public/assets/og/prawda-sumienia-og.jpg` exists | no | Connect to Prawda social image; review EN/PL hero consistency. |
| `/public/assets/heroes/prawda-sumienia-hero.webp` | `/rap-ort/prawda-sumienia/pl/` | PL Prawda hero | desktop/general | none explicit | `/public/assets/og/prawda-sumienia-og-pl.jpg` exists | no | Use PL OG image on PL route. |
| `/public/assets/heroes/witness-report-hero.webp` | participation and witness-adjacent routes | witness/participation hero | desktop/general | none explicit | should map to `witness-report-og` or `participation-og` | no | Define whether this is witness, participation, or shared report hero. |
| `/public/assets/events/rap-ort/shared/experience/event-lobby-cinematic-hero.webp` | `/rap-ort/experience/` | event lobby hero | desktop | yes | none active | no | Add event lobby social image or map to event preview. |
| `/public/assets/events/rap-ort/shared/experience/event-lobby-cinematic-mobile.webp` | event shell and exclusive mobile fallback | mobile event hero | mobile | n/a | none | no | Keep as fallback, but add event-specific mobile variants if meaning matters. |
| `/public/assets/events/rap-ort/syd2026/experience/sydney-event-lobby.webp` | `/rap-ort/experience/syd2026/`; intended exclusive EN default | Sydney event hero | desktop | shared mobile only | should map to `sydney-2026-og` | no | Create or assign Sydney social preview; verify JS path uses `/public`. |
| `/public/assets/events/rap-ort/oswiecim20260525/experience/oswiecim-event-lobby.webp` | `/rap-ort/experience/oswiecim20260525/`; intended exclusive PL default | Oswiecim event hero | desktop | shared mobile only | none active | no | Create event/social mapping; verify JS path uses `/public`. |
| `/public/assets/events/rap-ort/shared/experience/witness-writing-desk.webp` | Oswiecim experience route | witness action image | desktop/general | none | should map to `witness-report-og` | no | Consider as witness-report social subject. |
| `/public/assets/events/rap-ort/shared/experience/witness-report-paper-closeup.webp` | Sydney experience route | report closeup/action image | desktop/general | none | should map to `witness-report-og` | no | Good candidate for witness/generator preview. |
| `/public/assets/events/rap-ort/shared/experience/archive-wall-empty.webp` | event/experience assets | archive wall image | desktop/general | none | possible archive preview | maybe | Validate active usage and role. |
| `/public/assets/events/rap-ort/shared/experience/memory-case.webp` | event/experience assets | memory case visual | desktop/general | none | possible participation/archive preview | maybe | Validate active usage and avoid loading early on mobile. |
| `/public/assets/events/rap-ort/shared/experience/projection-beam-overlay.webp` | exclusive/event visual systems | decorative overlay | desktop/general | n/a | no | no | Keep decorative; do not use as social preview. |
| `/public/assets/events/rap-ort/shared/experience/archival-dark-texture.webp` | event/exclusive visual texture | decorative background | desktop/general | n/a | no | no | Review performance on mobile; disable/reduce in Lite mode. |
| `/assets/images/hero-sztab.jpg` | no active use found in prioritized audit | legacy hero | desktop | `/assets/images/hero-sztab-mobile.jpg` | no | likely | Keep only if used outside audited scope; otherwise cleanup candidate. |
| `/assets/images/hero-sztab-mobile.jpg` | no active use found in prioritized audit | legacy mobile hero | mobile | n/a | no | likely | Cleanup candidate after full route audit. |

## Social Preview Assets

| Image path | Used where | Role | Desktop/mobile | Mobile variant | Social preview variant | Likely orphaned | Recommendation |
|---|---|---|---|---|---|---|---|
| `/public/assets/og/veritas-humanum-og.jpg` | asset exists; not wired to `/` or `/pl/` | social preview | social | n/a | yes | no | Use for `/`; create/use PL variant for `/pl/` if available. |
| `/public/assets/og/veritas-humanum-og-pl.jpg` | asset exists | social preview | social | n/a | yes | no | Use for `/pl/`. |
| `/public/assets/og/prawda-sumienia-og.jpg` | asset exists; not wired to Prawda routes | social preview | social | n/a | yes | no | Use for EN public Prawda route; evaluate exclusive-specific variant. |
| `/public/assets/og/prawda-sumienia-og-pl.jpg` | asset exists; not wired to Polish Prawda routes | social preview | social | n/a | yes | no | Use for PL public Prawda route. |
| `/public/assets/og/rap-ort-og.jpg` | asset exists; not active on key post-screening routes | social preview | social | n/a | yes | no | Use as temporary fallback for exclusive/generator/participation only if specific OG is missing. |
| `/public/assets/og/rap-ort-og-pl.jpg` | asset exists | social preview | social | n/a | yes | no | Use as Polish temporary fallback only if specific OG is missing. |
| `/public/assets/og/music-og.jpg` | `/music/`, `/music/pl/` | social preview | social | n/a | yes | no | Keep on EN route; PL should use PL asset. |
| `/public/assets/og/music-og-pl.jpg` | asset exists | social preview | social | n/a | yes | no | Wire to `/music/pl/`. |
| `/public/assets/og/contact-og.jpg` | `/contact/`, `/contact/pl/` | social preview | social | n/a | yes | no | Acceptable shared image; add Twitter title/description. |
| `/public/assets/og/for-institutions-og.jpg` | `/for-institutions/`, `/for-institutions/pl/` | social preview | social | n/a | yes | no | Keep on EN route; PL should use PL asset. |
| `/public/assets/og/for-institutions-og-pl.jpg` | asset exists | social preview | social | n/a | yes | no | Wire to `/for-institutions/pl/`. |

Recommended new/confirmed social image keys:

| Key | Needed because | Recommended subject | Routes |
|---|---|---|---|
| `home-og` | home has no active social image | Veritas Humanum identity, archival room cue | `/`, `/pl/` |
| `prawda-sumienia-og` | public Prawda routes have no active social image | report/archival threshold, restrained historical identity | Prawda public EN/PL |
| `prawda-sumienia-exclusive-og` | exclusive hub has no active social image | post-screening museum room, witness threshold | exclusive EN/PL |
| `witness-report-og` | generator routes have no metadata image | writing desk/report paper | generator EN/PL |
| `participation-og` | participation routes have no metadata image | participation record/pass/document | participation EN/PL |
| `sydney-2026-og` | public event page and Sydney experience lack preview | Sydney screening/event pass/map/venue identity | `/events/sydney-2026/`, `/rap-ort/experience/syd2026/` |
| `music-og` | exists, but PL mapping incomplete | music identity | music EN/PL |
| `contact-og` | exists, but Twitter fields incomplete | project contact threshold | contact EN/PL |
| `institution-og` | exists, but PL mapping incomplete | institutional dossier/screening kit | institutions EN/PL |

## Missing or Mismapped References

These examples came from text-reference search against the repository tree. Some may be intentional legacy references, but they should be verified before implementation.

| Referenced path pattern | Expected/current tree pattern | Where seen | Risk | Recommendation |
|---|---|---|---|---|
| `/assets/events/rap-ort/.../experience/oswiecim-event-lobby.webp` | `/public/assets/events/rap-ort/.../experience/oswiecim-event-lobby.webp` | exclusive/event JS references | hero may fail when JS path is used | Normalize to `/public/assets/events/...` or define a path alias. |
| `/assets/events/rap-ort/.../experience/sydney-event-lobby.webp` | `/public/assets/events/rap-ort/.../experience/sydney-event-lobby.webp` | exclusive/event JS references | hero may fail or fallback | Normalize path. |
| `oswiecim-event-lobby-mobile.webp` | no matching event-specific mobile file found in tree | premium asset integration CSS | mobile hero can fall back unexpectedly | Use shared mobile intentionally or add event-specific mobile image. |
| `sydney-event-lobby-mobile.webp` | no matching event-specific mobile file found in tree | premium asset integration CSS | mobile hero can fall back unexpectedly | Use shared mobile intentionally or add event-specific mobile image. |
| `event-pass-texture.webp` | no matching file found in tree | event asset manifest | decorative/pass layer may be missing | Add file or remove manifest reference. |
| `participation-record-bg-preview2.webp` | no matching file found in tree | participation page `onerror` fallback | broken fallback chain | Replace with existing fallback or add asset. |
| `participation-record-bg-preview3.webp` | no matching file found in tree | participation page `onerror` fallback | broken fallback chain | Replace with existing fallback or add asset. |

## Large Asset Loading Risk

These assets are not necessarily problems if they remain generation-only. They become serious performance problems if they are loaded during normal mobile page view.

| Image path | Approx. size | Likely role | Recommendation |
|---|---:|---|---|
| `/assets/raport-swiadka/pdf/witness-report-paper-texture.svg` | 22.3 MB | PDF/report generation | Keep generation-only; never preload. |
| `/public/assets/events/rap-ort/oswiecim20260525/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg` | 17.0 MB | title plate / generated document | Keep generation-only; validate not loaded on page entry. |
| `/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-bg-final.svg` | 16.6 MB | participation document generation | Keep generation-only; lazy load after user action. |
| `/assets/raport-swiadka/pdf/witness-report-bg-a4.svg` | 14.8 MB | PDF generation | Keep generation-only; consider optimized export. |
| `/public/assets/events/rap-ort/oswiecim20260525/backgrounds/witness-report-bg-final.svg` | 14.2 MB | witness report generation | Keep generation-only. |
| `/public/assets/reports/participation-record-bg-04-wall-edition-a4.png` | 12.8 MB | report/record background | Keep generation-only; consider compressed variant if previewed. |
| `/public/assets/events/rap-ort/shared/experience/projection-beam-overlay.webp` | 1.7 MB | decorative overlay | Review mobile loading; disable in Lite if needed. |
| `/public/assets/events/rap-ort/shared/experience/memory-case.webp` | 1.6 MB | event visual | Lazy load below fold. |
| `/public/assets/events/rap-ort/shared/experience/witness-report-paper-closeup.webp` | 1.5 MB | event/witness visual | Use responsive sizes if promoted. |
| `/public/assets/events/rap-ort/shared/experience/document-print-samples.webp` | 1.5 MB | document samples | Lazy load below fold. |
| `/public/assets/events/rap-ort/shared/experience/archival-dark-texture.webp` | 1.4 MB | decorative texture | Consider removing from mobile Lite. |
| `/public/assets/events/rap-ort/shared/experience/archive-wall-empty.webp` | 1.3 MB | archive visual | Lazy load below fold. |
| `/public/assets/events/rap-ort/syd2026/experience/sydney-event-lobby.webp` | 1.2 MB | hero | Acceptable if optimized and preloaded only for hero route. |

## Asset Governance Recommendation

Create a central manifest for major routes:

```js
{
  route: "/rap-ort/prawda-sumienia/exclusive/",
  lang: "en",
  canonical: "https://vibroslaw.github.io/rap-ort/prawda-sumienia/exclusive/",
  hero: {
    desktop: "/public/assets/events/rap-ort/syd2026/experience/sydney-event-lobby.webp",
    mobile: "/public/assets/events/rap-ort/shared/experience/event-lobby-cinematic-mobile.webp",
    fallback: "/public/assets/og/prawda-sumienia-og.jpg",
    role: "post-screening museum room"
  },
  social: {
    image: "/public/assets/og/prawda-sumienia-exclusive-og.jpg",
    width: 1200,
    height: 630
  },
  loading: {
    hero: "eager",
    belowFold: "lazy",
    generationOnly: []
  }
}
```

The manifest should validate:

- every referenced image exists
- every major route has desktop hero, mobile hero policy, social image, and fallback image
- every social image is 1200x630 or intentionally documented
- generation-only assets are not preloaded
- decorative assets are disabled or reduced in Lite mode when expensive
- localized routes use localized social images when available

## Follow-Up Checks

Recommended script/check for PR #159:

- scan HTML/CSS/JS/manifests for image URLs
- normalize absolute `/public/...` and `/assets/...` paths
- compare against repository tree
- emit missing references
- emit unreferenced assets over a size threshold
- emit routes without social image
- emit hero assets without mobile or social counterpart

Manual QA still required:

- visual crop for every hero at 360, 390, 430, tablet, 1440, and 1920
- social preview validator output
- mobile network waterfall
- no-JS first viewport
- generator/participation asset loading before and after document generation
