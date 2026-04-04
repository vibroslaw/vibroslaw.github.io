(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    lesson: null,
    session: null,
    currentObject: null,
    stageOrder: ["entry", "prompt", "object", "reflection", "report"],
    currentStage: "entry",
    autosaveTimer: null
  };

  function cacheDom() {
    DOM.progressLabel = document.getElementById("studentProgressLabel");
    DOM.openObjectDetailModeStudent = document.getElementById("openObjectDetailModeStudent");

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

    DOM.studentSaveState = document.getElementById("studentSaveState");
    DOM.studentSaveText = document.getElementById("studentSaveText");
  }

  function setSaveState(state, text) {
    if (DOM.studentSaveState) {
      DOM.studentSaveState.dataset.state = state;
      DOM.studentSaveState.textContent =
        state === "saving" ? "Zapisywanie" :
        state === "saved" ? "Zapisano" :
        "Autosave aktywny";
    }

    if (DOM.studentSaveText) {
      DOM.studentSaveText.textContent = text || "Postęp zapisuje się automatycznie.";
    }
  }

  function getStageElement(stageName) {
    return {
      entry: DOM.entryStage,
      prompt: DOM.promptStage,
      object: DOM.objectStage,
      reflection: DOM.reflectionStage,
      report: DOM.reportStage
    }[stageName] || null;
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
    persistSession({
      currentStage: stageName
    }, "saved", "Etap został zapisany.");

    window.scrollTo({
      top: 0,
      behavior: document.body.classList.contains("reduced-motion") ? "auto" : "smooth"
    });
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
    return runtime.lesson?.steps?.find((step) => step.type === type) || null;
  }

  function getPromptStageQuestion() {
    return getFirstPromptForStep(getLessonStepByType("entry"));
  }

  function getObjectStep() {
    return getLessonStepByType("object");
  }

  function getReflectionStep() {
    return getLessonStepByType("pause")
      || getLessonStepByType("guided-reflection")
      || getLessonStepByType("discussion")
      || null;
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
      return window.LabCore.getObjectById(objectStep.objectId);
    }

    return null;
  }

  function persistSession(patch = {}, state = "saved", text = "Postęp zapisany.") {
    setSaveState("saving", "Zapisywanie postępu…");

    runtime.session = window.LabCore.updateSessionState({
      ...patch,
      lastStudentActivityAt: new Date().toISOString()
    });

    window.setTimeout(() => {
      setSaveState(state, text);
    }, 120);
  }

  function renderEntryStage() {
    window.LabCore.setText(DOM.studentLessonTitle, runtime.lesson?.title || "Prawda Sumienia");
  }

  function renderPromptStage() {
    const prompt = getPromptStageQuestion();
    window.LabCore.setText(
      DOM.studentPromptText,
      prompt?.text || "Jakie znaczenie może mieć świadectwo w sytuacji, w której jego przekazanie wiąże się z ryzykiem?"
    );

    if (DOM.studentPromptResponse) {
      DOM.studentPromptResponse.value = runtime.session?.responses?.openingResponse || "";
    }
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

    window.LabCore.setText(
      DOM.reflectionQuestionText,
      prompt?.text || "Co w tym fragmencie wydaje się najtrudniejsze do pominięcia?"
    );

    if (DOM.reflectionResponse) {
      DOM.reflectionResponse.value = runtime.session?.responses?.reflectionResponse || "";
    }
  }

  function renderReportStage() {
    const quoteOptions = window.LabCore.getQuoteOptions().map((item) => ({
      id: item.id,
      text: item.text
    }));

    const objectOptions = window.LabCore.getObjects().map((object) => ({
      id: object.id,
      text: object.title
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

    window.LabCore.populateSelect(DOM.selectedObject, objectOptions, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wybierz obiekt"
    });

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

  function savePromptResponse() {
    persistSession({
      responses: {
        ...runtime.session.responses,
        openingResponse: DOM.studentPromptResponse?.value?.trim() || ""
      }
    });
  }

  function saveObjectResponse() {
    persistSession({
      responses: {
        ...runtime.session.responses,
        objectResponse: DOM.objectResponse?.value?.trim() || ""
      }
    });
  }

  function saveReflectionResponse() {
    persistSession({
      responses: {
        ...runtime.session.responses,
        reflectionResponse: DOM.reflectionResponse?.value?.trim() || ""
      }
    });
  }

  function saveReportResponse() {
    persistSession({
      responses: {
        ...runtime.session.responses,
        selectedQuote: DOM.selectedQuote?.value || "",
        selectedObject: DOM.selectedObject?.value || "",
        keyMoment: DOM.keyMomentResponse?.value?.trim() || "",
        finalResponse: DOM.finalResponse?.value?.trim() || "",
        openQuestion: DOM.openQuestionSelect?.value || ""
      }
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

  function bindAutosaveInputs() {
    [
      DOM.studentPromptResponse,
      DOM.objectResponse,
      DOM.reflectionResponse,
      DOM.keyMomentResponse,
      DOM.finalResponse
    ]
      .filter(Boolean)
      .forEach((field) => {
        field.addEventListener("input", () => {
          setSaveState("saving", "Wykryto zmiany — zapis przygotowywany.");
        });
      });

    [DOM.selectedQuote, DOM.selectedObject, DOM.openQuestionSelect]
      .filter(Boolean)
      .forEach((field) => {
        field.addEventListener("change", saveReportResponse);
      });
  }

  function bindEntryEvents() {
    DOM.startStudentFlowButton?.addEventListener("click", () => {
      goToStage("prompt");
    });
  }

  function bindPromptEvents() {
    DOM.studentBackFromPrompt?.addEventListener("click", () => goToStage("entry"));
    DOM.studentNextFromPrompt?.addEventListener("click", () => {
      savePromptResponse();
      goToStage("object");
    });
  }

  function bindObjectEvents() {
    DOM.openObjectDetailModeStudent?.addEventListener("click", () => {
  if (!runtime.currentObject) return;

  window.LabObjectDetail?.open?.(runtime.currentObject, {
    contextLabel: "Tryb ucznia · praca na detalu"
  });
});
    DOM.studentBackFromObject?.addEventListener("click", () => goToStage("prompt"));
    DOM.studentNextFromObject?.addEventListener("click", () => {
      saveObjectResponse();
      goToStage("reflection");
    });
  }

  function bindReflectionEvents() {
    DOM.studentBackFromReflection?.addEventListener("click", () => goToStage("object"));
    DOM.studentNextFromReflection?.addEventListener("click", () => {
      saveReflectionResponse();
      goToStage("report");
    });
  }

  function bindReportEvents() {
    DOM.studentBackFromReport?.addEventListener("click", () => goToStage("reflection"));

    [DOM.selectedQuote, DOM.selectedObject, DOM.keyMomentResponse, DOM.finalResponse, DOM.openQuestionSelect]
      .filter(Boolean)
      .forEach((field) => {
        field.addEventListener("change", saveReportResponse);
        field.addEventListener("input", saveReportResponse);
      });

    DOM.openReportPreviewButton?.addEventListener("click", () => {
      saveReportResponse();
      DOM.openReportPreviewButton.href = window.LabCore.buildReportUrl(runtime.session);
    });
  }

  function bindAllEvents() {
    bindAutosaveInputs();
    bindEntryEvents();
    bindPromptEvents();
    bindObjectEvents();
    bindReflectionEvents();
    bindReportEvents();

    window.addEventListener("beforeunload", () => {
      persistSession({
        currentStage: runtime.currentStage
      }, "saved", "Postęp został zapisany.");
    });
  }

  function startAutosaveHeartbeat() {
    if (runtime.autosaveTimer) {
      clearInterval(runtime.autosaveTimer);
    }

    runtime.autosaveTimer = window.setInterval(() => {
      persistSession({
        currentStage: runtime.currentStage,
        heartbeatAt: new Date().toISOString()
      }, "saved", "Postęp zapisany automatycznie.");
    }, 12000);
  }

  function determineInitialStage() {
    const params = window.LabCore.getQueryParams();
    const stageFromQuery = params.get("stage");
    if (stageFromQuery && runtime.stageOrder.includes(stageFromQuery)) {
      return stageFromQuery;
    }

    if (runtime.session?.currentStage && runtime.stageOrder.includes(runtime.session.currentStage)) {
      return runtime.session.currentStage;
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
      responses: stored.responses || {},
      currentStage: stored.currentStage || "entry",
      lastStudentActivityAt: stored.lastStudentActivityAt || new Date().toISOString()
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
    startAutosaveHeartbeat();

    const initialStage = determineInitialStage();
    setStageVisibility(initialStage);

    setSaveState("saved", "Przywrócono zapisany postęp.");
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
