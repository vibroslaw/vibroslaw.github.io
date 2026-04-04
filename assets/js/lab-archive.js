(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    archive: null,
    filteredReports: [],
    selectedSessionId: null
  };

  function cacheDom() {
    DOM.archiveReportsCountLarge = document.getElementById("archiveReportsCountLarge");
    DOM.archiveTopQuoteLarge = document.getElementById("archiveTopQuoteLarge");
    DOM.archiveTopObjectLarge = document.getElementById("archiveTopObjectLarge");
    DOM.archiveLastSaved = document.getElementById("archiveLastSaved");

    DOM.archiveSearchInput = document.getElementById("archiveSearchInput");
    DOM.archiveLessonFilter = document.getElementById("archiveLessonFilter");
    DOM.archiveObjectFilter = document.getElementById("archiveObjectFilter");
    DOM.archiveInstitutionFilter = document.getElementById("archiveInstitutionFilter");

    DOM.archiveExportButton = document.getElementById("archiveExportButton");
    DOM.archiveClearFiltersButton = document.getElementById("archiveClearFiltersButton");
    DOM.archiveClearAllButton = document.getElementById("archiveClearAllButton");

    DOM.archiveStatusMessage = document.getElementById("archiveStatusMessage");
    DOM.archiveList = document.getElementById("archiveList");
    DOM.archiveEmptyState = document.getElementById("archiveEmptyState");

    DOM.archiveDetailTitle = document.getElementById("archiveDetailTitle");
    DOM.archiveDetailDate = document.getElementById("archiveDetailDate");
    DOM.archiveDetailSessionId = document.getElementById("archiveDetailSessionId");
    DOM.archiveDetailLesson = document.getElementById("archiveDetailLesson");
    DOM.archiveDetailInstitution = document.getElementById("archiveDetailInstitution");
    DOM.archiveDetailQuote = document.getElementById("archiveDetailQuote");
    DOM.archiveDetailObject = document.getElementById("archiveDetailObject");
    DOM.archiveDetailKeyMoment = document.getElementById("archiveDetailKeyMoment");
    DOM.archiveDetailFinalResponse = document.getElementById("archiveDetailFinalResponse");
    DOM.archiveDetailOpenQuestion = document.getElementById("archiveDetailOpenQuestion");

    DOM.archiveOpenReportButton = document.getElementById("archiveOpenReportButton");
    DOM.archiveDeleteOneButton = document.getElementById("archiveDeleteOneButton");
  }

  function getReports() {
    const archive = runtime.archive || window.LabCore.getArchiveState();
    return Array.isArray(archive.reports) ? archive.reports.slice() : [];
  }

  function formatSavedAt(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function computeLastSaved(reports) {
    if (!reports.length) return "—";

    const sorted = reports
      .filter((item) => item.savedAt)
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

    return sorted[0]?.savedAt ? formatSavedAt(sorted[0].savedAt) : "—";
  }

  function fillFilterOptions() {
    const reports = getReports();

    const lessonSet = new Set();
    const objectSet = new Set();
    const institutionSet = new Set();

    reports.forEach((report) => {
      if (report.lessonTitle) lessonSet.add(report.lessonTitle);
      if (report.selectedObject) objectSet.add(report.selectedObject);
      if (report.institution && report.institution !== "—") institutionSet.add(report.institution);
    });

    const lessons = [...lessonSet].sort().map((text) => ({ id: text, text }));
    const objects = [...objectSet].sort().map((text) => ({ id: text, text }));
    const institutions = [...institutionSet].sort().map((text) => ({ id: text, text }));

    window.LabCore.populateSelect(DOM.archiveLessonFilter, lessons, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wszystkie"
    });

    window.LabCore.populateSelect(DOM.archiveObjectFilter, objects, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wszystkie"
    });

    window.LabCore.populateSelect(DOM.archiveInstitutionFilter, institutions, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wszystkie"
    });
  }

  function renderStats() {
    const archive = runtime.archive;
    const reports = getReports();

    window.LabCore.setText(DOM.archiveReportsCountLarge, String(archive?.reportsCount || 0));
    window.LabCore.setText(DOM.archiveTopQuoteLarge, archive?.topQuote || "—");
    window.LabCore.setText(DOM.archiveTopObjectLarge, archive?.topObject || "—");
    window.LabCore.setText(DOM.archiveLastSaved, computeLastSaved(reports));
  }

  function getActiveFilters() {
    return {
      search: DOM.archiveSearchInput?.value?.trim().toLowerCase() || "",
      lesson: DOM.archiveLessonFilter?.value || "",
      object: DOM.archiveObjectFilter?.value || "",
      institution: DOM.archiveInstitutionFilter?.value || ""
    };
  }

  function matchesSearch(report, search) {
    if (!search) return true;

    const haystack = [
      report.lessonTitle,
      report.selectedQuote,
      report.selectedObject,
      report.keyMoment,
      report.finalResponse,
      report.openQuestion,
      report.institution,
      report.group,
      report.sessionId
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  }

  function filterReports() {
    const filters = getActiveFilters();
    const reports = getReports();

    runtime.filteredReports = reports.filter((report) => {
      if (filters.lesson && report.lessonTitle !== filters.lesson) return false;
      if (filters.object && report.selectedObject !== filters.object) return false;
      if (filters.institution && report.institution !== filters.institution) return false;
      if (!matchesSearch(report, filters.search)) return false;
      return true;
    });

    if (
      runtime.selectedSessionId &&
      !runtime.filteredReports.some((item) => item.sessionId === runtime.selectedSessionId)
    ) {
      runtime.selectedSessionId = runtime.filteredReports[0]?.sessionId || null;
    } else if (!runtime.selectedSessionId && runtime.filteredReports.length) {
      runtime.selectedSessionId = runtime.filteredReports[0].sessionId;
    }
  }

  function buildArchiveItem(report) {
    const article = document.createElement("article");
    article.className = `archive-item${report.sessionId === runtime.selectedSessionId ? " is-active" : ""}`;
    article.dataset.sessionId = report.sessionId;

    article.innerHTML = `
      <div class="archive-item-top">
        <h3 class="archive-item-title">${report.lessonTitle || "Raport"}</h3>
        <div class="archive-item-date">${formatSavedAt(report.savedAt)}</div>
      </div>

      <div class="archive-item-meta">
        <span class="archive-chip">${report.selectedObject || "Brak obiektu"}</span>
        <span class="archive-chip">${report.reportTemplate || "Raport"}</span>
        <span class="archive-chip">${report.institution || "Bez instytucji"}</span>
      </div>

      <p class="archive-item-text">${report.finalResponse || "Brak odpowiedzi końcowej."}</p>
    `;

    article.addEventListener("click", () => {
      runtime.selectedSessionId = report.sessionId;
      renderArchiveList();
      renderDetail();
    });

    return article;
  }

  function renderArchiveList() {
    if (!DOM.archiveList) return;

    DOM.archiveList.innerHTML = "";

    if (!runtime.filteredReports.length) {
      DOM.archiveEmptyState.hidden = false;
      return;
    }

    DOM.archiveEmptyState.hidden = true;
    runtime.filteredReports.forEach((report) => {
      DOM.archiveList.appendChild(buildArchiveItem(report));
    });
  }

  function getSelectedReport() {
    if (!runtime.selectedSessionId) return null;
    return runtime.filteredReports.find((item) => item.sessionId === runtime.selectedSessionId) || null;
  }

  function renderDetail() {
    const report = getSelectedReport();

    if (!report) {
      window.LabCore.setText(DOM.archiveDetailTitle, "Wybierz raport z listy");
      window.LabCore.setText(DOM.archiveDetailDate, "—");
      window.LabCore.setText(DOM.archiveDetailSessionId, "—");
      window.LabCore.setText(DOM.archiveDetailLesson, "—");
      window.LabCore.setText(DOM.archiveDetailInstitution, "—");
      window.LabCore.setText(DOM.archiveDetailQuote, "—");
      window.LabCore.setText(DOM.archiveDetailObject, "—");
      window.LabCore.setText(DOM.archiveDetailKeyMoment, "—");
      window.LabCore.setText(DOM.archiveDetailFinalResponse, "—");
      window.LabCore.setText(DOM.archiveDetailOpenQuestion, "—");

      if (DOM.archiveOpenReportButton) {
        DOM.archiveOpenReportButton.href = "/rap-ort/prawda-sumienia/lab/pl/report.html";
      }

      if (DOM.archiveDeleteOneButton) {
        DOM.archiveDeleteOneButton.disabled = true;
      }

      return;
    }

    window.LabCore.setText(DOM.archiveDetailTitle, report.lessonTitle || "Raport");
    window.LabCore.setText(DOM.archiveDetailDate, formatSavedAt(report.savedAt));
    window.LabCore.setText(DOM.archiveDetailSessionId, report.sessionId || "—");
    window.LabCore.setText(
      DOM.archiveDetailLesson,
      `${report.lessonTitle || "—"}${report.reportTemplate ? ` · ${report.reportTemplate}` : ""}`
    );
    window.LabCore.setText(
      DOM.archiveDetailInstitution,
      `${report.institution || "—"}${report.group && report.group !== "—" ? ` / ${report.group}` : ""}`
    );
    window.LabCore.setText(DOM.archiveDetailQuote, report.selectedQuote || "—");
    window.LabCore.setText(DOM.archiveDetailObject, report.selectedObject || "—");
    window.LabCore.setText(DOM.archiveDetailKeyMoment, report.keyMoment || "—");
    window.LabCore.setText(DOM.archiveDetailFinalResponse, report.finalResponse || "—");
    window.LabCore.setText(DOM.archiveDetailOpenQuestion, report.openQuestion || "—");

    if (DOM.archiveOpenReportButton) {
      const url = new URL("/rap-ort/prawda-sumienia/lab/pl/report.html", window.location.origin);
      url.searchParams.set("sessionId", report.sessionId);
      if (report.lessonId) url.searchParams.set("lessonId", report.lessonId);
      DOM.archiveOpenReportButton.href = url.toString();
    }

    if (DOM.archiveDeleteOneButton) {
      DOM.archiveDeleteOneButton.disabled = false;
    }
  }

  function rerenderAll() {
    renderStats();
    filterReports();
    renderArchiveList();
    renderDetail();
  }

  function clearFilters() {
    if (DOM.archiveSearchInput) DOM.archiveSearchInput.value = "";
    if (DOM.archiveLessonFilter) DOM.archiveLessonFilter.value = "";
    if (DOM.archiveObjectFilter) DOM.archiveObjectFilter.value = "";
    if (DOM.archiveInstitutionFilter) DOM.archiveInstitutionFilter.value = "";

    filterReports();
    renderArchiveList();
    renderDetail();

    window.LabCore.showStatusMessage(
      DOM.archiveStatusMessage,
      "Filtry zostały wyczyszczone.",
      "neutral"
    );
  }

  function exportArchiveJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      reportsCount: runtime.archive?.reportsCount || 0,
      topQuote: runtime.archive?.topQuote || "",
      topObject: runtime.archive?.topObject || "",
      reports: getReports()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laboratorium-sumienia-archiwum-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    window.LabCore.showStatusMessage(
      DOM.archiveStatusMessage,
      "Archiwum zostało wyeksportowane do pliku JSON.",
      "success"
    );
  }

  function removeSelectedReport() {
    const selected = getSelectedReport();
    if (!selected) return;

    const confirmed = window.confirm("Czy na pewno chcesz usunąć wybrany wpis z archiwum?");
    if (!confirmed) return;

    const reports = getReports().filter((item) => item.sessionId !== selected.sessionId);

    const quoteCount = new Map();
    const objectCount = new Map();

    reports.forEach((entry) => {
      if (entry.selectedQuote) {
        quoteCount.set(entry.selectedQuote, (quoteCount.get(entry.selectedQuote) || 0) + 1);
      }
      if (entry.selectedObject) {
        objectCount.set(entry.selectedObject, (objectCount.get(entry.selectedObject) || 0) + 1);
      }
    });

    const topQuote = [...quoteCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const topObject = [...objectCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    runtime.archive = {
      reportsCount: reports.length,
      topQuote,
      topObject,
      reports
    };

    window.LabCore.saveArchiveState(runtime.archive);

    runtime.selectedSessionId = reports[0]?.sessionId || null;
    fillFilterOptions();
    rerenderAll();

    window.LabCore.showStatusMessage(
      DOM.archiveStatusMessage,
      "Wybrany wpis został usunięty z archiwum.",
      "success"
    );
  }

  function clearAllArchive() {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć całe archiwum klasy z tego urządzenia?");
    if (!confirmed) return;

    runtime.archive = {
      reportsCount: 0,
      topQuote: "",
      topObject: "",
      reports: []
    };

    window.LabCore.saveArchiveState(runtime.archive);
    runtime.selectedSessionId = null;

    fillFilterOptions();
    rerenderAll();

    window.LabCore.showStatusMessage(
      DOM.archiveStatusMessage,
      "Całe archiwum zostało wyczyszczone.",
      "warning"
    );
  }

  function bindEvents() {
    [
      DOM.archiveSearchInput,
      DOM.archiveLessonFilter,
      DOM.archiveObjectFilter,
      DOM.archiveInstitutionFilter
    ]
      .filter(Boolean)
      .forEach((element) => {
        element.addEventListener("input", () => {
          filterReports();
          renderArchiveList();
          renderDetail();
        });
        element.addEventListener("change", () => {
          filterReports();
          renderArchiveList();
          renderDetail();
        });
      });

    if (DOM.archiveClearFiltersButton) {
      DOM.archiveClearFiltersButton.addEventListener("click", clearFilters);
    }

    if (DOM.archiveExportButton) {
      DOM.archiveExportButton.addEventListener("click", exportArchiveJson);
    }

    if (DOM.archiveDeleteOneButton) {
      DOM.archiveDeleteOneButton.addEventListener("click", removeSelectedReport);
    }

    if (DOM.archiveClearAllButton) {
      DOM.archiveClearAllButton.addEventListener("click", clearAllArchive);
    }
  }

  function initializeArchivePage() {
    cacheDom();

    runtime.archive = window.LabCore.getArchiveState();
    runtime.selectedSessionId = getReports()[0]?.sessionId || null;

    fillFilterOptions();
    rerenderAll();
    bindEvents();

    window.LabCore.showStatusMessage(
      DOM.archiveStatusMessage,
      "Archiwum gotowe do przeglądania.",
      "neutral"
    );
  }

  async function init() {
    await window.LabCore.loadLabData();
    initializeArchivePage();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
      console.error("[LabArchive] Błąd inicjalizacji:", error);
    });
  });
})();
