document.documentElement.classList.add("js-ready");

const revealItems = Array.from(document.querySelectorAll(".reveal"));
const scrollTopButton = document.getElementById("scrollTopButton");

const SCROLL_TOP_VISIBILITY_THRESHOLD = 560;

let scrollUiTicking = false;
let revealObserver = null;

function isReducedMotionEnabled() {
  return document.body.classList.contains("reduced-motion");
}

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function shouldUseSmoothScroll() {
  return !isReducedMotionEnabled();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
  setScrollTopButtonVisibility(scrollTop > SCROLL_TOP_VISIBILITY_THRESHOLD);
}

function handleScrollTopClick() {
  window.scrollTo({
    top: 0,
    behavior: shouldUseSmoothScroll() ? "smooth" : "auto"
  });
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
    updateScrollLinkedUi();
    scrollUiTicking = false;
  });
}

/* ---------- GLOBAL REFRESH ---------- */

function refreshMainUI() {
  requestScrollLinkedUiUpdate();
  updateScrollTopButtonLabel();
}

function handleReducedMotionChange() {
  initRevealObserver();
  refreshMainUI();
}

/* ---------- INIT ---------- */

if (scrollTopButton) {
  setScrollTopButtonVisibility(false);
  updateScrollTopButtonLabel();
  scrollTopButton.addEventListener("click", handleScrollTopClick);
}

initRevealObserver();
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
