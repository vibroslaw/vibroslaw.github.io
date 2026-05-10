(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const copy = {
    pl: {
      validCodes: ['syd2026', 'sumienie'],
      codeError: 'Kod nie został rozpoznany. Sprawdź kod z QR lub wpisz kod wydarzenia pokazany po projekcji.',
      unlocked: 'Dostęp odblokowany. Możesz utworzyć Zapis Uczestnictwa.',
      generated: 'Numer dokumentu został wygenerowany.',
      print: 'Otwieranie okna wydruku. Wybierz „Zapisz jako PDF”, aby pobrać dokument.',
      missingPlace: 'Uzupełnij miejsce / instytucję.',
      missingDate: 'Uzupełnij datę wydarzenia.',
      projectAuthor: 'autor projektu',
      forLabel: 'Dla:',
      dateLabel: 'Data wydarzenia:',
      placeLabel: 'Miejsce:',
      numberLabel: 'Numer dokumentu:',
      title: 'ZAPIS UCZESTNICTWA',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      body: 'Odnotowuje się udział w projekcji audiowizualnej\n„Rap-Ort: Prawda Sumienia”\n\nbędącej autorskim doświadczeniem muzyki, obrazu,\nsłowa i ciszy — poświęconym pamięci, świadectwu,\nsumieniu oraz odpowiedzialności wobec prawdy.',
      closing: 'Ten dokument pozostaje pamiątkowym śladem spotkania z dziełem.\nNie zamyka doświadczenia — zachowuje jego obecność.',
      nameFallback: '',
      customPlace: 'Miejsce / instytucja',
      customDate: 'Data wydarzenia',
      prefix: 'ZU'
    },
    en: {
      validCodes: ['syd2026', 'conscience'],
      codeError: 'The code was not recognised. Check the QR code or enter the event code shown after the screening.',
      unlocked: 'Access unlocked. You can create your Record of Participation.',
      generated: 'Document number generated.',
      print: 'Opening print dialog. Choose “Save as PDF” to download the document.',
      missingPlace: 'Enter the place / institution.',
      missingDate: 'Enter the event date.',
      projectAuthor: 'project author',
      forLabel: 'For:',
      dateLabel: 'Event date:',
      placeLabel: 'Place:',
      numberLabel: 'Document number:',
      title: 'RECORD OF PARTICIPATION',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      body: 'This document records participation in the audiovisual screening of\n“Rap-Ort: Prawda Sumienia”\n\nan authorial experience of music, image,\nwords and silence — devoted to memory, testimony,\nconscience and human responsibility before truth.',
      closing: 'This document remains a commemorative trace of an encounter with the work.\nIt does not close the experience — it preserves its presence.',
      nameFallback: '',
      customPlace: 'Place / institution',
      customDate: 'Event date',
      prefix: 'RP'
    }
  }[lang];

  const events = {
    syd2026: {
      code: 'SYD',
      dateInput: '2026-06-21',
      pl: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 czerwca 2026' },
      en: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 June 2026' }
    }
  };

  const variants = {
    cinema: {
      code: 'cinema',
      bg: '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg',
      preview: '/public/assets/reports/participation-record-bg-01-archival-cinema-preview.webp',
      fallbackBg: '/public/assets/reports/participation-record-bg-a4-300dpi.jpg',
      fallbackPreview: '/public/assets/reports/participation-record-bg-preview.webp'
    },
    museum: {
      code: 'museum',
      bg: '/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg',
      preview: '/public/assets/reports/participation-record-bg-02-museum-line-preview.webp',
      fallbackBg: '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg',
      fallbackPreview: '/public/assets/reports/participation-record-bg-preview2.webp'
    },
    ceremonial: {
      code: 'ceremonial',
      bg: '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg',
      preview: '/public/assets/reports/participation-record-bg-03-ceremonial-frame-preview.webp',
      fallbackBg: '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg',
      fallbackPreview: '/public/assets/reports/participation-record-bg-preview3.webp'
    }
  };

  const $ = (sel) => root.querySelector(sel);
  const gate = $('[data-pr-gate]');
  const generator = $('[data-pr-generator]');
  const codeForm = $('[data-pr-code-form]');
  const codeInput = $('[data-pr-code]');
  const status = $('[data-pr-status]');
  const form = $('[data-pr-form]');
  const preset = $('[name="eventPreset"]');
  const nameInput = $('[name="participantName"]');
  const placeInput = $('[name="place"]');
  const dateInput = $('[name="eventDate"]');
  const numberInput = $('[name="documentNumber"]');
  const previewBg = $('[data-pr-preview-bg]');
  const printBg = document.querySelector('[data-pr-print-bg]');
  const printStage = document.querySelector('[data-pr-print-stage]');

  let unlocked = false;
  let sequence = randomSequence();

  function randomSequence() {
    return String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  }

  function cleanCode(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  function unlock(eventCode) {
    unlocked = true;
    gate.hidden = true;
    generator.hidden = false;
    const presetValue = events[eventCode] ? eventCode : 'custom';
    if (preset) preset.value = presetValue;
    applyPreset();
    updateNumber();
    updatePreview();
    if (status) status.textContent = copy.unlocked;
  }

  function eventCode() {
    const selected = preset ? preset.value : 'custom';
    if (events[selected]) return events[selected].code;
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
    if (regenerate) sequence = randomSequence();
    if (numberInput) numberInput.value = `${copy.prefix}-${yearCode()}-${dateCode()}-${eventCode()}-${sequence}`;
  }

  function labelDate() {
    const selected = preset ? preset.value : 'custom';
    if (events[selected]) return events[selected][lang].dateLabel;
    const val = dateInput ? dateInput.value : '';
    if (!val) return copy.customDate;
    try {
      return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${val}T00:00:00`));
    } catch (_) { return val; }
  }

  function applyPreset() {
    const selected = preset ? preset.value : 'custom';
    if (events[selected]) {
      if (placeInput) placeInput.value = events[selected][lang].place;
      if (dateInput) dateInput.value = events[selected].dateInput;
    }
  }

  function selectedVariant() {
    const checked = root.querySelector('[name="recordVariant"]:checked');
    return variants[checked ? checked.value : 'cinema'] || variants.cinema;
  }

  function setBg(el, primary, fallback) {
    if (!el) return;
    el.style.backgroundImage = `url('${primary}')`;
    const img = new Image();
    img.onerror = () => { el.style.backgroundImage = `url('${fallback}')`; };
    img.src = primary;
  }

  function splitLines(text) {
    return String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
  }

  function renderDocument(container) {
    if (!container) return;
    const name = nameInput ? nameInput.value.trim() : '';
    const place = placeInput ? placeInput.value.trim() : '';
    const date = labelDate();
    const number = numberInput ? numberInput.value : '';
    container.querySelector('[data-pr-project]').textContent = copy.project;
    container.querySelector('[data-pr-title]').textContent = copy.title;
    container.querySelector('[data-pr-body]').innerHTML = splitLines(copy.body).map(l => `<span>${escapeHtml(l)}</span>`).join('<br>');
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
    container.querySelector('[data-pr-closing]').innerHTML = splitLines(copy.closing).map(l => `<span>${escapeHtml(l)}</span>`).join('<br>');
    container.querySelector('[data-pr-author-role]').textContent = copy.projectAuthor;
  }

  function updatePreview() {
    updateNumber(false);
    const variant = selectedVariant();
    setBg(previewBg, variant.preview, variant.fallbackPreview);
    renderDocument($('[data-pr-preview-doc]'));
    if (printBg) printBg.src = variant.bg;
    const printImg = new Image();
    printImg.onerror = () => { if (printBg) printBg.src = variant.fallbackBg; };
    printImg.src = variant.bg;
    renderDocument(document.querySelector('[data-pr-print-doc]'));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function validate() {
    if (!placeInput || !placeInput.value.trim()) return copy.missingPlace;
    if (!dateInput || !dateInput.value) return copy.missingDate;
    return '';
  }

  codeForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = cleanCode(codeInput?.value || new URLSearchParams(location.search).get('event') || '');
    if (copy.validCodes.includes(code) || events[code]) unlock(events[code] ? code : 'custom');
    else if (status) status.textContent = copy.codeError;
  });

  root.querySelectorAll('[data-pr-unlock]').forEach(btn => btn.addEventListener('click', () => unlock(btn.dataset.prUnlock || 'custom')));
  preset?.addEventListener('change', () => { applyPreset(); sequence = randomSequence(); updatePreview(); });
  form?.addEventListener('input', updatePreview);
  form?.addEventListener('change', updatePreview);
  root.querySelector('[data-pr-regenerate]')?.addEventListener('click', () => { updateNumber(true); updatePreview(); if (status) status.textContent = copy.generated; });
  root.querySelector('[data-pr-clear]')?.addEventListener('click', () => { form?.reset(); sequence = randomSequence(); applyPreset(); updatePreview(); });
  root.querySelectorAll('[name="recordVariant"]').forEach(input => input.addEventListener('change', () => {
    root.querySelectorAll('.pr-variant-card').forEach(card => card.classList.toggle('is-selected', card.contains(input) && input.checked));
    updatePreview();
  }));
  root.querySelector('[data-pr-print]')?.addEventListener('click', () => {
    const error = validate();
    if (error) { if (status) status.textContent = error; return; }
    updatePreview();
    if (status) status.textContent = copy.print;
    window.setTimeout(() => window.print(), 150);
  });

  const urlCode = cleanCode(new URLSearchParams(location.search).get('event'));
  if (events[urlCode]) unlock(urlCode);
  else {
    generator.hidden = true;
    gate.hidden = false;
  }
})();
