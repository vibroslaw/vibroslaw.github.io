(() => {
  const config = window.RapOrtAccessFlows;
  if (!config?.flows) return;

  const strings = {
    pl: {
      kicker: 'DOSTĘP WYDARZENIA',
      active: 'Aktywny dostęp',
      copy: 'Kopiuj link',
      copied: 'Link skopiowany.',
      copyFailed: 'Nie udało się skopiować automatycznie. Zaznacz link ręcznie.',
      share: 'Udostępnij',
      shareFallback: 'Udostępnianie systemowe nie jest dostępne. Skopiuj link.',
      open: 'Otwórz generator',
      memory: 'Przejdź do Pakietu Uczestnika',
      witness: 'Raport Świadka',
      qr: 'QR-ready link',
      code: 'Kod wydarzenia',
      steps: 'Ścieżka uczestnika',
      note: 'Uwaga',
      linkLabel: 'Link dostępu'
    },
    en: {
      kicker: 'EVENT ACCESS',
      active: 'Active access',
      copy: 'Copy link',
      copied: 'Link copied.',
      copyFailed: 'Could not copy automatically. Select the link manually.',
      share: 'Share',
      shareFallback: 'System sharing is not available. Copy the link instead.',
      open: 'Open generator',
      memory: 'Go to Memory Pack',
      witness: 'Witness Report',
      qr: 'QR-ready link',
      code: 'Event code',
      steps: 'Participant path',
      note: 'Note',
      linkLabel: 'Access link'
    }
  };

  const safeId = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function pageLang(root) {
    return root?.dataset.lang === 'en' ? 'en' : 'pl';
  }

  function absoluteUrl(path) {
    return new URL(path || '/', window.location.origin).href;
  }

  function getFlow(id, lang) {
    const key = safeId(id) || config.defaultFlowId || 'default';
    const bucket = config.flows[key] || config.flows[config.defaultFlowId] || config.flows.default;
    return bucket?.[lang] || bucket?.en || bucket?.pl || null;
  }

  function activeFlowId(root) {
    const fromDataset = safeId(root?.dataset.documentPack || document.body.dataset.documentPack);
    if (fromDataset && config.flows[fromDataset]) return fromDataset;

    const preset = safeId(root?.querySelector('[name="eventPreset"]')?.value);
    if (preset && config.flows[preset]) return preset;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = safeId(params.get('event') || params.get('key'));
    if (fromUrl && config.flows[fromUrl]) return fromUrl;

    return config.defaultFlowId || 'default';
  }

  function ensureSection(root) {
    let section = root.querySelector('[data-access-flow-section]');
    if (section) return section;

    section = document.createElement('section');
    section.className = 'vh-section access-flow-section';
    section.setAttribute('data-access-flow-section', '');
    section.setAttribute('aria-labelledby', 'access-flow-title');

    const generator = root.querySelector('#generator');
    if (generator) generator.insertAdjacentElement('beforebegin', section);
    else root.prepend(section);
    return section;
  }

  function qrPattern(url) {
    let hash = 0;
    for (let i = 0; i < url.length; i += 1) hash = (hash * 31 + url.charCodeAt(i)) >>> 0;
    return Array.from({ length: 49 }, (_, index) => ((hash >> (index % 24)) + index + url.length) % 3 === 0);
  }

  function renderPseudoQr(url) {
    const cells = qrPattern(url);
    return `<div class="access-flow-qr" aria-hidden="true">${cells.map((active) => `<span class="${active ? 'is-dark' : ''}"></span>`).join('')}</div>`;
  }

  function renderSection(root, flow, lang) {
    const copy = strings[lang];
    const section = ensureSection(root);
    const participantUrl = absoluteUrl(flow.participantUrl);
    const witnessUrl = flow.witnessUrl ? absoluteUrl(flow.witnessUrl) : '';
    section.dataset.accessFlow = flow.id;
    section.innerHTML = `
      <div class="vh-wrap access-flow-wrap">
        <div class="access-flow-head">
          <p class="vh-kicker">${escapeHtml(copy.kicker)}</p>
          <h2 class="vh-section-title" id="access-flow-title">${escapeHtml(flow.eventTitle)}</h2>
          <p class="access-flow-subtitle">${escapeHtml(flow.eventSubtitle)}</p>
          <p class="access-flow-active"><span>${escapeHtml(copy.active)}</span><strong>${escapeHtml(flow.label)}</strong></p>
        </div>
        <div class="access-flow-grid">
          <article class="access-flow-card access-flow-card-main">
            <div class="access-flow-meta">
              <span>${escapeHtml(flow.dateLabel)}</span>
              <strong>${escapeHtml(flow.location)}</strong>
            </div>
            <label class="access-flow-link-label" for="access-flow-url">${escapeHtml(copy.linkLabel)}</label>
            <div class="access-flow-link-row">
              <input id="access-flow-url" data-access-flow-url readonly value="${escapeHtml(participantUrl)}">
              <button class="vh-button secondary" type="button" data-access-copy>${escapeHtml(copy.copy)}</button>
            </div>
            <div class="access-flow-actions">
              <a class="vh-button" href="${escapeHtml(flow.participantUrl)}">${escapeHtml(copy.open)}</a>
              <a class="vh-button secondary" href="${escapeHtml(flow.memoryAnchor)}">${escapeHtml(copy.memory)}</a>
              ${witnessUrl ? `<a class="vh-button secondary" href="${escapeHtml(flow.witnessUrl)}">${escapeHtml(copy.witness)}</a>` : ''}
              <button class="vh-button secondary" type="button" data-access-share>${escapeHtml(copy.share)}</button>
            </div>
            <p class="access-flow-status" data-access-status aria-live="polite"></p>
          </article>
          <article class="access-flow-card access-flow-qr-card">
            <p class="access-flow-card-kicker">${escapeHtml(copy.qr)}</p>
            ${renderPseudoQr(participantUrl)}
            <p class="access-flow-code"><span>${escapeHtml(copy.code)}</span><strong>${escapeHtml(flow.accessCode)}</strong></p>
          </article>
          <article class="access-flow-card access-flow-steps-card">
            <p class="access-flow-card-kicker">${escapeHtml(copy.steps)}</p>
            <ol>${flow.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
            <p class="access-flow-note"><strong>${escapeHtml(copy.note)}:</strong> ${escapeHtml(flow.note)}</p>
          </article>
        </div>
      </div>
    `;
  }

  async function copyLink(section, lang) {
    const copy = strings[lang];
    const input = section.querySelector('[data-access-flow-url]');
    const status = section.querySelector('[data-access-status]');
    const value = input?.value || '';
    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = copy.copied;
    } catch (_) {
      input?.select();
      if (status) status.textContent = copy.copyFailed;
    }
  }

  async function shareLink(section, flow, lang) {
    const copy = strings[lang];
    const status = section.querySelector('[data-access-status]');
    const url = section.querySelector('[data-access-flow-url]')?.value || absoluteUrl(flow.participantUrl);
    if (!navigator.share) {
      if (status) status.textContent = copy.shareFallback;
      return;
    }
    try {
      await navigator.share({ title: flow.eventTitle, text: flow.eventSubtitle, url });
    } catch (_) {}
  }

  function renderActive(root) {
    if (!root) return;
    const lang = pageLang(root);
    const flow = getFlow(activeFlowId(root), lang);
    if (!flow) return;
    renderSection(root, flow, lang);
  }

  function boot() {
    const root = document.querySelector('[data-participation-record]');
    if (!root) return;
    const scheduleRender = () => window.setTimeout(() => renderActive(root), 0);
    scheduleRender();

    root.addEventListener('change', (event) => {
      if (event.target?.matches('[name="eventPreset"]')) scheduleRender();
    }, true);

    root.addEventListener('click', (event) => {
      const section = event.target?.closest('[data-access-flow-section]');
      if (section) {
        const lang = pageLang(root);
        const flow = getFlow(activeFlowId(root), lang);
        if (event.target.closest('[data-access-copy]')) copyLink(section, lang);
        if (event.target.closest('[data-access-share]')) shareLink(section, flow, lang);
        return;
      }
      if (event.target?.closest('[data-pr-unlock], [data-pr-clear], [data-pr-regenerate]')) scheduleRender();
    }, true);

    document.addEventListener('raport:participation-updated', scheduleRender);
    const observer = new MutationObserver(scheduleRender);
    observer.observe(root, { attributes: true, attributeFilter: ['data-document-pack'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-document-pack'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
