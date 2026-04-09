(() => {
  "use strict";

  if (window.__siteMobileNavigationInitialized) {
    return;
  }
  window.__siteMobileNavigationInitialized = true;

  const MOBILE_BREAKPOINT = 760;
  const MENU_INTERACTIVE_SELECTOR =
    ".mobile-menu-link, .mobile-menu-button, .mobile-lang-switch a";
  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

  const SWIPE_CLOSE_DISTANCE = 72;
  const SWIPE_MAX_HORIZONTAL_DRIFT = 56;

  let mobileNavToggle = null;
  let mobileMenuOverlay = null;
  let mobileMenuPanel = null;

  let lastFocusedElement = null;
  let scrollPosition = 0;
  let bodyScrollLocked = false;
  let resizeFrame = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let touchTrackingActive = false;
  let mobileNavigationInitialized = false;
  let currentMobileMenuState = false;

  const savedBodyStyles = {
    position: "",
    top: "",
    left: "",
    right: "",
    width: "",
    overflowY: "",
    paddingRight: ""
  };

  function getBody() {
    return document.body;
  }

  function getHtml() {
    return document.documentElement;
  }

  function cacheMobileNavigationElements() {
    mobileNavToggle = document.getElementById("mobileNavToggle");
    mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    mobileMenuPanel = document.querySelector(".mobile-menu-panel");
  }

  function isMobileMenuOpen() {
    const body = getBody();
    return !!body && body.classList.contains("mobile-menu-open");
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function setMobileMenuState(open, source = "manual") {
    const html = getHtml();
    const body = getBody();
    const nextValue = open ? "open" : "closed";

    if (html) {
      html.dataset.mobileMenu = nextValue;
    }

    if (body) {
      body.dataset.mobileMenu = nextValue;
    }

    if (currentMobileMenuState === open) {
      return;
    }

    currentMobileMenuState = open;

    document.dispatchEvent(
      new CustomEvent("site:mobile-menu-change", {
        detail: { open, source }
      })
    );
  }

  function isVisibleElement(element) {
    if (!(element instanceof HTMLElement)) return false;
    if (element.hasAttribute("hidden")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    if (element.closest("[hidden]")) return false;

    const styles = window.getComputedStyle(element);

    if (styles.display === "none") return false;
    if (styles.visibility === "hidden") return false;
    if (styles.visibility === "collapse") return false;

    return element.getClientRects().length > 0;
  }

  function getFocusableElementsInMenu() {
    if (!(mobileMenuPanel instanceof HTMLElement)) return [];

    return Array.from(
      mobileMenuPanel.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter(isVisibleElement);
  }

  function saveBodyStyles() {
    const body = getBody();
    if (!body) return;

    savedBodyStyles.position = body.style.position;
    savedBodyStyles.top = body.style.top;
    savedBodyStyles.left = body.style.left;
    savedBodyStyles.right = body.style.right;
    savedBodyStyles.width = body.style.width;
    savedBodyStyles.overflowY = body.style.overflowY;
    savedBodyStyles.paddingRight = body.style.paddingRight;
  }

  function restoreBodyStyles() {
    const body = getBody();
    if (!body) return;

    body.style.position = savedBodyStyles.position;
    body.style.top = savedBodyStyles.top;
    body.style.left = savedBodyStyles.left;
    body.style.right = savedBodyStyles.right;
    body.style.width = savedBodyStyles.width;
    body.style.overflowY = savedBodyStyles.overflowY;
    body.style.paddingRight = savedBodyStyles.paddingRight;
  }

  function lockBodyScroll() {
    const body = getBody();
    if (!body || bodyScrollLocked) return;

    scrollPosition = window.scrollY || window.pageYOffset || 0;

    const scrollbarWidth = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth
    );

    saveBodyStyles();

    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflowY = "scroll";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    bodyScrollLocked = true;
  }

  function unlockBodyScroll() {
    if (!bodyScrollLocked) return;

    restoreBodyStyles();
    window.scrollTo(0, scrollPosition);
    bodyScrollLocked = false;
  }

  function resetTouchTracking() {
    touchStartX = 0;
    touchStartY = 0;
    touchCurrentX = 0;
    touchCurrentY = 0;
    touchTrackingActive = false;
  }

  function focusFirstMenuItem() {
    const focusable = getFocusableElementsInMenu();

    if (focusable.length > 0) {
      focusable[0].focus();
      return;
    }

    if (mobileMenuPanel instanceof HTMLElement) {
      mobileMenuPanel.focus();
      return;
    }

    if (mobileMenuOverlay instanceof HTMLElement) {
      mobileMenuOverlay.focus();
      return;
    }

    if (mobileNavToggle instanceof HTMLElement) {
      mobileNavToggle.focus();
    }
  }

  function syncMenuAccessibility(open) {
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  function openMobileMenu({ source = "open" } = {}) {
    cacheMobileNavigationElements();

    const body = getBody();

    if (!body || !mobileNavToggle || !mobileMenuOverlay || isMobileMenuOpen()) {
      return;
    }

    lastFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : mobileNavToggle;

    lockBodyScroll();

    body.classList.add("mobile-menu-open");
    syncMenuAccessibility(true);
    setMobileMenuState(true, source);

    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        focusFirstMenuItem();
      }, 40);
    });
  }

  function closeMobileMenu({ restoreFocus = true, source = "close" } = {}) {
    cacheMobileNavigationElements();

    const body = getBody();

    if (!body || !mobileNavToggle || !mobileMenuOverlay) {
      resetTouchTracking();
      setMobileMenuState(false, source);
      return;
    }

    if (!isMobileMenuOpen()) {
      resetTouchTracking();
      syncMenuAccessibility(false);
      setMobileMenuState(false, source);
      return;
    }

    body.classList.remove("mobile-menu-open");
    syncMenuAccessibility(false);
    setMobileMenuState(false, source);

    unlockBodyScroll();
    resetTouchTracking();

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      const targetToRestore = lastFocusedElement;

      window.setTimeout(() => {
        if (document.contains(targetToRestore)) {
          targetToRestore.focus();
        }
        lastFocusedElement = null;
      }, 40);
    } else {
      lastFocusedElement = null;
    }
  }

  function toggleMobileMenu() {
    if (isMobileMenuOpen()) {
      closeMobileMenu({ source: "toggle-close" });
    } else {
      openMobileMenu({ source: "toggle-open" });
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
      if (
        active === first ||
        !(mobileMenuPanel instanceof HTMLElement) ||
        !mobileMenuPanel.contains(active)
      ) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (
      active === last ||
      !(mobileMenuPanel instanceof HTMLElement) ||
      !mobileMenuPanel.contains(active)
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleDocumentKeydown(event) {
    if (!isMobileMenuOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu({ source: "escape" });
      return;
    }

    trapFocusInMenu(event);
  }

  function handleDocumentFocusIn(event) {
    if (!isMobileMenuOpen()) return;
    if (!(event.target instanceof Node)) return;
    if (!(mobileMenuPanel instanceof HTMLElement)) return;

    if (mobileMenuPanel.contains(event.target)) return;
    if (event.target === mobileMenuOverlay) return;

    focusFirstMenuItem();
  }

  function handleOverlayClick(event) {
    if (!mobileMenuOverlay) return;

    if (event.target === mobileMenuOverlay) {
      closeMobileMenu({ source: "overlay-click" });
    }
  }

  function handlePanelClick(event) {
    if (!(event.target instanceof Element)) return;

    const trigger = event.target.closest(MENU_INTERACTIVE_SELECTOR);
    if (!trigger) return;

    closeMobileMenu({ restoreFocus: false, source: "panel-click" });
  }

  function handleResizeLikeEvent() {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;

      if (!isMobileViewport() && isMobileMenuOpen()) {
        closeMobileMenu({ restoreFocus: false, source: "viewport-exit" });
        return;
      }

      setMobileMenuState(isMobileMenuOpen(), "resize-sync");
    });
  }

  function handlePageShow() {
    cacheMobileNavigationElements();

    if (isMobileMenuOpen()) {
      closeMobileMenu({ restoreFocus: false, source: "pageshow-close" });
    } else {
      unlockBodyScroll();
      resetTouchTracking();
      syncMenuAccessibility(false);
      setMobileMenuState(false, "pageshow");
    }
  }

  function handlePageHide() {
    resetTouchTracking();
    setMobileMenuState(false, "pagehide");
  }

  function handleTouchStart(event) {
    if (!isMobileMenuOpen()) return;
    if (!isMobileViewport()) return;
    if (!mobileMenuOverlay) return;
    if (mobileMenuOverlay.scrollTop > 0) return;
    if (!event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchCurrentX = touch.clientX;
    touchCurrentY = touch.clientY;
    touchTrackingActive = true;
  }

  function handleTouchMove(event) {
    if (!touchTrackingActive) return;
    if (!event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];
    touchCurrentX = touch.clientX;
    touchCurrentY = touch.clientY;
  }

  function handleTouchEnd() {
    if (!touchTrackingActive) return;

    const deltaX = touchCurrentX - touchStartX;
    const deltaY = touchCurrentY - touchStartY;

    resetTouchTracking();

    const movedMostlyVertical =
      Math.abs(deltaY) > Math.abs(deltaX) &&
      Math.abs(deltaX) <= SWIPE_MAX_HORIZONTAL_DRIFT;

    if (movedMostlyVertical && deltaY >= SWIPE_CLOSE_DISTANCE) {
      closeMobileMenu({ restoreFocus: false, source: "swipe-close" });
    }
  }

  function initAccessibilityAttributes() {
    if (mobileMenuOverlay) {
      mobileMenuOverlay.setAttribute("aria-hidden", "true");
      mobileMenuOverlay.setAttribute("role", "dialog");
      mobileMenuOverlay.setAttribute("aria-modal", "true");
      mobileMenuOverlay.setAttribute("tabindex", "-1");
    }

    if (mobileMenuPanel instanceof HTMLElement) {
      mobileMenuPanel.setAttribute("tabindex", "-1");
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

  function normalizeInitialState() {
    const body = getBody();
    if (!body) return;

    body.classList.remove("mobile-menu-open");
    syncMenuAccessibility(false);
    setMobileMenuState(false, "init");

    unlockBodyScroll();
    resetTouchTracking();
    lastFocusedElement = null;
  }

  function initTouchClose() {
    if (!mobileMenuOverlay) return;

    mobileMenuOverlay.addEventListener("touchstart", handleTouchStart, {
      passive: true
    });
    mobileMenuOverlay.addEventListener("touchmove", handleTouchMove, {
      passive: true
    });
    mobileMenuOverlay.addEventListener("touchend", handleTouchEnd, {
      passive: true
    });
    mobileMenuOverlay.addEventListener("touchcancel", handleTouchEnd, {
      passive: true
    });
  }

  function initMobileNavigation() {
    if (mobileNavigationInitialized) return;

    cacheMobileNavigationElements();

    if (!mobileNavToggle || !mobileMenuOverlay || !mobileMenuPanel) return;

    mobileNavigationInitialized = true;

    initAccessibilityAttributes();
    normalizeInitialState();
    initTouchClose();

    mobileNavToggle.addEventListener("click", toggleMobileMenu);
    mobileMenuOverlay.addEventListener("click", handleOverlayClick);
    mobileMenuPanel.addEventListener("click", handlePanelClick);

    document.addEventListener("keydown", handleDocumentKeydown);
    document.addEventListener("focusin", handleDocumentFocusIn);

    window.addEventListener("resize", handleResizeLikeEvent);
    window.addEventListener("orientationchange", handleResizeLikeEvent);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);
  }

  window.openMobileMenu = openMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.toggleMobileMenu = toggleMobileMenu;
  window.isMobileMenuOpen = isMobileMenuOpen;

  if (document.body) {
    initMobileNavigation();
  } else {
    document.addEventListener("DOMContentLoaded", initMobileNavigation, {
      once: true
    });
  }
})();
