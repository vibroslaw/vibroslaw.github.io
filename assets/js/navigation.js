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
      :root{--experience-accent-rgb:208,173,104;--nav-accent-rgb:var(--experience-accent-rgb);--experience-lite-duration:150ms;--experience-cinematic-duration:440ms;--mobile-dock-height:56px}
      body[data-world="raport"]{--experience-accent-rgb:202,86,62}body[data-world="sztab"]{--experience-accent-rgb:183,140,88}body[data-world="music"]{--experience-accent-rgb:157,139,197}body[data-world="between"]{--experience-accent-rgb:131,168,160}
      [data-nav-key="raport"]{--nav-accent-rgb:202,86,62}[data-nav-key="sztab"]{--nav-accent-rgb:183,140,88}[data-nav-key="music"]{--nav-accent-rgb:157,139,197}[data-nav-key="between"]{--nav-accent-rgb:131,168,160}[data-nav-key="home"]{--nav-accent-rgb:208,173,104}[data-nav-key="institutions"]{--nav-accent-rgb:202,182,132}[data-nav-key="author"]{--nav-accent-rgb:226,209,172}[data-nav-key="press"]{--nav-accent-rgb:178,157,119}[data-nav-key="contact"]{--nav-accent-rgb:225,193,126}
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
      html body.navbar-unified .site-header{background:linear-gradient(180deg,rgba(5,4,3,.72),rgba(5,4,3,.20),transparent)!important;border-bottom-color:rgba(201,178,143,.08)!important;box-shadow:none!important;transition:background 180ms ease,border-color 180ms ease,box-shadow 180ms ease,opacity 180ms ease,transform 240ms ease,filter 240ms ease!important}
      html body.navbar-unified .site-header.is-scrolled,html body.navbar-unified.cinematic-mode .site-header.is-scrolled{opacity:1!important;transform:none!important;filter:none!important;background:rgba(7,6,5,.92)!important;border-bottom-color:rgba(201,178,143,.18)!important;box-shadow:0 16px 42px rgba(0,0,0,.32)!important;backdrop-filter:blur(18px) saturate(118%)!important;-webkit-backdrop-filter:blur(18px) saturate(118%)!important}
      html body.navbar-unified .site-header a:focus-visible,html body.navbar-unified .site-header button:focus-visible{outline:1px solid rgba(201,178,143,.88)!important;outline-offset:4px!important;box-shadow:0 0 0 4px rgba(201,178,143,.16),0 0 24px rgba(var(--experience-accent-rgb),.18)!important}
      @media(min-width:901px) and (pointer:fine){html body.navbar-unified.experience-cinematic .site-header,html body.navbar-unified.cinematic-mode .site-header,html[data-experience="cinematic"] body.navbar-unified .site-header{background:linear-gradient(180deg,rgba(5,4,3,.42),rgba(5,4,3,.12),transparent)!important;border-bottom-color:rgba(201,178,143,.055)!important;box-shadow:0 18px 48px rgba(0,0,0,.12)!important;backdrop-filter:blur(12px) saturate(118%)!important;-webkit-backdrop-filter:blur(12px) saturate(118%)!important;transition:background 260ms ease,border-color 260ms ease,box-shadow 260ms ease,opacity 360ms cubic-bezier(.2,.72,.2,1),transform 360ms cubic-bezier(.2,.72,.2,1),filter 360ms cubic-bezier(.2,.72,.2,1)!important}html body.navbar-unified.experience-cinematic .site-header.nav-cinematic-hidden,html body.navbar-unified.cinematic-mode .site-header.nav-cinematic-hidden,html[data-experience="cinematic"] body.navbar-unified .site-header.nav-cinematic-hidden{opacity:.18!important;transform:translateY(-68%) scale(.992)!important;filter:blur(.25px) saturate(1.05)!important;background:linear-gradient(180deg,rgba(5,4,3,.24),rgba(5,4,3,.04),transparent)!important;border-bottom-color:rgba(201,178,143,.04)!important;box-shadow:none!important}html body.navbar-unified.experience-cinematic .site-header.nav-cinematic-peek,html body.navbar-unified.cinematic-mode .site-header.nav-cinematic-peek,html[data-experience="cinematic"] body.navbar-unified .site-header.nav-cinematic-peek,html body.navbar-unified.experience-cinematic .site-header:hover,html body.navbar-unified.cinematic-mode .site-header:hover,html[data-experience="cinematic"] body.navbar-unified .site-header:hover,html body.navbar-unified.experience-cinematic .site-header:focus-within,html body.navbar-unified.cinematic-mode .site-header:focus-within,html[data-experience="cinematic"] body.navbar-unified .site-header:focus-within{opacity:1!important;transform:none!important;filter:none!important;background:linear-gradient(180deg,rgba(5,4,3,.64),rgba(5,4,3,.18),transparent)!important;border-bottom-color:rgba(201,178,143,.12)!important;box-shadow:0 18px 48px rgba(0,0,0,.22)!important}}
      @media(prefers-reduced-motion:reduce){html body.navbar-unified .site-header.nav-cinematic-hidden,html body.navbar-unified .site-header.nav-cinematic-peek{opacity:1!important;transform:none!important;filter:none!important}}
      .experience-menu-toggle{position:relative;min-height:38px;padding:0 15px;border:1px solid rgba(201,178,143,.24);border-radius:999px;background:rgba(255,255,255,.025);color:rgba(241,234,219,.82);font:600 .62rem/1 Inter,sans-serif;letter-spacing:.10em;text-transform:uppercase;cursor:pointer;overflow:hidden}
      .experience-menu-toggle::before{content:"";position:absolute;inset:4px;border-radius:inherit;background:radial-gradient(circle at 25% 20%,rgba(var(--experience-accent-rgb),.18),transparent 42%);opacity:.65;pointer-events:none}
      .experience-menu-toggle span{position:relative;z-index:1}
      .experience-menu-toggle:hover,.experience-menu-toggle:focus-visible{color:#f1eadb;border-color:rgba(201,178,143,.52);background:rgba(var(--experience-accent-rgb),.10);box-shadow:0 0 24px rgba(var(--experience-accent-rgb),.10)}
      .experience-menu-popover{position:fixed;inset:78px clamp(16px,2.4vw,34px) auto auto;width:min(760px,calc(100vw - 32px));margin:0;padding:0;border:1px solid rgba(201,178,143,.30);border-radius:28px;background:radial-gradient(circle at 14% 0%,rgba(var(--experience-accent-rgb),.18),transparent 28rem),radial-gradient(circle at 92% 18%,rgba(241,234,219,.08),transparent 18rem),linear-gradient(145deg,rgba(31,26,19,.985),rgba(6,5,4,.99));color:#f1eadb;box-shadow:0 40px 110px rgba(0,0,0,.62),0 0 52px rgba(var(--experience-accent-rgb),.10);backdrop-filter:blur(24px) saturate(120%);-webkit-backdrop-filter:blur(24px) saturate(120%);overflow:hidden}
      .experience-menu-popover::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(var(--experience-accent-rgb),.08),transparent 22%,transparent 78%,rgba(201,178,143,.06)),repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 1px,transparent 1px 9px);opacity:.72;pointer-events:none}
      .experience-menu-popover:popover-open,.experience-menu-popover[data-fallback-closed="false"]{display:grid;gap:17px;padding:22px}.experience-menu-popover[data-fallback-closed="true"]{display:none!important}
      .experience-command-panel{position:relative;z-index:1;display:grid;gap:18px;padding:22px}
      .experience-menu-heading{display:grid;grid-template-columns:minmax(0,1fr) minmax(190px,auto);gap:6px 16px;align-items:center;padding-bottom:17px;border-bottom:1px solid rgba(201,178,143,.16)}
      .experience-menu-heading span,.experience-command-label{color:rgba(208,173,104,.88);font-size:.62rem;letter-spacing:.17em;text-transform:uppercase}.experience-menu-heading small{font-family:Georgia,serif;font-size:1.08rem;letter-spacing:.04em}
      .experience-menu-heading>span,.experience-menu-heading>small{grid-column:1}.experience-menu-heading>.experience-active-world{grid-column:2;grid-row:1/span 2}.experience-active-world{display:grid;grid-template-columns:42px minmax(0,1fr);gap:10px;align-items:center;min-height:46px;padding:7px 10px;border:1px solid rgba(var(--experience-accent-rgb),.24);border-radius:17px;background:linear-gradient(135deg,rgba(var(--experience-accent-rgb),.12),rgba(255,255,255,.025));box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
      .experience-world-orb,.experience-route-orb{display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(var(--nav-accent-rgb),.34);border-radius:999px;background:radial-gradient(circle at 35% 24%,rgba(255,255,255,.22),transparent 34%),rgba(var(--nav-accent-rgb),.13);color:#f1eadb;font:700 .62rem/1 Inter,sans-serif;letter-spacing:.08em;box-shadow:0 0 22px rgba(var(--nav-accent-rgb),.10)}
      .experience-world-orb{--nav-accent-rgb:var(--experience-accent-rgb);width:34px;height:34px}.experience-route-orb{width:38px;height:38px;flex:0 0 auto}
      .experience-active-copy{display:grid;gap:2px;min-width:0}.experience-active-copy strong{font:600 .78rem/1.1 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.experience-active-copy em{color:rgba(241,234,219,.56);font:.68rem/1.1 Inter,sans-serif;font-style:normal}
      .experience-command-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,.85fr);gap:14px}.experience-command-section{display:grid;gap:10px}.experience-menu-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.experience-route-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.experience-route-grid-secondary{grid-template-columns:1fr}.experience-route-group-label{grid-column:1/-1;margin:2px 0 0}.experience-route-group-label:first-child{margin-top:0}
      .experience-route-card{position:relative;min-height:74px;display:grid;grid-template-columns:38px minmax(0,1fr) 18px;gap:12px;align-items:center;padding:12px;border:1px solid rgba(201,178,143,.14);border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.018));color:rgba(241,234,219,.78);text-decoration:none;overflow:hidden}
      .experience-route-card::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 0% 0%,rgba(var(--nav-accent-rgb),.18),transparent 58%);opacity:.52;transition:opacity .22s ease,transform .22s ease;pointer-events:none}.experience-route-card:hover,.experience-route-card:focus-visible,.experience-route-card.is-active{border-color:rgba(var(--nav-accent-rgb),.42);color:#f1eadb;transform:translateY(-1px);box-shadow:0 18px 42px rgba(0,0,0,.24),0 0 28px rgba(var(--nav-accent-rgb),.08)}.experience-route-card:hover::before,.experience-route-card:focus-visible::before,.experience-route-card.is-active::before{opacity:.9;transform:scale(1.05)}
      .experience-route-copy{position:relative;z-index:1;display:grid;gap:5px;min-width:0}.experience-route-copy strong{font:700 .72rem/1.08 Inter,sans-serif;letter-spacing:.095em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.experience-route-copy small{color:rgba(241,234,219,.56);font:.71rem/1.35 Inter,sans-serif;letter-spacing:.01em}.experience-route-marker{position:relative;width:7px;height:7px;border-radius:999px;background:rgba(var(--nav-accent-rgb),.62);box-shadow:0 0 18px rgba(var(--nav-accent-rgb),.32);opacity:.34}.experience-route-card.is-active .experience-route-marker{opacity:1}
      .experience-command-tools{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:15px;border-top:1px solid rgba(201,178,143,.14)}.experience-menu-controls,.experience-language{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.experience-control,.experience-language a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 12px;border:1px solid rgba(201,178,143,.16);border-radius:14px;background:rgba(255,255,255,.035);color:rgba(241,234,219,.78);font:700 .68rem/1.2 Inter,sans-serif;letter-spacing:.075em;text-align:center;text-decoration:none;text-transform:uppercase;cursor:pointer}.experience-control:hover,.experience-control:focus-visible,.experience-control[aria-pressed="true"],.experience-language a:hover,.experience-language a:focus-visible,.experience-language a.active{border-color:rgba(201,178,143,.45);background:rgba(var(--experience-accent-rgb),.11);color:#f1eadb}
      @media(max-width:780px){.experience-menu-popover{width:calc(100vw - 20px);inset:70px 10px auto 10px}.experience-menu-heading,.experience-command-grid,.experience-command-tools,.experience-menu-links,.experience-menu-controls,.experience-language{grid-template-columns:1fr}.experience-menu-heading>.experience-active-world{grid-column:1;grid-row:auto}.experience-route-grid{grid-template-columns:1fr}}
      .mobile-action-dock,.experience-edge,.experience-progress-rail,.experience-context-rail{display:none}.mobile-cinematic-fab,.floating-tools.veritas-quick-controls{display:none!important}
      @media(min-width:901px){#mobileNavToggle{display:none!important}}@media(max-width:900px){.experience-menu-toggle{display:none}}@media(max-width:760px){#mobileNavToggle{display:none!important}}
    `;
    style.textContent += `
      @media(min-width:1180px){body.experience-cinematic .experience-edge,body.experience-cinematic .experience-progress-rail,body.experience-cinematic .experience-context-rail{display:block;position:fixed;z-index:40;pointer-events:none}body.experience-cinematic .experience-edge{top:14vh;bottom:12vh;width:1px;background:linear-gradient(180deg,transparent,rgba(var(--experience-accent-rgb),.42),transparent);box-shadow:0 0 20px rgba(var(--experience-accent-rgb),.18)}body.experience-cinematic .experience-edge-left{left:18px}body.experience-cinematic .experience-edge-right{right:18px}body.experience-cinematic .experience-progress-rail{top:28vh;right:12px;width:3px;height:42vh;border-radius:999px;background:rgba(255,255,255,.06);overflow:hidden}.experience-progress-fill{position:absolute;inset:0;transform:scaleY(var(--experience-scroll-progress,0));transform-origin:top;background:linear-gradient(180deg,rgba(var(--experience-accent-rgb),.96),rgba(var(--experience-accent-rgb),.24))}body.experience-cinematic .experience-context-rail{left:28px;top:50%;max-width:160px;color:rgba(241,234,219,.48);font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;transform:rotate(-90deg) translateX(-50%);transform-origin:left top}}
      body.experience-cinematic .vh-card,body.experience-cinematic .world-portal-card{transform-style:preserve-3d}@media(hover:hover) and (pointer:fine){body.experience-cinematic .vh-card:hover,body.experience-cinematic .world-portal-card:hover{transform:translateY(-4px) perspective(900px) rotateX(.5deg)}}
      @media(max-width:760px){html body.navbar-unified{padding-bottom:calc(74px + env(safe-area-inset-bottom))!important}html body.veritas-universe .vh-hero,html body.veritas-universe .vh-hero.vh-hero-compact{min-height:82svh!important;height:auto!important}html body.veritas-universe .vh-hero-media.has-future-hero::before,html body.veritas-universe .vh-hero-media.has-final-hero::before{background-position:center,center,var(--vh-hero-position-mobile,center)!important;transform:scale(1.025)!important;filter:saturate(1.03) contrast(1.04) brightness(1.02)!important;will-change:auto!important}html body.navbar-unified .site-header,html body.navbar-unified.cinematic-mode .site-header{opacity:1!important;transform:none!important;filter:none!important}.mobile-action-dock{position:fixed;left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));top:auto!important;transform:none!important;contain:layout paint;z-index:10020;height:var(--mobile-dock-height);display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:6px;border:1px solid rgba(201,178,143,.24);border-radius:20px;background:rgba(7,6,5,.92);box-shadow:0 20px 54px rgba(0,0,0,.46);backdrop-filter:blur(18px) saturate(116%);-webkit-backdrop-filter:blur(18px) saturate(116%)}#mobileDockCinemaToggle{display:inline-flex!important}.mobile-dock-action{min-width:0;min-height:44px;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:14px;background:transparent;color:rgba(241,234,219,.76);font:600 .68rem/1 Inter,sans-serif;letter-spacing:.08em;text-decoration:none;text-transform:uppercase}.mobile-dock-action:focus-visible,.mobile-dock-action[aria-pressed="true"]{border-color:rgba(201,178,143,.38);background:rgba(var(--experience-accent-rgb),.12);color:#f1eadb}body.mobile-menu-open .mobile-action-dock{opacity:0;pointer-events:none}.mobile-menu-panel{padding-bottom:calc(var(--mobile-dock-height) + 30px + env(safe-area-inset-bottom))!important}.vh-button,.mobile-menu-link,.mobile-menu-button,button,[role="button"]{min-height:44px}body:not(.psx-page) .vh-main>.vh-section:nth-of-type(n+3){content-visibility:auto;contain-intrinsic-size:auto 760px}body.experience-lite .reveal{transform:none!important;filter:none!important}}
      @media(prefers-reduced-motion:reduce){.experience-edge,.experience-progress-rail,.experience-context-rail{display:none!important}}
    `;
    style.textContent += `
      @font-face{font-family:VeritasNavCinzel;src:url("/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf") format("truetype");font-weight:600;font-style:normal;font-display:swap}
      html body.navbar-unified{--nav-luxury-black:5,4,3;--nav-luxury-panel:10,8,6;--nav-luxury-gold:216,182,107;--nav-luxury-gold-soft:180,145,76;--nav-accent-rgb:var(--nav-luxury-gold)!important;--font-display:VeritasNavCinzel,Georgia,serif}
      html body.navbar-unified .site-header{background:linear-gradient(180deg,rgba(var(--nav-luxury-black),.88),rgba(var(--nav-luxury-black),.58) 58%,rgba(var(--nav-luxury-black),.16))!important;border-bottom-color:rgba(var(--nav-luxury-gold),.16)!important;box-shadow:0 14px 36px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.025)!important}
      html body.navbar-unified .site-header.is-scrolled{background:rgba(var(--nav-luxury-black),.94)!important;border-bottom-color:rgba(var(--nav-luxury-gold),.24)!important;box-shadow:0 18px 46px rgba(0,0,0,.38),0 1px 0 rgba(var(--nav-luxury-gold),.10)!important}
      html body.navbar-unified .brand-name,html body.navbar-unified .brand-sub-desktop,html body.navbar-unified .brand-sub-mobile,html body.navbar-unified .desktop-nav-compact .nav-button,html body.navbar-unified .experience-menu-toggle,html body.navbar-unified .experience-command-label,html body.navbar-unified .experience-route-copy strong,html body.navbar-unified .experience-control,html body.navbar-unified .experience-language a,html body.navbar-unified .mobile-dock-action{font-family:VeritasNavCinzel,Georgia,serif!important}
      html body.navbar-unified .brand-name{color:#f5dfaa!important;text-shadow:0 0 22px rgba(var(--nav-luxury-gold),.12)!important;letter-spacing:.145em!important}
      html body.navbar-unified .brand-sub-desktop{color:rgba(229,202,142,.62)!important;letter-spacing:.22em!important}
      html body.navbar-unified .desktop-nav-compact .nav-button{min-height:34px!important;padding-inline:clamp(6px,.56vw,10px)!important;color:rgba(246,229,189,.68)!important;font-size:clamp(.54rem,.55vw,.66rem)!important;letter-spacing:.11em!important}
      html body.navbar-unified .desktop-nav-compact .nav-button:hover,html body.navbar-unified .desktop-nav-compact .nav-button:focus-visible,html body.navbar-unified .desktop-nav-compact .nav-button.is-active{color:#f7e4b6!important;background:rgba(var(--nav-luxury-gold),.055)!important;border-color:rgba(var(--nav-luxury-gold),.18)!important;box-shadow:0 0 22px rgba(var(--nav-luxury-gold),.075)!important}
      html body.navbar-unified .desktop-nav-compact .nav-button::after{height:1px!important;background:linear-gradient(90deg,transparent,rgba(var(--nav-luxury-gold),.88),rgba(255,241,202,.94),rgba(var(--nav-luxury-gold),.74),transparent)!important;filter:drop-shadow(0 0 8px rgba(var(--nav-luxury-gold),.22))!important}
      html body.navbar-unified .experience-menu-toggle{min-height:36px!important;min-width:84px!important;display:inline-grid!important;grid-template-columns:18px auto 8px!important;gap:7px!important;align-items:center!important;padding:0 11px 0 9px!important;border:1px solid rgba(var(--nav-luxury-gold),.32)!important;border-radius:999px!important;background:linear-gradient(180deg,rgba(255,244,205,.055),rgba(var(--nav-luxury-gold),.032) 44%,rgba(0,0,0,.22)),rgba(3,3,2,.42)!important;color:rgba(247,226,177,.82)!important;font-size:.54rem!important;letter-spacing:.16em!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.055),inset 0 -1px 0 rgba(0,0,0,.46),0 0 0 1px rgba(0,0,0,.28),0 12px 26px rgba(0,0,0,.18)!important}
      html body.navbar-unified .experience-menu-toggle::before{content:"";position:relative!important;inset:auto!important;width:18px!important;height:18px!important;border:1px solid rgba(var(--nav-luxury-gold),.46)!important;border-radius:999px!important;background:radial-gradient(circle at 38% 28%,rgba(255,245,214,.38),transparent 27%),radial-gradient(circle,rgba(var(--nav-luxury-gold),.20),rgba(var(--nav-luxury-gold),.055) 58%,transparent 60%)!important;opacity:1!important;box-shadow:0 0 14px rgba(var(--nav-luxury-gold),.12),inset 0 0 8px rgba(var(--nav-luxury-gold),.10)!important}
      html body.navbar-unified .experience-menu-toggle::after{content:"";width:5px;height:5px;border-right:1px solid rgba(var(--nav-luxury-gold),.78);border-bottom:1px solid rgba(var(--nav-luxury-gold),.78);transform:rotate(45deg) translateY(-1px);transition:transform .24s ease,opacity .24s ease;opacity:.74}
      html body.navbar-unified .experience-menu-toggle span{position:relative!important;z-index:1;display:inline-flex;align-items:center;line-height:1}
      html body.navbar-unified .experience-menu-toggle:hover,html body.navbar-unified .experience-menu-toggle:focus-visible,html body.navbar-unified .experience-menu-toggle[aria-expanded="true"]{color:#f9e8be!important;border-color:rgba(var(--nav-luxury-gold),.56)!important;background:linear-gradient(180deg,rgba(255,244,205,.09),rgba(var(--nav-luxury-gold),.065) 48%,rgba(0,0,0,.20)),rgba(5,4,3,.55)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.075),0 0 0 1px rgba(var(--nav-luxury-gold),.10),0 16px 34px rgba(0,0,0,.26),0 0 28px rgba(var(--nav-luxury-gold),.13)!important}
      html body.navbar-unified .experience-menu-toggle:hover::before,html body.navbar-unified .experience-menu-toggle:focus-visible::before,html body.navbar-unified .experience-menu-toggle[aria-expanded="true"]::before{border-color:rgba(var(--nav-luxury-gold),.74)!important;box-shadow:0 0 18px rgba(var(--nav-luxury-gold),.20),inset 0 0 9px rgba(var(--nav-luxury-gold),.14)!important}
      html body.navbar-unified .experience-menu-toggle[aria-expanded="true"]::after{transform:rotate(225deg) translate(-1px,-1px);opacity:1}
      html body.navbar-unified .experience-menu-popover{width:min(460px,calc(100vw - 32px))!important;inset:72px clamp(14px,2.2vw,30px) auto auto!important;border-color:rgba(var(--nav-luxury-gold),.34)!important;border-radius:22px!important;background:radial-gradient(circle at 18% 0%,rgba(var(--nav-luxury-gold),.12),transparent 18rem),linear-gradient(145deg,rgba(var(--nav-luxury-panel),.985),rgba(3,3,2,.995))!important;box-shadow:0 34px 92px rgba(0,0,0,.62),0 0 0 1px rgba(var(--nav-luxury-gold),.08),0 0 44px rgba(var(--nav-luxury-gold),.08)!important}
      html body.navbar-unified .experience-menu-popover:popover-open,html body.navbar-unified .experience-menu-popover[data-fallback-closed="false"]{padding:14px!important;gap:11px!important}
      html body.navbar-unified .experience-menu-popover::before{background:linear-gradient(90deg,rgba(var(--nav-luxury-gold),.07),transparent 30%,transparent 70%,rgba(var(--nav-luxury-gold),.045)),repeating-linear-gradient(90deg,rgba(255,228,170,.012) 0 1px,transparent 1px 11px)!important;opacity:.7!important}
      html body.navbar-unified .experience-command-panel{padding:0!important;gap:11px!important}
      html body.navbar-unified .experience-menu-heading{grid-template-columns:minmax(0,1fr) auto!important;padding-bottom:11px!important;border-bottom-color:rgba(var(--nav-luxury-gold),.16)!important}
      html body.navbar-unified .experience-menu-heading span,html body.navbar-unified .experience-command-label{color:rgba(var(--nav-luxury-gold),.86)!important;font-size:.54rem!important;letter-spacing:.20em!important}
      html body.navbar-unified .experience-menu-heading small{font-family:VeritasNavCinzel,Georgia,serif!important;color:#f5dfaa!important;font-size:.82rem!important;letter-spacing:.13em!important;text-transform:uppercase!important}
      html body.navbar-unified .experience-active-world{min-height:36px!important;grid-template-columns:42px minmax(0,1fr)!important;padding:5px 8px!important;border-radius:13px!important;border-color:rgba(var(--nav-luxury-gold),.23)!important;background:linear-gradient(135deg,rgba(var(--nav-luxury-gold),.10),rgba(255,255,255,.018))!important}
      html body.navbar-unified .experience-world-orb,html body.navbar-unified .experience-route-orb{border-color:rgba(var(--nav-luxury-gold),.36)!important;background:radial-gradient(circle at 35% 25%,rgba(255,245,215,.24),transparent 34%),rgba(var(--nav-luxury-gold),.10)!important;color:#f5dfaa!important;box-shadow:0 0 18px rgba(var(--nav-luxury-gold),.10)!important}
      html body.navbar-unified .experience-world-orb{width:27px!important;height:27px!important;font-size:.50rem!important}
      html body.navbar-unified .experience-route-orb{width:28px!important;height:28px!important;font-size:.50rem!important}
      html body.navbar-unified .experience-active-copy strong{color:#f5dfaa!important;font-size:.60rem!important;letter-spacing:.12em!important}.experience-active-copy em{color:rgba(231,204,149,.50)!important;font-size:.56rem!important}
      html body.navbar-unified .experience-menu-links{grid-template-columns:1fr!important;gap:6px!important}
      html body.navbar-unified .experience-route-card{min-height:46px!important;grid-template-columns:28px minmax(0,1fr) 8px!important;gap:9px!important;padding:8px 9px!important;border-radius:13px!important;border-color:rgba(var(--nav-luxury-gold),.13)!important;background:linear-gradient(135deg,rgba(255,255,255,.028),rgba(var(--nav-luxury-gold),.022)),rgba(0,0,0,.16)!important;color:rgba(246,229,189,.72)!important}
      html body.navbar-unified .experience-route-card::before{background:radial-gradient(circle at 0% 0%,rgba(var(--nav-luxury-gold),.12),transparent 58%)!important}
      html body.navbar-unified .experience-route-card:hover,html body.navbar-unified .experience-route-card:focus-visible,html body.navbar-unified .experience-route-card.is-active{border-color:rgba(var(--nav-luxury-gold),.36)!important;background:linear-gradient(135deg,rgba(var(--nav-luxury-gold),.09),rgba(255,255,255,.025)),rgba(0,0,0,.24)!important;box-shadow:0 16px 34px rgba(0,0,0,.28),0 0 24px rgba(var(--nav-luxury-gold),.08)!important;color:#f8e7bd!important}
      html body.navbar-unified .experience-route-copy{gap:1px!important}html body.navbar-unified .experience-route-copy strong{font-size:.57rem!important;letter-spacing:.13em!important;color:inherit!important}html body.navbar-unified .experience-route-copy small{display:none!important}
      html body.navbar-unified .experience-route-marker{width:4px!important;height:4px!important;background:rgba(var(--nav-luxury-gold),.72)!important;box-shadow:0 0 13px rgba(var(--nav-luxury-gold),.34)!important}
      html body.navbar-unified .experience-command-tools{gap:8px!important;padding-top:10px!important;border-top-color:rgba(var(--nav-luxury-gold),.14)!important}
      html body.navbar-unified .experience-control,html body.navbar-unified .experience-language a{min-height:34px!important;border-radius:11px!important;border-color:rgba(var(--nav-luxury-gold),.16)!important;background:rgba(0,0,0,.18)!important;color:rgba(246,229,189,.68)!important;font-size:.54rem!important;letter-spacing:.12em!important}
      html body.navbar-unified .experience-control:hover,html body.navbar-unified .experience-control:focus-visible,html body.navbar-unified .experience-control[aria-pressed="true"],html body.navbar-unified .experience-language a:hover,html body.navbar-unified .experience-language a:focus-visible,html body.navbar-unified .experience-language a.active{border-color:rgba(var(--nav-luxury-gold),.36)!important;background:rgba(var(--nav-luxury-gold),.075)!important;color:#f8e7bd!important}
      @media(min-width:901px) and (pointer:fine){html body.navbar-unified.experience-cinematic .site-header.nav-cinematic-hidden,html body.navbar-unified.cinematic-mode .site-header.nav-cinematic-hidden,html[data-experience="cinematic"] body.navbar-unified .site-header.nav-cinematic-hidden{opacity:.20!important;background:linear-gradient(180deg,rgba(var(--nav-luxury-black),.30),rgba(var(--nav-luxury-black),.05),transparent)!important}}
      @media(max-width:760px){html body.navbar-unified .mobile-action-dock{border-color:rgba(var(--nav-luxury-gold),.30)!important;background:rgba(var(--nav-luxury-black),.94)!important;box-shadow:0 22px 58px rgba(0,0,0,.52),0 0 28px rgba(var(--nav-luxury-gold),.06)!important}.mobile-dock-action{color:rgba(246,229,189,.72)!important}.mobile-dock-action:focus-visible,.mobile-dock-action[aria-pressed="true"]{border-color:rgba(var(--nav-luxury-gold),.38)!important;background:rgba(var(--nav-luxury-gold),.08)!important;color:#f8e7bd!important}}
    `;
    style.textContent += `
      html body.navbar-unified .experience-menu-toggle{width:46px!important;min-width:46px!important;max-width:46px!important;height:36px!important;min-height:36px!important;display:grid!important;grid-template-columns:1fr!important;place-items:center!important;gap:0!important;padding:0!important;border-color:rgba(var(--nav-luxury-gold),.34)!important;background:linear-gradient(180deg,rgba(255,244,205,.07),rgba(var(--nav-luxury-gold),.035) 46%,rgba(0,0,0,.24)),rgba(3,3,2,.48)!important}
      html body.navbar-unified .experience-menu-toggle::before{display:none!important}
      html body.navbar-unified .experience-menu-toggle::after{position:absolute!important;right:7px!important;bottom:7px!important;width:4px!important;height:4px!important;border:0!important;border-radius:999px!important;background:rgba(var(--nav-luxury-gold),.78)!important;box-shadow:0 0 10px rgba(var(--nav-luxury-gold),.32)!important;transform:none!important;opacity:.72!important}
      html body.navbar-unified .experience-menu-toggle[aria-expanded="true"]::after{opacity:1!important;transform:scale(1.55)!important;background:#f8e7bd!important}
      html body.navbar-unified .experience-menu-favicon{display:block!important;width:21px!important;height:21px!important;background:url("/favicon.ico") center/contain no-repeat!important;filter:drop-shadow(0 0 8px rgba(var(--nav-luxury-gold),.20))!important;transition:transform .28s ease,filter .28s ease,opacity .28s ease!important}
      html body.navbar-unified .experience-menu-label{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;border:0!important}
      html body.navbar-unified .experience-menu-toggle:hover .experience-menu-favicon,html body.navbar-unified .experience-menu-toggle:focus-visible .experience-menu-favicon,html body.navbar-unified .experience-menu-toggle[aria-expanded="true"] .experience-menu-favicon{transform:scale(1.08)!important;filter:drop-shadow(0 0 12px rgba(var(--nav-luxury-gold),.34))!important}
      html body.navbar-unified .experience-route-card{grid-template-columns:52px minmax(0,1fr) 8px!important;min-height:48px!important}
      html body.navbar-unified .experience-route-thumb,html body.navbar-unified .experience-world-thumb{position:relative!important;display:block!important;overflow:hidden!important;border:1px solid rgba(var(--nav-luxury-gold),.18)!important;background:rgba(0,0,0,.24)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 0 16px rgba(var(--nav-luxury-gold),.055)!important}
      html body.navbar-unified .experience-route-thumb{width:52px!important;height:32px!important;border-radius:10px!important}
      html body.navbar-unified .experience-world-thumb{width:42px!important;height:28px!important;border-radius:10px!important}
      html body.navbar-unified .experience-route-thumb::before,html body.navbar-unified .experience-world-thumb::before{content:""!important;position:absolute!important;inset:-8%!important;background-image:linear-gradient(90deg,rgba(5,4,3,.42),rgba(5,4,3,.04),rgba(5,4,3,.46)),var(--route-thumb)!important;background-size:cover!important;background-position:center!important;opacity:.70!important;transform:scale(1.01)!important;transition:transform .34s cubic-bezier(.2,.72,.2,1),opacity .34s ease,filter .34s ease!important;filter:saturate(.88) contrast(1.05) brightness(.88)!important}
      html body.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.navbar-unified .experience-route-card.is-active .experience-route-thumb::before,html body.navbar-unified .experience-active-world:hover .experience-world-thumb::before{opacity:.94!important;transform:scale(1.13)!important;filter:saturate(1.08) contrast(1.08) brightness(1.02)!important}
      html body.reduced-motion.navbar-unified .experience-route-thumb::before,html body.reduced-motion.navbar-unified .experience-world-thumb::before,html body.reduce-motion.navbar-unified .experience-route-thumb::before,html body.reduce-motion.navbar-unified .experience-world-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-route-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-world-thumb::before{transition:none!important;transform:scale(1.01)!important}
      html body.reduced-motion.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.reduced-motion.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.reduced-motion.navbar-unified .experience-route-card.is-active .experience-route-thumb::before,html body.reduced-motion.navbar-unified .experience-active-world:hover .experience-world-thumb::before,html body.reduce-motion.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.reduce-motion.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.reduce-motion.navbar-unified .experience-route-card.is-active .experience-route-thumb::before,html body.reduce-motion.navbar-unified .experience-active-world:hover .experience-world-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-route-card.is-active .experience-route-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-active-world:hover .experience-world-thumb::before{transform:scale(1.01)!important}
      @media(prefers-reduced-motion:reduce){html body.navbar-unified .experience-route-thumb::before,html body.navbar-unified .experience-world-thumb::before{transition:none!important;transform:scale(1.01)!important}html body.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.navbar-unified .experience-route-card.is-active .experience-route-thumb::before,html body.navbar-unified .experience-active-world:hover .experience-world-thumb::before{transform:scale(1.01)!important}}
      html body.navbar-unified .experience-route-card{isolation:isolate!important;grid-template-columns:minmax(0,1fr) 8px!important;min-height:66px!important;gap:10px!important;padding:12px 12px 12px 14px!important;overflow:hidden!important;border-color:rgba(var(--nav-luxury-gold),.18)!important;background:linear-gradient(135deg,rgba(255,244,205,.04),rgba(var(--nav-luxury-gold),.03)),rgba(5,4,3,.72)!important;color:#f8e7bd!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.045),0 10px 24px rgba(0,0,0,.18)!important}
      html body.navbar-unified .experience-route-card::before{content:""!important;position:absolute!important;inset:0!important;z-index:1!important;background:linear-gradient(90deg,rgba(4,3,2,.90) 0%,rgba(4,3,2,.72) 36%,rgba(4,3,2,.42) 66%,rgba(4,3,2,.80) 100%),linear-gradient(180deg,rgba(255,244,205,.11),transparent 40%,rgba(0,0,0,.32))!important;opacity:1!important;transform:none!important;pointer-events:none!important;transition:background .32s ease,opacity .32s ease!important}
      html body.navbar-unified .experience-route-card::after{content:""!important;position:absolute!important;left:13px!important;right:13px!important;bottom:7px!important;z-index:3!important;height:1px!important;border-radius:999px!important;background:linear-gradient(90deg,rgba(var(--nav-luxury-gold),.02),rgba(var(--nav-luxury-gold),.72),rgba(255,241,202,.68),rgba(var(--nav-luxury-gold),.04))!important;opacity:.24!important;transform-origin:left center!important;pointer-events:none!important;transition:opacity .32s ease,filter .32s ease!important}
      html body.navbar-unified .experience-route-thumb{position:absolute!important;inset:0!important;z-index:0!important;width:100%!important;height:100%!important;border:0!important;border-radius:inherit!important;background:#050403!important;box-shadow:none!important}
      html body.navbar-unified .experience-route-thumb::before{inset:-10%!important;background-image:var(--route-thumb)!important;background-size:cover!important;background-position:center!important;opacity:.48!important;transform:scale(1.04)!important;filter:saturate(.88) contrast(1.08) brightness(.80)!important}
      html body.navbar-unified .experience-route-copy{position:relative!important;z-index:4!important;gap:3px!important;min-width:0!important;padding-right:8px!important;text-shadow:0 1px 2px rgba(0,0,0,.72),0 0 18px rgba(0,0,0,.54)!important}
      html body.navbar-unified .experience-route-copy strong{display:block!important;color:#ffe8aa!important;font-size:.62rem!important;letter-spacing:.135em!important;line-height:1.08!important;text-shadow:0 0 14px rgba(var(--nav-luxury-gold),.16),0 1px 2px rgba(0,0,0,.80)!important}
      html body.navbar-unified .experience-route-copy small{display:block!important;color:rgba(255,246,222,.72)!important;font-size:.61rem!important;line-height:1.22!important;letter-spacing:.015em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important}
      html body.navbar-unified .experience-route-marker{position:relative!important;z-index:4!important;align-self:center!important;background:#f4d58d!important;box-shadow:0 0 14px rgba(var(--nav-luxury-gold),.44)!important;opacity:.72!important}
      html body.navbar-unified .experience-route-card:hover,html body.navbar-unified .experience-route-card:focus-visible,html body.navbar-unified .experience-route-card.is-active{border-color:rgba(var(--nav-luxury-gold),.42)!important;background:linear-gradient(135deg,rgba(var(--nav-luxury-gold),.08),rgba(255,255,255,.025)),rgba(5,4,3,.76)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 16px 34px rgba(0,0,0,.30),0 0 26px rgba(var(--nav-luxury-gold),.10)!important;color:#fff0c3!important}
      html body.navbar-unified .experience-route-card:hover::before,html body.navbar-unified .experience-route-card:focus-visible::before,html body.navbar-unified .experience-route-card.is-active::before{background:linear-gradient(90deg,rgba(4,3,2,.86) 0%,rgba(4,3,2,.62) 34%,rgba(4,3,2,.26) 66%,rgba(4,3,2,.72) 100%),linear-gradient(180deg,rgba(255,244,205,.16),transparent 42%,rgba(0,0,0,.26))!important;transform:none!important}
      html body.navbar-unified .experience-route-card:hover::after,html body.navbar-unified .experience-route-card:focus-visible::after,html body.navbar-unified .experience-route-card.is-active::after{opacity:.76!important;filter:drop-shadow(0 0 8px rgba(var(--nav-luxury-gold),.28))!important}
      html body.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.navbar-unified .experience-route-card.is-active .experience-route-thumb::before{opacity:.66!important;transform:scale(1.09)!important;filter:saturate(1.04) contrast(1.12) brightness(.96)!important}
      html body.reduced-motion.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.reduced-motion.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.reduced-motion.navbar-unified .experience-route-card.is-active .experience-route-thumb::before,html body.reduce-motion.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.reduce-motion.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.reduce-motion.navbar-unified .experience-route-card.is-active .experience-route-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html[data-experience="reduced"] body.navbar-unified .experience-route-card.is-active .experience-route-thumb::before{transform:scale(1.04)!important}
      @media(prefers-reduced-motion:reduce){html body.navbar-unified .experience-route-card:hover .experience-route-thumb::before,html body.navbar-unified .experience-route-card:focus-visible .experience-route-thumb::before,html body.navbar-unified .experience-route-card.is-active .experience-route-thumb::before{transform:scale(1.04)!important}}
      html body.navbar-unified .experience-route-orb,html body.navbar-unified .experience-world-orb{display:none!important}
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

  const navMeta = isPolish
    ? {
        home: { hero: "/public/assets/heroes/veritas-humanum-hero.webp", description: "Glowna brama swiata Veritas.", group: "worlds" },
        raport: { hero: "/public/assets/heroes/rap-ort-hero.webp", description: "Swiadectwo, pamiec i film.", group: "worlds" },
        sztab: { hero: "/public/assets/heroes/sztab-hero.webp", description: "Pamiec, historia i album.", group: "worlds" },
        between: { hero: "/public/assets/heroes/between-the-lines-hero.webp", description: "Kameralny swiat obrazu i slow.", group: "worlds" },
        music: { hero: "/public/assets/heroes/music-hero.webp", description: "Mapa dzwieku Vibroslawa.", group: "worlds" },
        institutions: { hero: "/public/assets/heroes/for-institutions-hero.webp", description: "Formaty dla instytucji.", group: "support" },
        author: { hero: "/public/assets/heroes/authorial-profile-hero.webp", description: "Profil autorski i metoda.", group: "support" },
        press: { hero: "/public/assets/heroes/press-recognition-hero.webp", description: "Wzmianki, media i slady.", group: "support" },
        contact: { hero: "/public/assets/heroes/contact-hero.webp", description: "Kontakt i wspolpraca.", group: "support" },
      }
    : {
        home: { hero: "/public/assets/heroes/veritas-humanum-hero.webp", description: "Main gateway to Veritas.", group: "worlds" },
        raport: { hero: "/public/assets/heroes/rap-ort-hero.webp", description: "Testimony, memory and film.", group: "worlds" },
        sztab: { hero: "/public/assets/heroes/sztab-hero.webp", description: "Memory, history and album.", group: "worlds" },
        between: { hero: "/public/assets/heroes/between-the-lines-hero.webp", description: "A quiet world of image and words.", group: "worlds" },
        music: { hero: "/public/assets/heroes/music-hero.webp", description: "The sound map of Vibroslaw.", group: "worlds" },
        institutions: { hero: "/public/assets/heroes/for-institutions-hero.webp", description: "Formats for institutions.", group: "support" },
        author: { hero: "/public/assets/heroes/authorial-profile-hero.webp", description: "Author profile and method.", group: "support" },
        press: { hero: "/public/assets/heroes/press-recognition-hero.webp", description: "Mentions, media and traces.", group: "support" },
        contact: { hero: "/public/assets/heroes/contact-hero.webp", description: "Contact and collaboration.", group: "support" },
      };

  const navItems = navConfig.map((item) => {
    const [desktopLabel, mobileLabel] = labels[item.key];
    return {
      ...item,
      ...navMeta[item.key],
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

  const createCommandCardHtml = (item) => {
    const classes = ["experience-route-card", "experience-menu-link", item.active ? "is-active active" : ""].filter(Boolean).join(" ");
    const entry = isWorldPath(normalizePath(item.href)) ? ' data-cinematic-entry="true"' : "";
    const ariaCurrent = item.active ? ' aria-current="page"' : "";
    return `<a class="${classes}" href="${item.href}" data-nav-key="${item.key}" title="${item.mobileLabel}" style="--route-thumb:url('${item.hero}')"${entry}${ariaCurrent}>
      <span class="experience-route-thumb" aria-hidden="true"></span>
      <span class="experience-route-copy"><strong>${item.mobileLabel}</strong><small>${item.description}</small></span>
      <span class="experience-route-marker" aria-hidden="true"></span>
    </a>`;
  };

  const desktopLinks = navItems.slice(0, 5).map((item) => createLinkHtml(item, "nav-button", "desktop")).join("");
  const activeItem = navItems.find((item) => item.active) || navItems[0];
  const commandSupport = navItems.filter((item) => item.group === "support").map(createCommandCardHtml).join("");
  const commandPanelRoutes = `<span class="experience-command-label experience-route-group-label">${isPolish ? "Zaplecze" : "Studio"}</span>${commandSupport}`;
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
          <button class="experience-menu-toggle" id="experienceMenuToggle" type="button" popovertarget="experienceMenu" aria-expanded="false" aria-label="${isPolish ? "Więcej i ustawienia" : "More and experience settings"}">
            <span class="experience-menu-favicon" aria-hidden="true"></span>
            <span class="experience-menu-label">${isPolish ? "Więcej" : "More"}</span>
          </button>
          <button class="mobile-nav-toggle desktop-menu-toggle" id="mobileNavToggle" type="button" aria-label="${isPolish ? "Otwórz menu strony" : "Open site menu"}" aria-expanded="false" aria-controls="mobileMenuOverlay">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>
      <span class="nav-progress-hairline" aria-hidden="true"></span>
      <div class="experience-menu-popover" id="experienceMenu" popover>
        <div class="experience-menu-heading">
          <span>${isPolish ? "NAWIGACJA I WRAŻENIA" : "NAVIGATION AND EXPERIENCE"}</span>
          <small>${identity.label}</small>
          <div class="experience-active-world" data-nav-key="${activeItem.key}">
            <span class="experience-world-thumb" style="--route-thumb:url('${activeItem.hero}')" aria-hidden="true"></span>
            <span class="experience-active-copy"><strong>${activeItem.mobileLabel}</strong><em>${isPolish ? "Aktywna sciezka" : "Active route"}</em></span>
          </div>
        </div>
        <nav class="experience-menu-links" aria-label="${isPolish ? "Pozostałe strony" : "More destinations"}">${commandPanelRoutes}</nav>
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

  const experiencePopover = document.getElementById("experienceMenu");
  const experiencePopoverToggle = document.getElementById("experienceMenuToggle");

  const ensureQuickControls = () => {
    document.querySelectorAll("body > [data-reduce-motion-toggle]").forEach((button) => {
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
      button.setAttribute("tabindex", "-1");
    });

    const supportsPopover = typeof HTMLElement.prototype.showPopover === "function";
    document.documentElement.classList.toggle("supports-popover", supportsPopover);

    if (!supportsPopover && experiencePopover && experiencePopoverToggle) {
      experiencePopover.dataset.fallbackClosed = "true";
      experiencePopoverToggle.removeAttribute("popovertarget");
      experiencePopoverToggle.addEventListener("click", () => {
        const closed = experiencePopover.dataset.fallbackClosed === "true";
        experiencePopover.dataset.fallbackClosed = closed ? "false" : "true";
        experiencePopoverToggle.setAttribute("aria-expanded", String(closed));
      });
    }
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

  let navPointerY = Number.POSITIVE_INFINITY;
  let lastHeaderScrollY = window.scrollY || 0;
  let headerSurfaceTicking = false;

  const isExperienceMenuOpen = () => {
    if (!experiencePopover) return false;
    if (experiencePopover.dataset.fallbackClosed === "false") return true;
    try {
      return experiencePopover.matches(":popover-open");
    } catch {
      return false;
    }
  };

  const syncExperienceMenuToggle = () => {
    experiencePopoverToggle?.setAttribute("aria-expanded", String(isExperienceMenuOpen()));
  };

  const updateHeaderSurface = () => {
    if (!header) return;
    const scrollY = window.scrollY || 0;
    const isScrolled = scrollY > 24;
    const isDesktopPointer = window.matchMedia("(min-width: 901px) and (pointer: fine)").matches;
    const isCinematic = document.body.classList.contains("experience-cinematic")
      || document.body.classList.contains("cinematic-mode")
      || document.documentElement.dataset.experience === "cinematic";
    const reducedMotion = document.body.classList.contains("reduced-motion")
      || document.body.classList.contains("reduce-motion")
      || document.documentElement.dataset.experience === "reduced"
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollingUp = scrollY < lastHeaderScrollY - 3;
    const pointerNearTop = navPointerY <= 112;
    const headerHasFocus = header.contains(document.activeElement);
    const canHide = isDesktopPointer
      && isCinematic
      && !reducedMotion
      && isScrolled
      && scrollY > 72
      && !document.body.classList.contains("mobile-menu-open")
      && !isExperienceMenuOpen();

    header.classList.toggle("is-scrolled", isScrolled);
    header.classList.toggle("nav-cinematic-peek", canHide && (pointerNearTop || scrollingUp || headerHasFocus));
    header.classList.toggle("nav-cinematic-hidden", canHide && !pointerNearTop && !scrollingUp && !headerHasFocus);
    lastHeaderScrollY = scrollY;
  };

  const scheduleHeaderSurface = () => {
    if (headerSurfaceTicking) return;
    headerSurfaceTicking = true;
    window.requestAnimationFrame(() => {
      headerSurfaceTicking = false;
      updateHeaderSurface();
    });
  };

  updateHeaderSurface();
  syncExperienceMenuToggle();
  window.addEventListener("scroll", scheduleHeaderSurface, { passive: true });
  window.addEventListener("pointermove", (event) => {
    navPointerY = event.clientY;
    scheduleHeaderSurface();
  }, { passive: true });
  document.addEventListener("focusin", scheduleHeaderSurface);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      navPointerY = 0;
      scheduleHeaderSurface();
    }
  });
  document.addEventListener("toggle", (event) => {
    if (event.target === experiencePopover) {
      syncExperienceMenuToggle();
      scheduleHeaderSurface();
    }
  }, true);
  document.addEventListener("site:cinematic-change", scheduleHeaderSurface);
  document.addEventListener("site:reduced-motion-change", scheduleHeaderSurface);
  window.addEventListener("resize", scheduleHeaderSurface, { passive: true });
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
