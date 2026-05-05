(() => {
  "use strict";

  if (window.__siteMotionModuleInitialized) {
    return;
  }
  window.__siteMotionModuleInitialized = true;

  const CONFIG = {
    storage: {
      reducedMotion: "siteReducedMotion",
      cinematicArrival: "siteCinematicArrival"
    },

    classes: {
      reducedMotion: "reduced-motion",
      cinematicMode: "cinematic-mode",
      cinematicArrival: "cinematic-arrival-active",
      cinematicTransition: "cinematic-transition-active",
      heroInView: "hero-in-view",
      heroNearFocus: "hero-near-focus",
      heroOutOfView: "hero-out-of-view",
      heroActive: "hero-active",
      heroPassive: "hero-passive",
      mobileMenuOpen: "mobile-menu-open"
    },

    selectors: {
      hero: ".hero-home, .profile-hero, .hero-ps, .hero-cr, .hero-raport, .hero-sztab, .hub-hero",
      reducedMotionToggle: "#reducedMotionToggle"
    },

    cssVars: {
      heroParallax: "--hero-parallax",
      heroVisibility: "--hero-visibility",
      heroProgress: "--hero-scroll-progress",
      heroFocus: "--hero-focus"
    },

    breakpoints: {
      mobile: 760
    },

    timing: {
      cinematicArrivalMaxAge: 12000
    },

    motion: {
      defaultStrength: 22,
      cinematicDesktopStrength: 42,
      cinematicMobileStrength: 28
    }
  };

  const state = {
    pageHero: null,
    reducedMotionToggle: null,

    heroMotionTicking: false,
    heroResizeObserver: null,
    systemReducedMotionQuery: null,

    reducedMotionInitialized: false,
    heroMotionInitialized: false,

    cachedArrivalRaw: null,
    cachedArrivalPayload: null
  };

  function getBody() {
    return document.body;
  }

  function getDocumentElement() {
    return document.documentElement;
  }

  function hasBodyClass(className) {
    const body = getBody();
    return !!body && body.classList.contains(className);
  }

  function cacheUiElements() {
    state.pageHero = document.querySelector(CONFIG.selectors.hero);
    state.reducedMotionToggle = document.querySelector(
      CONFIG.selectors.reducedMotionToggle
    );
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function isMobileViewport() {
    return window.innerWidth <= CONFIG.breakpoints.mobile;
  }

  function isPolishLanguage() {
    const body = getBody();
    return !!body && body.getAttribute("data-lang") === "pl";
  }

  function isReducedMotionEnabled() {
    return hasBodyClass(CONFIG.classes.reducedMotion);
  }

  function isCinematicModeEnabled() {
    return hasBodyClass(CONFIG.classes.cinematicMode);
  }

  function isCinematicArrivalActive() {
    return hasBodyClass(CONFIG.classes.cinematicArrival);
  }

  function isCinematicTransitionActive() {
    return hasBodyClass(CONFIG.classes.cinematicTransition);
  }

  function isMobileMenuOpen() {
    const body = getBody();
    const html = getDocumentElement();

    if (body && body.classList.contains(CONFIG.classes.mobileMenuOpen)) {
      return true;
    }

    return html?.dataset.mobileMenu === "open";
  }

  function setRootCssVariable(name, value) {
    getDocumentElement().style.setProperty(name, value);
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

  function getSystemReducedMotionPreference() {
    if (!window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function normalizePath(path) {
    return (path || "").replace(/\/+$/, "") || "/";
  }

  function normalizeComparableUrl(url) {
    try {
      const parsed = new URL(url, window.location.origin);
      return `${normalizePath(parsed.pathname)}${parsed.search}`;
    } catch (error) {
      return null;
    }
  }

  function invalidateArrivalCache() {
    state.cachedArrivalRaw = null;
    state.cachedArrivalPayload = null;
  }

  function getPendingCinematicArrival() {
    const raw = readFromSessionStorage(CONFIG.storage.cinematicArrival);

    if (raw === state.cachedArrivalRaw) {
      return state.cachedArrivalPayload;
    }

    state.cachedArrivalRaw = raw;
    state.cachedArrivalPayload = null;

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);

      if (!parsed || typeof parsed !== "object") {
        removeFromSessionStorage(CONFIG.storage.cinematicArrival);
        invalidateArrivalCache();
        return null;
      }

      if (typeof parsed.href !== "string" || !parsed.href.trim()) {
        removeFromSessionStorage(CONFIG.storage.cinematicArrival);
        invalidateArrivalCache();
        return null;
      }

      if (
        typeof parsed.timestamp === "number" &&
        Date.now() - parsed.timestamp > CONFIG.timing.cinematicArrivalMaxAge
      ) {
        removeFromSessionStorage(CONFIG.storage.cinematicArrival);
        invalidateArrivalCache();
        return null;
      }

      state.cachedArrivalPayload = parsed;
      return parsed;
    } catch (error) {
      removeFromSessionStorage(CONFIG.storage.cinematicArrival);
      invalidateArrivalCache();
      return null;
    }
  }

  function hasPendingCinematicArrival() {
    const pending = getPendingCinematicArrival();
    if (!pending) return false;

    const currentUrl = normalizeComparableUrl(window.location.href);
    const targetUrl = normalizeComparableUrl(pending.href);

    if (!currentUrl || !targetUrl) {
      removeFromSessionStorage(CONFIG.storage.cinematicArrival);
      invalidateArrivalCache();
      return false;
    }

    if (currentUrl !== targetUrl) {
      removeFromSessionStorage(CONFIG.storage.cinematicArrival);
      invalidateArrivalCache();
      return false;
    }

    return true;
  }

  function shouldSuspendHeroMotion() {
    return (
      isMobileMenuOpen() ||
      isCinematicArrivalActive() ||
      isCinematicTransitionActive() ||
      hasPendingCinematicArrival()
    );
  }

  function getReducedMotionLabels() {
    if (isPolishLanguage()) {
      return {
        inactiveText: "Mniej ruchu",
        activeText: "Przywróć ruch",
        inactiveAria: "Ogranicz animacje i ruch",
        activeAria: "Przywróć animacje i ruch"
      };
    }

    return {
      inactiveText: "Reduced Motion",
      activeText: "Restore Motion",
      inactiveAria: "Reduce animations and motion",
      activeAria: "Restore animations and motion"
    };
  }

  function updateReducedMotionButtonLabel() {
    if (!state.reducedMotionToggle) return;

    const reduced = isReducedMotionEnabled();
    const labels = getReducedMotionLabels();

    const text = reduced ? labels.activeText : labels.inactiveText;
    const aria = reduced ? labels.activeAria : labels.inactiveAria;

    state.reducedMotionToggle.textContent = text;
    state.reducedMotionToggle.setAttribute(
      "aria-pressed",
      reduced ? "true" : "false"
    );
    state.reducedMotionToggle.setAttribute("aria-label", aria);
    state.reducedMotionToggle.setAttribute("title", aria);
  }

  function notifyReducedMotionChange(enabled) {
    document.dispatchEvent(
      new CustomEvent("site:reduced-motion-change", {
        detail: { enabled }
      })
    );
  }

  function setHeroMotionVariables(values) {
    const nextValues = values || {};

    setRootCssVariable(
      CONFIG.cssVars.heroParallax,
      `${nextValues.parallax || 0}px`
    );
    setRootCssVariable(
      CONFIG.cssVars.heroVisibility,
      String(
        typeof nextValues.visibility !== "undefined"
          ? nextValues.visibility
          : 0
      )
    );
    setRootCssVariable(
      CONFIG.cssVars.heroProgress,
      String(
        typeof nextValues.progress !== "undefined" ? nextValues.progress : 0
      )
    );
    setRootCssVariable(
      CONFIG.cssVars.heroFocus,
      String(typeof nextValues.focus !== "undefined" ? nextValues.focus : 0)
    );
  }

  function resetHeroMotionState() {
    setHeroMotionVariables({
      parallax: 0,
      visibility: 0,
      progress: 0,
      focus: 0
    });

    if (state.pageHero) {
      state.pageHero.classList.remove(
        CONFIG.classes.heroInView,
        CONFIG.classes.heroNearFocus,
        CONFIG.classes.heroOutOfView
      );
    }

    const body = getBody();
    if (!body) return;

    body.classList.remove(
      CONFIG.classes.heroActive,
      CONFIG.classes.heroPassive
    );
  }

  function getHeroMotionStrength() {
    if (!isCinematicModeEnabled()) {
      return CONFIG.motion.defaultStrength;
    }

    return isMobileViewport()
      ? CONFIG.motion.cinematicMobileStrength
      : CONFIG.motion.cinematicDesktopStrength;
  }

  function updateHeroBodyState(visibilityRatio) {
    const body = getBody();
    if (!body) return;

    body.classList.toggle(
      CONFIG.classes.heroActive,
      visibilityRatio > 0.02
    );
    body.classList.toggle(
      CONFIG.classes.heroPassive,
      visibilityRatio <= 0.02
    );
  }

  function updateHeroMotionState() {
    if (!state.pageHero) return;

    if (isReducedMotionEnabled() || shouldSuspendHeroMotion()) {
      resetHeroMotionState();
      return;
    }

    const rect = state.pageHero.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || getDocumentElement().clientHeight || 0;

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

    state.pageHero.classList.toggle(
      CONFIG.classes.heroInView,
      visibilityRatio > 0.02
    );
    state.pageHero.classList.toggle(
      CONFIG.classes.heroNearFocus,
      focus > 0.72
    );
    state.pageHero.classList.toggle(
      CONFIG.classes.heroOutOfView,
      visibilityRatio <= 0.02
    );

    updateHeroBodyState(visibilityRatio);
  }

  function requestHeroMotionUpdate() {
    if (!state.pageHero || state.heroMotionTicking) return;

    state.heroMotionTicking = true;

    runOnNextFrame(() => {
      try {
        updateHeroMotionState();
      } finally {
        state.heroMotionTicking = false;
      }
    });
  }

  function refreshHeroMotionSoon() {
    runAfterTwoFrames(() => {
      requestHeroMotionUpdate();
    });
  }

  function refreshOrResetHeroMotionSoon() {
    if (isReducedMotionEnabled() || shouldSuspendHeroMotion()) {
      resetHeroMotionState();
      return;
    }

    refreshHeroMotionSoon();
  }

  function readReducedMotionPreference() {
    const stored = readFromLocalStorage(CONFIG.storage.reducedMotion);

    if (stored === null) {
      return getSystemReducedMotionPreference();
    }

    return stored === "true";
  }

  function saveReducedMotionPreference(enabled) {
    saveToLocalStorage(
      CONFIG.storage.reducedMotion,
      enabled ? "true" : "false"
    );
  }

  function applyReducedMotionState(enabled, options) {
    const settings = options || {};
    const persist = settings.persist !== false;
    const notify = settings.notify !== false;

    const body = getBody();
    if (!body) return;

    const currentState = isReducedMotionEnabled();

    if (currentState === enabled) {
      updateReducedMotionButtonLabel();

      if (enabled) {
        resetHeroMotionState();
      } else {
        refreshOrResetHeroMotionSoon();
      }

      if (persist) {
        saveReducedMotionPreference(enabled);
      }

      return;
    }

    body.classList.toggle(CONFIG.classes.reducedMotion, enabled);

    if (persist) {
      saveReducedMotionPreference(enabled);
    }

    if (enabled) {
      resetHeroMotionState();
    } else {
      refreshOrResetHeroMotionSoon();
    }

    updateReducedMotionButtonLabel();

    if (notify) {
      notifyReducedMotionChange(enabled);
    }
  }

  function handleReducedMotionButtonClick(event) {
    if (event?.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }

    applyReducedMotionState(!isReducedMotionEnabled());
  }

  function bindReducedMotionToggle() {
    if (!state.reducedMotionToggle) return;
    if (state.reducedMotionToggle.dataset.motionBound === "true") return;

    state.reducedMotionToggle.dataset.motionBound = "true";
    state.reducedMotionToggle.addEventListener(
      "click",
      handleReducedMotionButtonClick
    );
  }

  function syncReducedMotionAcrossTabs(event) {
    if (event.key !== CONFIG.storage.reducedMotion) return;

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
    const stored = readFromLocalStorage(CONFIG.storage.reducedMotion);

    if (stored !== null) return;

    applyReducedMotionState(event.matches, {
      persist: false,
      notify: true
    });
  }

  function bindSystemReducedMotionListener() {
    if (!window.matchMedia) return;

    state.systemReducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      typeof state.systemReducedMotionQuery.addEventListener === "function"
    ) {
      state.systemReducedMotionQuery.addEventListener(
        "change",
        handleSystemReducedMotionChange
      );
      return;
    }

    if (typeof state.systemReducedMotionQuery.addListener === "function") {
      state.systemReducedMotionQuery.addListener(
        handleSystemReducedMotionChange
      );
    }
  }

  function initReducedMotion() {
    if (state.reducedMotionInitialized) return;
    state.reducedMotionInitialized = true;

    cacheUiElements();

    applyReducedMotionState(readReducedMotionPreference(), {
      persist: false,
      notify: false
    });

    bindReducedMotionToggle();

    window.addEventListener("storage", syncReducedMotionAcrossTabs);
    bindSystemReducedMotionListener();
  }

  function initHeroResizeObserver() {
    if (!state.pageHero || !window.ResizeObserver) return;

    if (state.heroResizeObserver) {
      state.heroResizeObserver.disconnect();
    }

    state.heroResizeObserver = new ResizeObserver(() => {
      requestHeroMotionUpdate();
    });

    state.heroResizeObserver.observe(state.pageHero);
  }

  function handlePageShow() {
    invalidateArrivalCache();
    cacheUiElements();
    bindReducedMotionToggle();
    updateReducedMotionButtonLabel();
    initHeroResizeObserver();
    refreshOrResetHeroMotionSoon();
  }

  function handlePageHide() {
    invalidateArrivalCache();
    resetHeroMotionState();
  }

  function handleVisibilityChange() {
    if (document.hidden) return;
    refreshOrResetHeroMotionSoon();
  }

  function handleCinematicArrivalStart() {
    invalidateArrivalCache();
    resetHeroMotionState();
  }

  function handleCinematicArrivalEnd() {
    invalidateArrivalCache();
    refreshHeroMotionSoon();
  }

  function handleCinematicTransitionStart() {
    resetHeroMotionState();
  }

  function handleCinematicTransitionEnd() {
    refreshHeroMotionSoon();
  }

  function handleCinematicModeChange() {
    refreshOrResetHeroMotionSoon();
  }

  function handleReducedMotionChange() {
    refreshOrResetHeroMotionSoon();
  }

  function handleMobileMenuChange(event) {
    const isOpen = !!event?.detail?.open;

    if (isOpen) {
      resetHeroMotionState();
      return;
    }

    refreshOrResetHeroMotionSoon();
  }

  function initHeroMotion() {
    if (state.heroMotionInitialized) return;
    state.heroMotionInitialized = true;

    cacheUiElements();

    if (!state.pageHero) return;

    refreshOrResetHeroMotionSoon();

    window.addEventListener("scroll", requestHeroMotionUpdate, {
      passive: true
    });
    window.addEventListener("resize", requestHeroMotionUpdate);
    window.addEventListener("orientationchange", requestHeroMotionUpdate);
    window.addEventListener("load", requestHeroMotionUpdate);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener(
      "site:cinematic-change",
      handleCinematicModeChange
    );
    document.addEventListener(
      "site:reduced-motion-change",
      handleReducedMotionChange
    );
    document.addEventListener(
      "site:cinematic-arrival-start",
      handleCinematicArrivalStart
    );
    document.addEventListener(
      "site:cinematic-arrival-end",
      handleCinematicArrivalEnd
    );
    document.addEventListener(
      "site:cinematic-transition-start",
      handleCinematicTransitionStart
    );
    document.addEventListener(
      "site:cinematic-transition-end",
      handleCinematicTransitionEnd
    );
    document.addEventListener(
      "site:mobile-menu-change",
      handleMobileMenuChange
    );

    initHeroResizeObserver();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          refreshOrResetHeroMotionSoon();
        })
        .catch(() => {
          /* silent fallback */
        });
    }
  }

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
})();
