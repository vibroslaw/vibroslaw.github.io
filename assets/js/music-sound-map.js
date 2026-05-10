(() => {
  "use strict";

  const root = document.querySelector("body.page-music");
  if (!root || window.__veritasMusicSoundMap) return;
  window.__veritasMusicSoundMap = true;
  root.classList.add("music-experience-polished", "music-visual-wow-layer");

  function ensureExperienceStyles() {
    const href = "/assets/css/music-experience-polish.css";
    if (document.querySelector(`link[href=\"${href}\"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.musicExperiencePolish = "true";
    document.head.appendChild(link);
  }

  ensureExperienceStyles();

  const lang = root.dataset.lang === "pl" ? "pl" : "en";
  const isPl = lang === "pl";
  const spotifyArtist = "https://open.spotify.com/artist/0df87MMIM1VOy2dR1DM2oF";
  const musicPath = isPl ? "/music/pl/" : "/music/";

  const playlist = {
    memory: {
      code: "VH-EMO-01",
      label: isPl ? "Pamięć" : "Memory",
      id: "0xv8YgWzwwY7VtER506P1Z",
      url: "https://open.spotify.com/playlist/0xv8YgWzwwY7VtER506P1Z?si=gyPJNvRvThm_pXuQiJyMqg",
      image: "/public/assets/music/playlists/memory-window.webp",
      description: isPl ? "Świadectwo, pamięć, historia i echo tego, co zostaje po spotkaniu z prawdą." : "Witness, memory, history and the echo of what remains after encountering truth.",
      first: "Kurier Prawdy",
      relatedLabel: "SZTAB",
      relatedHref: isPl ? "/sztab/pl/" : "/sztab/",
    },
    conscience: {
      code: "VH-EMO-02",
      label: isPl ? "Sumienie" : "Conscience",
      id: "46B6jvmQkPM33LV28w4UvV",
      url: "https://open.spotify.com/playlist/46B6jvmQkPM33LV28w4UvV?si=aiEvJgP0QGOxfcpGYJ-XYw",
      image: "/public/assets/music/playlists/conscience-window.webp",
      description: isPl ? "Prawda, wybór, presja moralna i pytanie, które zostaje z odbiorcą." : "Truth, choice, moral pressure and the question that remains with the listener.",
      first: "Rap-Ort",
      relatedLabel: "Rap-Ort",
      relatedHref: isPl ? "/rap-ort/pl/" : "/rap-ort/",
    },
    resistance: {
      code: "VH-EMO-03",
      label: isPl ? "Opór" : "Resistance",
      id: "6R2zp276q7G9z9IJZMWxqU",
      url: "https://open.spotify.com/playlist/6R2zp276q7G9z9IJZMWxqU?si=oJgjHDBlTIqMh1OYJjehIQ",
      image: "/public/assets/music/playlists/resistance-window.webp",
      description: isPl ? "Siła, odmowa, przetrwanie i energia, która nie pozwala zamilknąć." : "Strength, refusal, survival and the energy that refuses to disappear.",
      first: "Unbroken",
      relatedLabel: "SZTAB ORIGINS",
      relatedHref: isPl ? "/sztab/origins/pl/" : "/sztab/origins/",
    },
    identity: {
      code: "VH-EMO-04",
      label: isPl ? "Tożsamość" : "Identity",
      id: "4Ml3373UqCDgQEdr0m6SoH",
      url: "https://open.spotify.com/playlist/4Ml3373UqCDgQEdr0m6SoH?si=NmS1kFpkSMS80Y0dhYLW-g",
      image: "/public/assets/music/playlists/identity-window.webp",
      description: isPl ? "Odbicie, język, przynależność, wewnętrzny konflikt i szukanie siebie." : "Reflection, language, belonging, inner conflict and the search for self.",
      first: "LUSTRO / THE MIRROR",
      relatedLabel: isPl ? "Między Wierszami" : "Between the Lines",
      relatedHref: isPl ? "/miedzy-wierszami/" : "/between-the-lines/",
    },
    resilience: {
      code: "VH-EMO-05",
      label: isPl ? "Odporność" : "Resilience",
      id: "6FNzNCjmvmGwpibLLDNufr",
      url: "https://open.spotify.com/playlist/6FNzNCjmvmGwpibLLDNufr?si=5lcht8ixTKetPM94XKzeZw",
      image: "/public/assets/music/playlists/resilience-window.webp",
      description: isPl ? "Wytrwałość, odbudowa, wewnętrzny ogień i powrót po doświadczeniu ciężaru." : "Endurance, rebuilding, inner fire and return after carrying weight.",
      first: "Equilibrium",
      relatedLabel: "UNBROKEN",
      relatedHref: "https://youtube.com/playlist?list=OLAK5uy_n3NC_O5G2d5IMF20tF8_QnXDX3GDxFJv8&si=rPcdlKWdCBG1VuMc",
    },
    personal: {
      code: "VH-EMO-06",
      label: isPl ? "Osobiste / filmowe" : "Personal / Cinematic",
      id: "6FNzNCjmvmGwpibLLDNufr",
      url: "https://open.spotify.com/playlist/6FNzNCjmvmGwpibLLDNufr?si=5lcht8ixTKetPM94XKzeZw",
      image: "/public/assets/music/playlists/personal-cinematic-window.webp",
      description: isPl ? "Lżejsze, filmowe wejście w emocję, klimat i osobistą stronę twórczości." : "A lighter cinematic entry into emotion, atmosphere and the personal side of the work.",
      first: "Campus Ignis",
      relatedLabel: isPl ? "Kontakt" : "Contact",
      relatedHref: isPl ? "/contact/pl/" : "/contact/",
    },
  };

  const order = ["memory", "conscience", "resistance", "identity", "resilience", "personal"];
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const normalize = (value) => String(value || "").trim().toLowerCase();
  const keyFromHash = (hash) => ({ pamiec: "memory", "pamięć": "memory", memory: "memory", sumienie: "conscience", conscience: "conscience", opor: "resistance", "opór": "resistance", resistance: "resistance", tozsamosc: "identity", "tożsamość": "identity", identity: "identity", odpornosc: "resilience", "odporność": "resilience", resilence: "resilience", resilience: "resilience", osobiste: "personal", filmowe: "personal", cinematic: "personal", personal: "personal" })[normalize(String(hash || "").replace(/^#/, ""))] || null;
  const featuredSection = () => $$(".vh-section").find((s) => /Selected sound documents|Dokumenty dźwiękowe/i.test(s.textContent || ""));
  const collaborationSection = () => $$(".vh-section").find((s) => /Music use \/ collaboration|Wykorzystanie muzyki \/ współpraca/i.test(s.textContent || ""));

  const text = {
    showing: isPl ? "Pokazuję" : "Showing",
    filterKicker: isPl ? "Wybierz emocję" : "Choose an emotion",
    filterTitle: isPl ? "Interaktywny filtr emocji" : "Interactive emotional filter",
    filterLead: isPl ? "Kliknij emocjonalne wejście, aby zmienić widoczne dokumenty dźwiękowe, playlistę i ścieżkę." : "Click an emotional entry point to reshape the visible sound documents, playlist and path.",
    pathKicker: isPl ? "Trzy rekomendowane wejścia" : "Three recommended entries",
    pathTitle: isPl ? "Teraz ścieżka słuchania" : "Now listening path",
    pathLead: isPl ? "Wybierz ścieżkę i otrzymaj trzy wejścia do dźwiękowego świata." : "Choose a path and receive three entry points into the sound world.",
    audioKicker: isPl ? "Kuratorowane playlisty" : "Curated playlists",
    audioTitle: "Emotional Playlist Room",
    audioLead: isPl ? "Dźwięk nie zaczyna się od gatunku. Zaczyna się od emocji, przez którą wchodzisz." : "The sound does not begin with genre. It begins with the emotional door you choose.",
    loadPlaylist: isPl ? "Załaduj playlistę Spotify" : "Load Spotify playlist",
    loading: isPl ? "Ładowanie playlisty…" : "Loading playlist…",
    loaded: isPl ? "Playlista załadowana" : "Playlist loaded",
    privacy: isPl ? "Odtwarzacz Spotify ładuje się dopiero po kliknięciu." : "Spotify player loads only after your click.",
    openSpotify: isPl ? "Otwórz playlistę w Spotify" : "Open playlist on Spotify",
    copyPath: isPl ? "Kopiuj ścieżkę" : "Copy path",
    copied: isPl ? "Skopiowano" : "Copied",
    recommended: isPl ? "Polecane pierwsze wejście" : "Recommended first listen",
    related: isPl ? "Wejdź w powiązany świat" : "Enter related world",
    albumsKicker: isPl ? "Albumy" : "Albums",
    albumsTitle: isPl ? "Wejścia do albumów muzycznych" : "Music album entry points",
    albumsLead: isPl ? "Playlisty emocji prowadzą przez nastrój. Albumy prowadzą przez pełniejsze światy muzyczne — polskie i anglojęzyczne." : "Emotional playlists lead by mood. Albums lead into fuller music worlds — Polish and English-language.",
    openYoutube: isPl ? "Otwórz na YouTube" : "Open on YouTube",
    timeKicker: isPl ? "Prowadzone słuchanie" : "Guided listening",
    timeTitle: isPl ? "Wybierz według czasu" : "Choose by time",
    timeLead: isPl ? "Wejdź w muzykę przez ilość uwagi, którą masz teraz — krótki impuls, skupioną ścieżkę albo pełny świat." : "Enter the music through the amount of attention you have now — a short spark, a focused path or the full world.",
    audienceKicker: isPl ? "Kto wchodzi?" : "Who is entering?",
    audienceTitle: isPl ? "Trzy sposoby użycia Sound Map" : "Three ways to use the Sound Map",
    audienceLead: isPl ? "Ta sama muzyka może działać inaczej dla słuchaczy, kuratorów i instytucji." : "The same music can work differently for listeners, curators and institutions.",
    platformsKicker: isPl ? "Platformy" : "Platforms",
    platformsTitle: isPl ? "Słuchaj na swojej platformie" : "Listen on your platform",
    platformsLead: isPl ? "Główne wejście na tej stronie prowadzi przez playlisty emocji. Pełniejszy katalog możesz otworzyć również na platformach poniżej." : "This page leads through emotional playlists first. The wider catalogue can also be opened on the platforms below.",
    finalTitle: isPl ? "Kontynuuj z Dźwiękowej Mapy" : "Continue from the Sound Map",
    finalText: isPl ? "Przejdź od słuchania do światów, kontekstu albo współpracy." : "Move from listening into the worlds, context or collaboration.",
    explore: isPl ? "Zobacz" : "Explore",
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
  const recs = {
    memory: ["SZTAB — Raport z Pamięci", "Kurier Prawdy", "Rap-Ort / Prawda Sumienia"],
    conscience: ["LUSTRO / THE MIRROR", "Rap-Ort", "Kurier Prawdy"],
    resistance: ["Unbroken", "SZTAB", "Zo / SZTAB ORIGINS"],
    identity: ["LUSTRO / THE MIRROR", "Campus Ignis", isPl ? "Między Wierszami" : "Between the Lines"],
    resilience: ["Unbroken", "Equilibrium", "SZTAB"],
    personal: ["Equilibrium", "Campus Ignis", "Unbroken"],
  };

  const albums = [
    [isPl ? "Polskie albumy muzyczne" : "Polish music albums", isPl ? "Dwa główne polskie wejścia albumowe w świat pamięci, świadectwa i autorskiej narracji." : "Two core Polish album entries into memory, testimony and authorial narrative.", [
      ["VH-ALB-01", "SZTAB — Raport z Pamięci", isPl ? "album muzyczny / świat SZTAB" : "music album / SZTAB world", isPl ? "Albumowy fundament świata SZTAB — pamięć, postacie i energia krótkich form historycznych." : "The album foundation of the SZTAB world — memory, figures and the energy of short historical forms.", "https://youtube.com/playlist?list=OLAK5uy_n4HwvBGKMhwr94yRn60j_uM3JZjE43Rf4&si=UTEiUBph7jwLh-e_", "/public/assets/music/albums/sztab-raport-z-pamieci.webp"],
      ["VH-ALB-02", "Rap-Ort: Prawda Sumienia", isPl ? "album muzyczny / świat Rap-Ort" : "music album / Rap-Ort world", isPl ? "Główne muzyczne wejście w świat Rap-Ort: pamięć, raport, decyzja i odpowiedzialność." : "The main musical entry into Rap-Ort: memory, report, decision and responsibility.", "https://youtube.com/playlist?list=PLa1mFnbfhev615wCW-3Bi8Fz1kE0Maksq&si=BxyIIHrXvSddcRWS", "/public/assets/music/albums/rap-ort-prawda-sumienia.webp"],
    ]],
    [isPl ? "Anglojęzyczne albumy muzyczne" : "English-language music albums", isPl ? "Osobne anglojęzyczne wejścia w odporność, energię, filmowy klimat i bardziej popkulturowe napięcie." : "Separate English-language entries into resilience, energy, cinematic atmosphere and pop-cultural tension.", [
      ["VH-ALB-03", "UNBROKEN", isPl ? "album anglojęzyczny / odporność" : "English-language album / resilience", isPl ? "Wejście w siłę, przetrwanie, podnoszenie się i emocjonalną wytrwałość." : "An entry into strength, survival, rebuilding and emotional endurance.", "https://youtube.com/playlist?list=OLAK5uy_n3NC_O5G2d5IMF20tF8_QnXDX3GDxFJv8&si=rPcdlKWdCBG1VuMc", "/public/assets/music/albums/unbroken.webp"],
      ["VH-ALB-04", "VHS: Viral Halloween System", isPl ? "album anglojęzyczny / energia i system" : "English-language album / energy and system", isPl ? "Bardziej dynamiczne, popkulturowe i mroczniejsze wejście w świat dźwięku Vibrosława." : "A more dynamic, pop-cultural and darker entry into Vibrosław’s sound world.", "https://youtube.com/playlist?list=PLa1mFnbfhev4PV6x8EuNI_suNl75qjrXZ&si=1mb_wNaU5RUJCKy6", "/public/assets/music/albums/vhs-viral-halloween-system.webp"],
    ]],
  ];

  const platformLinks = [["YouTube", "https://www.youtube.com/@VIBROS%C5%81AW"], ["Spotify", spotifyArtist], ["TIDAL", "https://tidal.com/artist/64846539"], ["Qobuz", "https://www.qobuz.com/ie-en/interpreter/vibrosaw/28032763"], ["Amazon Music", "https://music.amazon.com/artists/B0FL7G4Z7J/vibros%25C5%2582aw?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_l71YflSsnpFEp72kXFRNRSkRW"]];
  const emotionMap = [[/raport z pamięci/i, "memory resistance resilience"], [/kurier prawdy/i, "memory conscience resistance"], [/lustro|mirror/i, "conscience identity personal"], [/unbroken/i, "resistance resilience personal"], [/campus ignis/i, "identity resilience conscience personal"], [/equilibrium/i, "resilience identity personal"]];

  function createButton(label, key, attr, className = "sound-control") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.dataset[attr] = key;
    button.setAttribute("aria-pressed", "false");
    return button;
  }

  function createMiniNav() {
    if ($("[data-music-mini-nav]")) return;
    const nav = document.createElement("nav");
    nav.className = "music-mini-nav";
    nav.dataset.musicMiniNav = "true";
    nav.setAttribute("aria-label", isPl ? "Nawigacja strony muzyki" : "Music page navigation");
    const labels = isPl ? [["Playlisty", "#playlists"], ["Albumy", "#albums"], ["Ścieżki", "#paths"], ["Dokumenty", "#documents"], ["Platformy", "#platforms"]] : [["Playlists", "#playlists"], ["Albums", "#albums"], ["Paths", "#paths"], ["Documents", "#documents"], ["Platforms", "#platforms"]];
    nav.innerHTML = `<div class="vh-wrap music-mini-nav-inner">${labels.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</div>`;
    document.querySelector(".vh-hero")?.after(nav);
  }

  function markTracks() {
    $$(".track-document").forEach((card, index) => {
      const title = $("h3", card)?.textContent || "";
      card.dataset.emotions = emotionMap.find(([rx]) => rx.test(title))?.[1] || "memory conscience";
      card.classList.add("has-waveform");
      let row = $(".status-row", card);
      if (!row) { row = document.createElement("div"); row.className = "status-row"; card.prepend(row); }
      if (!$('[data-vh-snd]', row)) { const b = document.createElement("span"); b.className = "status-badge is-muted"; b.dataset.vhSnd = "true"; b.textContent = `VH-SND-${String(index + 1).padStart(2, "0")}`; row.prepend(b); }
      if (/kurier prawdy/i.test(title) && !$(".press-context-badge", card)) { const a = document.createElement("a"); a.className = "press-context-badge"; a.href = isPl ? "/press-recognition/pl/" : "/press-recognition/"; a.innerHTML = `<strong>${isPl ? "Notka prasowa / kontekst" : "Press / context note"}</strong><span>${isPl ? "Wzmianka zewnętrzna opisana ostrożnie — nie oznacza rekomendacji." : "External mention documented carefully — not an endorsement."}</span>`; card.appendChild(a); }
    });
    featuredSection()?.setAttribute("id", "documents");
  }

  function playlistWindow(key) {
    const item = playlist[key];
    return `<button type="button" class="playlist-window" data-playlist-key="${key}" aria-pressed="false" style="--playlist-image:url('${item.image}')"><span class="playlist-window-code">${item.code}</span><span class="playlist-window-title">${item.label}</span><span class="playlist-window-copy">${item.description}</span><span class="playlist-window-first">${text.recommended}: ${item.first}</span></button>`;
  }

  function createAudioRoom() {
    if ($("[data-audio-room]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-wow-section audio-room-section";
    section.dataset.audioRoom = "true";
    section.id = "playlists";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${text.audioKicker}</p><h2 class="vh-section-title">${text.audioTitle}</h2><p class="vh-section-kicker">${text.audioLead}</p></div><div class="playlist-window-grid" data-playlist-selector role="group" aria-label="${text.audioTitle}">${order.map(playlistWindow).join("")}</div><article class="playlist-room-panel" data-playlist-panel><p class="embed-privacy-note">${text.privacy}</p><p class="active-path-label" data-active-path-label></p><h3 data-playlist-title id="playlistTitle"></h3><p data-playlist-description></p><p class="playlist-recommended" data-playlist-recommended></p><div class="playlist-actions"><button class="vh-button secondary" type="button" data-load-playlist aria-controls="spotifyPlaylistRoom">${text.loadPlaylist}</button><a class="vh-button secondary" data-playlist-open target="_blank" rel="noopener noreferrer">${text.openSpotify}</a><a class="vh-button secondary" data-related-world>${text.related}</a><button class="vh-button secondary" type="button" data-copy-path>${text.copyPath}</button></div><div class="lazy-embed" id="spotifyPlaylistRoom" aria-live="polite"><span>Spotify</span></div></article></div>`;
    $(".sound-map-orbit")?.closest(".vh-section")?.after(section);
  }

  function createAlbums() {
    if ($("[data-album-entry-points]")) return;
    const section = document.createElement("section"); section.className = "vh-section album-entry-section"; section.dataset.albumEntryPoints = "true"; section.id = "albums";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${text.albumsKicker}</p><h2 class="vh-section-title">${text.albumsTitle}</h2><p class="vh-section-kicker">${text.albumsLead}</p></div>${albums.map(([heading, intro, list]) => `<div class="album-entry-group"><div class="album-entry-heading"><h3>${heading}</h3><p>${intro}</p></div><div class="album-entry-grid">${list.map(([code, title, meta, desc, href, image]) => `<article class="album-entry-card" style="--album-image:url('${image}')"><span class="album-entry-code">${code}</span><span class="album-entry-meta">${meta}</span><h4>${title}</h4><p>${desc}</p><a class="vh-button secondary" href="${href}" target="_blank" rel="noopener noreferrer">${text.openYoutube}</a></article>`).join("")}</div></div>`).join("")}</div>`;
    $("[data-audio-room]")?.after(section);
  }

  function createFilters() {
    if ($("[data-music-emotion-filter]")) return;
    const section = document.createElement("section"); section.className = "vh-section music-wow-section"; section.dataset.musicEmotionFilter = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${text.filterKicker}</p><h2 class="vh-section-title">${text.filterTitle}</h2><p class="vh-section-kicker">${text.filterLead}</p></div><div class="sound-control-panel" data-emotion-controls role="group" aria-label="${text.filterTitle}"></div><p class="sound-filter-status" data-emotion-status aria-live="polite"></p></div>`;
    const controls = $("[data-emotion-controls]", section); order.forEach((key) => controls.appendChild(createButton(playlist[key].label, key, "emotionFilter")));
    featuredSection()?.before(section);
  }

  function createListeningPath() {
    if ($("[data-now-listening]")) return;
    const section = document.createElement("section"); section.className = "vh-section music-wow-section"; section.dataset.nowListening = "true"; section.id = "paths";
    section.innerHTML = `<div class="vh-wrap"><div class="sound-map-orbit reveal visible"><div class="vh-section-head"><p class="vh-eyebrow">${text.pathKicker}</p><h2 class="vh-section-title">${text.pathTitle}</h2><p class="vh-section-kicker">${text.pathLead}</p></div><div class="sound-control-panel" data-path-controls role="group" aria-label="${text.pathTitle}"></div><ol class="now-listening-output" data-now-listening-output></ol></div></div>`;
    const controls = $("[data-path-controls]", section); order.forEach((key) => controls.appendChild(createButton(playlist[key].label, key, "listeningPath")));
    featuredSection()?.before(section);
  }

  function createGuided() {
    if (!$('[data-time-journey]')) { const s = document.createElement("section"); s.className = "vh-section music-guided-section"; s.dataset.timeJourney = "true"; const rows = [["05", isPl ? "Jeśli masz 5 minut" : "If you have 5 minutes", isPl ? "Zacznij od jednego mocnego wejścia emocjonalnego i jednej bramy kontekstu." : "Start with one direct emotional entry and one context door.", ["Personal / Cinematic", "LUSTRO / THE MIRROR", "Press / Recognition"]], ["20", isPl ? "Jeśli masz 20 minut" : "If you have 20 minutes", isPl ? "Przejdź krótką ścieżkę przez playlistę, muzykę, pamięć i obraz." : "Follow a compact path through playlist, music, memory and image.", ["Emotional Playlist Room", isPl ? "albumy muzyczne" : "music albums", "Rap-Ort / SZTAB"]], ["∞", isPl ? "Jeśli chcesz pełny świat" : "If you want the full world", isPl ? "Przejdź od dźwięku do Rap-Ort, SZTAB, kontekstu prasowego i użycia instytucjonalnego." : "Move from sound into Rap-Ort, SZTAB, press context and institutional use.", ["Rap-Ort", "SZTAB", isPl ? "Dla instytucji" : "For Institutions"]]]; s.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${text.timeKicker}</p><h2 class="vh-section-title">${text.timeTitle}</h2><p class="vh-section-kicker">${text.timeLead}</p></div><div class="guided-journey-grid">${rows.map(([badge, h, p, items]) => `<article class="guided-journey-card"><span class="time-badge">${badge}</span><h3>${h}</h3><p>${p}</p><ol>${items.map((item, i) => `<li><span>${i + 1}</span>${item}</li>`).join("")}</ol></article>`).join("")}</div></div>`; $('[data-album-entry-points]')?.after(s); }
    if (!$('[data-audience-paths]')) { const s = document.createElement("section"); s.className = "vh-section music-guided-section"; s.dataset.audiencePaths = "true"; const cards = [[isPl ? "Dla słuchaczy" : "For listeners", isPl ? "Zacznij od emocji i pozwól mapie poprowadzić Cię do świata." : "Start with emotion and let the map lead you toward a world.", `${musicPath}#personal`], [isPl ? "Dla kuratorów" : "For curators", isPl ? "Zacznij od kontekstu, śladów zewnętrznych i ostrożnie opisanych zastosowań kulturalnych." : "Start with context, external traces and carefully described cultural use.", isPl ? "/press-recognition/pl/" : "/press-recognition/"], [isPl ? "Dla instytucji" : "For institutions", isPl ? "Zacznij od pokazów, kontekstu edukacyjnego i formatów programowych." : "Start with screenings, educational context and programme formats.", isPl ? "/for-institutions/pl/" : "/for-institutions/"]]; s.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${text.audienceKicker}</p><h2 class="vh-section-title">${text.audienceTitle}</h2><p class="vh-section-kicker">${text.audienceLead}</p></div><div class="audience-path-grid">${cards.map(([h, p, href]) => `<article class="audience-path-card"><h3>${h}</h3><p>${p}</p><a class="vh-button secondary" href="${href}">${text.explore}</a></article>`).join("")}</div></div>`; collaborationSection()?.before(s); }
  }

  function createPlatformAndFinal() {
    if (!$('[data-platform-links]')) { const s = document.createElement("section"); s.className = "vh-section"; s.dataset.platformLinks = "true"; s.id = "platforms"; s.innerHTML = `<div class="vh-wrap"><div class="music-final-ribbon reveal visible"><p class="vh-eyebrow">${text.platformsKicker}</p><h2 class="vh-section-title">${text.platformsTitle}</h2><p>${text.platformsLead}</p><div class="platform-grid">${platformLinks.map(([label, href]) => `<a class="platform-link" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`).join("")}</div></div></div>`; collaborationSection()?.after(s); }
    if (!$('[data-music-final-ribbon]')) { const s = document.createElement("section"); s.className = "vh-section"; s.dataset.musicFinalRibbon = "true"; const links = [[isPl ? "Wejdź do Rap-Ort" : "Enter Rap-Ort", isPl ? "/rap-ort/pl/" : "/rap-ort/"], [isPl ? "Odkryj SZTAB" : "Discover SZTAB", isPl ? "/sztab/pl/" : "/sztab/"], [isPl ? "Kontakt" : "Contact", isPl ? "/contact/pl/" : "/contact/"]]; s.innerHTML = `<div class="vh-wrap"><div class="music-final-ribbon reveal visible"><p class="vh-eyebrow">Sound Map</p><h2 class="vh-section-title">${text.finalTitle}</h2><p>${text.finalText}</p><div class="vh-actions">${links.map(([label, href]) => `<a class="vh-button secondary" href="${href}">${label}</a>`).join("")}</div></div></div>`; $('[data-platform-links]')?.after(s); }
  }

  function setPlaylist(key, { updateHash = false } = {}) {
    const activeKey = playlist[key] ? key : "personal"; const data = playlist[activeKey];
    $$('[data-playlist-key]').forEach((button) => { const active = button.dataset.playlistKey === activeKey; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    const title = $('[data-playlist-title]'), desc = $('[data-playlist-description]'), open = $('[data-playlist-open]'), embed = $('#spotifyPlaylistRoom'), load = $('[data-load-playlist]'), path = $('[data-active-path-label]'), recommended = $('[data-playlist-recommended]'), related = $('[data-related-world]'), copy = $('[data-copy-path]');
    if (title) title.textContent = data.label; if (desc) desc.textContent = data.description; if (open) open.href = data.url;
    if (path) path.textContent = `${isPl ? "Wchodzisz przez" : "You are entering through"}: ${data.label}`;
    if (recommended) recommended.textContent = `${text.recommended}: ${data.first}`;
    if (related) { related.href = data.relatedHref; related.textContent = `${text.related}: ${data.relatedLabel}`; related.toggleAttribute("target", data.relatedHref.startsWith("http")); if (data.relatedHref.startsWith("http")) related.rel = "noopener noreferrer"; }
    if (copy) copy.textContent = text.copyPath;
    if (embed) { embed.classList.remove("is-loading", "is-loaded"); embed.dataset.loaded = "false"; embed.replaceChildren(Object.assign(document.createElement("span"), { textContent: "Spotify" })); }
    if (load) { load.disabled = false; load.textContent = text.loadPlaylist; load.dataset.playlist = activeKey; load.setAttribute("aria-label", `${text.loadPlaylist}: ${data.label}`); }
    if (updateHash) history.replaceState(null, "", `#${activeKey}`);
  }

  function setFilter(key, options = {}) {
    const activeKey = playlist[key] ? key : "personal"; let visible = 0;
    $$('[data-emotion-filter]').forEach((button) => { const active = button.dataset.emotionFilter === activeKey; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    $$('.track-document[data-emotions]').forEach((card) => { const show = normalize(card.dataset.emotions).split(/\s+/).includes(activeKey); card.hidden = !show; card.classList.toggle("is-filtered-out", !show); if (show) visible += 1; });
    const status = $('[data-emotion-status]'); if (status) status.textContent = `${text.showing}: ${playlist[activeKey].label}${visible ? ` · ${visible}` : ""}`;
    setPlaylist(activeKey, options);
  }

  function setListening(key) {
    const activeKey = playlist[key] ? key : "personal";
    $$('[data-listening-path]').forEach((button) => { const active = button.dataset.listeningPath === activeKey; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    const out = $('[data-now-listening-output]'); if (!out) return;
    out.innerHTML = (recs[activeKey] || recs.personal).map((title, index) => `<li><span>${index + 1}</span><div><strong>${title}</strong><small>${playlist[activeKey].description}</small></div><a href="${recommendationLinks[title] || `${musicPath}#${activeKey}`}">${text.explore}</a></li>`).join("");
  }

  function loadPlaylist() {
    const button = $('[data-load-playlist]'); const key = button?.dataset.playlist || "personal"; const data = playlist[key] || playlist.personal; const target = $('#spotifyPlaylistRoom');
    if (!button || !target || target.dataset.loaded === "true") return;
    let isSettled = false;
    const markLoaded = () => { if (isSettled) return; isSettled = true; target.classList.remove("is-loading"); target.classList.add("is-loaded"); target.dataset.loaded = "true"; button.textContent = text.loaded; };
    button.disabled = true; button.textContent = text.loading; target.classList.add("is-loading"); target.replaceChildren(Object.assign(document.createElement("span"), { textContent: text.loading }));
    const iframe = document.createElement("iframe"); iframe.src = `https://open.spotify.com/embed/playlist/${data.id}?utm_source=generator`; iframe.title = `Spotify playlist — ${data.label}`; iframe.loading = "lazy"; iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"; iframe.width = "100%"; iframe.height = "352"; iframe.style.border = "0";
    iframe.addEventListener("load", markLoaded, { once: true }); setTimeout(markLoaded, 2200); target.replaceChildren(iframe);
  }

  function copyPath() {
    const key = $('[data-load-playlist]')?.dataset.playlist || "personal";
    const url = `${location.origin}${musicPath}#${key}`;
    const button = $('[data-copy-path]');
    const finish = () => { if (button) { button.textContent = text.copied; setTimeout(() => { button.textContent = text.copyPath; }, 1400); } };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(finish).catch(finish); else finish();
  }

  document.addEventListener("click", (event) => {
    const key = event.target.closest('[data-emotion-filter]')?.dataset.emotionFilter || event.target.closest('[data-listening-path]')?.dataset.listeningPath || event.target.closest('[data-playlist-key]')?.dataset.playlistKey;
    if (key) { setFilter(key, { updateHash: true }); setListening(key); return; }
    if (event.target.closest('[data-load-playlist]')) loadPlaylist();
    if (event.target.closest('[data-copy-path]')) copyPath();
  });

  createMiniNav(); markTracks(); createAudioRoom(); createAlbums(); createGuided(); createFilters(); createListeningPath(); createPlatformAndFinal();
  const initial = keyFromHash(location.hash) || "personal"; setFilter(initial); setListening(initial);
  window.addEventListener("hashchange", () => { const key = keyFromHash(location.hash) || "personal"; setFilter(key); setListening(key); });
})();
