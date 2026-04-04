(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    qrInstance: null,
    payload: null,
    activeItem: null,
    initialized: false,
    previousBodyOverflow: ""
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function setText(node, value) {
    if (!node) return;
    node.textContent = value ?? "";
  }

  function cacheDom() {
    DOM.modal = qs("labQrModal");
    DOM.close = qs("labQrClose");
    DOM.title = qs("labQrTitle");
    DOM.subtitle = qs("labQrSubtitle");
    DOM.modes = qs("labQrModes");
    DOM.canvasWrap = qs("labQrCanvasWrap");
    DOM.activeMode = qs("labQrActiveMode");
    DOM.linkInput = qs("labQrLinkInput");
    DOM.copyButton = qs("labQrCopyButton");
    DOM.openButton = qs("labQrOpenButton");
    DOM.downloadButton = qs("labQrDownloadButton");
    DOM.note = qs("labQrNote");
  }

  function ensureLibrary() {
    return typeof window.QRCodeStyling === "function";
  }

  function buildQrInstance() {
    if (!ensureLibrary()) return null;

    return new window.QRCodeStyling({
      width: 320,
      height: 320,
      type: "canvas",
      data: "https://piotrlichwala.com",
      margin: 10,
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

  function clearCanvasWrap() {
    if (!DOM.canvasWrap) return;
    DOM.canvasWrap.innerHTML = "";
  }

  function mountQrInstance() {
    if (!ensureLibrary()) return;

    if (!runtime.qrInstance) {
      runtime.qrInstance = buildQrInstance();
    }

    if (!runtime.qrInstance || !DOM.canvasWrap) return;

    clearCanvasWrap();
    runtime.qrInstance.append(DOM.canvasWrap);
  }

  function normalizeItem(item = {}) {
    return {
      id: item.id || `mode-${Math.random().toString(36).slice(2, 8)}`,
      label: item.label || item.id || "Tryb",
      note: item.note || "QR został zoptymalizowany pod czytelność i szybkie skanowanie.",
      url: item.url || "",
      filename: item.filename || item.id || "qr",
      title: item.title || item.label || "Wejście"
    };
  }

  function getRenderedModeButtons() {
    return Array.from(DOM.modes?.querySelectorAll(".lab-qr-mode") || []);
  }

  function setButtonsDisabledState(disabled) {
    if (DOM.copyButton) DOM.copyButton.disabled = disabled;
    if (DOM.openButton) DOM.openButton.disabled = disabled;
    if (DOM.downloadButton) DOM.downloadButton.disabled = disabled;
  }

  function setActiveItem(item) {
    runtime.activeItem = normalizeItem(item);

    setText(DOM.activeMode, runtime.activeItem.title);
    if (DOM.linkInput) {
      DOM.linkInput.value = runtime.activeItem.url;
    }
    setText(DOM.note, runtime.activeItem.note);

    setButtonsDisabledState(!runtime.activeItem.url);

    if (runtime.qrInstance && runtime.activeItem.url) {
      runtime.qrInstance.update({
        data: runtime.activeItem.url
      });
    }

    getRenderedModeButtons().forEach((button) => {
      button.classList.toggle("is-active", button.dataset.qrId === runtime.activeItem.id);
    });
  }

  function renderModes(items) {
    if (!DOM.modes) return;
    DOM.modes.innerHTML = "";

    items.forEach((item) => {
      const normalized = normalizeItem(item);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lab-qr-mode";
      button.dataset.qrId = normalized.id;
      button.textContent = normalized.label;

      button.addEventListener("click", () => {
        setActiveItem(normalized);
      });

      DOM.modes.appendChild(button);
    });
  }

  function showModal() {
    if (!DOM.modal) return;

    runtime.previousBodyOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";

    DOM.modal.hidden = false;
    DOM.modal.setAttribute("aria-hidden", "false");
  }

  function hideModal() {
    if (!DOM.modal) return;

    DOM.modal.hidden = true;
    DOM.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = runtime.previousBodyOverflow;
  }

  async function fallbackCopyText(text) {
    const input = DOM.linkInput;
    if (!input) return false;

    input.focus();
    input.select();
    input.setSelectionRange(0, input.value.length);

    try {
      return document.execCommand("copy");
    } catch {
      return false;
    }
  }

  async function copyActiveLink() {
    if (!runtime.activeItem?.url) return;

    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(runtime.activeItem.url);
        copied = true;
      } else {
        copied = await fallbackCopyText(runtime.activeItem.url);
      }
    } catch {
      copied = await fallbackCopyText(runtime.activeItem.url);
    }

    if (copied && DOM.copyButton) {
      const original = DOM.copyButton.textContent;
      DOM.copyButton.textContent = "Skopiowano";
      window.setTimeout(() => {
        DOM.copyButton.textContent = original;
      }, 1600);
    }
  }

  function openActiveLink() {
    if (!runtime.activeItem?.url) return;
    window.open(runtime.activeItem.url, "_blank", "noopener,noreferrer");
  }

  function downloadActiveQr() {
    if (!runtime.qrInstance || !runtime.activeItem?.url) return;

    runtime.qrInstance.download({
      name: runtime.activeItem.filename || "qr",
      extension: "png"
    });
  }

  function bindEvents() {
    if (runtime.initialized) return;

    DOM.close?.addEventListener("click", hideModal);

    DOM.modal?.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.hasAttribute("data-qr-close")) {
        hideModal();
      }
    });

    DOM.copyButton?.addEventListener("click", copyActiveLink);
    DOM.openButton?.addEventListener("click", openActiveLink);
    DOM.downloadButton?.addEventListener("click", downloadActiveQr);

    document.addEventListener("keydown", (event) => {
      if (!DOM.modal || DOM.modal.hidden) return;

      if (event.key === "Escape") {
        hideModal();
      }

      if (event.key === "ArrowRight" || event.key === "]") {
        const buttons = getRenderedModeButtons();
        if (!buttons.length || !runtime.activeItem) return;

        const currentIndex = buttons.findIndex((btn) => btn.dataset.qrId === runtime.activeItem.id);
        const nextIndex = (currentIndex + 1) % buttons.length;
        buttons[nextIndex]?.click();
      }

      if (event.key === "ArrowLeft" || event.key === "[") {
        const buttons = getRenderedModeButtons();
        if (!buttons.length || !runtime.activeItem) return;

        const currentIndex = buttons.findIndex((btn) => btn.dataset.qrId === runtime.activeItem.id);
        const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        buttons[prevIndex]?.click();
      }
    });

    runtime.initialized = true;
  }

  function open(payload) {
    if (!payload || !Array.isArray(payload.items) || !payload.items.length) {
      console.warn("[LabQR] Missing payload items.");
      return;
    }

    if (!ensureLibrary()) {
      console.warn("[LabQR] QRCodeStyling library missing.");
      return;
    }

    runtime.payload = payload;

    setText(DOM.title, payload.title || "Generator QR");
    setText(DOM.subtitle, payload.subtitle || "Wybierz tryb i zeskanuj kod.");

    renderModes(payload.items);
    mountQrInstance();

    const firstItem = normalizeItem(payload.items[0]);
    setActiveItem(firstItem);

    bindEvents();
    showModal();
  }

  function init() {
    cacheDom();
    bindEvents();
  }

  window.LabQR = {
    init,
    open,
    hide: hideModal
  };

  document.addEventListener("DOMContentLoaded", init);
})();
