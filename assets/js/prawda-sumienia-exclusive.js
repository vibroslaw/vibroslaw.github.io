(() => {
  const root = document.querySelector('[data-psx-page]');
  if (!root) return;

  root.classList.add('psx-js-ready');
  document.documentElement.classList.add('psx-js-ready');

  const lang = root.dataset.lang || document.documentElement.lang || 'en';
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event') || root.dataset.defaultEvent || '';
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

  const copyText = {
    en: {
      copied: 'QR link copied.',
      failed: 'Copy failed. Use the address bar link.'
    },
    pl: {
      copied: 'Link QR skopiowany.',
      failed: 'Nie udalo sie skopiowac. Uzyj linku z paska adresu.'
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
    const url = new URL(path, window.location.origin);
    if (eventId) url.searchParams.set('event', eventId);
    return `${url.pathname}${url.search}${url.hash}`;
  };

  root.querySelectorAll('[data-psx-link-type]').forEach((link) => {
    const type = link.dataset.psxLinkType;
    if (!routes[type]) return;
    link.setAttribute('href', buildEventUrl(routes[type]));
  });

  const finalActionCopy = {
    en: {
      participation: 'Participation Record'
    },
    pl: {
      participation: 'Zapis uczestnictwa'
    }
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

  if (eventId) {
    root.querySelectorAll('.psx-language-switch[href]').forEach((link) => {
      const url = new URL(link.getAttribute('href'), window.location.origin);
      url.searchParams.set('event', eventId);
      link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    });
  }

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
    en: {
      desktop: '/public/assets/events/rap-ort/syd2026/experience/sydney-event-lobby.webp'
    },
    pl: {
      desktop: '/public/assets/events/rap-ort/oswiecim20260525/experience/oswiecim-event-lobby.webp'
    }
  };

  const sharedHeroAssets = {
    desktop: '/public/assets/events/rap-ort/shared/experience/event-lobby-cinematic-hero.webp',
    mobile: '/public/assets/events/rap-ort/shared/experience/event-lobby-cinematic-mobile.webp'
  };

  const installHeroVisual = () => {
    const heroGrid = root.querySelector('.psx-hero-grid');
    const inscription = root.querySelector('.psx-hero-inscription');
    if (!heroGrid || !inscription || heroGrid.querySelector('.psx-hero-visual')) return;

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

  const findTimelineCard = (node) => node.closest('.psx-timeline-card');

  const updateTimelineDetail = (node) => {
    if (!timelineDetail || !node) return;
    const card = findTimelineCard(node);
    const year = node.querySelector('.psx-year')?.textContent?.trim() || '';
    const title = node.querySelector('strong')?.textContent?.trim() || '';
    const body = card?.querySelector('p')?.textContent?.trim() || '';
    const sourceLabels = Array.from(card?.querySelectorAll('.psx-source-chip') || [])
      .map((chip) => chip.textContent.trim())
      .filter(Boolean);

    timelineDetail.textContent = '';

    if (year) {
      const yearNode = document.createElement('span');
      yearNode.className = 'psx-year';
      yearNode.textContent = year;
      timelineDetail.appendChild(yearNode);
    }

    if (title) {
      const titleNode = document.createElement('h3');
      titleNode.textContent = title;
      timelineDetail.appendChild(titleNode);
    }

    if (body) {
      const bodyNode = document.createElement('p');
      bodyNode.textContent = body;
      timelineDetail.appendChild(bodyNode);
    }

    if (sourceLabels.length) {
      const sourceList = document.createElement('div');
      sourceList.className = 'psx-timeline-detail-sources';
      sourceLabels.forEach((label) => {
        const source = document.createElement('span');
        source.textContent = label;
        sourceList.appendChild(source);
      });
      timelineDetail.appendChild(sourceList);
    }
  };

  const activateTimelineNode = (node, shouldFocus = false) => {
    if (!node) return;
    timelineNodes.forEach((candidate) => {
      const active = candidate === node;
      candidate.classList.toggle('is-active', active);
      candidate.setAttribute('aria-pressed', String(active));
      findTimelineCard(candidate)?.classList.toggle('is-active', active);
    });
    updateTimelineDetail(node);
    if (shouldFocus) node.focus({ preventScroll: true });
  };

  timelineNodes.forEach((node, index) => {
    node.addEventListener('click', () => activateTimelineNode(node));

    node.addEventListener('keydown', (event) => {
      const key = event.key;
      if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        activateTimelineNode(node);
        return;
      }

      const forward = key === 'ArrowRight' || key === 'ArrowDown';
      const backward = key === 'ArrowLeft' || key === 'ArrowUp';
      if (!forward && !backward) return;

      event.preventDefault();
      const nextIndex = forward
        ? Math.min(timelineNodes.length - 1, index + 1)
        : Math.max(0, index - 1);
      activateTimelineNode(timelineNodes[nextIndex], true);
    });
  });

  activateTimelineNode(timelineNodes.find((node) => node.classList.contains('is-active')) || timelineNodes[0]);

  const rail = root.querySelector('[data-track-rail]');
  const prev = root.querySelector('[data-track-prev]');
  const next = root.querySelector('[data-track-next]');

  const railStep = () => Math.max(280, Math.round((rail?.clientWidth || 640) * 0.78));
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

  window.addEventListener('scroll', () => {
    if (ticking || reducedMotion) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });

  updateScrollProgress();
})();