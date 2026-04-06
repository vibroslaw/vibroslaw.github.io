document.documentElement.classList.add("js-ready");

const SCROLL_TOP_VISIBILITY_THRESHOLD = 560;
const BODY_CLASS_ATTRIBUTE = "class";
const VIEWPORT_HEIGHT_CSS_VARIABLE = "--vh";

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
  const body = getBody();
  return !!body && body.classList.contains("mobile-menu-open");
}

function shouldUseSmoothScroll() {
  return !isReducedMotionEnabled();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
    !isMobileMenuOpen();

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

  window.requestAnimationFrame(() => {
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

function initBodyClassObserver() {
  disconnectBodyClassObserver();

  if (!("MutationObserver" in window) || !document.body) return;

  bodyClassObserver = new MutationObserver(() => {
    refreshMainUI();
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

function handleReducedMotionChange() {
  cacheUiElements();
  initRevealObserver();
  refreshMainUI();
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
    initRevealObserver();
    refreshMainUI();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshMainUI();
    }
  });

  document.addEventListener("site:cinematic-change", refreshMainUI);
  document.addEventListener("site:reduced-motion-change", handleReducedMotionChange);
}

/* expose for future use */
window.refreshMainUI = refreshMainUI;

if (document.body) {
  initMainUi();
} else {
  document.addEventListener("DOMContentLoaded", initMainUi, { once: true });
}
