const PAGE_TRANSITION_ACTIVE_CLASS = "active";
const PAGE_TRANSITION_DATA_KEY = "pageTransition";
const MOBILE_BREAKPOINT = 760;

const CINEMATIC_HOME_PAGE = "home";
const CINEMATIC_CARD_SELECTOR = ".cinematic-entry-card[data-cinematic-entry]";
const CINEMATIC_CARD_KEYS = new Set(["rap-ort", "sztab"]);

const CINEMATIC_ZOOM_DURATION_DESKTOP = 1280;
const CINEMATIC_ZOOM_DURATION_MOBILE = 980;
const CINEMATIC_NAVIGATION_OFFSET = 90;
const CINEMATIC_ARRIVAL_STORAGE_KEY = "siteCinematicArrival";

let pageTransition = null;
let transitionLocked = false;
let pageTransitionInitialized = false;

let cinematicZoomClone = null;
let cinematicZoomVeil = null;
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

function writeCinematicArrivalState(link, duration) {
  if (!(link instanceof HTMLAnchorElement)) return;

  const payload = {
    href: link.href,
    key: (link.dataset.cinematicEntry || "").trim().toLowerCase(),
    title: getCardTitle(link),
    timestamp: Date.now(),
    duration,
    mobile: isMobileViewport()
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

/* ---------- CINEMATIC CARD TRANSITION ---------- */

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

function getCinematicDuration() {
  return isMobileViewport()
    ? CINEMATIC_ZOOM_DURATION_MOBILE
    : CINEMATIC_ZOOM_DURATION_DESKTOP;
}

function getCardTitle(link) {
  const heading = link.querySelector("h3");
  const title =
    (link.dataset.trackTitle || heading?.textContent || "").trim();

  return title || "Entry";
}

function getCardKicker(link) {
  const chip = link.querySelector(".chip");
  const text = (chip?.textContent || "").trim();

  return text || "Audiovisual World";
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
  veil.style.overflow = "hidden";
  veil.style.background = [
    "radial-gradient(circle at 50% 18%, rgba(255,255,255,.05), transparent 14%)",
    "radial-gradient(circle at 50% 34%, rgba(201,178,143,.24), transparent 22%)",
    "radial-gradient(circle at 50% 56%, rgba(201,178,143,.16), transparent 42%)",
    "linear-gradient(180deg, rgba(3,3,3,.14), rgba(6,6,6,.42), rgba(9,9,9,.90))"
  ].join(", ");
  veil.style.transition = "opacity 420ms cubic-bezier(.22,1,.36,1)";

  const sweep = document.createElement("div");
  sweep.setAttribute("aria-hidden", "true");
  sweep.style.position = "absolute";
  sweep.style.inset = "-14% -34%";
  sweep.style.pointerEvents = "none";
  sweep.style.opacity = "0";
  sweep.style.transform = "translate3d(-20%,0,0)";
  sweep.style.mixBlendMode = "screen";
  sweep.style.background =
    "linear-gradient(110deg, transparent 0%, transparent 42%, rgba(255,255,255,.14) 50%, transparent 58%, transparent 100%)";
  sweep.style.transition =
    "opacity 560ms cubic-bezier(.22,1,.36,1), transform 1100ms cubic-bezier(.22,1,.36,1)";

  const flash = document.createElement("div");
  flash.setAttribute("aria-hidden", "true");
  flash.style.position = "absolute";
  flash.style.inset = "0";
  flash.style.pointerEvents = "none";
  flash.style.opacity = "0";
  flash.style.background =
    "radial-gradient(circle at 50% 42%, rgba(255,255,255,.14), transparent 22%)";
  flash.style.transition = "opacity 180ms ease";

  const topShutter = document.createElement("div");
  topShutter.setAttribute("aria-hidden", "true");
  topShutter.style.position = "absolute";
  topShutter.style.top = "0";
  topShutter.style.left = "0";
  topShutter.style.right = "0";
  topShutter.style.height = isMobileViewport() ? "9vh" : "11vh";
  topShutter.style.pointerEvents = "none";
  topShutter.style.opacity = "0";
  topShutter.style.transform = "translate3d(0,-104%,0)";
  topShutter.style.background =
    "linear-gradient(180deg, rgba(0,0,0,.96), rgba(0,0,0,.74), transparent)";
  topShutter.style.transition =
    "opacity 360ms cubic-bezier(.22,1,.36,1), transform 760ms cubic-bezier(.22,1,.36,1)";

  const bottomShutter = document.createElement("div");
  bottomShutter.setAttribute("aria-hidden", "true");
  bottomShutter.style.position = "absolute";
  bottomShutter.style.bottom = "0";
  bottomShutter.style.left = "0";
  bottomShutter.style.right = "0";
  bottomShutter.style.height = isMobileViewport() ? "12vh" : "15vh";
  bottomShutter.style.pointerEvents = "none";
  bottomShutter.style.opacity = "0";
  bottomShutter.style.transform = "translate3d(0,104%,0)";
  bottomShutter.style.background =
    "linear-gradient(0deg, rgba(0,0,0,.98), rgba(0,0,0,.78), transparent)";
  bottomShutter.style.transition =
    "opacity 360ms cubic-bezier(.22,1,.36,1), transform 820ms cubic-bezier(.22,1,.36,1)";

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

  const linkRect = sourceLink.getBoundingClientRect();
  const mediaRect = sourceMedia.getBoundingClientRect();
  const linkStyle = window.getComputedStyle(sourceLink);
  const mediaStyle = window.getComputedStyle(sourceMedia);

  const title = getCardTitle(sourceLink);
  const kicker = getCardKicker(sourceLink);

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
  shell.style.background =
    "linear-gradient(180deg, rgba(8,8,8,.95), rgba(5,5,5,.99))";
  shell.style.border = "1px solid rgba(255,255,255,.08)";
  shell.style.boxShadow = "0 48px 160px rgba(0,0,0,.52)";
  shell.style.transform = "translate3d(0,0,0) scale(1)";
  shell.style.transformOrigin = "center center";
  shell.style.willChange =
    "left, top, width, height, border-radius, transform, box-shadow, opacity";

  const mediaLayer = document.createElement("div");
  mediaLayer.setAttribute("aria-hidden", "true");
  mediaLayer.style.position = "absolute";
  mediaLayer.style.left = `${mediaRect.left - linkRect.left}px`;
  mediaLayer.style.top = `${mediaRect.top - linkRect.top}px`;
  mediaLayer.style.width = `${mediaRect.width}px`;
  mediaLayer.style.height = `${mediaRect.height}px`;
  mediaLayer.style.backgroundImage = mediaStyle.backgroundImage;
  mediaLayer.style.backgroundPosition = mediaStyle.backgroundPosition;
  mediaLayer.style.backgroundSize = mediaStyle.backgroundSize;
  mediaLayer.style.backgroundRepeat = mediaStyle.backgroundRepeat;
  mediaLayer.style.filter = "saturate(.94) brightness(.95) contrast(1.03)";
  mediaLayer.style.transform = "translate3d(0,0,0) scale(1)";
  mediaLayer.style.transformOrigin = "center center";
  mediaLayer.style.willChange =
    "left, top, width, height, transform, filter, opacity";

  const mediaShade = document.createElement("div");
  mediaShade.setAttribute("aria-hidden", "true");
  mediaShade.style.position = "absolute";
  mediaShade.style.inset = "0";
  mediaShade.style.background = [
    "linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.22))",
    "radial-gradient(circle at center, rgba(201,178,143,.10), transparent 46%)"
  ].join(", ");
  mediaShade.style.opacity = "1";
  mediaShade.style.transform = "scale(1)";
  mediaShade.style.transition =
    "opacity 460ms cubic-bezier(.22,1,.36,1), transform 760ms cubic-bezier(.22,1,.36,1)";

  mediaLayer.appendChild(mediaShade);

  const shellGlow = document.createElement("div");
  shellGlow.setAttribute("aria-hidden", "true");
  shellGlow.style.position = "absolute";
  shellGlow.style.inset = "0";
  shellGlow.style.pointerEvents = "none";
  shellGlow.style.opacity = ".44";
  shellGlow.style.background = [
    "radial-gradient(circle at top right, rgba(201,178,143,.18), transparent 28%)",
    "radial-gradient(circle at 50% 36%, rgba(255,255,255,.04), transparent 24%)",
    "linear-gradient(180deg, transparent 0%, rgba(3,3,3,.18) 38%, rgba(3,3,3,.76) 100%)"
  ].join(", ");
  shellGlow.style.transition =
    "opacity 520ms cubic-bezier(.22,1,.36,1), transform 760ms cubic-bezier(.22,1,.36,1)";

  const caption = document.createElement("div");
  caption.setAttribute("aria-hidden", "true");
  caption.style.position = "absolute";
  caption.style.left = "0";
  caption.style.right = "0";
  caption.style.bottom = "0";
  caption.style.padding = isMobileViewport() ? "24px 18px 18px" : "30px 26px 24px";
  caption.style.background =
    "linear-gradient(180deg, transparent 0%, rgba(4,4,4,.62) 34%, rgba(4,4,4,.96) 100%)";
  caption.style.transition =
    "opacity 420ms cubic-bezier(.22,1,.36,1), transform 520ms cubic-bezier(.22,1,.36,1), filter 520ms cubic-bezier(.22,1,.36,1)";
  caption.style.opacity = "1";
  caption.style.transform = "translate3d(0,0,0)";
  caption.style.filter = "blur(0)";
  caption.style.willChange = "opacity, transform, filter";

  const captionKicker = document.createElement("div");
  captionKicker.textContent = kicker;
  captionKicker.style.color = "rgba(201,178,143,.94)";
  captionKicker.style.fontSize = isMobileViewport() ? ".68rem" : ".74rem";
  captionKicker.style.letterSpacing = ".18em";
  captionKicker.style.textTransform = "uppercase";
  captionKicker.style.marginBottom = "10px";

  const captionTitle = document.createElement("div");
  captionTitle.textContent = title;
  captionTitle.style.fontFamily = '"Cormorant Garamond", serif';
  captionTitle.style.fontWeight = "600";
  captionTitle.style.lineHeight = ".92";
  captionTitle.style.letterSpacing = "-.01em";
  captionTitle.style.fontSize = isMobileViewport() ? "2.2rem" : "3rem";
  captionTitle.style.color = "#f2ece3";
  captionTitle.style.maxWidth = "14ch";

  const centerTitle = document.createElement("div");
  centerTitle.setAttribute("aria-hidden", "true");
  centerTitle.style.position = "absolute";
  centerTitle.style.left = "50%";
  centerTitle.style.top = isMobileViewport() ? "44%" : "42%";
  centerTitle.style.transform = "translate3d(-50%,18px,0) scale(.94)";
  centerTitle.style.width = isMobileViewport() ? "86vw" : "min(72vw, 980px)";
  centerTitle.style.textAlign = "center";
  centerTitle.style.opacity = "0";
  centerTitle.style.filter = "blur(16px)";
  centerTitle.style.transition =
    "opacity 520ms cubic-bezier(.22,1,.36,1), transform 760ms cubic-bezier(.22,1,.36,1), filter 760ms cubic-bezier(.22,1,.36,1)";
  centerTitle.style.willChange = "opacity, transform, filter";
  centerTitle.style.pointerEvents = "none";
  centerTitle.style.textShadow =
    "0 16px 42px rgba(0,0,0,.48), 0 2px 10px rgba(0,0,0,.24)";

  const centerTitleKicker = document.createElement("div");
  centerTitleKicker.textContent = kicker;
  centerTitleKicker.style.color = "rgba(201,178,143,.92)";
  centerTitleKicker.style.fontSize = isMobileViewport() ? ".70rem" : ".76rem";
  centerTitleKicker.style.letterSpacing = ".22em";
  centerTitleKicker.style.textTransform = "uppercase";
  centerTitleKicker.style.marginBottom = "14px";

  const centerTitleText = document.createElement("div");
  centerTitleText.textContent = title;
  centerTitleText.style.fontFamily = '"Cormorant Garamond", serif';
  centerTitleText.style.fontWeight = "600";
  centerTitleText.style.lineHeight = ".90";
  centerTitleText.style.letterSpacing = "-.02em";
  centerTitleText.style.fontSize = isMobileViewport()
    ? "clamp(2.2rem, 9vw, 3.6rem)"
    : "clamp(3.4rem, 6.4vw, 6rem)";
  centerTitleText.style.color = "#f2ece3";

  centerTitle.appendChild(centerTitleKicker);
  centerTitle.appendChild(centerTitleText);

  caption.appendChild(captionKicker);
  caption.appendChild(captionTitle);

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
      "opacity 480ms cubic-bezier(.22,1,.36,1), transform 480ms cubic-bezier(.22,1,.36,1), filter 480ms cubic-bezier(.22,1,.36,1)",
    opacity: "0",
    transform: "translateY(-14px) scale(.985)",
    filter: "blur(4px)",
    pointerEvents: "none"
  });

  snapshotAndStyleElement(main, {
    transition:
      "opacity 520ms cubic-bezier(.22,1,.36,1), transform 520ms cubic-bezier(.22,1,.36,1), filter 520ms cubic-bezier(.22,1,.36,1)",
    opacity: ".06",
    transform: "scale(.975)",
    filter: "blur(4px)",
    pointerEvents: "none"
  });

  snapshotAndStyleElement(floatingTools, {
    transition:
      "opacity 320ms cubic-bezier(.22,1,.36,1), transform 320ms cubic-bezier(.22,1,.36,1)",
    opacity: "0",
    transform: "translateY(12px)",
    pointerEvents: "none"
  });

  snapshotAndStyleElement(footer, {
    transition:
      "opacity 440ms cubic-bezier(.22,1,.36,1), transform 440ms cubic-bezier(.22,1,.36,1), filter 440ms cubic-bezier(.22,1,.36,1)",
    opacity: ".04",
    transform: "scale(.98)",
    filter: "blur(4px)",
    pointerEvents: "none"
  });

  snapshotAndStyleElement(sourceLink, {
    transition: "opacity 180ms ease",
    opacity: "0",
    pointerEvents: "none"
  });
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

  clearCinematicShellState();

  if (document.body) {
    document.body.classList.remove("cinematic-transition-active");
  }
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
  writeCinematicArrivalState(link, getCinematicDuration());

  document.documentElement.dataset[PAGE_TRANSITION_DATA_KEY] = "cinematic";

  if (document.body) {
    document.body.classList.add("cinematic-transition-active");
  }

  const duration = getCinematicDuration();
  const veilBundle = createCinematicVeil();
  const cloneBundle = createCinematicZoomClone(link);

  if (!cloneBundle) {
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
        sweep.style.opacity = ".96";
        sweep.style.transform = "translate3d(24%,0,0)";
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
        flash.style.opacity = ".38";
        queueCinematicTimer(() => {
          if (flash) {
            flash.style.opacity = "0";
          }
        }, 180);
      }

      shell.style.transition = [
        `left ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `top ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `width ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `height ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `border-radius ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `transform ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `box-shadow ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `opacity ${duration}ms cubic-bezier(.16,1,.30,1)`
      ].join(", ");

      mediaLayer.style.transition = [
        `left ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `top ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `width ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `height ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `transform ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `filter ${duration}ms cubic-bezier(.16,1,.30,1)`,
        `opacity ${duration}ms cubic-bezier(.16,1,.30,1)`
      ].join(", ");

      shell.style.left = "0px";
      shell.style.top = "0px";
      shell.style.width = `${window.innerWidth}px`;
      shell.style.height = `${window.innerHeight}px`;
      shell.style.borderRadius = "0px";
      shell.style.transform = "translate3d(0,0,0) scale(1.022)";
      shell.style.boxShadow = "0 0 0 rgba(0,0,0,0)";

      mediaLayer.style.left = "0px";
      mediaLayer.style.top = "0px";
      mediaLayer.style.width = `${window.innerWidth}px`;
      mediaLayer.style.height = `${window.innerHeight}px`;
      mediaLayer.style.transform = "translate3d(0,0,0) scale(1.12)";
      mediaLayer.style.filter = "saturate(1.08) brightness(.70) contrast(1.08)";

      if (mediaShade) {
        mediaShade.style.opacity = ".98";
        mediaShade.style.transform = "scale(1.06)";
      }

      if (shellGlow) {
        shellGlow.style.opacity = ".66";
        shellGlow.style.transform = "scale(1.03)";
      }

      if (caption) {
        caption.style.opacity = "0";
        caption.style.transform = "translate3d(0,34px,0) scale(.96)";
        caption.style.filter = "blur(16px)";
      }
    });
  });

  queueCinematicTimer(() => {
    if (centerTitle) {
      centerTitle.style.opacity = ".96";
      centerTitle.style.transform = "translate3d(-50%,0,0) scale(1)";
      centerTitle.style.filter = "blur(0)";
    }
  }, Math.round(duration * 0.18));

  queueCinematicTimer(() => {
    if (mediaLayer) {
      mediaLayer.style.transition =
        `transform ${Math.round(duration * 0.34)}ms cubic-bezier(.16,1,.30,1), ` +
        `filter ${Math.round(duration * 0.34)}ms cubic-bezier(.16,1,.30,1)`;

      mediaLayer.style.transform = "translate3d(0,0,0) scale(1.18)";
      mediaLayer.style.filter = "saturate(1.12) brightness(.64) contrast(1.10)";
    }

    if (mediaShade) {
      mediaShade.style.opacity = "1";
      mediaShade.style.transform = "scale(1.09)";
    }
  }, Math.round(duration * 0.42));

  queueCinematicTimer(() => {
    if (centerTitle) {
      centerTitle.style.transition =
        `opacity ${Math.round(duration * 0.16)}ms ease, ` +
        `transform ${Math.round(duration * 0.16)}ms ease, ` +
        `filter ${Math.round(duration * 0.16)}ms ease`;

      centerTitle.style.opacity = "0";
      centerTitle.style.transform = "translate3d(-50%,-10px,0) scale(1.03)";
      centerTitle.style.filter = "blur(12px)";
    }
  }, Math.round(duration * 0.68));

  queueCinematicTimer(() => {
    window.location.href = link.href;
  }, Math.max(220, duration - CINEMATIC_NAVIGATION_OFFSET));
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
