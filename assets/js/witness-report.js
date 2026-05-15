(() => {
  const root = document.querySelector('[data-witness-report]');
  if (!root || !window.PDFLib) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const { PDFDocument } = window.PDFLib;
  const W = 2480;
  const H = 3508;
  const PW = 595.28;
  const PH = 841.89;

  const ASSETS = {
    background: [
      '/public/assets/reports/witness-report-bg-01-archival-paper-a4.jpg',
      '/public/assets/reports/witness-report-bg-a4-300dpi.png'
    ],
    texture: ['/public/assets/reports/witness-report-paper-texture.webp'],
    titlePlate: {
      pl: '/public/assets/reports/title-plates/title-raport-swiadka-dark.svg',
      en: '/public/assets/reports/title-plates/title-witness-report-dark.svg'
    }
  };

  const C = lang === 'pl' ? {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'RAPORT ŚWIADKA',
    button: 'Pobierz Raport Świadka PDF',
    preparing: 'Przygotowuję Raport Świadka jako PDF…',
    ready: 'Raport Świadka został przygotowany i pobrany.',
    error: 'Nie udało się wygenerować Raportu Świadka. Spróbuj ponownie.',
    missing: 'Wpisz kilka słów, które zostają po projekcji.',
    name: 'Imię i nazwisko',
    date: 'Data',
    place: 'Miejsce',
    number: 'Numer raportu',
    signature: 'Podpis świadka doświadczenia',
    fallbackName: 'Świadek doświadczenia',
    fallbackPlace: 'Miejsce wydarzenia',
    file: 'Rap-Ort-Raport-Swiadka',
    finale: 'Raport Świadka został zachowany jako osobisty ślad refleksji.',
    microprint: 'To nie jest test wiedzy ani dokument urzędowy. To osobisty ślad refleksji po projekcji.'
  } : {
    project: 'RAP-ORT: PRAWDA SUMIENIA',
    title: 'WITNESS REPORT',
    button: 'Download Witness Report PDF',
    preparing: 'Preparing your Witness Report PDF…',
    ready: 'Witness Report has been prepared and downloaded.',
    error: 'Could not generate the Witness Report. Try again.',
    missing: 'Write a few words that remain after the screening.',
    name: 'Name',
    date: 'Date',
    place: 'Place',
    number: 'Report number',
    signature: 'Signature of the witness to the experience',
    fallbackName: 'Witness to the experience',
    fallbackPlace: 'Event place',
    file: 'Rap-Ort-Witness-Report',
    finale: 'The Witness Report has been preserved as a personal trace of reflection.',
    microprint: 'This is not a knowledge test or an official document. It is a personal trace of reflection after the screening.'
  };

  const events = {
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
    ['silence', 'The silence after testimony is not empty. It is the place where conscience begins to work.', 'Rap-Ort — authorial reflection']
  ];

  const $ = (s) => root.querySelector(s);
  const f = (n) => root.querySelector(`[name="${n}"]`);
  const button = $('[data-wr-download]');
  const status = $('[data-wr-status]');
  const finale = $('[data-wr-finale]');
  const preview = $('[data-wr-preview]');
  const counter = $('[data-wr-counter]');
  const form = $('[data-wr-form]');
  if (button) button.textContent = C.button;

  const setStatus = (msg) => { if (status) status.textContent = msg || ''; };
  const q = () => quotes.find((x) => x[0] === f('quote')?.value) || quotes[0];
  const eventKey = () => f('eventPreset')?.value || 'custom';
  const abs = (path) => new URL(path, window.location.origin).href;

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
    for (const path of paths) {
      const img = await loadImage(path);
      if (img) return img;
    }
    return null;
  }

  function reportNumber() {
    const k = `vhWitnessReport:${lang}:${eventKey()}`;
    let v = localStorage.getItem(k);
    if (!v) {
      const y = (f('eventDate')?.value || String(new Date().getFullYear())).slice(0, 4);
      const code = events[eventKey()]?.code || 'CUSTOM';
      v = `VH-WR-${y}-${code}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      localStorage.setItem(k, v);
    }
    return v;
  }

  function dateLabel() {
    const e = events[eventKey()];
    if (e) return e[lang].label;
    const v = f('eventDate')?.value;
    if (!v) return lang === 'pl' ? 'Data wydarzenia' : 'Event date';
    try { return new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${v}T00:00:00`)); }
    catch (_) { return v; }
  }

  function data() {
    return {
      quote: q(),
      reflection: f('reflection')?.value.trim() || '',
      name: f('participantName')?.value.trim() || C.fallbackName,
      place: f('place')?.value.trim() || events[eventKey()]?.[lang].place || C.fallbackPlace,
      date: dateLabel(),
      number: reportNumber()
    };
  }

  function applyPreset() {
    const e = events[eventKey()];
    if (e) {
      if (f('place')) f('place').value = e[lang].place;
      if (f('eventDate')) f('eventDate').value = e.date;
    }
    renderPreview();
  }

  function esc(v) { return String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

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

  function font(s, fam = 'Georgia', w = '400', style = 'normal') { return `${style} ${w} ${Math.round(s)}px ${fam}`; }
  function wrap(ctx, text, max) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > max && line) { lines.push(line); line = word; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  function centered(ctx, lines, x, y, h) { lines.forEach((line, i) => ctx.fillText(line, x, y + i * h)); }

  function drawFallbackPaper(ctx) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#f4e8cc');
    g.addColorStop(0.5, '#d7c79f');
    g.addColorStop(1, '#efe4c7');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  async function drawPaper(ctx) {
    const bg = await firstImage(ASSETS.background);
    if (bg) ctx.drawImage(bg, 0, 0, W, H);
    else drawFallbackPaper(ctx);

    const texture = await firstImage(ASSETS.texture);
    if (texture) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      const pattern = ctx.createPattern(texture, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
    }

    ctx.save();
    const veil = ctx.createRadialGradient(W / 2, H * 0.48, 180, W / 2, H * 0.48, 1420);
    veil.addColorStop(0, 'rgba(255,250,235,.18)');
    veil.addColorStop(1, 'rgba(255,250,235,0)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawMetaField(ctx, label, value, x, y, maxWidth = 820) {
    ctx.strokeStyle = 'rgba(66,46,22,.26)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x - maxWidth / 2, y);
    ctx.lineTo(x + maxWidth / 2, y);
    ctx.stroke();
    ctx.font = font(33, 'Arial', '600');
    ctx.fillStyle = 'rgba(66,46,22,.52)';
    ctx.fillText(label.toUpperCase(), x, y + 54);
    ctx.font = font(44, 'Georgia');
    ctx.fillStyle = '#2a1d11';
    ctx.fillText(value, x, y + 118, maxWidth);
  }

  async function renderCanvas(d) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { alpha: false });
    await drawPaper(ctx);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(36,24,13,.72)';
    ctx.font = font(45, 'Arial', '700');
    ctx.fillText(C.project, W / 2, 350);

    ctx.font = font(126, 'Georgia', '500');
    ctx.fillStyle = '#24180d';
    ctx.fillText(C.title, W / 2, 545);

    ctx.font = font(58, 'Georgia', '400', 'italic');
    ctx.fillStyle = '#2b2015';
    const qLines = wrap(ctx, `“${d.quote[1]}”`, 1680).slice(0, 4);
    centered(ctx, qLines, W / 2, 785, 82);

    ctx.font = font(35, 'Arial', '600');
    ctx.fillStyle = 'rgba(44,31,18,.58)';
    ctx.fillText(d.quote[2], W / 2, 785 + qLines.length * 82 + 28);

    ctx.strokeStyle = 'rgba(66,46,22,.18)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(470, 1200);
    ctx.lineTo(2010, 1200);
    ctx.moveTo(470, 1935);
    ctx.lineTo(2010, 1935);
    ctx.stroke();

    ctx.font = font(58, 'Georgia');
    ctx.fillStyle = '#24180d';
    const reflection = wrap(ctx, d.reflection, 1660).slice(0, 7);
    centered(ctx, reflection, W / 2, 1340, 82);

    drawMetaField(ctx, C.name, d.name, 720, 2180, 760);
    drawMetaField(ctx, C.date, d.date, 1760, 2180, 760);
    drawMetaField(ctx, C.place, d.place, 720, 2480, 760);
    drawMetaField(ctx, C.number, d.number, 1760, 2480, 760);

    ctx.strokeStyle = 'rgba(66,46,22,.3)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(620, 2920);
    ctx.lineTo(1860, 2920);
    ctx.stroke();

    ctx.font = font(38, 'Arial', '600');
    ctx.fillStyle = 'rgba(66,46,22,.56)';
    ctx.fillText(C.signature.toUpperCase(), W / 2, 2990);

    ctx.font = font(28, 'Arial');
    ctx.fillStyle = 'rgba(66,46,22,.42)';
    ctx.fillText(C.microprint.toUpperCase(), W / 2, 3308, 1760);

    return canvas;
  }

  const canvasJpg = (c) => new Promise((res, rej) => c.toBlob((b) => (b ? b.arrayBuffer().then((x) => res(new Uint8Array(x))).catch(rej) : rej(new Error('Canvas export failed'))), 'image/jpeg', 0.96));
  function safe(t) { return String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120); }
  function download(bytes, name) { const blob = new Blob([bytes], { type: 'application/pdf' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000); }

  async function createPdf() {
    const d = data();
    if (!d.reflection) { setStatus(C.missing); return; }
    button.disabled = true;
    try {
      setStatus(C.preparing);
      const canvas = await renderCanvas(d);
      const jpg = await canvasJpg(canvas);
      const pdf = await PDFDocument.create();
      pdf.setTitle(`${C.title} — ${d.number}`);
      pdf.setAuthor('Piotr Jakub Lichwała / Vibrosław');
      pdf.setCreator('Veritas Humanum Witness Report Generator');
      const page = pdf.addPage([PW, PH]);
      const img = await pdf.embedJpg(jpg);
      page.drawImage(img, { x: 0, y: 0, width: PW, height: PH });
      const bytes = await pdf.save({ useObjectStreams: true });
      download(bytes, `${C.file}-${safe(d.number)}.pdf`);
      setStatus(C.ready);
      if (finale) { finale.hidden = false; finale.textContent = C.finale; }
    } catch (e) {
      console.error(e);
      setStatus(C.error);
    } finally {
      button.disabled = false;
    }
  }

  form?.addEventListener('input', renderPreview);
  form?.addEventListener('change', () => { applyPreset(); renderPreview(); });
  button?.addEventListener('click', createPdf);
  applyPreset();
  renderPreview();
})();
