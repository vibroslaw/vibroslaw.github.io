(() => {
  "use strict";

  const root = document.querySelector("body.page-music");
  if (!root || window.__veritasMusicSoundMap) return;
  window.__veritasMusicSoundMap = true;

  const lang = root.dataset.lang === "pl" ? "pl" : "en";
  const isPl = lang === "pl";

  const spotifyArtist = "https://open.spotify.com/artist/0df87MMIM1VOy2dR1DM2oF";
  const platforms = [
    ["YouTube", "https://www.youtube.com/@VIBROS%C5%81AW"],
    ["Spotify", spotifyArtist],
    ["TIDAL", "https://tidal.com/artist/64846539"],
    ["Qobuz", "https://www.qobuz.com/ie-en/interpreter/vibrosaw/28032763"],
    ["Amazon Music", "https://music.amazon.com/artists/B0FL7G4Z7J/vibros%25C5%2582aw?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_l71YflSsnpFEp72kXFRNRSkRW"],
  ];

  const playlistData = {
    memory: {
      label: isPl ? "Pamięć" : "Memory",
      id: "0xv8YgWzwwY7VtER506P1Z",
      url: "https://open.spotify.com/playlist/0xv8YgWzwwY7VtER506P1Z",
      description: isPl ? "Świadectwo, pamięć, historia i echo tego, co zostaje po spotkaniu z prawdą." : "Witness, memory, history and the echo of what remains after encountering truth.",
    },
    conscience: {
      label: isPl ? "Sumienie" : "Conscience",
      id: "46B6jvmQkPM33LV28w4UvV",
      url: "https://open.spotify.com/playlist/46B6jvmQkPM33LV28w4UvV",
      description: isPl ? "Prawda, wybór, presja moralna i pytanie, które zostaje z odbiorcą." : "Truth, choice, moral pressure and the question that remains with the listener.",
    },
    resistance: {
      label: isPl ? "Opór" : "Resistance",
      id: "6R2zp276q7G9z9IJZMWxqU",
      url: "https://open.spotify.com/playlist/6R2zp276q7G9z9IJZMWxqU",
      description: isPl ? "Siła, odmowa, przetrwanie i energia, która nie pozwala zamilknąć." : "Strength, refusal, survival and the energy that refuses to disappear.",
    },
    identity: {
      label: isPl ? "Tożsamość" : "Identity",
      id: "4Ml3373UqCDgQEdr0m6SoH",
      url: "https://open.spotify.com/playlist/4Ml3373UqCDgQEdr0m6SoH",
      description: isPl ? "Odbicie, język, przynależność, wewnętrzny konflikt i szukanie siebie." : "Reflection, language, belonging, inner conflict and the search for self.",
    },
    resilience: {
      label: isPl ? "Odporność" : "Resilience",
      id: "6FNzNCjmvmGwpibLLDNufr",
      url: "https://open.spotify.com/playlist/6FNzNCjmvmGwpibLLDNufr",
      description: isPl ? "Wytrwałość, odbudowa, wewnętrzny ogień i powrót po doświadczeniu ciężaru." : "Endurance, rebuilding, inner fire and return after carrying weight.",
    },
    personal: {
      label: isPl ? "Osobiste / filmowe" : "Personal / Cinematic",
      id: "6FNzNCjmvmGwpibLLDNufr",
      url: "https://open.spotify.com/playlist/6FNzNCjmvmGwpibLLDNufr",
      description: isPl ? "Mniej historyczne wejście w emocję, obraz, klimat i osobistą stronę twórczości." : "A less historical entry into emotion, image, atmosphere and the personal side of the work.",
    },
  };

  const t = {
    all: isPl ? "Wszystko" : "All",
    showing: isPl ? "Pokazuję" : "Showing",
    empty: isPl ? "Na razie brak prac dla tego wejścia emocjonalnego." : "No works match this emotional entry yet.",
    filterKicker: isPl ? "Wybierz emocję" : "Choose an emotion",
    filterTitle: isPl ? "Interaktywny filtr emocji" : "Interactive emotional filter",
    filterLead: isPl ? "Kliknij emocjonalne wejście, aby zmienić widoczne dokumenty dźwiękowe i playlistę." : "Click an emotional entry point to reshape the visible sound documents and playlist.",
    pathKicker: isPl ? "Trzy rekomendowane wejścia" : "Three recommended entries",
    pathTitle: isPl ? "Teraz ścieżka słuchania" : "Now listening path",
    pathLead: isPl ? "Wybierz ścieżkę i otrzymaj trzy wejścia do dźwiękowego świata." : "Choose a path and receive three entry points into the sound world.",
    audioKicker: isPl ? "Kuratorowane playlisty" : "Curated playlists",
    audioTitle: "Emotional Playlist Room",
    audioLead: isPl ? "Zamiast profilu artysty i algorytmu, ta sekcja prowadzi przez ręcznie ustawione playlisty emocji." : "Instead of the artist profile and algorithm, this room leads through manually curated emotional playlists.",
    loadPlaylist: isPl ? "Załaduj playlistę Spotify" : "Load Spotify playlist",
    loaded: isPl ? "Playlista załadowana" : "Playlist loaded",
    privacy: isPl ? "Odtwarzacz Spotify ładuje się dopiero po kliknięciu." : "Spotify player loads only after your click.",
    openSpotify: isPl ? "Otwórz playlistę w Spotify" : "Open playlist on Spotify",
    platformsKicker: isPl ? "Platformy" : "Platforms",
    platformsTitle: isPl ? "Słuchaj na swojej platformie" : "Listen on your platform",
    platformsLead: isPl ? "Główne wejście na tej stronie prowadzi przez playlisty emocji. Pełniejszy katalog możesz otworzyć również na platformach poniżej." : "This page leads through emotional playlists first. The wider catalogue can also be opened on the platforms below.",
    timeKicker: isPl ? "Prowadzone słuchanie" : "Guided listening",
    timeTitle: isPl ? "Wybierz według czasu" : "Choose by time",
    timeLead: isPl ? "Wejdź w muzykę przez ilość uwagi, którą masz teraz — krótki impuls, skupioną ścieżkę albo pełny świat." : "Enter the music through the amount of attention you have now — a short spark, a focused path or the full world.",
    fiveTitle: isPl ? "Jeśli masz 5 minut" : "If you have 5 minutes",
    twentyTitle: isPl ? "Jeśli masz 20 minut" : "If you have 20 minutes",
    fullTitle: isPl ? "Jeśli chcesz pełny świat" : "If you want the full world",
    fiveText: isPl ? "Zacznij od jednego mocnego wejścia emocjonalnego i jednej bramy kontekstu." : "Start with one direct emotional entry and one context door.",
    twentyText: isPl ? "Przejdź krótką ścieżkę przez playlistę, muzykę, pamięć i obraz." : "Follow a compact path through playlist, music, memory and image.",
    fullText: isPl ? "Przejdź od dźwięku do Rap-Ort, SZTAB, kontekstu prasowego i użycia instytucjonalnego." : "Move from sound into Rap-Ort, SZTAB, press context and institutional use.",
    audienceKicker: isPl ? "Kto wchodzi?" : "Who is entering?",
    audienceTitle: isPl ? "Trzy sposoby użycia Sound Map" : "Three ways to use the Sound Map",
    audienceLead: isPl ? "Ta sama muzyka może działać inaczej dla słuchaczy, kuratorów i instytucji." : "The same music can work differently for listeners, curators and institutions.",
    listenerTitle: isPl ? "Dla słuchaczy" : "For listeners",
    curatorTitle: isPl ? "Dla kuratorów" : "For curators",
    institutionTitle: isPl ? "Dla instytucji" : "For institutions",
    listenerText: isPl ? "Zacznij od emocji i pozwól mapie poprowadzić Cię do świata." : "Start with emotion and let the map lead you toward a world.",
    curatorText: isPl ? "Zacznij od kontekstu, śladów zewnętrznych i ostrożnie opisanych zastosowań kulturalnych." : "Start with context, external traces and carefully described cultural use.",
    institutionText: isPl ? "Zacznij od pokazów, kontekstu edukacyjnego i formatów programowych." : "Start with screenings, educational context and programme formats.",
    explore: isPl ? "Zobacz" : "Explore",
    finalTitle: isPl ? "Kontynuuj z Dźwiękowej Mapy" : "Continue from the Sound Map",
    finalText: isPl ? "Przejdź od słuchania do światów, kontekstu albo współpracy." : "Move from listening into the worlds, context or collaboration.",
    enterRaport: isPl ? "Wejdź do Rap-Ort" : "Enter Rap-Ort",
    discoverSztab: isPl ? "Odkryj SZTAB" : "Discover SZTAB",
    contact: isPl ? "Kontakt" : "Contact",
    badge: isPl ? "Notka prasowa / kontekst" : "Press / context note",
    badgeText: isPl ? "Wzmianka zewnętrzna opisana ostrożnie — nie oznacza rekomendacji." : "External mention documented carefully — not an endorsement.",
  };

  const paths = {
    memory: ["SZTAB — Raport z Pamięci", "Kurier Prawdy", "Rap-Ort / Prawda Sumienia"],
    conscience: ["LUSTRO / THE MIRROR", "Rap-Ort", "Kurier Prawdy"],
    resistance: ["Unbroken", "SZTAB", "Zo / SZTAB ORIGINS"],
    identity: ["LUSTRO / THE MIRROR", "Campus Ignis", isPl ? "Między Wierszami" : "Between the Lines"],
    resilience: ["Unbroken", "Equilibrium", "SZTAB"],
    personal: ["Equilibrium", "Campus Ignis", "Unbroken"],
  };

  const recommendationLinks = {
    "SZTAB — Raport z Pamięci": "/sztab/raport-z-pamieci/",
    "Kurier Prawdy": isPl ? "/press-recognition/pl/" : "/press-recognition/",
    "Rap-Ort / Prawda Sumienia": isPl ? "/rap-ort/prawda-sumienia/pl/" : "/rap-ort/prawda-sumienia/",
    "Rap-Ort": isPl ? "/rap-ort/pl/" : "/rap-ort/",
    "SZTAB": isPl ? "/sztab/pl/" : "/sztab/",
    "Zo / SZTAB ORIGINS": isPl ? "/sztab/origins/pl/" : "/sztab/origins/",
    "Między Wierszami": "/miedzy-wierszami/",
    "Between the Lines": "/between-the-lines/",
  };

  const emotionMap = [
    { test: /raport z pamięci/i, value: "memory resistance resilience" },
    { test: /kurier prawdy/i, value: "memory conscience resistance" },
    { test: /lustro|mirror/i, value: "conscience identity personal" },
    { test: /unbroken/i, value: "resistance resilience personal" },
    { test: /campus ignis/i, value: "identity resilience conscience personal" },
    { test: /equilibrium/i, value: "resilience identity personal" },
  ];

  const hashAliases = { all: "all", memory: "memory", pamiec: "memory", "pamięć": "memory", conscience: "conscience", sumienie: "conscience", resistance: "resistance", opor: "resistance", "opór": "resistance", identity: "identity", tozsamosc: "identity", "tożsamość": "identity", resilience: "resilience", resilence: "resilience", odpornosc: "resilience", "odporność": "resilience", personal: "personal", osobiste: "personal", cinematic: "personal", filmowe: "personal" };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const normalise = (value) => String(value || "").trim().toLowerCase();
  const hashToKey = (hash) => hashAliases[normalise(String(hash || "").replace(/^#/, ""))] || null;
  const featuredSection = () => $$(".vh-section").find((s) => /Selected sound documents|Dokumenty dźwiękowe/i.test(s.textContent || ""));
  const collaborationSection = () => $$(".vh-section").find((s) => /Music use \/ collaboration|Wykorzystanie muzyki \/ współpraca/i.test(s.textContent || ""));

  function injectStyles() {
    if ($("#musicPlaylistRoomStyles")) return;
    const style = document.createElement("style");
    style.id = "musicPlaylistRoomStyles";
    style.textContent = `
      body.page-music .playlist-selector{display:flex;flex-wrap:wrap;gap:10px;margin:1.2rem 0 1rem}
      body.page-music .playlist-btn,body.page-music .sound-control{min-height:40px;border:1px solid rgba(201,178,143,.24);border-radius:999px;background:rgba(255,255,255,.035);color:rgba(241,234,219,.78);padding:0 14px;text-transform:uppercase;letter-spacing:.09em;font-size:.68rem;cursor:pointer;transition:transform .22s ease,border-color .22s ease,background .22s ease,color .22s ease,box-shadow .22s ease}
      body.page-music .playlist-btn:hover,body.page-music .playlist-btn:focus-visible,body.page-music .playlist-btn.is-active,body.page-music .sound-control:hover,body.page-music .sound-control:focus-visible,body.page-music .sound-control.is-active{color:#f1eadb;border-color:rgba(201,178,143,.52);background:rgba(201,178,143,.12);box-shadow:0 0 2rem rgba(201,178,143,.08);transform:translateY(-2px);outline:none}
      body.page-music .playlist-room-panel{border:1px solid rgba(201,178,143,.18);border-radius:24px;padding:clamp(1.1rem,2.4vw,1.8rem);background:linear-gradient(145deg,rgba(255,255,255,.052),rgba(255,255,255,.014));box-shadow:0 1.8rem 5rem rgba(0,0,0,.24)}
      body.page-music .playlist-room-panel h3{font-family:"Cormorant Garamond",serif;font-size:clamp(2rem,3vw,3rem);line-height:.95;margin:.4rem 0 .7rem}
      body.page-music .playlist-room-panel p{color:rgba(241,234,219,.72);line-height:1.72}
      body.page-music .playlist-actions{display:flex;flex-wrap:wrap;gap:10px;margin:1rem 0}
      body.page-music .lazy-embed{min-height:120px;display:flex;align-items:center;justify-content:center;border:1px dashed rgba(201,178,143,.28);border-radius:18px;margin:1rem 0;background:rgba(5,4,3,.36);color:rgba(201,178,143,.78);letter-spacing:.14em;text-transform:uppercase}.lazy-embed iframe{border-radius:18px;display:block;width:100%;min-height:352px}
      body.page-music .embed-privacy-note{margin:.25rem 0 1rem;color:rgba(201,178,143,.72);font-size:.78rem;line-height:1.55;letter-spacing:.07em;text-transform:uppercase}
      body.page-music .platform-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:1.2rem}.platform-link{border:1px solid rgba(201,178,143,.20);border-radius:18px;padding:15px 14px;text-align:center;background:rgba(255,255,255,.025);color:rgba(241,234,219,.82);text-decoration:none;text-transform:uppercase;letter-spacing:.08em;font-size:.72rem}.platform-link:hover,.platform-link:focus-visible{border-color:rgba(201,178,143,.52);background:rgba(201,178,143,.10);outline:none}
      body.page-music .guided-journey-grid,body.page-music .audience-path-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1rem,2vw,1.4rem);margin-top:1.4rem}.guided-journey-card,.audience-path-card,.music-final-ribbon{position:relative;overflow:hidden;isolation:isolate;border:1px solid rgba(201,178,143,.18);border-radius:24px;padding:clamp(1.1rem,2.4vw,1.75rem);background:linear-gradient(145deg,rgba(255,255,255,.052),rgba(255,255,255,.014));box-shadow:0 1.6rem 4.8rem rgba(0,0,0,.24)}.guided-journey-card h3,.audience-path-card h3{margin:0 0 .65rem;font-family:"Cormorant Garamond",serif;font-size:clamp(1.8rem,2.4vw,2.7rem);line-height:.95}.guided-journey-card p,.audience-path-card p{color:rgba(241,234,219,.72);line-height:1.72}.time-badge{display:inline-flex;align-items:center;min-height:28px;border:1px solid rgba(201,178,143,.25);border-radius:999px;padding:0 10px;margin-bottom:1rem;background:rgba(201,178,143,.08);color:rgba(201,178,143,.86);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase}.guided-journey-card ol{margin:1rem 0 0;padding:0;list-style:none;display:grid;gap:.55rem}.guided-journey-card li{display:flex;gap:.55rem;align-items:flex-start;color:rgba(241,234,219,.78);line-height:1.45}.guided-journey-card li span{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(201,178,143,.12);color:rgba(201,178,143,.9);font-size:.7rem;flex:0 0 auto}
      body.page-music .now-listening-output{display:grid;gap:12px;margin:1rem 0 0;padding:0;list-style:none}.now-listening-output li{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:12px;align-items:center;border:1px solid rgba(201,178,143,.18);border-radius:18px;padding:14px 16px;background:rgba(255,255,255,.028)}.now-listening-output li span{width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(201,178,143,.12);color:rgba(201,178,143,.9)}.now-listening-output strong{display:block;color:#f1eadb;font-family:"Cormorant Garamond",serif;font-size:1.35rem}.now-listening-output small{display:block;color:rgba(241,234,219,.62);line-height:1.45}.now-listening-output a{border:1px solid rgba(201,178,143,.24);border-radius:999px;padding:8px 12px;color:rgba(201,178,143,.92);text-decoration:none;text-transform:uppercase;letter-spacing:.08em;font-size:.68rem}
      body.page-music .track-document.is-filtered-out{display:none!important}.press-context-badge{display:block;margin-top:1rem;border:1px solid rgba(201,178,143,.28);border-radius:18px;padding:12px 14px;background:rgba(201,178,143,.08);color:rgba(241,234,219,.78);text-decoration:none;line-height:1.55}.press-context-badge strong{display:block;color:#f1eadb;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.25rem}.press-context-badge span{font-size:.9rem;color:rgba(241,234,219,.68)}
      @media(max-width:900px){body.page-music .guided-journey-grid,body.page-music .audience-path-grid,body.page-music .platform-grid{grid-template-columns:1fr}}@media(max-width:680px){body.page-music .now-listening-output li{grid-template-columns:30px minmax(0,1fr)}body.page-music .now-listening-output li a{grid-column:2/-1;justify-self:start}.playlist-btn,.sound-control{width:100%}}
      @media(prefers-reduced-motion:reduce){.playlist-btn,.sound-control,.guided-journey-card,.audience-path-card{transition:none!important;transform:none!important}}body.reduce-motion.page-music .playlist-btn,body.reduced-motion.page-music .playlist-btn,body.reduce-motion.page-music .sound-control,body.reduced-motion.page-music .sound-control{transition:none!important;transform:none!important}
    `;
    document.head.appendChild(style);
  }

  function labelFor(key) { return playlistData[key]?.label || playlistData.memory.label; }

  function markTrackCards() {
    $$(".track-document").forEach((card, index) => {
      const title = $("h3", card)?.textContent || "";
      const match = emotionMap.find((item) => item.test.test(title));
      card.dataset.emotions = match?.value || "memory conscience";
      card.classList.add("has-waveform");
      const row = $(".status-row", card) || document.createElement("div");
      row.className = "status-row";
      if (!$(".status-badge[data-vh-snd]", row)) {
        const badge = document.createElement("span");
        badge.className = "status-badge is-muted";
        badge.dataset.vhSnd = "true";
        badge.textContent = `VH-SND-${String(index + 1).padStart(2, "0")}`;
        row.prepend(badge);
        if (!$(".status-row", card)) card.prepend(row);
      }
      if (/kurier prawdy/i.test(title) && !$(".press-context-badge", card)) {
        const badge = document.createElement("a");
        badge.className = "press-context-badge";
        badge.href = isPl ? "/press-recognition/pl/" : "/press-recognition/";
        badge.innerHTML = `<strong>${t.badge}</strong><span>${t.badgeText}</span>`;
        card.appendChild(badge);
      }
    });
  }

  function button(label, key, attr) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = attr === "playlistKey" ? "playlist-btn" : "sound-control";
    btn.textContent = label;
    btn.dataset[attr] = key;
    btn.setAttribute("aria-pressed", "false");
    return btn;
  }

  function createAudioRoom() {
    if ($("[data-audio-room]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-wow-section audio-room-section";
    section.dataset.audioRoom = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.audioKicker}</p><h2 class="vh-section-title">${t.audioTitle}</h2><p class="vh-section-kicker">${t.audioLead}</p></div><div class="playlist-selector" data-playlist-selector></div><article class="playlist-room-panel" data-playlist-panel><p class="embed-privacy-note">${t.privacy}</p><h3 data-playlist-title></h3><p data-playlist-description></p><div class="playlist-actions"><button class="vh-button secondary" type="button" data-load-playlist>${t.loadPlaylist}</button><a class="vh-button secondary" data-playlist-open target="_blank" rel="noopener noreferrer">${t.openSpotify}</a></div><div class="lazy-embed" id="spotifyPlaylistRoom"><span>Spotify</span></div></article></div>`;
    const selector = $("[data-playlist-selector]", section);
    Object.entries(playlistData).forEach(([key, data]) => selector.appendChild(button(data.label, key, "playlistKey")));
    $(".sound-map-orbit")?.closest(".vh-section")?.after(section);
  }

  function createFilterSection() {
    if ($("[data-music-emotion-filter]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-wow-section";
    section.dataset.musicEmotionFilter = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.filterKicker}</p><h2 class="vh-section-title">${t.filterTitle}</h2><p class="vh-section-kicker">${t.filterLead}</p></div><div class="sound-control-panel" data-emotion-controls></div><p class="sound-filter-status" data-emotion-status aria-live="polite"></p></div>`;
    const controls = $("[data-emotion-controls]", section);
    [[t.all, "all"], ...Object.entries(playlistData).map(([key, data]) => [data.label, key])].forEach(([label, key]) => controls.appendChild(button(label, key, "emotionFilter")));
    featuredSection()?.before(section);
  }

  function createListeningPathSection() {
    if ($("[data-now-listening]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-wow-section";
    section.dataset.nowListening = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="sound-map-orbit reveal visible"><div class="vh-section-head"><p class="vh-eyebrow">${t.pathKicker}</p><h2 class="vh-section-title">${t.pathTitle}</h2><p class="vh-section-kicker">${t.pathLead}</p></div><div class="sound-control-panel" data-path-controls></div><ol class="now-listening-output" data-now-listening-output></ol></div></div>`;
    const controls = $("[data-path-controls]", section);
    Object.entries(playlistData).forEach(([key, data]) => controls.appendChild(button(data.label, key, "listeningPath")));
    featuredSection()?.before(section);
  }

  function createTimeJourneySection() {
    if ($("[data-time-journey]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-guided-section";
    section.dataset.timeJourney = "true";
    const lists = isPl ? [["05", t.fiveTitle, t.fiveText, ["Personal / Cinematic", "LUSTRO / THE MIRROR", "Press / Recognition"]], ["20", t.twentyTitle, t.twentyText, ["Emotional Playlist Room", "Rap-Ort", "SZTAB"]], ["∞", t.fullTitle, t.fullText, ["Rap-Ort", "SZTAB", "Dla instytucji"]]] : [["05", t.fiveTitle, t.fiveText, ["Personal / Cinematic", "LUSTRO / THE MIRROR", "Press / Recognition"]], ["20", t.twentyTitle, t.twentyText, ["Emotional Playlist Room", "Rap-Ort", "SZTAB"]], ["∞", t.fullTitle, t.fullText, ["Rap-Ort", "SZTAB", "For Institutions"]]];
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.timeKicker}</p><h2 class="vh-section-title">${t.timeTitle}</h2><p class="vh-section-kicker">${t.timeLead}</p></div><div class="guided-journey-grid">${lists.map(([b, h, p, items]) => `<article class="guided-journey-card"><span class="time-badge">${b}</span><h3>${h}</h3><p>${p}</p><ol>${items.map((item, i) => `<li><span>${i + 1}</span>${item}</li>`).join("")}</ol></article>`).join("")}</div></div>`;
    $("[data-audio-room]")?.after(section);
  }

  function createAudienceSection() {
    if ($("[data-audience-paths]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-guided-section";
    section.dataset.audiencePaths = "true";
    const cards = [[t.listenerTitle, t.listenerText, isPl ? "/music/pl/#personal" : "/music/#personal"], [t.curatorTitle, t.curatorText, isPl ? "/press-recognition/pl/" : "/press-recognition/"], [t.institutionTitle, t.institutionText, isPl ? "/for-institutions/pl/" : "/for-institutions/"]];
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.audienceKicker}</p><h2 class="vh-section-title">${t.audienceTitle}</h2><p class="vh-section-kicker">${t.audienceLead}</p></div><div class="audience-path-grid">${cards.map(([h, p, href]) => `<article class="audience-path-card"><h3>${h}</h3><p>${p}</p><a class="vh-button secondary" href="${href}">${t.explore}</a></article>`).join("")}</div></div>`;
    collaborationSection()?.before(section);
  }

  function createPlatformsSection() {
    if ($("[data-platform-links]")) return;
    const section = document.createElement("section");
    section.className = "vh-section";
    section.dataset.platformLinks = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="music-final-ribbon reveal visible"><p class="vh-eyebrow">${t.platformsKicker}</p><h2 class="vh-section-title">${t.platformsTitle}</h2><p>${t.platformsLead}</p><div class="platform-grid">${platforms.map(([label, href]) => `<a class="platform-link" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`).join("")}</div></div></div>`;
    collaborationSection()?.after(section);
  }

  function createFinalRibbon() {
    if ($("[data-music-final-ribbon]")) return;
    const section = document.createElement("section");
    section.className = "vh-section";
    section.dataset.musicFinalRibbon = "true";
    const links = isPl ? [[t.enterRaport, "/rap-ort/pl/"], [t.discoverSztab, "/sztab/pl/"], [t.contact, "/contact/pl/"]] : [[t.enterRaport, "/rap-ort/"], [t.discoverSztab, "/sztab/"], [t.contact, "/contact/"]];
    section.innerHTML = `<div class="vh-wrap"><div class="music-final-ribbon reveal visible"><p class="vh-eyebrow">Sound Map</p><h2 class="vh-section-title">${t.finalTitle}</h2><p>${t.finalText}</p><div class="vh-actions">${links.map(([label, href]) => `<a class="vh-button secondary" href="${href}">${label}</a>`).join("")}</div></div></div>`;
    createPlatformsSection();
    $("[data-platform-links]")?.after(section);
  }

  function recommendationsFor(key) {
    return (paths[key] || paths.memory).map((title) => ({ title, href: recommendationLinks[title] || (isPl ? `/music/pl/#${key}` : `/music/#${key}`) }));
  }

  function setPlaylist(key, options = {}) {
    const actualKey = playlistData[key] ? key : "memory";
    const data = playlistData[actualKey];
    $$("[data-playlist-key]").forEach((btn) => {
      const active = btn.dataset.playlistKey === actualKey;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    const title = $("[data-playlist-title]");
    const description = $("[data-playlist-description]");
    const open = $("[data-playlist-open]");
    const embed = $("#spotifyPlaylistRoom");
    const loadBtn = $("[data-load-playlist]");
    if (title) title.textContent = data.label;
    if (description) description.textContent = data.description;
    if (open) open.href = data.url;
    if (embed) { embed.dataset.loaded = "false"; embed.innerHTML = "<span>Spotify</span>"; }
    if (loadBtn) { loadBtn.disabled = false; loadBtn.textContent = t.loadPlaylist; loadBtn.dataset.playlist = actualKey; }
    if (options.updateHash && actualKey !== "all") history.replaceState(null, "", `#${actualKey}`);
  }

  function setEmotionFilter(value, options = {}) {
    const filter = normalise(value || "all");
    const cards = $$(".track-document[data-emotions]");
    const buttons = $$("[data-emotion-filter]");
    const status = $("[data-emotion-status]");
    let visible = 0;
    buttons.forEach((button) => { const active = normalise(button.dataset.emotionFilter) === filter; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    cards.forEach((card) => { const emotions = normalise(card.dataset.emotions).split(/\s+/).filter(Boolean); const show = filter === "all" || emotions.includes(filter); card.classList.toggle("is-filtered-out", !show); card.hidden = !show; if (show) visible += 1; });
    if (status) status.textContent = visible ? `${t.showing}: ${filter === "all" ? t.all : labelFor(filter)}` : t.empty;
    if (filter !== "all") setPlaylist(filter, { updateHash: options.updateHash });
    if (options.updateHash && filter === "all" && location.hash) history.replaceState(null, "", location.pathname);
  }

  function setListeningPath(value) {
    const key = playlistData[value] ? value : "memory";
    $$("[data-listening-path]").forEach((button) => { const active = button.dataset.listeningPath === key; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    const output = $("[data-now-listening-output]");
    if (output) output.innerHTML = recommendationsFor(key).map((item, index) => `<li><span>${index + 1}</span><div><strong>${item.title}</strong><small>${playlistData[key].description}</small></div><a href="${item.href}">${t.explore}</a></li>`).join("");
  }

  function loadPlaylist() {
    const btn = $("[data-load-playlist]");
    const key = btn?.dataset.playlist || "memory";
    const data = playlistData[key] || playlistData.memory;
    const target = $("#spotifyPlaylistRoom");
    if (!target || target.dataset.loaded === "true") return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/playlist/${data.id}?utm_source=generator`;
    iframe.title = `Spotify playlist — ${data.label}`;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.style.border = "0";
    iframe.width = "100%";
    iframe.height = "352";
    target.replaceChildren(iframe);
    target.dataset.loaded = "true";
    if (btn) { btn.textContent = t.loaded; btn.disabled = true; }
  }

  document.addEventListener("click", (event) => {
    const emotion = event.target.closest("[data-emotion-filter]");
    if (emotion) { const key = emotion.dataset.emotionFilter; setEmotionFilter(key, { updateHash: true }); if (key !== "all") setListeningPath(key); return; }
    const path = event.target.closest("[data-listening-path]");
    if (path) { const key = path.dataset.listeningPath; setListeningPath(key); setEmotionFilter(key, { updateHash: true }); return; }
    const playlist = event.target.closest("[data-playlist-key]");
    if (playlist) { const key = playlist.dataset.playlistKey; setPlaylist(key, { updateHash: true }); setEmotionFilter(key); setListeningPath(key); return; }
    if (event.target.closest("[data-load-playlist]")) loadPlaylist();
  });

  injectStyles();
  markTrackCards();
  createAudioRoom();
  createTimeJourneySection();
  createFilterSection();
  createListeningPathSection();
  createAudienceSection();
  createPlatformsSection();
  createFinalRibbon();

  const initial = hashToKey(location.hash) || "personal";
  setPlaylist(initial === "all" ? "personal" : initial);
  setEmotionFilter(initial);
  setListeningPath(initial === "all" ? "personal" : initial);
  window.addEventListener("hashchange", () => { const key = hashToKey(location.hash) || "personal"; setPlaylist(key); setEmotionFilter(key); setListeningPath(key); });
})();
