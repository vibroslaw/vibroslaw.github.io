(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    lessons: [],
    filteredLessons: [],
    selectedLesson: null
  };

  function cacheDom() {
    DOM.packLessonTitle = document.getElementById("packLessonTitle");
    DOM.packAgeGroup = document.getElementById("packAgeGroup");
    DOM.packDuration = document.getElementById("packDuration");
    DOM.packAxis = document.getElementById("packAxis");
    DOM.packReportType = document.getElementById("packReportType");

    DOM.packAgeFilter = document.getElementById("packAgeFilter");
    DOM.packDurationFilter = document.getElementById("packDurationFilter");
    DOM.packAxisFilter = document.getElementById("packAxisFilter");

    DOM.packVariantList = document.getElementById("packVariantList");
    DOM.packVariantEmpty = document.getElementById("packVariantEmpty");

    DOM.packTimeline = document.getElementById("packTimeline");
    DOM.packTimelineEmpty = document.getElementById("packTimelineEmpty");

    DOM.packPromptBank = document.getElementById("packPromptBank");
    DOM.packPromptEmpty = document.getElementById("packPromptEmpty");

    DOM.packGuardrails = document.getElementById("packGuardrails");
    DOM.packGuardrailsEmpty = document.getElementById("packGuardrailsEmpty");

    DOM.packObjectList = document.getElementById("packObjectList");
    DOM.packObjectsEmpty = document.getElementById("packObjectsEmpty");

    DOM.packChecklist = document.getElementById("packChecklist");
    DOM.packAgeAdaptation = document.getElementById("packAgeAdaptation");
    DOM.packTeacherNote = document.getElementById("packTeacherNote");
    DOM.packAfterLesson = document.getElementById("packAfterLesson");
    DOM.packNextModules = document.getElementById("packNextModules");

    DOM.openTeacherConsoleButton = document.getElementById("openTeacherConsoleButton");
    DOM.openArchiveButton = document.getElementById("openArchiveButton");
    DOM.printPackButton = document.getElementById("printPackButton");
    DOM.exportPackJsonButton = document.getElementById("exportPackJsonButton");

    DOM.teacherPackStatusMessage = document.getElementById("teacherPackStatusMessage");
  }

  function setStatus(text, type = "neutral") {
    window.LabCore.showStatusMessage(DOM.teacherPackStatusMessage, text, type);
  }

  function getEnabledLessons() {
    return window.LabCore.getLessons().filter((lesson) => lesson.enabled !== false);
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "pl"));
  }

  function populateFilters() {
    const lessons = runtime.lessons;

    const ageGroups = uniqueSorted(lessons.map((lesson) => lesson.ageGroup)).map((id) => ({
      id,
      text: window.LabCore.mapAgeGroupLabel(id)
    }));

    const durations = uniqueSorted(lessons.map((lesson) => String(lesson.durationMin))).map((id) => ({
      id,
      text: `${id} min`
    }));

    const axes = uniqueSorted(lessons.map((lesson) => lesson.axis)).map((id) => ({
      id,
      text: window.LabCore.mapAxisLabel(id)
    }));

    window.LabCore.populateSelect(DOM.packAgeFilter, ageGroups, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wszystkie"
    });

    window.LabCore.populateSelect(DOM.packDurationFilter, durations, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wszystkie"
    });

    window.LabCore.populateSelect(DOM.packAxisFilter, axes, {
      valueKey: "id",
      labelKey: "text",
      placeholder: "Wszystkie"
    });
  }

  function getActiveFilters() {
    return {
      ageGroup: DOM.packAgeFilter?.value || "",
      durationMin: DOM.packDurationFilter?.value || "",
      axis: DOM.packAxisFilter?.value || ""
    };
  }

  function filterLessons() {
    const filters = getActiveFilters();

    runtime.filteredLessons = runtime.lessons.filter((lesson) => {
      if (filters.ageGroup && lesson.ageGroup !== filters.ageGroup) return false;
      if (filters.durationMin && String(lesson.durationMin) !== String(filters.durationMin)) return false;
      if (filters.axis && lesson.axis !== filters.axis) return false;
      return true;
    });

    if (
      runtime.selectedLesson &&
      !runtime.filteredLessons.some((lesson) => lesson.id === runtime.selectedLesson.id)
    ) {
      runtime.selectedLesson = runtime.filteredLessons[0] || null;
    }

    if (!runtime.selectedLesson && runtime.filteredLessons.length) {
      runtime.selectedLesson = runtime.filteredLessons[0];
    }
  }

  function buildVariantCard(lesson) {
    const article = document.createElement("article");
    article.className = `teacher-pack-variant${runtime.selectedLesson?.id === lesson.id ? " is-active" : ""}`;

    article.innerHTML = `
      <div class="teacher-pack-chip-row">
        <span class="teacher-pack-chip">${window.LabCore.mapAgeGroupLabel(lesson.ageGroup)}</span>
        <span class="teacher-pack-chip">${window.LabCore.formatDuration(lesson.durationMin)}</span>
        <span class="teacher-pack-chip">${window.LabCore.mapAxisLabel(lesson.axis)}</span>
        <span class="teacher-pack-chip">${window.LabCore.mapReportLabel(lesson.reportTemplate)}</span>
      </div>

      <h3 class="teacher-pack-variant-title">${lesson.title || "Lekcja"}</h3>
      <p class="teacher-pack-variant-text">
        ${lesson.description || lesson.shortDescription || "Wariant lekcji gotowy do pracy w Laboratorium Sumienia."}
      </p>
    `;

    article.addEventListener("click", () => {
      runtime.selectedLesson = lesson;
      window.LabCore.setQueryParams({ lessonId: lesson.id }, true);
      renderEverything();
      setStatus("Zmieniono aktywny wariant pakietu.", "success");
    });

    return article;
  }

  function renderVariants() {
    if (!DOM.packVariantList) return;

    DOM.packVariantList.innerHTML = "";

    if (!runtime.filteredLessons.length) {
      if (DOM.packVariantEmpty) DOM.packVariantEmpty.hidden = false;
      return;
    }

    if (DOM.packVariantEmpty) DOM.packVariantEmpty.hidden = true;

    runtime.filteredLessons.forEach((lesson) => {
      DOM.packVariantList.appendChild(buildVariantCard(lesson));
    });
  }

  function renderOverview() {
    const lesson = runtime.selectedLesson;

    window.LabCore.setText(DOM.packLessonTitle, lesson?.title || "—");
    window.LabCore.setText(DOM.packAgeGroup, window.LabCore.mapAgeGroupLabel(lesson?.ageGroup));
    window.LabCore.setText(DOM.packDuration, window.LabCore.formatDuration(lesson?.durationMin));
    window.LabCore.setText(DOM.packAxis, window.LabCore.mapAxisLabel(lesson?.axis));
    window.LabCore.setText(DOM.packReportType, window.LabCore.mapReportLabel(lesson?.reportTemplate));
  }

  function renderTimeline() {
    const lesson = runtime.selectedLesson;
    const steps = Array.isArray(lesson?.steps) ? lesson.steps : [];

    DOM.packTimeline.innerHTML = "";

    if (!steps.length) {
      DOM.packTimelineEmpty.hidden = false;
      return;
    }

    DOM.packTimelineEmpty.hidden = true;

    steps.forEach((step, index) => {
      const item = document.createElement("article");
      item.className = "teacher-pack-step";

      item.innerHTML = `
        <div class="teacher-pack-step-top">
          <h3 class="teacher-pack-step-title">${index + 1}. ${step.title || "Etap"}</h3>
          <div class="teacher-pack-step-meta">
            ${window.LabCore.formatDuration(step.durationMin)} · ${step.type || "etap"}
          </div>
        </div>
        <p class="teacher-pack-step-text">${step.teacherInstruction || "Brak instrukcji dla tego kroku."}</p>
      `;

      DOM.packTimeline.appendChild(item);
    });
  }

  function renderGuardrails() {
    const lesson = runtime.selectedLesson;
    const guardrails = Array.isArray(lesson?.guardrails) ? lesson.guardrails : [];

    DOM.packGuardrails.innerHTML = "";

    if (!guardrails.length) {
      DOM.packGuardrailsEmpty.hidden = false;
      return;
    }

    DOM.packGuardrailsEmpty.hidden = true;

    guardrails.forEach((text, index) => {
      const item = document.createElement("article");
      item.className = "teacher-pack-note";
      item.innerHTML = `
        <span class="teacher-pack-note-title">Guardrail ${index + 1}</span>
        <p class="teacher-pack-note-text">${text}</p>
      `;
      DOM.packGuardrails.appendChild(item);
    });
  }

  function renderPromptBank() {
    const lesson = runtime.selectedLesson;
    const steps = Array.isArray(lesson?.steps) ? lesson.steps : [];
    const promptIds = [];

    steps.forEach((step) => {
      if (Array.isArray(step.promptIds)) {
        step.promptIds.forEach((id) => {
          if (!promptIds.includes(id)) promptIds.push(id);
        });
      }
    });

    const prompts = window.LabCore.getPromptsByIds(promptIds);
    DOM.packPromptBank.innerHTML = "";

    if (!prompts.length) {
      DOM.packPromptEmpty.hidden = false;
      return;
    }

    DOM.packPromptEmpty.hidden = true;

    prompts.forEach((prompt, index) => {
      const item = document.createElement("article");
      item.className = "teacher-pack-note";
      item.innerHTML = `
        <span class="teacher-pack-note-title">Pytanie ${index + 1}</span>
        <p class="teacher-pack-note-text">${prompt.text || "Brak treści pytania."}</p>
      `;
      DOM.packPromptBank.appendChild(item);
    });
  }

  function renderObjects() {
    const lesson = runtime.selectedLesson;
    const steps = Array.isArray(lesson?.steps) ? lesson.steps : [];
    const ids = [];

    steps.forEach((step) => {
      if (step.objectId && !ids.includes(step.objectId)) {
        ids.push(step.objectId);
      }
    });

    DOM.packObjectList.innerHTML = "";

    if (!ids.length) {
      DOM.packObjectsEmpty.hidden = false;
      return;
    }

    DOM.packObjectsEmpty.hidden = true;

    ids.forEach((id) => {
      const object = window.LabCore.getObjectById(id);
      if (!object) return;

      const item = document.createElement("article");
      item.className = "teacher-pack-object";
      item.innerHTML = `
        <span class="teacher-pack-object-title">${object.title || "Obiekt pamięci"}</span>
        <p class="teacher-pack-object-text">${object.shortText || object.historicalMeaning || "Brak opisu obiektu."}</p>
      `;
      DOM.packObjectList.appendChild(item);
    });
  }

  function buildChecklistItems(lesson) {
    const hasObject = Array.isArray(lesson?.steps) && lesson.steps.some((step) => step.objectId);
    const hasPrompt = Array.isArray(lesson?.steps) && lesson.steps.some((step) => Array.isArray(step.promptIds) && step.promptIds.length);
    const hasReport = Boolean(lesson?.reportTemplate);

    const items = [
      {
        title: "Sprawdzenie wariantu",
        text: "Upewnij się, że wybrany został właściwy poziom, czas trwania i oś pracy przed wejściem do konsoli nauczyciela."
      },
      {
        title: "Przygotowanie wprowadzenia",
        text: "Zaplanuj pierwsze 1–2 zdania wejścia. Nie zaczynaj od pełnego wykładu. Zacznij od pytania i tonu pracy."
      },
      {
        title: "Porządek interpretacyjny",
        text: "Przypomnij sobie guardrails tego wariantu. Lekcja ma prowadzić do uważności, nie do prostego moralizowania."
      }
    ];

    if (hasObject) {
      items.push({
        title: "Obiekt pamięci",
        text: "Sprawdź wcześniej, czy obiekt pamięci wyświetla się poprawnie i czy jego detaliczny tryb działa bez zakłóceń."
      });
    }

    if (hasPrompt) {
      items.push({
        title: "Pytania aktywne",
        text: "Przeczytaj wszystkie pytania przed lekcją i zaznacz sobie, które mają być otwierające, a które pogłębiające."
      });
    }

    if (hasReport) {
      items.push({
        title: "Raport końcowy",
        text: "Zdecyduj wcześniej, czy raport będzie tylko domknięciem pracy, czy również materiałem do archiwum klasy."
      });
    }

    items.push({
      title: "Domknięcie lekcji",
      text: "Zaplanuj końcowe przejście: co uczniowie mają z tej pracy wynieść, nie w sensie hasła, lecz pytania lub napięcia."
    });

    return items;
  }

  function renderChecklist() {
    const lesson = runtime.selectedLesson;
    const items = buildChecklistItems(lesson);

    DOM.packChecklist.innerHTML = "";

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "teacher-pack-check";
      article.innerHTML = `
        <span class="teacher-pack-check-title">${item.title}</span>
        <p class="teacher-pack-check-text">${item.text}</p>
      `;
      DOM.packChecklist.appendChild(article);
    });
  }

  function buildAgeAdaptation(ageGroup) {
    const map = {
      "7-8": "Dla klas 7–8 trzymaj język możliwie konkretny. Nie przeciążaj pojęciami abstrakcyjnymi. Zostaw więcej miejsca na opis doświadczenia niż na definicje.",
      "liceum": "Dla liceum możesz mocniej wejść w napięcie między świadectwem, interpretacją i odpowiedzialnością odbiorcy. Pozwól uczniom budować odpowiedzi bardziej samodzielnie.",
      "uczelnia": "Na poziomie akademickim możesz zostawić więcej ciszy, więcej niejednoznaczności i bardziej świadomie operować rozróżnieniem między materiałem źródłowym, pamięcią i konstrukcją odbioru.",
      "polonia": "W grupie polonijnej lub dwujęzycznej dbaj o kontekst pojęć i realiów. Nie zakładaj całkowitej wspólnoty odniesień. Krótkie dopowiedzenia historyczne mogą być potrzebne wcześniej."
    };

    return map[ageGroup] || "Dostosuj tempo, gęstość języka i zakres kontekstu do rzeczywistej gotowości grupy, nie tylko do formalnego poziomu nauczania.";
  }

  function buildTeacherNote(axis) {
    const map = {
      swiadectwo: "Ta oś wymaga, by najpierw wybrzmiało pytanie o przekazanie doświadczenia, a dopiero później interpretacja jego sensu.",
      system: "Na osi systemu uważaj, by nie zamienić lekcji w wyłącznie polityczny wykład. Interesuje cię mechanizm nacisku na ludzkie decyzje.",
      wybor: "Na osi wyboru pilnuj, by nie produkować łatwych heroizacji ani prostych osądów. Najważniejsze pozostaje napięcie decyzji pod presją.",
      pamiec: "Na osi pamięci pilnuj rozróżnienia między pamiętaniem, używaniem pamięci i odpowiedzialnością za sposób jej przekazywania."
    };

    return map[axis] || "Prowadź lekcję tak, by znaczenie nie było wtłaczane z góry, lecz wydobywane przez rytm pytań, obiektów i odpowiedzi uczniów.";
  }

  function renderMaterials() {
    const lesson = runtime.selectedLesson;

    window.LabCore.setText(DOM.packAgeAdaptation, buildAgeAdaptation(lesson?.ageGroup));
    window.LabCore.setText(DOM.packTeacherNote, buildTeacherNote(lesson?.axis));

    window.LabCore.setText(
      DOM.packAfterLesson,
      "Po lekcji wróć do raportów uczniów nie po to, by szukać jednej poprawnej odpowiedzi, ale by zobaczyć, jakie napięcia i pytania naprawdę zostały uruchomione."
    );

    window.LabCore.setText(
      DOM.packNextModules,
      "Następny krok to konsola nauczyciela, tryb ucznia, raport odbioru i archiwum klasy. Ten pakiet porządkuje wejście przed pracą właściwą."
    );
  }

  function renderEverything() {
    renderOverview();
    renderVariants();
    renderTimeline();
    renderGuardrails();
    renderPromptBank();
    renderObjects();
    renderChecklist();
    renderMaterials();
  }

  function exportPackJson() {
    const lesson = runtime.selectedLesson;
    if (!lesson) return;

    const payload = {
      exportedAt: new Date().toISOString(),
      lesson,
      summary: {
        title: lesson.title || "",
        ageGroupLabel: window.LabCore.mapAgeGroupLabel(lesson.ageGroup),
        durationLabel: window.LabCore.formatDuration(lesson.durationMin),
        axisLabel: window.LabCore.mapAxisLabel(lesson.axis),
        reportLabel: window.LabCore.mapReportLabel(lesson.reportTemplate)
      },
      checklist: buildChecklistItems(lesson)
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teacher-pack-${window.LabCore.slugify(lesson.title || lesson.id || "lekcja")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setStatus("Pakiet nauczyciela został wyeksportowany do JSON.", "success");
  }

  function openTeacherConsole() {
    const lesson = runtime.selectedLesson;
    if (!lesson) return;

    const session = window.LabCore.buildSessionFromLesson(lesson, {
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

  function bindEvents() {
    [DOM.packAgeFilter, DOM.packDurationFilter, DOM.packAxisFilter]
      .filter(Boolean)
      .forEach((element) => {
        element.addEventListener("change", () => {
          filterLessons();
          renderEverything();
          setStatus("Odświeżono listę wariantów.", "neutral");
        });
      });

    DOM.openTeacherConsoleButton?.addEventListener("click", openTeacherConsole);
    DOM.printPackButton?.addEventListener("click", () => window.print());
    DOM.exportPackJsonButton?.addEventListener("click", exportPackJson);
  }

  function initializeTeacherPackPage() {
    cacheDom();

    runtime.lessons = getEnabledLessons();

    const currentLesson =
      window.LabCore.getCurrentLessonFromContext() ||
      runtime.lessons[0] ||
      null;

    runtime.selectedLesson = currentLesson;

    populateFilters();
    filterLessons();
    renderEverything();
    bindEvents();

    if (!runtime.selectedLesson) {
      setStatus("Nie odnaleziono aktywnej lekcji dla pakietu nauczyciela.", "warning");
      return;
    }

    setStatus("Pakiet nauczyciela gotowy do pracy.", "success");
  }

  async function init() {
    await window.LabCore.loadLabData();
    initializeTeacherPackPage();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
      console.error("[LabTeacherPack] Błąd inicjalizacji:", error);
      setStatus("Nie udało się uruchomić pakietu nauczyciela.", "warning");
    });
  });
})();
