(() => {
  const path = window.location.pathname.replace(/\/+$/, '/');
  const isParticipation = path === '/rap-ort/oswiecim/zapis-uczestnictwa/';
  const isOsv = isParticipation || path === '/rap-ort/oswiecim/raport-swiadka/';
  if (!isOsv) return;

  const params = new URLSearchParams(window.location.search);
  const calibrationPdf = params.get('calibratePdf') === '1';
  const mm = 72 / 25.4;
  const A4_L = { w: 297 * mm, h: 210 * mm };
  const ASSET = '/public/assets/events/rap-ort/oswiecim20260525';
  const participation = {
    w: 3508,
    h: 2480,
    bg: `${ASSET}/backgrounds/participation-record-bg-final.svg`,
    title: `${ASSET}/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg`,
    eventSeal: `${ASSET}/accents/event-seal-gold.svg`,
    anniversarySeal: `${ASSET}/accents/anniversary-edition-seal-gold.png`,
    veritasSeal: `${ASSET}/accents/veritashumanum.svg`,
    signature: '/public/assets/reports/author-signature-gold.svg'
  };

  function removeVisibleCalibration() {
    document.querySelectorAll('#doc > canvas[aria-hidden="true"], .qr-calibration-note').forEach((el) => el.remove());
  }

  function keepPreviewClean() {
    removeVisibleCalibration();
    window.setTimeout(removeVisibleCalibration, 0);
    window.setTimeout(removeVisibleCalibration, 80);
    window.setTimeout(removeVisibleCalibration, 240);
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

  function drawImageContain(ctx, img, cx, cy, maxW, maxH) {
    const scale = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  }

  function drawImageCover(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function setFont(ctx, size, family = 'Georgia, Times New Roman, serif', weight = 400, style = 'normal') {
    ctx.font = `${style} ${weight} ${size}px ${family}`;
  }

  function wrap(ctx, text, maxWidth) {
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

  function drawWrapped(ctx, text, x, y, maxWidth, size, lineHeight, maxLines, opts = {}) {
    setFont(ctx, size, opts.family, opts.weight || 400, opts.style || 'normal');
    ctx.fillStyle = opts.fill || '#f5e7c8';
    ctx.textAlign = opts.align || 'center';
    ctx.textBaseline = 'alphabetic';
    wrap(ctx, text, maxWidth).slice(0, maxLines).forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  }

  function drawSingle(ctx, text, x, y, opts = {}) {
    setFont(ctx, opts.size || 28, opts.family || 'Arial, sans-serif', opts.weight || 700, opts.style || 'normal');
    ctx.fillStyle = opts.fill || '#f5e7c8';
    ctx.textAlign = opts.align || 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, x, y);
  }

  function fitText(ctx, text, maxWidth, start, min, family, weight = 400) {
    let size = start;
    while (size >= min) {
      setFont(ctx, size, family, weight);
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    }
    return min;
  }

  function drawCalibration(ctx, layout) {
    if (!calibrationPdf) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,0,0,0.22)';
    ctx.fillStyle = 'rgba(255,0,0,0.75)';
    ctx.lineWidth = 2;
    ctx.font = '700 20px Arial, sans-serif';
    for (let x = 0; x <= layout.w; x += 100) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, layout.h); ctx.stroke();
      if (x % 500 === 0) ctx.fillText(String(x), x + 8, 28);
    }
    for (let y = 0; y <= layout.h; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(layout.w, y); ctx.stroke();
      if (y % 500 === 0) ctx.fillText(String(y), 8, y - 8);
    }
    ctx.restore();
  }

  function jpegBytesFromCanvas(canvas, quality = 0.93) {
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

  function makeImagePdf(canvas, page, quality = 0.93) {
    const img = jpegBytesFromCanvas(canvas, quality);
    const objects = [];
    objects[1] = asciiBytes('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    objects[2] = asciiBytes('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    objects[3] = asciiBytes(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.w.toFixed(2)} ${page.h.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    objects[4] = concatBytes([asciiBytes(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`), img, asciiBytes('\nendstream\nendobj\n')]);
    const content = `q\n${page.w.toFixed(2)} 0 0 ${page.h.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
    objects[5] = asciiBytes(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
    const header = asciiBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    const parts = [header];
    const offsets = [0];
    let offset = header.length;
    for (let i = 1; i <= 5; i += 1) { offsets[i] = offset; parts.push(objects[i]); offset += objects[i].length; }
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

  function escapeFile(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'uczestnik';
  }

  async function drawParticipationV87() {
    const canvas = document.createElement('canvas');
    canvas.width = participation.w;
    canvas.height = participation.h;
    const ctx = canvas.getContext('2d');
    const [bg, title, eventSeal, anniversarySeal, veritasSeal, signature] = await Promise.all([
      loadImage(participation.bg),
      optionalImage(participation.title),
      optionalImage(participation.eventSeal),
      optionalImage(participation.anniversarySeal),
      optionalImage(participation.veritasSeal),
      optionalImage(participation.signature)
    ]);
    drawImageCover(ctx, bg, 0, 0, participation.w, participation.h);
    const glow = ctx.createRadialGradient(1754, 1190, 160, 1754, 1190, 1450);
    glow.addColorStop(0, 'rgba(255,232,174,0.035)');
    glow.addColorStop(1, 'rgba(0,0,0,0.07)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, participation.w, participation.h);

    const name = document.getElementById('name')?.value.trim() || '';
    let seq = localStorage.getItem('vh-zu-osw-seq');
    if (!/^\d{4}$/.test(seq || '')) {
      seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      localStorage.setItem('vh-zu-osw-seq', seq);
    }
    const docNo = `VH-ZU-2026-0525-OSW-${seq}`;

    drawSingle(ctx, 'RAP-ORT: PRAWDA SUMIENIA', 1754, 322, { size: 36, fill: 'rgba(245,225,175,0.82)', weight: 700 });
    if (eventSeal) drawImageContain(ctx, eventSeal, 1754, 462, 196, 196);
    if (title) drawImageContain(ctx, title, 1754, 682, 1540, 260);
    else drawSingle(ctx, 'ZAPIS UCZESTNICTWA', 1754, 700, { size: 132, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#f4dfad' });

    drawSingle(ctx, 'OŚWIĘCIM · 25 MAJA 2026 · 78. ROCZNICA ŚMIERCI RTM. WITOLDA PILECKIEGO', 1754, 790, { size: 34, fill: 'rgba(242,219,169,0.78)' });
    drawWrapped(ctx, 'Pamiątkowy zapis udziału w wydarzeniu poświęconym świadectwu, pamięci i odpowiedzialności — w Uczelni noszącej imię Rotmistrza.', 1754, 905, 2400, 43, 58, 2, { style: 'italic', fill: 'rgba(248,235,209,0.90)' });
    drawWrapped(ctx, 'Niniejszy dokument upamiętnia udział w projekcji audiowizualnej „Rap-Ort: Prawda Sumienia” oraz rozmowie refleksyjnej prowadzącej od świadectwa Witolda Pileckiego ku osobistemu pytaniu o prawdę, sumienie i odpowiedzialność człowieka.', 1754, 1072, 2550, 38, 54, 4, { fill: 'rgba(248,235,209,0.90)' });

    if (name) {
      const size = fitText(ctx, `Dla: ${name}`, 2100, 58, 36, 'Georgia, Times New Roman, serif', 400);
      drawSingle(ctx, `Dla: ${name}`, 1754, 1334, { size, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#fff0bd' });
    }

    const meta = [
      ['DATA WYDARZENIA', '25 maja 2026', 780, 820],
      ['MIEJSCE', 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu', 1754, 800],
      ['NUMER DOKUMENTU', docNo, 2728, 820]
    ];
    meta.forEach(([label, value, x, width]) => {
      ctx.strokeStyle = 'rgba(232,208,154,0.45)';
      ctx.beginPath(); ctx.moveTo(x - width / 2, 1488); ctx.lineTo(x + width / 2, 1488); ctx.stroke();
      drawSingle(ctx, label, x, 1540, { size: 22, fill: 'rgba(232,208,154,0.62)' });
      drawWrapped(ctx, value, x, 1592, width - 20, x === 1754 ? 27 : 31, 38, 2, { fill: '#f5e7c8' });
    });

    if (anniversarySeal) drawImageContain(ctx, anniversarySeal, 1754, 1840, 315, 315);
    if (veritasSeal) drawImageContain(ctx, veritasSeal, 2728, 2050, 240, 240);
    if (signature) drawImageContain(ctx, signature, 1754, 2098, 520, 120);
    drawSingle(ctx, 'PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', 1754, 2226, { size: 23, fill: 'rgba(232,208,154,0.62)' });
    drawWrapped(ctx, 'Pamiątkowy dokument od autora projektu · nie jest dyplomem ani dokumentem urzędowym · wygenerowany lokalnie w przeglądarce uczestnika.', 1754, 2292, 2450, 17, 28, 2, { family: 'Arial, sans-serif', weight: 700, fill: 'rgba(232,208,154,0.42)' });
    drawCalibration(ctx, participation);
    return { canvas, name };
  }

  function enhanceParticipationPreview() {
    const titleText = document.querySelector('.qr-participation .titleText');
    if (titleText) {
      const img = document.createElement('img');
      img.className = 'titlePlate';
      img.src = participation.title;
      img.alt = 'Zapis Uczestnictwa';
      titleText.replaceWith(img);
    }
    const sigBlock = document.querySelector('.qr-participation .signatureBlock');
    if (sigBlock && !document.querySelector('.anniversarySealPreview')) {
      const seal = document.createElement('img');
      seal.className = 'anniversarySealPreview';
      seal.src = participation.anniversarySeal;
      seal.alt = '';
      const vh = document.createElement('img');
      vh.className = 'veritasSealPreview';
      vh.src = participation.veritasSeal;
      vh.alt = '';
      sigBlock.before(seal);
      sigBlock.appendChild(vh);
    }
  }

  function showReadyModal() {
    const modal = document.querySelector('[data-qr-modal]');
    if (!modal) return;
    const title = modal.querySelector('[data-qr-modal-title]');
    const text = modal.querySelector('[data-qr-modal-text]');
    const mark = modal.querySelector('.qr-sealmark');
    if (title) title.textContent = 'Dokument został przygotowany';
    if (text) text.textContent = 'Zapis Uczestnictwa został pobrany jako gotowy plik PDF. Podgląd strony pokazuje czystą wersję dokumentu bez siatki kalibracyjnej.';
    if (mark) mark.textContent = '✓';
    modal.classList.add('is-open');
  }

  function overrideParticipationDownload() {
    const oldButton = document.getElementById('printBtn');
    if (!oldButton) return;
    const button = oldButton.cloneNode(true);
    oldButton.replaceWith(button);
    button.addEventListener('click', async (ev) => {
      ev.preventDefault();
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      const oldLabel = button.textContent;
      button.textContent = 'Przygotowuję dokument...';
      try {
        const { canvas, name } = await drawParticipationV87();
        downloadBlob(makeImagePdf(canvas, A4_L, 0.93), `Zapis-Uczestnictwa-Oswiecim-${escapeFile(name)}.pdf`);
        showReadyModal();
      } catch (err) {
        console.error(err);
        alert('Nie udało się przygotować pliku. Odśwież stronę i spróbuj ponownie.');
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = oldLabel;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    keepPreviewClean();
    if (isParticipation) {
      enhanceParticipationPreview();
      overrideParticipationDownload();
    }
  });
})();
