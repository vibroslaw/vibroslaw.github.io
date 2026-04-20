(() => {
  "use strict";

  if (window.__psViewerGuideInitialized) return;
  window.__psViewerGuideInitialized = true;

  const LANG = (document.documentElement.lang || "en").toLowerCase().startsWith("pl")
    ? "pl"
    : "en";

  const I18N = {
    pl: {
      reportFallbackTitle: "Wybierz punkt wejścia",
      reportFallbackText:
        "Zacznij od jednego fragmentu. To najlepszy sposób, by wejść głębiej w źródło bez rozbijania ciężaru całego dzieła.",
      emptyGrid: "Treść pojawi się tutaj po uzupełnieniu danych.",
      openVideo: "Odtwórz materiał",
      closeVideo: "Zamknij",
      noVideoTitle: "Materiał dodatkowy",
      noVideoText:
        "Dodaj identyfikator YouTube w pliku danych, aby ten materiał odtwarzał się bezpośrednio ze strony.",
      linkLabel: "Otwórz",
      unavailable: "W przygotowaniu",
      booksAuthorPrefix: "Autor:",
      downloadTypePrefix: "Format:",
      defaultTabLabel: "Wejście",
      reportExcerptLabel: "Punkt wejścia",
      copied: "Raport został skopiowany do schowka.",
      cleared: "Raport został wyczyszczony.",
      printHint: "Otworzono widok do zapisu jako PDF.",
      copyError: "Nie udało się skopiować raportu.",
      reportDefaultText:
        "Tutaj pojawi się Twoja odpowiedź po seansie — jedno zdanie, jedna myśl albo jedno pytanie, które zostało.",
      reportDefaultPlace: "Po seansie",
      reportPaperTitle: "RAPORT",
      reportPaperSubtitle: "(dokument osobisty)",
      reportPaperIntro:
        "Po obejrzeniu filmu i po wejściu w źródło można zapisać jedno zdanie, jedną myśl albo jedno pytanie, które zostało po spotkaniu z historią.",
      reportPaperFooter:
        "dokument pozostaje do Twojej dyspozycji",
      reportDateLabel: "Data",
      reportPlaceLabel: "Miejsce",
      activeClass: "is-active"
    },
    en: {
      reportFallbackTitle: "Choose an entry point",
      reportFallbackText:
        "Begin with one fragment. That is the clearest way to enter the source more deeply without weakening the gravity of the work as a whole.",
      emptyGrid: "Content will appear here once the data file is filled in.",
      openVideo: "Play video",
      closeVideo: "Close",
      noVideoTitle: "Additional material",
      noVideoText:
        "Add a YouTube ID in the data file so this material can be played directly from the page.",
      linkLabel: "Open",
      unavailable: "Coming soon",
      booksAuthorPrefix: "Author:",
      downloadTypePrefix: "Format:",
      defaultTabLabel: "Entry",
      reportExcerptLabel: "Entry point",
      copied: "The report has been copied to the clipboard.",
      cleared: "The report has been cleared.",
      printHint: "A print view has been opened so you can save it as PDF.",
      copyError: "The report could not be copied.",
      reportDefaultText:
        "Your response will appear here after the screening — one sentence, one thought, or one question that remained.",
      reportDefaultPlace: "After the screening",
      reportPaperTitle: "REPORT",
      reportPaperSubtitle: "(personal document)",
      reportPaperIntro:
        "After the film and after returning to the source, you can write one sentence, one thought, or one question that remained after the encounter with the story.",
      reportPaperFooter:
        "this document remains at your disposal",
      reportDateLabel: "Date",
      reportPlaceLabel: "Place",
      activeClass: "is-active"
    }
  };

  const T = I18N[LANG];
  const data = window.psViewerGuideData || {};

  const reportEntryList = document.getElementById("reportEntryList");
  const reportDetail = document.getElementById("reportDetail");
  const filmLanguageGrid = document.getElementById("filmLanguageGrid");
  const microVideoGrid = document.getElementById("microVideoGrid");
  const systemsGrid = document.getElementById("systemsGrid");
  const discussionGrid = document.getElementById("discussionGrid");
  const booksGrid = document.getElementById("booksGrid");
  const downloadsGrid = document.getElementById("downloadsGrid");

  const videoModal = document.getElementById("videoModal");
  const videoModalFrame = document.getElementById("videoModalFrame");
  const videoModalTitle = document.getElementById("videoModalTitle");
  const videoModalClose = document.getElementById("videoModalClose");
  const videoModalPlaceholder = document.getElementById("videoModalPlaceholder");

  const viewerReportForm = document.getElementById("viewerReportForm");
  const viewerReportDate = document.getElementById("viewerReportDate");
  const viewerReportPlace = document.getElementById("viewerReportPlace");
  const viewerReportText = document.getElementById("viewerReportText");
  const viewerReportDownload = document.getElementById("viewerReportDownload");
  const viewerReportCopy = document.getElementById("viewerReportCopy");
  const viewerReportClear = document.getElementById("viewerReportClear");
  const viewerReportStatus = document.getElementById("viewerReportStatus");
  const viewerReportNumber = document.getElementById("viewerReportNumber");
  const viewerReportDatePreview = document.getElementById("viewerReportDatePreview");
  const viewerReportPlacePreview = document.getElementById("viewerReportPlacePreview");
  const viewerReportTextPreview = document.getElementById("viewerReportTextPreview");

  let activeReportIndex = 0;
  let activeReportTabIndex = 0;

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function isMeaningfulString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function hasRealLink(value) {
    return isMeaningfulString(value) && value.trim() !== "#";
  }

  function getItemValue(item, keys, fallback = "") {
    for (const key of keys) {
      if (item && item[key] !== undefined && item[key] !== null) {
        return item[key];
      }
    }
    return fallback;
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }

  function setRichText(container, value) {
    container.innerHTML = "";

    if (!value) return;

    if (typeof value === "string") {
      const chunks = value
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);

      if (!chunks.length) {
        container.textContent = value;
        return;
      }

      chunks.forEach((chunk) => {
        const p = document.createElement("p");
        p.textContent = chunk;
        container.appendChild(p);
      });

      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        const p = document.createElement("p");
        p.textContent = String(entry);
        container.appendChild(p);
      });
    }
  }

  function renderChips(container, chips) {
    const list = normalizeArray(chips).filter(Boolean);
    if (!list.length) return;

    const chipsWrap = createEl("div", "chips");
    list.forEach((chip) => {
      chipsWrap.appendChild(createEl("span", "chip", chip));
    });
    container.appendChild(chipsWrap);
  }

  function createLinkButton({ href, label, className = "btn btn-secondary", target = "" }) {
    const link = document.createElement("a");
    link.className = className;
    link.textContent = label || T.linkLabel;
    link.href = hasRealLink(href) ? href : "#";

    if (!hasRealLink(href)) {
      link.classList.add("is-disabled");
      link.setAttribute("aria-disabled", "true");
      link.textContent = label || T.unavailable;
      link.addEventListener("click", (event) => event.preventDefault());
    }

    if (target) {
      link.target = target;
      if (target === "_blank") {
        link.rel = "noopener noreferrer";
      }
    }

    return link;
  }

  function renderEmptyState(container) {
    if (!container) return;
    container.innerHTML = "";

    const box = createEl("div", "detail-empty");
    box.appendChild(createEl("h3", "", T.reportFallbackTitle));
    box.appendChild(createEl("p", "", T.reportFallbackText));
    container.appendChild(box);
  }

  function getReportEntries() {
    return normalizeArray(data.reportEntries || data.report || []);
  }

  function getFilmLanguageItems() {
    return normalizeArray(data.filmLanguage || data.language || []);
  }

  function getMicroVideos() {
    return normalizeArray(data.microVideos || data.timeline || data.videos || []);
  }

  function getSystems() {
    return normalizeArray(data.systems || data.totalitarianSystems || []);
  }

  function getDiscussionQuestions() {
    return normalizeArray(data.discussionQuestions || data.questions || []);
  }

  function getBooks() {
    return normalizeArray(data.books || data.recommendedBooks || []);
  }

  function getDownloads() {
    return normalizeArray(data.downloads || data.materials || []);
  }

  function renderReportList() {
    if (!reportEntryList) return;

    const entries = getReportEntries();
    reportEntryList.innerHTML = "";

    if (!entries.length) {
      reportEntryList.appendChild(createEl("p", "grid-empty", T.emptyGrid));
      renderEmptyState(reportDetail);
      return;
    }

    entries.forEach((entry, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "report-entry-button";
      if (index === activeReportIndex) button.classList.add(T.activeClass);

      const kicker = getItemValue(entry, ["kicker", "eyebrow", "label"], "");
      const title = getItemValue(entry, ["title", "name"], "");
      const summary = getItemValue(entry, ["summary", "intro", "shortText"], "");

      if (isMeaningfulString(kicker)) {
        button.appendChild(createEl("span", "report-entry-kicker", kicker));
      }

      button.appendChild(createEl("span", "report-entry-title", title));

      if (isMeaningfulString(summary)) {
        button.appendChild(createEl("span", "report-entry-summary", summary));
      }

      button.addEventListener("click", () => {
        activeReportIndex = index;
        activeReportTabIndex = 0;
        updateReportExplorer();
      });

      reportEntryList.appendChild(button);
    });
  }

  function renderReportDetail() {
    if (!reportDetail) return;

    const entries = getReportEntries();
    const entry = entries[activeReportIndex];

    if (!entry) {
      renderEmptyState(reportDetail);
      return;
    }

    reportDetail.innerHTML = "";

    const wrapper = createEl("div", "detail-shell");

    renderChips(wrapper, getItemValue(entry, ["chips", "tags"], []));

    const title = getItemValue(entry, ["title", "name"], "");
    const intro = getItemValue(entry, ["intro", "summary", "lead"], "");
    const excerptLabel = getItemValue(
      entry,
      ["excerptLabel", "sourceLabel"],
      T.reportExcerptLabel
    );
    const excerpt = getItemValue(entry, ["excerpt", "sourceText", "entryText"], "");
    const tabs = normalizeArray(getItemValue(entry, ["tabs", "panels", "sections"], []));

    wrapper.appendChild(createEl("h3", "report-detail-title", title));

    if (isMeaningfulString(intro)) {
      wrapper.appendChild(createEl("p", "report-detail-intro", intro));
    }

    if (isMeaningfulString(excerpt)) {
      const excerptBox = createEl("div", "report-excerpt");
      excerptBox.appendChild(createEl("div", "report-excerpt-label", excerptLabel));

      const excerptText = createEl("div", "report-excerpt-text");
      setRichText(excerptText, excerpt);
      excerptBox.appendChild(excerptText);

      wrapper.appendChild(excerptBox);
    }

    if (tabs.length) {
      const tabsNav = createEl("div", "report-tabs");

      const safeTabIndex =
        activeReportTabIndex >= 0 && activeReportTabIndex < tabs.length
          ? activeReportTabIndex
          : 0;

      activeReportTabIndex = safeTabIndex;

      tabs.forEach((tab, tabIndex) => {
        const tabButton = document.createElement("button");
        tabButton.type = "button";
        tabButton.className = "report-tab-button";
        if (tabIndex === safeTabIndex) tabButton.classList.add(T.activeClass);

        tabButton.textContent = getItemValue(tab, ["label", "title", "name"], T.defaultTabLabel);
        tabButton.addEventListener("click", () => {
          activeReportTabIndex = tabIndex;
          renderReportDetail();
        });

        tabsNav.appendChild(tabButton);
      });

      const activeTab = tabs[safeTabIndex];
      const tabTitle = getItemValue(activeTab, ["title", "heading", "label"], "");
      const tabBody = getItemValue(activeTab, ["text", "body", "content"], "");
      const tabHtml = getItemValue(activeTab, ["html", "bodyHtml"], "");

      const tabPanel = createEl("div", "report-tab-panel");

      if (isMeaningfulString(tabTitle)) {
        tabPanel.appendChild(createEl("h4", "report-tab-title", tabTitle));
      }

      const tabPanelBody = createEl("div", "report-tab-body");
      if (isMeaningfulString(tabHtml)) {
        tabPanelBody.innerHTML = tabHtml;
      } else {
        setRichText(tabPanelBody, tabBody);
      }

      tabPanel.appendChild(tabPanelBody);
      wrapper.appendChild(tabsNav);
      wrapper.appendChild(tabPanel);
    }

    reportDetail.appendChild(wrapper);
  }

  function updateReportExplorer() {
    renderReportList();
    renderReportDetail();
  }

  function createInfoCard(item, className) {
    const card = createEl("article", className);
    renderChips(card, getItemValue(item, ["chips", "tags"], []));

    const title = getItemValue(item, ["title", "name"], "");
    const text = getItemValue(item, ["text", "body", "description"], "");

    if (isMeaningfulString(title)) {
      card.appendChild(createEl("h3", "", title));
    }

    const copy = createEl("div", "card-copy");
    setRichText(copy, text);
    card.appendChild(copy);

    return card;
  }

  function renderSimpleGrid(container, items, className) {
    if (!container) return;
    container.innerHTML = "";

    if (!items.length) {
      container.appendChild(createEl("p", "grid-empty", T.emptyGrid));
      return;
    }

    items.forEach((item) => {
      container.appendChild(createInfoCard(item, className));
    });
  }

  function renderBooks() {
    if (!booksGrid) return;
    booksGrid.innerHTML = "";

    const items = getBooks();

    if (!items.length) {
      booksGrid.appendChild(createEl("p", "grid-empty", T.emptyGrid));
      return;
    }

    items.forEach((item) => {
      const card = createEl("article", "book-card");

      renderChips(card, getItemValue(item, ["chips", "tags"], []));

      const title = getItemValue(item, ["title", "name"], "");
      const author = getItemValue(item, ["author"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");
      const href = getItemValue(item, ["href", "link", "url"], "");
      const cta = getItemValue(item, ["cta", "buttonLabel"], T.linkLabel);

      if (isMeaningfulString(title)) {
        card.appendChild(createEl("h3", "", title));
      }

      if (isMeaningfulString(author)) {
        card.appendChild(createEl("div", "book-author", `${T.booksAuthorPrefix} ${author}`));
      }

      const copy = createEl("div", "card-copy");
      setRichText(copy, text);
      card.appendChild(copy);

      const ctaRow = createEl("div", "card-cta-row");
      ctaRow.appendChild(
        createLinkButton({
          href,
          label: hasRealLink(href) ? cta : T.unavailable,
          className: "btn btn-secondary",
          target: hasRealLink(href) ? "_blank" : ""
        })
      );
      card.appendChild(ctaRow);

      booksGrid.appendChild(card);
    });
  }

  function renderDownloads() {
    if (!downloadsGrid) return;
    downloadsGrid.innerHTML = "";

    const items = getDownloads();

    if (!items.length) {
      downloadsGrid.appendChild(createEl("p", "grid-empty", T.emptyGrid));
      return;
    }

    items.forEach((item) => {
      const card = createEl("article", "download-card");

      renderChips(card, getItemValue(item, ["chips", "tags"], []));

      const title = getItemValue(item, ["title", "name"], "");
      const type = getItemValue(item, ["type", "format"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");
      const href = getItemValue(item, ["href", "link", "url"], "");
      const cta = getItemValue(item, ["cta", "buttonLabel"], T.linkLabel);

      if (isMeaningfulString(title)) {
        card.appendChild(createEl("h3", "", title));
      }

      if (isMeaningfulString(type)) {
        card.appendChild(createEl("div", "download-type", `${T.downloadTypePrefix} ${type}`));
      }

      const copy = createEl("div", "card-copy");
      setRichText(copy, text);
      card.appendChild(copy);

      const ctaRow = createEl("div", "card-cta-row");
      ctaRow.appendChild(
        createLinkButton({
          href,
          label: hasRealLink(href) ? cta : T.unavailable,
          className: "btn btn-secondary",
          target: hasRealLink(href) ? "_blank" : ""
        })
      );
      card.appendChild(ctaRow);

      downloadsGrid.appendChild(card);
    });
  }

  function openVideoModal(video) {
    if (!videoModal || !videoModalFrame || !videoModalTitle || !videoModalPlaceholder) return;

    const title = getItemValue(video, ["title", "name"], T.noVideoTitle);
    const youtubeId = getItemValue(video, ["youtubeId", "videoId", "id"], "");
    const embedUrl = isMeaningfulString(youtubeId)
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
          youtubeId.trim()
        )}?autoplay=1&rel=0`
      : "";

    videoModalTitle.textContent = title;

    if (embedUrl) {
      videoModalFrame.src = embedUrl;
      videoModalFrame.hidden = false;
      videoModalPlaceholder.classList.remove("is-visible");
    } else {
      videoModalFrame.src = "";
      videoModalFrame.hidden = true;
      videoModalPlaceholder.classList.add("is-visible");
      videoModalPlaceholder.innerHTML = `<p>${T.noVideoText}</p>`;
    }

    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("video-modal-open");
  }

  function closeVideoModal() {
    if (!videoModal || !videoModalFrame) return;
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    videoModalFrame.src = "";
    videoModalFrame.hidden = false;
    videoModalPlaceholder.classList.remove("is-visible");
    document.body.classList.remove("video-modal-open");
  }

  function renderMicroVideos() {
    if (!microVideoGrid) return;
    microVideoGrid.innerHTML = "";

    const items = getMicroVideos();

    if (!items.length) {
      microVideoGrid.appendChild(createEl("p", "grid-empty", T.emptyGrid));
      return;
    }

    items.forEach((item) => {
      const card = createEl("article", "micro-video-card");

      const badge = getItemValue(item, ["badge", "kicker", "label"], "");
      if (isMeaningfulString(badge)) {
        card.appendChild(createEl("div", "micro-badge", badge));
      }

      const title = getItemValue(item, ["title", "name"], "");
      const subtitle = getItemValue(item, ["subtitle"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");

      if (isMeaningfulString(title)) {
        card.appendChild(createEl("h3", "", title));
      }

      if (isMeaningfulString(subtitle)) {
        card.appendChild(createEl("div", "micro-subtitle", subtitle));
      }

      const copy = createEl("div", "card-copy");
      setRichText(copy, text);
      card.appendChild(copy);

      const actions = createEl("div", "card-cta-row");
      const playButton = document.createElement("button");
      playButton.type = "button";
      playButton.className = "btn btn-secondary";
      playButton.textContent = getItemValue(item, ["cta", "buttonLabel"], T.openVideo);
      playButton.addEventListener("click", () => openVideoModal(item));
      actions.appendChild(playButton);

      card.appendChild(actions);
      microVideoGrid.appendChild(card);
    });
  }

  function initVideoModal() {
    if (!videoModal) return;

    if (videoModalClose) {
      videoModalClose.setAttribute("aria-label", T.closeVideo);
      videoModalClose.addEventListener("click", closeVideoModal);
    }

    videoModal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.closeVideoModal === "true" || target === videoModal) {
        closeVideoModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && videoModal.classList.contains("is-open")) {
        closeVideoModal();
      }
    });
  }

  function initSectionNav() {
    const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
    if (!navLinks.length) return;

    const sections = navLinks
      .map((link) => {
        const href = link.getAttribute("href");
        if (!href) return null;
        return document.querySelector(href);
      })
      .filter(Boolean);

    if (!sections.length) return;

    const setActiveLink = (activeId) => {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle(T.activeClass, href === `#${activeId}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveLink(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initSmoothScrollOffset() {
    const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    const header = document.querySelector(".site-header");

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        const headerOffset = header ? header.offsetHeight + 18 : 90;
        const targetY =
          target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetY,
          behavior: "smooth"
        });
      });
    });
  }

  function formatDateForInput(value) {
    const date = value instanceof Date ? value : new Date(value);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatDateForDisplay(value) {
    if (!isMeaningfulString(value)) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return LANG === "pl"
      ? date.toLocaleDateString("pl-PL")
      : date.toLocaleDateString("en-GB");
  }

  function buildReportNumber() {
    const now = new Date();
    const datePart =
      `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const timePart =
      `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const prefix = LANG === "pl" ? "RW" : "VR";
    return `${prefix}-${datePart}-${timePart}`;
  }

  function getViewerReportStorageKey() {
    return `ps-viewer-guide-report-${LANG}-${window.location.pathname}`;
  }

  function getViewerReportSnapshot() {
    return {
      date: viewerReportDate ? viewerReportDate.value : "",
      place: viewerReportPlace ? viewerReportPlace.value.trim() : "",
      text: viewerReportText ? viewerReportText.value.trim() : "",
      number: viewerReportNumber ? viewerReportNumber.textContent.trim() : buildReportNumber()
    };
  }

  function persistViewerReport() {
    if (!viewerReportForm) return;
    try {
      localStorage.setItem(
        getViewerReportStorageKey(),
        JSON.stringify(getViewerReportSnapshot())
      );
    } catch (_) {}
  }

  function restoreViewerReport() {
    if (!viewerReportForm) return false;

    try {
      const raw = localStorage.getItem(getViewerReportStorageKey());
      if (!raw) return false;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return false;

      if (viewerReportDate && isMeaningfulString(parsed.date)) {
        viewerReportDate.value = parsed.date;
      }

      if (viewerReportPlace && isMeaningfulString(parsed.place)) {
        viewerReportPlace.value = parsed.place;
      }

      if (viewerReportText && isMeaningfulString(parsed.text)) {
        viewerReportText.value = parsed.text;
      }

      if (viewerReportNumber && isMeaningfulString(parsed.number)) {
        viewerReportNumber.textContent = parsed.number;
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  function updateViewerReportPreview() {
    if (!viewerReportForm) return;

    const snapshot = getViewerReportSnapshot();

    if (viewerReportDatePreview) {
      viewerReportDatePreview.textContent = formatDateForDisplay(snapshot.date);
    }

    if (viewerReportPlacePreview) {
      viewerReportPlacePreview.textContent = isMeaningfulString(snapshot.place)
        ? snapshot.place
        : T.reportDefaultPlace;
    }

    if (viewerReportTextPreview) {
      viewerReportTextPreview.textContent = isMeaningfulString(snapshot.text)
        ? snapshot.text
        : T.reportDefaultText;
    }

    if (viewerReportNumber && !isMeaningfulString(viewerReportNumber.textContent)) {
      viewerReportNumber.textContent = buildReportNumber();
    }

    persistViewerReport();
  }

  function setViewerReportStatus(message) {
    if (viewerReportStatus) {
      viewerReportStatus.textContent = message || "";
    }
  }

  function buildViewerReportPlainText() {
    const snapshot = getViewerReportSnapshot();
    const lines = [
      `${T.reportPaperTitle} ${T.reportPaperSubtitle}`,
      `${T.reportDateLabel}: ${formatDateForDisplay(snapshot.date)}`,
      `${T.reportPlaceLabel}: ${isMeaningfulString(snapshot.place) ? snapshot.place : T.reportDefaultPlace}`,
      "",
      isMeaningfulString(snapshot.text) ? snapshot.text : T.reportDefaultText
    ];

    return lines.join("\n");
  }

  function copyViewerReport() {
    const text = buildViewerReportPlainText();

    navigator.clipboard
      .writeText(text)
      .then(() => setViewerReportStatus(T.copied))
      .catch(() => setViewerReportStatus(T.copyError));
  }

  function clearViewerReport() {
    if (!viewerReportForm) return;

    if (viewerReportDate) {
      viewerReportDate.value = formatDateForInput(new Date());
    }

    if (viewerReportPlace) {
      viewerReportPlace.value = T.reportDefaultPlace;
    }

    if (viewerReportText) {
      viewerReportText.value = "";
    }

    if (viewerReportNumber) {
      viewerReportNumber.textContent = buildReportNumber();
    }

    try {
      localStorage.removeItem(getViewerReportStorageKey());
    } catch (_) {}

    updateViewerReportPreview();
    setViewerReportStatus(T.cleared);
  }

  function openViewerReportPrint() {
    const snapshot = getViewerReportSnapshot();
    const dateDisplay = formatDateForDisplay(snapshot.date);
    const placeDisplay = isMeaningfulString(snapshot.place) ? snapshot.place : T.reportDefaultPlace;
    const textDisplay = isMeaningfulString(snapshot.text) ? snapshot.text : T.reportDefaultText;
    const numberDisplay = isMeaningfulString(snapshot.number) ? snapshot.number : buildReportNumber();

    const printWindow = window.open("", "_blank", "width=980,height=1280");
    if (!printWindow) return;

    const escapedText = textDisplay
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${T.reportPaperTitle}</title>
<style>
  :root{
    --paper:#e6d7be;
    --paper-edge:#cdb896;
    --paper-text:#34291e;
    --paper-muted:#6c5845;
    --rule:#b49a78;
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    padding:40px;
    background:#f3efe8;
    font-family:"Courier New", monospace;
    color:var(--paper-text);
  }
  .page{
    max-width:860px;
    margin:0 auto;
  }
  .sheet{
    position:relative;
    min-height:1120px;
    padding:54px 52px 42px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,.02)),
      linear-gradient(180deg, var(--paper), #dcc8a8 100%);
    border:1px solid rgba(123,96,65,.30);
    box-shadow:0 18px 40px rgba(0,0,0,.18);
    overflow:hidden;
  }
  .sheet::before{
    content:"";
    position:absolute;
    inset:0;
    opacity:.14;
    background:
      radial-gradient(circle at 14% 18%, rgba(255,255,255,.46), transparent 18%),
      radial-gradient(circle at 78% 76%, rgba(120,88,58,.24), transparent 24%),
      repeating-linear-gradient(
        0deg,
        rgba(78,59,41,.035) 0px,
        rgba(78,59,41,.035) 1px,
        transparent 1px,
        transparent 4px
      );
    mix-blend-mode:multiply;
    pointer-events:none;
  }
  .top{
    position:relative;
    z-index:1;
    text-align:center;
    margin-bottom:30px;
  }
  .title{
    font-size:42px;
    line-height:1;
    letter-spacing:.08em;
    text-transform:uppercase;
    margin:0;
  }
  .subtitle{
    margin-top:8px;
    font-size:16px;
    color:var(--paper-muted);
  }
  .number{
    margin-top:10px;
    font-size:14px;
    color:var(--paper-muted);
    letter-spacing:.06em;
  }
  .meta{
    position:relative;
    z-index:1;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:18px;
    margin-bottom:24px;
    font-size:16px;
  }
  .intro{
    position:relative;
    z-index:1;
    margin-bottom:24px;
    line-height:1.9;
    font-size:16px;
    color:#4a3b2d;
  }
  .body{
    position:relative;
    z-index:1;
    font-size:17px;
    line-height:2.05;
    white-space:pre-wrap;
    word-break:break-word;
    min-height:420px;
  }
  .rule{
    height:1px;
    margin:26px 0 0;
    background:linear-gradient(90deg, rgba(180,154,120,.88), rgba(180,154,120,.58));
  }
  .footer{
    position:relative;
    z-index:1;
    margin-top:24px;
    text-align:center;
    font-size:14px;
    color:var(--paper-muted);
  }
  @media print{
    body{padding:0;background:#fff}
    .page{max-width:none}
    .sheet{box-shadow:none;border:0;min-height:auto}
  }
</style>
</head>
<body>
  <div class="page">
    <div class="sheet">
      <div class="top">
        <h1 class="title">${T.reportPaperTitle}</h1>
        <div class="subtitle">${T.reportPaperSubtitle}</div>
        <div class="number">${numberDisplay}</div>
      </div>

      <div class="meta">
        <div><strong>${T.reportDateLabel}:</strong> ${dateDisplay}</div>
        <div><strong>${T.reportPlaceLabel}:</strong> ${placeDisplay}</div>
      </div>

      <div class="intro">${T.reportPaperIntro}</div>

      <div class="body">${escapedText}</div>

      <div class="rule"></div>

      <div class="footer">${T.reportPaperFooter}</div>
    </div>
  </div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.print();
      }, 250);
    });
  <\/script>
</body>
</html>`);
    printWindow.document.close();

    setViewerReportStatus(T.printHint);
  }

  function initViewerReport() {
    if (!viewerReportForm) return;

    const restored = restoreViewerReport();

    if (!restored) {
      if (viewerReportDate && !viewerReportDate.value) {
        viewerReportDate.value = formatDateForInput(new Date());
      }

      if (viewerReportPlace && !viewerReportPlace.value.trim()) {
        viewerReportPlace.value = T.reportDefaultPlace;
      }

      if (viewerReportNumber && !viewerReportNumber.textContent.trim()) {
        viewerReportNumber.textContent = buildReportNumber();
      }
    }

    updateViewerReportPreview();

    if (viewerReportDate) {
      viewerReportDate.addEventListener("input", updateViewerReportPreview);
      viewerReportDate.addEventListener("change", updateViewerReportPreview);
    }

    if (viewerReportPlace) {
      viewerReportPlace.addEventListener("input", updateViewerReportPreview);
    }

    if (viewerReportText) {
      viewerReportText.addEventListener("input", updateViewerReportPreview);
    }

    if (viewerReportCopy) {
      viewerReportCopy.addEventListener("click", copyViewerReport);
    }

    if (viewerReportClear) {
      viewerReportClear.addEventListener("click", clearViewerReport);
    }

    if (viewerReportDownload) {
      viewerReportDownload.addEventListener("click", openViewerReportPrint);
    }
  }

  function init() {
    updateReportExplorer();
    renderSimpleGrid(filmLanguageGrid, getFilmLanguageItems(), "language-card");
    renderMicroVideos();
    renderSimpleGrid(systemsGrid, getSystems(), "system-card");
    renderSimpleGrid(discussionGrid, getDiscussionQuestions(), "question-card");
    renderBooks();
    renderDownloads();
    initVideoModal();
    initSectionNav();
    initSmoothScrollOffset();
    initViewerReport();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
