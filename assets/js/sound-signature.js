(() => {
  "use strict";

  const body = document.body;
  if (!body || window.__vhSoundSignature) return;
  const premium = body.classList.contains("page-home") || body.dataset.veritasPremium === "true";
  if (!premium) return;
  window.__vhSoundSignature = true;

  const isPl = body.dataset.lang === "pl";
  const copy = isPl ? {
    open: "Uslysz swiat", title: "Sound Signature", lead: "Warstwa dzwieku jest opcjonalna. Spotify laduje sie dopiero po kliknieciu.", load: "Zaladuj", pause: "Pauza", mute: "Wycisz", unmute: "Dzwiek", muted: "Wyciszone", ready: "Wybierz karte"
  } : {
    open: "Hear the world", title: "Sound Signature", lead: "The sound layer is optional. Spotify loads only after your click.", load: "Load", pause: "Pause", mute: "Mute", unmute: "Sound", muted: "Muted", ready: "Choose a card"
  };

  const cards = [
    ["veritas", "Veritas", isPl ? "Prog / manifest" : "Threshold / manifesto", "0xv8YgWzwwY7VtER506P1Z", "/public/assets/heroes/veritas-humanum-hero.webp", "216,182,107"],
    ["raport", "Rap-Ort", isPl ? "Raport / swiadectwo / presja" : "Report / testimony / pressure", "46B6jvmQkPM33LV28w4UvV", "/public/assets/heroes/rap-ort-hero.webp", "190,157,115"],
    ["sztab", "SZTAB", isPl ? "Pamiec / animacja / puls historii" : "Memory / animation / historical pulse", "0xv8YgWzwwY7VtER506P1Z", "/public/assets/heroes/sztab-hero.webp", "214,185,121"],
    ["between", isPl ? "Miedzy Wierszami" : "Between", isPl ? "Glos / cisza / intymnosc" : "Voice / silence / intimacy", "4Ml3373UqCDgQEdr0m6SoH", "/public/assets/heroes/between-the-lines-hero.webp", "174,159,139"],
    ["music", isPl ? "Muzyka" : "Music", isPl ? "Atlas emocji" : "Emotional atlas", "22ClWy51TIpXxGzN7L0Aja", "/public/assets/heroes/music-hero.webp", "96,158,198"],
  ];

  let muted = false;
  let active = null;
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function cardHtml([key, label, tone, id, image, accent]) {
    return `<article class="vh-sound-card" style="--sound-image:url('${escape(image)}');--sound-accent:${accent}"><small>${escape(tone)}</small><h3>${escape(label)}</h3><p>${escape(isPl ? "Kuratorowana karta dzwieku swiata." : "Curated world sound card.")}</p><button type="button" data-sound-load="${escape(key)}" data-playlist-id="${escape(id)}">${escape(copy.load)}</button></article>`;
  }

  function create() {
    if (document.getElementById("sound-signature")) return;
    const section = document.createElement("section");
    section.id = "sound-signature";
    section.className = "vh-section vh-sound-signature";
    section.innerHTML = `<div class="vh-wrap"><button class="vh-sound-signature__button" type="button" data-sound-signature-toggle aria-expanded="false">${escape(copy.open)}</button><div class="vh-sound-signature__panel" hidden><div class="vh-sound-signature__head"><div><h2>${escape(copy.title)}</h2><p>${escape(copy.lead)}</p></div><div class="vh-sound-signature__controls"><button type="button" data-sound-pause>${escape(copy.pause)}</button><button type="button" data-sound-mute aria-pressed="false">${escape(copy.mute)}</button></div></div><div class="vh-sound-signature__grid">${cards.map(cardHtml).join("")}</div><div class="vh-sound-signature__embed" data-sound-embed aria-live="polite">${escape(copy.ready)}</div></div></div>`;
    const hero = document.querySelector(".vh-hero");
    hero?.after(section);
  }

  function setState(state) {
    body.classList.toggle("sound-signature-playing", state === "playing");
    body.classList.toggle("sound-signature-muted", muted);
    document.dispatchEvent(new CustomEvent("site:sound-signature-change", { detail: { state, muted, active } }));
  }

  function pause(message) {
    const embed = document.querySelector("[data-sound-embed]");
    if (embed) embed.textContent = message || copy.ready;
    active = null;
    setState("paused");
  }

  function load(button) {
    if (!button) return;
    if (muted) { pause(copy.muted); return; }
    const id = button.dataset.playlistId;
    active = button.dataset.soundLoad;
    const embed = document.querySelector("[data-sound-embed]");
    if (!embed || !id) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}?utm_source=generator`;
    iframe.title = `Spotify playlist - ${active}`;
    iframe.loading = "lazy";
    iframe.allow = "clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.width = "100%";
    iframe.height = "352";
    embed.replaceChildren(iframe);
    setState("playing");
  }

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest?.("[data-sound-signature-toggle]");
    if (toggle) {
      const panel = document.querySelector(".vh-sound-signature__panel");
      if (!panel) return;
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) panel.scrollIntoView({ behavior: body.classList.contains("reduce-motion") ? "auto" : "smooth", block: "start" });
      return;
    }
    const loadButton = event.target.closest?.("[data-sound-load]");
    if (loadButton) { event.preventDefault(); load(loadButton); return; }
    if (event.target.closest?.("[data-sound-pause]")) { event.preventDefault(); pause(); return; }
    const mute = event.target.closest?.("[data-sound-mute]");
    if (mute) {
      event.preventDefault();
      muted = !muted;
      mute.setAttribute("aria-pressed", String(muted));
      mute.textContent = muted ? copy.unmute : copy.mute;
      if (muted) pause(copy.muted);
      setState(muted ? "muted" : "ready");
    }
  }, true);

  create();
})();
