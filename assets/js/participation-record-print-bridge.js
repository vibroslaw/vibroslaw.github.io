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
    preparing: 'Przygotowuję print-master PDF z warstwą premium…',
    ready: 'Print-master PDF został przygotowany i pobrany.',
    error: 'Nie udało się wygenerować PDF. Sprawdź, czy PDFLib i assety zostały załadowane.',
    title: 'ZAPIS UCZESTNICTWA',
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    forLabel: 'DLA',
    dateLabel: 'DATA WYDARZENIA',
    placeLabel: 'MIEJSCE',
    numberLabel: 'NUMER DOKUMENTU',
    authorRole: 'AUTOR PROJEKTU',
    body: ['Dokument upamiętnia udział w projekcji audiowizualnej', '„Rap-Ort: Prawda Sumienia”', '', 'autorskim doświadczeniu muzyki, obrazu, słowa i ciszy,', 'poświęconym pamięci, świadectwu, sumieniu', 'oraz odpowiedzialności człowieka wobec prawdy.'],
    closing: ['Pamiątkowy ślad wydarzenia, w którym historia', 'staje się pytaniem, które uczestnik zabiera ze sobą.'],
    micro: 'Pamiątkowy zapis uczestnictwa · nie jest dyplomem ani dokumentem urzędowym · nie oznacza patronatu instytucji.'
  } : {
    preparing: 'Preparing premium print-master PDF…',
    ready: 'Print-master PDF has been prepared and downloaded.',
    error: 'Could not generate the PDF. Check whether PDFLib and assets are loaded.',
    title: 'RECORD OF PARTICIPATION',
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    forLabel: 'FOR',
    dateLabel: 'EVENT DATE',
    placeLabel: 'PLACE',
    numberLabel: 'DOCUMENT NUMBER',
    authorRole: 'PROJECT AUTHOR',
    body: ['This document commemorates participation in the audiovisual screening of', '“Rap-Ort: Prawda Sumienia”', '', 'an authorial experience of music, image, words and silence,', 'devoted to memory, testimony, conscience', 'and human responsibility before truth.'],
    closing: ['A commemorative trace of an event in which history', 'becomes a question the participant carries forward.'],
    micro: 'Commemorative record of participation · not an official certificate · does not imply institutional patronage.'
  };

  const events = {
    oswiecim20260525: {
      code: 'OSW',
      dateInput: '2026-05-25',
      date: lang === 'pl' ? '25 maja 2026' : '25 May 2026',
      edition: lang === 'pl' ? 'Oświęcim / MUP · 25 maja 2026' : 'Oświęcim / MUP · 25 May 2026',
      place: lang === 'pl' ? 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu' : 'Małopolska State University named after Cavalry Captain Witold Pilecki in Oświęcim',
      bg: [`${base}oswiecim20260525/backgrounds/participation-record-bg-a4.jpg`, `${base}oswiecim20260525/backgrounds/participation-record-bg-a3.jpg`, '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg'],
      title: [`${base}oswiecim20260525/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg`, `${base}oswiecim20260525/title-plates/title-zapis-uczestnictwa-gold.svg`, '/public/assets/reports/title-plates/title-zapis-uczestnictwa-gold.svg'],
      seal: [`${base}oswiecim20260525/accents/anniversary-edition-seal-gold.svg`, `${base}oswiecim20260525/accents/event-seal-gold.svg`, `${base}shared/seals/rap-ort-seal-gold.svg`],
      accent: [`${base}oswiecim20260525/accents/event-accent-gold.svg`, `${base}shared/seals/vh-seal-gold.svg`]
    },
    syd2026: {
      code: 'SYD',
      dateInput: '2026-06-21',
      date: lang === 'pl' ? '21 czerwca 2026' : '21 June 2026',
      edition: 'Sydney 2026',
      place: 'Polish Club Ashfield / Sydney',
      bg: [`${base}syd2026/backgrounds/participation-record-bg-a4.jpg`, '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg'],
      title: [`${base}syd2026/title-plates/title-zapis-uczestnictwa-gold.svg`, '/public/assets/reports/title-plates/title-zapis-uczestnictwa-gold.svg'],
      seal: [`${base}syd2026/accents/international-screening-seal-gold.svg`, `${base}syd2026/accents/event-seal-gold.svg`, `${base}shared/seals/rap-ort-seal-gold.svg`],
      accent: [`${base}syd2026/accents/event-accent-gold.svg`, `${base}shared/seals/vh-seal-gold.svg`]
    }
  };

  const eventData = events[eventKey];
  const $ = (sel) => root.querySelector(sel);
  const status = (text) => root.querySelectorAll('[data-pr-status]').forEach((node) => { node.textContent = text; });
  const escFile = (text) => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
  const abs = (path) => new URL(path, location.origin).href;

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
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 3;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.max(1, Math.round(width / ratio));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      return new Uint8Array(await out.arrayBuffer());
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function embed(pdfDoc, candidates, svgWidth) {
    const asset = await first(candidates);
    if (!asset) return null;
    const p = asset.path.toLowerCase();
    try {
      if (p.endsWith('.svg')) return pdfDoc.embedPng(await svgToPngBytes(asset.bytes, svgWidth));
      if (p.endsWith('.png')) return pdfDoc.embedPng(asset.bytes);
      return pdfDoc.embedJpg(asset.bytes);
    } catch (err) {
      console.warn('Could not embed asset', asset.path, err);
      return null;
    }
  }

  async function font(pdfDoc, path, fallback) {
    try {
      if ((window.fontkit || window.Fontkit) && pdfDoc.registerFontkit) {
        pdfDoc.registerFontkit(window.fontkit || window.Fontkit);
        const res = await fetch(abs(path));
        if (res.ok) return pdfDoc.embedFont(new Uint8Array(await res.arrayBuffer()), { subset: true });
      }
    } catch (_) {}
    return pdfDoc.embedFont(fallback);
  }

  function centerText(page, text, fontObj, size, x, y, color) {
    const w = fontObj.widthOfTextAtSize(text, size);
    page.drawText(text, { x: x - w / 2, y, size, font: fontObj, color });
  }

  function wrap(fontObj, text, size, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (fontObj.widthOfTextAtSize(test, size) > maxWidth && line) { lines.push(line); line = word; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawLines(page, lines, fontObj, size, x, y, color, gap = 1.42) {
    let offset = 0;
    lines.forEach((line) => {
      if (!line) { offset += size * gap; return; }
      wrap(fontObj, line, size, 455).forEach((sub) => {
        centerText(page, sub, fontObj, size, x, y - offset, color);
        offset += size * gap;
      });
    });
  }

  function docNumber() {
    const existing = $('[name="documentNumber"]')?.value;
    if (existing) return existing;
    const dateCode = eventData.dateInput.slice(5, 7) + eventData.dateInput.slice(8, 10);
    const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    return `${lang === 'pl' ? 'VH-ZU' : 'VH-REC'}-${eventData.dateInput.slice(0, 4)}-${dateCode}-${eventData.code}-${seq}`;
  }

  async function createPdf() {
    if (!pdfLib()?.PDFDocument) { status(copy.error); return; }
    const button = $('[data-pr-print]');
    button.disabled = true;
    try {
      status(copy.preparing);
      const { PDFDocument, StandardFonts, rgb } = pdfLib();
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([841.89, 595.28]);
      const fonts = {
        title: await font(pdfDoc, '/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf', StandardFonts.TimesRomanBold),
        body: await font(pdfDoc, '/public/assets/fonts/print/source-serif-4/SourceSerif4-Regular.ttf', StandardFonts.TimesRoman),
        italic: await font(pdfDoc, '/public/assets/fonts/print/source-serif-4/SourceSerif4-Italic.ttf', StandardFonts.TimesRomanItalic),
        meta: await font(pdfDoc, '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-Regular.ttf', StandardFonts.Helvetica),
        mono: await font(pdfDoc, '/public/assets/fonts/print/ibm-plex-mono/IBMPlexMono-Regular.ttf', StandardFonts.Courier)
      };
      const colors = { gold: rgb(0.9, 0.74, 0.43), ivory: rgb(0.94, 0.86, 0.68), muted: rgb(0.68, 0.57, 0.38), line: rgb(0.58, 0.48, 0.3), micro: rgb(0.46, 0.39, 0.28) };
      const bg = await embed(pdfDoc, eventData.bg, 3508);
      if (bg) page.drawImage(bg, { x: 0, y: 0, width: 841.89, height: 595.28 });
      else page.drawRectangle({ x: 0, y: 0, width: 841.89, height: 595.28, color: rgb(0.025, 0.02, 0.015) });

      const seal = await embed(pdfDoc, eventData.seal, 900);
      if (seal) page.drawImage(seal, { x: 391, y: 504, width: 60, height: 60 });
      centerText(page, `${copy.project} · ${eventData.edition}`.toUpperCase(), fonts.meta, 9.5, 421, 486, colors.muted);

      const title = await embed(pdfDoc, eventData.title, 3400);
      if (title) {
        const tw = 350;
        page.drawImage(title, { x: 421 - tw / 2, y: 420, width: tw, height: tw * (title.height / title.width) });
      } else {
        centerText(page, copy.title, fonts.title, 34, 421, 430, colors.gold);
      }

      drawLines(page, copy.body, fonts.body, 13.2, 421, 357, colors.ivory, 1.35);
      const name = $('[name="participantName"]')?.value.trim() || '';
      if (name) {
        centerText(page, copy.forLabel, fonts.meta, 8.5, 421, 266, colors.muted);
        centerText(page, name.toUpperCase(), fonts.body, 16.5, 421, 246, colors.ivory);
      }

      const fieldsY = 206;
      const fields = [
        [copy.dateLabel, eventData.date, 205, fonts.body],
        [copy.placeLabel, eventData.place, 421, fonts.body],
        [copy.numberLabel, docNumber(), 637, fonts.mono]
      ];
      fields.forEach(([label, value, x, f]) => {
        page.drawLine({ start: { x: x - 85, y: fieldsY }, end: { x: x + 85, y: fieldsY }, thickness: 0.55, color: colors.line });
        centerText(page, String(value), f, f === fonts.mono ? 8.2 : 9.2, x, fieldsY + 16, colors.ivory);
        centerText(page, String(label), fonts.meta, 6.5, x, fieldsY - 16, colors.muted);
      });

      const accent = await embed(pdfDoc, eventData.accent, 700);
      if (accent) page.drawImage(accent, { x: 397, y: 135, width: 48, height: 48 * (accent.height / accent.width) });
      drawLines(page, copy.closing, fonts.italic, 10.5, 421, 118, colors.ivory, 1.32);

      const signature = await embed(pdfDoc, ['/public/assets/reports/author-signature-gold.svg', '/public/assets/reports/author-signature-placeholder.svg'], 2400);
      if (signature) page.drawImage(signature, { x: 421 - 90, y: 44, width: 180, height: 180 * (signature.height / signature.width) });
      centerText(page, copy.authorRole, fonts.meta, 6.5, 421, 35, colors.muted);
      centerText(page, `${copy.micro} · ${eventData.edition}`.toUpperCase(), fonts.meta, 5.2, 421, 18, colors.micro);

      pdfDoc.setTitle(`${copy.title} — ${docNumber()}`);
      pdfDoc.setAuthor('Piotr Jakub Lichwała / Vibrosław');
      pdfDoc.setCreator('Veritas Humanum browser PDF generator');
      const bytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rap-Ort-Zapis-Uczestnictwa-${escFile(docNumber())}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      status(copy.ready);
    } catch (err) {
      console.error(err);
      status(copy.error);
    } finally {
      button.disabled = false;
    }
  }

  root.addEventListener('click', (ev) => {
    const button = ev.target.closest('[data-pr-print]');
    if (!button) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
    createPdf();
  }, true);
})();
