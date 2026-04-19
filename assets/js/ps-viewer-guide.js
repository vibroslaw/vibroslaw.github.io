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

    const head = createEl("div", "report-detail-head");
    const kicker = getItemValue(entry, ["kicker", "eyebrow", "label"], "");

    if (isMeaningfulString(kicker)) {
      head.appendChild(createEl("div", "report-detail-kicker", kicker));
    }

    head.appendChild(createEl("h3", "report-detail-title", title));

    if (isMeaningfulString(intro)) {
      head.appendChild(createEl("p", "report-detail-intro", intro));
    }

    wrapper.appendChild(head);

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

      wrapper.appendChild(tabsNav);

      const activeTab = tabs[safeTabIndex];
      const tabTitle = getItemValue(activeTab, ["title", "heading"], "");
      const tabBody = getItemValue(activeTab, ["text", "body", "content"], "");
      const tabHtml = getItemValue(activeTab, ["html", "bodyHtml"], "");

      const tabPanel = createEl("div", "report-tab-panel");

      if (isMeaningfulString(tabTitle)) {
        tabPanel.appendChild(createEl("h4", "report-tab-title", tabTitle));
      }

      const tabPanelBody = createEl("div", "report-tab-text");
      if (isMeaningfulString(tabHtml)) {
        tabPanelBody.innerHTML = tabHtml;
      } else {
        setRichText(tabPanelBody, tabBody);
      }

      tabPanel.appendChild(tabPanelBody);
      wrapper.appendChild(tabPanel);
    }

    reportDetail.appendChild(wrapper);
  }

  function updateReportExplorer() {
    renderReportList();
    renderReportDetail();
  }

  function createContentCard(item, cardClass) {
    const card = createEl("article", cardClass);
    renderChips(card, getItemValue(item, ["chips", "tags"], []));

    const title = getItemValue(item, ["title", "name"], "");
    const text = getItemValue(item, ["text", "body", "description"], "");
    const subtitle = getItemValue(item, ["subtitle"], "");

    if (isMeaningfulString(title)) {
      card.appendChild(createEl("h3", "", title));
    }

    if (isMeaningfulString(subtitle)) {
      card.appendChild(createEl("div", "card-subtitle", subtitle));
    }

    const copy = createEl("div", "card-copy");
    setRichText(copy, text);
    card.appendChild(copy);

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
      container.appendChild(createContentCard(item, cardClass));
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

      const actions = createEl("div", "download-actions");
      actions.appendChild(
        createLinkButton({
          href,
          label: hasRealLink(href) ? cta : T.unavailable,
          className: "download-button",
          target: hasRealLink(href) ? "_blank" : ""
        })
      );
      card.appendChild(actions);

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

      const actions = createEl("div", "download-actions");
      actions.appendChild(
        createLinkButton({
          href,
          label: hasRealLink(href) ? cta : T.unavailable,
          className: "download-button",
          target: hasRealLink(href) ? "_blank" : ""
        })
      );
      card.appendChild(actions);

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
      videoModalPlaceholder.innerHTML = `<p>${T.noVideoText}</p>`;
      videoModalPlaceholder.classList.add("is-visible");
    }

    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("video-modal-open");
  }

  function closeVideoModal() {
    if (!videoModal || !videoModalFrame || !videoModalPlaceholder) return;
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
        card.appendChild(createEl("div", "micro-video-badge", badge));
      }

      const title = getItemValue(item, ["title", "name"], "");
      const subtitle = getItemValue(item, ["subtitle"], "");
      const text = getItemValue(item, ["text", "body", "description"], "");

      card.appendChild(createEl("h3", "", title));

      if (isMeaningfulString(subtitle)) {
        card.appendChild(createEl("div", "micro-video-subtitle", subtitle));
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

      if (target.dataset.closeVideoModal === "true") {
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
