(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const master = window.VH_DOCUMENTS?.printMaster || {};
  const { PDFDocument, StandardFonts, rgb, degrees } = window.PDFLib || {};

  const copy = lang === 'pl' ? {
    preparing: 'Przygotowuję finalny print-master PDF…', ready: 'Print-master PDF został przygotowany i pobrany.', error: 'Nie udało się wygenerować PDF. Spróbuj ponownie.', missingPlace: 'Uzupełnij miejsce / instytucję.', missingDate: 'Uzupełnij datę wydarzenia.',
    button: 'Pobierz A4 print-master', wallButton: 'Pobierz A3 Wall Edition', project: 'RAP-ORT: PRAWDA SUMIENIA', title: 'ZAPIS UCZESTNICTWA', forLabel: 'dla', date: 'Data wydarzenia', place: 'Miejsce', number: 'Numer dokumentu', authorRole: 'autor projektu', file: 'Rap-Ort-Zapis-Uczestnictwa', wallFile: 'Rap-Ort-Zapis-Uczestnictwa-Wall-Edition', pdfSize: 'Rozmiar pliku'
  } : {
    preparing: 'Preparing final print-master PDF…', ready: 'Print-master PDF has been prepared and downloaded.', error: 'Could not generate the PDF. Try again.', missingPlace: 'Enter the place / institution.', missingDate: 'Enter the event date.',
    button: 'Download A4 print-master', wallButton: 'Download A3 Wall Edition', project: 'RAP-ORT: PRAWDA SUMIENIA', title: 'RECORD OF PARTICIPATION', forLabel: 'for', date: 'Event date', place: 'Place', number: 'Document number', authorRole: 'project author', file: 'Rap-Ort-Record-of-Participation', wallFile: 'Rap-Ort-Record-of-Participation-Wall-Edition', pdfSize: 'File size'
  };

  const outputs = master.output || {};
  const OUT = {
    a4: outputs.a4Landscape || { width: 841.89, height: 595.28, pixels: { width: 3508, height: 2480 } },
    a3: outputs.a3Landscape || { width: 1190.55, height: 841.89, pixels: { width: 4961, height: 3508 } }
  };
  const DESIGN = OUT.a4.pixels || { width: 3508, height: 2480 };

  const fonts = {
    title: '/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf',
    body: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Regular.ttf',
    italic: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Italic.ttf',
    meta: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-Regular.ttf',
    metaBold: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-SemiBold.ttf',
    mono: '/public/assets/fonts/print/ibm-plex-mono/IBMPlexMono-Regular.ttf'
  };

  const titlePlate = lang === 'pl'
    ? '/public/assets/reports/title-plates/title-zapis-uczestnictwa-gold.svg'
    : '/public/assets/reports/title-plates/title-record-of-participation-gold.svg';

  const signatureAssets = [
    '/public/assets/reports/author-signature-gold.svg',
    '/public/assets/reports/author-signature-gold@2x.png',
    '/public/assets/reports/author-signature-placeholder.svg'
  ];

  const fallbackVariants = {
    cinema: { layout: 'cinema', a4: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpg'], a3: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a3.jpg'] },
    museum: { layout: 'museum', a4: ['/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg'], a3: ['/public/assets/reports/participation-record-bg-02-museum-line-a3.jpg'] },
    ceremonial: { layout: 'ceremonial', a4: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg'], a3: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a3.jpg'] }
  };

  // Final hard layout. Coordinates are in 3508 × 2480 design pixels.
  // The metadata baseline is the line. Values are explicitly ABOVE it. Labels are explicitly BELOW it.
  const LAYOUTS = {
    cinema: { projectY: 300, titleY: 505, titleW: 2180, bodyY: 760, bodySize: 43, nameLabelY: 1085, nameY: 1160, lineY: 1455, valueOffset: 92, labelOffset: 58, valueSize: 46, labelSize: 18, numberSize: 31, closingY: 1818, closingSize: 33, signatureY: 2090, signatureW: 840, fieldW: 700, placeW: 780, bodyW: 1740, closingW: 1540, microY: 2328 },
    museum: { projectY: 285, titleY: 495, titleW: 2220, bodyY: 745, bodySize: 42, nameLabelY: 1065, nameY: 1138, lineY: 1438, valueOffset: 92, labelOffset: 58, valueSize: 46, labelSize: 18, numberSize: 31, closingY: 1795, closingSize: 33, signatureY: 2065, signatureW: 805, fieldW: 720, placeW: 820, bodyW: 1700, closingW: 1500, microY: 2328 },
    ceremonial: { projectY: 305, titleY: 535, titleW: 2260, bodyY: 805, bodySize: 40, nameLabelY: 1130, nameY: 1208, lineY: 1490, valueOffset: 96, labelOffset: 60, valueSize: 46, labelSize: 18, numberSize: 31, closingY: 1842, closingSize: 33, signatureY: 2090, signatureW: 900, fieldW: 660, placeW: 820, bodyW: 1580, closingW: 1420, microY: 2332 },
    ceremonialWall: { projectY: 345, titleY: 620, titleW: 2420, bodyY: 910, bodySize: 43, nameLabelY: 1235, nameY: 1310, lineY: 1605, valueOffset: 104, labelOffset: 64, valueSize: 48, labelSize: 18, numberSize: 32, closingY: 1948, closingSize: 33, signatureY: 2160, signatureW: 960, fieldW: 680, placeW: 840, bodyW: 1540, closingW: 1360, microY: 2348 }
  };

  const $ = (sel) => root.querySelector(sel);
  const all = (sel) => [...root.querySelectorAll(sel)];
  const field = (name) => root.querySelector(`[name="${name}"]`);
  const baseButton = $('[data-pr-print]');
  if (!baseButton || !PDFDocument) return;

  const premiumButton = baseButton.cloneNode(true);
  premiumButton.textContent = copy.button;
  baseButton.replaceWith(premiumButton);

  const wallButton = document.createElement('button');
  wallButton.type = 'button';
  wallButton.className = 'vh-button secondary pr-wall-button';
  wallButton.textContent = copy.wallButton;
  premiumButton.insertAdjacentElement('afterend', wallButton);

  function setStatus(text) { all('[data-pr-status]').forEach((n) => { n.textContent = text || ''; }); }
  function abs(path) { return new URL(path, window.location.origin).href; }
  function px(value, out) { return value * (out.width / DESIGN.width); }
  function py(value, out) { return out.height - value * (out.height / DESIGN.height); }
  function safe(text) { return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120); }
  function mb(bytes) { const v = bytes / 1024 / 1024; return `${v.toFixed(v >= 10 ? 1 : 2)} MB`; }

  async function bytes(path) {
    const res = await fetch(abs(path), { cache: 'no-store' });
    if (!res.ok) throw new Error(`Missing asset: ${path}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async function first(paths) {
    for (const path of paths.filter(Boolean)) {
      try { return { path, bytes: await bytes(path) }; } catch (_) {}
    }
    return null;
  }

  async function loadFonts(pdf) {
    const kit = window.fontkit || window.Fontkit;
    if (!kit || !pdf.registerFontkit) throw new Error('fontkit unavailable');
    pdf.registerFontkit(kit);
    const load = async (path) => pdf.embedFont(await bytes(path), { subset: true });
    return {
      title: await load(fonts.title), body: await load(fonts.body), italic: await load(fonts.italic),
      meta: await load(fonts.meta), metaBold: await load(fonts.metaBold), mono: await load(fonts.mono), custom: true
    };
  }

  async function fallbackFonts(pdf) {
    return {
      title: await pdf.embedFont(StandardFonts.TimesRomanBold), body: await pdf.embedFont(StandardFonts.TimesRoman), italic: await pdf.embedFont(StandardFonts.TimesRomanItalic),
      meta: await pdf.embedFont(StandardFonts.Helvetica), metaBold: await pdf.embedFont(StandardFonts.HelveticaBold), mono: await pdf.embedFont(StandardFonts.Courier), custom: false
    };
  }

  function strip(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Ł/g, 'L').replace(/ł/g, 'l');
  }
  function txt(text, f) { return f.custom ? String(text || '') : strip(text); }

  function selectedVariant() {
    const key = root.querySelector('[name="recordVariant"]:checked')?.value || 'cinema';
    const cfg = master.documents?.participationRecord?.variants?.[key] || {};
    const assetKey = cfg.assetKey || key;
    const assets = master.assets?.participation?.[assetKey] || {};
    const fallback = fallbackVariants[key] || fallbackVariants.cinema;
    return { key, layout: cfg.layout || fallback.layout, a4: assets.a4 || fallback.a4, a3: assets.a3 || fallback.a3 };
  }

  function dateLabel() {
    const preset = field('eventPreset')?.value || 'custom';
    const ev = master.events?.[preset];
    if (ev) return ev[lang]?.dateLabel || field('eventDate')?.value || '';
    const v = field('eventDate')?.value || '';
    if (!v) return '';
    try { return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${v}T00:00:00`)); }
    catch (_) { return v; }
  }

  function data() {
    const preset = field('eventPreset')?.value || 'custom';
    const ev = master.events?.[preset] || null;
    return {
      name: field('participantName')?.value.trim() || '',
      place: field('place')?.value.trim() || ev?.[lang]?.place || '',
      dateValue: field('eventDate')?.value || ev?.dateInput || '',
      date: dateLabel(),
      number: field('documentNumber')?.value || '',
      event: ev,
      variant: selectedVariant()
    };
  }

  function validate(d) {
    if (!d.place) return copy.missingPlace;
    if (!d.dateValue) return copy.missingDate;
    return '';
  }

  function profile(mode) {
    const profiles = master.documents?.participationRecord?.copyProfiles || {};
    return profiles[mode]?.[lang] || profiles.standard?.[lang] || { body: [], closing: [], microprint: '' };
  }

  function wrap(text, font, size, maxWidth, f) {
    const words = txt(text, f).split(/\s+/).filter(Boolean);
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

  function center(page, text, font, size, cx, y, color, f) {
    const value = txt(text, f);
    const w = font.widthOfTextAtSize(value, size);
    page.drawText(value, { x: cx - w / 2, y, size, font, color });
  }

  function wrappedCenter(page, text, font, size, cx, y, maxW, color, f, lineH = 1.35, maxLines = 99) {
    const lines = [];
    String(text || '').split('\n').forEach((p) => { if (!p) lines.push(''); else lines.push(...wrap(p, font, size, maxW, f)); });
    lines.slice(0, maxLines).forEach((line, i) => {
      if (!line) return;
      const w = font.widthOfTextAtSize(line, size);
      page.drawText(line, { x: cx - w / 2, y: y - i * size * lineH, size, font, color });
    });
  }

  function fit(font, text, size, maxW, min) {
    let next = size;
    const value = String(text || '');
    while (font.widthOfTextAtSize(value, next) > maxW && next > min) next -= size * 0.04;
    return next;
  }

  async function svgToPng(svgBytes, width) {
    const svgText = new TextDecoder('utf-8').decode(svgBytes);
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 3.4;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.max(1, Math.round(width / ratio));
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      return new Uint8Array(await out.arrayBuffer());
    } finally { URL.revokeObjectURL(url); }
  }

  async function embedAny(pdf, paths, svgWidth = 3200) {
    const asset = await first(paths);
    if (!asset) return null;
    const lower = asset.path.toLowerCase();
    if (lower.endsWith('.svg')) return pdf.embedPng(await svgToPng(asset.bytes, svgWidth));
    if (lower.endsWith('.png')) return pdf.embedPng(asset.bytes);
    return pdf.embedJpg(asset.bytes);
  }

  async function drawBackground(pdf, page, d, mode, out) {
    const paths = mode === 'wall' ? [...(d.variant.a3 || []), ...(d.variant.a4 || [])] : [...(d.variant.a4 || [])];
    const asset = await first(paths);
    if (!asset) {
      page.drawRectangle({ x: 0, y: 0, width: out.width, height: out.height, color: rgb(0.025, 0.02, 0.015) });
      page.drawRectangle({ x: 34, y: 34, width: out.width - 68, height: out.height - 68, borderColor: rgb(0.73, 0.61, 0.35), borderWidth: 1.4 });
      return;
    }
    const img = asset.path.toLowerCase().endsWith('.png') ? await pdf.embedPng(asset.bytes) : await pdf.embedJpg(asset.bytes);
    page.drawImage(img, { x: 0, y: 0, width: out.width, height: out.height });
  }

  async function drawTitle(pdf, page, out, layout, cx, color, f) {
    const img = await embedAny(pdf, [titlePlate], 3600);
    const cy = py(layout.titleY, out);
    if (img) {
      const w = px(layout.titleW, out);
      const h = w * (img.height / img.width);
      page.drawImage(img, { x: cx - w / 2, y: cy - h / 2, width: w, height: h });
    } else {
      center(page, copy.title, f.title, px(118, out), cx, cy, color.gold, f);
    }
  }

  async function drawSignature(pdf, page, out, layout, cx, f, color) {
    const img = await embedAny(pdf, signatureAssets, 2800);
    const cy = py(layout.signatureY, out);
    let h = px(86, out);
    if (img) {
      const w = Math.min(px(layout.signatureW, out), px(980, out));
      h = w * (img.height / img.width);
      page.drawImage(img, { x: cx - w / 2, y: cy - h / 2, width: w, height: h });
    } else {
      center(page, 'Piotr Jakub Lichwała', f.italic, px(58, out), cx, cy, color.value, f);
    }
    center(page, copy.authorRole.toUpperCase(), f.meta, px(18, out), cx, cy - h / 2 - px(28, out), color.label, f);
  }

  function premiumField(page, out, cx, lineY, width, label, value, f, color, options = {}) {
    const valueFont = options.mono ? f.mono : f.body;
    const valueSize = fit(valueFont, txt(value, f), px(options.valueSize || 46, out), width - px(20, out), px(20, out));
    const labelSize = px(options.labelSize || 18, out);
    const valueBaseline = lineY + px(options.valueOffset || 96, out);
    const labelBaseline = lineY - px(options.labelOffset || 60, out);

    page.drawLine({ start: { x: cx - width / 2, y: lineY }, end: { x: cx + width / 2, y: lineY }, thickness: 0.55, color: color.line });
    center(page, value, valueFont, valueSize, cx, valueBaseline, color.value, f);
    center(page, label.toUpperCase(), f.meta, labelSize, cx, labelBaseline, color.label, f);

    const mark = px(6, out);
    page.drawRectangle({ x: cx - mark / 2, y: lineY - mark / 2, width: mark, height: mark, color: color.line, rotate: degrees(45) });
  }

  async function buildPdf(d, mode) {
    const out = mode === 'wall' ? OUT.a3 : OUT.a4;
    const pdf = await PDFDocument.create();
    let f;
    try { f = await loadFonts(pdf); } catch (err) { console.warn('Custom font embedding unavailable.', err); f = await fallbackFonts(pdf); }

    pdf.setTitle(`${copy.title} — ${d.number}`);
    pdf.setAuthor('Piotr Jakub Lichwała / Vibrosław');
    pdf.setSubject('Rap-Ort: Prawda Sumienia — Participation Record');
    pdf.setCreator('Veritas Humanum Participation Record Final Wall Master');
    pdf.setProducer('Veritas Humanum local browser PDF generator');

    const page = pdf.addPage([out.width, out.height]);
    await drawBackground(pdf, page, d, mode, out);

    const baseLayoutKey = mode === 'wall' && d.variant.layout === 'ceremonial' ? 'ceremonialWall' : d.variant.layout;
    const layout = LAYOUTS[baseLayoutKey] || LAYOUTS.cinema;
    const text = profile(mode);
    const color = { gold: rgb(0.9, 0.74, 0.43), ivory: rgb(0.94, 0.86, 0.68), muted: rgb(0.66, 0.56, 0.38), label: rgb(0.55, 0.47, 0.32), line: rgb(0.58, 0.48, 0.3), value: rgb(0.93, 0.83, 0.62), micro: rgb(0.46, 0.39, 0.28) };
    const cx = out.width / 2;

    center(page, copy.project, f.metaBold, px(23, out), cx, py(layout.projectY, out), color.muted, f);
    await drawTitle(pdf, page, out, layout, cx, color, f);
    wrappedCenter(page, (text.body || []).join('\n'), f.body, px(layout.bodySize, out), cx, py(layout.bodyY, out), px(layout.bodyW, out), color.ivory, f, 1.42, 7);

    if (d.name) {
      center(page, copy.forLabel.toUpperCase(), f.meta, px(20, out), cx, py(layout.nameLabelY, out), color.label, f);
      const name = d.name.toUpperCase();
      center(page, name, f.body, fit(f.body, txt(name, f), px(54, out), px(1550, out), px(32, out)), cx, py(layout.nameY, out), color.value, f);
    }

    const lineY = py(layout.lineY, out);
    premiumField(page, out, out.width * 0.255, lineY, px(layout.fieldW, out), copy.date, d.date, f, color, { valueOffset: layout.valueOffset, labelOffset: layout.labelOffset, valueSize: layout.valueSize, labelSize: layout.labelSize });
    premiumField(page, out, out.width * 0.5, lineY, px(layout.placeW, out), copy.place, d.place, f, color, { valueOffset: layout.valueOffset, labelOffset: layout.labelOffset, valueSize: layout.valueSize, labelSize: layout.labelSize });
    premiumField(page, out, out.width * 0.745, lineY, px(layout.fieldW, out), copy.number, d.number, f, color, { mono: true, valueOffset: layout.valueOffset, labelOffset: layout.labelOffset, valueSize: layout.numberSize, labelSize: layout.numberLabelSize || layout.labelSize });

    wrappedCenter(page, (text.closing || []).join('\n'), f.italic || f.body, px(layout.closingSize, out), cx, py(layout.closingY, out), px(layout.closingW, out), color.ivory, f, 1.45, 3);
    await drawSignature(pdf, page, out, layout, cx, f, color);

    if (text.microprint) center(page, text.microprint.toUpperCase(), f.meta, px(13, out), cx, py(layout.microY, out), color.micro, f);

    if (d.event?.accent) {
      page.drawText(txt(`${d.event.accent.edition || ''} · ${d.event.accent.code || ''}`.replace(/^ · | · $/g, '').toUpperCase(), f), { x: out.width - px(665, out), y: px(57, out), size: px(13, out), font: f.meta, color: color.micro });
      page.drawText(txt(String(d.event.accent.microLine || '').toUpperCase(), f), { x: px(210, out), y: px(57, out), size: px(13, out), font: f.meta, color: color.micro });
    }

    return pdf.save({ useObjectStreams: true });
  }

  function download(dataBytes, filename) {
    const blob = new Blob([dataBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  async function createPdf(mode = 'standard') {
    const d = data();
    const error = validate(d);
    if (error) { setStatus(error); return; }
    const active = mode === 'wall' ? wallButton : premiumButton;
    active.disabled = true;
    try {
      setStatus(copy.preparing);
      const dataBytes = await buildPdf(d, mode);
      download(dataBytes, `${mode === 'wall' ? copy.wallFile : copy.file}-${safe(d.number)}.pdf`);
      setStatus(`${copy.ready} ${copy.pdfSize}: ${mb(dataBytes.byteLength)}.`);
      const finale = $('[data-pr-finale]');
      if (finale) { finale.hidden = false; finale.textContent = lang === 'pl' ? 'Dokument został przygotowany jako pamiątkowy artefakt doświadczenia Rap-Ort: Prawda Sumienia.' : 'The document has been prepared as a commemorative artefact of the Rap-Ort: Prawda Sumienia experience.'; }
    } catch (err) {
      console.error(err);
      setStatus(copy.error);
    } finally {
      active.disabled = false;
    }
  }

  premiumButton.addEventListener('click', () => createPdf('standard'));
  wallButton.addEventListener('click', () => createPdf('wall'));
})();
