const mobileNavToggle = document.getElementById("mobileNavToggle");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuPanel = document.querySelector(".mobile-menu-panel");

const MOBILE_BREAKPOINT = 760;
const MENU_INTERACTIVE_SELECTOR =
  ".mobile-menu-link, .mobile-menu-button, .mobile-lang-switch a";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

let lastFocusedElement = null;
let scrollPosition = 0;
let bodyScrollLocked = false;
let resizeFrame = null;

const savedBodyStyles = {
  position: "",
  top: "",
  left: "",
  right: "",
  width: "",
  overflowY: "",
  paddingRight: ""
};

function isMobileMenuOpen() {
  return document.body.classList.contains("mobile-menu-open");
}

function isMobileViewport() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function getFocusableElementsInMenu() {
  if (!mobileMenuPanel) return [];

  return Array.from(
    mobileMenuPanel.querySelectorAll(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element.hasAttribute("hidden")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    return true;
  });
}

function saveBodyStyles() {
  savedBodyStyles.position = document.body.style.position;
  savedBodyStyles.top = document.body.style.top;
  savedBodyStyles.left = document.body.style.left;
  savedBodyStyles.right = document.body.style.right;
  savedBodyStyles.width = document.body.style.width;
  savedBodyStyles.overflowY = document.body.style.overflowY;
  savedBodyStyles.paddingRight = document.body.style.paddingRight;
}

function restoreBodyStyles() {
  document.body.style.position = savedBodyStyles.position;
  document.body.style.top = savedBodyStyles.top;
  document.body.style.left = savedBodyStyles.left;
  document.body.style.right = savedBodyStyles.right;
  document.body.style.width = savedBodyStyles.width;
  document.body.style.overflowY = savedBodyStyles.overflowY;
  document.body.style.paddingRight = savedBodyStyles.paddingRight;
}

function lockBodyScroll() {
  if (bodyScrollLocked) return;

  scrollPosition = window.scrollY || window.pageYOffset || 0;

  const scrollbarWidth = Math.max(
    0,
    window.innerWidth - document.documentElement.clientWidth
  );

  saveBodyStyles();

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflowY = "scroll";

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  bodyScrollLocked = true;
}

function unlockBodyScroll() {
  if (!bodyScrollLocked) return;

  restoreBodyStyles();
  window.scrollTo(0, scrollPosition);
  bodyScrollLocked = false;
}

function focusFirstMenuItem() {
  const focusable = getFocusableElementsInMenu();

  if (focusable.length === 0) {
    if (mobileNavToggle) {
      mobileNavToggle.focus();
    }
    return;
  }

  focusable[0].focus();
}

function openMobileMenu() {
  if (!mobileNavToggle || !mobileMenuOverlay || isMobileMenuOpen()) return;

  lastFocusedElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : mobileNavToggle;

  lockBodyScroll();

  document.body.classList.add("mobile-menu-open");
  mobileNavToggle.setAttribute("aria-expanded", "true");
  mobileMenuOverlay.setAttribute("aria-hidden", "false");

  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      focusFirstMenuItem();
    }, 40);
  });
}

function closeMobileMenu({ restoreFocus = true } = {}) {
  if (!mobileNavToggle || !mobileMenuOverlay || !isMobileMenuOpen()) return;

  document.body.classList.remove("mobile-menu-open");
  mobileNavToggle.setAttribute("aria-expanded", "false");
  mobileMenuOverlay.setAttribute("aria-hidden", "true");

  unlockBodyScroll();

  if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
    window.setTimeout(() => {
      lastFocusedElement.focus();
    }, 40);
  }
}

function toggleMobileMenu() {
  if (isMobileMenuOpen()) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function trapFocusInMenu(event) {
  if (!isMobileMenuOpen()) return;
  if (event.key !== "Tab") return;

  const focusable = getFocusableElementsInMenu();
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !mobileMenuPanel || !mobileMenuPanel.contains(active)) {
      event.preventDefault();
      last.focus();
    }
    return;
  }

  if (active === last || !mobileMenuPanel || !mobileMenuPanel.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}

function handleDocumentKeydown(event) {
  if (!isMobileMenuOpen()) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeMobileMenu();
    return;
  }

  trapFocusInMenu(event);
}

function handleOverlayClick(event) {
  if (!mobileMenuOverlay) return;
  if (event.target === mobileMenuOverlay) {
    closeMobileMenu();
  }
}

function handleMenuItemClick() {
  closeMobileMenu({ restoreFocus: false });
}

function handleResizeLikeEvent() {
  if (resizeFrame) {
    window.cancelAnimationFrame(resizeFrame);
  }

  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = null;

    if (!isMobileViewport() && isMobileMenuOpen()) {
      closeMobileMenu({ restoreFocus: false });
    }
  });
}

function initAccessibilityAttributes() {
  if (mobileMenuOverlay) {
    mobileMenuOverlay.setAttribute("aria-hidden", "true");
    mobileMenuOverlay.setAttribute("role", "dialog");
    mobileMenuOverlay.setAttribute("aria-modal", "true");
  }

  if (mobileNavToggle) {
    if (!mobileNavToggle.hasAttribute("aria-expanded")) {
      mobileNavToggle.setAttribute("aria-expanded", "false");
    }

    if (!mobileNavToggle.hasAttribute("aria-controls") && mobileMenuOverlay) {
      mobileNavToggle.setAttribute("aria-controls", "mobileMenuOverlay");
    }
  }
}

function initMenuInteractiveItems() {
  const mobileMenuInteractiveItems = document.querySelectorAll(MENU_INTERACTIVE_SELECTOR);

  mobileMenuInteractiveItems.forEach((item) => {
    item.addEventListener("click", handleMenuItemClick);
  });
}

function initMobileNavigation() {
  if (!mobileNavToggle || !mobileMenuOverlay || !mobileMenuPanel) return;

  initAccessibilityAttributes();

  mobileNavToggle.addEventListener("click", toggleMobileMenu);
  mobileMenuOverlay.addEventListener("click", handleOverlayClick);

  document.addEventListener("keydown", handleDocumentKeydown);
  window.addEventListener("resize", handleResizeLikeEvent);
  window.addEventListener("orientationchange", handleResizeLikeEvent);

  initMenuInteractiveItems();
}

/* expose for cinematic.js and future shared controls */
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleMobileMenu = toggleMobileMenu;

initMobileNavigation();
