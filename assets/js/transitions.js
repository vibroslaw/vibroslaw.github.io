(() => {
  "use strict";

  if (window.__siteTransitionsModuleInitialized) {
    return;
  }
  window.__siteTransitionsModuleInitialized = true;

  const PAGE_TRANSITION_ACTIVE_CLASS = "active";
  const PAGE_TRANSITION_DATA_KEY = "pageTransition";
  const MOBILE_BREAKPOINT = 760;

  const CINEMATIC_HOME_PAGE = "home";
  const CINEMATIC_CARD_SELECTOR = ".cinematic-entry-card[data-cinematic-entry]";
  const CINEMATIC_CARD_KEYS = new Set(["rap-ort", "sztab"]);

  const CINEMATIC_ZOOM_DURATION_DESKTOP = 1420;
  const CINEMATIC_ZOOM_DURATION_MOBILE = 1120;
  const CINEMATIC_NAVIGATION_OFFSET = 110;
  const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";

  const MOBILE_CINEMATIC_LINK_TRANSITION_DURATION = 380;
  const MOBILE_CINEMATIC_LINK_NAVIGATION_DELAY = 250;
  const STANDARD_CINEMATIC_LINK_DURATION_DESKTOP = 860;

  let pageTransition = null;
  let transitionLocked = false;
  let pageTransitionInitialized = false;
  let cinematicTransitionEventActive = false;

  let cinematicZoomClone = null;
  let cinematicZoomVeil = null;
  let genericMobileVeil = null;
  let cinematicShellSnapshot = [];
  let cinematicTimers = [];

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

  function supportsHaptics() {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    );
  }

  function triggerHapticFeedback(style = "light") {
    if (!isMobileViewport()) return;
    if (!supportsHaptics()) return;

    const duration = style === "firm" ? 16 : 10;

    try {
      navigator.vibrate(duration);
    } catch (error) {
      /* silent */
    }
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

  function saveToSessionStorage(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      /* silent */
    }
  }

  function notifyCinematicTransitionChange(active, source = "generic") {
    if (active === cinematicTransitionEventActive) return;

    cinematicTransitionEventActive = active;

    document.dispatchEvent(
      new CustomEvent(
        active
          ? "site:cinematic-transition-start"
          : "site:cinematic-transition-end",
        {
          detail: { active, source }
        }
      )
    );
  }

  function getTransitionTitle(link) {
    if (!(link instanceof HTMLAnchorElement)) return "Entry";

    const explicitTitle = (link.dataset.trackTitle || "").trim();
    if (explicitTitle) return explicitTitle;

    const ariaLabel = (link.getAttribute("aria-label") || "").trim();
    if (ariaLabel) return ariaLabel;

    const heading = link.querySelector("h1, h2, h3, h4");
    const headingText = (heading?.textContent || "").trim();
    if (headingText) return headingText;

    const text = (link.textContent || "").replace(/\s+/g, " ").trim();
    if (text) return text;

    return "Entry";
  }

  function getTransitionKey(link) {
    if (!(link instanceof HTMLAnchorElement)) return "entry";

    const explicitKey = (link.dataset.cinematicEntry || "")
      .trim()
      .toLowerCase();
    if (explicitKey) return explicitKey;

    const trackTitle = (link.dataset.trackTitle || "").trim().toLowerCase();
    if (trackTitle) {
      return trackTitle.replace(/\s+/g, "-");
    }

    const targetUrl = getLinkTargetUrl(link);
    if (targetUrl) {
      const pathParts = normalizePath(targetUrl.pathname)
        .split("/")
        .filter(Boolean);

      if (pathParts.length > 0) {
        return pathParts[pathParts.length - 1].toLowerCase();
      }
    }

    return "entry";
  }

  function writeCinematicArrivalState(link, duration, source = "cinematic-link") {
    if (!(link instanceof HTMLAnchorElement)) return;

    const payload = {
      href: link.href,
      key: getTransitionKey(link),
      title: getTransitionTitle(link),
      timestamp: Date.now(),
      duration,
      mobile: isMobileViewport(),
      source
    };

    saveToSessionStorage(
      CINEMATIC_ARRIVAL_STORAGE_KEY,
      JSON.stringify(payload)
    );
  }

  function clearCinematicTimers() {
    cinematicTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });

    cinematicTimers = [];
  }

  function queueCinematicTimer(callback, delay) {
    const timerId = window.setTimeout(callback, delay);
    cinematicTimers.push(timerId);
    return timerId;
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

  function isHomepage() {
    return getBody()?.dataset.page === CINEMATIC_HOME_PAGE;
  }

  function isSpecialCinematicCardLink(link) {
    if (!(link instanceof HTMLAnchorElement)) return false;
    if (!isHomepage()) return false;
    if (!link.matches(CINEMATIC_CARD_SELECTOR)) return false;

    const key = (link.dataset.cinematicEntry || "").trim().toLowerCase();
    if (!CINEMATIC_CARD_KEYS.has(key)) return false;

    const targetUrl = getLinkTargetUrl(link);
    if (!targetUrl) return false;
    if (targetUrl.origin !== window.location.origin) return false;

    return true;
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

  function shouldRunGenericMobileCinematicTransition(link, event) {
    if (!(link instanceof HTMLAnchorElement)) return false;
    if (!isMobileViewport()) return false;
    if (!isCinematicModeEnabled()) return false;
    if (isReducedMotionEnabled()) return false;
    if (isSaveDataEnabled()) return false;
    if (isSpecialCinematicCardLink(link)) return false;

    if (
      event.defaultPrevented ||
      hasModifierKey(event) ||
      event.button !== 0
    ) {
      return false;
    }

    return shouldHandleTransition(link);
  }

  function getCinematicDuration() {
    return isMobileViewport()
      ? CINEMATIC_ZOOM_DURATION_MOBILE
      : CINEMATIC_ZOOM_DURATION_DESKTOP;
  }

  function getCinematicMediaBleed() {
    return isMobileViewport() ? 18 : 10;
  }

  function getCinematicShellScale() {
    return isMobileViewport() ? 1.012 : 1.03;
  }

  function getCinematicMediaTargetScale() {
    return isMobileViewport() ? 1.08 : 1.14;
  }

  function getCinematicMediaFinalScale() {
    return isMobileViewport() ? 1.12 : 1.22;
  }

  function closeMobileMenuIfOpen() {
    if (
      typeof window.isMobileMenuOpen === "function" &&
      !window.isMobileMenuOpen()
    ) {
      return;
    }

    if (typeof window.closeMobileMenu === "function") {
      window.closeMobileMenu({ restoreFocus: false });
      return;
    }

    const body = getBody();
    if (!body || !body.classList.contains("mobile-menu-open")) return;

    body.classList.remove("mobile-menu-open");
  }

  function createGenericMobileNavigationVeil(link) {
    const title = getTransitionTitle(link);

    const veil = document.createElement("div");
    veil.setAttribute("aria-hidden", "true");
    veil.style.position = "fixed";
    veil.style.inset = "0";
    veil.style.zIndex = "10012";
    veil.style.pointerEvents = "none";
    veil.style.opacity = "0";
    veil.style.transform = "translateZ(0)";
    veil.style.backfaceVisibility = "hidden";
    veil.style.background = [
      "radial-gradient(circle at 50% 18%, rgba(201,178,143,.14), transparent 18%)",
      "radial-gradient(circle at 50% 46%, rgba(255,255,255,.04), transparent 26%)",
      "linear-gradient(180deg, rgba(8,8,8,.08), rgba(8,8,8,.44), rgba(6,6,6,.94))"
    ].join(", ");
    veil.style.backdropFilter = "blur(7px)";
    veil.style.webkitBackdropFilter = "blur(7px)";
    veil.style.transition = "opacity 260ms cubic-bezier(.16,1,.30,1)";

    const sweep = document.createElement("div");
    sweep.setAttribute("aria-hidden", "true");
    sweep.style.position = "absolute";
    sweep.style.inset = "-12% -34%";
    sweep.style.opacity = "0";
    sweep.style.transform = "translate3d(-28%,0,0) skewX(-12deg)";
    sweep.style.mixBlendMode = "screen";
    sweep.style.background =
      "linear-gradient(110deg, transparent 0%, transparent 42%, rgba(255,255,255,.12) 50%, transparent 58%, transparent 100%)";
    sweep.style.transition =
      "opacity 320ms cubic-bezier(.16,1,.30,1), transform 620ms cubic-bezier(.16,1,.30,1)";

    const titleWrap = document.createElement("div");
    titleWrap.setAttribute("aria-hidden", "true");
    titleWrap.style.position = "absolute";
    titleWrap.style.left = "50%";
    titleWrap.style.top = "46%";
    titleWrap.style.transform = "translate3d(-50%,16px,0) scale(.98)";
    titleWrap.style.width = "82vw";
    titleWrap.style.maxWidth = "340px";
    titleWrap.style.textAlign = "center";
    titleWrap.style.opacity = "0";
    titleWrap.style.filter = "blur(10px)";
    titleWrap.style.transition =
      "opacity 260ms cubic-bezier(.16,1,.30,1), transform 420ms cubic-bezier(.16,1,.30,1), filter 420ms cubic-bezier(.16,1,.30,1)";

    const titleText = document.createElement("div");
    titleText.textContent =
      title.length > 38 ? `${title.slice(0, 38).trim()}…` : title;
    titleText.style.fontFamily = '"Cormorant Garamond", serif';
    titleText.style.fontWeight = "600";
    titleText.style.fontSize = "clamp(1.8rem, 8.4vw, 2.8rem)";
    titleText.style.lineHeight = ".92";
    titleText.style.letterSpacing = "-.015em";
    titleText.style.color = "#f2ece3";
    titleText.style.textShadow =
      "0 14px 34px rgba(0,0,0,.42), 0 2px 10px rgba(0,0,0,.24)";

    titleWrap.appendChild(titleText);
    veil.appendChild(sweep);
    veil.appendChild(titleWrap);
    document.body.appendChild(veil);

    genericMobileVeil = {
      veil,
      sweep,
      titleWrap
    };

    return genericMobileVeil;
  }

  function createCinematicVeil() {
    const mobile = isMobileViewport();

    const veil = document.createElement("div");
    veil.setAttribute("aria-hidden", "true");
    veil.style.position = "fixed";
    veil.style.inset = "0";
    veil.style.zIndex = "10010";
    veil.style.pointerEvents = "none";
    veil.style.opacity = "0";
    veil.style.overflow = "hidden";
    veil.style.transform = "translateZ(0)";
    veil.style.backfaceVisibility = "hidden";
    veil.style.background = [
      "radial-gradient(circle at 50% 10%, rgba(255,255,255,.06), transparent 10%)",
      "radial-gradient(circle at 50% 24%, rgba(201,178,143,.28), transparent 18%)",
      "radial-gradient(circle at 50% 46%, rgba(201,178,143,.18), transparent 30%)",
      "radial-gradient(circle at 50% 68%, rgba(0,0,0,.18), transparent 42%)",
      mobile
        ? "linear-gradient(180deg, rgba(6,6,6,.10), rgba(8,8,8,.34), rgba(10,10,10,.86))"
        : "linear-gradient(180deg, rgba(3,3,3,.14), rgba(6,6,6,.42), rgba(9,9,9,.92))"
    ].join(", ");
    veil.style.transition = "opacity 480ms cubic-bezier(.16,1,.30,1)";

    const sweep = document.createElement("div");
    sweep.setAttribute("aria-hidden", "true");
    sweep.style.position = "absolute";
    sweep.style.inset = "-16% -38%";
    sweep.style.pointerEvents = "none";
    sweep.style.opacity = "0";
    sweep.style.transform = "translate3d(-24%,0,0) skewX(-10deg)";
    sweep.style.mixBlendMode = "screen";
    sweep.style.background =
      "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,.17) 50%, transparent 60%, transparent 100%)";
    sweep.style.transition =
      "opacity 620ms cubic-bezier(.16,1,.30,1), transform 1220ms cubic-bezier(.16,1,.30,1)";

    const flash = document.createElement("div");
    flash.setAttribute("aria-hidden", "true");
    flash.style.position = "absolute";
    flash.style.inset = "0";
    flash.style.pointerEvents = "none";
    flash.style.opacity = "0";
    flash.style.background =
      "radial-gradient(circle at 50% 40%, rgba(255,255,255,.16), transparent 18%)";
    flash.style.transition = "opacity 180ms ease";

    const topShutter = document.createElement("div");
    topShutter.setAttribute("aria-hidden", "true");
    topShutter.style.position = "absolute";
    topShutter.style.top = "0";
    topShutter.style.left = "0";
    topShutter.style.right = "0";
    topShutter.style.height = mobile ? "8vh" : "12vh";
    topShutter.style.pointerEvents = "none";
    topShutter.style.opacity = "0";
    topShutter.style.transform = "translate3d(0,-104%,0)";
    topShutter.style.background =
      "linear-gradient(180deg, rgba(0,0,0,.98), rgba(0,0,0,.78), transparent)";
    topShutter.style.transition =
      "opacity 380ms cubic-bezier(.16,1,.30,1), transform 820ms cubic-bezier(.16,1,.30,1)";

    const bottomShutter = document.createElement("div");
    bottomShutter.setAttribute("aria-hidden", "true");
    bottomShutter.style.position = "absolute";
    bottomShutter.style.bottom = "0";
    bottomShutter.style.left = "0";
    bottomShutter.style.right = "0";
    bottomShutter.style.height = mobile ? "10vh" : "16vh";
    bottomShutter.style.pointerEvents = "none";
    bottomShutter.style.opacity = "0";
    bottomShutter.style.transform = "translate3d(0,104%,0)";
    bottomShutter.style.background =
      "linear-gradient(0deg, rgba(0,0,0,.99), rgba(0,0,0,.82), transparent)";
    bottomShutter.style.transition =
      "opacity 380ms cubic-bezier(.16,1,.30,1), transform 860ms cubic-bezier(.16,1,.30,1)";

    veil.appendChild(sweep);
    veil.appendChild(flash);
    veil.appendChild(topShutter);
    veil.appendChild(bottomShutter);
    document.body.appendChild(veil);

    cinematicZoomVeil = veil;

    return {
      veil,
      sweep,
      flash,
      topShutter,
      bottomShutter
    };
  }

  function createCinematicZoomClone(sourceLink) {
    if (!(sourceLink instanceof HTMLAnchorElement)) return null;

    const sourceMedia = sourceLink.querySelector(".project-media");
    if (!(sourceMedia instanceof HTMLElement)) return null;

    const mobile = isMobileViewport();
    const bleed = getCinematicMediaBleed();

    const linkRect = sourceLink.getBoundingClientRect();
    const mediaRect = sourceMedia.getBoundingClientRect();
    const linkStyle = window.getComputedStyle(sourceLink);
    const mediaStyle = window.getComputedStyle(sourceMedia);

    const title = getTransitionTitle(sourceLink);
    const kicker = (sourceLink.dataset.cinematicLabel || "").trim();

    const shell = document.createElement("div");
    shell.setAttribute("aria-hidden", "true");
    shell.style.position = "fixed";
    shell.style.left = `${linkRect.left}px`;
    shell.style.top = `${linkRect.top}px`;
    shell.style.width = `${linkRect.width}px`;
    shell.style.height = `${linkRect.height}px`;
    shell.style.zIndex = "10020";
    shell.style.pointerEvents = "none";
    shell.style.overflow = "hidden";
    shell.style.borderRadius = linkStyle.borderRadius || "32px";
    shell.style.background = mobile
      ? "transparent"
      : "linear-gradient(180deg, rgba(8,8,8,.95), rgba(5,5,5,.995))";
    shell.style.border = mobile ? "none" : "1px solid rgba(255,255,255,.08)";
    shell.style.boxShadow = mobile
      ? "0 24px 64px rgba(0,0,0,.30)"
      : "0 52px 180px rgba(0,0,0,.56)";
    shell.style.transform = "translate3d(0,0,0) scale(1)";
    shell.style.transformOrigin = "center center";
    shell.style.willChange =
      "left, top, width, height, border-radius, transform, box-shadow, opacity";
    shell.style.backfaceVisibility = "hidden";
    shell.style.transformStyle = "preserve-3d";
    shell.style.contain = "layout paint style";
    shell.style.isolation = "isolate";

    const mediaLayer = document.createElement("div");
    mediaLayer.setAttribute("aria-hidden", "true");
    mediaLayer.style.position = "absolute";
    mediaLayer.style.left = `${mediaRect.left - linkRect.left - bleed}px`;
    mediaLayer.style.top = `${mediaRect.top - linkRect.top - bleed}px`;
    mediaLayer.style.width = `${mediaRect.width + bleed * 2}px`;
    mediaLayer.style.height = `${mediaRect.height + bleed * 2}px`;
    mediaLayer.style.backgroundImage = mediaStyle.backgroundImage;
    mediaLayer.style.backgroundPosition = mediaStyle.backgroundPosition;
    mediaLayer.style.backgroundSize = mediaStyle.backgroundSize;
    mediaLayer.style.backgroundRepeat = mediaStyle.backgroundRepeat;
    mediaLayer.style.filter = "saturate(.96) brightness(.96) contrast(1.04)";
    mediaLayer.style.transform = "translate3d(0,0,0) scale(1)";
    mediaLayer.style.transformOrigin = "center center";
    mediaLayer.style.willChange =
      "left, top, width, height, transform, filter, opacity";
    mediaLayer.style.backfaceVisibility = "hidden";
    mediaLayer.style.borderRadius = "inherit";

    const mediaShade = document.createElement("div");
    mediaShade.setAttribute("aria-hidden", "true");
    mediaShade.style.position = "absolute";
    mediaShade.style.inset = "0";
    mediaShade.style.background = [
      "linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.22))",
      "radial-gradient(circle at center, rgba(201,178,143,.12), transparent 46%)"
    ].join(", ");
    mediaShade.style.opacity = "1";
    mediaShade.style.transform = "scale(1)";
    mediaShade.style.transition =
      "opacity 460ms cubic-bezier(.16,1,.30,1), transform 760ms cubic-bezier(.16,1,.30,1)";

    mediaLayer.appendChild(mediaShade);

    const shellGlow = document.createElement("div");
    shellGlow.setAttribute("aria-hidden", "true");
    shellGlow.style.position = "absolute";
    shellGlow.style.inset = "0";
    shellGlow.style.pointerEvents = "none";
    shellGlow.style.opacity = mobile ? ".34" : ".44";
    shellGlow.style.background = [
      "radial-gradient(circle at top right, rgba(201,178,143,.20), transparent 28%)",
      "radial-gradient(circle at 50% 36%, rgba(255,255,255,.045), transparent 24%)",
      "linear-gradient(180deg, transparent 0%, rgba(3,3,3,.18) 38%, rgba(3,3,3,.78) 100%)"
    ].join(", ");
    shellGlow.style.transition =
      "opacity 560ms cubic-bezier(.16,1,.30,1), transform 760ms cubic-bezier(.16,1,.30,1)";

    const caption = document.createElement("div");
    caption.setAttribute("aria-hidden", "true");
    caption.style.position = "absolute";
    caption.style.left = "0";
    caption.style.right = "0";
    caption.style.bottom = "0";
    caption.style.padding = mobile ? "22px 18px 16px" : "30px 26px 24px";
    caption.style.background =
      "linear-gradient(180deg, transparent 0%, rgba(4,4,4,.62) 34%, rgba(4,4,4,.96) 100%)";
    caption.style.transition =
      "opacity 420ms cubic-bezier(.16,1,.30,1), transform 560ms cubic-bezier(.16,1,.30,1), filter 560ms cubic-bezier(.16,1,.30,1)";
    caption.style.opacity = "1";
    caption.style.transform = "translate3d(0,0,0)";
    caption.style.filter = "blur(0)";
    caption.style.willChange = "opacity, transform, filter";

    if (kicker) {
      const captionKicker = document.createElement("div");
      captionKicker.textContent = kicker;
      captionKicker.style.color = "rgba(201,178,143,.94)";
      captionKicker.style.fontSize = mobile ? ".68rem" : ".74rem";
      captionKicker.style.letterSpacing = ".18em";
      captionKicker.style.textTransform = "uppercase";
      captionKicker.style.marginBottom = "10px";
      caption.appendChild(captionKicker);
    }

    const captionTitle = document.createElement("div");
    captionTitle.textContent = title;
    captionTitle.style.fontFamily = '"Cormorant Garamond", serif';
    captionTitle.style.fontWeight = "600";
    captionTitle.style.lineHeight = ".92";
    captionTitle.style.letterSpacing = "-.01em";
    captionTitle.style.fontSize = mobile ? "2.1rem" : "3rem";
    captionTitle.style.color = "#f2ece3";
    captionTitle.style.maxWidth = "14ch";
    caption.appendChild(captionTitle);

    const centerTitle = document.createElement("div");
    centerTitle.setAttribute("aria-hidden", "true");
    centerTitle.style.position = "absolute";
    centerTitle.style.left = "50%";
    centerTitle.style.top = mobile ? "45%" : "42%";
    centerTitle.style.transform = "translate3d(-50%,22px,0) scale(.92)";
    centerTitle.style.width = mobile ? "88vw" : "min(72vw, 980px)";
    centerTitle.style.textAlign = "center";
    centerTitle.style.opacity = "0";
    centerTitle.style.filter = "blur(18px)";
    centerTitle.style.transition =
      "opacity 560ms cubic-bezier(.16,1,.30,1), transform 820ms cubic-bezier(.16,1,.30,1), filter 820ms cubic-bezier(.16,1,.30,1)";
    centerTitle.style.willChange = "opacity, transform, filter";
    centerTitle.style.pointerEvents = "none";
    centerTitle.style.textShadow =
      "0 18px 54px rgba(0,0,0,.56), 0 2px 12px rgba(0,0,0,.28)";

    const centerTitleText = document.createElement("div");
    centerTitleText.textContent = title;
    centerTitleText.style.fontFamily = '"Cormorant Garamond", serif';
    centerTitleText.style.fontWeight = "600";
    centerTitleText.style.lineHeight = ".89";
    centerTitleText.style.letterSpacing = "-.025em";
    centerTitleText.style.fontSize = mobile
      ? "clamp(2.2rem, 9vw, 3.5rem)"
      : "clamp(3.8rem, 6.8vw, 6.4rem)";
    centerTitleText.style.color = "#f2ece3";

    centerTitle.appendChild(centerTitleText);

    shell.appendChild(mediaLayer);
    shell.appendChild(shellGlow);
    shell.appendChild(centerTitle);
    shell.appendChild(caption);

    document.body.appendChild(shell);

    cinematicZoomClone = {
      shell,
      mediaLayer,
      mediaShade,
      shellGlow,
      caption,
      centerTitle
    };

    return cinematicZoomClone;
  }

  function applyCinematicShellState(sourceLink) {
    const header = document.querySelector(".site-header");
    const main = document.querySelector("main");
    const floatingTools = document.querySelector(".floating-tools");
    const footer = document.querySelector(".site-footer");

    cinematicShellSnapshot = [];

    snapshotAndStyleElement(header, {
      transition:
        "opacity 520ms cubic-bezier(.16,1,.30,1), transform 520ms cubic-bezier(.16,1,.30,1), filter 520ms cubic-bezier(.16,1,.30,1)",
      opacity: "0",
      transform: "translateY(-16px) scale(.982)",
      filter: "blur(5px)",
      pointerEvents: "none"
    });

    snapshotAndStyleElement(main, {
      transition:
        "opacity 560ms cubic-bezier(.16,1,.30,1), transform 560ms cubic-bezier(.16,1,.30,1), filter 560ms cubic-bezier(.16,1,.30,1)",
      opacity: ".05",
      transform: "scale(.972)",
      filter: "blur(5px)",
      pointerEvents: "none"
    });

    snapshotAndStyleElement(floatingTools, {
      transition:
        "opacity 340ms cubic-bezier(.16,1,.30,1), transform 340ms cubic-bezier(.16,1,.30,1)",
      opacity: "0",
      transform: "translateY(14px)",
      pointerEvents: "none"
    });

    snapshotAndStyleElement(footer, {
      transition:
        "opacity 460ms cubic-bezier(.16,1,.30,1), transform 460ms cubic-bezier(.16,1,.30,1), filter 460ms cubic-bezier(.16,1,.30,1)",
      opacity: ".03",
      transform: "scale(.978)",
      filter: "blur(5px)",
      pointerEvents: "none"
    });

    snapshotAndStyleElement(sourceLink, {
      transition: "opacity 180ms ease",
      opacity: "0",
      pointerEvents: "none"
    });
  }

  function clearGenericMobileVeil() {
    if (genericMobileVeil?.veil?.parentNode) {
      genericMobileVeil.veil.parentNode.removeChild(genericMobileVeil.veil);
    }

    genericMobileVeil = null;
  }

  function clearSpecialCinematicTransition() {
    clearCinematicTimers();

    if (cinematicZoomClone?.shell?.parentNode) {
      cinematicZoomClone.shell.parentNode.removeChild(cinematicZoomClone.shell);
    }

    if (cinematicZoomVeil?.parentNode) {
      cinematicZoomVeil.parentNode.removeChild(cinematicZoomVeil);
    }

    cinematicZoomClone = null;
    cinematicZoomVeil = null;

    clearGenericMobileVeil();
    clearCinematicShellState();

    if (document.body) {
      document.body.classList.remove("cinematic-transition-active");
    }

    notifyCinematicTransitionChange(false, "clear");
  }

  function runGenericMobileCinematicTransition(link) {
    if (!(link instanceof HTMLAnchorElement)) return;
    if (transitionLocked) return;

    transitionLocked = true;

    closeMobileMenuIfOpen();
    triggerHapticFeedback("light");

    writeCinematicArrivalState(
      link,
      MOBILE_CINEMATIC_LINK_TRANSITION_DURATION,
      "mobile-cinematic-link"
    );

    cachePageTransitionElement();

    if (pageTransition) {
      pageTransition.classList.add(PAGE_TRANSITION_ACTIVE_CLASS);
    }

    document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY] = "minimal";

    const body = getBody();
    if (body) {
      body.classList.add("cinematic-transition-active");
    }

    notifyCinematicTransitionChange(true, "mobile-link");

    const veilBundle = createGenericMobileNavigationVeil(link);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!veilBundle) return;

        veilBundle.veil.style.opacity = "1";

        if (veilBundle.sweep) {
          veilBundle.sweep.style.opacity = ".92";
          veilBundle.sweep.style.transform =
            "translate3d(22%,0,0) skewX(-12deg)";
        }

        if (veilBundle.titleWrap) {
          veilBundle.titleWrap.style.opacity = ".96";
          veilBundle.titleWrap.style.transform =
            "translate3d(-50%,0,0) scale(1)";
          veilBundle.titleWrap.style.filter = "blur(0)";
        }
      });
    });

    queueCinematicTimer(() => {
      window.location.href = link.href;
    }, MOBILE_CINEMATIC_LINK_NAVIGATION_DELAY);
  }

  function runSpecialCinematicCardTransition(link) {
    if (!(link instanceof HTMLAnchorElement)) return;
    if (transitionLocked) return;

    const sourceMedia = link.querySelector(".project-media");
    if (!(sourceMedia instanceof HTMLElement)) {
      window.location.href = link.href;
      return;
    }

    transitionLocked = true;

    const duration = getCinematicDuration();
    const bleed = getCinematicMediaBleed();
    const shellScale = getCinematicShellScale();
    const mediaTargetScale = getCinematicMediaTargetScale();
    const mediaFinalScale = getCinematicMediaFinalScale();

    writeCinematicArrivalState(link, duration, "cinematic-card");
    triggerHapticFeedback("firm");

    document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY] = "cinematic";

    const body = getBody();
    if (body) {
      body.classList.add("cinematic-transition-active");
    }

    notifyCinematicTransitionChange(true, "card");

    const veilBundle = createCinematicVeil();
    const cloneBundle = createCinematicZoomClone(link);

    if (!cloneBundle) {
      notifyCinematicTransitionChange(false, "card");
      transitionLocked = false;
      window.location.href = link.href;
      return;
    }

    applyCinematicShellState(link);

    const { veil, sweep, flash, topShutter, bottomShutter } = veilBundle;
    const {
      shell,
      mediaLayer,
      mediaShade,
      shellGlow,
      caption,
      centerTitle
    } = cloneBundle;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        veil.style.opacity = "1";

        if (sweep) {
          sweep.style.opacity = ".98";
          sweep.style.transform = "translate3d(28%,0,0) skewX(-10deg)";
        }

        if (topShutter) {
          topShutter.style.opacity = "1";
          topShutter.style.transform = "translate3d(0,0,0)";
        }

        if (bottomShutter) {
          bottomShutter.style.opacity = "1";
          bottomShutter.style.transform = "translate3d(0,0,0)";
        }

        if (flash) {
          flash.style.opacity = ".42";
          queueCinematicTimer(() => {
            if (flash) {
              flash.style.opacity = "0";
            }
          }, 180);
        }

        shell.style.transition = [
          `left ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `top ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `width ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `height ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `border-radius ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `transform ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `box-shadow ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `opacity ${duration}ms cubic-bezier(.12,1,.28,1)`
        ].join(", ");

        mediaLayer.style.transition = [
          `left ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `top ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `width ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `height ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `transform ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `filter ${duration}ms cubic-bezier(.12,1,.28,1)`,
          `opacity ${duration}ms cubic-bezier(.12,1,.28,1)`
        ].join(", ");

        shell.style.left = "0px";
        shell.style.top = "0px";
        shell.style.width = `${window.innerWidth}px`;
        shell.style.height = `${window.innerHeight}px`;
        shell.style.borderRadius = "0px";
        shell.style.transform = `translate3d(0,0,0) scale(${shellScale})`;
        shell.style.boxShadow = "0 0 0 rgba(0,0,0,0)";

        mediaLayer.style.left = `${-bleed}px`;
        mediaLayer.style.top = `${-bleed}px`;
        mediaLayer.style.width = `${window.innerWidth + bleed * 2}px`;
        mediaLayer.style.height = `${window.innerHeight + bleed * 2}px`;
        mediaLayer.style.transform = `translate3d(0,0,0) scale(${mediaTargetScale})`;
        mediaLayer.style.filter =
          "saturate(1.10) brightness(.68) contrast(1.10)";

        if (mediaShade) {
          mediaShade.style.opacity = ".98";
          mediaShade.style.transform = "scale(1.07)";
        }

        if (shellGlow) {
          shellGlow.style.opacity = ".68";
          shellGlow.style.transform = "scale(1.04)";
        }

        if (caption) {
          caption.style.opacity = "0";
          caption.style.transform = "translate3d(0,40px,0) scale(.95)";
          caption.style.filter = "blur(18px)";
        }
      });
    });

    queueCinematicTimer(() => {
      if (centerTitle) {
        centerTitle.style.opacity = ".98";
        centerTitle.style.transform = "translate3d(-50%,0,0) scale(1)";
        centerTitle.style.filter = "blur(0)";
      }
    }, Math.round(duration * 0.16));

    queueCinematicTimer(() => {
      if (mediaLayer) {
        mediaLayer.style.transition =
          `transform ${Math.round(duration * 0.36)}ms cubic-bezier(.12,1,.28,1), ` +
          `filter ${Math.round(duration * 0.36)}ms cubic-bezier(.12,1,.28,1)`;

        mediaLayer.style.transform = `translate3d(0,0,0) scale(${mediaFinalScale})`;
        mediaLayer.style.filter =
          "saturate(1.14) brightness(.60) contrast(1.12)";
      }

      if (mediaShade) {
        mediaShade.style.opacity = "1";
        mediaShade.style.transform = "scale(1.10)";
      }

      if (shellGlow) {
        shellGlow.style.opacity = ".78";
        shellGlow.style.transform = "scale(1.06)";
      }
    }, Math.round(duration * 0.40));

    queueCinematicTimer(() => {
      if (centerTitle) {
        centerTitle.style.transition =
          `opacity ${Math.round(duration * 0.18)}ms ease, ` +
          `transform ${Math.round(duration * 0.18)}ms ease, ` +
          `filter ${Math.round(duration * 0.18)}ms ease`;

        centerTitle.style.opacity = "0";
        centerTitle.style.transform =
          "translate3d(-50%,-14px,0) scale(1.04)";
        centerTitle.style.filter = "blur(14px)";
      }
    }, Math.round(duration * 0.70));

    queueCinematicTimer(() => {
      window.location.href = link.href;
    }, Math.max(260, duration - CINEMATIC_NAVIGATION_OFFSET));
  }

  function activatePageTransition(mode = null) {
    cachePageTransitionElement();

    if (!pageTransition || transitionLocked) return;

    transitionLocked = true;
    pageTransition.classList.add(PAGE_TRANSITION_ACTIVE_CLASS);

    document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY] =
      mode || (shouldUseMinimalTransition() ? "minimal" : "active");
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

  function prepareStandardCinematicArrival(link) {
    if (!(link instanceof HTMLAnchorElement)) return;
    if (!isCinematicModeEnabled()) return;
    if (isReducedMotionEnabled()) return;
    if (isSaveDataEnabled()) return;

    writeCinematicArrivalState(
      link,
      isMobileViewport()
        ? MOBILE_CINEMATIC_LINK_TRANSITION_DURATION
        : STANDARD_CINEMATIC_LINK_DURATION_DESKTOP,
      "standard-link"
    );
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

    if (shouldRunGenericMobileCinematicTransition(link, event)) {
      event.preventDefault();
      runGenericMobileCinematicTransition(link);
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

    closeMobileMenuIfOpen();
    prepareStandardCinematicArrival(link);
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
})();
