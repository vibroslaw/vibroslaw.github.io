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

function applyReducedMotionState(enabled, { persist = true } = {}) {
  document.body.classList.toggle("reduced-motion", enabled);

  if (persist) {
    localStorage.setItem(
      REDUCED_MOTION_STORAGE_KEY,
      enabled ? "true" : "false"
    );
  }

  if (enabled) {
    document.documentElement.style.setProperty("--hero-parallax", "0px");
  } else {
    updateHeroParallax();
  }

  updateReducedMotionButtonLabel();
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

function initReducedMotion() {
  const storedPreference = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
  const shouldReduceMotion = storedPreference === "true";

  applyReducedMotionState(shouldReduceMotion, { persist: false });

  if (!reducedMotionToggle) return;

  reducedMotionToggle.addEventListener("click", () => {
    applyReducedMotionState(!isReducedMotionEnabled());
  });
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
}

initReducedMotion();
initHeroParallax();
