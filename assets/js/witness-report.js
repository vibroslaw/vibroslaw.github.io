(() => {
  const root = document.querySelector('[data-witness-report]');
  if (!root || !window.PDFLib) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const { PDFDocument, rgb, StandardFonts } = window.PDFLib;

  const PAGE = {
    pxW: 2480,
    pxH: 3508,
    ptW: 595.28,
    ptH: 841.89
  };

  const ASSETS = {
    background: [
      '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/witness-report-bg-a4.jpg',
      '/public/assets/reports/witness-report-bg-01-archival-paper-a4.jpg',
      '/public/assets/reports/witness-report-bg-a4-300dpi.png'
    ],
    texture: ['/public/assets/reports/witness-report-paper-texture.webp'],
    titlePlate: {
      pl: '/public/assets/reports/title-plates/title-raport-swiadka-dark.svg',
      en: '/public/assets/reports/title-plates/title-witness-report-dark.svg'
    }
  };

  const FONT_PATHS = {
    title: '/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf',
    body: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Regular.ttf',
    bodyItalic: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Italic.ttf',
    quoteItalic: '/public/assets/fonts/print/eb-garamond/EBGaramond-Italic.ttf',
    meta: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-Regular.ttf',
    metaBold: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-SemiBold.ttf',
    mono: '/public/assets/fonts/print/ibm-plex-mono/IBMPlexMono-Regular.ttf',
    typewriter: '/public/assets/fonts/print/courier-prime/CourierPrime-Regular.ttf'
  };

  const C = lang === 'pl' ? {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'RAPORT ŚWIADKA',
    archiveTitle: 'ANONIMOWY RAPORT ŚWIADKA',
    button: 'Pobierz Raport Świadka PDF',
    archiveButton: 'Zarchiwizuj anonimową wersję JPG',
    preparing: 'Przygotowuję finalny Raport Świadka jako print-master PDF…',
    archivePreparing: 'Przygotowuję anonimową wersję JPG do archiwum wydarzenia…',
    ready: 'Raport Świadka został przygotowany jako finalny print-master PDF.',
    archiveReady: 'Anonimowa wersja JPG została przygotowana. Plik nie zawiera imienia, nazwiska ani podpisu.',
    error: 'Nie udało się wygenerować Raportu Świadka. Sprawdź konsolę lub spróbuj ponownie.',
    archiveError: 'Nie udało się wygenerować anonimowego JPG. Spróbuj ponownie.',
    missing: 'Wpisz kilka słów, które zostają po projekcji.',
    name: 'Imię i nazwisko',
    date: 'Data',
    place: 'Miejsce',
    number: 'Numer raportu',
    signature: 'Podpis świadka doświadczenia',
    archiveNumber: 'Numer archiwalny',
    fallbackName: 'Świadek doświadczenia',
    fallbackPlace: 'Miejsce wydarzenia',
    file: 'Rap-Ort-Raport-Swiadka',
    archiveFile: 'raport-swiadka-anon',
    finale: 'Raport Świadka został zachowany jako osobisty ślad refleksji.',
    archiveFinale: 'Możesz przekazać ten anonimowy JPG prowadzącemu, jeśli ma trafić do statycznego archiwum wydarzenia.',
    microprint: 'To nie jest test wiedzy ani dokument urzędowy. To osobisty ślad refleksji po projekcji.',
    archiveMicroprint: 'Wersja archiwalna anonimowa · bez imienia, nazwiska, podpisu i danych osobowych.',
    fontFallback: 'Uwaga: użyto awaryjnych fontów PDF. Dla finalnej jakości sprawdź lokalne pliki fontów.'
  } : {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'WITNESS REPORT',
    archiveTitle: 'ANONYMOUS WITNESS REPORT',
    button: 'Download Witness Report PDF',
    archiveButton: 'Archive anonymous JPG version',
    preparing: 'Preparing the final Witness Report print-master PDF…',
    archivePreparing: 'Preparing the anonymous archive JPG for this event…',
    ready: 'Witness Report has been prepared as a final print-master PDF.',
    archiveReady: 'Anonymous JPG version has been prepared. The file contains no name, surname or signature.',
    error: 'Could not generate the Witness Report. Check the console or try again.',
    archiveError: 'Could not generate the anonymous JPG. Try again.',
    missing: 'Write a few words that remain after the screening.',
    name: 'Name',
    date: 'Date',
    place: 'Place',
    number: 'Report number',
    signature: 'Signature of the witness to the experience',
    archiveNumber: 'Archive number',
    fallbackName: 'Witness to the experience',
    fallbackPlace: 'Event place',
    file: 'Rap-Ort-Witness-Report',
    archiveFile: 'witness-report-anon',
    finale: 'The Witness Report has been preserved as a personal trace of reflection.',
    archiveFinale: 'You may pass this anonymous JPG to the facilitator if it should become part of the static event archive.',
    microprint: 'This is not a knowledge test or an official document. It is a personal trace of reflection after the screening.',
    archiveMicroprint: 'Anonymous archive version · no name, surname, signature or personal data.',
    fontFallback: 'Note: PDF fallback fonts were used. For final quality, check local font files.'
  };

  const events = {
    oswiecim20260525: {
      code: 'OSW',
      date: '2026-05-25',
      pl: { place: 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu', label: '25 maja 2026' },
      en: { place: 'Małopolska State University named after Cavalry Captain Witold Pilecki in Oświęcim', label: '25 May 2026' }
    },
    syd2026: {
      code: 'SYD',
      date: '2026-06-21',
      pl: { place: 'Polish Club Ashfield / Sydney', label: '21 czerwca 2026' },
      en: { place: 'Polish Club Ashfield / Sydney', label: '21 June 2026' }
    }
  };

  const quotes = lang === 'pl' ? [
    ['pilecki-life', 'Starałem się tak żyć, abym w godzinie śmierci mógł się raczej cieszyć niż lękać.', 'Witold Pilecki — cytat przypisywany'],
    ['truth-trace', 'Prawda nie kończy się na ekranie. Zostaje w decyzji, którą człowiek podejmuje później.', 'Veritas Humanum — ślad po projekcji'],
    ['silence', 'Cisza po świadectwie nie jest pustką. Jest miejscem, w którym zaczyna pracować sumienie.', 'Rap-Ort — refleksja autorska']
  ] : [
    ['pilecki-life', 'I tried to live in such a way that in the hour of death I could rejoice rather than fear.', 'Witold Pilecki — attributed quote'],
    ['truth-trace', 'Truth does not end on the screen. It remains in the decision a human being makes afterwards.', 'Veritas Humanum — post-screening trace'],
    ['silence', 'The silence after testimony is not empty. It is the place where conscience begins to work.', 'Rap-Ort — authorial reflection'],
    ['question-remains', 'The testimony has been spoken. Now the question remains with you.', 'Veritas Humanum — final question']
  ];

  const $ = (selector) => root.querySelector(selector);
  const f = (name) => root.querySelector(`[name="${name}"]`);
  const button = $('[data-wr-download]');
  const archiveButton = $('[data-wr-archive]');
  const status = $('[data-wr-status]');
  const finale = $('[data-wr-finale]');
  const preview = $('[data-wr-preview]');
  const counter = $('[data-wr-counter]');
  const form = $('[data-wr-form]');

  if (button) button.textContent = C.button;
  if (archiveButton) archiveButton.textContent = C.archiveButton;

  const setStatus = (message) => { if (status) status.textContent = message || ''; };
  const abs = (path) => new URL(path, window.location.origin).href;
  const q = () => quotes.find((item) => item[0] === f('quote')?.value) || quotes[0];
  const eventKey = () => f('eventPreset')?.value || 'custom';
  const x = (px) => px * (PAGE.ptW / PAGE.pxW);
  const y = (px) => PAGE.ptH - px * (PAGE.ptH / PAGE.pxH);
  const s = (px) => px * (PAGE.ptW / PAGE.pxW);

  function stripDiacritics(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/Ł/g, 'L')
      .replace(/ł/g, 'l');
  }

  function safeForFont(value, fonts) {
    return fonts.custom ? String(value || '') : stripDiacritics(value);
  }

  async function fetchBytes(path) {
    const response = await fetch(abs(path), { cache: 'no-store' });
    if (!response.ok) throw new Error(`Missing asset: ${path}`);
    return new Uint8Array(await response.arrayBuffer());
  }

  async function firstBytes(paths) {
    for (const path of paths.filter(Boolean)) {
      try { return { path, bytes: await fetchBytes(path) }; } catch (_) {}
    }
    return null;
  }

  async function loadImage(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = abs(path);
    });
  }

  async function firstImage(paths) {
    for (const path of paths.filter(Boolean)) {
      const img = await loadImage(path);
      if (img) return img;
    }
    return null;
  }

  function reportNumber() {
    const key = `vhWitnessReport:${lang}:${eventKey()}`;
    let value = localStorage.getItem(key);
    if (!value) {
      const year = (f('eventDate')?.value || String(new Date().getFullYear())).slice(0, 4);
      const code = events[eventKey()]?.code || 'CUSTOM';
      value = `VH-WR-${year}-${code}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      localStorage.setItem(key, value);
    }
    return value;
  }

  function dateLabel() {
    const event = events[eventKey()];
    if (event) return event[lang].label;
    const value = f('eventDate')?.value;
    if (!value) return lang === 'pl' ? 'Data wydarzenia' : 'Event date';
    try {
      return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
    } catch (_) { return value; }
  }

  function data() {
    return {
      quote: q(),
      reflection: f('reflection')?.value.trim() || '',
      name: f('participantName')?.value.trim() || C.fallbackName,
      place: f('place')?.value.trim() || events[eventKey()]?.[lang].place || C.fallbackPlace,
      date: dateLabel(),
      number: reportNumber(),
      eventKey: eventKey()
    };
  }

  function applyPreset() {
    const event = events[eventKey()];
    if (event) {
      if (f('place')) f('place').value = event[lang].place;
      if (f('eventDate')) f('eventDate').value = event.date;
    }
    renderPreview();
  }

  function initFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const event = params.get('event');
    const select = f('eventPreset');
    if (event && select && [...select.options].some((option) => option.value === event)) select.value = event;
    const recordLink = root.querySelector('[data-wr-participation-link]');
    if (recordLink && select?.value) {
      const base = lang === 'pl' ? '/rap-ort/uczestnictwo/' : '/rap-ort/participation/';
      recordLink.setAttribute('href', `${base}?event=${encodeURIComponent(select.value)}`);
    }
  }

  function esc(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function renderPreview() {
    const d = data();
    if (counter) counter.textContent = `${d.reflection.length}/280`;
    if (!preview) return;
    preview.querySelector('[data-wr-project]').textContent = C.project;
    preview.querySelector('[data-wr-title]').textContent = C.title;
    preview.querySelector('[data-wr-quote]').innerHTML = `“${esc(d.quote[1])}”<br><small>${esc(d.quote[2])}</small>`;
    preview.querySelector('[data-wr-reflection]').textContent = d.reflection || (lang === 'pl' ? 'Kilka słów, które zostają po projekcji' : 'A few words that remain after the screening');
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

  function drawFallbackPaper(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, PAGE.pxW, PAGE.pxH);
    gradient.addColorStop(0, '#f4e8cc');
    gradient.addColorStop(0.5, '#d7c79f');
    gradient.addColorStop(1, '#efe4c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, PAGE.pxW, PAGE.pxH);
    ctx.strokeStyle = 'rgba(66,46,22,.22)';
    ctx.lineWidth = 7;
    ctx.strokeRect(150, 150, PAGE.pxW - 300, PAGE.pxH - 300);
    ctx.strokeStyle = 'rgba(66,46,22,.12)';
    ctx.lineWidth = 3;
    ctx.strokeRect(210, 210, PAGE.pxW - 420, PAGE.pxH - 420);
  }

  async function composeBackgroundCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = PAGE.pxW;
    canvas.height = PAGE.pxH;
    const ctx = canvas.getContext('2d', { alpha: false });
    const eventBg = eventKey() === 'oswiecim20260525'
      ? ['/public/assets/events/rap-ort/oswiecim20260525/backgrounds/witness-report-bg-a4.jpg']
      : [];
    const background = await firstImage([...eventBg, ...ASSETS.background]);
    if (background) ctx.drawImage(background, 0, 0, PAGE.pxW, PAGE.pxH);
    else drawFallbackPaper(ctx);

    const texture = await firstImage(ASSETS.texture);
    if (texture) {
      ctx.save();
      ctx.globalAlpha = 0.13;
      const pattern = ctx.createPattern(texture, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, PAGE.pxW, PAGE.pxH);
      }
      ctx.restore();
    }

    ctx.save();
    const veil = ctx.createRadialGradient(PAGE.pxW / 2, PAGE.pxH * 0.47, 130, PAGE.pxW / 2, PAGE.pxH * 0.47, 1450);
    veil.addColorStop(0, 'rgba(255,250,236,.16)');
    veil.addColorStop(1, 'rgba(255,250,236,0)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, PAGE.pxW, PAGE.pxH);
    ctx.restore();
    return canvas;
  }

  async function composeBackgroundBytes() {
    const canvas = await composeBackgroundCanvas();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.96));
    return new Uint8Array(await blob.arrayBuffer());
  }

  async function loadFonts(pdfDoc) {
    const kit = window.fontkit || window.Fontkit;
    if (!kit || !pdfDoc.registerFontkit) throw new Error('fontkit unavailable');
    pdfDoc.registerFontkit(kit);
    const load = async (path) => {
      try { return await pdfDoc.embedFont(await fetchBytes(path), { subset: true }); }
      catch (err) { console.warn(`Witness Report font unavailable: ${path}`, err); return null; }
    };
    const body = await load(FONT_PATHS.body);
    const meta = await load(FONT_PATHS.meta);
    const fallback = body || meta;
    if (!fallback) throw new Error('custom fonts unavailable');
    return {
      custom: true,
      title: await load(FONT_PATHS.title) || fallback,
      body: body || fallback,
      bodyItalic: await load(FONT_PATHS.bodyItalic) || body || fallback,
      quoteItalic: await load(FONT_PATHS.quoteItalic) || await load(FONT_PATHS.bodyItalic) || body || fallback,
      meta: meta || fallback,
      metaBold: await load(FONT_PATHS.metaBold) || meta || fallback,
      mono: await load(FONT_PATHS.mono) || meta || fallback,
      typewriter: await load(FONT_PATHS.typewriter) || body || fallback
    };
  }

  async function fallbackFonts(pdfDoc) {
    return {
      custom: false,
      title: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
      body: await pdfDoc.embedFont(StandardFonts.TimesRoman),
      bodyItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
      quoteItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
      meta: await pdfDoc.embedFont(StandardFonts.Helvetica),
      metaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      mono: await pdfDoc.embedFont(StandardFonts.Courier),
      typewriter: await pdfDoc.embedFont(StandardFonts.Courier)
    };
  }

  function wrap(text, font, size, maxWidth, fonts) {
    const words = safeForFont(text, fonts).split(/\s+/).filter(Boolean);
    const lines = [];
    let lineText = '';
    words.forEach((word) => {
      const test = lineText ? `${lineText} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && lineText) { lines.push(lineText); lineText = word; }
      else lineText = test;
    });
    if (lineText) lines.push(lineText);
    return lines;
  }

  function drawCentered(page, text, font, size, centerX, baselineY, color, fonts) {
    const value = safeForFont(text, fonts);
    const width = font.widthOfTextAtSize(value, size);
    page.drawText(value, { x: centerX - width / 2, y: baselineY, size, font, color });
  }

  function drawWrappedCentered(page, text, font, size, centerX, startY, maxWidth, color, lineHeight, fonts, maxLines = 99) {
    const lines = wrap(text, font, size, maxWidth, fonts).slice(0, maxLines);
    lines.forEach((lineText, index) => {
      const width = font.widthOfTextAtSize(lineText, size);
      page.drawText(lineText, { x: centerX - width / 2, y: startY - index * lineHeight, size, font, color });
    });
    return lines.length;
  }

  function line(page, x1, y1, x2, y2, color, thickness = 0.6) {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, color, thickness });
  }

  async function svgToPngBytes(svgBytes, width, height) {
    const svgText = new TextDecoder('utf-8').decode(svgBytes);
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      return new Uint8Array(await png.arrayBuffer());
    } finally { URL.revokeObjectURL(url); }
  }

  async function embedTitlePlate(pdfDoc) {
    const eventPlate = eventKey() === 'oswiecim20260525'
      ? `/public/assets/events/rap-ort/oswiecim20260525/title-plates/${lang === 'pl' ? 'title-raport-swiadka-dark.svg' : 'title-witness-report-dark.svg'}`
      : null;
    const asset = await firstBytes([eventPlate, ASSETS.titlePlate[lang]]);
    if (!asset) return null;
    try {
      const pngBytes = asset.path.toLowerCase().endsWith('.svg') ? await svgToPngBytes(asset.bytes, 2400, 520) : asset.bytes;
      return await pdfDoc.embedPng(pngBytes);
    } catch (err) {
      console.warn('Witness Report title plate unavailable.', err);
      return null;
    }
  }

  function drawMetaField(page, label, value, cx, topY, width, fonts, colors) {
    line(page, cx - width / 2, topY, cx + width / 2, topY, colors.line, 0.55);
    drawCentered(page, String(label).toUpperCase(), fonts.metaBold, s(22), cx, topY - s(44), colors.muted, fonts);
    drawWrappedCentered(page, value, fonts.body, s(34), cx, topY - s(98), width - s(30), colors.ink, s(44), fonts, 2);
  }

  async function buildPdf(d) {
    const pdfDoc = await PDFDocument.create();
    let fonts;
    try { fonts = await loadFonts(pdfDoc); }
    catch (err) { console.warn('Witness Report custom fonts unavailable.', err); fonts = await fallbackFonts(pdfDoc); setStatus(C.fontFallback); }

    pdfDoc.setTitle(`${C.title} — ${d.number}`);
    pdfDoc.setAuthor('Piotr Jakub Lichwała / Vibrosław');
    pdfDoc.setSubject('Rap-Ort: Prawda Sumienia — Witness Report');
    pdfDoc.setCreator('Veritas Humanum Witness Report Final Master');
    pdfDoc.setProducer('Veritas Humanum local browser PDF generator');

    const page = pdfDoc.addPage([PAGE.ptW, PAGE.ptH]);
    const bgBytes = await composeBackgroundBytes();
    const bg = await pdfDoc.embedJpg(bgBytes);
    page.drawImage(bg, { x: 0, y: 0, width: PAGE.ptW, height: PAGE.ptH });

    const colors = { ink: rgb(0.15, 0.09, 0.045), soft: rgb(0.23, 0.16, 0.09), muted: rgb(0.39, 0.29, 0.18), line: rgb(0.46, 0.34, 0.2), faint: rgb(0.54, 0.43, 0.28) };
    const cx = PAGE.ptW / 2;
    drawCentered(page, C.project, fonts.metaBold, s(39), cx, y(335), colors.muted, fonts);

    const plate = await embedTitlePlate(pdfDoc);
    if (plate) {
      const width = x(1580);
      const height = width * (plate.height / plate.width);
      page.drawImage(plate, { x: cx - width / 2, y: y(560) - height / 2, width, height });
    } else drawCentered(page, C.title, fonts.title, s(112), cx, y(555), colors.ink, fonts);

    drawWrappedCentered(page, `“${d.quote[1]}”`, fonts.quoteItalic, s(50), cx, y(780), x(1670), colors.soft, s(74), fonts, 4);
    drawCentered(page, d.quote[2], fonts.meta, s(29), cx, y(1038), colors.muted, fonts);
    line(page, x(470), y(1195), x(2010), y(1195), colors.line, 0.45);
    line(page, x(470), y(1945), x(2010), y(1945), colors.line, 0.45);

    let reflectionSize = s(46);
    let reflectionLines = wrap(d.reflection, fonts.typewriter, reflectionSize, x(1600), fonts);
    while (reflectionLines.length > 8 && reflectionSize > s(36)) {
      reflectionSize -= s(2);
      reflectionLines = wrap(d.reflection, fonts.typewriter, reflectionSize, x(1600), fonts);
    }
    reflectionLines.slice(0, 8).forEach((lineText, index) => {
      const width = fonts.typewriter.widthOfTextAtSize(lineText, reflectionSize);
      page.drawText(lineText, { x: cx - width / 2, y: y(1340) - index * s(72), size: reflectionSize, font: fonts.typewriter, color: colors.ink });
    });

    drawMetaField(page, C.name, d.name, x(720), y(2190), x(760), fonts, colors);
    drawMetaField(page, C.date, d.date, x(1760), y(2190), x(760), fonts, colors);
    drawMetaField(page, C.place, d.place, x(720), y(2485), x(760), fonts, colors);
    drawMetaField(page, C.number, d.number, x(1760), y(2485), x(760), fonts, colors);
    line(page, x(620), y(2920), x(1860), y(2920), colors.line, 0.65);
    drawCentered(page, C.signature.toUpperCase(), fonts.meta, s(31), cx, y(2992), colors.muted, fonts);
    drawWrappedCentered(page, C.microprint.toUpperCase(), fonts.meta, s(18), cx, y(3308), x(1750), colors.faint, s(28), fonts, 2);
    return pdfDoc.save({ useObjectStreams: true });
  }

  function wrapCanvas(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';
    words.forEach((word) => {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) { lines.push(current); current = word; }
      else current = test;
    });
    if (current) lines.push(current);
    return lines;
  }

  function drawCanvasCentered(ctx, text, yPx, maxWidth, lineHeight, maxLines = 99) {
    const lines = wrapCanvas(ctx, text, maxWidth).slice(0, maxLines);
    lines.forEach((lineText, index) => ctx.fillText(lineText, PAGE.pxW / 2, yPx + index * lineHeight));
    return lines.length;
  }

  function drawCanvasMeta(ctx, label, value, cx, yTop, width) {
    ctx.strokeStyle = 'rgba(74,52,29,.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, yTop);
    ctx.lineTo(cx + width / 2, yTop);
    ctx.stroke();
    ctx.fillStyle = 'rgba(70,48,27,.7)';
    ctx.font = '700 42px Arial, sans-serif';
    ctx.fillText(label.toUpperCase(), cx, yTop + 78);
    ctx.fillStyle = '#24180d';
    ctx.font = '44px Georgia, serif';
    drawCanvasCentered(ctx, value, yTop + 138, width - 40, 58, 2);
  }

  async function buildAnonymousArchiveJpg(d) {
    const canvas = await composeBackgroundCanvas();
    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = 'rgba(66,46,22,.72)';
    ctx.font = '700 44px Arial, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText(C.project, PAGE.pxW / 2, 340);

    ctx.fillStyle = '#21160d';
    ctx.font = '700 118px Georgia, serif';
    drawCanvasCentered(ctx, C.archiveTitle, 570, 1580, 130, 2);

    ctx.fillStyle = '#2c1f13';
    ctx.font = 'italic 58px Georgia, serif';
    drawCanvasCentered(ctx, `“${d.quote[1]}”`, 820, 1680, 82, 4);
    ctx.fillStyle = 'rgba(62,43,25,.72)';
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText(d.quote[2], PAGE.pxW / 2, 1060);

    ctx.strokeStyle = 'rgba(74,52,29,.45)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(470, 1220); ctx.lineTo(2010, 1220); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(470, 1970); ctx.lineTo(2010, 1970); ctx.stroke();

    ctx.fillStyle = '#1d140b';
    ctx.font = '54px "Courier New", Courier, monospace';
    const reflectionLines = wrapCanvas(ctx, d.reflection, 1620).slice(0, 8);
    reflectionLines.forEach((lineText, index) => ctx.fillText(lineText, PAGE.pxW / 2, 1390 + index * 76));

    drawCanvasMeta(ctx, C.date, d.date, 720, 2240, 760);
    drawCanvasMeta(ctx, C.place, d.place, 1760, 2240, 760);
    drawCanvasMeta(ctx, C.archiveNumber, d.number, PAGE.pxW / 2, 2580, 1160);

    ctx.fillStyle = 'rgba(70,48,27,.58)';
    ctx.font = '31px Arial, sans-serif';
    drawCanvasCentered(ctx, C.archiveMicroprint.toUpperCase(), 3310, 1700, 44, 2);

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.94));
  }

  function safeFile(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
  }

  function downloadPdf(bytes, name) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    downloadBlob(blob, name);
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  async function createPdf() {
    const d = data();
    if (!d.reflection) { setStatus(C.missing); return; }
    button.disabled = true;
    try {
      setStatus(C.preparing);
      const bytes = await buildPdf(d);
      downloadPdf(bytes, `${C.file}-${safeFile(d.number)}.pdf`);
      setStatus(`${C.ready} ${(bytes.byteLength / 1024 / 1024).toFixed(2)} MB.`);
      if (finale) { finale.hidden = false; finale.textContent = C.finale; }
    } catch (error) {
      console.error(error);
      setStatus(C.error);
    } finally { button.disabled = false; }
  }

  async function createAnonymousArchive() {
    const d = data();
    if (!d.reflection) { setStatus(C.missing); return; }
    if (archiveButton) archiveButton.disabled = true;
    try {
      setStatus(C.archivePreparing);
      const blob = await buildAnonymousArchiveJpg(d);
      const prefix = d.eventKey === 'oswiecim20260525' ? 'wr-osw20260525-anon' : C.archiveFile;
      downloadBlob(blob, `${prefix}-${safeFile(d.number)}.jpg`);
      setStatus(`${C.archiveReady} ${(blob.size / 1024 / 1024).toFixed(2)} MB.`);
      if (finale) { finale.hidden = false; finale.textContent = C.archiveFinale; }
    } catch (error) {
      console.error(error);
      setStatus(C.archiveError);
    } finally {
      if (archiveButton) archiveButton.disabled = false;
    }
  }

  form?.addEventListener('input', renderPreview);
  form?.addEventListener('change', () => { applyPreset(); renderPreview(); });
  button?.addEventListener('click', createPdf);
  archiveButton?.addEventListener('click', createAnonymousArchive);
  initFromQuery();
  applyPreset();
  renderPreview();
})();
