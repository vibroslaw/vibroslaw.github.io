const PAGE_TRANSITION_ACTIVE_CLASS = "active";
const PAGE_TRANSITION_DATA_KEY = "pageTransition";
const MOBILE_BREAKPOINT = 760;

const CINEMATIC_HOME_PAGE = "home";
const CINEMATIC_CARD_SELECTOR = ".project-link-card";
const CINEMATIC_CARD_PATHS = new Set(["/rap-ort", "/sztab"]);
const CINEMATIC_ZOOM_DURATION_DESKTOP = 620;
const CINEMATIC_ZOOM_DURATION_MOBILE = 460;

let pageTransition = null;
let transitionLocked = false;
let pageTransitionInitialized = false;

let cinematicZoomClone = null;
let cinematicZoomVeil = null;
let cinematicShellSnapshot = [];

function getBody() {
  return document.body;
}

function cachePageTransitionElement() {
  pageTransition = document.getElementById("pageTransition");
}

function hasModifierKey(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function normalizePath(path) {
  return (path || "").replace(/\/+$/, "") || "/";
}

function isReducedMotionEnabled() {
  if (document.body && document.body.classList.contains("reduced-motion")) {
    return true;
  }

  if (window.matchMedia) {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return false;
}

function isCinematicModeEnabled() {
  return !!document.body && document.body.classList.contains("cinematic-mode");
}

function isMobileViewport() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function isSaveDataEnabled() {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  return Boolean(connection && connection.saveData);
}

function shouldUseMinimalTransition() {
  return (
    isReducedMotionEnabled() ||
    isMobileViewport() ||
    isSaveDataEnabled()
  );
}

function isSameLocation(targetUrl) {
  const currentPath = normalizePath(window.location.pathname);
  const targetPath = normalizePath(targetUrl.pathname);

  return (
    currentPath === targetPath &&
    window.location.search === targetUrl.search
  );
}

function hasExternalRel(link) {
  const rel = (link.getAttribute("rel") || "").toLowerCase();
  return rel.split(/\s+/).includes("external");
}

function getLinkTargetUrl(link) {
  if (!(link instanceof HTMLAnchorElement)) return null;

  try {
    return new URL(link.href, window.location.origin);
  } catch (error) {
    return null;
  }
}

function shouldHandleTransition(link) {
  if (!(link instanceof HTMLAnchorElement)) return false;

  const href = link.getAttribute("href");
  if (!href) return false;

  const trimmedHref = href.trim();

  if (!trimmedHref) return false;
  if (trimmedHref === "#") return false;
  if (trimmedHref.startsWith("#")) return false;
  if (trimmedHref.startsWith("mailto:")) return false;
  if (trimmedHref.startsWith("tel:")) return false;
  if (trimmedHref.startsWith("javascript:")) return false;
  if (link.hasAttribute("download")) return false;
  if (link.hasAttribute("data-no-transition")) return false;
  if (link.getAttribute("target") === "_blank") return false;
  if (link.getAttribute("aria-disabled") === "true") return false;
  if (hasExternalRel(link)) return false;

  const targetUrl = getLinkTargetUrl(link);
  if (!targetUrl) return false;

  if (targetUrl.origin !== window.location.origin) return false;
  if (isSameLocation(targetUrl)) return false;

  return true;
}

function shouldHandleFormTransition(form, submitter = null) {
  if (!(form instanceof HTMLFormElement)) return false;
  if (form.hasAttribute("data-no-transition")) return false;

  const effectiveTarget =
    submitter?.getAttribute("formtarget") ||
    form.getAttribute("target") ||
    "";

  if (effectiveTarget === "_blank") return false;

  const effectiveMethod =
    (submitter?.getAttribute("formmethod") ||
      form.getAttribute("method") ||
      "get")
      .trim()
      .toLowerCase();

  if (effectiveMethod === "dialog") return false;

  const action =
    submitter?.getAttribute("formaction") ||
    form.getAttribute("action") ||
    window.location.href;

  try {
    const actionUrl = new URL(action, window.location.origin);
    return actionUrl.origin === window.location.origin;
  } catch (error) {
    return false;
  }
}

/* ---------- CINEMATIC CARD TRANSITION ---------- */

function isHomepage() {
  return getBody()?.dataset.page === CINEMATIC_HOME_PAGE;
}

function isSpecialCinematicCardLink(link) {
  if (!(link instanceof HTMLAnchorElement)) return false;
  if (!isHomepage()) return false;
  if (!link.matches(CINEMATIC_CARD_SELECTOR)) return false;

  const targetUrl = getLinkTargetUrl(link);
  if (!targetUrl) return false;
  if (targetUrl.origin !== window.location.origin) return false;

  return CINEMATIC_CARD_PATHS.has(normalizePath(targetUrl.pathname));
}

function shouldRunSpecialCinematicCardTransition(link, event) {
  if (!isSpecialCinematicCardLink(link)) return false;
  if (!isCinematicModeEnabled()) return false;
  if (isReducedMotionEnabled()) return false;
  if (isSaveDataEnabled()) return false;

  if (
    event.defaultPrevented ||
    hasModifierKey(event) ||
    event.button !== 0
  ) {
    return false;
  }

  return true;
}

function clearCinematicShellState() {
  cinematicShellSnapshot.forEach((item) => {
    const { element, style } = item;
    if (!(element instanceof HTMLElement)) return;

    element.style.transition = style.transition;
    element.style.opacity = style.opacity;
    element.style.transform = style.transform;
    element.style.filter = style.filter;
    element.style.pointerEvents = style.pointerEvents;
  });

  cinematicShellSnapshot = [];
}

function snapshotAndStyleElement(element, nextStyle) {
  if (!(element instanceof HTMLElement)) return;

  cinematicShellSnapshot.push({
    element,
    style: {
      transition: element.style.transition,
      opacity: element.style.opacity,
      transform: element.style.transform,
      filter: element.style.filter,
      pointerEvents: element.style.pointerEvents
    }
  });

  Object.keys(nextStyle).forEach((property) => {
    element.style[property] = nextStyle[property];
  });
}

function createCinematicVeil() {
  const veil = document.createElement("div");

  veil.setAttribute("aria-hidden", "true");
  veil.style.position = "fixed";
  veil.style.inset = "0";
  veil.style.zIndex = "10010";
  veil.style.pointerEvents = "none";
  veil.style.opacity = "0";
  veil.style.background =
    "radial-gradient(circle at 50% 36%, rgba(201,178,143,.10), transparent 32%), linear-gradient(180deg, rgba(5,5,5,.10), rgba(7,7,7,.36), rgba(9,9,9,.78))";
  veil.style.transition = "opacity 420ms cubic-bezier(.22,1,.36,1)";

  document.body.appendChild(veil);
  cinematicZoomVeil = veil;

  return veil;
}

function createCinematicZoomClone(sourceElement) {
  if (!(sourceElement instanceof HTMLElement)) return null;

  const rect = sourceElement.getBoundingClientRect();
  const computed = window.getComputedStyle(sourceElement);

  const clone = document.createElement("div");
  clone.setAttribute("aria-hidden", "true");

  clone.style.position = "fixed";
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.zIndex = "10020";
  clone.style.pointerEvents = "none";
  clone.style.overflow = "hidden";
  clone.style.borderRadius = "28px";
  clone.style.backgroundImage = computed.backgroundImage;
  clone.style.backgroundPosition = computed.backgroundPosition;
  clone.style.backgroundSize = computed.backgroundSize;
  clone.style.backgroundRepeat = computed.backgroundRepeat;
  clone.style.boxShadow = "0 40px 120px rgba(0,0,0,.45)";
  clone.style.transform = "translate3d(0,0,0) scale(1)";
  clone.style.filter = "saturate(.92) brightness(.96) contrast(1.02)";
  clone.style.willChange =
    "left, top, width, height, transform, filter, border-radius, opacity";

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.position = "absolute";
  overlay.style.inset = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.background =
    "linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.28)), radial-gradient(circle at center, rgba(201,178,143,.10), transparent 46%)";

  clone.appendChild(overlay);
  document.body.appendChild(clone);

  cinematicZoomClone = clone;
  return clone;
}

function applyCinematicShellState() {
  const header = document.querySelector(".site-header");
  const main = document.querySelector("main");
  const floatingTools = document.querySelector(".floating-tools");
  const footer = document.querySelector(".site-footer");

  cinematicShellSnapshot = [];

  snapshotAndStyleElement(header, {
    transition: "opacity 420ms cubic-bezier(.22,1,.36,1), transform 420ms cubic-bezier(.22,1,.36,1)",
    opacity: "0",
    transform: "translateY(-8px)",
    pointerEvents: "none"
  });

  snapshotAndStyleElement(main, {
    transition: "opacity 420ms cubic-bezier(.22,1,.36,1), transform 420ms cubic-bezier(.22,1,.36,1), filter 420ms cubic-bezier(.22,1,.36,1)",
    opacity: ".18",
    transform: "scale(.985)",
    filter: "blur(1px)",
    pointerEvents: "none"
  });

  snapshotAndStyleElement(floatingTools, {
    transition: "opacity 320ms cubic-bezier(.22,1,.36,1), transform 320ms cubic-bezier(.22,1,.36,1)",
    opacity: "0",
    transform: "translateY(8px)",
    pointerEvents: "none"
  });

  snapshotAndStyleElement(footer, {
    transition: "opacity 420ms cubic-bezier(.22,1,.36,1), transform 420ms cubic-bezier(.22,1,.36,1)",
    opacity: ".12",
    transform: "scale(.985)",
    pointerEvents: "none"
  });
}

function clearSpecialCinematicTransition() {
  if (cinematicZoomClone && cinematicZoomClone.parentNode) {
    cinematicZoomClone.parentNode.removeChild(cinematicZoomClone);
  }

  if (cinematicZoomVeil && cinematicZoomVeil.parentNode) {
    cinematicZoomVeil.parentNode.removeChild(cinematicZoomVeil);
  }

  cinematicZoomClone = null;
  cinematicZoomVeil = null;

  clearCinematicShellState();

  if (document.body) {
    document.body.classList.remove("cinematic-transition-active");
  }
}

function runSpecialCinematicCardTransition(link) {
  if (!(link instanceof HTMLAnchorElement)) {
    return;
  }

  if (transitionLocked) return;

  const sourceMedia = link.querySelector(".project-media");
  if (!(sourceMedia instanceof HTMLElement)) {
    window.location.href = link.href;
    return;
  }

  transitionLocked = true;

  if (document.body) {
    document.body.classList.add("cinematic-transition-active");
  }

  const veil = createCinematicVeil();
  const clone = createCinematicZoomClone(sourceMedia);

  if (!clone) {
    transitionLocked = false;
    window.location.href = link.href;
    return;
  }

  applyCinematicShellState();

  const duration = isMobileViewport()
    ? CINEMATIC_ZOOM_DURATION_MOBILE
    : CINEMATIC_ZOOM_DURATION_DESKTOP;

  window.requestAnimationFrame(() => {
    if (veil) {
      veil.style.opacity = "1";
    }

    clone.style.transition = [
      `left ${duration}ms cubic-bezier(.22,1,.36,1)`,
      `top ${duration}ms cubic-bezier(.22,1,.36,1)`,
      `width ${duration}ms cubic-bezier(.22,1,.36,1)`,
      `height ${duration}ms cubic-bezier(.22,1,.36,1)`,
      `border-radius ${duration}ms cubic-bezier(.22,1,.36,1)`,
      `transform ${duration}ms cubic-bezier(.22,1,.36,1)`,
      `filter ${duration}ms cubic-bezier(.22,1,.36,1)`,
      `opacity ${duration}ms cubic-bezier(.22,1,.36,1)`
    ].join(", ");

    clone.style.left = "0px";
    clone.style.top = "0px";
    clone.style.width = `${window.innerWidth}px`;
    clone.style.height = `${window.innerHeight}px`;
    clone.style.borderRadius = "0px";
    clone.style.transform = "translate3d(0,0,0) scale(1.02)";
    clone.style.filter = "saturate(1.04) brightness(.78) contrast(1.06)";
  });

  window.setTimeout(() => {
    window.location.href = link.href;
  }, duration - 10);
}

/* ---------- STANDARD PAGE TRANSITION ---------- */

function activatePageTransition() {
  cachePageTransitionElement();

  if (!pageTransition || transitionLocked) return;

  transitionLocked = true;
  pageTransition.classList.add(PAGE_TRANSITION_ACTIVE_CLASS);

  document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY] =
    shouldUseMinimalTransition() ? "minimal" : "active";
}

function clearPageTransition() {
  cachePageTransitionElement();

  if (pageTransition) {
    pageTransition.classList.remove(PAGE_TRANSITION_ACTIVE_CLASS);
  }

  delete document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY];
  clearSpecialCinematicTransition();
  transitionLocked = false;
}

function handleDocumentClick(event) {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;

  if (transitionLocked) {
    event.preventDefault();
    return;
  }

  if (shouldRunSpecialCinematicCardTransition(link, event)) {
    event.preventDefault();
    runSpecialCinematicCardTransition(link);
    return;
  }

  if (!shouldHandleTransition(link)) return;

  if (
    event.defaultPrevented ||
    hasModifierKey(event) ||
    event.button !== 0
  ) {
    return;
  }

  activatePageTransition();
}

function handleDocumentSubmit(event) {
  if (event.defaultPrevented || transitionLocked) return;

  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  const submitter =
    event.submitter instanceof HTMLElement ? event.submitter : null;

  if (!shouldHandleFormTransition(form, submitter)) return;

  activatePageTransition();
}

function initPageTransition() {
  if (pageTransitionInitialized) return;

  pageTransitionInitialized = true;
  cachePageTransitionElement();
  clearPageTransition();

  window.addEventListener("load", clearPageTransition);
  window.addEventListener("pageshow", clearPageTransition);
  window.addEventListener("pagehide", clearPageTransition);

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("submit", handleDocumentSubmit);
}

/* expose for future use */
window.activatePageTransition = activatePageTransition;
window.clearPageTransition = clearPageTransition;
window.runSpecialCinematicCardTransition = runSpecialCinematicCardTransition;

if (document.body) {
  initPageTransition();
} else {
  document.addEventListener("DOMContentLoaded", initPageTransition, {
    once: true
  });
}
