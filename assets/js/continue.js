const continuePanel = document.getElementById("continuePanel");
const continueText = document.getElementById("continueText");
const continueButton = document.getElementById("continueButton");
const dismissContinue = document.getElementById("dismissContinue");

const trackedLinks = Array.from(document.querySelectorAll(".track-link"));

const LAST_VISITED_STORAGE_KEY = "lastVisitedRapOrtPage";
const DISMISSED_CONTINUE_STORAGE_KEY = "dismissedRapOrtContinueForHref";

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function normalizePath(url) {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    return pathname.replace(/\/+$/, "") || "/";
  } catch (error) {
    return null;
  }
}

function isCurrentPage(href) {
  const currentPath = normalizePath(window.location.href);
  const targetPath = normalizePath(href);

  if (!currentPath || !targetPath) return false;
  return currentPath === targetPath;
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // ignore storage errors
  }
}

function readFromLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // ignore storage errors
  }
}

function saveToSessionStorage(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    // ignore storage errors
  }
}

function readFromSessionStorage(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setLastVisitedPage(title, href) {
  if (!title || !href) return;

  const payload = {
    title,
    href,
    timestamp: Date.now()
  };

  saveToLocalStorage(LAST_VISITED_STORAGE_KEY, JSON.stringify(payload));
}

function getLastVisitedPage() {
  const stored = readFromLocalStorage(LAST_VISITED_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.title || !parsed.href) return null;

    return parsed;
  } catch (error) {
    removeFromLocalStorage(LAST_VISITED_STORAGE_KEY);
    return null;
  }
}

function hasDismissedContinuePanelForHref(href) {
  return readFromSessionStorage(DISMISSED_CONTINUE_STORAGE_KEY) === href;
}

function markContinuePanelDismissed(href) {
  if (!href) return;
  saveToSessionStorage(DISMISSED_CONTINUE_STORAGE_KEY, href);
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
    ? `Wróć do ostatnio odwiedzanej strony Rap-Ort: ${page.title}.`
    : `Return to the most recently visited Rap-Ort page: ${page.title}.`;
}

function initTrackedLinks() {
  trackedLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const title = link.dataset.trackTitle;
      const href = link.getAttribute("href");

      if (!title || !href) return;
      setLastVisitedPage(title, href);
    });
  });
}

function initContinuePanel() {
  if (!continuePanel || !continueText || !continueButton) return;

  const page = getLastVisitedPage();

  if (!page) {
    hideContinuePanel();
    return;
  }

  if (isCurrentPage(page.href)) {
    hideContinuePanel();
    return;
  }

  if (hasDismissedContinuePanelForHref(page.href)) {
    hideContinuePanel();
    return;
  }

  updateContinuePanel(page);
  showContinuePanel();
}

function initDismissButton() {
  if (!dismissContinue) return;

  dismissContinue.addEventListener("click", () => {
    const page = getLastVisitedPage();

    hideContinuePanel();

    if (page?.href) {
      markContinuePanelDismissed(page.href);
    }
  });
}

initTrackedLinks();
initContinuePanel();
initDismissButton();
