# Event Assets

This folder stores event-specific visual assets for the Rap-Ort event ecosystem.

Recommended structure:

```text
public/assets/events/
  standard/
    archival-cinema/
    museum-line/
    ceremonial-frame/
  syd2026/
    documents/
    memory-pack/
    scene-notes/
    sources/
  oswiecim20260525/
    documents/
    memory-pack/
    scene-notes/
    workshop/
    sources/
```

Use event-specific folders for materials that should not be treated as universal assets.

Large print-master backgrounds can remain under `/public/assets/reports/` if already wired into document generators, but event pages and memory packs should read from this folder where possible.
