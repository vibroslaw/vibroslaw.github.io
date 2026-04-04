(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    activeView: "prompt",
    views: ["prompt", "object", "qr", "focus"],
    qrInstance: null,
    teacherState: null,
    initialized: false
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function cacheDom() {
    DOM.root = qs("labPresent");
    DOM.close = qs("labPresentClose");
    DOM.fullscreenToggle = qs("labPresentFullscreenToggle");
    DOM.modeTabs = qs("labPresentModeTabs");
    DOM.prevView = qs("labPresentPrevView");
    DOM.nextView = qs("labPresentNextView");

    DOM.sessionLabel = qs("labPresentSessionLabel");
    DOM.footerLesson = qs("labPresentFooterLesson");

    DOM.promptView = qs("labPresentPromptView");
    DOM.promptStep = qs("labPresentPromptStep");
    DOM.promptType = qs("labPresentPromptType");
    DOM.promptTitle = qs("labPresentPromptTitle");
    DOM.promptInstruction = qs("labPresentPromptInstruction");
    DOM.promptQuestion = qs("labPresentPromptQuestion");

    DOM.objectView = qs("labPresentObjectView");
    DOM.objectStep = qs("labPresentObjectStep");
    DOM.objectImage = qs("labPresentObjectImage");
    DOM.objectTitle = qs("labPresentObjectTitle");
    DOM.objectText = qs("labPresentObjectText");
    DOM.objectQuote = qs("labPresentObjectQuote");

    DOM.qrView = qs("labPresentQrView");
    DOM.qrWrap = qs("labPresentQrWrap");
    DOM.qrStep = qs("labPresentQrStep");
    DOM.qrType = qs("labPresentQrType");
    DOM.qrTitle = qs("labPresentQrTitle");
    DOM.qrText = qs("labPresentQrText");
    DOM.qrLink = qs("labPresentQrLink");

    DOM.focusView = qs("labPresentFocusView");
    DOM.focusQuote = qs("labPresentFocusQuote");
    DOM.focusNote = qs("labPresentFocusNote");
  }

  function ensureQrLibrary() {
    return typeof window.QRCodeStyling === "function";
  }

  function buildQrInstance() {
    if (!ensureQrLibrary()) return null;

    return new window.QRCodeStyling({
      width: 420,
      height: 420,
      type: "canvas",
      data: "https://piotrlichwala.com",
      margin: 12,
      qrOptions: {
        errorCorrectionLevel: "Q"
      },
      dotsOptions: {
        color: "#111111",
        type: "rounded"
      },
      backgroundOptions: {
        color: "#f3ede4"
      },
      cornersSquareOptions: {
        color: "#111111",
        type: "extra-rounded"
      },
      cornersDotOptions: {
        color: "#111111",
        type: "dot"
      }
    });
  }

  function mountQr() {
    if (!DOM.qrWrap) return;

    if (!runtime.qrInstance) {
      runtime.qrInstance = buildQrInstance();
    }

    if (!runtime.qrInstance) return;

    DOM.qrWrap.innerHTML = "";
    runtime.qrInstance.append(DOM.qrWrap);
  }

  function getTeacherBridge() {
    return window.LabTeacherPresentationBridge || null;
  }

  function readTeacherState() {
    const bridge = getTeacherBridge();
    if (!bridge?.getState) return null;
    return bridge.getState();
  }

  function buildQrUrl(state) {
    if (!state?.session) return "";
    return window.LabCore.buildStudentLaunchUrl(state.session);
  }

  function buildFocusQuote(state) {
    if (state?.currentPromptText && state.currentPromptText !== "Ten etap nie uruchamia aktywnego pytania.") {
      return state.currentPromptText;
    }

    if (state?.step?.teacherInstruction) {
      return state.step.teacherInstruction;
    }

    return "Świadectwo nie istnieje po to, by wywołać efekt. Istnieje po to, by zostać potraktowane poważnie.";
  }

  function buildFocusNote(state) {
    const guardrails = Array.isArray(state?.lesson?.guardrails) ? state.lesson.guardrails : [];
    if (guardrails.length) {
      return guardrails[0];
    }

    return "Użyj tego widoku, gdy chcesz zatrzymać grupę na jednym napięciu interpretacyjnym.";
  }

  function renderPromptView(state) {
    if (!state) return;

    DOM.promptStep.textContent = `Krok ${state.currentIndex + 1}`;
    DOM.promptType.textContent = state.stepTypeLabel || "Etap";
    DOM.promptTitle.textContent = state.step?.title || "Etap";
    DOM.promptInstruction.textContent = state.step?.teacherInstruction || "Brak instrukcji dla tego etapu.";
    DOM.promptQuestion.textContent =
      state.currentPromptText || "Ten etap nie uruchamia aktywnego pytania.";
  }

  function renderObjectView(state) {
    const object = state?.linkedObject;

    DOM.objectStep.textContent = `Krok ${state?.currentIndex + 1 || 1}`;

    if (!object) {
      DOM.objectTitle.textContent = "Brak aktywnego obiektu";
      DOM.objectText.textContent = "W bieżącym kroku nie ma przypisanego obiektu pamięci.";
      DOM.objectQuote.textContent = "Przełącz widok albo przejdź do kroku z obiektem pamięci.";
      DOM.objectImage.style.backgroundImage =
        "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";
      DOM.objectImage.style.backgroundPosition = "center";
      return;
    }

    DOM.objectTitle.textContent = object.title || "Obiekt pamięci";
    DOM.objectText.textContent = object.shortText || object.historicalMeaning || "—";
    DOM.objectQuote.textContent = object.quote || object.primaryQuestion || "—";

    const imageUrl = object.image?.primary || object.image?.fallback || "";
    DOM.objectImage.style.backgroundImage = imageUrl
      ? `linear-gradient(180deg, rgba(6,6,6,.12), rgba(6,6,6,.42)), url('${imageUrl}')`
      : "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";
    DOM.objectImage.style.backgroundSize = "cover";
    DOM.objectImage.style.backgroundRepeat = "no-repeat";
    DOM.objectImage.style.backgroundPosition = `${object.image?.focusX || 50}% ${object.image?.focusY || 50}%`;
  }

  function renderQrView(state) {
    const url = buildQrUrl(state);

    DOM.qrStep.textContent = state?.session?.sessionId || "Aktywna sesja";
    DOM.qrType.textContent = "Tryb ucznia";
    DOM.qrTitle.textContent = "Zeskanuj, aby wejść";
    DOM.qrText.textContent = "Użyj telefonu, aby otworzyć aktywną ścieżkę ucznia.";
    DOM.qrLink.textContent = url || "—";

    if (runtime.qrInstance && url) {
      runtime.qrInstance.update({
        data: url
      });
    }
  }

  function renderFocusView(state) {
    DOM.focusQuote.textContent = buildFocusQuote(state);
    DOM.focusNote.textContent = buildFocusNote(state);
  }

  function renderChrome(state) {
    DOM.sessionLabel.textContent = state?.session?.sessionId || "Tryb prezentacji";
    DOM.footerLesson.textContent = state?.lesson?.title || state?.session?.lessonTitle || "Laboratorium Sumienia";
  }

  function renderAll(state) {
    if (!state) return;
    runtime.teacherState = state;
    renderChrome(state);
    renderPromptView(state);
    renderObjectView(state);
    renderQrView(state);
    renderFocusView(state);
  }

  function renderTabs() {
    if (!DOM.modeTabs) return;
    DOM.modeTabs.innerHTML = "";

    const labels = {
      prompt: "Prompt",
      object: "Obiekt",
      qr: "QR",
      focus: "Focus"
    };

    runtime.views.forEach((view) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `lab-present-tab${runtime.activeView === view ? " is-active" : ""}`;
      button.textContent = labels[view] || view;
      button.dataset.view = view;

      button.addEventListener("click", () => {
        setActiveView(view);
      });

      DOM.modeTabs.appendChild(button);
    });
  }

  function setActiveView(view) {
    if (!runtime.views.includes(view)) return;
    runtime.activeView = view;

    runtime.views.forEach((name) => {
      const el = document.querySelector(`.lab-present-view[data-view="${name}"]`);
      if (!el) return;
      el.classList.toggle("is-active", name === view);
    });

    renderTabs();
  }

  function show() {
    if (!DOM.root) return;

    const state = readTeacherState();
    if (state) {
      renderAll(state);
    }

    DOM.root.hidden = false;
    DOM.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("lab-present-open");

    setActiveView(runtime.activeView);
  }

  async function enterFullscreen() {
    const target = DOM.root;
    if (!target) return;

    try {
      if (!document.fullscreenElement && target.requestFullscreen) {
        await target.requestFullscreen();
      } else if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn("[LabPresentation] Fullscreen failed:", error);
    }
  }

  async function hide() {
    if (!DOM.root) return;

    DOM.root.hidden = true;
    DOM.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lab-present-open");

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn("[LabPresentation] Exit fullscreen failed:", error);
    }
  }

  function nextView() {
    const index = runtime.views.indexOf(runtime.activeView);
    const next = runtime.views[(index + 1) % runtime.views.length];
    setActiveView(next);
  }

  function prevView() {
    const index = runtime.views.indexOf(runtime.activeView);
    const prev = runtime.views[(index - 1 + runtime.views.length) % runtime.views.length];
    setActiveView(prev);
  }

  function bindEvents() {
    if (runtime.initialized) return;

    DOM.close?.addEventListener("click", hide);
    DOM.fullscreenToggle?.addEventListener("click", enterFullscreen);
    DOM.nextView?.addEventListener("click", nextView);
    DOM.prevView?.addEventListener("click", prevView);

    document.addEventListener("keydown", (event) => {
      if (DOM.root?.hidden) return;

      if (event.key === "Escape") {
        hide();
      }

      if (event.key === "ArrowRight") {
        nextView();
      }

      if (event.key === "ArrowLeft") {
        prevView();
      }

      if (event.key.toLowerCase() === "f") {
        enterFullscreen();
      }
    });

    window.addEventListener("lab:teacherStepRendered", (event) => {
      const detail = event.detail;
      if (!detail) return;
      renderAll(detail);
    });

    runtime.initialized = true;
  }

  function init() {
    cacheDom();
    mountQr();
    renderTabs();
    bindEvents();
  }

  window.LabPresentation = {
    init,
    open: show,
    hide,
    nextView,
    prevView,
    sync() {
      const state = readTeacherState();
      if (state) renderAll(state);
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
