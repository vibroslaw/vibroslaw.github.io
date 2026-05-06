(() => {
  "use strict";

  if (window.__siteMobileNavigationInitialized) {
    return;
  }
  window.__siteMobileNavigationInitialized = true;

  const MOBILE_BREAKPOINT = 760;
  const UNIFIED_NAVBAR_CSS_ID = "siteUnifiedNavbarCss";
  const UNIFIED_NAVBAR_CSS_HREF = "/assets/css/navbar.css?v=1";
  const MENU_INTERACTIVE_SELECTOR =
    ".mobile-menu-link, .mobile-menu-button, .mobile-lang-switch a";
  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
  const LANGUAGE_ROUTE_PAIRS = {
    "/": {
      en: "/",
      pl: "/pl/"
    },
    "/pl/": {
      en: "/",
      pl: "/pl/"
    },
    "/rap-ort/": {
      en: "/rap-ort/",
      pl: "/rap-ort/pl/"
    },
    "/rap-ort/pl/": {
      en: "/rap-ort/",
      pl: "/rap-ort/pl/"
    },
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
    "/sztab/": {
      en: "/sztab/",
      pl: "/sztab/pl/"
    },
    "/sztab/pl/": {
      en: "/sztab/",
      pl: "/sztab/pl/"
    },
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
    "/music-works/": {
      en: "/music-works/",
      pl: "/music-works/pl/"
    },
    "/music-works/pl/": {
      en: "/music-works/",
      pl: "/music-works/pl/"
    },
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
    }
  };

  const PRIMARY_NAV_ITEMS = [
    {
      key: "home",
      en: { href: "/", label: "HOME" },
      pl: { href: "/pl/", label: "BAZA" }
    },
    {
      key: "rap-ort",
      en: { href: "/rap-ort/", label: "Rap-Ort" },
      pl: { href: "/rap-ort/pl/", label: "Rap-Ort" },
      trackTitle: "Rap-Ort",
      cinematicEntry: "rap-ort"
    },
    {
      key: "sztab",
      en: { href: "/sztab/", label: "SZTAB" },
      pl: { href: "/sztab/pl/", label: "SZTAB" },
      trackTitle: "SZTAB",
      cinematicEntry: "sztab"
    },
    {
      key: "music",
      en: { href: "/music-works/", label: "MUSIC" },
      pl: { href: "/music-works/pl/", label: "MUZYKA" },
      trackTitle: "Music / Works",
      cinematicEntry: "music"
    }
  ];

  const SECONDARY_NAV_ITEMS = [
    {
      key: "institutions",
      en: { href: "/for-institutions/", label: "For Institutions" },
      pl: { href: "/for-institutions/pl/", label: "Dla instytucji" }
    },
    {
      key: "press",
      en: { href: "/press-recognition/", label: "Press / Recognition" },
      pl: { href: "/press-recognition/pl/", label: "Media / Wzmianki" }
    },
    {
      key: "author",
      en: { href: "/authorial-profile/", label: "Author" },
      pl: { href: "/authorial-profile/pl/", label: "Profil autorski" }
    },
    {
      key: "contact",
      en: { href: "/#contact", label: "Contact" },
      pl: { href: "/pl/#contact", label: "Kontakt" }
    }
  ];

  const PAGE_CLASS_NAMES = [
    "page-home",
    "page-raport",
    "page-raport-subpage",
    "page-sztab",
    "page-sztab-origin",
    "page-sztab-battles",
    "page-sztab-forgotten",
    "page-sztab-album",
    "page-neutral"
  ];

  const SWIPE_CLOSE_DISTANCE = 72;
  const SWIPE_MAX_HORIZONTAL_DRIFT = 56;

  let mobileNavToggle = null;
  let mobileMenuOverlay = null;
  let mobileMenuPanel = null;

  let lastFocusedElement = null;
  let scrollPosition = 0;
  let bodyScrollLocked = false;
  let resizeFrame = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let touchTrackingActive = false;
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
    return path.endsWith("/") ? path : `${path}/`;
  }

  function getCurrentPath() {
    return normalizePath(window.location.pathname || "/");
  }

  function getCurrentLanguage() {
    const bodyLang = getBody()?.dataset.lang?.trim().toLowerCase();

    if (bodyLang === "pl" || bodyLang === "en") {
      return bodyLang;
    }

    const path = getCurrentPath();
    return path === "/pl/" || path.includes("/pl/") || path.includes("/widz/")
      ? "pl"
      : "en";
  }

  function getLanguageRoutePair() {
    return LANGUAGE_ROUTE_PAIRS[normalizePath(window.location.pathname)] || null;
  }

  function getFallbackLanguageRoutes() {
    const lang = getCurrentLanguage();
    const switcher = document.querySelector(".lang-switch, .mobile-lang-switch");
    const currentPath = getCurrentPath();
    const routes = {
      en: lang === "en" ? currentPath : "/",
      pl: lang === "pl" ? currentPath : "/pl/"
    };

    switcher?.querySelectorAll("a").forEach((link) => {
      const label = link.textContent.trim().toUpperCase();
      const href = link.getAttribute("href");

      if (!href) return;
      if (label === "EN") routes.en = href;
      if (label === "PL") routes.pl = href;
    });

    return routes;
  }

  function getResolvedLanguageRoutes() {
    return getLanguageRoutePair() || getFallbackLanguageRoutes();
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
    const routes = getResolvedLanguageRoutes();
    if (!routes) return;

    document.querySelectorAll(".lang-switch, .mobile-lang-switch").forEach((switcher) => {
      switcher.querySelectorAll("a").forEach((link) => {
        const label = link.textContent.trim().toUpperCase();
        if (label === "EN") link.href = routes.en;
        if (label === "PL") link.href = routes.pl;
      });
    });

    updateAlternateLink("en", routes.en);
    updateAlternateLink("pl", routes.pl);
    updateAlternateLink("x-default", routes.en);
  }

  function ensureUnifiedNavbarCss() {
    if (!document.head) return;
    if (document.getElementById(UNIFIED_NAVBAR_CSS_ID)) return;

    const link = document.createElement("link");
    link.id = UNIFIED_NAVBAR_CSS_ID;
    link.rel = "stylesheet";
    link.href = UNIFIED_NAVBAR_CSS_HREF;
    document.head.appendChild(link);
  }

  function getTopLevelNavKey(path = getCurrentPath()) {
    if (path === "/" || path === "/pl/") return "home";
    if (path.startsWith("/rap-ort/")) return "rap-ort";
    if (path.startsWith("/sztab/")) return "sztab";
    if (path.startsWith("/music-works/")) return "music";
    return "";
  }

  function createNavAnchor(item, lang) {
    const config = item[lang] || item.en;
    const link = document.createElement("a");
    link.className = "nav-button unified-nav-link";
    link.href = config.href;
    link.textContent = config.label;

    if (item.trackTitle) {
      link.classList.add("track-link");
      link.dataset.trackTitle = item.trackTitle;
    }

    if (item.cinematicEntry) {
      link.dataset.cinematicEntry = item.cinematicEntry;
    }

    if (item.key === getTopLevelNavKey()) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    return link;
  }

  function createLanguageSwitch(lang, routes) {
    const switcher = document.createElement("div");
    switcher.className = "lang-switch unified-lang-switch";
    switcher.setAttribute(
      "aria-label",
      lang === "pl" ? "Zmiana języka" : "Language switch"
    );

    const enLink = document.createElement("a");
    enLink.href = routes.en;
    enLink.textContent = "EN";
    enLink.classList.toggle("active", lang === "en");

    const separator = document.createElement("span");
    separator.textContent = "|";

    const plLink = document.createElement("a");
    plLink.href = routes.pl;
    plLink.textContent = "PL";
    plLink.classList.toggle("active", lang === "pl");

    switcher.append(enLink, separator, plLink);
    return switcher;
  }

  function createDesktopMenuToggle(existingToggle, lang) {
    const toggle = existingToggle
      ? existingToggle.cloneNode(true)
      : document.createElement("button");

    toggle.id = "mobileNavToggle";
    toggle.type = "button";
    toggle.classList.add("mobile-nav-toggle", "desktop-menu-toggle", "unified-menu-toggle");
    toggle.setAttribute(
      "aria-label",
      lang === "pl" ? "Otwórz menu strony" : "Open site menu"
    );
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mobileMenuOverlay");

    if (!toggle.querySelector("span")) {
      toggle.textContent = "";
      toggle.append(document.createElement("span"), document.createElement("span"), document.createElement("span"));
    }

    return toggle;
  }

  function getBrandConfig(path = getCurrentPath(), lang = getCurrentLanguage()) {
    if (path === "/" || path === "/pl/") {
      return {
        pageClass: "page-home",
        identity: "home",
        preserve: true,
        href: lang === "pl" ? "/pl/" : "/"
      };
    }

    if (path === "/rap-ort/" || path === "/rap-ort/pl/") {
      return {
        pageClass: "page-raport",
        identity: "raport",
        label: "Rap-Ort",
        href: lang === "pl" ? "/rap-ort/pl/" : "/rap-ort/",
        hideSub: true
      };
    }

    if (path.startsWith("/rap-ort/prawda-sumienia/")) {
      return {
        pageClass: "page-raport-subpage",
        identity: "raport",
        label: lang === "pl" ? "PRAWDA SUMIENIA" : "PRAWDA SUMIENIA · GUIDE",
        href: lang === "pl"
          ? "/rap-ort/prawda-sumienia/pl/"
          : "/rap-ort/prawda-sumienia/",
        hideSub: true
      };
    }

    if (path.startsWith("/rap-ort/conscience-report/")) {
      return {
        pageClass: "page-raport-subpage",
        identity: "raport",
        label: "CONSCIENCE REPORT",
        href: lang === "pl"
          ? "/rap-ort/conscience-report/pl/"
          : "/rap-ort/conscience-report/",
        hideSub: true
      };
    }

    if (path === "/sztab/" || path === "/sztab/pl/") {
      return {
        pageClass: "page-sztab",
        identity: "sztab",
        label: "SZTAB",
        href: lang === "pl" ? "/sztab/pl/" : "/sztab/",
        hideSub: true
      };
    }

    if (path.startsWith("/sztab/original/")) {
      return {
        pageClass: "page-sztab-origin",
        identity: "sztab",
        label: "SZTAB · ORIGIN",
        href: lang === "pl" ? "/sztab/original/pl/" : "/sztab/original/",
        hideSub: true
      };
    }

    if (path.startsWith("/sztab/battles/")) {
      return {
        pageClass: "page-sztab-battles",
        identity: "sztab",
        label: "SZTAB · BATTLES",
        href: lang === "pl" ? "/sztab/battles/pl/" : "/sztab/battles/",
        hideSub: true
      };
    }

    if (path.startsWith("/sztab/forgotten/")) {
      return {
        pageClass: "page-sztab-forgotten",
        identity: "sztab",
        label: "SZTAB · FORGOTTEN",
        href: lang === "pl" ? "/sztab/forgotten/pl/" : "/sztab/forgotten/",
        hideSub: true
      };
    }

    if (path.startsWith("/sztab/raport-z-pamieci/")) {
      return {
        pageClass: "page-sztab-album",
        identity: "sztab-manuscript",
        label: "SZTAB · Raport z Pamięci",
        href: path,
        hideSub: true
      };
    }

    return {
      pageClass: "page-neutral",
      identity: "neutral",
      preserve: true
    };
  }

  function applyPageClass(pageClass) {
    const body = getBody();
    if (!body || !pageClass) return;

    body.classList.remove(...PAGE_CLASS_NAMES);
    body.classList.add(pageClass);
  }

  function applyBrandIdentity(config) {
    const brand = document.querySelector(".site-header .brand");
    const brandName = brand?.querySelector(".brand-name");
    const brandSub = brand?.querySelector(
      ".brand-sub, .brand-sub-desktop, .brand-sub-mobile"
    );

    applyPageClass(config.pageClass);

    if (!(brand instanceof HTMLAnchorElement) || !(brandName instanceof HTMLElement)) {
      return;
    }

    brand.classList.add("unified-brand");

    if (config.href) {
      brand.href = config.href;
    }

    if (!config.preserve && config.label) {
      brandName.textContent = config.label;
    }

    brandName.classList.add("unified-brand-label");
    brandName.classList.toggle("raport-brand", config.identity === "raport");
    brandName.classList.toggle(
      "sztab-brand",
      config.identity === "sztab" || config.identity === "sztab-manuscript"
    );
    brandName.classList.toggle(
      "sztab-manuscript-brand",
      config.identity === "sztab-manuscript"
    );

    if (brandSub instanceof HTMLElement) {
      brandSub.hidden = config.hideSub === true;
      brandSub.classList.toggle("is-navbar-sub-hidden", config.hideSub === true);
    }
  }

  function rebuildDesktopNavbar() {
    const nav = document.querySelector(".site-header .desktop-nav");
    if (!(nav instanceof HTMLElement)) return;

    const lang = getCurrentLanguage();
    const routes = getResolvedLanguageRoutes();
    const existingToggle =
      nav.querySelector("#mobileNavToggle") || document.getElementById("mobileNavToggle");
    const toggle = createDesktopMenuToggle(existingToggle, lang);

    nav.classList.add("desktop-nav-compact", "site-nav-hub", "unified-navbar");
    nav.setAttribute(
      "aria-label",
      lang === "pl" ? "Nawigacja główna" : "Primary navigation"
    );
    nav.textContent = "";

    PRIMARY_NAV_ITEMS.forEach((item) => {
      nav.appendChild(createNavAnchor(item, lang));
    });

    nav.appendChild(createLanguageSwitch(lang, routes));
    nav.appendChild(toggle);
  }

  function getMenuInsertionPoint(panel) {
    return (
      panel.querySelector(".mobile-menu-button") ||
      panel.querySelector(".mobile-lang-switch") ||
      null
    );
  }

  function menuHasHref(panel, href) {
    const hasHash = href.includes("#");
    const normalizedHref = hasHash ? href : normalizePath(href);

    return Array.from(panel.querySelectorAll("a[href]")).some((link) => {
      const rawHref = link.getAttribute("href") || "";
      return hasHash ? rawHref === normalizedHref : normalizePath(rawHref) === normalizedHref;
    });
  }

  function ensureMobileMenuLink(panel, item, lang) {
    const config = item[lang] || item.en;
    if (menuHasHref(panel, config.href)) return;

    const link = document.createElement("a");
    link.className = "mobile-menu-link";
    link.href = config.href;
    link.textContent = config.label;

    if (item.trackTitle) {
      link.classList.add("track-link");
      link.dataset.trackTitle = item.trackTitle;
    }

    const insertionPoint = getMenuInsertionPoint(panel);
    panel.insertBefore(link, insertionPoint);
  }

  function ensureMobileMenuSecondaryLinks() {
    const panel = document.querySelector(".mobile-menu-panel");
    if (!(panel instanceof HTMLElement)) return;

    const lang = getCurrentLanguage();

    [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS].forEach((item) => {
      ensureMobileMenuLink(panel, item, lang);
    });
  }

  function initUnifiedNavbar() {
    ensureUnifiedNavbarCss();
    applyBrandIdentity(getBrandConfig());
    rebuildDesktopNavbar();
    ensureMobileMenuSecondaryLinks();
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

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function setMobileMenuState(open, source = "manual") {
    const html = getHtml();
    const body = getBody();
    const nextValue = open ? "open" : "closed";

    if (html) {
      html.dataset.mobileMenu = nextValue;
    }

    if (body) {
      body.dataset.mobileMenu = nextValue;
    }

    if (currentMobileMenuState === open) {
      return;
    }

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

    return Array.from(
      mobileMenuPanel.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter(isVisibleElement);
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

    const scrollbarWidth = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth
    );

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

  function resetTouchTracking() {
    touchStartX = 0;
    touchStartY = 0;
    touchCurrentX = 0;
    touchCurrentY = 0;
    touchTrackingActive = false;
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
      return;
    }

    if (mobileNavToggle instanceof HTMLElement) {
      mobileNavToggle.focus();
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

    if (!body || !mobileNavToggle || !mobileMenuOverlay || isMobileMenuOpen()) {
      return;
    }

    lastFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : mobileNavToggle;

    lockBodyScroll();

    body.classList.add("mobile-menu-open");
    syncMenuAccessibility(true);
    setMobileMenuState(true, source);

    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        focusFirstMenuItem();
      }, 40);
    });
  }

  function closeMobileMenu({ restoreFocus = true, source = "close" } = {}) {
    cacheMobileNavigationElements();

    const body = getBody();

    if (!body || !mobileNavToggle || !mobileMenuOverlay) {
      resetTouchTracking();
      setMobileMenuState(false, source);
      return;
    }

    if (!isMobileMenuOpen()) {
      resetTouchTracking();
      syncMenuAccessibility(false);
      setMobileMenuState(false, source);
      return;
    }

    body.classList.remove("mobile-menu-open");
    syncMenuAccessibility(false);
    setMobileMenuState(false, source);

    unlockBodyScroll();
    resetTouchTracking();

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      const targetToRestore = lastFocusedElement;

      window.setTimeout(() => {
        if (document.contains(targetToRestore)) {
          targetToRestore.focus();
        }
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
      if (
        active === first ||
        !(mobileMenuPanel instanceof HTMLElement) ||
        !mobileMenuPanel.contains(active)
      ) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (
      active === last ||
      !(mobileMenuPanel instanceof HTMLElement) ||
      !mobileMenuPanel.contains(active)
    ) {
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

    closeMobileMenu({ restoreFocus: false, source: "panel-click" });
  }

  function handleResizeLikeEvent() {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;

      if (!isMobileViewport() && isMobileMenuOpen()) {
        closeMobileMenu({ restoreFocus: false, source: "viewport-exit" });
        return;
      }

      setMobileMenuState(isMobileMenuOpen(), "resize-sync");
    });
  }

  function handlePageShow() {
    cacheMobileNavigationElements();

    if (isMobileMenuOpen()) {
      closeMobileMenu({ restoreFocus: false, source: "pageshow-close" });
    } else {
      unlockBodyScroll();
      resetTouchTracking();
      syncMenuAccessibility(false);
      setMobileMenuState(false, "pageshow");
    }
  }

  function handlePageHide() {
    resetTouchTracking();
    setMobileMenuState(false, "pagehide");
  }

  function handleTouchStart(event) {
    if (!isMobileMenuOpen()) return;
    if (!isMobileViewport()) return;
    if (!mobileMenuOverlay) return;
    if (mobileMenuOverlay.scrollTop > 0) return;
    if (!event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchCurrentX = touch.clientX;
    touchCurrentY = touch.clientY;
    touchTrackingActive = true;
  }

  function handleTouchMove(event) {
    if (!touchTrackingActive) return;
    if (!event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];
    touchCurrentX = touch.clientX;
    touchCurrentY = touch.clientY;
  }

  function handleTouchEnd() {
    if (!touchTrackingActive) return;

    const deltaX = touchCurrentX - touchStartX;
    const deltaY = touchCurrentY - touchStartY;

    resetTouchTracking();

    const movedMostlyVertical =
      Math.abs(deltaY) > Math.abs(deltaX) &&
      Math.abs(deltaX) <= SWIPE_MAX_HORIZONTAL_DRIFT;

    if (movedMostlyVertical && deltaY >= SWIPE_CLOSE_DISTANCE) {
      closeMobileMenu({ restoreFocus: false, source: "swipe-close" });
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
      if (!mobileNavToggle.hasAttribute("aria-expanded")) {
        mobileNavToggle.setAttribute("aria-expanded", "false");
      }

      if (!mobileNavToggle.hasAttribute("aria-controls") && mobileMenuOverlay) {
        mobileNavToggle.setAttribute("aria-controls", "mobileMenuOverlay");
      }
    }
  }

  function normalizeInitialState() {
    const body = getBody();
    if (!body) return;

    body.classList.remove("mobile-menu-open");
    syncMenuAccessibility(false);
    setMobileMenuState(false, "init");

    unlockBodyScroll();
    resetTouchTracking();
    lastFocusedElement = null;
  }

  function initTouchClose() {
    if (!mobileMenuOverlay) return;

    mobileMenuOverlay.addEventListener("touchstart", handleTouchStart, {
      passive: true
    });
    mobileMenuOverlay.addEventListener("touchmove", handleTouchMove, {
      passive: true
    });
    mobileMenuOverlay.addEventListener("touchend", handleTouchEnd, {
      passive: true
    });
    mobileMenuOverlay.addEventListener("touchcancel", handleTouchEnd, {
      passive: true
    });
  }

  function initMobileNavigation() {
    if (mobileNavigationInitialized) return;

    initUnifiedNavbar();
    cacheMobileNavigationElements();
    syncLanguageSwitchLinks();

    if (!mobileNavToggle || !mobileMenuOverlay || !mobileMenuPanel) return;

    mobileNavigationInitialized = true;

    initAccessibilityAttributes();
    normalizeInitialState();
    initTouchClose();

    mobileNavToggle.addEventListener("click", toggleMobileMenu);
    mobileMenuOverlay.addEventListener("click", handleOverlayClick);
    mobileMenuPanel.addEventListener("click", handlePanelClick);

    document.addEventListener("keydown", handleDocumentKeydown);
    document.addEventListener("focusin", handleDocumentFocusIn);

    window.addEventListener("resize", handleResizeLikeEvent);
    window.addEventListener("orientationchange", handleResizeLikeEvent);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);
  }

  window.openMobileMenu = openMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.toggleMobileMenu = toggleMobileMenu;
  window.isMobileMenuOpen = isMobileMenuOpen;

  if (document.body) {
    initMobileNavigation();
  } else {
    document.addEventListener("DOMContentLoaded", initMobileNavigation, {
      once: true
    });
  }
})();
