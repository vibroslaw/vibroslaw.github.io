(() => {
  const route = '/rap-ort/oswiecim/zapis-uczestnictwa/';
  if (window.location.pathname.replace(/\/+$/, '/') !== route) return;

  const ASSET = '/public/assets/events/rap-ort/oswiecim20260525';
  const doc = {
    w: 3508,
    h: 2480,
    bg: `${ASSET}/backgrounds/participation-record-bg-final.svg`,
    texture: '/public/assets/reports/certificate-dark-texture.webp',
    title: `${ASSET}/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg`,
    raportSeal: `${ASSET}/accents/raport.svg`,
    anniversarySeal: `${ASSET}/accents/anniversary-edition-seal-gold.png`,
    veritasSeal: `${ASSET}/accents/veritashumanum.svg`,
    signature: '/public/assets/reports/author-signature-gold.svg'
  };
  const L = {
    title: [1754, 400, 2940, 670],
    lead: [1754, 840, 2500],
    seal: [1754, 1245, 590, 590],
    motto: [1754, 1585, 1860],
    person: [1754, 1765, 2300],
    metaY: 1995,
    metaLabelY: 2023,
    author: [1754, 2115],
    sig: [1754, 2190, 500, 116],
    leftSeal: [610, 2248, 245, 245],
    rightSeal: [2898, 2248, 245, 245]
  };
  const lead = 'Pamiątkowy zapis udziału\nw projekcji audiowizualnej „Rap-Ort: Prawda Sumienia”\npoświęconej świadectwu, pamięci, sumieniu i odpowiedzialności.';
  const motto = 'Prawda nie kończy się w dokumencie.\nZaczyna się w sumieniu.';

  const load = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  const opt = async (src) => { try { return await load(src); } catch (_) { return null; } };

  function cover(ctx, img, x, y, w, h) {
    const s = Math.max(w / img.width, h / img.height);
    const sw = w / s;
    const sh = h / s;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
  }
  function contain(ctx, img, cx, cy, w, h) {
    const s = Math.min(w / img.width, h / img.height);
    ctx.drawImage(img, cx - img.width * s / 2, cy - img.height * s / 2, img.width * s, img.height * s);
  }
  function font(ctx, size, family = 'Georgia, Times New Roman, serif', weight = 400, style = 'normal') {
    ctx.font = `${style} ${weight} ${size}px ${family}`;
  }
  function glow(ctx, text, x, y, o = {}) {
    font(ctx, o.size || 30, o.family || 'Arial, sans-serif', o.weight || 700, o.style || 'normal');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.64)';
    ctx.shadowBlur = o.blur || 18;
    ctx.fillStyle = o.fill || '#f6e7bf';
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function split(ctx, text, maxW) {
    const result = [];
    String(text || '').split(/\n+/).forEach((part) => {
      let line = '';
      part.split(/\s+/).filter(Boolean).forEach((word) => {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxW && line) {
          result.push(line);
          line = word;
        } else line = test;
      });
      if (line) result.push(line);
    });
    return result;
  }
  function write(ctx, text, x, y, w, size, lh, max, o = {}) {
    font(ctx, size, o.family || 'Georgia, Times New Roman, serif', o.weight || 400, o.style || 'normal');
    ctx.fillStyle = o.fill || '#f7ead0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    split(ctx, text, w).slice(0, max).forEach((line, i) => ctx.fillText(line, x, y + i * lh));
  }
  function fit(ctx, text, w, start, min) {
    for (let s = start; s >= min; s -= 2) {
      font(ctx, s);
      if (ctx.measureText(text).width <= w) return s;
    }
    return min;
  }
  function rule(ctx, x, y, w, alpha = .36) {
    const g = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
    g.addColorStop(0, 'rgba(232,208,154,0)');
    g.addColorStop(.18, `rgba(232,208,154,${alpha})`);
    g.addColorStop(.5, `rgba(255,235,184,${Math.min(alpha + .16, .76)})`);
    g.addColorStop(.82, `rgba(232,208,154,${alpha})`);
    g.addColorStop(1, 'rgba(232,208,154,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 2.25;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x + w / 2, y);
    ctx.stroke();
  }
  function meta(ctx, label, value, x, w, size) {
    font(ctx, size);
    ctx.fillStyle = '#fff0ca';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    split(ctx, value, w - 18).slice(0, 1).forEach((line) => ctx.fillText(line, x, L.metaY - 20));
    rule(ctx, x, L.metaY, w, .38);
    glow(ctx, label, x, L.metaLabelY, { size: 18, fill: 'rgba(232,208,154,.62)', blur: 4 });
  }
  function bytes(str) {
    const out = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i += 1) out[i] = str.charCodeAt(i) & 255;
    return out;
  }
  function concat(parts) {
    const n = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(n);
    let offset = 0;
    parts.forEach((p) => { out.set(p, offset); offset += p.length; });
    return out;
  }
  function pdf(canvas) {
    const data = atob(canvas.toDataURL('image/jpeg', .96).split(',')[1]);
    const jpg = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += 1) jpg[i] = data.charCodeAt(i);
    const mm = 72 / 25.4;
    const W = 297 * mm;
    const H = 210 * mm;
    const objs = [];
    objs[1] = bytes('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    objs[2] = bytes('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    objs[3] = bytes(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W.toFixed(2)} ${H.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    objs[4] = concat([bytes(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`), jpg, bytes('\nendstream\nendobj\n')]);
    const stream = `q\n${W.toFixed(2)} 0 0 ${H.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
    objs[5] = bytes(`5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj\n`);
    const header = bytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    const parts = [header];
    const offsets = [0];
    let at = header.length;
    for (let i = 1; i <= 5; i += 1) { offsets[i] = at; parts.push(objs[i]); at += objs[i].length; }
    let xref = 'xref\n0 6\n0000000000 65535 f \n';
    for (let i = 1; i <= 5; i += 1) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    parts.push(bytes(`${xref}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${at}\n%%EOF`));
    return new Blob([concat(parts)], { type: 'application/pdf' });
  }
  function save(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }
  function safe(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'uczestnik';
  }

  async function renderFinal() {
    const canvas = document.createElement('canvas');
    canvas.width = doc.w;
    canvas.height = doc.h;
    const ctx = canvas.getContext('2d');
    const [bg, texture, title, raport, medal, vh, sig] = await Promise.all([
      load(doc.bg), opt(doc.texture), opt(doc.title), opt(doc.raportSeal), opt(doc.anniversarySeal), opt(doc.veritasSeal), opt(doc.signature)
    ]);
    cover(ctx, bg, 0, 0, doc.w, doc.h);
    if (texture) { ctx.save(); ctx.globalAlpha = .12; ctx.globalCompositeOperation = 'soft-light'; cover(ctx, texture, 0, 0, doc.w, doc.h); ctx.restore(); }
    let aura = ctx.createRadialGradient(1754, 410, 80, 1754, 410, 760);
    aura.addColorStop(0, 'rgba(255,232,174,.11)'); aura.addColorStop(.5, 'rgba(255,232,174,.026)'); aura.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = aura; ctx.fillRect(0, 0, doc.w, doc.h);
    aura = ctx.createRadialGradient(L.seal[0], L.seal[1], 95, L.seal[0], L.seal[1], 740);
    aura.addColorStop(0, 'rgba(255,232,174,.115)'); aura.addColorStop(.42, 'rgba(255,232,174,.028)'); aura.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = aura; ctx.fillRect(0, 0, doc.w, doc.h);

    const name = document.getElementById('name')?.value.trim() || '';
    let seq = localStorage.getItem('vh-zu-osw-seq');
    if (!/^\d{4}$/.test(seq || '')) { seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0'); localStorage.setItem('vh-zu-osw-seq', seq); }
    const no = `VH-ZU-2026-0525-OSW-${seq}`;

    if (title) contain(ctx, title, ...L.title);
    else glow(ctx, 'ZAPIS UCZESTNICTWA', 1754, 490, { size: 214, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#f4dfad', blur: 34 });
    rule(ctx, 1754, 752, 1340, .22);
    write(ctx, lead, ...L.lead, 46, 62, 3, { style: 'italic', fill: 'rgba(250,238,216,.96)' });
    if (medal) contain(ctx, medal, ...L.seal);
    rule(ctx, 1754, 1550, 610, .15);
    write(ctx, motto, ...L.motto, 39, 66, 2, { style: 'italic', fill: 'rgba(255,241,207,.84)' });
    rule(ctx, 1754, 1740, 610, .12);
    if (name) glow(ctx, `Dla: ${name}`, L.person[0], L.person[1], { size: fit(ctx, `Dla: ${name}`, L.person[2], 68, 40), family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#fff0bd', blur: 12 });
    meta(ctx, 'DATA', '25.05.2026', 650, 540, 36);
    meta(ctx, 'NUMER DOKUMENTU', no, 1754, 780, 32);
    meta(ctx, 'MIEJSCE', 'OŚWIĘCIM', 2858, 540, 36);
    glow(ctx, 'PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', ...L.author, { size: 14, fill: 'rgba(232,208,154,.40)', blur: 3 });
    if (sig) { ctx.save(); ctx.globalAlpha = .68; contain(ctx, sig, ...L.sig); ctx.restore(); }
    if (raport) contain(ctx, raport, ...L.leftSeal);
    if (vh) contain(ctx, vh, ...L.rightSeal);
    return { canvas, name };
  }

  function bindFinal() {
    const old = document.getElementById('printBtn');
    if (!old) return;
    const button = old.cloneNode(true);
    button.disabled = false;
    button.removeAttribute('aria-busy');
    delete button.dataset.waitingForFinalRenderer;
    button.textContent = 'Pobierz gotowy PDF';
    old.replaceWith(button);
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const original = button.textContent;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.textContent = 'Przygotowuję wersję finalną...';
      try {
        const { canvas, name } = await renderFinal();
        save(pdf(canvas), `Zapis-Uczestnictwa-Oswiecim-${safe(name)}.pdf`);
        document.querySelector('[data-qr-modal]')?.classList.add('is-open');
      } catch (error) {
        console.error(error);
        alert('Nie udało się przygotować pliku. Odśwież stronę i spróbuj ponownie.');
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = original;
      }
    });
    window.__raportFinalPdfRendererBound = true;
  }

  function bootFinalRenderer() {
    window.setTimeout(bindFinal, 0);
    window.setTimeout(bindFinal, 150);
    window.setTimeout(bindFinal, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootFinalRenderer, { once: true });
  } else {
    bootFinalRenderer();
  }
})();