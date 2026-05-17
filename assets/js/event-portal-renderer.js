(() => {
  const config = window.RapOrtEventPortals;
  if (!config?.portals) return;

  const strings = {
    pl: {
      kicker: 'PORTAL UCZESTNIKA',
      active: 'Aktywny portal',
      date: 'Data',
      location: 'Miejsce',
      open: 'Otwórz moduł',
      privacy: 'Prywatność',
      facilitator: 'Dla prowadzącego'
    },
    en: {
      kicker: 'PARTICIPANT PORTAL',
      active: 'Active portal',
      date: 'Date',
      location: 'Location',
      open: 'Open module',
      privacy: 'Privacy',
      facilitator: 'For facilitator'
    }
  };

  const safeId = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function pageLang(root) {
    return root?.dataset.lang === 'en' ? 'en' : 'pl';
  }

  function portalFor(id, lang) {
    const key = safeId(id) || config.defaultPortalId || 'default';
    const bucket = config.portals[key] || config.portals[config.defaultPortalId] || config.portals.default;
    return bucket?.[lang] || bucket?.en || bucket?.pl || null;
  }

  function activePortalId(root) {
    const fromDataset = safeId(root?.dataset.documentPack || document.body.dataset.documentPack);
    if (fromDataset && config.portals[fromDataset]) return fromDataset;

    const preset = safeId(root?.querySelector('[name="eventPreset"]')?.value);
    if (preset && config.portals[preset]) return preset;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = safeId(params.get('event') || params.get('key'));
    if (fromUrl && config.portals[fromUrl]) return fromUrl;

    return config.defaultPortalId || 'default';
  }

  function hrefWithActiveEvent(href, portalId) {
    if (!href || href.startsWith('#') || portalId === 'default') return href;
    if (href.includes('?event=') || href.includes('&event=')) return href;
    return `${href}${href.includes('?') ? '&' : '?'}event=${encodeURIComponent(portalId)}`;
  }

  function ensureSection(root) {
    let section = root.querySelector('[data-event-portal-section]');
    if (section) return section;

    section = document.createElement('section');
    section.className = 'vh-section event-portal-section';
    section.setAttribute('data-event-portal-section', '');
    section.setAttribute('aria-labelledby', 'event-portal-title');

    const access = root.querySelector('[data-access-flow-section]');
    const hero = root.querySelector('.vh-hero');
    if (access) access.insertAdjacentElement('beforebegin', section);
    else if (hero) hero.insertAdjacentElement('afterend', section);
    else root.prepend(section);
    return section;
  }

  function renderPortal(root, portal, lang) {
    const copy = strings[lang];
    const section = ensureSection(root);
    section.dataset.eventPortal = portal.id;

    section.innerHTML = `
      <div class="vh-wrap event-portal-wrap">
        <div class="event-portal-hero">
          <div>
            <p class="vh-kicker">${escapeHtml(copy.kicker)}</p>
            <h2 class="vh-section-title" id="event-portal-title">${escapeHtml(portal.title)}</h2>
            <p class="event-portal-subtitle">${escapeHtml(portal.subtitle)}</p>
            <p class="event-portal-description">${escapeHtml(portal.description)}</p>
            <p class="event-portal-active"><span>${escapeHtml(copy.active)}</span><strong>${escapeHtml(portal.label)}</strong></p>
          </div>
          <aside class="event-portal-meta" aria-label="${escapeHtml(copy.active)}">
            <div><span>${escapeHtml(copy.date)}</span><strong>${escapeHtml(portal.eventDate)}</strong></div>
            <div><span>${escapeHtml(copy.location)}</span><strong>${escapeHtml(portal.location)}</strong></div>
          </aside>
        </div>
        <div class="event-portal-map">
          ${portal.modules.map((module, index) => `
            <article class="event-portal-module event-portal-module-${escapeHtml(module.id)}">
              <span class="event-portal-step">${String(index + 1).padStart(2, '0')}</span>
              <p class="event-portal-module-label">${escapeHtml(module.label)}</p>
              <h3>${escapeHtml(module.title)}</h3>
              <p>${escapeHtml(module.description)}</p>
              <div class="event-portal-module-footer">
                <span>${escapeHtml(module.status)}</span>
                <a href="${escapeHtml(hrefWithActiveEvent(module.href, portal.id))}">${escapeHtml(copy.open)}</a>
              </div>
            </article>
          `).join('')}
        </div>
        <div class="event-portal-notes">
          <p><strong>${escapeHtml(copy.privacy)}:</strong> ${escapeHtml(portal.privacyNote)}</p>
          <p><strong>${escapeHtml(copy.facilitator)}:</strong> ${escapeHtml(portal.facilitatorNote)}</p>
        </div>
        <blockquote class="event-portal-closing">${escapeHtml(portal.closingLine)}</blockquote>
      </div>
    `;
  }

  function renderActive(root) {
    if (!root) return;
    const lang = pageLang(root);
    const portal = portalFor(activePortalId(root), lang);
    if (!portal) return;
    renderPortal(root, portal, lang);
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
