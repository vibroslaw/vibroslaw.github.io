(() => {
  "use strict";

  if (window.__siteMobileNavigationInitialized) {
    return;
  }
  window.__siteMobileNavigationInitialized = true;

  const MOBILE_BREAKPOINT = 760;
  const NAVBAR_CSS_ID = "siteUnifiedNavbarStyles";
  const NAVBAR_CSS_HREF = "/assets/css/navbar.css?v=1";
  const MENU_INTERACTIVE_SELECTOR =
    ".mobile-menu-link, .mobile-menu-button, .mobile-lang-switch a";
  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

  const LANGUAGE_ROUTE_PAIRS = Object.freeze({
    "/": { en: "/", pl: "/pl/" },
    "/pl/": { en: "/", pl: "/pl/" },
    "/rap-ort/": { en: "/rap-ort/", pl: "/rap-ort/pl/" },
    "/rap-ort/pl/": { en: "/rap-ort/", pl: "/rap-ort/pl/" },
    "/rap-ort/prawda-sumienia/": {
      en: "/rap-ort/prawda-sumienia/",
      pl: "/rap-ort/prawda-sumienia/pl/"
    },
    "/rap-ort/prawda-sumienia/pl/": {
      en: "/rap-ort/prawda-sumienia/",
      pl: "/rap-ort/prawda-sumienia/pl/"
    },
    "/rap-ort/prawda-sumienia/viewer/": {
      en: "/rap-ort/prawda-sumienia/viewer/",
      pl: "/rap-ort/prawda-sumienia/widz/"
    },
    "/rap-ort/prawda-sumienia/widz/": {
      en: "/rap-ort/prawda-sumienia/viewer/",
      pl: "/rap-ort/prawda-sumienia/widz/"
    },
    "/rap-ort/conscience-report/": {
      en: "/rap-ort/conscience-report/",
      pl: "/rap-ort/conscience-report/pl/"
    },
    "/rap-ort/conscience-report/pl/": {
      en: "/rap-ort/conscience-report/",
      pl: "/rap-ort/conscience-report/pl/"
    },
    "/sztab/": { en: "/sztab/", pl: "/sztab/pl/" },
    "/sztab/pl/": { en: "/sztab/", pl: "/sztab/pl/" },
    "/sztab/original/": {
      en: "/sztab/original/",
      pl: "/sztab/original/pl/"
    },
    "/sztab/original/pl/": {
      en: "/sztab/original/",
      pl: "/sztab/original/pl/"
    },
    "/sztab/original/zo/": {
      en: "/sztab/original/zo/",
      pl: "/sztab/original/zo/pl/"
    },
    "/sztab/original/zo/pl/": {
      en: "/sztab/original/zo/",
      pl: "/sztab/original/zo/pl/"
    },
    "/sztab/battles/": {
      en: "/sztab/battles/",
      pl: "/sztab/battles/pl/"
    },
    "/sztab/battles/pl/": {
      en: "/sztab/battles/",
      pl: "/sztab/battles/pl/"
    },
    "/sztab/forgotten/": {
      en: "/sztab/forgotten/",
      pl: "/sztab/forgotten/pl/"
    },
    "/sztab/forgotten/pl/": {
      en: "/sztab/forgotten/",
      pl: "/sztab/forgotten/pl/"
    },
    "/music-works/": { en: "/music-works/", pl: "/music-works/pl/" },
    "/music-works/pl/": { en: "/music-works/", pl: "/music-works/pl/" },
    "/for-institutions/": {
      en: "/for-institutions/",
      pl: "/for-institutions/pl/"
    },
    "/for-institutions/pl/": {
      en: "/for-institutions/",
      pl: "/for-institutions/pl/"
    },
    "/press-recognition/": {
      en: "/press-recognition/",
      pl: "/press-recognition/pl/"
    },
    "/press-recognition/pl/": {
      en: "/press-recognition/",
      pl: "/press-recognition/pl/"
    },
    "/authorial-profile/": {
      en: "/authorial-profile/",
      pl: "/authorial-profile/pl/"
    },
    "/authorial-profile/pl/": {
      en: "/authorial-profile/",
      pl: "/authorial-profile/pl/"
    },
    "/pl/music/": { en: "/music-works/", pl: "/music-works/pl/" },
    "/pl/institutions/": {
      en: "/for-institutions/",
      pl: "/for-institutions/pl/"
    },
    "/pl/press/": {
      en: "/press-recognition/",
      pl: "/press-recognition/pl/"
    }
  });

  const PAGE_CLASS_NAMES = [
    "page-home",
    "page-neutral",
    "page-raport",
    "page-raport-subpage",
    "page-prawda-sumienia",
    "page-prawda-sumienia-guide",
    "page-conscience-report",
    "page-sztab",
    "page-sztab-origin",
    "page-sztab-battles",
    "page-sztab-forgotten",
    "page-sztab-album",
    "page-music",
    "page-institutions",
    "page-press",
    "page-author",
    "page-contact"
  ];

  let mobileNavToggle = null;
  let mobileMenuOverlay = null;
  let mobileMenuPanel = null;
  let lastFocusedElement = null;
  let scrollPosition = 0;
  let bodyScrollLocked = false;
  let mobileNavigationInitialized = false;
  let currentMobileMenuState = false;

  const savedBodyStyles = {
    position: "",
    top: "",
    left: "",
    right: "",
    width: "",
    overflowY: "",
    paddingRight: ""
  };

  function getBody() {
    return document.body;
  }

  function getHtml() {
    return document.documentElement;
  }

  function normalizePath(path) {
    const clean = (path || "/").split("#")[0].split("?")[0].replace(/\/+$/, "");
    return clean || "/";
  }

  function routeKey(path = window.location.pathname) {
    const clean = normalizePath(path);
    return clean === "/" ? "/" : `${clean}/`;
  }

  function isPolishLanguage() {
    const body = getBody();
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    return (
      body?.dataset.lang === "pl" ||
      htmlLang === "pl" ||
      normalizePath(window.location.pathname).endsWith("/pl") ||
      normalizePath(window.location.pathname).startsWith("/pl/")
    );
  }

  function getLanguageRoutePair() {
    const key = routeKey();
    const directPair = LANGUAGE_ROUTE_PAIRS[key];
    if (directPair) return directPair;

    if (isPolishLanguage() && key.endsWith("/pl/")) {
      return { en: key.replace(/\/pl\/$/, "/"), pl: key };
    }

    if (!isPolishLanguage()) {
      return { en: key, pl: key === "/" ? "/pl/" : `${key}pl/` };
    }

    return { en: "/", pl: "/pl/" };
  }

  function updateAlternateLink(lang, href) {
    if (!document.head) return;

    const absoluteHref = new URL(href, window.location.origin).href;
    let link = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);

    if (!link) {
      link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      document.head.appendChild(link);
    }

    link.href = absoluteHref;
  }

  function syncLanguageSwitchLinks() {
    const routes = getLanguageRoutePair();

    document.querySelectorAll(".lang-switch, .mobile-lang-switch").forEach((switcher) => {
      switcher.querySelectorAll("a").forEach((link) => {
        const label = link.textContent.trim().toUpperCase();
        link.classList.toggle("active", label === (isPolishLanguage() ? "PL" : "EN"));
        if (label === "EN") link.href = routes.en;
        if (label === "PL") link.href = routes.pl;
      });
    });

    updateAlternateLink("en", routes.en);
    updateAlternateLink("pl", routes.pl);
    updateAlternateLink("x-default", routes.en);
  }

  function ensureUnifiedNavbarCss() {
    if (document.getElementById(NAVBAR_CSS_ID)) return;
    if (document.querySelector('link[href*="/assets/css/navbar.css"]')) return;

    const link = document.createElement("link");
    link.id = NAVBAR_CSS_ID;
    link.rel = "stylesheet";
    link.href = NAVBAR_CSS_HREF;
    document.head.appendChild(link);
  }

  function getIdentity() {
    const clean = normalizePath(window.location.pathname);
    const pl = isPolishLanguage();

    if (clean === "/" || clean === "/pl") {
      return {
        home: true,
        href: pl ? "/pl/" : "/",
        classes: ["page-home"],
        label: "PIOTR LICHWAŁA / VIBROSŁAW"
      };
    }

    if (clean === "/rap-ort" || clean === "/rap-ort/pl") {
      return {
        label: "Rap-Ort",
        href: pl ? "/rap-ort/pl/" : "/rap-ort/",
        brandClass: "raport-brand",
        classes: ["page-raport"]
      };
    }

    if (clean.startsWith("/rap-ort/prawda-sumienia")) {
      return {
        label: pl ? "PRAWDA SUMIENIA" : "PRAWDA SUMIENIA · GUIDE",
        href: pl ? "/rap-ort/prawda-sumienia/pl/" : "/rap-ort/prawda-sumienia/",
        brandClass: "raport-brand",
        classes: [
          "page-raport-subpage",
          "page-prawda-sumienia",
          pl ? "" : "page-prawda-sumienia-guide"
        ].filter(Boolean)
      };
    }

    if (clean.startsWith("/rap-ort/conscience-report")) {
      return {
        label: "CONSCIENCE REPORT",
        href: pl ? "/rap-ort/conscience-report/pl/" : "/rap-ort/conscience-report/",
        brandClass: "raport-brand",
        classes: ["page-raport-subpage", "page-conscience-report"]
      };
    }

    if (clean === "/sztab" || clean === "/sztab/pl") {
      return {
        label: "SZTAB",
        href: pl ? "/sztab/pl/" : "/sztab/",
        brandClass: "sztab-brand",
        classes: ["page-sztab"]
      };
    }

    if (clean.startsWith("/sztab/original") || clean.startsWith("/sztab/origin")) {
      return {
        label: "SZTAB · ORIGIN",
        href: pl ? "/sztab/original/pl/" : "/sztab/original/",
        brandClass: "sztab-brand",
        classes: ["page-sztab", "page-sztab-origin"]
      };
    }

    if (clean.startsWith("/sztab/battles")) {
      return {
        label: "SZTAB · BATTLES",
        href: pl ? "/sztab/battles/pl/" : "/sztab/battles/",
        brandClass: "sztab-brand",
        classes: ["page-sztab", "page-sztab-battles"]
      };
    }

    if (clean.startsWith("/sztab/forgotten")) {
      return {
        label: "SZTAB · FORGOTTEN",
        href: pl ? "/sztab/forgotten/pl/" : "/sztab/forgotten/",
        brandClass: "sztab-brand",
        classes: ["page-sztab", "page-sztab-forgotten"]
      };
    }

    if (clean.startsWith("/sztab/raport") || clean.startsWith("/sztab/album")) {
      return {
        label: "SZTAB · Raport z Pamięci",
        href: pl ? "/sztab/pl/" : "/sztab/",
        brandClass: "sztab-manuscript-brand",
        classes: ["page-sztab", "page-sztab-album"]
      };
    }

    if (clean.startsWith("/music-works")) {
      return {
        label: pl ? "MUZYKA" : "MUSIC",
        href: pl ? "/music-works/pl/" : "/music-works/",
        classes: ["page-neutral", "page-music"]
      };
    }

    if (clean.startsWith("/for-institutions")) {
      return {
        label: pl ? "DLA INSTYTUCJI" : "FOR INSTITUTIONS",
        href: pl ? "/for-institutions/pl/" : "/for-institutions/",
        classes: ["page-neutral", "page-institutions"]
      };
    }

    if (clean.startsWith("/press-recognition")) {
      return {
        label: pl ? "MEDIA / WZMIANKI" : "PRESS / RECOGNITION",
        href: pl ? "/press-recognition/pl/" : "/press-recognition/",
        classes: ["page-neutral", "page-press"]
      };
    }

    if (clean.startsWith("/authorial-profile")) {
      return {
        label: pl ? "PROFIL AUTORSKI" : "AUTHOR",
        href: pl ? "/authorial-profile/pl/" : "/authorial-profile/",
        classes: ["page-neutral", "page-author"]
      };
    }

    return {
      label: pl ? "PIOTR LICHWAŁA / VIBROSŁAW" : "PIOTR LICHWAŁA / VIBROSŁAW",
      href: pl ? "/pl/" : "/",
      classes: ["page-neutral"]
    };
  }

  function applyBodyIdentity(identity) {
    const body = getBody();
    if (!body) return;

    body.classList.add("navbar-unified");
    PAGE_CLASS_NAMES.forEach((className) => body.classList.remove(className));
    identity.classes.forEach((className) => body.classList.add(className));
  }

  function applyBrand(identity) {
    const brand = document.querySelector(".site-header .brand");
    if (!(brand instanceof HTMLAnchorElement)) return;

    brand.classList.add("unified-brand");
    brand.href = identity.href;

    if (identity.home) {
      brand.setAttribute("aria-label", isPolishLanguage() ? "Strona główna" : "Homepage");
      return;
    }

    brand.setAttribute("aria-label", identity.label);
    brand.textContent = "";

    const name = document.createElement("div");
    name.className = ["brand-name", "unified-world-label", identity.brandClass]
      .filter(Boolean)
      .join(" ");
    name.textContent = identity.label;

    const sub = document.createElement("div");
    sub.className = "brand-sub";
    sub.textContent = identity.sub || "";

    brand.append(name, sub);
  }

  function isActiveSection(section) {
    const clean = normalizePath(window.location.pathname);

    if (section === "home") return clean === "/" || clean === "/pl";
    if (section === "raport") return clean.startsWith("/rap-ort");
    if (section === "sztab") return clean.startsWith("/sztab");
    if (section === "music") return clean.startsWith("/music-works");

    return false;
  }

  function createNavLink(item) {
    const link = document.createElement("a");
    link.href = item.href;
    link.className = "nav-button";
    link.textContent = item.label;

    if (item.trackTitle) {
      link.classList.add("track-link");
      link.dataset.trackTitle = item.trackTitle;
    }

    if (item.entry) {
      link.dataset.cinematicEntry = item.entry;
    }

    if (isActiveSection(item.section)) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    return link;
  }

  function createLanguageSwitch() {
    const routes = getLanguageRoutePair();
    const switcher = document.createElement("div");
    switcher.className = "lang-switch";
    switcher.setAttribute("aria-label", isPolishLanguage() ? "Zmiana języka" : "Language switch");

    const en = document.createElement("a");
    en.href = routes.en;
    en.textContent = "EN";
    en.classList.toggle("active", !isPolishLanguage());

    const sep = document.createElement("span");
    sep.textContent = "|";

    const pl = document.createElement("a");
    pl.href = routes.pl;
    pl.textContent = "PL";
    pl.classList.toggle("active", isPolishLanguage());

    switcher.append(en, sep, pl);
    return switcher;
  }

  function createMenuToggle() {
    const button = document.createElement("button");
    button.className = "mobile-nav-toggle desktop-menu-toggle";
    button.id = "mobileNavToggle";
    button.type = "button";
    button.setAttribute("aria-label", isPolishLanguage() ? "Otwórz menu strony" : "Open site menu");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "mobileMenuOverlay");

    for (let i = 0; i < 3; i += 1) {
      button.appendChild(document.createElement("span"));
    }

    return button;
  }

  function buildDesktopNavigation() {
    const nav = document.querySelector(".site-header .desktop-nav");
    if (!(nav instanceof HTMLElement)) return;

    const pl = isPolishLanguage();
    const items = pl
      ? [
          { label: "BAZA", href: "/pl/", section: "home" },
          { label: "Rap-Ort", href: "/rap-ort/pl/", section: "raport", trackTitle: "Rap-Ort", entry: "rap-ort" },
          { label: "SZTAB", href: "/sztab/pl/", section: "sztab", trackTitle: "SZTAB", entry: "sztab" },
          { label: "MUZYKA", href: "/music-works/pl/", section: "music", trackTitle: "Muzyka / Projekty", entry: "music-works" }
        ]
      : [
          { label: "HOME", href: "/", section: "home" },
          { label: "Rap-Ort", href: "/rap-ort/", section: "raport", trackTitle: "Rap-Ort", entry: "rap-ort" },
          { label: "SZTAB", href: "/sztab/", section: "sztab", trackTitle: "SZTAB", entry: "sztab" },
          { label: "MUSIC", href: "/music-works/", section: "music", trackTitle: "Music / Works", entry: "music-works" }
        ];

    nav.classList.add("site-nav-unified");
    nav.setAttribute("aria-label", pl ? "Nawigacja główna" : "Primary navigation");
    nav.replaceChildren(
      ...items.map(createNavLink),
      createLanguageSwitch(),
      createMenuToggle()
    );
  }

  function createMenuLink(item, primary = false) {
    const link = document.createElement("a");
    link.href = item.href;
    link.className = primary ? "mobile-menu-link mobile-menu-primary" : "mobile-menu-link";
    link.textContent = item.label;

    if (item.trackTitle) {
      link.classList.add("track-link");
      link.dataset.trackTitle = item.trackTitle;
    }

    if (item.entry) {
      link.dataset.cinematicEntry = item.entry;
    }

    if (item.section && isActiveSection(item.section)) {
      link.classList.add("is-active");
    }

    return link;
  }

  function createMobileLanguageSwitch() {
    const routes = getLanguageRoutePair();
    const switcher = document.createElement("div");
    switcher.className = "mobile-lang-switch";

    const en = document.createElement("a");
    en.href = routes.en;
    en.textContent = "EN";
    en.classList.toggle("active", !isPolishLanguage());

    const separator = document.createElement("span");
    separator.textContent = "|";

    const pl = document.createElement("a");
    pl.href = routes.pl;
    pl.textContent = "PL";
    pl.classList.toggle("active", isPolishLanguage());

    switcher.append(en, separator, pl);
    return switcher;
  }

  function createCinematicMenuButton() {
    const button = document.createElement("button");
    button.className = "mobile-menu-link mobile-menu-button";
    button.id = "mobileCinematicToggle";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.textContent = isPolishLanguage() ? "Tryb kinowy" : "Cinematic Mode";
    return button;
  }

  function buildMobileMenuPanel() {
    const panel = document.querySelector(".mobile-menu-panel");
    if (!(panel instanceof HTMLElement)) return;

    const pl = isPolishLanguage();
    const primary = pl
      ? [
          { label: "BAZA", href: "/pl/", section: "home" },
          { label: "Rap-Ort", href: "/rap-ort/pl/", section: "raport", trackTitle: "Rap-Ort", entry: "rap-ort" },
          { label: "SZTAB", href: "/sztab/pl/", section: "sztab", trackTitle: "SZTAB", entry: "sztab" },
          { label: "Muzyka / Projekty", href: "/music-works/pl/", section: "music", trackTitle: "Muzyka / Projekty", entry: "music-works" }
        ]
      : [
          { label: "Home", href: "/", section: "home" },
          { label: "Rap-Ort", href: "/rap-ort/", section: "raport", trackTitle: "Rap-Ort", entry: "rap-ort" },
          { label: "SZTAB", href: "/sztab/", section: "sztab", trackTitle: "SZTAB", entry: "sztab" },
          { label: "Music / Works", href: "/music-works/", section: "music", trackTitle: "Music / Works", entry: "music-works" }
        ];

    const secondary = pl
      ? [
          { label: "Dla instytucji", href: "/for-institutions/pl/" },
          { label: "Media / Wzmianki", href: "/press-recognition/pl/" },
          { label: "Profil autorski", href: "/authorial-profile/pl/", trackTitle: "Profil autorski" },
          { label: "Kontakt", href: "/pl/#contact" }
        ]
      : [
          { label: "For Institutions", href: "/for-institutions/" },
          { label: "Press / Recognition", href: "/press-recognition/" },
          { label: "Author", href: "/authorial-profile/", trackTitle: "Authorial Profile" },
          { label: "Contact", href: "/#contact" }
        ];

    panel.replaceChildren(
      ...primary.map((item) => createMenuLink(item, true)),
      ...secondary.map((item) => createMenuLink(item)),
      createCinematicMenuButton(),
      createMobileLanguageSwitch()
    );
  }

  function applyUnifiedNavbar() {
    ensureUnifiedNavbarCss();

    const identity = getIdentity();
    applyBodyIdentity(identity);
    applyBrand(identity);
    buildDesktopNavigation();
    buildMobileMenuPanel();
    syncLanguageSwitchLinks();
  }

  function cacheMobileNavigationElements() {
    mobileNavToggle = document.getElementById("mobileNavToggle");
    mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    mobileMenuPanel = document.querySelector(".mobile-menu-panel");
  }

  function isMobileMenuOpen() {
    const body = getBody();
    return !!body && body.classList.contains("mobile-menu-open");
  }

  function setMobileMenuState(open, source = "manual") {
    const html = getHtml();
    const body = getBody();
    const nextValue = open ? "open" : "closed";

    if (html) html.dataset.mobileMenu = nextValue;
    if (body) body.dataset.mobileMenu = nextValue;

    if (currentMobileMenuState === open) return;
    currentMobileMenuState = open;

    document.dispatchEvent(
      new CustomEvent("site:mobile-menu-change", {
        detail: { open, source }
      })
    );
  }

  function isVisibleElement(element) {
    if (!(element instanceof HTMLElement)) return false;
    if (element.hasAttribute("hidden")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    if (element.closest("[hidden]")) return false;

    const styles = window.getComputedStyle(element);
    if (styles.display === "none") return false;
    if (styles.visibility === "hidden") return false;
    if (styles.visibility === "collapse") return false;

    return element.getClientRects().length > 0;
  }

  function getFocusableElementsInMenu() {
    if (!(mobileMenuPanel instanceof HTMLElement)) return [];
    return Array.from(mobileMenuPanel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisibleElement);
  }

  function saveBodyStyles() {
    const body = getBody();
    if (!body) return;

    savedBodyStyles.position = body.style.position;
    savedBodyStyles.top = body.style.top;
    savedBodyStyles.left = body.style.left;
    savedBodyStyles.right = body.style.right;
    savedBodyStyles.width = body.style.width;
    savedBodyStyles.overflowY = body.style.overflowY;
    savedBodyStyles.paddingRight = body.style.paddingRight;
  }

  function restoreBodyStyles() {
    const body = getBody();
    if (!body) return;

    body.style.position = savedBodyStyles.position;
    body.style.top = savedBodyStyles.top;
    body.style.left = savedBodyStyles.left;
    body.style.right = savedBodyStyles.right;
    body.style.width = savedBodyStyles.width;
    body.style.overflowY = savedBodyStyles.overflowY;
    body.style.paddingRight = savedBodyStyles.paddingRight;
  }

  function lockBodyScroll() {
    const body = getBody();
    if (!body || bodyScrollLocked) return;

    scrollPosition = window.scrollY || window.pageYOffset || 0;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    saveBodyStyles();

    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflowY = "scroll";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    bodyScrollLocked = true;
  }

  function unlockBodyScroll() {
    if (!bodyScrollLocked) return;

    restoreBodyStyles();
    window.scrollTo(0, scrollPosition);
    bodyScrollLocked = false;
  }

  function focusFirstMenuItem() {
    const focusable = getFocusableElementsInMenu();

    if (focusable.length > 0) {
      focusable[0].focus();
      return;
    }

    if (mobileMenuPanel instanceof HTMLElement) {
      mobileMenuPanel.focus();
      return;
    }

    if (mobileMenuOverlay instanceof HTMLElement) {
      mobileMenuOverlay.focus();
    }
  }

  function syncMenuAccessibility(open) {
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  function openMobileMenu({ source = "open" } = {}) {
    cacheMobileNavigationElements();

    const body = getBody();
    if (!body || !mobileNavToggle || !mobileMenuOverlay || isMobileMenuOpen()) return;

    lastFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : mobileNavToggle;

    lockBodyScroll();

    body.classList.add("mobile-menu-open");
    syncMenuAccessibility(true);
    setMobileMenuState(true, source);

    window.setTimeout(() => {
      focusFirstMenuItem();
    }, 40);
  }

  function closeMobileMenu({ restoreFocus = true, source = "close" } = {}) {
    cacheMobileNavigationElements();

    const body = getBody();
    if (!body || !mobileNavToggle || !mobileMenuOverlay) {
      setMobileMenuState(false, source);
      return;
    }

    if (!isMobileMenuOpen()) {
      syncMenuAccessibility(false);
      setMobileMenuState(false, source);
      return;
    }

    body.classList.remove("mobile-menu-open");
    syncMenuAccessibility(false);
    setMobileMenuState(false, source);
    unlockBodyScroll();

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      const targetToRestore = lastFocusedElement;
      window.setTimeout(() => {
        if (document.contains(targetToRestore)) targetToRestore.focus();
        lastFocusedElement = null;
      }, 40);
    } else {
      lastFocusedElement = null;
    }
  }

  function toggleMobileMenu() {
    if (isMobileMenuOpen()) {
      closeMobileMenu({ source: "toggle-close" });
    } else {
      openMobileMenu({ source: "toggle-open" });
    }
  }

  function trapFocusInMenu(event) {
    if (!isMobileMenuOpen()) return;
    if (event.key !== "Tab") return;

    const focusable = getFocusableElementsInMenu();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !(mobileMenuPanel instanceof HTMLElement) || !mobileMenuPanel.contains(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last || !(mobileMenuPanel instanceof HTMLElement) || !mobileMenuPanel.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleDocumentKeydown(event) {
    if (!isMobileMenuOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu({ source: "escape" });
      return;
    }

    trapFocusInMenu(event);
  }

  function handleDocumentFocusIn(event) {
    if (!isMobileMenuOpen()) return;
    if (!(event.target instanceof Node)) return;
    if (!(mobileMenuPanel instanceof HTMLElement)) return;
    if (mobileMenuPanel.contains(event.target)) return;
    if (event.target === mobileMenuOverlay) return;

    focusFirstMenuItem();
  }

  function handleOverlayClick(event) {
    if (!mobileMenuOverlay) return;
    if (event.target === mobileMenuOverlay) {
      closeMobileMenu({ source: "overlay-click" });
    }
  }

  function handlePanelClick(event) {
    if (!(event.target instanceof Element)) return;

    const trigger = event.target.closest(MENU_INTERACTIVE_SELECTOR);
    if (!trigger) return;

    if (trigger.id === "mobileCinematicToggle") {
      window.setTimeout(() => {
        closeMobileMenu({ restoreFocus: false, source: "cinematic-toggle" });
      }, 0);
      return;
    }

    if (trigger instanceof HTMLAnchorElement || trigger instanceof HTMLButtonElement) {
      closeMobileMenu({ restoreFocus: false, source: "panel-click" });
    }
  }

  function handleResizeLikeEvent() {
    setMobileMenuState(isMobileMenuOpen(), "resize-sync");
  }

  function handlePageShow() {
    cacheMobileNavigationElements();
    if (isMobileMenuOpen()) {
      closeMobileMenu({ restoreFocus: false, source: "pageshow-close" });
    } else {
      unlockBodyScroll();
      syncMenuAccessibility(false);
      setMobileMenuState(false, "pageshow");
    }
  }

  function initAccessibilityAttributes() {
    if (mobileMenuOverlay) {
      mobileMenuOverlay.setAttribute("aria-hidden", "true");
      mobileMenuOverlay.setAttribute("role", "dialog");
      mobileMenuOverlay.setAttribute("aria-modal", "true");
      mobileMenuOverlay.setAttribute("tabindex", "-1");
    }

    if (mobileMenuPanel instanceof HTMLElement) {
      mobileMenuPanel.setAttribute("tabindex", "-1");
    }

    if (mobileNavToggle) {
      mobileNavToggle.setAttribute("aria-expanded", "false");
      mobileNavToggle.setAttribute("aria-controls", "mobileMenuOverlay");
    }
  }

  function normalizeInitialState() {
    const body = getBody();
    if (!body) return;

    body.classList.remove("mobile-menu-open");
    syncMenuAccessibility(false);
    setMobileMenuState(false, "init");
    unlockBodyScroll();
    lastFocusedElement = null;
  }

  function bindMenuToggle() {
    if (!mobileNavToggle) return;
    if (mobileNavToggle.dataset.unifiedNavBound === "true") return;

    mobileNavToggle.dataset.unifiedNavBound = "true";
    mobileNavToggle.addEventListener("click", (event) => {
      event.preventDefault();
      toggleMobileMenu();
    });
  }

  function initMobileNavigation() {
    if (mobileNavigationInitialized) return;

    applyUnifiedNavbar();
    cacheMobileNavigationElements();

    if (!mobileNavToggle || !mobileMenuOverlay || !mobileMenuPanel) return;

    mobileNavigationInitialized = true;

    initAccessibilityAttributes();
    normalizeInitialState();
    bindMenuToggle();

    mobileMenuOverlay.addEventListener("click", handleOverlayClick);
    mobileMenuPanel.addEventListener("click", handlePanelClick);

    document.addEventListener("keydown", handleDocumentKeydown);
    document.addEventListener("focusin", handleDocumentFocusIn);

    window.addEventListener("resize", handleResizeLikeEvent);
    window.addEventListener("orientationchange", handleResizeLikeEvent);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", () => {
      setMobileMenuState(false, "pagehide");
      unlockBodyScroll();
    });
  }

  window.openMobileMenu = openMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.toggleMobileMenu = toggleMobileMenu;
  window.isMobileMenuOpen = isMobileMenuOpen;
  window.refreshUnifiedNavbar = () => {
    applyUnifiedNavbar();
    cacheMobileNavigationElements();
    bindMenuToggle();
    syncMenuAccessibility(isMobileMenuOpen());
  };

  if (document.body) {
    initMobileNavigation();
  } else {
    document.addEventListener("DOMContentLoaded", initMobileNavigation, {
      once: true
    });
  }
})();
