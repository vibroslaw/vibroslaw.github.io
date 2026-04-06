const cinematicToggle = document.getElementById("cinematicToggle");
const cinematicHeroButton = document.getElementById("cinematicHeroButton");
const mobileCinematicToggle = document.getElementById("mobileCinematicToggle");

const CINEMATIC_STORAGE_KEY = "siteCinematicMode";

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function isCinematicModeActive() {
  return document.body.classList.contains("cinematic-mode");
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

function setBodyCinematicState(active) {
  document.body.classList.toggle("cinematic-mode", active);
  document.body.dataset.cinematic = active ? "on" : "off";
  document.documentElement.dataset.cinematic = active ? "on" : "off";
}

function setCinematicMode(active, options = {}) {
  const {
    persist = true,
    notify = true,
    source = "manual"
  } = options;

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
  if (!document.body.classList.contains("mobile-menu-open")) return;

  if (typeof window.closeMobileMenu === "function") {
    window.closeMobileMenu({ restoreFocus: false });
    return;
  }

  document.body.classList.remove("mobile-menu-open");

  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileNavToggle = document.getElementById("mobileNavToggle");

  if (mobileMenuOverlay) {
    mobileMenuOverlay.setAttribute("aria-hidden", "true");
  }

  if (mobileNavToggle) {
    mobileNavToggle.setAttribute("aria-expanded", "false");
  }

  document.body.style.removeProperty("top");
  document.body.style.removeProperty("position");
  document.body.style.removeProperty("width");
  document.body.style.removeProperty("left");
  document.body.style.removeProperty("right");
  document.body.style.removeProperty("overflowY");
  document.body.style.removeProperty("paddingRight");
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

function initCinematicMode() {
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
    mobileCinematicToggle.addEventListener("click", handleMobileCinematicButtonClick);
  }

  window.addEventListener("storage", syncCinematicModeAcrossTabs);
}

/* expose for future use */
window.setCinematicMode = setCinematicMode;
window.toggleCinematicMode = toggleCinematicMode;
window.isCinematicModeActive = isCinematicModeActive;

initCinematicMode();
