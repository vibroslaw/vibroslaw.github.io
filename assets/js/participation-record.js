(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';

  const COPY = {
    pl: {
      validCodes: ['syd2026', 'sumienie'],
      codeError: 'Kod nie został rozpoznany. Sprawdź kod z QR lub wpisz kod wydarzenia pokazany po projekcji.',
      unlocked: 'Dostęp uczestnika został odblokowany. Możesz utworzyć Zapis Uczestnictwa.',
      generated: 'Nowy numer dokumentu został wygenerowany.',
      print: 'Dokument został przygotowany. W oknie drukowania wybierz „Zapisz jako PDF”.',
      finale: 'Dziękujemy za udział w doświadczeniu Rap-Ort: Prawda Sumienia.',
      missingPlace: 'Uzupełnij miejsce / instytucję.',
      missingDate: 'Uzupełnij datę wydarzenia.',
      projectAuthor: 'autor projektu',
      forLabel: 'Dla:',
      dateLabel: 'Data wydarzenia:',
      placeLabel: 'Miejsce:',
      numberLabel: 'Numer dokumentu:',
      title: 'ZAPIS UCZESTNICTWA',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      body: 'Niniejszy dokument upamiętnia udział w projekcji audiowizualnej\n„Rap-Ort: Prawda Sumienia”\n\nautorskim doświadczeniu muzyki, obrazu, słowa i ciszy,\npoświęconym pamięci, świadectwu, sumieniu\noraz odpowiedzialności człowieka wobec prawdy.',
      closing: 'To nie jest dyplom ani dokument urzędowy.\nTo pamiątkowy ślad chwili, w której historia\nstaje się pytaniem, które uczestnik zabiera ze sobą.',
      customPlace: 'Miejsce / instytucja',
      customDate: 'Data wydarzenia',
      prefix: 'VH-ZU'
    },
    en: {
      validCodes: ['syd2026', 'conscience'],
      codeError: 'The code was not recognised. Check the QR code or enter the event code shown after the screening.',
      unlocked: 'Participant access unlocked. You can create your Record of Participation.',
      generated: 'New document number generated.',
      print: 'Your document is ready. In the print window, choose “Save as PDF”.',
      finale: 'Thank you for participating in the Rap-Ort: Prawda Sumienia experience.',
      missingPlace: 'Enter the place / institution.',
      missingDate: 'Enter the event date.',
      projectAuthor: 'project author',
      forLabel: 'For:',
      dateLabel: 'Event date:',
      placeLabel: 'Place:',
      numberLabel: 'Document number:',
      title: 'RECORD OF PARTICIPATION',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      body: 'This document commemorates participation in the audiovisual screening of\n“Rap-Ort: Prawda Sumienia”\n\nan authorial experience of music, image, words and silence,\ndevoted to memory, testimony, conscience\nand human responsibility before truth.',
      closing: 'This is not an official certificate.\nIt is a commemorative trace of a moment in which history\nbecomes a question the participant carries forward.',
      customPlace: 'Place / institution',
      customDate: 'Event date',
      prefix: 'VH-REC'
    }
  };

  const EVENTS = {
    syd2026: {
      code: 'SYD',
      dateInput: '2026-06-21',
      pl: {
        place: 'Polish Club Ashfield / Sydney',
        dateLabel: '21 czerwca 2026',
        badgeLine: 'Międzynarodowa projekcja'
      },
      en: {
        place: 'Polish Club Ashfield / Sydney',
        dateLabel: '21 June 2026',
        badgeLine: 'International screening'
      }
    }
  };

  const VARIANTS = {
    cinema: {
      code: 'cinema',
      layout: 'cinema',
      bg: '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg',
      preview: '/public/assets/reports/participation-record-bg-01-archival-cinema-preview.webp',
      fallbackBg: '/public/assets/reports/participation-record-bg-a4-300dpi.jpg',
      fallbackPreview: '/public/assets/reports/participation-record-bg-preview.webp'
    },
    museum: {
      code: 'museum',
      layout: 'museum',
      bg: '/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg',
      preview: '/public/assets/reports/participation-record-bg-02-museum-line-preview.webp',
      fallbackBg: '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg',
      fallbackPreview: '/public/assets/reports/participation-record-bg-preview2.webp'
    },
    ceremonial: {
      code: 'ceremonial',
      layout: 'ceremonial',
      bg: '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg',
      preview: '/public/assets/reports/participation-record-bg-03-ceremonial-frame-preview.webp',
      fallbackBg: '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg',
      fallbackPreview: '/public/assets/reports/participation-record-bg-preview3.webp'
    }
  };

  const copy = COPY[lang];
  const $ = (sel) => root.querySelector(sel);
  const all = (sel) => [...root.querySelectorAll(sel)];

  const gate = $('[data-pr-gate]');
  const generator = $('[data-pr-generator]');
  const codeForm = $('[data-pr-code-form]');
  const codeInput = $('[data-pr-code]');
  const statusNodes = all('[data-pr-status]');
  const form = $('[data-pr-form]');
  const preset = $('[name="eventPreset"]');
  const nameInput = $('[name="participantName"]');
  const placeInput = $('[name="place"]');
  const dateInput = $('[name="eventDate"]');
  const numberInput = $('[name="documentNumber"]');
  const eventBadge = $('[data-pr-event-badge]');
  const previewBg = $('[data-pr-preview-bg]');
  const previewDoc = $('[data-pr-preview-doc]');
  const printBg = document.querySelector('[data-pr-print-bg]');
  const printDoc = document.querySelector('[data-pr-print-doc]');
  const finale = $('[data-pr-finale]');

  let unlocked = false;
  let currentEventKey = 'custom';
  let sequence = randomSequence();

  function randomSequence() {
    return String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  }

  function setStatus(message) {
    statusNodes.forEach((node) => { node.textContent = message || ''; });
  }

  function cleanCode(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  function storageKey() {
    return `vhParticipationNumber:${lang}:${currentEventKey}:${dateCode()}:${eventCode()}`;
  }

  function loadOrCreateSequence() {
    const key = storageKey();
    const stored = localStorage.getItem(key);
    if (stored && /^\d{4}$/.test(stored)) return stored;
    const next = randomSequence();
    localStorage.setItem(key, next);
    return next;
  }

  function saveSequence(value) {
    localStorage.setItem(storageKey(), value);
  }

  function unlock(eventKey) {
    unlocked = true;
    currentEventKey = EVENTS[eventKey] ? eventKey : 'custom';
    gate.hidden = true;
    generator.hidden = false;
    if (preset) preset.value = currentEventKey;
    applyPreset();
    sequence = loadOrCreateSequence();
    updateNumber(false);
    updateEventBadge();
    updatePreview();
    setStatus(copy.unlocked);
  }

  function eventCode() {
    const selected = preset ? preset.value : currentEventKey;
    if (EVENTS[selected]) return EVENTS[selected].code;
    const place = placeInput ? placeInput.value : '';
    const letters = place.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    return letters || 'CUSTOM';
  }

  function dateCode() {
    const val = dateInput ? dateInput.value : '';
    if (!val) return '0000';
    const parts = val.split('-');
    return parts.length === 3 ? `${parts[1]}${parts[2]}` : '0000';
  }

  function yearCode() {
    const val = dateInput ? dateInput.value : '';
    const y = val && val.split('-')[0];
    return y || new Date().getFullYear();
  }

  function updateNumber(regenerate = false) {
    if (regenerate) {
      sequence = randomSequence();
      saveSequence(sequence);
    }
    if (numberInput) numberInput.value = `${copy.prefix}-${yearCode()}-${dateCode()}-${eventCode()}-${sequence}`;
  }

  function labelDate() {
    const selected = preset ? preset.value : currentEventKey;
    if (EVENTS[selected]) return EVENTS[selected][lang].dateLabel;
    const val = dateInput ? dateInput.value : '';
    if (!val) return copy.customDate;
    try {
      return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(`${val}T00:00:00`));
    } catch (_) {
      return val;
    }
  }

  function applyPreset() {
    currentEventKey = preset ? preset.value : currentEventKey;
    if (EVENTS[currentEventKey]) {
      if (placeInput) placeInput.value = EVENTS[currentEventKey][lang].place;
      if (dateInput) dateInput.value = EVENTS[currentEventKey].dateInput;
    }
  }

  function updateEventBadge() {
    if (!eventBadge) return;
    const selected = preset ? preset.value : currentEventKey;
    const eventData = EVENTS[selected];
    if (!eventData) {
      eventBadge.hidden = true;
      eventBadge.innerHTML = '';
      return;
    }
    eventBadge.hidden = false;
    eventBadge.innerHTML = `<strong>${escapeHtml(eventData[lang].place)}</strong><span>${escapeHtml(eventData[lang].dateLabel)}</span><span>${escapeHtml(eventData[lang].badgeLine)}</span>`;
  }

  function selectedVariant() {
    const checked = root.querySelector('[name="recordVariant"]:checked');
    return VARIANTS[checked ? checked.value : 'cinema'] || VARIANTS.cinema;
  }

  function setImageBackground(el, primary, fallback) {
    if (!el) return;
    el.style.backgroundImage = `url('${primary}')`;
    const img = new Image();
    img.onerror = () => {
      el.style.backgroundImage = `url('${fallback}')`;
    };
    img.src = primary;
  }

  function splitLines(text) {
    return String(text || '').split('\n').map((line) => line.trim()).filter(Boolean);
  }

  function setLayout(container, layout) {
    if (!container) return;
    container.classList.remove('layout-cinema', 'layout-museum', 'layout-ceremonial');
    container.classList.add(`layout-${layout}`);
    const content = container.querySelector('.pr-document-content, .pr-print-content') || container;
    content.classList.remove('layout-cinema', 'layout-museum', 'layout-ceremonial');
    content.classList.add(`layout-${layout}`);
  }

  function renderDocument(container) {
    if (!container) return;
    const name = nameInput ? nameInput.value.trim() : '';
    const place = placeInput ? placeInput.value.trim() : '';
    const date = labelDate();
    const number = numberInput ? numberInput.value : '';
    container.querySelector('[data-pr-project]').textContent = copy.project;
    container.querySelector('[data-pr-title]').textContent = copy.title;
    container.querySelector('[data-pr-body]').innerHTML = splitLines(copy.body).map((line) => `<span>${escapeHtml(line)}</span>`).join('<br>');
    const forEl = container.querySelector('[data-pr-for]');
    if (forEl) {
      forEl.hidden = !name;
      forEl.innerHTML = name ? `${copy.forLabel} <strong>${escapeHtml(name)}</strong>` : '';
    }
    container.querySelector('[data-pr-date-label]').textContent = copy.dateLabel;
    container.querySelector('[data-pr-date]').textContent = date;
    container.querySelector('[data-pr-place-label]').textContent = copy.placeLabel;
    container.querySelector('[data-pr-place]').textContent = place || copy.customPlace;
    container.querySelector('[data-pr-number-label]').textContent = copy.numberLabel;
    container.querySelector('[data-pr-number]').textContent = number;
    container.querySelector('[data-pr-closing]').innerHTML = splitLines(copy.closing).map((line) => `<span>${escapeHtml(line)}</span>`).join('<br>');
    container.querySelector('[data-pr-author-role]').textContent = copy.projectAuthor;
  }

  function updatePreview() {
    updateNumber(false);
    updateEventBadge();
    const variant = selectedVariant();
    if (previewDoc) {
      previewDoc.classList.add('is-switching');
      window.setTimeout(() => previewDoc.classList.remove('is-switching'), 220);
    }
    setImageBackground(previewBg, variant.preview, variant.fallbackPreview);
    setLayout(previewDoc, variant.layout);
    renderDocument(previewDoc);
    if (printBg) printBg.src = variant.bg;
    const printImg = new Image();
    printImg.onerror = () => {
      if (printBg) printBg.src = variant.fallbackBg;
    };
    printImg.src = variant.bg;
    setLayout(printDoc, variant.layout);
    renderDocument(printDoc);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[char]));
  }

  function validate() {
    if (!placeInput || !placeInput.value.trim()) return copy.missingPlace;
    if (!dateInput || !dateInput.value) return copy.missingDate;
    return '';
  }

  function handleUnlock(code) {
    const clean = cleanCode(code);
    if (EVENTS[clean]) return unlock(clean);
    if (copy.validCodes.includes(clean)) return unlock('custom');
    return setStatus(copy.codeError);
  }

  codeForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    handleUnlock(codeInput?.value || new URLSearchParams(location.search).get('event') || '');
  });

  root.querySelectorAll('[data-pr-unlock]').forEach((button) => {
    button.addEventListener('click', () => unlock(button.dataset.prUnlock || 'custom'));
  });

  preset?.addEventListener('change', () => {
    applyPreset();
    sequence = loadOrCreateSequence();
    updatePreview();
  });

  form?.addEventListener('input', updatePreview);
  form?.addEventListener('change', updatePreview);

  root.querySelector('[data-pr-regenerate]')?.addEventListener('click', () => {
    updateNumber(true);
    updatePreview();
    setStatus(copy.generated);
  });

  root.querySelector('[data-pr-clear]')?.addEventListener('click', () => {
    form?.reset();
    currentEventKey = preset ? preset.value : 'custom';
    applyPreset();
    sequence = loadOrCreateSequence();
    updatePreview();
    if (finale) finale.hidden = true;
  });

  root.querySelectorAll('[name="recordVariant"]').forEach((input) => {
    input.addEventListener('change', () => {
      root.querySelectorAll('.pr-variant-card').forEach((card) => card.classList.toggle('is-selected', card.contains(input) && input.checked));
      updatePreview();
    });
  });

  root.querySelector('[data-pr-print]')?.addEventListener('click', () => {
    const error = validate();
    if (error) {
      setStatus(error);
      return;
    }
    updatePreview();
    setStatus(copy.print);
    if (finale) {
      finale.hidden = false;
      finale.textContent = copy.finale;
    }
    window.setTimeout(() => window.print(), 180);
  });

  const urlParams = new URLSearchParams(location.search);
  const urlCode = cleanCode(urlParams.get('event') || urlParams.get('key'));
  if (EVENTS[urlCode]) unlock(urlCode);
  else {
    generator.hidden = true;
    gate.hidden = false;
  }
})();
