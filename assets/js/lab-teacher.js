(() => {
  "use strict";

  const STEP_TYPE_LABELS = {
    entry: "Wejście",
    object: "Obiekt pamięci",
    projection: "Fragment dzieła",
    pause: "Zatrzymanie",
    discussion: "Rozmowa",
    report: "Raport",
    closure: "Zamknięcie",
    "guided-reflection": "Refleksja prowadzona"
  };

  const DOM = {};
  const runtime = {
    lesson: null,
    session: null,
    currentStep: null,
    currentStepTimer: null,
    currentStepRemainingSeconds: 0,
    timerRunning: false,
    autosaveTimer: null
  };

  function isLauncherPage() {
    return document.body?.dataset?.page === "lab-launcher";
  }

  function isTeacherPage() {
    return document.body?.dataset?.page === "lab-teacher";
  }

  function cacheLauncherDom() {
    DOM.lessonBuilderForm = document.getElementById("lessonBuilderForm");
    DOM.ageGroupSelect = document.getElementById("ageGroupSelect");
    DOM.durationSelect = document.getElementById("durationSelect");
    DOM.axisSelect = document.getElementById("axisSelect");
    DOM.reportModeSelect = document.getElementById("reportModeSelect");
    DOM.archiveToggle = document.getElementById("archiveToggle");
    DOM.institutionInput = document.getElementById("institutionInput");
    DOM.groupInput = document.getElementById("groupInput");
    DOM.previewLessonTitle = document.getElementById("previewLessonTitle");
    DOM.previewAgeGroup = document.getElementById("previewAgeGroup");
    DOM.previewDuration = document.getElementById("previewDuration");
    DOM.previewAxis = document.getElementById("previewAxis");
    DOM.previewReportMode = document.getElementById("previewReportMode");
    DOM.previewGuardrails = document.getElementById("previewGuardrails");
  }

  function cacheTeacherDom() {
    DOM.teacherLessonTitle = document.getElementById("teacherLessonTitle");
    DOM.teacherAgeGroup = document.getElementById("teacherAgeGroup");
    DOM.teacherDuration = document.getElementById("teacherDuration");
    DOM.teacherAxis = document.getElementById("teacherAxis");
    DOM.teacherReportType = document.getElementById("teacherReportType");

    DOM.currentStepNumber = document.getElementById("currentStepNumber");
    DOM.currentStepDuration = document.getElementById("currentStepDuration");
    DOM.sessionIdLabel = document.getElementById("sessionIdLabel");

    DOM.startLiveSession = document.getElementById("startLiveSession");
    DOM.openStudentView = document.getElementById("openStudentView");
    DOM.prevStepButton = document.getElementById("prevStepButton");
    DOM.nextStepButton = document.getElementById("nextStepButton");
    DOM.pauseTimerButton = document.getElementById("pauseTimerButton");
    DOM.resetTimerButton = document.getElementById("resetTimerButton");
    DOM.presentationModeButton = document.getElementById("presentationModeButton");

    DOM.stepCountdown = document.getElementById("stepCountdown");
    DOM.currentStepType = document.getElementById("currentStepType");
    DOM.currentStepIndex = document.getElementById("currentStepIndex");
    DOM.currentStepTitle = document.getElementById("currentStepTitle");
    DOM.currentStepInstruction = document.getElementById("currentStepInstruction");
    DOM.currentPromptText = document.getElementById("currentPromptText");
    DOM.currentStepCaution = document.getElementById("currentStepCaution");

    DOM.openObjectButton = document.getElementById("openObjectButton");
    DOM.openObjectDetailModeTeacher = document.getElementById("openObjectDetailModeTeacher");
    DOM.triggerQrButton = document.getElementById("triggerQrButton");
    DOM.openReportBuilderButton = document.getElementById("openReportBuilderButton");

    DOM.guardrailsList = document.getElementById("guardrailsList");
    DOM.linkedObjectPreview = document.getElementById("linkedObjectPreview");
    DOM.lessonTimelineList = document.getElementById("lessonTimelineList");

    DOM.archiveReportsCount = document.getElementById("archiveReportsCount");
    DOM.archiveTopQuote = document.getElementById("archiveTopQuote");
    DOM.archiveTopObject = document.getElementById("archiveTopObject");

    DOM.sessionLiveStatus = document.getElementById("sessionLiveStatus");
    DOM.sessionStatusText = document.getElementById("sessionStatusText");
    DOM.sessionLastSaved = document.getElementById("sessionLastSaved");
  }

  function mapStepTypeLabel(type) {
    return STEP_TYPE_LABELS[type] || type || "Etap";
  }

  function setSessionStatus(state, text) {
    if (DOM.sessionLiveStatus) {
      DOM.sessionLiveStatus.dataset.state = state;
      DOM.sessionLiveStatus.textContent =
        state === "live" ? "Na żywo" :
        state === "paused" ? "Pauza" :
        state === "saved" ? "Zapisano" :
        "Gotowe";
    }

    if (DOM.sessionStatusText) {
      DOM.sessionStatusText.textContent = text || "Sesja gotowa do prowadzenia.";
    }

    if (DOM.sessionLastSaved && runtime.session?.lastActivityAt) {
      DOM.sessionLastSaved.textContent = `Ostatni zapis: ${formatDateTime(runtime.session.lastActivityAt)}`;
    }
  }

  function formatDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  }

  function getSelectedLauncherCriteria() {
    return {
      ageGroup: DOM.ageGroupSelect?.value || "liceum",
      durationMin: Number(DOM.durationSelect?.value || 45),
      axis: DOM.axisSelect?.value || "swiadectwo",
      reportTemplate: DOM.reportModeSelect?.value || "raport-odbioru",
      archiveEnabled: Boolean(DOM.archiveToggle?.checked),
      institution: DOM.institutionInput?.value?.trim() || "",
      group: DOM.groupInput?.value?.trim() || ""
    };
  }

  function buildLauncherPreviewText(lesson, reportTemplate) {
    if (!lesson) {
      window.LabCore.setText(DOM.previewLessonTitle, "Brak dopasowanej lekcji");
      window.LabCore.setText(DOM.previewAgeGroup, "—");
      window.LabCore.setText(DOM.previewDuration, "—");
      window.LabCore.setText(DOM.previewAxis, "—");
      window.LabCore.setText(DOM.previewReportMode, window.LabCore.mapReportLabel(reportTemplate));
      window.LabCore.setText(DOM.previewGuardrails, "Brak dopasowanej konfiguracji dla wybranego zestawu parametrów.");
      return;
    }

    window.LabCore.setText(DOM.previewLessonTitle, lesson.title);
    window.LabCore.setText(DOM.previewAgeGroup, window.LabCore.mapAgeGroupLabel(lesson.ageGroup));
    window.LabCore.setText(DOM.previewDuration, window.LabCore.formatDuration(lesson.durationMin));
    window.LabCore.setText(DOM.previewAxis, window.LabCore.mapAxisLabel(lesson.axis));
    window.LabCore.setText(DOM.previewReportMode, window.LabCore.mapReportLabel(reportTemplate || lesson.reportTemplate));

    const guardrails = Array.isArray(lesson.guardrails) ? lesson.guardrails : [];
    window.LabCore.setText(
      DOM.previewGuardrails,
      guardrails.length ? guardrails.slice(0, 2).join(" ") : "Ta ścieżka nie zawiera dodatkowych guardrails w pliku lekcji."
    );
  }

  function populateLauncherFromData() {
    const enabledAgeGroups = window.LabCore.getEnabledAgeGroups();
    const ageGroupOptions = [
      { id: "7-8", text: "Klasy 7–8" },
      { id: "liceum", text: "Liceum / technikum" },
      { id: "uczelnia", text: "Uczelnia" },
      { id: "polonia", text: "Polonia / grupa dwujęzyczna" }
    ].filter((item) => enabledAgeGroups.includes(item.id));

    if (DOM.ageGroupSelect) {
      window.LabCore.populateSelect(DOM.ageGroupSelect, ageGroupOptions, {
        valueKey: "id",
        labelKey: "text"
      });
      DOM.ageGroupSelect.value = "liceum";
    }

    const durations = [
      { id: "45", text: "45 minut" },
      { id: "90", text: "90 minut" },
      { id: "120", text: "120 minut" }
    ];
    if (DOM.durationSelect) {
      window.LabCore.populateSelect(DOM.durationSelect, durations, {
        valueKey: "id",
        labelKey: "text"
      });
      DOM.durationSelect.value = "45";
    }

    const axes = [
      { id: "swiadectwo", text: "Świadectwo" },
      { id: "system", text: "System" },
      { id: "wybor", text: "Wybór" },
      { id: "pamiec", text: "Pamięć" }
    ];
    if (DOM.axisSelect) {
      window.LabCore.populateSelect(DOM.axisSelect, axes, {
        valueKey: "id",
        labelKey: "text"
      });
      DOM.axisSelect.value = "swiadectwo";
    }

    const reportModes = [
      { id: "raport-odbioru", text: "Raport odbioru" },
      { id: "raport-interpretacyjny", text: "Raport interpretacyjny" }
    ];
    if (DOM.reportModeSelect) {
      window.LabCore.populateSelect(DOM.reportModeSelect, reportModes, {
        valueKey: "id",
        labelKey: "text"
      });
      DOM.reportModeSelect.value = "raport-odbioru";
    }
  }

  function updateLauncherPreview() {
    const criteria = getSelectedLauncherCriteria();
    const lesson = window.LabCore.getBestMatchingLesson({
      ageGroup: criteria.ageGroup,
      durationMin: criteria.durationMin,
      axis: criteria.axis
    });

    buildLauncherPreviewText(lesson, criteria.reportTemplate);
  }

  function handleLauncherSubmit(event) {
    event.preventDefault();

    const criteria = getSelectedLauncherCriteria();
    const lesson = window.LabCore.getBestMatchingLesson({
      ageGroup: criteria.ageGroup,
      durationMin: criteria.durationMin,
      axis: criteria.axis
    });

    if (!lesson) {
      buildLauncherPreviewText(null, criteria.reportTemplate);
      return;
    }

    const session = window.LabCore.buildSessionFromLesson(lesson, {
      reportTemplate: criteria.reportTemplate,
      archiveEnabled: criteria.archiveEnabled,
      institution: criteria.institution,
      group: criteria.group,
      startedAt: new Date().toISOString(),
      currentStepIndex: 0,
      lastActivityAt: new Date().toISOString(),
      timerState: {
        running: false,
        remainingSeconds: Number(lesson.steps?.[0]?.durationMin || 0) * 60
      }
    });

    window.LabCore.saveSessionState(session);
    window.location.href = window.LabCore.buildTeacherLaunchUrl(session);
  }

  function bindLauncherEvents() {
    [
      DOM.ageGroupSelect,
      DOM.durationSelect,
      DOM.axisSelect,
      DOM.reportModeSelect,
      DOM.archiveToggle,
      DOM.institutionInput,
      DOM.groupInput
    ]
      .filter(Boolean)
      .forEach((element) => {
        element.addEventListener("change", updateLauncherPreview);
        element.addEventListener("input", updateLauncherPreview);
      });

    DOM.lessonBuilderForm?.addEventListener("submit", handleLauncherSubmit);
  }

  function initializeLauncherPage() {
    cacheLauncherDom();
    populateLauncherFromData();
    bindLauncherEvents();
    updateLauncherPreview();
  }

  function clearCurrentStepTimer() {
    if (runtime.currentStepTimer) {
      clearInterval(runtime.currentStepTimer);
      runtime.currentStepTimer = null;
    }
    runtime.timerRunning = false;
  }

  function setTimerDisplay(seconds) {
    if (!DOM.stepCountdown) return;
    DOM.stepCountdown.textContent = window.LabCore.formatClock(seconds);
  }

  function persistSessionPatch(patch = {}, statusState = "saved", statusText = "Sesja została zaktualizowana.") {
    runtime.session = window.LabCore.updateSessionState({
      ...patch,
      lastActivityAt: new Date().toISOString()
    });

    setSessionStatus(statusState, statusText);
  }

  function startCurrentStepTimer(seconds, silent = false) {
    clearCurrentStepTimer();

    runtime.currentStepRemainingSeconds = Math.max(0, Number(seconds || 0));
    setTimerDisplay(runtime.currentStepRemainingSeconds);

    if (runtime.currentStepRemainingSeconds <= 0) {
      persistSessionPatch({
        timerState: {
          running: false,
          remainingSeconds: 0
        }
      }, "paused", "Timer osiągnął koniec bieżącego kroku.");
      return;
    }

    runtime.timerRunning = true;

    persistSessionPatch({
      timerState: {
        running: true,
        remainingSeconds: runtime.currentStepRemainingSeconds
      }
    }, silent ? "live" : "live", silent ? "Sesja aktywna." : "Timer kroku został uruchomiony.");

    runtime.currentStepTimer = window.setInterval(() => {
      runtime.currentStepRemainingSeconds -= 1;
      setTimerDisplay(runtime.currentStepRemainingSeconds);

      if (runtime.currentStepRemainingSeconds <= 0) {
        clearCurrentStepTimer();
        persistSessionPatch({
          timerState: {
            running: false,
            remainingSeconds: 0
          }
        }, "paused", "Czas bieżącego kroku dobiegł końca.");
        return;
      }

      if (runtime.currentStepRemainingSeconds % 5 === 0) {
        persistSessionPatch({
          timerState: {
            running: true,
            remainingSeconds: runtime.currentStepRemainingSeconds
          }
        }, "live", "Sesja aktywna.");
      }
    }, 1000);
  }

  function pauseCurrentStepTimer() {
    clearCurrentStepTimer();
    persistSessionPatch({
      timerState: {
        running: false,
        remainingSeconds: runtime.currentStepRemainingSeconds
      }
    }, "paused", "Timer został zatrzymany.");
  }

  function resetCurrentStepTimer() {
    const step = runtime.currentStep;
    const defaultSeconds = Number(step?.durationMin || 0) * 60;
    clearCurrentStepTimer();
    runtime.currentStepRemainingSeconds = defaultSeconds;
    setTimerDisplay(defaultSeconds);

    persistSessionPatch({
      timerState: {
        running: false,
        remainingSeconds: defaultSeconds
      }
    }, "saved", "Timer kroku został zresetowany.");
  }

  function buildPromptText(step) {
    if (!step?.promptIds?.length) {
      return "Ten etap nie uruchamia aktywnego pytania.";
    }

    const prompts = window.LabCore.getPromptsByIds(step.promptIds);
    return prompts[0]?.text || "Brak przypisanego pytania do tego etapu.";
  }

  function buildObjectPreviewHtml(step) {
    if (!step?.objectId) {
      return `
        <strong class="linked-object-title">Brak obiektu w tym kroku</strong>
        <p class="linked-object-text">Ten etap nie uruchamia obiektu pamięci ani dokumentu.</p>
      `;
    }

    const object = window.LabCore.getObjectById(step.objectId);
    if (!object) {
      return `
        <strong class="linked-object-title">Nie odnaleziono obiektu</strong>
        <p class="linked-object-text">Obiekt przypisany do tego kroku nie został znaleziony w danych.</p>
      `;
    }

    return `
      <strong class="linked-object-title">${object.title}</strong>
      <p class="linked-object-text">${object.shortText}</p>
    `;
  }

  function renderGuardrails(lesson) {
    if (!DOM.guardrailsList) return;

    const guardrails = Array.isArray(lesson?.guardrails) ? lesson.guardrails : [];
    DOM.guardrailsList.innerHTML = "";

    if (!guardrails.length) {
      const li = document.createElement("li");
      li.textContent = "Brak dodatkowych guardrails dla tej lekcji.";
      DOM.guardrailsList.appendChild(li);
      return;
    }

    guardrails.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      DOM.guardrailsList.appendChild(li);
    });
  }

  function renderTimeline(lesson, currentStepIndex) {
    if (!DOM.lessonTimelineList) return;

    const steps = Array.isArray(lesson?.steps) ? lesson.steps : [];
    DOM.lessonTimelineList.innerHTML = "";

    steps.forEach((step, index) => {
      const article = document.createElement("article");
      article.className = `timeline-step${index === currentStepIndex ? " is-active" : ""}`;

      article.innerHTML = `
        <div class="timeline-step-index">${index + 1}</div>
        <div class="timeline-step-body">
          <h3>${step.title || "Etap"}</h3>
          <p>${step.teacherInstruction || "Brak instrukcji dla tego etapu."}</p>
        </div>
        <div class="timeline-step-meta">${window.LabCore.formatDuration(step.durationMin)}</div>
      `;

      article.addEventListener("click", () => {
        goToStep(index);
      });

      DOM.lessonTimelineList.appendChild(article);
    });
  }

  function renderTeacherArchivePanel() {
    const archive = window.LabCore.getArchiveState();
    window.LabCore.setText(DOM.archiveReportsCount, String(archive.reportsCount || 0));
    window.LabCore.setText(DOM.archiveTopQuote, archive.topQuote || "—");
    window.LabCore.setText(DOM.archiveTopObject, archive.topObject || "—");
  }

  function renderTeacherSessionMeta() {
    const lesson = runtime.lesson;
    const session = runtime.session;

    window.LabCore.setText(DOM.teacherLessonTitle, lesson?.title || "—");
    window.LabCore.setText(DOM.teacherAgeGroup, window.LabCore.mapAgeGroupLabel(lesson?.ageGroup));
    window.LabCore.setText(DOM.teacherDuration, window.LabCore.formatDuration(lesson?.durationMin));
    window.LabCore.setText(DOM.teacherAxis, window.LabCore.mapAxisLabel(lesson?.axis));
    window.LabCore.setText(DOM.teacherReportType, window.LabCore.mapReportLabel(session?.reportTemplate || lesson?.reportTemplate));
    window.LabCore.setText(DOM.sessionIdLabel, session?.sessionId || "—");

    if (session?.lastActivityAt) {
      setSessionStatus(
        session?.timerState?.running ? "live" : "saved",
        session?.timerState?.running ? "Przywrócono aktywną sesję." : "Przywrócono zapisany stan sesji."
      );
    } else {
      setSessionStatus("saved", "Sesja gotowa do prowadzenia.");
    }
  }

  function buildPresentationState() {
    const lesson = runtime.lesson;
    const session = runtime.session;
    const step = runtime.currentStep;
    const currentIndex = session?.currentStepIndex || 0;

    return {
      lesson,
      session,
      step,
      currentIndex,
      stepTypeLabel: mapStepTypeLabel(step?.type),
      currentPromptText: buildPromptText(step),
      linkedObject: step?.objectId ? window.LabCore.getObjectById(step.objectId) : null
    };
  }

  function renderCurrentStep() {
    const lesson = runtime.lesson;
    const session = runtime.session;
    if (!lesson || !session) return;

    const steps = Array.isArray(lesson.steps) ? lesson.steps : [];
    const currentIndex = Math.max(0, Math.min(session.currentStepIndex, steps.length - 1));
    const step = steps[currentIndex] || null;
    runtime.currentStep = step;

    if (!step) return;

    window.LabCore.setText(DOM.currentStepType, mapStepTypeLabel(step.type));
    window.LabCore.setText(DOM.currentStepIndex, `Krok ${currentIndex + 1}`);
    window.LabCore.setText(DOM.currentStepTitle, step.title || "Etap");
    window.LabCore.setText(DOM.currentStepInstruction, step.teacherInstruction || "Brak instrukcji dla tego etapu.");
    window.LabCore.setText(DOM.currentPromptText, buildPromptText(step));
    window.LabCore.setText(DOM.currentStepCaution, step.teacherCaution || "Brak dodatkowej uwagi dla tego etapu.");

    window.LabCore.setText(DOM.currentStepDuration, window.LabCore.formatDuration(step.durationMin));
    window.LabCore.setText(DOM.currentStepNumber, `${currentIndex + 1} / ${steps.length}`);

    if (DOM.linkedObjectPreview) {
      DOM.linkedObjectPreview.innerHTML = buildObjectPreviewHtml(step);
    }

    if (DOM.prevStepButton) DOM.prevStepButton.disabled = currentIndex <= 0;
    if (DOM.nextStepButton) DOM.nextStepButton.disabled = currentIndex >= steps.length - 1;

    renderTimeline(lesson, currentIndex);

    const restoredSeconds = session?.timerState?.remainingSeconds;
    const fallbackSeconds = Number(step.durationMin || 0) * 60;
    const secondsToShow =
      typeof restoredSeconds === "number" && session.currentStepIndex === currentIndex
        ? restoredSeconds
        : fallbackSeconds;

    runtime.currentStepRemainingSeconds = secondsToShow;
    setTimerDisplay(secondsToShow);

    window.LabTeacherPresentationBridge = {
      getState: buildPresentationState
    };

    window.dispatchEvent(new CustomEvent("lab:teacherStepRendered", {
      detail: buildPresentationState()
    }));
  }

  function syncTeacherUrls() {
    if (!runtime.session) return;

    if (DOM.openStudentView) {
      DOM.openStudentView.onclick = () => {
        window.location.href = window.LabCore.buildStudentLaunchUrl(runtime.session);
      };
    }

    if (DOM.openReportBuilderButton) {
      DOM.openReportBuilderButton.onclick = () => {
        window.location.href = window.LabCore.buildReportUrl(runtime.session);
      };
    }

    if (DOM.openObjectButton) {
      DOM.openObjectButton.onclick = () => {
        const step = runtime.currentStep;
        if (!step?.objectId) return;

        const url = new URL(window.LabCore.buildStudentLaunchUrl(runtime.session));
        url.searchParams.set("stage", "object");
        url.searchParams.set("objectId", step.objectId);
        window.location.href = url.toString();
      };
    }

    if (DOM.triggerQrButton) {
      DOM.triggerQrButton.onclick = () => {
        const studentUrl = window.LabCore.buildStudentLaunchUrl(runtime.session);
        const reportUrl = window.LabCore.buildReportUrl(runtime.session);

        const items = [
          {
            id: "student",
            label: "Tryb ucznia",
            title: "Wejście ucznia",
            url: studentUrl,
            filename: `qr-student-${runtime.session.sessionId}`,
            note: "Najczystsze wejście do aktywnej ścieżki ucznia."
          }
        ];

        if (runtime.currentStep?.objectId) {
          const object = window.LabCore.getObjectById(runtime.currentStep.objectId);
          const objectUrl = new URL(studentUrl);
          objectUrl.searchParams.set("stage", "object");
          objectUrl.searchParams.set("objectId", runtime.currentStep.objectId);

          items.push({
            id: "object",
            label: "Obiekt pamięci",
            title: object?.title || "Obiekt pamięci",
            url: objectUrl.toString(),
            filename: `qr-object-${runtime.currentStep.objectId}-${runtime.session.sessionId}`,
            note: "Bezpośrednie wejście do aktualnego obiektu pamięci."
          });
        }

        items.push({
          id: "report",
          label: "Raport",
          title: "Podgląd raportu",
          url: reportUrl,
          filename: `qr-report-${runtime.session.sessionId}`,
          note: "Wejście do podglądu raportu tej sesji."
        });

        window.LabQR?.open?.({
          title: "Generator QR sesji",
          subtitle: "Wybierz tryb, który chcesz udostępnić klasie.",
          items
        });
      };
    }
  }

  function persistCurrentStepIndex(index) {
    persistSessionPatch({
      currentStepIndex: index,
      timerState: {
        running: false,
        remainingSeconds: Number(runtime.lesson?.steps?.[index]?.durationMin || 0) * 60
      }
    }, "saved", "Przejście do nowego kroku zostało zapisane.");
  }

  function goToStep(index) {
    const lesson = runtime.lesson;
    if (!lesson?.steps?.length) return;

    const safeIndex = Math.max(0, Math.min(index, lesson.steps.length - 1));
    clearCurrentStepTimer();
    persistCurrentStepIndex(safeIndex);
    renderCurrentStep();
  }

  function startAutosaveHeartbeat() {
    if (runtime.autosaveTimer) {
      clearInterval(runtime.autosaveTimer);
    }

    runtime.autosaveTimer = window.setInterval(() => {
      if (!runtime.session) return;

      persistSessionPatch({
        heartbeatAt: new Date().toISOString(),
        timerState: {
          running: runtime.timerRunning,
          remainingSeconds: runtime.currentStepRemainingSeconds
        }
      }, runtime.timerRunning ? "live" : "saved", runtime.timerRunning ? "Sesja aktywna." : "Postęp sesji zapisany.");
    }, 15000);
  }

  function bindTeacherControls() {
    DOM.openObjectDetailModeTeacher?.addEventListener("click", () => {
  const objectId = runtime.currentStep?.objectId;
  if (!objectId) return;

  window.LabObjectDetail?.openById?.(objectId, {
    contextLabel: "Tryb nauczyciela · obiekt pamięci"
  });
});
    DOM.startLiveSession?.addEventListener("click", () => {
      if (!runtime.currentStep) return;

      const currentSeconds = runtime.currentStepRemainingSeconds || Number(runtime.currentStep.durationMin || 0) * 60;
      startCurrentStepTimer(currentSeconds);
      DOM.startLiveSession.textContent = "Sesja aktywna";
    });

    DOM.prevStepButton?.addEventListener("click", () => {
      goToStep((runtime.session?.currentStepIndex || 0) - 1);
    });

    DOM.nextStepButton?.addEventListener("click", () => {
      goToStep((runtime.session?.currentStepIndex || 0) + 1);
    });

    DOM.pauseTimerButton?.addEventListener("click", () => {
      if (runtime.timerRunning) {
        pauseCurrentStepTimer();
        DOM.pauseTimerButton.textContent = "Wznów";
      } else {
        startCurrentStepTimer(runtime.currentStepRemainingSeconds || Number(runtime.currentStep?.durationMin || 0) * 60, true);
        DOM.pauseTimerButton.textContent = "Pauza";
      }
    });

    DOM.resetTimerButton?.addEventListener("click", resetCurrentStepTimer);

    DOM.presentationModeButton?.addEventListener("click", () => {
      window.LabPresentation?.open?.();
    });

    window.addEventListener("beforeunload", () => {
      if (!runtime.session) return;
      persistSessionPatch({
        timerState: {
          running: false,
          remainingSeconds: runtime.currentStepRemainingSeconds
        }
      }, "saved", "Stan sesji został zapisany.");
    });
  }

  function buildOrRecoverTeacherSession(lesson) {
    const stored = window.LabCore.loadSessionState();
    const params = window.LabCore.getQueryParams();

    const querySessionId = params.get("sessionId");
    const queryLessonId = params.get("lessonId");

    if (stored.lessonId === lesson.id && stored.sessionId && (!queryLessonId || queryLessonId === stored.lessonId)) {
      return stored;
    }

    return window.LabCore.buildSessionFromLesson(lesson, {
      sessionId: querySessionId || stored.sessionId || undefined,
      reportTemplate: stored.reportTemplate || lesson.reportTemplate,
      archiveEnabled: stored.archiveEnabled ?? true,
      institution: stored.institution || "",
      group: stored.group || "",
      startedAt: stored.startedAt || null,
      currentStepIndex: stored.currentStepIndex || 0,
      responses: stored.responses || {},
      lastActivityAt: stored.lastActivityAt || new Date().toISOString(),
      timerState: stored.timerState || {
        running: false,
        remainingSeconds: Number(lesson.steps?.[stored.currentStepIndex || 0]?.durationMin || 0) * 60
      }
    });
  }

  function initializeTeacherPage() {
    cacheTeacherDom();

    const lesson = window.LabCore.getCurrentLessonFromContext();
    if (!lesson) {
      console.error("[LabTeacher] Nie znaleziono dopasowanej lekcji.");
      return;
    }

    runtime.lesson = lesson;
    runtime.session = buildOrRecoverTeacherSession(lesson);
    window.LabCore.saveSessionState(runtime.session);

    renderTeacherSessionMeta();
    renderGuardrails(lesson);
    renderTeacherArchivePanel();
    renderCurrentStep();
    syncTeacherUrls();
    bindTeacherControls();
    startAutosaveHeartbeat();

    if (runtime.session?.timerState?.running) {
      startCurrentStepTimer(runtime.session.timerState.remainingSeconds || Number(runtime.currentStep?.durationMin || 0) * 60, true);
      if (DOM.pauseTimerButton) DOM.pauseTimerButton.textContent = "Pauza";
      if (DOM.startLiveSession) DOM.startLiveSession.textContent = "Sesja aktywna";
    }
  }

  async function init() {
    await window.LabCore.loadLabData();

    if (isLauncherPage()) {
      initializeLauncherPage();
      return;
    }

    if (isTeacherPage()) {
      initializeTeacherPage();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
      console.error("[LabTeacher] Błąd inicjalizacji:", error);
    });
  });
})();
