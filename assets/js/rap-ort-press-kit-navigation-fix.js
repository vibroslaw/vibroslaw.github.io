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
  const isPressKit = currentPath === "/press-kit/rap-ort/" || currentPath === "/press-kit/rap-ort/pl/";
  if (!isPressKit) return;

  const isPolish = currentPath.endsWith("/pl/");
  const heroSrc = "/public/assets/heroes/prawda-sumienia-hero.webp";
  const enPath = "/press-kit/rap-ort/";
  const plPath = "/press-kit/rap-ort/pl/";

  const applyHero = () => {
    document.body.dataset.world = "raport";
    document.body.dataset.finalHero = heroSrc;
    document.body.classList.add("final-hero-ready");
    const heroUrl = `url("${heroSrc}")`;
    document.documentElement.style.setProperty("--vh-page-hero-image", heroUrl);
    document.querySelectorAll(".vh-hero-media").forEach((element) => {
      element.setAttribute("data-future-hero", heroSrc);
      element.style.setProperty("--vh-hero-image", heroUrl);
      element.style.setProperty("--vh-final-hero-image", heroUrl);
      element.style.setProperty("--vh-hero-position", "center");
      element.classList.add("has-future-hero", "has-final-hero");
    });
  };

  const applyLanguageSwitch = () => {
    const enHref = isPolish ? enPath : currentPath;
    const plHref = isPolish ? currentPath : plPath;
    document.querySelectorAll('.experience-language a[hreflang="en"], .mobile-lang-switch a[hreflang="en"]').forEach((link) => {
      link.href = enHref;
      link.classList.toggle("active", !isPolish);
      if (!isPolish) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.querySelectorAll('.experience-language a[hreflang="pl"], .mobile-lang-switch a[hreflang="pl"]').forEach((link) => {
      link.href = plHref;
      link.classList.toggle("active", isPolish);
      if (isPolish) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const applyIdentity = () => {
    const brand = document.querySelector(".site-header .brand");
    if (!brand) return;
    brand.href = currentPath;
    brand.setAttribute("aria-label", isPolish ? "RAP-ORT — DLA MEDIÓW" : "RAP-ORT PRESS KIT");
    brand.classList.remove("identity-neutral", "identity-veritas");
    brand.classList.add("identity-raport");
    const label = brand.querySelector(".brand-name");
    const subDesktop = brand.querySelector(".brand-sub-desktop");
    const subMobile = brand.querySelector(".brand-sub-mobile");
    if (label) label.textContent = isPolish ? "RAP-ORT — DLA MEDIÓW" : "RAP-ORT PRESS KIT";
    if (subDesktop) subDesktop.textContent = isPolish ? "Press Kit" : "Veritas Humanum";
    if (subMobile) subMobile.textContent = isPolish ? "RAP-ORT" : "PRESS KIT";

    document.querySelectorAll("[data-nav-key]").forEach((item) => {
      const isPress = item.dataset.navKey === "press";
      item.classList.toggle("is-active", isPress);
      item.classList.toggle("active", isPress);
      if (isPress) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  };

  const applyAll = () => {
    applyHero();
    applyLanguageSwitch();
    applyIdentity();
  };

  applyAll();
  window.requestAnimationFrame?.(applyAll);
  window.setTimeout(applyAll, 80);
  window.setTimeout(applyAll, 320);
})();
