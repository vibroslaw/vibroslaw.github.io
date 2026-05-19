(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const raw = String(params.get('event') || params.get('key') || '').toLowerCase();
  const eventKey = raw === 'oswiecim20260525' || raw === 'oswiecim' || raw === 'mup' ? 'oswiecim20260525' : raw;

  const events = {
    oswiecim20260525: {
      code: 'OSW',
      prefix: lang === 'pl' ? 'VH-ZU' : 'VH-REC',
      dateInput: '2026-05-25',
      dateLabel: lang === 'pl' ? '25 maja 2026' : '25 May 2026',
      edition: lang === 'pl' ? 'Oświęcim / MUP · 25 maja 2026' : 'Oświęcim / MUP · 25 May 2026',
      place: lang === 'pl'
        ? 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu'
        : 'Małopolska State University named after Cavalry Captain Witold Pilecki in Oświęcim',
      background: [
        '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-bg-a4.jpg',
        '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-bg-a3.jpg',
        '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg'
      ],
      preview: [
        '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-preview.webp',
        '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-thumb.webp',
        '/public/assets/reports/participation-record-bg-03-ceremonial-frame-preview.webp',
        '/public/assets/reports/participation-record-bg-preview3.webp'
      ],
      titlePlate: lang === 'pl' ? [
        '/public/assets/events/rap-ort/oswiecim20260525/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg',
        '/public/assets/events/rap-ort/oswiecim20260525/title-plates/title-zapis-uczestnictwa-gold.svg',
        '/public/assets/events/rap-ort/shared/title-plates/title-zapis-uczestnictwa-gold.svg'
      ] : [
        '/public/assets/events/rap-ort/oswiecim20260525/title-plates/title-record-of-participation-anniversary-gold.svg',
        '/public/assets/events/rap-ort/oswiecim20260525/title-plates/title-record-of-participation-gold.svg',
        '/public/assets/events/rap-ort/shared/title-plates/title-record-of-participation-gold.svg'
      ],
      seal: [
        '/public/assets/events/rap-ort/oswiecim20260525/accents/anniversary-edition-seal-gold.svg',
        '/public/assets/events/rap-ort/oswiecim20260525/accents/event-seal-gold.svg',
        '/public/assets/events/rap-ort/shared/seals/anniversary-edition-seal-gold.svg',
        '/public/assets/events/rap-ort/shared/seals/rap-ort-seal-gold.svg'
      ],
      accent: [
        '/public/assets/events/rap-ort/oswiecim20260525/accents/event-accent-gold.svg',
        '/public/assets/events/rap-ort/shared/seals/vh-seal-gold.svg'
      ],
      signature: [
        '/public/assets/reports/author-signature-gold.svg',
        '/public/assets/reports/author-signature-placeholder.svg'
      ],
      guide: [
        '/public/assets/events/rap-ort/oswiecim20260525/downloads/instrukcja-druku-zapis-uczestnictwa.pdf',
        '/public/assets/events/rap-ort/oswiecim20260525/downloads/print-guide-participation-record.pdf'
      ]
    },
    syd2026: {
      code: 'SYD',
      prefix: lang === 'pl' ? 'VH-ZU' : 'VH-REC',
      dateInput: '2026-06-21',
      dateLabel: lang === 'pl' ? '21 czerwca 2026' : '21 June 2026',
      edition: 'Sydney 2026',
      place: 'Polish Club Ashfield / Sydney',
      background: [
        '/public/assets/events/rap-ort/syd2026/backgrounds/participation-record-bg-a4.jpg',
        '/public/assets/events/rap-ort/syd2026/backgrounds/participation-record-bg-a3.jpg',
        '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi.jpg'
      ],
      preview: [
        '/public/assets/events/rap-ort/syd2026/backgrounds/participation-record-preview.webp',
        '/public/assets/events/rap-ort/syd2026/backgrounds/participation-record-thumb.webp',
        '/public/assets/reports/participation-record-bg-01-archival-cinema-preview.webp',
        '/public/assets/reports/participation-record-bg-preview.webp'
      ],
      titlePlate: lang === 'pl' ? [
        '/public/assets/events/rap-ort/syd2026/title-plates/title-zapis-uczestnictwa-gold.svg',
        '/public/assets/events/rap-ort/shared/title-plates/title-zapis-uczestnictwa-gold.svg'
      ] : [
        '/public/assets/events/rap-ort/syd2026/title-plates/title-record-of-participation-gold.svg',
        '/public/assets/events/rap-ort/shared/title-plates/title-record-of-participation-gold.svg'
      ],
      seal: [
        '/public/assets/events/rap-ort/syd2026/accents/international-screening-seal-gold.svg',
        '/public/assets/events/rap-ort/syd2026/accents/event-seal-gold.svg',
        '/public/assets/events/rap-ort/shared/seals/international-screening-seal-gold.svg',
        '/public/assets/events/rap-ort/shared/seals/rap-ort-seal-gold.svg'
      ],
      accent: [
        '/public/assets/events/rap-ort/syd2026/accents/event-accent-gold.svg',
        '/public/assets/events/rap-ort/shared/seals/vh-seal-gold.svg'
      ],
      signature: [
        '/public/assets/reports/author-signature-gold.svg',
        '/public/assets/reports/author-signature-placeholder.svg'
      ],
      guide: [
        '/public/assets/events/rap-ort/syd2026/downloads/print-guide-participation-record.pdf',
        '/public/assets/events/rap-ort/syd2026/downloads/instrukcja-druku-zapis-uczestnictwa.pdf'
      ]
    }
  };

  const event = events[eventKey];
  if (!event) return;

  const copy = lang === 'pl' ? {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'ZAPIS UCZESTNICTWA',
    forLabel: 'Dla:',
    dateLabel: 'Data wydarzenia:',
    placeLabel: 'Miejsce:',
    numberLabel: 'Numer dokumentu:',
    authorRole: 'autor projektu',
    guide: 'Jak drukować',
    guideMissing: 'Instrukcja drukowania nie została jeszcze dodana. Rekomendacja: A4 poziomo, kolor, papier matowy 200–250 g/m², skala 100%, bez dodatkowych marginesów.',
    eventLocked: 'Wersja wydarzenia została ustawiona z linku QR. Uczestnik uzupełnia tylko imię i nazwisko — opcjonalnie.',
    noCertificate: 'Pamiątkowy zapis uczestnictwa · nie jest dyplomem ani dokumentem urzędowym · nie oznacza patronatu instytucji.'
  } : {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'RECORD OF PARTICIPATION',
    forLabel: 'For:',
    dateLabel: 'Event date:',
    placeLabel: 'Place:',
    numberLabel: 'Document number:',
    authorRole: 'project author',
    guide: 'Print guide',
    guideMissing: 'The print guide has not been added yet. Recommended: A4 landscape, colour, matte paper 200–250 gsm, 100% scale, no extra margins.',
    eventLocked: 'The event edition has been set from the QR link. The participant only completes the name field — optional.',
    noCertificate: 'Commemorative record of participation · not an official certificate · does not imply institutional patronage.'
  };

  const q = (sel) => root.querySelector(sel);
  const all = (sel) => [...root.querySelectorAll(sel)];
  const abs = (path) => new URL(path, location.origin).href;
  const cache = new Map();

  function test(path) {
    const url = abs(path);
    if (cache.has(url)) return cache.get(url);
    const promise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve('');
      img.src = url;
    });
    cache.set(url, promise);
    return promise;
  }
  async function first(paths) {
    for (const path of paths.filter(Boolean)) {
      const ok = await test(path);
      if (ok) return ok;
    }
    return '';
  }
  function number() {
    const key = `vhParticipationNumber:${eventKey}:${lang}`;
    let seq = localStorage.getItem(key);
    if (!/^\d{4}$/.test(seq || '')) {
      seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      localStorage.setItem(key, seq);
    }
    const dateCode = event.dateInput.slice(5, 7) + event.dateInput.slice(8, 10);
    return `${event.prefix}-${event.dateInput.slice(0, 4)}-${dateCode}-${event.code}-${seq}`;
  }
  function hideField(input) {
    const label = input?.closest('label');
    if (label) label.hidden = true;
  }
  async function setImg(node, paths) {
    if (!node) return;
    node.hidden = true;
    const url = await first(paths);
    if (url) { node.src = url; node.hidden = false; }
  }
  function ensureDecor(container) {
    const content = container?.querySelector('.pr-document-content, .pr-print-content') || container;
    if (!content) return;
    if (!content.querySelector('[data-pr-premium-seal]')) {
      const seal = document.createElement('img');
      seal.className = 'pr-premium-seal';
      seal.setAttribute('data-pr-premium-seal', '');
      seal.alt = '';
      content.prepend(seal);
    }
    if (!content.querySelector('[data-pr-premium-title]')) {
      const titleImg = document.createElement('img');
      titleImg.className = 'pr-premium-title-plate';
      titleImg.setAttribute('data-pr-premium-title', '');
      titleImg.alt = '';
      content.querySelector('[data-pr-title]')?.insertAdjacentElement('beforebegin', titleImg);
    }
    if (!content.querySelector('[data-pr-premium-accent]')) {
      const accent = document.createElement('img');
      accent.className = 'pr-premium-accent';
      accent.setAttribute('data-pr-premium-accent', '');
      accent.alt = '';
      content.querySelector('[data-pr-closing]')?.insertAdjacentElement('beforebegin', accent);
    }
    if (!content.querySelector('[data-pr-premium-microprint]')) {
      const micro = document.createElement('p');
      micro.className = 'pr-premium-microprint';
      micro.setAttribute('data-pr-premium-microprint', '');
      content.appendChild(micro);
    }
  }
  async function render() {
    const bg = await first(event.preview) || await first(event.background);
    const bgNode = q('[data-pr-preview-bg]');
    if (bgNode && bg) bgNode.style.backgroundImage = `url('${bg}')`;
    const printBg = document.querySelector('[data-pr-print-bg]');
    const printBgUrl = await first(event.background);
    if (printBg && printBgUrl) printBg.src = printBgUrl;
    const containers = [q('[data-pr-preview-doc]'), document.querySelector('[data-pr-print-doc]')].filter(Boolean);
    containers.forEach((container) => {
      ensureDecor(container);
      container.classList.remove('layout-cinema', 'layout-museum');
      container.classList.add(eventKey === 'oswiecim20260525' ? 'layout-ceremonial' : 'layout-cinema');
      container.querySelector('[data-pr-project]').textContent = `${copy.project} · ${event.edition}`;
      container.querySelector('[data-pr-title]').textContent = copy.title;
      const name = q('[name="participantName"]')?.value.trim() || '';
      const forEl = container.querySelector('[data-pr-for]');
      if (forEl) { forEl.hidden = !name; forEl.innerHTML = name ? `${copy.forLabel} <strong>${name.replace(/[<>&]/g, '')}</strong>` : ''; }
      container.querySelector('[data-pr-date-label]').textContent = copy.dateLabel;
      container.querySelector('[data-pr-date]').textContent = event.dateLabel;
      container.querySelector('[data-pr-place-label]').textContent = copy.placeLabel;
      container.querySelector('[data-pr-place]').textContent = event.place;
      container.querySelector('[data-pr-number-label]').textContent = copy.numberLabel;
      container.querySelector('[data-pr-number]').textContent = number();
      container.querySelector('[data-pr-author-role]').textContent = copy.authorRole;
      const micro = container.querySelector('[data-pr-premium-microprint]');
      if (micro) micro.textContent = `${copy.noCertificate} · ${event.edition}`;
    });
    await setImg(q('[data-pr-preview-doc] [data-pr-premium-seal]'), event.seal);
    await setImg(q('[data-pr-preview-doc] [data-pr-premium-title]'), event.titlePlate);
    await setImg(q('[data-pr-preview-doc] [data-pr-premium-accent]'), event.accent);
    await setImg(q('[data-pr-preview-doc] .pr-author img'), event.signature);
    await setImg(document.querySelector('[data-pr-print-doc] [data-pr-premium-seal]'), event.seal);
    await setImg(document.querySelector('[data-pr-print-doc] [data-pr-premium-title]'), event.titlePlate);
    await setImg(document.querySelector('[data-pr-print-doc] [data-pr-premium-accent]'), event.accent);
    await setImg(document.querySelector('[data-pr-print-doc] .pr-author img'), event.signature);
  }
  function boot() {
    root.classList.add('pr-event-specific', `pr-event-${eventKey}`);
    const gate = q('[data-pr-gate]');
    const generator = q('[data-pr-generator]');
    if (gate) gate.hidden = true;
    if (generator) generator.hidden = false;
    const preset = q('[name="eventPreset"]');
    const place = q('[name="place"]');
    const date = q('[name="eventDate"]');
    const docNum = q('[name="documentNumber"]');
    if (preset) preset.value = eventKey;
    if (place) place.value = event.place;
    if (date) date.value = event.dateInput;
    if (docNum) docNum.value = number();
    [preset, place, date, docNum].forEach(hideField);
    all('.pr-variant-grid, .pr-mode-grid .pr-mode-card.is-disabled').forEach((node) => { node.hidden = true; });
    const badge = q('[data-pr-event-badge]');
    if (badge) {
      badge.hidden = false;
      badge.innerHTML = `<strong>${event.place}</strong><span>${event.dateLabel}</span><span>${event.edition}</span>`;
    }
    all('[data-pr-status]').forEach((node) => { node.textContent = copy.eventLocked; });
    const actions = q('.pr-form-actions');
    if (actions && !actions.querySelector('[data-pr-premium-guide]')) {
      const button = document.createElement('button');
      button.className = 'vh-button secondary';
      button.type = 'button';
      button.setAttribute('data-pr-premium-guide', '');
      button.textContent = copy.guide;
      actions.querySelector('[data-pr-print]')?.insertAdjacentElement('afterend', button);
    }
    render();
  }
  root.addEventListener('input', () => setTimeout(render, 0), true);
  root.addEventListener('click', async (ev) => {
    if (ev.target.closest('[data-pr-premium-guide]')) {
      ev.preventDefault();
      const guide = await first(event.guide);
      if (guide) location.href = guide;
      else all('[data-pr-status]').forEach((node) => { node.textContent = copy.guideMissing; });
    }
  }, true);
  boot();
})();
