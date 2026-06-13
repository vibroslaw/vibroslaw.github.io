(() => {
  const root = document.querySelector('[data-report-room]');
  if (!root) return;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  if (reducedMotion) root.classList.add('rr-reduced-motion');

  const safeParams = ['event', 'ref', 'utm_source', 'utm_medium', 'utm_campaign', 'screening'];
  const params = new URLSearchParams(window.location.search);
  root.querySelectorAll('.rr-language[href]').forEach((link) => {
    const url = new URL(link.getAttribute('href'), window.location.origin);
    safeParams.forEach((key) => {
      const value = params.get(key);
      if (value) url.searchParams.set(key, value);
    });
    if (window.location.hash) url.hash = window.location.hash;
    link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  });

  const reveal = Array.from(root.querySelectorAll('[data-rr-reveal]'));
  if (!('IntersectionObserver' in window) || reducedMotion) {
    reveal.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveal.forEach((item) => observer.observe(item));
  }
  window.setTimeout(() => reveal.forEach((item) => item.classList.add('is-visible')), 1100);

  const stationLinks = Array.from(root.querySelectorAll('[data-rr-station-link]'));
  const stations = Array.from(root.querySelectorAll('[data-rr-station][id]'));
  const setActiveStation = (id) => {
    stationLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.rrStationLink === id));
    root.dataset.rrActiveStation = id;
  };

  if ('IntersectionObserver' in window && stations.length) {
    const stationObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (visible?.target?.id) setActiveStation(visible.target.id);
    }, { rootMargin: '-35% 0px -52% 0px', threshold: 0.02 });
    stations.forEach((station) => stationObserver.observe(station));
  }
  if (stations[0]?.id) setActiveStation(stations[0].id);

  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    document.documentElement.style.setProperty('--rr-progress', `${progress.toFixed(2)}%`);
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => { updateProgress(); ticking = false; });
  }, { passive: true });
  updateProgress();

  const placeButtons = Array.from(root.querySelectorAll('[data-rr-place]'));
  const placePanels = Array.from(root.querySelectorAll('[data-rr-place-panel]'));
  const selectPlace = (id) => {
    placeButtons.forEach((button) => {
      const active = button.dataset.rrPlace === id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    placePanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.rrPlacePanel === id));
  };
  placeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    button.addEventListener('click', () => selectPlace(button.dataset.rrPlace));
    button.addEventListener('mouseenter', () => selectPlace(button.dataset.rrPlace));
    button.addEventListener('focus', () => selectPlace(button.dataset.rrPlace));
  });



  const setVisualMode = (mode) => {
    const chosen = mode === 'lite' ? 'lite' : 'cinematic';
    document.body.classList.toggle('rr-lite', chosen === 'lite');
    document.body.classList.toggle('rr-cinematic', chosen === 'cinematic');
    root.dataset.rrVisualMode = chosen;
    root.querySelectorAll('[data-rr-visual-mode]').forEach((button) => {
      const active = button.dataset.rrVisualMode === chosen;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { sessionStorage.setItem('rrVisualMode', chosen); } catch (_) {}
  };
  root.querySelectorAll('[data-rr-visual-mode]').forEach((button) => button.addEventListener('click', () => setVisualMode(button.dataset.rrVisualMode)));
  let visualMode = 'cinematic';
  try { visualMode = sessionStorage.getItem('rrVisualMode') || 'cinematic'; } catch (_) {}
  if (reducedMotion) visualMode = 'lite';
  setVisualMode(visualMode);

  const setMode = (mode) => {
    ['viewer', 'student', 'educator', 'researcher'].forEach((name) => root.classList.remove(`rr-mode-${name}`));
    root.classList.add(`rr-mode-${mode}`);
    root.querySelectorAll('[data-rr-mode]').forEach((button) => {
      const active = button.dataset.rrMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { sessionStorage.setItem('rrMode', mode); } catch (_) {}
  };
  root.querySelectorAll('[data-rr-mode]').forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.rrMode));
  });
  let storedMode = 'viewer';
  try { storedMode = sessionStorage.getItem('rrMode') || 'viewer'; } catch (_) {}
  setMode(storedMode);

  window.addEventListener('pageshow', () => {
    updateProgress();
    reveal.forEach((item) => item.classList.add('is-visible'));
  });
})();
