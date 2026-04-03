const reducedMotionToggle = document.getElementById("reducedMotionToggle");
const reducedMotionStored = localStorage.getItem("siteReducedMotion");
const heroRaport = document.querySelector(".hero-raport");
const desktopSectionLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');
const mobileSectionLinks = document.querySelectorAll('.mobile-menu-link[href^="#"]');

function updateReducedMotionLabel() {
  if (!reducedMotionToggle) return;

  const isPL = document.body.dataset.lang === "pl";
  const enabled = document.body.classList.contains("reduced-motion");

  if (isPL) {
    reducedMotionToggle.textContent = enabled ? "Ruch przywrócony" : "Mniej ruchu";
  } else {
    reducedMotionToggle.textContent = enabled ? "Motion Restored" : "Reduced Motion";
  }
}

if (reducedMotionStored === "true") {
  document.body.classList.add("reduced-motion");
}

updateReducedMotionLabel();

if (reducedMotionToggle) {
  reducedMotionToggle.addEventListener("click", () => {
    document.body.classList.toggle("reduced-motion");

    const enabled = document.body.classList.contains("reduced-motion");
    localStorage.setItem("siteReducedMotion", enabled ? "true" : "false");

    updateReducedMotionLabel();
  });
}

function updateHeroParallax() {
  if (!heroRaport) return;
  if (document.body.classList.contains("reduced-motion")) return;

  const rect = heroRaport.getBoundingClientRect();
  const offset = Math.max(-34, Math.min(34, rect.top * -0.045));
  document.documentElement.style.setProperty("--raport-hero-shift", `${offset}px`);
}

window.addEventListener("scroll", updateHeroParallax, { passive: true });
window.addEventListener("load", updateHeroParallax);
updateHeroParallax();

const observedSections = [...document.querySelectorAll("main section[id]")];

if (observedSections.length > 0 && desktopSectionLinks.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");

      desktopSectionLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });

      mobileSectionLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  }, {
    threshold: 0.3,
    rootMargin: "-15% 0px -55% 0px"
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}
