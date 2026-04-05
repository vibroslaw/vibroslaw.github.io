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

function getCinematicLabels() {
  const isPL = isPolishLanguage();

  return {
    navEnter: isPL ? "Tryb kinowy" : "Cinematic Mode",
    navExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode",
    heroEnter: isPL ? "Włącz tryb kinowy" : "Enter Cinematic Mode",
    heroExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode"
  };
}

function updateCinematicLabels() {
  const labels = getCinematicLabels();
  const active = isCinematicModeActive();

  if (cinematicToggle) {
    cinematicToggle.textContent = active ? labels.navExit : labels.navEnter;
    cinematicToggle.setAttribute("aria-pressed", active ? "true" : "false");
    cinematicToggle.setAttribute(
      "aria-label",
      active ? labels.navExit : labels.navEnter
    );
  }

  if (cinematicHeroButton) {
    cinematicHeroButton.textContent = active ? labels.heroExit : labels.heroEnter;
    cinematicHeroButton.setAttribute("aria-pressed", active ? "true" : "false");
    cinematicHeroButton.setAttribute(
      "aria-label",
      active ? labels.heroExit : labels.heroEnter
    );
  }

  if (mobileCinematicToggle) {
    mobileCinematicToggle.textContent = active ? labels.heroExit : labels.navEnter;
    mobileCinematicToggle.setAttribute("aria-pressed", active ? "true" : "false");
    mobileCinematicToggle.setAttribute(
      "aria-label",
      active ? labels.heroExit : labels.navEnter
    );
  }
}

function saveCinematicPreference(active) {
  localStorage.setItem(CINEMATIC_STORAGE_KEY, active ? "true" : "false");
}

function notifyCinematicChange(active) {
  document.dispatchEvent(
    new CustomEvent("site:cinematic-change", {
      detail: { active }
    })
  );
}

function setCinematicMode(active, options = {}) {
  const { persist = true } = options;

  document.body.classList.toggle("cinematic-mode", active);
  updateCinematicLabels();

  if (persist) {
    saveCinematicPreference(active);
  }

  notifyCinematicChange(active);
}

function toggleCinematicMode() {
  setCinematicMode(!isCinematicModeActive());
}

function closeMobileMenuIfOpen() {
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
}

function handleCinematicButtonClick() {
  toggleCinematicMode();
}

function handleMobileCinematicButtonClick() {
  toggleCinematicMode();
  closeMobileMenuIfOpen();
}

function initCinematicMode() {
  const storedPreference = localStorage.getItem(CINEMATIC_STORAGE_KEY);
  const shouldEnable = storedPreference === "true";

  setCinematicMode(shouldEnable, { persist: false });

  if (cinematicToggle) {
    cinematicToggle.addEventListener("click", handleCinematicButtonClick);
  }

  if (cinematicHeroButton) {
    cinematicHeroButton.addEventListener("click", handleCinematicButtonClick);
  }

  if (mobileCinematicToggle) {
    mobileCinematicToggle.addEventListener("click", handleMobileCinematicButtonClick);
  }
}

initCinematicMode();
