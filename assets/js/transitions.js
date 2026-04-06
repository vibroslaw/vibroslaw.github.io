const pageTransition = document.getElementById("pageTransition");

function hasModifierKey(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function normalizePath(path) {
  return (path || "").replace(/\/+$/, "") || "/";
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
  if (link.getAttribute("rel")?.includes("external")) return false;
  if (link.getAttribute("aria-disabled") === "true") return false;

  let targetUrl;

  try {
    targetUrl = new URL(link.href, window.location.origin);
  } catch (error) {
    return false;
  }

  if (targetUrl.origin !== window.location.origin) return false;

  if (isSameLocation(targetUrl)) {
    return false;
  }

  return true;
}

function shouldHandleFormTransition(form) {
  if (!form) return false;
  if (form.hasAttribute("data-no-transition")) return false;
  if (form.getAttribute("target") === "_blank") return false;

  const action = form.getAttribute("action");

  if (!action || action.trim() === "") {
    return true;
  }

  try {
    const actionUrl = new URL(action, window.location.origin);
    return actionUrl.origin === window.location.origin;
  } catch (error) {
    return false;
  }
}

function activatePageTransition() {
  if (!pageTransition) return;
  pageTransition.classList.add("active");
}

function clearPageTransition() {
  if (!pageTransition) return;
  pageTransition.classList.remove("active");
}

window.addEventListener("DOMContentLoaded", clearPageTransition);
window.addEventListener("load", clearPageTransition);
window.addEventListener("pageshow", clearPageTransition);

document.addEventListener("click", (event) => {
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
  if (!shouldHandleFormTransition(form)) return;

  activatePageTransition();
});
