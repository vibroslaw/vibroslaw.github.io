(() => {
  "use strict";

  if (window.__siteCinematicModuleInitialized) {
    return;
  }
  window.__siteCinematicModuleInitialized = true;

  const CINEMATIC_STORAGE_KEY = "siteCinematicMode";
  const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";
  const MOBILE_CINEMATIC_FAB_ID = "mobileCinematicFab";

  const CINEMATIC_ARRIVAL_CLASS = "cinematic-arrival-active";
  const CINEMATIC_TRANSITION_CLASS = "cinematic-transition-active";
  const CINEMATIC_ARRIVAL_MAX_AGE = 12000;
  const CINEMATIC_ARRIVAL_DURATION_DESKTOP = 1500;
  const CINEMATIC_ARRIVAL_DURATION_MOBILE = 1180;
  const MOBILE_BREAKPOINT = 760;

  const MOBILE_FAB_HIDE_SCROLL_DELTA = 18;
  const MOBILE_FAB_SHOW_SCROLL_DELTA = 10;
  const MOBILE_FAB_HIDE_START = 96;
  const MOBILE_FAB_NEAR_FOOTER_OFFSET = 132;
  const MOBILE_FAB_PULSE_DURATION = 560;

  let cinematicToggle = null;
  let cinematicHeroButton = null;
  let mobileCinematicToggle = null;
  let mobileCinematicFab = null;

  let cinematicModeInitialized = false;
  let cinematicArrivalTimer = null;
  let cinematicArrivalFrame = null;

  let lastKnownScrollY = 0;
  let mobileFabScrollTicking = false;
  let mobileFabForceRefreshPending = false;
  let mobileFabHiddenByScroll = false;
  let mobileFabNearFooter = false;
  let mobileFabPulseTimer = null;

  function getBody() {
    return document.body;
  }

  function pageSupportsCinematicMode() {
    return !!(
      document.getElementById("cinematicToggle") ||
      document.getElementById("cinematicHeroButton") ||
      document.getElementById("mobileCinematicToggle")
    );
  }

  function isPolishLanguage() {
    const body = getBody();
    return body?.dataset.lang === "pl";
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
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

  function runOnNextFrame(callback) {
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(callback);
      return;
    }

    window.setTimeout(callback, 16);
  }

  function supportsHaptics() {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    );
  }

  function triggerHapticFeedback(style = "light") {
    if (!isMobileViewport()) return;
    if (!supportsHaptics()) return;

    const duration = style === "firm" ? 16 : 10;

    try {
      navigator.vibrate(duration);
    } catch (error) {
      /* silent fallback */
    }
  }

  function clearMobileFabPulse() {
    if (mobileFabPulseTimer !== null) {
      window.clearTimeout(mobileFabPulseTimer);
      mobileFabPulseTimer = null;
    }

    if (mobileCinematicFab) {
      mobileCinematicFab.classList.remove("is-pulsing");
    }
  }

  function triggerMobileFabPulse() {
    if (!mobileCinematicFab) return;
    if (isReducedMotionEnabled()) return;

    clearMobileFabPulse();

    mobileCinematicFab.classList.remove("is-pulsing");
    void mobileCinematicFab.offsetWidth;
    mobileCinematicFab.classList.add("is-pulsing");

    mobileFabPulseTimer = window.setTimeout(() => {
      if (mobileCinematicFab) {
        mobileCinematicFab.classList.remove("is-pulsing");
      }
      mobileFabPulseTimer = null;
    }, MOBILE_FAB_PULSE_DURATION);
  }

  function ensureMobileCinematicFab() {
    const body = getBody();
    if (!body) return;
    if (!pageSupportsCinematicMode()) return;

    let existingFab = document.getElementById(MOBILE_CINEMATIC_FAB_ID);

    if (existingFab) {
      mobileCinematicFab = existingFab;
      return;
    }

    const fab = document.createElement("button");
    fab.type = "button";
    fab.id = MOBILE_CINEMATIC_FAB_ID;
    fab.className = "mobile-cinematic-fab";
    fab.setAttribute("aria-pressed", "false");
    fab.setAttribute("aria-label", "Cinematic Mode");
    fab.dataset.active = "false";

    body.appendChild(fab);
    mobileCinematicFab = fab;
  }

  function cacheCinematicElements() {
    cinematicToggle = document.getElementById("cinematicToggle");
    cinematicHeroButton = document.getElementById("cinematicHeroButton");
    mobileCinematicToggle = document.getElementById("mobileCinematicToggle");
    mobileCinematicFab = document.getElementById(MOBILE_CINEMATIC_FAB_ID);
  }

  function getCinematicLabels() {
    const isPL = isPolishLanguage();

    return {
      navEnter: isPL ? "Tryb kinowy" : "Cinematic Mode",
      navExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode",

      heroEnter: isPL ? "Włącz tryb kinowy" : "Enter Cinematic Mode",
      heroExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode",

      mobileMenuEnter: isPL ? "Tryb kinowy" : "Cinematic Mode",
      mobileMenuExit: isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode",

      mobileFabEnter: isPL ? "Tryb kinowy" : "Cinematic",
      mobileFabExit: isPL ? "Tryb kinowy ON" : "Cinematic ON",

      mobileFabAriaEnter: isPL ? "Włącz tryb kinowy" : "Enable Cinematic Mode",
      mobileFabAriaExit: isPL ? "Wyłącz tryb kinowy" : "Disable Cinematic Mode"
    };
  }

  function readCinematicPreference() {
    return readFromLocalStorage(CINEMATIC_STORAGE_KEY) === "true";
  }

  function saveCinematicPreference(active) {
    saveToLocalStorage(CINEMATIC_STORAGE_KEY, active ? "true" : "false");
  }

  function updateSingleButton(button, options) {
    if (!button || !options) return;

    const { text, pressed, ariaLabel } = options;

    button.textContent = text;
    button.setAttribute("aria-pressed", pressed ? "true" : "false");
    button.setAttribute("aria-label", ariaLabel || text);
    button.setAttribute("title", ariaLabel || text);
    button.dataset.active = pressed ? "true" : "false";
  }

  function setMobileFabVisualState() {
    if (!mobileCinematicFab) return;

    const shouldHide =
      !pageSupportsCinematicMode() ||
      !isMobileViewport() ||
      mobileFabHiddenByScroll ||
      isCinematicTransitionActive() ||
      isCinematicArrivalActive();

    mobileCinematicFab.classList.toggle("is-hidden", shouldHide);
    mobileCinematicFab.classList.toggle(
      "is-near-footer",
      !shouldHide && !!mobileFabNearFooter
    );

    if (shouldHide) {
      clearMobileFabPulse();
    }
  }

  function updateMobileFabScrollState(force = false) {
    if (!mobileCinematicFab) return;

    const currentY = Math.max(window.scrollY || window.pageYOffset || 0, 0);

    if (!isMobileViewport()) {
      lastKnownScrollY = currentY;
      mobileFabHiddenByScroll = false;
      mobileFabNearFooter = false;
      setMobileFabVisualState();
      return;
    }

    const deltaY = currentY - lastKnownScrollY;

    if (currentY <= MOBILE_FAB_HIDE_START) {
      mobileFabHiddenByScroll = false;
    } else if (!force) {
      if (deltaY > MOBILE_FAB_HIDE_SCROLL_DELTA) {
        mobileFabHiddenByScroll = true;
      } else if (deltaY < -MOBILE_FAB_SHOW_SCROLL_DELTA) {
        mobileFabHiddenByScroll = false;
      }
    }

    const footer = document.querySelector(".site-footer");
    if (footer instanceof HTMLElement) {
      const footerTop = footer.getBoundingClientRect().top;
      mobileFabNearFooter =
        footerTop < window.innerHeight - MOBILE_FAB_NEAR_FOOTER_OFFSET;
    } else {
      mobileFabNearFooter = false;
    }

    lastKnownScrollY = currentY;
    setMobileFabVisualState();
  }

  function requestMobileFabStateUpdate(force = false) {
    if (!mobileCinematicFab) return;

    if (mobileFabScrollTicking) {
      if (force) {
        mobileFabForceRefreshPending = true;
      }
      return;
    }

    mobileFabScrollTicking = true;

    runOnNextFrame(() => {
      const effectiveForce = force || mobileFabForceRefreshPending;
      mobileFabForceRefreshPending = false;

      updateMobileFabScrollState(effectiveForce);
      mobileFabScrollTicking = false;

      if (mobileFabForceRefreshPending) {
        requestMobileFabStateUpdate(true);
      }
    });
  }

  function updateCinematicLabels() {
    ensureMobileCinematicFab();
    cacheCinematicElements();

    const labels = getCinematicLabels();
    const active = isCinematicModeActive();

    updateSingleButton(cinematicToggle, {
      text: active ? labels.navExit : labels.navEnter,
      pressed: active
    });

    updateSingleButton(cinematicHeroButton, {
      text: active ? labels.heroExit : labels.heroEnter,
      pressed: active
    });

    updateSingleButton(mobileCinematicToggle, {
      text: active ? labels.mobileMenuExit : labels.mobileMenuEnter,
      pressed: active
    });

    updateSingleButton(mobileCinematicFab, {
      text: active ? labels.mobileFabExit : labels.mobileFabEnter,
      pressed: active,
      ariaLabel: active ? labels.mobileFabAriaExit : labels.mobileFabAriaEnter
    });

    requestMobileFabStateUpdate(true);
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
    body.style.removeProperty("pointer-events");
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

    requestMobileFabStateUpdate(true);
  }

  function clearCinematicArrivalSilently() {
    clearCinematicArrivalTimer();
    clearCinematicArrivalState();
    requestMobileFabStateUpdate(true);
  }

  function refreshUiAfterCinematicToggle() {
    updateCinematicLabels();

    if (typeof window.refreshMainUI === "function") {
      window.refreshMainUI();
    }

    if (typeof window.requestScrollLinkedUiUpdate === "function") {
      window.requestScrollLinkedUiUpdate();
    }

    if (typeof window.refreshHeroMotionSoon === "function") {
      window.refreshHeroMotionSoon();
    } else if (typeof window.requestHeroMotionUpdate === "function") {
      window.requestHeroMotionUpdate();
    }

    if (typeof window.refreshRaportPageUiSoon === "function") {
      window.refreshRaportPageUiSoon();
    } else {
      if (typeof window.requestHeroParallaxUpdate === "function") {
        window.requestHeroParallaxUpdate();
      }

      if (typeof window.requestActiveSectionUpdate === "function") {
        window.requestActiveSectionUpdate();
      }
    }

    runOnNextFrame(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
      requestMobileFabStateUpdate(true);
    });
  }

  function setCinematicMode(active, options = {}) {
    const {
      persist = true,
      notify = true,
      source = "manual",
      refreshUi = true
    } = options;

    const body = getBody();
    if (!body) return;

    const currentState = isCinematicModeActive();

    if (currentState === active) {
      updateCinematicLabels();

      if (persist) {
        saveCinematicPreference(active);
      }

      if (refreshUi && source !== "init") {
        refreshUiAfterCinematicToggle();
      }

      return;
    }

    setBodyCinematicState(active);
    updateCinematicLabels();

    if (!active) {
      finishCinematicArrival();
    }

    if (source === "mobile-fab" || source === "mobile-button") {
      triggerHapticFeedback(active ? "firm" : "light");
      triggerMobileFabPulse();
    }

    if (persist) {
      saveCinematicPreference(active);
    }

    if (notify) {
      notifyCinematicChange(active, source);
    }

    if (refreshUi && source !== "init") {
      refreshUiAfterCinematicToggle();
    }
  }

  function toggleCinematicMode(source = "manual") {
    setCinematicMode(!isCinematicModeActive(), {
      source,
      refreshUi: true
    });
  }

  function dispatchMobileMenuFallbackState(open, source = "fallback") {
    document.documentElement.dataset.mobileMenu = open ? "open" : "closed";

    document.dispatchEvent(
      new CustomEvent("site:mobile-menu-change", {
        detail: { open, source }
      })
    );
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

    dispatchMobileMenuFallbackState(false, "fallback-close");
  }

  function handleCinematicButtonClick(event) {
    if (event?.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }

    toggleCinematicMode("nav-button");
  }

  function handleMobileCinematicButtonClick(event) {
    if (event?.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }

    toggleCinematicMode("mobile-button");
    closeMobileMenuIfOpen();
  }

  function handleMobileCinematicFabClick(event) {
    if (event?.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }

    toggleCinematicMode("mobile-fab");
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
        requestMobileFabStateUpdate(true);

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
      requestMobileFabStateUpdate(true);
      return;
    }

    playCinematicArrival(payload);
  }

  function handlePageShow() {
    ensureMobileCinematicFab();
    cacheCinematicElements();
    updateCinematicLabels();
    consumeAndApplyCinematicArrival();
    lastKnownScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
    requestMobileFabStateUpdate(true);
  }

  function handlePageHide() {
    clearCinematicArrivalSilently();
    clearMobileFabPulse();
  }

  function handleMobileFabScroll() {
    requestMobileFabStateUpdate(false);
  }

  function handleMobileFabViewportChange() {
    requestMobileFabStateUpdate(true);
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      lastKnownScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
      requestMobileFabStateUpdate(true);
    }
  }

  function handleReducedMotionChange(event) {
    const enabled =
      event?.detail?.enabled === true || isReducedMotionEnabled();

    if (enabled) {
      finishCinematicArrival();
      clearMobileFabPulse();
    }

    requestMobileFabStateUpdate(true);
  }

  function initCinematicMode() {
    if (cinematicModeInitialized) return;
    cinematicModeInitialized = true;

    ensureMobileCinematicFab();
    cacheCinematicElements();

    const shouldEnable = readCinematicPreference();

    setCinematicMode(shouldEnable, {
      persist: false,
      notify: false,
      source: "init",
      refreshUi: false
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

    if (mobileCinematicFab) {
      mobileCinematicFab.addEventListener(
        "click",
        handleMobileCinematicFabClick
      );
    }

    window.addEventListener("storage", syncCinematicModeAcrossTabs);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("scroll", handleMobileFabScroll, { passive: true });
    window.addEventListener("resize", handleMobileFabViewportChange);
    window.addEventListener("orientationchange", handleMobileFabViewportChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    document.addEventListener("site:mobile-menu-change", () => {
      requestMobileFabStateUpdate(true);
    });

    document.addEventListener("site:reduced-motion-change", handleReducedMotionChange);

    document.addEventListener("site:cinematic-arrival-start", () => {
      requestMobileFabStateUpdate(true);
    });

    document.addEventListener("site:cinematic-arrival-end", () => {
      requestMobileFabStateUpdate(true);
    });

    document.addEventListener("site:cinematic-transition-start", () => {
      requestMobileFabStateUpdate(true);
    });

    document.addEventListener("site:cinematic-transition-end", () => {
      requestMobileFabStateUpdate(true);
    });

    consumeAndApplyCinematicArrival();
    updateCinematicLabels();

    lastKnownScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
    requestMobileFabStateUpdate(true);
  }

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
})();
