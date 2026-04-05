const homeHero = document.querySelector(".hero-home");
const reducedMotionToggle = document.getElementById("reducedMotionToggle");

const REDUCED_MOTION_STORAGE_KEY = "siteReducedMotion";
let heroParallaxTicking = false;

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function isReducedMotionEnabled() {
  return document.body.classList.contains("reduced-motion");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readReducedMotionPreference() {
  try {
    return localStorage.getItem(REDUCED_MOTION_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
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

function updateHeroParallax() {
  if (!homeHero) return;

  if (isReducedMotionEnabled()) {
    document.documentElement.style.setProperty("--hero-parallax", "0px");
    return;
  }

  const rect = homeHero.getBoundingClientRect();
  const offset = clamp(rect.top * -0.035, -18, 18);

  document.documentElement.style.setProperty(
    "--hero-parallax",
    `${offset.toFixed(2)}px`
  );
}

function requestHeroParallaxUpdate() {
  if (heroParallaxTicking) return;

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
      document.documentElement.style.setProperty("--hero-parallax", "0px");
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
    document.documentElement.style.setProperty("--hero-parallax", "0px");
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

  const shouldReduceMotion = event.newValue === "true";
  applyReducedMotionState(shouldReduceMotion, {
    persist: false,
    notify: true
  });
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
}

function initHeroParallax() {
  if (!homeHero) return;

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
