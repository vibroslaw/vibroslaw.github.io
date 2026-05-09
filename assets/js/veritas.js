(() => {
  "use strict";

  const body = document.body;
  const isPolish = document.documentElement.lang === "pl" || body?.dataset.lang === "pl";

  const injectRuntimeStyles = () => {
    const previous = document.getElementById("veritasRuntimeFixes");
    if (previous) previous.remove();

    const style = document.createElement("style");
    style.id = "veritasRuntimeFixes";
    style.textContent = `
      /* Final Veritas visual polish: nav, hero visibility, controls, menu */
      body.navbar-unified .site-header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9990 !important;
        background:
          linear-gradient(180deg, rgba(5,4,3,.86), rgba(5,4,3,.50) 72%, rgba(5,4,3,.16)) !important;
        border-bottom: 1px solid rgba(201,178,143,.14) !important;
        box-shadow: 0 18px 42px rgba(0,0,0,.18) !important;
        backdrop-filter: blur(20px) saturate(118%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(118%) !important;
        overflow: visible !important;
      }
      body.navbar-unified .header-inner {
        min-height: 68px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 16px !important;
      }
      body.navbar-unified .brand {
        display: inline-flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        color: var(--vh-ivory, #f1eadb) !important;
        text-decoration: none !important;
        min-width: 0 !important;
        flex: 0 1 auto !important;
      }
      body.navbar-unified .brand-name {
        font-family: var(--font-display, Georgia, serif) !important;
        font-size: clamp(.70rem, .78vw, .88rem) !important;
        letter-spacing: .14em !important;
        text-transform: uppercase !important;
        white-space: nowrap !important;
        line-height: 1.05 !important;
      }
      body.navbar-unified .brand-sub-desktop,
      body.navbar-unified .brand-sub-mobile {
        color: rgba(241,234,219,.50) !important;
        font-size: .56rem !important;
        letter-spacing: .15em !important;
        text-transform: uppercase !important;
        margin-top: 4px !important;
        white-space: nowrap !important;
      }
      body.navbar-unified .brand-sub-mobile { display: none !important; }
      body.navbar-unified .desktop-nav-compact {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: clamp(1px, .2vw, 5px) !important;
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }
      body.navbar-unified .desktop-nav-compact .nav-button,
      body.navbar-unified .desktop-nav-compact .lang-switch a,
      body.navbar-unified .desktop-menu-toggle {
        position: relative !important;
        min-height: 34px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 0 !important;
        border-radius: 0 !important;
        padding: 0 clamp(4px, .52vw, 8px) !important;
        color: rgba(241,234,219,.70) !important;
        background: transparent !important;
        box-shadow: none !important;
        text-decoration: none !important;
        text-transform: uppercase !important;
        letter-spacing: .075em !important;
        font-size: clamp(.49rem, .54vw, .62rem) !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        transform-origin: center !important;
        transition: color .24s ease, transform .24s cubic-bezier(.2,.7,.2,1), letter-spacing .24s ease !important;
      }
      body.navbar-unified .desktop-nav-compact .nav-button::after,
      body.navbar-unified .desktop-nav-compact .lang-switch a::after {
        content: "" !important;
        position: absolute !important;
        left: 50% !important;
        bottom: 3px !important;
        width: 0 !important;
        height: 2px !important;
        transform: translateX(-50%) !important;
        border-radius: 999px !important;
        background:
          linear-gradient(90deg,
            rgba(208,173,104,0),
            rgba(208,173,104,.54) 16%,
            rgba(241,234,219,.86) 50%,
            rgba(208,173,104,.54) 84%,
            rgba(208,173,104,0)
          ) !important;
        filter: drop-shadow(0 0 7px rgba(208,173,104,.18)) !important;
        opacity: 0 !important;
        transition: width .28s cubic-bezier(.2,.7,.2,1), opacity .22s ease !important;
      }
      body.navbar-unified .desktop-nav-compact .nav-button:hover,
      body.navbar-unified .desktop-nav-compact .nav-button:focus-visible,
      body.navbar-unified .desktop-nav-compact .nav-button.is-active,
      body.navbar-unified .desktop-nav-compact .nav-button.active,
      body.navbar-unified .desktop-nav-compact .lang-switch a:hover,
      body.navbar-unified .desktop-nav-compact .lang-switch a:focus-visible,
      body.navbar-unified .desktop-nav-compact .lang-switch a.active {
        color: var(--vh-ivory, #f1eadb) !important;
        background: transparent !important;
        box-shadow: none !important;
        transform: translateY(-1px) scale(1.075) !important;
        letter-spacing: .095em !important;
        outline: none !important;
      }
      body.navbar-unified .desktop-nav-compact .nav-button:hover::after,
      body.navbar-unified .desktop-nav-compact .nav-button:focus-visible::after,
      body.navbar-unified .desktop-nav-compact .nav-button.is-active::after,
      body.navbar-unified .desktop-nav-compact .nav-button.active::after,
      body.navbar-unified .desktop-nav-compact .lang-switch a:hover::after,
      body.navbar-unified .desktop-nav-compact .lang-switch a:focus-visible::after,
      body.navbar-unified .desktop-nav-compact .lang-switch a.active::after {
        width: calc(100% - 8px) !important;
        opacity: 1 !important;
      }
      body.navbar-unified .desktop-nav-compact .lang-switch {
        display: inline-flex !important;
        align-items: center !important;
        gap: 2px !important;
        margin-left: 2px !important;
        padding-left: 7px !important;
        border-left: 1px solid rgba(201,178,143,.16) !important;
      }
      body.navbar-unified .desktop-nav-compact .lang-switch span {
        color: rgba(241,234,219,.24) !important;
        font-size: .64rem !important;
      }
      body.navbar-unified .desktop-menu-toggle {
        width: 40px !important;
        min-width: 40px !important;
        padding: 0 !important;
        flex-direction: column !important;
        gap: 5px !important;
        border: 1px solid rgba(201,178,143,.20) !important;
        border-radius: 999px !important;
        background: rgba(255,255,255,.025) !important;
        cursor: pointer !important;
      }
      body.navbar-unified .desktop-menu-toggle:hover,
      body.navbar-unified .desktop-menu-toggle:focus-visible {
        border-color: rgba(201,178,143,.44) !important;
        background: rgba(208,173,104,.08) !important;
        transform: translateY(-1px) scale(1.05) !important;
        outline: none !important;
      }
      body.navbar-unified .desktop-menu-toggle span {
        width: 17px !important;
        height: 1.5px !important;
        border-radius: 999px !important;
        background: currentColor !important;
        display: block !important;
      }

      body.navbar-unified .mobile-menu-overlay {
        position: fixed !important;
        inset: 0 !important;
        z-index: 10050 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        background:
          radial-gradient(circle at 78% 18%, rgba(208,173,104,.14), transparent 30rem),
          rgba(5,4,3,.82) !important;
        backdrop-filter: blur(22px) saturate(112%) !important;
        -webkit-backdrop-filter: blur(22px) saturate(112%) !important;
        transition: opacity .28s ease, visibility .28s ease !important;
        overflow: hidden !important;
      }
      body.navbar-unified .mobile-menu-overlay.is-open,
      body.navbar-unified .mobile-menu-overlay.open {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      body.navbar-unified .mobile-menu-panel {
        position: fixed !important;
        top: clamp(78px, 9vh, 96px) !important;
        right: clamp(14px, 3vw, 30px) !important;
        bottom: clamp(14px, 3vw, 30px) !important;
        width: min(460px, calc(100vw - clamp(28px, 6vw, 60px))) !important;
        max-height: none !important;
        height: auto !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        padding: clamp(20px, 3vw, 30px) !important;
        border: 1px solid rgba(201,178,143,.28) !important;
        border-radius: 28px !important;
        background:
          linear-gradient(145deg, rgba(32,28,21,.985), rgba(7,6,5,.985)),
          rgba(7,6,5,.98) !important;
        box-shadow: 0 38px 100px rgba(0,0,0,.56), inset 0 0 0 1px rgba(255,255,255,.035) !important;
        overflow-y: auto !important;
        transform: translate3d(34px,0,0) scale(.985) !important;
        transition: transform .32s cubic-bezier(.2,.7,.2,1) !important;
      }
      body.navbar-unified .mobile-menu-overlay.is-open .mobile-menu-panel,
      body.navbar-unified .mobile-menu-overlay.open .mobile-menu-panel {
        transform: translate3d(0,0,0) scale(1) !important;
      }
      body.navbar-unified .mobile-menu-link,
      body.navbar-unified .mobile-menu-button {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex: 0 0 auto !important;
        min-height: 46px !important;
        padding: 0 16px !important;
        border: 1px solid rgba(201,178,143,.14) !important;
        border-radius: 999px !important;
        background: linear-gradient(135deg, rgba(255,255,255,.055), rgba(255,255,255,.018)) !important;
        color: rgba(241,234,219,.82) !important;
        text-decoration: none !important;
        text-transform: uppercase !important;
        letter-spacing: .09em !important;
        font-size: .74rem !important;
        transition: transform .22s ease, border-color .22s ease, background .22s ease, color .22s ease !important;
      }
      body.navbar-unified .mobile-menu-link:hover,
      body.navbar-unified .mobile-menu-link:focus-visible,
      body.navbar-unified .mobile-menu-button:hover,
      body.navbar-unified .mobile-menu-button:focus-visible {
        transform: translateX(-4px) !important;
        color: var(--vh-ivory, #f1eadb) !important;
        border-color: rgba(201,178,143,.36) !important;
        background: rgba(208,173,104,.10) !important;
        outline: none !important;
      }
      body.navbar-unified .mobile-menu-primary {
        color: var(--vh-ivory, #f1eadb) !important;
        border-color: rgba(201,178,143,.24) !important;
      }
      body.navbar-unified .mobile-lang-switch {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 14px !important;
        margin-top: 14px !important;
        color: rgba(241,234,219,.42) !important;
      }
      body.navbar-unified .mobile-lang-switch a {
        color: rgba(241,234,219,.66) !important;
        text-decoration: none !important;
        letter-spacing: .14em !important;
        text-transform: uppercase !important;
      }
      body.navbar-unified .mobile-lang-switch a.active { color: var(--vh-ivory, #f1eadb) !important; }

      .floating-tools.veritas-quick-controls {
        position: fixed !important;
        right: clamp(14px, 1.8vw, 24px) !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        z-index: 9988 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        pointer-events: none !important;
      }
      .floating-tools.veritas-quick-controls .tool-button,
      .floating-tools.veritas-quick-controls .reduced-motion-toggle {
        pointer-events: auto !important;
        min-width: 122px !important;
        min-height: 40px !important;
        border: 1px solid rgba(201,178,143,.26) !important;
        border-radius: 999px !important;
        background:
          linear-gradient(135deg, rgba(255,255,255,.07), rgba(255,255,255,.018)),
          rgba(8,7,6,.66) !important;
        color: rgba(241,234,219,.80) !important;
        backdrop-filter: blur(16px) saturate(118%) !important;
        -webkit-backdrop-filter: blur(16px) saturate(118%) !important;
        box-shadow: 0 18px 46px rgba(0,0,0,.30), inset 0 0 0 1px rgba(255,255,255,.035) !important;
        text-transform: uppercase !important;
        letter-spacing: .085em !important;
        font-size: .62rem !important;
        cursor: pointer !important;
        transform-origin: right center !important;
        transition: transform .24s cubic-bezier(.2,.7,.2,1), color .22s ease, border-color .22s ease, background .22s ease, box-shadow .22s ease !important;
      }
      .floating-tools.veritas-quick-controls .tool-button:hover,
      .floating-tools.veritas-quick-controls .tool-button:focus-visible,
      .floating-tools.veritas-quick-controls .reduced-motion-toggle:hover,
      .floating-tools.veritas-quick-controls .reduced-motion-toggle:focus-visible,
      .floating-tools.veritas-quick-controls .tool-button[aria-pressed="true"],
      .floating-tools.veritas-quick-controls .reduced-motion-toggle[aria-pressed="true"] {
        color: var(--vh-ivory, #f1eadb) !important;
        border-color: rgba(201,178,143,.54) !important;
        background:
          linear-gradient(135deg, rgba(208,173,104,.18), rgba(255,255,255,.025)),
          rgba(8,7,6,.78) !important;
        box-shadow: 0 20px 54px rgba(0,0,0,.38), 0 0 28px rgba(208,173,104,.10), inset 0 0 0 1px rgba(255,255,255,.05) !important;
        transform: translateX(-3px) scale(1.035) !important;
        outline: none !important;
      }

      body.veritas-universe .vh-hero-media.has-future-hero {
        background-image: var(--vh-hero-image) !important;
        background-size: cover !important;
        background-position: var(--vh-hero-position, center) !important;
        background-repeat: no-repeat !important;
        background-color: #050403 !important;
      }
      body.veritas-universe .vh-hero-media.has-future-hero::before {
        inset: 0 !important;
        opacity: 1 !important;
        background-image:
          linear-gradient(90deg, rgba(5,4,3,.82), rgba(5,4,3,.34) 44%, rgba(5,4,3,.72)),
          linear-gradient(180deg, rgba(5,4,3,.12), rgba(5,4,3,.72)),
          var(--vh-hero-image) !important;
        background-size: cover, cover, cover !important;
        background-position: center, center, var(--vh-hero-position, center) !important;
        background-repeat: no-repeat !important;
        transform: translate3d(0, calc(var(--vh-parallax, 0px) * .32), 0) scale(1.035) !important;
        filter: saturate(1.06) contrast(1.06) brightness(1.06) !important;
      }
      body.veritas-universe .vh-hero-media.has-future-hero::after {
        inset: 0 !important;
        opacity: .58 !important;
        background:
          radial-gradient(circle at 32% 22%, rgba(208,173,104,.16), transparent 32rem),
          linear-gradient(90deg, rgba(5,4,3,.78), rgba(5,4,3,.10) 48%, rgba(5,4,3,.64)),
          linear-gradient(180deg, rgba(5,4,3,.05), rgba(5,4,3,.82) 88%, rgba(5,4,3,.97)),
          repeating-linear-gradient(90deg, rgba(255,255,255,.016) 0 1px, transparent 1px 7px) !important;
      }
      body.cinematic-mode .vh-hero-media.has-future-hero::before {
        filter: saturate(1.12) contrast(1.08) brightness(1.12) !important;
        transform: translate3d(0, calc(var(--vh-parallax, 0px) * .48), 0) scale(1.075) !important;
      }
      body.cinematic-mode .vh-hero-media.has-future-hero::after {
        opacity: .46 !important;
      }
      body.veritas-universe .vh-hero-copy {
        text-shadow: 0 18px 46px rgba(0,0,0,.56) !important;
      }
      body.veritas-universe .world-portal-card.has-future-hero::before {
        background-image:
          linear-gradient(180deg, rgba(5,4,3,.22), rgba(5,4,3,.76)),
          var(--vh-card-image),
          radial-gradient(circle at 26% 20%, rgba(208,173,104,.17), transparent 22rem) !important;
        background-size: cover, cover, cover !important;
        background-position: center !important;
        filter: saturate(1.04) contrast(1.05) brightness(1.04) !important;
      }
      body.cinematic-mode .world-portal-card.has-future-hero::before {
        filter: saturate(1.12) contrast(1.08) brightness(1.10) !important;
      }

      @media (max-width: 1320px) {
        body.navbar-unified .desktop-nav-compact .nav-button,
        body.navbar-unified .desktop-nav-compact .lang-switch a { font-size: clamp(.47rem, .50vw, .58rem) !important; padding-inline: 4px !important; letter-spacing: .06em !important; }
        body.navbar-unified .brand-name { font-size: .70rem !important; }
        body.navbar-unified .brand-sub-desktop { display: none !important; }
        body.navbar-unified .brand-sub-mobile { display: block !important; }
      }
      @media (max-width: 1060px) {
        body.navbar-unified .desktop-nav-compact .nav-button:nth-of-type(n+6) { display: none !important; }
      }
      @media (max-width: 900px) {
        body.navbar-unified .desktop-nav-compact .nav-button,
        body.navbar-unified .desktop-nav-compact .lang-switch { display: none !important; }
      }
      @media (max-width: 760px) {
        .floating-tools.veritas-quick-controls { display: none !important; }
        body.navbar-unified .header-inner { min-height: 64px !important; }
        body.navbar-unified .brand-name { font-size: .72rem !important; max-width: calc(100vw - 96px); overflow: hidden; text-overflow: ellipsis; }
        body.navbar-unified .brand-sub-mobile { display: none !important; }
        body.navbar-unified .mobile-menu-panel { left: 14px !important; right: 14px !important; width: auto !important; top: 78px !important; }
        body.veritas-universe .vh-hero-media.has-future-hero::before { background-position: center, center, center !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        body.navbar-unified .desktop-nav-compact .nav-button,
        body.navbar-unified .desktop-nav-compact .lang-switch a,
        body.navbar-unified .mobile-menu-panel,
        body.navbar-unified .mobile-menu-link,
        .floating-tools.veritas-quick-controls .tool-button,
        .floating-tools.veritas-quick-controls .reduced-motion-toggle { transition: none !important; }
      }
      body.reduce-motion *,
      body.reduced-motion * { scroll-behavior: auto !important; }
    `;
    document.head.appendChild(style);
  };

  const moveMobileOverlayToBody = () => {
    const overlay = document.getElementById("mobileMenuOverlay");
    if (overlay && overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }
  };

  const bindFutureHeroes = () => {
    const positionMap = [
      ["veritas-humanum", "center"],
      ["rap-ort", "center"],
      ["prawda-sumienia", "center"],
      ["english-guide", "center"],
      ["conscience-report", "center"],
      ["witness-report", "center"],
      ["sztab", "center"],
      ["between-the-lines", "center"],
      ["music", "center"],
      ["authorial-profile", "center"],
      ["for-institutions", "center"],
      ["press-recognition", "center"],
      ["contact", "center"],
    ];

    document.querySelectorAll("[data-future-hero]").forEach((element) => {
      const src = element.getAttribute("data-future-hero");
      if (!src) return;
      const cssUrl = `url("${src.replace(/"/g, "%22")}")`;
      const position = positionMap.find(([key]) => src.includes(key))?.[1] || "center";

      if (element.classList.contains("world-portal-card")) {
        element.style.setProperty("--vh-card-image", cssUrl);
      } else {
        element.style.setProperty("--vh-hero-image", cssUrl);
        element.style.setProperty("--vh-hero-position", position);
      }
      element.classList.add("has-future-hero");
    });
  };

  const initVisualSystem = () => {
    injectRuntimeStyles();
    moveMobileOverlayToBody();
    bindFutureHeroes();
  };

  initVisualSystem();
  document.addEventListener("DOMContentLoaded", initVisualSystem, { once: true });

  const reduceKeys = ["siteReducedMotion", "reduceMotion", "reducedMotion"];
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const storedReduced = reduceKeys.map((key) => localStorage.getItem(key)).find((value) => value !== null);
  const reducedByPreference = storedReduced === "true" || (storedReduced === undefined && prefersReduced);
  const reducedLabel = () => (isPolish ? "Ruch ograniczony" : "Motion Reduced");
  const reduceLabel = () => (isPolish ? "Ogranicz ruch" : "Reduce Motion");

  if (reducedByPreference) {
    document.body.classList.add("reduce-motion", "reduced-motion");
  }

  const reducedActive = () =>
    document.body.classList.contains("reduce-motion") || document.body.classList.contains("reduced-motion");

  const setReduced = (active) => {
    document.body.classList.toggle("reduce-motion", active);
    document.body.classList.toggle("reduced-motion", active);
    reduceKeys.forEach((key) => localStorage.setItem(key, String(active)));
    document.querySelectorAll("[data-reduce-motion-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(active));
      button.textContent = active ? reducedLabel() : reduceLabel();
    });
    document.dispatchEvent(new CustomEvent("site:reduced-motion-change", { detail: { enabled: active } }));
  };

  document.querySelectorAll("[data-reduce-motion-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(reducedActive()));
    button.textContent = reducedActive() ? reducedLabel() : reduceLabel();
    button.addEventListener("click", () => setReduced(!reducedActive()));
  });

  const onScroll = () => {
    if (reducedActive() || !document.body.classList.contains("cinematic-mode")) {
      document.documentElement.style.setProperty("--vh-parallax", "0px");
      return;
    }
    document.documentElement.style.setProperty("--vh-parallax", `${Math.min(window.scrollY, 800) * 0.08}px`);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealItems = [...document.querySelectorAll(".reveal")];
  if (revealItems.length) {
    if (reducedActive() || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      revealItems.forEach((item) => observer.observe(item));
    }
  }

  const modal = document.getElementById("manifestoModal");
  if (modal) {
    const frame = modal.querySelector("[data-manifesto-frame]");
    const placeholder = isPolish
      ? '<div class="manifesto-placeholder"><p>Film-manifest Veritas Humanum jest w przygotowaniu.</p><p>Wkrótce pojawi się tutaj krótki prolog do autorskiego świata Piotra Lichwały / Vibrosław.</p></div>'
      : '<div class="manifesto-placeholder"><p>The Veritas Humanum manifesto film is in preparation.</p><p>A short cinematic prologue to the authorial world of Piotr Lichwała / Vibrosław will appear here soon.</p></div>';

    const closeModal = () => {
      modal.setAttribute("aria-hidden", "true");
      if (frame) frame.innerHTML = placeholder;
      document.body.classList.remove("modal-open");
    };

    const openModal = (button) => {
      const id = button?.getAttribute("data-youtube-id") || modal.getAttribute("data-youtube-id") || "";
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      if (frame) {
        frame.innerHTML = id
          ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="Veritas Humanum Manifesto Film" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
          : placeholder;
      }
      modal.querySelector(".manifesto-close")?.focus();
    };

    document.querySelectorAll("[data-open-manifesto]").forEach((button) => {
      button.addEventListener("click", () => openModal(button));
    });
    modal.querySelectorAll("[data-close-manifesto]").forEach((button) => {
      button.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
    });
  }

  const witnessForm = document.querySelector("[data-witness-form]");
  if (witnessForm) {
    const field = (name) => witnessForm.querySelector(`[name="${name}"]`);
    const preview = {
      name: document.querySelector("[data-witness-name]"),
      place: document.querySelector("[data-witness-place]"),
      date: document.querySelector("[data-witness-date]"),
      quote: document.querySelector("[data-witness-quote]"),
      reflection: document.querySelector("[data-witness-reflection]"),
      signature: document.querySelector("[data-witness-signature]"),
    };

    const updatePreview = () => {
      const first = field("firstName")?.value.trim() || "";
      const last = field("lastName")?.value.trim() || "";
      const fullName = `${first} ${last}`.trim();
      if (preview.name) preview.name.textContent = fullName || witnessForm.dataset.defaultName || "Participant";
      if (preview.signature) preview.signature.textContent = fullName || witnessForm.dataset.defaultSignature || "Signature";
      if (preview.place) preview.place.textContent = field("place")?.value.trim() || witnessForm.dataset.defaultPlace || "Place / institution";
      if (preview.date) preview.date.textContent = field("date")?.value || new Date().toISOString().slice(0, 10);
      if (preview.quote) preview.quote.textContent = field("quote")?.value || witnessForm.dataset.defaultQuote || "Truth does not need noise. It needs to be heard.";
      if (preview.reflection) preview.reflection.textContent = field("reflection")?.value.trim() || witnessForm.dataset.defaultReflection || "Your reflection will appear here.";
    };

    witnessForm.addEventListener("input", updatePreview);
    witnessForm.addEventListener("change", updatePreview);
    updatePreview();

    witnessForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = witnessForm.querySelector(".form-status");
      if (status) status.textContent = witnessForm.dataset.printMessage || "Opening print dialog. Save as PDF from your browser if needed.";
      window.print();
    });
  }
})();
