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
    texture: '/public/assets/reports/certificate-dark-texture.webp',
    title: `${ASSET}/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg`,
    eventSeal: `${ASSET}/accents/event-seal-gold.svg`,
    raportSeal: `${ASSET}/accents/raport.svg`,
    anniversarySeal: `${ASSET}/accents/anniversary-edition-seal-gold.png`,
    veritasSeal: `${ASSET}/accents/veritashumanum.svg`,
    signature: '/public/assets/reports/author-signature-gold.svg'
  };

  const layout = {
    title: { x: 1754, y: 335, w: 2920, h: 710 },
    lead: { x: 1754, y: 742, w: 2140 },
    leadSub: { x: 1754, y: 928, w: 2280 },
    centralSeal: { x: 1754, y: 1100, w: 590, h: 590 },
    motto: { x: 1754, y: 1410, w: 1880 },
    participantName: { x: 1754, y: 1584, w: 2250 },
    signature: { x: 1754, y: 1724, w: 350, h: 78 },
    author: { x: 1754, y: 1794 },
    metaRuleY: 2006,
    metaLabelY: 2033,
    bottomEventSeal: { x: 1754, y: 2248, w: 2040, h: 215 },
    bottomRaportSeal: { x: 610, y: 2248, w: 245, h: 245 },
    bottomVeritasSeal: { x: 2898, y: 2248, w: 245, h: 245 }
  };

  const ceremonialLead = 'Pamiątkowy zapis udziału\nw projekcji audiowizualnej\n„Rap-Ort: Prawda Sumienia”';
  const ceremonialSubline = 'poświęconej świadectwu, pamięci, sumieniu i odpowiedzialności.';
  const ceremonialMotto = 'Prawda nie kończy się w dokumencie.\nZaczyna się w sumieniu.';
  const legalNote = 'Pamiątkowy dokument od autora projektu · nie jest dyplomem ani dokumentem urzędowym · generowany lokalnie w przeglądarce uczestnika.';

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

  function containWidth(ctx, img, cx, cy, maxW, maxH) {
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
    ctx.shadowBlur = opts.shadowBlur || 16;
    ctx.fillStyle = opts.fill || '#f6e7bf';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function wrapLines(ctx, text, maxWidth) {
    const segments = String(text || '').split(/\n+/);
    const lines = [];
    segments.forEach((segment) => {
      const words = segment.split(/\s+/).filter(Boolean);
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
    });
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

  function drawRule(ctx, x, y, w, alpha = .32, lineWidth = 2.1) {
    const grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
    grad.addColorStop(0, 'rgba(232,208,154,0)');
    grad.addColorStop(.18, `rgba(232,208,154,${alpha})`);
    grad.addColorStop(.5, `rgba(255,235,184,${Math.min(alpha + .16, .70)})`);
    grad.addColorStop(.82, `rgba(232,208,154,${alpha})`);
    grad.addColorStop(1, 'rgba(232,208,154,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x + w / 2, y);
    ctx.stroke();
  }

  function meta(ctx, label, value, x, width, size = 31, maxLines = 2, lineHeight = 35) {
    setFont(ctx, size, 'Georgia, Times New Roman, serif', 400);
    ctx.fillStyle = 'rgba(255,241,207,.92)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const lines = wrapLines(ctx, value, width - 18).slice(0, maxLines);
    const lastLineY = layout.metaRuleY - 20;
    const firstLineY = lastLineY - Math.max(lines.length - 1, 0) * lineHeight;
    lines.forEach((line, index) => ctx.fillText(line, x, firstLineY + index * lineHeight));
    drawRule(ctx, x, layout.metaRuleY, width, .30, 1.9);
    glowText(ctx, label, x, layout.metaLabelY, {
      size: 16,
      family: 'Arial, sans-serif',
      weight: 700,
      fill: 'rgba(232,208,154,.58)',
      shadowBlur: 4
    });
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
    const data = canvas.toDataURL('image/jpeg', .96).split(',')[1];
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
    const [bg, texture, title, eventSeal, raportSeal, centralSeal, vhSeal, signature] = await Promise.all([
      loadImage(doc.bg), optionalImage(doc.texture), optionalImage(doc.title), optionalImage(doc.eventSeal), optionalImage(doc.raportSeal), optionalImage(doc.anniversarySeal), optionalImage(doc.veritasSeal), optionalImage(doc.signature)
    ]);

    cover(ctx, bg, 0, 0, doc.w, doc.h);
    if (texture) {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.globalCompositeOperation = 'soft-light';
      cover(ctx, texture, 0, 0, doc.w, doc.h);
      ctx.restore();
    }

    const titleAura = ctx.createRadialGradient(1754, 350, 90, 1754, 350, 860);
    titleAura.addColorStop(0, 'rgba(255,232,174,.10)');
    titleAura.addColorStop(.55, 'rgba(255,232,174,.026)');
    titleAura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = titleAura;
    ctx.fillRect(0, 0, doc.w, doc.h);
    const sealAura = ctx.createRadialGradient(layout.centralSeal.x, layout.centralSeal.y, 95, layout.centralSeal.x, layout.centralSeal.y, 820);
    sealAura.addColorStop(0, 'rgba(255,232,174,.115)');
    sealAura.addColorStop(.43, 'rgba(255,232,174,.030)');
    sealAura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sealAura;
    ctx.fillRect(0, 0, doc.w, doc.h);

    const name = document.getElementById('name')?.value.trim() || '';
    let seq = localStorage.getItem('vh-zu-osw-seq');
    if (!/^\d{4}$/.test(seq || '')) {
      seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      localStorage.setItem('vh-zu-osw-seq', seq);
    }
    const docNo = `VH-ZU-2026-0525-OSW-${seq}`;

    if (title) contain(ctx, title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);
    else glowText(ctx, 'ZAPIS UCZESTNICTWA', 1754, 450, { size: 220, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#f4dfad', shadowBlur: 32 });
    drawRule(ctx, 1754, 650, 1180, .18, 1.7);

    wrapped(ctx, ceremonialLead, layout.lead.x, layout.lead.y, layout.lead.w, 52, 64, 3, { style: 'italic', fill: 'rgba(250,238,216,.94)' });
    wrapped(ctx, ceremonialSubline, layout.leadSub.x, layout.leadSub.y, layout.leadSub.w, 34, 46, 1, { style: 'italic', fill: 'rgba(232,208,154,.68)' });

    if (centralSeal) contain(ctx, centralSeal, layout.centralSeal.x, layout.centralSeal.y, layout.centralSeal.w, layout.centralSeal.h);
    drawRule(ctx, 1754, 1306, 560, .13, 1.5);
    wrapped(ctx, ceremonialMotto, layout.motto.x, layout.motto.y, layout.motto.w, 39, 64, 2, { style: 'italic', fill: 'rgba(255,241,207,.84)' });
    drawRule(ctx, 1754, 1472, 560, .13, 1.5);

    if (name) {
      const text = `Dla: ${name}`;
      const size = fit(ctx, text, layout.participantName.w, 70, 42, 'Georgia, Times New Roman, serif', 400);
      glowText(ctx, text, layout.participantName.x, layout.participantName.y, { size, family: 'Georgia, Times New Roman, serif', weight: 400, fill: '#fff0bd', shadowBlur: 14 });
    }

    if (signature) {
      ctx.save();
      ctx.globalAlpha = 0.55;
      contain(ctx, signature, layout.signature.x, layout.signature.y, layout.signature.w, layout.signature.h);
      ctx.restore();
    }
    drawRule(ctx, 1754, 1756, 640, .10, 1.3);
    glowText(ctx, 'PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', layout.author.x, layout.author.y, { size: 14, fill: 'rgba(232,208,154,.36)', shadowBlur: 3 });

    meta(ctx, 'DATA', '25.05.2026', 650, 500, 36, 1, 35);
    meta(ctx, 'NUMER DOKUMENTU', docNo, 1754, 720, 31, 1, 35);
    meta(ctx, 'MIEJSCE', 'OŚWIĘCIM', 2858, 500, 36, 1, 35);

    if (eventSeal) {
      ctx.save();
      ctx.globalAlpha = 0.30;
      containWidth(ctx, eventSeal, layout.bottomEventSeal.x, layout.bottomEventSeal.y, layout.bottomEventSeal.w, layout.bottomEventSeal.h);
      ctx.restore();
    }
    if (raportSeal) contain(ctx, raportSeal, layout.bottomRaportSeal.x, layout.bottomRaportSeal.y, layout.bottomRaportSeal.w, layout.bottomRaportSeal.h);
    if (vhSeal) contain(ctx, vhSeal, layout.bottomVeritasSeal.x, layout.bottomVeritasSeal.y, layout.bottomVeritasSeal.w, layout.bottomVeritasSeal.h);

    calibration(ctx);
    return { canvas, name };
  }

  function stylePreview() {
    const style = document.createElement('style');
    style.textContent = `
      .qr-participation .doc-bg::after{content:"";position:absolute;inset:0;background:url('/public/assets/reports/certificate-dark-texture.webp') center/cover no-repeat;opacity:.12;mix-blend-mode:soft-light;pointer-events:none;}
      .qr-participation .doc-content{inset:0!important;display:block!important;text-align:center!important;font-family:Georgia,'Times New Roman',serif!important;}
      .qr-participation .topline,.qr-participation .subTitle,.qr-participation .topVeritasSealPreview{display:none!important;}
      .qr-participation .seal{display:none!important;}
      .qr-participation .titlePlate{position:absolute;left:50%;top:13.55%;transform:translate(-50%,-50%);width:83.2%!important;max-width:none!important;margin:0!important;filter:drop-shadow(0 24px 44px rgba(0,0,0,.62));}
      .qr-participation .memorialLine{position:absolute;left:50%;top:30.0%;transform:translate(-50%,-50%);width:61%;max-width:none!important;font-size:clamp(.62rem,1.02vw,1rem)!important;line-height:1.38!important;margin:0!important;white-space:pre-line!important;}
      .qr-participation .mainCopy{position:absolute;left:50%;top:56.9%;transform:translate(-50%,-50%);width:54%;max-width:none!important;font-size:clamp(.55rem,.92vw,.88rem)!important;line-height:1.52!important;font-style:italic!important;margin:0!important;color:rgba(255,241,207,.84)!important;}
      .qr-participation .for{position:absolute;left:50%;top:64.0%;transform:translate(-50%,-50%);width:72%;margin:0!important;font-size:clamp(.78rem,1.30vw,1.22rem)!important;text-shadow:0 2px 10px rgba(0,0,0,.62);}
      .qr-participation .fields{position:absolute!important;left:50%;top:80.85%;transform:translate(-50%,-50%);width:80.5%!important;margin:0!important;grid-template-columns:.88fr 1.20fr .88fr!important;gap:clamp(1.05rem,2.3vw,2rem)!important;}
      .qr-participation .field{display:flex!important;flex-direction:column!important;gap:.14rem!important;padding:0!important;border-top:0!important;border-bottom:0!important;align-items:stretch!important;}
      .qr-participation .field::before{content:"";display:block;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(232,208,154,.38),rgba(255,235,184,.55),rgba(232,208,154,.38),transparent);order:2;margin:.30rem 0 .16rem!important;}
      .qr-participation .field strong{order:1;color:rgba(255,241,207,.92)!important;font-size:clamp(.46rem,.74vw,.70rem)!important;line-height:1.10!important;font-family:Georgia,'Times New Roman',serif!important;font-weight:400!important;min-height:1.70em!important;display:flex!important;align-items:flex-end!important;justify-content:center!important;}
      .qr-participation .field span{order:3;margin:0!important;color:rgba(232,208,154,.58)!important;font-size:clamp(.25rem,.45vw,.40rem)!important;line-height:1!important;letter-spacing:.20em!important;}
      .qr-participation .anniversarySealPreview{position:absolute;left:50%;top:44.35%;transform:translate(-50%,-50%);width:16.8%!important;max-width:none!important;margin:0!important;filter:drop-shadow(0 18px 40px rgba(0,0,0,.56));}
      .qr-participation .bottomEventSealWidePreview{position:absolute!important;left:50%;top:90.65%;transform:translate(-50%,-50%);width:58.2%!important;max-width:none!important;opacity:.30!important;filter:drop-shadow(0 10px 28px rgba(0,0,0,.48));}
      .qr-participation .eventSealMirrorPreview{position:absolute!important;left:17.4%;top:90.65%;transform:translate(-50%,-50%);width:7.0%!important;max-width:none!important;opacity:.96!important;filter:drop-shadow(0 12px 28px rgba(0,0,0,.48));}
      .qr-participation .veritasSealPreview{position:absolute!important;left:82.6%;top:90.65%;transform:translate(-50%,-50%);right:auto!important;width:7.0%!important;max-width:none!important;opacity:.96!important;filter:drop-shadow(0 12px 28px rgba(0,0,0,.48));}
      .qr-participation .quote,.qr-participation .micro{display:none!important;}
      .qr-participation .signatureBlock{position:absolute!important;left:50%;top:69.45%;transform:translate(-50%,-50%);margin:0!important;width:22%;opacity:.56!important;}
      .qr-participation .sig{width:60%!important;max-height:none!important;}
      .qr-participation .author{font-size:clamp(.22rem,.39vw,.34rem)!important;color:rgba(232,208,154,.36)!important;}
      .qr-participation #doc > canvas[aria-hidden='true'],.qr-calibration-note{display:none!important;opacity:0!important;visibility:hidden!important;}
    `;
    document.head.appendChild(style);
  }

  function syncCeremonialCopy() {
    const lead = document.querySelector('.qr-participation .memorialLine');
    const motto = document.querySelector('.qr-participation .mainCopy');
    if (lead) lead.innerHTML = 'Pamiątkowy zapis udziału<br>w projekcji audiowizualnej<br>„Rap-Ort: Prawda Sumienia”<br><span style="font-size:.72em;color:rgba(232,208,154,.68)">poświęconej świadectwu, pamięci, sumieniu i odpowiedzialności.</span>';
    if (motto) motto.innerHTML = 'Prawda nie kończy się w dokumencie.<br>Zaczyna się w sumieniu.';
  }

  function syncPreviewMetadata() {
    const fields = Array.from(document.querySelectorAll('.qr-participation .field'));
    if (fields.length < 3) return;
    const docNo = document.getElementById('num')?.textContent || 'VH-ZU-2026-0525-OSW-0001';
    const data = [
      { label: 'DATA', value: '25.05.2026' },
      { label: 'NUMER DOKUMENTU', value: docNo },
      { label: 'MIEJSCE', value: 'OŚWIĘCIM' }
    ];
    data.forEach((item, index) => {
      const field = fields[index];
      const label = field.querySelector('span');
      const value = field.querySelector('strong');
      field.classList.remove('field-place');
      if (label) label.textContent = item.label;
      if (value) value.textContent = item.value;
    });
  }

  function moveLegalNoteToPage() {
    if (document.querySelector('.qr-print-legal-note')) return;
    const target = document.querySelector('.qr-privacy-note') || document.querySelector('.panel .note');
    if (!target) return;
    const note = document.createElement('span');
    note.className = 'qr-print-legal-note';
    note.textContent = ` ${legalNote}`;
    target.appendChild(note);
  }

  function tunePreview() {
    document.querySelectorAll('#doc > canvas[aria-hidden="true"], .qr-calibration-note, .topVeritasSealPreview').forEach((el) => el.remove());
    syncCeremonialCopy();
    syncPreviewMetadata();
    moveLegalNoteToPage();
    const titleText = document.querySelector('.qr-participation .titleText');
    if (titleText) {
      const img = document.createElement('img');
      img.className = 'titlePlate';
      img.src = doc.title;
      img.alt = 'Zapis Uczestnictwa';
      titleText.replaceWith(img);
    }
    const content = document.querySelector('.qr-participation .doc-content');
    const sigBlock = document.querySelector('.qr-participation .signatureBlock');
    if (sigBlock && !document.querySelector('.anniversarySealPreview')) {
      const seal = document.createElement('img');
      seal.className = 'anniversarySealPreview';
      seal.src = doc.anniversarySeal;
      seal.alt = '';
      sigBlock.before(seal);
      const wide = document.createElement('img');
      wide.className = 'bottomEventSealWidePreview';
      wide.src = doc.eventSeal;
      wide.alt = '';
      content?.appendChild(wide);
      const raport = document.createElement('img');
      raport.className = 'eventSealMirrorPreview';
      raport.src = doc.raportSeal;
      raport.alt = '';
      content?.appendChild(raport);
      const vh = document.createElement('img');
      vh.className = 'veritasSealPreview';
      vh.src = doc.veritasSeal;
      vh.alt = '';
      content?.appendChild(vh);
    }
  }

  function modal() {
    const m = document.querySelector('[data-qr-modal]');
    if (!m) return;
    m.querySelector('[data-qr-modal-title]').textContent = 'Dokument został przygotowany';
    m.querySelector('[data-qr-modal-text]').textContent = 'Pobrano finalny, ścienny Zapis Uczestnictwa w wersji premium.';
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
      button.textContent = 'Przygotowuję wersję premium...';
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