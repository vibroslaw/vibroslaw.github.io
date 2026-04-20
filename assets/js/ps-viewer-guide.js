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
      noVideoText:
        "Dodaj identyfikator YouTube w pliku danych, aby ten materiał odtwarzał się bezpośrednio ze strony.",
      linkLabel: "Otwórz",
      unavailable: "W przygotowaniu",
      booksAuthorPrefix: "Autor:",
      downloadTypePrefix: "Format:",
      defaultTabLabel: "Wejście",
      reportExcerptLabel: "Punkt wejścia",
      copied: "Tekst raportu został skopiowany.",
      cleared: "Raport został wyczyszczony.",
      pdfReady: "Otworzono wersję gotową do zapisu jako PDF.",
      activeClass: "is-active"
    },
    en: {
      reportFallbackTitle: "Choose an entry point",
      reportFallbackText:
        "Begin with one fragment. That is the clearest way to enter the source more deeply without weakening the gravity of the work as a whole.",
      emptyGrid: "Content will appear here once the data file is filled in.",
      openVideo: "Play video",
      closeVideo: "Close",
      noVideoText:
        "Add a YouTube ID in the data file so this material can be played directly from the page.",
      linkLabel: "Open",
      unavailable: "Coming soon",
      booksAuthorPrefix: "Author:",
      downloadTypePrefix: "Format:",
      defaultTabLabel: "Entry",
      reportExcerptLabel: "Entry point",
      copied: "The report text has been copied.",
      cleared: "The report has been cleared.",
      pdfReady: "A PDF-ready version has been opened.",
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
  const viewerReportWhatStayed = document.getElementById("viewerReportWhatStayed");
  const viewerReportDatePreview = document.getElementById("viewerReportDatePreview");
  const viewerReportPlacePreview = document.getElementById("viewerReportPlacePreview");
  const viewerReportWhatStayedPreview = document.getElementById("viewerReportWhatStayedPreview");
  const viewerReportPdfButton = document.getElementById("viewerReportPdfButton");
  const viewerReportCopyButton = document.getElementById("viewerReportCopyButton");
  const viewerReportClearButton = document.getElementById("viewerReportClearButton");
  const viewerReportStatus = document.getElementById("viewerReportStatus");

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
      link.addEventListener("click", (event) => event.preventDefault());
      link.textContent = label || T.unavailable;
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

    const wrapper = createEl("div", "detail-shell report-detail");

    renderChips(wrapper, getItemValue(entry, ["chips", "tags"], []));

    const title = getItemValue(entry, ["title", "name"], "");
    const intro = getItemValue(entry, ["intro", "summary", "lead"], "");
    const excerptLabel = getItemValue(entry, ["excerptLabel", "sourceLabel"], T.reportExcerptLabel);
    const excerpt = getItemValue(entry, ["excerpt", "sourceText", "entryText"], "");
    const tabs = normalizeArray(getItemValue(entry, ["tabs", "panels", "sections"], []));

    wrapper.appendChild(createEl("h3", "report-detail-title", title));

    if (isMeaningfulString(intro)) {
      wrapper.appendChild(createEl("p", "report-detail-intro", intro));
    }

    if (isMeaningfulString(excerpt)) {
      const excerptBox = createEl("div", "report-excerpt-box");
      excerptBox.appendChild(createEl("div", "report-excerpt-label", excerptLabel));
      const excerptText = createEl("div", "report-excerpt-text");
      setRichText(excerptText, excerpt);
      excerptBox.appendChild(excerptText);
      wrapper.appendChild(excerptBox);
    }

    if (tabs.length) {
      const tabsNav = createEl("div", "report-tabs-nav");
      const tabsContent = createEl("div", "report-tabs-content");

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
      tabsContent.appendChild(tabPanel);

      wrapper.appendChild(tabsNav);
      wrapper.appendChild(tabsContent);
    }

    reportDetail.appendChild(wrapper);
  }

  function updateReportExplorer() {
    renderReportList();
    renderReportDetail();
  }

  function createInfoCard(item, cardClass = "card") {
    const card = createEl("article", cardClass);
    const body = createEl("div", "card-body");

    renderChips(body, getItemValue(item, ["chips", "tags"], []));

    const title = getItemValue(item, ["title", "name"], "");
    const text = getItemValue(item, ["text", "body", "description"], "");

    if (isMeaningfulString(title)) {
      body.appendChild(createEl("h3", "", title));
    }

    const copy = createEl("div", "card-copy");
    setRichText(copy, text);
    body.appendChild(copy);

    card.appendChild(body);
    return card;
  }

  function renderSimpleGrid(container, items, cardClass) {
    if (!container) return;
    container.innerHTML = "";

    if (!items.length) {
      container.appendChild(createEl("p", "grid-empty", T.emptyGrid));
      return;
    }

    items.forEach((item) => {
      container.appendChild(createInfoCard(item, cardClass));
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
      const body = createEl("div", "card-body");

      renderChips(body, getItemValue(item, ["chips", "tags"], []));

      const title = getItemValue(item, ["title", "name"], "");
      const author = getItemValue(item, ["author"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");
      const href = getItemValue(item, ["href", "link", "url"], "");
      const cta = getItemValue(item, ["cta", "buttonLabel"], T.linkLabel);

      if (isMeaningfulString(title)) {
        body.appendChild(createEl("h3", "", title));
      }

      if (isMeaningfulString(author)) {
        body.appendChild(createEl("div", "book-author", `${T.booksAuthorPrefix} ${author}`));
      }

      const copy = createEl("div", "card-copy");
      setRichText(copy, text);
      body.appendChild(copy);

      const ctaRow = createEl("div", "card-cta-row");
      ctaRow.appendChild(
        createLinkButton({
          href,
          label: hasRealLink(href) ? cta : T.unavailable,
          className: "btn btn-secondary",
          target: hasRealLink(href) ? "_blank" : ""
        })
      );
      body.appendChild(ctaRow);

      card.appendChild(body);
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
      const body = createEl("div", "card-body");

      renderChips(body, getItemValue(item, ["chips", "tags"], []));

      const title = getItemValue(item, ["title", "name"], "");
      const type = getItemValue(item, ["type", "format"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");
      const href = getItemValue(item, ["href", "link", "url"], "");
      const cta = getItemValue(item, ["cta", "buttonLabel"], T.linkLabel);

      if (isMeaningfulString(title)) {
        body.appendChild(createEl("h3", "", title));
      }

      if (isMeaningfulString(type)) {
        body.appendChild(createEl("div", "download-type", `${T.downloadTypePrefix} ${type}`));
      }

      const copy = createEl("div", "card-copy");
      setRichText(copy, text);
      body.appendChild(copy);

      const ctaRow = createEl("div", "download-actions");
      ctaRow.appendChild(
        createLinkButton({
          href,
          label: hasRealLink(href) ? cta : T.unavailable,
          className: "download-button",
          target: hasRealLink(href) ? "_blank" : ""
        })
      );
      body.appendChild(ctaRow);

      card.appendChild(body);
      downloadsGrid.appendChild(card);
    });
  }

  function openVideoModal(video) {
    if (!videoModal || !videoModalFrame || !videoModalTitle || !videoModalPlaceholder) return;

    const title = getItemValue(video, ["title", "name"], "Video");
    const youtubeId = getItemValue(video, ["youtubeId", "videoId", "id"], "");
    const embedUrl = isMeaningfulString(youtubeId)
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId.trim())}?autoplay=1&rel=0`
      : "";

    videoModalTitle.textContent = title;

    if (embedUrl) {
      videoModalFrame.src = embedUrl;
      videoModalFrame.hidden = false;
      videoModalPlaceholder.classList.remove("is-visible");
      videoModalPlaceholder.hidden = true;
    } else {
      videoModalFrame.src = "";
      videoModalFrame.hidden = true;
      videoModalPlaceholder.hidden = false;
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
      const body = createEl("div", "card-body");

      const badge = getItemValue(item, ["badge", "kicker", "label"], "");
      if (isMeaningfulString(badge)) {
        body.appendChild(createEl("div", "micro-badge", badge));
      }

      const title = getItemValue(item, ["title", "name"], "");
      const subtitle = getItemValue(item, ["subtitle"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");

      if (isMeaningfulString(title)) {
        body.appendChild(createEl("h3", "", title));
      }

      if (isMeaningfulString(subtitle)) {
        body.appendChild(createEl("div", "micro-subtitle", subtitle));
      }

      const copy = createEl("div", "card-copy");
      setRichText(copy, text);
      body.appendChild(copy);

      const actions = createEl("div", "micro-video-actions");
      const playButton = document.createElement("button");
      playButton.type = "button";
      playButton.className = "micro-video-button";
      playButton.textContent = getItemValue(item, ["cta", "buttonLabel"], T.openVideo);
      playButton.addEventListener("click", () => openVideoModal(item));
      actions.appendChild(playButton);

      body.appendChild(actions);
      card.appendChild(body);
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
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetY,
          behavior: "smooth"
        });
      });
    });
  }

  function setStatus(message) {
    if (viewerReportStatus) {
      viewerReportStatus.textContent = message || "";
    }
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(LANG === "pl" ? "pl-PL" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function getViewerReportStorageKey() {
    return `ps-viewer-report-${LANG}-${window.location.pathname}`;
  }

  function getViewerReportPayload() {
    return {
      date: viewerReportDate?.value || "",
      place: viewerReportPlace?.value || (LANG === "pl" ? "Oświęcim" : "Oświęcim"),
      text: viewerReportWhatStayed?.value || ""
    };
  }

  function saveViewerReport() {
    if (!viewerReportForm) return;
    localStorage.setItem(getViewerReportStorageKey(), JSON.stringify(getViewerReportPayload()));
  }

  function loadViewerReport() {
    if (!viewerReportForm) return;
    const raw = localStorage.getItem(getViewerReportStorageKey());
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      if (viewerReportDate && parsed.date) viewerReportDate.value = parsed.date;
      if (viewerReportPlace && parsed.place) viewerReportPlace.value = parsed.place;
      if (viewerReportWhatStayed && parsed.text) viewerReportWhatStayed.value = parsed.text;
    } catch (_) {}
  }

  function updateViewerReportPreview() {
    if (!viewerReportForm) return;

    if (viewerReportDatePreview) {
      viewerReportDatePreview.textContent = formatDate(viewerReportDate?.value || "");
    }

    if (viewerReportPlacePreview) {
      const place = (viewerReportPlace?.value || "").trim();
      viewerReportPlacePreview.textContent = place || (LANG === "pl" ? "Oświęcim" : "Oświęcim");
    }

    if (viewerReportWhatStayedPreview) {
      const text = (viewerReportWhatStayed?.value || "").trim();
      viewerReportWhatStayedPreview.textContent =
        text || (LANG === "pl" ? "Twoja odpowiedź pojawi się tutaj." : "Your response will appear here.");
    }

    saveViewerReport();
  }

  function buildViewerReportText() {
    const payload = getViewerReportPayload();

    if (LANG === "pl") {
      return [
        "RAPORT (dokument osobisty)",
        "",
        `Data: ${formatDate(payload.date)}`,
        `Miejsce: ${payload.place || "Oświęcim"}`,
        "",
        "Ten dokument nie jest testem wiedzy.",
        "Jest zapisem chwili, w której historia przestaje być odległa.",
        "",
        payload.text || "—"
      ].join("\n");
    }

    return [
      "REPORT (personal document)",
      "",
      `Date: ${formatDate(payload.date)}`,
      `Place: ${payload.place || "Oświęcim"}`,
      "",
      "This document is not a test of knowledge.",
      "It is a record of the moment when history stops feeling distant.",
      "",
      payload.text || "—"
    ].join("\n");
  }

  function copyViewerReport() {
    const text = buildViewerReportText();
    navigator.clipboard.writeText(text).then(() => {
      setStatus(T.copied);
    });
  }

  function clearViewerReport() {
    if (!viewerReportForm) return;
    viewerReportForm.reset();

    if (viewerReportPlace) {
      viewerReportPlace.value = LANG === "pl" ? "Oświęcim" : "Oświęcim";
    }

    if (viewerReportDate) {
      const today = new Date();
      viewerReportDate.value = today.toISOString().slice(0, 10);
    }

    updateViewerReportPreview();
    saveViewerReport();
    setStatus(T.cleared);
  }

  function openViewerReportPdf() {
    const payload = getViewerReportPayload();
    const printWindow = window.open("", "_blank", "width=900,height=1200");

    if (!printWindow) return;

    const title =
      LANG === "pl"
        ? "Raport widza — dokument osobisty"
        : "Viewer report — personal document";

    const intro =
      LANG === "pl"
        ? "Ten dokument nie jest testem wiedzy. Jest zapisem chwili, w której historia przestaje być odległa. Jeśli chcesz — zapisz jedną myśl, jedno pytanie lub jedno zdanie, które pozostało po tym doświadczeniu."
        : "This document is not a test of knowledge. It is a record of the moment when history stops feeling distant. If you wish, write down one thought, one question, or one sentence that remained after this experience.";

    const footer =
      LANG === "pl"
        ? "dokument pozostaje do Twojej dyspozycji"
        : "this document remains at your disposal";

    const contentText = (payload.text || "—").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${LANG}">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 16mm; }
          body{
            margin:0;
            background:#f3ead8;
            color:#17120d;
            font-family:"Courier New", monospace;
          }
          .paper{
            min-height:calc(100vh - 32px);
            box-sizing:border-box;
            padding:44px 42px 36px;
            background:
              radial-gradient(circle at 20% 12%, rgba(255,255,255,.34), transparent 18%),
              radial-gradient(circle at 84% 78%, rgba(129,92,55,.10), transparent 18%),
              linear-gradient(180deg, #eee3cf 0%, #e4d3ba 100%);
            border:1px solid rgba(80,52,33,.08);
          }
          .title{
            text-align:center;
            font-size:30px;
            letter-spacing:.22em;
            font-weight:700;
            margin:0;
          }
          .subtitle{
            text-align:center;
            margin-top:10px;
            font-size:20px;
            font-weight:600;
          }
          .meta{
            margin-top:52px;
            font-size:20px;
            line-height:1.4;
          }
          .intro{
            margin-top:50px;
            max-width:30ch;
            font-size:19px;
            line-height:1.45;
            font-weight:600;
          }
          .text{
            margin-top:38px;
            min-height:120px;
            font-size:18px;
            line-height:1.7;
            white-space:pre-line;
          }
          .rule{
            height:1px;
            background:rgba(40,31,23,.28);
            margin:26px 0;
          }
          .footer{
            margin-top:46px;
            font-size:18px;
            font-weight:600;
          }
        </style>
      </head>
      <body>
        <div class="paper">
          <h1 class="title">${LANG === "pl" ? "RAPORT" : "REPORT"}</h1>
          <div class="subtitle">(${LANG === "pl" ? "dokument osobisty" : "personal document"})</div>

          <div class="meta">
            <div><strong>${LANG === "pl" ? "Data" : "Date"}:</strong> ${formatDate(payload.date)}</div>
            <div><strong>${LANG === "pl" ? "Miejsce" : "Place"}:</strong> ${payload.place || "Oświęcim"}</div>
          </div>

          <div class="intro">${intro}</div>

          <div class="text">${contentText}</div>
          <div class="rule"></div>
          <div class="rule"></div>
          <div class="rule"></div>
          <div class="rule"></div>
          <div class="footer">${footer}</div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);

    setStatus(T.pdfReady);
  }

  function initViewerReport() {
    if (!viewerReportForm) return;

    if (viewerReportDate && !viewerReportDate.value) {
      const today = new Date();
      viewerReportDate.value = today.toISOString().slice(0, 10);
    }

    loadViewerReport();
    updateViewerReportPreview();

    [viewerReportDate, viewerReportPlace, viewerReportWhatStayed]
      .filter(Boolean)
      .forEach((el) => {
        el.addEventListener("input", updateViewerReportPreview);
        el.addEventListener("change", updateViewerReportPreview);
      });

    if (viewerReportCopyButton) {
      viewerReportCopyButton.addEventListener("click", copyViewerReport);
    }

    if (viewerReportClearButton) {
      viewerReportClearButton.addEventListener("click", () => {
        setTimeout(clearViewerReport, 0);
      });
    }

    if (viewerReportPdfButton) {
      viewerReportPdfButton.addEventListener("click", openViewerReportPdf);
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
