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
  const isDocumentStudio = document.body?.classList.contains("document-studio-page");
  const installPremiumExperienceAssets = () => {
    if (!document.querySelector('link[data-experience-premium="true"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/assets/css/experience-premium.css";
      link.dataset.experiencePremium = "true";
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[data-experience-premium="true"]')) {
      const script = document.createElement("script");
      script.src = "/assets/js/experience-premium.js";
      script.dataset.experiencePremium = "true";
      document.head.appendChild(script);
    }
  };
  const installExperienceStyles = () => {
    if (document.getElementById("experience2026Styles")) return;
    const style = document.createElement("style");
    style.id = "experience2026Styles";
    style.textContent = `
      :root{--experience-accent-rgb:208,173,104;--experience-lite-duration:150ms;--experience-cinematic-duration:440ms;--mobile-dock-height:56px}
      body[data-world="sztab"]{--experience-accent-rgb:183,140,88}body[data-world="music"]{--experience-accent-rgb:157,139,197}body[data-world="between"]{--experience-accent-rgb:131,168,160}
      @media(prefers-reduced-motion:no-preference){@view-transition{navigation:auto}}
      .brand-home-lockup{view-transition-name:site-brand}.vh-hero-media{view-transition-name:page-hero}
      ::view-transition-group(root),::view-transition-group(site-brand),::view-transition-group(page-hero){animation-timing-function:cubic-bezier(.2,.72,.2,1)}
      html[data-experience="lite"]::view-transition-old(root),html[data-experience="lite"]::view-transition-new(root){animation-duration:var(--experience-lite-duration)}
      html[data-experience="cinematic"]::view-transition-old(root),html[data-experience="cinematic"]::view-transition-new(root){animation-duration:var(--experience-cinematic-duration)}
      html[data-experience="cinematic"]::view-transition-group(page-hero){animation-duration:480ms}
      html[data-experience="reduced"]::view-transition-group(root),html[data-experience="reduced"]::view-transition-group(site-brand),html[data-experience="reduced"]::view-transition-group(page-hero){animation-duration:1ms}
      html body.veritas-universe .vh-hero{min-height:clamp(560px,84svh,820px)!important}html body.veritas-universe .vh-hero.vh-hero-compact{min-height:clamp(500px,78svh,720px)!important}
      body.experience-lite .vh-hero-media.has-future-hero::before,body.experience-lite .vh-hero-media.has-final-hero::before{transform:scale(1.025)!important;filter:saturate(1.04) contrast(1.04) brightness(1.03)!important;will-change:auto!important}
      body.experience-lite .reveal{transition-duration:var(--experience-lite-duration)!important}
      html body.navbar-unified .site-header{background:linear-gradient(180deg,rgba(5,4,3,.72),rgba(5,4,3,.20),transparent)!important;border-bottom-color:rgba(201,178,143,.08)!important;box-shadow:none!important;transition:background 180ms ease,border-color 180ms ease,box-shadow 180ms ease,opacity 180ms ease!important}
      html body.navbar-unified .site-header.is-scrolled,html body.navbar-unified.cinematic-mode .site-header.is-scrolled{opacity:1!important;transform:none!important;filter:none!important;background:rgba(7,6,5,.92)!important;border-bottom-color:rgba(201,178,143,.18)!important;box-shadow:0 16px 42px rgba(0,0,0,.32)!important;backdrop-filter:blur(18px) saturate(118%)!important;-webkit-backdrop-filter:blur(18px) saturate(118%)!important}
      .experience-menu-toggle{min-height:38px;padding:0 15px;border:1px solid rgba(201,178,143,.24);border-radius:999px;background:rgba(255,255,255,.025);color:rgba(241,234,219,.82);font:600 .62rem/1 Inter,sans-serif;letter-spacing:.10em;text-transform:uppercase;cursor:pointer}
      .experience-menu-toggle:hover,.experience-menu-toggle:focus-visible{color:#f1eadb;border-color:rgba(201,178,143,.52);background:rgba(var(--experience-accent-rgb),.10)}
      .experience-menu-popover{position:fixed;inset:78px clamp(16px,2.4vw,34px) auto auto;width:min(390px,calc(100vw - 32px));margin:0;padding:22px;border:1px solid rgba(201,178,143,.30);border-radius:24px;background:linear-gradient(145deg,rgba(31,26,19,.98),rgba(6,5,4,.985));color:#f1eadb;box-shadow:0 34px 90px rgba(0,0,0,.58),0 0 44px rgba(var(--experience-accent-rgb),.08);backdrop-filter:blur(22px) saturate(116%);-webkit-backdrop-filter:blur(22px) saturate(116%)}
      .experience-menu-popover:popover-open,.experience-menu-popover[data-fallback-closed="false"]{display:grid;gap:17px}.experience-menu-popover[data-fallback-closed="true"]{display:none!important}
      .experience-menu-heading{display:grid;gap:5px;padding-bottom:15px;border-bottom:1px solid rgba(201,178,143,.16)}.experience-menu-heading span{color:rgba(208,173,104,.88);font-size:.62rem;letter-spacing:.17em}.experience-menu-heading small{font-family:Georgia,serif;font-size:1.08rem;letter-spacing:.04em}
      .experience-menu-links,.experience-menu-controls,.experience-language{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      .experience-menu-link,.experience-control,.experience-language a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 12px;border:1px solid rgba(201,178,143,.16);border-radius:13px;background:rgba(255,255,255,.035);color:rgba(241,234,219,.78);font:600 .68rem/1.2 Inter,sans-serif;letter-spacing:.075em;text-align:center;text-decoration:none;text-transform:uppercase;cursor:pointer}
      .experience-menu-link:hover,.experience-menu-link:focus-visible,.experience-control:hover,.experience-control:focus-visible,.experience-control[aria-pressed="true"],.experience-language a:hover,.experience-language a:focus-visible,.experience-language a.active{border-color:rgba(201,178,143,.45);background:rgba(var(--experience-accent-rgb),.11);color:#f1eadb}.experience-language{padding-top:14px;border-top:1px solid rgba(201,178,143,.13)}
      .mobile-action-dock,.experience-edge,.experience-progress-rail,.experience-context-rail{display:none}.mobile-cinematic-fab,.floating-tools.veritas-quick-controls{display:none!important}
      @media(min-width:901px){#mobileNavToggle{display:none!important}}@media(max-width:900px){.experience-menu-toggle{display:none}}@media(max-width:760px){#mobileNavToggle{display:none!important}}
    `;
    style.textContent += `
      @media(min-width:1180px){body.experience-cinematic .experience-edge,body.experience-cinematic .experience-progress-rail,body.experience-cinematic .experience-context-rail{display:block;position:fixed;z-index:40;pointer-events:none}body.experience-cinematic .experience-edge{top:14vh;bottom:12vh;width:1px;background:linear-gradient(180deg,transparent,rgba(var(--experience-accent-rgb),.42),transparent);box-shadow:0 0 20px rgba(var(--experience-accent-rgb),.18)}body.experience-cinematic .experience-edge-left{left:18px}body.experience-cinematic .experience-edge-right{right:18px}body.experience-cinematic .experience-progress-rail{top:28vh;right:12px;width:3px;height:42vh;border-radius:999px;background:rgba(255,255,255,.06);overflow:hidden}.experience-progress-fill{position:absolute;inset:0;transform:scaleY(var(--experience-scroll-progress,0));transform-origin:top;background:linear-gradient(180deg,rgba(var(--experience-accent-rgb),.96),rgba(var(--experience-accent-rgb),.24))}body.experience-cinematic .experience-context-rail{left:28px;top:50%;max-width:160px;color:rgba(241,234,219,.48);font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;transform:rotate(-90deg) translateX(-50%);transform-origin:left top}}
      body.experience-cinematic .vh-card,body.experience-cinematic .world-portal-card{transform-style:preserve-3d}@media(hover:hover) and (pointer:fine){body.experience-cinematic .vh-card:hover,body.experience-cinematic .world-portal-card:hover{transform:translateY(-4px) perspective(900px) rotateX(.5deg)}}
      @media(max-width:760px){html body.veritas-universe .vh-hero,html body.veritas-universe .vh-hero.vh-hero-compact{min-height:82svh!important;height:auto!important}html body.veritas-universe .vh-hero-media.has-future-hero::before,html body.veritas-universe .vh-hero-media.has-final-hero::before{background-position:center,center,var(--vh-hero-position-mobile,center)!important;transform:scale(1.025)!important;filter:saturate(1.03) contrast(1.04) brightness(1.02)!important;will-change:auto!important}html body.navbar-unified .site-header,html body.navbar-unified.cinematic-mode .site-header{opacity:1!important;transform:none!important;filter:none!important}.mobile-action-dock{position:fixed;left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));z-index:10020;height:var(--mobile-dock-height);display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:6px;border:1px solid rgba(201,178,143,.24);border-radius:20px;background:rgba(7,6,5,.92);box-shadow:0 20px 54px rgba(0,0,0,.46);backdrop-filter:blur(18px) saturate(116%);-webkit-backdrop-filter:blur(18px) saturate(116%)}.mobile-dock-action{min-width:0;min-height:44px;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:14px;background:transparent;color:rgba(241,234,219,.76);font:600 .68rem/1 Inter,sans-serif;letter-spacing:.08em;text-decoration:none;text-transform:uppercase}.mobile-dock-action:focus-visible,.mobile-dock-action[aria-pressed="true"]{border-color:rgba(201,178,143,.38);background:rgba(var(--experience-accent-rgb),.12);color:#f1eadb}body.mobile-menu-open .mobile-action-dock{opacity:0;pointer-events:none}.mobile-menu-panel{padding-bottom:calc(var(--mobile-dock-height) + 30px + env(safe-area-inset-bottom))!important}.vh-button,.mobile-menu-link,.mobile-menu-button,button,[role="button"]{min-height:44px}body:not(.psx-page) .vh-main>.vh-section:nth-of-type(n+3){content-visibility:auto;contain-intrinsic-size:auto 760px}body.experience-lite .reveal{transform:none!important;filter:none!important}}
      @media(prefers-reduced-motion:reduce){.experience-edge,.experience-progress-rail,.experience-context-rail{display:none!important}}
    `;
    document.head.appendChild(style);
  };

  installExperienceStyles();
  if (!isDocumentStudio) installPremiumExperienceAssets();

  const worldForCurrentPath = () => {
    if (currentPath.startsWith("/rap-ort/")) return "raport";
    if (currentPath.startsWith("/sztab/")) return "sztab";
    if (currentPath.startsWith("/music") || currentPath === "/pl/music/") return "music";
    if (currentPath === "/between-the-lines/" || currentPath === "/miedzy-wierszami/") return "between";
    return "veritas";
  };

  const ensureExperienceDecor = () => {
    if (document.querySelector(".experience-progress-rail")) return;
    const title = document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() || "Veritas Humanum";
    const fragment = document.createDocumentFragment();

    const left = document.createElement("span");
    left.className = "experience-edge experience-edge-left";
    const right = document.createElement("span");
    right.className = "experience-edge experience-edge-right";
    const progress = document.createElement("span");
    progress.className = "experience-progress-rail";
    progress.innerHTML = '<span class="experience-progress-fill"></span>';
    const context = document.createElement("span");
    context.className = "experience-context-rail";
    context.setAttribute("aria-hidden", "true");
    context.innerHTML = `<span class="experience-rail-label">${title}</span><strong class="experience-rail-chapter">${title}</strong><span class="experience-rail-count">01 / 01</span>`;

    fragment.append(left, right, progress, context);
    document.body.appendChild(fragment);
  };
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
    sztabOrigins: `${heroRoot}sztab-origins-hero.webp`,
    sztabBattles: `${heroRoot}sztab-battles-hero.webp`,
    sztabForgotten: `${heroRoot}sztab-forgotten-hero.webp`,
    sztabMusic: `${heroRoot}sztab-music-hero.webp`,
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
    if (path === "/rap-ort/prawda-sumienia/" || path === "/rap-ort/prawda-sumienia/pl/") return heroAssets.prawda;
    if (path === "/rap-ort/conscience-report/") return heroAssets.conscience;
    if (path === "/rap-ort/witness-report/" || path === "/rap-ort/raport-swiadka/") return heroAssets.witness;
    if (path.startsWith("/sztab/origins/")) return heroAssets.sztabOrigins;
    if (path.startsWith("/sztab/battles/")) return heroAssets.sztabBattles;
    if (path.startsWith("/sztab/forgotten/")) return heroAssets.sztabForgotten;
    if (path.startsWith("/sztab/raport-z-pamieci")) return heroAssets.sztabMusic;
    if (path.startsWith("/sztab/")) return heroAssets.sztab;
    if (path === "/between-the-lines/" || path === "/miedzy-wierszami/") return heroAssets.between;
    if (path === "/music/" || path === "/music/pl/" || path.startsWith("/music-works/") || path === "/pl/music/") return heroAssets.music;
    if (path === "/for-institutions/" || path === "/for-institutions/pl/" || path === "/institutions/" || path === "/pl/institutions/") return heroAssets.institutions;
    if (path === "/press-recognition/" || path === "/press-recognition/pl/" || path === "/press/" || path === "/pl/press/") return heroAssets.press;
    if (path === "/authorial-profile/" || path === "/authorial-profile/pl/" || path === "/author/") return heroAssets.author;
    if (path === "/contact/" || path === "/contact/pl/") return heroAssets.contact;
    return heroAssets.veritas;
  };

  const finalHeroSrc = isDocumentStudio ? "" : heroForPath(currentPath);

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
      body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{content:""!important;position:absolute!important;inset:-7%!important;opacity:1!important;background-image:linear-gradient(90deg,rgba(5,4,3,.92) 0%,rgba(5,4,3,.68) 27%,rgba(5,4,3,.20) 56%,rgba(5,4,3,.48) 100%),linear-gradient(180deg,rgba(5,4,3,.42) 0%,rgba(5,4,3,.10) 38%,rgba(5,4,3,.94) 100%),radial-gradient(circle at 36% 22%,rgba(208,173,104,.25),transparent 32rem),var(--vh-final-hero-image)!important;background-size:cover,cover,cover,cover!important;background-position:center,center,center,var(--vh-hero-position,center)!important;background-repeat:no-repeat!important;transform:translate3d(var(--vh-pointer-x,0px),calc((var(--vh-parallax,0px) * .36) + var(--vh-pointer-y,0px)),0) rotateX(var(--vh-pointer-rx,0deg)) rotateY(var(--vh-pointer-ry,0deg)) scale(1.055)!important;filter:saturate(1.13) contrast(1.09) brightness(1.05)!important;will-change:transform!important;}
      body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::after{content:""!important;position:absolute!important;inset:0!important;opacity:.72!important;background:radial-gradient(circle at 78% 18%,rgba(241,234,219,.08),transparent 28rem),radial-gradient(circle at 28% 32%,rgba(208,173,104,.13),transparent 26rem),linear-gradient(90deg,rgba(5,4,3,.86),rgba(5,4,3,.12) 50%,rgba(5,4,3,.54)),linear-gradient(180deg,rgba(5,4,3,.10),rgba(5,4,3,.24) 54%,rgba(5,4,3,.96)),repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 1px,transparent 1px 8px)!important;mix-blend-mode:normal!important;}
      body.veritas-universe.final-hero-ready .vh-hero-copy{position:relative!important;z-index:2!important;padding:clamp(18px,2.4vw,34px)!important;border-left:1px solid rgba(208,173,104,.28)!important;background:linear-gradient(90deg,rgba(5,4,3,.36),rgba(5,4,3,.10),transparent)!important;box-shadow:-28px 0 80px rgba(0,0,0,.24)!important;}
      body.veritas-universe.final-hero-ready .vh-title{text-shadow:0 30px 90px rgba(0,0,0,.88),0 0 30px rgba(208,173,104,.10)!important;}
      body.veritas-universe.final-hero-ready .vh-subtitle,body.veritas-universe.final-hero-ready .vh-lead{text-shadow:0 18px 48px rgba(0,0,0,.78)!important;}
      body.cinematic-mode.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{transform:translate3d(var(--vh-pointer-x,0px),calc((var(--vh-parallax,0px) * .58) + var(--vh-pointer-y,0px)),0) rotateX(var(--vh-pointer-rx,0deg)) rotateY(var(--vh-pointer-ry,0deg)) scale(1.105)!important;filter:saturate(1.24) contrast(1.14) brightness(1.12)!important;}
      body.cinematic-mode.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::after{opacity:.55!important;background:radial-gradient(circle at 70% 20%,rgba(208,173,104,.17),transparent 30rem),linear-gradient(90deg,rgba(5,4,3,.82),rgba(5,4,3,.08) 54%,rgba(5,4,3,.46)),linear-gradient(180deg,rgba(5,4,3,.05),rgba(5,4,3,.20) 55%,rgba(5,4,3,.94)),repeating-linear-gradient(90deg,rgba(255,255,255,.020) 0 1px,transparent 1px 8px)!important;}
      body.reduced-motion.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before,body.reduce-motion.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{transform:scale(1.04)!important;will-change:auto!important;}
      @media(max-width:760px){body.veritas-universe.final-hero-ready .vh-hero-media.has-final-hero::before{inset:-3%!important;transform:scale(1.03)!important;background-image:linear-gradient(180deg,rgba(5,4,3,.52) 0%,rgba(5,4,3,.22) 34%,rgba(5,4,3,.96) 100%),linear-gradient(90deg,rgba(5,4,3,.82),rgba(5,4,3,.18) 62%,rgba(5,4,3,.66)),var(--vh-final-hero-image)!important;background-size:cover,cover,cover!important;background-position:center,center,var(--vh-hero-position-mobile,var(--vh-hero-position,center))!important;}body.veritas-universe.final-hero-ready .vh-hero-copy{padding:0!important;border-left:0!important;background:transparent!important;box-shadow:none!important;}}
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
    ["/rap-ort/prawda-sumienia/exclusive/", "/rap-ort/prawda-sumienia/exclusive/pl/"],
    ["/rap-ort/prawda-sumienia/exclusive/pl/", "/rap-ort/prawda-sumienia/exclusive/"],
    ["/rap-ort/conscience-report/", "/rap-ort/pl/"],
    ["/rap-ort/witness-report/", "/rap-ort/raport-swiadka/"],
    ["/rap-ort/raport-swiadka/", "/rap-ort/witness-report/"],
    ["/sztab/", "/sztab/pl/"],
    ["/sztab/pl/", "/sztab/"],
    ["/sztab/origins/", "/sztab/origins/pl/"],
    ["/sztab/origins/pl/", "/sztab/origins/"],
    ["/sztab/raport-z-pamieci/", "/sztab/pl/"],
    ["/sztab/raport-z-pamieci-2/", "/sztab/pl/"],
    ["/sztab/battles/", "/sztab/battles/pl/"],
    ["/sztab/battles/pl/", "/sztab/battles/"],
    ["/sztab/forgotten/", "/sztab/forgotten/pl/"],
    ["/sztab/forgotten/pl/", "/sztab/forgotten/"],
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

  const desktopLinks = navItems.slice(0, 5).map((item) => createLinkHtml(item, "nav-button", "desktop")).join("");
  const desktopSecondary = navItems.slice(5).map((item) => createLinkHtml(item, "experience-menu-link", "mobile")).join("");
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
          <button class="experience-menu-toggle" id="experienceMenuToggle" type="button" popovertarget="experienceMenu" aria-label="${isPolish ? "Więcej i ustawienia" : "More and experience settings"}">
            <span>${isPolish ? "Więcej" : "More"}</span>
          </button>
          <button class="mobile-nav-toggle desktop-menu-toggle" id="mobileNavToggle" type="button" aria-label="${isPolish ? "Otwórz menu strony" : "Open site menu"}" aria-expanded="false" aria-controls="mobileMenuOverlay">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>
      <div class="experience-menu-popover" id="experienceMenu" popover>
        <div class="experience-menu-heading">
          <span>${isPolish ? "NAWIGACJA I WRAŻENIA" : "NAVIGATION AND EXPERIENCE"}</span>
          <small>${identity.label}</small>
        </div>
        <nav class="experience-menu-links" aria-label="${isPolish ? "Pozostałe strony" : "More destinations"}">${desktopSecondary}</nav>
        <div class="experience-menu-controls">
          <button class="experience-control" id="cinematicToggle" type="button" aria-pressed="false">${isPolish ? "Tryb kinowy" : "Cinematic Mode"}</button>
          <button class="experience-control" id="reducedMotionToggle" type="button" data-reduce-motion-toggle aria-pressed="false">${isPolish ? "Ogranicz ruch" : "Reduce Motion"}</button>
        </div>
        <div class="experience-language" aria-label="${isPolish ? "Zmiana języka" : "Language switch"}">
          <a href="${isPolish ? languageTarget : currentPath}" class="${!isPolish ? "active" : ""}" hreflang="en">English</a>
          <a href="${isPolish ? currentPath : languageTarget}" class="${isPolish ? "active" : ""}" hreflang="pl">Polski</a>
        </div>
      </div>
      <div class="mobile-menu-overlay" id="mobileMenuOverlay" aria-hidden="true" role="dialog" aria-modal="true" tabindex="-1">
        <div class="mobile-menu-panel">
          ${mobilePrimary}
          ${mobileSecondary}
          <button class="mobile-menu-link mobile-menu-button" id="mobileReducedMotionToggle" type="button" data-reduce-motion-toggle aria-pressed="false">${isPolish ? "Ogranicz ruch" : "Reduce Motion"}</button>
          <div class="mobile-lang-switch">
            <a href="${isPolish ? languageTarget : currentPath}" class="${!isPolish ? "active" : ""}" hreflang="en">EN</a>
            <span>|</span>
            <a href="${isPolish ? currentPath : languageTarget}" class="${isPolish ? "active" : ""}" hreflang="pl">PL</a>
          </div>
        </div>
      </div>
      <nav class="mobile-action-dock" aria-label="${isPolish ? "Szybkie akcje" : "Quick actions"}">
        <a class="mobile-dock-action" href="${isPolish ? "/pl/" : "/"}">${isPolish ? "Start" : "Home"}</a>
        <button class="mobile-dock-action" id="mobileDockMenu" type="button" aria-controls="mobileMenuOverlay">Menu</button>
        <button class="mobile-dock-action" id="mobileDockCinemaToggle" type="button" aria-pressed="false">${isPolish ? "Kino" : "Cinema"}</button>
      </nav>`;

    const dock = header.querySelector(".mobile-action-dock");
    if (dock) document.body.appendChild(dock);
  }

  const ensureQuickControls = () => {
    document.querySelectorAll("body > [data-reduce-motion-toggle]").forEach((button) => {
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
      button.setAttribute("tabindex", "-1");
    });

    const popover = document.getElementById("experienceMenu");
    const popoverToggle = document.getElementById("experienceMenuToggle");
    const supportsPopover = typeof HTMLElement.prototype.showPopover === "function";
    document.documentElement.classList.toggle("supports-popover", supportsPopover);

    if (!supportsPopover && popover && popoverToggle) {
      popover.dataset.fallbackClosed = "true";
      popoverToggle.removeAttribute("popovertarget");
      popoverToggle.addEventListener("click", () => {
        const closed = popover.dataset.fallbackClosed === "true";
        popover.dataset.fallbackClosed = closed ? "false" : "true";
        popoverToggle.setAttribute("aria-expanded", String(closed));
      });
    }
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
  document.body.dataset.world = worldForCurrentPath();
  if (!isDocumentStudio) ensureExperienceDecor();
  ensureQuickControls();
  if (!isDocumentStudio) scheduleFinalHero();

  let experienceProgressTicking = false;
  const updateExperienceProgress = () => {
    if (experienceProgressTicking) return;
    experienceProgressTicking = true;
    window.requestAnimationFrame(() => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max((window.scrollY || 0) / max, 0), 1);
      document.documentElement.style.setProperty("--experience-scroll-progress", progress.toFixed(4));
      experienceProgressTicking = false;
    });
  };

  updateExperienceProgress();
  window.addEventListener("scroll", updateExperienceProgress, { passive: true });

  const updateHeaderSurface = () => {
    header?.classList.toggle("is-scrolled", (window.scrollY || 0) > 24);
  };

  updateHeaderSurface();
  window.addEventListener("scroll", updateHeaderSurface, { passive: true });
  window.addEventListener("resize", scheduleFinalHero, { passive: true });
  document.addEventListener("DOMContentLoaded", scheduleFinalHero, { once: true });
  window.addEventListener("load", scheduleFinalHero, { once: true });

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
  document.getElementById("mobileDockMenu")?.addEventListener("click", window.toggleMobileMenu);
  menu?.addEventListener("click", (event) => {
    if (event.target === menu || event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
