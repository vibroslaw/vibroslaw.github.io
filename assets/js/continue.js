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

function normalizeComparableUrl(url) {
  try {
    const absoluteUrl = resolveAbsoluteUrl(url);
    if (!absoluteUrl) return null;

    const parsedUrl = new URL(absoluteUrl);
    const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";

    return `${pathname}${parsedUrl.search}`;
  } catch (error) {
    return null;
  }
}

function isCurrentPage(href) {
  const currentUrl = normalizeComparableUrl(window.location.href);
  const targetUrl = normalizeComparableUrl(href);

  if (!currentUrl || !targetUrl) return false;
  return currentUrl === targetUrl;
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
    /* ignore storage errors */
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
    /* ignore storage errors */
  }
}

function saveToSessionStorage(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    /* ignore storage errors */
  }
}

function readFromSessionStorage(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function removeFromSessionStorage(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    /* ignore storage errors */
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
    if (typeof parsed.title !== "string" || !parsed.title.trim()) return null;
    if (typeof parsed.href !== "string" || !isTrackableHref(parsed.href)) return null;

    return {
      title: parsed.title.trim(),
      href: parsed.href,
      timestamp: typeof parsed.timestamp === "number" ? parsed.timestamp : null
    };
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

function clearDismissedContinueState() {
  removeFromSessionStorage(DISMISSED_CONTINUE_STORAGE_KEY);
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

  if (dismissContinue) {
    dismissContinue.setAttribute(
      "aria-label",
      isPL
        ? "Ukryj panel kontynuacji"
        : "Hide continue panel"
    );
  }
}

function refreshContinuePanel() {
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

function initTrackedLinks() {
  trackedLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      const title = (link.dataset.trackTitle || link.textContent || "").trim();

      if (!title || !href) return;

      setLastVisitedEntry(title, href);
      clearDismissedContinueState();
    });
  });
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

function handleStorageChange(event) {
  if (
    event.key !== LAST_VISITED_STORAGE_KEY &&
    event.key !== DISMISSED_CONTINUE_STORAGE_KEY
  ) {
    return;
  }

  refreshContinuePanel();
}

function initContinuePanel() {
  refreshContinuePanel();

  window.addEventListener("pageshow", refreshContinuePanel);
  window.addEventListener("storage", handleStorageChange);
}

initTrackedLinks();
initContinuePanel();
initDismissButton();
