const RAPORT_HERO_SHIFT_CSS_VARIABLE = "--raport-hero-shift";

const CINEMATIC_ARRIVAL_CLASS = "cinematic-arrival-active";
const CINEMATIC_TRANSITION_CLASS = "cinematic-transition-active";
const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";
const CINEMATIC_ARRIVAL_MAX_AGE = 12000;

const RAPORT_HERO_MOTION_DEFAULT = 28;
const RAPORT_HERO_MOTION_CINEMATIC = 40;

let heroRaport = null;
let desktopSectionLinks = [];
let mobileSectionLinks = [];
let allSectionLinks = [];
let observedSections = [];

let heroParallaxTicking = false;
let sectionStateTicking = false;
let raportPageUiInitialized = false;

function getBody() {
  return document.body;
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

  observedSections = Array.from(
    document.querySelectorAll("main section[id]")
  );
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
    hasPendingCinematicArrival()
  );
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

function setRaportHeroShift(value) {
  document.documentElement.style.setProperty(
    RAPORT_HERO_SHIFT_CSS_VARIABLE,
    `${value.toFixed(2)}px`
  );
}

function resetRaportHeroShift() {
  document.documentElement.style.setProperty(
    RAPORT_HERO_SHIFT_CSS_VARIABLE,
    "0px"
  );
}

/* ---------- HERO PARALLAX ---------- */

function getRaportHeroMotionStrength() {
  return isCinematicModeEnabled()
    ? RAPORT_HERO_MOTION_CINEMATIC
    : RAPORT_HERO_MOTION_DEFAULT;
}

function updateHeroParallax() {
  if (!heroRaport) return;

  if (shouldSuspendRaportHeroEffects()) {
    resetRaportHeroShift();
    return;
  }

  const rect = heroRaport.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0;

  if (!viewportHeight || rect.height <= 0) {
    resetRaportHeroShift();
    return;
  }

  if (rect.bottom <= 0 || rect.top >= viewportHeight) {
    resetRaportHeroShift();
    return;
  }

  const heroCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;

  const centerDistanceRatio = clamp(
    (heroCenter - viewportCenter) / (viewportHeight / 2),
    -1.25,
    1.25
  );

  const motionStrength = getRaportHeroMotionStrength();

  const shift = clamp(
    centerDistanceRatio * -motionStrength,
    -motionStrength,
    motionStrength
  );

  setRaportHeroShift(shift);
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

/* ---------- ACTIVE SECTION LINKS ---------- */

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

function updateActiveSectionLinks() {
  if (!observedSections.length || !allSectionLinks.length) return;

  if (
    isCinematicArrivalActive() ||
    isCinematicTransitionActive() ||
    hasPendingCinematicArrival()
  ) {
    clearActiveSectionLinks();
    return;
  }

  const headerOffset = getHeaderOffset();
  const scrollPosition = window.scrollY + headerOffset;

  const firstSection = observedSections[0];

  if (!firstSection) {
    clearActiveSectionLinks();
    return;
  }

  if (scrollPosition < firstSection.offsetTop - headerOffset * 0.5) {
    clearActiveSectionLinks();
    return;
  }

  let activeId = firstSection.id;

  observedSections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

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

/* ---------- GLOBAL REFRESH ---------- */

function refreshRaportPageUi() {
  cacheRaportUiElements();
  requestHeroParallaxUpdate();
  requestActiveSectionUpdate();
}

function refreshRaportPageUiSoon() {
  cacheRaportUiElements();
  refreshHeroParallaxSoon();
  refreshActiveSectionSoon();
}

/* ---------- EVENT HANDLERS ---------- */

function handlePageShow() {
  refreshRaportPageUiSoon();
}

function handleVisibilityChange() {
  if (!document.hidden) {
    refreshRaportPageUiSoon();
  }
}

function handleReducedMotionChange() {
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

/* ---------- INIT ---------- */

function initRaportPageUi() {
  if (raportPageUiInitialized) return;
  raportPageUiInitialized = true;

  cacheRaportUiElements();

  if (!heroRaport && observedSections.length === 0) {
    return;
  }

  refreshRaportPageUiSoon();

  window.addEventListener("scroll", refreshRaportPageUi, { passive: true });
  window.addEventListener("resize", refreshRaportPageUiSoon);
  window.addEventListener("orientationchange", refreshRaportPageUiSoon);
  window.addEventListener("load", refreshRaportPageUiSoon);
  window.addEventListener("pageshow", handlePageShow);
  window.addEventListener("hashchange", refreshActiveSectionSoon);

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

/* expose for future use */
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
