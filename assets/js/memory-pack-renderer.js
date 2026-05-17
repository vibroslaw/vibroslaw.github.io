(() => {
  const config = window.RapOrtMemoryPacks;
  if (!config?.packs) return;

  const strings = {
    pl: {
      kicker: 'PAKIET UCZESTNIKA',
      active: 'Aktywny pakiet',
      format: 'Format',
      recommended: 'Zastosowanie',
      open: 'Otwórz / pobierz',
      generate: 'Utwórz dokument',
      checking: 'Sprawdzanie materiału',
      comingSoon: 'Materiał w przygotowaniu',
      prepared: 'Przygotowane dla wersji wydarzenia',
      unavailable: 'Asset coming soon'
    },
    en: {
      kicker: 'MEMORY PACK',
      active: 'Active pack',
      format: 'Format',
      recommended: 'Recommended use',
      open: 'Open / download',
      generate: 'Create document',
      checking: 'Checking material',
      comingSoon: 'Asset coming soon',
      prepared: 'Prepared for event edition',
      unavailable: 'Asset coming soon'
    }
  };

  function pageLang(root) {
    return root?.dataset.lang === 'en' ? 'en' : 'pl';
  }

  function safeId(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function getMemoryPack(id, lang) {
    const key = safeId(id) || config.defaultPackId || 'default';
    const bucket = config.packs[key] || config.packs[config.defaultPackId] || config.packs.default;
    return bucket?.[lang] || bucket?.en || bucket?.pl || null;
  }

  function activePackId(root) {
    const fromDataset = safeId(root?.dataset.documentPack || document.body.dataset.documentPack);
    if (fromDataset && config.packs[fromDataset]) return fromDataset;

    const preset = safeId(root?.querySelector('[name="eventPreset"]')?.value);
    if (preset && config.packs[preset]) return preset;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = safeId(params.get('event') || params.get('key'));
    if (fromUrl && config.packs[fromUrl]) return fromUrl;

    return config.defaultPackId || 'default';
  }

  function typeLabel(type) {
    return String(type || '').replace(/-/g, ' ');
  }

  function ensureSection(root) {
    let section = root.querySelector('[data-memory-pack-section]');
    if (section) return section;

    section = document.createElement('section');
    section.className = 'vh-section memory-pack-section';
    section.setAttribute('data-memory-pack-section', '');
    section.setAttribute('aria-labelledby', 'memory-pack-title');

    const generator = root.querySelector('#generator');
    if (generator) generator.insertAdjacentElement('afterend', section);
    else root.appendChild(section);
    return section;
  }

  function renderAction(item, lang) {
    const copy = strings[lang];
    if (item.path?.startsWith('#')) {
      return `<a class="memory-pack-action" href="${escapeHtml(item.path)}">${escapeHtml(copy.generate)}</a>`;
    }
    if (item.path && !item.fallback) {
      return `<span class="memory-pack-action is-pending" data-memory-pack-asset data-path="${escapeHtml(item.path)}" data-label="${escapeHtml(item.label)}">${escapeHtml(copy.checking)}</span>`;
    }
    return `<button class="memory-pack-action is-disabled" type="button" disabled>${escapeHtml(copy.comingSoon)}</button>`;
  }

  function renderPack(root, pack, lang) {
    const copy = strings[lang];
    const section = ensureSection(root);
    section.dataset.memoryPack = pack.id;

    section.innerHTML = `
      <div class="vh-wrap memory-pack-wrap">
        <div class="memory-pack-head">
          <p class="vh-kicker">${escapeHtml(copy.kicker)}</p>
          <h2 class="vh-section-title" id="memory-pack-title">${escapeHtml(pack.title)}</h2>
          <p class="memory-pack-subtitle">${escapeHtml(pack.subtitle)}</p>
          <p class="memory-pack-description">${escapeHtml(pack.description)}</p>
          <p class="memory-pack-active-badge"><span>${escapeHtml(copy.active)}</span><strong>${escapeHtml(pack.label)}</strong></p>
        </div>
        <div class="memory-pack-grid">
          ${pack.items.map((item) => `
            <article class="memory-pack-card memory-pack-type-${escapeHtml(item.type)}" data-memory-pack-item="${escapeHtml(item.id)}">
              <div class="memory-pack-card-preview" aria-hidden="true">
                <span>${escapeHtml(typeLabel(item.type))}</span>
              </div>
              <div class="memory-pack-card-body">
                <p class="memory-pack-card-type">${escapeHtml(typeLabel(item.type))}</p>
                <h3>${escapeHtml(item.label)}</h3>
                <p>${escapeHtml(item.description)}</p>
                <dl>
                  <div><dt>${escapeHtml(copy.format)}</dt><dd>${escapeHtml(item.format)}</dd></div>
                  <div><dt>${escapeHtml(copy.recommended)}</dt><dd>${escapeHtml(item.recommendedUse)}</dd></div>
                </dl>
                ${renderAction(item, lang)}
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    hydrateAssetActions(section, lang);
  }

  async function assetExists(path) {
    if (!path || path.startsWith('#')) return true;
    try {
      const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch (_) {
      try {
        const response = await fetch(path, { method: 'GET', cache: 'no-store' });
        return response.ok;
      } catch (error) {
        return false;
      }
    }
  }

  function disabledAsset(copy) {
    const button = document.createElement('button');
    button.className = 'memory-pack-action is-disabled';
    button.type = 'button';
    button.disabled = true;
    button.textContent = copy.comingSoon;
    return button;
  }

  async function hydrateAssetActions(section, lang) {
    const copy = strings[lang];
    const nodes = [...section.querySelectorAll('[data-memory-pack-asset]')];
    await Promise.all(nodes.map(async (node) => {
      const path = node.dataset.path || '';
      const label = node.dataset.label || '';
      const exists = await assetExists(path);
      if (!node.isConnected) return;
      if (!exists) {
        node.replaceWith(disabledAsset(copy));
        return;
      }

      const link = document.createElement('a');
      link.className = 'memory-pack-action';
      link.href = path;
      link.textContent = copy.open;
      link.setAttribute('aria-label', `${copy.open}: ${label}`);
      link.setAttribute('download', '');
      node.replaceWith(link);
    }));
  }

  function renderActive(root) {
    if (!root) return;
    const lang = pageLang(root);
    const pack = getMemoryPack(activePackId(root), lang);
    if (!pack) return;
    renderPack(root, pack, lang);
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
