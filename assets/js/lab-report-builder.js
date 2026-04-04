(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    lesson: null,
    session: null,
    reportData: null,
    exportInProgress: false
  };

  const PDF_CONFIG = {
    format: "a4",
    orientation: "p",
    unit: "mm",
    marginTop: 8,
    marginRight: 8,
    marginBottom: 10,
    marginLeft: 8,
    backgroundColor: "#f7f2eb",
    maxScale: 3
  };

  function cacheDom() {
    DOM.reportTypeLabel = document.getElementById("reportTypeLabel");
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

  function getFallbackObjectIdFromLesson(lesson) {
    const step = lesson?.steps?.find((item) => item.type === "object" && item.objectId);
    return step?.objectId || "";
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
      responses: stored.responses || {},
      lastActivityAt: stored.lastActivityAt || new Date().toISOString(),
      heartbeatAt: stored.heartbeatAt || null,
      timerState: stored.timerState || {
        running: false,
        remainingSeconds: 0
      }
    });
  }

  function buildResolvedReportData() {
    const session = runtime.session || window.LabCore.loadSessionState();
    const lesson = runtime.lesson;
    const responses = session?.responses || {};

    const resolvedObjectId = responses.selectedObject || getFallbackObjectIdFromLesson(lesson);
    const resolvedDate =
      session?.reportSavedAt ||
      session?.startedAt ||
      new Date().toISOString();

    const resolved = {
      sessionId: session?.sessionId || "PS-PL-LIVE",
      lessonId: session?.lessonId || "",
      lessonTitle: lesson?.title || session?.lessonTitle || "Prawda Sumienia",
      reportTemplate: session?.reportTemplate || lesson?.reportTemplate || "raport-odbioru",
      reportTemplateLabel: window.LabCore.mapReportLabel(
        session?.reportTemplate || lesson?.reportTemplate || "raport-odbioru"
      ),
      selectedQuoteId: responses.selectedQuote || "",
      selectedQuoteText: getQuoteTextById(responses.selectedQuote),
      selectedObjectId: resolvedObjectId,
      selectedObjectTitle: getObjectTitleById(resolvedObjectId),
      keyMoment: responses.keyMoment || responses.reflectionResponse || "—",
      finalResponse: responses.finalResponse || "—",
      openQuestionId: responses.openQuestion || "",
      openQuestionText: getOpenQuestionTextById(responses.openQuestion),
      date: window.LabCore.formatDate(resolvedDate),
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

    window.LabCore.setText(DOM.reportTypeLabel, report.reportTemplateLabel);
    window.LabCore.setText(DOM.reportSessionId, report.sessionId);
    window.LabCore.setText(DOM.reportSelectedQuote, report.selectedQuoteText || "—");
    window.LabCore.setText(DOM.reportSelectedObject, report.selectedObjectTitle || "—");
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
      reportTemplateLabel: report.reportTemplateLabel,
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
      if (entry?.selectedQuote) {
        quoteCount.set(entry.selectedQuote, (quoteCount.get(entry.selectedQuote) || 0) + 1);
      }
      if (entry?.selectedObject) {
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

    renderReportDocument();

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
    renderReportDocument();

    window.LabCore.showStatusMessage(
      DOM.reportStatusMessage,
      "Otwieranie widoku do druku…",
      "info"
    );

    window.setTimeout(() => {
      window.print();
    }, 120);
  }

  function ensurePdfLibraries() {
    const hasHtml2Canvas = typeof window.html2canvas === "function";
    const hasJsPdf = Boolean(window.jspdf && typeof window.jspdf.jsPDF === "function");
    return hasHtml2Canvas && hasJsPdf;
  }

  function sanitizeFilenamePart(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  }

  function buildPdfFilename(report) {
    const title = sanitizeFilenamePart(report.lessonTitle || "Prawda-Sumienia");
    const institution = sanitizeFilenamePart(report.institution || "instytucja");
    const date = sanitizeFilenamePart(report.date || new Date().toISOString().slice(0, 10));
    const sessionId = sanitizeFilenamePart(report.sessionId || "sesja");
    return `${title}__${institution}__${date}__${sessionId}.pdf`;
  }

  function setButtonsDisabled(disabled) {
    [DOM.downloadPdfButton, DOM.printReportButton, DOM.saveToArchiveButton]
      .filter(Boolean)
      .forEach((button) => {
        button.disabled = disabled;
      });
  }

  function setArchiveButtonAvailability() {
    if (!DOM.saveToArchiveButton) return;
    DOM.saveToArchiveButton.disabled = !runtime.session?.archiveEnabled;
  }

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  async function waitForFontsAndLayout() {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await nextFrame();
    await nextFrame();
  }

  async function renderReportCanvas(reportElement) {
    const scale = Math.min(Math.max(window.devicePixelRatio || 1, 2), PDF_CONFIG.maxScale);

    return window.html2canvas(reportElement, {
      scale,
      useCORS: true,
      backgroundColor: PDF_CONFIG.backgroundColor,
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: (clonedDocument) => {
        clonedDocument.body.classList.add("pdf-export-mode");
      }
    });
  }

  function addCanvasToPdf(pdf, canvas) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const printableWidth = pageWidth - PDF_CONFIG.marginLeft - PDF_CONFIG.marginRight;
    const printableHeight = pageHeight - PDF_CONFIG.marginTop - PDF_CONFIG.marginBottom;

    const imgData = canvas.toDataURL("image/png", 1.0);
    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let positionY = PDF_CONFIG.marginTop;

    pdf.addImage(
      imgData,
      "PNG",
      PDF_CONFIG.marginLeft,
      positionY,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );

    heightLeft -= printableHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      positionY = PDF_CONFIG.marginTop - (imgHeight - heightLeft);

      pdf.addImage(
        imgData,
        "PNG",
        PDF_CONFIG.marginLeft,
        positionY,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      heightLeft -= printableHeight;
    }
  }

  async function downloadLuxuryPdf() {
    if (runtime.exportInProgress) return;

    if (!ensurePdfLibraries()) {
      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Biblioteki PDF nie zostały załadowane poprawnie.",
        "warning"
      );
      return;
    }

    if (!DOM.reportDocument) {
      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Nie odnaleziono dokumentu raportu do eksportu.",
        "warning"
      );
      return;
    }

    runtime.exportInProgress = true;
    setButtonsDisabled(true);

    try {
      renderReportDocument();
      await waitForFontsAndLayout();

      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Przygotowywanie dokumentu do eksportu…",
        "info"
      );

      const canvas = await renderReportCanvas(DOM.reportDocument);

      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Składanie pliku PDF…",
        "info"
      );

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: PDF_CONFIG.orientation,
        unit: PDF_CONFIG.unit,
        format: PDF_CONFIG.format,
        compress: true,
        putOnlyUsedFonts: true
      });

      const report = runtime.reportData || buildResolvedReportData();

      pdf.setProperties({
        title: `${report.lessonTitle} - ${report.reportTemplateLabel}`,
        subject: "Laboratorium Sumienia / Prawda Sumienia",
        author: "Piotr Lichwała (Vibrosław)",
        creator: "Laboratorium Sumienia",
        keywords: "Prawda Sumienia, Rap-Ort, Laboratorium Sumienia, raport odbioru, edukacja"
      });

      addCanvasToPdf(pdf, canvas);

      const filename = buildPdfFilename(report);
      pdf.save(filename);

      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "PDF został wygenerowany i pobrany.",
        "success"
      );
    } catch (error) {
      console.error("[LabReport] PDF export failed:", error);

      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Nie udało się wygenerować PDF. Sprawdź konsolę lub spróbuj ponownie.",
        "warning"
      );
    } finally {
      runtime.exportInProgress = false;
      setButtonsDisabled(false);
      setArchiveButtonAvailability();
    }
  }

  function bindEvents() {
    DOM.printReportButton?.addEventListener("click", printReportDocument);
    DOM.downloadPdfButton?.addEventListener("click", downloadLuxuryPdf);
    DOM.saveToArchiveButton?.addEventListener("click", saveCurrentReportToArchive);

    window.addEventListener("beforeprint", renderReportDocument);
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
      "Dokument gotowy do wygenerowania, pobrania i zapisania.",
      "neutral"
    );
  }

  function initializeReportPage() {
    cacheDom();

    const lesson = getResolvedLesson();
    if (!lesson) {
      console.error("[LabReport] Nie znaleziono dopasowanej lekcji.");
      window.LabCore.showStatusMessage(
        DOM.reportStatusMessage,
        "Nie odnaleziono danych lekcji dla tego raportu.",
        "warning"
      );
      return;
    }

    runtime.lesson = lesson;
    runtime.session = buildOrRecoverReportSession(lesson);

    window.LabCore.saveSessionState(runtime.session);

    renderReportDocument();
    bindEvents();
    setArchiveButtonAvailability();
    syncInitialStatus();
  }

  async function init() {
    await window.LabCore.loadLabData();
    initializeReportPage();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
      console.error("[LabReport] Błąd inicjalizacji:", error);
      if (DOM.reportStatusMessage) {
        window.LabCore.showStatusMessage(
          DOM.reportStatusMessage,
          "Nie udało się uruchomić generatora raportu.",
          "warning"
        );
      }
    });
  });
})();
