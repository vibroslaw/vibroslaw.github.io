(() => {
  "use strict";

  if (window.__veritasPremiumExperience) return;
  window.__veritasPremiumExperience = true;

  const root = document.documentElement;
  const body = document.body;
  if (!body) return;

  const path = `${location.pathname.replace(/\/index\.html$/i, "").replace(/\/+$/, "") || "/"}/`.replace(/\/\/$/, "/");
  const isPolish = (root.lang || body.dataset.lang || "").toLowerCase().startsWith("pl") || path.startsWith("/pl/") || path.includes("/uczestnictwo/") || path.includes("/raport-swiadka/");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = () =>
    root.dataset.experience === "reduced" ||
    body.classList.contains("reduced-motion") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  const unlockDocument = () => {
    body.classList.remove("cinematic-transition-active", "veritas-transitioning", "page-transitioning");
    root.classList.remove("cinematic-navigation-pending", "view-transition-active");
    [root, body].forEach((element) => {
      element.style.removeProperty("overflow");
      element.style.removeProperty("overflow-y");
      element.style.removeProperty("position");
      element.style.removeProperty("top");
      element.style.removeProperty("width");
    });
  };

  const mobileFocalPositions = [
    [/^\/$|^\/pl\/$/, "62% center"],
    [/\/rap-ort\/prawda-sumienia\//, "66% center"],
    [/\/rap-ort\//, "64% center"],
    [/\/sztab\/origins\//, "62% center"],
    [/\/sztab\/battles\//, "68% center"],
    [/\/sztab\//, "64% center"],
    [/\/music/, "58% center"],
    [/between-the-lines|miedzy-wierszami/, "62% center"],
    [/institutions|for-institutions/, "68% center"],
    [/press-recognition|press\//, "64% center"],
    [/authorial-profile|author\//, "58% center"],
    [/contact\//, "66% center"],
  ];

  const focalPosition = mobileFocalPositions.find(([pattern]) => pattern.test(path))?.[1] || "60% center";
  root.style.setProperty("--vh-hero-position-mobile", focalPosition);
  document.querySelectorAll(".vh-hero-media").forEach((media) => {
    media.style.setProperty("--vh-hero-position-mobile", focalPosition);
  });

  const cardSelector = ".world-portal-card, .project-link-card, .cinematic-entry-card";
  const enhanceCards = () => {
    document.querySelectorAll(cardSelector).forEach((card) => {
      if (card.dataset.premiumCard === "true") return;
      const link = card.matches("a[href]") ? card : card.querySelector("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      card.dataset.premiumCard = "true";
      card.dataset.cardHref = link.href;
      card.addEventListener("click", (event) => {
        if (event.target.closest("a,button,input,textarea,select,label")) return;
        link.click();
      });

      let frame = 0;
      card.addEventListener("pointermove", (event) => {
        if (!finePointer.matches || reducedMotion() || root.dataset.experience !== "cinematic") return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - .5;
          const y = (event.clientY - rect.top) / rect.height - .5;
          card.style.setProperty("--card-rx", `${(-y * 7).toFixed(2)}deg`);
          card.style.setProperty("--card-ry", `${(x * 9).toFixed(2)}deg`);
          card.style.setProperty("--card-x", `${(x * 5).toFixed(2)}px`);
          card.style.setProperty("--card-y", `${(y * 4).toFixed(2)}px`);
          card.style.setProperty("--card-media-x", `${(-x * 13).toFixed(2)}px`);
          card.style.setProperty("--card-media-y", `${(-y * 13).toFixed(2)}px`);
        });
      });

      card.addEventListener("pointerleave", () => {
        ["--card-rx", "--card-ry", "--card-x", "--card-y", "--card-media-x", "--card-media-y"].forEach((name) => card.style.removeProperty(name));
      });
    });
  };

  const hero = document.querySelector(".vh-hero");
  const heroMedia = hero?.querySelector(".vh-hero-media");
  let heroFrame = 0;
  hero?.addEventListener("pointermove", (event) => {
    if (!heroMedia || !finePointer.matches || reducedMotion() || root.dataset.experience !== "cinematic") return;
    cancelAnimationFrame(heroFrame);
    heroFrame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroMedia.style.setProperty("--vh-pointer-x", `${(x * 15).toFixed(2)}px`);
      heroMedia.style.setProperty("--vh-pointer-y", `${(y * 11).toFixed(2)}px`);
      heroMedia.style.setProperty("--vh-pointer-rx", `${(-y * 1.4).toFixed(2)}deg`);
      heroMedia.style.setProperty("--vh-pointer-ry", `${(x * 1.7).toFixed(2)}deg`);
      body.style.setProperty("--hero-copy-x", `${(x * 12).toFixed(2)}px`);
      body.style.setProperty("--hero-copy-y", `${(y * 8).toFixed(2)}px`);
    });
  });

  hero?.addEventListener("pointerleave", () => {
    ["--vh-pointer-x", "--vh-pointer-y", "--vh-pointer-rx", "--vh-pointer-ry"].forEach((name) => heroMedia?.style.removeProperty(name));
    body.style.removeProperty("--hero-copy-x");
    body.style.removeProperty("--hero-copy-y");
  });

  const chapterSections = () => [...document.querySelectorAll("main > section, .vh-main > section")].filter((section, index, all) => all.indexOf(section) === index && !section.classList.contains("vh-hero") && !section.hidden);
  const railChapter = () => document.querySelector(".experience-rail-chapter");
  const railCount = () => document.querySelector(".experience-rail-count");

  const chapterName = (section, index) =>
    section.querySelector("h2,h3")?.textContent?.replace(/\s+/g, " ").trim() ||
    section.getAttribute("aria-label") ||
    `${isPolish ? "Rozdzial" : "Chapter"} ${index + 1}`;

  const updateChapterRail = () => {
    const sections = chapterSections();
    if (!sections.length) return;
    const marker = innerHeight * .42;
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= marker) activeIndex = index;
    });
    const active = sections[activeIndex];
    if (railChapter()) railChapter().textContent = chapterName(active, activeIndex);
    if (railCount()) railCount().textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;

    const dangerSelectors = "form, [data-generator], .generator-shell, .record-generator, .witness-report-generator, .participation-record-app, .psx-generator";
    const centerElements = document.elementsFromPoint(innerWidth / 2, innerHeight / 2);
    const nearGenerator = centerElements.some((element) => element.closest?.(dangerSelectors));
    const footerNear = document.querySelector("footer")?.getBoundingClientRect().top < innerHeight * .78;
    body.classList.toggle("experience-rail-suppressed", Boolean(nearGenerator || footerNear));
  };

  let railTicking = false;
  const scheduleRailUpdate = () => {
    if (railTicking) return;
    railTicking = true;
    requestAnimationFrame(() => {
      updateChapterRail();
      railTicking = false;
    });
  };

  const revealSecondaryContent = () => {
    document.querySelectorAll(".premium-secondary-section[hidden]").forEach((section) => {
      section.hidden = false;
    });
    document.querySelector(".premium-content-gate")?.remove();
    body.classList.add("premium-content-expanded");
    scheduleRailUpdate();
  };

  const applyProgressiveDisclosure = () => {
    if (body.dataset.progressiveDisclosure === "true") return;
    if (path.includes("generator") || path.includes("participation") || path.includes("uczestnictwo") || path.includes("document-studio") || path.includes("documents")) return;

    let keep = 0;
    let label = isPolish ? "Odkryj pozostale rozdzialy" : "Explore the remaining chapters";
    if (body.classList.contains("page-music")) {
      keep = 4;
      label = isPolish ? "Zobacz pelny katalog muzyczny" : "View full music catalogue";
    } else if (body.classList.contains("page-home")) {
      keep = 4;
      label = isPolish ? "Kontynuuj pelna podroz" : "Continue the full journey";
    } else if (/institutions|for-institutions/.test(path)) {
      keep = 4;
      label = isPolish ? "Zobacz pelna oferte" : "View the complete programme";
    }
    if (!keep) return;

    const sections = chapterSections();
    if (sections.length <= keep + 1) return;
    body.dataset.progressiveDisclosure = "true";
    const hiddenSections = sections.slice(keep);
    hiddenSections.forEach((section) => {
      section.hidden = true;
      section.classList.add("premium-secondary-section");
    });

    const gate = document.createElement("section");
    gate.className = "premium-content-gate";
    gate.innerHTML = `<button type="button">${label}</button>`;
    gate.querySelector("button").addEventListener("click", revealSecondaryContent);
    hiddenSections[0].before(gate);

    const hashTarget = location.hash ? document.querySelector(location.hash) : null;
    if (hashTarget?.closest(".premium-secondary-section")) revealSecondaryContent();
  };

  const installMusicDialog = () => {
    if (!body.classList.contains("page-music") || document.querySelector(".music-listening-dialog")) return;
    const dialog = document.createElement("dialog");
    dialog.className = "music-listening-dialog";
    dialog.innerHTML = `<div class="music-dialog-head"><div><small>VERITAS HUMANUM / SOUND ROOM</small><strong>${isPolish ? "Pokoj odsluchowy" : "Listening Room"}</strong></div><button class="music-dialog-close" type="button" aria-label="${isPolish ? "Zamknij" : "Close"}">X</button></div><div class="music-dialog-stage"></div>`;
    document.body.appendChild(dialog);
    const stage = dialog.querySelector(".music-dialog-stage");
    dialog.querySelector(".music-dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => stage.replaceChildren());

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-load-playlist]");
      if (!button || typeof dialog.showModal !== "function") return;
      const openLink = document.querySelector("[data-playlist-open]");
      const match = openLink?.href?.match(/playlist\/([^?/#]+)/i);
      if (!match) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const title = document.querySelector("[data-playlist-title]")?.textContent?.trim() || "Spotify";
      dialog.querySelector(".music-dialog-head strong").textContent = title;
      const iframe = document.createElement("iframe");
      iframe.src = `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&theme=0`;
      iframe.title = `${title} - Spotify`;
      iframe.loading = "lazy";
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      stage.replaceChildren(iframe);
      dialog.showModal();
    }, true);
  };

  enhanceCards();
  updateChapterRail();
  addEventListener("scroll", scheduleRailUpdate, { passive: true });
  addEventListener("resize", scheduleRailUpdate, { passive: true });
  addEventListener("hashchange", () => {
    const target = location.hash && document.querySelector(location.hash);
    if (target?.closest(".premium-secondary-section")) revealSecondaryContent();
  });
  addEventListener("pageshow", () => {
    unlockDocument();
    enhanceCards();
    scheduleRailUpdate();
  });

  const finishSetup = () => {
    unlockDocument();
    enhanceCards();
    installMusicDialog();
    applyProgressiveDisclosure();
    scheduleRailUpdate();
  };
  if (document.readyState === "complete") finishSetup();
  else addEventListener("load", finishSetup, { once: true });
  setTimeout(finishSetup, 800);
})();
