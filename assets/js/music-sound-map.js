(() => {
  "use strict";

  const root = document.querySelector("body.page-music");
  if (!root || window.__veritasMusicSoundMap) return;
  window.__veritasMusicSoundMap = true;

  const lang = root.dataset.lang === "pl" ? "pl" : "en";
  const t = {
    en: {
      all: "All", memory: "Memory", conscience: "Conscience", resistance: "Resistance", identity: "Identity", resilience: "Resilience",
      filterTitle: "Interactive emotional filter", filterKicker: "Choose an emotion", filterLead: "Click an emotional entry point to reshape the visible sound documents.", showing: "Showing", empty: "No works match this emotional entry yet.",
      pathTitle: "Now listening path", pathKicker: "Three recommended entries", pathLead: "Choose a path and receive three entry points into the sound world.",
      audioTitle: "Audio room", audioKicker: "Listen without leaving the world", audioLead: "Load selected listening spaces only when you need them. No autoplay, no heavy embeds before interaction.", spotify: "Load Spotify artist room", loaded: "Audio room loaded", spotifyPrivacy: "Spotify player loads only after your click.",
      rapOrtCard: "Rap-Ort playlist", rapOrtText: "Enter the audiovisual music world connected with Rap-Ort and Prawda Sumienia.", sztabCard: "SZTAB / ORIGINS video entry", sztabText: "Begin with the animated memory branch and the first SZTAB · ORIGINS episode.", openYoutube: "Open on YouTube",
      badge: "Press / context note", badgeText: "External mention documented carefully — not an endorsement.", open: "Open", explore: "Explore"
    },
    pl: {
      all: "Wszystko", memory: "Pamięć", conscience: "Sumienie", resistance: "Opór", identity: "Tożsamość", resilience: "Odporność",
      filterTitle: "Interaktywny filtr emocji", filterKicker: "Wybierz emocję", filterLead: "Kliknij emocjonalne wejście, aby zmienić widoczne dokumenty dźwiękowe.", showing: "Pokazuję", empty: "Na razie brak prac dla tego wejścia emocjonalnego.",
      pathTitle: "Teraz ścieżka słuchania", pathKicker: "Trzy rekomendowane wejścia", pathLead: "Wybierz ścieżkę i otrzymaj trzy wejścia do dźwiękowego świata.",
      audioTitle: "Pokój odsłuchowy", audioKicker: "Słuchaj bez opuszczania świata", audioLead: "Ładuj wybrane przestrzenie odsłuchu tylko wtedy, gdy ich potrzebujesz. Bez autoplay i bez ciężkich embedów przed interakcją.", spotify: "Załaduj pokój Spotify", loaded: "Pokój odsłuchowy załadowany", spotifyPrivacy: "Odtwarzacz Spotify ładuje się dopiero po kliknięciu.",
      rapOrtCard: "Playlista Rap-Ort", rapOrtText: "Wejdź w audiowizualny świat muzyki związany z Rap-Ort i Prawdą Sumienia.", sztabCard: "SZTAB / ORIGINS — wejście wideo", sztabText: "Zacznij od animowanej gałęzi pamięci i pierwszego odcinka SZTAB · ORIGINS.", openYoutube: "Otwórz na YouTube",
      badge: "Notka prasowa / kontekst", badgeText: "Wzmianka zewnętrzna opisana ostrożnie — nie oznacza rekomendacji.", open: "Otwórz", explore: "Zobacz"
    }
  }[lang];

  const paths = {
    memory: [
      { title: "SZTAB — Raport z Pamięci", reason: lang === "pl" ? "Albumowy fundament świata pamięci." : "The album foundation of the memory world.", href: "/sztab/raport-z-pamieci/" },
      { title: "Kurier Prawdy", reason: lang === "pl" ? "Świadectwo, prawda i koszt bycia usłyszanym." : "Witness, truth and the cost of being heard.", href: lang === "pl" ? "/press-recognition/pl/" : "/press-recognition/" },
      { title: "Rap-Ort / Prawda Sumienia", reason: lang === "pl" ? "Muzyka jako świadectwo i presja moralna." : "Music as testimony and moral pressure.", href: lang === "pl" ? "/rap-ort/prawda-sumienia/pl/" : "/rap-ort/prawda-sumienia/" }
    ],
    conscience: [
      { title: "LUSTRO / THE MIRROR", reason: lang === "pl" ? "Współczesne pytanie o prawdę i system." : "A contemporary question of truth and system.", href: lang === "pl" ? "/music/pl/#conscience" : "/music/#conscience" },
      { title: "Rap-Ort", reason: lang === "pl" ? "Sumienie, pamięć i decyzja człowieka pod presją." : "Conscience, memory and human decision under pressure.", href: lang === "pl" ? "/rap-ort/pl/" : "/rap-ort/" },
      { title: "Kurier Prawdy", reason: lang === "pl" ? "Świadectwo jako obowiązek wobec prawdy." : "Witness as a responsibility toward truth.", href: lang === "pl" ? "/press-recognition/pl/" : "/press-recognition/" }
    ],
    resistance: [
      { title: "Unbroken", reason: lang === "pl" ? "Odporność, przetrwanie i wewnętrzna siła." : "Resilience, survival and inner strength.", href: lang === "pl" ? "/music/pl/#resilience" : "/music/#resilience" },
      { title: "SZTAB", reason: lang === "pl" ? "Pamięć opowiadana przez muzykę i animowaną formę." : "Memory told through music and animated form.", href: lang === "pl" ? "/sztab/pl/" : "/sztab/" },
      { title: "Zo / SZTAB ORIGINS", reason: lang === "pl" ? "Pierwsze wejście w animowaną gałąź SZTAB." : "The first entry into the animated SZTAB branch.", href: lang === "pl" ? "/sztab/origins/pl/" : "/sztab/origins/" }
    ],
    identity: [
      { title: "LUSTRO / THE MIRROR", reason: lang === "pl" ? "Tożsamość, odbicie i napięcie współczesności." : "Identity, reflection and contemporary tension.", href: lang === "pl" ? "/music/pl/#identity" : "/music/#identity" },
      { title: "Campus Ignis", reason: lang === "pl" ? "Świadomość, ogień i odpowiedzialność." : "Awareness, fire and responsibility.", href: lang === "pl" ? "/music/pl/#identity" : "/music/#identity" },
      { title: lang === "pl" ? "Między Wierszami" : "Between the Lines", reason: lang === "pl" ? "Znaczenia ukryte między słowami i ciszą." : "Meanings hidden between words and silence.", href: lang === "pl" ? "/miedzy-wierszami/" : "/between-the-lines/" }
    ],
    resilience: [
      { title: "Unbroken", reason: lang === "pl" ? "Wytrwałość jako dźwiękowe wejście." : "Endurance as a sound entry point.", href: lang === "pl" ? "/music/pl/#resilience" : "/music/#resilience" },
      { title: "Equilibrium", reason: lang === "pl" ? "Równowaga, napięcie i ruch." : "Balance, tension and movement.", href: lang === "pl" ? "/music/pl/#resilience" : "/music/#resilience" },
      { title: "SZTAB", reason: lang === "pl" ? "Odporność pamięci i krótkich form historycznych." : "The resilience of memory and short historical forms.", href: lang === "pl" ? "/sztab/pl/" : "/sztab/" }
    ]
  };

  const emotionMap = [
    { test: /raport z pamięci/i, value: "memory resistance resilience" },
    { test: /kurier prawdy/i, value: "memory conscience resistance" },
    { test: /lustro|mirror/i, value: "conscience identity" },
    { test: /unbroken/i, value: "resistance resilience" },
    { test: /campus ignis/i, value: "identity resilience conscience" },
    { test: /equilibrium/i, value: "resilience identity" }
  ];

  const hashAliases = {
    all: "all", memory: "memory", pamiec: "memory", "pamięć": "memory",
    conscience: "conscience", sumienie: "conscience",
    resistance: "resistance", opor: "resistance", "opór": "resistance",
    identity: "identity", tozsamosc: "identity", "tożsamość": "identity",
    resilience: "resilience", odpornosc: "resilience", "odporność": "resilience"
  };

  function normalise(value) { return String(value || "").trim().toLowerCase(); }
  function hashToKey(hash) { return hashAliases[normalise(String(hash || "").replace(/^#/, ""))] || null; }
  function findFeaturedSection() { return [...document.querySelectorAll(".vh-section")].find((section) => /Selected sound documents|Dokumenty dźwiękowe/i.test(section.textContent || "")); }

  function markTrackCards() {
    document.querySelectorAll(".track-document").forEach((card) => {
      const title = card.querySelector("h3")?.textContent || "";
      const match = emotionMap.find((item) => item.test.test(title));
      card.dataset.emotions = match?.value || "memory conscience";
      card.classList.add("has-waveform");
      if (/kurier prawdy/i.test(title) && !card.querySelector(".press-context-badge")) {
        const badge = document.createElement("a");
        badge.className = "press-context-badge";
        badge.href = lang === "pl" ? "/press-recognition/pl/" : "/press-recognition/";
        badge.innerHTML = `<strong>${t.badge}</strong><span>${t.badgeText}</span>`;
        card.appendChild(badge);
      }
    });
  }

  function createButton(label, key, attr) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sound-control";
    button.textContent = label;
    button.dataset[attr] = key;
    button.setAttribute("aria-pressed", "false");
    return button;
  }

  function createFilterSection() {
    if (document.querySelector("[data-music-emotion-filter]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-wow-section";
    section.dataset.musicEmotionFilter = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.filterKicker}</p><h2 class="vh-section-title">${t.filterTitle}</h2><p class="vh-section-kicker">${t.filterLead}</p></div><div class="sound-control-panel" data-emotion-controls></div><p class="sound-filter-status" data-emotion-status aria-live="polite"></p></div>`;
    const controls = section.querySelector("[data-emotion-controls]");
    [[t.all,"all"],[t.memory,"memory"],[t.conscience,"conscience"],[t.resistance,"resistance"],[t.identity,"identity"],[t.resilience,"resilience"]].forEach(([label,key]) => controls.appendChild(createButton(label, key, "emotionFilter")));
    findFeaturedSection()?.before(section);
  }

  function createListeningPathSection() {
    if (document.querySelector("[data-now-listening]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-wow-section";
    section.dataset.nowListening = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="sound-map-orbit reveal visible"><div class="vh-section-head"><p class="vh-eyebrow">${t.pathKicker}</p><h2 class="vh-section-title">${t.pathTitle}</h2><p class="vh-section-kicker">${t.pathLead}</p></div><div class="sound-control-panel" data-path-controls></div><ol class="now-listening-output" data-now-listening-output></ol></div></div>`;
    const controls = section.querySelector("[data-path-controls]");
    [[t.memory,"memory"],[t.conscience,"conscience"],[t.resistance,"resistance"],[t.identity,"identity"],[t.resilience,"resilience"]].forEach(([label,key]) => controls.appendChild(createButton(label, key, "listeningPath")));
    findFeaturedSection()?.before(section);
  }

  function createAudioRoom() {
    if (document.querySelector("[data-audio-room]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-wow-section audio-room-section";
    section.dataset.audioRoom = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.audioKicker}</p><h2 class="vh-section-title">${t.audioTitle}</h2><p class="vh-section-kicker">${t.audioLead}</p></div><div class="vh-grid three"><article class="audio-room-card spotify-card"><h3>Spotify</h3><p>Vibrosław artist room.</p><p class="embed-privacy-note">${t.spotifyPrivacy}</p><div class="lazy-embed" id="spotifyArtistRoom"><span>Spotify</span></div><button class="vh-button secondary" type="button" data-load-embed data-load-embed-target="#spotifyArtistRoom" data-embed-title="Vibrosław Spotify artist room" data-embed-src="https://open.spotify.com/embed/artist/0df87MMIM1VOy2dR1DM2oF?utm_source=generator">${t.spotify}</button></article><article class="audio-room-card youtube-card"><div class="youtube-thumb" aria-hidden="true"><span>▶</span></div><h3>${t.rapOrtCard}</h3><p>${t.rapOrtText}</p><a class="vh-button secondary" href="https://youtube.com/playlist?list=PLa1mFnbfhev615wCW-3Bi8Fz1kE0Maksq" target="_blank" rel="noopener noreferrer">${t.openYoutube}</a></article><article class="audio-room-card youtube-card"><div class="youtube-thumb" aria-hidden="true"><span>▶</span></div><h3>${t.sztabCard}</h3><p>${t.sztabText}</p><a class="vh-button secondary" href="https://youtu.be/JgV9KEZTbeM" target="_blank" rel="noopener noreferrer">${t.openYoutube}</a></article></div></div>`;
    document.querySelector(".sound-map-orbit")?.closest(".vh-section")?.after(section);
  }

  function setEmotionFilter(value, options = {}) {
    const filter = normalise(value || "all");
    const cards = [...document.querySelectorAll(".track-document[data-emotions]")];
    const buttons = [...document.querySelectorAll("[data-emotion-filter]")];
    const status = document.querySelector("[data-emotion-status]");
    let visible = 0;
    buttons.forEach((button) => { const active = normalise(button.dataset.emotionFilter) === filter; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    cards.forEach((card) => { const emotions = normalise(card.dataset.emotions).split(/\s+/).filter(Boolean); const show = filter === "all" || emotions.includes(filter); card.classList.toggle("is-filtered-out", !show); card.hidden = !show; if (show) visible += 1; });
    if (status) { const activeLabel = buttons.find((button) => normalise(button.dataset.emotionFilter) === filter)?.textContent?.trim() || t.all; status.textContent = visible ? `${t.showing}: ${activeLabel}` : t.empty; }
    if (options.updateHash && filter !== "all") history.replaceState(null, "", `#${filter}`);
    if (options.updateHash && filter === "all" && location.hash) history.replaceState(null, "", location.pathname);
  }

  function setListeningPath(value) {
    const key = normalise(value || "memory");
    const output = document.querySelector("[data-now-listening-output]");
    const buttons = [...document.querySelectorAll("[data-listening-path]")];
    const recommendations = paths[key] || paths.memory;
    buttons.forEach((button) => { const active = normalise(button.dataset.listeningPath) === key; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    if (output) output.innerHTML = recommendations.map((item, index) => `<li><span>${index + 1}</span><div><strong>${item.title}</strong><small>${item.reason}</small></div><a href="${item.href}">${t.explore}</a></li>`).join("");
  }

  function loadEmbed(button) {
    const target = document.querySelector(button.dataset.loadEmbedTarget || "");
    const src = button.dataset.embedSrc;
    const title = button.dataset.embedTitle || "Spotify player";
    if (!target || !src || target.dataset.loaded === "true") return;
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.style.border = "0";
    iframe.width = "100%";
    iframe.height = "352";
    target.replaceChildren(iframe);
    target.dataset.loaded = "true";
    button.textContent = t.loaded;
    button.disabled = true;
  }

  document.addEventListener("click", (event) => {
    const emotionButton = event.target.closest("[data-emotion-filter]");
    if (emotionButton) { const key = emotionButton.dataset.emotionFilter; setEmotionFilter(key, { updateHash: true }); if (key !== "all") setListeningPath(key); return; }
    const pathButton = event.target.closest("[data-listening-path]");
    if (pathButton) { const key = pathButton.dataset.listeningPath; setListeningPath(key); setEmotionFilter(key, { updateHash: true }); return; }
    const embedButton = event.target.closest("[data-load-embed]");
    if (embedButton) return loadEmbed(embedButton);
  });

  markTrackCards();
  createAudioRoom();
  createFilterSection();
  createListeningPathSection();
  const initialKey = hashToKey(location.hash) || "all";
  setEmotionFilter(initialKey);
  setListeningPath(initialKey === "all" ? "memory" : initialKey);
  window.addEventListener("hashchange", () => { const key = hashToKey(location.hash) || "all"; setEmotionFilter(key); setListeningPath(key === "all" ? "memory" : key); });
})();
