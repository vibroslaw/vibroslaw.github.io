(() => {
  "use strict";

  const body = document.body;
  const html = document.documentElement;
  if (!body || window.__vhWorldConsole) return;
  const premium = body.classList.contains("page-home") || body.dataset.veritasPremium === "true";
  if (!premium) return;
  window.__vhWorldConsole = true;

  const isPl = body.dataset.lang === "pl" || html.lang === "pl";
  const routes = [
    ["veritas", isPl ? "/pl/" : "/", "Veritas", isPl ? "Próg / manifest" : "Threshold / manifesto", "/public/assets/heroes/veritas-humanum-hero.webp", "216,182,107"],
    ["raport", isPl ? "/rap-ort/pl/" : "/rap-ort/", "Rap-Ort", isPl ? "Raport / presja" : "Report / pressure", "/public/assets/heroes/rap-ort-hero.webp", "190,157,115"],
    ["sztab", isPl ? "/sztab/pl/" : "/sztab/", "SZTAB", isPl ? "Pamięć / animacja" : "Memory / animation", "/public/assets/heroes/sztab-hero.webp", "214,185,121"],
    ["between", isPl ? "/miedzy-wierszami/" : "/between-the-lines/", isPl ? "Między Wierszami" : "Between", isPl ? "Głos / cisza" : "Voice / silence", "/public/assets/heroes/between-the-lines-hero.webp", "174,159,139"],
    ["music", isPl ? "/music/pl/" : "/music/", isPl ? "Muzyka" : "Music", isPl ? "Atlas emocji" : "Emotional atlas", "/public/assets/heroes/music-hero.webp", "96,158,198"],
  ];

  const t = isPl ? {
    world: "Świat", sound: "Dźwięk", cinema: "Kino", open: "Konsola", menu: "Menu", top: "Góra", listen: "Dźwięk", ready: "Gotowy", muted: "Wyciszony", active: "Aktywny", off: "Muzyka", on: "Kinowy", standard: "Standard", reduced: "Ruch ograniczony"
  } : {
    world: "World", sound: "Sound", cinema: "Cinema", open: "Console", menu: "Menu", top: "Top", listen: "Sound", ready: "Ready", muted: "Muted", active: "Active", off: "Music", on: "Cinematic", standard: "Standard", reduced: "Motion reduced"
  };

  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const reduced = () => body.classList.contains("reduce-motion") || body.classList.contains("reduced-motion") || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const cinematic = () => body.classList.contains("cinematic-mode") || html.dataset.experience === "cinematic";
  const soundState = () => body.classList.contains("sound-signature-muted") ? [t.muted, "muted"] : body.classList.contains("sound-signature-playing") ? [t.active, "active"] : document.getElementById("sound-signature") ? [t.ready, "ready"] : [t.off, "off"];
  const cinemaState = () => reduced() ? [t.reduced, "reduced"] : cinematic() ? [t.on, "active"] : [t.standard, "off"];
  const currentRoute = () => routes.find(([key, href]) => key !== "veritas" && location.pathname.startsWith(href.replace(/\/$/, ""))) || routes[0];

  function routeCard([key, href, label, status, image, accent]) {
    const active = currentRoute()[0] === key;
    return `<a class="vh-world-console__route" href="${escape(href)}" style="--world-image:url('${escape(image)}');--world-accent:${accent}"${active ? ' aria-current="page"' : ""}><small>${escape(status)}</small><strong>${escape(label)}</strong><em>${escape(isPl ? "Kontynuuj ścieżkę" : "Continue path")}</em></a>`;
  }

  function createConsole() {
    if (document.querySelector("[data-vh-world-console]")) return;
    const current = currentRoute();
    const [soundLabel, soundKind] = soundState();
    const [cinemaLabel, cinemaKind] = cinemaState();
    const aside = document.createElement("aside");
    aside.className = "vh-world-console";
    aside.dataset.vhWorldConsole = "true";
    aside.innerHTML = `<div class="vh-world-console__bar"><button type="button" data-vh-console-open><span>${t.world}</span><strong data-vh-console-world>${escape(current[2])}</strong></button><button type="button" data-vh-console-sound data-state="${soundKind}"><span>${t.sound}</span><strong>${escape(soundLabel)}</strong></button><button type="button" data-vh-console-cinema data-state="${cinemaKind}"><span>${t.cinema}</span><strong>${escape(cinemaLabel)}</strong></button><button class="vh-world-console__toggle" type="button" data-vh-console-open aria-expanded="false" aria-label="${escape(t.open)}">+</button></div><div class="vh-world-console__panel" hidden><nav class="vh-world-console__grid" aria-label="${escape(t.open)}">${routes.map(routeCard).join("")}</nav></div>`;
    document.body.appendChild(aside);

    const dock = document.createElement("div");
    dock.className = "vh-world-mobile-dock";
    dock.dataset.vhWorldMobileDock = "true";
    dock.innerHTML = `<button type="button" data-vh-mobile-menu>${t.menu}</button><button type="button" data-vh-console-sound>${t.listen}</button><button type="button" data-vh-mobile-cinema>${t.cinema}</button>`;
    document.body.appendChild(dock);
  }

  function sync() {
    const current = currentRoute();
    const [soundLabel, soundKind] = soundState();
    const [cinemaLabel, cinemaKind] = cinemaState();
    const world = document.querySelector("[data-vh-console-world]");
    if (world) world.textContent = current[2];
    document.querySelectorAll("[data-vh-console-sound]").forEach((button) => { button.dataset.state = soundKind; const label = button.querySelector("strong"); if (label) label.textContent = soundLabel; });
    document.querySelectorAll("[data-vh-console-cinema]").forEach((button) => { button.dataset.state = cinemaKind; const label = button.querySelector("strong"); if (label) label.textContent = cinemaLabel; });
  }

  function togglePanel() {
    const panel = document.querySelector(".vh-world-console__panel");
    const toggles = document.querySelectorAll("[data-vh-console-open]");
    if (!panel) return;
    panel.hidden = !panel.hidden;
    toggles.forEach((button) => button.setAttribute("aria-expanded", String(!panel.hidden)));
  }

  function toggleCinema() {
    const existing = document.getElementById("cinematicToggle") || document.querySelector("[data-cinematic-toggle]");
    if (existing) existing.click();
    else body.classList.toggle("cinematic-mode");
    window.setTimeout(sync, 80);
  }

  function openSound() {
    const section = document.getElementById("sound-signature") || document.querySelector(".music-signature-room");
    if (section) section.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
    document.querySelector("[data-sound-signature-toggle], [data-music-signature-toggle]")?.click();
    window.setTimeout(sync, 120);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-vh-console-open]")) { event.preventDefault(); togglePanel(); return; }
    if (event.target.closest("[data-vh-console-sound]")) { event.preventDefault(); openSound(); return; }
    if (event.target.closest("[data-vh-console-cinema], [data-vh-mobile-cinema]")) { event.preventDefault(); if (window.scrollY > 260 && cinematic()) window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }); else toggleCinema(); return; }
    if (event.target.closest("[data-vh-mobile-menu]")) { event.preventDefault(); window.toggleMobileMenu?.(); document.querySelector(".desktop-menu-toggle")?.click(); }
  }, true);

  createConsole();
  sync();
  new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("site:cinematic-change", sync);
  document.addEventListener("site:reduced-motion-change", sync);
})();
