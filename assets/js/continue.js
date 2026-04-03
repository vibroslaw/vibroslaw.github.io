const continuePanel = document.getElementById("continuePanel");
const continueText = document.getElementById("continueText");
const continueButton = document.getElementById("continueButton");
const dismissContinue = document.getElementById("dismissContinue");

const trackedLinks = document.querySelectorAll(".track-link");

trackedLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const title = link.dataset.trackTitle;
    const href = link.getAttribute("href");
    localStorage.setItem("lastVisitedProject", JSON.stringify({ title, href }));
  });
});

const storedProject = localStorage.getItem("lastVisitedProject");
const dismissedContinue = sessionStorage.getItem("dismissedContinue");

if (storedProject && !dismissedContinue && continuePanel && continueText && continueButton) {
  try {
    const project = JSON.parse(storedProject);
    const isPL = document.body.dataset.lang === "pl";

    continueButton.href = project.href;
    continueButton.textContent = isPL ? `Kontynuuj: ${project.title}` : `Continue to ${project.title}`;
    continueText.textContent = isPL
      ? `Wróć do świata ${project.title}, który był ostatnio otwierany.`
      : `Return to ${project.title}, the last project world you opened.`;

    continuePanel.classList.add("visible");
  } catch (e) {}
}

if (dismissContinue) {
  dismissContinue.addEventListener("click", () => {
    if (continuePanel) continuePanel.classList.remove("visible");
    sessionStorage.setItem("dismissedContinue", "true");
  });
}
