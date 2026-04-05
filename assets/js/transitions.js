const pageTransition = document.getElementById("pageTransition");

function shouldHandleTransition(link) {
  if (!link) return false;

  const href = link.getAttribute("href");
  if (!href) return false;

  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:")) return false;
  if (href.startsWith("tel:")) return false;
  if (link.hasAttribute("download")) return false;
  if (link.getAttribute("target") === "_blank") return false;

  const url = new URL(link.href, window.location.origin);

  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.hash) return false;

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

window.addEventListener("pageshow", clearPageTransition);
window.addEventListener("load", clearPageTransition);

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href]');
  if (!shouldHandleTransition(link)) return;

  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  ) {
    return;
  }

  activatePageTransition();
});

document.addEventListener("submit", () => {
  activatePageTransition();
});
