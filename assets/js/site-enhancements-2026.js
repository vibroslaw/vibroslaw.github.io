(() => {
  "use strict";

  if (window.__siteEnhancements2026Initialized) return;
  window.__siteEnhancements2026Initialized = true;

  const doc = document.documentElement;
  const body = document.body;
  if (!body) return;

  const worlds = [
    {
      key: "raport",
      test: (path, page) => page.includes("rap") || path.includes("/rap-ort/"),
      vars: {
        "--world-accent": "#dfb86f",
        "--world-accent-rgb": "223, 184, 111",
        "--vh-hero-position": "center 18%",
        "--vh-hero-position-mobile": "54% 18%",
      },
    },
    {
      key: "sztab",
      test: (path, page) => page.includes("sztab") || path.includes("/sztab/"),
      vars: {
        "--world-accent": "#caa35f",
        "--world-accent-rgb": "202, 163, 95",
        "--vh-hero-position": "center 20%",
        "--vh-hero-position-mobile": "50% 21%",
      },
    },
    {
      key: "music",
      test: (path, page) => page.includes("music") || page.includes("muzyka") || path.includes("/music/") || path.includes("/muzyka/"),
      vars: {
        "--world-accent": "#b9a7ff",
        "--world-accent-rgb": "185, 167, 255",
        "--vh-hero-position": "48% 26%",
        "--vh-hero-position-mobile": "50% 22%",
      },
    },
    {
      key: "between",
      test: (path, page) => page.includes("between") || path.includes("/between-the-lines/") || path.includes("/pomiedzy-wersami/"),
      vars: {
        "--world-accent": "#98c7da",
        "--world-accent-rgb": "152, 199, 218",
        "--vh-hero-position": "50% 34%",
        "--vh-hero-position-mobile": "52% 28%",
      },
    },
    {
      key: "prawda",
      test: (path, page) => page.includes("prawda") || path.includes("/prawda-sumienia/"),
      vars: {
        "--world-accent": "#d4b777",
        "--world-accent-rgb": "212, 183, 119",
        "--vh-hero-position": "center 18%",
        "--vh-hero-position-mobile": "52% 18%",
      },
    },
    {
      key: "institution",
      test: (path, page) => page.includes("institution") || page.includes("instytuc") || path.includes("/institutions/"),
      vars: {
        "--world-accent": "#d8c18a",
        "--world-accent-rgb": "216, 193, 138",
        "--vh-hero-position": "50% 24%",
        "--vh-hero-position-mobile": "50% 20%",
      },
    },
  ];

  function activeExperience() {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return "reduced";
    if (body.classList.contains("reduced-motion") || body.classList.contains("reduce-motion")) return "reduced";
    if (body.dataset.experience === "cinematic" || body.classList.contains("cinematic-mode")) return "cinematic";
    return "lite";
  }

  function applyExperienceState() {
    const experience = activeExperience();
    doc.dataset.experience = experience;
    body.dataset.experience = experience;
  }

  function selectWorld() {
    const path = location.pathname.toLowerCase();
    const page = String(body.dataset.page || "").toLowerCase();
    return worlds.find((world) => world.test(path, page)) || {
      key: page === "home" || path === "/" || path === "/pl/" ? "home" : "veritas",
      vars: {},
    };
  }

  function applyWorldIdentity() {
    const world = selectWorld();
    doc.dataset.world = world.key;
    body.dataset.world = world.key;
    Object.entries(world.vars).forEach(([name, value]) => {
      doc.style.setProperty(name, value);
    });
  }

  function isCriticalImage(image) {
    return !!image.closest(".vh-hero, .site-header, [data-eager-image], [data-document-preview]");
  }

  function prepareImagesForLazyLoading() {
    document.querySelectorAll("img").forEach((image) => {
      if (!image.hasAttribute("decoding")) image.decoding = "async";
      if (!image.hasAttribute("loading") && !isCriticalImage(image)) image.loading = "lazy";
      if (image.dataset.assetTier === "print") image.loading = "lazy";
    });
  }

  function hydrateLazyAsset(element) {
    if (element.dataset.src) {
      element.setAttribute("src", element.dataset.src);
      delete element.dataset.src;
    }
    if (element.dataset.srcset) {
      element.setAttribute("srcset", element.dataset.srcset);
      delete element.dataset.srcset;
    }
    if (element.dataset.bg) {
      element.style.backgroundImage = `url("${element.dataset.bg}")`;
      delete element.dataset.bg;
    }
    element.dataset.lazyLoaded = "true";
  }

  function installLazyAssetObserver() {
    const lazyAssets = [
      ...document.querySelectorAll("[data-src], [data-srcset], [data-bg]"),
    ].filter((element) => element.dataset.lazyLoaded !== "true");

    if (!lazyAssets.length) return;

    if (!("IntersectionObserver" in window)) {
      lazyAssets.forEach(hydrateLazyAsset);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateLazyAsset(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "360px 0px" });

    lazyAssets.forEach((element) => observer.observe(element));
  }

  function downgradePrintMasterPreloads() {
    document.querySelectorAll('link[rel="preload"][as="image"]').forEach((link) => {
      const href = String(link.getAttribute("href") || "");
      const isPrintMaster = /\/(backgrounds|title-plates|pdf)\//i.test(href) || /\.(svg|png)$/i.test(href) && /a[34]|final|master|paper-texture/i.test(href);
      if (!isPrintMaster || link.dataset.keepPreload === "true") return;
      link.rel = "prefetch";
      link.dataset.assetTier = "print";
      link.setAttribute("fetchpriority", "low");
    });
  }

  function installHeroPointerDepth() {
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;

    const hero = document.querySelector(".vh-hero");
    if (!hero) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const commit = () => {
      frame = 0;
      if (activeExperience() !== "cinematic") {
        doc.style.setProperty("--hero-cursor-x-px", "0px");
        doc.style.setProperty("--hero-cursor-y-px", "0px");
        return;
      }
      doc.style.setProperty("--hero-cursor-x-px", `${nextX.toFixed(2)}px`);
      doc.style.setProperty("--hero-cursor-y-px", `${nextY.toFixed(2)}px`);
    };

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      nextX = ((event.clientX - rect.left) / rect.width - .5) * 14;
      nextY = ((event.clientY - rect.top) / rect.height - .5) * 10;
      if (!frame) frame = requestAnimationFrame(commit);
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      nextX = 0;
      nextY = 0;
      if (!frame) frame = requestAnimationFrame(commit);
    }, { passive: true });
  }

  function installCardPointerDepth() {
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;
    const cards = document.querySelectorAll(".world-portal-card, .cinematic-entry-card, .project-link-card");

    cards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (activeExperience() !== "cinematic") return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 8;
        card.style.setProperty("--card-cursor-x", `${x.toFixed(2)}px`);
        card.style.setProperty("--card-cursor-y", `${y.toFixed(2)}px`);
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--card-cursor-x");
        card.style.removeProperty("--card-cursor-y");
      }, { passive: true });
    });
  }

  function markLongPages() {
    const sections = document.querySelectorAll("main section, .vh-section").length;
    if (sections >= 8) body.dataset.pageLength = "long";
    if (sections >= 12) body.dataset.pageLength = "very-long";
  }

  function installProgressiveDisclosure() {
    document.querySelectorAll("[data-compressible]").forEach((section) => {
      if (section.dataset.disclosureReady === "true") return;
      section.dataset.disclosureReady = "true";
      section.dataset.collapsed = "true";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "content-reveal-button";
      button.textContent = body.dataset.lang === "pl" ? "Pokaż więcej" : "Show more";
      button.addEventListener("click", () => {
        const collapsed = section.dataset.collapsed === "true";
        section.dataset.collapsed = String(!collapsed);
        button.textContent = collapsed
          ? (body.dataset.lang === "pl" ? "Pokaż mniej" : "Show less")
          : (body.dataset.lang === "pl" ? "Pokaż więcej" : "Show more");
      });
      section.after(button);
    });
  }

  function init() {
    applyExperienceState();
    applyWorldIdentity();
    downgradePrintMasterPreloads();
    prepareImagesForLazyLoading();
    installLazyAssetObserver();
    installHeroPointerDepth();
    installCardPointerDepth();
    markLongPages();
    installProgressiveDisclosure();
  }

  init();
  document.addEventListener("site:cinematic-change", applyExperienceState);
  document.addEventListener("site:reduced-motion-change", applyExperienceState);
  window.matchMedia?.("(prefers-reduced-motion: reduce)").addEventListener?.("change", applyExperienceState);
})();
