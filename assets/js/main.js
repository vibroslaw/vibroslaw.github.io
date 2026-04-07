(() => {
  "use strict";

  if (window.__siteMainUiModuleInitialized) {
    return;
  }
  window.__siteMainUiModuleInitialized = true;

  document.documentElement.classList.add("js-ready");

  const SCROLL_TOP_VISIBILITY_THRESHOLD = 560;
  const BODY_CLASS_ATTRIBUTE = "class";
  const VIEWPORT_HEIGHT_CSS_VARIABLE = "--vh";

  const CINEMATIC_ARRIVAL_CLASS = "cinematic-arrival-active";
  const CINEMATIC_TRANSITION_CLASS = "cinematic-transition-active";
  const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";
  const CINEMATIC_ARRIVAL_MAX_AGE = 12000;

  let revealItems = [];
  let scrollTopButton = null;

  let scrollUiTicking = false;
  let revealObserver = null;
  let bodyClassObserver = null;
  let mainUiInitialized = false;

  function getBody() {
    return document.body;
  }

  function isReducedMotionEnabled() {
    const body = getBody();
    return !!body && body.classList.contains("reduced-motion");
  }

  function isPolishLanguage() {
    const body = getBody();
    return body?.dataset.lang === "pl";
  }

  function isMobileMenuOpen() {
    if (typeof window.isMobileMenuOpen === "function") {
      return window.isMobileMenuOpen();
    }

    const body = getBody();
    return !!body && body.classList.contains("mobile-menu-open");
  }

  function isCinematicArrivalActive() {
    const body = getBody();
    return !!body && body.classList.contains(CINEMATIC_ARRIVAL_CLASS);
  }

  function isCinematicTransitionActive() {
    const body = getBody();
    return !!body && body.classList.contains(CINEMATIC_TRANSITION_CLASS);
  }

  function shouldUseSmoothScroll() {
    return !isReducedMotionEnabled();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
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

  function shouldDelayRevealObserver() {
    return (
      isCinematicArrivalActive() ||
      isCinematicTransitionActive() ||
      hasPendingCinematicArrival()
    );
  }

  function shouldSuspendScrollTopButton() {
    return (
      isMobileMenuOpen() ||
      isCinematicArrivalActive() ||
      isCinematicTransitionActive() ||
      hasPendingCinematicArrival()
    );
  }

  /* ---------- VIEWPORT HEIGHT ---------- */

  function updateViewportHeightVariable() {
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;

    if (!viewportHeight) return;

    document.documentElement.style.setProperty(
      VIEWPORT_HEIGHT_CSS_VARIABLE,
      `${viewportHeight * 0.01}px`
    );
  }

  /* ---------- REVEAL SYSTEM ---------- */

  function revealElement(element) {
    if (!element) return;
    element.classList.add("visible");
  }

  function revealAllElements() {
    revealItems.forEach(revealElement);
  }

  function disconnectRevealObserver() {
    if (!revealObserver) return;
    revealObserver.disconnect();
    revealObserver = null;
  }

  function initRevealObserver() {
    disconnectRevealObserver();

    if (revealItems.length === 0) return;

    if (isReducedMotionEnabled() || !("IntersectionObserver" in window)) {
      revealAllElements();
      return;
    }

    if (shouldDelayRevealObserver()) {
      return;
    }

    const unrevealedItems = revealItems.filter(
      (item) => !item.classList.contains("visible")
    );

    if (unrevealedItems.length === 0) return;

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          revealElement(entry.target);

          if (revealObserver) {
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    unrevealedItems.forEach((item) => {
      revealObserver.observe(item);
    });
  }

  /* ---------- PROGRESS BAR ---------- */

  function updateProgressBar() {
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      docHeight > 0 ? clamp((scrollTop / docHeight) * 100, 0, 100) : 0;

    document.documentElement.style.setProperty("--progress", `${progress}%`);
  }

  /* ---------- SCROLL TOP BUTTON ---------- */

  function updateScrollTopButtonLabel() {
    if (!scrollTopButton) return;

    const label = isPolishLanguage()
      ? "Wróć na górę strony"
      : "Back to top";

    scrollTopButton.setAttribute("aria-label", label);
    scrollTopButton.setAttribute("title", label);
  }

  function setScrollTopButtonVisibility(visible) {
    if (!scrollTopButton) return;

    scrollTopButton.classList.toggle("is-visible", visible);
    scrollTopButton.style.opacity = visible ? "1" : "0";
    scrollTopButton.style.pointerEvents = visible ? "auto" : "none";
    scrollTopButton.style.transform = visible
      ? "translateY(0)"
      : "translateY(8px)";
    scrollTopButton.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function updateScrollTopButtonVisibility() {
    if (!scrollTopButton) return;

    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const shouldShow =
      scrollTop > SCROLL_TOP_VISIBILITY_THRESHOLD &&
      !shouldSuspendScrollTopButton();

    setScrollTopButtonVisibility(shouldShow);
  }

  function handleScrollTopClick() {
    window.scrollTo({
      top: 0,
      behavior: shouldUseSmoothScroll() ? "smooth" : "auto"
    });
  }

  function bindScrollTopButton() {
    if (!scrollTopButton) return;
    if (scrollTopButton.dataset.mainUiBound === "true") return;

    scrollTopButton.dataset.mainUiBound = "true";
    scrollTopButton.addEventListener("click", handleScrollTopClick);
  }

  /* ---------- SCROLL-LINKED UI ---------- */

  function updateScrollLinkedUi() {
    updateProgressBar();
    updateScrollTopButtonVisibility();
  }

  function requestScrollLinkedUiUpdate() {
    if (scrollUiTicking) return;

    scrollUiTicking = true;

    runOnNextFrame(() => {
      try {
        updateScrollLinkedUi();
      } finally {
        scrollUiTicking = false;
      }
    });
  }

  /* ---------- BODY CLASS OBSERVER ---------- */

  function disconnectBodyClassObserver() {
    if (!bodyClassObserver) return;
    bodyClassObserver.disconnect();
    bodyClassObserver = null;
  }

  function handleBodyClassMutation() {
    refreshMainUI();

    if (isReducedMotionEnabled()) {
      revealAllElements();
      disconnectRevealObserver();
      return;
    }

    if (shouldDelayRevealObserver()) {
      disconnectRevealObserver();
      return;
    }

    initRevealObserver();
  }

  function initBodyClassObserver() {
    disconnectBodyClassObserver();

    if (!("MutationObserver" in window) || !document.body) return;

    bodyClassObserver = new MutationObserver(() => {
      handleBodyClassMutation();
    });

    bodyClassObserver.observe(document.body, {
      attributes: true,
      attributeFilter: [BODY_CLASS_ATTRIBUTE]
    });
  }

  /* ---------- GLOBAL REFRESH ---------- */

  function cacheUiElements() {
    revealItems = Array.from(document.querySelectorAll(".reveal"));
    scrollTopButton = document.getElementById("scrollTopButton");
  }

  function refreshMainUI() {
    cacheUiElements();
    bindScrollTopButton();
    updateViewportHeightVariable();
    requestScrollLinkedUiUpdate();
    updateScrollTopButtonLabel();
  }

  function refreshRevealSystem() {
    cacheUiElements();
    initRevealObserver();
  }

  function refreshEverythingSoon() {
    runAfterTwoFrames(() => {
      refreshMainUI();
      initRevealObserver();
    });
  }

  function handleReducedMotionChange() {
    cacheUiElements();

    if (isReducedMotionEnabled()) {
      revealAllElements();
      disconnectRevealObserver();
    } else {
      initRevealObserver();
    }

    refreshMainUI();
  }

  function handleCinematicArrivalStart() {
    disconnectRevealObserver();
    setScrollTopButtonVisibility(false);
    requestScrollLinkedUiUpdate();

    if (typeof window.requestHeroMotionUpdate === "function") {
      window.requestHeroMotionUpdate();
    }
  }

  function handleCinematicArrivalEnd() {
    refreshEverythingSoon();

    if (typeof window.refreshHeroMotionSoon === "function") {
      window.refreshHeroMotionSoon();
    } else if (typeof window.requestHeroMotionUpdate === "function") {
      window.requestHeroMotionUpdate();
    }
  }

  function handleCinematicTransitionStart() {
    disconnectRevealObserver();
    setScrollTopButtonVisibility(false);
    requestScrollLinkedUiUpdate();
  }

  function handleCinematicTransitionEnd() {
    refreshEverythingSoon();
  }

  /* ---------- INIT ---------- */

  function initMainUi() {
    if (mainUiInitialized) return;
    mainUiInitialized = true;

    cacheUiElements();
    bindScrollTopButton();
    setScrollTopButtonVisibility(false);
    updateScrollTopButtonLabel();

    updateViewportHeightVariable();
    initRevealObserver();
    initBodyClassObserver();
    refreshMainUI();

    window.addEventListener(
      "scroll",
      () => {
        requestScrollLinkedUiUpdate();
      },
      { passive: true }
    );

    window.addEventListener("resize", refreshMainUI);
    window.addEventListener("orientationchange", refreshMainUI);
    window.addEventListener("load", refreshMainUI);

    window.addEventListener("pageshow", () => {
      cacheUiElements();

      if (shouldDelayRevealObserver()) {
        disconnectRevealObserver();
      } else {
        initRevealObserver();
      }

      refreshMainUI();
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        refreshMainUI();
      }
    });

    document.addEventListener("site:cinematic-change", refreshMainUI);
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
  }

  window.refreshMainUI = refreshMainUI;
  window.refreshRevealSystem = refreshRevealSystem;
  window.requestScrollLinkedUiUpdate = requestScrollLinkedUiUpdate;

  if (document.body) {
    initMainUi();
  } else {
    document.addEventListener("DOMContentLoaded", initMainUi, { once: true });
  }
})();
