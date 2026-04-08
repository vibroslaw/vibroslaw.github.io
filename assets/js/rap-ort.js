(() => {
  "use strict";

  if (window.__siteRaportPageModuleInitialized) {
    return;
  }
  window.__siteRaportPageModuleInitialized = true;

  const RAPORT_HERO_SHIFT_CSS_VARIABLE = "--raport-hero-shift";

  const CINEMATIC_ARRIVAL_CLASS = "cinematic-arrival-active";
  const CINEMATIC_TRANSITION_CLASS = "cinematic-transition-active";
  const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";
  const CINEMATIC_ARRIVAL_MAX_AGE = 12000;

  const MOBILE_BREAKPOINT = 760;

  const RAPORT_HERO_MOTION_DEFAULT_DESKTOP = 28;
  const RAPORT_HERO_MOTION_DEFAULT_MOBILE = 16;
  const RAPORT_HERO_MOTION_CINEMATIC_DESKTOP = 40;
  const RAPORT_HERO_MOTION_CINEMATIC_MOBILE = 24;

  const RAPORT_HERO_LERP_DEFAULT_DESKTOP = 0.14;
  const RAPORT_HERO_LERP_DEFAULT_MOBILE = 0.18;
  const RAPORT_HERO_LERP_CINEMATIC_DESKTOP = 0.12;
  const RAPORT_HERO_LERP_CINEMATIC_MOBILE = 0.15;

  let heroRaport = null;
  let desktopSectionLinks = [];
  let mobileSectionLinks = [];
  let allSectionLinks = [];
  let observedSections = [];

  let heroParallaxTicking = false;
  let sectionStateTicking = false;
  let raportPageUiInitialized = false;

  let heroShiftAnimationFrame = null;
  let currentHeroShift = 0;
  let targetHeroShift = 0;

  let raportResizeObserver = null;

  function getBody() {
    return document.body;
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizePath(path) {
    return (path || "").replace(/\/+$/, "") || "/";
  }

  function normalizeComparableUrl(url) {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      return `${normalizePath(parsedUrl.pathname)}${parsedUrl.search}`;
    } catch (error) {
      return null;
    }
  }

  function readFromSessionStorage(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function runOnNextFrame(callback) {
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(callback);
      return;
    }

    window.setTimeout(callback, 16);
  }

  function runAfterTwoFrames(callback) {
    runOnNextFrame(() => {
      runOnNextFrame(callback);
    });
  }

  function cacheRaportUiElements() {
    heroRaport = document.querySelector(".hero-raport");

    desktopSectionLinks = Array.from(
      document.querySelectorAll('.desktop-nav a[href^="#"]')
    );

    mobileSectionLinks = Array.from(
      document.querySelectorAll('.mobile-menu-link[href^="#"]')
    );

    allSectionLinks = [...desktopSectionLinks, ...mobileSectionLinks];

    const availableAnchors = new Set(
      allSectionLinks
        .map((link) => (link.getAttribute("href") || "").trim())
        .filter((href) => href.startsWith("#") && href.length > 1)
    );

    observedSections = Array.from(
      document.querySelectorAll("main section[id]")
    ).filter((section) => availableAnchors.has(`#${section.id}`));
  }

  function hasRaportUiContent() {
    return !!heroRaport || observedSections.length > 0;
  }

  function isReducedMotionEnabled() {
    const body = getBody();
    return !!body && body.classList.contains("reduced-motion");
  }

  function isCinematicModeEnabled() {
    const body = getBody();
    return !!body && body.classList.contains("cinematic-mode");
  }

  function isCinematicArrivalActive() {
    const body = getBody();
    return !!body && body.classList.contains(CINEMATIC_ARRIVAL_CLASS);
  }

  function isCinematicTransitionActive() {
    const body = getBody();
    return !!body && body.classList.contains(CINEMATIC_TRANSITION_CLASS);
  }

  function isMobileMenuOpen() {
    const body = getBody();
    return !!body && body.classList.contains("mobile-menu-open");
  }

  function isPageTransitionActive() {
    const html = document.documentElement;
    return Boolean(html && html.dataset && html.dataset.pageTransition);
  }

  function hasPendingCinematicArrival() {
    const raw = readFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw);

      if (!parsed || typeof parsed !== "object") return false;
      if (typeof parsed.href !== "string" || !parsed.href.trim()) return false;

      if (
        typeof parsed.timestamp === "number" &&
        Date.now() - parsed.timestamp > CINEMATIC_ARRIVAL_MAX_AGE
      ) {
        return false;
      }

      const currentUrl = normalizeComparableUrl(window.location.href);
      const targetUrl = normalizeComparableUrl(parsed.href);

      if (!currentUrl || !targetUrl) return false;

      return currentUrl === targetUrl;
    } catch (error) {
      return false;
    }
  }

  function shouldSuspendRaportHeroEffects() {
    return (
      isReducedMotionEnabled() ||
      isCinematicArrivalActive() ||
      isCinematicTransitionActive() ||
      hasPendingCinematicArrival() ||
      isMobileMenuOpen() ||
      isPageTransitionActive()
    );
  }

  function shouldSuspendSectionState() {
    return (
      isCinematicArrivalActive() ||
      isCinematicTransitionActive() ||
      hasPendingCinematicArrival() ||
      isPageTransitionActive()
    );
  }

  function getRaportHeroMotionStrength() {
    if (isCinematicModeEnabled()) {
      return isMobileViewport()
        ? RAPORT_HERO_MOTION_CINEMATIC_MOBILE
        : RAPORT_HERO_MOTION_CINEMATIC_DESKTOP;
    }

    return isMobileViewport()
      ? RAPORT_HERO_MOTION_DEFAULT_MOBILE
      : RAPORT_HERO_MOTION_DEFAULT_DESKTOP;
  }

  function getRaportHeroLerpFactor() {
    if (isCinematicModeEnabled()) {
      return isMobileViewport()
        ? RAPORT_HERO_LERP_CINEMATIC_MOBILE
        : RAPORT_HERO_LERP_CINEMATIC_DESKTOP;
    }

    return isMobileViewport()
      ? RAPORT_HERO_LERP_DEFAULT_MOBILE
      : RAPORT_HERO_LERP_DEFAULT_DESKTOP;
  }

  function setRaportHeroShift(value) {
    document.documentElement.style.setProperty(
      RAPORT_HERO_SHIFT_CSS_VARIABLE,
      `${value.toFixed(2)}px`
    );
  }

  function stopHeroShiftAnimation() {
    if (heroShiftAnimationFrame !== null) {
      window.cancelAnimationFrame(heroShiftAnimationFrame);
      heroShiftAnimationFrame = null;
    }
  }

  function resetRaportHeroShift() {
    stopHeroShiftAnimation();
    currentHeroShift = 0;
    targetHeroShift = 0;
    setRaportHeroShift(0);
  }

  function computeRaportHeroTargetShift() {
    if (!heroRaport) return 0;

    const rect = heroRaport.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;

    if (!viewportHeight || rect.height <= 0) {
      return 0;
    }

    if (rect.bottom <= 0 || rect.top >= viewportHeight) {
      return 0;
    }

    const heroCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;

    const centerDistanceRatio = clamp(
      (heroCenter - viewportCenter) / (viewportHeight / 2),
      -1.25,
      1.25
    );

    const motionStrength = getRaportHeroMotionStrength();

    return clamp(
      centerDistanceRatio * -motionStrength,
      -motionStrength,
      motionStrength
    );
  }

  function animateHeroShift() {
    heroShiftAnimationFrame = null;

    const difference = targetHeroShift - currentHeroShift;
    const lerp = getRaportHeroLerpFactor();

    if (Math.abs(difference) <= 0.08) {
      currentHeroShift = targetHeroShift;
      setRaportHeroShift(currentHeroShift);

      if (currentHeroShift === 0) {
        stopHeroShiftAnimation();
      }

      return;
    }

    currentHeroShift += difference * lerp;
    setRaportHeroShift(currentHeroShift);

    heroShiftAnimationFrame = window.requestAnimationFrame(animateHeroShift);
  }

  function ensureHeroShiftAnimation() {
    if (heroShiftAnimationFrame !== null) return;
    heroShiftAnimationFrame = window.requestAnimationFrame(animateHeroShift);
  }

  function updateHeroParallax() {
    if (!heroRaport) return;

    if (shouldSuspendRaportHeroEffects()) {
      targetHeroShift = 0;
      ensureHeroShiftAnimation();
      return;
    }

    targetHeroShift = computeRaportHeroTargetShift();
    ensureHeroShiftAnimation();
  }

  function requestHeroParallaxUpdate() {
    if (!heroRaport || heroParallaxTicking) return;

    heroParallaxTicking = true;

    runOnNextFrame(() => {
      try {
        updateHeroParallax();
      } finally {
        heroParallaxTicking = false;
      }
    });
  }

  function refreshHeroParallaxSoon() {
    runAfterTwoFrames(() => {
      requestHeroParallaxUpdate();
    });
  }

  function getHeaderOffset() {
    const header = document.querySelector(".site-header");
    return header ? header.offsetHeight + 24 : 120;
  }

  function clearActiveSectionLinks() {
    if (!allSectionLinks.length) return;

    allSectionLinks.forEach((link) => {
      link.classList.remove("is-active");
    });
  }

  function setActiveSectionLinks(activeId) {
    if (!allSectionLinks.length) return;

    allSectionLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", !!activeId && href === `#${activeId}`);
    });
  }

  function getActiveSectionId() {
    if (!observedSections.length) return null;

    const headerOffset = getHeaderOffset();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;
    const anchorLine = headerOffset + Math.min(viewportHeight * 0.14, 120);

    let activeSection = null;

    for (let index = observedSections.length - 1; index >= 0; index -= 1) {
      const section = observedSections[index];
      const rect = section.getBoundingClientRect();

      if (rect.top <= anchorLine && rect.bottom > anchorLine * 0.48) {
        activeSection = section;
        break;
      }
    }

    if (activeSection) {
      return activeSection.id;
    }

    const firstSection = observedSections[0];
    if (!firstSection) return null;

    const firstRect = firstSection.getBoundingClientRect();
    if (firstRect.top > anchorLine) {
      return null;
    }

    return firstSection.id;
  }

  function updateActiveSectionLinks() {
    if (!observedSections.length || !allSectionLinks.length) return;

    if (shouldSuspendSectionState()) {
      clearActiveSectionLinks();
      return;
    }

    const activeId = getActiveSectionId();

    if (!activeId) {
      clearActiveSectionLinks();
      return;
    }

    setActiveSectionLinks(activeId);
  }

  function requestActiveSectionUpdate() {
    if (sectionStateTicking) return;

    sectionStateTicking = true;

    runOnNextFrame(() => {
      try {
        updateActiveSectionLinks();
      } finally {
        sectionStateTicking = false;
      }
    });
  }

  function refreshActiveSectionSoon() {
    runAfterTwoFrames(() => {
      requestActiveSectionUpdate();
    });
  }

  function refreshRaportPageUi() {
    requestHeroParallaxUpdate();
    requestActiveSectionUpdate();
  }

  function refreshRaportPageUiSoon() {
    cacheRaportUiElements();
    refreshHeroParallaxSoon();
    refreshActiveSectionSoon();
  }

  function handleScroll() {
    requestHeroParallaxUpdate();
    requestActiveSectionUpdate();
  }

  function handlePageShow() {
    cacheRaportUiElements();
    refreshRaportPageUiSoon();
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      refreshRaportPageUiSoon();
    }
  }

  function handleReducedMotionChange() {
    if (isReducedMotionEnabled()) {
      resetRaportHeroShift();
    }
    refreshRaportPageUiSoon();
  }

  function handleCinematicModeChange() {
    refreshRaportPageUiSoon();
  }

  function handleCinematicArrivalStart() {
    resetRaportHeroShift();
    clearActiveSectionLinks();
  }

  function handleCinematicArrivalEnd() {
    refreshRaportPageUiSoon();
  }

  function handleCinematicTransitionStart() {
    resetRaportHeroShift();
    clearActiveSectionLinks();
  }

  function handleCinematicTransitionEnd() {
    refreshRaportPageUiSoon();
  }

  function handleHashChange() {
    refreshActiveSectionSoon();
  }

  function initRaportResizeObserver() {
    if (!window.ResizeObserver) return;

    if (raportResizeObserver) {
      raportResizeObserver.disconnect();
    }

    raportResizeObserver = new ResizeObserver(() => {
      refreshRaportPageUiSoon();
    });

    if (heroRaport) {
      raportResizeObserver.observe(heroRaport);
    }

    observedSections.forEach((section) => {
      raportResizeObserver.observe(section);
    });
  }

  function initRaportPageUi() {
    if (raportPageUiInitialized) return;
    raportPageUiInitialized = true;

    cacheRaportUiElements();

    if (!hasRaportUiContent()) {
      return;
    }

    initRaportResizeObserver();
    refreshRaportPageUiSoon();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", refreshRaportPageUiSoon);
    window.addEventListener("orientationchange", refreshRaportPageUiSoon);
    window.addEventListener("load", refreshRaportPageUiSoon);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("hashchange", handleHashChange);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    document.addEventListener("site:cinematic-change", handleCinematicModeChange);
    document.addEventListener("site:reduced-motion-change", handleReducedMotionChange);
    document.addEventListener("site:cinematic-arrival-start", handleCinematicArrivalStart);
    document.addEventListener("site:cinematic-arrival-end", handleCinematicArrivalEnd);
    document.addEventListener("site:cinematic-transition-start", handleCinematicTransitionStart);
    document.addEventListener("site:cinematic-transition-end", handleCinematicTransitionEnd);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          refreshRaportPageUiSoon();
        })
        .catch(() => {
          /* silent fallback */
        });
    }
  }

  window.refreshRaportPageUi = refreshRaportPageUi;
  window.refreshRaportPageUiSoon = refreshRaportPageUiSoon;
  window.requestHeroParallaxUpdate = requestHeroParallaxUpdate;
  window.requestActiveSectionUpdate = requestActiveSectionUpdate;

  if (document.body) {
    initRaportPageUi();
  } else {
    document.addEventListener("DOMContentLoaded", initRaportPageUi, {
      once: true
    });
  }
})();
