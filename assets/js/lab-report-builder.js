(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    lesson: null,
    session: null,
    reportData: null
  };

  function cacheDom() {
    DOM.reportSessionId = document.getElementById("reportSessionId");
    DOM.reportSelectedQuote = document.getElementById("reportSelectedQuote");
    DOM.reportSelectedObject = document.getElementById("reportSelectedObject");
    DOM.reportKeyMoment = document.getElementById("reportKeyMoment");
    DOM.reportFinalResponse = document.getElementById("reportFinalResponse");
    DOM.reportOpenQuestion = document.getElementById("reportOpenQuestion");
    DOM.reportDate = document.getElementById("reportDate");
    DOM.reportInstitution = document.getElementById("reportInstitution");

    DOM.downloadPdfButton = document.getElementById("downloadPdfButton");
    DOM.printReportButton = document.getElementById("printReportButton");
    DOM.saveToArchiveButton = document.getElementById("saveToArchiveButton");
    DOM.reportStatusMessage = document.getElementById("reportStatusMessage");
    DOM.reportDocument = document.getElementById("reportDocument");
  }

  function getQuoteTextById(quoteId) {
    if (!quoteId) return "—";
    const quotes = window.LabCore.getQuoteOptions();
    const match = quotes.find((item) => item.id === quoteId);
    return match?.text || quoteId || "—";
  }

  function getOpenQuestionTextById(questionId) {
    if (!questionId) return "—";
    const questions = window.LabCore.getOpenQuestionOptions();
    const match = questions.find((item) => item.id === questionId);
    return match?.text || questionId || "—";
  }

  function getObjectTitleById(objectId) {
    if (!objectId) return "—";
    const object = window.LabCore.getObjectById(objectId);
    return object?.title || objectId || "—";
  }

  function getResolvedLesson() {
    const lesson = window.LabCore.getCurrentLessonFromContext();
    if (lesson) return lesson;

    const stored = window.LabCore.loadSessionState();
    if (stored?.lessonId) {
      return window.LabCore.getLessonById(stored.lessonId);
    }

    return null;
  }

  function buildOrRecoverReportSession(lesson) {
    const stored = window.LabCore.loadSessionState();
    const params = window.LabCore.getQueryParams();

    const querySessionId = params.get("sessionId");
    const queryLessonId = params.get("lessonId");

    if (
      stored.lessonId === lesson?.id &&
      stored.sessionId &&
      (!queryLessonId || queryLessonId === stored.lessonId) &&
      (!querySessionId || querySessionId === stored.sessionId)
    ) {
      return stored;
    }

    return window.LabCore.buildSessionFromLesson(lesson, {
      sessionId: querySessionId || stored.sessionId || undefined,
      reportTemplate: stored.reportTemplate || lesson?.reportTemplate || "raport-odbioru",
      archiveEnabled: stored.archiveEnabled ?? true,
      institution: stored.institution || "",
      group: stored.group || "",
      startedAt: stored.startedAt || new Date().toISOString(),
      currentStepIndex: stored.currentStepIndex || 0,
      responses: stored.responses || {}
    });
  }

  function buildResolvedReportData() {
    const session = runtime.session || window.LabCore.loadSessionState();
    const lesson = runtime.lesson;

    const responses = session?.responses || {};

    const resolved = {
      sessionId: session?.sessionId || "PS-PL-LIVE",
      lessonId: session?.lessonId || "",
      lessonTitle: lesson?.title || session?.lessonTitle || "Prawda Sumienia",
      reportTemplate: session?.reportTemplate || lesson?.reportTemplate || "raport-odbioru",
      selectedQuoteId: responses.selectedQuote || "",
      selectedQuoteText: getQuoteTextById(responses.selectedQuote),
      selectedObjectId: responses.selectedObject || "",
      selectedObjectTitle: getObjectTitleById(responses.selectedObject),
      keyMoment: responses.keyMoment || responses.reflectionResponse || "—",
      finalResponse: responses.finalResponse || "—",
      openQuestionId: responses.openQuestion || "",
      openQuestionText: getOpenQuestionTextById(responses.openQuestion),
      date: window.LabCore.formatDate(new Date()),
      institution: session?.institution || "—",
      group: session?.group || "—",
      archiveEnabled: Boolean(session?.archiveEnabled),
      startedAt: session?.startedAt || null
    };

    runtime.reportData = resolved;
    return resolved;
  }

  function renderReportDocument() {
    const report = buildResolvedReportData();

    window.LabCore.setText(DOM.reportSessionId, report.sessionId);
    window.LabCore.setText(DOM.reportSelectedQuote, report.selectedQuoteText);
    window.LabCore.setText(DOM.reportSelectedObject, report.selectedObjectTitle);
    window.LabCore.setText(DOM.reportKeyMoment, report.keyMoment || "—");
    window.LabCore.setText(DOM.reportFinalResponse, report.finalResponse || "—");
    window.LabCore.setText(DOM.reportOpenQuestion, report.openQuestionText || "—");
    window.LabCore.setText(DOM.reportDate, report.date);
    window.LabCore.setText(DOM.reportInstitution, report.institution || "—");
  }

  function buildArchiveEntry() {
    const report = runtime.reportData || buildResolvedReportData();

    return {
      sessionId: report.sessionId,
      lessonId: report.lessonId,
      lessonTitle: report.lessonTitle,
      reportTemplate: report.reportTemplate,
      selectedQuote: report.selectedQuoteText,
      selectedQuoteId: report.selectedQuoteId,
      selectedObject: report.selectedObjectTitle,
      selectedObjectId: report.selectedObjectId,
      keyMoment: report.keyMoment,
      finalResponse: report.finalResponse,
      openQuestion: report.openQuestionText,
      openQuestionId: report.openQuestionId,
      institution: report.institution,
      group: report.group,
      date: report.date,
      savedAt: new Date().toISOString()
    };
  }

  function recomputeArchiveSummary(reports) {
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

    return {
      reportsCount: reports.length,
      topQuote,
      topObject,
      reports
    };
  }

  function saveCurrentReportToArchive() {
    const session = runtime.session;
    if (!session?.archiveEnabled) {
      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Archiwum klasy jest wyłączone dla tej sesji.",
        "warning"
      );
      return;
    }

    const archive = window.LabCore.getArchiveState();
    const reports = Array.isArray(archive.reports) ? archive.reports.slice() : [];
    const entry = buildArchiveEntry();

    const existingIndex = reports.findIndex((item) => item.sessionId === entry.sessionId);

    if (existingIndex >= 0) {
      reports[existingIndex] = {
        ...reports[existingIndex],
        ...entry
      };
    } else {
      reports.push(entry);
    }

    const nextArchive = recomputeArchiveSummary(reports);
    window.LabCore.saveArchiveState(nextArchive);

    runtime.session = window.LabCore.updateSessionState({
      reportSavedAt: new Date().toISOString()
    });

    window.LabCore.showStatusMessage(
      DOM.reportStatusMessage,
      "Raport został zapisany w archiwum klasy.",
      "success"
    );
  }

  function printReportDocument() {
    window.LabCore.showStatusMessage(
      DOM.reportStatusMessage,
      "Otwieranie widoku do druku…",
      "info"
    );

    window.setTimeout(() => {
      window.print();
    }, 120);
  }

  function downloadPdfViaPrintFlow() {
    window.LabCore.showStatusMessage(
      DOM.reportStatusMessage,
      "Uruchamianie eksportu. W oknie druku wybierz „Zapisz jako PDF”.",
      "info"
    );

    window.setTimeout(() => {
      window.print();
    }, 120);
  }

  function bindEvents() {
    if (DOM.printReportButton) {
      DOM.printReportButton.addEventListener("click", printReportDocument);
    }

    if (DOM.downloadPdfButton) {
      DOM.downloadPdfButton.addEventListener("click", downloadPdfViaPrintFlow);
    }

    if (DOM.saveToArchiveButton) {
      DOM.saveToArchiveButton.addEventListener("click", saveCurrentReportToArchive);
    }
  }

  function syncInitialStatus() {
    const session = runtime.session;

    if (!session?.archiveEnabled) {
      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Dokument gotowy. Archiwum klasy jest wyłączone dla tej sesji.",
        "neutral"
      );
      return;
    }

    if (session?.reportSavedAt) {
      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Dokument gotowy. Raport był już zapisany w archiwum klasy.",
        "success"
      );
      return;
    }

    window.LabCore.showStatusMessage(
      DOM.reportStatusMessage,
      "Dokument gotowy do wygenerowania i zapisania.",
      "neutral"
    );
  }

  function initializeReportPage() {
    cacheDom();

    const lesson = getResolvedLesson();
    if (!lesson) {
      console.error("[LabReport] Nie znaleziono dopasowanej lekcji.");
      return;
    }

    runtime.lesson = lesson;
    runtime.session = buildOrRecoverReportSession(lesson);

    window.LabCore.saveSessionState(runtime.session);

    renderReportDocument();
    bindEvents();
    syncInitialStatus();
  }

  async function init() {
    await window.LabCore.loadLabData();
    initializeReportPage();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
      console.error("[LabReport] Błąd inicjalizacji:", error);
    });
  });
})();
