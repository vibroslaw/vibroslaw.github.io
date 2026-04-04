(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    activeView: "prompt",
    views: ["prompt", "object", "qr", "focus"],
    qrInstance: null,
    teacherState: null,
    initialized: false,
    transitionRunning: false,
    blackoutActive: false
  };

  const VIEW_LABELS = {
    prompt: "Prompt",
    object: "Obiekt pamięci",
    qr: "Kod wejścia",
    focus: "Focus"
  };

  const TRANSITION_DURATIONS = {
    intro: 240,
    midpoint: 250,
    outro: 260
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function isReducedMotion() {
    return document.body.classList.contains("reduced-motion");
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setText(node, value) {
    if (!node) return;
    node.textContent = value ?? "";
  }

  function cacheDom() {
    DOM.root = qs("labPresent");
    DOM.close = qs("labPresentClose");
    DOM.fullscreenToggle = qs("labPresentFullscreenToggle");
    DOM.blackoutToggle = qs("labPresentBlackoutToggle");
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

    DOM.transition = qs("labPresentTransition");
    DOM.transitionTitle = qs("labPresentTransitionTitle");

    DOM.blackout = qs("labPresentBlackout");
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
    if (!DOM.qrWrap || !ensureQrLibrary()) return;

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
    if (!state?.session || !window.LabCore?.buildStudentLaunchUrl) return "";
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
    if (guardrails.length) return guardrails[0];
    return "Użyj tego widoku, aby zatrzymać grupę na jednym zdaniu, napięciu albo jednym pytaniu.";
  }

  function getStepPrefix(state) {
    const index = typeof state?.currentIndex === "number" ? state.currentIndex + 1 : 1;
    return `Krok ${index}`;
  }

  function renderPromptView(state) {
    if (!state) return;

    setText(DOM.promptStep, getStepPrefix(state));
    setText(DOM.promptType, state.stepTypeLabel || "Etap");
    setText(DOM.promptTitle, state.step?.title || "Etap");
    setText(DOM.promptInstruction, state.step?.teacherInstruction || "Brak instrukcji dla tego etapu.");
    setText(
      DOM.promptQuestion,
      state.currentPromptText || "Ten etap nie uruchamia aktywnego pytania."
    );
  }

  function renderObjectView(state) {
    const object = state?.linkedObject;

    setText(DOM.objectStep, getStepPrefix(state));

    if (!object) {
      setText(DOM.objectTitle, "Brak aktywnego obiektu");
      setText(DOM.objectText, "W bieżącym kroku nie ma przypisanego obiektu pamięci.");
      setText(DOM.objectQuote, "Przejdź do kroku z obiektem pamięci albo przełącz widok.");

      if (DOM.objectImage) {
        DOM.objectImage.style.backgroundImage =
          "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";
        DOM.objectImage.style.backgroundPosition = "center";
        DOM.objectImage.style.backgroundSize = "cover";
        DOM.objectImage.style.backgroundRepeat = "no-repeat";
      }
      return;
    }

    setText(DOM.objectTitle, object.title || "Obiekt pamięci");
    setText(DOM.objectText, object.shortText || object.historicalMeaning || "—");
    setText(DOM.objectQuote, object.quote || object.primaryQuestion || "—");

    const imageUrl = object.image?.primary || object.image?.fallback || "";
    if (DOM.objectImage) {
      DOM.objectImage.style.backgroundImage = imageUrl
        ? `linear-gradient(180deg, rgba(6,6,6,.12), rgba(6,6,6,.42)), url('${imageUrl}')`
        : "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";
      DOM.objectImage.style.backgroundSize = "cover";
      DOM.objectImage.style.backgroundRepeat = "no-repeat";
      DOM.objectImage.style.backgroundPosition = `${object.image?.focusX || 50}% ${object.image?.focusY || 50}%`;
    }
  }

  function renderQrView(state) {
    const url = buildQrUrl(state);

    setText(DOM.qrStep, state?.session?.sessionId || "Aktywna sesja");
    setText(DOM.qrType, "Tryb ucznia");
    setText(DOM.qrTitle, "Zeskanuj, aby wejść");
    setText(DOM.qrText, "Użyj telefonu, aby otworzyć aktywną ścieżkę ucznia.");
    setText(DOM.qrLink, url || "—");

    if (runtime.qrInstance && url) {
      runtime.qrInstance.update({ data: url });
    }
  }

  function renderFocusView(state) {
    setText(DOM.focusQuote, buildFocusQuote(state));
    setText(DOM.focusNote, buildFocusNote(state));
  }

  function renderChrome(state) {
    setText(DOM.sessionLabel, state?.session?.sessionId || "Tryb prezentacji");
    setText(
      DOM.footerLesson,
      state?.lesson?.title || state?.session?.lessonTitle || "Laboratorium Sumienia"
    );
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

  function getViewElement(name) {
    if (!DOM.root) return null;
    return DOM.root.querySelector(`.lab-present-view[data-view="${name}"]`);
  }

  function renderTabs() {
    if (!DOM.modeTabs) return;
    DOM.modeTabs.innerHTML = "";

    runtime.views.forEach((view) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `lab-present-tab${runtime.activeView === view ? " is-active" : ""}`;
      button.textContent = VIEW_LABELS[view] || view;
      button.dataset.view = view;

      button.addEventListener("click", () => {
        transitionToView(view);
      });

      DOM.modeTabs.appendChild(button);
    });
  }

  function setActiveViewInstant(view) {
    if (!runtime.views.includes(view)) return;
    runtime.activeView = view;

    runtime.views.forEach((name) => {
      const el = getViewElement(name);
      if (!el) return;
      el.classList.toggle("is-active", name === view);
    });

    renderTabs();
  }

  function showTransitionLabel(view) {
    if (!DOM.transition || !DOM.transitionTitle) return;
    setText(DOM.transitionTitle, VIEW_LABELS[view] || "Widok");
    DOM.transition.classList.add("is-visible");
  }

  async function hideTransitionLabel() {
    if (!DOM.transition) return;
    DOM.transition.classList.remove("is-visible");
    await wait(TRANSITION_DURATIONS.outro);
  }

  async function transitionToView(view, options = {}) {
    if (!runtime.views.includes(view)) return;
    if (runtime.transitionRunning) return;
    if (runtime.activeView === view && !options.force) return;

    const reduced = isReducedMotion();
    runtime.transitionRunning = true;

    if (reduced) {
      setActiveViewInstant(view);
      runtime.transitionRunning = false;
      return;
    }

    showTransitionLabel(view);
    await wait(TRANSITION_DURATIONS.intro);

    setActiveViewInstant(view);

    await wait(TRANSITION_DURATIONS.midpoint);
    await hideTransitionLabel();

    runtime.transitionRunning = false;
  }

  function toggleBlackout(force) {
    if (!DOM.blackout || !DOM.blackoutToggle) return;

    runtime.blackoutActive = typeof force === "boolean" ? force : !runtime.blackoutActive;
    DOM.blackout.hidden = !runtime.blackoutActive;
    DOM.blackoutToggle.classList.toggle("is-active", runtime.blackoutActive);
  }

  function show() {
    if (!DOM.root) return;

    mountQr();

    const state = readTeacherState();
    if (state) {
      renderAll(state);
    }

    DOM.root.hidden = false;
    DOM.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("lab-present-open");

    setActiveViewInstant(runtime.activeView);
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

    toggleBlackout(false);

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
    transitionToView(next);
  }

  function prevView() {
    const index = runtime.views.indexOf(runtime.activeView);
    const prev = runtime.views[(index - 1 + runtime.views.length) % runtime.views.length];
    transitionToView(prev);
  }

  function bindEvents() {
    if (runtime.initialized) return;

    DOM.close?.addEventListener("click", hide);
    DOM.fullscreenToggle?.addEventListener("click", enterFullscreen);
    DOM.blackoutToggle?.addEventListener("click", () => toggleBlackout());
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

      if (event.key.toLowerCase() === "b") {
        toggleBlackout();
      }

      if (event.key === "1") transitionToView("prompt");
      if (event.key === "2") transitionToView("object");
      if (event.key === "3") transitionToView("qr");
      if (event.key === "4") transitionToView("focus");
    });

    window.addEventListener("lab:teacherStepRendered", async (event) => {
      const detail = event.detail;
      if (!detail) return;

      renderAll(detail);

      if (!DOM.root?.hidden) {
        await transitionToView(runtime.activeView, { force: true });
      }
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
    },
    transitionToView
  };

  document.addEventListener("DOMContentLoaded", init);
})();
