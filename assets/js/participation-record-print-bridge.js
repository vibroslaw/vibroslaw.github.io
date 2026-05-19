(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const raw = String(params.get('event') || params.get('key') || '').toLowerCase();
  const eventKey = raw === 'oswiecim' || raw === 'mup' ? 'oswiecim20260525' : raw;
  if (!['oswiecim20260525', 'syd2026'].includes(eventKey)) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const base = '/public/assets/events/rap-ort/';
  const pdfLib = () => window.PDFLib;

  const copy = lang === 'pl' ? {
    preparing: 'Przygotowuję finalny PDF premium z selem wydarzenia…',
    ready: 'Finalny PDF premium został przygotowany i pobrany.',
    error: 'Nie udało się wygenerować PDF premium. Odśwież stronę i spróbuj ponownie.',
    title: 'ZAPIS UCZESTNICTWA',
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    forLabel: 'DLA',
    dateLabel: 'DATA WYDARZENIA',
    placeLabel: 'MIEJSCE',
    numberLabel: 'NUMER DOKUMENTU',
    authorRole: 'AUTOR PROJEKTU',
    noName: 'uczestnika wydarzenia',
    body: [
      'Dokument upamiętnia udział w projekcji audiowizualnej',
      '„Rap-Ort: Prawda Sumienia”',
      '',
      'autorskim doświadczeniu muzyki, obrazu, słowa i ciszy,',
      'poświęconym pamięci, świadectwu, sumieniu',
      'oraz odpowiedzialności człowieka wobec prawdy.'
    ],
    closing: [
      'To nie jest dyplom ani dokument urzędowy.',
      'To pamiątkowy ślad spotkania z historią, która staje się pytaniem sumienia.'
    ],
    micro: 'Pamiątkowy zapis uczestnictwa · dokument generowany lokalnie w przeglądarce · nie oznacza patronatu instytucji.',
    filename: 'Rap-Ort-Zapis-Uczestnictwa'
  } : {
    preparing: 'Preparing the final premium PDF with the event seal…',
    ready: 'The final premium PDF has been prepared and downloaded.',
    error: 'Could not generate the premium PDF. Refresh the page and try again.',
    title: 'RECORD OF PARTICIPATION',
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    forLabel: 'FOR',
    dateLabel: 'EVENT DATE',
    placeLabel: 'PLACE',
    numberLabel: 'DOCUMENT NUMBER',
    authorRole: 'PROJECT AUTHOR',
    noName: 'the event participant',
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
      'It is a commemorative trace of an encounter with history as a question of conscience.'
    ],
    micro: 'Commemorative record of participation · generated locally in the browser · does not imply institutional patronage.',
    filename: 'Rap-Ort-Record-of-Participation'
  };

  const events = {
    oswiecim20260525: {
      code: 'OSW',
      dateInput: '2026-05-25',
      date: lang === 'pl' ? '25 maja 2026' : '25 May 2026',
      edition: lang === 'pl' ? 'Oświęcim / MUP · 25 maja 2026' : 'Oświęcim / MUP · 25 May 2026',
      place: lang === 'pl'
        ? 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu'
        : 'Małopolska State University named after Cavalry Captain Witold Pilecki in Oświęcim',
      bg: {
        a4: [`${base}oswiecim20260525/backgrounds/participation-record-bg-a4.jpg`, `${base}oswiecim20260525/backgrounds/participation-record-bg-a3.jpg`, '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg'],
        a3: [`${base}oswiecim20260525/backgrounds/participation-record-bg-a3.jpg`, `${base}oswiecim20260525/backgrounds/participation-record-bg-a4.jpg`, '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a3.jpg']
      },
      title: lang === 'pl'
        ? [`${base}oswiecim20260525/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg`, `${base}oswiecim20260525/title-plates/title-zapis-uczestnictwa-gold.svg`, '/public/assets/reports/title-plates/title-zapis-uczestnictwa-gold.svg']
        : [`${base}oswiecim20260525/title-plates/title-record-of-participation-anniversary-gold.svg`, `${base}oswiecim20260525/title-plates/title-record-of-participation-gold.svg`, '/public/assets/reports/title-plates/title-record-of-participation-gold.svg'],
      seal: [`${base}oswiecim20260525/accents/anniversary-edition-seal-gold.svg`, `${base}oswiecim20260525/accents/event-seal-gold.svg`, `${base}shared/seals/anniversary-edition-seal-gold.svg`, `${base}shared/seals/rap-ort-seal-gold.svg`],
      accent: [`${base}oswiecim20260525/accents/event-accent-gold.svg`, `${base}shared/seals/vh-seal-gold.svg`]
    },
    syd2026: {
      code: 'SYD',
      dateInput: '2026-06-21',
      date: lang === 'pl' ? '21 czerwca 2026' : '21 June 2026',
      edition: 'Sydney 2026',
      place: 'Polish Club Ashfield / Sydney',
      bg: {
        a4: [`${base}syd2026/backgrounds/participation-record-bg-a4.jpg`, `${base}syd2026/backgrounds/participation-record-bg-a3.jpg`, '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg'],
        a3: [`${base}syd2026/backgrounds/participation-record-bg-a3.jpg`, `${base}syd2026/backgrounds/participation-record-bg-a4.jpg`, '/public/assets/reports/participation-record-bg-01-archival-cinema-a3.jpg']
      },
      title: lang === 'pl'
        ? [`${base}syd2026/title-plates/title-zapis-uczestnictwa-gold.svg`, '/public/assets/reports/title-plates/title-zapis-uczestnictwa-gold.svg']
        : [`${base}syd2026/title-plates/title-record-of-participation-gold.svg`, '/public/assets/reports/title-plates/title-record-of-participation-gold.svg'],
      seal: [`${base}syd2026/accents/international-screening-seal-gold.svg`, `${base}syd2026/accents/event-seal-gold.svg`, `${base}shared/seals/rap-ort-seal-gold.svg`],
      accent: [`${base}syd2026/accents/event-accent-gold.svg`, `${base}shared/seals/vh-seal-gold.svg`]
    }
  };

  const eventData = events[eventKey];
  const pageProfiles = {
    standard: { width: 841.89, height: 595.28, suffix: 'A4', scale: 1 },
    wall: { width: 1190.55, height: 841.89, suffix: 'A3-Wall-Edition', scale: 1190.55 / 841.89 }
  };

  const $ = (sel) => root.querySelector(sel);
  const status = (text) => root.querySelectorAll('[data-pr-status]').forEach((node) => { node.textContent = text; });
  const abs = (path) => new URL(path, location.origin).href;
  const cleanFile = (text) => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);

  function input(name) { return root.querySelector(`[name="${name}"]`); }
  function docNumber() {
    const existing = input('documentNumber')?.value;
    if (existing) return existing;
    const dateCode = eventData.dateInput.slice(5, 7) + eventData.dateInput.slice(8, 10);
    const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    return `${lang === 'pl' ? 'VH-ZU' : 'VH-REC'}-${eventData.dateInput.slice(0, 4)}-${dateCode}-${eventData.code}-${seq}`;
  }
  function participantName() { return input('participantName')?.value.trim() || ''; }

  async function first(paths) {
    for (const path of paths.filter(Boolean)) {
      try {
        const res = await fetch(abs(path), { cache: 'no-store' });
        if (res.ok) return { path, bytes: new Uint8Array(await res.arrayBuffer()) };
      } catch (_) {}
    }
    return null;
  }

  async function svgToPngBytes(svgBytes, width = 1800) {
    const svgText = new TextDecoder('utf-8').decode(svgBytes);
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.decoding = 'async';
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.max(1, Math.round(width / ratio));
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      return new Uint8Array(await pngBlob.arrayBuffer());
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function embedAsset(pdfDoc, candidates, svgWidth = 1800) {
    for (const path of candidates.filter(Boolean)) {
      try {
        const asset = await first([path]);
        if (!asset) continue;
        const lower = asset.path.toLowerCase();
        if (lower.endsWith('.svg')) return await pdfDoc.embedPng(await svgToPngBytes(asset.bytes, svgWidth));
        if (lower.endsWith('.png')) return await pdfDoc.embedPng(asset.bytes);
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return await pdfDoc.embedJpg(asset.bytes);
      } catch (err) {
        console.warn('Skipping PDF asset:', path, err);
      }
    }
    return null;
  }

  async function embedFont(pdfDoc, path, fallback) {
    try {
      const kit = window.fontkit || window.Fontkit;
      if (kit && pdfDoc.registerFontkit) {
        pdfDoc.registerFontkit(kit);
        const res = await fetch(abs(path));
        if (res.ok) return await pdfDoc.embedFont(new Uint8Array(await res.arrayBuffer()), { subset: true });
      }
    } catch (_) {}
    return pdfDoc.embedFont(fallback);
  }

  function centerText(page, text, font, size, x, y, color) {
    const str = String(text || '');
    const w = font.widthOfTextAtSize(str, size);
    page.drawText(str, { x: x - w / 2, y, size, font, color });
  }

  function wrap(font, text, size, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function wrappedCentered(page, lines, font, size, x, y, maxWidth, color, lineHeight = 1.36) {
    let offset = 0;
    for (const rawLine of lines) {
      if (!rawLine) {
        offset += size * 0.78;
        continue;
      }
      for (const line of wrap(font, rawLine, size, maxWidth)) {
        centerText(page, line, font, size, x, y - offset, color);
        offset += size * lineHeight;
      }
    }
    return offset;
  }

  function fit(font, text, preferred, maxWidth, min = 7) {
    let size = preferred;
    while (font.widthOfTextAtSize(String(text || ''), size) > maxWidth && size > min) size -= 0.5;
    return size;
  }

  function drawField(page, fonts, label, value, x, lineY, width, colors, scale, opts = {}) {
    const lineColor = colors.line;
    const valueFont = opts.mono ? fonts.mono : fonts.body;
    const maxValueWidth = width - 16 * scale;
    const valueSize = fit(valueFont, value, (opts.valueSize || 9.4) * scale, maxValueWidth, 6.2 * scale);
    page.drawLine({ start: { x: x - width / 2, y: lineY }, end: { x: x + width / 2, y: lineY }, thickness: 0.55 * scale, color: lineColor });
    const wrapped = wrap(valueFont, value, valueSize, maxValueWidth).slice(0, opts.maxLines || 2);
    const topY = lineY + (wrapped.length > 1 ? 21 * scale : 18 * scale);
    wrapped.forEach((line, i) => centerText(page, line, valueFont, valueSize, x, topY - i * valueSize * 1.18, colors.ivory));
    centerText(page, label, fonts.meta, 6.2 * scale, x, lineY - 17 * scale, colors.label);
  }

  async function buildPdf(mode) {
    const { PDFDocument, StandardFonts, rgb } = pdfLib();
    const profile = pageProfiles[mode] || pageProfiles.standard;
    const scale = profile.scale;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([profile.width, profile.height]);

    const fonts = {
      title: await embedFont(pdfDoc, '/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf', StandardFonts.TimesRomanBold),
      body: await embedFont(pdfDoc, '/public/assets/fonts/print/source-serif-4/SourceSerif4-Regular.ttf', StandardFonts.TimesRoman),
      italic: await embedFont(pdfDoc, '/public/assets/fonts/print/source-serif-4/SourceSerif4-Italic.ttf', StandardFonts.TimesRomanItalic),
      meta: await embedFont(pdfDoc, '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-Regular.ttf', StandardFonts.Helvetica),
      metaBold: await embedFont(pdfDoc, '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-SemiBold.ttf', StandardFonts.HelveticaBold),
      mono: await embedFont(pdfDoc, '/public/assets/fonts/print/ibm-plex-mono/IBMPlexMono-Regular.ttf', StandardFonts.Courier)
    };
    const colors = {
      gold: rgb(0.91, 0.74, 0.39),
      ivory: rgb(0.93, 0.86, 0.67),
      muted: rgb(0.70, 0.59, 0.39),
      label: rgb(0.56, 0.47, 0.31),
      line: rgb(0.60, 0.48, 0.29),
      micro: rgb(0.43, 0.36, 0.25),
      black: rgb(0.025, 0.02, 0.015)
    };
    const cx = profile.width / 2;

    const bgCandidates = mode === 'wall' ? eventData.bg.a3 : eventData.bg.a4;
    const bg = await embedAsset(pdfDoc, bgCandidates, mode === 'wall' ? 4961 : 3508);
    if (bg) page.drawImage(bg, { x: 0, y: 0, width: profile.width, height: profile.height });
    else page.drawRectangle({ x: 0, y: 0, width: profile.width, height: profile.height, color: colors.black });

    const seal = await embedAsset(pdfDoc, eventData.seal, 1800);
    if (seal) {
      const size = 62 * scale;
      page.drawImage(seal, { x: cx - size / 2, y: 500 * scale, width: size, height: size });
    }

    centerText(page, `${copy.project} · ${eventData.edition}`.toUpperCase(), fonts.metaBold, 7.2 * scale, cx, 479 * scale, colors.muted);

    const titlePlate = await embedAsset(pdfDoc, eventData.title, 3400);
    if (titlePlate) {
      const width = 390 * scale;
      const height = width * (titlePlate.height / titlePlate.width);
      page.drawImage(titlePlate, { x: cx - width / 2, y: 407 * scale, width, height });
    } else {
      centerText(page, copy.title, fonts.title, 31 * scale, cx, 420 * scale, colors.gold);
    }

    page.drawLine({ start: { x: cx - 165 * scale, y: 390 * scale }, end: { x: cx + 165 * scale, y: 390 * scale }, thickness: 0.45 * scale, color: colors.line });
    wrappedCentered(page, copy.body, fonts.body, 12.3 * scale, cx, 361 * scale, 495 * scale, colors.ivory, 1.34);

    const name = participantName();
    centerText(page, copy.forLabel, fonts.meta, 6.6 * scale, cx, 269 * scale, colors.label);
    centerText(page, (name || copy.noName).toUpperCase(), fonts.body, fit(fonts.body, (name || copy.noName).toUpperCase(), 15.8 * scale, 520 * scale, 9 * scale), cx, 247 * scale, colors.ivory);

    const lineY = 204 * scale;
    drawField(page, fonts, copy.dateLabel, eventData.date, 197 * scale, lineY, 150 * scale, colors, scale);
    drawField(page, fonts, copy.placeLabel, eventData.place, cx, lineY, 250 * scale, colors, scale, { valueSize: 8.3, maxLines: 2 });
    drawField(page, fonts, copy.numberLabel, docNumber(), 646 * scale, lineY, 150 * scale, colors, scale, { mono: true, valueSize: 7.4, maxLines: 1 });

    const accent = await embedAsset(pdfDoc, eventData.accent, 900);
    if (accent) {
      const width = 42 * scale;
      page.drawImage(accent, { x: cx - width / 2, y: 144 * scale, width, height: width * (accent.height / accent.width) });
    }
    wrappedCentered(page, copy.closing, fonts.italic, 9.5 * scale, cx, 124 * scale, 525 * scale, colors.ivory, 1.32);

    const signature = await embedAsset(pdfDoc, ['/public/assets/reports/author-signature-gold.svg', '/public/assets/reports/author-signature-gold@2x.png', '/public/assets/reports/author-signature-placeholder.svg'], 2600);
    if (signature) {
      const width = 154 * scale;
      page.drawImage(signature, { x: cx - width / 2, y: 50 * scale, width, height: width * (signature.height / signature.width) });
    } else {
      centerText(page, 'Piotr Jakub Lichwała', fonts.italic, 14 * scale, cx, 66 * scale, colors.ivory);
    }
    centerText(page, copy.authorRole, fonts.meta, 6.2 * scale, cx, 36 * scale, colors.label);
    centerText(page, `${copy.micro} · ${eventData.edition}`.toUpperCase(), fonts.meta, 4.7 * scale, cx, 18 * scale, colors.micro);

    pdfDoc.setTitle(`${copy.title} — ${docNumber()}`);
    pdfDoc.setAuthor('Piotr Jakub Lichwała / Vibrosław');
    pdfDoc.setSubject(`${copy.project} — ${eventData.edition}`);
    pdfDoc.setCreator('Veritas Humanum event-specific PDF generator');
    return await pdfDoc.save({ useObjectStreams: true });
  }

  function download(bytes, mode) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const suffix = (pageProfiles[mode] || pageProfiles.standard).suffix;
    a.href = url;
    a.download = `${copy.filename}-${eventData.code}-${suffix}-${cleanFile(docNumber())}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  async function createPdf(mode, button) {
    if (!pdfLib()?.PDFDocument) {
      status(copy.error);
      return;
    }
    const previousLabel = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = copy.preparing;
    }
    try {
      status(copy.preparing);
      const bytes = await buildPdf(mode);
      download(bytes, mode);
      status(copy.ready);
    } catch (err) {
      console.error(err);
      status(copy.error);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = previousLabel;
      }
    }
  }

  root.addEventListener('click', (ev) => {
    const button = ev.target.closest('[data-pr-pdf], [data-pr-print]');
    if (!button) return;
    const mode = button.getAttribute('data-pr-pdf') === 'wall' ? 'wall' : 'standard';
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
    createPdf(mode, button);
  }, true);
})();
