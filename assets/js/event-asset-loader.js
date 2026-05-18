(() => {
  const manifest = window.RapOrtEventAssets;
  if (!manifest) return;

  const root = document.querySelector('.event-shell-page, .pr-page, .wr-page');
  if (!root) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document.documentElement;

  function eventKey() {
    const explicit = root.dataset.event || document.body.dataset.event;
    if (explicit) return explicit;
    const params = new URLSearchParams(window.location.search);
    return params.get('event') || 'default';
  }

  function setCss(name, value) {
    if (!value) return;
    doc.style.setProperty(name, `url('${value}')`);
  }

  function loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }

  async function imageExists(path) {
    if (!path) return false;
    try {
      const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch (_) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = path;
      });
    }
  }

  async function firstExisting(paths) {
    const list = Array.isArray(paths) ? paths.filter(Boolean) : [paths].filter(Boolean);
    for (const path of list) {
      if (await imageExists(path)) return path;
    }
    return list[0] || '';
  }

  async function resolveAssets() {
    const key = eventKey();
    const eventAssets = manifest.events?.[key];
    const candidates = manifest.assetCandidates || {};
    const shared = manifest.shared || {};
    const procedural = manifest.procedural || {};

    const lobby = await firstExisting([eventAssets?.lobby, eventAssets?.fallbackLobby, ...(candidates.lobby || [shared.lobby, procedural.lobby])]);
    const lobbyMobile = await firstExisting([eventAssets?.lobbyMobile, eventAssets?.fallbackMobile, ...(candidates.lobbyMobile || [shared.lobbyMobile, procedural.lobbyMobile, lobby])]);
    const eventPass = await firstExisting(candidates.eventPass || [shared.eventPass, procedural.eventPass]);
    const witnessDesk = await firstExisting(candidates.witnessDesk || [shared.witnessDesk, procedural.witnessDesk]);
    const documentAtelier = await firstExisting(candidates.documentAtelier || [shared.documentAtelier, procedural.documentAtelier]);
    const memoryCase = await firstExisting(candidates.memoryCase || [shared.memoryCase, procedural.memoryCase]);
    const archiveEmpty = await firstExisting(candidates.archiveEmpty || [shared.archiveEmpty, procedural.archiveEmpty]);
    const finalRoom = await firstExisting(candidates.finalRoom || [shared.finalRoom, procedural.finalRoom]);

    setCss('--event-hero-image', lobby);
    setCss('--event-hero-mobile-image', lobbyMobile);
    setCss('--event-pass-image', eventPass);
    setCss('--event-shell-beam', shared.beam);
    setCss('--scene-witness-image', witnessDesk);
    setCss('--scene-document-image', documentAtelier);
    setCss('--scene-memory-image', memoryCase);
    setCss('--scene-archive-image', archiveEmpty);
    setCss('--scene-final-image', finalRoom);
    setCss('--gen-hero', lobby);
    setCss('--gen-document', documentAtelier);
    setCss('--gen-desk', witnessDesk);
    setCss('--gen-memory', memoryCase);
    setCss('--gen-archive', archiveEmpty);
    doc.classList.add('has-resolved-cinematic-assets');
  }

  async function markReadiness() {
    const required = manifest.requiredForWow || [];
    const procedural = manifest.requiredProcedural || [];
    const webpChecks = await Promise.all(required.map(async (path) => ({ path, ok: await imageExists(path) })));
    const proceduralChecks = await Promise.all(procedural.map(async (path) => ({ path, ok: await imageExists(path) })));
    const missingWebp = webpChecks.filter((item) => !item.ok).map((item) => item.path);
    const missingProcedural = proceduralChecks.filter((item) => !item.ok).map((item) => item.path);

    doc.classList.toggle('has-premium-assets', missingWebp.length === 0);
    doc.classList.toggle('has-missing-premium-assets', missingWebp.length > 0);
    doc.classList.toggle('has-procedural-cinematic-assets', missingProcedural.length === 0);
    doc.classList.toggle('has-missing-procedural-assets', missingProcedural.length > 0);

    if (missingWebp.length && window.console?.info) {
      console.info('Rap-Ort final WebP premium cinematic assets missing; procedural SVG fallbacks are used when available:', missingWebp);
    }
    if (missingProcedural.length && window.console?.warn) {
      console.warn('Rap-Ort procedural cinematic fallback assets missing:', missingProcedural);
    }
    root.dataset.missingPremiumAssets = String(missingWebp.length);
    root.dataset.missingProceduralAssets = String(missingProcedural.length);
  }

  function addAtmosphere() {
    if (reduceMotion || document.querySelector('[data-event-asset-atmosphere]')) return;
    const node = document.createElement('div');
    node.className = 'event-asset-atmosphere';
    node.setAttribute('data-event-asset-atmosphere', '');
    node.setAttribute('aria-hidden', 'true');
    document.body.appendChild(node);
  }

  function bootArtworkAudit() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('artworkAudit') !== '1') return;
    loadStylesheet('/assets/css/artwork-audit-panel.css');
    loadScript('/assets/js/artwork-audit-panel.js');
  }

  resolveAssets();
  addAtmosphere();
  markReadiness();
  bootArtworkAudit();
})();