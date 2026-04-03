const hero = document.querySelector(".hero");

function updateHeroParallax() {
  if (!hero) return;
  if (document.body.classList.contains("reduced-motion")) return;

  const rect = hero.getBoundingClientRect();
  const offset = Math.max(-30, Math.min(30, rect.top * -0.04));
  document.documentElement.style.setProperty("--hero-parallax", `${offset}px`);
}

window.addEventListener("scroll", updateHeroParallax, { passive: true });
updateHeroParallax();

const reducedMotionToggle = document.getElementById("reducedMotionToggle");
const reducedMotionStored = localStorage.getItem("siteReducedMotion");

if (reducedMotionStored === "true") {
  document.body.classList.add("reduced-motion");
  if (reducedMotionToggle) {
    reducedMotionToggle.textContent = document.body.dataset.lang === "pl" ? "Ruch przywrócony" : "Motion Restored";
  }
}

if (reducedMotionToggle) {
  reducedMotionToggle.addEventListener("click", () => {
    const isPL = document.body.dataset.lang === "pl";
    document.body.classList.toggle("reduced-motion");
    const enabled = document.body.classList.contains("reduced-motion");

    localStorage.setItem("siteReducedMotion", enabled ? "true" : "false");
    reducedMotionToggle.textContent = enabled
      ? (isPL ? "Ruch przywrócony" : "Motion Restored")
      : (isPL ? "Mniej ruchu" : "Reduced Motion");
  });
}
