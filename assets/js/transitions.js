const pageTransition = document.getElementById("pageTransition");

function hasModifierKey(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
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
  if (link.getAttribute("target") === "_blank") return false;
  if (link.hasAttribute("data-no-transition")) return false;

  let url;

  try {
    url = new URL(link.href, window.location.origin);
  } catch (error) {
    return false;
  }

  if (url.origin !== window.location.origin) return false;

  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const targetPath = url.pathname.replace(/\/+$/, "") || "/";

  const isSamePath = currentPath === targetPath;
  const isSameSearch = window.location.search === url.search;

  if (isSamePath && isSameSearch && url.hash) return false;
  if (isSamePath && isSameSearch && !url.hash) return false;

  return true;
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
  activatePageTransition();
});
