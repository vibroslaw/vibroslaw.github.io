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
      badge: "Press / context note", badgeText: "External mention documented carefully — not an endorsement.", open: "Open", explore: "Explore",
      timeKicker: "Guided listening", timeTitle: "Choose by time", timeLead: "Enter the music through the amount of attention you have now — a short spark, a focused path or the full authorial world.",
      fiveTitle: "If you have 5 minutes", fiveText: "Start with one direct emotional entry and one context door.", twentyTitle: "If you have 20 minutes", twentyText: "Follow a compact path through music, memory and image.", fullTitle: "If you want the full world", fullText: "Move from sound into Rap-Ort, SZTAB, Press context and institutional use.",
      audienceKicker: "Who is entering?", audienceTitle: "Three ways to use the Sound Map", audienceLead: "The same music can work differently for listeners, curators and institutions.",
      listenerTitle: "For listeners", listenerText: "Start with emotion and let the map lead you toward a world.", curatorTitle: "For curators", curatorText: "Start with context, external traces and carefully described cultural use.", institutionTitle: "For institutions", institutionText: "Start with screenings, educational context and programme formats.",
      finalTitle: "Continue from the Sound Map", finalText: "Move from listening into the worlds, context or collaboration.", listen: "Listen", enterRaport: "Enter Rap-Ort", discoverSztab: "Discover SZTAB", contact: "Contact"
    },
    pl: {
      all: "Wszystko", memory: "Pamięć", conscience: "Sumienie", resistance: "Opór", identity: "Tożsamość", resilience: "Odporność",
      filterTitle: "Interaktywny filtr emocji", filterKicker: "Wybierz emocję", filterLead: "Kliknij emocjonalne wejście, aby zmienić widoczne dokumenty dźwiękowe.", showing: "Pokazuję", empty: "Na razie brak prac dla tego wejścia emocjonalnego.",
      pathTitle: "Teraz ścieżka słuchania", pathKicker: "Trzy rekomendowane wejścia", pathLead: "Wybierz ścieżkę i otrzymaj trzy wejścia do dźwiękowego świata.",
      audioTitle: "Pokój odsłuchowy", audioKicker: "Słuchaj bez opuszczania świata", audioLead: "Ładuj wybrane przestrzenie odsłuchu tylko wtedy, gdy ich potrzebujesz. Bez autoplay i bez ciężkich embedów przed interakcją.", spotify: "Załaduj pokój Spotify", loaded: "Pokój odsłuchowy załadowany", spotifyPrivacy: "Odtwarzacz Spotify ładuje się dopiero po kliknięciu.",
      rapOrtCard: "Playlista Rap-Ort", rapOrtText: "Wejdź w audiowizualny świat muzyki związany z Rap-Ort i Prawdą Sumienia.", sztabCard: "SZTAB / ORIGINS — wejście wideo", sztabText: "Zacznij od animowanej gałęzi pamięci i pierwszego odcinka SZTAB · ORIGINS.", openYoutube: "Otwórz na YouTube",
      badge: "Notka prasowa / kontekst", badgeText: "Wzmianka zewnętrzna opisana ostrożnie — nie oznacza rekomendacji.", open: "Otwórz", explore: "Zobacz",
      timeKicker: "Prowadzone słuchanie", timeTitle: "Wybierz według czasu", timeLead: "Wejdź w muzykę przez ilość uwagi, którą masz teraz — krótki impuls, skupioną ścieżkę albo pełny autorski świat.",
      fiveTitle: "Jeśli masz 5 minut", fiveText: "Zacznij od jednego mocnego wejścia emocjonalnego i jednych drzwi kontekstu.", twentyTitle: "Jeśli masz 20 minut", twentyText: "Przejdź krótką ścieżkę przez muzykę, pamięć i obraz.", fullTitle: "Jeśli chcesz pełny świat", fullText: "Przejdź od dźwięku do Rap-Ort, SZTAB, kontekstu prasowego i użycia instytucjonalnego.",
      audienceKicker: "Kto wchodzi?", audienceTitle: "Trzy sposoby użycia Sound Map", audienceLead: "Ta sama muzyka może działać inaczej dla słuchaczy, kuratorów i instytucji.",
      listenerTitle: "Dla słuchaczy", listenerText: "Zacznij od emocji i pozwól mapie poprowadzić Cię do świata.", curatorTitle: "Dla kuratorów", curatorText: "Zacznij od kontekstu, śladów zewnętrznych i ostrożnie opisanych zastosowań kulturalnych.", institutionTitle: "Dla instytucji", institutionText: "Zacznij od pokazów, kontekstu edukacyjnego i formatów programowych.",
      finalTitle: "Kontynuuj z Dźwiękowej Mapy", finalText: "Przejdź od słuchania do światów, kontekstu albo współpracy.", listen: "Słuchaj", enterRaport: "Wejdź do Rap-Ort", discoverSztab: "Odkryj SZTAB", contact: "Kontakt"
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

  const hashAliases = { all: "all", memory: "memory", pamiec: "memory", "pamięć": "memory", conscience: "conscience", sumienie: "conscience", resistance: "resistance", opor: "resistance", "opór": "resistance", identity: "identity", tozsamosc: "identity", "tożsamość": "identity", resilience: "resilience", odpornosc: "resilience", "odporność": "resilience" };

  function normalise(value) { return String(value || "").trim().toLowerCase(); }
  function hashToKey(hash) { return hashAliases[normalise(String(hash || "").replace(/^#/, ""))] || null; }
  function findFeaturedSection() { return [...document.querySelectorAll(".vh-section")].find((section) => /Selected sound documents|Dokumenty dźwiękowe/i.test(section.textContent || "")); }
  function findCollaborationSection() { return [...document.querySelectorAll(".vh-section")].find((section) => /Music use \/ collaboration|Wykorzystanie muzyki \/ współpraca/i.test(section.textContent || "")); }

  function injectGuidedStyles() {
    if (document.getElementById("musicGuidedJourneyStyles")) return;
    const style = document.createElement("style");
    style.id = "musicGuidedJourneyStyles";
    style.textContent = `
      body.page-music .guided-journey-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1rem,2vw,1.4rem);margin-top:1.4rem}
      body.page-music .guided-journey-card,body.page-music .audience-path-card{position:relative;overflow:hidden;isolation:isolate;border:1px solid rgba(201,178,143,.18);border-radius:24px;padding:clamp(1.1rem,2.4vw,1.75rem);background:linear-gradient(145deg,rgba(255,255,255,.052),rgba(255,255,255,.014));box-shadow:0 1.6rem 4.8rem rgba(0,0,0,.24);transition:transform .28s ease,border-color .28s ease,box-shadow .28s ease}
      body.page-music .guided-journey-card:before,body.page-music .audience-path-card:before{content:"";position:absolute;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(circle at 22% 10%,rgba(201,178,143,.12),transparent 18rem),repeating-linear-gradient(90deg,rgba(201,178,143,.026) 0 1px,transparent 1px 28px);opacity:.62}
      body.page-music .guided-journey-card:hover,body.page-music .guided-journey-card:focus-within,body.page-music .audience-path-card:hover,body.page-music .audience-path-card:focus-within{transform:translateY(-6px);border-color:rgba(201,178,143,.42);box-shadow:0 2.2rem 6rem rgba(0,0,0,.32),0 0 2.4rem rgba(201,178,143,.08)}
      body.page-music .guided-journey-card h3,body.page-music .audience-path-card h3{margin:0 0 .65rem;font-family:"Cormorant Garamond",serif;font-size:clamp(1.8rem,2.4vw,2.7rem);line-height:.95}
      body.page-music .guided-journey-card p,body.page-music .audience-path-card p{color:rgba(241,234,219,.72);line-height:1.72}
      body.page-music .guided-journey-card ol{margin:1rem 0 0;padding:0;list-style:none;display:grid;gap:.55rem}
      body.page-music .guided-journey-card li{display:flex;gap:.55rem;align-items:flex-start;color:rgba(241,234,219,.78);line-height:1.45}
      body.page-music .guided-journey-card li span{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(201,178,143,.12);color:rgba(201,178,143,.9);font-size:.7rem;flex:0 0 auto}
      body.page-music .time-badge{display:inline-flex;align-items:center;min-height:28px;border:1px solid rgba(201,178,143,.25);border-radius:999px;padding:0 10px;margin-bottom:1rem;background:rgba(201,178,143,.08);color:rgba(201,178,143,.86);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase}
      body.page-music .audience-path-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1rem,2vw,1.4rem);margin-top:1.4rem}
      body.page-music .music-final-ribbon{border:1px solid rgba(201,178,143,.22);border-radius:28px;padding:clamp(1.3rem,3vw,2.5rem);background:radial-gradient(circle at 14% 20%,rgba(201,178,143,.14),transparent 25rem),linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.014));box-shadow:0 2.2rem 6rem rgba(0,0,0,.30)}
      body.page-music .music-final-ribbon .vh-actions{margin-top:1.2rem}
      body.cinematic-mode.page-music .guided-journey-card,body.cinematic-mode.page-music .audience-path-card,body.cinematic-mode.page-music .music-final-ribbon{box-shadow:0 2.8rem 7rem rgba(0,0,0,.42),0 0 3.5rem rgba(201,178,143,.10)}
      @media(max-width:900px){body.page-music .guided-journey-grid,body.page-music .audience-path-grid{grid-template-columns:1fr}}
      @media(prefers-reduced-motion:reduce){body.page-music .guided-journey-card,body.page-music .audience-path-card{transition:none!important;transform:none!important}}
      body.reduce-motion.page-music .guided-journey-card,body.reduced-motion.page-music .guided-journey-card,body.reduce-motion.page-music .audience-path-card,body.reduced-motion.page-music .audience-path-card{transition:none!important;transform:none!important}
    `;
    document.head.appendChild(style);
  }

  function markTrackCards() {
    document.querySelectorAll(".track-document").forEach((card, index) => {
      const title = card.querySelector("h3")?.textContent || "";
      const match = emotionMap.find((item) => item.test.test(title));
      card.dataset.emotions = match?.value || "memory conscience";
      card.classList.add("has-waveform");
      if (!card.querySelector(".status-badge")) {
        const row = card.querySelector(".status-row") || document.createElement("div");
        row.className = "status-row";
        const badge = document.createElement("span");
        badge.className = "status-badge";
        badge.textContent = `VH-SND-${String(index + 1).padStart(2, "0")}`;
        row.prepend(badge);
        if (!card.querySelector(".status-row")) card.prepend(row);
      } else {
        const badge = document.createElement("span");
        badge.className = "status-badge is-muted";
        badge.textContent = `VH-SND-${String(index + 1).padStart(2, "0")}`;
        card.querySelector(".status-row")?.prepend(badge);
      }
      if (/kurier prawdy/i.test(title) && !card.querySelector(".press-context-badge")) {
        const badge = document.createElement("a");
        badge.className = "press-context-badge";
        badge.href = lang === "pl" ? "/press-recognition/pl/" : "/press-recognition/";
        badge.innerHTML = `<strong>${t.badge}</strong><span>${t.badgeText}</span>`;
        card.appendChild(badge);
      }
    });
  }

  function createButton(label, key, attr) { const button = document.createElement("button"); button.type = "button"; button.className = "sound-control"; button.textContent = label; button.dataset[attr] = key; button.setAttribute("aria-pressed", "false"); return button; }

  function createFilterSection() { if (document.querySelector("[data-music-emotion-filter]")) return; const section = document.createElement("section"); section.className = "vh-section music-wow-section"; section.dataset.musicEmotionFilter = "true"; section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.filterKicker}</p><h2 class="vh-section-title">${t.filterTitle}</h2><p class="vh-section-kicker">${t.filterLead}</p></div><div class="sound-control-panel" data-emotion-controls></div><p class="sound-filter-status" data-emotion-status aria-live="polite"></p></div>`; const controls = section.querySelector("[data-emotion-controls]"); [[t.all,"all"],[t.memory,"memory"],[t.conscience,"conscience"],[t.resistance,"resistance"],[t.identity,"identity"],[t.resilience,"resilience"]].forEach(([label,key]) => controls.appendChild(createButton(label, key, "emotionFilter"))); findFeaturedSection()?.before(section); }

  function createListeningPathSection() { if (document.querySelector("[data-now-listening]")) return; const section = document.createElement("section"); section.className = "vh-section music-wow-section"; section.dataset.nowListening = "true"; section.innerHTML = `<div class="vh-wrap"><div class="sound-map-orbit reveal visible"><div class="vh-section-head"><p class="vh-eyebrow">${t.pathKicker}</p><h2 class="vh-section-title">${t.pathTitle}</h2><p class="vh-section-kicker">${t.pathLead}</p></div><div class="sound-control-panel" data-path-controls></div><ol class="now-listening-output" data-now-listening-output></ol></div></div>`; const controls = section.querySelector("[data-path-controls]"); [[t.memory,"memory"],[t.conscience,"conscience"],[t.resistance,"resistance"],[t.identity,"identity"],[t.resilience,"resilience"]].forEach(([label,key]) => controls.appendChild(createButton(label, key, "listeningPath"))); findFeaturedSection()?.before(section); }

  function createAudioRoom() { if (document.querySelector("[data-audio-room]")) return; const section = document.createElement("section"); section.className = "vh-section music-wow-section audio-room-section"; section.dataset.audioRoom = "true"; section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.audioKicker}</p><h2 class="vh-section-title">${t.audioTitle}</h2><p class="vh-section-kicker">${t.audioLead}</p></div><div class="vh-grid three"><article class="audio-room-card spotify-card"><h3>Spotify</h3><p>Vibrosław artist room.</p><p class="embed-privacy-note">${t.spotifyPrivacy}</p><div class="lazy-embed" id="spotifyArtistRoom"><span>Spotify</span></div><button class="vh-button secondary" type="button" data-load-embed data-load-embed-target="#spotifyArtistRoom" data-embed-title="Vibrosław Spotify artist room" data-embed-src="https://open.spotify.com/embed/artist/0df87MMIM1VOy2dR1DM2oF?utm_source=generator">${t.spotify}</button></article><article class="audio-room-card youtube-card"><div class="youtube-thumb" aria-hidden="true"><span>▶</span></div><h3>${t.rapOrtCard}</h3><p>${t.rapOrtText}</p><a class="vh-button secondary" href="https://youtube.com/playlist?list=PLa1mFnbfhev615wCW-3Bi8Fz1kE0Maksq" target="_blank" rel="noopener noreferrer">${t.openYoutube}</a></article><article class="audio-room-card youtube-card"><div class="youtube-thumb" aria-hidden="true"><span>▶</span></div><h3>${t.sztabCard}</h3><p>${t.sztabText}</p><a class="vh-button secondary" href="https://youtu.be/JgV9KEZTbeM" target="_blank" rel="noopener noreferrer">${t.openYoutube}</a></article></div></div>`; document.querySelector(".sound-map-orbit")?.closest(".vh-section")?.after(section); }

  function createTimeJourneySection() {
    if (document.querySelector("[data-time-journey]")) return;
    const section = document.createElement("section"); section.className = "vh-section music-guided-section"; section.dataset.timeJourney = "true";
    const lists = lang === "pl" ? [["05",t.fiveTitle,t.fiveText,["Kurier Prawdy","LUSTRO / THE MIRROR","Press / Recognition"]],["20",t.twentyTitle,t.twentyText,["Audio Room","Rap-Ort playlist","SZTAB ORIGINS"]],["∞",t.fullTitle,t.fullText,["Rap-Ort","SZTAB","Dla instytucji"]]] : [["05",t.fiveTitle,t.fiveText,["Kurier Prawdy","LUSTRO / THE MIRROR","Press / Recognition"]],["20",t.twentyTitle,t.twentyText,["Audio Room","Rap-Ort playlist","SZTAB ORIGINS"]],["∞",t.fullTitle,t.fullText,["Rap-Ort","SZTAB","For Institutions"]]];
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.timeKicker}</p><h2 class="vh-section-title">${t.timeTitle}</h2><p class="vh-section-kicker">${t.timeLead}</p></div><div class="guided-journey-grid">${lists.map(([badge,title,text,items]) => `<article class="guided-journey-card"><span class="time-badge">${badge}</span><h3>${title}</h3><p>${text}</p><ol>${items.map((item,i)=>`<li><span>${i+1}</span>${item}</li>`).join("")}</ol></article>`).join("")}</div></div>`;
    document.querySelector("[data-audio-room]")?.after(section);
  }

  function createAudienceSection() {
    if (document.querySelector("[data-audience-paths]")) return;
    const section = document.createElement("section"); section.className = "vh-section music-guided-section"; section.dataset.audiencePaths = "true";
    const cards = [[t.listenerTitle,t.listenerText, lang === "pl" ? "/music/pl/#memory" : "/music/#memory"],[t.curatorTitle,t.curatorText, lang === "pl" ? "/press-recognition/pl/" : "/press-recognition/"],[t.institutionTitle,t.institutionText, lang === "pl" ? "/for-institutions/pl/" : "/for-institutions/"]];
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${t.audienceKicker}</p><h2 class="vh-section-title">${t.audienceTitle}</h2><p class="vh-section-kicker">${t.audienceLead}</p></div><div class="audience-path-grid">${cards.map(([title,text,href])=>`<article class="audience-path-card"><h3>${title}</h3><p>${text}</p><a class="vh-button secondary" href="${href}">${t.explore}</a></article>`).join("")}</div></div>`;
    findCollaborationSection()?.before(section);
  }

  function createFinalRibbon() {
    if (document.querySelector("[data-music-final-ribbon]")) return;
    const section = document.createElement("section"); section.className = "vh-section"; section.dataset.musicFinalRibbon = "true";
    const links = lang === "pl" ? [[t.listen,"https://open.spotify.com/artist/0df87MMIM1VOy2dR1DM2oF"],[t.enterRaport,"/rap-ort/pl/"],[t.discoverSztab,"/sztab/pl/"],[t.contact,"/contact/pl/"]] : [[t.listen,"https://open.spotify.com/artist/0df87MMIM1VOy2dR1DM2oF"],[t.enterRaport,"/rap-ort/"],[t.discoverSztab,"/sztab/"],[t.contact,"/contact/"]];
    section.innerHTML = `<div class="vh-wrap"><div class="music-final-ribbon reveal visible"><p class="vh-eyebrow">Sound Map</p><h2 class="vh-section-title">${t.finalTitle}</h2><p>${t.finalText}</p><div class="vh-actions">${links.map(([label,href])=>`<a class="vh-button secondary" href="${href}" ${href.startsWith("http") ? "target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${label}</a>`).join("")}</div></div></div>`;
    findCollaborationSection()?.after(section);
  }

  function setEmotionFilter(value, options = {}) { const filter = normalise(value || "all"); const cards = [...document.querySelectorAll(".track-document[data-emotions]")]; const buttons = [...document.querySelectorAll("[data-emotion-filter]")]; const status = document.querySelector("[data-emotion-status]"); let visible = 0; buttons.forEach((button) => { const active = normalise(button.dataset.emotionFilter) === filter; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); }); cards.forEach((card) => { const emotions = normalise(card.dataset.emotions).split(/\s+/).filter(Boolean); const show = filter === "all" || emotions.includes(filter); card.classList.toggle("is-filtered-out", !show); card.hidden = !show; if (show) visible += 1; }); if (status) { const activeLabel = buttons.find((button) => normalise(button.dataset.emotionFilter) === filter)?.textContent?.trim() || t.all; status.textContent = visible ? `${t.showing}: ${activeLabel}` : t.empty; } if (options.updateHash && filter !== "all") history.replaceState(null, "", `#${filter}`); if (options.updateHash && filter === "all" && location.hash) history.replaceState(null, "", location.pathname); }
  function setListeningPath(value) { const key = normalise(value || "memory"); const output = document.querySelector("[data-now-listening-output]"); const buttons = [...document.querySelectorAll("[data-listening-path]")]; const recommendations = paths[key] || paths.memory; buttons.forEach((button) => { const active = normalise(button.dataset.listeningPath) === key; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); }); if (output) output.innerHTML = recommendations.map((item, index) => `<li><span>${index + 1}</span><div><strong>${item.title}</strong><small>${item.reason}</small></div><a href="${item.href}">${t.explore}</a></li>`).join(""); }
  function loadEmbed(button) { const target = document.querySelector(button.dataset.loadEmbedTarget || ""); const src = button.dataset.embedSrc; const title = button.dataset.embedTitle || "Spotify player"; if (!target || !src || target.dataset.loaded === "true") return; const iframe = document.createElement("iframe"); iframe.src = src; iframe.title = title; iframe.loading = "lazy"; iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"; iframe.style.border = "0"; iframe.width = "100%"; iframe.height = "352"; target.replaceChildren(iframe); target.dataset.loaded = "true"; button.textContent = t.loaded; button.disabled = true; }

  document.addEventListener("click", (event) => { const emotionButton = event.target.closest("[data-emotion-filter]"); if (emotionButton) { const key = emotionButton.dataset.emotionFilter; setEmotionFilter(key, { updateHash: true }); if (key !== "all") setListeningPath(key); return; } const pathButton = event.target.closest("[data-listening-path]"); if (pathButton) { const key = pathButton.dataset.listeningPath; setListeningPath(key); setEmotionFilter(key, { updateHash: true }); return; } const embedButton = event.target.closest("[data-load-embed]"); if (embedButton) return loadEmbed(embedButton); });

  injectGuidedStyles(); markTrackCards(); createAudioRoom(); createTimeJourneySection(); createFilterSection(); createListeningPathSection(); createAudienceSection(); createFinalRibbon();
  const initialKey = hashToKey(location.hash) || "all"; setEmotionFilter(initialKey); setListeningPath(initialKey === "all" ? "memory" : initialKey); window.addEventListener("hashchange", () => { const key = hashToKey(location.hash) || "all"; setEmotionFilter(key); setListeningPath(key === "all" ? "memory" : key); });
})();
