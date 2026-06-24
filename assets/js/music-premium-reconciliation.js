(() => {
  "use strict";

  const root = document.querySelector("body.page-music");
  if (!root || window.__vhMusicPremiumReconciliation) return;
  window.__vhMusicPremiumReconciliation = true;
  root.classList.add("music-premium-reconciled");

  const isPl = root.dataset.lang === "pl";
  const musicPath = isPl ? "/music/pl/" : "/music/";
  const personalId = "22ClWy51TIpXxGzN7L0Aja";
  const personalUrl = "https://open.spotify.com/playlist/22ClWy51TIpXxGzN7L0Aja?si=CylRWaWYQZmG-99ZJThOLA";
  let activeEmotion = "personal";
  let muted = false;

  const text = isPl ? {
    atlasKicker: "Atlas emocji",
    atlasTitle: "Wybierz emocje jako pierwsze wejscie",
    atlasLead: "Muzyka dziala tu jak mapa: wybierz wspolrzedna emocji, a strona dopasuje pokoj odsluchu, dokumenty i sciezke.",
    atlasRoom: "Pokoj odsluchu",
    first: "Pierwsze wejscie",
    packsKicker: "Pakiety instytucjonalne",
    packsTitle: "Muzyka dla pokazow i instytucji",
    packsLead: "Gotowe konteksty uzycia: intro przed pokazem, petla foyer i domkniecie rozmowy.",
    inquiry: "Zapytaj o pakiet",
    tech: "Licencja zalezy od miejsca, czasu, medium, terytorium i zakresu uzycia.",
    mini: "Teraz sluchasz",
    ready: "Gotowe po kliknieciu",
    load: "Zaladuj",
    pause: "Pauza",
    mute: "Wycisz",
    unmute: "Dzwiek",
    muted: "Wyciszone",
    prev: "Poprzednia",
    next: "Nastepna",
    signature: "Uslysz swiat",
    signatureLead: "Kompaktowa warstwa sygnatury. Bez autoplay. Spotify laduje sie dopiero po kliknieciu.",
  } : {
    atlasKicker: "Emotional atlas",
    atlasTitle: "Choose emotion as the first instrument",
    atlasLead: "Music behaves like a map here: choose an emotional coordinate and the page aligns the listening room, documents and path.",
    atlasRoom: "Listening room",
    first: "First listen",
    packsKicker: "Institutional listening packs",
    packsTitle: "Music for screenings and institutions",
    packsLead: "Ready use contexts: screening intro, foyer loop and discussion closer.",
    inquiry: "Inquire about this pack",
    tech: "License depends on venue, duration, medium, territory and usage scope.",
    mini: "Now listening path",
    ready: "Ready after your click",
    load: "Load",
    pause: "Pause",
    mute: "Mute",
    unmute: "Sound",
    muted: "Muted",
    prev: "Previous",
    next: "Next",
    signature: "Hear the world",
    signatureLead: "A compact signature layer. No autoplay. Spotify loads only after your click.",
  };

  const emotions = {
    memory: [isPl ? "Pamiec" : "Memory", "VH-EMO-01", "0xv8YgWzwwY7VtER506P1Z", "/public/assets/music/playlists/memory-window.webp", "12%", "20%", "216,182,107", isPl ? "Swiadectwo, historia i echo tego, co zostaje." : "Witness, history and the echo of what remains.", "Kurier Prawdy"],
    conscience: [isPl ? "Sumienie" : "Conscience", "VH-EMO-02", "46B6jvmQkPM33LV28w4UvV", "/public/assets/music/playlists/conscience-window.webp", "48%", "10%", "190,157,115", isPl ? "Prawda, wybor, presja moralna." : "Truth, choice and moral pressure.", "Rap-Ort"],
    resistance: [isPl ? "Opor" : "Resistance", "VH-EMO-03", "6R2zp276q7G9z9IJZMWxqU", "/public/assets/music/playlists/resistance-window.webp", "82%", "25%", "214,185,121", isPl ? "Odmowa, przetrwanie i energia." : "Refusal, survival and energy.", "Unbroken"],
    identity: [isPl ? "Tozsamosc" : "Identity", "VH-EMO-04", "4Ml3373UqCDgQEdr0m6SoH", "/public/assets/music/playlists/identity-window.webp", "18%", "72%", "146,191,222", isPl ? "Jezyk, przynaleznosc i szukanie siebie." : "Language, belonging and the search for self.", "LUSTRO / THE MIRROR"],
    resilience: [isPl ? "Odpornosc" : "Resilience", "VH-EMO-05", "6FNzNCjmvmGwpibLLDNufr", "/public/assets/music/playlists/resilience-window.webp", "58%", "78%", "201,178,143", isPl ? "Odbudowa, wewnetrzny ogien i powrot." : "Rebuilding, inner fire and return.", "Equilibrium"],
    personal: [isPl ? "Osobiste / filmowe" : "Personal / Cinematic", "VH-EMO-06", personalId, "/public/assets/music/playlists/personal-cinematic-window.webp", "86%", "67%", "96,158,198", isPl ? "Filmowe wejscie w emocje i osobisty klimat." : "A cinematic entry into emotion and personal atmosphere.", "Campus Ignis"],
  };
  const order = Object.keys(emotions);

  const packs = [
    ["conscience", "MIP-01", isPl ? "Intro przed pokazem" : "Screening intro", "3-5 min", isPl ? "Krotkie wejscie przed seansem, prezentacja albo blokiem dokumentalnym." : "A short entry before a screening, presentation or documentary block."],
    ["memory", "MIP-02", isPl ? "Petla foyer" : "Foyer loop", "12-20 min", isPl ? "Cichy puls do przestrzeni wejsciowej, wystawy albo recepcji." : "A quiet pulse for an entrance space, exhibition or reception."],
    ["resilience", "MIP-03", isPl ? "Domkniecie rozmowy" : "Discussion closer", "4-8 min", isPl ? "Po Q&A, panelu lub lekcji, kiedy publicznosc potrzebuje chwili powrotu." : "After a Q&A, panel or lesson when the audience needs a moment of return."],
  ];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function emotion(key) { return emotions[key] || emotions.personal; }
  function activeData() { return emotion(activeEmotion); }

  function featuredSection() {
    return $$(".vh-section").find((section) => /Selected sound documents|Dokumenty d/i.test(section.textContent || ""));
  }

  function collaborationSection() {
    return $$(".vh-section").find((section) => /Music use \/ collaboration|Wykorzystanie muzyki/i.test(section.textContent || ""));
  }

  function setActive(key, updateHash = false) {
    activeEmotion = emotions[key] ? key : "personal";
    const data = activeData();
    document.documentElement.style.setProperty("--music-premium-active", data[6]);
    $$('[data-music-premium-emotion]').forEach((button) => {
      const active = button.dataset.musicPremiumEmotion === activeEmotion;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const detail = $("[data-music-atlas-detail]");
    if (detail) {
      detail.innerHTML = `<small>${escape(data[1])}</small><h3>${escape(data[0])}</h3><p>${escape(data[7])}</p><p><strong>${escape(text.first)}:</strong> ${escape(data[8])}</p><div class="vh-actions"><button class="vh-button secondary" type="button" data-music-premium-load>${escape(text.load)}</button><a class="vh-button secondary" href="${escape(key === "personal" ? personalUrl : `https://open.spotify.com/playlist/${data[2]}`)}" target="_blank" rel="noopener noreferrer">Spotify</a></div>`;
    }
    const mini = $("[data-music-mini-controller]");
    if (mini) {
      mini.style.setProperty("--mini-image", `url('${data[3]}')`);
      $("[data-mini-title]", mini).textContent = data[0];
      $("[data-mini-copy]", mini).textContent = data[7];
      $("[data-mini-open]", mini).href = key === "personal" ? personalUrl : `https://open.spotify.com/playlist/${data[2]}`;
      $("[data-mini-status]", mini).textContent = muted ? text.muted : text.ready;
    }
    patchPersonalLinks();
    if (updateHash) history.replaceState(null, "", `${musicPath}#${activeEmotion}`);
  }

  function createAtlas() {
    if ($("[data-music-premium-atlas]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-premium-atlas";
    section.dataset.musicPremiumAtlas = "true";
    section.id = "emotion-atlas";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${escape(text.atlasKicker)}</p><h2 class="vh-section-title">${escape(text.atlasTitle)}</h2><p class="vh-section-kicker">${escape(text.atlasLead)}</p></div><div class="music-atlas-shell"><div class="music-atlas-map">${order.map((key) => { const item = emotion(key); return `<button class="music-atlas-node" type="button" data-music-premium-emotion="${key}" aria-pressed="false" style="--node-x:${item[4]};--node-y:${item[5]};--node-accent:${item[6]};--node-image:url('${item[3]}')"><small>${escape(item[1])}</small><strong>${escape(item[0])}</strong><span>${escape(item[7])}</span></button>`; }).join("")}</div><article class="music-atlas-detail" data-music-atlas-detail></article></div></div>`;
    const audioRoom = $("[data-audio-room]")?.closest(".vh-section") || $("#playlists") || featuredSection();
    (audioRoom || document.querySelector("main")).before(section);
  }

  function createPacks() {
    if ($("[data-music-institutional-packs]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-institutional-packs";
    section.dataset.musicInstitutionalPacks = "true";
    section.id = "institutional-packs";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-section-head reveal visible"><p class="vh-eyebrow">${escape(text.packsKicker)}</p><h2 class="vh-section-title">${escape(text.packsTitle)}</h2><p class="vh-section-kicker">${escape(text.packsLead)}</p></div><div class="music-institutional-grid">${packs.map(([key, code, title, duration, desc]) => `<article class="institutional-pack-card"><small>${escape(code)}</small><h3>${escape(title)}</h3><p>${escape(desc)}</p><dl><div><dt>${isPl ? "Czas" : "Duration"}</dt><dd>${escape(duration)}</dd></div><div><dt>${isPl ? "Ton" : "Tone"}</dt><dd>${escape(emotion(key)[0])}</dd></div></dl><p>${escape(text.tech)}</p><div class="vh-actions"><a class="vh-button secondary" href="mailto:peter.lichwala@gmail.com?subject=${encodeURIComponent(title + " - Vibroslaw music pack")}">${escape(text.inquiry)}</a></div></article>`).join("")}</div></div>`;
    (collaborationSection() || document.querySelector("main")).before(section);
  }

  function createMiniController() {
    if ($("[data-music-mini-controller]")) return;
    const aside = document.createElement("aside");
    aside.className = "music-mini-controller";
    aside.dataset.musicMiniController = "true";
    aside.setAttribute("aria-live", "polite");
    aside.innerHTML = `<p>${escape(text.mini)}</p><strong data-mini-title></strong><span data-mini-copy></span><div class="mini-wave" aria-hidden="true">${Array.from({ length: 12 }, (_, index) => `<span style="--i:${index}"></span>`).join("")}</div><p data-mini-status>${escape(text.ready)}</p><div class="mini-controller-actions"><button type="button" data-mini-prev>${escape(text.prev)}</button><button type="button" data-mini-load>${escape(text.load)}</button><button type="button" data-mini-pause>${escape(text.pause)}</button><button type="button" data-mini-mute aria-pressed="false">${escape(text.mute)}</button></div><a data-mini-open target="_blank" rel="noopener noreferrer">Spotify</a>`;
    document.body.appendChild(aside);
  }

  function createSignatureRoom() {
    if ($("[data-music-signature-room]")) return;
    const section = document.createElement("section");
    section.className = "vh-section music-signature-room";
    section.dataset.musicSignatureRoom = "true";
    section.innerHTML = `<div class="vh-wrap"><div class="vh-card reveal visible"><p class="vh-eyebrow">Sound Signature</p><h2 class="vh-section-title">${escape(text.signature)}</h2><p>${escape(text.signatureLead)}</p><div class="vh-actions"><button class="vh-button secondary" type="button" data-music-signature-toggle>${escape(text.signature)}</button><button class="vh-button secondary" type="button" data-music-signature-pause>${escape(text.pause)}</button><button class="vh-button secondary" type="button" data-music-signature-mute aria-pressed="false">${escape(text.mute)}</button></div><div class="vh-sound-signature__embed" data-music-signature-embed aria-live="polite">Spotify</div></div></div>`;
    const firstSection = $("[data-audio-room]")?.closest(".vh-section") || featuredSection();
    firstSection?.before(section);
  }

  function enhanceMiniNav() {
    const nav = $("[data-music-mini-nav] .music-mini-nav-inner");
    if (!nav || nav.querySelector('a[href="#institutional-packs"]')) return;
    const link = document.createElement("a");
    link.href = "#institutional-packs";
    link.textContent = isPl ? "Pakiety" : "Packs";
    nav.appendChild(link);
  }

  function patchPersonalLinks() {
    if (activeEmotion !== "personal") return;
    const open = $("[data-playlist-open]");
    if (open) open.href = personalUrl;
    const mini = $("[data-mini-open]");
    if (mini) mini.href = personalUrl;
  }

  function loadActive() {
    if (muted) { pause(text.muted); return; }
    const current = activeData();
    const load = $("[data-load-playlist]");
    if (load) {
      load.dataset.playlist = activeEmotion;
      load.click();
      window.setTimeout(patchIframes, 250);
      return;
    }
    loadEmbed($("[data-music-signature-embed]"), current[2], current[0]);
  }

  function loadEmbed(target, id, label) {
    if (!target || muted) { pause(text.muted); return; }
    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}?utm_source=generator`;
    iframe.title = `Spotify playlist - ${label}`;
    iframe.loading = "lazy";
    iframe.allow = "clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.width = "100%";
    iframe.height = "352";
    target.replaceChildren(iframe);
    root.classList.add("sound-signature-playing");
  }

  function pause(message = text.ready) {
    const room = $("#spotifyPlaylistRoom");
    if (room) { room.classList.remove("is-loading", "is-loaded"); room.dataset.loaded = "false"; room.replaceChildren(Object.assign(document.createElement("span"), { textContent: message })); }
    const signature = $("[data-music-signature-embed]");
    if (signature) signature.textContent = message;
    const load = $("[data-load-playlist]");
    if (load) { load.disabled = false; load.textContent = isPl ? "Zaladuj playliste Spotify" : "Load Spotify playlist"; }
    const miniStatus = $("[data-mini-status]");
    if (miniStatus) miniStatus.textContent = message;
    root.classList.remove("sound-signature-playing");
  }

  function setMuted(next) {
    muted = next;
    root.classList.toggle("sound-signature-muted", muted);
    $$('[data-mini-mute], [data-music-signature-mute]').forEach((button) => { button.setAttribute("aria-pressed", String(muted)); button.textContent = muted ? text.unmute : text.mute; });
    if (muted) pause(text.muted);
    else { const miniStatus = $("[data-mini-status]"); if (miniStatus) miniStatus.textContent = text.ready; }
  }

  function step(offset) {
    const index = Math.max(0, order.indexOf(activeEmotion));
    const next = order[(index + offset + order.length) % order.length];
    setActive(next, true);
    const matching = document.querySelector(`[data-playlist-key="${next}"], [data-emotion-filter="${next}"], [data-listening-path="${next}"]`);
    matching?.click();
  }

  function patchIframes() {
    $$('iframe[src*="open.spotify.com/embed/playlist/"]').forEach((iframe) => {
      iframe.allow = "clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      if (activeEmotion === "personal") iframe.src = `https://open.spotify.com/embed/playlist/${personalId}?utm_source=generator`;
    });
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const emotionButton = event.target.closest?.("[data-music-premium-emotion]");
      if (emotionButton) { setActive(emotionButton.dataset.musicPremiumEmotion, true); document.querySelector(`[data-playlist-key="${activeEmotion}"], [data-emotion-filter="${activeEmotion}"], [data-listening-path="${activeEmotion}"]`)?.click(); return; }
      if (event.target.closest?.("[data-music-premium-load], [data-mini-load]")) { event.preventDefault(); loadActive(); return; }
      if (event.target.closest?.("[data-mini-prev]")) { event.preventDefault(); step(-1); return; }
      if (event.target.closest?.("[data-mini-next]")) { event.preventDefault(); step(1); return; }
      if (event.target.closest?.("[data-mini-pause], [data-music-signature-pause]")) { event.preventDefault(); pause(); return; }
      if (event.target.closest?.("[data-mini-mute], [data-music-signature-mute]")) { event.preventDefault(); setMuted(!muted); return; }
      if (event.target.closest?.("[data-music-signature-toggle]")) { event.preventDefault(); loadEmbed($("[data-music-signature-embed]"), activeData()[2], activeData()[0]); }
    }, true);

    document.addEventListener("click", () => requestAnimationFrame(() => { activeEmotion = document.querySelector("[data-playlist-key].is-active")?.dataset.playlistKey || document.querySelector("[data-emotion-filter].is-active")?.dataset.emotionFilter || activeEmotion; setActive(activeEmotion); patchIframes(); }));
    new MutationObserver(patchIframes).observe(document.body, { childList: true, subtree: true });
  }

  createAtlas();
  createSignatureRoom();
  createPacks();
  createMiniController();
  enhanceMiniNav();
  bind();
  const hash = location.hash.replace(/^#/, "");
  setActive(emotions[hash] ? hash : "personal");
  patchIframes();
})();
