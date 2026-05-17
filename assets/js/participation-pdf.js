(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const master = window.VH_DOCUMENTS?.printMaster || {};

  const TEXT = {
    pl: {
      preparing: 'Przygotowuję finalny print-master PDF…',
      ready: 'Print-master PDF został przygotowany i pobrany.',
      missingPlace: 'Uzupełnij miejsce / instytucję.',
      missingDate: 'Uzupełnij datę wydarzenia.',
      error: 'Nie udało się wygenerować PDF. Sprawdź konsolę błędów albo spróbuj ponownie.',
      button: 'Pobierz A4 print-master',
      wallButton: 'Pobierz A3 Wall Edition',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      title: 'ZAPIS UCZESTNICTWA',
      forLabel: 'dla',
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
      preparing: 'Preparing final print-master PDF…',
      ready: 'Print-master PDF has been prepared and downloaded.',
      missingPlace: 'Enter the place / institution.',
      missingDate: 'Enter the event date.',
      error: 'Could not generate the PDF. Check the console or try again.',
      button: 'Download A4 print-master',
      wallButton: 'Download A3 Wall Edition',
      project: 'RAP-ORT: PRAWDA SUMIENIA',
      title: 'RECORD OF PARTICIPATION',
      forLabel: 'for',
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
    cinema: { layout: 'cinema', a4: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpg'], a3: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a3.jpg'] },
    museum: { layout: 'museum', a4: ['/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg'], a3: ['/public/assets/reports/participation-record-bg-02-museum-line-a3.jpg'] },
    ceremonial: { layout: 'ceremonial', a4: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg'], a3: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a3.jpg'] }
  };

  // Pixel coordinates are designed against the source A4 background: 3508 × 2480.
  // Values were tuned for the current ornamental black/gold wall layout: title stays high,
  // inscription is calmer, metadata values sit ABOVE lines, labels sit BELOW lines.
  const layoutPresets = {
    cinema: { projectY: 300, titleY: 505, titleSize: 118, titlePlateWidth: 2180, bodyY: 760, bodySize: 43, nameLabelY: 1085, nameY: 1160, fieldsY: 1455, closingY: 1818, signatureY: 2090, fieldWidth: 700, placeWidth: 780, signatureWidth: 840, textMaxWidth: 1740, closingMaxWidth: 1540, microprintY: 2328 },
    museum: { projectY: 285, titleY: 495, titleSize: 120, titlePlateWidth: 2220, bodyY: 745, bodySize: 42, nameLabelY: 1065, nameY: 1138, fieldsY: 1438, closingY: 1795, signatureY: 2065, fieldWidth: 720, placeWidth: 820, signatureWidth: 805, textMaxWidth: 1700, closingMaxWidth: 1500, microprintY: 2328 },
    ceremonial: { projectY: 305, titleY: 535, titleSize: 126, titlePlateWidth: 2260, bodyY: 805, bodySize: 40, nameLabelY: 1130, nameY: 1208, fieldsY: 1490, closingY: 1842, signatureY: 2090, fieldWidth: 660, placeWidth: 820, signatureWidth: 900, textMaxWidth: 1580, closingMaxWidth: 1420, microprintY: 2332 },
    ceremonialWall: { projectY: 345, titleY: 620, titleSize: 140, titlePlateWidth: 2420, bodyY: 910, bodySize: 43, nameLabelY: 1235, nameY: 1310, fieldsY: 1605, closingY: 1948, signatureY: 2160, fieldWidth: 680, placeWidth: 840, signatureWidth: 960, textMaxWidth: 1540, closingMaxWidth: 1360, microprintY: 2348 }
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

  function activeDocumentPack(preset) {
    const eventPack = master.events?.[preset]?.documentPack;
    if (eventPack) return eventPack;
    if (!window.getRapOrtDocumentPack) return null;
    const pack = window.getRapOrtDocumentPack(preset, lang);
    return pack?.id && pack.id !== 'default' ? pack : null;
  }

  function data() {
    const preset = field('eventPreset')?.value || 'custom';
    const event = master.events?.[preset] || null;
    const documentPack = activeDocumentPack(preset);
    return {
      name: field('participantName')?.value.trim() || '',
      place: field('place')?.value.trim() || event?.[lang]?.place || '',
      dateValue: field('eventDate')?.value || event?.dateInput || '',
      date: dateLabel(),
      number: field('documentNumber')?.value || '',
      event,
      documentPack,
      variant: selectedVariant()
    };
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
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) { lines.push(line); line = word; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawCentered(page, text, font, size, centerX, baselineY, color) {
    const lines = Array.isArray(text) ? text : [text];
    lines.forEach((line, i) => {
      if (!line) return;
      const width = font.widthOfTextAtSize(line, size);
      page.drawText(line, { x: centerX - width / 2, y: baselineY - i * size * 1.35, size, font, color });
    });
  }

  function drawWrappedCentered(page, text, font, size, centerX, baselineY, maxWidth, color, lineHeight = 1.35, maxLines = 99) {
    const lines = [];
    String(text || '').split('\n').forEach((para) => { if (!para) lines.push(''); else lines.push(...wrap(para, font, size, maxWidth)); });
    lines.slice(0, maxLines).forEach((line, i) => {
      if (!line) return;
      const width = font.widthOfTextAtSize(line, size);
      page.drawText(line, { x: centerX - width / 2, y: baselineY - i * size * lineHeight, size, font, color });
    });
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

  async function svgToPngBytes(svgBytes, width = 3000, height = 1000) {
    const svgText = new TextDecoder('utf-8').decode(svgBytes);
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : width / height;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.max(1, Math.round(width / ratio));
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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

  async function drawTitlePlate(pdfDoc, page, fonts, output, layout, centerX, gold) {
    const image = await embedAssetImage(pdfDoc, [TITLE_PLATES[lang]], 3400, 920);
    const baselineY = toPtY(layout.titleY, output);
    if (image) {
      const width = scaled(layout.titlePlateWidth || 2200, output);
      const height = width * (image.height / image.width);
      page.drawImage(image, { x: centerX - width / 2, y: baselineY - height / 2, width, height });
      return true;
    }
    drawCentered(page, TEXT.title, fonts.title, scaled(layout.titleSize, output), centerX, baselineY, gold);
    return false;
  }

  async function drawSignature(pdfDoc, page, fonts, output, centerX, centerY, maxWidth) {
    const image = await embedAssetImage(pdfDoc, [SIGNATURES.goldSvg, SIGNATURES.goldPng, SIGNATURES.placeholderSvg], 2600, 700);
    if (image) {
      const width = Math.min(maxWidth, scaled(980, output));
      const height = width * (image.height / image.width);
      page.drawImage(image, { x: centerX - width / 2, y: centerY - height / 2, width, height });
      return height;
    }
    drawCentered(page, 'Piotr Jakub Lichwała', fonts.bodyItalic, scaled(58, output), centerX, centerY, window.PDFLib.rgb(0.9, 0.78, 0.48));
    return scaled(86, output);
  }

  function fitTextSize(font, text, preferredSize, maxWidth, minSize) {
    let size = preferredSize;
    while (font.widthOfTextAtSize(String(text || ''), size) > maxWidth && size > minSize) size -= preferredSize * 0.04;
    return size;
  }

  function drawPremiumField(page, fonts, label, value, centerX, lineY, width, output, colors, options = {}) {
    const valueFont = options.mono ? fonts.mono : fonts.body;
    const valuePreferred = scaled(options.valueSize || 34, output);
    const labelSize = scaled(options.labelSize || 18, output);
    const maxValueWidth = width - scaled(24, output);
    const valueSize = fitTextSize(valueFont, value, valuePreferred, maxValueWidth, scaled(20, output));
    const valueY = lineY + scaled(options.valueOffset || 43, output);
    const labelY = lineY - scaled(options.labelOffset || 35, output);

    const { rgb } = window.PDFLib;
    page.drawLine({ start: { x: centerX - width / 2, y: lineY }, end: { x: centerX + width / 2, y: lineY }, thickness: 0.58, color: colors.line });
    drawCentered(page, value, valueFont, valueSize, centerX, valueY, colors.value);
    drawCentered(page, label.toUpperCase(), fonts.meta, labelSize, centerX, labelY, colors.label);
    if (options.cap) {
      const cap = scaled(7, output);
      page.drawRectangle({ x: centerX - cap / 2, y: lineY - cap / 2, width: cap, height: cap, color: rgb(0.72, 0.61, 0.42), rotate: window.PDFLib.degrees(45) });
    }
  }

  function drawNameBlock(page, fonts, name, layout, output, centerX, colors) {
    if (!name) return;
    drawCentered(page, TEXT.forLabel.toUpperCase(), fonts.meta, scaled(20, output), centerX, toPtY(layout.nameLabelY, output), colors.label);
    const nameSize = fitTextSize(fonts.body, name.toUpperCase(), scaled(54, output), scaled(1550, output), scaled(32, output));
    drawCentered(page, name.toUpperCase(), fonts.body, nameSize, centerX, toPtY(layout.nameY, output), colors.value);
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

  function filenamePrefix(d, exportMode) {
    if (d.documentPack?.filePrefix) {
      return exportMode === 'wall' ? `${d.documentPack.filePrefix}-Wall-Edition` : d.documentPack.filePrefix;
    }
    return exportMode === 'wall' ? TEXT.wallFilePrefix : TEXT.filePrefix;
  }

  async function buildPdf(d, exportMode) {
    if (!window.PDFLib?.PDFDocument) throw new Error('PDFLib unavailable');
    const { PDFDocument, rgb } = window.PDFLib;
    const output = exportMode === 'wall' ? a3Output : a4Output;
    const pdfDoc = await PDFDocument.create();
    let fonts;
    try { fonts = await loadFonts(pdfDoc); } catch (err) { console.warn('Custom font embedding unavailable.', err); fonts = await fallbackFonts(pdfDoc); }

    pdfDoc.setTitle(`${d.documentPack?.documentTitle || TEXT.title} — ${d.number}`);
    pdfDoc.setAuthor('Piotr Jakub Lichwała / Vibrosław');
    pdfDoc.setSubject(`${d.documentPack?.eventTitle || TEXT.project} — Participation Record`);
    pdfDoc.setCreator('Veritas Humanum Participation Record Final Wall Master');
    pdfDoc.setProducer('Veritas Humanum local browser PDF generator');

    const page = pdfDoc.addPage([output.width, output.height]);
    await drawBackground(pdfDoc, page, d, exportMode, output);

    const layout = layoutFor(exportMode === 'wall' && d.variant.layout === 'ceremonial' ? 'ceremonialWall' : d.variant.layout, exportMode);
    const copy = profile(exportMode);
    const colors = {
      gold: rgb(0.9, 0.74, 0.43),
      ivory: rgb(0.94, 0.86, 0.68),
      muted: rgb(0.68, 0.57, 0.38),
      label: rgb(0.55, 0.47, 0.32),
      line: rgb(0.58, 0.48, 0.3),
      value: rgb(0.93, 0.83, 0.62),
      micro: rgb(0.46, 0.39, 0.28)
    };
    const centerX = output.width / 2;

    drawCentered(page, d.documentPack?.eventTitle || TEXT.project, fonts.metaBold, scaled(23, output), centerX, toPtY(layout.projectY, output), colors.muted);
    await drawTitlePlate(pdfDoc, page, fonts, output, layout, centerX, colors.gold);

    drawWrappedCentered(page, (copy.body || []).join('\n'), fonts.body, scaled(layout.bodySize, output), centerX, toPtY(layout.bodyY, output), scaled(layout.textMaxWidth, output), colors.ivory, 1.42, 7);
    drawNameBlock(page, fonts, d.name, layout, output, centerX, colors);

    const lineY = toPtY(layout.fieldsY, output);
    drawPremiumField(page, fonts, TEXT.dateLabel, d.date, output.width * 0.255, lineY, scaled(layout.fieldWidth, output), output, colors);
    drawPremiumField(page, fonts, TEXT.placeLabel, d.place || TEXT.fallbackPlace, output.width * 0.5, lineY, scaled(layout.placeWidth || layout.fieldWidth, output), output, colors);
    drawPremiumField(page, fonts, TEXT.numberLabel, d.number, output.width * 0.745, lineY, scaled(layout.fieldWidth, output), output, colors, { mono: true, valueSize: 28, labelSize: 16 });

    drawWrappedCentered(page, (copy.closing || []).join('\n'), fonts.bodyItalic || fonts.body, scaled(33, output), centerX, toPtY(layout.closingY, output), scaled(layout.closingMaxWidth, output), colors.ivory, 1.45, 3);

    const sigCenterY = toPtY(layout.signatureY, output);
    const signHeight = await drawSignature(pdfDoc, page, fonts, output, centerX, sigCenterY, scaled(layout.signatureWidth, output));
    drawCentered(page, TEXT.authorRole.toUpperCase(), fonts.meta, scaled(18, output), centerX, sigCenterY - signHeight / 2 - scaled(28, output), colors.label);

    const microprint = d.documentPack?.footerLine || copy.microprint;
    if (microprint) drawCentered(page, microprint.toUpperCase(), fonts.meta, scaled(13, output), centerX, toPtY(layout.microprintY, output), colors.micro);

    const packAccent = d.documentPack ? {
      edition: d.documentPack.certificateLabel,
      code: d.documentPack.eventCode,
      microLine: d.documentPack.footerLine
    } : null;
    const accent = packAccent || d.event?.accent;
    if (accent) {
      page.drawText(`${accent.edition || ''} · ${accent.code || ''}`.replace(/^ · | · $/g, '').toUpperCase(), { x: output.width - scaled(665, output), y: scaled(57, output), size: scaled(13, output), font: fonts.meta, color: colors.micro });
      page.drawText(String(accent.microLine || '').toUpperCase(), { x: scaled(210, output), y: scaled(57, output), size: scaled(13, output), font: fonts.meta, color: colors.micro });
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
      download(bytes, `${filenamePrefix(d, exportMode)}-${safeName(d.number)}.pdf`);
      status(`${TEXT.ready} ${TEXT.pdfSize}: ${formatBytes(bytes.byteLength)}.`);
      const finale = $('[data-pr-finale]');
      if (finale) {
        finale.hidden = false;
        finale.textContent = lang === 'pl' ? 'Dokument został przygotowany jako pamiątkowy artefakt doświadczenia Rap-Ort: Prawda Sumienia.' : 'The document has been prepared as a commemorative artefact of the Rap-Ort: Prawda Sumienia experience.';
      }
    } catch (err) {
      console.error(err);
      status(TEXT.error);
    } finally {
      active.disabled = false;
    }
  }

  root.addEventListener('change', (event) => { if (event.target?.matches('[name="recordVariant"], [name="eventPreset"]')) runPreflight(); });
  premiumButton.addEventListener('click', () => createPdf('standard'));
  wallButton.addEventListener('click', () => createPdf('wall'));
})();
