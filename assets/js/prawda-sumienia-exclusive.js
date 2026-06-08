(() => {
  const root = document.querySelector('[data-psx-page]');
  if (!root) return;

  const pr61Stylesheet = '/assets/css/prawda-sumienia-pr61-stabilize.css';
  if (!document.querySelector(`link[href="${pr61Stylesheet}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = pr61Stylesheet;
    document.head.appendChild(link);
  }

  root.classList.add('psx-js-ready');
  document.documentElement.classList.add('psx-js-ready');

  const lang = root.dataset.lang || document.documentElement.lang || 'en';
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event') || root.dataset.defaultEvent || '';
  const safeForwardParams = ['event', 'ref', 'utm_source', 'utm_medium', 'utm_campaign', 'screening'];
  const applySafeParams = (url) => {
    safeForwardParams.forEach((key) => {
      const value = params.get(key);
      if (value) url.searchParams.set(key, value);
    });
    if (eventId) url.searchParams.set('event', eventId);
    return url;
  };
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  const revealItems = Array.from(root.querySelectorAll('[data-psx-reveal]'));
  const showRevealItems = () => {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  };

  if (reducedMotion || !('IntersectionObserver' in window)) {
    showRevealItems();
  } else if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.08
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  window.setTimeout(showRevealItems, reducedMotion ? 0 : 900);

  const copyText = {
    en: {
      copied: 'QR link copied.',
      failed: 'Copy failed. Use the address bar link.'
    },
    pl: {
      copied: 'Link QR skopiowany.',
      failed: 'Nie udało się skopiować. Użyj linku z paska adresu.'
    }
  };

  const routeMap = {
    en: {
      witness: '/rap-ort/witness-report/generator/',
      participation: '/rap-ort/participation/',
      archive: '/rap-ort/participation/#archive-gallery'
    },
    pl: {
      witness: '/rap-ort/raport-swiadka/generator/',
      participation: '/rap-ort/uczestnictwo/',
      archive: '/rap-ort/uczestnictwo/#archive-gallery'
    }
  };

  const routes = routeMap[lang] || routeMap.en;

  const buildEventUrl = (path) => {
    const url = applySafeParams(new URL(path, window.location.origin));
    return `${url.pathname}${url.search}${url.hash}`;
  };

  root.querySelectorAll('[data-psx-link-type]').forEach((link) => {
    const type = link.dataset.psxLinkType;
    if (!routes[type]) return;
    link.setAttribute('href', buildEventUrl(routes[type]));
  });

  const finalActionCopy = {
    en: { participation: 'Participation Record' },
    pl: { participation: 'Zapis uczestnictwa' }
  };

  const ensureFinalRitualActions = () => {
    const finalActions = root.querySelector('.psx-final .psx-actions');
    if (!finalActions || !routes.participation) return;
    if (finalActions.querySelector('[data-psx-link-type="participation"]')) return;

    const link = document.createElement('a');
    link.className = 'psx-button psx-button-quiet psx-button-participation';
    link.dataset.psxLinkType = 'participation';
    link.dataset.psxEventLink = '';
    link.href = buildEventUrl(routes.participation);
    link.textContent = finalActionCopy[lang]?.participation || finalActionCopy.en.participation;

    const archiveLink = finalActions.querySelector('[data-psx-link-type="archive"]');
    if (archiveLink) {
      finalActions.insertBefore(link, archiveLink);
    } else {
      finalActions.appendChild(link);
    }
  };

  ensureFinalRitualActions();

  const modalText = {
    en: { close: 'Close', aria: 'Orientation note' },
    pl: { close: 'Zamknij', aria: 'Nota orientacyjna' }
  };

  const setupContextModal = () => {
    const triggers = Array.from(root.querySelectorAll('[data-psx-modal-title]'))
      .filter((trigger) => !trigger.closest('.psx-memory-atlas'));
    if (!triggers.length) return;

    const dictionary = modalText[lang] || modalText.en;
    const modal = document.createElement('div');
    modal.className = 'psx-context-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', dictionary.aria);

    const panel = document.createElement('div');
    panel.className = 'psx-context-modal-panel';

    const close = document.createElement('button');
    close.className = 'psx-context-modal-close';
    close.type = 'button';
    close.dataset.psxModalClose = '';
    close.setAttribute('aria-label', dictionary.close);
    close.textContent = '×';

    const kicker = document.createElement('p');
    kicker.className = 'psx-kicker psx-context-modal-kicker';

    const title = document.createElement('h3');
    title.className = 'psx-context-modal-title';

    const body = document.createElement('div');
    body.className = 'psx-context-modal-body';

    const renderModalBody = (text) => {
      body.textContent = '';
      String(text || '')
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => {
          const paragraph = document.createElement('p');
          paragraph.textContent = part;
          body.appendChild(paragraph);
        });
    };

    panel.append(close, kicker, title, body);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    let lastFocus = null;

    const closeModal = () => {
      modal.hidden = true;
      document.documentElement.classList.remove('psx-modal-open');
      lastFocus?.focus?.();
    };

    const openModal = (trigger) => {
      lastFocus = trigger;
      kicker.textContent = trigger.dataset.psxModalKicker || '';
      title.textContent = trigger.dataset.psxModalTitle || '';
      renderModalBody(trigger.dataset.psxModalBody || '');
      modal.hidden = false;
      document.documentElement.classList.add('psx-modal-open');
      close.focus({ preventScroll: true });
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => openModal(trigger));
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-psx-modal-close]')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  };

  setupContextModal();

  root.querySelectorAll('.psx-language-switch[href]').forEach((link) => {
    const url = applySafeParams(new URL(link.getAttribute('href'), window.location.origin));
    if (window.location.hash) url.hash = window.location.hash;
    link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  });

  const eventConfig = window.RAPORT_EVENTS?.events?.[eventId];
  const localizedEvent = eventConfig?.[lang];
  const eventName = root.querySelector('[data-psx-event-name]');
  const eventDetail = root.querySelector('[data-psx-event-detail]');

  if (localizedEvent && eventName && eventDetail) {
    eventName.textContent = localizedEvent.shortPlace || localizedEvent.title || eventId;
    const detailParts = [localizedEvent.date, localizedEvent.place].filter(Boolean);
    eventDetail.textContent = detailParts.join(' / ');
  }

  const heroAssets = {
    en: { desktop: '/public/assets/events/rap-ort/syd2026/experience/sydney-event-lobby.webp' },
    pl: { desktop: '/public/assets/events/rap-ort/oswiecim20260525/experience/oswiecim-event-lobby.webp' }
  };

  const sharedHeroAssets = {
    desktop: '/public/assets/events/rap-ort/shared/experience/event-lobby-cinematic-hero.webp',
    mobile: '/public/assets/events/rap-ort/shared/experience/event-lobby-cinematic-mobile.webp'
  };

  const installHeroVisual = () => {
    const heroGrid = root.querySelector('.psx-hero-grid');
    const inscription = root.querySelector('.psx-hero-inscription');
    if (!heroGrid || !inscription) return;

    const legacyPlaceholder = heroGrid.querySelector('.psx-hero-visual[hidden]');
    if (legacyPlaceholder) legacyPlaceholder.remove();
    if (heroGrid.querySelector('figure.psx-hero-visual')) return;

    const assets = heroAssets[lang] || sharedHeroAssets;
    const figure = document.createElement('figure');
    figure.className = 'psx-hero-visual';
    figure.setAttribute('aria-hidden', 'true');

    const picture = document.createElement('picture');
    const mobileSource = document.createElement('source');
    mobileSource.media = '(max-width: 760px)';
    mobileSource.srcset = assets.mobile || sharedHeroAssets.mobile;

    const image = document.createElement('img');
    image.className = 'psx-hero-visual-image';
    image.src = assets.desktop || sharedHeroAssets.desktop;
    image.alt = '';
    image.decoding = 'async';
    image.fetchPriority = 'high';
    image.loading = 'eager';
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = 'true';
      mobileSource.srcset = sharedHeroAssets.mobile;
      image.src = sharedHeroAssets.desktop;
    }, { once: true });

    picture.append(mobileSource, image);

    const beam = document.createElement('span');
    beam.className = 'psx-hero-visual-beam';

    figure.append(picture, beam);
    heroGrid.insertBefore(figure, inscription);
    root.classList.add('psx-hero-has-visual');
  };

  installHeroVisual();

  const currentExperienceUrl = () => {
    const url = new URL(window.location.href);
    if (eventId) url.searchParams.set('event', eventId);
    return url.href;
  };

  root.querySelectorAll('[data-copy-current]').forEach((button) => {
    button.addEventListener('click', async () => {
      const status = root.querySelector('[data-copy-status]');
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(currentExperienceUrl());
        if (status) status.textContent = copyText[lang]?.copied || copyText.en.copied;
      } catch (_) {
        if (status) status.textContent = copyText[lang]?.failed || copyText.en.failed;
      }
    });
  });

  const navLinks = Array.from(root.querySelectorAll('.psx-orbit-nav a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionById = new Map(
      navLinks
        .map((link) => [link.getAttribute('href').slice(1), link])
        .filter(([id]) => id)
    );

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove('is-active'));
        sectionById.get(entry.target.id)?.classList.add('is-active');
      });
    }, {
      rootMargin: '-40% 0px -52% 0px',
      threshold: 0.01
    });

    sectionById.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
  }

  const timelineNodes = Array.from(root.querySelectorAll('[data-timeline-node]'));
  const timelineShell = root.querySelector('.psx-timeline-shell');
  let timelineDetail = root.querySelector('[data-timeline-detail]');

  const upgradeJourneyMap = () => {
    if (!timelineNodes.length || !timelineShell || timelineShell.dataset.psxMapUpgraded) return;
    const track = timelineShell.querySelector('.psx-timeline-track');
    if (!track) return;

    timelineShell.dataset.psxMapUpgraded = 'true';
    timelineShell.classList.add('psx-map-board');
    track.setAttribute('role', 'list');

    const route = document.createElement('div');
    route.className = 'psx-route-canvas';
    route.setAttribute('aria-hidden', 'true');

    const namespace = 'http://www.w3.org/2000/svg';
    const pathData = 'M64 238 C182 82 292 82 392 184 S585 326 706 174 S930 74 1136 206';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 1200 360');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('focusable', 'false');

    ['psx-route-shadow', 'psx-route-line', 'psx-route-pulse'].forEach((className) => {
      const path = document.createElementNS(namespace, 'path');
      path.setAttribute('class', className);
      path.setAttribute('d', pathData);
      svg.appendChild(path);
    });

    route.appendChild(svg);
    timelineShell.insertBefore(route, track);

    timelineNodes.forEach((node, index) => {
      const card = node.closest('.psx-timeline-card');
      const year = node.querySelector('.psx-year')?.textContent?.trim() || '';
      const title = node.querySelector('strong')?.textContent?.trim() || '';
      node.style.setProperty('--psx-station', String(index + 1));
      node.setAttribute('aria-label', [year, title].filter(Boolean).join(' - '));
      card?.style.setProperty('--psx-station', String(index + 1));
    });
  };

  upgradeJourneyMap();

  if (timelineNodes.length && timelineShell && !timelineDetail) {
    timelineDetail = document.createElement('article');
    timelineDetail.className = 'psx-timeline-detail';
    timelineDetail.dataset.timelineDetail = '';
    timelineDetail.setAttribute('aria-live', 'polite');
    timelineShell.appendChild(timelineDetail);
  }

  const fillTimelineDetail = (year, title, body) => {
    if (!timelineDetail) return;
    timelineDetail.textContent = '';

    const yearNode = document.createElement('span');
    yearNode.textContent = year;

    const titleNode = document.createElement('h3');
    titleNode.textContent = title;

    const bodyNode = document.createElement('p');
    bodyNode.textContent = body;

    timelineDetail.append(yearNode, titleNode, bodyNode);
  };

  const setTimelineDetail = (button) => {
    if (!timelineDetail || !button) return;
    const card = button.closest('.psx-timeline-card');
    const year = button.querySelector('.psx-year')?.textContent?.trim() || '';
    const title = button.querySelector('strong')?.textContent?.trim() || '';
    const body = card?.querySelector(':scope > p')?.textContent?.trim()
      || button.dataset.psxModalBody?.split(/\n{2,}/)[0]?.trim()
      || '';

    timelineNodes.forEach((node) => {
      const selected = node === button;
      node.classList.toggle('is-selected', selected);
      node.classList.toggle('is-active', selected);
      node.setAttribute('aria-expanded', String(selected));
      node.setAttribute('aria-pressed', String(selected));
    });

    if (card) {
      timelineShell.querySelectorAll('.psx-timeline-card').forEach((candidate) => {
        candidate.classList.toggle('is-selected', candidate === card);
      });
    }

    fillTimelineDetail(year, title, body);
  };

  timelineNodes.forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => setTimelineDetail(button));
  });

  if (timelineNodes[0]) setTimelineDetail(timelineNodes[0]);

  const setupMemoryAtlas = () => {
    const atlas = root.querySelector('.psx-memory-atlas');
    if (!atlas) return;

    const points = Array.from(atlas.querySelectorAll('[data-psx-map-point]'));
    const panels = Array.from(atlas.querySelectorAll('[data-psx-map-panel]'));
    const mapPins = points.filter((point) => point.closest('.psx-atlas-map'));
    const ledgerControls = points.filter((point) => point.closest('.psx-atlas-ledger'));

    if (!points.length || !panels.length) return;

    const selectPoint = (key) => {
      if (!key) return;

      points.forEach((point) => {
        const active = point.dataset.psxMapPoint === key;
        point.classList.toggle('is-selected', active);
        if (point.tagName === 'BUTTON') {
          point.setAttribute('aria-pressed', String(active));
          point.setAttribute('aria-current', active ? 'true' : 'false');
        }
      });

      panels.forEach((panel) => {
        panel.classList.toggle('is-selected', panel.dataset.psxMapPanel === key);
      });
    };

    mapPins.forEach((point) => {
      const key = point.dataset.psxMapPoint;
      if (!key) return;
      point.addEventListener('click', () => selectPoint(key));
      point.addEventListener('mouseenter', () => selectPoint(key));
      point.addEventListener('focus', () => selectPoint(key));
    });

    ledgerControls.forEach((point) => {
      const key = point.dataset.psxMapPoint;
      if (!key) return;
      point.addEventListener('click', () => selectPoint(key));
      point.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        selectPoint(key);
      });
    });

    selectPoint((mapPins[0] || ledgerControls[0] || points[0])?.dataset.psxMapPoint);
  };

  setupMemoryAtlas();

  root.querySelectorAll('.psx-chapter-drawer').forEach((drawer) => {
    drawer.addEventListener('toggle', () => {
      if (!drawer.open) return;
      root.querySelectorAll('.psx-chapter-drawer[open]').forEach((candidate) => {
        if (candidate !== drawer) candidate.open = false;
      });
    });
  });

  const rail = root.querySelector('[data-track-rail]');
  const prev = root.querySelector('[data-rail-prev]');
  const next = root.querySelector('[data-rail-next]');

  const railStep = () => {
    const firstCard = rail?.querySelector('.psx-track-card');
    return firstCard ? firstCard.getBoundingClientRect().width + 24 : 340;
  };

  const scrollRail = (direction) => {
    if (!rail) return;
    rail.scrollBy({
      left: direction * railStep(),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };

  prev?.addEventListener('click', () => scrollRail(-1));
  next?.addEventListener('click', () => scrollRail(1));

  rail?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    scrollRail(event.key === 'ArrowLeft' ? -1 : 1);
  });

  const setPanel = (button, panel, open) => {
    button.setAttribute('aria-expanded', String(open));
    if (panel) panel.hidden = !open;
  };

  root.querySelectorAll('[data-panel-toggle]').forEach((button) => {
    const panel = document.getElementById(button.dataset.panelToggle);
    if (!panel) return;

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      setPanel(button, panel, open);
    });
  });

  const sourceButtons = Array.from(root.querySelectorAll('[data-source-toggle]'));
  const sourcePanels = Array.from(root.querySelectorAll('.psx-source-detail[id]'));
  const sourceDrawer = root.querySelector('[data-source-drawer]');

  const closeSourcePanels = () => {
    sourcePanels.forEach((candidate) => {
      candidate.hidden = true;
    });
    sourceButtons.forEach((candidate) => {
      candidate.classList.remove('is-selected');
      candidate.setAttribute('aria-expanded', 'false');
    });
  };

  sourceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.sourceToggle;
      const panel = document.getElementById(`source-${key}`);
      if (!panel) return;
      const open = button.getAttribute('aria-expanded') !== 'true';

      closeSourcePanels();
      if (!open) return;

      panel.hidden = false;
      button.classList.add('is-selected');
      button.setAttribute('aria-expanded', 'true');

      if (sourceDrawer) {
        const drawerTop = sourceDrawer.getBoundingClientRect().top;
        const drawerVisible = drawerTop > 0 && drawerTop < window.innerHeight * 0.75;
        if (!drawerVisible) {
          sourceDrawer.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  let ticking = false;
  const updateScrollProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    document.documentElement.style.setProperty('--psx-scroll-progress', `${(progress * 100).toFixed(2)}%`);
    ticking = false;
  };

  const resetTransientUi = () => {
    document.documentElement.classList.remove('psx-modal-open');
    document.querySelectorAll('.psx-context-modal').forEach((modal) => {
      modal.hidden = true;
    });
    sourcePanels.forEach((panel) => {
      panel.hidden = true;
    });
    sourceButtons.forEach((button) => {
      button.classList.remove('is-selected');
      button.setAttribute('aria-expanded', 'false');
    });
    root.querySelectorAll('[data-panel-toggle]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
      const panel = document.getElementById(button.dataset.panelToggle);
      if (panel) panel.hidden = true;
    });
  };

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) resetTransientUi();
    updateScrollProgress();
  });

  window.addEventListener('scroll', () => {
    if (ticking || reducedMotion) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });

  updateScrollProgress();
})();
