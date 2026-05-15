(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const master = window.VH_DOCUMENTS?.printMaster || {};

  const TEXT = {
    pl: {
      preparing: 'Przygotowuję wektorowy print-master PDF…',
      ready: 'Print-master PDF został przygotowany i pobrany.',
      missingPlace: 'Uzupełnij miejsce / instytucję.',
      missingDate: 'Uzupełnij datę wydarzenia.',
      error: 'Nie udało się wygenerować PDF. Sprawdź konsolę błędów albo spróbuj ponownie.',
      button: 'Pobierz A4 print-master',
      wallButton: 'Pobierz A3 Wall Edition',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      title: 'ZAPIS UCZESTNICTWA',
      forLabel: 'Dla:',
      dateLabel: 'Data wydarzenia',
      placeLabel: 'Miejsce',
      numberLabel: 'Numer dokumentu',
      authorRole: 'autor projektu',
      fallbackPlace: 'Miejsce / instytucja',
      filePrefix: 'Rap-Ort-Zapis-Uczestnictwa',
      wallFilePrefix: 'Rap-Ort-Zapis-Uczestnictwa-Wall-Edition',
      preflightTitle: 'Kontrola jakości print-master',
      vectorOk: 'Tryb vector text aktywny — tekst PDF nie jest obrazem',
      fontOk: 'Fonty osadzone lokalnie',
      fontMissing: 'Fonty / fontkit niedostępne — zostanie użyty bezpieczny fallback',
      bgNative: 'Tło natywne dla wybranego formatu',
      bgUpscaled: 'Tło działa, ale A3 może użyć powiększonego A4',
      bgMissing: 'Nie znaleziono tła — PDF użyje awaryjnego tła wektorowego',
      titleOk: 'Title plate osadzony w PDF',
      titleMissing: 'Title plate niedostępny — użyję tytułu tekstowego',
      signatureOk: 'Podpis autora osadzony w PDF',
      signatureMissing: 'Finalny podpis niedostępny — użyję podpisu tekstowego',
      pdfSize: 'Rozmiar pliku'
    },
    en: {
      preparing: 'Preparing vector print-master PDF…',
      ready: 'Print-master PDF has been prepared and downloaded.',
      missingPlace: 'Enter the place / institution.',
      missingDate: 'Enter the event date.',
      error: 'Could not generate the PDF. Check the console or try again.',
      button: 'Download A4 print-master',
      wallButton: 'Download A3 Wall Edition',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      title: 'RECORD OF PARTICIPATION',
      forLabel: 'For:',
      dateLabel: 'Event date',
      placeLabel: 'Place',
      numberLabel: 'Document number',
      authorRole: 'project author',
      fallbackPlace: 'Place / institution',
      filePrefix: 'Rap-Ort-Record-of-Participation',
      wallFilePrefix: 'Rap-Ort-Record-of-Participation-Wall-Edition',
      preflightTitle: 'Print-master quality check',
      vectorOk: 'Vector text mode active — PDF text is not a flat image',
      fontOk: 'Local fonts embedded',
      fontMissing: 'Fonts / fontkit unavailable — safe fallback will be used',
      bgNative: 'Native background available for selected format',
      bgUpscaled: 'Background works, but A3 may use an enlarged A4 asset',
      bgMissing: 'No background found — PDF will use vector fallback background',
      titleOk: 'Title plate embedded in PDF',
      titleMissing: 'Title plate unavailable — using text title fallback',
      signatureOk: 'Author signature embedded in PDF',
      signatureMissing: 'Final signature unavailable — using text fallback signature',
      pdfSize: 'File size'
    }
  }[lang];

  const outputs = master.output || {};
  const a4Output = outputs.a4Landscape || { width: 841.89, height: 595.28, pixels: { width: 3508, height: 2480 } };
  const a3Output = outputs.a3Landscape || { width: 1190.55, height: 841.89, pixels: { width: 4961, height: 3508 } };
  const design = a4Output.pixels || { width: 3508, height: 2480 };

  const FONT_PATHS = {
    title: '/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf',
    body: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Regular.ttf',
    bodyItalic: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Italic.ttf',
    meta: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-Regular.ttf',
    metaBold: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-SemiBold.ttf',
    mono: '/public/assets/fonts/print/ibm-plex-mono/IBMPlexMono-Regular.ttf'
  };

  const TITLE_PLATES = {
    pl: '/public/assets/reports/title-plates/title-zapis-uczestnictwa-gold.svg',
    en: '/public/assets/reports/title-plates/title-record-of-participation-gold.svg'
  };

  const SIGNATURES = {
    goldSvg: '/public/assets/reports/author-signature-gold.svg',
    goldPng: '/public/assets/reports/author-signature-gold@2x.png',
    placeholderSvg: '/public/assets/reports/author-signature-placeholder.svg'
  };

  const FALLBACK_VARIANTS = {
    cinema: {
      layout: 'cinema',
      a4: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpg'],
      a3: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a3.jpg']
    },
    museum: {
      layout: 'museum',
      a4: ['/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg'],
      a3: ['/public/assets/reports/participation-record-bg-02-museum-line-a3.jpg']
    },
    ceremonial: {
      layout: 'ceremonial',
      a4: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg'],
      a3: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a3.jpg']
    }
  };

  const layoutPresets = {
    cinema: { projectY: 285, titleY: 520, titleSize: 144, titlePlateWidth: 2460, bodyY: 785, bodySize: 49, nameY: 1128, fieldsY: 1372, closingY: 1762, signatureY: 2044, fieldWidth: 695, signatureWidth: 820, textMaxWidth: 1900, closingMaxWidth: 1740, microprintY: 2314 },
    museum: { projectY: 260, titleY: 492, titleSize: 148, titlePlateWidth: 2520, bodyY: 738, bodySize: 48, nameY: 1092, fieldsY: 1344, closingY: 1736, signatureY: 2010, fieldWidth: 720, signatureWidth: 790, textMaxWidth: 1860, closingMaxWidth: 1690, microprintY: 2314 },
    ceremonial: { projectY: 300, titleY: 570, titleSize: 154, titlePlateWidth: 2600, bodyY: 845, bodySize: 46, nameY: 1210, fieldsY: 1460, closingY: 1828, signatureY: 2045, fieldWidth: 650, signatureWidth: 875, textMaxWidth: 1740, closingMaxWidth: 1580, microprintY: 2320 },
    ceremonialWall: { projectY: 335, titleY: 650, titleSize: 170, titlePlateWidth: 2720, bodyY: 948, bodySize: 49, nameY: 1310, fieldsY: 1570, closingY: 1930, signatureY: 2110, fieldWidth: 665, signatureWidth: 920, textMaxWidth: 1660, closingMaxWidth: 1480, microprintY: 2340 }
  };

  const $ = (sel) => root.querySelector(sel);
  const all = (sel) => [...root.querySelectorAll(sel)];
  const field = (name) => root.querySelector(`[name="${name}"]`);
  const baseButton = $('[data-pr-print]');
  if (!baseButton) return;

  const premiumButton = baseButton.cloneNode(true);
  premiumButton.textContent = TEXT.button;
  premiumButton.setAttribute('data-pr-pdf', 'standard');
  baseButton.replaceWith(premiumButton);

  const wallButton = document.createElement('button');
  wallButton.type = 'button';
  wallButton.className = 'vh-button secondary pr-wall-button';
  wallButton.textContent = TEXT.wallButton;
  wallButton.setAttribute('data-pr-pdf', 'wall');
  premiumButton.insertAdjacentElement('afterend', wallButton);

  const preflightPanel = createPreflightPanel();
  runPreflight();

  function status(message) { all('[data-pr-status]').forEach((node) => { node.textContent = message || ''; }); }
  function abs(path) { return new URL(path, window.location.origin).href; }
  function toPtY(px, output) { return output.height - px * (output.height / design.height); }
  function scaled(px, output) { return px * (output.width / design.width); }
  function safeName(text) { return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120); }
  function formatBytes(bytes) { const mb = bytes / 1024 / 1024; return `${mb.toFixed(mb >= 10 ? 1 : 2)} MB`; }

  function dateLabel() {
    const preset = field('eventPreset')?.value || 'custom';
    const event = master.events?.[preset];
    if (event) return event[lang]?.dateLabel || field('eventDate')?.value || '';
    const value = field('eventDate')?.value || '';
    if (!value) return '';
    try { return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`)); }
    catch (_) { return value; }
  }

  function data() {
    const preset = field('eventPreset')?.value || 'custom';
    const event = master.events?.[preset] || null;
    return { name: field('participantName')?.value.trim() || '', place: field('place')?.value.trim() || event?.[lang]?.place || '', dateValue: field('eventDate')?.value || event?.dateInput || '', date: dateLabel(), number: field('documentNumber')?.value || '', event, variant: selectedVariant() };
  }

  function selectedVariant() {
    const key = root.querySelector('[name="recordVariant"]:checked')?.value || 'cinema';
    const cfg = master.documents?.participationRecord?.variants?.[key] || {};
    const assetKey = cfg.assetKey || key;
    const assets = master.assets?.participation?.[assetKey] || {};
    const fallback = FALLBACK_VARIANTS[key] || FALLBACK_VARIANTS.cinema;
    return { key, layout: cfg.layout || fallback.layout, a4: assets.a4 || fallback.a4, a3: assets.a3 || fallback.a3 };
  }

  function validate(d) { if (!d.place) return TEXT.missingPlace; if (!d.dateValue) return TEXT.missingDate; return ''; }

  function profile(exportMode) {
    const profiles = master.documents?.participationRecord?.copyProfiles || {};
    return profiles[exportMode]?.[lang] || profiles.standard?.[lang] || { body: [], closing: [], microprint: '' };
  }

  function layoutFor(name, exportMode) {
    const layouts = master.documents?.participationRecord?.layouts || {};
    if (exportMode === 'wall' && name === 'ceremonial') return layouts.ceremonialWall || layoutPresets.ceremonialWall;
    return layouts[name] || layoutPresets[name] || layoutPresets.cinema;
  }

  function createPreflightPanel() {
    const panel = document.createElement('div');
    panel.className = 'pr-preflight pr54-preflight';
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = `<strong>${TEXT.preflightTitle}</strong><ul></ul>`;
    ($('.pr-print-recommendation') || premiumButton).insertAdjacentElement('afterend', panel);
    return panel;
  }

  function renderPreflight(items) {
    const list = preflightPanel.querySelector('ul');
    if (!list) return;
    list.innerHTML = items.map((item) => `<li class="${item.level}"><span aria-hidden="true"></span>${item.text}</li>`).join('');
  }

  async function exists(path) {
    try { const res = await fetch(abs(path), { method: 'HEAD', cache: 'no-store' }); return res.ok; }
    catch (_) { return false; }
  }

  async function firstAvailable(paths) {
    for (const path of paths.filter(Boolean)) {
      try { const res = await fetch(abs(path), { cache: 'no-store' }); if (res.ok) return { path, bytes: new Uint8Array(await res.arrayBuffer()) }; } catch (_) {}
    }
    return null;
  }

  async function runPreflight() {
    const d = data();
    const items = [];
    const hasPdf = !!window.PDFLib?.PDFDocument;
    const hasFontkit = !!(window.fontkit || window.Fontkit);
    items.push({ level: hasPdf ? 'ok' : 'warn', text: hasPdf ? TEXT.vectorOk : 'PDFLib unavailable' });
    items.push({ level: hasFontkit ? 'ok' : 'warn', text: hasFontkit ? TEXT.fontOk : TEXT.fontMissing });
    const bg = await firstAvailable([...(d.variant.a3 || []), ...(d.variant.a4 || [])]);
    items.push({ level: bg ? (d.variant.a3?.includes(bg.path) ? 'ok' : 'warn') : 'warn', text: bg ? (d.variant.a3?.includes(bg.path) ? TEXT.bgNative : TEXT.bgUpscaled) : TEXT.bgMissing });
    const title = await exists(TITLE_PLATES[lang]);
    const sig = await exists(SIGNATURES.goldSvg) || await exists(SIGNATURES.goldPng);
    items.push({ level: title ? 'ok' : 'warn', text: title ? TEXT.titleOk : TEXT.titleMissing });
    items.push({ level: sig ? 'ok' : 'warn', text: sig ? TEXT.signatureOk : TEXT.signatureMissing });
    renderPreflight(items);
  }

  async function loadFonts(pdfDoc) {
    const kit = window.fontkit || window.Fontkit;
    if (!kit || !pdfDoc.registerFontkit) throw new Error('fontkit unavailable');
    pdfDoc.registerFontkit(kit);
    const load = async (path) => { const res = await fetch(abs(path)); if (!res.ok) throw new Error(`Missing font: ${path}`); return pdfDoc.embedFont(new Uint8Array(await res.arrayBuffer()), { subset: true }); };
    return { title: await load(FONT_PATHS.title), body: await load(FONT_PATHS.body), bodyItalic: await load(FONT_PATHS.bodyItalic), meta: await load(FONT_PATHS.meta), metaBold: await load(FONT_PATHS.metaBold), mono: await load(FONT_PATHS.mono) };
  }

  async function fallbackFonts(pdfDoc) {
    const { StandardFonts } = window.PDFLib;
    return { title: await pdfDoc.embedFont(StandardFonts.TimesRomanBold), body: await pdfDoc.embedFont(StandardFonts.TimesRoman), bodyItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic), meta: await pdfDoc.embedFont(StandardFonts.Helvetica), metaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold), mono: await pdfDoc.embedFont(StandardFonts.Courier) };
  }

  function wrap(text, font, size, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach((word) => { const test = line ? `${line} ${word}` : word; if (font.widthOfTextAtSize(test, size) > maxWidth && line) { lines.push(line); line = word; } else line = test; });
    if (line) lines.push(line);
    return lines;
  }

  function drawCentered(page, text, font, size, x, y, color) {
    const lines = Array.isArray(text) ? text : [text];
    lines.forEach((line, i) => { if (!line) return; const width = font.widthOfTextAtSize(line, size); page.drawText(line, { x: x - width / 2, y: y - i * size * 1.35, size, font, color }); });
  }

  function drawWrappedCentered(page, text, font, size, x, y, maxWidth, color, lineHeight = 1.35) {
    const lines = [];
    String(text || '').split('\n').forEach((para) => { if (!para) lines.push(''); else lines.push(...wrap(para, font, size, maxWidth)); });
    lines.forEach((line, i) => { if (!line) return; const width = font.widthOfTextAtSize(line, size); page.drawText(line, { x: x - width / 2, y: y - i * size * lineHeight, size, font, color }); });
    return lines.length * size * lineHeight;
  }

  function drawFallbackBackground(page, output) {
    const { rgb } = window.PDFLib;
    page.drawRectangle({ x: 0, y: 0, width: output.width, height: output.height, color: rgb(0.025, 0.02, 0.015) });
    page.drawRectangle({ x: 34, y: 34, width: output.width - 68, height: output.height - 68, borderColor: rgb(0.73, 0.61, 0.35), borderWidth: 1.4 });
    page.drawRectangle({ x: 48, y: 48, width: output.width - 96, height: output.height - 96, borderColor: rgb(0.45, 0.35, 0.19), borderWidth: 0.6 });
  }

  async function drawBackground(pdfDoc, page, d, exportMode, output) {
    const candidates = exportMode === 'wall' ? [...(d.variant.a3 || []), ...(d.variant.a4 || [])] : [...(d.variant.a4 || [])];
    const bg = await firstAvailable(candidates);
    if (!bg) { drawFallbackBackground(page, output); return { path: null, native: false }; }
    const path = bg.path.toLowerCase();
    const image = path.endsWith('.png') ? await pdfDoc.embedPng(bg.bytes) : await pdfDoc.embedJpg(bg.bytes);
    page.drawImage(image, { x: 0, y: 0, width: output.width, height: output.height });
    return { path: bg.path, native: exportMode !== 'wall' || d.variant.a3?.includes(bg.path) };
  }

  async function svgToPngBytes(svgBytes, width = 2400, height = 720) {
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
      const blobOut = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      return new Uint8Array(await blobOut.arrayBuffer());
    } finally { URL.revokeObjectURL(url); }
  }

  async function embedAssetImage(pdfDoc, candidates, svgWidth, svgHeight) {
    const asset = await firstAvailable(candidates);
    if (!asset) return null;
    const path = asset.path.toLowerCase();
    try {
      if (path.endsWith('.svg')) return await pdfDoc.embedPng(await svgToPngBytes(asset.bytes, svgWidth, svgHeight));
      if (path.endsWith('.png')) return await pdfDoc.embedPng(asset.bytes);
      if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return await pdfDoc.embedJpg(asset.bytes);
    } catch (err) { console.warn(`Could not embed asset ${asset.path}`, err); }
    return null;
  }

  async function drawTitlePlate(pdfDoc, page, fonts, output, l, centerX, gold) {
    const image = await embedAssetImage(pdfDoc, [TITLE_PLATES[lang]], 3000, 1000);
    const yCenter = toPtY(l.titleY, output);
    if (image) {
      const width = scaled(l.titlePlateWidth || 2500, output);
      const height = width * (image.height / image.width);
      page.drawImage(image, { x: centerX - width / 2, y: yCenter - height / 2, width, height });
      return true;
    }
    drawCentered(page, TEXT.title, fonts.title, scaled(l.titleSize, output), centerX, yCenter, gold);
    return false;
  }

  async function drawSignature(pdfDoc, page, fonts, output, x, y, maxWidth) {
    const image = await embedAssetImage(pdfDoc, [SIGNATURES.goldSvg, SIGNATURES.goldPng, SIGNATURES.placeholderSvg], 2400, 640);
    if (image) {
      const width = Math.min(maxWidth, scaled(1040, output));
      const height = width * (image.height / image.width);
      page.drawImage(image, { x: x - width / 2, y: y - height / 2, width, height });
      return height;
    }
    drawCentered(page, 'Piotr Jakub Lichwała', fonts.bodyItalic, scaled(64, output), x, y, window.PDFLib.rgb(0.9, 0.78, 0.48));
    return scaled(95, output);
  }

  function drawField(page, fonts, label, value, x, y, width, output) {
    const { rgb } = window.PDFLib;
    page.drawLine({ start: { x: x - width / 2, y }, end: { x: x + width / 2, y }, thickness: 0.65, color: rgb(0.72, 0.61, 0.42) });
    drawCentered(page, label.toUpperCase(), fonts.meta, scaled(23, output), x, y - scaled(39, output), rgb(0.72, 0.61, 0.42));
    drawWrappedCentered(page, value, fonts.body, scaled(34, output), x, y - scaled(88, output), width - scaled(24, output), rgb(0.94, 0.86, 0.68), 1.14);
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
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  async function buildPdf(d, exportMode) {
    if (!window.PDFLib?.PDFDocument) throw new Error('PDFLib unavailable');
    const { PDFDocument, rgb } = window.PDFLib;
    const output = exportMode === 'wall' ? a3Output : a4Output;
    const pdfDoc = await PDFDocument.create();
    let fonts;
    try { fonts = await loadFonts(pdfDoc); } catch (err) { console.warn('PR54 custom font embedding unavailable.', err); fonts = await fallbackFonts(pdfDoc); }

    pdfDoc.setTitle(`${TEXT.title} — ${d.number}`);
    pdfDoc.setAuthor('Piotr Jakub Lichwała / Vibrosław');
    pdfDoc.setSubject('Rap-Ort: Prawda Sumienia — Participation Record');
    pdfDoc.setCreator('Veritas Humanum Hybrid Print Master');
    pdfDoc.setProducer('Veritas Humanum local browser PDF generator');

    const page = pdfDoc.addPage([output.width, output.height]);
    await drawBackground(pdfDoc, page, d, exportMode, output);

    const l = layoutFor(exportMode === 'wall' && d.variant.layout === 'ceremonial' ? 'ceremonialWall' : d.variant.layout, exportMode);
    const p = profile(exportMode);
    const gold = rgb(0.9, 0.74, 0.43);
    const ivory = rgb(0.95, 0.88, 0.72);
    const muted = rgb(0.72, 0.61, 0.42);
    const centerX = output.width / 2;

    drawCentered(page, TEXT.project, fonts.metaBold, scaled(33, output), centerX, toPtY(l.projectY, output), muted);
    await drawTitlePlate(pdfDoc, page, fonts, output, l, centerX, gold);

    drawWrappedCentered(page, (p.body || []).join('\n'), fonts.body, scaled(l.bodySize, output), centerX, toPtY(l.bodyY, output), scaled(l.textMaxWidth, output), ivory, 1.42);

    if (d.name) drawWrappedCentered(page, `${TEXT.forLabel} ${d.name}`, fonts.body, scaled(exportMode === 'wall' ? 56 : 50, output), centerX, toPtY(l.nameY, output), scaled(l.textMaxWidth, output), gold, 1.22);

    const fieldY = toPtY(l.fieldsY, output);
    const fieldXs = [output.width * 0.255, output.width * 0.5, output.width * 0.745];
    drawField(page, fonts, TEXT.dateLabel, d.date, fieldXs[0], fieldY, scaled(l.fieldWidth, output), output);
    drawField(page, fonts, TEXT.placeLabel, d.place || TEXT.fallbackPlace, fieldXs[1], fieldY, scaled(l.fieldWidth, output), output);
    drawField(page, fonts, TEXT.numberLabel, d.number, fieldXs[2], fieldY, scaled(l.fieldWidth, output), output);

    drawWrappedCentered(page, (p.closing || []).join('\n'), fonts.bodyItalic || fonts.body, scaled(40, output), centerX, toPtY(l.closingY, output), scaled(l.closingMaxWidth, output), ivory, 1.45);

    const sigCenterY = toPtY(l.signatureY, output);
    const signHeight = await drawSignature(pdfDoc, page, fonts, output, centerX, sigCenterY, scaled(l.signatureWidth, output));
    drawCentered(page, TEXT.authorRole.toUpperCase(), fonts.meta, scaled(23, output), centerX, sigCenterY - signHeight / 2 - scaled(34, output), muted);

    if (p.microprint) drawCentered(page, p.microprint.toUpperCase(), fonts.meta, scaled(18, output), centerX, toPtY(l.microprintY, output), muted);

    if (d.event?.accent) {
      page.drawText(`${d.event.accent.edition || ''} · ${d.event.accent.code || ''}`.replace(/^ · | · $/g, '').toUpperCase(), { x: output.width - scaled(760, output), y: scaled(65, output), size: scaled(18, output), font: fonts.meta, color: muted });
      page.drawText(String(d.event.accent.microLine || '').toUpperCase(), { x: scaled(210, output), y: scaled(65, output), size: scaled(18, output), font: fonts.meta, color: muted });
    }

    return pdfDoc.save({ useObjectStreams: true });
  }

  async function createPdf(exportMode = 'standard') {
    const d = data();
    const error = validate(d);
    if (error) { status(error); return; }
    const active = exportMode === 'wall' ? wallButton : premiumButton;
    active.disabled = true;
    try {
      status(TEXT.preparing);
      await runPreflight();
      const bytes = await buildPdf(d, exportMode);
      download(bytes, `${exportMode === 'wall' ? TEXT.wallFilePrefix : TEXT.filePrefix}-${safeName(d.number)}.pdf`);
      status(`${TEXT.ready} ${TEXT.pdfSize}: ${formatBytes(bytes.byteLength)}.`);
      const finale = $('[data-pr-finale]');
      if (finale) { finale.hidden = false; finale.textContent = lang === 'pl' ? 'Dokument został przygotowany jako pamiątkowy artefakt doświadczenia Rap-Ort: Prawda Sumienia.' : 'The document has been prepared as a commemorative artefact of the Rap-Ort: Prawda Sumienia experience.'; }
    } catch (err) { console.error(err); status(TEXT.error); }
    finally { active.disabled = false; }
  }

  root.addEventListener('change', (event) => { if (event.target?.matches('[name="recordVariant"], [name="eventPreset"]')) runPreflight(); });
  premiumButton.addEventListener('click', () => createPdf('standard'));
  wallButton.addEventListener('click', () => createPdf('wall'));
})();
