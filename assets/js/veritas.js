(() => {
  "use strict";

  const body = document.body;
  const html = document.documentElement;
  const isPolish = html.lang === "pl" || body?.dataset.lang === "pl";
  const reduceKeys = ["siteReducedMotion", "reduceMotion", "reducedMotion"];
  const transitionDuration = 880;
  let transitionActive = false;

  const getLS = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const setLS = (key, value) => { try { localStorage.setItem(key, value); } catch { /* silent */ } };
  const setSS = (key, value) => { try { sessionStorage.setItem(key, value); } catch { /* silent */ } };

  function injectRuntimeStyles() {
    document.getElementById("veritasRuntimeFixes")?.remove();
    const style = document.createElement("style");
    style.id = "veritasRuntimeFixes";
    style.textContent = `
      :root{--vh-gold-soft:rgba(208,173,104,.72);--vh-gold-line:rgba(208,173,104,.52);--vh-cream:#f1eadb;--vh-black:#050403}
      body.navbar-unified .site-header{position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:9990!important;background:linear-gradient(180deg,rgba(5,4,3,.88),rgba(5,4,3,.50) 70%,rgba(5,4,3,.14))!important;border-bottom:1px solid rgba(201,178,143,.14)!important;box-shadow:0 18px 42px rgba(0,0,0,.18)!important;backdrop-filter:blur(20px) saturate(118%)!important;-webkit-backdrop-filter:blur(20px) saturate(118%)!important;overflow:visible!important}
      body.navbar-unified .header-inner{min-height:68px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important}
      body.navbar-unified .brand{display:inline-flex!important;flex-direction:column!important;justify-content:center!important;color:var(--vh-cream)!important;text-decoration:none!important;min-width:0!important;flex:0 1 auto!important}
      body.navbar-unified .brand-name{font-family:var(--font-display,Georgia,serif)!important;font-size:clamp(.70rem,.78vw,.88rem)!important;letter-spacing:.14em!important;text-transform:uppercase!important;white-space:nowrap!important;line-height:1.05!important}
      body.navbar-unified .brand-sub-desktop,body.navbar-unified .brand-sub-mobile{color:rgba(241,234,219,.50)!important;font-size:.56rem!important;letter-spacing:.15em!important;text-transform:uppercase!important;margin-top:4px!important;white-space:nowrap!important}
      body.navbar-unified .brand-sub-mobile{display:none!important}
      body.navbar-unified .desktop-nav-compact{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:clamp(1px,.2vw,5px)!important;min-width:0!important;flex:1 1 auto!important}
      body.navbar-unified .desktop-nav-compact .nav-button,body.navbar-unified .desktop-nav-compact .lang-switch a,body.navbar-unified .desktop-menu-toggle{position:relative!important;min-height:34px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border:0!important;border-radius:0!important;padding:0 clamp(4px,.52vw,8px)!important;color:rgba(241,234,219,.70)!important;background:transparent!important;box-shadow:none!important;text-decoration:none!important;text-transform:uppercase!important;letter-spacing:.075em!important;font-size:clamp(.49rem,.54vw,.62rem)!important;line-height:1!important;white-space:nowrap!important;transform-origin:center!important;transition:color .24s ease,transform .24s cubic-bezier(.2,.7,.2,1),letter-spacing .24s ease!important}
      body.navbar-unified .desktop-nav-compact .nav-button::after,body.navbar-unified .desktop-nav-compact .lang-switch a::after{content:""!important;position:absolute!important;left:50%!important;bottom:3px!important;width:0!important;height:2px!important;transform:translateX(-50%)!important;border-radius:999px!important;background:linear-gradient(90deg,rgba(208,173,104,0),rgba(208,173,104,.55) 16%,rgba(241,234,219,.90) 50%,rgba(208,173,104,.55) 84%,rgba(208,173,104,0))!important;filter:drop-shadow(0 0 7px rgba(208,173,104,.20))!important;opacity:0!important;transition:width .28s cubic-bezier(.2,.7,.2,1),opacity .22s ease!important}
      body.navbar-unified .desktop-nav-compact .nav-button:hover,body.navbar-unified .desktop-nav-compact .nav-button:focus-visible,body.navbar-unified .desktop-nav-compact .nav-button.is-active,body.navbar-unified .desktop-nav-compact .nav-button.active,body.navbar-unified .desktop-nav-compact .lang-switch a:hover,body.navbar-unified .desktop-nav-compact .lang-switch a:focus-visible,body.navbar-unified .desktop-nav-compact .lang-switch a.active{color:var(--vh-cream)!important;background:transparent!important;box-shadow:none!important;transform:translateY(-1px) scale(1.075)!important;letter-spacing:.095em!important;outline:none!important}
      body.navbar-unified .desktop-nav-compact .nav-button:hover::after,body.navbar-unified .desktop-nav-compact .nav-button:focus-visible::after,body.navbar-unified .desktop-nav-compact .nav-button.is-active::after,body.navbar-unified .desktop-nav-compact .nav-button.active::after,body.navbar-unified .desktop-nav-compact .lang-switch a:hover::after,body.navbar-unified .desktop-nav-compact .lang-switch a:focus-visible::after,body.navbar-unified .desktop-nav-compact .lang-switch a.active::after{width:calc(100% - 8px)!important;opacity:1!important}
      body.navbar-unified .desktop-nav-compact .lang-switch{display:inline-flex!important;align-items:center!important;gap:2px!important;margin-left:2px!important;padding-left:7px!important;border-left:1px solid rgba(201,178,143,.16)!important}
      body.navbar-unified .desktop-nav-compact .lang-switch span{color:rgba(241,234,219,.24)!important;font-size:.64rem!important}
      body.navbar-unified .desktop-menu-toggle{width:40px!important;min-width:40px!important;padding:0!important;flex-direction:column!important;gap:5px!important;border:1px solid rgba(201,178,143,.20)!important;border-radius:999px!important;background:rgba(255,255,255,.025)!important;cursor:pointer!important}
      body.navbar-unified .desktop-menu-toggle:hover,body.navbar-unified .desktop-menu-toggle:focus-visible{border-color:rgba(201,178,143,.46)!important;background:rgba(208,173,104,.08)!important;transform:translateY(-1px) scale(1.05)!important;outline:none!important}
      body.navbar-unified .desktop-menu-toggle span{width:17px!important;height:1.5px!important;border-radius:999px!important;background:currentColor!important;display:block!important}

      body.navbar-unified .mobile-menu-overlay{position:fixed!important;inset:0!important;z-index:10050!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;background:radial-gradient(circle at 76% 15%,rgba(208,173,104,.18),transparent 34rem),radial-gradient(circle at 28% 80%,rgba(241,234,219,.045),transparent 26rem),rgba(5,4,3,.84)!important;backdrop-filter:blur(24px) saturate(112%)!important;-webkit-backdrop-filter:blur(24px) saturate(112%)!important;transition:opacity .30s ease,visibility .30s ease!important;overflow:hidden!important}
      body.navbar-unified .mobile-menu-overlay.is-open,body.navbar-unified .mobile-menu-overlay.open{opacity:1!important;visibility:visible!important;pointer-events:auto!important}
      body.navbar-unified .mobile-menu-panel{position:fixed!important;top:clamp(78px,9vh,96px)!important;right:clamp(14px,3vw,30px)!important;bottom:clamp(14px,3vw,30px)!important;width:min(470px,calc(100vw - clamp(28px,6vw,60px)))!important;max-height:none!important;display:flex!important;flex-direction:column!important;gap:10px!important;padding:clamp(20px,3vw,30px)!important;border:1px solid rgba(201,178,143,.30)!important;border-radius:30px!important;background:linear-gradient(145deg,rgba(34,29,22,.985),rgba(7,6,5,.985)),rgba(7,6,5,.98)!important;box-shadow:0 42px 110px rgba(0,0,0,.62),0 0 60px rgba(208,173,104,.08),inset 0 0 0 1px rgba(255,255,255,.04)!important;overflow-y:auto!important;transform:translate3d(38px,0,0) scale(.982)!important;transition:transform .34s cubic-bezier(.2,.7,.2,1)!important}
      body.navbar-unified .mobile-menu-overlay.is-open .mobile-menu-panel,body.navbar-unified .mobile-menu-overlay.open .mobile-menu-panel{transform:translate3d(0,0,0) scale(1)!important}
      .mobile-menu-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;margin-bottom:8px!important;padding-bottom:16px!important;border-bottom:1px solid rgba(201,178,143,.16)!important}
      .mobile-menu-title{color:var(--vh-cream)!important;font-family:var(--font-display,Georgia,serif)!important;font-size:1.15rem!important;letter-spacing:.11em!important;text-transform:uppercase!important}
      .mobile-menu-close{width:42px!important;height:42px!important;border-radius:999px!important;border:1px solid rgba(201,178,143,.28)!important;background:rgba(255,255,255,.035)!important;color:var(--vh-cream)!important;font-size:1.45rem!important;line-height:1!important;cursor:pointer!important}
      .mobile-menu-close:hover,.mobile-menu-close:focus-visible{background:rgba(208,173,104,.12)!important;outline:none!important}
      body.navbar-unified .mobile-menu-link,body.navbar-unified .mobile-menu-button{display:flex!important;align-items:center!important;justify-content:space-between!important;flex:0 0 auto!important;min-height:46px!important;padding:0 16px!important;border:1px solid rgba(201,178,143,.14)!important;border-radius:999px!important;background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.018))!important;color:rgba(241,234,219,.82)!important;text-decoration:none!important;text-transform:uppercase!important;letter-spacing:.09em!important;font-size:.74rem!important;transition:transform .22s ease,border-color .22s ease,background .22s ease,color .22s ease!important}
      body.navbar-unified .mobile-menu-link::after,body.navbar-unified .mobile-menu-button::after{content:"›";opacity:.46}
      body.navbar-unified .mobile-menu-link:hover,body.navbar-unified .mobile-menu-link:focus-visible,body.navbar-unified .mobile-menu-button:hover,body.navbar-unified .mobile-menu-button:focus-visible{transform:translateX(-4px)!important;color:var(--vh-cream)!important;border-color:rgba(201,178,143,.38)!important;background:rgba(208,173,104,.10)!important;outline:none!important}
      body.navbar-unified .mobile-menu-primary{color:var(--vh-cream)!important;border-color:rgba(201,178,143,.24)!important}
      body.navbar-unified .mobile-lang-switch{display:flex!important;justify-content:center!important;align-items:center!important;gap:14px!important;margin-top:14px!important;color:rgba(241,234,219,.42)!important}
      body.navbar-unified .mobile-lang-switch a{color:rgba(241,234,219,.66)!important;text-decoration:none!important;letter-spacing:.14em!important;text-transform:uppercase!important}
      body.navbar-unified .mobile-lang-switch a.active{color:var(--vh-cream)!important}

      .floating-tools.veritas-quick-controls{position:fixed!important;right:clamp(14px,1.8vw,24px)!important;top:50%!important;transform:translateY(-50%)!important;z-index:9988!important;display:flex!important;flex-direction:column!important;gap:10px!important;pointer-events:none!important}
      .floating-tools.veritas-quick-controls .tool-button,.floating-tools.veritas-quick-controls .reduced-motion-toggle{pointer-events:auto!important;min-width:124px!important;min-height:40px!important;border:1px solid rgba(201,178,143,.28)!important;border-radius:999px!important;background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.018)),rgba(8,7,6,.70)!important;color:rgba(241,234,219,.82)!important;backdrop-filter:blur(17px) saturate(118%)!important;-webkit-backdrop-filter:blur(17px) saturate(118%)!important;box-shadow:0 18px 46px rgba(0,0,0,.32),inset 0 0 0 1px rgba(255,255,255,.04)!important;text-transform:uppercase!important;letter-spacing:.085em!important;font-size:.62rem!important;cursor:pointer!important;transform-origin:right center!important;transition:transform .24s cubic-bezier(.2,.7,.2,1),color .22s ease,border-color .22s ease,background .22s ease,box-shadow .22s ease!important}
      .floating-tools.veritas-quick-controls .tool-button:hover,.floating-tools.veritas-quick-controls .tool-button:focus-visible,.floating-tools.veritas-quick-controls .reduced-motion-toggle:hover,.floating-tools.veritas-quick-controls .reduced-motion-toggle:focus-visible,.floating-tools.veritas-quick-controls .tool-button[aria-pressed="true"],.floating-tools.veritas-quick-controls .reduced-motion-toggle[aria-pressed="true"]{color:var(--vh-cream)!important;border-color:rgba(201,178,143,.56)!important;background:linear-gradient(135deg,rgba(208,173,104,.19),rgba(255,255,255,.025)),rgba(8,7,6,.82)!important;box-shadow:0 20px 54px rgba(0,0,0,.40),0 0 30px rgba(208,173,104,.12),inset 0 0 0 1px rgba(255,255,255,.05)!important;transform:translateX(-3px) scale(1.04)!important;outline:none!important}

      body.veritas-universe .vh-hero-media.has-future-hero{background-image:var(--vh-hero-image)!important;background-size:cover!important;background-position:var(--vh-hero-position,center)!important;background-repeat:no-repeat!important;background-color:var(--vh-black)!important}
      body.veritas-universe .vh-hero-media.has-future-hero::before{inset:0!important;opacity:1!important;background-image:linear-gradient(90deg,rgba(5,4,3,.82),rgba(5,4,3,.30) 45%,rgba(5,4,3,.70)),linear-gradient(180deg,rgba(5,4,3,.10),rgba(5,4,3,.70)),var(--vh-hero-image)!important;background-size:cover,cover,cover!important;background-position:center,center,var(--vh-hero-position,center)!important;background-repeat:no-repeat!important;transform:translate3d(0,calc(var(--vh-parallax,0px) * .32),0) scale(1.035)!important;filter:saturate(1.08) contrast(1.06) brightness(1.08)!important}
      body.veritas-universe .vh-hero-media.has-future-hero::after{inset:0!important;opacity:.54!important;background:radial-gradient(circle at 32% 22%,rgba(208,173,104,.16),transparent 32rem),linear-gradient(90deg,rgba(5,4,3,.78),rgba(5,4,3,.08) 48%,rgba(5,4,3,.62)),linear-gradient(180deg,rgba(5,4,3,.04),rgba(5,4,3,.78) 88%,rgba(5,4,3,.96)),repeating-linear-gradient(90deg,rgba(255,255,255,.016) 0 1px,transparent 1px 7px)!important}
      body.cinematic-mode{background:radial-gradient(circle at 22% 8%,rgba(208,173,104,.10),transparent 32rem),radial-gradient(circle at 76% 18%,rgba(241,234,219,.045),transparent 22rem),#050403!important}
      body.cinematic-mode .site-header{background:linear-gradient(180deg,rgba(5,4,3,.74),rgba(5,4,3,.24),transparent)!important;border-bottom-color:rgba(201,178,143,.08)!important}
      body.cinematic-mode .vh-hero{min-height:min(920px,100vh)!important}
      body.cinematic-mode .vh-hero-media.has-future-hero::before{filter:saturate(1.18) contrast(1.10) brightness(1.16)!important;transform:translate3d(0,calc(var(--vh-parallax,0px) * .52),0) scale(1.085)!important}
      body.cinematic-mode .vh-hero-media.has-future-hero::after{opacity:.38!important}
      body.cinematic-mode .vh-card,body.cinematic-mode .world-portal-card,body.cinematic-mode .trace-card{border-color:rgba(201,178,143,.24)!important;box-shadow:0 26px 80px rgba(0,0,0,.38),0 0 30px rgba(208,173,104,.055)!important}
      body.cinematic-mode .vh-title,body.cinematic-mode .vh-section-title{text-shadow:0 20px 70px rgba(0,0,0,.68),0 0 28px rgba(208,173,104,.08)!important}
      body.veritas-universe .world-portal-card.has-future-hero::before{background-image:linear-gradient(180deg,rgba(5,4,3,.18),rgba(5,4,3,.72)),var(--vh-card-image),radial-gradient(circle at 26% 20%,rgba(208,173,104,.18),transparent 22rem)!important;background-size:cover,cover,cover!important;background-position:center!important;filter:saturate(1.08) contrast(1.06) brightness(1.08)!important}
      body.cinematic-mode .world-portal-card.has-future-hero::before{filter:saturate(1.18) contrast(1.10) brightness(1.15)!important}

      .veritas-world-transition{position:fixed!important;inset:0!important;z-index:12000!important;pointer-events:none!important;display:grid!important;place-items:center!important;opacity:0!important;visibility:hidden!important;overflow:hidden!important;background:radial-gradient(circle at 50% 32%,rgba(208,173,104,.20),transparent 20rem),radial-gradient(circle at 50% 52%,rgba(241,234,219,.07),transparent 34rem),linear-gradient(180deg,rgba(5,4,3,.72),rgba(5,4,3,.96))!important;backdrop-filter:blur(0px) saturate(110%)!important;-webkit-backdrop-filter:blur(0px) saturate(110%)!important;transition:opacity 260ms ease,visibility 260ms ease,backdrop-filter 420ms ease!important}
      .veritas-world-transition.is-active{opacity:1!important;visibility:visible!important;backdrop-filter:blur(12px) saturate(118%)!important;-webkit-backdrop-filter:blur(12px) saturate(118%)!important}
      .veritas-world-transition::before{content:""!important;position:absolute!important;inset:-14% -28%!important;background:linear-gradient(112deg,transparent 0%,transparent 42%,rgba(255,255,255,.14) 50%,transparent 58%,transparent 100%)!important;mix-blend-mode:screen!important;opacity:0!important;transform:translate3d(-22%,0,0) skewX(-10deg)!important}
      .veritas-world-transition.is-active::before{animation:veritasSweep 850ms cubic-bezier(.16,1,.30,1) forwards!important}
      .veritas-world-transition::after{content:""!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,rgba(0,0,0,.94) 0,rgba(0,0,0,0) 14%,rgba(0,0,0,0) 78%,rgba(0,0,0,.96) 100%),repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 1px,transparent 1px 8px)!important;opacity:.84!important}
      .veritas-transition-title{position:relative!important;z-index:2!important;width:min(86vw,900px)!important;text-align:center!important;transform:translate3d(0,24px,0) scale(.96)!important;opacity:0!important;filter:blur(16px)!important;transition:opacity 360ms cubic-bezier(.16,1,.30,1),transform 560ms cubic-bezier(.16,1,.30,1),filter 560ms cubic-bezier(.16,1,.30,1)!important}
      .veritas-world-transition.is-active .veritas-transition-title{transform:translate3d(0,0,0) scale(1)!important;opacity:1!important;filter:blur(0)!important}
      .veritas-transition-kicker{color:rgba(208,173,104,.88)!important;text-transform:uppercase!important;letter-spacing:.22em!important;font-size:clamp(.64rem,.8vw,.84rem)!important;margin-bottom:14px!important}
      .veritas-transition-name{color:var(--vh-cream)!important;font-family:var(--font-display,Georgia,serif)!important;font-size:clamp(2.6rem,8vw,7.4rem)!important;line-height:.84!important;letter-spacing:-.035em!important;text-shadow:0 28px 88px rgba(0,0,0,.78),0 0 32px rgba(208,173,104,.10)!important}
      @keyframes veritasSweep{0%{opacity:0;transform:translate3d(-32%,0,0) skewX(-10deg)}26%{opacity:.9}100%{opacity:0;transform:translate3d(42%,0,0) skewX(-10deg)}}
      body.cinematic-arrival-active .vh-hero-copy,body.cinematic-arrival-active .vh-section-head,body.cinematic-arrival-active .world-portal-card,body.cinematic-arrival-active .vh-card{animation:veritasArrival 900ms cubic-bezier(.16,1,.30,1) both!important}
      @keyframes veritasArrival{0%{opacity:0;transform:translate3d(0,28px,0) scale(.985);filter:blur(16px)}58%{opacity:1;filter:blur(0)}100%{opacity:1;transform:translate3d(0,0,0) scale(1);filter:blur(0)}}

      @media(max-width:1320px){body.navbar-unified .desktop-nav-compact .nav-button,body.navbar-unified .desktop-nav-compact .lang-switch a{font-size:clamp(.47rem,.50vw,.58rem)!important;padding-inline:4px!important;letter-spacing:.06em!important}body.navbar-unified .brand-name{font-size:.70rem!important}body.navbar-unified .brand-sub-desktop{display:none!important}body.navbar-unified .brand-sub-mobile{display:block!important}}
      @media(max-width:1060px){body.navbar-unified .desktop-nav-compact .nav-button:nth-of-type(n+6){display:none!important}}
      @media(max-width:900px){body.navbar-unified .desktop-nav-compact .nav-button,body.navbar-unified .desktop-nav-compact .lang-switch{display:none!important}}
      @media(max-width:760px){.floating-tools.veritas-quick-controls{display:none!important}body.navbar-unified .header-inner{min-height:64px!important}body.navbar-unified .brand-name{font-size:.72rem!important;max-width:calc(100vw - 96px);overflow:hidden;text-overflow:ellipsis}body.navbar-unified .brand-sub-mobile{display:none!important}body.navbar-unified .mobile-menu-panel{left:14px!important;right:14px!important;width:auto!important;top:78px!important}body.veritas-universe .vh-hero-media.has-future-hero::before{background-position:center,center,center!important}}
      body.reduce-motion *,body.reduced-motion *,body.reduce-motion *::before,body.reduced-motion *::before,body.reduce-motion *::after,body.reduced-motion *::after{animation:none!important;transition-duration:.001ms!important;transition-delay:0ms!important;scroll-behavior:auto!important}
      body.reduce-motion .reveal,body.reduced-motion .reveal{opacity:1!important;transform:none!important;filter:none!important}
      body.reduce-motion .veritas-world-transition,body.reduced-motion .veritas-world-transition{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function isReducedMotion() { return body.classList.contains("reduce-motion") || body.classList.contains("reduced-motion"); }
  function reduceLabel() { return isPolish ? "Ogranicz ruch" : "Reduce Motion"; }
  function reducedLabel() { return isPolish ? "Ruch ograniczony" : "Motion Reduced"; }
  function setReducedMotion(enabled) {
    body.classList.toggle("reduce-motion", enabled);
    body.classList.toggle("reduced-motion", enabled);
    reduceKeys.forEach((key) => setLS(key, String(enabled)));
    document.querySelectorAll("[data-reduce-motion-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(enabled));
      button.textContent = enabled ? reducedLabel() : reduceLabel();
      button.dataset.active = String(enabled);
    });
    document.dispatchEvent(new CustomEvent("site:reduced-motion-change", { detail: { enabled } }));
  }
  function initReducedMotion() {
    const stored = reduceKeys.map((key) => getLS(key)).find((value) => value !== null);
    const prefers = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setReducedMotion(stored === "true" || (stored === undefined && prefers));
    document.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-reduce-motion-toggle]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      setReducedMotion(!isReducedMotion());
    }, true);
  }

  function moveMobileOverlayToBody() {
    const overlay = document.getElementById("mobileMenuOverlay");
    if (overlay && overlay.parentElement !== document.body) document.body.appendChild(overlay);
  }
  function enhanceMobileMenu() {
    const panel = document.querySelector("#mobileMenuOverlay .mobile-menu-panel");
    if (!panel || panel.querySelector(".mobile-menu-head")) return;
    const head = document.createElement("div");
    head.className = "mobile-menu-head";
    head.innerHTML = `<div class="mobile-menu-title">VERITAS HUMANUM</div><button class="mobile-menu-close" type="button" aria-label="${isPolish ? "Zamknij menu" : "Close menu"}">×</button>`;
    panel.prepend(head);
    head.querySelector("button")?.addEventListener("click", () => { if (typeof window.closeMobileMenu === "function") window.closeMobileMenu(); });
  }
  function bindFutureHeroes() {
    document.querySelectorAll("[data-future-hero]").forEach((element) => {
      const src = element.getAttribute("data-future-hero");
      if (!src) return;
      const cssUrl = `url("${src.replace(/"/g, "%22")}")`;
      if (element.classList.contains("world-portal-card")) element.style.setProperty("--vh-card-image", cssUrl);
      else { element.style.setProperty("--vh-hero-image", cssUrl); element.style.setProperty("--vh-hero-position", "center"); }
      element.classList.add("has-future-hero");
    });
  }
  function setParallax() {
    if (isReducedMotion() || !body.classList.contains("cinematic-mode")) { html.style.setProperty("--vh-parallax", "0px"); return; }
    html.style.setProperty("--vh-parallax", `${Math.min(window.scrollY || 0, 900) * 0.09}px`);
  }
  function initReveal() {
    const items = [...document.querySelectorAll(".reveal")];
    if (!items.length) return;
    if (isReducedMotion() || !("IntersectionObserver" in window)) { items.forEach((item) => item.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function initManifestoModal() {
    const modal = document.getElementById("manifestoModal");
    if (!modal) return;
    const frame = modal.querySelector("[data-manifesto-frame]");
    const placeholder = isPolish ? '<div class="manifesto-placeholder"><p>Film-manifest Veritas Humanum jest w przygotowaniu.</p><p>Wkrótce pojawi się tutaj krótki prolog do autorskiego świata Piotra Lichwały / Vibrosław.</p></div>' : '<div class="manifesto-placeholder"><p>The Veritas Humanum manifesto film is in preparation.</p><p>A short cinematic prologue to the authorial world of Piotr Lichwała / Vibrosław will appear here soon.</p></div>';
    const closeModal = () => { modal.setAttribute("aria-hidden", "true"); if (frame) frame.innerHTML = placeholder; body.classList.remove("modal-open"); };
    const openModal = (button) => {
      const id = button?.getAttribute("data-youtube-id") || modal.getAttribute("data-youtube-id") || "";
      modal.setAttribute("aria-hidden", "false"); body.classList.add("modal-open");
      if (frame) frame.innerHTML = id ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="Veritas Humanum Manifesto Film" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : placeholder;
      modal.querySelector(".manifesto-close")?.focus();
    };
    document.querySelectorAll("[data-open-manifesto]").forEach((button) => button.addEventListener("click", () => openModal(button)));
    modal.querySelectorAll("[data-close-manifesto]").forEach((button) => button.addEventListener("click", closeModal));
    modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal(); });
  }

  function normalizePath(value) { try { return (new URL(value, window.location.origin)).pathname.replace(/\/+$/, "") || "/"; } catch { return "/"; } }
  function transitionTitleFor(link) {
    const text = (link.textContent || "").replace(/\s+/g, " ").trim();
    const path = normalizePath(link.href);
    if (path.includes("rap-ort")) return "Rap-Ort";
    if (path.includes("sztab")) return text.includes("ORIGINS") ? "SZTAB · ORIGINS" : "SZTAB";
    if (path.includes("between-the-lines") || path.includes("miedzy-wierszami")) return isPolish ? "Między Wierszami" : "Between the Lines";
    if (path.includes("music")) return isPolish ? "Muzyka Vibrosława" : "The Music of Vibrosław";
    if (path.includes("for-institutions")) return isPolish ? "Dla instytucji" : "For Institutions";
    if (path.includes("authorial-profile")) return isPolish ? "Profil autorski" : "Authorial Profile";
    if (path.includes("press-recognition")) return isPolish ? "Media / Wzmianki" : "Press / Recognition";
    if (path.includes("contact")) return isPolish ? "Kontakt" : "Contact";
    return text || "Veritas Humanum";
  }
  function shouldTransitionLink(link, event) {
    if (!(link instanceof HTMLAnchorElement)) return false;
    if (!body.classList.contains("cinematic-mode")) return false;
    if (isReducedMotion() || transitionActive) return false;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return false;
    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return false;
    if (link.target === "_blank" || link.hasAttribute("download") || link.hasAttribute("data-no-transition")) return false;
    let url; try { url = new URL(link.href, window.location.origin); } catch { return false; }
    if (url.origin !== window.location.origin) return false;
    if (normalizePath(url.href) === normalizePath(window.location.href) && url.search === window.location.search) return false;
    return true;
  }
  function ensureTransitionOverlay() {
    let overlay = document.getElementById("veritasWorldTransition");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "veritasWorldTransition";
    overlay.className = "veritas-world-transition";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `<div class="veritas-transition-title"><div class="veritas-transition-kicker">${isPolish ? "WEJŚCIE DO ŚWIATA" : "ENTERING WORLD"}</div><div class="veritas-transition-name">Veritas Humanum</div></div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  function initWorldTransitions() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest?.("a[href]");
      if (!shouldTransitionLink(link, event)) return;
      event.preventDefault(); event.stopPropagation(); transitionActive = true;
      const overlay = ensureTransitionOverlay();
      const title = transitionTitleFor(link);
      overlay.querySelector(".veritas-transition-name").textContent = title;
      overlay.querySelector(".veritas-transition-kicker").textContent = isPolish ? "WEJŚCIE DO ŚWIATA" : "ENTERING WORLD";
      setSS("siteCinematicArrival", JSON.stringify({ href: link.href, key: title.toLowerCase().replace(/[^a-z0-9ąćęłńóśźż]+/gi, "-"), title, timestamp: Date.now(), duration: transitionDuration, source: "veritas-global-transition" }));
      overlay.classList.add("is-active");
      body.classList.add("veritas-transitioning");
      document.dispatchEvent(new CustomEvent("site:cinematic-transition-start", { detail: { active: true, source: "veritas" } }));
      window.setTimeout(() => { window.location.href = link.href; }, transitionDuration);
    }, true);
  }

  function initWitnessReport() {
    const witnessForm = document.querySelector("[data-witness-form]");
    if (!witnessForm) return;
    const field = (name) => witnessForm.querySelector(`[name="${name}"]`);
    const preview = { name: document.querySelector("[data-witness-name]"), place: document.querySelector("[data-witness-place]"), date: document.querySelector("[data-witness-date]"), quote: document.querySelector("[data-witness-quote]"), reflection: document.querySelector("[data-witness-reflection]"), signature: document.querySelector("[data-witness-signature]") };
    const updatePreview = () => {
      const first = field("firstName")?.value.trim() || "";
      const last = field("lastName")?.value.trim() || "";
      const fullName = `${first} ${last}`.trim();
      if (preview.name) preview.name.textContent = fullName || witnessForm.dataset.defaultName || "Participant";
      if (preview.signature) preview.signature.textContent = fullName || witnessForm.dataset.defaultSignature || "Signature";
      if (preview.place) preview.place.textContent = field("place")?.value.trim() || witnessForm.dataset.defaultPlace || "Place / institution";
      if (preview.date) preview.date.textContent = field("date")?.value || new Date().toISOString().slice(0, 10);
      if (preview.quote) preview.quote.textContent = field("quote")?.value || witnessForm.dataset.defaultQuote || "Truth does not need noise. It needs to be heard.";
      if (preview.reflection) preview.reflection.textContent = field("reflection")?.value.trim() || witnessForm.dataset.defaultReflection || "Your reflection will appear here.";
    };
    witnessForm.addEventListener("input", updatePreview);
    witnessForm.addEventListener("change", updatePreview);
    witnessForm.addEventListener("submit", (event) => { event.preventDefault(); const status = witnessForm.querySelector(".form-status"); if (status) status.textContent = witnessForm.dataset.printMessage || "Opening print dialog. Save as PDF from your browser if needed."; window.print(); });
    updatePreview();
  }

  function init() {
    injectRuntimeStyles();
    moveMobileOverlayToBody();
    enhanceMobileMenu();
    bindFutureHeroes();
    initReducedMotion();
    initReveal();
    initManifestoModal();
    initWorldTransitions();
    initWitnessReport();
    setParallax();
    window.addEventListener("scroll", setParallax, { passive: true });
    document.addEventListener("site:cinematic-change", setParallax);
    document.addEventListener("site:reduced-motion-change", setParallax);
  }

  init();
  document.addEventListener("DOMContentLoaded", () => { moveMobileOverlayToBody(); enhanceMobileMenu(); bindFutureHeroes(); setParallax(); }, { once: true });
})();
