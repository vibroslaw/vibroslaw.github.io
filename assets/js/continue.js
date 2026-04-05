const continuePanel = document.getElementById("continuePanel");
const continueText = document.getElementById("continueText");
const continueButton = document.getElementById("continueButton");
const dismissContinue = document.getElementById("dismissContinue");

const trackedLinks = Array.from(document.querySelectorAll(".track-link"));

const LAST_VISITED_STORAGE_KEY = "lastVisitedProject";
const DISMISSED_CONTINUE_STORAGE_KEY = "dismissedContinue";

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function normalizePath(url) {
  try {
    return new URL(url, window.location.origin).pathname.replace(/\/+$/, "") || "/";
  } catch (error) {
    return null;
  }
}

function isCurrentPage(href) {
  const currentPath = normalizePath(window.location.pathname);
  const targetPath = normalizePath(href);

  if (!currentPath || !targetPath) return false;
  return currentPath === targetPath;
}

function setLastVisitedPage(title, href) {
  if (!title || !href) return;

  const payload = {
    title,
    href,
    timestamp: Date.now()
  };

  localStorage.setItem(LAST_VISITED_STORAGE_KEY, JSON.stringify(payload));
}

function getLastVisitedPage() {
  const stored = localStorage.getItem(LAST_VISITED_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.title || !parsed.href) return null;

    return parsed;
  } catch (error) {
    localStorage.removeItem(LAST_VISITED_STORAGE_KEY);
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

function updateContinuePanel(page) {
  if (!continuePanel || !continueText || !continueButton || !page) return;

  const isPL = isPolishLanguage();

  continueButton.href = page.href;
  continueButton.textContent = isPL
    ? `Kontynuuj: ${page.title}`
    : `Continue: ${page.title}`;

  continueButton.setAttribute(
    "aria-label",
    isPL
      ? `Otwórz ostatnio odwiedzaną stronę Rap-Ort: ${page.title}`
      : `Open the most recently visited Rap-Ort page: ${page.title}`
  );

  continueText.textContent = isPL
    ? `Wróć do ostatnio otwieranej strony Rap-Ort: ${page.title}.`
    : `Return to the most recently opened Rap-Ort page: ${page.title}.`;
}

function initTrackedLinks() {
  trackedLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const title = link.dataset.trackTitle;
      const href = link.getAttribute("href");

      setLastVisitedPage(title, href);
    });
  });
}

function initContinuePanel() {
  if (!continuePanel || !continueText || !continueButton) return;

  const page = getLastVisitedPage();

  if (!page || hasDismissedContinuePanel() || isCurrentPage(page.href)) {
    hideContinuePanel();
    return;
  }

  updateContinuePanel(page);
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
