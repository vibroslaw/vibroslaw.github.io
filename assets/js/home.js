const pageHero = document.querySelector(".hero-home, .profile-hero");
const reducedMotionToggle = document.getElementById("reducedMotionToggle");

const REDUCED_MOTION_STORAGE_KEY = "siteReducedMotion";
const HERO_PARALLAX_CSS_VARIABLE = "--hero-parallax";

let heroParallaxTicking = false;
let systemReducedMotionQuery = null;

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function isReducedMotionEnabled() {
  return document.body.classList.contains("reduced-motion");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getSystemReducedMotionPreference() {
  if (!window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readReducedMotionPreference() {
  try {
    const stored = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);

    if (stored === null) {
      return getSystemReducedMotionPreference();
    }

    return stored === "true";
  } catch (error) {
    return getSystemReducedMotionPreference();
  }
}

function saveReducedMotionPreference(enabled) {
  try {
    localStorage.setItem(
      REDUCED_MOTION_STORAGE_KEY,
      enabled ? "true" : "false"
    );
  } catch (error) {
    /* silent fallback */
  }
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

function setHeroParallax(value) {
  document.documentElement.style.setProperty(
    HERO_PARALLAX_CSS_VARIABLE,
    `${value.toFixed(2)}px`
  );
}

function resetHeroParallax() {
  document.documentElement.style.setProperty(
    HERO_PARALLAX_CSS_VARIABLE,
    "0px"
  );
}

function updateHeroParallax() {
  if (!pageHero) return;

  if (isReducedMotionEnabled()) {
    resetHeroParallax();
    return;
  }

  const rect = pageHero.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (rect.bottom <= 0 || rect.top >= viewportHeight) {
    resetHeroParallax();
    return;
  }

  const heroCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;
  const distanceFromCenter = heroCenter - viewportCenter;

  const offset = clamp(distanceFromCenter * -0.045, -26, 26);

  setHeroParallax(offset);
}

function requestHeroParallaxUpdate() {
  if (!pageHero || heroParallaxTicking) return;

  heroParallaxTicking = true;

  window.requestAnimationFrame(() => {
    updateHeroParallax();
    heroParallaxTicking = false;
  });
}

function applyReducedMotionState(enabled, options = {}) {
  const { persist = true, notify = true } = options;
  const currentState = isReducedMotionEnabled();

  if (currentState === enabled) {
    updateReducedMotionButtonLabel();

    if (enabled) {
      resetHeroParallax();
    } else {
      requestHeroParallaxUpdate();
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
    resetHeroParallax();
  } else {
    requestHeroParallaxUpdate();
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
  try {
    const stored = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);

    if (stored !== null) return;

    applyReducedMotionState(event.matches, {
      persist: false,
      notify: true
    });
  } catch (error) {
    applyReducedMotionState(event.matches, {
      persist: false,
      notify: true
    });
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

  if (window.matchMedia) {
    systemReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (typeof systemReducedMotionQuery.addEventListener === "function") {
      systemReducedMotionQuery.addEventListener("change", handleSystemReducedMotionChange);
    } else if (typeof systemReducedMotionQuery.addListener === "function") {
      systemReducedMotionQuery.addListener(handleSystemReducedMotionChange);
    }
  }
}

function initHeroParallax() {
  if (!pageHero) return;

  requestHeroParallaxUpdate();

  window.addEventListener("scroll", requestHeroParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestHeroParallaxUpdate);
  window.addEventListener("orientationchange", requestHeroParallaxUpdate);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      requestHeroParallaxUpdate();
    }
  });

  document.addEventListener("site:cinematic-change", requestHeroParallaxUpdate);
  document.addEventListener("site:reduced-motion-change", requestHeroParallaxUpdate);
}

initReducedMotion();
initHeroParallax();
