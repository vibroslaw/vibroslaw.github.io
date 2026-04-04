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

  function setText(node, value) {
    if (!node) return;
    node.textContent = value ?? "";
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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

  function getModalHotspotNodes() {
    if (!DOM.modal) return [];
    return Array.from(DOM.modal.querySelectorAll(".object-detail-hotspot"));
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

    getModalHotspotNodes().forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
    });

    setText(DOM.activeTitle, hotspot.title || hotspot.label || "Detal");
    setText(DOM.activeText, hotspot.text || "Brak opisu detalu.");
    setText(DOM.blockMeaning, hotspot.significance || runtime.object?.historicalMeaning || "—");
    setText(DOM.blockHuman, hotspot.humanMeaning || runtime.object?.humanMeaning || "—");
    setText(DOM.blockPrompt, hotspot.prompt || runtime.object?.primaryQuestion || "—");

    if (hotspot.zoom) {
      runtime.scale = clamp(hotspot.zoom.scale || 1.5, SCALE.min, SCALE.max);
      runtime.translateX = Number(hotspot.zoom.x || 0);
      runtime.translateY = Number(hotspot.zoom.y || 0);
      applyTransform();
    }
  }

  function renderHotspots() {
    if (!DOM.hotspots) return;

    DOM.hotspots.innerHTML = "";
    const hotspots = getHotspots();

    if (!hotspots.length) {
      setText(DOM.activeTitle, "Brak hotspotów");
      setText(DOM.activeText, "Ten obiekt nie ma jeszcze przygotowanych warstw detalicznych.");
      setText(DOM.blockMeaning, runtime.object?.historicalMeaning || "—");
      setText(DOM.blockHuman, runtime.object?.humanMeaning || "—");
      setText(DOM.blockPrompt, runtime.object?.primaryQuestion || "—");
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

    setText(DOM.title, runtime.object.title || "Obiekt pamięci");
    setText(
      DOM.subtitle,
      runtime.object.shortText || "Tryb detalu pozwala pracować na warstwach obrazu i znaczenia."
    );

    setText(DOM.summaryTitle, runtime.object.title || "Obiekt pamięci");
    setText(DOM.summaryText, runtime.object.shortText || runtime.object.historicalMeaning || "—");
    setText(DOM.summaryQuote, runtime.object.quote || runtime.object.primaryQuestion || "—");

    setText(
      DOM.stageNote,
      "Kliknij hotspot, użyj strzałek lub przejdź klawiszami [ i ]. Możesz też przybliżać obraz i przesuwać go kursorem."
    );

    const imageUrl = runtime.object.image?.primary || runtime.object.image?.fallback || "";
    if (DOM.image) {
      DOM.image.style.backgroundImage = imageUrl
        ? `linear-gradient(180deg, rgba(8,8,8,.10), rgba(8,8,8,.34)), url('${imageUrl}')`
        : "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))";

      DOM.image.style.backgroundSize = "cover";
      DOM.image.style.backgroundRepeat = "no-repeat";
      DOM.image.style.backgroundPosition = `${runtime.object.image?.focusX || 50}% ${runtime.object.image?.focusY || 50}%`;
    }

    resetTransform();
    renderHotspots();
  }

  function resetRuntimeState() {
    runtime.object = null;
    runtime.activeHotspotIndex = 0;
    runtime.scale = 1;
    runtime.translateX = 0;
    runtime.translateY = 0;
    runtime.dragging = false;
    runtime.dragStartX = 0;
    runtime.dragStartY = 0;
    runtime.dragOriginX = 0;
    runtime.dragOriginY = 0;
  }

  function openById(objectId, meta = {}) {
    const object = window.LabCore?.getObjectById?.(objectId);
    if (!object) {
      console.warn("[ObjectDetail] Nie znaleziono obiektu:", objectId);
      return;
    }
    open(object, meta);
  }

  function open(object, meta = {}) {
    if (!DOM.modal || !object) return;

    runtime.object = object;
    runtime.activeHotspotIndex = 0;

    renderObject();

    if (meta.contextLabel && DOM.subtitle) {
      const baseText = object.shortText || "Tryb detalu pozwala pracować na warstwach obrazu i znaczenia.";
      DOM.subtitle.textContent = `${baseText} · ${meta.contextLabel}`;
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
    resetRuntimeState();

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn("[ObjectDetail] Exit fullscreen failed:", error);
    }
  }

  async function toggleFullscreen() {
    if (!DOM.modal) return;

    try {
      if (!document.fullscreenElement && DOM.modal.requestFullscreen) {
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

    const prevIndex = (runtime.activeHotspotIndex - 1 + hotspots.length) % hotspots.length;
    focusHotspot(prevIndex);
  }

  function onPointerDown(event) {
    if (!DOM.viewport || !DOM.viewport.contains(event.target)) return;

    runtime.dragging = true;
    runtime.dragStartX = event.clientX;
    runtime.dragStartY = event.clientY;
    runtime.dragOriginX = runtime.translateX;
    runtime.dragOriginY = runtime.translateY;

    if (DOM.viewport) {
      DOM.viewport.style.cursor = "grabbing";
    }
  }

  function onPointerMove(event) {
    if (!runtime.dragging) return;

    runtime.translateX = runtime.dragOriginX + (event.clientX - runtime.dragStartX);
    runtime.translateY = runtime.dragOriginY + (event.clientY - runtime.dragStartY);
    applyTransform();
  }

  function onPointerUp() {
    runtime.dragging = false;

    if (DOM.viewport) {
      DOM.viewport.style.cursor = "";
    }
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
