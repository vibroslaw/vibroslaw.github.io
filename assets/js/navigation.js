(() => {
  "use strict";

  const normalizePath = (value) => {
    if (!value) return "/";
    let pathname = String(value).split("#")[0].split("?")[0];
    if (!pathname.startsWith("/")) pathname = `/${pathname}`;
    pathname = pathname.replace(/\/index\.html$/i, "/");
    if (!pathname.endsWith("/")) pathname += "/";
    return pathname.replace(/\/+/g, "/");
  };

  const currentPath = normalizePath(window.location.pathname);
  const pageLang = (document.documentElement.lang || document.body?.dataset.lang || "").toLowerCase();
  const isPolish =
    pageLang === "pl" ||
    currentPath === "/pl/" ||
    currentPath.startsWith("/pl/") ||
    currentPath.endsWith("/pl/") ||
    currentPath === "/miedzy-wierszami/" ||
    currentPath === "/rap-ort/raport-swiadka/";

  const heroRoot = "/public/assets/heroes/";
  const heroAssets = {
    veritas: `${heroRoot}veritas-humanum-hero.webp`,
    raport: `${heroRoot}rap-ort-hero.webp`,
    prawda: `${heroRoot}prawda-sumienia-hero.webp`,
    guide: `${heroRoot}english-guide-hero.webp`,
    conscience: `${heroRoot}conscience-report-hero.webp`,
    witness: `${heroRoot}witness-report-hero.webp`,
    sztab: `${heroRoot}sztab-hero.webp`,
    between: `${heroRoot}between-the-lines-hero.webp`,
    music: `${heroRoot}music-hero.webp`,
    institutions: `${heroRoot}for-institutions-hero.webp`,
    press: `${heroRoot}press-recognition-hero.webp`,
    author: `${heroRoot}authorial-profile-hero.webp`,
    contact: `${heroRoot}contact-hero.webp`,
  };

  const heroForPath = (path) => {
    if (path === "/" || path === "/pl/") return heroAssets.veritas;
    if (path === "/rap-ort/" || path === "/rap-ort/pl/") return heroAssets.raport;
    if (path === "/rap-ort/prawda-sumienia/") return heroAssets.guide;
    if (path === "/rap-ort/prawda-sumienia/pl/") return heroAssets.prawda;
    if (path === "/rap-ort/conscience-report/") return heroAssets.conscience;
    if (path === "/rap-ort/witness-report/" || path === "/rap-ort/raport-swiadka/") return heroAssets.witness;
    if (path.startsWith("/sztab/")) return heroAssets.sztab;
    if (path === "/between-the-lines/" || path === "/miedzy-wierszami/") return heroAssets.between;
    if (path === "/music/" || path === "/music/pl/" || path.startsWith("/music-works/") || path === "/pl/music/") return heroAssets.music;
    if (path === "/for-institutions/" || path === "/for-institutions/pl/" || path === "/institutions/" || path === "/pl/institutions/") return heroAssets.institutions;
    if (path === "/press-recognition/" || path === "/press-recognition/pl/" || path === "/press/" || path === "/pl/press/") return heroAssets.press;
    if (path === "/authorial-profile/" || path === "/authorial-profile/pl/" || path === "/author/") return heroAssets.author;
    if (path === "/contact/" || path === "/contact/pl/") return heroAssets.contact;
    return heroAssets.veritas;
  };

  const finalHeroSrc = heroForPath(currentPath);

  const preloadFinalHero = () => {
    if (!finalHeroSrc || document.querySelector(`link[rel="preload"][href="${finalHeroSrc}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = finalHeroSrc;
    link.type = "image/webp";
    document.head.appendChild(link);
  };

  const setHeroElement = (element) => {
    if (!element || !finalHeroSrc) return;
    const cssUrl = `url("${finalHeroSrc.replace(/"/g, "%22")}")`;
    element.setAttribute("data-future-hero", finalHeroSrc);
    element.style.setProperty("--vh-hero-image", cssUrl);
    element.style.setProperty("--vh-final-hero-image", cssUrl);
    element.style.setProperty("--vh-hero-position", "center");
    element.classList.add("has-future-hero", "has-final-hero");
  };

  const applyFinalHeroAssets = () => {
    if (!finalHeroSrc) return;
    document.body.classList.add("final-hero-ready");
    document.body.dataset.finalHero = finalHeroSrc;
    document.documentElement.style.setProperty("--vh-page-hero-image", `url("${finalHeroSrc.replace(/"/g, "%22")}")`);
    document.querySelectorAll(".vh-hero-media").forEach(setHeroElement);
    preloadFinalHero();
  };

  const injectFinalHeroStyles = () => {
    document.getElementById("veritasFinalHeroLayer")?.remove();
    const style = document.createElement("style");
    style.id = "veritasFinalHeroLayer";
    style.textContent = `
      body.veritas-universe.final-hero-ready .vh-hero{isolation:isolate!important;overflow:hidden!important;background:#050403!important;}
      body.veritas-universe.final-hero-ready .vh-hero::after{content:""!important;position:absolute!important;left:clamp(18px,3vw,52px)!important;right:clamp(18px,3vw,52px)!important;bottom:clamp(18px,3vw,42px)!important;height:1px!important;background:linear-gradient(90deg,transparent,rgba(208,173,104,.44),rgba(241,234,219,.26),transparent)!important;opacity:.72!important;z-index:-1!important;}
      body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero{background-image:var(--vh-final-hero-image)!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;background-color:#050403!important;filter:none!important;}
      body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{content:""!important;position:absolute!important;inset:-7%!important;opacity:1!important;background-image:linear-gradient(90deg,rgba(5,4,3,.92) 0%,rgba(5,4,3,.68) 27%,rgba(5,4,3,.20) 56%,rgba(5,4,3,.48) 100%),linear-gradient(180deg,rgba(5,4,3,.42) 0%,rgba(5,4,3,.10) 38%,rgba(5,4,3,.94) 100%),radial-gradient(circle at 36% 22%,rgba(208,173,104,.25),transparent 32rem),var(--vh-final-hero-image)!important;background-size:cover,cover,cover,cover!important;background-position:center,center,center,center!important;background-repeat:no-repeat!important;transform:translate3d(0,calc(var(--vh-parallax,0px) * .36),0) scale(1.055)!important;filter:saturate(1.13) contrast(1.09) brightness(1.05)!important;will-change:transform!important;}
      body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::after{content:""!important;position:absolute!important;inset:0!important;opacity:.72!important;background:radial-gradient(circle at 78% 18%,rgba(241,234,219,.08),transparent 28rem),radial-gradient(circle at 28% 32%,rgba(208,173,104,.13),transparent 26rem),linear-gradient(90deg,rgba(5,4,3,.86),rgba(5,4,3,.12) 50%,rgba(5,4,3,.54)),linear-gradient(180deg,rgba(5,4,3,.10),rgba(5,4,3,.24) 54%,rgba(5,4,3,.96)),repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 1px,transparent 1px 8px)!important;mix-blend-mode:normal!important;}
      body.veritas-universe.final-hero-ready .vh-hero-copy{position:relative!important;z-index:2!important;padding:clamp(18px,2.4vw,34px)!important;border-left:1px solid rgba(208,173,104,.28)!important;background:linear-gradient(90deg,rgba(5,4,3,.36),rgba(5,4,3,.10),transparent)!important;box-shadow:-28px 0 80px rgba(0,0,0,.24)!important;}
      body.veritas-universe.final-hero-ready .vh-title{text-shadow:0 30px 90px rgba(0,0,0,.88),0 0 30px rgba(208,173,104,.10)!important;}
      body.veritas-universe.final-hero-ready .vh-subtitle,body.veritas-universe.final-hero-ready .vh-lead{text-shadow:0 18px 48px rgba(0,0,0,.78)!important;}
      body.cinematic-mode.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{transform:translate3d(0,calc(var(--vh-parallax,0px) * .58),0) scale(1.105)!important;filter:saturate(1.24) contrast(1.14) brightness(1.12)!important;}
      body.cinematic-mode.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::after{opacity:.55!important;background:radial-gradient(circle at 70% 20%,rgba(208,173,104,.17),transparent 30rem),linear-gradient(90deg,rgba(5,4,3,.82),rgba(5,4,3,.08) 54%,rgba(5,4,3,.46)),linear-gradient(180deg,rgba(5,4,3,.05),rgba(5,4,3,.20) 55%,rgba(5,4,3,.94)),repeating-linear-gradient(90deg,rgba(255,255,255,.020) 0 1px,transparent 1px 8px)!important;}
      body.reduced-motion.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before,body.reduce-motion.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{transform:scale(1.04)!important;will-change:auto!important;}
      @media(max-width:760px){body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{inset:-3%!important;transform:scale(1.03)!important;background-image:linear-gradient(180deg,rgba(5,4,3,.52) 0%,rgba(5,4,3,.22) 34%,rgba(5,4,3,.96) 100%),linear-gradient(90deg,rgba(5,4,3,.82),rgba(5,4,3,.18) 62%,rgba(5,4,3,.66)),var(--vh-final-hero-image)!important;background-size:cover,cover,cover!important;}body.veritas-universe.final-hero-ready .vh-hero-copy{padding:0!important;border-left:0!important;background:transparent!important;box-shadow:none!important;}}
    `;
    document.head.appendChild(style);
  };

  const scheduleFinalHero = () => {
    applyFinalHeroAssets();
    injectFinalHeroStyles();
    window.requestAnimationFrame?.(() => { applyFinalHeroAssets(); injectFinalHeroStyles(); });
    window.setTimeout(() => { applyFinalHeroAssets(); injectFinalHeroStyles(); }, 80);
    window.setTimeout(() => { applyFinalHeroAssets(); injectFinalHeroStyles(); }, 320);
    window.setTimeout(() => { applyFinalHeroAssets(); injectFinalHeroStyles(); }, 900);
  };

  const languagePairs = new Map([
    ["/", "/pl/"],
    ["/pl/", "/"],
    ["/rap-ort/", "/rap-ort/pl/"],
    ["/rap-ort/pl/", "/rap-ort/"],
    ["/rap-ort/prawda-sumienia/", "/rap-ort/prawda-sumienia/pl/"],
    ["/rap-ort/prawda-sumienia/pl/", "/rap-ort/prawda-sumienia/"],
    ["/rap-ort/conscience-report/", "/rap-ort/pl/"],
    ["/rap-ort/witness-report/", "/rap-ort/raport-swiadka/"],
    ["/rap-ort/raport-swiadka/", "/rap-ort/witness-report/"],
    ["/sztab/", "/sztab/pl/"],
    ["/sztab/pl/", "/sztab/"],
    ["/sztab/origins/", "/sztab/origins/pl/"],
    ["/sztab/origins/pl/", "/sztab/origins/"],
    ["/sztab/raport-z-pamieci/", "/sztab/pl/"],
    ["/sztab/raport-z-pamieci-2/", "/sztab/pl/"],
    ["/sztab/battles/", "/sztab/pl/"],
    ["/sztab/forgotten/", "/sztab/pl/"],
    ["/music/", "/music/pl/"],
    ["/music/pl/", "/music/"],
    ["/music-works/", "/music/pl/"],
    ["/music-works/pl/", "/music/"],
    ["/pl/music/", "/music/"],
    ["/between-the-lines/", "/miedzy-wierszami/"],
    ["/miedzy-wierszami/", "/between-the-lines/"],
    ["/author/", "/authorial-profile/pl/"],
    ["/authorial-profile/", "/authorial-profile/pl/"],
    ["/authorial-profile/pl/", "/authorial-profile/"],
    ["/institutions/", "/for-institutions/pl/"],
    ["/pl/institutions/", "/for-institutions/"],
    ["/for-institutions/", "/for-institutions/pl/"],
    ["/for-institutions/pl/", "/for-institutions/"],
    ["/press/", "/press-recognition/pl/"],
    ["/pl/press/", "/press-recognition/"],
    ["/press-recognition/", "/press-recognition/pl/"],
    ["/press-recognition/pl/", "/press-recognition/"],
    ["/contact/", "/contact/pl/"],
    ["/contact/pl/", "/contact/"],
  ]);

  const isWorldPath = (path) =>
    path.startsWith("/rap-ort/") ||
    path.startsWith("/sztab/") ||
    path === "/music/" ||
    path === "/music/pl/" ||
    path === "/between-the-lines/" ||
    path === "/miedzy-wierszami/";

  const isActive = (key) => {
    if (key === "home") return currentPath === "/" || currentPath === "/pl/";
    if (key === "raport") return currentPath.startsWith("/rap-ort/");
    if (key === "sztab") return currentPath.startsWith("/sztab/");
    if (key === "between") return currentPath === "/between-the-lines/" || currentPath === "/miedzy-wierszami/";
    if (key === "music") return currentPath === "/music/" || currentPath === "/music/pl/" || currentPath.startsWith("/music-works/") || currentPath === "/pl/music/";
    if (key === "institutions") return currentPath === "/for-institutions/" || currentPath === "/for-institutions/pl/" || currentPath === "/institutions/" || currentPath === "/pl/institutions/";
    if (key === "author") return currentPath === "/authorial-profile/" || currentPath === "/authorial-profile/pl/" || currentPath === "/author/";
    if (key === "press") return currentPath === "/press-recognition/" || currentPath === "/press-recognition/pl/" || currentPath === "/press/" || currentPath === "/pl/press/";
    if (key === "contact") return currentPath === "/contact/" || currentPath === "/contact/pl/";
    return false;
  };

  const languageTarget = languagePairs.get(currentPath) || (isPolish ? "/" : "/pl/");

  const routeIdentity = () => {
    if (currentPath === "/" || currentPath === "/pl/") {
      return {
        label: "PIOTR LICHWAŁA",
        sub: "VIBROSŁAW · VERITAS HUMANUM",
        href: isPolish ? "/pl/" : "/",
        className: "identity-veritas",
      };
    }
    if (currentPath.includes("/prawda-sumienia/pl/")) {
      return { label: "PRAWDA SUMIENIA", sub: "Rap-Ort", href: "/rap-ort/prawda-sumienia/pl/", className: "identity-raport" };
    }
    if (currentPath.includes("/prawda-sumienia/")) {
      return { label: "PRAWDA SUMIENIA · GUIDE", sub: "Rap-Ort", href: "/rap-ort/prawda-sumienia/", className: "identity-raport" };
    }
    if (currentPath.includes("/conscience-report/")) {
      return { label: "CONSCIENCE REPORT", sub: "In development", href: "/rap-ort/conscience-report/", className: "identity-raport" };
    }
    if (currentPath.includes("/witness-report/")) {
      return { label: "THE WITNESS REPORT", sub: "Rap-Ort", href: "/rap-ort/witness-report/", className: "identity-raport" };
    }
    if (currentPath.includes("/raport-swiadka/")) {
      return { label: "RAPORT ŚWIADKA", sub: "Rap-Ort", href: "/rap-ort/raport-swiadka/", className: "identity-raport" };
    }
    if (currentPath === "/rap-ort/" || currentPath === "/rap-ort/pl/") {
      return { label: "Rap-Ort", sub: isPolish ? "świat świadectwa" : "world of testimony", href: isPolish ? "/rap-ort/pl/" : "/rap-ort/", className: "identity-raport" };
    }
    if (currentPath.includes("/sztab/origins")) {
      return { label: "SZTAB · ORIGINS", sub: isPolish ? "seria animowana" : "animated branch", href: isPolish ? "/sztab/origins/pl/" : "/sztab/origins/", className: "identity-sztab" };
    }
    if (currentPath.includes("/sztab/raport-z-pamieci")) {
      return { label: "SZTAB · Raport z Pamięci", sub: isPolish ? "album muzyczny" : "music album", href: "/sztab/raport-z-pamieci/", className: "identity-sztab identity-manuscript" };
    }
    if (currentPath.includes("/sztab/battles")) {
      return { label: "SZTAB · BATTLES", sub: "In development", href: "/sztab/battles/", className: "identity-sztab" };
    }
    if (currentPath.includes("/sztab/forgotten")) {
      return { label: "SZTAB · FORGOTTEN", sub: "In development", href: "/sztab/forgotten/", className: "identity-sztab" };
    }
    if (currentPath === "/sztab/" || currentPath === "/sztab/pl/") {
      return { label: "SZTAB", sub: isPolish ? "świat pamięci" : "world of memory", href: isPolish ? "/sztab/pl/" : "/sztab/", className: "identity-sztab" };
    }
    if (currentPath === "/music/" || currentPath === "/music/pl/" || currentPath.startsWith("/music-works/") || currentPath === "/pl/music/") {
      return { label: isPolish ? "MUZYKA" : "MUSIC", sub: "Vibrosław", href: isPolish ? "/music/pl/" : "/music/", className: "identity-neutral" };
    }
    if (currentPath === "/between-the-lines/" || currentPath === "/miedzy-wierszami/") {
      return { label: isPolish ? "MIĘDZY WIERSZAMI" : "BETWEEN THE LINES", sub: isPolish ? "w przygotowaniu" : "in development", href: isPolish ? "/miedzy-wierszami/" : "/between-the-lines/", className: "identity-neutral" };
    }
    return { label: "PIOTR LICHWAŁA", sub: "VIBROSŁAW · VERITAS HUMANUM", href: isPolish ? "/pl/" : "/", className: "identity-neutral" };
  };

  const labels = isPolish
    ? {
        home: ["Veritas", "Veritas Humanum"],
        raport: ["Rap-Ort", "Rap-Ort"],
        sztab: ["SZTAB", "SZTAB"],
        between: ["Między", "Między Wierszami"],
        music: ["Muzyka", "Muzyka"],
        institutions: ["Instytucje", "Dla instytucji"],
        author: ["Autor", "Profil autorski"],
        press: ["Media", "Media / wzmianki"],
        contact: ["Kontakt", "Kontakt"],
      }
    : {
        home: ["Veritas", "Veritas Humanum"],
        raport: ["Rap-Ort", "Rap-Ort"],
        sztab: ["SZTAB", "SZTAB"],
        between: ["Between", "Between the Lines"],
        music: ["Music", "Music"],
        institutions: ["Institutions", "For Institutions"],
        author: ["Author", "Authorial Profile"],
        press: ["Press", "Press / Recognition"],
        contact: ["Contact", "Contact"],
      };

  const navConfig = [
    { key: "home", href: isPolish ? "/pl/" : "/" },
    { key: "raport", href: isPolish ? "/rap-ort/pl/" : "/rap-ort/" },
    { key: "sztab", href: isPolish ? "/sztab/pl/" : "/sztab/" },
    { key: "between", href: isPolish ? "/miedzy-wierszami/" : "/between-the-lines/" },
    { key: "music", href: isPolish ? "/music/pl/" : "/music/" },
    { key: "institutions", href: isPolish ? "/for-institutions/pl/" : "/for-institutions/" },
    { key: "author", href: isPolish ? "/authorial-profile/pl/" : "/authorial-profile/" },
    { key: "press", href: isPolish ? "/press-recognition/pl/" : "/press-recognition/" },
    { key: "contact", href: isPolish ? "/contact/pl/" : "/contact/" },
  ];

  const navItems = navConfig.map((item) => {
    const [desktopLabel, mobileLabel] = labels[item.key];
    return {
      ...item,
      desktopLabel,
      mobileLabel,
      active: isActive(item.key),
    };
  });

  const identity = routeIdentity();

  const createLinkHtml = (item, className = "nav-button", variant = "desktop") => {
    const classes = [className, item.active ? "is-active active" : ""].filter(Boolean).join(" ");
    const entry = isWorldPath(normalizePath(item.href)) ? ' data-cinematic-entry="true"' : "";
    const ariaCurrent = item.active ? ' aria-current="page"' : "";
    const label = variant === "desktop" ? item.desktopLabel : item.mobileLabel;
    return `<a class="${classes}" href="${item.href}" data-nav-key="${item.key}" title="${item.mobileLabel}"${entry}${ariaCurrent}>${label}</a>`;
  };

  const desktopLinks = navItems.map((item) => createLinkHtml(item, "nav-button", "desktop")).join("");
  const mobilePrimary = navItems.slice(0, 5).map((item) => createLinkHtml(item, "mobile-menu-link mobile-menu-primary", "mobile")).join("");
  const mobileSecondary = navItems.slice(5).map((item) => createLinkHtml(item, "mobile-menu-link", "mobile")).join("");
  const header = document.querySelector(".site-header");

  if (header) {
    header.innerHTML = `
      <div class="wrap header-inner">
        <a class="brand brand-home-lockup ${identity.className}" href="${identity.href}" aria-label="${identity.label}">
          <div class="brand-name unified-world-label">${identity.label}</div>
          <div class="brand-sub-desktop">${identity.sub}</div>
          <div class="brand-sub-mobile">${identity.label}</div>
        </a>
        <nav class="desktop-nav desktop-nav-compact site-nav-hub" aria-label="${isPolish ? "Nawigacja główna" : "Primary navigation"}">
          ${desktopLinks}
          <div class="lang-switch" aria-label="${isPolish ? "Zmiana języka" : "Language switch"}">
            <a href="${isPolish ? languageTarget : currentPath}" class="${!isPolish ? "active" : ""}" hreflang="en" title="English">EN</a>
            <span>|</span>
            <a href="${isPolish ? currentPath : languageTarget}" class="${isPolish ? "active" : ""}" hreflang="pl" title="Polski">PL</a>
          </div>
          <button class="mobile-nav-toggle desktop-menu-toggle" id="mobileNavToggle" type="button" aria-label="${isPolish ? "Otwórz menu strony" : "Open site menu"}" aria-expanded="false" aria-controls="mobileMenuOverlay">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>
      <div class="mobile-menu-overlay" id="mobileMenuOverlay" aria-hidden="true" role="dialog" aria-modal="true" tabindex="-1">
        <div class="mobile-menu-panel">
          ${mobilePrimary}
          ${mobileSecondary}
          <button class="mobile-menu-link mobile-menu-button" id="mobileCinematicToggle" type="button" aria-pressed="false">${isPolish ? "Tryb kinowy" : "Cinematic Mode"}</button>
          <div class="mobile-lang-switch">
            <a href="${isPolish ? languageTarget : currentPath}" class="${!isPolish ? "active" : ""}" hreflang="en">EN</a>
            <span>|</span>
            <a href="${isPolish ? currentPath : languageTarget}" class="${isPolish ? "active" : ""}" hreflang="pl">PL</a>
          </div>
        </div>
      </div>`;
  }

  const ensureQuickControls = () => {
    if (document.querySelector(".floating-tools.veritas-quick-controls")) return;
    const tools = document.createElement("div");
    tools.className = "floating-tools veritas-quick-controls";
    tools.setAttribute("aria-label", isPolish ? "Szybkie ustawienia strony" : "Quick site controls");

    const cinematic = document.createElement("button");
    cinematic.className = "tool-button cinematic-tool-button";
    cinematic.id = "cinematicToggle";
    cinematic.type = "button";
    cinematic.setAttribute("aria-pressed", "false");
    cinematic.textContent = isPolish ? "Tryb kinowy" : "Cinematic Mode";

    let reduced = document.querySelector("[data-reduce-motion-toggle]");
    if (!reduced) {
      reduced = document.createElement("button");
      reduced.type = "button";
      reduced.setAttribute("data-reduce-motion-toggle", "");
      reduced.setAttribute("aria-pressed", "false");
    }
    reduced.id = reduced.id || "reducedMotionToggle";
    reduced.classList.add("tool-button", "motion-tool-button");
    reduced.textContent = isPolish ? "Ogranicz ruch" : "Reduce Motion";

    tools.append(cinematic, reduced);
    document.body.appendChild(tools);
  };

  const keepEssentialDesktopLinksVisible = () => {
    const forceVisible = window.matchMedia("(min-width: 901px)").matches;
    document.querySelectorAll('.desktop-nav-compact .nav-button[data-nav-key="institutions"], .desktop-nav-compact .nav-button[data-nav-key="press"]').forEach((link) => {
      if (forceVisible) {
        link.style.setProperty("display", "inline-flex", "important");
      } else {
        link.style.removeProperty("display");
      }
    });
  };

  const scheduleEssentialLinkGuard = () => {
    keepEssentialDesktopLinksVisible();
    window.requestAnimationFrame?.(keepEssentialDesktopLinksVisible);
    window.setTimeout(keepEssentialDesktopLinksVisible, 0);
    window.setTimeout(keepEssentialDesktopLinksVisible, 120);
    window.setTimeout(keepEssentialDesktopLinksVisible, 500);
  };

  document.body.classList.add("navbar-unified", "veritas-nav-ready");
  document.body.classList.toggle("page-home", currentPath === "/" || currentPath === "/pl/");
  document.body.classList.toggle("lang-pl", isPolish);
  document.body.classList.toggle("lang-en", !isPolish);
  ensureQuickControls();
  scheduleFinalHero();
  scheduleEssentialLinkGuard();
  window.addEventListener("resize", () => { keepEssentialDesktopLinksVisible(); scheduleFinalHero(); }, { passive: true });
  document.addEventListener("DOMContentLoaded", () => { scheduleEssentialLinkGuard(); scheduleFinalHero(); }, { once: true });
  window.addEventListener("load", () => { scheduleEssentialLinkGuard(); scheduleFinalHero(); }, { once: true });

  const menu = document.getElementById("mobileMenuOverlay");
  const toggle = document.getElementById("mobileNavToggle");

  const openMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.add("is-open", "open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("mobile-menu-open");
    document.documentElement.dataset.mobileMenu = "open";
    menu.querySelector("a,button")?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent("site:mobile-menu-change", { detail: { open: true, source: "nav" } }));
  };

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open", "open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-menu-open");
    document.documentElement.dataset.mobileMenu = "closed";
    document.dispatchEvent(new CustomEvent("site:mobile-menu-change", { detail: { open: false, source: "nav" } }));
    keepEssentialDesktopLinksVisible();
  };

  window.openMobileMenu = openMenu;
  window.closeMobileMenu = closeMenu;
  window.toggleMobileMenu = () => (menu?.classList.contains("is-open") ? closeMenu() : openMenu());

  toggle?.addEventListener("click", window.toggleMobileMenu);
  menu?.addEventListener("click", (event) => {
    if (event.target === menu || event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
