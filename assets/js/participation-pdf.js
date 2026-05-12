(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root || !window.PDFLib) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const { PDFDocument } = window.PDFLib;
  const master = window.VH_DOCUMENTS?.printMaster || null;
  const preflight = window.VH_DOCUMENTS?.preflight || null;

  const COPY = {
    pl: {
      preparing: 'Przygotowuję print-master PDF…',
      ready: 'Print-master PDF został przygotowany i pobrany.',
      error: 'Nie udało się wygenerować PDF. Spróbuj ponownie albo użyj awaryjnego trybu druku.',
      retrying: 'Urządzenie ma ograniczoną pamięć. Tworzę lżejszą wersję PDF w jakości bezpiecznej.',
      missingPlace: 'Uzupełnij miejsce / instytucję.',
      missingDate: 'Uzupełnij datę wydarzenia.',
      button: 'Pobierz print-master PDF',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      title: 'ZAPIS UCZESTNICTWA',
      body: [
        'Niniejszy dokument upamiętnia udział w projekcji audiowizualnej',
        '„Rap-Ort: Prawda Sumienia”',
        '',
        'autorskim doświadczeniu muzyki, obrazu, słowa i ciszy,',
        'poświęconym pamięci, świadectwu, sumieniu',
        'oraz odpowiedzialności człowieka wobec prawdy.'
      ],
      closing: [
        'To nie jest dyplom ani dokument urzędowy.',
        'To pamiątkowy ślad chwili, w której historia',
        'staje się pytaniem, które uczestnik zabiera ze sobą.'
      ],
      forLabel: 'Dla:',
      dateLabel: 'Data wydarzenia',
      placeLabel: 'Miejsce',
      numberLabel: 'Numer dokumentu',
      authorRole: 'autor projektu',
      fallbackDate: 'Data wydarzenia',
      fallbackPlace: 'Miejsce / instytucja',
      filePrefix: 'Rap-Ort-Zapis-Uczestnictwa',
      preflightTitle: 'Kontrola jakości print-master',
      preflightReady: 'PDF engine gotowy',
      preflightBgOk: 'Tło załadowane w jakości A4',
      preflightBgLow: 'Tło załadowane, ale warto podmienić je na finalne A4 300 DPI',
      preflightLegacy: 'Używam roboczej / legacy nazwy tła. Finalne nazwy plików nadal są zalecane.',
      preflightNoBg: 'Nie znaleziono tła. PDF użyje eleganckiego tła awaryjnego.',
      preflightSignatureOk: 'Podpis autora załadowany — użyty raz w finalnym PDF',
      preflightSignatureFallback: 'Podpis SVG niedostępny — finalny PDF użyje dyskretnego podpisu tekstowego',
      preflightMobile: 'Na tym urządzeniu PDF może generować się wolniej. Najlepszy efekt: komputer / tablet.',
      printHint: 'Najlepszy efekt druku: A4 poziomo · kolor · papier matowy 250–300 gsm · wysoka jakość.',
      pdfSize: 'Rozmiar pliku',
      qualityPremium: 'print-master A4 300 DPI',
      qualitySafe: 'jakość bezpieczna dla urządzenia'
    },
    en: {
      preparing: 'Preparing print-master PDF…',
      ready: 'Print-master PDF has been prepared and downloaded.',
      error: 'Could not generate the PDF. Try again or use the fallback print mode.',
      retrying: 'This device has limited memory. Creating a lighter safe-quality PDF.',
      missingPlace: 'Enter the place / institution.',
      missingDate: 'Enter the event date.',
      button: 'Download print-master PDF',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      title: 'RECORD OF PARTICIPATION',
      body: [
        'This document commemorates participation in the audiovisual screening of',
        '“Rap-Ort: Prawda Sumienia”',
        '',
        'an authorial experience of music, image, words and silence,',
        'devoted to memory, testimony, conscience',
        'and human responsibility before truth.'
      ],
      closing: [
        'This is not an official certificate.',
        'It is a commemorative trace of a moment in which history',
        'becomes a question the participant carries forward.'
      ],
      forLabel: 'For:',
      dateLabel: 'Event date',
      placeLabel: 'Place',
      numberLabel: 'Document number',
      authorRole: 'project author',
      fallbackDate: 'Event date',
      fallbackPlace: 'Place / institution',
      filePrefix: 'Rap-Ort-Record-of-Participation',
      preflightTitle: 'Print-master quality check',
      preflightReady: 'PDF engine ready',
      preflightBgOk: 'Background loaded in A4 quality',
      preflightBgLow: 'Background loaded, but replacing it with final A4 300 DPI is recommended',
      preflightLegacy: 'Using a working / legacy background filename. Final asset filenames are still recommended.',
      preflightNoBg: 'No background found. PDF will use an elegant fallback background.',
      preflightSignatureOk: 'Author signature loaded — used once in final PDF',
      preflightSignatureFallback: 'Signature SVG unavailable — final PDF will use a discreet text fallback',
      preflightMobile: 'PDF generation may be slower on this device. Best result: desktop or tablet.',
      printHint: 'Best print result: A4 landscape · colour · matte paper 250–300 gsm · high quality.',
      pdfSize: 'File size',
      qualityPremium: 'print-master A4 300 DPI',
      qualitySafe: 'safe device quality'
    }
  };

  const FALLBACK_EVENTS = {
    syd2026: {
      code: 'SYD',
      dateInput: '2026-06-21',
      pl: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 czerwca 2026' },
      en: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 June 2026' }
    }
  };

  const FALLBACK_VARIANTS = {
    cinema: {
      layout: 'cinema',
      bgCandidates: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpeg', '/public/assets/reports/participation-record-bg-a4-300dpi.png']
    },
    museum: {
      layout: 'museum',
      bgCandidates: ['/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpeg', '/public/assets/reports/participation-record-bg-a4-300dpi2.png']
    },
    ceremonial: {
      layout: 'ceremonial',
      bgCandidates: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpeg', '/public/assets/reports/participation-record-bg-a4-300dpi3.png']
    }
  };

  const fallbackLayouts = {
    cinema: { projectY: 330, titleY: 590, titleSize: 154, titleSpacing: 14, bodyY: 790, bodySize: 60, bodyLine: 88, nameY: 1195, fieldsY: 1420, closingY: 1810, signatureY: 2075, fieldWidth: 730, signatureWidth: 890, textMaxWidth: 2100, closingMaxWidth: 1920, titleDistress: 0.16 },
    museum: { projectY: 285, titleY: 535, titleSize: 162, titleSpacing: 16, bodyY: 755, bodySize: 58, bodyLine: 86, nameY: 1145, fieldsY: 1370, closingY: 1765, signatureY: 2035, fieldWidth: 790, signatureWidth: 850, textMaxWidth: 2020, closingMaxWidth: 1860, titleDistress: 0.1 },
    ceremonial: { projectY: 320, titleY: 610, titleSize: 178, titleSpacing: 18, bodyY: 850, bodySize: 56, bodyLine: 84, nameY: 1235, fieldsY: 1465, closingY: 1845, signatureY: 2055, fieldWidth: 690, signatureWidth: 930, textMaxWidth: 1880, closingMaxWidth: 1720, titleDistress: 0.08 }
  };

  const copy = COPY[lang];
  const events = master?.events || FALLBACK_EVENTS;
  const printOutput = master?.output?.a4Landscape || { width: 841.89, height: 595.28, pixels: { width: 3508, height: 2480 }, safePixels: { width: 2480, height: 1754 } };
  const DESIGN = printOutput.pixels;
  const PDF = { width: printOutput.width, height: printOutput.height };
  const RENDER = {
    premium: { width: printOutput.pixels.width, height: printOutput.pixels.height, quality: master?.output?.jpegQuality?.premium || 0.94, label: copy.qualityPremium },
    safe: { width: printOutput.safePixels.width, height: printOutput.safePixels.height, quality: master?.output?.jpegQuality?.safe || 0.92, label: copy.qualitySafe }
  };
  const MIN_PRINT_BG = master?.output?.minPrintBackground || { width: 3000, height: 2100 };
  const SIGNATURE_PATH = master?.assets?.signature || '/public/assets/reports/author-signature-placeholder.svg';

  const imageCache = new Map();
  const $ = (sel) => root.querySelector(sel);
  const all = (sel) => [...root.querySelectorAll(sel)];
  const printButton = $('[data-pr-print]');
  if (!printButton) return;

  const premiumButton = printButton.cloneNode(true);
  premiumButton.textContent = copy.button;
  premiumButton.setAttribute('data-pr-pdf', 'true');
  printButton.replaceWith(premiumButton);

  const recommendation = $('.pr-print-recommendation');
  if (recommendation) recommendation.textContent = copy.printHint;

  const preflightPanel = createPreflightPanel();
  runPreflight();

  function status(message) {
    all('[data-pr-status]').forEach((node) => { node.textContent = message || ''; });
  }

  function field(name) {
    return root.querySelector(`[name="${name}"]`);
  }

  function getVariantDefinition(value) {
    const key = value || 'cinema';
    const docConfig = master?.documents?.participationRecord?.variants?.[key];
    const assetKey = docConfig?.assetKey || key;
    const paths = master?.assets?.participation?.[assetKey]?.a4 || FALLBACK_VARIANTS[key]?.bgCandidates || FALLBACK_VARIANTS.cinema.bgCandidates;
    return { key, layout: docConfig?.layout || FALLBACK_VARIANTS[key]?.layout || 'cinema', bgCandidates: paths };
  }

  function selectedVariant() {
    const checked = root.querySelector('[name="recordVariant"]:checked');
    return getVariantDefinition(checked ? checked.value : 'cinema');
  }

  function getLayout(name) {
    return master?.documents?.participationRecord?.layouts?.[name] || fallbackLayouts[name] || fallbackLayouts.cinema;
  }

  function eventKey() {
    const preset = field('eventPreset');
    return preset ? preset.value : 'custom';
  }

  function displayDate() {
    const key = eventKey();
    if (events[key]) return events[key][lang].dateLabel;
    const input = field('eventDate');
    const value = input ? input.value : '';
    if (!value) return copy.fallbackDate;
    try {
      return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
    } catch (_) {
      return value;
    }
  }

  function data() {
    return {
      name: field('participantName')?.value.trim() || '',
      place: field('place')?.value.trim() || '',
      dateValue: field('eventDate')?.value || '',
      date: displayDate(),
      number: field('documentNumber')?.value || '',
      variant: selectedVariant(),
      event: events[eventKey()] || null
    };
  }

  function validate(d) {
    if (!d.place) return copy.missingPlace;
    if (!d.dateValue) return copy.missingDate;
    return '';
  }

  function abs(path) {
    return new URL(path, window.location.origin).href;
  }

  function loadImage(src) {
    if (preflight?.loadImage) return preflight.loadImage(src);
    const url = abs(src);
    if (imageCache.has(url)) return imageCache.get(url);
    const promise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ img, url, path: src, src });
      img.onerror = () => resolve(null);
      img.src = url;
    });
    imageCache.set(url, promise);
    return promise;
  }

  async function resolveImage(candidates) {
    if (preflight?.resolveFirst) return preflight.resolveFirst(candidates);
    for (let index = 0; index < candidates.length; index += 1) {
      const loaded = await loadImage(candidates[index]);
      if (loaded) return { ...loaded, index };
    }
    return null;
  }

  function createPreflightPanel() {
    const anchor = $('.pr-print-recommendation');
    const panel = document.createElement('div');
    panel.className = 'pr-preflight';
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = `<strong>${copy.preflightTitle}</strong><ul></ul>`;
    anchor?.insertAdjacentElement('afterend', panel);
    return panel;
  }

  function renderPreflight(items) {
    if (!preflightPanel) return;
    const list = preflightPanel.querySelector('ul');
    list.innerHTML = items.map((item) => `<li class="${item.level}"><span aria-hidden="true"></span>${item.text}</li>`).join('');
  }

  async function runPreflight() {
    const items = [{ level: 'ok', text: copy.preflightReady }];
    const variant = selectedVariant();
    const bg = await resolveImage(variant.bgCandidates);
    if (!bg) {
      items.push({ level: 'warn', text: copy.preflightNoBg });
    } else {
      const size = preflight?.imageSize ? preflight.imageSize(bg) : { width: bg.img.naturalWidth || bg.img.width, height: bg.img.naturalHeight || bg.img.height };
      const goodSize = preflight?.meetsMinimum ? preflight.meetsMinimum(bg, MIN_PRINT_BG) : size.width >= MIN_PRINT_BG.width && size.height >= MIN_PRINT_BG.height;
      items.push({ level: goodSize ? 'ok' : 'warn', text: `${goodSize ? copy.preflightBgOk : copy.preflightBgLow} (${size.width} × ${size.height}px)` });
      if (bg.index > 0) items.push({ level: 'warn', text: copy.preflightLegacy });
    }
    const signature = await loadImage(SIGNATURE_PATH);
    items.push({ level: signature ? 'ok' : 'warn', text: signature ? copy.preflightSignatureOk : copy.preflightSignatureFallback });
    const constrained = preflight?.constrainedDevice ? preflight.constrainedDevice() : Number(navigator.deviceMemory || 8) <= 3;
    if (constrained) items.push({ level: 'warn', text: copy.preflightMobile });
    renderPreflight(items);
  }

  function drawCover(ctx, img, size) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(size.width / iw, size.height / ih);
    const sw = size.width / scale;
    const sh = size.height / scale;
    ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, size.width, size.height);
  }

  function drawFallbackBackground(ctx, size) {
    const grad = ctx.createLinearGradient(0, 0, size.width, size.height);
    grad.addColorStop(0, '#050403');
    grad.addColorStop(0.5, '#17110c');
    grad.addColorStop(1, '#080605');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.scale(size.width / DESIGN.width, size.height / DESIGN.height);
    ctx.strokeStyle = 'rgba(231,211,174,.48)';
    ctx.lineWidth = 8;
    ctx.strokeRect(150, 150, DESIGN.width - 300, DESIGN.height - 300);
    ctx.strokeStyle = 'rgba(231,211,174,.18)';
    ctx.lineWidth = 3;
    ctx.strokeRect(210, 210, DESIGN.width - 420, DESIGN.height - 420);
    ctx.restore();
  }

  function font(size, family = 'Georgia', weight = '400', style = 'normal') {
    return `${style} ${weight} ${Math.round(size)}px ${family}`;
  }

  function drawSpacedText(ctx, text, x, y, spacing, align = 'center') {
    const chars = [...text];
    const widths = chars.map((char) => ctx.measureText(char).width);
    const total = widths.reduce((sum, width) => sum + width, 0) + spacing * Math.max(0, chars.length - 1);
    let cursor = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
    chars.forEach((char, i) => {
      ctx.fillText(char, cursor, y);
      cursor += widths[i] + spacing;
    });
  }

  function drawCenteredLines(ctx, lines, x, y, lineHeight) {
    lines.forEach((line, index) => {
      if (line === '') return;
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawPremiumTitle(ctx, text, x, y, size, spacing, distress) {
    ctx.save();
    ctx.font = font(size, 'Georgia', '500');
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,244,214,.18)';
    drawSpacedText(ctx, text, x + 5, y + 8, spacing);
    ctx.strokeStyle = 'rgba(86,62,28,.42)';
    ctx.lineWidth = 3.2;
    drawSpacedText(ctx, text, x, y, spacing);
    const grad = ctx.createLinearGradient(0, y - size, 0, y + size * 0.45);
    grad.addColorStop(0, '#fff2cc');
    grad.addColorStop(0.45, '#e3c282');
    grad.addColorStop(1, '#9d7236');
    ctx.fillStyle = grad;
    drawSpacedText(ctx, text, x, y, spacing);
    if (distress) {
      ctx.globalAlpha = Math.min(0.22, distress);
      ctx.fillStyle = '#120d08';
      const width = ctx.measureText(text).width + spacing * text.length;
      for (let i = 0; i < 120; i += 1) {
        const px = x - width / 2 + Math.random() * width;
        const py = y - size * 0.72 + Math.random() * size * 0.88;
        ctx.fillRect(px, py, Math.random() * 3 + 0.8, Math.random() * 1.8 + 0.6);
      }
    }
    ctx.restore();
  }

  function drawField(ctx, label, value, x, y, width) {
    ctx.strokeStyle = 'rgba(232,206,150,.48)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x + width / 2, y);
    ctx.stroke();
    ctx.font = font(38, 'Arial', '400');
    ctx.fillStyle = 'rgba(232,206,150,.72)';
    ctx.textAlign = 'center';
    drawSpacedText(ctx, label.toUpperCase(), x, y + 56, 4);
    ctx.font = font(54, 'Georgia', '400');
    ctx.fillStyle = '#f2e4c7';
    const lines = wrapText(ctx, value, width - 20).slice(0, 2);
    drawCenteredLines(ctx, lines, x, y + 126, 58);
  }

  async function drawSignature(ctx, x, y, maxWidth) {
    const signature = await loadImage(SIGNATURE_PATH);
    if (signature?.img) {
      const img = signature.img;
      const ratio = (img.naturalHeight || img.height) / (img.naturalWidth || img.width);
      const width = maxWidth;
      const height = Math.min(width * ratio, 170);
      ctx.drawImage(img, x - width / 2, y, width, height);
      return height;
    }
    ctx.font = font(70, 'Georgia', '400', 'italic');
    ctx.fillStyle = '#e7d3ae';
    ctx.textAlign = 'center';
    ctx.fillText('Piotr Jakub Lichwała', x, y + 72);
    return 90;
  }

  function drawEventAccent(ctx, d, l) {
    if (!d.event?.accent) return;
    ctx.save();
    ctx.font = font(28, 'Arial', '400');
    ctx.fillStyle = 'rgba(232,206,150,.38)';
    ctx.textAlign = 'right';
    const accent = d.event.accent;
    const line = `${accent.edition || ''} · ${accent.code || ''}`.replace(/^ · | · $/g, '');
    drawSpacedText(ctx, line.toUpperCase(), DESIGN.width - 245, DESIGN.height - 178, 3, 'right');
    ctx.textAlign = 'left';
    drawSpacedText(ctx, (accent.microLine || '').toUpperCase(), 245, DESIGN.height - 178, 3, 'left');
    ctx.restore();
  }

  async function renderCanvas(d, render) {
    const canvas = document.createElement('canvas');
    canvas.width = render.width;
    canvas.height = render.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas not supported');

    const bg = await resolveImage(d.variant.bgCandidates);
    if (bg?.img) drawCover(ctx, bg.img, render);
    else drawFallbackBackground(ctx, render);

    ctx.save();
    ctx.scale(render.width / DESIGN.width, render.height / DESIGN.height);
    const l = getLayout(d.variant.layout);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    drawEventAccent(ctx, d, l);

    ctx.font = font(48, 'Georgia');
    ctx.fillStyle = 'rgba(232,206,150,.84)';
    drawSpacedText(ctx, copy.project, DESIGN.width / 2, l.projectY, 13);

    drawPremiumTitle(ctx, copy.title, DESIGN.width / 2, l.titleY, l.titleSize, l.titleSpacing, l.titleDistress);

    ctx.font = font(l.bodySize, 'Georgia');
    ctx.fillStyle = 'rgba(244,232,205,.92)';
    const bodyLines = [];
    copy.body.forEach((line) => {
      if (!line) bodyLines.push('');
      else bodyLines.push(...wrapText(ctx, line, l.textMaxWidth));
    });
    drawCenteredLines(ctx, bodyLines, DESIGN.width / 2, l.bodyY, l.bodyLine);

    if (d.name) {
      ctx.font = font(60, 'Georgia');
      ctx.fillStyle = '#f3dfb7';
      ctx.fillText(`${copy.forLabel} ${d.name}`, DESIGN.width / 2, l.nameY, l.textMaxWidth);
    }

    const fieldsX = [DESIGN.width * 0.255, DESIGN.width * 0.5, DESIGN.width * 0.745];
    drawField(ctx, copy.dateLabel, d.date, fieldsX[0], l.fieldsY, l.fieldWidth);
    drawField(ctx, copy.placeLabel, d.place || copy.fallbackPlace, fieldsX[1], l.fieldsY, l.fieldWidth);
    drawField(ctx, copy.numberLabel, d.number, fieldsX[2], l.fieldsY, l.fieldWidth);

    ctx.font = font(l.closingSize || 54, 'Georgia');
    ctx.fillStyle = 'rgba(244,232,205,.86)';
    const closingLines = [];
    copy.closing.forEach((line) => closingLines.push(...wrapText(ctx, line, l.closingMaxWidth)));
    drawCenteredLines(ctx, closingLines, DESIGN.width / 2, l.closingY, (l.closingSize || 54) * 1.45);

    const signHeight = await drawSignature(ctx, DESIGN.width / 2, l.signatureY, l.signatureWidth);
    ctx.font = font(38, 'Arial');
    ctx.fillStyle = 'rgba(232,206,150,.74)';
    drawSpacedText(ctx, copy.authorRole.toUpperCase(), DESIGN.width / 2, l.signatureY + signHeight + 62, 5);
    ctx.restore();

    return canvas;
  }

  function canvasToJpegBytes(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas export failed'));
        blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer))).catch(reject);
      }, 'image/jpeg', quality);
    });
  }

  function safeFileName(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
  }

  function download(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  function formatBytes(bytes) {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(mb >= 10 ? 1 : 2)} MB`;
  }

  async function buildPdf(d, render) {
    const canvas = await renderCanvas(d, render);
    const jpgBytes = await canvasToJpegBytes(canvas, render.quality);
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle(`${copy.title} — ${d.number}`);
    pdfDoc.setAuthor('Piotr Jakub Lichwała / Vibrosław');
    pdfDoc.setSubject('Rap-Ort: Prawda Sumienia — Participation Record');
    pdfDoc.setCreator('Veritas Humanum Print Master');
    pdfDoc.setProducer('Veritas Humanum client-side print-master PDF generator');
    const page = pdfDoc.addPage([PDF.width, PDF.height]);
    const image = await pdfDoc.embedJpg(jpgBytes);
    page.drawImage(image, { x: 0, y: 0, width: PDF.width, height: PDF.height });
    return pdfDoc.save({ useObjectStreams: true });
  }

  async function createPdf() {
    const d = data();
    const error = validate(d);
    if (error) {
      status(error);
      return;
    }
    premiumButton.disabled = true;
    try {
      status(copy.preparing);
      await runPreflight();
      let render = RENDER.premium;
      let bytes;
      try {
        bytes = await buildPdf(d, render);
      } catch (err) {
        console.warn('Print-master render failed, retrying safe render.', err);
        render = RENDER.safe;
        status(copy.retrying);
        bytes = await buildPdf(d, render);
      }
      const filename = `${copy.filePrefix}-${safeFileName(d.number)}.pdf`;
      download(bytes, filename);
      status(`${copy.ready} ${copy.pdfSize}: ${formatBytes(bytes.byteLength)} · ${render.label}.`);
      const finale = $('[data-pr-finale]');
      if (finale) {
        finale.hidden = false;
        finale.textContent = lang === 'pl'
          ? 'Dokument został przygotowany jako pamiątkowy artefakt doświadczenia Rap-Ort: Prawda Sumienia.'
          : 'The document has been prepared as a commemorative artefact of the Rap-Ort: Prawda Sumienia experience.';
      }
    } catch (err) {
      console.error(err);
      status(copy.error);
    } finally {
      premiumButton.disabled = false;
    }
  }

  root.addEventListener('change', (event) => {
    if (event.target?.matches('[name="recordVariant"], [name="eventPreset"]')) runPreflight();
  });
  premiumButton.addEventListener('click', createPdf);
})();
