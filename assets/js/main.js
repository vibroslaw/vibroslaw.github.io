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
  const SITE_FOUNDATION_STYLE_ID = "siteFoundation2026";
  const SITE_FOUNDATION_STYLE_SRC = "/assets/css/site-foundation-2026.css?v=1";
  const SITE_ENHANCEMENTS_SCRIPT_ID = "siteEnhancements2026";
  const SITE_ENHANCEMENTS_SCRIPT_SRC = "/assets/js/site-enhancements-2026.js?v=1";
  const CONTACT_FLOW_SCRIPT_ID = "siteContactFlowScript";
  const CONTACT_FLOW_SCRIPT_SRC = "/assets/js/contact-flow.js?v=1";
  const HERO_SEAMLESS_PATCH_STYLE_ID = "veritasHeroSeamlessPatch";

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

  function getSystemReducedMotionPreference() {
    if (!window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isReducedMotionEnabled() {
    const body = getBody();
    return (
      getSystemReducedMotionPreference() ||
      (!!body &&
        (body.classList.contains("reduced-motion") ||
          body.classList.contains("reduce-motion")))
    );
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

  function ensureHeroSeamlessPatch() {
    const body = getBody();
    if (!body || body.dataset.veritas !== "true") return;

    const existing = document.getElementById(HERO_SEAMLESS_PATCH_STYLE_ID);
    if (existing) return;

    const style = document.createElement("style");
    style.id = HERO_SEAMLESS_PATCH_STYLE_ID;
    style.textContent = `
      body.veritas-universe{background:#050403!important;}
      body.veritas-universe .site-header{position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:1000!important;background:linear-gradient(180deg,rgba(5,4,3,.76),rgba(5,4,3,.26) 68%,rgba(5,4,3,0))!important;border-bottom:1px solid rgba(214,188,137,.10)!important;box-shadow:none!important;}
      body.veritas-universe .breadcrumbs{position:absolute!important;z-index:4!important;top:calc(var(--nav-h,76px) + 12px)!important;left:50%!important;transform:translateX(-50%)!important;margin:0!important;padding-top:0!important;opacity:.78!important;}
      body.veritas-universe .vh-main{margin-top:0!important;background:#050403!important;}
      body.veritas-universe .vh-main::before{background:linear-gradient(180deg,rgba(5,4,3,0) 0%,rgba(5,4,3,.46) 52%,#050403 100%),radial-gradient(circle at 20% 16%,rgba(208,173,104,.10),transparent 30rem)!important;}
      body.veritas-universe .vh-hero{min-height:clamp(620px,86svh,860px)!important;padding:clamp(108px,13vh,148px) 0 clamp(68px,9vh,96px)!important;margin-top:0!important;align-items:center!important;background:#050403!important;overflow:hidden!important;isolation:isolate!important;}
      body.veritas-universe .vh-hero.vh-hero-compact{min-height:clamp(560px,80svh,760px)!important;padding-top:clamp(104px,12vh,138px)!important;padding-bottom:clamp(62px,8vh,88px)!important;}
      body.veritas-universe .vh-hero::before{content:""!important;position:absolute!important;inset:0!important;z-index:-1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(5,4,3,0) 0%,rgba(5,4,3,0) 42%,rgba(5,4,3,.42) 70%,#050403 100%)!important;}
      body.veritas-universe .vh-hero::after{content:""!important;position:absolute!important;left:0!important;right:0!important;bottom:-1px!important;height:clamp(180px,26vh,320px)!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(5,4,3,0) 0%,rgba(5,4,3,.34) 34%,rgba(5,4,3,.76) 68%,#050403 100%)!important;opacity:1!important;}
      body.veritas-universe .vh-hero-media{position:absolute!important;inset:0!important;top:0!important;bottom:auto!important;height:100%!important;z-index:-2!important;background-color:#050403!important;}
      body.veritas-universe .vh-hero-media.has-final-hero,body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero{background-image:var(--vh-final-hero-image)!important;background-size:cover!important;background-position:var(--vh-hero-position,center top)!important;background-repeat:no-repeat!important;}
      body.veritas-universe .vh-hero-media::before,body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{inset:-2% -5% -8%!important;background-image:linear-gradient(180deg,rgba(5,4,3,.18) 0%,rgba(5,4,3,.06) 22%,rgba(5,4,3,.18) 46%,rgba(5,4,3,.70) 78%,#050403 100%),linear-gradient(90deg,rgba(5,4,3,.86) 0%,rgba(5,4,3,.38) 26%,rgba(5,4,3,.08) 52%,rgba(5,4,3,.50) 100%),radial-gradient(circle at 36% 18%,rgba(208,173,104,.20),transparent 32rem),var(--vh-final-hero-image,var(--vh-page-hero-image))!important;background-size:cover,cover,cover,cover!important;background-position:var(--vh-hero-position,center top),var(--vh-hero-position,center top),var(--vh-hero-position,center top),var(--vh-hero-position,center top)!important;background-repeat:no-repeat!important;transform:translate3d(var(--hero-cursor-x-px,0px),calc((var(--vh-parallax,0px) * .30) + var(--hero-cursor-y-px,0px)),0) scale(1.045)!important;filter:saturate(1.10) contrast(1.08) brightness(1.06)!important;opacity:1!important;will-change:transform!important;}
      body.veritas-universe .vh-hero-media::after,body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::after{inset:0!important;opacity:.74!important;background:radial-gradient(circle at 72% 12%,rgba(241,234,219,.08),transparent 28rem),radial-gradient(circle at 24% 26%,rgba(208,173,104,.12),transparent 26rem),linear-gradient(180deg,rgba(5,4,3,.04) 0%,rgba(5,4,3,.08) 42%,rgba(5,4,3,.72) 82%,#050403 100%),repeating-linear-gradient(90deg,rgba(255,255,255,.016) 0 1px,transparent 1px 8px)!important;}
      body.veritas-universe .vh-hero-grid{position:relative!important;z-index:3!important;align-items:center!important;}
      body.veritas-universe .vh-hero-copy{position:relative!important;z-index:3!important;}
      body.veritas-universe .vh-title{font-size:clamp(3.5rem,7.6vw,7.5rem)!important;}
      body.veritas-universe.page-home .vh-title{font-size:clamp(3.2rem,7vw,6.8rem)!important;}
      body.veritas-universe .vh-hero-compact .vh-title{font-size:clamp(2.8rem,6.2vw,6.2rem)!important;}
      body.veritas-universe .vh-subtitle{margin-top:18px!important;}
      body.veritas-universe .vh-lead{margin-top:14px!important;}
      body.veritas-universe .vh-hero .vh-actions{margin-top:22px!important;}
      body.veritas-universe.final-hero-ready .vh-hero-copy{background:linear-gradient(90deg,rgba(5,4,3,.42),rgba(5,4,3,.14),transparent)!important;}
      body.cinematic-mode.veritas-universe .vh-hero-media.has-final-hero::before,body.cinematic-mode.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{transform:translate3d(var(--hero-cursor-x-px,0px),calc((var(--vh-parallax,0px) * .52) + var(--hero-cursor-y-px,0px)),0) scale(1.095)!important;filter:saturate(1.22) contrast(1.13) brightness(1.10)!important;}
      body.cinematic-mode.veritas-universe .vh-hero::after{height:clamp(220px,30vh,360px)!important;background:linear-gradient(180deg,rgba(5,4,3,0) 0%,rgba(5,4,3,.28) 28%,rgba(5,4,3,.82) 72%,#050403 100%)!important;}
      body.reduced-motion.veritas-universe .vh-hero-media::before,body.reduce-motion.veritas-universe .vh-hero-media::before{transform:scale(1.035)!important;will-change:auto!important;}
      @media(max-width:760px){body.veritas-universe .breadcrumbs{display:none!important;}body.veritas-universe .vh-hero,body.veritas-universe .vh-hero.vh-hero-compact{min-height:clamp(600px,88svh,760px)!important;padding:clamp(100px,12vh,122px) 0 clamp(54px,7vh,72px)!important;}body.veritas-universe .vh-title,body.veritas-universe.page-home .vh-title{font-size:clamp(2.8rem,13vw,4.2rem)!important;}body.veritas-universe .vh-hero-compact .vh-title{font-size:clamp(2.5rem,11.5vw,3.8rem)!important;}body.veritas-universe .vh-subtitle{margin-top:14px!important;}body.veritas-universe .vh-lead{margin-top:12px!important;}body.veritas-universe .vh-hero .vh-actions{margin-top:18px!important;}body.veritas-universe .vh-hero-media::before,body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{inset:-1% -4% -8%!important;background-image:linear-gradient(180deg,rgba(5,4,3,.18) 0%,rgba(5,4,3,.08) 32%,rgba(5,4,3,.62) 74%,#050403 100%),linear-gradient(90deg,rgba(5,4,3,.72),rgba(5,4,3,.16) 58%,rgba(5,4,3,.62)),var(--vh-final-hero-image,var(--vh-page-hero-image))!important;background-position:var(--vh-hero-position-mobile,var(--vh-hero-position,center top)),var(--vh-hero-position-mobile,var(--vh-hero-position,center top)),var(--vh-hero-position-mobile,var(--vh-hero-position,center top))!important;background-size:cover,cover,cover!important;transform:scale(1.035)!important;}body.veritas-universe .vh-hero::after{height:clamp(150px,21vh,230px)!important;}}
    `;

    document.head.appendChild(style);
  }

  function scheduleHeroSeamlessPatch() {
    ensureHeroSeamlessPatch();
    runOnNextFrame(ensureHeroSeamlessPatch);
    window.setTimeout(ensureHeroSeamlessPatch, 0);
    window.setTimeout(ensureHeroSeamlessPatch, 120);
    window.setTimeout(ensureHeroSeamlessPatch, 420);
    window.setTimeout(ensureHeroSeamlessPatch, 1000);
  }

  function ensureContactFlowModule() {
    if (window.__siteContactFlowInitialized) return;
    if (document.body?.dataset.veritas === "true") return;
    if (document.getElementById(CONTACT_FLOW_SCRIPT_ID)) return;
    if (document.querySelector('script[src*="/assets/js/contact-flow.js"]')) return;

    const script = document.createElement("script");
    script.id = CONTACT_FLOW_SCRIPT_ID;
    script.src = CONTACT_FLOW_SCRIPT_SRC;
    script.defer = true;

    const target = document.body || document.head || document.documentElement;
    if (target) target.appendChild(script);
  }

  function ensureSiteFoundationLayer() {
    if (document.getElementById(SITE_FOUNDATION_STYLE_ID)) return;
    if (document.querySelector('link[href*="/assets/css/site-foundation-2026.css"]')) return;

    const link = document.createElement("link");
    link.id = SITE_FOUNDATION_STYLE_ID;
    link.rel = "stylesheet";
    link.href = SITE_FOUNDATION_STYLE_SRC;

    const firstRuntimeStyle = document.getElementById(HERO_SEAMLESS_PATCH_STYLE_ID);
    if (firstRuntimeStyle?.parentNode) {
      firstRuntimeStyle.parentNode.insertBefore(link, firstRuntimeStyle);
      return;
    }

    document.head?.appendChild(link);
  }

  function ensureSiteEnhancementsModule() {
    if (window.__siteEnhancements2026Initialized) return;
    if (document.getElementById(SITE_ENHANCEMENTS_SCRIPT_ID)) return;
    if (document.querySelector('script[src*="/assets/js/site-enhancements-2026.js"]')) return;

    const script = document.createElement("script");
    script.id = SITE_ENHANCEMENTS_SCRIPT_ID;
    script.src = SITE_ENHANCEMENTS_SCRIPT_SRC;
    script.defer = true;

    const target = document.body || document.head || document.documentElement;
    if (target) target.appendChild(script);
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
      ? "Wr\u00f3\u0107 na g\u00f3r\u0119 strony"
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
    scheduleHeroSeamlessPatch();

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
    scheduleHeroSeamlessPatch();
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
    scheduleHeroSeamlessPatch();

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
    scheduleHeroSeamlessPatch();

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
    scheduleHeroSeamlessPatch();
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
    ensureSiteFoundationLayer();
    ensureSiteEnhancementsModule();
    scheduleHeroSeamlessPatch();
    initRevealObserver();
    initBodyClassObserver();
    refreshMainUI();
    ensureContactFlowModule();

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
      scheduleHeroSeamlessPatch();

      if (shouldDelayRevealObserver()) {
        disconnectRevealObserver();
      } else {
        initRevealObserver();
      }

      refreshMainUI();
      ensureContactFlowModule();
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        refreshMainUI();
        scheduleHeroSeamlessPatch();
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
  window.refreshHeroSeamlessPatch = scheduleHeroSeamlessPatch;

  if (document.body) {
    initMainUi();
  } else {
    document.addEventListener("DOMContentLoaded", initMainUi, { once: true });
  }
})();
