(() => {
  "use strict";

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
  const videoModalTitle = document.getElementById("videoModalTitle");
  const videoEmbedWrap = document.getElementById("videoEmbedWrap");
  const videoModalNote = document.getElementById("videoModalNote");

  let activeReportEntryId = null;
  let activeReportTabId = null;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createReportEntryButtons() {
    if (!reportEntryList || !Array.isArray(data.reportEntries)) return;

    reportEntryList.innerHTML = data.reportEntries
      .map((entry) => {
        const isActive = entry.id === activeReportEntryId;
        return `
          <button
            class="report-entry-button ${isActive ? "is-active" : ""}"
            type="button"
            data-report-entry="${escapeHtml(entry.id)}"
          >
            <span class="report-entry-title">${escapeHtml(entry.title)}</span>
            <span class="report-entry-note">${escapeHtml(entry.note)}</span>
          </button>
        `;
      })
      .join("");

    reportEntryList
      .querySelectorAll("[data-report-entry]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-report-entry");
          setActiveReportEntry(id);
        });
      });
  }

  function renderReportDetail() {
    if (!reportDetail || !Array.isArray(data.reportEntries)) return;

    const entry =
      data.reportEntries.find((item) => item.id === activeReportEntryId) ||
      data.reportEntries[0];

    if (!entry) {
      reportDetail.innerHTML = "";
      return;
    }

    const tabs = Array.isArray(entry.tabs) ? entry.tabs : [];
    const activeTab =
      tabs.find((tab) => tab.id === activeReportTabId) || tabs[0] || null;

    reportDetail.innerHTML = `
      <div class="small-label">Wybrane wejście</div>
      <h3 class="report-detail-title">${escapeHtml(entry.title)}</h3>
      <p class="report-detail-intro">${escapeHtml(entry.intro)}</p>

      <div class="excerpt-box">
        <div class="excerpt-label">${escapeHtml(entry.excerptLabel || "Fragment")}</div>
        <p class="excerpt-text">${escapeHtml(entry.excerpt || "")}</p>
      </div>

      <div class="report-tabs">
        ${tabs
          .map(
            (tab) => `
              <button
                class="report-tab ${activeTab && tab.id === activeTab.id ? "is-active" : ""}"
                type="button"
                data-report-tab="${escapeHtml(tab.id)}"
              >
                ${escapeHtml(tab.label)}
              </button>
            `
          )
          .join("")}
      </div>

      <div class="report-tab-panel">
        ${activeTab ? escapeHtml(activeTab.body) : ""}
      </div>
    `;

    reportDetail.querySelectorAll("[data-report-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeReportTabId = button.getAttribute("data-report-tab");
        renderReportDetail();
      });
    });
  }

  function setActiveReportEntry(id) {
    activeReportEntryId = id;
    const entry = data.reportEntries.find((item) => item.id === id);
    activeReportTabId =
      entry && Array.isArray(entry.tabs) && entry.tabs.length
        ? entry.tabs[0].id
        : null;

    createReportEntryButtons();
    renderReportDetail();
  }

  function renderFilmLanguage() {
    if (!filmLanguageGrid || !Array.isArray(data.filmLanguage)) return;

    filmLanguageGrid.innerHTML = data.filmLanguage
      .map(
        (item) => `
          <article class="card language-card">
            <div class="card-body">
              <div class="small-label">Klucz interpretacyjny</div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function openVideoModal(video) {
    if (!videoModal || !videoEmbedWrap || !videoModalTitle || !videoModalNote) return;

    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    videoModalTitle.textContent = video.title || "Krótki materiał";
    videoModalNote.textContent = video.note || "";

    if (video.youtubeId) {
      const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
        video.youtubeId
      )}?autoplay=1&rel=0`;
      videoEmbedWrap.innerHTML = `
        <iframe
          src="${src}"
          title="${escapeHtml(video.title || "Wideo")}"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>
      `;
    } else {
      videoEmbedWrap.innerHTML = `
        <div class="video-placeholder">
          <div>
            <strong>Brak podpiętego wideo.</strong><br />
            W pliku <code>ps-viewer-guide-data.js</code> uzupełnij pole <code>youtubeId</code>
            dla tego klipu.
          </div>
        </div>
      `;
    }
  }

  function closeVideoModal() {
    if (!videoModal || !videoEmbedWrap) return;

    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    videoEmbedWrap.innerHTML = "";
  }

  function renderMicroVideos() {
    if (!microVideoGrid || !Array.isArray(data.microVideos)) return;

    microVideoGrid.innerHTML = data.microVideos
      .map(
        (video, index) => `
          <article class="card micro-video-card">
            <div class="card-body">
              <div class="small-label">Punkt ${index + 1}</div>
              <h3>${escapeHtml(video.title)}</h3>
              <p>${escapeHtml(video.description)}</p>

              <div class="micro-video-meta">
                <span class="micro-video-length">${escapeHtml(video.length || "")}</span>
                <button
                  class="micro-video-play"
                  type="button"
                  data-micro-video-index="${index}"
                >
                  Odtwórz
                </button>
              </div>
            </div>
          </article>
        `
      )
      .join("");

    microVideoGrid
      .querySelectorAll("[data-micro-video-index]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.getAttribute("data-micro-video-index"));
          const video = data.microVideos[index];
          if (video) openVideoModal(video);
        });
      });
  }

  function renderSystems() {
    if (!systemsGrid || !Array.isArray(data.systems)) return;

    systemsGrid.innerHTML = data.systems
      .map(
        (item) => `
          <article class="card system-card">
            <div class="card-body">
              <div class="small-label">System przemocy</div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.intro)}</p>
              <ul>
                ${(item.bullets || [])
                  .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                  .join("")}
              </ul>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderQuestions() {
    if (!discussionGrid || !Array.isArray(data.discussionQuestions)) return;

    discussionGrid.innerHTML = data.discussionQuestions
      .map(
        (question, index) => `
          <article class="card question-card">
            <div class="card-body">
              <div class="question-number">${index + 1}</div>
              <h3>Pytanie ${index + 1}</h3>
              <p>${escapeHtml(question)}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderBooks() {
    if (!booksGrid || !Array.isArray(data.books)) return;

    booksGrid.innerHTML = `
      <div class="meta-list">
        ${data.books
          .map(
            (book) => `
              <div class="meta-item">
                <div class="meta-item-title">${escapeHtml(book.title)}</div>
                <div class="meta-item-note">
                  <strong>${escapeHtml(book.subtitle)}</strong><br />
                  ${escapeHtml(book.note)}
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderDownloads() {
    if (!downloadsGrid || !Array.isArray(data.downloads)) return;

    downloadsGrid.innerHTML = `
      <div class="meta-list">
        ${data.downloads
          .map((item) => {
            const disabled = !item.href || item.href === "#";
            return `
              <div class="meta-item">
                <div class="meta-item-title">${escapeHtml(item.title)}</div>
                <div class="meta-item-note">
                  <strong>${escapeHtml(item.subtitle)}</strong><br />
                  ${escapeHtml(item.note)}
                </div>
                <div class="meta-item-actions">
                  <a
                    class="meta-link ${disabled ? "is-disabled" : ""}"
                    href="${disabled ? "#" : escapeHtml(item.href)}"
                    ${disabled ? "" : 'target="_blank" rel="noopener noreferrer"'}
                  >
                    ${escapeHtml(item.label || "Otwórz")}
                  </a>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function initVideoModal() {
    if (!videoModal) return;

    videoModal.querySelectorAll("[data-close-video]").forEach((element) => {
      element.addEventListener("click", closeVideoModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && videoModal.classList.contains("is-open")) {
        closeVideoModal();
      }
    });
  }

  function initActiveNav() {
    const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function init() {
    if (Array.isArray(data.reportEntries) && data.reportEntries.length) {
      activeReportEntryId = data.reportEntries[0].id;
      activeReportTabId = data.reportEntries[0].tabs?.[0]?.id || null;
      createReportEntryButtons();
      renderReportDetail();
    }

    renderFilmLanguage();
    renderMicroVideos();
    renderSystems();
    renderQuestions();
    renderBooks();
    renderDownloads();
    initVideoModal();
    initActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
