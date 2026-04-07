const CINEMATIC_STORAGE_KEY = "siteCinematicMode";
const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";

const CINEMATIC_ARRIVAL_CLASS = "cinematic-arrival-active";
const CINEMATIC_TRANSITION_CLASS = "cinematic-transition-active";
const CINEMATIC_ARRIVAL_MAX_AGE = 12000;
const CINEMATIC_ARRIVAL_DURATION_DESKTOP = 1500;
const CINEMATIC_ARRIVAL_DURATION_MOBILE = 1180;
const MOBILE_BREAKPOINT = 760;

let cinematicToggle = null;
let cinematicHeroButton = null;
let mobileCinematicToggle = null;

let cinematicModeInitialized = false;
let cinematicArrivalTimer = null;
let cinematicArrivalFrame = null;

function getBody() {
  return document.body;
}

function cacheCinematicElements() {
  cinematicToggle = document.getElementById("cinematicToggle");
  cinematicHeroButton = document.getElementById("cinematicHeroButton");
  mobileCinematicToggle = document.getElementById("mobileCinematicToggle");
}

function isPolishLanguage() {
  const body = getBody();
  return body?.dataset.lang === "pl";
}

function isCinematicModeActive() {
  const body = getBody();
  return !!body && body.classList.contains("cinematic-mode");
}

function isReducedMotionEnabled() {
  const body = getBody();

  if (body?.classList.contains("reduced-motion")) {
    return true;
  }

  if (window.matchMedia) {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return false;
}

function isMobileViewport() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function isCinematicArrivalActive() {
  const body = getBody();
  return !!body && body.classList.contains(CINEMATIC_ARRIVAL_CLASS);
}

function isCinematicTransitionActive() {
  const body = getBody();
  return !!body && body.classList.contains(CINEMATIC_TRANSITION_CLASS);
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

function getCurrentComparableUrl() {
  return normalizeComparableUrl(window.location.href);
}

function getCinematicLabels() {
  const isPL = isPolishLanguage();

  return {
    navEnter: isPL ? "Tryb kinowy" : "Cinematic Mode",
    navExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode",

    heroEnter: isPL ? "Włącz tryb kinowy" : "Enter Cinematic Mode",
    heroExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode",

    mobileEnter: isPL ? "Włącz tryb kinowy" : "Enter Cinematic Mode",
    mobileExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode"
  };
}

function readCinematicPreference() {
  return readFromLocalStorage(CINEMATIC_STORAGE_KEY) === "true";
}

function saveCinematicPreference(active) {
  saveToLocalStorage(CINEMATIC_STORAGE_KEY, active ? "true" : "false");
}

function updateSingleButton(button, text, pressed) {
  if (!button) return;

  button.textContent = text;
  button.setAttribute("aria-pressed", pressed ? "true" : "false");
  button.setAttribute("aria-label", text);
  button.setAttribute("title", text);
}

function updateCinematicLabels() {
  cacheCinematicElements();

  const labels = getCinematicLabels();
  const active = isCinematicModeActive();

  updateSingleButton(
    cinematicToggle,
    active ? labels.navExit : labels.navEnter,
    active
  );

  updateSingleButton(
    cinematicHeroButton,
    active ? labels.heroExit : labels.heroEnter,
    active
  );

  updateSingleButton(
    mobileCinematicToggle,
    active ? labels.mobileExit : labels.mobileEnter,
    active
  );
}

function notifyCinematicChange(active, source = "manual") {
  document.dispatchEvent(
    new CustomEvent("site:cinematic-change", {
      detail: { active, source }
    })
  );
}

function notifyCinematicArrivalStart(payload) {
  document.dispatchEvent(
    new CustomEvent("site:cinematic-arrival-start", {
      detail: payload || {}
    })
  );
}

function notifyCinematicArrivalEnd(payload) {
  document.dispatchEvent(
    new CustomEvent("site:cinematic-arrival-end", {
      detail: payload || {}
    })
  );
}

function setBodyCinematicState(active) {
  const body = getBody();
  if (!body) return;

  body.classList.toggle("cinematic-mode", active);
  body.dataset.cinematic = active ? "on" : "off";
  document.documentElement.dataset.cinematic = active ? "on" : "off";
}

function clearCinematicArrivalState() {
  const body = getBody();
  if (!body) return;

  body.classList.remove(CINEMATIC_ARRIVAL_CLASS);
  delete body.dataset.cinematicArrival;
  delete body.dataset.cinematicArrivalKey;
  delete body.dataset.cinematicArrivalTitle;
}

function clearCinematicArrivalTimer() {
  if (cinematicArrivalTimer !== null) {
    window.clearTimeout(cinematicArrivalTimer);
    cinematicArrivalTimer = null;
  }

  if (cinematicArrivalFrame !== null) {
    window.cancelAnimationFrame(cinematicArrivalFrame);
    cinematicArrivalFrame = null;
  }
}

function finishCinematicArrival(payload = null) {
  const wasActive =
    isCinematicArrivalActive() ||
    cinematicArrivalTimer !== null ||
    cinematicArrivalFrame !== null;

  clearCinematicArrivalTimer();
  clearCinematicArrivalState();

  if (wasActive) {
    notifyCinematicArrivalEnd(payload);
  }
}

function clearCinematicArrivalSilently() {
  clearCinematicArrivalTimer();
  clearCinematicArrivalState();
}

function setCinematicMode(active, options = {}) {
  const {
    persist = true,
    notify = true,
    source = "manual"
  } = options;

  const body = getBody();
  if (!body) return;

  const currentState = isCinematicModeActive();

  if (currentState === active) {
    updateCinematicLabels();

    if (persist) {
      saveCinematicPreference(active);
    }

    return;
  }

  setBodyCinematicState(active);
  updateCinematicLabels();

  if (!active) {
    finishCinematicArrival();
  }

  if (persist) {
    saveCinematicPreference(active);
  }

  if (notify) {
    notifyCinematicChange(active, source);
  }
}

function toggleCinematicMode(source = "manual") {
  setCinematicMode(!isCinematicModeActive(), { source });
}

function closeMobileMenuIfOpen() {
  const body = getBody();
  if (!body || !body.classList.contains("mobile-menu-open")) return;

  if (typeof window.closeMobileMenu === "function") {
    window.closeMobileMenu({ restoreFocus: false });
    return;
  }

  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileNavToggle = document.getElementById("mobileNavToggle");

  const savedTop = body.style.top;
  const restoredScrollY = savedTop
    ? Math.abs(parseInt(savedTop, 10)) || 0
    : 0;

  body.classList.remove("mobile-menu-open");

  if (mobileMenuOverlay) {
    mobileMenuOverlay.setAttribute("aria-hidden", "true");
  }

  if (mobileNavToggle) {
    mobileNavToggle.setAttribute("aria-expanded", "false");
  }

  body.style.removeProperty("top");
  body.style.removeProperty("position");
  body.style.removeProperty("width");
  body.style.removeProperty("left");
  body.style.removeProperty("right");
  body.style.removeProperty("overflowY");
  body.style.removeProperty("paddingRight");

  if (restoredScrollY > 0) {
    window.scrollTo(0, restoredScrollY);
  }
}

function handleCinematicButtonClick() {
  toggleCinematicMode("button");
}

function handleMobileCinematicButtonClick() {
  toggleCinematicMode("mobile-button");
  closeMobileMenuIfOpen();
}

function syncCinematicModeAcrossTabs(event) {
  if (event.key !== CINEMATIC_STORAGE_KEY) return;

  const shouldEnable = event.newValue === "true";

  setCinematicMode(shouldEnable, {
    persist: false,
    notify: true,
    source: "storage-sync"
  });
}

function getArrivalDuration(payload = null) {
  const cap = isMobileViewport()
    ? CINEMATIC_ARRIVAL_DURATION_MOBILE
    : CINEMATIC_ARRIVAL_DURATION_DESKTOP;

  if (payload && typeof payload.duration === "number" && payload.duration > 0) {
    return Math.max(700, Math.min(payload.duration + 220, cap));
  }

  return cap;
}

function readCinematicArrivalPayload() {
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

    return parsed;
  } catch (error) {
    removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);
    return null;
  }
}

function shouldPlayCinematicArrival(payload) {
  if (!payload) return false;
  if (!isCinematicModeActive()) return false;
  if (isReducedMotionEnabled()) return false;
  if (isCinematicTransitionActive()) return false;

  const currentUrl = getCurrentComparableUrl();
  const targetUrl = normalizeComparableUrl(payload.href);

  if (!currentUrl || !targetUrl || currentUrl !== targetUrl) {
    return false;
  }

  if (
    typeof payload.timestamp === "number" &&
    Date.now() - payload.timestamp > CINEMATIC_ARRIVAL_MAX_AGE
  ) {
    return false;
  }

  return true;
}

function playCinematicArrival(payload) {
  const body = getBody();
  if (!body) return;

  clearCinematicArrivalTimer();
  clearCinematicArrivalState();

  body.dataset.cinematicArrival = payload?.key || "entry";
  body.dataset.cinematicArrivalKey = payload?.key || "entry";
  body.dataset.cinematicArrivalTitle = payload?.title || "";

  cinematicArrivalFrame = window.requestAnimationFrame(() => {
    cinematicArrivalFrame = window.requestAnimationFrame(() => {
      body.classList.add(CINEMATIC_ARRIVAL_CLASS);

      const duration = getArrivalDuration(payload);
      const detail = {
        ...(payload || {}),
        duration
      };

      notifyCinematicArrivalStart(detail);

      cinematicArrivalTimer = window.setTimeout(() => {
        finishCinematicArrival(detail);
      }, duration);
    });
  });
}

function consumeAndApplyCinematicArrival() {
  const payload = readCinematicArrivalPayload();

  removeFromSessionStorage(CINEMATIC_ARRIVAL_STORAGE_KEY);

  if (!shouldPlayCinematicArrival(payload)) {
    clearCinematicArrivalState();
    return;
  }

  playCinematicArrival(payload);
}

function handlePageShow() {
  cacheCinematicElements();
  updateCinematicLabels();
  consumeAndApplyCinematicArrival();
}

function handlePageHide() {
  clearCinematicArrivalSilently();
}

function initCinematicMode() {
  if (cinematicModeInitialized) return;
  cinematicModeInitialized = true;

  cacheCinematicElements();

  const shouldEnable = readCinematicPreference();

  setCinematicMode(shouldEnable, {
    persist: false,
    notify: false,
    source: "init"
  });

  if (cinematicToggle) {
    cinematicToggle.addEventListener("click", handleCinematicButtonClick);
  }

  if (cinematicHeroButton) {
    cinematicHeroButton.addEventListener("click", handleCinematicButtonClick);
  }

  if (mobileCinematicToggle) {
    mobileCinematicToggle.addEventListener(
      "click",
      handleMobileCinematicButtonClick
    );
  }

  window.addEventListener("storage", syncCinematicModeAcrossTabs);
  window.addEventListener("pageshow", handlePageShow);
  window.addEventListener("pagehide", handlePageHide);

  consumeAndApplyCinematicArrival();
}

/* expose for future use */
window.setCinematicMode = setCinematicMode;
window.toggleCinematicMode = toggleCinematicMode;
window.isCinematicModeActive = isCinematicModeActive;
window.updateCinematicLabels = updateCinematicLabels;
window.consumeAndApplyCinematicArrival = consumeAndApplyCinematicArrival;
window.finishCinematicArrival = finishCinematicArrival;

if (document.body) {
  initCinematicMode();
} else {
  document.addEventListener("DOMContentLoaded", initCinematicMode, {
    once: true
  });
}
