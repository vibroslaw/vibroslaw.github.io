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

  const viewerReportName = document.getElementById("viewerReportName");
  const viewerReportAnonymous = document.getElementById("viewerReportAnonymous");
  const viewerReportWhatStayed = document.getElementById("viewerReportWhatStayed");
  const viewerReportStrongestMoment = document.getElementById("viewerReportStrongestMoment");
  const viewerReportResponsibility = document.getElementById("viewerReportResponsibility");
  const viewerReportPassForward = document.getElementById("viewerReportPassForward");

  const viewerReportDownload =
    document.getElementById("viewerReportDownload") ||
    document.getElementById("viewerReportPdfButton");
  const viewerReportCopy =
    document.getElementById("viewerReportCopy") ||
    document.getElementById("viewerReportCopyButton");
  const viewerReportClear =
    document.getElementById("viewerReportClear") ||
    document.getElementById("viewerReportClearButton");

  const viewerReportStatus = document.getElementById("viewerReportStatus");
  const viewerReportNumber = document.getElementById("viewerReportNumber");

  const viewerReportDatePreview = document.getElementById("viewerReportDatePreview");
  const viewerReportPlacePreview = document.getElementById("viewerReportPlacePreview");
  const viewerReportTextPreview = document.getElementById("viewerReportTextPreview");
  const viewerReportSignaturePreview = document.getElementById("viewerReportSignaturePreview");
  const viewerReportWhatStayedPreview = document.getElementById("viewerReportWhatStayedPreview");
  const viewerReportStrongestMomentPreview = document.getElementById("viewerReportStrongestMomentPreview");
  const viewerReportResponsibilityPreview = document.getElementById("viewerReportResponsibilityPreview");
  const viewerReportPassForwardPreview = document.getElementById("viewerReportPassForwardPreview");

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

  function getViewerReportMode() {
    if (viewerReportText) return "simple";
    if (
      viewerReportWhatStayed ||
      viewerReportStrongestMoment ||
      viewerReportResponsibility ||
      viewerReportPassForward
    ) {
      return "extended";
    }
    return "none";
  }

  function getViewerReportSnapshot() {
    const mode = getViewerReportMode();

    if (mode === "simple") {
      return {
        mode,
        date: viewerReportDate ? viewerReportDate.value : "",
        place: viewerReportPlace ? viewerReportPlace.value.trim() : "",
        text: viewerReportText ? viewerReportText.value.trim() : "",
        number: viewerReportNumber ? viewerReportNumber.textContent.trim() : buildReportNumber()
      };
    }

    if (mode === "extended") {
      return {
        mode,
        date: viewerReportDate ? viewerReportDate.value : "",
        name: viewerReportName ? viewerReportName.value.trim() : "",
        anonymous: !!(viewerReportAnonymous && viewerReportAnonymous.checked),
        whatStayed: viewerReportWhatStayed ? viewerReportWhatStayed.value.trim() : "",
        strongestMoment: viewerReportStrongestMoment ? viewerReportStrongestMoment.value.trim() : "",
        responsibility: viewerReportResponsibility ? viewerReportResponsibility.value.trim() : "",
        passForward: viewerReportPassForward ? viewerReportPassForward.value.trim() : "",
        number: viewerReportNumber ? viewerReportNumber.textContent.trim() : buildReportNumber()
      };
    }

    return { mode: "none" };
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

      if (viewerReportName && isMeaningfulString(parsed.name)) {
        viewerReportName.value = parsed.name;
      }

      if (viewerReportAnonymous) {
        viewerReportAnonymous.checked = !!parsed.anonymous;
      }

      if (viewerReportWhatStayed && isMeaningfulString(parsed.whatStayed)) {
        viewerReportWhatStayed.value = parsed.whatStayed;
      }

      if (viewerReportStrongestMoment && isMeaningfulString(parsed.strongestMoment)) {
        viewerReportStrongestMoment.value = parsed.strongestMoment;
      }

      if (viewerReportResponsibility && isMeaningfulString(parsed.responsibility)) {
        viewerReportResponsibility.value = parsed.responsibility;
      }

      if (viewerReportPassForward && isMeaningfulString(parsed.passForward)) {
        viewerReportPassForward.value = parsed.passForward;
      }

      if (viewerReportNumber && isMeaningfulString(parsed.number)) {
        viewerReportNumber.textContent = parsed.number;
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  function setViewerReportStatus(message) {
    if (viewerReportStatus) {
      viewerReportStatus.textContent = message || "";
    }
  }

  function updateViewerReportPreview() {
    if (!viewerReportForm) return;

    const snapshot = getViewerReportSnapshot();

    if (viewerReportNumber && !isMeaningfulString(viewerReportNumber.textContent)) {
      viewerReportNumber.textContent = buildReportNumber();
    }

    if (snapshot.mode === "simple") {
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
    }

    if (snapshot.mode === "extended") {
      if (viewerReportDatePreview) {
        viewerReportDatePreview.textContent = formatDateForDisplay(snapshot.date);
      }

      if (viewerReportSignaturePreview) {
        const signature =
          snapshot.anonymous || !isMeaningfulString(snapshot.name)
            ? "Anonimowo"
            : snapshot.name;
        viewerReportSignaturePreview.textContent = signature;
      }

      if (viewerReportWhatStayedPreview) {
        viewerReportWhatStayedPreview.textContent = isMeaningfulString(snapshot.whatStayed)
          ? snapshot.whatStayed
          : "Tutaj pojawi się Twoja pierwsza odpowiedź.";
      }

      if (viewerReportStrongestMomentPreview) {
        viewerReportStrongestMomentPreview.textContent = isMeaningfulString(snapshot.strongestMoment)
          ? snapshot.strongestMoment
          : "Tutaj pojawi się moment, który wraca najmocniej.";
      }

      if (viewerReportResponsibilityPreview) {
        viewerReportResponsibilityPreview.textContent = isMeaningfulString(snapshot.responsibility)
          ? snapshot.responsibility
          : "Tutaj pojawi się Twoja refleksja o odpowiedzialności.";
      }

      if (viewerReportPassForwardPreview) {
        viewerReportPassForwardPreview.textContent = isMeaningfulString(snapshot.passForward)
          ? snapshot.passForward
          : "Tutaj pojawi się jedno zdanie, które chcesz przekazać dalej.";
      }
    }

    persistViewerReport();
  }

  function buildViewerReportPlainText() {
    const snapshot = getViewerReportSnapshot();

    if (snapshot.mode === "simple") {
      return [
        `${T.reportPaperTitle} ${T.reportPaperSubtitle}`,
        `${T.reportDateLabel}: ${formatDateForDisplay(snapshot.date)}`,
        `${T.reportPlaceLabel}: ${isMeaningfulString(snapshot.place) ? snapshot.place : T.reportDefaultPlace}`,
        "",
        isMeaningfulString(snapshot.text) ? snapshot.text : T.reportDefaultText
      ].join("\n");
    }

    if (snapshot.mode === "extended") {
      const signature =
        snapshot.anonymous || !isMeaningfulString(snapshot.name)
          ? "Anonimowo"
          : snapshot.name;

      return [
        `${T.reportPaperTitle} ${T.reportPaperSubtitle}`,
        `${T.reportDateLabel}: ${formatDateForDisplay(snapshot.date)}`,
        `${LANG === "pl" ? "Podpis" : "Signature"}: ${signature}`,
        "",
        `${LANG === "pl" ? "Co zostało po seansie" : "What remained after the screening"}:`,
        snapshot.whatStayed || "",
        "",
        `${LANG === "pl" ? "Najmocniejszy moment" : "Strongest moment"}:`,
        snapshot.strongestMoment || "",
        "",
        `${LANG === "pl" ? "Odpowiedzialność" : "Responsibility"}:`,
        snapshot.responsibility || "",
        "",
        `${LANG === "pl" ? "Co przekazać dalej" : "What to pass forward"}:`,
        snapshot.passForward || ""
      ].join("\n");
    }

    return "";
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

    if (viewerReportName) {
      viewerReportName.value = "";
    }

    if (viewerReportAnonymous) {
      viewerReportAnonymous.checked = false;
    }

    if (viewerReportWhatStayed) viewerReportWhatStayed.value = "";
    if (viewerReportStrongestMoment) viewerReportStrongestMoment.value = "";
    if (viewerReportResponsibility) viewerReportResponsibility.value = "";
    if (viewerReportPassForward) viewerReportPassForward.value = "";

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
    const numberDisplay = isMeaningfulString(snapshot.number) ? snapshot.number : buildReportNumber();

    let metaRightLabel = T.reportPlaceLabel;
    let metaRightValue = T.reportDefaultPlace;
    let bodyHtml = "";
    let introText = T.reportPaperIntro;

    if (snapshot.mode === "simple") {
      metaRightValue = isMeaningfulString(snapshot.place) ? snapshot.place : T.reportDefaultPlace;
      bodyHtml = (isMeaningfulString(snapshot.text) ? snapshot.text : T.reportDefaultText)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
    }

    if (snapshot.mode === "extended") {
      metaRightLabel = LANG === "pl" ? "Podpis" : "Signature";
      metaRightValue =
        snapshot.anonymous || !isMeaningfulString(snapshot.name)
          ? "Anonimowo"
          : snapshot.name;

      const sections = [
        {
          label: LANG === "pl" ? "Co zostało po seansie" : "What remained after the screening",
          value: snapshot.whatStayed
        },
        {
          label: LANG === "pl" ? "Najmocniejszy moment" : "Strongest moment",
          value: snapshot.strongestMoment
        },
        {
          label: LANG === "pl" ? "Odpowiedzialność" : "Responsibility",
          value: snapshot.responsibility
        },
        {
          label: LANG === "pl" ? "Co przekazać dalej" : "What to pass forward",
          value: snapshot.passForward
        }
      ];

      bodyHtml = sections
        .map((section) => {
          const safeValue = (section.value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");
          return `
            <div class="print-block">
              <div class="print-label">${section.label}</div>
              <div class="print-value">${safeValue || "—"}</div>
            </div>
          `;
        })
        .join("");
    }

    const printWindow = window.open("", "_blank", "width=980,height=1280");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${T.reportPaperTitle}</title>
<style>
  :root{
    --paper:#e8d9bd;
    --paper-deep:#d8c19a;
    --paper-text:#34281d;
    --paper-muted:#705c47;
    --rule:#b49471;
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    padding:38px;
    background:#f3eee5;
    font-family:"Special Elite","Courier New",monospace;
    color:var(--paper-text);
  }
  .page{
    max-width:860px;
    margin:0 auto;
  }
  .sheet{
    position:relative;
    min-height:1120px;
    padding:56px 52px 40px;
    overflow:hidden;
    background:
      radial-gradient(circle at 12% 10%, rgba(255,255,255,.34), transparent 16%),
      radial-gradient(circle at 84% 76%, rgba(118,82,47,.15), transparent 22%),
      linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.02)),
      linear-gradient(180deg, var(--paper), var(--paper-deep));
    border:1px solid rgba(121,92,60,.30);
    box-shadow:0 18px 40px rgba(0,0,0,.16);
  }
  .sheet::before{
    content:"";
    position:absolute;
    inset:0;
    opacity:.22;
    pointer-events:none;
    background:
      radial-gradient(circle at 22% 26%, rgba(255,255,255,.34), transparent 12%),
      radial-gradient(circle at 68% 34%, rgba(92,63,38,.12), transparent 20%),
      radial-gradient(circle at 76% 78%, rgba(92,63,38,.14), transparent 18%),
      repeating-linear-gradient(
        0deg,
        rgba(94,69,45,.032) 0px,
        rgba(94,69,45,.032) 1px,
        transparent 1px,
        transparent 4px
      );
    mix-blend-mode:multiply;
  }
  .top{
    position:relative;
    z-index:1;
    text-align:center;
    padding-bottom:18px;
    margin-bottom:22px;
    border-bottom:1px solid rgba(121,96,69,.32);
  }
  .title{
    font-size:42px;
    line-height:1;
    letter-spacing:.10em;
    text-transform:uppercase;
    margin:0;
  }
  .subtitle{
    margin-top:8px;
    font-size:16px;
    color:var(--paper-muted);
  }
  .number{
    margin-top:12px;
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
    margin-bottom:22px;
    font-size:16px;
  }
  .intro{
    position:relative;
    z-index:1;
    margin-bottom:22px;
    line-height:1.95;
    font-size:16px;
    color:#4c3d2e;
  }
  .body{
    position:relative;
    z-index:1;
    min-height:440px;
    line-height:2.05;
    font-size:17px;
    white-space:pre-wrap;
    word-break:break-word;
  }
  .print-block + .print-block{
    margin-top:20px;
  }
  .print-label{
    margin-bottom:8px;
    font-size:14px;
    text-transform:uppercase;
    letter-spacing:.08em;
    color:#7b6752;
  }
  .print-value{
    min-height:54px;
  }
  .rule{
    position:relative;
    z-index:1;
    height:1px;
    margin:28px 0 18px;
    background:linear-gradient(90deg, rgba(180,148,113,.85), rgba(180,148,113,.45));
  }
  .footer{
    position:relative;
    z-index:1;
    text-align:center;
    font-size:14px;
    color:var(--paper-muted);
  }
  @media print{
    body{
      padding:0;
      background:#fff;
    }
    .page{
      max-width:none;
    }
    .sheet{
      box-shadow:none;
      border:0;
      min-height:auto;
    }
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
        <div><strong>${T.reportDateLabel}:</strong> ${formatDateForDisplay(snapshot.date)}</div>
        <div><strong>${metaRightLabel}:</strong> ${metaRightValue}</div>
      </div>

      <div class="intro">${introText}</div>

      <div class="body">${bodyHtml}</div>

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

    [viewerReportDate, viewerReportPlace, viewerReportText, viewerReportName,
      viewerReportWhatStayed, viewerReportStrongestMoment, viewerReportResponsibility,
      viewerReportPassForward]
      .filter(Boolean)
      .forEach((field) => {
        field.addEventListener("input", updateViewerReportPreview);
        field.addEventListener("change", updateViewerReportPreview);
      });

    if (viewerReportAnonymous) {
      viewerReportAnonymous.addEventListener("change", updateViewerReportPreview);
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
