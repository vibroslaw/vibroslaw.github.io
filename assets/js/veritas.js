(() => {
  "use strict";

  const isPolish = document.documentElement.lang === "pl" || document.body?.dataset.lang === "pl";

  const injectRuntimeStyles = () => {
    if (document.getElementById("veritasRuntimeFixes")) return;
    const style = document.createElement("style");
    style.id = "veritasRuntimeFixes";
    style.textContent = `
      body.navbar-unified .site-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9990;
        background: linear-gradient(180deg, rgba(5,4,3,.82), rgba(5,4,3,.44));
        border-bottom: 1px solid rgba(201,178,143,.16);
        backdrop-filter: blur(18px) saturate(115%);
      }
      body.navbar-unified .header-inner {
        min-height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }
      body.navbar-unified .brand {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        color: var(--vh-ivory, #f1eadb);
        text-decoration: none;
        min-width: 0;
      }
      body.navbar-unified .brand-name {
        font-family: var(--font-display, Georgia, serif);
        font-size: clamp(.78rem, .95vw, 1rem);
        letter-spacing: .12em;
        text-transform: uppercase;
        white-space: nowrap;
      }
      body.navbar-unified .brand-sub-desktop,
      body.navbar-unified .brand-sub-mobile {
        color: rgba(241,234,219,.52);
        font-size: .62rem;
        letter-spacing: .14em;
        text-transform: uppercase;
        margin-top: 4px;
      }
      body.navbar-unified .brand-sub-mobile { display: none; }
      body.navbar-unified .desktop-nav-compact {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
        min-width: 0;
      }
      body.navbar-unified .desktop-nav-compact .nav-button,
      body.navbar-unified .desktop-nav-compact .lang-switch a,
      body.navbar-unified .desktop-menu-toggle {
        position: relative;
        min-height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 0 9px;
        color: rgba(241,234,219,.72);
        background: transparent;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: .085em;
        font-size: clamp(.58rem, .66vw, .72rem);
        line-height: 1;
        white-space: nowrap;
        transition: color .22s ease, border-color .22s ease, background .22s ease, box-shadow .22s ease, transform .22s ease;
      }
      body.navbar-unified .desktop-nav-compact .nav-button:hover,
      body.navbar-unified .desktop-nav-compact .nav-button:focus-visible,
      body.navbar-unified .desktop-nav-compact .nav-button.is-active,
      body.navbar-unified .desktop-nav-compact .nav-button.active,
      body.navbar-unified .desktop-nav-compact .lang-switch a:hover,
      body.navbar-unified .desktop-nav-compact .lang-switch a:focus-visible,
      body.navbar-unified .desktop-nav-compact .lang-switch a.active,
      body.navbar-unified .desktop-menu-toggle:hover,
      body.navbar-unified .desktop-menu-toggle:focus-visible {
        color: var(--vh-ivory, #f1eadb);
        border-color: rgba(201,178,143,.24);
        background: linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.018));
        box-shadow: 0 12px 34px rgba(0,0,0,.20), inset 0 0 0 1px rgba(255,255,255,.03);
        transform: translateY(-1px);
        outline: none;
      }
      body.navbar-unified .desktop-nav-compact .lang-switch {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        margin-left: 3px;
        padding-left: 9px;
        border-left: 1px solid rgba(201,178,143,.18);
      }
      body.navbar-unified .desktop-nav-compact .lang-switch span { color: rgba(241,234,219,.28); }
      body.navbar-unified .desktop-menu-toggle {
        width: 42px;
        padding: 0;
        flex-direction: column;
        gap: 5px;
        cursor: pointer;
      }
      body.navbar-unified .desktop-menu-toggle span {
        width: 18px;
        height: 1.5px;
        background: currentColor;
        display: block;
      }
      body.navbar-unified .mobile-menu-overlay {
        position: fixed;
        inset: 0;
        z-index: 10020;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        background: rgba(5,4,3,.76);
        backdrop-filter: blur(18px);
        transition: opacity .25s ease, visibility .25s ease;
      }
      body.navbar-unified .mobile-menu-overlay.is-open,
      body.navbar-unified .mobile-menu-overlay.open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
      body.navbar-unified .mobile-menu-panel {
        position: absolute;
        top: 18px;
        right: 18px;
        bottom: 18px;
        width: min(420px, calc(100vw - 36px));
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 26px;
        border: 1px solid rgba(201,178,143,.24);
        border-radius: 24px;
        background: linear-gradient(145deg, rgba(28,24,18,.98), rgba(7,6,5,.98));
        box-shadow: 0 32px 90px rgba(0,0,0,.46);
        overflow-y: auto;
        transform: translateX(28px);
        transition: transform .28s cubic-bezier(.2,.7,.2,1);
      }
      body.navbar-unified .mobile-menu-overlay.is-open .mobile-menu-panel,
      body.navbar-unified .mobile-menu-overlay.open .mobile-menu-panel { transform: translateX(0); }
      body.navbar-unified .mobile-menu-link,
      body.navbar-unified .mobile-menu-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 46px;
        padding: 0 14px;
        border: 1px solid rgba(201,178,143,.12);
        border-radius: 999px;
        background: rgba(255,255,255,.035);
        color: rgba(241,234,219,.82);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: .09em;
        font-size: .78rem;
      }
      body.navbar-unified .mobile-menu-primary { color: var(--vh-ivory, #f1eadb); border-color: rgba(201,178,143,.22); }
      body.navbar-unified .mobile-lang-switch {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-top: 12px;
        color: rgba(241,234,219,.5);
      }
      body.navbar-unified .mobile-lang-switch a { color: rgba(241,234,219,.66); text-decoration: none; letter-spacing: .12em; }
      body.navbar-unified .mobile-lang-switch a.active { color: var(--vh-ivory, #f1eadb); }
      .floating-tools.veritas-quick-controls {
        position: fixed;
        right: clamp(14px, 2vw, 26px);
        top: 50%;
        transform: translateY(-50%);
        z-index: 9988;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }
      .floating-tools.veritas-quick-controls .tool-button,
      .floating-tools.veritas-quick-controls .reduced-motion-toggle {
        pointer-events: auto;
        min-width: 132px;
        min-height: 42px;
        border: 1px solid rgba(201,178,143,.26);
        border-radius: 999px;
        background: rgba(8,7,6,.66);
        color: rgba(241,234,219,.82);
        backdrop-filter: blur(14px) saturate(115%);
        box-shadow: 0 16px 40px rgba(0,0,0,.28), inset 0 0 0 1px rgba(255,255,255,.03);
        text-transform: uppercase;
        letter-spacing: .08em;
        font-size: .68rem;
        cursor: pointer;
      }
      .floating-tools.veritas-quick-controls .tool-button:hover,
      .floating-tools.veritas-quick-controls .tool-button:focus-visible,
      .floating-tools.veritas-quick-controls .reduced-motion-toggle:hover,
      .floating-tools.veritas-quick-controls .reduced-motion-toggle:focus-visible,
      .floating-tools.veritas-quick-controls .tool-button[aria-pressed="true"],
      .floating-tools.veritas-quick-controls .reduced-motion-toggle[aria-pressed="true"] {
        color: var(--vh-ivory, #f1eadb);
        border-color: rgba(201,178,143,.48);
        background: rgba(208,173,104,.12);
        outline: none;
      }
      .vh-hero-media,
      .vh-hero-media.has-future-hero {
        background-image:
          linear-gradient(90deg, rgba(8,7,6,.94), rgba(8,7,6,.58), rgba(8,7,6,.88)),
          var(--vh-hero-image, linear-gradient(135deg, #17120d, #050403));
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-color: #050403;
      }
      .world-portal-card.has-future-hero::before {
        background-image:
          linear-gradient(180deg, rgba(5,4,3,.1), rgba(5,4,3,.7)),
          var(--vh-card-image),
          radial-gradient(circle at 26% 20%, rgba(208,173,104,.17), transparent 22rem);
        background-size: cover;
        background-position: center;
      }
      @media (max-width: 1180px) {
        body.navbar-unified .desktop-nav-compact .nav-button { padding-inline: 7px; font-size: .58rem; }
        body.navbar-unified .brand-sub-desktop { display: none; }
        body.navbar-unified .brand-sub-mobile { display: block; }
      }
      @media (max-width: 860px) {
        body.navbar-unified .desktop-nav-compact .nav-button,
        body.navbar-unified .desktop-nav-compact .lang-switch { display: none; }
      }
      @media (max-width: 760px) {
        .floating-tools.veritas-quick-controls { display: none; }
        body.navbar-unified .header-inner { min-height: 66px; }
        body.navbar-unified .brand-name { font-size: .76rem; }
      }
      body.reduce-motion *,
      body.reduced-motion * {
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  };

  const bindFutureHeroes = () => {
    document.querySelectorAll("[data-future-hero]").forEach((element) => {
      const src = element.getAttribute("data-future-hero");
      if (!src) return;
      const cssUrl = `url("${src.replace(/"/g, "%22")}")`;
      if (element.classList.contains("world-portal-card")) {
        element.style.setProperty("--vh-card-image", cssUrl);
      } else {
        element.style.setProperty("--vh-hero-image", cssUrl);
      }
      element.classList.add("has-future-hero");
    });
  };

  injectRuntimeStyles();
  bindFutureHeroes();

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
