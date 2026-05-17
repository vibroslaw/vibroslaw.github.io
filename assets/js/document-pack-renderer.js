(() => {
  const config = window.RapOrtDocumentPacks;
  if (!config?.packs) return;

  const safeId = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

  function pageLang(root) {
    return root?.dataset.lang === 'en' ? 'en' : 'pl';
  }

  function getPack(eventId, lang = document.documentElement.lang === 'en' ? 'en' : 'pl') {
    const id = safeId(eventId) || config.defaultPackId || 'default';
    const bucket = config.packs[id] || config.packs[config.defaultPackId] || config.packs.default;
    return bucket?.[lang] || bucket?.en || bucket?.pl || null;
  }

  function getActiveEventId(root) {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = safeId(params.get('event') || params.get('key'));
    if (fromUrl && config.packs[fromUrl]) return fromUrl;
    const generator = root?.querySelector('[data-pr-generator]');
    if (generator?.hidden) return config.defaultPackId || 'default';
    const preset = root?.querySelector('[name="eventPreset"]');
    const fromPreset = safeId(preset?.value);
    if (fromPreset && config.packs[fromPreset]) return fromPreset;
    return config.defaultPackId || 'default';
  }

  function availableEventIds() {
    return Object.keys(config.packs || {}).filter((id) => id !== (config.defaultPackId || 'default'));
  }

  function ensurePresetOptions(root, lang) {
    const preset = root?.querySelector('[name="eventPreset"]');
    if (!preset) return;

    availableEventIds().forEach((id) => {
      if ([...preset.options].some((option) => option.value === id)) return;
      const pack = getPack(id, lang);
      if (!pack) return;
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${pack.label} — ${pack.dateLabel}`;
      const customOption = [...preset.options].find((item) => item.value === 'custom');
      preset.insertBefore(option, customOption || null);
    });
  }

  function ensurePackBadge(root) {
    const generator = root?.querySelector('[data-pr-generator]');
    if (!generator) return null;
    let badge = generator.querySelector('[data-document-pack-badge]');
    if (badge) return badge;
    badge = document.createElement('div');
    badge.className = 'document-pack-badge';
    badge.setAttribute('data-document-pack-badge', '');
    badge.setAttribute('aria-live', 'polite');
    const eventBadge = generator.querySelector('[data-pr-event-badge]');
    if (eventBadge) eventBadge.insertAdjacentElement('afterend', badge);
    else generator.prepend(badge);
    return badge;
  }

  function ensureTextNode(container, selector, className, attr) {
    if (!container) return null;
    let node = container.querySelector(selector);
    if (node) return node;
    const content = container.querySelector('.pr-document-content, .pr-print-content');
    if (!content) return null;
    node = document.createElement('p');
    node.className = className;
    node.setAttribute(attr, '');
    content.appendChild(node);
    return node;
  }

  function removePackClasses(node) {
    if (!node) return;
    [...node.classList].forEach((name) => {
      if (name.startsWith('pack-background-') || name.startsWith('pack-plate-') || name.startsWith('pack-accent-')) {
        node.classList.remove(name);
      }
    });
  }

  function applyPackClasses(node, pack) {
    if (!node || !pack) return;
    removePackClasses(node);
    node.classList.add('document-pack-active', pack.backgroundClass, pack.plateClass, pack.accentClass);
    node.dataset.documentPack = pack.id;
    node.dataset.documentPackAccess = pack.accessMode;
  }

  function applyDocumentText(container, pack) {
    if (!container || !pack) return;
    applyPackClasses(container, pack);

    const project = container.querySelector('[data-pr-project]');
    const title = container.querySelector('[data-pr-title]');
    const titlePlate = ensureTextNode(container, '[data-document-pack-title-plate]', 'document-pack-title-plate', 'data-document-pack-title-plate');
    const footer = ensureTextNode(container, '[data-document-pack-footer]', 'document-pack-footer-line', 'data-document-pack-footer');
    const watermark = ensureTextNode(container, '[data-document-pack-watermark]', 'document-pack-watermark', 'data-document-pack-watermark');

    if (project) project.textContent = pack.eventTitle;
    if (title) title.textContent = pack.documentTitle;
    if (titlePlate) titlePlate.textContent = pack.documentSubtitle;
    if (footer) footer.textContent = pack.footerLine;
    if (watermark) watermark.textContent = pack.watermarkText;
  }

  function rewriteDocumentEventCode(value, eventCode) {
    const parts = String(value || '').split('-');
    if (parts.length >= 6 && parts[0] === 'VH') {
      parts[4] = eventCode;
      return parts.join('-');
    }
    return value;
  }

  function fillPackFields(root, pack) {
    const preset = root?.querySelector('[name="eventPreset"]');
    const place = root?.querySelector('[name="place"]');
    const date = root?.querySelector('[name="eventDate"]');
    const number = root?.querySelector('[name="documentNumber"]');
    let needsPreviewRefresh = false;

    if (preset && pack.id !== 'default' && preset.value !== pack.id) {
      preset.value = pack.id;
      needsPreviewRefresh = true;
    }
    if (place && pack.location && (!place.value || place.dataset.documentPackManaged === 'true')) {
      if (place.value !== pack.location) {
        place.value = pack.location;
        needsPreviewRefresh = true;
      }
      place.dataset.documentPackManaged = 'true';
    }
    if (date && pack.dateInput && (!date.value || date.dataset.documentPackManaged === 'true')) {
      if (date.value !== pack.dateInput) {
        date.value = pack.dateInput;
        needsPreviewRefresh = true;
      }
      date.dataset.documentPackManaged = 'true';
    }
    if (needsPreviewRefresh) {
      root.querySelector('[data-pr-form]')?.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (number && pack.accessMode === 'event' && pack.eventCode && number.value) {
      const nextNumber = rewriteDocumentEventCode(number.value, pack.eventCode);
      if (number.value !== nextNumber) number.value = nextNumber;
    }
  }

  function applyFieldText(root) {
    const numberValue = root?.querySelector('[name="documentNumber"]')?.value || '';
    const placeValue = root?.querySelector('[name="place"]')?.value || '';
    const dateValue = root?.querySelector('[name="eventDate"]')?.value || '';
    const lang = pageLang(root);
    const formatDate = () => {
      if (!dateValue) return '';
      try {
        return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date(`${dateValue}T00:00:00`));
      } catch (_) {
        return dateValue;
      }
    };
    document.querySelectorAll('[data-pr-preview-doc], [data-pr-print-doc]').forEach((doc) => {
      const number = doc.querySelector('[data-pr-number]');
      const place = doc.querySelector('[data-pr-place]');
      const date = doc.querySelector('[data-pr-date]');
      if (number && numberValue) number.textContent = numberValue;
      if (place && placeValue) place.textContent = placeValue;
      if (date && dateValue) date.textContent = formatDate();
    });
  }

  function updateMasterEvent(pack) {
    if (!pack || pack.id === 'default') return;
    window.VH_DOCUMENTS = window.VH_DOCUMENTS || {};
    window.VH_DOCUMENTS.printMaster = window.VH_DOCUMENTS.printMaster || {};
    const master = window.VH_DOCUMENTS.printMaster;
    master.events = master.events || {};
    master.events[pack.id] = {
      code: pack.eventCode,
      accessCode: pack.id,
      project: 'rap-ort',
      title: `${pack.eventTitle} — ${pack.label}`,
      dateInput: pack.dateInput,
      pl: {
        place: getPack(pack.id, 'pl')?.location || pack.location,
        dateLabel: getPack(pack.id, 'pl')?.dateLabel || pack.dateLabel,
        badgeLine: getPack(pack.id, 'pl')?.badgeLine || pack.badgeLine
      },
      en: {
        place: getPack(pack.id, 'en')?.location || pack.location,
        dateLabel: getPack(pack.id, 'en')?.dateLabel || pack.dateLabel,
        badgeLine: getPack(pack.id, 'en')?.badgeLine || pack.badgeLine
      },
      accent: {
        edition: pack.certificateLabel,
        microLine: pack.footerLine,
        code: pack.eventCode
      },
      documentPack: pack,
      documents: ['participationRecord']
    };
  }

  function unlockPackIfNeeded(root, pack) {
    if (!root || !pack || pack.id === 'default') return;
    const gate = root.querySelector('[data-pr-gate]');
    const generator = root.querySelector('[data-pr-generator]');
    if (!gate || !generator || !generator.hidden) return;
    const manualButton = root.querySelector('[data-pr-unlock="custom"]');
    if (manualButton) manualButton.click();
    else {
      gate.hidden = true;
      generator.hidden = false;
    }
  }

  function applyPack(options = {}) {
    const root = options.root || document.querySelector('[data-participation-record]');
    if (!root) return null;
    const lang = options.lang || pageLang(root);
    ensurePresetOptions(root, lang);
    const pack = getPack(options.eventId || getActiveEventId(root), lang);
    if (!pack) return null;

    updateMasterEvent(pack);
    unlockPackIfNeeded(root, pack);
    fillPackFields(root, pack);

    root.dataset.documentPack = pack.id;
    root.dataset.documentPackAccess = pack.accessMode;
    document.body.dataset.documentPack = pack.id;

    const badge = ensurePackBadge(root);
    if (badge) {
      badge.hidden = false;
      badge.innerHTML = `<strong>${pack.certificateLabel}</strong><span>${pack.eventSubtitle}</span>`;
    }

    applyDocumentText(root.querySelector('[data-pr-preview-doc]'), pack);
    applyDocumentText(document.querySelector('[data-pr-print-doc]'), pack);
    applyFieldText(root);

    return pack;
  }

  function boot() {
    const root = document.querySelector('[data-participation-record]');
    if (!root) return;
    const lang = pageLang(root);
    ensurePresetOptions(root, lang);

    availableEventIds().forEach((id) => {
      const pack = getPack(id, lang);
      updateMasterEvent(pack);
    });

    applyPack({ root, lang });

    root.addEventListener('change', (event) => {
      if (!event.target?.matches('[name="eventPreset"], [name="recordVariant"]')) return;
      window.setTimeout(() => applyPack({ root, lang }), 0);
    }, true);
    root.addEventListener('input', () => window.setTimeout(() => applyPack({ root, lang }), 0), true);
    root.addEventListener('click', (event) => {
      if (!event.target?.closest('[data-pr-regenerate], [data-pr-clear], [data-pr-unlock], [data-pr-print]')) return;
      window.setTimeout(() => applyPack({ root, lang }), 0);
    }, true);
  }

  window.getRapOrtDocumentPack = getPack;
  window.applyRapOrtDocumentPack = applyPack;
  document.addEventListener('raport:participation-updated', (event) => {
    applyPack(event.detail || {});
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
