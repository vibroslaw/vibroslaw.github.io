(() => {
  "use strict";

  if (window.__siteWorldTransitionsInitialized) {
    return;
  }
  window.__siteWorldTransitionsInitialized = true;

  const STORAGE_KEY = "siteCinematicArrival";
  const MOBILE_BREAKPOINT = 760;
  const DURATION = 1240;
  const NAVIGATION_OFFSET = 130;
  const WORLD_SELECTOR = [
    ".project-map-card[href]",
    ".work-card[href]",
    ".recognition-card[href]",
    ".institution-card[href]",
    ".cinematic-entry-card[href]",
    ".track-link[href]",
    ".nav-button[href]",
    ".btn[href]"
  ].join(", ");
  const MEDIA_SELECTOR = ".project-media, .chapter-media, .hero-image";
  const WORLD_PATHS = new Set([
    "/rap-ort",
    "/rap-ort/prawda-sumienia",
    "/rap-ort/conscience-report",
    "/sztab",
    "/sztab/original",
    "/sztab/original/zo",
    "/sztab/battles",
    "/sztab/forgotten",
    "/music-works",
    "/for-institutions",
    "/press-recognition",
    "/authorial-profile"
  ]);
  const WORLD_IMAGES = {
    "/rap-ort": "url('/assets/images/hero-raport-main.jpg')",
    "/rap-ort/prawda-sumienia": "url('/assets/images/hero-prawda-sumienia-main.jpg')",
    "/rap-ort/conscience-report": "url('/assets/images/hero-raport-main.jpg')",
    "/sztab": "url('/assets/images/hero-sztab-main.jpg')",
    "/sztab/original": "url('/assets/images/hero-sztab-main.jpg')",
    "/sztab/original/zo": "url('/assets/images/hero-sztab-main.jpg')",
    "/sztab/battles": "url('/assets/images/hero-sztab-main.jpg')",
    "/sztab/forgotten": "url('/assets/images/hero-sztab-main.jpg')",
    "/music-works": "url('/assets/images/hero-sztab-main.jpg')",
    "/for-institutions": "url('/assets/images/hero-raport-main.jpg')",
    "/press-recognition": "url('/assets/images/hero-prawda-sumienia-main.jpg')",
    "/authorial-profile": "url('/assets/images/hero-main.jpg')"
  };
  const WORLD_LABELS = {
    "/rap-ort": "Institutional audiovisual world",
    "/sztab": "Historical memory music world",
    "/music-works": "Music / Works",
    "/for-institutions": "Institutional context",
    "/press-recognition": "Press / Recognition",
    "/authorial-profile": "Author"
  };

  let locked = false;
  let activeNodes = [];
  let activeTimers = [];

  function normalizePath(path) {
    return (path || "").replace(/\/+$/, "") || "/";
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function isCinematicModeEnabled() {
    return document.body?.classList.contains("cinematic-mode") === true;
  }

  function isReducedMotionEnabled() {
    if (
      document.body?.classList.contains("reduced-motion") ||
      document.body?.classList.contains("reduce-motion")
    ) {
      return true;
    }

    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }

  function isSaveDataEnabled() {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return Boolean(connection?.saveData);
  }

  function hasModifierKey(event) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  }

  function getUrl(link) {
    try {
      return new URL(link.href, window.location.origin);
    } catch (error) {
      return null;
    }
  }

  function isSameLocation(url) {
    return (
      normalizePath(url.pathname) === normalizePath(window.location.pathname) &&
      url.search === window.location.search
    );
  }

  function canHandleLink(link, event) {
    if (!(link instanceof HTMLAnchorElement)) return false;
    if (!link.matches(WORLD_SELECTOR)) return false;
    if (!isCinematicModeEnabled()) return false;
    if (isReducedMotionEnabled()) return false;
    if (isSaveDataEnabled()) return false;
    if (isMobileViewport()) return false;
    if (event.defaultPrevented || event.button !== 0 || hasModifierKey(event)) return false;
    if (link.target === "_blank") return false;
    if (link.hasAttribute("download") || link.hasAttribute("data-no-transition")) return false;

    const rawHref = (link.getAttribute("href") || "").trim();
    if (!rawHref || rawHref === "#" || rawHref.startsWith("#")) return false;
    if (/^(mailto|tel|javascript):/i.test(rawHref)) return false;

    const url = getUrl(link);
    if (!url || url.origin !== window.location.origin || isSameLocation(url)) return false;

    return WORLD_PATHS.has(normalizePath(url.pathname));
  }

  function getTitle(link) {
    return (
      link.dataset.trackTitle?.trim() ||
      link.getAttribute("aria-label")?.trim() ||
      link.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
      link.textContent.replace(/\s+/g, " ").trim() ||
      "World"
    );
  }

  function getKey(link) {
    const explicit = link.dataset.cinematicEntry?.trim().toLowerCase();
    if (explicit) return explicit;

    const url = getUrl(link);
    if (!url) return "world";

    const parts = normalizePath(url.pathname).split("/").filter(Boolean);
    return parts[parts.length - 1] || "world";
  }

  function getPath(link) {
    const url = getUrl(link);
    return url ? normalizePath(url.pathname) : "/";
  }

  function getWorldImage(link, media) {
    if (media instanceof HTMLElement) {
      const mediaStyle = window.getComputedStyle(media);
      if (mediaStyle.backgroundImage && mediaStyle.backgroundImage !== "none") {
        return mediaStyle.backgroundImage;
      }
    }

    const cardStyle = window.getComputedStyle(link);
    const customImage = cardStyle.getPropertyValue("--entry-image").trim();
    if (customImage) return customImage;

    return WORLD_IMAGES[getPath(link)] || "url('/assets/images/hero-main.jpg')";
  }

  function getWorldLabel(link) {
    return link.dataset.cinematicLabel?.trim() || WORLD_LABELS[getPath(link)] || "World entry";
  }

  function saveArrivalPayload(link) {
    const payload = {
      href: link.href,
      key: getKey(link),
      title: getTitle(link),
      timestamp: Date.now(),
      duration: DURATION,
      mobile: false,
      source: "world-entry"
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      /* silent fallback */
    }
  }

  function queue(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    activeTimers.push(timer);
    return timer;
  }

  function clearActiveNodes() {
    activeTimers.forEach((timer) => window.clearTimeout(timer));
    activeTimers = [];
    activeNodes.forEach((node) => node.parentNode?.removeChild(node));
    activeNodes = [];
  }

  function dispatchTransitionState(active) {
    document.body?.classList.toggle("cinematic-transition-active", active);
    document.documentElement.dataset.pageTransition = active ? "cinematic" : "";
    if (!active) {
      delete document.documentElement.dataset.pageTransition;
    }

    document.dispatchEvent(
      new CustomEvent(active ? "site:cinematic-transition-start" : "site:cinematic-transition-end", {
        detail: { active, source: "world-entry" }
      })
    );
  }

  function runWhenViewTransitionReady(callback) {
    if (typeof document.startViewTransition !== "function") {
      callback();
      return;
    }

    try {
      const transition = document.startViewTransition(() => {});
      transition.ready.then(callback).catch(callback);
    } catch (error) {
      callback();
    }
  }

  function createVeil() {
    const veil = document.createElement("div");
    veil.setAttribute("aria-hidden", "true");
    veil.className = "world-entry-veil";
    veil.style.position = "fixed";
    veil.style.inset = "0";
    veil.style.zIndex = "10018";
    veil.style.pointerEvents = "none";
    veil.style.opacity = "0";
    veil.style.background = [
      "radial-gradient(circle at 50% 18%, rgba(201,178,143,.18), transparent 22%)",
      "radial-gradient(circle at 50% 54%, rgba(255,255,255,.045), transparent 28%)",
      "linear-gradient(180deg, rgba(3,3,3,.18), rgba(3,3,3,.72), rgba(2,2,2,.98))"
    ].join(", ");
    veil.style.backdropFilter = "blur(7px)";
    veil.style.transition = "opacity 520ms cubic-bezier(.16,1,.30,1)";
    document.body.appendChild(veil);
    activeNodes.push(veil);
    return veil;
  }

  function getInitialRect(link, media) {
    const linkRect = link.getBoundingClientRect();
    const mediaRect = media instanceof HTMLElement ? media.getBoundingClientRect() : linkRect;
    const compact = !(media instanceof HTMLElement) && linkRect.width < 190 && linkRect.height < 92;

    if (!compact) {
      return linkRect;
    }

    const width = Math.min(window.innerWidth - 36, 340);
    const height = Math.min(window.innerHeight - 36, 204);

    return {
      left: Math.min(Math.max(mediaRect.left + mediaRect.width / 2 - width / 2, 18), Math.max(18, window.innerWidth - width - 18)),
      top: Math.min(Math.max(mediaRect.top + mediaRect.height / 2 - height / 2, 18), Math.max(18, window.innerHeight - height - 18)),
      width,
      height,
      right: 0,
      bottom: 0
    };
  }

  function createWorldClone(link) {
    const media = link.querySelector(MEDIA_SELECTOR);
    const rect = getInitialRect(link, media);
    const style = window.getComputedStyle(link);
    const image = getWorldImage(link, media);
    const title = getTitle(link);
    const label = getWorldLabel(link);

    const shell = document.createElement("div");
    shell.setAttribute("aria-hidden", "true");
    shell.className = "world-entry-clone";
    shell.style.position = "fixed";
    shell.style.left = `${rect.left}px`;
    shell.style.top = `${rect.top}px`;
    shell.style.width = `${rect.width}px`;
    shell.style.height = `${rect.height}px`;
    shell.style.zIndex = "10020";
    shell.style.overflow = "hidden";
    shell.style.pointerEvents = "none";
    shell.style.borderRadius = style.borderRadius || "24px";
    shell.style.background = "#050505";
    shell.style.border = "1px solid rgba(201,178,143,.18)";
    shell.style.boxShadow = "0 46px 150px rgba(0,0,0,.54)";
    shell.style.transform = "translate3d(0,0,0) scale(1)";
    shell.style.transformOrigin = "center center";
    shell.style.willChange = "left, top, width, height, border-radius, transform, opacity";
    shell.style.contain = "layout paint style";
    shell.style.isolation = "isolate";

    const imageLayer = document.createElement("div");
    imageLayer.style.position = "absolute";
    imageLayer.style.inset = "-14px";
    imageLayer.style.backgroundImage = image;
    imageLayer.style.backgroundPosition = "center";
    imageLayer.style.backgroundSize = "cover";
    imageLayer.style.backgroundRepeat = "no-repeat";
    imageLayer.style.filter = "saturate(.96) contrast(1.06) brightness(.82)";
    imageLayer.style.transform = "scale(1.015)";
    imageLayer.style.transformOrigin = "center";
    imageLayer.style.willChange = "transform, filter, opacity";

    const shade = document.createElement("div");
    shade.style.position = "absolute";
    shade.style.inset = "0";
    shade.style.background = [
      "linear-gradient(90deg, rgba(3,3,3,.80), rgba(3,3,3,.18), rgba(3,3,3,.72))",
      "linear-gradient(180deg, rgba(3,3,3,.06), rgba(3,3,3,.88))",
      "radial-gradient(circle at 50% 34%, rgba(201,178,143,.18), transparent 34%)"
    ].join(", ");
    shade.style.opacity = ".86";

    const caption = document.createElement("div");
    caption.style.position = "absolute";
    caption.style.left = "0";
    caption.style.right = "0";
    caption.style.bottom = "0";
    caption.style.padding = "30px 28px 24px";
    caption.style.background = "linear-gradient(180deg, transparent, rgba(3,3,3,.82))";

    const kicker = document.createElement("div");
    kicker.textContent = label;
    kicker.style.color = "rgba(201,178,143,.92)";
    kicker.style.fontSize = ".72rem";
    kicker.style.letterSpacing = ".16em";
    kicker.style.textTransform = "uppercase";
    kicker.style.marginBottom = "10px";

    const heading = document.createElement("div");
    heading.textContent = title;
    heading.style.fontFamily = '"Cormorant Garamond", serif';
    heading.style.fontSize = "clamp(2.4rem, 4.8vw, 4.9rem)";
    heading.style.fontWeight = "600";
    heading.style.lineHeight = ".9";
    heading.style.letterSpacing = "0";
    heading.style.color = "#f2ece3";
    heading.style.textShadow = "0 18px 56px rgba(0,0,0,.62)";

    caption.append(kicker, heading);
    shell.append(imageLayer, shade, caption);
    document.body.appendChild(shell);
    activeNodes.push(shell);

    return { shell, imageLayer, shade, caption };
  }

  function navigate(link) {
    window.location.href = link.href;
  }

  function runWorldEntry(link) {
    if (locked) return;
    locked = true;
    clearActiveNodes();
    saveArrivalPayload(link);
    dispatchTransitionState(true);

    const veil = createVeil();
    const clone = createWorldClone(link);

    runWhenViewTransitionReady(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          veil.style.opacity = "1";

          clone.shell.style.transition = [
            `left ${DURATION}ms cubic-bezier(.12,1,.28,1)`,
            `top ${DURATION}ms cubic-bezier(.12,1,.28,1)`,
            `width ${DURATION}ms cubic-bezier(.12,1,.28,1)`,
            `height ${DURATION}ms cubic-bezier(.12,1,.28,1)`,
            `border-radius ${DURATION}ms cubic-bezier(.12,1,.28,1)`,
            `transform ${DURATION}ms cubic-bezier(.12,1,.28,1)`,
            `box-shadow ${DURATION}ms cubic-bezier(.12,1,.28,1)`
          ].join(", ");
          clone.imageLayer.style.transition =
            `transform ${DURATION}ms cubic-bezier(.12,1,.28,1), filter ${DURATION}ms cubic-bezier(.12,1,.28,1)`;
          clone.shade.style.transition = `opacity ${DURATION}ms cubic-bezier(.16,1,.30,1)`;
          clone.caption.style.transition =
            `opacity ${Math.round(DURATION * .34)}ms cubic-bezier(.16,1,.30,1), transform ${Math.round(DURATION * .34)}ms cubic-bezier(.16,1,.30,1), filter ${Math.round(DURATION * .34)}ms cubic-bezier(.16,1,.30,1)`;

          clone.shell.style.left = "0px";
          clone.shell.style.top = "0px";
          clone.shell.style.width = `${window.innerWidth}px`;
          clone.shell.style.height = `${window.innerHeight}px`;
          clone.shell.style.borderRadius = "0px";
          clone.shell.style.transform = "scale(1.014)";
          clone.shell.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
          clone.imageLayer.style.transform = "scale(1.095)";
          clone.imageLayer.style.filter = "saturate(1.04) contrast(1.10) brightness(.62)";
          clone.shade.style.opacity = "1";
          clone.caption.style.opacity = "0";
          clone.caption.style.transform = "translate3d(0,34px,0)";
          clone.caption.style.filter = "blur(12px)";
        });
      });
    });

    queue(() => navigate(link), Math.max(260, DURATION - NAVIGATION_OFFSET));
  }

  function handleClick(event) {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a[href]");
    if (!canHandleLink(link, event)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    runWorldEntry(link);
  }

  window.addEventListener("pagehide", clearActiveNodes);
  window.addEventListener("pageshow", () => {
    locked = false;
    clearActiveNodes();
    dispatchTransitionState(false);
  });
  document.addEventListener("click", handleClick, true);
})();
