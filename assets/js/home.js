(() => {
  "use strict";

  const MOTION_SCRIPT_ID = "siteMotionScript";
  const MOTION_SCRIPT_SRC = "/assets/js/motion.js?v=9";
  const POLISH_HUB_LINKS = [
    { href: "/music-works/pl/", label: "Muzyka / Projekty", shortLabel: "Muzyka" },
    { href: "/for-institutions/pl/", label: "Dla instytucji" },
    { href: "/press-recognition/pl/", label: "Media / Wzmianki", shortLabel: "Media" }
  ];

  function hasMotionModule() {
    return !!(
      window.__siteMotionModuleInitialized ||
      document.getElementById(MOTION_SCRIPT_ID) ||
      document.querySelector('script[src*="/assets/js/motion.js"]')
    );
  }

  function ensureMotionModule() {
    if (hasMotionModule()) return;

    const script = document.createElement("script");
    script.id = MOTION_SCRIPT_ID;
    script.src = MOTION_SCRIPT_SRC;
    script.defer = true;

    const target = document.body || document.head || document.documentElement;
    target?.appendChild(script);
  }

  function isPolishHome() {
    const body = document.body;
    return !!body && body.dataset.page === "home" && body.dataset.lang === "pl";
  }

  function createMenuLink(link) {
    const item = document.createElement("a");
    item.className = "mobile-menu-link";
    item.href = link.href;
    item.textContent = link.label;
    return item;
  }

  function createNavLink(link) {
    const item = document.createElement("a");
    item.className = "nav-button";
    item.href = link.href;
    item.textContent = link.shortLabel || link.label;
    return item;
  }

  function hasLink(container, href) {
    return !!container?.querySelector(`a[href="${href}"]`);
  }

  function enhancePolishHomeNavigation() {
    if (!isPolishHome()) return;

    const mobilePanel = document.querySelector(".mobile-menu-panel");
    const profileLink = mobilePanel?.querySelector('a[href="/authorial-profile/pl/"]');

    if (mobilePanel && profileLink) {
      POLISH_HUB_LINKS.forEach((link) => {
        if (hasLink(mobilePanel, link.href)) return;
        mobilePanel.insertBefore(createMenuLink(link), profileLink);
      });
    }

    const desktopNav = document.querySelector(".desktop-nav");
    const cinematicToggle = document.getElementById("cinematicToggle");
    const musicLink = POLISH_HUB_LINKS[0];

    if (desktopNav && cinematicToggle && !hasLink(desktopNav, musicLink.href)) {
      desktopNav.insertBefore(createNavLink(musicLink), cinematicToggle);
    }
  }

  enhancePolishHomeNavigation();
  ensureMotionModule();
})();
