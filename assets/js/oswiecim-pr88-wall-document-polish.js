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
    project: { x: 1754, y: 314 },
    eventSeal: { x: 1754, y: 455, w: 176, h: 176 },
    title: { x: 1754, y: 630, w: 2280, h: 430 },
    eventLine: { x: 1754, y: 840 },
    intro: { x: 1754, y: 980, w: 2520 },
    body: { x: 1754, y: 1138, w: 2580 },
    participantName: { x: 1754, y: 1328, w: 2100 },
    metaRuleY: 1498,
    metaLabelY: 1410,
    metaValueY: 1464,
    anniversarySeal: { x: 1754, y: 1840, w: 425, h: 425 },
    veritasSeal: { x: 2760, y: 1865, w: 250, h: 250 },
    signature: { x: 1754, y: 2098, w: 580, h: 136 },
    author: { x: 1754, y: 2230 },
    micro: { x: 1754, y: 2305, w: 2500 }
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

  function drawImageCover(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function drawImageContain(ctx, img, cx, cy, maxW, maxH) {
    const scale = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  }

  function font(ctx, size, family = 'Georgia, Times New Roman, serif', weight = 400, style = 'normal') {
    ctx.font = `${style} ${weight} ${size}px ${family}`;
  }

  function drawLine(ctx, text, x, y, opts = {}) {
    font(ctx, opts.size || 28, opts.family || 'Arial, sans-serif', opts.weight || 700, opts.style || 'normal');
    ctx.fillStyle = opts.fill || '#f5e7c8';
    ctx.textAlign = opts.align || 'center';
    ctx.textBaseline = 'alphabetic';
    if (opts.shadow) {
      ctx.save();
      ctx.shadowColor = opts.shadowColor || 'rgba(0,0,0,0.48)';
      ctx.shadowBlur = opts.shadowBlur || 22;
      ctx.fillText(text, x, y);
      ctx.restore();
    } else {
      ctx.fillText(text, x, y);
    }
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

  function drawWrapped(ctx, text, x, y, maxW, size, lineHeight, maxLines, opts = {}) {
    font(ctx, size, opts.family || 'Georgia, Times New Roman, serif', opts.weight || 400, opts.style || 'normal');
    ctx.fillStyle = opts.fill || '#f5e7c8';
    ctx.textAlign = opts.align || 'center';
    ctx.textBaseline = 'alphabetic';
    wrap(ctx, text, maxW).slice(0, maxLines).forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  }

  function fitText(ctx, text, maxWidth, start, min, family, weight = 400) {
    let size = start;
    while (size >= min) {
      font(ctx, size, family, weight);
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    }
    return min;
  }

  function drawMeta(ctx, label, value, x, width, valueSize = 31) {
    ctx.strokeStyle = 'rgba(232,208,154,0.44)';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, layout.metaRuleY);
    ctx.lineTo(x + width / 2, layout.metaRuleY);
    ctx.stroke();
    drawLine(ctx, label, x, layout.metaLabelY, {
      size: 23,
      family: 'Arial, sans-serif',
      weight: 700,
      fill: 'rgba(232,208,154,0.66)'
    });
    drawWrapped(ctx, value, x, layout.metaValueY, width - 24, valueSize, 37, 2, {
      fill: '#f7e9c7',
      family: 'Georgia, Times New Roman, serif'
    });
  }

  function drawCalibration(ctx) {
    if (!calibrationPdf) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,0,0,0.22)';
    ctx.fillStyle = 'rgba(255,0,0,0.75)';
    ctx.lineWidth = 2;
    ctx.font = '700 20px Arial, sans-serif';
    for (let x = 0; x <= doc.w; x += 100) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, doc.h); ctx.stroke();
      if (x % 500 === 0) ctx.fillText(String(x), x + 8, 28);
    }
    for (let y = 0; y <= doc.h; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(doc.w, y); ctx.stroke();
      if (y % 500 === 0) ctx.fillText(String(y), 8, y - 8);
    }
    ctx.fillStyle = 'rgba(0,90,255,0.92)';
    [layout.project, layout.eventSeal, layout.title, layout.eventLine, layout.intro, layout.body, layout.anniversarySeal, layout.veritasSeal, layout.signature].forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  function jpegBytesFromCanvas(canvas, quality = 0.94) {
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

  function makeImagePdf(canvas, page, quality = 0.94) {
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
    return String(value || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'uczestnik';
  }

  async function drawWallDocument() {
    const canvas = document.createElement('canvas');
    canvas.width = doc.w;
    canvas.height = doc.h;
    const ctx = canvas.getContext('2d');
    const [bg, title, eventSeal, anniversarySeal, veritasSeal, signature] = await Promise.all([
      loadImage(doc.bg),
      optionalImage(doc.title),
      optionalImage(doc.eventSeal),
      optionalImage(doc.anniversarySeal),
      optionalImage(doc.veritasSeal),
      optionalImage(doc.signature)
    ]);

    drawImageCover(ctx, bg, 0, 0, doc.w, doc.h);
    const glow = ctx.createRadialGradient(1754, 1180, 120, 1754, 1180, 1420);
    glow.addColorStop(0, 'rgba(255,232,174,0.055)');
    glow.addColorStop(1, 'rgba(0,0,0,0.075)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, doc.w, doc.h);

    const name = document.getElementById('name')?.value.trim() || '';
    let seq = localStorage.getItem('vh-zu-osw-seq');
    if (!/^\d{4}$/.test(seq || '')) {
      seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      localStorage.setItem('vh-zu-osw-seq', seq);
    }
    const docNo = `VH-ZU-2026-0525-OSW-${seq}`;

    drawLine(ctx, 'RAP-ORT: PRAWDA SUMIENIA', layout.project.x, layout.project.y, {
      size: 38,
      fill: 'rgba(245,225,175,0.84)',
      weight: 700,
      shadow: true,
      shadowBlur: 10
    });
    if (eventSeal) drawImageContain(ctx, eventSeal, layout.eventSeal.x, layout.eventSeal.y, layout.eventSeal.w, layout.eventSeal.h);
    if (title) {
      drawImageContain(ctx, title, layout.title.x, layout.title.y, layout.title.w, layout.title.h);
    } else {
      drawLine(ctx, 'ZAPIS UCZESTNICTWA', layout.title.x, layout.title.y + 46, {
        size: 170,
        family: 'Georgia, Times New Roman, serif',
        weight: 400,
        fill: '#f4dfad',
        shadow: true,
        shadowBlur: 30
      });
    }

    drawLine(ctx, 'OŚWIĘCIM · 25 MAJA 2026 · 78. ROCZNICA ŚMIERCI RTM. WITOLDA PILECKIEGO', layout.eventLine.x, layout.eventLine.y, {
      size: 37,
      fill: 'rgba(242,219,169,0.82)',
      weight: 700
    });
    drawWrapped(ctx, 'Pamiątkowy zapis udziału w wydarzeniu poświęconym świadectwu, pamięci i odpowiedzialności — w Uczelni noszącej imię Rotmistrza.', layout.intro.x, layout.intro.y, layout.intro.w, 45, 60, 2, {
      style: 'italic',
      fill: 'rgba(248,235,209,0.92)'
    });
    drawWrapped(ctx, 'Niniejszy dokument upamiętnia udział w projekcji audiowizualnej „Rap-Ort: Prawda Sumienia” oraz rozmowie refleksyjnej prowadzącej od świadectwa Witolda Pileckiego ku osobistemu pytaniu o prawdę, sumienie i odpowiedzialność człowieka.', layout.body.x, layout.body.y, layout.body.w, 40, 56, 4, {
      fill: 'rgba(248,235,209,0.91)'
    });

    if (name) {
      const text = `Dla: ${name}`;
      const size = fitText(ctx, text, layout.participantName.w, 64, 40, 'Georgia, Times New Roman, serif', 400);
      drawLine(ctx, text, layout.participantName.x, layout.participantName.y, {
        size,
        family: 'Georgia, Times New Roman, serif',
        weight: 400,
        fill: '#fff0bd',
        shadow: true,
        shadowBlur: 14
      });
    }

    drawMeta(ctx, 'DATA WYDARZENIA', '25 maja 2026', 780, 820, 32);
    drawMeta(ctx, 'MIEJSCE', 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu', 1754, 900, 28);
    drawMeta(ctx, 'NUMER DOKUMENTU', docNo, 2728, 820, 32);

    if (anniversarySeal) drawImageContain(ctx, anniversarySeal, layout.anniversarySeal.x, layout.anniversarySeal.y, layout.anniversarySeal.w, layout.anniversarySeal.h);
    if (veritasSeal) drawImageContain(ctx, veritasSeal, layout.veritasSeal.x, layout.veritasSeal.y, layout.veritasSeal.w, layout.veritasSeal.h);
    if (signature) drawImageContain(ctx, signature, layout.signature.x, layout.signature.y, layout.signature.w, layout.signature.h);
    drawLine(ctx, 'PIOTR JAKUB LICHWAŁA · AUTOR PROJEKTU', layout.author.x, layout.author.y, {
      size: 24,
      family: 'Arial, sans-serif',
      weight: 700,
      fill: 'rgba(232,208,154,0.66)'
    });
    drawWrapped(ctx, 'Pamiątkowy dokument od autora projektu · nie jest dyplomem ani dokumentem urzędowym · wygenerowany lokalnie w przeglądarce uczestnika.', layout.micro.x, layout.micro.y, layout.micro.w, 18, 29, 2, {
      family: 'Arial, sans-serif',
      weight: 700,
      fill: 'rgba(232,208,154,0.46)'
    });

    drawCalibration(ctx);
    return { canvas, name };
  }

  function injectFinalPreviewCss() {
    const style = document.createElement('style');
    style.textContent = `
      .qr-participation .doc-content{inset:0!important;display:block!important;text-align:center!important;font-family:Georgia,'Times New Roman',serif!important;}
      .qr-participation .topline{position:absolute;left:50%;top:12.7%;transform:translate(-50%,-50%);width:70%;font-size:clamp(.52rem,1.04vw,.9rem)!important;letter-spacing:.34em!important;margin:0!important;}
      .qr-participation .seal{position:absolute;left:50%;top:18.35%;transform:translate(-50%,-50%);width:5.05%!important;max-width:none!important;margin:0!important;}
      .qr-participation .titlePlate{position:absolute;left:50%;top:25.4%;transform:translate(-50%,-50%);width:64.8%!important;max-width:none!important;margin:0!important;filter:drop-shadow(0 18px 36px rgba(0,0,0,.46));}
      .qr-participation .subTitle{position:absolute;left:50%;top:33.85%;transform:translate(-50%,-50%);width:84%;font-size:clamp(.50rem,.96vw,.9rem)!important;margin:0!important;}
      .qr-participation .memorialLine{position:absolute;left:50%;top:39.05%;transform:translate(-50%,-50%);width:73%;max-width:none!important;font-size:clamp(.62rem,1.08vw,1.05rem)!important;margin:0!important;}
      .qr-participation .mainCopy{position:absolute;left:50%;top:46.1%;transform:translate(-50%,-50%);width:78%;max-width:none!important;font-size:clamp(.58rem,1.02vw,.96rem)!important;margin:0!important;}
      .qr-participation .for{position:absolute;left:50%;top:53.5%;transform:translate(-50%,-50%);width:70%;margin:0!important;font-size:clamp(.72rem,1.22vw,1.18rem)!important;}
      .qr-participation .fields{position:absolute!important;left:50%;top:58.7%;transform:translate(-50%,-50%);width:88%!important;margin:0!important;}
      .qr-participation .field{padding-top:0!important;padding-bottom:.45rem!important;border-top:0!important;border-bottom:1px solid rgba(232,208,154,.42)!important;}
      .qr-participation .field span{margin-bottom:.22rem!important;}
      .qr-participation .anniversarySealPreview{position:absolute;left:50%;top:74.2%;transform:translate(-50%,-50%);width:12.1%!important;max-width:none!important;margin:0!important;filter:drop-shadow(0 12px 28px rgba(0,0,0,.44));}
      .qr-participation .veritasSealPreview{position:absolute!important;left:78.7%;top:75.2%;transform:translate(-50%,-50%);right:auto!important;width:7.1%!important;max-width:none!important;opacity:.94!important;filter:drop-shadow(0 12px 24px rgba(0,0,0,.42));}
      .qr-participation .quote{display:none!important;}
      .qr-participation .signatureBlock{position:absolute!important;left:50%;top:85.0%;transform:translate(-50%,-50%);margin:0!important;width:34%;}
      .qr-participation .sig{width:80%!important;max-height:none!important;}
      .qr-participation .author{font-size:clamp(.34rem,.64vw,.58rem)!important;}
      .qr-participation .micro{position:absolute;left:50%;top:92.9%;transform:translate(-50%,-50%);width:74%;max-width:none!important;margin:0!important;}
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
      const vh = document.createElement('img');
      vh.className = 'veritasSealPreview';
      vh.src = doc.veritasSeal;
      vh.alt = '';
      sigBlock.before(seal);
      document.querySelector('.qr-participation .doc-content')?.appendChild(vh);
    }
  }

  function showReadyModal() {
    const modal = document.querySelector('[data-qr-modal]');
    if (!modal) return;
    modal.querySelector('[data-qr-modal-title]').textContent = 'Dokument został przygotowany';
    modal.querySelector('[data-qr-modal-text]').textContent = 'Pobrano finalny Zapis Uczestnictwa w wersji ściennej — bez widocznej siatki w podglądzie.';
    modal.querySelector('.qr-sealmark').textContent = '✓';
    modal.classList.add('is-open');
  }

  function bindDownload() {
    const old = document.getElementById('printBtn');
    if (!old) return;
    const button = old.cloneNode(true);
    old.replaceWith(button);
    button.addEventListener('click', async (ev) => {
      ev.preventDefault();
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      const original = button.textContent;
      button.textContent = 'Przygotowuję dokument ścienny...';
      try {
        const { canvas, name } = await drawWallDocument();
        downloadBlob(makeImagePdf(canvas, A4_L, 0.94), `Zapis-Uczestnictwa-Oswiecim-${escapeFile(name)}.pdf`);
        showReadyModal();
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
    injectFinalPreviewCss();
    window.setTimeout(tunePreview, 0);
    window.setTimeout(tunePreview, 120);
    window.setTimeout(tunePreview, 300);
    window.setTimeout(bindDownload, 0);
  });
})();
