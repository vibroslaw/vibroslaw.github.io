(() => {
  "use strict";

  const DOM = {};
  const runtime = {
    object: null,
    activeHotspotIndex: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragOriginX: 0,
    dragOriginY: 0,
    initialized: false
  };

  const SCALE = {
    min: 1,
    max: 2.6,
    step: 0.2
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function cacheDom() {
    DOM.modal = qs("objectDetailModal");
    DOM.close = qs("objectDetailClose");
    DOM.fullscreen = qs("objectDetailFullscreen");
    DOM.title = qs("objectDetailTitle");
    DOM.subtitle = qs("objectDetailSubtitle");

    DOM.zoomOut = qs("objectDetailZoomOut");
    DOM.zoomIn = qs("objectDetailZoomIn");
    DOM.zoomReset = qs("objectDetailZoomReset");
    DOM.zoomValue = qs("objectDetailZoomValue");

    DOM.viewport = qs("objectDetailViewport");
    DOM.canvas = qs("objectDetailCanvas");
    DOM.image = qs("objectDetailImage");
    DOM.hotspots = qs("objectDetailHotspots");
    DOM.stageNote = qs("objectDetailStageNote");

    DOM.summaryTitle = qs("objectDetailSummaryTitle");
    DOM.summaryText = qs("objectDetailSummaryText");
    DOM.summaryQuote = qs("objectDetailSummaryQuote");

    DOM.activeTitle = qs("objectDetailActiveTitle");
    DOM.activeText = qs("objectDetailActiveText");
    DOM.blockMeaning = qs("objectDetailMeaning");
    DOM.blockHuman = qs("objectDetailHumanMeaning");
    DOM.blockPrompt = qs("objectDetailPrompt");

    DOM.prevHotspot = qs("objectDetailPrevHotspot");
    DOM.nextHotspot = qs("objectDetailNextHotspot");
  }

  function getHotspots() {
    return Array.isArray(runtime.object?.hotspots) ? runtime.object.hotspots : [];
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function applyTransform() {
    if (!DOM.canvas) return;
    DOM.canvas.style.transform = `translate(${runtime.translateX}px, ${runtime.translateY}px) scale(${runtime.scale})`;

    if (DOM.zoomValue) {
      DOM.zoomValue.textContent = `${Math.round(runtime.scale * 100)}%`;
    }
  }

  function resetTransform() {
    runtime.scale = 1;
    runtime.translateX = 0;
    runtime.translateY = 0;
    applyTransform();
  }

  function zoomTo(scale) {
    runtime.scale = clamp(scale, SCALE.min, SCALE.max);
    applyTransform();
  }

  function zoomIn() {
    zoomTo(runtime.scale + SCALE.step);
  }

  function zoomOut() {
    zoomTo(runtime.scale - SCALE.step);
  }

  function focusHotspot(index) {
    const hotspots = getHotspots();
    const hotspot = hotspots[index];
    if (!hotspot) return;

    runtime.activeHotspotIndex = index;

    document.querySelectorAll(".object-detail-hotspot").forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
    });

    DOM.activeTitle.textContent = hotspot.title || hotspot.label || "Detal";
    DOM.activeText.textContent = hotspot.text || "Brak opisu detalu.";
    DOM.blockMeaning.textContent = hotspot.significance || runtime.object?.historicalMeaning || "—";
    DOM.blockHuman.textContent = hotspot.humanMeaning || runtime.object?.humanMeaning || "—";
    DOM.blockPrompt.textContent = hotspot.prompt || runtime.object?.primaryQuestion || "—";

    if (hotspot.zoom) {
      runtime.scale = clamp(hotspot.zoom.scale || 1.5, SCALE.min, SCALE.max);
      runtime.translateX = hotspot.zoom.x || 0;
      runtime.translateY = hotspot.zoom.y || 0;
      applyTransform();
    }
  }

  function renderHotspots() {
    if (!DOM.hotspots) return;

    DOM.hotspots.innerHTML = "";
    const hotspots = getHotspots();

    if (!hotspots.length) {
      DOM.activeTitle.textContent = "Brak hotspotów";
      DOM.activeText.textContent = "Ten obiekt nie ma jeszcze przygotowanych warstw detalicznych.";
      DOM.blockMeaning.textContent = runtime.object?.historicalMeaning || "—";
      DOM.blockHuman.textContent = runtime.object?.humanMeaning || "—";
      DOM.blockPrompt.textContent = runtime.object?.primaryQuestion || "—";
      return;
    }

    hotspots.forEach((hotspot, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "object-detail-hotspot";
      button.style.left = `${hotspot.x}%`;
      button.style.top = `${hotspot.y}%`;
      button.setAttribute("aria-label", hotspot.label || hotspot.title || `Detal ${index + 1}`);

      const label = document.createElement("span");
      label.className = "object-detail-hotspot-label";
      label.textContent = hotspot.label || `Detal ${index + 1}`;

      button.appendChild(label);
      button.addEventListener("click", () => {
        focusHotspot(index);
      });

      DOM.hotspots.appendChild(button);
    });

    focusHotspot(0);
  }

  function renderObject() {
    if (!runtime.object) return;

    DOM.title.textContent = runtime.object.title || "Obiekt pamięci";
    DOM.subtitle.textContent = runtime.object.shortText || "Tryb detalu pozwala pracować na warstwach obrazu i znaczenia.";
    DOM.summaryTitle.textContent = runtime.object.title || "Obiekt pamięci";
    DOM.summaryText.textContent = runtime.object.shortText || runtime.object.historicalMeaning || "—";
    DOM.summaryQuote.textContent = runtime.object.quote || runtime.object.primaryQuestion || "—";

    DOM.stageNote.textContent = "Kliknij hotspot, użyj strzałek lub przejdź klawiszami [ i ]. Możesz też przybliżać obraz i przesuwać go kursorem.";
    const imageUrl = runtime.object.image?.primary || runtime.object.image?.fallback || "";

    if (DOM.image) {
      DOM.image.style.backgroundImage = imageUrl
        ? `linear-gradient(180deg, rgba(8,8,8,.10), rgba(8,8,8,.34)), url('${imageUrl}')`
        : "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";
      DOM.image.style.backgroundPosition = `${runtime.object.image?.focusX || 50}% ${runtime.object.image?.focusY || 50}%`;
    }

    resetTransform();
    renderHotspots();
  }

  function openById(objectId, meta = {}) {
    const object = window.LabCore?.getObjectById?.(objectId);
    if (!object) return;
    open(object, meta);
  }

  function open(object, meta = {}) {
    runtime.object = object;
    runtime.activeHotspotIndex = 0;

    if (!DOM.modal) return;

    renderObject();

    if (meta.contextLabel && DOM.subtitle) {
      DOM.subtitle.textContent = `${object.shortText || ""} ${meta.contextLabel ? "· " + meta.contextLabel : ""}`.trim();
    }

    DOM.modal.hidden = false;
    DOM.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("object-detail-open");
  }

  async function close() {
    if (!DOM.modal) return;
    DOM.modal.hidden = true;
    DOM.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("object-detail-open");

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn("[ObjectDetail] Exit fullscreen failed:", error);
    }
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement && DOM.modal?.requestFullscreen) {
        await DOM.modal.requestFullscreen();
      } else if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn("[ObjectDetail] Fullscreen failed:", error);
    }
  }

  function nextHotspot() {
    const hotspots = getHotspots();
    if (!hotspots.length) return;
    const nextIndex = (runtime.activeHotspotIndex + 1) % hotspots.length;
    focusHotspot(nextIndex);
  }

  function prevHotspot() {
    const hotspots = getHotspots();
    if (!hotspots.length) return;
    const nextIndex = (runtime.activeHotspotIndex - 1 + hotspots.length) % hotspots.length;
    focusHotspot(nextIndex);
  }

  function onPointerDown(event) {
    if (!DOM.viewport || !DOM.viewport.contains(event.target)) return;
    runtime.dragging = true;
    runtime.dragStartX = event.clientX;
    runtime.dragStartY = event.clientY;
    runtime.dragOriginX = runtime.translateX;
    runtime.dragOriginY = runtime.translateY;
  }

  function onPointerMove(event) {
    if (!runtime.dragging) return;
    runtime.translateX = runtime.dragOriginX + (event.clientX - runtime.dragStartX);
    runtime.translateY = runtime.dragOriginY + (event.clientY - runtime.dragStartY);
    applyTransform();
  }

  function onPointerUp() {
    runtime.dragging = false;
  }

  function onWheel(event) {
    if (!DOM.viewport || !DOM.viewport.contains(event.target)) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -SCALE.step : SCALE.step;
    zoomTo(runtime.scale + delta);
  }

  function bindEvents() {
    if (runtime.initialized) return;

    DOM.close?.addEventListener("click", close);
    DOM.fullscreen?.addEventListener("click", toggleFullscreen);

    DOM.zoomIn?.addEventListener("click", zoomIn);
    DOM.zoomOut?.addEventListener("click", zoomOut);
    DOM.zoomReset?.addEventListener("click", resetTransform);

    DOM.prevHotspot?.addEventListener("click", prevHotspot);
    DOM.nextHotspot?.addEventListener("click", nextHotspot);

    DOM.modal?.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.hasAttribute("data-object-detail-close")) {
        close();
      }
    });

    DOM.viewport?.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    DOM.viewport?.addEventListener("wheel", onWheel, { passive: false });

    document.addEventListener("keydown", (event) => {
      if (!DOM.modal || DOM.modal.hidden) return;

      if (event.key === "Escape") close();
      if (event.key === "ArrowRight" || event.key === "]") nextHotspot();
      if (event.key === "ArrowLeft" || event.key === "[") prevHotspot();
      if (event.key === "+" || event.key === "=") zoomIn();
      if (event.key === "-" || event.key === "_") zoomOut();
      if (event.key === "0") resetTransform();
      if (event.key.toLowerCase() === "f") toggleFullscreen();
    });

    runtime.initialized = true;
  }

  function init() {
    cacheDom();
    bindEvents();
  }

  window.LabObjectDetail = {
    init,
    open,
    openById,
    close
  };

  document.addEventListener("DOMContentLoaded", init);
})();
