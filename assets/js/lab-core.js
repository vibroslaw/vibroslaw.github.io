(() => {
  "use strict";

  const STORAGE_KEYS = {
    sessionState: "labSessionState",
    archiveState: "labArchiveState",
    reducedMotion: "labReducedMotion"
  };

  const DEFAULT_SESSION = {
    sessionId: "",
    lessonId: "",
    lessonTitle: "",
    ageGroup: "",
    durationMin: 0,
    axis: "",
    reportTemplate: "",
    institution: "",
    group: "",
    archiveEnabled: true,
    startedAt: null,
    currentStepIndex: 0,
    responses: {
      openingResponse: "",
      objectResponse: "",
      reflectionResponse: "",
      selectedQuote: "",
      selectedObject: "",
      keyMoment: "",
      finalResponse: "",
      openQuestion: ""
    }
  };

  const state = {
    ui: null,
    lessons: null,
    prompts: null,
    objects: null,
    loaded: false,
    loadingPromise: null
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function safeJsonParse(value, fallback = null) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function deepClone(value) {
    return structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
  }

  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function generateSessionId(prefix = "PS-PL") {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0")
    ].join("");
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `${prefix}-${stamp}-${rand}`;
  }

  function getBodyDataset() {
    return document.body?.dataset || {};
  }

  function getDataUrl(key) {
    const dataset = getBodyDataset();
    return dataset[key] || "";
  }

  async function fetchJson(url) {
    if (!url) {
      throw new Error("Brak adresu JSON.");
    }

    const response = await fetch(url, {
      credentials: "same-origin",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Nie udało się pobrać pliku: ${url} (${response.status})`);
    }

    return response.json();
  }

  async function loadLabData() {
    if (state.loaded) {
      return state;
    }

    if (state.loadingPromise) {
      return state.loadingPromise;
    }

    const uiUrl = getDataUrl("ui");
    const lessonsUrl = getDataUrl("lessons");
    const promptsUrl = getDataUrl("prompts");
    const objectsUrl = getDataUrl("objects");

    state.loadingPromise = Promise.all([
      fetchJson(uiUrl),
      fetchJson(lessonsUrl),
      fetchJson(promptsUrl),
      fetchJson(objectsUrl)
    ])
      .then(([ui, lessons, prompts, objects]) => {
        state.ui = ui;
        state.lessons = lessons;
        state.prompts = prompts;
        state.objects = objects;
        state.loaded = true;
        return state;
      })
      .catch((error) => {
        console.error("[LabCore] Błąd ładowania danych:", error);
        throw error;
      });

    return state.loadingPromise;
  }

  function getUiConfig() {
    return state.ui;
  }

  function getLessonsConfig() {
    return state.lessons;
  }

  function getPromptsConfig() {
    return state.prompts;
  }

  function getObjectsConfig() {
    return state.objects;
  }

  function getLessons() {
    return Array.isArray(state.lessons?.lessons) ? state.lessons.lessons : [];
  }

  function getObjects() {
    return Array.isArray(state.objects?.objects) ? state.objects.objects : [];
  }

  function getLessonById(id) {
    return getLessons().find((lesson) => lesson.id === id) || null;
  }

  function getObjectById(id) {
    return getObjects().find((object) => object.id === id) || null;
  }

  function getPromptGroups() {
    return state.prompts?.promptGroups || {};
  }

  function getPromptById(id) {
    const groups = getPromptGroups();

    for (const group of Object.values(groups)) {
      if (!group || typeof group !== "object") continue;
      for (const bucket of Object.values(group)) {
        if (!Array.isArray(bucket)) continue;
        const match = bucket.find((prompt) => prompt.id === id);
        if (match) return match;
      }
    }

    return null;
  }

  function getPromptsByIds(ids = []) {
    return ids.map(getPromptById).filter(Boolean);
  }

  function getQuoteOptions() {
    return Array.isArray(state.prompts?.quoteOptions) ? state.prompts.quoteOptions : [];
  }

  function getOpenQuestionOptions() {
    return Array.isArray(state.prompts?.openQuestionOptions) ? state.prompts.openQuestionOptions : [];
  }

  function getReportTemplateById(templateId) {
    return state.prompts?.reportTemplates?.[templateId] || null;
  }

  function getEnabledAgeGroups() {
    const availability = state.prompts?.availability || {};
    return Object.entries(availability)
      .filter(([, config]) => config?.enabled)
      .map(([key]) => key);
  }

  function mapAgeGroupLabel(ageGroup) {
    const labels = {
      "4-6": "Klasy 4–6",
      "7-8": "Klasy 7–8",
      "liceum": "Liceum / technikum",
      "uczelnia": "Uczelnia",
      "polonia": "Polonia / grupa dwujęzyczna"
    };
    return labels[ageGroup] || ageGroup || "—";
  }

  function mapAxisLabel(axis) {
    const labels = {
      "swiadectwo": "Świadectwo",
      "system": "System",
      "wybor": "Wybór",
      "pamiec": "Pamięć"
    };
    return labels[axis] || axis || "—";
  }

  function mapReportLabel(reportId) {
    const labels = {
      "karta-pamieci": "Karta pamięci",
      "raport-odbioru": "Raport odbioru",
      "raport-interpretacyjny": "Raport interpretacyjny",
      "raport-sumienia": "Raport sumienia"
    };
    return labels[reportId] || reportId || "—";
  }

  function normalizeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getQueryParams() {
    return new URLSearchParams(window.location.search);
  }

  function readQueryParam(name, fallback = "") {
    const value = getQueryParams().get(name);
    return value ?? fallback;
  }

  function setQueryParams(pairs = {}, replace = false) {
    const url = new URL(window.location.href);

    Object.entries(pairs).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
    });

    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", url.toString());
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[LabCore] Nie udało się zapisać ${key} do localStorage.`, error);
      return false;
    }
  }

  function loadFromStorage(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return safeJsonParse(raw, fallback);
    } catch (error) {
      console.warn(`[LabCore] Nie udało się odczytać ${key} z localStorage.`, error);
      return fallback;
    }
  }

  function clearStorageKey(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[LabCore] Nie udało się usunąć ${key} z localStorage.`, error);
    }
  }

  function buildSessionFromLesson(lesson, overrides = {}) {
    const base = deepClone(DEFAULT_SESSION);
    const institution = String(overrides.institution || "").trim();
    const group = String(overrides.group || "").trim();

    return {
      ...base,
      sessionId: overrides.sessionId || generateSessionId("PS-PL"),
      lessonId: lesson.id,
      lessonTitle: lesson.title || "",
      ageGroup: lesson.ageGroup || "",
      durationMin: lesson.durationMin || 0,
      axis: lesson.axis || "",
      reportTemplate: overrides.reportTemplate || lesson.reportTemplate || "raport-odbioru",
      institution,
      group,
      archiveEnabled: overrides.archiveEnabled ?? true,
      startedAt: overrides.startedAt || null,
      currentStepIndex: normalizeNumber(overrides.currentStepIndex, 0),
      responses: {
        ...base.responses,
        ...(overrides.responses || {})
      }
    };
  }

  function saveSessionState(session) {
    return saveToStorage(STORAGE_KEYS.sessionState, session);
  }

  function loadSessionState() {
    const raw = loadFromStorage(STORAGE_KEYS.sessionState, null);
    if (!raw) return deepClone(DEFAULT_SESSION);

    return {
      ...deepClone(DEFAULT_SESSION),
      ...raw,
      responses: {
        ...deepClone(DEFAULT_SESSION).responses,
        ...(raw.responses || {})
      }
    };
  }

  function updateSessionState(patch = {}) {
    const current = loadSessionState();
    const next = {
      ...current,
      ...patch,
      responses: {
        ...current.responses,
        ...(patch.responses || {})
      }
    };
    saveSessionState(next);
    return next;
  }

  function resetSessionState() {
    saveSessionState(deepClone(DEFAULT_SESSION));
    return deepClone(DEFAULT_SESSION);
  }

  function getArchiveState() {
    return loadFromStorage(STORAGE_KEYS.archiveState, {
      reportsCount: 0,
      topQuote: "",
      topObject: "",
      reports: []
    });
  }

  function saveArchiveState(archive) {
    return saveToStorage(STORAGE_KEYS.archiveState, archive);
  }

  function addReportToArchive(reportEntry) {
    const archive = getArchiveState();
    const nextReports = Array.isArray(archive.reports) ? archive.reports.slice() : [];
    nextReports.push(reportEntry);

    const quoteCount = new Map();
    const objectCount = new Map();

    nextReports.forEach((entry) => {
      if (entry.selectedQuote) {
        quoteCount.set(entry.selectedQuote, (quoteCount.get(entry.selectedQuote) || 0) + 1);
      }
      if (entry.selectedObject) {
        objectCount.set(entry.selectedObject, (objectCount.get(entry.selectedObject) || 0) + 1);
      }
    });

    const topQuote = [...quoteCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const topObject = [...objectCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    const nextArchive = {
      reportsCount: nextReports.length,
      topQuote,
      topObject,
      reports: nextReports
    };

    saveArchiveState(nextArchive);
    return nextArchive;
  }

  function getBestMatchingLesson(criteria = {}) {
    const lessons = getLessons().filter((lesson) => lesson.enabled !== false);

    if (!lessons.length) return null;

    const {
      lessonId,
      ageGroup,
      durationMin,
      axis
    } = criteria;

    if (lessonId) {
      const exact = lessons.find((lesson) => lesson.id === lessonId);
      if (exact) return exact;
    }

    let filtered = lessons;

    if (ageGroup) {
      filtered = filtered.filter((lesson) => lesson.ageGroup === ageGroup);
    }

    if (durationMin) {
      filtered = filtered.filter((lesson) => Number(lesson.durationMin) === Number(durationMin));
    }

    if (axis) {
      const axisExact = filtered.find((lesson) => lesson.axis === axis);
      if (axisExact) return axisExact;
    }

    return filtered[0] || lessons[0] || null;
  }

  function getCurrentLessonFromContext() {
    const dataset = getBodyDataset();
    const params = getQueryParams();

    const lessonId =
      params.get("lessonId") ||
      params.get("lesson") ||
      dataset.defaultLesson ||
      loadSessionState().lessonId;

    const lesson = getBestMatchingLesson({
      lessonId,
      ageGroup: params.get("ageGroup") || loadSessionState().ageGroup,
      durationMin: params.get("duration") || loadSessionState().durationMin,
      axis: params.get("axis") || loadSessionState().axis
    });

    return lesson;
  }

  function getCurrentStep(lesson, stepIndex) {
    if (!lesson || !Array.isArray(lesson.steps)) return null;
    return lesson.steps[stepIndex] || null;
  }

  function formatDuration(value) {
    const minutes = normalizeNumber(value, 0);
    if (!minutes) return "—";
    return `${minutes} min`;
  }

  function formatClock(totalSeconds) {
    const safe = Math.max(0, normalizeNumber(totalSeconds, 0));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function formatDate(dateInput = new Date()) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function setText(selectorOrElement, value, fallback = "—") {
    const el =
      typeof selectorOrElement === "string"
        ? qs(selectorOrElement)
        : selectorOrElement;

    if (!el) return;
    el.textContent = value || fallback;
  }

  function setHtml(selectorOrElement, value, fallback = "—") {
    const el =
      typeof selectorOrElement === "string"
        ? qs(selectorOrElement)
        : selectorOrElement;

    if (!el) return;
    el.innerHTML = value || fallback;
  }

  function populateSelect(selectElement, items, options = {}) {
    if (!selectElement) return;

    const {
      valueKey = "id",
      labelKey = "text",
      placeholder = ""
    } = options;

    selectElement.innerHTML = "";

    if (placeholder) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = placeholder;
      selectElement.appendChild(option);
    }

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valueKey];
      option.textContent = item[labelKey];
      selectElement.appendChild(option);
    });
  }

  function applyReducedMotionPreference() {
    const rawPreference = loadFromStorage(STORAGE_KEYS.reducedMotion, false);
    const prefersReduced =
      Boolean(rawPreference) ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    document.body.classList.toggle("reduced-motion", prefersReduced);
    return prefersReduced;
  }

  function setReducedMotion(enabled) {
    saveToStorage(STORAGE_KEYS.reducedMotion, Boolean(enabled));
    document.body.classList.toggle("reduced-motion", Boolean(enabled));
  }

  function initRevealObserver() {
    const revealItems = qsa(".reveal");
    if (!revealItems.length) return;

    const reducedMotion = document.body.classList.contains("reduced-motion");

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.14
    });

    revealItems.forEach((item) => observer.observe(item));
  }

  function syncProgressBar() {
    const progressBar = qs(".progress-bar");
    if (!progressBar) return;

    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  function initProgressBar() {
    syncProgressBar();
    window.addEventListener("scroll", syncProgressBar, { passive: true });
    window.addEventListener("resize", syncProgressBar);
  }

  function buildTeacherLaunchUrl(session) {
    const url = new URL("/rap-ort/prawda-sumienia/lab/pl/teacher.html", window.location.origin);
    url.searchParams.set("lessonId", session.lessonId);
    url.searchParams.set("sessionId", session.sessionId);
    if (session.ageGroup) url.searchParams.set("ageGroup", session.ageGroup);
    if (session.durationMin) url.searchParams.set("duration", String(session.durationMin));
    if (session.axis) url.searchParams.set("axis", session.axis);
    return url.toString();
  }

  function buildStudentLaunchUrl(session) {
    const url = new URL("/rap-ort/prawda-sumienia/lab/pl/student.html", window.location.origin);
    url.searchParams.set("lessonId", session.lessonId);
    url.searchParams.set("sessionId", session.sessionId);
    return url.toString();
  }

  function buildReportUrl(session) {
    const url = new URL("/rap-ort/prawda-sumienia/lab/pl/report.html", window.location.origin);
    url.searchParams.set("sessionId", session.sessionId);
    if (session.lessonId) url.searchParams.set("lessonId", session.lessonId);
    return url.toString();
  }

  function showStatusMessage(elementOrSelector, text, type = "info") {
    const el =
      typeof elementOrSelector === "string"
        ? qs(elementOrSelector)
        : elementOrSelector;

    if (!el) return;

    el.textContent = text;
    el.dataset.status = type;
  }

  async function bootstrapCore() {
    applyReducedMotionPreference();
    initRevealObserver();
    initProgressBar();
    await loadLabData();
  }

  const LabCore = {
    STORAGE_KEYS,
    DEFAULT_SESSION,
    state,
    qs,
    qsa,
    fetchJson,
    loadLabData,
    getUiConfig,
    getLessonsConfig,
    getPromptsConfig,
    getObjectsConfig,
    getLessons,
    getObjects,
    getLessonById,
    getObjectById,
    getPromptById,
    getPromptsByIds,
    getQuoteOptions,
    getOpenQuestionOptions,
    getReportTemplateById,
    getEnabledAgeGroups,
    getBestMatchingLesson,
    getCurrentLessonFromContext,
    getCurrentStep,
    mapAgeGroupLabel,
    mapAxisLabel,
    mapReportLabel,
    formatDuration,
    formatClock,
    formatDate,
    setText,
    setHtml,
    populateSelect,
    buildSessionFromLesson,
    saveSessionState,
    loadSessionState,
    updateSessionState,
    resetSessionState,
    getArchiveState,
    saveArchiveState,
    addReportToArchive,
    getQueryParams,
    readQueryParam,
    setQueryParams,
    buildTeacherLaunchUrl,
    buildStudentLaunchUrl,
    buildReportUrl,
    showStatusMessage,
    setReducedMotion,
    bootstrapCore,
    slugify
  };

  window.LabCore = LabCore;

  document.addEventListener("DOMContentLoaded", () => {
    bootstrapCore().catch((error) => {
      console.error("[LabCore] Bootstrap failed:", error);
    });
  });
})();
