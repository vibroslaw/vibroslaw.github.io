(() => {
  "use strict";

  const normalizePath = (value) => {
    if (!value) return "/";
    let pathname = String(value).split("#")[0].split("?")[0];
    if (!pathname.startsWith("/")) pathname = `/${pathname}`;
    pathname = pathname.replace(/\/index\.html$/i, "/");
    if (!pathname.endsWith("/")) pathname += "/";
    return pathname.replace(/\/+/g, "/");
  };

  const currentPath = normalizePath(window.location.pathname);
  const isPolish =
    currentPath === "/pl/" ||
    currentPath.startsWith("/pl/") ||
    currentPath.endsWith("/pl/") ||
    currentPath === "/miedzy-wierszami/" ||
    currentPath === "/rap-ort/raport-swiadka/";

  const languagePairs = new Map([
    ["/", "/pl/"],
    ["/pl/", "/"],
    ["/rap-ort/", "/rap-ort/pl/"],
    ["/rap-ort/pl/", "/rap-ort/"],
    ["/rap-ort/prawda-sumienia/", "/rap-ort/prawda-sumienia/pl/"],
    ["/rap-ort/prawda-sumienia/pl/", "/rap-ort/prawda-sumienia/"],
    ["/rap-ort/conscience-report/", "/rap-ort/pl/"],
    ["/rap-ort/witness-report/", "/rap-ort/raport-swiadka/"],
    ["/rap-ort/raport-swiadka/", "/rap-ort/witness-report/"],
    ["/sztab/", "/sztab/pl/"],
    ["/sztab/pl/", "/sztab/"],
    ["/sztab/origins/", "/sztab/origins/pl/"],
    ["/sztab/origins/pl/", "/sztab/origins/"],
    ["/sztab/raport-z-pamieci/", "/sztab/pl/"],
    ["/sztab/raport-z-pamieci-2/", "/sztab/pl/"],
    ["/sztab/battles/", "/sztab/pl/"],
    ["/sztab/forgotten/", "/sztab/pl/"],
    ["/music/", "/music/pl/"],
    ["/music/pl/", "/music/"],
    ["/music-works/", "/music/pl/"],
    ["/music-works/pl/", "/music/"],
    ["/between-the-lines/", "/miedzy-wierszami/"],
    ["/miedzy-wierszami/", "/between-the-lines/"],
    ["/authorial-profile/", "/authorial-profile/pl/"],
    ["/authorial-profile/pl/", "/authorial-profile/"],
    ["/for-institutions/", "/for-institutions/pl/"],
    ["/for-institutions/pl/", "/for-institutions/"],
    ["/press-recognition/", "/press-recognition/pl/"],
    ["/press-recognition/pl/", "/press-recognition/"],
    ["/contact/", "/contact/pl/"],
    ["/contact/pl/", "/contact/"],
  ]);

  const isWorldPath = (path) =>
    path.startsWith("/rap-ort/") ||
    path.startsWith("/sztab/") ||
    path === "/music/" ||
    path === "/music/pl/" ||
    path === "/between-the-lines/" ||
    path === "/miedzy-wierszami/";

  const routeIdentity = () => {
    if (currentPath === "/" || currentPath === "/pl/") {
      return {
        label: "PIOTR LICHWAŁA",
        sub: "VIBROSŁAW · VERITAS HUMANUM",
        href: isPolish ? "/pl/" : "/",
        className: "identity-veritas",
      };
    }
    if (currentPath.includes("/prawda-sumienia/pl/")) {
      return { label: "PRAWDA SUMIENIA", sub: "Rap-Ort", href: "/rap-ort/prawda-sumienia/pl/", className: "identity-raport" };
    }
    if (currentPath.includes("/prawda-sumienia/")) {
      return { label: "PRAWDA SUMIENIA · GUIDE", sub: "Rap-Ort", href: "/rap-ort/prawda-sumienia/", className: "identity-raport" };
    }
    if (currentPath.includes("/conscience-report/")) {
      return { label: "CONSCIENCE REPORT", sub: "In development", href: "/rap-ort/conscience-report/", className: "identity-raport" };
    }
    if (currentPath.includes("/witness-report/")) {
      return { label: "THE WITNESS REPORT", sub: "Rap-Ort", href: "/rap-ort/witness-report/", className: "identity-raport" };
    }
    if (currentPath.includes("/raport-swiadka/")) {
      return { label: "RAPORT ŚWIADKA", sub: "Rap-Ort", href: "/rap-ort/raport-swiadka/", className: "identity-raport" };
    }
    if (currentPath === "/rap-ort/" || currentPath === "/rap-ort/pl/") {
      return { label: "Rap-Ort", sub: isPolish ? "świat świadectwa" : "world of testimony", href: isPolish ? "/rap-ort/pl/" : "/rap-ort/", className: "identity-raport" };
    }
    if (currentPath.includes("/sztab/origins")) {
      return { label: "SZTAB · ORIGINS", sub: isPolish ? "seria animowana" : "animated branch", href: isPolish ? "/sztab/origins/pl/" : "/sztab/origins/", className: "identity-sztab" };
    }
    if (currentPath.includes("/sztab/raport-z-pamieci")) {
      return { label: "SZTAB · Raport z Pamięci", sub: isPolish ? "album muzyczny" : "music album", href: "/sztab/raport-z-pamieci/", className: "identity-sztab identity-manuscript" };
    }
    if (currentPath.includes("/sztab/battles")) {
      return { label: "SZTAB · BATTLES", sub: "In development", href: "/sztab/battles/", className: "identity-sztab" };
    }
    if (currentPath.includes("/sztab/forgotten")) {
      return { label: "SZTAB · FORGOTTEN", sub: "In development", href: "/sztab/forgotten/", className: "identity-sztab" };
    }
    if (currentPath === "/sztab/" || currentPath === "/sztab/pl/") {
      return { label: "SZTAB", sub: isPolish ? "świat pamięci" : "world of memory", href: isPolish ? "/sztab/pl/" : "/sztab/", className: "identity-sztab" };
    }
    if (currentPath === "/music/" || currentPath === "/music/pl/") {
      return { label: isPolish ? "MUZYKA" : "MUSIC", sub: "Vibrosław", href: isPolish ? "/music/pl/" : "/music/", className: "identity-neutral" };
    }
    if (currentPath === "/between-the-lines/" || currentPath === "/miedzy-wierszami/") {
      return { label: isPolish ? "MIĘDZY WIERSZAMI" : "BETWEEN THE LINES", sub: isPolish ? "w przygotowaniu" : "in development", href: isPolish ? "/miedzy-wierszami/" : "/between-the-lines/", className: "identity-neutral" };
    }
    return { label: "PIOTR LICHWAŁA", sub: "VIBROSŁAW · VERITAS HUMANUM", href: isPolish ? "/pl/" : "/", className: "identity-neutral" };
  };

  const navItems = isPolish
    ? [
        { label: "Veritas Humanum", href: "/pl/", active: currentPath === "/pl/" },
        { label: "Rap-Ort", href: "/rap-ort/pl/", active: currentPath.startsWith("/rap-ort/") },
        { label: "SZTAB", href: "/sztab/pl/", active: currentPath.startsWith("/sztab/") },
        { label: "Między Wierszami", href: "/miedzy-wierszami/", active: currentPath === "/miedzy-wierszami/" },
        { label: "Muzyka", href: "/music/pl/", active: currentPath === "/music/pl/" },
        { label: "Dla instytucji", href: "/for-institutions/pl/", active: currentPath === "/for-institutions/pl/" },
        { label: "Profil autorski", href: "/authorial-profile/pl/", active: currentPath === "/authorial-profile/pl/" },
        { label: "Media", href: "/press-recognition/pl/", active: currentPath === "/press-recognition/pl/" },
        { label: "Kontakt", href: "/contact/pl/", active: currentPath === "/contact/pl/" },
      ]
    : [
        { label: "Veritas Humanum", href: "/", active: currentPath === "/" },
        { label: "Rap-Ort", href: "/rap-ort/", active: currentPath.startsWith("/rap-ort/") },
        { label: "SZTAB", href: "/sztab/", active: currentPath.startsWith("/sztab/") },
        { label: "Between the Lines", href: "/between-the-lines/", active: currentPath === "/between-the-lines/" },
        { label: "Music", href: "/music/", active: currentPath === "/music/" },
        { label: "For Institutions", href: "/for-institutions/", active: currentPath === "/for-institutions/" },
        { label: "Author", href: "/authorial-profile/", active: currentPath === "/authorial-profile/" },
        { label: "Press", href: "/press-recognition/", active: currentPath === "/press-recognition/" },
        { label: "Contact", href: "/contact/", active: currentPath === "/contact/" },
      ];

  const languageTarget = languagePairs.get(currentPath) || (isPolish ? "/" : "/pl/");
  const languageLabel = isPolish ? "EN" : "PL";
  const identity = routeIdentity();

  const createLinkHtml = (item, className = "nav-button") => {
    const classes = [className, item.active ? "is-active active" : ""].filter(Boolean).join(" ");
    const entry = isWorldPath(normalizePath(item.href)) ? ' data-cinematic-entry="true"' : "";
    const ariaCurrent = item.active ? ' aria-current="page"' : "";
    return `<a class="${classes}" href="${item.href}"${entry}${ariaCurrent}>${item.label}</a>`;
  };

  const desktopLinks = navItems.map((item) => createLinkHtml(item)).join("");
  const mobilePrimary = navItems.slice(0, 5).map((item) => createLinkHtml(item, "mobile-menu-link mobile-menu-primary")).join("");
  const mobileSecondary = navItems.slice(5).map((item) => createLinkHtml(item, "mobile-menu-link")).join("");
  const header = document.querySelector(".site-header");

  if (header) {
    header.innerHTML = `
      <div class="wrap header-inner">
        <a class="brand brand-home-lockup ${identity.className}" href="${identity.href}" aria-label="${identity.label}">
          <div class="brand-name unified-world-label">${identity.label}</div>
          <div class="brand-sub-desktop">${identity.sub}</div>
          <div class="brand-sub-mobile">${identity.label}</div>
        </a>
        <nav class="desktop-nav desktop-nav-compact site-nav-hub" aria-label="${isPolish ? "Nawigacja główna" : "Primary navigation"}">
          ${desktopLinks}
          <div class="lang-switch" aria-label="${isPolish ? "Zmiana języka" : "Language switch"}">
            <a href="${isPolish ? languageTarget : currentPath}" class="${!isPolish ? "active" : ""}" hreflang="en">EN</a>
            <span>|</span>
            <a href="${isPolish ? currentPath : languageTarget}" class="${isPolish ? "active" : ""}" hreflang="pl">PL</a>
          </div>
          <button class="mobile-nav-toggle desktop-menu-toggle" id="mobileNavToggle" type="button" aria-label="${isPolish ? "Otwórz menu strony" : "Open site menu"}" aria-expanded="false" aria-controls="mobileMenuOverlay">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>
      <div class="mobile-menu-overlay" id="mobileMenuOverlay" aria-hidden="true" role="dialog" aria-modal="true" tabindex="-1">
        <div class="mobile-menu-panel">
          ${mobilePrimary}
          ${mobileSecondary}
          <button class="mobile-menu-link mobile-menu-button" id="mobileCinematicToggle" type="button" aria-pressed="false">${isPolish ? "Tryb kinowy" : "Cinematic Mode"}</button>
          <div class="mobile-lang-switch">
            <a href="${isPolish ? languageTarget : currentPath}" class="${!isPolish ? "active" : ""}" hreflang="en">EN</a>
            <span>|</span>
            <a href="${isPolish ? currentPath : languageTarget}" class="${isPolish ? "active" : ""}" hreflang="pl">PL</a>
          </div>
        </div>
      </div>`;
  }

  const ensureQuickControls = () => {
    if (document.querySelector(".floating-tools.veritas-quick-controls")) return;
    const tools = document.createElement("div");
    tools.className = "floating-tools veritas-quick-controls";
    tools.setAttribute("aria-label", isPolish ? "Szybkie ustawienia strony" : "Quick site controls");

    const cinematic = document.createElement("button");
    cinematic.className = "tool-button cinematic-tool-button";
    cinematic.id = "cinematicToggle";
    cinematic.type = "button";
    cinematic.setAttribute("aria-pressed", "false");
    cinematic.textContent = isPolish ? "Tryb kinowy" : "Cinematic Mode";

    let reduced = document.querySelector("[data-reduce-motion-toggle]");
    if (!reduced) {
      reduced = document.createElement("button");
      reduced.type = "button";
      reduced.setAttribute("data-reduce-motion-toggle", "");
      reduced.setAttribute("aria-pressed", "false");
    }
    reduced.id = reduced.id || "reducedMotionToggle";
    reduced.classList.add("tool-button", "motion-tool-button");
    reduced.textContent = isPolish ? "Ogranicz ruch" : "Reduce Motion";

    tools.append(cinematic, reduced);
    document.body.appendChild(tools);
  };

  document.body.classList.add("navbar-unified", "veritas-nav-ready");
  document.body.classList.toggle("page-home", currentPath === "/" || currentPath === "/pl/");
  document.body.classList.toggle("lang-pl", isPolish);
  document.body.classList.toggle("lang-en", !isPolish);
  ensureQuickControls();

  const menu = document.getElementById("mobileMenuOverlay");
  const toggle = document.getElementById("mobileNavToggle");

  const openMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.add("is-open", "open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("mobile-menu-open");
    document.documentElement.dataset.mobileMenu = "open";
    menu.querySelector("a,button")?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent("site:mobile-menu-change", { detail: { open: true, source: "nav" } }));
  };

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open", "open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-menu-open");
    document.documentElement.dataset.mobileMenu = "closed";
    document.dispatchEvent(new CustomEvent("site:mobile-menu-change", { detail: { open: false, source: "nav" } }));
  };

  window.openMobileMenu = openMenu;
  window.closeMobileMenu = closeMenu;
  window.toggleMobileMenu = () => (menu?.classList.contains("is-open") ? closeMenu() : openMenu());

  toggle?.addEventListener("click", window.toggleMobileMenu);
  menu?.addEventListener("click", (event) => {
    if (event.target === menu || event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
