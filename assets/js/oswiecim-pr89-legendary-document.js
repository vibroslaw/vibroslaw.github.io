(() => {
  const path = window.location.pathname.replace(/\/+$/, '/');
  if (path !== '/rap-ort/oswiecim/zapis-uczestnictwa/') return;

  const params = new URLSearchParams(window.location.search);
  const calibrationPdf = params.get('calibratePdf') === '1';
  const mm = 72 / 25.4;
  const A4_L = { w: 297 * mm, h: 210 * mm };
  const ASSET = '/public/assets/events/rap-ort/oswiecim20260525';
  const doc = {
    w: 3508,
    h: 2480,
    bg: `${ASSET}/backgrounds/participation-record-bg-final.svg`,
    title: `${ASSET}/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg`,
    eventSeal: `${ASSET}/accents/event-seal-gold.svg`,
    anniversarySeal: `${ASSET}/accents/anniversary-edition-seal-gold.png`,
    veritasSeal: `${ASSET}/accents/veritashumanum.svg`,
    signature: '/public/assets/reports/author-signature-gold.svg'
  };

  const layout = {
    project: { x: 1754, y: 306 },
    eventSeal: { x: 1754, y: 430, w: 150, h: 150 },
    title: { x: 1754, y: 635, w: 2720, h: 540 },
    eventLine: { x: 1754, y: 845 },
    intro: { x: 1754, y: 990, w: 2600 },
    body: { x: 1754, y: 1160, w: 2640 },
    participantName: { x: 1754, y: 1326, w: 2200 },
    metaRuleY: 1536,
    metaLabelY: 1414,
    metaValueY: 1474,
    centralSeal: { x: 1754, y: 1840, w: 470, h: 470 },
    veritasSeal: { x: 2728, y: 1815, w: 215, h: 215 },
    signature: { x: 1754, y: 2112, w: 610, h: 148 },
    author: { x: 1754, y: 2240 },
    micro: { x: 1754, y: 2315, w: 2550 }
  };

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

  function cover(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
  }

  function contain(ctx, img, cx, cy, maxW, maxH) {
    const scale = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  }

  function setFont(ctx, size, family = 'Georgia, Times New Roman, serif', weight = 400, style = 'normal') {
    ctx.font = `${style} ${weight} ${size}px ${family}`;
  }

  function glowText(ctx, text, x, y, opts = {}) {
    setFont(ctx, opts.size || 30, opts.family || 'Arial, sans-serif', opts.weight || 700, opts.style || 'normal');
    ctx.textAlign = opts.align || 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.save();
    ctx.shadowColor = opts.shadowColor || 'rgba(0,0,0,.62)';
    ctx.shadowBlur = opts.shadowBlur || 18;
    ctx.fillStyle = opts.fill || '#f6e7bf';
    ctx.fillText(text, x, y);
    ctx.restore();
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

  function wrapped(ctx, text, x, y, maxW, size, lineHeight, maxLines, opts = {}) {
    setFont(ctx, size, opts.family || 'Georgia, Times New Roman, serif', opts.weight || 400, opts.style || 'normal');
    ctx.fillStyle = opts.fill || '#f7ead0';
    ctx.textAlign = opts.align || 'center';
    ctx.textBaseline = 'alphabetic';
    wrapLines(ctx, text, maxW).slice(0, maxLines).forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  }

  function fit(ctx, text, maxWidth, start, min, family, weight = 400) {
    let size = start;
    while (size >= min) {
      setFont(ctx, size, family, weight);
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    }
    return min;
  }

  function drawRule(ctx, x, y, w, alpha = .45) {
    const grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
    grad.addColorStop(0, `rgba(232,208,154,0)`);
    grad.addColorStop(.18, `rgba(232,208,154,${alpha})`);
    grad.addColorStop(.5, `rgba(255,235,184,${Math.min(alpha + .18, .78)})`);
    grad.addColorStop(.82, `rgba(232,208,154,${alpha})`);
    grad.addColorStop(1, `rgba(232,208,154,0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x + w / 2, y);
    ctx.stroke();
  }

  function meta(ctx, label, value, x, width, size = 31) {
    glowText(ctx, label, x, layout.metaLabelY, {
      size: 24,
      family: 'Arial, sans-serif',
      weight: 700,
      fill: 'rgba(232,208,154,.72)',
      shadowBlur: 8
    });
    wrapped(ctx, value, x, layout.metaValueY, width - 18, size, 38, 2, {
      fill: '#f9ebc8',
      family: 'Georgia, Times New Roman, serif',
      weight: 400
    });
    drawRule(ctx, x, layout.metaRuleY, width, .40);
  }

  function calibration(ctx) {
    if (!calibrationPdf) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,0,0,.22)';
    ctx.fillStyle = 'rgba(255,0,0,.78)';
    ctx.font = '700 20px Arial, sans-serif';
    ctx.lineWidth = 2;
    for (let x = 0; x <= doc.w; x += 100) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, doc.h); ctx.stroke();
      if (x % 500 === 0) ctx.fillText(String(x), x + 8, 28);
    }
    for (let y = 0; y <= doc.h; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(doc.w, y); ctx.stroke();
      if (y % 500 === 0) ctx.fillText(String(y), 8, y - 8);
    }
    ctx.restore();
  }

  function bytes(str) {
    const out = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i += 1) out[i] = str.charCodeAt(i) & 0xff;
    return out;
  }

  function concat(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach((part) => { out.set(part, offset); offset += part.length; });
    return out;
  }

  function makePdf(canvas) {
    const data = canvas.toDataURL('image/jpeg', .95).split(',')[1];
    const bin = atob(data);
    const img = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) img[i] = bin.charCodeAt(i);
    const objects = [];
    objects[1] = bytes('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    objects[2] = bytes('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    objects[3] = bytes(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_L.w.toFixed(2)} ${A4_L.h.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    objects[4] = concat([bytes(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`), img, bytes('\nendstream\nendobj\n')]);
    const content = `q\n${A4_L.w.toFixed(2)} 0 0 ${A4_L.h.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
    objects[5] = bytes(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
    const header = bytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    const parts = [header];
    const offsets = [0];
    let offset = header.length;
    for (let i = 1; i <= 5; i += 1) { offsets[i] = offset; parts.push(objects[i]); offset += objects[i].length; }
    const start = offset;
    let xref = 'xref\n0 6\n0000000000 65535 f \n';
    for (let i = 1; i <= 5; i += 1) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
    parts.push(bytes(xref));
    return new Blob([concat(parts)], { type: 'application/pdf' });
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function fileSafe(value) {
    return String(value || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'uczestnik';
  }

  async function renderLegendary() {
    const canvas = document.createElement('canvas');
    canvas.width = doc.w;
    canvas.height = doc.h;
    const ctx = canvas.getContext('2d');
    const [bg, title, eventSeal, centralSeal, vhSeal, signature] = await Promise.all([
      loadImage(doc.bg), optionalImage(doc.title), optionalImage(doc.eventSeal), optionalImage(doc.anniversarySeal), optionalImage(doc.veritasSeal), optionalImage(doc.signature)
    ]);

    cover(ctx, bg, 0, 0, doc.w, doc.h);
    const titleAura = ctx.createRadialGradient(1754, 650, 120, 1754, 650, 980);
    titleAura.addColorStop(0, 'rgba(255,232,174,.12)');
    titleAura.addColorStop(.52, 'rgba(255,232,174,.035)');
    titleAura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = titleAura;
    ctx.fillRect(0, 0, doc.w, doc.h);
    const centerAura = ctx.createRadialGradient(1754, 1840, 80, 1754, 1840, 700);
    centerAura.addColorStop(0, 'rgba(255,232,174,.10)');
    centerAura.addColorStop(.55, 'rgba(255,232,174,.025)');
    centerAura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = centerAura;
    ctx.fillRect(0, 0, doc.w, doc.h);

    const name = document.getElementById('name')?.value.trim() || '';
    let seq = localStorage.getItem('vh-zu-osw-seq');
    if (!/^\d{4}$/.test(seq || '')) {
      seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      localStorage.setItem('vh-zu-osw-seq', seq);
    }
    const docNo = `VH-ZU-2026-0525-OSW-${seq}`;

    drawRule(ctx, 1754, 346, 1180, .34);
    glowText(ctx, 'RAP-ORT: PRAWDA SUMIENIA', layout.project.x, layout.project.y, { size: 40, fill: 'rgba(245,225,175,.88)', shadowBlur: 12 });
    if (eventSeal) contain(ctx, eventSeal, layout.eventSeal.x, layout.eventSeal.y, layout.eventSeal.w, layout.eventSeal.h);
    if (title) contain(ctx, title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);
    else glowText(ctx, 'ZAPIS UCZESTNICTWA', 1754, 675, { size: 185, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#f4dfad', shadowBlur: 34 });
    drawRule(ctx, 1754, 754, 1250, .28);

    glowText(ctx, 'OŚWIĘCIM · 25 MAJA 2026 · 78. ROCZNICA ŚMIERCI RTM. WITOLDA PILECKIEGO', layout.eventLine.x, layout.eventLine.y, { size: 39, fill: 'rgba(242,219,169,.86)', shadowBlur: 10 });
    wrapped(ctx, 'Pamiątkowy zapis udziału w wydarzeniu poświęconym świadectwu, pamięci i odpowiedzialności — w Uczelni noszącej imię Rotmistrza.', layout.intro.x, layout.intro.y, layout.intro.w, 47, 62, 2, { style: 'italic', fill: 'rgba(250,238,216,.94)' });
    wrapped(ctx, 'Niniejszy dokument upamiętnia udział w projekcji audiowizualnej „Rap-Ort: Prawda Sumienia” oraz rozmowie refleksyjnej prowadzącej od świadectwa Witolda Pileckiego ku osobistemu pytaniu o prawdę, sumienie i odpowiedzialność człowieka.', layout.body.x, layout.body.y, layout.body.w, 41, 56, 3, { fill: 'rgba(250,238,216,.91)' });

    if (name) {
      const text = `Dla: ${name}`;
      const size = fit(ctx, text, layout.participantName.w, 68, 42, 'Georgia, Times New Roman, serif', 400);
      glowText(ctx, text, layout.participantName.x, layout.participantName.y, { size, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#fff0bd', shadowBlur: 18 });
    }

    meta(ctx, 'DATA WYDARZENIA', '25 maja 2026', 780, 830, 33);
    meta(ctx, 'MIEJSCE', 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu', 1754, 940, 29);
    meta(ctx, 'NUMER DOKUMENTU', docNo, 2728, 830, 33);

    if (centralSeal) contain(ctx, centralSeal, layout.centralSeal.x, layout.centralSeal.y, layout.centralSeal.w, layout.centralSeal.h);
    if (vhSeal) contain(ctx, vhSeal, layout.veritasSeal.x, layout.veritasSeal.y, layout.veritasSeal.w, layout.veritasSeal.h);
    if (signature) contain(ctx, signature, layout.signature.x, layout.signature.y, layout.signature.w, layout.signature.h);
    drawRule(ctx, 1754, 2210, 1220, .32);
    glowText(ctx, 'PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', layout.author.x, layout.author.y, { size: 24, fill: 'rgba(232,208,154,.70)', shadowBlur: 8 });
    wrapped(ctx, 'Pamiątkowy dokument od autora projektu · nie jest dyplomem ani dokumentem urzędowym · wygenerowany lokalnie w przeglądarce uczestnika.', layout.micro.x, layout.micro.y, layout.micro.w, 18, 29, 2, { family: 'Arial, sans-serif', weight: 700, fill: 'rgba(232,208,154,.48)' });

    calibration(ctx);
    return { canvas, name };
  }

  function stylePreview() {
    const style = document.createElement('style');
    style.textContent = `
      .qr-participation .doc-content{inset:0!important;display:block!important;text-align:center!important;font-family:Georgia,'Times New Roman',serif!important;}
      .qr-participation .topline{position:absolute;left:50%;top:12.35%;transform:translate(-50%,-50%);width:72%;font-size:clamp(.56rem,1.10vw,.96rem)!important;letter-spacing:.34em!important;margin:0!important;text-shadow:0 2px 10px rgba(0,0,0,.72);}
      .qr-participation .seal{position:absolute;left:50%;top:17.35%;transform:translate(-50%,-50%);width:4.30%!important;max-width:none!important;margin:0!important;}
      .qr-participation .titlePlate{position:absolute;left:50%;top:25.60%;transform:translate(-50%,-50%);width:77.5%!important;max-width:none!important;margin:0!important;filter:drop-shadow(0 22px 42px rgba(0,0,0,.58));}
      .qr-participation .subTitle{position:absolute;left:50%;top:34.05%;transform:translate(-50%,-50%);width:86%;font-size:clamp(.54rem,1.04vw,.98rem)!important;margin:0!important;text-shadow:0 2px 8px rgba(0,0,0,.62);}
      .qr-participation .memorialLine{position:absolute;left:50%;top:40.0%;transform:translate(-50%,-50%);width:76%;max-width:none!important;font-size:clamp(.66rem,1.14vw,1.1rem)!important;margin:0!important;}
      .qr-participation .mainCopy{position:absolute;left:50%;top:47.1%;transform:translate(-50%,-50%);width:78%;max-width:none!important;font-size:clamp(.60rem,1.04vw,.98rem)!important;margin:0!important;}
      .qr-participation .for{position:absolute;left:50%;top:53.5%;transform:translate(-50%,-50%);width:72%;margin:0!important;font-size:clamp(.76rem,1.28vw,1.22rem)!important;text-shadow:0 2px 10px rgba(0,0,0,.66);}
      .qr-participation .fields{position:absolute!important;left:50%;top:58.5%;transform:translate(-50%,-50%);width:88.5%!important;margin:0!important;}
      .qr-participation .field{padding-top:0!important;padding-bottom:.55rem!important;border-top:0!important;border-bottom:1px solid rgba(232,208,154,.46)!important;}
      .qr-participation .field span{margin-bottom:.24rem!important;color:rgba(232,208,154,.72)!important;}
      .qr-participation .field strong{color:#f8eac8!important;}
      .qr-participation .anniversarySealPreview{position:absolute;left:50%;top:74.2%;transform:translate(-50%,-50%);width:13.4%!important;max-width:none!important;margin:0!important;filter:drop-shadow(0 14px 32px rgba(0,0,0,.50));}
      .qr-participation .veritasSealPreview{position:absolute!important;left:77.8%;top:73.2%;transform:translate(-50%,-50%);right:auto!important;width:6.15%!important;max-width:none!important;opacity:.96!important;filter:drop-shadow(0 12px 28px rgba(0,0,0,.48));}
      .qr-participation .quote{display:none!important;}
      .qr-participation .signatureBlock{position:absolute!important;left:50%;top:85.4%;transform:translate(-50%,-50%);margin:0!important;width:36%;}
      .qr-participation .sig{width:83%!important;max-height:none!important;}
      .qr-participation .author{font-size:clamp(.35rem,.66vw,.60rem)!important;color:rgba(232,208,154,.70)!important;}
      .qr-participation .micro{position:absolute;left:50%;top:93.35%;transform:translate(-50%,-50%);width:76%;max-width:none!important;margin:0!important;color:rgba(232,208,154,.48)!important;}
      .qr-participation #doc > canvas[aria-hidden='true'],.qr-calibration-note{display:none!important;opacity:0!important;visibility:hidden!important;}
    `;
    document.head.appendChild(style);
  }

  function tunePreview() {
    document.querySelectorAll('#doc > canvas[aria-hidden="true"], .qr-calibration-note').forEach((el) => el.remove());
    const titleText = document.querySelector('.qr-participation .titleText');
    if (titleText) {
      const img = document.createElement('img');
      img.className = 'titlePlate';
      img.src = doc.title;
      img.alt = 'Zapis Uczestnictwa';
      titleText.replaceWith(img);
    }
    const sigBlock = document.querySelector('.qr-participation .signatureBlock');
    if (sigBlock && !document.querySelector('.anniversarySealPreview')) {
      const seal = document.createElement('img');
      seal.className = 'anniversarySealPreview';
      seal.src = doc.anniversarySeal;
      seal.alt = '';
      sigBlock.before(seal);
      const vh = document.createElement('img');
      vh.className = 'veritasSealPreview';
      vh.src = doc.veritasSeal;
      vh.alt = '';
      document.querySelector('.qr-participation .doc-content')?.appendChild(vh);
    }
  }

  function modal() {
    const m = document.querySelector('[data-qr-modal]');
    if (!m) return;
    m.querySelector('[data-qr-modal-title]').textContent = 'Dokument został przygotowany';
    m.querySelector('[data-qr-modal-text]').textContent = 'Pobrano finalny, ścienny Zapis Uczestnictwa w wersji legendarnej.';
    m.querySelector('.qr-sealmark').textContent = '✓';
    m.classList.add('is-open');
  }

  function bind() {
    const old = document.getElementById('printBtn');
    if (!old) return;
    const button = old.cloneNode(true);
    old.replaceWith(button);
    button.addEventListener('click', async (ev) => {
      ev.preventDefault();
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      const original = button.textContent;
      button.textContent = 'Przygotowuję wersję legendarną...';
      try {
        const { canvas, name } = await renderLegendary();
        download(makePdf(canvas), `Zapis-Uczestnictwa-Oswiecim-${fileSafe(name)}.pdf`);
        modal();
      } catch (err) {
        console.error(err);
        alert('Nie udało się przygotować pliku. Odśwież stronę i spróbuj ponownie.');
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = original;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    stylePreview();
    window.setTimeout(tunePreview, 0);
    window.setTimeout(tunePreview, 100);
    window.setTimeout(tunePreview, 280);
    window.setTimeout(bind, 0);
  });
})();
