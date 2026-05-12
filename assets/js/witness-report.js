(() => {
  const root = document.querySelector('[data-witness-report]');
  if (!root || !window.PDFLib) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const { PDFDocument } = window.PDFLib;
  const master = window.VH_DOCUMENTS?.printMaster || null;
  const preflight = window.VH_DOCUMENTS?.preflight || null;
  const output = master?.output?.a4Portrait || { width: 595.28, height: 841.89, pixels: { width: 2480, height: 3508 }, safePixels: { width: 1754, height: 2480 } };
  const W = output.pixels.width;
  const H = output.pixels.height;
  const PW = output.width;
  const PH = output.height;
  const MIN_BG = { width: 2200, height: 3100 };
  const imageCache = new Map();
  const lockedCopy = master?.documents?.witnessReport?.copy?.[lang] || {};

  const C = lang === 'pl' ? {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'RAPORT ŚWIADKA',
    button: 'Pobierz Raport Świadka PDF',
    preparing: 'Przygotowuję archiwalny Raport Świadka…',
    ready: 'Raport Świadka został przygotowany i pobrany.',
    error: 'Nie udało się wygenerować Raportu Świadka. Spróbuj ponownie.',
    missing: 'Wpisz kilka słów, które zostają po projekcji.',
    name: 'Imię i nazwisko',
    date: 'Data',
    place: 'Miejsce',
    number: 'Numer raportu',
    reflectionLabel: lockedCopy.reflectionLabel || 'Kilka słów, które zostają po projekcji',
    signature: lockedCopy.signature || 'Podpis świadka doświadczenia',
    microprint: lockedCopy.microprint || 'Raport Świadka · osobisty dokument refleksji · Veritas Humanum',
    fallbackName: 'Świadek doświadczenia',
    fallbackPlace: 'Miejsce wydarzenia',
    file: 'Rap-Ort-Raport-Swiadka',
    finale: 'Raport Świadka został zachowany jako osobisty ślad refleksji.',
    preflightTitle: 'Kontrola jakości Raportu',
    preflightReady: 'PDF engine gotowy',
    preflightBgOk: 'Tło raportu załadowane w jakości A4',
    preflightBgLow: 'Tło raportu załadowane, ale finalne A4 300 DPI jest zalecane',
    preflightBgMissing: 'Nie znaleziono tła raportu — użyję jasnego tła awaryjnego',
    preflightQuote: 'Myśl przewodnia wybrana',
    printHint: 'Najlepszy efekt: A4 pionowo · papier matowy 160–250 gsm · spokojny, archiwalny wydruk.'
  } : {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'WITNESS REPORT',
    button: 'Download Witness Report PDF',
    preparing: 'Preparing archival Witness Report…',
    ready: 'Witness Report has been prepared and downloaded.',
    error: 'Could not generate the Witness Report. Try again.',
    missing: 'Write a few words that remain after the screening.',
    name: 'Name',
    date: 'Date',
    place: 'Place',
    number: 'Report number',
    reflectionLabel: lockedCopy.reflectionLabel || 'A few words that remain after the screening',
    signature: lockedCopy.signature || 'Signature of the witness to the experience',
    microprint: lockedCopy.microprint || 'Witness Report · personal reflection document · Veritas Humanum',
    fallbackName: 'Witness to the experience',
    fallbackPlace: 'Event place',
    file: 'Rap-Ort-Witness-Report',
    finale: 'The Witness Report has been preserved as a personal trace of reflection.',
    preflightTitle: 'Report quality check',
    preflightReady: 'PDF engine ready',
    preflightBgOk: 'Report background loaded in A4 quality',
    preflightBgLow: 'Report background loaded, but final A4 300 DPI is recommended',
    preflightBgMissing: 'No report background found — using an elegant fallback background',
    preflightQuote: 'Starting thought selected',
    printHint: 'Best result: A4 portrait · matte paper 160–250 gsm · calm archival print.'
  };

  const fallbackEvents = { syd2026: { code: 'SYD', dateInput: '2026-06-21', pl: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 czerwca 2026' }, en: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 June 2026' } } };
  const events = master?.events || fallbackEvents;
  const configQuotes = master?.documents?.witnessReport?.quotes?.[lang] || [];
  const fallbackQuotes = lang === 'pl' ? [
    { id: 'truth-trace', text: 'Prawda nie kończy się na ekranie. Zostaje w pytaniu, które człowiek zabiera ze sobą.', source: 'Veritas Humanum — ślad po projekcji' },
    { id: 'silence', text: 'Cisza po świadectwie nie jest pustką. To miejsce, w którym zaczyna pracować sumienie.', source: 'Rap-Ort — refleksja autorska' },
    { id: 'question-remains', text: 'Świadectwo zostało wypowiedziane. Teraz pytanie zostaje przy Tobie.', source: 'Veritas Humanum — pytanie końcowe' }
  ] : [
    { id: 'truth-trace', text: 'Truth does not end on the screen. It remains in the question a human being carries forward.', source: 'Veritas Humanum — post-screening trace' },
    { id: 'silence', text: 'The silence after testimony is not empty. It is the place where conscience begins to work.', source: 'Rap-Ort — authorial reflection' },
    { id: 'question-remains', text: 'The testimony has been spoken. Now the question remains with you.', source: 'Veritas Humanum — final question' }
  ];
  const quotes = configQuotes.length ? configQuotes : fallbackQuotes;
  const bgCandidates = master?.assets?.witnessReport?.archivalPaper?.a4 || ['/public/assets/reports/witness-report-bg-01-archival-paper-a4.jpg', '/public/assets/reports/witness-report-bg-a4-300dpi.jpg', '/public/assets/reports/witness-report-bg-a4-300dpi.jpeg', '/public/assets/reports/witness-report-bg-a4-300dpi.png'];

  const $ = (s) => root.querySelector(s);
  const f = (n) => root.querySelector(`[name="${n}"]`);
  const form = $('[data-wr-form]');
  const button = $('[data-wr-download]');
  const status = $('[data-wr-status]');
  const finale = $('[data-wr-finale]');
  const preview = $('[data-wr-preview]');
  const counter = $('[data-wr-counter]');

  if (button) button.textContent = C.button;
  const recommendation = document.createElement('p');
  recommendation.className = 'wr-print-recommendation';
  recommendation.textContent = C.printHint;
  button?.closest('.wr-actions')?.insertAdjacentElement('afterend', recommendation);
  const preflightPanel = createPreflightPanel();

  function setStatus(message) { if (status) status.textContent = message || ''; }
  function abs(path) { return new URL(path, window.location.origin).href; }
  function escapeHtml(value) { return String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function font(size, family = 'Georgia', weight = '400', style = 'normal') { return `${style} ${weight} ${Math.round(size)}px ${family}`; }

  function loadImage(path) {
    if (preflight?.loadImage) return preflight.loadImage(path);
    const url = abs(path);
    if (imageCache.has(url)) return imageCache.get(url);
    const promise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ img, url, path });
      img.onerror = () => resolve(null);
      img.src = url;
    });
    imageCache.set(url, promise);
    return promise;
  }

  async function resolveImage(paths) {
    if (preflight?.resolveFirst) return preflight.resolveFirst(paths);
    for (let i = 0; i < paths.length; i += 1) {
      const loaded = await loadImage(paths[i]);
      if (loaded) return { ...loaded, index: i };
    }
    return null;
  }

  function createPreflightPanel() {
    const panel = document.createElement('div');
    panel.className = 'wr-preflight';
    panel.innerHTML = `<strong>${C.preflightTitle}</strong><ul></ul>`;
    recommendation.insertAdjacentElement('afterend', panel);
    return panel;
  }

  function renderPreflight(items) {
    const list = preflightPanel?.querySelector('ul');
    if (!list) return;
    list.innerHTML = items.map((item) => `<li class="${item.level}"><span aria-hidden="true"></span>${item.text}</li>`).join('');
  }

  async function runPreflight() {
    const items = [{ level: 'ok', text: C.preflightReady }, { level: 'ok', text: C.preflightQuote }];
    const bg = await resolveImage(bgCandidates);
    if (!bg) items.push({ level: 'warn', text: C.preflightBgMissing });
    else {
      const size = preflight?.imageSize ? preflight.imageSize(bg) : { width: bg.img.naturalWidth || bg.img.width, height: bg.img.naturalHeight || bg.img.height };
      const ok = size.width >= MIN_BG.width && size.height >= MIN_BG.height;
      items.push({ level: ok ? 'ok' : 'warn', text: `${ok ? C.preflightBgOk : C.preflightBgLow} (${size.width} × ${size.height}px)` });
    }
    renderPreflight(items);
  }

  function eventKey() { return f('eventPreset')?.value || 'custom'; }
  function selectedQuote() { const value = f('quote')?.value; return quotes.find((q) => q.id === value) || quotes[0]; }
  function randomSequence() { return String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0'); }
  function reportNumber() {
    const key = `vhWitnessReport:${lang}:${eventKey()}`;
    let stored = localStorage.getItem(key);
    if (!stored) {
      const year = (f('eventDate')?.value || new Date().getFullYear()).toString().slice(0, 4);
      const code = events[eventKey()]?.code || 'CUSTOM';
      stored = `VH-WR-${year}-${code}-${randomSequence()}`;
      localStorage.setItem(key, stored);
    }
    return stored;
  }

  function dateLabel() {
    const key = eventKey();
    if (events[key]) return events[key][lang].dateLabel;
    const value = f('eventDate')?.value || '';
    if (!value) return lang === 'pl' ? 'Data wydarzenia' : 'Event date';
    try { return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`)); }
    catch (_) { return value; }
  }

  function data() {
    const key = eventKey();
    return {
      quote: selectedQuote(),
      reflection: f('reflection')?.value.trim() || '',
      name: f('participantName')?.value.trim() || C.fallbackName,
      place: f('place')?.value.trim() || events[key]?.[lang].place || C.fallbackPlace,
      date: dateLabel(),
      number: reportNumber()
    };
  }

  function applyPreset() {
    const event = events[eventKey()];
    if (event) {
      if (f('place')) f('place').value = event[lang].place;
      if (f('eventDate')) f('eventDate').value = event.dateInput || event.date;
    }
    renderPreview();
    runPreflight();
  }

  function renderPreview() {
    const d = data();
    if (counter) counter.textContent = `${d.reflection.length}/280`;
    if (!preview) return;
    preview.querySelector('[data-wr-project]').textContent = C.project;
    preview.querySelector('[data-wr-title]').textContent = C.title;
    preview.querySelector('[data-wr-quote]').innerHTML = `“${escapeHtml(d.quote.text)}”<br><small>${escapeHtml(d.quote.source)}</small>`;
    preview.querySelector('[data-wr-reflection]').textContent = d.reflection || C.reflectionLabel;
    preview.querySelector('[data-wr-name-label]').textContent = C.name;
    preview.querySelector('[data-wr-name]').textContent = d.name;
    preview.querySelector('[data-wr-date-label]').textContent = C.date;
    preview.querySelector('[data-wr-date]').textContent = d.date;
    preview.querySelector('[data-wr-place-label]').textContent = C.place;
    preview.querySelector('[data-wr-place]').textContent = d.place;
    preview.querySelector('[data-wr-number-label]').textContent = C.number;
    preview.querySelector('[data-wr-number]').textContent = d.number;
    preview.querySelector('[data-wr-signature]').textContent = C.signature;
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawCenteredLines(ctx, lines, x, y, lineHeight) { lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight)); }
  function drawCover(ctx, img) { const iw = img.naturalWidth || img.width; const ih = img.naturalHeight || img.height; const scale = Math.max(W / iw, H / ih); const sw = W / scale; const sh = H / scale; ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, W, H); }
  function drawFallback(ctx) { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#f3ead4'); g.addColorStop(0.5, '#dccda9'); g.addColorStop(1, '#f0e3c3'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(55,38,18,.28)'; ctx.lineWidth = 9; ctx.strokeRect(150, 150, W - 300, H - 300); ctx.strokeStyle = 'rgba(55,38,18,.14)'; ctx.lineWidth = 3; ctx.strokeRect(210, 210, W - 420, H - 420); }
  function drawMeta(ctx, label, value, x, y, width) { ctx.strokeStyle = 'rgba(66,46,22,.28)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - width / 2, y); ctx.lineTo(x + width / 2, y); ctx.stroke(); ctx.font = font(34, 'Arial'); ctx.fillStyle = 'rgba(66,46,22,.52)'; ctx.fillText(label.toUpperCase(), x, y + 54); ctx.font = font(48, 'Georgia'); ctx.fillStyle = '#2a1d11'; ctx.fillText(value, x, y + 118, width); }

  async function renderCanvas(d) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { alpha: false });
    const bg = await resolveImage(bgCandidates);
    if (bg?.img) drawCover(ctx, bg.img); else drawFallback(ctx);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#24180d';
    ctx.font = font(46, 'Georgia');
    ctx.fillText(C.project, W / 2, 330);
    ctx.font = font(128, 'Georgia', '500');
    ctx.fillText(C.title, W / 2, 535);

    ctx.font = font(58, 'Georgia', '400', 'italic');
    ctx.fillStyle = '#2b2015';
    const qLines = wrapText(ctx, `“${d.quote.text}”`, 1780);
    drawCenteredLines(ctx, qLines, W / 2, 760, 82);
    ctx.font = font(38, 'Arial');
    ctx.fillStyle = 'rgba(44,31,18,.62)';
    ctx.fillText(d.quote.source, W / 2, 760 + qLines.length * 82 + 22);

    ctx.strokeStyle = 'rgba(66,46,22,.22)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(420, 1195); ctx.lineTo(2060, 1195); ctx.moveTo(420, 1965); ctx.lineTo(2060, 1965); ctx.stroke();
    ctx.font = font(38, 'Arial');
    ctx.fillStyle = 'rgba(66,46,22,.48)';
    ctx.fillText(C.reflectionLabel.toUpperCase(), W / 2, 1270);
    ctx.font = font(55, 'Courier New', '400');
    ctx.fillStyle = '#24180d';
    drawCenteredLines(ctx, wrapText(ctx, d.reflection, 1640).slice(0, 7), W / 2, 1395, 78);

    drawMeta(ctx, C.name, d.name, 720, 2195, 720);
    drawMeta(ctx, C.date, d.date, 1760, 2195, 720);
    drawMeta(ctx, C.place, d.place, 720, 2490, 720);
    drawMeta(ctx, C.number, d.number, 1760, 2490, 720);

    ctx.strokeStyle = 'rgba(66,46,22,.32)'; ctx.beginPath(); ctx.moveTo(620, 2930); ctx.lineTo(1860, 2930); ctx.stroke();
    ctx.font = font(38, 'Arial'); ctx.fillStyle = 'rgba(66,46,22,.56)'; ctx.fillText(C.signature.toUpperCase(), W / 2, 3000);
    ctx.font = font(26, 'Arial'); ctx.fillStyle = 'rgba(66,46,22,.38)'; ctx.fillText(C.microprint.toUpperCase(), W / 2, 3275);
    return canvas;
  }

  const canvasJpg = (canvas) => new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? blob.arrayBuffer().then((x) => resolve(new Uint8Array(x))).catch(reject) : reject(new Error('Canvas export failed')), 'image/jpeg', master?.output?.jpegQuality?.premium || 0.94));
  function safe(text) { return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120); }
  function download(bytes, name) { const blob = new Blob([bytes], { type: 'application/pdf' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000); }

  async function createPdf() {
    const d = data();
    if (!d.reflection) { setStatus(C.missing); return; }
    button.disabled = true;
    try {
      setStatus(C.preparing);
      await runPreflight();
      const canvas = await renderCanvas(d);
      const jpg = await canvasJpg(canvas);
      const pdf = await PDFDocument.create();
      pdf.setTitle(`${C.title} — ${d.number}`);
      pdf.setAuthor('Piotr Jakub Lichwała / Vibrosław');
      pdf.setCreator('Veritas Humanum Witness Report Engine');
      pdf.setSubject('Rap-Ort: Prawda Sumienia — Witness Report');
      const page = pdf.addPage([PW, PH]);
      const image = await pdf.embedJpg(jpg);
      page.drawImage(image, { x: 0, y: 0, width: PW, height: PH });
      const bytes = await pdf.save({ useObjectStreams: true });
      download(bytes, `${C.file}-${safe(d.number)}.pdf`);
      setStatus(C.ready);
      if (finale) { finale.hidden = false; finale.textContent = C.finale; }
    } catch (e) {
      console.error(e);
      setStatus(C.error);
    } finally {
      button.disabled = false;
    }
  }

  form?.addEventListener('input', renderPreview);
  form?.addEventListener('change', () => { applyPreset(); renderPreview(); });
  button?.addEventListener('click', createPdf);
  applyPreset(); renderPreview(); runPreflight();
})();
