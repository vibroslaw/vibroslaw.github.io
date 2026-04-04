(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    lesson: null,
    session: null,
    currentObject: null,
    stageOrder: ["entry", "prompt", "object", "reflection", "report"],
    currentStage: "entry"
  };

  function cacheDom() {
    DOM.progressLabel = document.getElementById("studentProgressLabel");

    DOM.entryStage = document.getElementById("studentEntryStage");
    DOM.promptStage = document.getElementById("studentPromptStage");
    DOM.objectStage = document.getElementById("studentObjectStage");
    DOM.reflectionStage = document.getElementById("studentReflectionStage");
    DOM.reportStage = document.getElementById("studentReportStage");

    DOM.studentLessonTitle = document.getElementById("studentLessonTitle");
    DOM.startStudentFlowButton = document.getElementById("startStudentFlowButton");

    DOM.studentPromptText = document.getElementById("studentPromptText");
    DOM.studentPromptResponse = document.getElementById("studentPromptResponse");
    DOM.studentBackFromPrompt = document.getElementById("studentBackFromPrompt");
    DOM.studentNextFromPrompt = document.getElementById("studentNextFromPrompt");

    DOM.objectVisualImage = document.getElementById("objectVisualImage");
    DOM.objectTitle = document.getElementById("objectTitle");
    DOM.objectShortText = document.getElementById("objectShortText");
    DOM.objectHistoricalMeaning = document.getElementById("objectHistoricalMeaning");
    DOM.objectHumanMeaning = document.getElementById("objectHumanMeaning");
    DOM.objectQuote = document.getElementById("objectQuote");
    DOM.objectQuestionLabel = document.getElementById("objectQuestionLabel");
    DOM.objectResponse = document.getElementById("objectResponse");
    DOM.studentBackFromObject = document.getElementById("studentBackFromObject");
    DOM.studentNextFromObject = document.getElementById("studentNextFromObject");

    DOM.reflectionQuestionText = document.getElementById("reflectionQuestionText");
    DOM.reflectionResponse = document.getElementById("reflectionResponse");
    DOM.studentBackFromReflection = document.getElementById("studentBackFromReflection");
    DOM.studentNextFromReflection = document.getElementById("studentNextFromReflection");

    DOM.selectedQuote = document.getElementById("selectedQuote");
    DOM.selectedObject = document.getElementById("selectedObject");
    DOM.keyMomentResponse = document.getElementById("keyMomentResponse");
    DOM.finalResponse = document.getElementById("finalResponse");
    DOM.openQuestionSelect = document.getElementById("openQuestionSelect");
    DOM.studentBackFromReport = document.getElementById("studentBackFromReport");
    DOM.openReportPreviewButton = document.getElementById("openReportPreviewButton");
  }

  function getStageElement(stageName) {
    const map = {
      entry: DOM.entryStage,
      prompt: DOM.promptStage,
      object: DOM.objectStage,
      reflection: DOM.reflectionStage,
      report: DOM.reportStage
    };
    return map[stageName] || null;
  }

  function setStageVisibility(stageName) {
    runtime.stageOrder.forEach((name) => {
      const element = getStageElement(name);
      if (!element) return;

      const isActive = name === stageName;
      element.hidden = !isActive;
      element.classList.toggle("is-visible", isActive);
    });

    runtime.currentStage = stageName;
    updateProgressLabel();
    window.scrollTo({ top: 0, behavior: document.body.classList.contains("reduced-motion") ? "auto" : "smooth" });
  }

  function getStageIndex(stageName) {
    const index = runtime.stageOrder.indexOf(stageName);
    return index >= 0 ? index : 0;
  }

  function updateProgressLabel() {
    if (!DOM.progressLabel) return;
    const current = getStageIndex(runtime.currentStage) + 1;
    const total = runtime.stageOrder.length;
    DOM.progressLabel.textContent = `${current} / ${total}`;
  }

  function getFirstPromptForStep(step) {
    if (!step?.promptIds?.length) return null;
    const prompts = window.LabCore.getPromptsByIds(step.promptIds);
    return prompts[0] || null;
  }

  function getLessonStepByType(type) {
    if (!runtime.lesson?.steps?.length) return null;
    return runtime.lesson.steps.find((step) => step.type === type) || null;
  }

  function getPromptStageQuestion() {
    const entryStep = getLessonStepByType("entry");
    return getFirstPromptForStep(entryStep);
  }

  function getObjectStep() {
    return getLessonStepByType("object");
  }

  function getReflectionStep() {
    const pauseStep = getLessonStepByType("pause");
    if (pauseStep) return pauseStep;

    const reflectionStep = getLessonStepByType("guided-reflection");
    if (reflectionStep) return reflectionStep;

    const discussionStep = getLessonStepByType("discussion");
    return discussionStep || null;
  }

  function resolveObjectFromContext() {
    const params = window.LabCore.getQueryParams();
    const directObjectId = params.get("objectId");
    if (directObjectId) {
      const directObject = window.LabCore.getObjectById(directObjectId);
      if (directObject) return directObject;
    }

    const objectStep = getObjectStep();
    if (objectStep?.objectId) {
      const stepObject = window.LabCore.getObjectById(objectStep.objectId);
      if (stepObject) return stepObject;
    }

    return null;
  }

  function renderEntryStage() {
    if (!DOM.studentLessonTitle || !runtime.lesson) return;
    window.LabCore.setText(DOM.studentLessonTitle, runtime.lesson.title || "Prawda Sumienia");
  }

  function renderPromptStage() {
    const prompt = getPromptStageQuestion();
    const fallbackText = "Jakie znaczenie może mieć świadectwo w sytuacji, w której jego przekazanie wiąże się z ryzykiem?";

    window.LabCore.setText(DOM.studentPromptText, prompt?.text || fallbackText);

    const saved = runtime.session?.responses?.openingResponse || "";
    if (DOM.studentPromptResponse) {
      DOM.studentPromptResponse.value = saved;
    }
  }

  function buildObjectBackgroundImage(object) {
    if (!object?.image?.primary && !object?.image?.fallback) {
      return "";
    }

    const primary = object.image.primary || object.image.fallback;
    return `linear-gradient(180deg, rgba(6,6,6,.12), rgba(6,6,6,.42)), url('${primary}') center/${object.image?.focusX ? "cover" : "cover"} no-repeat`;
  }

  function renderObjectStage() {
    runtime.currentObject = resolveObjectFromContext();

    if (!runtime.currentObject) {
      window.LabCore.setText(DOM.objectTitle, "Brak obiektu");
      window.LabCore.setText(DOM.objectShortText, "Dla tej ścieżki nie odnaleziono aktywnego obiektu pamięci.");
      window.LabCore.setText(DOM.objectHistoricalMeaning, "—");
      window.LabCore.setText(DOM.objectHumanMeaning, "—");
      window.LabCore.setText(DOM.objectQuote, "—");
      window.LabCore.setText(DOM.objectQuestionLabel, "Pytanie");
      if (DOM.objectVisualImage) {
        DOM.objectVisualImage.style.background = "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";
      }
      return;
    }

    const object = runtime.currentObject;

    window.LabCore.setText(DOM.objectTitle, object.title);
    window.LabCore.setText(DOM.objectShortText, object.shortText);
    window.LabCore.setText(DOM.objectHistoricalMeaning, object.historicalMeaning);
    window.LabCore.setText(DOM.objectHumanMeaning, object.humanMeaning);
    window.LabCore.setText(DOM.objectQuote, object.quote);
    window.LabCore.setText(DOM.objectQuestionLabel, object.primaryQuestion || "Pytanie");

    if (DOM.objectVisualImage) {
      const imageUrl = object.image?.primary || object.image?.fallback || "";
      DOM.objectVisualImage.style.backgroundImage = imageUrl
        ? `linear-gradient(180deg, rgba(6,6,6,.12), rgba(6,6,6,.42)), url('${imageUrl}')`
        : "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";
      DOM.objectVisualImage.style.backgroundPosition = `${object.image?.focusX || 50}% ${object.image?.focusY || 50}%`;
      DOM.objectVisualImage.style.backgroundSize = "cover";
      DOM.objectVisualImage.style.backgroundRepeat = "no-repeat";
    }

    if (DOM.objectResponse) {
      DOM.objectResponse.value = runtime.session?.responses?.objectResponse || "";
    }
  }

  function renderReflectionStage() {
    const step = getReflectionStep();
    const prompt = getFirstPromptForStep(step);
    const fallbackText = "Co w tym fragmencie wydaje się najtrudniejsze do pominięcia?";

    window.LabCore.setText(DOM.reflectionQuestionText, prompt?.text || fallbackText);

    if (DOM.reflectionResponse) {
      DOM.reflectionResponse.value = runtime.session?.responses?.reflectionResponse || "";
    }
  }

  function buildObjectOptions() {
    const objects = window.LabCore.getObjects().map((object) => ({
      id: object.id,
      text: object.title
    }));

    window.LabCore.populateSelect(DOM.selectedObject, objects, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wybierz obiekt"
    });
  }

  function renderReportStage() {
    const quoteOptions = window.LabCore.getQuoteOptions().map((item) => ({
      id: item.id,
      text: item.text
    }));

    const openQuestionOptions = window.LabCore.getOpenQuestionOptions().map((item) => ({
      id: item.id,
      text: item.text
    }));

    window.LabCore.populateSelect(DOM.selectedQuote, quoteOptions, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wybierz cytat"
    });

    buildObjectOptions();

    window.LabCore.populateSelect(DOM.openQuestionSelect, openQuestionOptions, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wybierz pytanie"
    });

    const responses = runtime.session?.responses || {};

    if (DOM.selectedQuote) DOM.selectedQuote.value = responses.selectedQuote || "";
    if (DOM.selectedObject) DOM.selectedObject.value = responses.selectedObject || runtime.currentObject?.id || "";
    if (DOM.keyMomentResponse) DOM.keyMomentResponse.value = responses.keyMoment || "";
    if (DOM.finalResponse) DOM.finalResponse.value = responses.finalResponse || "";
    if (DOM.openQuestionSelect) DOM.openQuestionSelect.value = responses.openQuestion || "";
  }

  function renderAllStages() {
    renderEntryStage();
    renderPromptStage();
    renderObjectStage();
    renderReflectionStage();
    renderReportStage();
  }

  function persistResponses(patch = {}) {
    runtime.session = window.LabCore.updateSessionState({
      responses: {
        ...(runtime.session?.responses || {}),
        ...patch
      }
    });
  }

  function savePromptResponse() {
    persistResponses({
      openingResponse: DOM.studentPromptResponse?.value?.trim() || ""
    });
  }

  function saveObjectResponse() {
    persistResponses({
      objectResponse: DOM.objectResponse?.value?.trim() || ""
    });
  }

  function saveReflectionResponse() {
    persistResponses({
      reflectionResponse: DOM.reflectionResponse?.value?.trim() || ""
    });
  }

  function saveReportResponse() {
    persistResponses({
      selectedQuote: DOM.selectedQuote?.value || "",
      selectedObject: DOM.selectedObject?.value || "",
      keyMoment: DOM.keyMomentResponse?.value?.trim() || "",
      finalResponse: DOM.finalResponse?.value?.trim() || "",
      openQuestion: DOM.openQuestionSelect?.value || ""
    });
  }

  function goToStage(stageName) {
    if (!runtime.stageOrder.includes(stageName)) return;

    if (runtime.currentStage === "prompt") savePromptResponse();
    if (runtime.currentStage === "object") saveObjectResponse();
    if (runtime.currentStage === "reflection") saveReflectionResponse();
    if (runtime.currentStage === "report") saveReportResponse();

    setStageVisibility(stageName);
  }

  function bindEntryEvents() {
    if (DOM.startStudentFlowButton) {
      DOM.startStudentFlowButton.addEventListener("click", () => {
        goToStage("prompt");
      });
    }
  }

  function bindPromptEvents() {
    if (DOM.studentBackFromPrompt) {
      DOM.studentBackFromPrompt.addEventListener("click", () => {
        goToStage("entry");
      });
    }

    if (DOM.studentNextFromPrompt) {
      DOM.studentNextFromPrompt.addEventListener("click", () => {
        savePromptResponse();
        goToStage("object");
      });
    }
  }

  function bindObjectEvents() {
    if (DOM.studentBackFromObject) {
      DOM.studentBackFromObject.addEventListener("click", () => {
        goToStage("prompt");
      });
    }

    if (DOM.studentNextFromObject) {
      DOM.studentNextFromObject.addEventListener("click", () => {
        saveObjectResponse();
        goToStage("reflection");
      });
    }
  }

  function bindReflectionEvents() {
    if (DOM.studentBackFromReflection) {
      DOM.studentBackFromReflection.addEventListener("click", () => {
        goToStage("object");
      });
    }

    if (DOM.studentNextFromReflection) {
      DOM.studentNextFromReflection.addEventListener("click", () => {
        saveReflectionResponse();
        goToStage("report");
      });
    }
  }

  function bindReportEvents() {
    if (DOM.studentBackFromReport) {
      DOM.studentBackFromReport.addEventListener("click", () => {
        goToStage("reflection");
      });
    }

    const reportFields = [
      DOM.selectedQuote,
      DOM.selectedObject,
      DOM.keyMomentResponse,
      DOM.finalResponse,
      DOM.openQuestionSelect
    ].filter(Boolean);

    reportFields.forEach((field) => {
      field.addEventListener("change", saveReportResponse);
      field.addEventListener("input", saveReportResponse);
    });

    if (DOM.openReportPreviewButton) {
      DOM.openReportPreviewButton.addEventListener("click", (event) => {
        saveReportResponse();

        const url = window.LabCore.buildReportUrl(runtime.session);
        DOM.openReportPreviewButton.href = url;
      });
    }
  }

  function bindAllEvents() {
    bindEntryEvents();
    bindPromptEvents();
    bindObjectEvents();
    bindReflectionEvents();
    bindReportEvents();
  }

  function determineInitialStage() {
    const params = window.LabCore.getQueryParams();
    const stageFromQuery = params.get("stage");

    if (stageFromQuery && runtime.stageOrder.includes(stageFromQuery)) {
      return stageFromQuery;
    }

    return "entry";
  }

  function buildOrRecoverStudentSession(lesson) {
    const stored = window.LabCore.loadSessionState();
    const params = window.LabCore.getQueryParams();
    const querySessionId = params.get("sessionId");
    const queryLessonId = params.get("lessonId");

    if (
      stored.lessonId === lesson.id &&
      stored.sessionId &&
      (!queryLessonId || queryLessonId === stored.lessonId)
    ) {
      return stored;
    }

    return window.LabCore.buildSessionFromLesson(lesson, {
      sessionId: querySessionId || stored.sessionId || undefined,
      reportTemplate: stored.reportTemplate || lesson.reportTemplate,
      archiveEnabled: stored.archiveEnabled ?? true,
      institution: stored.institution || "",
      group: stored.group || "",
      startedAt: stored.startedAt || new Date().toISOString(),
      currentStepIndex: stored.currentStepIndex || 0,
      responses: stored.responses || {}
    });
  }

  function initializeStudentPage() {
    cacheDom();

    const lesson = window.LabCore.getCurrentLessonFromContext();
    if (!lesson) {
      console.error("[LabStudent] Nie znaleziono dopasowanej lekcji.");
      return;
    }

    runtime.lesson = lesson;
    runtime.session = buildOrRecoverStudentSession(lesson);
    window.LabCore.saveSessionState(runtime.session);

    renderAllStages();
    bindAllEvents();

    const initialStage = determineInitialStage();
    setStageVisibility(initialStage);
  }

  async function init() {
    await window.LabCore.loadLabData();
    initializeStudentPage();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
      console.error("[LabStudent] Błąd inicjalizacji:", error);
    });
  });
})();
