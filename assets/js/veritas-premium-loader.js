(() => {
  "use strict";

  const body = document.body;
  if (!body || window.__vhPremiumModuleLoader) return;
  const shouldLoad = body.classList.contains("page-home") || body.dataset.veritasPremium === "true";
  if (!shouldLoad) return;
  window.__vhPremiumModuleLoader = true;

  const css = [
    "/assets/css/world-signatures.css",
    "/assets/css/world-transitions.css",
    "/assets/css/world-console.css",
    "/assets/css/sound-signature.css",
  ];
  const js = [
    "/assets/js/world-signatures.js",
    "/assets/js/world-transitions.js",
    "/assets/js/world-console.js",
    "/assets/js/sound-signature.js",
  ];

  function alreadyLoaded(selector, value) {
    return !!document.querySelector(`${selector}[href="${value}"], ${selector}[src="${value}"]`);
  }

  function warn(kind, path) {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      console.warn(`[veritas premium] optional ${kind} skipped`, path);
    }
  }

  css.forEach((href) => {
    if (alreadyLoaded("link", href)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.veritasPremiumModule = "true";
    link.addEventListener("error", () => warn("css", href), { once: true });
    document.head.appendChild(link);
  });

  js.forEach((src) => {
    if (alreadyLoaded("script", src)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.veritasPremiumModule = "true";
    script.addEventListener("error", () => warn("script", src), { once: true });
    (document.body || document.head || document.documentElement).appendChild(script);
  });
})();
