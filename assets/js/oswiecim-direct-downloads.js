(() => {
  const path = window.location.pathname.replace(/\/+$/, '/');
  const isParticipation = path === '/rap-ort/oswiecim/zapis-uczestnictwa/';
  const isWitness = path === '/rap-ort/oswiecim/raport-swiadka/';
  if (!isParticipation && !isWitness) return;

  const mm = 72 / 25.4;
  const A4_L = { w: 297 * mm, h: 210 * mm };
  const A4_P = { w: 210 * mm, h: 297 * mm };
  const DPI = 2;
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

  function fitText(ctx, text, maxWidth, fontStart, fontMin, fontFamily, weight = '400') {
    let size = fontStart;
    do {
      ctx.font = `${weight} ${size}px ${fontFamily}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    } while (size >= fontMin);
    return fontMin;
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
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
    const clipped = maxLines ? lines.slice(0, maxLines) : lines;
    clipped.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
    return clipped.length;
  }

  function drawCenteredWrapped(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
      else line = test;
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines || lines.length).forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
    return Math.min(lines.length, maxLines || lines.length);
  }

  function drawImageCover(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
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

  async function drawParticipation() {
    const W = 3508;
    const H = 2480;
    const canvas = document.createElement('canvas');
    canvas.width = W / DPI;
    canvas.height = H / DPI;
    const ctx = canvas.getContext('2d');
    ctx.scale(1 / DPI, 1 / DPI);
    const [bg, seal, sig] = await Promise.all([
      loadImage('/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-bg.jpg'),
      optionalImage('/public/assets/events/rap-ort/oswiecim20260525/accents/event-seal-gold.svg'),
      optionalImage('/public/assets/reports/author-signature-gold.svg')
    ]);
    drawImageCover(ctx, bg, 0, 0, W, H);
    const grad = ctx.createRadialGradient(W / 2, H * 0.48, 160, W / 2, H * 0.48, 1450);
    grad.addColorStop(0, 'rgba(255,232,174,0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0.16)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    const name = document.getElementById('name')?.value.trim() || '';
    const seq = getSeq('vh-zu-osw-seq');
    const docNo = `VH-ZU-2026-0525-OSW-${seq}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(245,225,175,0.82)';
    ctx.font = '700 36px Arial, sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('RAP-ORT: PRAWDA SUMIENIA', W / 2, 320);
    if (seal) ctx.drawImage(seal, W / 2 - 98, 365, 196, 196);
    ctx.fillStyle = '#f4dfad';
    ctx.font = '400 132px Georgia, Times New Roman, serif';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 24;
    ctx.fillText('ZAPIS UCZESTNICTWA', W / 2, 700);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(242,219,169,0.78)';
    ctx.font = '700 34px Arial, sans-serif';
    ctx.fillText('OŚWIĘCIM · 25 MAJA 2026 · 78. ROCZNICA ŚMIERCI RTM. WITOLDA PILECKIEGO', W / 2, 790);
    ctx.fillStyle = 'rgba(248,235,209,0.90)';
    ctx.font = 'italic 43px Georgia, Times New Roman, serif';
    drawCenteredWrapped(ctx, 'Pamiątkowy zapis udziału w wydarzeniu poświęconym świadectwu, pamięci i odpowiedzialności — w Uczelni noszącej imię Rotmistrza.', W / 2, 905, 2400, 58, 2);
    ctx.font = '38px Georgia, Times New Roman, serif';
    drawCenteredWrapped(ctx, 'Niniejszy dokument upamiętnia udział w projekcji audiowizualnej „Rap-Ort: Prawda Sumienia” oraz rozmowie refleksyjnej prowadzącej od świadectwa Witolda Pileckiego ku osobistemu pytaniu o prawdę, sumienie i odpowiedzialność człowieka.', W / 2, 1072, 2550, 54, 4);
    if (name) {
      ctx.fillStyle = '#fff0bd';
      const size = fitText(ctx, `Dla: ${name}`, 2100, 58, 36, 'Georgia, Times New Roman, serif');
      ctx.font = `400 ${size}px Georgia, Times New Roman, serif`;
      ctx.fillText(`Dla: ${name}`, W / 2, 1340);
    }
    const boxY = 1488;
    const colX = [780, 1754, 2728];
    ctx.strokeStyle = 'rgba(232,208,154,0.45)';
    ctx.fillStyle = 'rgba(232,208,154,0.62)';
    ctx.font = '700 22px Arial, sans-serif';
    const labels = ['DATA WYDARZENIA', 'MIEJSCE', 'NUMER DOKUMENTU'];
    const vals = ['25 maja 2026', 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu', docNo];
    colX.forEach((x, i) => {
      ctx.beginPath(); ctx.moveTo(x - 410, boxY); ctx.lineTo(x + 410, boxY); ctx.stroke();
      ctx.fillText(labels[i], x, boxY + 52);
      ctx.fillStyle = '#f5e7c8';
      ctx.font = i === 1 ? '400 27px Georgia, Times New Roman, serif' : '400 31px Georgia, Times New Roman, serif';
      drawCenteredWrapped(ctx, vals[i], x, boxY + 104, i === 1 ? 800 : 760, 38, 2);
      ctx.fillStyle = 'rgba(232,208,154,0.62)';
      ctx.font = '700 22px Arial, sans-serif';
    });
    ctx.fillStyle = 'rgba(247,229,190,0.75)';
    ctx.font = 'italic 36px Georgia, Times New Roman, serif';
    drawCenteredWrapped(ctx, '„Historia nie pyta nas tylko o to, co wiemy. Pyta nas, kim stajemy się po spotkaniu ze świadectwem.”', W / 2, 1885, 2100, 50, 2);
    if (sig) ctx.drawImage(sig, W / 2 - 260, 2044, 520, 120);
    ctx.fillStyle = 'rgba(232,208,154,0.62)';
    ctx.font = '700 23px Arial, sans-serif';
    ctx.fillText('PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', W / 2, 2205);
    ctx.fillStyle = 'rgba(232,208,154,0.42)';
    ctx.font = '700 17px Arial, sans-serif';
    drawCenteredWrapped(ctx, 'Pamiątkowy dokument od autora projektu · nie jest dyplomem ani dokumentem urzędowym · wygenerowany lokalnie w przeglądarce uczestnika.', W / 2, 2292, 2450, 28, 2);
    return { canvas, name };
  }

  async function drawWitness(anonymous = false) {
    const W = 2480;
    const H = 3508;
    const canvas = document.createElement('canvas');
    canvas.width = W / DPI;
    canvas.height = H / DPI;
    const ctx = canvas.getContext('2d');
    ctx.scale(1 / DPI, 1 / DPI);
    const bg = await loadImage('/public/assets/events/rap-ort/oswiecim20260525/backgrounds/witness-report-bg.svg');
    drawImageCover(ctx, bg, 0, 0, W, H);
    const name = document.getElementById('name')?.value.trim() || '';
    const reflection = document.getElementById('reflection')?.value.trim() || 'Cisza po świadectwie nie jest pustką. Jest miejscem, w którym zaczyna pracować sumienie.';
    const seq = getSeq('vh-wr-osw-seq');
    const docNo = `VH-WR-2026-0525-OSW-${seq}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(66,46,22,0.68)';
    ctx.font = '700 31px Arial, sans-serif';
    ctx.fillText('RAP-ORT: PRAWDA SUMIENIA · OŚWIĘCIM / MUP · 25 MAJA 2026', W / 2, 430);
    ctx.fillStyle = '#2a1d11';
    ctx.font = '400 108px Georgia, Times New Roman, serif';
    ctx.fillText(anonymous ? 'ANONIMOWY RAPORT ŚWIADKA' : 'RAPORT ŚWIADKA', W / 2, 675);
    ctx.fillStyle = '#2b2015';
    ctx.font = 'italic 46px Georgia, Times New Roman, serif';
    drawCenteredWrapped(ctx, '„Nie jesteś świadkiem wydarzeń historycznych. Jesteś świadkiem spotkania ze świadectwem.”', W / 2, 890, 1680, 65, 3);
    ctx.strokeStyle = 'rgba(66,46,22,0.23)';
    ctx.beginPath(); ctx.moveTo(430, 1185); ctx.lineTo(2050, 1185); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(430, 2145); ctx.lineTo(2050, 2145); ctx.stroke();
    ctx.fillStyle = '#24180d';
    ctx.font = '38px Courier New, monospace';
    ctx.textAlign = 'left';
    wrapText(ctx, reflection, 500, 1305, 1480, 62, 13);
    ctx.textAlign = 'center';
    const xs = [760, 1720, 760, 1720];
    const ys = [2450, 2450, 2675, 2675];
    const labels = ['DATA', 'MIEJSCE', anonymous ? 'NUMER ARCHIWALNY' : 'NUMER RAPORTU', anonymous ? 'STATUS' : 'UCZESTNIK'];
    const vals = ['25 maja 2026', 'MUP im. rtm. W. Pileckiego w Oświęcimiu', docNo, anonymous ? 'Wersja anonimowa' : (name || 'Świadek doświadczenia')];
    xs.forEach((x, i) => {
      ctx.strokeStyle = 'rgba(66,46,22,0.28)';
      ctx.beginPath(); ctx.moveTo(x - 360, ys[i]); ctx.lineTo(x + 360, ys[i]); ctx.stroke();
      ctx.fillStyle = 'rgba(66,46,22,0.52)';
      ctx.font = '700 23px Arial, sans-serif';
      ctx.fillText(labels[i], x, ys[i] + 45);
      ctx.fillStyle = '#2a1d11';
      ctx.font = '400 31px Georgia, Times New Roman, serif';
      drawCenteredWrapped(ctx, vals[i], x, ys[i] + 92, 700, 39, 2);
    });
    if (!anonymous) {
      ctx.strokeStyle = 'rgba(66,46,22,0.30)';
      ctx.beginPath(); ctx.moveTo(620, 3068); ctx.lineTo(1860, 3068); ctx.stroke();
      ctx.fillStyle = 'rgba(66,46,22,0.52)';
      ctx.font = '700 24px Arial, sans-serif';
      ctx.fillText('PODPIS ŚWIADKA DOŚWIADCZENIA', W / 2, 3120);
    }
    ctx.fillStyle = 'rgba(66,46,22,0.48)';
    ctx.font = '700 20px Arial, sans-serif';
    drawCenteredWrapped(ctx, anonymous ? 'Wersja anonimowa · bez imienia, nazwiska i podpisu · do dobrowolnego przekazania uczelni.' : 'Osobisty dokument refleksji · generowany lokalnie · nie jest testem ani dokumentem urzędowym.', W / 2, 3305, 1780, 30, 2);
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

  document.addEventListener('DOMContentLoaded', () => {
    ensureModal();
    enhanceWitnessChips();
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
