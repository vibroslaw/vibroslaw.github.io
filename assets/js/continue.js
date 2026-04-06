const continuePanel = document.getElementById("continuePanel");
const continueText = document.getElementById("continueText");
const continueButton = document.getElementById("continueButton");
const dismissContinue = document.getElementById("dismissContinue");

const trackedLinks = Array.from(document.querySelectorAll(".track-link"));

const LAST_VISITED_STORAGE_KEY = "lastVisitedSiteEntry";
const DISMISSED_CONTINUE_STORAGE_KEY = "dismissedSiteContinueForHref";

function isPolishLanguage() {
  return document.body.dataset.lang === "pl";
}

function resolveAbsoluteUrl(url) {
  try {
    return new URL(url, window.location.origin).href;
  } catch (error) {
    return null;
  }
}

function normalizePath(url) {
  try {
    const absoluteUrl = resolveAbsoluteUrl(url);
    if (!absoluteUrl) return null;

    const pathname = new URL(absoluteUrl).pathname;
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

function isTrackableHref(href) {
  if (!href || typeof href !== "string") return false;

  const trimmedHref = href.trim();

  if (!trimmedHref) return false;
  if (trimmedHref.startsWith("#")) return false;
  if (/^(mailto:|tel:|javascript:)/i.test(trimmedHref)) return false;

  const absoluteUrl = resolveAbsoluteUrl(trimmedHref);
  if (!absoluteUrl) return false;

  try {
    const parsedUrl = new URL(absoluteUrl);
    return parsedUrl.origin === window.location.origin;
  } catch (error) {
    return false;
  }
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

function setLastVisitedEntry(title, href) {
  if (!title || !href || !isTrackableHref(href)) return;

  const absoluteHref = resolveAbsoluteUrl(href);
  if (!absoluteHref) return;

  const payload = {
    title: title.trim(),
    href: absoluteHref,
    timestamp: Date.now()
  };

  saveToLocalStorage(LAST_VISITED_STORAGE_KEY, JSON.stringify(payload));
}

function getLastVisitedEntry() {
  const stored = readFromLocalStorage(LAST_VISITED_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.title || !parsed.href) return null;
    if (!isTrackableHref(parsed.href)) return null;

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

function updateContinuePanel(entry) {
  if (!continuePanel || !continueText || !continueButton || !entry) return;

  const isPL = isPolishLanguage();

  continueButton.href = entry.href;
  continueButton.textContent = isPL
    ? `Kontynuuj: ${entry.title}`
    : `Continue: ${entry.title}`;

  continueButton.setAttribute(
    "aria-label",
    isPL
      ? `Otwórz ostatnio odwiedzany świat, przewodnik lub dzieło: ${entry.title}`
      : `Open the last world, guide, or work you visited: ${entry.title}`
  );

  continueText.textContent = isPL
    ? `Wróć do ostatnio odwiedzanego świata, przewodnika lub dzieła: ${entry.title}.`
    : `Return to the last world, guide, or work you visited: ${entry.title}.`;
}

function initTrackedLinks() {
  trackedLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      const title = (link.dataset.trackTitle || link.textContent || "").trim();

      if (!title || !href) return;
      setLastVisitedEntry(title, href);
    });
  });
}

function initContinuePanel() {
  if (!continuePanel || !continueText || !continueButton) return;

  const entry = getLastVisitedEntry();

  if (!entry) {
    hideContinuePanel();
    return;
  }

  if (isCurrentPage(entry.href)) {
    hideContinuePanel();
    return;
  }

  if (hasDismissedContinuePanelForHref(entry.href)) {
    hideContinuePanel();
    return;
  }

  updateContinuePanel(entry);
  showContinuePanel();
}

function initDismissButton() {
  if (!dismissContinue) return;

  dismissContinue.addEventListener("click", () => {
    const entry = getLastVisitedEntry();

    hideContinuePanel();

    if (entry?.href) {
      markContinuePanelDismissed(entry.href);
    }
  });
}

initTrackedLinks();
initContinuePanel();
initDismissButton();
