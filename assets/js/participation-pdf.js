(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root || !window.PDFLib) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const { PDFDocument } = window.PDFLib;

  const COPY = {
    pl: {
      preparing: 'Przygotowuję prawdziwy plik PDF do druku premium…',
      ready: 'PDF premium został przygotowany i pobrany. To wersja gotowa do wydruku A4 poziomo.',
      error: 'Nie udało się wygenerować PDF. Spróbuj ponownie albo użyj awaryjnego trybu druku.',
      missingPlace: 'Uzupełnij miejsce / instytucję.',
      missingDate: 'Uzupełnij datę wydarzenia.',
      button: 'Pobierz PDF premium',
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
      dateLabel: 'Data wydarzenia:',
      placeLabel: 'Miejsce:',
      numberLabel: 'Numer dokumentu:',
      authorRole: 'autor projektu',
      fallbackDate: 'Data wydarzenia',
      fallbackPlace: 'Miejsce / instytucja',
      filePrefix: 'Rap-Ort-Zapis-Uczestnictwa'
    },
    en: {
      preparing: 'Preparing a true premium print PDF…',
      ready: 'Premium PDF has been prepared and downloaded. It is ready for A4 landscape printing.',
      error: 'Could not generate the PDF. Try again or use the fallback print mode.',
      missingPlace: 'Enter the place / institution.',
      missingDate: 'Enter the event date.',
      button: 'Download premium PDF',
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
      dateLabel: 'Event date:',
      placeLabel: 'Place:',
      numberLabel: 'Document number:',
      authorRole: 'project author',
      fallbackDate: 'Event date',
      fallbackPlace: 'Place / institution',
      filePrefix: 'Rap-Ort-Record-of-Participation'
    }
  }[lang];

  const EVENTS = {
    syd2026: {
      code: 'SYD',
      dateInput: '2026-06-21',
      pl: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 czerwca 2026' },
      en: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 June 2026' }
    }
  };

  const VARIANTS = {
    cinema: {
      layout: 'cinema',
      bgCandidates: [
        '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg',
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
      ]
    },
    ceremonial: {
      layout: 'ceremonial',
      bgCandidates: [
        '/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg',
        '/public/assets/reports/participation-record-bg-a4-300dpi3.jpeg'
      ]
    }
  };

  const CANVAS = { width: 3508, height: 2480 };
  const PDF = { width: 841.89, height: 595.28 };
  const IMAGE_SCALE = 4.17;
  const imageCache = new Map();

  const $ = (sel) => root.querySelector(sel);
  const all = (sel) => [...root.querySelectorAll(sel)];
  const printButton = $('[data-pr-print]');
  if (!printButton) return;

  const premiumButton = printButton.cloneNode(true);
  premiumButton.textContent = COPY.button;
  premiumButton.setAttribute('data-pr-pdf', 'true');
  printButton.replaceWith(premiumButton);

  function status(message) {
    all('[data-pr-status]').forEach((node) => { node.textContent = message || ''; });
  }

  function field(name) {
    return root.querySelector(`[name="${name}"]`);
  }

  function selectedVariant() {
    const checked = root.querySelector('[name="recordVariant"]:checked');
    return VARIANTS[checked ? checked.value : 'cinema'] || VARIANTS.cinema;
  }

  function eventKey() {
    const preset = field('eventPreset');
    return preset ? preset.value : 'custom';
  }

  function displayDate() {
    const key = eventKey();
    if (EVENTS[key]) return EVENTS[key][lang].dateLabel;
    const input = field('eventDate');
    const value = input ? input.value : '';
    if (!value) return COPY.fallbackDate;
    try {
      return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', {
        year: 'numeric', month: 'long', day: 'numeric'
      }).format(new Date(`${value}T00:00:00`));
    } catch (_) {
      return value;
    }
  }

  function data() {
    const name = field('participantName')?.value.trim() || '';
    const place = field('place')?.value.trim() || '';
    const dateValue = field('eventDate')?.value || '';
    const number = field('documentNumber')?.value || '';
    return { name, place, dateValue, date: displayDate(), number, variant: selectedVariant() };
  }

  function validate(d) {
    if (!d.place) return COPY.missingPlace;
    if (!d.dateValue) return COPY.missingDate;
    return '';
  }

  function abs(path) {
    return new URL(path, window.location.origin).href;
  }

  function loadImage(src) {
    const url = abs(src);
    if (imageCache.has(url)) return imageCache.get(url);
    const promise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
    imageCache.set(url, promise);
    return promise;
  }

  async function resolveImage(candidates) {
    for (const candidate of candidates) {
      const img = await loadImage(candidate);
      if (img) return img;
    }
    return null;
  }

  function drawCover(ctx, img) {
    const cw = CANVAS.width;
    const ch = CANVAS.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = cw / scale;
    const sh = ch / scale;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }

  function drawFallbackBackground(ctx) {
    const grad = ctx.createLinearGradient(0, 0, CANVAS.width, CANVAS.height);
    grad.addColorStop(0, '#050403');
    grad.addColorStop(0.48, '#17110c');
    grad.addColorStop(1, '#080605');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.strokeStyle = 'rgba(231,211,174,.48)';
    ctx.lineWidth = 8;
    ctx.strokeRect(150, 150, CANVAS.width - 300, CANVAS.height - 300);
    ctx.strokeStyle = 'rgba(231,211,174,.18)';
    ctx.lineWidth = 3;
    ctx.strokeRect(210, 210, CANVAS.width - 420, CANVAS.height - 420);
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

  function drawField(ctx, label, value, x, y, width) {
    ctx.strokeStyle = 'rgba(232,206,150,.42)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x + width / 2, y);
    ctx.stroke();
    ctx.font = font(42, 'Arial', '400');
    ctx.fillStyle = 'rgba(232,206,150,.66)';
    ctx.textAlign = 'center';
    drawSpacedText(ctx, label.toUpperCase(), x, y + 58, 4);
    ctx.font = font(58, 'Georgia', '400');
    ctx.fillStyle = '#f2e4c7';
    ctx.fillText(value, x, y + 132, width - 20);
  }

  async function drawSignature(ctx, x, y, maxWidth) {
    const img = await loadImage('/public/assets/reports/author-signature-placeholder.svg');
    if (img) {
      const ratio = (img.naturalHeight || img.height) / (img.naturalWidth || img.width);
      const width = maxWidth;
      const height = width * ratio;
      ctx.drawImage(img, x - width / 2, y, width, height);
      return height;
    }
    ctx.font = font(74, 'Georgia', '400', 'italic');
    ctx.fillStyle = '#e7d3ae';
    ctx.textAlign = 'center';
    ctx.fillText('Piotr Jakub Lichwała', x, y + 72);
    return 90;
  }

  function layout(layoutName) {
    if (layoutName === 'museum') {
      return { top: 300, titleY: 565, bodyY: 790, fieldsY: 1330, closingY: 1780, signY: 2030, titleSize: 172, bodySize: 66, closingSize: 58, bodyWidth: 2450, fieldWidth: 760 };
    }
    if (layoutName === 'ceremonial') {
      return { top: 330, titleY: 610, bodyY: 850, fieldsY: 1370, closingY: 1810, signY: 2045, titleSize: 192, bodySize: 64, closingSize: 56, bodyWidth: 2300, fieldWidth: 700 };
    }
    return { top: 350, titleY: 610, bodyY: 835, fieldsY: 1385, closingY: 1815, signY: 2055, titleSize: 168, bodySize: 65, closingSize: 56, bodyWidth: 2400, fieldWidth: 720 };
  }

  async function renderCanvas(d) {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS.width;
    canvas.height = CANVAS.height;
    const ctx = canvas.getContext('2d');
    const bg = await resolveImage(d.variant.bgCandidates);
    if (bg) drawCover(ctx, bg);
    else drawFallbackBackground(ctx);

    const l = layout(d.variant.layout);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ead8b4';

    ctx.font = font(52, 'Georgia');
    drawSpacedText(ctx, COPY.project, CANVAS.width / 2, l.top, 14);

    ctx.font = font(l.titleSize, 'Georgia', '500');
    drawSpacedText(ctx, COPY.title, CANVAS.width / 2, l.titleY, 18);

    ctx.font = font(l.bodySize, 'Georgia');
    ctx.fillStyle = 'rgba(244,232,205,.92)';
    drawCenteredLines(ctx, COPY.body, CANVAS.width / 2, l.bodyY, l.bodySize * 1.55);

    let afterBodyOffset = COPY.body.filter(Boolean).length * l.bodySize * 1.35 + 35;
    if (d.name) {
      ctx.font = font(62, 'Georgia');
      ctx.fillStyle = '#f3dfb7';
      ctx.fillText(`${COPY.forLabel} ${d.name}`, CANVAS.width / 2, l.bodyY + afterBodyOffset);
    }

    const fieldsX = [CANVAS.width * 0.26, CANVAS.width * 0.5, CANVAS.width * 0.74];
    drawField(ctx, COPY.dateLabel, d.date, fieldsX[0], l.fieldsY, l.fieldWidth);
    drawField(ctx, COPY.placeLabel, d.place || COPY.fallbackPlace, fieldsX[1], l.fieldsY, l.fieldWidth);
    drawField(ctx, COPY.numberLabel, d.number, fieldsX[2], l.fieldsY, l.fieldWidth);

    ctx.font = font(l.closingSize, 'Georgia');
    ctx.fillStyle = 'rgba(244,232,205,.86)';
    drawCenteredLines(ctx, COPY.closing, CANVAS.width / 2, l.closingY, l.closingSize * 1.48);

    const signHeight = await drawSignature(ctx, CANVAS.width / 2, l.signY, 980);
    ctx.font = font(48, 'Georgia');
    ctx.fillStyle = '#f4e5c7';
    ctx.fillText('Piotr Jakub Lichwała', CANVAS.width / 2, l.signY + signHeight + 36);
    ctx.font = font(38, 'Arial');
    ctx.fillStyle = 'rgba(232,206,150,.68)';
    drawSpacedText(ctx, COPY.authorRole.toUpperCase(), CANVAS.width / 2, l.signY + signHeight + 92, 5);

    return canvas;
  }

  function canvasToPngBytes(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas export failed'));
        blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer))).catch(reject);
      }, 'image/png', 1);
    });
  }

  function safeFileName(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 120);
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

  async function createPdf() {
    const d = data();
    const error = validate(d);
    if (error) {
      status(error);
      return;
    }
    try {
      status(COPY.preparing);
      const canvas = await renderCanvas(d);
      const pngBytes = await canvasToPngBytes(canvas);
      const pdfDoc = await PDFDocument.create();
      pdfDoc.setTitle(`${COPY.title} — ${d.number}`);
      pdfDoc.setAuthor('Piotr Jakub Lichwała / Vibrosław');
      pdfDoc.setSubject('Rap-Ort: Prawda Sumienia — Participation Record');
      pdfDoc.setCreator('Veritas Humanum');
      pdfDoc.setProducer('Veritas Humanum client-side PDF generator');
      const page = pdfDoc.addPage([PDF.width, PDF.height]);
      const image = await pdfDoc.embedPng(pngBytes);
      page.drawImage(image, { x: 0, y: 0, width: PDF.width, height: PDF.height });
      const bytes = await pdfDoc.save({ useObjectStreams: true });
      const filename = `${COPY.filePrefix}-${safeFileName(d.number)}.pdf`;
      download(bytes, filename);
      status(COPY.ready);
      const finale = $('[data-pr-finale]');
      if (finale) {
        finale.hidden = false;
        finale.textContent = lang === 'pl'
          ? 'Dziękujemy za udział w doświadczeniu Rap-Ort: Prawda Sumienia.'
          : 'Thank you for participating in the Rap-Ort: Prawda Sumienia experience.';
      }
    } catch (error) {
      console.error(error);
      status(COPY.error);
    }
  }

  premiumButton.addEventListener('click', createPdf);
})();
