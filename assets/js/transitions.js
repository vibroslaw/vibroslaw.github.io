const pageTransition = document.getElementById("pageTransition");

const PAGE_TRANSITION_ACTIVE_CLASS = "active";
const PAGE_TRANSITION_DATA_KEY = "pageTransition";
const MOBILE_BREAKPOINT = 760;

let transitionLocked = false;

function hasModifierKey(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function normalizePath(path) {
  return (path || "").replace(/\/+$/, "") || "/";
}

function isReducedMotionEnabled() {
  if (document.body.classList.contains("reduced-motion")) {
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

function shouldHandleTransition(link) {
  if (!link) return false;

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

  const rel = link.getAttribute("rel") || "";
  if (rel.includes("external")) return false;

  let targetUrl;

  try {
    targetUrl = new URL(link.href, window.location.origin);
  } catch (error) {
    return false;
  }

  if (targetUrl.origin !== window.location.origin) return false;
  if (isSameLocation(targetUrl)) return false;

  return true;
}

function shouldHandleFormTransition(form, submitter = null) {
  if (!form) return false;
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

function activatePageTransition() {
  if (!pageTransition || transitionLocked) return;

  transitionLocked = true;

  pageTransition.classList.add(PAGE_TRANSITION_ACTIVE_CLASS);
  document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY] =
    shouldUseMinimalTransition() ? "minimal" : "active";
}

function clearPageTransition() {
  if (pageTransition) {
    pageTransition.classList.remove(PAGE_TRANSITION_ACTIVE_CLASS);
  }

  delete document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY];
  transitionLocked = false;
}

window.addEventListener("DOMContentLoaded", clearPageTransition);
window.addEventListener("load", clearPageTransition);
window.addEventListener("pageshow", clearPageTransition);

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest("a[href]");
  if (!shouldHandleTransition(link)) return;

  if (
    event.defaultPrevented ||
    hasModifierKey(event) ||
    event.button !== 0
  ) {
    return;
  }

  activatePageTransition();
});

document.addEventListener("submit", (event) => {
  if (event.defaultPrevented) return;

  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  const submitter =
    event.submitter instanceof HTMLElement ? event.submitter : null;

  if (!shouldHandleFormTransition(form, submitter)) return;

  activatePageTransition();
});
