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

  function applyEventAssets() {
    const key = eventKey();
    const eventAssets = manifest.events?.[key];
    const shared = manifest.shared || {};
    setCss('--event-hero-image', eventAssets?.lobby || shared.lobby);
    setCss('--event-hero-mobile-image', eventAssets?.lobbyMobile || eventAssets?.lobby || shared.lobbyMobile || shared.lobby);
    setCss('--event-pass-image', shared.eventPass);
    setCss('--event-shell-beam', shared.beam);
    setCss('--scene-witness-image', shared.witnessDesk);
    setCss('--scene-document-image', shared.documentAtelier);
    setCss('--scene-memory-image', shared.memoryCase);
    setCss('--scene-archive-image', shared.archiveEmpty || shared.archiveWall);
    setCss('--scene-final-image', shared.finalRoom);
    setCss('--gen-document', shared.documentAtelier);
    setCss('--gen-desk', shared.witnessDesk);
    setCss('--gen-memory', shared.memoryCase);
    setCss('--gen-archive', shared.archiveEmpty || shared.archiveWall);
  }

  async function markReadiness() {
    const required = manifest.requiredForWow || [];
    const checks = await Promise.all(required.map(async (path) => ({ path, ok: await imageExists(path) })));
    const missing = checks.filter((item) => !item.ok).map((item) => item.path);
    doc.classList.toggle('has-premium-assets', missing.length === 0);
    doc.classList.toggle('has-missing-premium-assets', missing.length > 0);
    if (missing.length) {
      root.dataset.missingPremiumAssets = String(missing.length);
      if (window.console?.info) console.info('Rap-Ort premium cinematic assets missing:', missing);
    }
  }

  function addAtmosphere() {
    if (reduceMotion || document.querySelector('[data-event-asset-atmosphere]')) return;
    const node = document.createElement('div');
    node.className = 'event-asset-atmosphere';
    node.setAttribute('data-event-asset-atmosphere', '');
    node.setAttribute('aria-hidden', 'true');
    document.body.appendChild(node);
  }

  applyEventAssets();
  addAtmosphere();
  markReadiness();
})();
