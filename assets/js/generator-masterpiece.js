(() => {
  const root = document.querySelector('[data-participation-record], [data-witness-report]');
  if (!root) return;

  const isWitness = root.matches('[data-witness-report]');
  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';

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

  function bootPremiumAssets() {
    loadScript('/assets/js/event-asset-manifest.js')
      .then(() => loadScript('/assets/js/event-asset-loader.js'));
  }

  const copy = {
    pl: {
      flowKicker: 'PROCES TWORZENIA',
      participationTitle: 'Atelier dokumentu po projekcji',
      witnessTitle: 'Rytuał refleksji po projekcji',
      participationLead: 'Zacznij od wydarzenia, wybierz charakter dokumentu, uzupełnij dane i przygotuj finalny PDF jako pamiątkowy artefakt.',
      witnessLead: 'Zatrzymaj jedno zdanie po projekcji, zapisz ślad refleksji i przygotuj prywatny PDF albo anonimowy JPG do archiwum.',
      event: 'Wydarzenie',
      input: 'Zapis',
      preview: 'Podgląd',
      export: 'Finalizacja',
      eventDesc: 'Ustaw datę, miejsce i wersję wydarzenia.',
      inputDesc: 'Wprowadź tylko to, co naprawdę potrzebne.',
      previewDesc: 'Zobacz dokument jako artefakt pod światłem.',
      exportDesc: 'Przygotuj lokalny plik PDF lub JPG.',
      preparingTitle: 'Przygotowuję finalny dokument',
      preparingText: 'Łączę układ, światło, tekst i warstwę wydarzenia. Plik powstaje lokalnie w przeglądarce.',
      successKicker: 'DOKUMENT GOTOWY',
      successTitle: 'Finalny plik został przygotowany',
      successText: 'Zachowaj go jako osobisty ślad uczestnictwa i wróć do pozostałych elementów doświadczenia.',
      portal: 'Wróć do portalu',
      memory: 'Pakiet Uczestnika',
      archive: 'Anonimowe Archiwum',
      credential: 'Wersja doświadczenia',
      defaultEdition: 'Wersja publiczna'
    },
    en: {
      flowKicker: 'CREATION PROCESS',
      participationTitle: 'Post-screening document atelier',
      witnessTitle: 'Post-screening reflection ritual',
      participationLead: 'Begin with the event, choose the document character, complete the details and prepare the final PDF as a commemorative artefact.',
      witnessLead: 'Hold one sentence after the screening, write a trace of reflection and prepare a private PDF or anonymous JPG for the archive.',
      event: 'Event',
      input: 'Record',
      preview: 'Preview',
      export: 'Finalise',
      eventDesc: 'Set date, place and event edition.',
      inputDesc: 'Enter only what the document truly needs.',
      previewDesc: 'See the document as an artefact under light.',
      exportDesc: 'Prepare a local PDF or JPG file.',
      preparingTitle: 'Preparing the final document',
      preparingText: 'Combining layout, light, text and event layer. The file is created locally in your browser.',
      successKicker: 'DOCUMENT READY',
      successTitle: 'The final file has been prepared',
      successText: 'Keep it as a personal trace of participation and return to the rest of the experience.',
      portal: 'Return to portal',
      memory: 'Memory Pack',
      archive: 'Anonymous Archive',
      credential: 'Experience edition',
      defaultEdition: 'Public preview'
    }
  }[lang];

  const eventLabels = {
    oswiecim20260525: {
      pl: ['Oświęcim / MUP', '25 maja 2026'],
      en: ['Oświęcim / MUP', '25 May 2026']
    },
    syd2026: {
      pl: ['Sydney 2026', '21 czerwca 2026'],
      en: ['Sydney 2026', '21 June 2026']
    },
    custom: {
      pl: ['Wersja ręczna', 'Własne dane wydarzenia'],
      en: ['Manual version', 'Custom event details']
    }
  };

  function eventKey() {
    const select = root.querySelector('[name="eventPreset"]');
    const params = new URLSearchParams(window.location.search);
    return select?.value || params.get('event') || 'custom';
  }

  function activeEdition() {
    const key = eventKey();
    return eventLabels[key]?.[lang] || [copy.defaultEdition, key || copy.defaultEdition];
  }

  function portalUrl(anchor = '') {
    const key = eventKey();
    const base = lang === 'en' ? '/rap-ort/participation/' : '/rap-ort/uczestnictwo/';
    if (key === 'oswiecim20260525' || key === 'syd2026') return `${base}?event=${encodeURIComponent(key)}${anchor}`;
    return `${base}${anchor}`;
  }

  function ensureOverlay() {
    let overlay = document.querySelector('[data-generator-export-overlay]');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'generator-export-overlay';
    overlay.setAttribute('data-generator-export-overlay', '');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = `<div class="generator-export-card"><div class="generator-export-spinner" aria-hidden="true"></div><h3>${copy.preparingTitle}</h3><p>${copy.preparingText}</p></div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  function showOverlay() {
    const overlay = ensureOverlay();
    window.requestAnimationFrame(() => overlay.classList.add('is-visible'));
  }

  function hideOverlay() {
    const overlay = document.querySelector('[data-generator-export-overlay]');
    if (!overlay) return;
    window.setTimeout(() => overlay.classList.remove('is-visible'), 900);
  }

  function buildFlow() {
    const wrapper = document.createElement('section');
    wrapper.className = 'generator-master-flow';
    wrapper.setAttribute('aria-label', copy.flowKicker);
    const [edition, date] = activeEdition();
    wrapper.innerHTML = `
      <div class="generator-master-flow-inner">
        <div>
          <div class="generator-master-credential"><span>${copy.credential}</span><strong data-master-edition>${edition}</strong><em data-master-date>${date}</em></div>
          <p class="generator-master-flow-kicker">${copy.flowKicker}</p>
          <h3>${isWitness ? copy.witnessTitle : copy.participationTitle}</h3>
          <p>${isWitness ? copy.witnessLead : copy.participationLead}</p>
        </div>
        <div class="generator-master-steps">
          <div class="generator-master-step"><strong>01</strong><span><b>${copy.event}</b>${copy.eventDesc}</span></div>
          <div class="generator-master-step"><strong>02</strong><span><b>${copy.input}</b>${copy.inputDesc}</span></div>
          <div class="generator-master-step"><strong>03</strong><span><b>${copy.preview}</b>${copy.previewDesc}</span></div>
          <div class="generator-master-step"><strong>04</strong><span><b>${copy.export}</b>${copy.exportDesc}</span></div>
        </div>
      </div>`;
    return wrapper;
  }

  function insertFlow() {
    if (root.querySelector('.generator-master-flow')) return;
    const target = isWitness ? root.querySelector('#generator .vh-wrap') : root.querySelector('[data-pr-generator]');
    if (!target) return;
    target.prepend(buildFlow());
  }

  function insertStageLabels() {
    const form = isWitness ? root.querySelector('[data-wr-form]') : root.querySelector('[data-pr-form]');
    const preview = isWitness ? root.querySelector('.wr-preview-card') : root.querySelector('.pr-preview-wrap');
    if (form && !form.querySelector('[data-master-stage="input"]')) {
      const label = document.createElement('div');
      label.className = 'generator-master-stage-label';
      label.dataset.masterStage = 'input';
      label.textContent = copy.input;
      form.prepend(label);
    }
    if (preview && !preview.querySelector('[data-master-stage="preview"]')) {
      const label = document.createElement('div');
      label.className = 'generator-master-stage-label';
      label.dataset.masterStage = 'preview';
      label.textContent = copy.preview;
      preview.prepend(label);
    }
  }

  function ensureSuccessPanel() {
    const form = isWitness ? root.querySelector('[data-wr-form]') : root.querySelector('[data-pr-form]');
    if (!form) return null;
    let panel = form.querySelector('[data-generator-master-success]');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'generator-master-success';
    panel.setAttribute('data-generator-master-success', '');
    panel.hidden = true;
    panel.innerHTML = `
      <p class="generator-master-success-kicker">${copy.successKicker}</p>
      <h3>${copy.successTitle}</h3>
      <p>${copy.successText}</p>
      <div class="generator-master-success-actions">
        <a href="${portalUrl('')}">${copy.portal}</a>
        <a href="${portalUrl('#memory-pack')}">${copy.memory}</a>
        <a href="${portalUrl('#archive-gallery')}">${copy.archive}</a>
      </div>`;
    const status = isWitness ? root.querySelector('[data-wr-status]') : root.querySelector('[data-pr-status]');
    if (status) status.insertAdjacentElement('afterend', panel);
    else form.appendChild(panel);
    return panel;
  }

  function updateDynamicText() {
    const [edition, date] = activeEdition();
    root.querySelectorAll('[data-master-edition]').forEach((node) => { node.textContent = edition; });
    root.querySelectorAll('[data-master-date]').forEach((node) => { node.textContent = date; });
    const panel = root.querySelector('[data-generator-master-success]');
    if (panel) {
      const links = panel.querySelectorAll('a');
      if (links[0]) links[0].href = portalUrl('');
      if (links[1]) links[1].href = portalUrl('#memory-pack');
      if (links[2]) links[2].href = portalUrl('#archive-gallery');
    }
  }

  function watchExports() {
    const buttons = [root.querySelector('[data-pr-print]'), root.querySelector('[data-wr-download]'), root.querySelector('[data-wr-archive]')].filter(Boolean);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        showOverlay();
        window.setTimeout(() => {
          hideOverlay();
          const panel = ensureSuccessPanel();
          if (panel) panel.hidden = false;
        }, 1400);
      }, true);
    });
  }

  function boot() {
    document.documentElement.classList.add('generator-masterpiece-ready');
    bootPremiumAssets();
    insertFlow();
    insertStageLabels();
    ensureSuccessPanel();
    updateDynamicText();
    watchExports();
    root.addEventListener('change', (event) => {
      if (event.target?.matches('[name="eventPreset"]')) window.setTimeout(updateDynamicText, 0);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();