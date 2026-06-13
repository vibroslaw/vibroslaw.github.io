/* Report Room Artifact JS 14.0 — digital museum room interaction layer. */
(() => {
  const root = document.querySelector('[data-report-room]');
  if (!root) return;

  const pins = Array.from(root.querySelectorAll('[data-rr-place]'));
  const panels = Array.from(root.querySelectorAll('[data-rr-place-panel]'));
  const updateMap = (id) => {
    const index = Math.max(0, pins.findIndex((pin) => pin.dataset.rrPlace === id));
    const progress = pins.length > 1 ? (index + 1) / pins.length : 1;
    const selected = pins.find((pin) => pin.dataset.rrPlace === id);
    root.style.setProperty('--rr-map-progress', progress.toFixed(3));
    if (selected) {
      root.style.setProperty('--rr-map-active-x', selected.style.getPropertyValue('--x') || '44%');
      root.style.setProperty('--rr-map-active-y', selected.style.getPropertyValue('--y') || '34%');
      root.dataset.rrActivePlaceType = selected.dataset.rrPlaceType || '';
      const readout = root.querySelector('.rr-map-active-readout');
      if (readout) {
        const h = readout.querySelector('h3');
        const small = readout.querySelector('small');
        const p = readout.querySelector('p');
        if (h) h.textContent = selected.dataset.rrPlaceTitle || selected.textContent.trim();
        if (small) small.textContent = [selected.dataset.rrPlaceDate, selected.dataset.rrPlaceRole].filter(Boolean).join(' · ');
        if (p) p.textContent = selected.dataset.rrPlaceCopy || '';
        const source = readout.querySelector('[data-rr-map-readout-source]');
        if (source) source.textContent = (root.dataset.lang === 'pl' ? 'Źródła: ' : 'Sources: ') + (selected.dataset.rrPlaceSource || '');
      }
    }
    pins.forEach((pin) => {
      const active = pin.dataset.rrPlace === id;
      pin.classList.toggle('is-active', active);
      pin.setAttribute('aria-pressed', String(active));
    });
    panels.forEach((panel) => panel.toggleAttribute('data-rr-active-artifact', panel.dataset.rrPlacePanel === id));
    if (typeof ledgerButtons !== 'undefined') {
      ledgerButtons.forEach((button) => {
        const active = button.dataset.rrAtlasJump === id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
  };
  pins.forEach((pin) => pin.addEventListener('click', () => updateMap(pin.dataset.rrPlace)));
  const ledgerButtons = Array.from(root.querySelectorAll('[data-rr-atlas-jump]'));
  ledgerButtons.forEach((button) => button.addEventListener('click', () => updateMap(button.dataset.rrAtlasJump)));
  const activePin = pins.find((pin) => pin.classList.contains('is-active')) || pins[0];
  if (activePin) updateMap(activePin.dataset.rrPlace);

  const nodes = Array.from(root.querySelectorAll('.rr-memory-node'));
  const people = Array.from(root.querySelectorAll('.rr-person-card'));
  const activePanel = root.querySelector('.rr-memory-active-panel');
  const activateNode = (code) => {
    nodes.forEach((node) => {
      const active = node.dataset.rrNode === code;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    people.forEach((card) => {
      const badge = card.querySelector('span')?.textContent?.trim();
      card.toggleAttribute('data-rr-node-active', badge === code);
    });
    const selected = nodes.find((node) => node.dataset.rrNode === code);
    if (activePanel && selected) {
      const h = activePanel.querySelector('h3');
      const small = activePanel.querySelector('small');
      const p = activePanel.querySelector('p:last-child');
      if (h) h.textContent = selected.dataset.rrNodeTitle || selected.textContent.trim();
      if (small) small.textContent = selected.dataset.rrNodeKind || '';
      if (p) p.textContent = selected.dataset.rrNodeCopy || '';
    }
  };
  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => activateNode(node.dataset.rrNode));
    node.addEventListener('focus', () => activateNode(node.dataset.rrNode));
    node.addEventListener('click', () => activateNode(node.dataset.rrNode));
  });

  const relationButtons = Array.from(root.querySelectorAll('[data-rr-relation]'));
  const relationLines = Array.from(root.querySelectorAll('[data-rr-relation-line]'));
  const setRelation = (relation) => {
    root.dataset.rrRelation = relation;
    relationButtons.forEach((button) => {
      const active = button.dataset.rrRelation === relation;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    nodes.forEach((node) => {
      const muted = relation !== 'all' && node.dataset.rrNodeRelation !== relation && node.dataset.rrNode !== 'WP';
      node.classList.toggle('is-relation-muted', muted);
    });
    relationLines.forEach((line) => {
      const active = relation !== 'all' && line.dataset.rrRelationLine === relation;
      const muted = relation !== 'all' && !active;
      line.classList.toggle('is-relation-active', active);
      line.classList.toggle('is-relation-muted', muted);
    });
  };
  relationButtons.forEach((button) => button.addEventListener('click', () => setRelation(button.dataset.rrRelation)));
  if (relationButtons.length) setRelation('all');

  const shelfButtons = Array.from(root.querySelectorAll('[data-source-filter]'));
  const sourceCards = Array.from(root.querySelectorAll('.rr-source-card[data-source-tier]'));
  const setFilter = (filter) => {
    shelfButtons.forEach((button) => {
      const active = button.dataset.sourceFilter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    sourceCards.forEach((card) => {
      const hidden = filter !== 'all' && card.dataset.sourceTier !== filter;
      card.classList.toggle('is-filtered-out', hidden);
      card.toggleAttribute('hidden', hidden);
      card.setAttribute('aria-hidden', String(hidden));
    });
  };
  shelfButtons.forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.sourceFilter)));

  const mapModeButtons = Array.from(root.querySelectorAll('[data-rr-map-mode]'));
  const setMapMode = (mode) => {
    root.dataset.rrMapMode = mode;
    mapModeButtons.forEach((button) => {
      const active = button.dataset.rrMapMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  mapModeButtons.forEach((button) => button.addEventListener('click', () => setMapMode(button.dataset.rrMapMode)));
  if (mapModeButtons.length) setMapMode(mapModeButtons.find((button) => button.classList.contains('is-active'))?.dataset.rrMapMode || mapModeButtons[0].dataset.rrMapMode);

  const atlasLayerButtons = Array.from(root.querySelectorAll('[data-rr-atlas-layer]'));
  const setAtlasLayer = (layer) => {
    root.dataset.rrAtlasLayer = layer;
    atlasLayerButtons.forEach((button) => {
      const active = button.dataset.rrAtlasLayer === layer;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const visiblePins = [];
    pins.forEach((pin) => {
      const hidden = layer !== 'all' && pin.dataset.rrPlaceType !== layer;
      pin.toggleAttribute('hidden', hidden);
      pin.setAttribute('aria-hidden', String(hidden));
      pin.classList.toggle('is-layer-muted', hidden);
      if (!hidden) visiblePins.push(pin);
    });
    panels.forEach((panel) => {
      const hidden = layer !== 'all' && panel.dataset.rrPlaceType !== layer;
      panel.toggleAttribute('hidden', hidden);
      panel.setAttribute('aria-hidden', String(hidden));
    });
    ledgerButtons.forEach((button) => {
      const hidden = layer !== 'all' && button.dataset.rrAtlasType !== layer;
      button.toggleAttribute('hidden', hidden);
      button.setAttribute('aria-hidden', String(hidden));
    });
    const activeVisible = visiblePins.find((pin) => pin.classList.contains('is-active'));
    if (!activeVisible && visiblePins[0]) updateMap(visiblePins[0].dataset.rrPlace);
  };
  atlasLayerButtons.forEach((button) => button.addEventListener('click', () => setAtlasLayer(button.dataset.rrAtlasLayer)));
  if (atlasLayerButtons.length) setAtlasLayer('all');


  const displayButtons = Array.from(root.querySelectorAll('[data-rr-display-mode]'));
  const applyDisplayMode = (mode) => {
    root.dataset.rrDisplayMode = mode;
    root.classList.toggle('rr-focus-mode', mode === 'focus');
    root.classList.toggle('rr-projection-mode', mode === 'projection');
    displayButtons.forEach((button) => {
      const active = button.dataset.rrDisplayMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { sessionStorage.setItem('rrDisplayMode', mode); } catch (error) {}
  };
  if (displayButtons.length) {
    let savedMode = 'standard';
    try { savedMode = sessionStorage.getItem('rrDisplayMode') || 'standard'; } catch (error) {}
    const validMode = displayButtons.some((button) => button.dataset.rrDisplayMode === savedMode) ? savedMode : 'standard';
    displayButtons.forEach((button) => button.addEventListener('click', () => applyDisplayMode(button.dataset.rrDisplayMode)));
    applyDisplayMode(validMode);
  }

  const toolStatus = root.querySelector('[data-rr-tool-status]');
  const setToolStatus = (message) => {
    if (!toolStatus) return;
    toolStatus.textContent = message;
    window.setTimeout(() => { if (toolStatus.textContent === message) toolStatus.textContent = ''; }, 2600);
  };
  root.querySelectorAll('[data-rr-tool]').forEach((tool) => {
    tool.addEventListener('click', async () => {
      const action = tool.dataset.rrTool;
      if (action === 'print') {
        window.print();
        return;
      }
      if (action === 'copy-citation') {
        const text = tool.dataset.rrCopyText || document.title;
        try {
          await navigator.clipboard.writeText(text);
          setToolStatus(root.dataset.lang === 'pl' ? 'Opis skopiowany.' : 'Description copied.');
        } catch (error) {
          setToolStatus(root.dataset.lang === 'pl' ? 'Nie udało się skopiować automatycznie.' : 'Automatic copy failed.');
        }
      }
    });
  });


  const pathButtons = Array.from(root.querySelectorAll('[data-rr-path]'));
  const pathPanels = Array.from(root.querySelectorAll('[data-rr-path-panel]'));
  const setReadingPath = (path) => {
    pathButtons.forEach((button) => {
      const active = button.dataset.rrPath === path;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    pathPanels.forEach((panel) => {
      const active = panel.dataset.rrPathPanel === path;
      panel.classList.toggle('is-active', active);
      panel.toggleAttribute('hidden', !active);
      panel.setAttribute('aria-hidden', String(!active));
    });
  };
  pathButtons.forEach((button) => button.addEventListener('click', () => setReadingPath(button.dataset.rrPath)));
  if (pathButtons.length) setReadingPath(pathButtons.find((button) => button.classList.contains('is-active'))?.dataset.rrPath || pathButtons[0].dataset.rrPath);


  const cinemaFrames = Array.from(root.querySelectorAll('.rr-cinema-frame'));
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cinemaFrames.length && 'IntersectionObserver' in window) {
    const cinemaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-cinema-visible', entry.isIntersecting);
      });
    }, { threshold: 0.28, rootMargin: '0px 0px -8% 0px' });
    cinemaFrames.forEach((frame) => cinemaObserver.observe(frame));
  } else {
    cinemaFrames.forEach((frame) => frame.classList.add('is-cinema-visible'));
  }

  if (!reducedMotion) {
    let cinemaTicking = false;
    const updateCinemaDepth = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const depth = Math.min(1, Math.max(0, window.scrollY / max));
      root.style.setProperty('--rr-cinema-depth', depth.toFixed(3));
      cinemaTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!cinemaTicking) {
        window.requestAnimationFrame(updateCinemaDepth);
        cinemaTicking = true;
      }
    }, { passive: true });
    updateCinemaDepth();
  }



  // 14.0 Digital Museum Room — spatial room plan interaction.
  const roomNodes = Array.from(root.querySelectorAll('[data-rr-room-node]'));
  const roomTitle = root.querySelector('[data-rr-room-readout-title]');
  const roomRole = root.querySelector('[data-rr-room-readout-role]');
  const roomCopy = root.querySelector('[data-rr-room-readout-copy]');
  const roomLink = root.querySelector('[data-rr-room-readout-link]');
  const updateRoomPlan = (node) => {
    if (!node) return;
    roomNodes.forEach((item) => {
      const active = item === node;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (roomTitle) roomTitle.textContent = node.dataset.rrRoomTitle || '';
    if (roomRole) roomRole.textContent = node.dataset.rrRoomRole || '';
    if (roomCopy) roomCopy.textContent = node.dataset.rrRoomCopy || '';
    if (roomLink) roomLink.setAttribute('href', '#' + (node.dataset.rrRoomTarget || 'threshold'));
  };
  roomNodes.forEach((node) => {
    node.setAttribute('aria-pressed', node.classList.contains('is-active') ? 'true' : 'false');
    node.addEventListener('click', () => updateRoomPlan(node));
  });

})();
