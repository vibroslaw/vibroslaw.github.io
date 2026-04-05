const continuePanel = document.getElementById("continuePanel");
const continueText = document.getElementById("continueText");
const continueButton = document.getElementById("continueButton");
const dismissContinue = document.getElementById("dismissContinue");

const trackedLinks = Array.from(document.querySelectorAll(".track-link"));

const LAST_PROJECT_STORAGE_KEY = "lastVisitedProject";
const DISMISSED_CONTINUE_STORAGE_KEY = "dismissedContinue";

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function setLastVisitedProject(title, href) {
  if (!title || !href) return;

  const payload = {
    title,
    href,
    timestamp: Date.now()
  };

  localStorage.setItem(LAST_PROJECT_STORAGE_KEY, JSON.stringify(payload));
}

function getLastVisitedProject() {
  const stored = localStorage.getItem(LAST_PROJECT_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.title || !parsed.href) return null;

    return parsed;
  } catch (error) {
    localStorage.removeItem(LAST_PROJECT_STORAGE_KEY);
    return null;
  }
}

function hasDismissedContinuePanel() {
  return sessionStorage.getItem(DISMISSED_CONTINUE_STORAGE_KEY) === "true";
}

function markContinuePanelDismissed() {
  sessionStorage.setItem(DISMISSED_CONTINUE_STORAGE_KEY, "true");
}

function hideContinuePanel() {
  if (!continuePanel) return;

  continuePanel.classList.remove("visible");
  continuePanel.setAttribute("aria-hidden", "true");
}

function showContinuePanel() {
  if (!continuePanel) return;

  continuePanel.classList.add("visible");
  continuePanel.setAttribute("aria-hidden", "false");
}

function updateContinuePanel(project) {
  if (!continuePanel || !continueText || !continueButton || !project) return;

  const isPL = isPolishLanguage();

  continueButton.href = project.href;
  continueButton.textContent = isPL
    ? `Kontynuuj: ${project.title}`
    : `Continue to ${project.title}`;

  continueButton.setAttribute(
    "aria-label",
    isPL
      ? `Kontynuuj do projektu ${project.title}`
      : `Continue to project ${project.title}`
  );

  continueText.textContent = isPL
    ? `Wróć do świata ${project.title}, który był ostatnio otwierany.`
    : `Return to ${project.title}, the last project world you opened.`;
}

function initTrackedLinks() {
  trackedLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const title = link.dataset.trackTitle;
      const href = link.getAttribute("href");

      setLastVisitedProject(title, href);
    });
  });
}

function initContinuePanel() {
  if (!continuePanel || !continueText || !continueButton) return;

  const project = getLastVisitedProject();

  if (!project || hasDismissedContinuePanel()) {
    hideContinuePanel();
    return;
  }

  updateContinuePanel(project);
  showContinuePanel();
}

function initDismissButton() {
  if (!dismissContinue) return;

  dismissContinue.addEventListener("click", () => {
    hideContinuePanel();
    markContinuePanelDismissed();
  });
}

initTrackedLinks();
initContinuePanel();
initDismissButton();
