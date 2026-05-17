(() => {
  const config = window.RapOrtArchiveGalleries;
  if (!config?.galleries) return;

  const strings = {
    pl: { kicker: 'ANONIMOWE ARCHIWUM', active: 'Aktywne archiwum', loading: 'Sprawdzam manifest archiwum…', empty: 'Brak opublikowanych elementów', open: 'Otwórz ślad', placeholder: 'Placeholder', principles: 'Zasady', process: 'Proces', manifestMissing: 'Manifest nie jest jeszcze opublikowany.' },
    en: { kicker: 'ANONYMOUS ARCHIVE', active: 'Active archive', loading: 'Checking archive manifest…', empty: 'No published items yet', open: 'Open trace', placeholder: 'Placeholder', principles: 'Principles', process: 'Process', manifestMissing: 'Manifest is not published yet.' }
  };

  const safeId = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function pageLang(root) { return root?.dataset.lang === 'en' ? 'en' : 'pl'; }

  function getArchive(id, lang) {
    const key = safeId(id) || config.defaultArchiveId || 'default';
    const bucket = config.galleries[key] || config.galleries[config.defaultArchiveId] || config.galleries.default;
    return bucket?.[lang] || bucket?.en || bucket?.pl || null;
  }

  function activeArchiveId(root) {
    const fromDataset = safeId(root?.dataset.documentPack || document.body.dataset.documentPack);
    if (fromDataset && config.galleries[fromDataset]) return fromDataset;
    const preset = safeId(root?.querySelector('[name="eventPreset"]')?.value);
    if (preset && config.galleries[preset]) return preset;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = safeId(params.get('event') || params.get('key'));
    if (fromUrl && config.galleries[fromUrl]) return fromUrl;
    return config.defaultArchiveId || 'default';
  }

  function ensureSection(root) {
    let section = root.querySelector('[data-archive-gallery-section]');
    if (section) return section;
    section = document.createElement('section');
    section.className = 'vh-section archive-gallery-section';
    section.id = 'archive-gallery';
    section.setAttribute('data-archive-gallery-section', '');
    section.setAttribute('aria-labelledby', 'archive-gallery-title');
    const memory = root.querySelector('[data-memory-pack-section]');
    const generator = root.querySelector('#generator');
    if (memory) memory.insertAdjacentElement('afterend', section);
    else if (generator) generator.insertAdjacentElement('afterend', section);
    else root.appendChild(section);
    return section;
  }

  async function loadManifest(path) {
    if (!path) return null;
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) return null;
      return response.json();
    } catch (_) {
      return null;
    }
  }

  function normaliseItems(manifest, archive) {
    const raw = Array.isArray(manifest?.items) ? manifest.items : [];
    return raw.filter((item) => item?.visible !== false).map((item, index) => ({
      id: item.id || item.file || `archive-${index + 1}`,
      label: item.label || item.title || `Anonymous trace ${index + 1}`,
      meta: item.date || item.meta || archive.label,
      file: item.file ? `${archive.archiveRoot}${item.file}` : item.url || '',
      state: 'published'
    }));
  }

  function itemCard(item, archive, copy) {
    const isPublished = item.state === 'published' && item.file;
    const preview = isPublished
      ? `<img src="${escapeHtml(item.file)}" alt="${escapeHtml(item.label)}" loading="lazy">`
      : `<div class="archive-gallery-placeholder-mark"><span>${escapeHtml(copy.placeholder)}</span></div>`;
    const action = isPublished
      ? `<a class="archive-gallery-action" href="${escapeHtml(item.file)}" target="_blank" rel="noopener">${escapeHtml(copy.open)}</a>`
      : `<span class="archive-gallery-action is-disabled">${escapeHtml(copy.placeholder)}</span>`;
    return `
      <article class="archive-gallery-card is-${escapeHtml(item.state || 'placeholder')}">
        <div class="archive-gallery-preview">${preview}</div>
        <div class="archive-gallery-card-body">
          <p>${escapeHtml(item.meta || archive.label)}</p>
          <h3>${escapeHtml(item.label)}</h3>
          ${action}
        </div>
      </article>
    `;
  }

  function renderShell(section, archive, lang, stateHtml) {
    const copy = strings[lang];
    section.dataset.archiveGallery = archive.id;
    section.innerHTML = `
      <div class="vh-wrap archive-gallery-wrap">
        <div class="archive-gallery-head">
          <p class="vh-kicker">${escapeHtml(copy.kicker)}</p>
          <h2 class="vh-section-title" id="archive-gallery-title">${escapeHtml(archive.title)}</h2>
          <p class="archive-gallery-subtitle">${escapeHtml(archive.subtitle)}</p>
          <p class="archive-gallery-description">${escapeHtml(archive.description)}</p>
          <p class="archive-gallery-active"><span>${escapeHtml(copy.active)}</span><strong>${escapeHtml(archive.label)}</strong></p>
        </div>
        ${stateHtml}
        <div class="archive-gallery-info-grid">
          <article class="archive-gallery-info-card">
            <p class="archive-gallery-info-kicker">${escapeHtml(copy.principles)}</p>
            <h3>${escapeHtml(archive.privacyTitle)}</h3>
            <ul>${archive.privacy.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </article>
          <article class="archive-gallery-info-card">
            <p class="archive-gallery-info-kicker">${escapeHtml(copy.process)}</p>
            <h3>${escapeHtml(archive.manualAddTitle)}</h3>
            <ol>${archive.manualAddSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
          </article>
        </div>
      </div>
    `;
  }

  async function renderArchive(root, archive, lang) {
    const section = ensureSection(root);
    const copy = strings[lang];
    renderShell(section, archive, lang, `<p class="archive-gallery-loading">${escapeHtml(copy.loading)}</p>`);
    const manifest = await loadManifest(archive.manifestPath);
    const published = normaliseItems(manifest, archive);
    const items = published.length ? published : archive.placeholderItems;
    const note = published.length
      ? ''
      : `<div class="archive-gallery-empty"><h3>${escapeHtml(archive.emptyTitle)}</h3><p>${escapeHtml(archive.emptyDescription)}</p><p>${escapeHtml(copy.manifestMissing)}</p></div>`;
    const grid = `<div class="archive-gallery-grid">${items.map((item) => itemCard(item, archive, copy)).join('')}</div>`;
    renderShell(section, archive, lang, `${note}${grid}`);
  }

  function renderActive(root) {
    if (!root) return;
    const lang = pageLang(root);
    const archive = getArchive(activeArchiveId(root), lang);
    if (!archive) return;
    renderArchive(root, archive, lang);
  }

  function boot() {
    const root = document.querySelector('[data-participation-record]');
    if (!root) return;
    const scheduleRender = () => window.setTimeout(() => renderActive(root), 0);
    scheduleRender();
    root.addEventListener('change', (event) => { if (event.target?.matches('[name="eventPreset"]')) scheduleRender(); }, true);
    root.addEventListener('click', (event) => { if (event.target?.closest('[data-pr-unlock], [data-pr-clear], [data-pr-regenerate]')) scheduleRender(); }, true);
    document.addEventListener('raport:participation-updated', scheduleRender);
    const observer = new MutationObserver(scheduleRender);
    observer.observe(root, { attributes: true, attributeFilter: ['data-document-pack'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-document-pack'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
