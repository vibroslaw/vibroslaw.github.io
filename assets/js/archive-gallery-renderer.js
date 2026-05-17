(() => {
  const config = window.RapOrtArchiveGalleries;
  if (!config?.galleries) return;

  const strings = {
    pl: {
      kicker: 'ANONIMOWE ARCHIWUM',
      active: 'Aktywna galeria',
      open: 'Otwórz raport',
      placeholder: 'Placeholder',
      manifestNote: 'Manifest archiwum',
      unavailable: 'Materiał nie został jeszcze dodany'
    },
    en: {
      kicker: 'ANONYMOUS ARCHIVE',
      active: 'Active gallery',
      open: 'Open report',
      placeholder: 'Placeholder',
      manifestNote: 'Archive manifest',
      unavailable: 'Material has not been added yet'
    }
  };

  const safeId = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function pageLang(root) {
    return root?.dataset.lang === 'en' ? 'en' : 'pl';
  }

  function galleryFor(id, lang) {
    const key = safeId(id) || config.defaultGalleryId || 'default';
    const bucket = config.galleries[key] || config.galleries[config.defaultGalleryId] || config.galleries.default;
    return bucket?.[lang] || bucket?.en || bucket?.pl || null;
  }

  function activeGalleryId(root) {
    const fromDataset = safeId(root?.dataset.documentPack || document.body.dataset.documentPack);
    if (fromDataset && config.galleries[fromDataset]) return fromDataset;

    const preset = safeId(root?.querySelector('[name="eventPreset"]')?.value);
    if (preset && config.galleries[preset]) return preset;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = safeId(params.get('event') || params.get('key'));
    if (fromUrl && config.galleries[fromUrl]) return fromUrl;

    return config.defaultGalleryId || 'default';
  }

  function ensureSection(root) {
    let section = root.querySelector('[data-archive-gallery-section]');
    if (section) return section;

    section = document.createElement('section');
    section.id = 'archive-gallery';
    section.className = 'vh-section archive-gallery-section';
    section.setAttribute('data-archive-gallery-section', '');
    section.setAttribute('aria-labelledby', 'archive-gallery-title');

    const memory = root.querySelector('[data-memory-pack-section]');
    if (memory) memory.insertAdjacentElement('afterend', section);
    else root.appendChild(section);
    return section;
  }

  function fileUrl(gallery, item) {
    if (!item?.file) return '';
    if (/^https?:\/\//.test(item.file) || item.file.startsWith('/')) return item.file;
    return `${gallery.archiveRoot}${item.file}`;
  }

  function normaliseItems(gallery, manifest) {
    const manifestItems = Array.isArray(manifest?.items) ? manifest.items.filter((item) => item.visible !== false) : [];
    return manifestItems.length ? manifestItems : gallery.items;
  }

  async function loadManifest(gallery) {
    if (!gallery.manifestPath) return null;
    try {
      const response = await fetch(gallery.manifestPath, { cache: 'no-store' });
      if (!response.ok) return null;
      return await response.json();
    } catch (_) {
      return null;
    }
  }

  function renderItem(gallery, item, copy) {
    const url = fileUrl(gallery, item);
    const isPlaceholder = item.type === 'placeholder' || !url;
    return `
      <article class="archive-gallery-card ${isPlaceholder ? 'is-placeholder' : ''}">
        <div class="archive-gallery-thumb" aria-hidden="true">
          ${url && !isPlaceholder ? `<img src="${escapeHtml(url)}" alt="" loading="lazy">` : `<span>${escapeHtml(copy.placeholder)}</span>`}
        </div>
        <div class="archive-gallery-card-body">
          <p class="archive-gallery-card-type">${escapeHtml(item.type || copy.placeholder)}</p>
          <h3>${escapeHtml(item.title || item.id || copy.unavailable)}</h3>
          <p>${escapeHtml(item.description || '')}</p>
          ${item.date ? `<p class="archive-gallery-date">${escapeHtml(item.date)}</p>` : ''}
          ${url && !isPlaceholder ? `<a class="archive-gallery-action" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(copy.open)}</a>` : `<button class="archive-gallery-action is-disabled" type="button" disabled>${escapeHtml(copy.unavailable)}</button>`}
        </div>
      </article>
    `;
  }

  function renderGallery(root, gallery, lang, manifest) {
    const copy = strings[lang];
    const section = ensureSection(root);
    const items = normaliseItems(gallery, manifest);
    section.dataset.archiveGallery = gallery.id;
    section.innerHTML = `
      <div class="vh-wrap archive-gallery-wrap">
        <div class="archive-gallery-head">
          <p class="vh-kicker">${escapeHtml(copy.kicker)}</p>
          <h2 class="vh-section-title" id="archive-gallery-title">${escapeHtml(gallery.title)}</h2>
          <p class="archive-gallery-subtitle">${escapeHtml(gallery.subtitle)}</p>
          <p class="archive-gallery-description">${escapeHtml(gallery.description)}</p>
          <p class="archive-gallery-active"><span>${escapeHtml(copy.active)}</span><strong>${escapeHtml(gallery.label)}</strong></p>
        </div>
        <div class="archive-gallery-privacy">
          <strong>${escapeHtml(gallery.privacyTitle)}</strong>
          <p>${escapeHtml(gallery.privacyText)}</p>
        </div>
        <div class="archive-gallery-grid">
          ${items.map((item) => renderItem(gallery, item, copy)).join('')}
        </div>
        <div class="archive-gallery-empty-note">
          <strong>${escapeHtml(gallery.emptyTitle)}</strong>
          <p>${escapeHtml(gallery.emptyText)}</p>
          <small>${escapeHtml(copy.manifestNote)}: ${escapeHtml(gallery.manifestPath)}</small>
        </div>
      </div>
    `;
  }

  async function renderActive(root) {
    if (!root) return;
    const lang = pageLang(root);
    const gallery = galleryFor(activeGalleryId(root), lang);
    if (!gallery) return;
    const manifest = await loadManifest(gallery);
    renderGallery(root, gallery, lang, manifest);
  }

  function boot() {
    const root = document.querySelector('[data-participation-record]');
    if (!root) return;
    let timer = null;
    const scheduleRender = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => renderActive(root), 0);
    };
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
