const pageHero = document.querySelector(".hero-home, .profile-hero");
const reducedMotionToggle = document.getElementById("reducedMotionToggle");

const REDUCED_MOTION_STORAGE_KEY = "siteReducedMotion";

const HERO_PARALLAX_CSS_VARIABLE = "--hero-parallax";
const HERO_VISIBILITY_CSS_VARIABLE = "--hero-visibility";
const HERO_PROGRESS_CSS_VARIABLE = "--hero-scroll-progress";
const HERO_FOCUS_CSS_VARIABLE = "--hero-focus";

let heroMotionTicking = false;
let systemReducedMotionQuery = null;
let heroResizeObserver = null;

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function isReducedMotionEnabled() {
  return document.body.classList.contains("reduced-motion");
}

function isCinematicModeEnabled() {
  return document.body.classList.contains("cinematic-mode");
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

function resetHeroMotionState() {
  setRootCssVariable(HERO_PARALLAX_CSS_VARIABLE, "0px");
  setRootCssVariable(HERO_VISIBILITY_CSS_VARIABLE, "0");
  setRootCssVariable(HERO_PROGRESS_CSS_VARIABLE, "0");
  setRootCssVariable(HERO_FOCUS_CSS_VARIABLE, "0");

  if (!pageHero) return;

  pageHero.classList.remove(
    "hero-in-view",
    "hero-near-focus",
    "hero-out-of-view"
  );

  document.body.classList.remove("hero-active", "hero-passive");
}

function updateHeroMotionState() {
  if (!pageHero) return;

  if (isReducedMotionEnabled()) {
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
  const motionStrength = isCinematicModeEnabled() ? 34 : 22;

  const parallaxOffset = clamp(
    centerDistanceRatio * -motionStrength,
    -motionStrength,
    motionStrength
  );

  setRootCssVariable(
    HERO_PARALLAX_CSS_VARIABLE,
    `${parallaxOffset.toFixed(2)}px`
  );

  setRootCssVariable(
    HERO_VISIBILITY_CSS_VARIABLE,
    visibilityRatio.toFixed(3)
  );

  setRootCssVariable(
    HERO_PROGRESS_CSS_VARIABLE,
    scrollProgress.toFixed(3)
  );

  setRootCssVariable(
    HERO_FOCUS_CSS_VARIABLE,
    focus.toFixed(3)
  );

  pageHero.classList.toggle("hero-in-view", visibilityRatio > 0.02);
  pageHero.classList.toggle("hero-near-focus", focus > 0.72);
  pageHero.classList.toggle("hero-out-of-view", visibilityRatio <= 0.02);

  document.body.classList.toggle("hero-active", visibilityRatio > 0.02);
  document.body.classList.toggle("hero-passive", visibilityRatio <= 0.02);
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

function applyReducedMotionState(enabled, options = {}) {
  const { persist = true, notify = true } = options;
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

  document.body.classList.toggle("reduced-motion", enabled);

  if (persist) {
    saveReducedMotionPreference(enabled);
  }

  if (enabled) {
    resetHeroMotionState();
  } else {
    requestHeroMotionUpdate();
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

function initHeroMotion() {
  if (!pageHero) return;

  requestHeroMotionUpdate();

  window.addEventListener("scroll", requestHeroMotionUpdate, { passive: true });
  window.addEventListener("resize", requestHeroMotionUpdate);
  window.addEventListener("orientationchange", requestHeroMotionUpdate);
  window.addEventListener("load", requestHeroMotionUpdate);
  window.addEventListener("pageshow", requestHeroMotionUpdate);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      requestHeroMotionUpdate();
    }
  });

  document.addEventListener("site:cinematic-change", requestHeroMotionUpdate);
  document.addEventListener("site:reduced-motion-change", requestHeroMotionUpdate);

  initHeroResizeObserver();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        requestHeroMotionUpdate();
      })
      .catch(() => {
        /* silent fallback */
      });
  }
}

initReducedMotion();
initHeroMotion();
