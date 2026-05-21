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
    title: [1754, 480, 2860, 628],
    lead: [1754, 910, 2480],
    person: [1754, 1140, 2140],
    personLabelY: 1194,
    seal: [1754, 1492, 460, 460],
    motto: [1754, 1818, 1840],
    dateMeta: [715, 2038, 620],
    placeMeta: [2793, 2038, 620],
    author: [1754, 2106],
    sig: [1754, 2168, 470, 108],
    docNo: [1754, 2304, 900],
    docNoLabelY: 2332,
    leftSeal: [715, 2284, 214, 214],
    rightSeal: [2793, 2284, 214, 214]
  };
  const lead = 'Pamiątkowy zapis udziału\nw projekcji audiowizualnej „Rap-Ort: Prawda Sumienia”\npoświęconej świadectwu, pamięci, sumieniu i odpowiedzialności.';
  const motto = 'Prawda nie kończy się w dokumencie.\nZaczyna się w sumieniu.';
  const assetCache = new Map();
  const tick = () => new Promise((resolve) => requestAnimationFrame(resolve));

  function iOSLike() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  function lowMemoryPhone() {
    return window.matchMedia?.('(max-width: 760px)').matches && (navigator.deviceMemory || 4) <= 2;
  }
  function constrainedPhone() {
    return window.matchMedia?.('(max-width: 420px)').matches && (navigator.deviceMemory || 4) <= 3;
  }
  function safeScale() {
    if (lowMemoryPhone()) return 0.72;
    if (constrainedPhone()) return 0.82;
    return 0.88;
  }
  function sequence() {
    const fallback = () => String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    try {
      let seq = localStorage.getItem('vh-zu-osw-seq');
      if (!/^\d{4}$/.test(seq || '')) { seq = fallback(); localStorage.setItem('vh-zu-osw-seq', seq); }
      return seq;
    } catch (_) {
      return fallback();
    }
  }
  function updateStatus(text, visible = true, linkUrl = '') {
    const status = document.querySelector('.qr-mobile-status');
    if (!status) return;
    status.textContent = '';
    status.appendChild(document.createTextNode(text));
    if (linkUrl) {
      const link = document.createElement('a');
      link.href = linkUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = ' Otwórz PDF';
      status.appendChild(link);
    }
    status.classList.toggle('is-visible', visible);
  }
  const load = (src) => {
    if (assetCache.has(src)) return assetCache.get(src);
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    assetCache.set(src, promise);
    return promise;
  };
  const opt = async (src) => { try { return await load(src); } catch (_) { return null; } };
  function warmAssets() {
    if (window.__oswAssetsWarmed) return;
    window.__oswAssetsWarmed = true;
    [doc.bg, doc.texture, doc.title, doc.raportSeal, doc.anniversarySeal, doc.veritasSeal, doc.signature].forEach((src) => opt(src));
  }
  window.addEventListener('osw:participant-interaction', warmAssets, { once: true });

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
  function fitMetaSize(ctx, value, maxW, start, min) {
    for (let s = start; s >= min; s -= 1) {
      font(ctx, s);
      if (ctx.measureText(value).width <= maxW) return s;
    }
    return min;
  }
  function metaAt(ctx, label, value, x, valueY, w, size) {
    const valueSize = fitMetaSize(ctx, value, w - 24, size, 26);
    font(ctx, valueSize);
    ctx.fillStyle = '#fff0ca';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(value, x, valueY);
    rule(ctx, x, valueY + 23, w, .34);
    glow(ctx, label, x, valueY + 52, { size: 18, fill: 'rgba(232,208,154,.62)', blur: 4 });
  }
  function participant(ctx, value) {
    const [x, y, w] = L.person;
    const text = String(value || '').trim();
    if (!text) return;
    const size = fit(ctx, text, w, 64, 40);
    glow(ctx, text, x, y, { size, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#fff0bd', blur: 12 });
    glow(ctx, 'UCZESTNIK PROJEKCJI', x, L.personLabelY, { size: 16, fill: 'rgba(232,208,154,.46)', blur: 3 });
    rule(ctx, x, L.personLabelY + 24, 520, .13);
  }
  function docNumber(ctx, value) {
    const [x, y, w] = L.docNo;
    const valueSize = fitMetaSize(ctx, value, w - 24, 28, 22);
    font(ctx, valueSize, 'Georgia, Times New Roman, serif', 400);
    ctx.fillStyle = 'rgba(255,240,202,.76)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(value, x, y);
    glow(ctx, 'NUMER DOKUMENTU', x, L.docNoLabelY, { size: 14, fill: 'rgba(232,208,154,.44)', blur: 3 });
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
  function pdf(canvas, quality = .96) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    if (!dataUrl || !dataUrl.includes(',')) throw new Error('PDF image export failed');
    const data = atob(dataUrl.split(',')[1]);
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
    if (iOSLike()) {
      updateStatus('PDF został przygotowany.', true, url);
      setTimeout(() => URL.revokeObjectURL(url), 120000);
    } else {
      setTimeout(() => URL.revokeObjectURL(url), 2500);
    }
  }
  function safe(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'uczestnik';
  }

  async function renderFinal(options = {}) {
    const scale = options.safe ? safeScale() : 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(doc.w * scale);
    canvas.height = Math.round(doc.h * scale);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas unavailable');
    if (scale !== 1) ctx.scale(scale, scale);
    updateStatus('Przygotowuję elementy dokumentu…');
    const [bg, texture, title, raport, medal, vh, sig] = await Promise.all([
      load(doc.bg), opt(doc.texture), opt(doc.title), opt(doc.raportSeal), opt(doc.anniversarySeal), opt(doc.veritasSeal), opt(doc.signature)
    ]);
    updateStatus(options.safe ? 'Składam lżejszą wersję zgodną z urządzeniem…' : 'Składam wersję do druku…');
    cover(ctx, bg, 0, 0, doc.w, doc.h);
    if (texture) { ctx.save(); ctx.globalAlpha = .12; ctx.globalCompositeOperation = 'soft-light'; cover(ctx, texture, 0, 0, doc.w, doc.h); ctx.restore(); }
    let aura = ctx.createRadialGradient(1754, 490, 80, 1754, 490, 760);
    aura.addColorStop(0, 'rgba(255,232,174,.10)'); aura.addColorStop(.5, 'rgba(255,232,174,.024)'); aura.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = aura; ctx.fillRect(0, 0, doc.w, doc.h);
    aura = ctx.createRadialGradient(L.seal[0], L.seal[1], 95, L.seal[0], L.seal[1], 780);
    aura.addColorStop(0, 'rgba(255,232,174,.105)'); aura.addColorStop(.42, 'rgba(255,232,174,.026)'); aura.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = aura; ctx.fillRect(0, 0, doc.w, doc.h);

    const name = String(document.getElementById('name')?.value || '').replace(/\s+/g, ' ').trim().slice(0, 42);
    const no = `VH-ZU-2026-0525-OSW-${sequence()}`;

    if (title) contain(ctx, title, ...L.title);
    else glow(ctx, 'ZAPIS UCZESTNICTWA', 1754, 565, { size: 204, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#f4dfad', blur: 32 });
    rule(ctx, 1754, 808, 1240, .16);
    write(ctx, lead, ...L.lead, 44, 62, 3, { style: 'italic', fill: 'rgba(250,238,216,.94)' });
    participant(ctx, name);
    if (medal) contain(ctx, medal, ...L.seal);
    rule(ctx, 1754, 1752, 560, .12);
    write(ctx, motto, ...L.motto, 38, 66, 2, { style: 'italic', fill: 'rgba(255,241,207,.82)' });
    rule(ctx, 1754, 1940, 560, .10);

    metaAt(ctx, 'DATA', '25.05.2026', L.dateMeta[0], L.dateMeta[1], L.dateMeta[2], 35);
    metaAt(ctx, 'MIEJSCE', 'OŚWIĘCIM', L.placeMeta[0], L.placeMeta[1], L.placeMeta[2], 35);
    glow(ctx, 'PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', ...L.author, { size: 14, fill: 'rgba(232,208,154,.40)', blur: 3 });
    if (sig) { ctx.save(); ctx.globalAlpha = .66; contain(ctx, sig, ...L.sig); ctx.restore(); }
    docNumber(ctx, no);
    if (raport) contain(ctx, raport, ...L.leftSeal);
    if (vh) contain(ctx, vh, ...L.rightSeal);
    return { canvas, name, safe: options.safe };
  }

  function bindFinal() {
    const old = document.getElementById('printBtn');
    if (!old) return;
    const button = old.cloneNode(true);
    old.replaceWith(button);
    button.addEventListener('pointerenter', warmAssets, { once: true, passive: true });
    button.addEventListener('touchstart', warmAssets, { once: true, passive: true });
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (window.__oswPdfRendering) return;
      window.__oswPdfRendering = true;
      warmAssets();
      const original = button.textContent;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.textContent = 'Przygotowuję dokument…';
      try {
        let result;
        const preferSafe = lowMemoryPhone();
        try {
          result = await renderFinal({ safe: preferSafe });
        } catch (firstError) {
          console.warn(firstError);
          updateStatus('Przygotowuję lżejszą wersję zgodną z Twoim urządzeniem…');
          result = await renderFinal({ safe: true });
        }
        await tick();
        updateStatus('Finalizuję PDF…');
        await tick();
        save(pdf(result.canvas, result.safe ? .90 : .96), `Zapis-Uczestnictwa-Oswiecim-${safe(result.name)}.pdf`);
        if (!iOSLike()) {
          updateStatus('Gotowe. Dokument został przygotowany.', true);
          document.querySelector('[data-qr-modal]')?.classList.add('is-open');
        }
      } catch (error) {
        console.error(error);
        updateStatus('Nie udało się pobrać pełnych elementów graficznych. Sprawdź połączenie i spróbuj ponownie.', true);
      } finally {
        window.__oswPdfRendering = false;
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = original;
      }
    }, { capture: true });
    window.__oswFinalRendererBound = true;
    if (lowMemoryPhone()) updateStatus('Generator uruchomi lżejszą wersję zgodną ze słabszym telefonem.', true);
  }

  function runBindFinalNow() {
    if (window.__oswFinalRendererBound) return;
    bindFinal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBindFinalNow, { once: true });
  } else {
    runBindFinalNow();
  }
})();