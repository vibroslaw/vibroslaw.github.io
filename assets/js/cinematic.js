const cinematicToggle = document.getElementById("cinematicToggle");
const cinematicHeroButton = document.getElementById("cinematicHeroButton");
const mobileCinematicToggle = document.getElementById("mobileCinematicToggle");

function updateCinematicLabels() {
  const isPL = document.body.dataset.lang === "pl";
  const active = document.body.classList.contains("cinematic-mode");

  const enterText = isPL ? "Tryb kinowy" : "Cinematic Mode";
  const exitText = isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode";
  const heroEnterText = isPL ? "Włącz tryb kinowy" : "Enter Cinematic Mode";
  const heroExitText = isPL ? "Wyłącz tryb kinowy" : "Exit Cinematic Mode";

  if (cinematicToggle) cinematicToggle.textContent = active ? exitText : enterText;
  if (cinematicHeroButton) cinematicHeroButton.textContent = active ? heroExitText : heroEnterText;
  if (mobileCinematicToggle) mobileCinematicToggle.textContent = active ? heroExitText : enterText;
}

function toggleCinematicMode() {
  document.body.classList.toggle("cinematic-mode");
  updateCinematicLabels();
}

if (cinematicToggle) cinematicToggle.addEventListener("click", toggleCinematicMode);
if (cinematicHeroButton) cinematicHeroButton.addEventListener("click", toggleCinematicMode);
if (mobileCinematicToggle) {
  mobileCinematicToggle.addEventListener("click", () => {
    toggleCinematicMode();
    document.body.classList.remove("mobile-menu-open");
  });
}

updateCinematicLabels();
