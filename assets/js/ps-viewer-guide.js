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
      activeClass: "is-active",
      viewerReportDefaultDate: "—",
      viewerReportDefaultSignature: "Anonimowo",
      viewerReportDefaultWhatStayed: "Tutaj pojawi się Twoja pierwsza odpowiedź.",
      viewerReportDefaultStrongestMoment: "Tutaj pojawi się moment, który wraca najmocniej.",
      viewerReportDefaultResponsibility: "Tutaj pojawi się Twoja refleksja o odpowiedzialności.",
      viewerReportDefaultPassForward: "Tutaj pojawi się jedno zdanie, które chcesz przekazać dalej.",
      viewerReportCopied: "Raport został skopiowany.",
      viewerReportCleared: "Raport został wyczyszczony.",
      viewerReportPrintReady: "Otwieram kartę do zapisu jako PDF…"
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
      activeClass: "is-active",
      viewerReportDefaultDate: "—",
      viewerReportDefaultSignature: "Anonymous",
      viewerReportDefaultWhatStayed: "Your first response will appear here.",
      viewerReportDefaultStrongestMoment: "The moment that returns most strongly will appear here.",
      viewerReportDefaultResponsibility: "Your reflection on responsibility will appear here.",
      viewerReportDefaultPassForward: "The sentence you want to pass forward will appear here.",
      viewerReportCopied: "The report has been copied.",
      viewerReportCleared: "The report has been cleared.",
      viewerReportPrintReady: "Opening print card for PDF export…"
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
  const viewerReportName = document.getElementById("viewerReportName");
  const viewerReportAnonymous = document.getElementById("viewerReportAnonymous");
  const viewerReportWhatStayed = document.getElementById("viewerReportWhatStayed");
  const viewerReportStrongestMoment = document.getElementById("viewerReportStrongestMoment");
  const viewerReportResponsibility = document.getElementById("viewerReportResponsibility");
  const viewerReportPassForward = document.getElementById("viewerReportPassForward");

  const viewerReportNumber = document.getElementById("viewerReportNumber");
  const viewerReportDatePreview = document.getElementById("viewerReportDatePreview");
  const viewerReportSignaturePreview = document.getElementById("viewerReportSignaturePreview");
  const viewerReportWhatStayedPreview = document.getElementById("viewerReportWhatStayedPreview");
  const viewerReportStrongestMomentPreview = document.getElementById("viewerReportStrongestMomentPreview");
  const viewerReportResponsibilityPreview = document.getElementById("viewerReportResponsibilityPreview");
  const viewerReportPassForwardPreview = document.getElementById("viewerReportPassForwardPreview");
  const viewerReportDownload = document.getElementById("viewerReportDownload");
  const viewerReportCopy = document.getElementById("viewerReportCopy");
  const viewerReportClear = document.getElementById("viewerReportClear");
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
    if (!list.length) return null;

    const chipsWrap = createEl("div", "chips");
    list.forEach((chip) => {
      chipsWrap.appendChild(createEl("span", "chip", chip));
    });
    container.appendChild(chipsWrap);
    return chipsWrap;
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

  function createGenericCard(item, cardClassName = "card") {
    const card = createEl("article", cardClassName);
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

  function renderSimpleGrid(container, items, cardClassName = "card") {
    if (!container) return;
    container.innerHTML = "";

    if (!items.length) {
      container.appendChild(createEl("p", "grid-empty", T.emptyGrid));
      return;
    }

    items.forEach((item) => {
      container.appendChild(createGenericCard(item, cardClassName));
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
      const href = getItemValue(item, ["href", "link", "url"], "");
      const card = createEl(
        "article",
        hasRealLink(href) ? "download-card" : "download-card is-disabled"
      );

      renderChips(card, getItemValue(item, ["chips", "tags"], []));

      const title = getItemValue(item, ["title", "name"], "");
      const type = getItemValue(item, ["type", "format"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");
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

      const ctaRow = createEl("div", "download-actions");
      ctaRow.appendChild(
        createLinkButton({
          href,
          label: hasRealLink(href) ? cta : T.unavailable,
          className: "download-button",
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

      renderChips(card, getItemValue(item, ["chips", "tags"], []));

      const title = getItemValue(item, ["title", "name"], "");
      const subtitle = getItemValue(item, ["subtitle"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");

      card.appendChild(createEl("h3", "", title));

      if (isMeaningfulString(subtitle)) {
        card.appendChild(createEl("div", "micro-subtitle", subtitle));
      }

      const copy = createEl("div", "card-copy");
      setRichText(copy, text);
      card.appendChild(copy);

      const actions = createEl("div", "micro-video-actions");
      const playButton = document.createElement("button");
      playButton.type = "button";
      playButton.className = "micro-video-button";
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

  function formatDisplayDate(value) {
    if (!isMeaningfulString(value)) return T.viewerReportDefaultDate;
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleDateString(LANG === "pl" ? "pl-PL" : "en-GB");
    } catch {
      return value;
    }
  }

  function createReportNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `RW-${yyyy}${mm}${dd}-${hh}${min}`;
  }

  function getViewerReportStorageKey() {
    return `ps-viewer-report-${LANG}`;
  }

  function setStatus(message) {
    if (!viewerReportStatus) return;
    viewerReportStatus.textContent = message || "";
  }

  function getViewerReportState() {
    return {
      reportNumber: viewerReportNumber?.textContent?.trim() || createReportNumber(),
      date: viewerReportDate?.value || "",
      name: viewerReportName?.value?.trim() || "",
      anonymous: !!viewerReportAnonymous?.checked,
      whatStayed: viewerReportWhatStayed?.value?.trim() || "",
      strongestMoment: viewerReportStrongestMoment?.value?.trim() || "",
      responsibility: viewerReportResponsibility?.value?.trim() || "",
      passForward: viewerReportPassForward?.value?.trim() || ""
    };
  }

  function saveViewerReportState() {
    if (!viewerReportForm) return;
    const state = getViewerReportState();
    localStorage.setItem(getViewerReportStorageKey(), JSON.stringify(state));
  }

  function loadViewerReportState() {
    if (!viewerReportForm) return;
    const raw = localStorage.getItem(getViewerReportStorageKey());
    if (!raw) return;

    try {
      const state = JSON.parse(raw);
      if (viewerReportNumber && isMeaningfulString(state.reportNumber)) {
        viewerReportNumber.textContent = state.reportNumber;
      }
      if (viewerReportDate && isMeaningfulString(state.date)) viewerReportDate.value = state.date;
      if (viewerReportName && isMeaningfulString(state.name)) viewerReportName.value = state.name;
      if (viewerReportAnonymous) viewerReportAnonymous.checked = !!state.anonymous;
      if (viewerReportWhatStayed && isMeaningfulString(state.whatStayed)) {
        viewerReportWhatStayed.value = state.whatStayed;
      }
      if (viewerReportStrongestMoment && isMeaningfulString(state.strongestMoment)) {
        viewerReportStrongestMoment.value = state.strongestMoment;
      }
      if (viewerReportResponsibility && isMeaningfulString(state.responsibility)) {
        viewerReportResponsibility.value = state.responsibility;
      }
      if (viewerReportPassForward && isMeaningfulString(state.passForward)) {
        viewerReportPassForward.value = state.passForward;
      }
    } catch {
      // ignore corrupted local state
    }
  }

  function updateViewerReportPreview() {
    if (!viewerReportForm) return;

    const state = getViewerReportState();

    if (viewerReportDatePreview) {
      viewerReportDatePreview.textContent = formatDisplayDate(state.date);
    }

    if (viewerReportSignaturePreview) {
      viewerReportSignaturePreview.textContent =
        state.anonymous || !state.name
          ? T.viewerReportDefaultSignature
          : state.name;
    }

    if (viewerReportWhatStayedPreview) {
      viewerReportWhatStayedPreview.textContent =
        state.whatStayed || T.viewerReportDefaultWhatStayed;
    }

    if (viewerReportStrongestMomentPreview) {
      viewerReportStrongestMomentPreview.textContent =
        state.strongestMoment || T.viewerReportDefaultStrongestMoment;
    }

    if (viewerReportResponsibilityPreview) {
      viewerReportResponsibilityPreview.textContent =
        state.responsibility || T.viewerReportDefaultResponsibility;
    }

    if (viewerReportPassForwardPreview) {
      viewerReportPassForwardPreview.textContent =
        state.passForward || T.viewerReportDefaultPassForward;
    }

    saveViewerReportState();
  }

  function buildViewerReportText() {
    const state = getViewerReportState();
    const signature =
      state.anonymous || !state.name ? T.viewerReportDefaultSignature : state.name;

    return [
      "Prawda Sumienia",
      "Raport widza",
      state.reportNumber,
      "",
      `Data: ${formatDisplayDate(state.date)}`,
      `Podpis: ${signature}`,
      "",
      "Co zostało po seansie:",
      state.whatStayed || "—",
      "",
      "Najmocniejszy moment:",
      state.strongestMoment || "—",
      "",
      "Odpowiedzialność:",
      state.responsibility || "—",
      "",
      "Co przekazać dalej:",
      state.passForward || "—",
      "",
      "To nie jest raport historyczny. To osobista odpowiedź po spotkaniu ze świadectwem."
    ].join("\n");
  }

  async function copyViewerReport() {
    try {
      await navigator.clipboard.writeText(buildViewerReportText());
      setStatus(T.viewerReportCopied);
    } catch {
      setStatus("");
    }
  }

  function clearViewerReport() {
    if (!viewerReportForm) return;

    viewerReportForm.reset();

    if (viewerReportNumber) {
      viewerReportNumber.textContent = createReportNumber();
    }

    if (viewerReportDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      viewerReportDate.value = `${yyyy}-${mm}-${dd}`;
    }

    updateViewerReportPreview();
    localStorage.removeItem(getViewerReportStorageKey());
    setStatus(T.viewerReportCleared);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function openViewerReportPrintCard() {
    const state = getViewerReportState();
    const signature =
      state.anonymous || !state.name ? T.viewerReportDefaultSignature : state.name;

    const reportHtml = `
<!DOCTYPE html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(state.reportNumber)}</title>
<style>
  body{
    margin:0;
    padding:32px;
    background:#f2ebdd;
    color:#171717;
    font-family: Georgia, "Times New Roman", serif;
  }
  .sheet{
    max-width:900px;
    margin:0 auto;
    background:#fbf7ee;
    border:1px solid rgba(0,0,0,.12);
    box-shadow:0 18px 60px rgba(0,0,0,.12);
    padding:34px 32px 28px;
  }
  .top{
    display:flex;
    justify-content:space-between;
    gap:16px;
    align-items:flex-start;
    border-bottom:1px solid rgba(0,0,0,.10);
    padding-bottom:18px;
    margin-bottom:20px;
  }
  .brand{
    font-size:22px;
    letter-spacing:.08em;
    text-transform:uppercase;
  }
  .sub{
    margin-top:6px;
    font-size:11px;
    letter-spacing:.16em;
    text-transform:uppercase;
    color:#665f53;
  }
  .number{
    font-size:12px;
    letter-spacing:.10em;
    text-transform:uppercase;
    border:1px solid rgba(0,0,0,.12);
    padding:8px 12px;
  }
  .meta{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
    margin-bottom:22px;
  }
  .meta-label{
    display:block;
    font-size:11px;
    letter-spacing:.12em;
    text-transform:uppercase;
    color:#665f53;
    margin-bottom:4px;
  }
  .meta-value{
    font-size:15px;
    line-height:1.5;
  }
  .block{
    padding-bottom:16px;
    margin-bottom:16px;
    border-bottom:1px solid rgba(0,0,0,.08);
  }
  .block-label{
    font-size:11px;
    letter-spacing:.12em;
    text-transform:uppercase;
    color:#665f53;
    margin-bottom:8px;
  }
  .block-value{
    white-space:pre-line;
    line-height:1.72;
    font-size:16px;
  }
  .footer{
    margin-top:10px;
    font-size:13px;
    line-height:1.6;
    color:#665f53;
  }
  @media print{
    body{padding:0;background:#fff;}
    .sheet{box-shadow:none;border:0;max-width:none;}
  }
</style>
</head>
<body>
  <div class="sheet">
    <div class="top">
      <div>
        <div class="brand">Prawda Sumienia</div>
        <div class="sub">Raport widza · odpowiedź po seansie</div>
      </div>
      <div class="number">${escapeHtml(state.reportNumber)}</div>
    </div>

    <div class="meta">
      <div>
        <span class="meta-label">Data</span>
        <div class="meta-value">${escapeHtml(formatDisplayDate(state.date))}</div>
      </div>
      <div>
        <span class="meta-label">Podpis</span>
        <div class="meta-value">${escapeHtml(signature)}</div>
      </div>
    </div>

    <div class="block">
      <div class="block-label">Co zostało po seansie</div>
      <div class="block-value">${escapeHtml(state.whatStayed || "—")}</div>
    </div>

    <div class="block">
      <div class="block-label">Najmocniejszy moment</div>
      <div class="block-value">${escapeHtml(state.strongestMoment || "—")}</div>
    </div>

    <div class="block">
      <div class="block-label">Odpowiedzialność</div>
      <div class="block-value">${escapeHtml(state.responsibility || "—")}</div>
    </div>

    <div class="block">
      <div class="block-label">Co przekazać dalej</div>
      <div class="block-value">${escapeHtml(state.passForward || "—")}</div>
    </div>

    <div class="footer">
      To nie jest raport historyczny. To osobista odpowiedź po spotkaniu ze świadectwem.
    </div>
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=980,height=860");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();

    setStatus(T.viewerReportPrintReady);

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

  function initViewerReport() {
    if (!viewerReportForm) return;

    if (viewerReportNumber && !isMeaningfulString(viewerReportNumber.textContent)) {
      viewerReportNumber.textContent = createReportNumber();
    }

    if (viewerReportDate && !viewerReportDate.value) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      viewerReportDate.value = `${yyyy}-${mm}-${dd}`;
    }

    loadViewerReportState();
    updateViewerReportPreview();

    [
      viewerReportDate,
      viewerReportName,
      viewerReportAnonymous,
      viewerReportWhatStayed,
      viewerReportStrongestMoment,
      viewerReportResponsibility,
      viewerReportPassForward
    ].forEach((field) => {
      if (!field) return;
      field.addEventListener("input", () => {
        updateViewerReportPreview();
        setStatus("");
      });
      field.addEventListener("change", () => {
        updateViewerReportPreview();
        setStatus("");
      });
    });

    if (viewerReportCopy) {
      viewerReportCopy.addEventListener("click", copyViewerReport);
    }

    if (viewerReportClear) {
      viewerReportClear.addEventListener("click", clearViewerReport);
    }

    if (viewerReportDownload) {
      viewerReportDownload.addEventListener("click", openViewerReportPrintCard);
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
