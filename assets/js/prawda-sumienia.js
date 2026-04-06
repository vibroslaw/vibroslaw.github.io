const heroPS = document.querySelector(".hero-ps");

const desktopSectionLinks = Array.from(
  document.querySelectorAll('.desktop-nav a[href^="#"]')
);

const mobileSectionLinks = Array.from(
  document.querySelectorAll('.mobile-menu-link[href^="#"]')
);

const allSectionLinks = [...desktopSectionLinks, ...mobileSectionLinks];
const observedSections = Array.from(
  document.querySelectorAll("main section[id]")
);

const PS_HERO_SHIFT_CSS_VARIABLE = "--ps-hero-shift";

let heroParallaxTicking = false;
let sectionStateTicking = false;

function isReducedMotionEnabled() {
  return document.body.classList.contains("reduced-motion");
}

function isCinematicModeEnabled() {
  return document.body.classList.contains("cinematic-mode");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setPsHeroShift(value) {
  document.documentElement.style.setProperty(
    PS_HERO_SHIFT_CSS_VARIABLE,
    `${value.toFixed(2)}px`
  );
}

function resetPsHeroShift() {
  document.documentElement.style.setProperty(
    PS_HERO_SHIFT_CSS_VARIABLE,
    "0px"
  );
}

/* ---------- HERO PARALLAX ---------- */

function updateHeroParallax() {
  if (!heroPS) return;

  if (isReducedMotionEnabled()) {
    resetPsHeroShift();
    return;
  }

  const rect = heroPS.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0;

  if (!viewportHeight || rect.height <= 0) {
    resetPsHeroShift();
    return;
  }

  if (rect.bottom <= 0 || rect.top >= viewportHeight) {
    resetPsHeroShift();
    return;
  }

  const heroCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;

  const centerDistanceRatio = clamp(
    (heroCenter - viewportCenter) / (viewportHeight / 2),
    -1.25,
    1.25
  );

  const motionStrength = isCinematicModeEnabled() ? 40 : 28;

  const shift = clamp(
    centerDistanceRatio * -motionStrength,
    -motionStrength,
    motionStrength
  );

  setPsHeroShift(shift);
}

function requestHeroParallaxUpdate() {
  if (!heroPS || heroParallaxTicking) return;

  heroParallaxTicking = true;

  window.requestAnimationFrame(() => {
    try {
      updateHeroParallax();
    } finally {
      heroParallaxTicking = false;
    }
  });
}

/* ---------- ACTIVE SECTION LINKS ---------- */

function getHeaderOffset() {
  const header = document.querySelector(".site-header");
  return header ? header.offsetHeight + 24 : 120;
}

function setActiveSectionLinks(activeId) {
  if (!allSectionLinks.length) return;

  allSectionLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("is-active", !!activeId && href === `#${activeId}`);
  });
}

function updateActiveSectionLinks() {
  if (!observedSections.length || !allSectionLinks.length) return;

  const headerOffset = getHeaderOffset();
  const scrollPosition = window.scrollY + headerOffset;

  const firstSection = observedSections[0];

  if (!firstSection) {
    setActiveSectionLinks(null);
    return;
  }

  if (scrollPosition < firstSection.offsetTop - headerOffset * 0.5) {
    setActiveSectionLinks(null);
    return;
  }

  let activeId = firstSection.id;

  observedSections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

  setActiveSectionLinks(activeId);
}

function requestActiveSectionUpdate() {
  if (sectionStateTicking) return;

  sectionStateTicking = true;

  window.requestAnimationFrame(() => {
    try {
      updateActiveSectionLinks();
    } finally {
      sectionStateTicking = false;
    }
  });
}

/* ---------- GLOBAL REFRESH ---------- */

function refreshPrawdaSumieniaUi() {
  requestHeroParallaxUpdate();
  requestActiveSectionUpdate();
}

/* ---------- INIT ---------- */

refreshPrawdaSumieniaUi();

window.addEventListener("scroll", refreshPrawdaSumieniaUi, { passive: true });
window.addEventListener("resize", refreshPrawdaSumieniaUi);
window.addEventListener("orientationchange", refreshPrawdaSumieniaUi);
window.addEventListener("load", refreshPrawdaSumieniaUi);
window.addEventListener("pageshow", refreshPrawdaSumieniaUi);
window.addEventListener("hashchange", requestActiveSectionUpdate);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    refreshPrawdaSumieniaUi();
  }
});

document.addEventListener("site:cinematic-change", requestHeroParallaxUpdate);
document.addEventListener("site:reduced-motion-change", requestHeroParallaxUpdate);
document.addEventListener("site:reduced-motion-change", requestActiveSectionUpdate);

if (document.fonts && document.fonts.ready) {
  document.fonts.ready
    .then(() => {
      refreshPrawdaSumieniaUi();
    })
    .catch(() => {
      /* silent fallback */
    });
}
