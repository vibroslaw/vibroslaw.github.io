# Rap-Ort Event Ecosystem — Master Plan

This document defines the intended premium post-screening ecosystem for Rap-Ort: Prawda Sumienia.

## Core idea

The website should not treat the Participation Record, Witness Report and downloadable materials as separate gadgets. They should function as one post-screening experience:

1. Public Events / Wydarzenia section.
2. Event-specific landing pages.
3. QR-gated event portal.
4. Premium document generators.
5. Participant Memory Pack.
6. Workshop / seminar companion layer for selected academic events.

The system should support both:

- standard public editions, and
- special event editions with event-specific backgrounds, title plates, layout presets, numbering, downloadable graphics and workshop content.

## Access model for GitHub Pages

GitHub Pages is static. It cannot provide real server-side password protection or anonymous server-side email sending without a backend service.

Recommended free/static approach:

- public event pages are indexable or semi-public depending on page intent;
- generator/portal pages remain `noindex, nofollow`;
- QR links carry an event code or access token in the URL;
- JavaScript unlocks event content locally based on known event codes;
- no participant data is sent to a server;
- true archival/email submission requires a later backend or external form service.

## Important privacy boundary

Participant PDF generation should remain local in the browser.

The requested feature "archive anonymously and email PDF directly to myrelaxationmusic2021@gmail.com without opening the user's email client" is not possible with only static GitHub Pages. It requires one of:

- serverless function,
- Formspree / Basin / Netlify Forms / Cloudflare Worker,
- Google Apps Script endpoint,
- own backend.

Until then, safe static options:

- download PDF locally,
- copy/save link,
- optional mailto fallback,
- optional user-controlled upload/share outside the site.

## Priority roadmap

### PR61 — Ecosystem scaffold

Create folders, manifests, event templates and asset checklists. No heavy visual redesign yet.

### PR62 — Document Pack System

Replace one-background thinking with configurable document packs:

- standard-cinema,
- standard-museum,
- standard-ceremonial,
- syd2026,
- oswiecim20260525.

Each pack defines:

- event identity,
- background A4/A3,
- preview/thumbnail,
- title plates,
- seals/accents,
- layout coordinates,
- copy profile,
- numbering format,
- public/demo/event access mode,
- watermark mode.

### PR63 — Events / Wydarzenia index

Add:

- `/rap-ort/events/`
- `/rap-ort/wydarzenia/`

Show planned and past events. Each card should include:

- title,
- date,
- place,
- short description,
- event status,
- link to event page,
- external info link if available.

### PR64 — Event page template

Create reusable event page structure:

- hero,
- event details,
- context,
- programme / session flow,
- track notes,
- sources,
- access gate,
- generator links,
- memory pack downloads.

### PR65 — MUP / Oświęcim premium workshop page

Priority page for academic workshop event. Needs:

- premium mobile-first experience,
- workshop flow,
- discussion prompts,
- AI/narrative tools section,
- moral choices / contemporary patriotism / historical memory sections,
- facilitator cues,
- QR event portal,
- anniversary document pack.

### PR66 — Sydney event page

Simpler international event page:

- story/context,
- track notes,
- sources,
- materials/downloads,
- generator,
- memory pack.

### PR67 — Event Portal / QR Experience Layer

Premium mobile-first access portal:

- unlock by QR/link/code,
- event identity,
- track notes with images,
- selected scenes,
- download pack,
- send/copy/share link to desktop,
- document generator entry.

### PR68 — Memory Pack system

Add downloadable assets per event:

- phone wallpaper,
- desktop wallpaper,
- social post,
- story card,
- quote card,
- reflection card,
- thank-you card,
- project note cover,
- memory pack cover.

### PR69 — Public preview vs event unlocked mode

Public generator:

- three standard editions,
- preview watermark,
- sample mode,
- no event-exclusive pack.

Unlocked event generator:

- full PDF,
- no watermark,
- event-specific title/background/layout/numbering.

### PR70 — Optional archive/email backend decision

Choose whether to add a backend. Do not fake anonymous archiving on a static-only site.

## Experience goal

The participant should feel:

> I was part of something serious, rare and beautifully prepared. This did not end when the screening ended. I can keep a trace of it.

The academic host should feel:

> This is a complete modern teaching object, not only a film screening.

The system should feel world-class, but restrained: no gimmicks, no cheap interactivity, no sensationalism.
