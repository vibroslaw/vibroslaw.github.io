(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const copy = {
    pl: {
      validCodes: ['syd2026', 'sumienie'],
      codeError: 'Kod nie został rozpoznany. Sprawdź kod z QR lub wpisz kod wydarzenia pokazany po projekcji.',
      unlocked: 'Dostęp uczestnika został odblokowany. Możesz utworzyć Zapis Uczestnictwa.',
      generated: 'Nowy numer dokumentu został wygenerowany.',
      preparing: 'Przygotowuję dokument do zapisu. Ładuję tło i warstwę tekstu…',
      print: 'Dokument został przygotowany. W nowym oknie wybierz „Drukuj” lub „Zapisz jako PDF”.',
      popupBlocked: 'Nie udało się otworzyć okna zapisu. Zezwól na wyskakujące okna dla tej strony i spróbuj ponownie.',
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
      prefix: 'VH-ZU',
      printWindowTitle: 'Zapis Uczestnictwa — Rap-Ort',
      printButton: 'Drukuj / zapisz jako PDF',
      finalThanks: 'Dziękujemy za udział w doświadczeniu Rap-Ort: Prawda Sumienia.'
    },
    en: {
      validCodes: ['syd2026', 'conscience'],
      codeError: 'The code was not recognised. Check the QR code or enter the event code shown after the screening.',
      unlocked: 'Participant access unlocked. You can create your Record of Participation.',
      generated: 'New document number generated.',
      preparing: 'Preparing your document. Loading background and text layer…',
      print: 'Your document is ready. In the new window, choose “Print” or “Save as PDF”.',
      popupBlocked: 'Could not open the save window. Allow pop-ups for this site and try again.',
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
      prefix: 'VH-REC',
      printWindowTitle: 'Record of Participation — Rap-Ort',
      printButton: 'Print / save as PDF',
      finalThanks: 'Thank you for participating in the Rap-Ort: Prawda Sumienia experience.'
    }
  }[lang];

  const events = {
    syd2026: {
      code: 'SYD',
      dateInput: '2026-06-21',
      pl: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 czerwca 2026', badgeLine: 'Międzynarodowa projekcja' },
      en: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 June 2026', badgeLine: 'International screening' }
    }
  };

  const variants = {
    cinema: {
      layout: 'cinema',
      bgCandidates: [
        '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi.jpeg'
      ],
      previewCandidates: [
        '/public/assets/reports/participation-record-bg-01-archival-cinema-preview.webp',
        '/public/assets/reports/participation-record-bg-preview.webp',
        '/public/assets/reports/participation-record-bg-a4-300dpi.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi.jpeg'
      ]
    },
    museum: {
      layout: 'museum',
      bgCandidates: [
        '/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi2.jpeg'
      ],
      previewCandidates: [
        '/public/assets/reports/participation-record-bg-02-museum-line-preview.webp',
        '/public/assets/reports/participation-record-bg-preview2.webp',
        '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi2.jpeg'
      ]
    },
    ceremonial: {
      layout: 'ceremonial',
      bgCandidates: [
        '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi3.jpeg'
      ],
      previewCandidates: [
        '/public/assets/reports/participation-record-bg-03-ceremonial-frame-preview.webp',
        '/public/assets/reports/participation-record-bg-preview3.webp',
        '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi3.jpeg'
      ]
    }
  };

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
  const previewBg = $('[data-pr-preview-bg]');
  const eventBadge = $('[data-pr-event-badge]');

  let currentEventKey = 'custom';
  let sequence = randomSequence();
  const imageCache = new Map();

  function setStatus(message) { statusNodes.forEach((node) => { node.textContent = message || ''; }); }
  function randomSequence() { return String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0'); }
  function cleanCode(value) { return String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, ''); }
  function absoluteUrl(path) { return new URL(path, window.location.origin).href; }
  function escapeHtml(value) { return String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function splitLines(text) { return String(text || '').split('\n').map(line => line.trim()).filter(Boolean); }

  function dateCode() {
    const val = dateInput ? dateInput.value : '';
    if (!val) return '0000';
    const parts = val.split('-');
    return parts.length === 3 ? `${parts[1]}${parts[2]}` : '0000';
  }

  function yearCode() {
    const val = dateInput ? dateInput.value : '';
    return (val && val.split('-')[0]) || new Date().getFullYear();
  }

  function eventCode() {
    const selected = preset ? preset.value : currentEventKey;
    if (events[selected]) return events[selected].code;
    const letters = (placeInput ? placeInput.value : '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    return letters || 'CUSTOM';
  }

  function storageKey() { return `vhParticipationNumber:${lang}:${currentEventKey}:${dateCode()}:${eventCode()}`; }
  function loadOrCreateSequence() {
    const stored = localStorage.getItem(storageKey());
    if (stored && /^\d{4}$/.test(stored)) return stored;
    const next = randomSequence();
    localStorage.setItem(storageKey(), next);
    return next;
  }
  function saveSequence(value) { localStorage.setItem(storageKey(), value); }

  function updateNumber(regenerate = false) {
    if (regenerate) { sequence = randomSequence(); saveSequence(sequence); }
    if (numberInput) numberInput.value = `${copy.prefix}-${yearCode()}-${dateCode()}-${eventCode()}-${sequence}`;
  }

  function labelDate() {
    const selected = preset ? preset.value : currentEventKey;
    if (events[selected]) return events[selected][lang].dateLabel;
    const val = dateInput ? dateInput.value : '';
    if (!val) return copy.customDate;
    try { return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${val}T00:00:00`)); }
    catch (_) { return val; }
  }

  function applyPreset() {
    currentEventKey = preset ? preset.value : currentEventKey;
    if (events[currentEventKey]) {
      if (placeInput) placeInput.value = events[currentEventKey][lang].place;
      if (dateInput) dateInput.value = events[currentEventKey].dateInput;
    }
  }

  function updateEventBadge() {
    if (!eventBadge) return;
    const selected = preset ? preset.value : currentEventKey;
    const eventData = events[selected];
    if (!eventData) { eventBadge.hidden = true; eventBadge.innerHTML = ''; return; }
    eventBadge.hidden = false;
    eventBadge.innerHTML = `<strong>${escapeHtml(eventData[lang].place)}</strong><span>${escapeHtml(eventData[lang].dateLabel)}</span><span>${escapeHtml(eventData[lang].badgeLine)}</span>`;
  }

  function selectedVariant() {
    const checked = root.querySelector('[name="recordVariant"]:checked');
    return variants[checked ? checked.value : 'cinema'] || variants.cinema;
  }

  function testImage(path) {
    const url = absoluteUrl(path);
    if (imageCache.has(url)) return imageCache.get(url);
    const promise = new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve('');
      img.src = url;
    });
    imageCache.set(url, promise);
    return promise;
  }

  async function resolveFirstImage(candidates) {
    for (const candidate of candidates) {
      const resolved = await testImage(candidate);
      if (resolved) return resolved;
    }
    return '';
  }

  function setPreviewBackground(candidates) {
    if (!previewBg) return;
    previewBg.style.backgroundImage = 'linear-gradient(135deg, #0b0907, #19140e)';
    resolveFirstImage(candidates).then(url => { if (url) previewBg.style.backgroundImage = `url('${url}')`; });
  }

  function setLayout(container, layout) {
    if (!container) return;
    container.classList.remove('layout-cinema', 'layout-museum', 'layout-ceremonial');
    container.classList.add(`layout-${layout}`);
  }

  function getDocumentData() {
    return {
      name: nameInput ? nameInput.value.trim() : '',
      place: placeInput ? placeInput.value.trim() : '',
      date: labelDate(),
      number: numberInput ? numberInput.value : '',
      variant: selectedVariant()
    };
  }

  function renderDocument(container) {
    if (!container) return;
    const data = getDocumentData();
    container.querySelector('[data-pr-project]').textContent = copy.project;
    container.querySelector('[data-pr-title]').textContent = copy.title;
    container.querySelector('[data-pr-body]').innerHTML = splitLines(copy.body).map(l => `<span>${escapeHtml(l)}</span>`).join('<br>');
    const forEl = container.querySelector('[data-pr-for]');
    if (forEl) { forEl.hidden = !data.name; forEl.innerHTML = data.name ? `${copy.forLabel} <strong>${escapeHtml(data.name)}</strong>` : ''; }
    container.querySelector('[data-pr-date-label]').textContent = copy.dateLabel;
    container.querySelector('[data-pr-date]').textContent = data.date;
    container.querySelector('[data-pr-place-label]').textContent = copy.placeLabel;
    container.querySelector('[data-pr-place]').textContent = data.place || copy.customPlace;
    container.querySelector('[data-pr-number-label]').textContent = copy.numberLabel;
    container.querySelector('[data-pr-number]').textContent = data.number;
    container.querySelector('[data-pr-closing]').innerHTML = splitLines(copy.closing).map(l => `<span>${escapeHtml(l)}</span>`).join('<br>');
    container.querySelector('[data-pr-author-role]').textContent = copy.projectAuthor;
  }

  function updatePreview() {
    updateNumber(false);
    updateEventBadge();
    const variant = selectedVariant();
    const previewDoc = $('[data-pr-preview-doc]');
    setPreviewBackground(variant.previewCandidates);
    setLayout(previewDoc, variant.layout);
    renderDocument(previewDoc);
  }

  function validate() {
    if (!placeInput || !placeInput.value.trim()) return copy.missingPlace;
    if (!dateInput || !dateInput.value) return copy.missingDate;
    return '';
  }

  function documentHtml(data, backgroundUrl) {
    const bodyLines = splitLines(copy.body).map(line => `<span>${escapeHtml(line)}</span>`).join('<br>');
    const closingLines = splitLines(copy.closing).map(line => `<span>${escapeHtml(line)}</span>`).join('<br>');
    const nameBlock = data.name ? `<p class="for-line">${copy.forLabel} <strong>${escapeHtml(data.name)}</strong></p>` : '';
    const bg = backgroundUrl ? `<img class="bg" src="${backgroundUrl}" alt="">` : '<div class="bg-fallback"></div>';
    const signature = absoluteUrl('/public/assets/reports/author-signature-placeholder.svg');
    const layout = `layout-${data.variant.layout}`;

    return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${copy.printWindowTitle}</title><style>
@page{size:A4 landscape;margin:0}html,body{margin:0;padding:0;background:#050403;color:#ead8b4}body{width:297mm;height:210mm;overflow:hidden}.toolbar{position:fixed;z-index:10;top:12px;left:12px;right:12px;display:flex;justify-content:center;font:13px Arial,sans-serif}.toolbar button{border:1px solid rgba(231,211,174,.35);border-radius:999px;padding:10px 16px;background:#17120d;color:#ead8b4;cursor:pointer}.page{position:relative;width:297mm;height:210mm;overflow:hidden;background:#080807}.bg,.bg-fallback{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.bg-fallback{background:radial-gradient(circle at 50% 35%,rgba(231,211,174,.12),transparent 42%),linear-gradient(135deg,#060504,#17110c)}.content{position:absolute;inset:24mm 32mm;display:flex;flex-direction:column;align-items:center;text-align:center;font-family:Georgia,'Times New Roman',serif}.project{font-size:12px;letter-spacing:.42em;text-transform:uppercase;opacity:.88;margin:0 0 9mm}.title{font-size:42px;letter-spacing:.22em;text-transform:uppercase;font-weight:500;margin:0 0 9mm}.body{max-width:205mm;font-size:17px;line-height:1.55;margin:0 auto 6mm;color:rgba(244,232,205,.9)}.for-line{font-size:15px;letter-spacing:.08em;margin:1mm 0 5mm;color:#f3dfb7}.fields{display:grid;grid-template-columns:repeat(3,1fr);gap:12mm;width:215mm;margin:7mm auto}.field{border-top:1px solid rgba(232,206,150,.42);padding-top:3mm;min-width:0}.field span{display:block;font:10px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(232,206,150,.62);margin-bottom:2mm}.field strong{font-size:14px;font-weight:400;color:#f2e4c7;overflow-wrap:anywhere}.closing{margin-top:auto;max-width:205mm;font-size:14px;line-height:1.5;color:rgba(244,232,205,.84)}.author{margin-top:4mm;display:flex;flex-direction:column;align-items:center;gap:1mm}.author img{width:66mm;max-height:19mm;object-fit:contain}.author strong{font-size:12px;font-weight:400;color:#f4e5c7}.author span{font:10px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(232,206,150,.66)}.layout-cinema.content{inset:26mm 32mm 20mm}.layout-museum.content{inset:23mm 31mm}.layout-museum .fields{width:220mm}.layout-ceremonial.content{inset:27mm 36mm 22mm}.layout-ceremonial .title{font-size:46px;margin-bottom:10mm}.layout-ceremonial .body{max-width:190mm}.layout-ceremonial .closing{max-width:190mm}@media print{.toolbar{display:none!important}html,body{width:297mm;height:210mm}}
</style></head><body><div class="toolbar"><button type="button" onclick="window.print()">${copy.printButton}</button></div><main class="page">${bg}<section class="content ${layout}"><p class="project">${copy.project}</p><h1 class="title">${copy.title}</h1><p class="body">${bodyLines}</p>${nameBlock}<div class="fields"><div class="field"><span>${copy.dateLabel}</span><strong>${escapeHtml(data.date)}</strong></div><div class="field"><span>${copy.placeLabel}</span><strong>${escapeHtml(data.place || copy.customPlace)}</strong></div><div class="field"><span>${copy.numberLabel}</span><strong>${escapeHtml(data.number)}</strong></div></div><p class="closing">${closingLines}</p><div class="author"><img src="${signature}" alt=""><strong>Piotr Jakub Lichwała</strong><span>${copy.projectAuthor}</span></div></section></main></body></html>`;
  }

  async function openPrintWindow() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { setStatus(copy.popupBlocked); return false; }
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${copy.printWindowTitle}</title></head><body style="margin:0;background:#070604;color:#ead8b4;font-family:Georgia,serif;display:grid;place-items:center;height:100vh;text-align:center"><p>${copy.preparing}</p></body></html>`);
    printWindow.document.close();
    const data = getDocumentData();
    const backgroundUrl = await resolveFirstImage(data.variant.bgCandidates);
    printWindow.document.open();
    printWindow.document.write(documentHtml(data, backgroundUrl));
    printWindow.document.close();
    printWindow.focus();
    return true;
  }

  function handleUnlock(code) {
    const clean = cleanCode(code);
    if (events[clean]) return unlock(clean);
    if (copy.validCodes.includes(clean)) return unlock('custom');
    return setStatus(copy.codeError);
  }

  function unlock(eventKey) {
    currentEventKey = events[eventKey] ? eventKey : 'custom';
    gate.hidden = true;
    generator.hidden = false;
    if (preset) preset.value = currentEventKey;
    applyPreset();
    sequence = loadOrCreateSequence();
    updateNumber(false);
    updatePreview();
    setStatus(copy.unlocked);
  }

  codeForm?.addEventListener('submit', event => { event.preventDefault(); handleUnlock(codeInput?.value || new URLSearchParams(location.search).get('event') || ''); });
  root.querySelectorAll('[data-pr-unlock]').forEach(btn => btn.addEventListener('click', () => unlock(btn.dataset.prUnlock || 'custom')));
  preset?.addEventListener('change', () => { applyPreset(); sequence = loadOrCreateSequence(); updatePreview(); });
  form?.addEventListener('input', updatePreview);
  form?.addEventListener('change', updatePreview);
  root.querySelector('[data-pr-regenerate]')?.addEventListener('click', () => { updateNumber(true); updatePreview(); setStatus(copy.generated); });
  root.querySelector('[data-pr-clear]')?.addEventListener('click', () => { form?.reset(); currentEventKey = preset ? preset.value : 'custom'; applyPreset(); sequence = loadOrCreateSequence(); updatePreview(); });
  root.querySelectorAll('[name="recordVariant"]').forEach(input => input.addEventListener('change', () => { root.querySelectorAll('.pr-variant-card').forEach(card => card.classList.toggle('is-selected', card.contains(input) && input.checked)); updatePreview(); }));
  root.querySelector('[data-pr-print]')?.addEventListener('click', async () => {
    const error = validate();
    if (error) { setStatus(error); return; }
    updatePreview();
    setStatus(copy.preparing);
    const opened = await openPrintWindow();
    if (opened) setStatus(copy.print);
    const finale = $('[data-pr-finale]');
    if (finale) { finale.hidden = false; finale.textContent = copy.finalThanks; }
  });

  const urlCode = cleanCode(new URLSearchParams(location.search).get('event') || new URLSearchParams(location.search).get('key'));
  if (events[urlCode]) unlock(urlCode);
  else { generator.hidden = true; gate.hidden = false; }
})();
