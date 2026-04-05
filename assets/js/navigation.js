const mobileNavToggle = document.getElementById("mobileNavToggle");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuPanel = document.querySelector(".mobile-menu-panel");
const mobileMenuInteractiveItems = document.querySelectorAll(
  ".mobile-menu-link, .mobile-menu-button, .mobile-lang-switch a"
);

let lastFocusedElement = null;
let scrollPosition = 0;

function isMobileMenuOpen() {
  return document.body.classList.contains("mobile-menu-open");
}

function getFocusableElementsInMenu() {
  if (!mobileMenuPanel) return [];
  return Array.from(
    mobileMenuPanel.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

function lockBodyScroll() {
  scrollPosition = window.scrollY || window.pageYOffset;
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
}

function unlockBodyScroll() {
  document.body.style.removeProperty("top");
  document.body.style.removeProperty("position");
  document.body.style.removeProperty("width");
  window.scrollTo(0, scrollPosition);
}

function openMobileMenu() {
  if (!mobileNavToggle || !mobileMenuOverlay || isMobileMenuOpen()) return;

  lastFocusedElement = document.activeElement;
  lockBodyScroll();
  document.body.classList.add("mobile-menu-open");
  mobileNavToggle.setAttribute("aria-expanded", "true");
  mobileMenuOverlay.setAttribute("aria-hidden", "false");

  const focusable = getFocusableElementsInMenu();
  if (focusable.length > 0) {
    window.setTimeout(() => focusable[0].focus(), 50);
  }
}

function closeMobileMenu({ restoreFocus = true } = {}) {
  if (!mobileNavToggle || !mobileMenuOverlay || !isMobileMenuOpen()) return;

  document.body.classList.remove("mobile-menu-open");
  mobileNavToggle.setAttribute("aria-expanded", "false");
  mobileMenuOverlay.setAttribute("aria-hidden", "true");
  unlockBodyScroll();

  if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
    window.setTimeout(() => lastFocusedElement.focus(), 50);
  }
}

function toggleMobileMenu() {
  if (isMobileMenuOpen()) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

if (mobileNavToggle) {
  if (!mobileNavToggle.hasAttribute("aria-expanded")) {
    mobileNavToggle.setAttribute("aria-expanded", "false");
  }

  if (!mobileNavToggle.hasAttribute("aria-controls") && mobileMenuOverlay) {
    mobileNavToggle.setAttribute("aria-controls", "mobileMenuOverlay");
  }

  mobileNavToggle.addEventListener("click", toggleMobileMenu);
}

mobileMenuInteractiveItems.forEach((item) => {
  item.addEventListener("click", () => {
    closeMobileMenu({ restoreFocus: false });
  });
});

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener("click", (event) => {
    if (event.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!isMobileMenuOpen()) return;

  if (event.key === "Escape") {
    closeMobileMenu();
    return;
  }

  if (event.key === "Tab") {
    const focusable = getFocusableElementsInMenu();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !mobileMenuPanel.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && isMobileMenuOpen()) {
    closeMobileMenu({ restoreFocus: false });
  }
});
