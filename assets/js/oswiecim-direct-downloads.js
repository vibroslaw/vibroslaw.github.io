(() => {
  const path = window.location.pathname.replace(/\/+$/, '/');
  const isParticipation = path === '/rap-ort/oswiecim/zapis-uczestnictwa/';
  const isWitness = path === '/rap-ort/oswiecim/raport-swiadka/';
  if (!isParticipation && !isWitness) return;

  const params = new URLSearchParams(window.location.search);
  const calibrationMode = params.get('calibrate') === '1';
  const calibrationPdf = params.get('calibratePdf') === '1';
  const mm = 72 / 25.4;
  const A4_L = { w: 297 * mm, h: 210 * mm };
  const A4_P = { w: 210 * mm, h: 297 * mm };
  const DPI = 2;

  const LAYOUTS = {
    participation: {
      name: 'Zapis Uczestnictwa',
      width: 3508,
      height: 2480,
      page: A4_L,
      background: '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-bg-final.svg',
      seal: { src: '/public/assets/events/rap-ort/oswiecim20260525/accents/event-seal-gold.svg', x: 1754, y: 463, w: 196, h: 196, label: 'seal' },
      signature: { src: '/public/assets/reports/author-signature-gold.svg', x: 1494, y: 2044, w: 520, h: 120, label: 'author signature' },
      overlays: {
        glow: { x: 1754, y: 1190, inner: 160, outer: 1450, from: 'rgba(255,232,174,0.04)', to: 'rgba(0,0,0,0.08)' }
      },
      fields: {
        projectLine: { x: 1754, y: 322, align: 'center', size: 36, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(245,225,175,0.82)', tracking: 8, label: 'project line' },
        title: { x: 1754, y: 700, align: 'center', size: 132, weight: 400, family: 'Georgia, Times New Roman, serif', fill: '#f4dfad', shadow: true, label: 'main title' },
        eventLine: { x: 1754, y: 790, align: 'center', size: 34, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(242,219,169,0.78)', label: 'event line' },
        intro: { x: 1754, y: 905, width: 2400, align: 'center', size: 43, lineHeight: 58, maxLines: 2, style: 'italic', family: 'Georgia, Times New Roman, serif', fill: 'rgba(248,235,209,0.90)', label: 'intro' },
        body: { x: 1754, y: 1072, width: 2550, align: 'center', size: 38, lineHeight: 54, maxLines: 4, family: 'Georgia, Times New Roman, serif', fill: 'rgba(248,235,209,0.90)', label: 'body' },
        participantName: { x: 1754, y: 1334, width: 2100, align: 'center', size: 58, minSize: 36, family: 'Georgia, Times New Roman, serif', fill: '#fff0bd', label: 'participant name' },
        quote: { x: 1754, y: 1885, width: 2100, align: 'center', size: 36, lineHeight: 50, maxLines: 2, style: 'italic', family: 'Georgia, Times New Roman, serif', fill: 'rgba(247,229,190,0.75)', label: 'quote' },
        author: { x: 1754, y: 2205, align: 'center', size: 23, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(232,208,154,0.62)', label: 'author line' },
        micro: { x: 1754, y: 2292, width: 2450, align: 'center', size: 17, lineHeight: 28, maxLines: 2, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(232,208,154,0.42)', label: 'microcopy' }
      },
      meta: [
        { key: 'date', label: 'DATA WYDARZENIA', value: '25 maja 2026', x: 780, y: 1488, lineW: 820, labelY: 1540, valueY: 1592, label: 'date block' },
        { key: 'place', label: 'MIEJSCE', value: 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu', x: 1754, y: 1488, lineW: 820, labelY: 1540, valueY: 1592, width: 800, label: 'place block' },
        { key: 'number', label: 'NUMER DOKUMENTU', value: '', x: 2728, y: 1488, lineW: 820, labelY: 1540, valueY: 1592, label: 'number block' }
      ]
    },
    witness: {
      name: 'Raport Świadka',
      width: 2480,
      height: 3508,
      page: A4_P,
      background: '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/witness-report-bg-final.svg',
      fields: {
        projectLine: { x: 1240, y: 430, align: 'center', size: 31, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(66,46,22,0.68)', label: 'project line' },
        title: { x: 1240, y: 675, align: 'center', size: 108, weight: 400, family: 'Georgia, Times New Roman, serif', fill: '#2a1d11', label: 'main title' },
        quote: { x: 1240, y: 890, width: 1680, align: 'center', size: 46, lineHeight: 65, maxLines: 3, style: 'italic', family: 'Georgia, Times New Roman, serif', fill: '#2b2015', label: 'quote' },
        footer: { x: 1240, y: 3305, width: 1780, align: 'center', size: 20, lineHeight: 30, maxLines: 2, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(66,46,22,0.48)', label: 'footer' }
      },
      dividers: [],
      reflection: {
        x: 500,
        firstBaseline: 1285,
        width: 1480,
        lineHeight: 62,
        maxLines: 13,
        size: 38,
        family: 'Courier New, monospace',
        fill: '#24180d',
        label: 'reflection baselines'
      },
      meta: [
        { key: 'date', label: 'DATA', value: '25 maja 2026', x: 760, ruleY: 2450, labelY: 2495, valueY: 2542, lineW: 720, label: 'date block' },
        { key: 'place', label: 'MIEJSCE', value: 'MUP im. rtm. W. Pileckiego w Oświęcimiu', x: 1720, ruleY: 2450, labelY: 2495, valueY: 2542, lineW: 720, label: 'place block' },
        { key: 'number', label: '', value: '', x: 760, ruleY: 2675, labelY: 2720, valueY: 2767, lineW: 720, label: 'report number block' },
        { key: 'status', label: '', value: '', x: 1720, ruleY: 2675, labelY: 2720, valueY: 2767, lineW: 720, label: 'status block' }
      ],
      signature: { x1: 620, y1: 3068, x2: 1860, y2: 3068, labelX: 1240, labelY: 3120, label: 'signature baseline' }
    }
  };

  const escapeFile = (value) => String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'uczestnik';

  function getSeq(key) {
    let seq = localStorage.getItem(key);
    if (!/^\d{4}$/.test(seq || '')) {
      seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      localStorage.setItem(key, seq);
    }
    return seq;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function optionalImage(src) {
    try { return await loadImage(src); } catch (_) { return null; }
  }

  function setFont(ctx, spec) {
    const style = spec.style || 'normal';
    const weight = spec.weight || 400;
    const size = spec.size || 24;
    const family = spec.family || 'Arial, sans-serif';
    ctx.font = `${style} ${weight} ${size}px ${family}`;
  }

  function drawTrackedText(ctx, text, x, y, spec = {}) {
    const value = String(text || '');
    const tracking = spec.tracking || 0;
    setFont(ctx, spec);
    ctx.fillStyle = spec.fill || '#000';
    ctx.textBaseline = spec.baseline || 'alphabetic';
    ctx.textAlign = spec.align || 'left';
    if (!tracking) {
      ctx.fillText(value, x, y);
      return;
    }
    const letters = [...value];
    const widths = letters.map((letter) => ctx.measureText(letter).width + tracking);
    const total = widths.reduce((sum, w) => sum + w, 0) - tracking;
    let cursor = x;
    if (spec.align === 'center') cursor = x - total / 2;
    if (spec.align === 'right') cursor = x - total;
    ctx.textAlign = 'left';
    letters.forEach((letter, index) => {
      ctx.fillText(letter, cursor, y);
      cursor += widths[index];
    });
  }

  function fitText(ctx, text, maxWidth, fontStart, fontMin, fontFamily, weight = '400', style = 'normal') {
    let size = fontStart;
    do {
      ctx.font = `${style} ${weight} ${size}px ${fontFamily}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    } while (size >= fontMin);
    return fontMin;
  }

  function wrapLines(ctx, text, maxWidth) {
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

  function drawWrapped(ctx, text, spec) {
    setFont(ctx, spec);
    ctx.fillStyle = spec.fill || '#000';
    ctx.textAlign = spec.align || 'left';
    ctx.textBaseline = spec.baseline || 'alphabetic';
    const lines = wrapLines(ctx, text, spec.width || 1000).slice(0, spec.maxLines || 999);
    lines.forEach((line, index) => ctx.fillText(line, spec.x, spec.y + index * (spec.lineHeight || spec.size * 1.25)));
    return lines.length;
  }

  function drawField(ctx, text, spec) {
    ctx.save();
    if (spec.shadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 24;
    }
    if (spec.width && !spec.lineHeight) {
      const size = fitText(ctx, text, spec.width, spec.size || 32, spec.minSize || 18, spec.family || 'Arial, sans-serif', spec.weight || '400', spec.style || 'normal');
      drawTrackedText(ctx, text, spec.x, spec.y, { ...spec, size });
    } else if (spec.width) {
      drawWrapped(ctx, text, spec);
    } else {
      drawTrackedText(ctx, text, spec.x, spec.y, spec);
    }
    ctx.restore();
  }

  function drawImageCover(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function drawCalibration(ctx, layout) {
    if (!calibrationPdf) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,0,0,0.22)';
    ctx.fillStyle = 'rgba(255,0,0,0.72)';
    ctx.lineWidth = 2;
    ctx.font = '700 20px Arial, sans-serif';
    for (let x = 0; x <= layout.width; x += 100) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, layout.height); ctx.stroke();
      if (x % 500 === 0) ctx.fillText(String(x), x + 6, 28);
    }
    for (let y = 0; y <= layout.height; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(layout.width, y); ctx.stroke();
      if (y % 500 === 0) ctx.fillText(String(y), 8, y - 8);
    }
    ctx.strokeStyle = 'rgba(0,90,255,0.65)';
    ctx.fillStyle = 'rgba(0,90,255,0.90)';
    Object.values(layout.fields || {}).forEach((field) => {
      ctx.beginPath(); ctx.arc(field.x, field.y, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.fillText(field.label || '', field.x + 14, field.y - 14);
    });
    (layout.meta || []).forEach((field) => {
      const y = field.valueY || field.ruleY || field.y;
      ctx.beginPath(); ctx.arc(field.x, y, 9, 0, Math.PI * 2); ctx.stroke();
      ctx.fillText(field.label || field.key, field.x + 14, y - 14);
    });
    if (layout.reflection) {
      ctx.strokeStyle = 'rgba(0,160,60,0.65)';
      ctx.fillStyle = 'rgba(0,160,60,0.90)';
      for (let i = 0; i < layout.reflection.maxLines; i += 1) {
        const y = layout.reflection.firstBaseline + i * layout.reflection.lineHeight;
        ctx.beginPath(); ctx.moveTo(layout.reflection.x, y); ctx.lineTo(layout.reflection.x + layout.reflection.width, y); ctx.stroke();
        ctx.fillText(`baseline ${i + 1}`, layout.reflection.x + layout.reflection.width + 18, y + 7);
      }
    }
    ctx.restore();
  }

  function jpegBytesFromCanvas(canvas, quality = 0.92) {
    const data = canvas.toDataURL('image/jpeg', quality).split(',')[1];
    const bin = atob(data);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function asciiBytes(str) {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i += 1) bytes[i] = str.charCodeAt(i) & 0xff;
    return bytes;
  }

  function concatBytes(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach((part) => { out.set(part, offset); offset += part.length; });
    return out;
  }

  function makeImagePdf(canvas, page, quality = 0.92) {
    const img = jpegBytesFromCanvas(canvas, quality);
    const objects = [];
    objects[1] = asciiBytes('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    objects[2] = asciiBytes('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    objects[3] = asciiBytes(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.w.toFixed(2)} ${page.h.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    objects[4] = concatBytes([
      asciiBytes(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`),
      img,
      asciiBytes('\nendstream\nendobj\n')
    ]);
    const content = `q\n${page.w.toFixed(2)} 0 0 ${page.h.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
    objects[5] = asciiBytes(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
    const header = asciiBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    const parts = [header];
    const offsets = [0];
    let offset = header.length;
    for (let i = 1; i <= 5; i += 1) {
      offsets[i] = offset;
      parts.push(objects[i]);
      offset += objects[i].length;
    }
    const xrefStart = offset;
    let xref = 'xref\n0 6\n0000000000 65535 f \n';
    for (let i = 1; i <= 5; i += 1) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    parts.push(asciiBytes(xref));
    return new Blob([concatBytes(parts)], { type: 'application/pdf' });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function setBusy(button, busy, text) {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = text || 'Generuję plik...';
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }

  function ensureModal() {
    let modal = document.querySelector('[data-qr-modal]');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.setAttribute('data-qr-modal', '');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="qr-modal-card" data-qr-modal-card>
        <div class="qr-sealmark" aria-hidden="true">✓</div>
        <h2 data-qr-modal-title>Dokument gotowy</h2>
        <p data-qr-modal-text>Plik został przygotowany lokalnie w przeglądarce.</p>
        <button class="btn primary" type="button" data-qr-modal-close>Zamknij</button>
      </div>`;
    document.body.appendChild(modal);
    const close = () => modal.classList.remove('is-open');
    modal.querySelector('[data-qr-modal-close]').addEventListener('click', close);
    modal.addEventListener('click', (ev) => { if (ev.target === modal) close(); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
    return modal;
  }

  function showModal({ title, text, error = false }) {
    const modal = ensureModal();
    const card = modal.querySelector('[data-qr-modal-card]');
    card.classList.toggle('qr-error-card', error);
    modal.querySelector('[data-qr-modal-title]').textContent = title;
    modal.querySelector('[data-qr-modal-text]').textContent = text;
    modal.querySelector('.qr-sealmark').textContent = error ? '!' : '✓';
    modal.classList.add('is-open');
  }

  function pulseDocument() {
    const doc = document.getElementById('doc');
    if (!doc) return;
    doc.classList.remove('pulse');
    void doc.offsetWidth;
    doc.classList.add('pulse');
  }

  function showError() {
    showModal({
      error: true,
      title: 'Nie udało się przygotować pliku',
      text: 'Odśwież stronę i spróbuj ponownie. Dane nie zostały nigdzie wysłane.'
    });
  }

  function drawMetaBlock(ctx, item) {
    ctx.strokeStyle = 'rgba(232,208,154,0.45)';
    ctx.beginPath(); ctx.moveTo(item.x - item.lineW / 2, item.y); ctx.lineTo(item.x + item.lineW / 2, item.y); ctx.stroke();
    drawField(ctx, item.label, { x: item.x, y: item.labelY, align: 'center', size: 22, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(232,208,154,0.62)' });
    drawWrapped(ctx, item.value, { x: item.x, y: item.valueY, width: item.width || 760, align: 'center', size: item.key === 'place' ? 27 : 31, lineHeight: 38, maxLines: 2, family: 'Georgia, Times New Roman, serif', fill: '#f5e7c8' });
  }

  async function drawParticipation() {
    const layout = LAYOUTS.participation;
    const canvas = document.createElement('canvas');
    canvas.width = layout.width / DPI;
    canvas.height = layout.height / DPI;
    const ctx = canvas.getContext('2d');
    ctx.scale(1 / DPI, 1 / DPI);
    const [bg, seal, sig] = await Promise.all([
      loadImage(layout.background),
      optionalImage(layout.seal.src),
      optionalImage(layout.signature.src)
    ]);
    drawImageCover(ctx, bg, 0, 0, layout.width, layout.height);
    const g = layout.overlays.glow;
    const grad = ctx.createRadialGradient(g.x, g.y, g.inner, g.x, g.y, g.outer);
    grad.addColorStop(0, g.from);
    grad.addColorStop(1, g.to);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, layout.width, layout.height);

    const name = document.getElementById('name')?.value.trim() || '';
    const seq = getSeq('vh-zu-osw-seq');
    const docNo = `VH-ZU-2026-0525-OSW-${seq}`;

    drawField(ctx, 'RAP-ORT: PRAWDA SUMIENIA', layout.fields.projectLine);
    if (seal) ctx.drawImage(seal, layout.seal.x - layout.seal.w / 2, layout.seal.y - layout.seal.h / 2, layout.seal.w, layout.seal.h);
    drawField(ctx, 'ZAPIS UCZESTNICTWA', layout.fields.title);
    drawField(ctx, 'OŚWIĘCIM · 25 MAJA 2026 · 78. ROCZNICA ŚMIERCI RTM. WITOLDA PILECKIEGO', layout.fields.eventLine);
    drawField(ctx, 'Pamiątkowy zapis udziału w wydarzeniu poświęconym świadectwu, pamięci i odpowiedzialności — w Uczelni noszącej imię Rotmistrza.', layout.fields.intro);
    drawField(ctx, 'Niniejszy dokument upamiętnia udział w projekcji audiowizualnej „Rap-Ort: Prawda Sumienia” oraz rozmowie refleksyjnej prowadzącej od świadectwa Witolda Pileckiego ku osobistemu pytaniu o prawdę, sumienie i odpowiedzialność człowieka.', layout.fields.body);
    if (name) drawField(ctx, `Dla: ${name}`, layout.fields.participantName);
    layout.meta.forEach((item) => drawMetaBlock(ctx, { ...item, value: item.key === 'number' ? docNo : item.value }));
    drawField(ctx, '„Historia nie pyta nas tylko o to, co wiemy. Pyta nas, kim stajemy się po spotkaniu ze świadectwem.”', layout.fields.quote);
    if (sig) ctx.drawImage(sig, layout.signature.x, layout.signature.y, layout.signature.w, layout.signature.h);
    drawField(ctx, 'PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', layout.fields.author);
    drawField(ctx, 'Pamiątkowy dokument od autora projektu · nie jest dyplomem ani dokumentem urzędowym · wygenerowany lokalnie w przeglądarce uczestnika.', layout.fields.micro);
    drawCalibration(ctx, layout);
    return { canvas, name };
  }

  function drawWitnessMetaBlock(ctx, item, value, label) {
    ctx.strokeStyle = 'rgba(66,46,22,0.28)';
    ctx.beginPath(); ctx.moveTo(item.x - item.lineW / 2, item.ruleY); ctx.lineTo(item.x + item.lineW / 2, item.ruleY); ctx.stroke();
    drawField(ctx, label, { x: item.x, y: item.labelY, align: 'center', size: 23, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(66,46,22,0.52)' });
    drawWrapped(ctx, value, { x: item.x, y: item.valueY, width: 700, align: 'center', size: 31, lineHeight: 39, maxLines: 2, family: 'Georgia, Times New Roman, serif', fill: '#2a1d11' });
  }

  async function drawWitness(anonymous = false) {
    const layout = LAYOUTS.witness;
    const canvas = document.createElement('canvas');
    canvas.width = layout.width / DPI;
    canvas.height = layout.height / DPI;
    const ctx = canvas.getContext('2d');
    ctx.scale(1 / DPI, 1 / DPI);
    const bg = await loadImage(layout.background);
    drawImageCover(ctx, bg, 0, 0, layout.width, layout.height);

    const name = document.getElementById('name')?.value.trim() || '';
    const reflection = document.getElementById('reflection')?.value.trim() || 'Cisza po świadectwie nie jest pustką. Jest miejscem, w którym zaczyna pracować sumienie.';
    const seq = getSeq('vh-wr-osw-seq');
    const docNo = `VH-WR-2026-0525-OSW-${seq}`;

    drawField(ctx, 'RAP-ORT: PRAWDA SUMIENIA · OŚWIĘCIM / MUP · 25 MAJA 2026', layout.fields.projectLine);
    drawField(ctx, anonymous ? 'ANONIMOWY RAPORT ŚWIADKA' : 'RAPORT ŚWIADKA', layout.fields.title);
    drawField(ctx, '„Nie jesteś świadkiem wydarzeń historycznych. Jesteś świadkiem spotkania ze świadectwem.”', layout.fields.quote);

    layout.dividers.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.beginPath(); ctx.moveTo(line.x1, line.y1); ctx.lineTo(line.x2, line.y2); ctx.stroke();
    });

    setFont(ctx, layout.reflection);
    ctx.fillStyle = layout.reflection.fill;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    wrapLines(ctx, reflection, layout.reflection.width)
      .slice(0, layout.reflection.maxLines)
      .forEach((line, index) => ctx.fillText(line, layout.reflection.x, layout.reflection.firstBaseline + index * layout.reflection.lineHeight));

    const metaValues = {
      date: '25 maja 2026',
      place: 'MUP im. rtm. W. Pileckiego w Oświęcimiu',
      number: docNo,
      status: anonymous ? 'Wersja anonimowa' : (name || 'Świadek doświadczenia')
    };
    const metaLabels = {
      date: 'DATA',
      place: 'MIEJSCE',
      number: anonymous ? 'NUMER ARCHIWALNY' : 'NUMER RAPORTU',
      status: anonymous ? 'STATUS' : 'UCZESTNIK'
    };
    layout.meta.forEach((item) => drawWitnessMetaBlock(ctx, item, metaValues[item.key], metaLabels[item.key]));

    if (!anonymous) {
      ctx.strokeStyle = 'rgba(66,46,22,0.30)';
      ctx.beginPath(); ctx.moveTo(layout.signature.x1, layout.signature.y1); ctx.lineTo(layout.signature.x2, layout.signature.y2); ctx.stroke();
      drawField(ctx, 'PODPIS ŚWIADKA DOŚWIADCZENIA', { x: layout.signature.labelX, y: layout.signature.labelY, align: 'center', size: 24, weight: 700, family: 'Arial, sans-serif', fill: 'rgba(66,46,22,0.52)' });
    }
    drawField(ctx, anonymous ? 'Wersja anonimowa · bez imienia, nazwiska i podpisu · do dobrowolnego przekazania uczelni.' : 'Osobisty dokument refleksji · generowany lokalnie · nie jest testem ani dokumentem urzędowym.', layout.fields.footer);
    drawCalibration(ctx, layout);
    return { canvas, name, anonymous };
  }

  async function handleParticipation(button) {
    setBusy(button, true, 'Przygotowuję dokument...');
    try {
      const { canvas, name } = await drawParticipation();
      const pdf = makeImagePdf(canvas, A4_L, 0.93);
      downloadBlob(pdf, `Zapis-Uczestnictwa-Oswiecim-${escapeFile(name)}.pdf`);
      pulseDocument();
      showModal({ title: 'Dokument został przygotowany', text: 'Zapis Uczestnictwa został pobrany jako gotowy plik PDF. Możesz go zachować, wysłać albo wydrukować.' });
    } catch (err) {
      console.error(err);
      showError();
    } finally { setBusy(button, false); }
  }

  async function handleWitness(button, anonymous) {
    setBusy(button, true, 'Przygotowuję raport...');
    try {
      const { canvas, name } = await drawWitness(anonymous);
      const pdf = makeImagePdf(canvas, A4_P, 0.93);
      downloadBlob(pdf, `${anonymous ? 'Anonimowy-' : ''}Raport-Swiadka-Oswiecim-${escapeFile(name || 'uczestnik')}.pdf`);
      pulseDocument();
      showModal({
        title: anonymous ? 'Anonimowy raport gotowy' : 'Raport został przygotowany',
        text: anonymous ? 'Anonimowy Raport Świadka został pobrany jako gotowy plik PDF. Nie zawiera imienia, nazwiska ani podpisu.' : 'Osobisty Raport Świadka został pobrany jako gotowy plik PDF. To pamiątkowy ślad refleksji po spotkaniu ze świadectwem.'
      });
    } catch (err) {
      console.error(err);
      showError();
    } finally { setBusy(button, false); }
  }

  function enhanceWitnessChips() {
    document.querySelectorAll('[data-reflection-prompt]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const field = document.getElementById('reflection');
        const hint = chip.getAttribute('data-reflection-prompt');
        if (!field) return;
        field.placeholder = hint;
        field.focus({ preventScroll: false });
      });
    });
  }

  function injectCalibrationOverlay() {
    if (!calibrationMode) return;
    const doc = document.getElementById('doc');
    if (!doc) return;
    const layout = isParticipation ? LAYOUTS.participation : LAYOUTS.witness;
    doc.style.position = 'relative';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;z-index:20;pointer-events:none;border-radius:inherit;mix-blend-mode:multiply;';
    doc.appendChild(canvas);

    const render = () => {
      const rect = doc.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * window.devicePixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * window.devicePixelRatio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      const sx = rect.width / layout.width;
      const sy = rect.height / layout.height;
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.strokeStyle = 'rgba(255,0,0,.24)';
      ctx.fillStyle = 'rgba(255,0,0,.82)';
      ctx.lineWidth = 1;
      ctx.font = '700 10px Arial, sans-serif';
      for (let x = 0; x <= layout.width; x += 250) {
        const px = x * sx;
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, rect.height); ctx.stroke();
        ctx.fillText(String(x), px + 3, 11);
      }
      for (let y = 0; y <= layout.height; y += 250) {
        const py = y * sy;
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(rect.width, py); ctx.stroke();
        ctx.fillText(String(y), 3, py - 3);
      }
      ctx.strokeStyle = 'rgba(0,90,255,.85)';
      ctx.fillStyle = 'rgba(0,90,255,.96)';
      Object.values(layout.fields || {}).forEach((field) => {
        ctx.beginPath(); ctx.arc(field.x * sx, field.y * sy, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.fillText(field.label || '', field.x * sx + 7, field.y * sy - 6);
      });
      if (layout.reflection) {
        ctx.strokeStyle = 'rgba(0,160,60,.9)';
        ctx.fillStyle = 'rgba(0,120,50,.95)';
        for (let i = 0; i < layout.reflection.maxLines; i += 1) {
          const y = (layout.reflection.firstBaseline + i * layout.reflection.lineHeight) * sy;
          ctx.beginPath(); ctx.moveTo(layout.reflection.x * sx, y); ctx.lineTo((layout.reflection.x + layout.reflection.width) * sx, y); ctx.stroke();
          ctx.fillText(`baseline ${i + 1}`, (layout.reflection.x + layout.reflection.width) * sx + 6, y + 3);
        }
      }
    };
    render();
    new ResizeObserver(render).observe(doc);

    const badge = document.createElement('div');
    badge.className = 'qr-calibration-note';
    badge.textContent = 'CALIBRATION MODE · ?calibratePdf=1 adds grid to exported PDF';
    document.body.appendChild(badge);
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureModal();
    enhanceWitnessChips();
    injectCalibrationOverlay();
    if (isParticipation) {
      const button = document.getElementById('printBtn');
      if (button) {
        button.textContent = 'Pobierz gotowy PDF';
        button.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopImmediatePropagation(); handleParticipation(button); }, true);
      }
    }
    if (isWitness) {
      const personal = document.getElementById('personalBtn');
      const anon = document.getElementById('anonBtn');
      if (personal) personal.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopImmediatePropagation(); handleWitness(personal, false); }, true);
      if (anon) anon.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopImmediatePropagation(); handleWitness(anon, true); }, true);
    }
  });
})();
