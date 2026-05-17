(() => {
  const config = window.RapOrtEventPortals;
  if (!config?.portals) return;

  const strings = {
    pl: { kicker: 'PORTAL UCZESTNIKA', active: 'Aktywny portal', open: 'Otwórz', prepared: 'Przygotowane', privacy: 'Prywatność', step: 'Krok' },
    en: { kicker: 'PARTICIPANT PORTAL', active: 'Active portal', open: 'Open', prepared: 'Prepared', privacy: 'Privacy', step: 'Step' }
  };

  const safeId = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function pageLang(root) { return root?.dataset.lang === 'en' ? 'en' : 'pl'; }

  function getPortal(id, lang) {
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

  function ensureSection(root) {
    let section = root.querySelector('[data-event-portal-section]');
    if (section) return section;
    section = document.createElement('section');
    section.className = 'vh-section event-portal-section';
    section.setAttribute('data-event-portal-section', '');
    section.setAttribute('aria-labelledby', 'event-portal-title');
    const access = root.querySelector('[data-access-flow-section]');
    const hero = root.querySelector('.vh-hero');
    if (access) access.insertAdjacentElement('afterend', section);
    else if (hero) hero.insertAdjacentElement('afterend', section);
    else root.prepend(section);
    return section;
  }

  function statusLabel(status, lang) {
    if (status === 'prepared') return strings[lang].prepared;
    return strings[lang].open;
  }

  function renderPortal(root, portal, lang) {
    const copy = strings[lang];
    const section = ensureSection(root);
    section.dataset.eventPortal = portal.id;
    section.innerHTML = `
      <div class="vh-wrap event-portal-wrap">
        <div class="event-portal-shell">
          <div class="event-portal-head">
            <p class="vh-kicker">${escapeHtml(copy.kicker)}</p>
            <h2 class="vh-section-title" id="event-portal-title">${escapeHtml(portal.title)}</h2>
            <p class="event-portal-subtitle">${escapeHtml(portal.subtitle)}</p>
            <p class="event-portal-description">${escapeHtml(portal.description)}</p>
            <div class="event-portal-meta">${portal.eventMeta.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
            <p class="event-portal-active"><span>${escapeHtml(copy.active)}</span><strong>${escapeHtml(portal.label)}</strong></p>
            <div class="event-portal-actions">
              <a class="vh-button" href="${escapeHtml(portal.primaryCta.href)}">${escapeHtml(portal.primaryCta.label)}</a>
              <a class="vh-button secondary" href="${escapeHtml(portal.secondaryCta.href)}">${escapeHtml(portal.secondaryCta.label)}</a>
            </div>
          </div>
          <div class="event-portal-journey" aria-label="${escapeHtml(portal.journeyTitle)}">
            <h3>${escapeHtml(portal.journeyTitle)}</h3>
            <ol>
              ${portal.journey.map((item, index) => `
                <li class="event-portal-step is-${escapeHtml(item.status || 'active')}">
                  <span class="event-portal-step-number">${index + 1}</span>
                  <div>
                    <p class="event-portal-step-status">${escapeHtml(statusLabel(item.status, lang))}</p>
                    <h4>${escapeHtml(item.label)}</h4>
                    <p>${escapeHtml(item.description)}</p>
                    <a href="${escapeHtml(item.href)}">${escapeHtml(copy.open)}</a>
                  </div>
                </li>
              `).join('')}
            </ol>
          </div>
        </div>
        <aside class="event-portal-privacy" aria-label="${escapeHtml(copy.privacy)}">
          <div>
            <p class="vh-kicker">${escapeHtml(copy.privacy)}</p>
            <h3>${escapeHtml(portal.privacyTitle)}</h3>
            <ul>${portal.privacy.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            <p class="event-portal-closing">${escapeHtml(portal.closingLine)}</p>
          </div>
        </aside>
      </div>
    `;
  }

  function renderActive(root) {
    if (!root) return;
    const lang = pageLang(root);
    const portal = getPortal(activePortalId(root), lang);
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
