(() => {
  "use strict";

  const body = document.body;
  if (!body || window.__vhWorldSignatures) return;
  const premium = body.classList.contains("page-home") || body.dataset.veritasPremium === "true";
  if (!premium) return;
  window.__vhWorldSignatures = true;

  const lang = body.dataset.lang === "pl" ? "pl" : "en";
  const labels = {
    veritas: lang === "pl" ? "threshold light / manifest" : "threshold light / manifesto",
    raport: lang === "pl" ? "raport / presja" : "report / pressure",
    sztab: lang === "pl" ? "archiwum / puls pamieci" : "archive / memory pulse",
    between: lang === "pl" ? "glos / cisza" : "voice / silence",
    music: lang === "pl" ? "atlas emocji" : "emotional atlas",
  };

  function detectWorld(value) {
    const text = String(value || "").toLowerCase();
    if (text.includes("rap-ort") || text.includes("prawda-sumienia")) return "raport";
    if (text.includes("sztab")) return "sztab";
    if (text.includes("between") || text.includes("miedzy") || text.includes("wiersz")) return "between";
    if (text.includes("music") || text.includes("muzyk")) return "music";
    return "veritas";
  }

  function addBadge(target, text, className) {
    if (!target || target.querySelector(`.${className}`)) return;
    const badge = document.createElement("span");
    badge.className = className;
    badge.textContent = text;
    target.prepend(badge);
  }

  function enhanceCards() {
    document.querySelectorAll(".world-portal-card").forEach((card) => {
      const href = card.querySelector("a[href]")?.getAttribute("href") || card.textContent;
      const world = detectWorld(href);
      card.dataset.worldSignature = world;
      addBadge(card, labels[world], "vh-premium-card-signature");
    });
  }

  function enhanceHero() {
    const heroCopy = document.querySelector(".vh-hero-copy");
    const text = lang === "pl" ? "authorial world signature" : "authorial world signature";
    addBadge(heroCopy, text, "vh-premium-world-badge");
  }

  document.documentElement.dataset.veritasPremium = "true";
  body.classList.add("veritas-premium-world");
  enhanceHero();
  enhanceCards();
  document.addEventListener("DOMContentLoaded", () => { enhanceHero(); enhanceCards(); }, { once: true });
})();
