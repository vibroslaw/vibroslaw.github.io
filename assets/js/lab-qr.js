(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    qrInstance: null,
    payload: null,
    activeItem: null,
    initialized: false
  };

  function qs(id) {
    return document.getElementById(id);
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
    if (!runtime.qrInstance) {
      runtime.qrInstance = buildQrInstance();
    }

    if (!runtime.qrInstance || !DOM.canvasWrap) return;

    clearCanvasWrap();
    runtime.qrInstance.append(DOM.canvasWrap);
  }

  function normalizeItem(item) {
    return {
      id: item.id,
      label: item.label || item.id || "Tryb",
      note: item.note || "QR został zoptymalizowany pod czytelność i szybkie skanowanie.",
      url: item.url || "",
      filename: item.filename || item.id || "qr",
      title: item.title || item.label || "Wejście"
    };
  }

  function setActiveItem(item) {
    runtime.activeItem = normalizeItem(item);

    if (DOM.activeMode) {
      DOM.activeMode.textContent = runtime.activeItem.title;
    }

    if (DOM.linkInput) {
      DOM.linkInput.value = runtime.activeItem.url;
    }

    if (DOM.note) {
      DOM.note.textContent = runtime.activeItem.note;
    }

    if (runtime.qrInstance) {
      runtime.qrInstance.update({
        data: runtime.activeItem.url
      });
    }

    Array.from(DOM.modes?.querySelectorAll(".lab-qr-mode") || []).forEach((button) => {
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
    DOM.modal.hidden = false;
    DOM.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function hideModal() {
    if (!DOM.modal) return;
    DOM.modal.hidden = true;
    DOM.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  async function copyActiveLink() {
    if (!runtime.activeItem?.url) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(runtime.activeItem.url);
        if (DOM.copyButton) {
          const original = DOM.copyButton.textContent;
          DOM.copyButton.textContent = "Skopiowano";
          window.setTimeout(() => {
            DOM.copyButton.textContent = original;
          }, 1600);
        }
      }
    } catch (error) {
      console.warn("[LabQR] Copy failed:", error);
    }
  }

  function openActiveLink() {
    if (!runtime.activeItem?.url) return;
    window.open(runtime.activeItem.url, "_blank", "noopener,noreferrer");
  }

  function downloadActiveQr() {
    if (!runtime.qrInstance || !runtime.activeItem) return;

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
      if (event.key === "Escape" && DOM.modal && !DOM.modal.hidden) {
        hideModal();
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

    if (DOM.title) DOM.title.textContent = payload.title || "Generator QR";
    if (DOM.subtitle) DOM.subtitle.textContent = payload.subtitle || "Wybierz tryb i zeskanuj kod.";

    renderModes(payload.items);
    mountQrInstance();
    setActiveItem(payload.items[0]);
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
