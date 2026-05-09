(() => {
  const normalizePath = (value) => {
    if (!value) return "/";
    let pathname = value.split("#")[0].split("?")[0];
    if (!pathname.startsWith("/")) pathname = "/" + pathname;
    if (!pathname.endsWith("/")) pathname += "/";
    return pathname.replace(/\/index\.html$/i, "/");
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

  const routeIdentity = () => {
    if (currentPath === "/" || currentPath === "/pl/") {
      return {
        label: "VERITAS HUMANUM",
        sub: "Piotr Lichwała / Vibrosław",
        className: "identity-veritas",
      };
    }
    if (currentPath.includes("/prawda-sumienia/pl/")) {
      return { label: "PRAWDA SUMIENIA", sub: "Rap-Ort", className: "identity-raport" };
    }
    if (currentPath.includes("/prawda-sumienia/")) {
      return {
        label: "PRAWDA SUMIENIA · GUIDE",
        sub: "Rap-Ort",
        className: "identity-raport",
      };
    }
    if (currentPath.includes("/conscience-report/")) {
      return {
        label: "CONSCIENCE REPORT",
        sub: "In development",
        className: "identity-raport",
      };
    }
    if (currentPath.includes("/witness-report/")) {
      return {
        label: "THE WITNESS REPORT",
        sub: "Rap-Ort",
        className: "identity-raport",
      };
    }
    if (currentPath.includes("/raport-swiadka/")) {
      return { label: "RAPORT ŚWIADKA", sub: "Rap-Ort", className: "identity-raport" };
    }
    if (currentPath === "/rap-ort/" || currentPath === "/rap-ort/pl/") {
      return {
        label: "Rap-Ort",
        sub: isPolish ? "świat świadectwa" : "world of testimony",
        className: "identity-raport",
      };
    }
    if (currentPath.includes("/sztab/origins")) {
      return {
        label: "SZTAB · ORIGINS",
        sub: isPolish ? "seria animowana" : "animated branch",
        className: "identity-sztab",
      };
    }
    if (currentPath.includes("/sztab/raport-z-pamieci")) {
      return {
        label: "SZTAB · Raport z Pamięci",
        sub: isPolish ? "album muzyczny" : "music album",
        className: "identity-sztab identity-manuscript",
      };
    }
    if (currentPath.includes("/sztab/battles")) {
      return { label: "SZTAB · BATTLES", sub: "In development", className: "identity-sztab" };
    }
    if (currentPath.includes("/sztab/forgotten")) {
      return { label: "SZTAB · FORGOTTEN", sub: "In development", className: "identity-sztab" };
    }
    if (currentPath === "/sztab/" || currentPath === "/sztab/pl/") {
      return {
        label: "SZTAB",
        sub: isPolish ? "świat pamięci" : "world of memory",
        className: "identity-sztab",
      };
    }
    if (currentPath === "/music/" || currentPath === "/music/pl/") {
      return { label: isPolish ? "MUZYKA" : "MUSIC", sub: "Vibrosław", className: "identity-neutral" };
    }
    if (currentPath === "/between-the-lines/" || currentPath === "/miedzy-wierszami/") {
      return {
        label: isPolish ? "MIĘDZY WIERSZAMI" : "BETWEEN THE LINES",
        sub: isPolish ? "w przygotowaniu" : "in development",
        className: "identity-neutral",
      };
    }
    return {
      label: "VERITAS HUMANUM",
      sub: "Piotr Lichwała / Vibrosław",
      className: "identity-neutral",
    };
  };

  const navItems = isPolish
    ? [
        { label: "Veritas Humanum", href: "/pl/", active: currentPath === "/pl/" },
        { label: "Rap-Ort", href: "/rap-ort/pl/", active: currentPath.startsWith("/rap-ort/") },
        { label: "SZTAB", href: "/sztab/pl/", active: currentPath.startsWith("/sztab/") },
        {
          label: "Między Wierszami",
          href: "/miedzy-wierszami/",
          active: currentPath === "/miedzy-wierszami/",
        },
        { label: "Muzyka", href: "/music/pl/", active: currentPath === "/music/pl/" },
        {
          label: "Dla instytucji",
          href: "/for-institutions/pl/",
          active: currentPath === "/for-institutions/pl/",
        },
        {
          label: "Profil autorski",
          href: "/authorial-profile/pl/",
          active: currentPath === "/authorial-profile/pl/",
        },
        {
          label: "Media / Wzmianki",
          href: "/press-recognition/pl/",
          active: currentPath === "/press-recognition/pl/",
        },
        { label: "Kontakt", href: "/contact/pl/", active: currentPath === "/contact/pl/" },
      ]
    : [
        { label: "Veritas Humanum", href: "/", active: currentPath === "/" },
        { label: "Rap-Ort", href: "/rap-ort/", active: currentPath.startsWith("/rap-ort/") },
        { label: "SZTAB", href: "/sztab/", active: currentPath.startsWith("/sztab/") },
        {
          label: "Between the Lines",
          href: "/between-the-lines/",
          active: currentPath === "/between-the-lines/",
        },
        { label: "Music", href: "/music/", active: currentPath === "/music/" },
        {
          label: "For Institutions",
          href: "/for-institutions/",
          active: currentPath === "/for-institutions/",
        },
        {
          label: "Authorial Profile",
          href: "/authorial-profile/",
          active: currentPath === "/authorial-profile/",
        },
        {
          label: "Press / Recognition",
          href: "/press-recognition/",
          active: currentPath === "/press-recognition/",
        },
        { label: "Contact", href: "/contact/", active: currentPath === "/contact/" },
      ];

  const languageTarget = languagePairs.get(currentPath) || (isPolish ? "/" : "/pl/");
  const languageLabel = isPolish ? "EN" : "PL";
  const identity = routeIdentity();

  const isWorldEntry = (href) =>
    /^\/(rap-ort|sztab|music|between-the-lines|miedzy-wierszami)\//.test(href) ||
    href === "/rap-ort/" ||
    href === "/sztab/" ||
    href === "/music/" ||
    href === "/music/pl/";

  const createLink = (item, extraClass = "") => {
    const className = ["nav-button", extraClass, item.active ? "active" : ""].filter(Boolean).join(" ");
    const entry = isWorldEntry(item.href) ? ' data-cinematic-entry="true"' : "";
    return `<a class="${className}" href="${item.href}"${entry}>${item.label}</a>`;
  };

  const desktopLinks = navItems.map((item) => createLink(item)).join("");
  const mobileLinks = navItems.map((item) => createLink(item, "mobile-menu-link")).join("");
  const header = document.querySelector(".site-header");

  if (header) {
    header.innerHTML = `
      <div class="header-inner">
        <a class="brand ${identity.className}" href="${isPolish ? "/pl/" : "/"}" aria-label="Veritas Humanum">
          <span class="brand-main world-label">${identity.label}</span>
          <span class="brand-sub">${identity.sub}</span>
        </a>
        <nav class="desktop-nav-compact" aria-label="${isPolish ? "Główna nawigacja" : "Main navigation"}">
          ${desktopLinks}
          <a class="nav-button language-switcher" href="${languageTarget}" hreflang="${isPolish ? "en" : "pl"}">${languageLabel}</a>
          <button class="nav-button cinematic-toggle" id="cinematicToggle" type="button" aria-pressed="false">Cinematic Mode</button>
        </nav>
        <button class="mobile-menu-toggle" id="mobileMenuToggle" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="${isPolish ? "Otwórz menu" : "Open menu"}">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
        <div class="mobile-menu-panel">
          <div class="mobile-menu-head">
            <span>${identity.label}</span>
            <button class="mobile-menu-close" id="mobileMenuClose" type="button" aria-label="${isPolish ? "Zamknij menu" : "Close menu"}">×</button>
          </div>
          <nav class="mobile-menu-nav" aria-label="${isPolish ? "Menu mobilne" : "Mobile menu"}">
            ${mobileLinks}
            <a class="nav-button mobile-menu-link language-switcher" href="${languageTarget}" hreflang="${isPolish ? "en" : "pl"}">${languageLabel}</a>
            <button class="nav-button mobile-menu-link cinematic-toggle" id="mobileCinematicToggle" type="button" aria-pressed="false">Cinematic Mode</button>
          </nav>
        </div>
      </div>`;
  }

  document.body.classList.add("navbar-unified", "veritas-nav-ready");
  document.body.classList.toggle("page-home", currentPath === "/" || currentPath === "/pl/");
  document.body.classList.toggle("lang-pl", isPolish);
  document.body.classList.toggle("lang-en", !isPolish);

  const menu = document.getElementById("mobileMenu");
  const toggle = document.getElementById("mobileMenuToggle");
  const close = document.getElementById("mobileMenuClose");

  const openMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("mobile-menu-open");
  };

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-menu-open");
  };

  window.openMobileMenu = openMenu;
  window.closeMobileMenu = closeMenu;
  window.toggleMobileMenu = () => (menu?.classList.contains("open") ? closeMenu() : openMenu());

  toggle?.addEventListener("click", window.toggleMobileMenu);
  close?.addEventListener("click", closeMenu);
  menu?.addEventListener("click", (event) => {
    if (event.target === menu || event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
