const REDUCED_MOTION_STORAGE_KEY = "siteReducedMotion";

const HERO_PARALLAX_CSS_VARIABLE = "--hero-parallax";
const HERO_VISIBILITY_CSS_VARIABLE = "--hero-visibility";
const HERO_PROGRESS_CSS_VARIABLE = "--hero-scroll-progress";
const HERO_FOCUS_CSS_VARIABLE = "--hero-focus";

const CINEMATIC_ARRIVAL_CLASS = "cinematic-arrival-active";
const CINEMATIC_TRANSITION_CLASS = "cinematic-transition-active";
const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";
const CINEMATIC_ARRIVAL_MAX_AGE = 12000;

const HERO_MOTION_STRENGTH_DEFAULT = 22;
const HERO_MOTION_STRENGTH_CINEMATIC_DESKTOP = 42;
const HERO_MOTION_STRENGTH_CINEMATIC_MOBILE = 28;

let pageHero = null;
let reducedMotionToggle = null;

let heroMotionTicking = false;
let systemReducedMotionQuery = null;
let heroResizeObserver = null;
let heroMotionInitialized = false;
let reducedMotionInitialized = false;

function getBody() {
  return document.body;
}

function cacheUiElements() {
  pageHero = document.querySelector(".hero-home, .profile-hero");
  reducedMotionToggle = document.getElementById("reducedMotionToggle");
}

function isPolishLanguage() {
  const body = getBody();
  return body?.dataset.lang === "pl";
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

function isMobileViewport() {
  return window.innerWidth <= 760;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setRootCssVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
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

function getSystemReducedMotionPreference() {
  if (!window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readFromLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    /* silent fallback */
  }
}

function readFromSessionStorage(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function removeFromSessionStorage(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    /* silent fallback */
  }
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

function getPendingCinematicArrival() {
  const raw = readFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
      return null;
    }

    if (typeof parsed.href !== "string" || !parsed.href.trim()) {
      removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
      return null;
    }

    if (
      typeof parsed.timestamp === "number" &&
      Date.now() - parsed.timestamp > CINEMATIC_ARRIVAL_MAX_AGE
    ) {
      removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
    return null;
  }
}

function hasPendingCinematicArrival() {
  const pending = getPendingCinematicArrival();
  if (!pending) return false;

  const currentUrl = normalizeComparableUrl(window.location.href);
  const targetUrl = normalizeComparableUrl(pending.href);

  if (!currentUrl || !targetUrl) {
    removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
    return false;
  }

  const matchesCurrentPage = currentUrl === targetUrl;

  if (!matchesCurrentPage) {
    removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
    return false;
  }

  return true;
}

function shouldSuspendHeroMotion() {
  return (
    isCinematicArrivalActive() ||
    isCinematicTransitionActive() ||
    hasPendingCinematicArrival()
  );
}

function readReducedMotionPreference() {
  const stored = readFromLocalStorage(REDUCED_MOTION_STORAGE_KEY);

  if (stored === null) {
    return getSystemReducedMotionPreference();
  }

  return stored === "true";
}

function saveReducedMotionPreference(enabled) {
  saveToLocalStorage(
    REDUCED_MOTION_STORAGE_KEY,
    enabled ? "true" : "false"
  );
}

function updateReducedMotionButtonLabel() {
  if (!reducedMotionToggle) return;

  const isPL = isPolishLanguage();
  const reduced = isReducedMotionEnabled();

  reducedMotionToggle.textContent = reduced
    ? (isPL ? "Przywróć ruch" : "Restore Motion")
    : (isPL ? "Mniej ruchu" : "Reduced Motion");

  reducedMotionToggle.setAttribute(
    "aria-pressed",
    reduced ? "true" : "false"
  );

  reducedMotionToggle.setAttribute(
    "aria-label",
    reduced
      ? (isPL ? "Przywróć animacje i ruch" : "Restore animations and motion")
      : (isPL ? "Ogranicz animacje i ruch" : "Reduce animations and motion")
  );
}

function notifyReducedMotionChange(enabled) {
  document.dispatchEvent(
    new CustomEvent("site:reduced-motion-change", {
      detail: { enabled }
    })
  );
}

function setHeroMotionVariables({
  parallax = 0,
  visibility = 0,
  progress = 0,
  focus = 0
} = {}) {
  setRootCssVariable(HERO_PARALLAX_CSS_VARIABLE, `${parallax}px`);
  setRootCssVariable(HERO_VISIBILITY_CSS_VARIABLE, String(visibility));
  setRootCssVariable(HERO_PROGRESS_CSS_VARIABLE, String(progress));
  setRootCssVariable(HERO_FOCUS_CSS_VARIABLE, String(focus));
}

function resetHeroMotionState() {
  setHeroMotionVariables({
    parallax: 0,
    visibility: 0,
    progress: 0,
    focus: 0
  });

  if (pageHero) {
    pageHero.classList.remove(
      "hero-in-view",
      "hero-near-focus",
      "hero-out-of-view"
    );
  }

  const body = getBody();
  if (!body) return;

  body.classList.remove("hero-active", "hero-passive");
}

function getHeroMotionStrength() {
  if (!isCinematicModeEnabled()) {
    return HERO_MOTION_STRENGTH_DEFAULT;
  }

  return isMobileViewport()
    ? HERO_MOTION_STRENGTH_CINEMATIC_MOBILE
    : HERO_MOTION_STRENGTH_CINEMATIC_DESKTOP;
}

function updateHeroMotionState() {
  if (!pageHero) return;

  if (isReducedMotionEnabled() || shouldSuspendHeroMotion()) {
    resetHeroMotionState();
    return;
  }

  const rect = pageHero.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0;

  if (!viewportHeight || rect.height <= 0) {
    resetHeroMotionState();
    return;
  }

  const visibleTop = clamp(rect.top, 0, viewportHeight);
  const visibleBottom = clamp(rect.bottom, 0, viewportHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  const visibilityRatio = clamp(
    visibleHeight / Math.min(rect.height, viewportHeight),
    0,
    1
  );

  const travelRange = rect.height + viewportHeight;
  const scrollProgress = clamp(
    (viewportHeight - rect.top) / travelRange,
    0,
    1
  );

  const heroCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;

  const centerDistanceRatio = clamp(
    (heroCenter - viewportCenter) / (viewportHeight / 2),
    -1.25,
    1.25
  );

  const focus = clamp(1 - Math.abs(centerDistanceRatio), 0, 1);
  const motionStrength = getHeroMotionStrength();

  const parallaxOffset = clamp(
    centerDistanceRatio * -motionStrength,
    -motionStrength,
    motionStrength
  );

  setHeroMotionVariables({
    parallax: Number(parallaxOffset.toFixed(2)),
    visibility: visibilityRatio.toFixed(3),
    progress: scrollProgress.toFixed(3),
    focus: focus.toFixed(3)
  });

  pageHero.classList.toggle("hero-in-view", visibilityRatio > 0.02);
  pageHero.classList.toggle("hero-near-focus", focus > 0.72);
  pageHero.classList.toggle("hero-out-of-view", visibilityRatio <= 0.02);

  const body = getBody();
  if (!body) return;

  body.classList.toggle("hero-active", visibilityRatio > 0.02);
  body.classList.toggle("hero-passive", visibilityRatio <= 0.02);
}

function requestHeroMotionUpdate() {
  if (!pageHero || heroMotionTicking) return;

  heroMotionTicking = true;

  runOnNextFrame(() => {
    try {
      updateHeroMotionState();
    } finally {
      heroMotionTicking = false;
    }
  });
}

function refreshHeroMotionSoon() {
  runAfterTwoFrames(() => {
    requestHeroMotionUpdate();
  });
}

function applyReducedMotionState(enabled, options = {}) {
  const { persist = true, notify = true } = options;
  const body = getBody();

  if (!body) return;

  const currentState = isReducedMotionEnabled();

  if (currentState === enabled) {
    updateReducedMotionButtonLabel();

    if (enabled) {
      resetHeroMotionState();
    } else {
      requestHeroMotionUpdate();
    }

    if (persist) {
      saveReducedMotionPreference(enabled);
    }

    return;
  }

  body.classList.toggle("reduced-motion", enabled);

  if (persist) {
    saveReducedMotionPreference(enabled);
  }

  if (enabled) {
    resetHeroMotionState();
  } else {
    refreshHeroMotionSoon();
  }

  updateReducedMotionButtonLabel();

  if (notify) {
    notifyReducedMotionChange(enabled);
  }
}

function syncReducedMotionAcrossTabs(event) {
  if (event.key !== REDUCED_MOTION_STORAGE_KEY) return;

  const shouldReduceMotion =
    event.newValue === null
      ? getSystemReducedMotionPreference()
      : event.newValue === "true";

  applyReducedMotionState(shouldReduceMotion, {
    persist: false,
    notify: true
  });
}

function handleSystemReducedMotionChange(event) {
  const stored = readFromLocalStorage(REDUCED_MOTION_STORAGE_KEY);

  if (stored !== null) return;

  applyReducedMotionState(event.matches, {
    persist: false,
    notify: true
  });
}

function bindSystemReducedMotionListener() {
  if (!window.matchMedia) return;

  systemReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (typeof systemReducedMotionQuery.addEventListener === "function") {
    systemReducedMotionQuery.addEventListener(
      "change",
      handleSystemReducedMotionChange
    );
    return;
  }

  if (typeof systemReducedMotionQuery.addListener === "function") {
    systemReducedMotionQuery.addListener(handleSystemReducedMotionChange);
  }
}

function initReducedMotion() {
  if (reducedMotionInitialized) return;
  reducedMotionInitialized = true;

  cacheUiElements();

  const shouldReduceMotion = readReducedMotionPreference();

  applyReducedMotionState(shouldReduceMotion, {
    persist: false,
    notify: false
  });

  if (reducedMotionToggle) {
    reducedMotionToggle.addEventListener("click", () => {
      applyReducedMotionState(!isReducedMotionEnabled());
    });
  }

  window.addEventListener("storage", syncReducedMotionAcrossTabs);
  bindSystemReducedMotionListener();
}

function initHeroResizeObserver() {
  if (!pageHero || !window.ResizeObserver) return;

  if (heroResizeObserver) {
    heroResizeObserver.disconnect();
  }

  heroResizeObserver = new ResizeObserver(() => {
    requestHeroMotionUpdate();
  });

  heroResizeObserver.observe(pageHero);
}

function handlePageShow() {
  cacheUiElements();
  updateReducedMotionButtonLabel();
  initHeroResizeObserver();

  if (shouldSuspendHeroMotion()) {
    resetHeroMotionState();
    return;
  }

  refreshHeroMotionSoon();
}

function handleCinematicArrivalStart() {
  resetHeroMotionState();
}

function handleCinematicArrivalEnd() {
  refreshHeroMotionSoon();
}

function handleCinematicTransitionStart() {
  resetHeroMotionState();
}

function handleCinematicTransitionEnd() {
  refreshHeroMotionSoon();
}

function initHeroMotion() {
  if (heroMotionInitialized) return;
  heroMotionInitialized = true;

  cacheUiElements();

  if (!pageHero) return;

  if (shouldSuspendHeroMotion()) {
    resetHeroMotionState();
  } else {
    requestHeroMotionUpdate();
  }

  window.addEventListener("scroll", requestHeroMotionUpdate, { passive: true });
  window.addEventListener("resize", requestHeroMotionUpdate);
  window.addEventListener("orientationchange", requestHeroMotionUpdate);
  window.addEventListener("load", requestHeroMotionUpdate);
  window.addEventListener("pageshow", handlePageShow);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshHeroMotionSoon();
    }
  });

  document.addEventListener("site:cinematic-change", refreshHeroMotionSoon);
  document.addEventListener("site:reduced-motion-change", refreshHeroMotionSoon);
  document.addEventListener("site:cinematic-arrival-start", handleCinematicArrivalStart);
  document.addEventListener("site:cinematic-arrival-end", handleCinematicArrivalEnd);
  document.addEventListener("site:cinematic-transition-start", handleCinematicTransitionStart);
  document.addEventListener("site:cinematic-transition-end", handleCinematicTransitionEnd);

  initHeroResizeObserver();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        refreshHeroMotionSoon();
      })
      .catch(() => {
        /* silent fallback */
      });
  }
}

/* expose for future use */
window.applyReducedMotionState = applyReducedMotionState;
window.requestHeroMotionUpdate = requestHeroMotionUpdate;
window.refreshHeroMotionSoon = refreshHeroMotionSoon;

function initHeroAndMotionUi() {
  cacheUiElements();
  initReducedMotion();
  initHeroMotion();
  updateReducedMotionButtonLabel();
}

if (document.body) {
  initHeroAndMotionUi();
} else {
  document.addEventListener("DOMContentLoaded", initHeroAndMotionUi, {
    once: true
  });
}
