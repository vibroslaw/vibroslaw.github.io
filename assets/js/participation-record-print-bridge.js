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
    preparing: 'Przygotowuję finalny PDF premium z oryginalnym plikiem SVG seala…',
    ready: 'Finalny PDF premium został przygotowany i pobrany.',
    error: 'Nie udało się wygenerować PDF premium. Odśwież stronę i spróbuj ponownie.',
    title: 'ZAPIS UCZESTNICTWA',
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    forLabel: 'DLA',
    nameGuide: 'IMIĘ I NAZWISKO UCZESTNIKA — OPCJONALNIE',
    dateLabel: 'DATA WYDARZENIA',
    placeLabel: 'MIEJSCE',
    numberLabel: 'NUMER DOKUMENTU',
    authorRole: 'AUTOR PROJEKTU',
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
    preparing: 'Preparing the final premium PDF with the original SVG seal file…',
    ready: 'The final premium PDF has been prepared and downloaded.',
    error: 'Could not generate the premium PDF. Refresh the page and try again.',
    title: 'RECORD OF PARTICIPATION',
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    forLabel: 'FOR',
    nameGuide: 'PARTICIPANT NAME — OPTIONAL',
    dateLabel: 'EVENT DATE',
    placeLabel: 'PLACE',
    numberLabel: 'DOCUMENT NUMBER',
    authorRole: 'PROJECT AUTHOR',
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
      seal: [`${base}oswiecim20260525/accents/anniversary-edition-seal-gold.svg`],
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

  const layout = {
    standard: {
      sealX: 650, sealY: 382, sealSize: 72,
      titleY: 407, titleW: 360,
      projectY: 391, projectSize: 6.8,
      ruleY: 382, ruleW: 300,
      bodyY: 354, bodySize: 12.1, bodyW: 485, bodyLH: 1.28,
      nameLabelY: 266, nameY: 244, nameRuleY: 258, nameRuleW: 300,
      fieldsY: 199, dateX: 198, placeX: 421, numberX: 644,
      dateW: 158, placeW: 312, numberW: 170,
      dateSize: 9.3, placeSize: 8.8, numberSize: 7.2, fieldLabelSize: 5.7,
      accentY: 151, accentW: 36,
      closingY: 128, closingSize: 9.1, closingW: 520,
      signatureY: 56, signatureW: 142,
      authorY: 34, microY: 17, microSize: 4.35
    }
  };

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

  async function loadImage(source) {
    const img = new Image();
    img.decoding = 'async';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = source;
    });
    return img;
  }

  async function svgToPngBytes(svgBytes, width = 1800) {
    const svgText = new TextDecoder('utf-8').decode(svgBytes).replace(/<script[\s\S]*?<\/script>/gi, '');
    const sources = [];
    const blobUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
    sources.push(blobUrl);
    sources.push(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`);
    sources.push(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`);

    let lastError = null;
    try {
      for (const source of sources) {
        try {
          const img = await loadImage(source);
          const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = Math.max(1, Math.round(width / ratio));
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          if (!pngBlob) throw new Error('Canvas did not return PNG data.');
          return new Uint8Array(await pngBlob.arrayBuffer());
        } catch (err) {
          lastError = err;
        }
      }
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
    throw lastError || new Error('SVG could not be rasterized.');
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

  function wrappedCentered(page, lines, font, size, x, y, maxWidth, color, lineHeight = 1.28) {
    let offset = 0;
    for (const rawLine of lines) {
      if (!rawLine) {
        offset += size * 0.68;
        continue;
      }
      for (const line of wrap(font, rawLine, size, maxWidth)) {
        centerText(page, line, font, size, x, y - offset, color);
        offset += size * lineHeight;
      }
    }
    return offset;
  }

  function fit(font, text, preferred, maxWidth, min = 6.2) {
    let size = preferred;
    while (font.widthOfTextAtSize(String(text || ''), size) > maxWidth && size > min) size -= 0.35;
    return size;
  }

  function drawField(page, fonts, label, value, x, lineY, width, colors, scale, opts = {}) {
    const valueFont = opts.mono ? fonts.mono : fonts.body;
    const maxValueWidth = width - 12 * scale;
    const valueSize = fit(valueFont, value, (opts.valueSize || 9.2) * scale, maxValueWidth, 6.1 * scale);
    page.drawLine({ start: { x: x - width / 2, y: lineY }, end: { x: x + width / 2, y: lineY }, thickness: 0.48 * scale, color: colors.line });
    const valueLines = wrap(valueFont, value, valueSize, maxValueWidth).slice(0, opts.maxLines || 2);
    const firstY = lineY + (valueLines.length > 1 ? 21 * scale : 17 * scale);
    valueLines.forEach((line, i) => centerText(page, line, valueFont, valueSize, x, firstY - i * valueSize * 1.15, colors.ivory));
    centerText(page, label, fonts.meta, (opts.labelSize || 5.7) * scale, x, lineY - 16 * scale, colors.label);
  }

  async function buildPdf(mode) {
    const { PDFDocument, StandardFonts, rgb } = pdfLib();
    const profile = pageProfiles[mode] || pageProfiles.standard;
    const scale = mode === 'wall' ? pageProfiles.wall.scale : 1;
    const L = layout.standard;
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
      ivory: rgb(0.91, 0.82, 0.61),
      muted: rgb(0.66, 0.55, 0.36),
      label: rgb(0.52, 0.44, 0.30),
      line: rgb(0.56, 0.45, 0.27),
      micro: rgb(0.36, 0.31, 0.23),
      black: rgb(0.025, 0.02, 0.015)
    };
    const cx = profile.width / 2;

    const bgCandidates = mode === 'wall' ? eventData.bg.a3 : eventData.bg.a4;
    const bg = await embedAsset(pdfDoc, bgCandidates, mode === 'wall' ? 4961 : 3508);
    if (bg) page.drawImage(bg, { x: 0, y: 0, width: profile.width, height: profile.height });
    else page.drawRectangle({ x: 0, y: 0, width: profile.width, height: profile.height, color: colors.black });

    const titlePlate = await embedAsset(pdfDoc, eventData.title, 3400);
    if (titlePlate) {
      const width = L.titleW * scale;
      const height = width * (titlePlate.height / titlePlate.width);
      page.drawImage(titlePlate, { x: cx - width / 2, y: L.titleY * scale, width, height });
    } else {
      centerText(page, copy.title, fonts.title, 30 * scale, cx, (L.titleY + 20) * scale, colors.gold);
    }

    const seal = await embedAsset(pdfDoc, eventData.seal, 2400);
    if (seal) {
      const size = L.sealSize * scale;
      page.drawImage(seal, { x: L.sealX * scale, y: L.sealY * scale, width: size, height: size });
    }

    centerText(page, `${copy.project} · ${eventData.edition}`.toUpperCase(), fonts.metaBold, L.projectSize * scale, cx, L.projectY * scale, colors.muted);
    page.drawLine({ start: { x: cx - L.ruleW * scale / 2, y: L.ruleY * scale }, end: { x: cx + L.ruleW * scale / 2, y: L.ruleY * scale }, thickness: 0.42 * scale, color: colors.line });
    wrappedCentered(page, copy.body, fonts.body, L.bodySize * scale, cx, L.bodyY * scale, L.bodyW * scale, colors.ivory, L.bodyLH);

    const name = participantName();
    if (name) {
      centerText(page, copy.forLabel, fonts.meta, 6.1 * scale, cx, L.nameLabelY * scale, colors.label);
      centerText(page, name.toUpperCase(), fonts.body, fit(fonts.body, name.toUpperCase(), 15.2 * scale, 440 * scale, 9 * scale), cx, L.nameY * scale, colors.ivory);
      page.drawLine({ start: { x: cx - L.nameRuleW * scale / 2, y: L.nameRuleY * scale }, end: { x: cx + L.nameRuleW * scale / 2, y: L.nameRuleY * scale }, thickness: 0.45 * scale, color: colors.line });
    } else {
      page.drawLine({ start: { x: cx - L.nameRuleW * scale / 2, y: L.nameRuleY * scale }, end: { x: cx + L.nameRuleW * scale / 2, y: L.nameRuleY * scale }, thickness: 0.45 * scale, color: colors.line });
      centerText(page, copy.nameGuide, fonts.meta, 5.7 * scale, cx, (L.nameRuleY - 16) * scale, colors.label);
    }

    const lineY = L.fieldsY * scale;
    drawField(page, fonts, copy.dateLabel, eventData.date, L.dateX * scale, lineY, L.dateW * scale, colors, scale, { valueSize: L.dateSize, labelSize: L.fieldLabelSize, maxLines: 1 });
    drawField(page, fonts, copy.placeLabel, eventData.place, L.placeX * scale, lineY, L.placeW * scale, colors, scale, { valueSize: L.placeSize, labelSize: L.fieldLabelSize, maxLines: 2 });
    drawField(page, fonts, copy.numberLabel, docNumber(), L.numberX * scale, lineY, L.numberW * scale, colors, scale, { mono: true, valueSize: L.numberSize, labelSize: L.fieldLabelSize, maxLines: 1 });

    const accent = await embedAsset(pdfDoc, eventData.accent, 900);
    if (accent) {
      const width = L.accentW * scale;
      page.drawImage(accent, { x: cx - width / 2, y: L.accentY * scale, width, height: width * (accent.height / accent.width) });
    }
    wrappedCentered(page, copy.closing, fonts.italic, L.closingSize * scale, cx, L.closingY * scale, L.closingW * scale, colors.ivory, 1.28);

    const signature = await embedAsset(pdfDoc, ['/public/assets/reports/author-signature-gold.svg', '/public/assets/reports/author-signature-gold@2x.png', '/public/assets/reports/author-signature-placeholder.svg'], 2600);
    if (signature) {
      const width = L.signatureW * scale;
      page.drawImage(signature, { x: cx - width / 2, y: L.signatureY * scale, width, height: width * (signature.height / signature.width) });
    } else {
      centerText(page, 'Piotr Jakub Lichwała', fonts.italic, 12 * scale, cx, (L.signatureY + 10) * scale, colors.ivory);
    }
    centerText(page, copy.authorRole, fonts.meta, 5.8 * scale, cx, L.authorY * scale, colors.label);
    centerText(page, `${copy.micro} · ${eventData.edition}`.toUpperCase(), fonts.meta, L.microSize * scale, cx, L.microY * scale, colors.micro);

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
