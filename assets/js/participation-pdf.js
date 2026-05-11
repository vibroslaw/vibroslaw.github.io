(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root || !window.PDFLib) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const { PDFDocument } = window.PDFLib;

  const COPY = {
    pl: {
      preparing: 'Przygotowuję prawdziwy plik PDF do druku premium…',
      ready: 'PDF premium został przygotowany i pobrany.',
      error: 'Nie udało się wygenerować PDF. Spróbuj ponownie albo użyj awaryjnego trybu druku.',
      retrying: 'Urządzenie ma ograniczoną pamięć. Tworzę lżejszą wersję PDF w jakości bezpiecznej.',
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
      filePrefix: 'Rap-Ort-Zapis-Uczestnictwa',
      preflightTitle: 'Kontrola jakości PDF',
      preflightReady: 'PDF engine gotowy',
      preflightBgOk: 'Tło załadowane w jakości A4',
      preflightBgLow: 'Tło załadowane, ale warto podmienić je na finalne A4 300 DPI',
      preflightLegacy: 'Używam roboczej / legacy nazwy tła. Finalne nazwy plików nadal są zalecane.',
      preflightNoBg: 'Nie znaleziono tła. PDF użyje eleganckiego tła awaryjnego.',
      preflightSignatureOk: 'Podpis autora załadowany',
      preflightSignatureFallback: 'Podpis SVG niedostępny — użyję podpisu tekstowego',
      preflightMobile: 'Na tym urządzeniu PDF może generować się wolniej. Najlepszy efekt: komputer / tablet.',
      pdfSize: 'Rozmiar pliku',
      qualityPremium: 'jakość premium A4 300 DPI',
      qualitySafe: 'jakość bezpieczna dla urządzenia'
    },
    en: {
      preparing: 'Preparing a true premium print PDF…',
      ready: 'Premium PDF has been prepared and downloaded.',
      error: 'Could not generate the PDF. Try again or use the fallback print mode.',
      retrying: 'This device has limited memory. Creating a lighter safe-quality PDF.',
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
      filePrefix: 'Rap-Ort-Record-of-Participation',
      preflightTitle: 'PDF quality check',
      preflightReady: 'PDF engine ready',
      preflightBgOk: 'Background loaded in A4 quality',
      preflightBgLow: 'Background loaded, but replacing it with final A4 300 DPI is recommended',
      preflightLegacy: 'Using a working / legacy background filename. Final asset filenames are still recommended.',
      preflightNoBg: 'No background found. PDF will use an elegant fallback background.',
      preflightSignatureOk: 'Author signature loaded',
      preflightSignatureFallback: 'Signature SVG unavailable — using text signature fallback',
      preflightMobile: 'PDF generation may be slower on this device. Best result: desktop or tablet.',
      pdfSize: 'File size',
      qualityPremium: 'premium A4 300 DPI quality',
      qualitySafe: 'safe device quality'
    }
  };

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

  const DESIGN = { width: 3508, height: 2480 };
  const RENDER = {
    premium: { width: 3508, height: 2480, quality: 0.94, label: COPY[lang].qualityPremium },
    safe: { width: 2480, height: 1754, quality: 0.92, label: COPY[lang].qualitySafe }
  };
  const PDF = { width: 841.89, height: 595.28 };
  const MIN_PRINT_BG = { width: 3000, height: 2100 };
  const SIGNATURE_PATH = '/public/assets/reports/author-signature-placeholder.svg';

  const imageCache = new Map();
  const copy = COPY[lang];
  const $ = (sel) => root.querySelector(sel);
  const all = (sel) => [...root.querySelectorAll(sel)];
  const printButton = $('[data-pr-print]');
  if (!printButton) return;

  const premiumButton = printButton.cloneNode(true);
  premiumButton.textContent = copy.button;
  premiumButton.setAttribute('data-pr-pdf', 'true');
  printButton.replaceWith(premiumButton);

  const preflightPanel = createPreflightPanel();
  runPreflight();

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
    if (!value) return copy.fallbackDate;
    try {
      return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
    if (!d.place) return copy.missingPlace;
    if (!d.dateValue) return copy.missingDate;
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
      img.onload = () => resolve({ img, url, src });
      img.onerror = () => resolve(null);
      img.src = url;
    });
    imageCache.set(url, promise);
    return promise;
  }

  async function resolveImage(candidates) {
    for (let index = 0; index < candidates.length; index += 1) {
      const loaded = await loadImage(candidates[index]);
      if (loaded) return { ...loaded, index };
    }
    return null;
  }

  function createPreflightPanel() {
    const recommendation = $('.pr-print-recommendation');
    const panel = document.createElement('div');
    panel.className = 'pr-preflight';
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = `<strong>${copy.preflightTitle}</strong><ul></ul>`;
    recommendation?.insertAdjacentElement('afterend', panel);
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
      const w = bg.img.naturalWidth || bg.img.width;
      const h = bg.img.naturalHeight || bg.img.height;
      const goodSize = w >= MIN_PRINT_BG.width && h >= MIN_PRINT_BG.height;
      items.push({
        level: goodSize ? 'ok' : 'warn',
        text: `${goodSize ? copy.preflightBgOk : copy.preflightBgLow} (${w} × ${h}px)`
      });
      if (bg.index > 0) items.push({ level: 'warn', text: copy.preflightLegacy });
    }
    const signature = await loadImage(SIGNATURE_PATH);
    items.push({ level: signature ? 'ok' : 'warn', text: signature ? copy.preflightSignatureOk : copy.preflightSignatureFallback });
    if (isConstrainedDevice()) items.push({ level: 'warn', text: copy.preflightMobile });
    renderPreflight(items);
  }

  function isConstrainedDevice() {
    const memory = Number(navigator.deviceMemory || 8);
    const smallViewport = Math.min(window.innerWidth || 1280, window.innerHeight || 720) < 760;
    return memory <= 3 || smallViewport;
  }

  function drawCover(ctx, img, size) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(size.width / iw, size.height / ih);
    const sw = size.width / scale;
    const sh = size.height / scale;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size.width, size.height);
  }

  function drawFallbackBackground(ctx, size) {
    const grad = ctx.createLinearGradient(0, 0, size.width, size.height);
    grad.addColorStop(0, '#050403');
    grad.addColorStop(0.48, '#17110c');
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
    const signature = await loadImage(SIGNATURE_PATH);
    if (signature?.img) {
      const img = signature.img;
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
      return { top: 300, titleY: 565, bodyY: 790, fieldsY: 1330, closingY: 1780, signY: 2030, titleSize: 172, bodySize: 66, closingSize: 58, fieldWidth: 760 };
    }
    if (layoutName === 'ceremonial') {
      return { top: 330, titleY: 610, bodyY: 850, fieldsY: 1370, closingY: 1810, signY: 2045, titleSize: 192, bodySize: 64, closingSize: 56, fieldWidth: 700 };
    }
    return { top: 350, titleY: 610, bodyY: 835, fieldsY: 1385, closingY: 1815, signY: 2055, titleSize: 168, bodySize: 65, closingSize: 56, fieldWidth: 720 };
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
    const l = layout(d.variant.layout);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ead8b4';

    ctx.font = font(52, 'Georgia');
    drawSpacedText(ctx, copy.project, DESIGN.width / 2, l.top, 14);

    ctx.font = font(l.titleSize, 'Georgia', '500');
    drawSpacedText(ctx, copy.title, DESIGN.width / 2, l.titleY, 18);

    ctx.font = font(l.bodySize, 'Georgia');
    ctx.fillStyle = 'rgba(244,232,205,.92)';
    drawCenteredLines(ctx, copy.body, DESIGN.width / 2, l.bodyY, l.bodySize * 1.55);

    const afterBodyOffset = copy.body.filter(Boolean).length * l.bodySize * 1.35 + 35;
    if (d.name) {
      ctx.font = font(62, 'Georgia');
      ctx.fillStyle = '#f3dfb7';
      ctx.fillText(`${copy.forLabel} ${d.name}`, DESIGN.width / 2, l.bodyY + afterBodyOffset);
    }

    const fieldsX = [DESIGN.width * 0.26, DESIGN.width * 0.5, DESIGN.width * 0.74];
    drawField(ctx, copy.dateLabel, d.date, fieldsX[0], l.fieldsY, l.fieldWidth);
    drawField(ctx, copy.placeLabel, d.place || copy.fallbackPlace, fieldsX[1], l.fieldsY, l.fieldWidth);
    drawField(ctx, copy.numberLabel, d.number, fieldsX[2], l.fieldsY, l.fieldWidth);

    ctx.font = font(l.closingSize, 'Georgia');
    ctx.fillStyle = 'rgba(244,232,205,.86)';
    drawCenteredLines(ctx, copy.closing, DESIGN.width / 2, l.closingY, l.closingSize * 1.48);

    const signHeight = await drawSignature(ctx, DESIGN.width / 2, l.signY, 980);
    ctx.font = font(48, 'Georgia');
    ctx.fillStyle = '#f4e5c7';
    ctx.fillText('Piotr Jakub Lichwała', DESIGN.width / 2, l.signY + signHeight + 36);
    ctx.font = font(38, 'Arial');
    ctx.fillStyle = 'rgba(232,206,150,.68)';
    drawSpacedText(ctx, copy.authorRole.toUpperCase(), DESIGN.width / 2, l.signY + signHeight + 92, 5);
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
    pdfDoc.setCreator('Veritas Humanum');
    pdfDoc.setProducer('Veritas Humanum client-side PDF generator');
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
        console.warn('Premium PDF render failed, retrying safe render.', err);
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
          ? 'Dziękujemy za udział w doświadczeniu Rap-Ort: Prawda Sumienia.'
          : 'Thank you for participating in the Rap-Ort: Prawda Sumienia experience.';
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
