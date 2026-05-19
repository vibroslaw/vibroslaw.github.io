(() => {
  const params = new URLSearchParams(window.location.search);
  const rawEvent = String(params.get('event') || params.get('key') || '').toLowerCase();
  const eventKey = rawEvent === 'oswiecim' || rawEvent === 'mup' || rawEvent === 'vh-osw-2026-0525' ? 'oswiecim20260525' : rawEvent;

  const EVENTS = {
    oswiecim20260525: {
      lang: 'pl',
      code: 'OSW',
      access: 'VH-OSW-2026-0525',
      place: 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu',
      dateInput: '2026-05-25',
      dateLabel: '25 maja 2026',
      edition: 'Oświęcim / MUP · 25 maja 2026',
      bgParticipation: '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-bg.svg',
      bgWitness: '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/witness-report-bg.svg',
      titleParticipation: '/public/assets/events/rap-ort/oswiecim20260525/title-plates/title-zapis-uczestnictwa-anniversary-gold.svg',
      seal: '/public/assets/events/rap-ort/oswiecim20260525/accents/event-seal-gold.svg',
      accent: '/public/assets/events/rap-ort/oswiecim20260525/accents/event-accent-gold.svg',
      signature: '/public/assets/reports/author-signature-gold.svg',
      printGuide: '/public/assets/events/rap-ort/oswiecim20260525/downloads/instrukcja-druku-zapis-uczestnictwa.html',
      witnessBlank: '/public/assets/events/rap-ort/oswiecim20260525/downloads/raport-swiadka-podklad-druk.html',
      witnessQuote: 'Cisza po świadectwie nie jest pustką. Jest miejscem, w którym zaczyna pracować sumienie.'
    },
    syd2026: {
      lang: 'en',
      code: 'SYD',
      access: 'VH-SYD-2026',
      place: 'Polish Club Ashfield / Sydney',
      dateInput: '2026-06-21',
      dateLabel: '21 June 2026',
      edition: 'Sydney 2026 · International screening',
      bgParticipation: '/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg',
      bgWitness: '/public/assets/reports/witness-report-bg-01-archival-paper-a4.jpg',
      titleParticipation: '/public/assets/events/rap-ort/shared/title-plates/title-record-of-participation-gold.svg',
      seal: '/public/assets/events/rap-ort/shared/seals/international-screening-seal-gold.svg',
      accent: '/public/assets/events/rap-ort/shared/seals/vh-seal-gold.svg',
      signature: '/public/assets/reports/author-signature-gold.svg',
      printGuide: '/public/assets/events/rap-ort/syd2026/downloads/print-guide-participation-record.html',
      witnessBlank: '/public/assets/events/rap-ort/syd2026/downloads/witness-report-print-template.html',
      witnessQuote: 'The silence after testimony is not empty. It is the place where conscience begins to work.'
    }
  };

  const event = EVENTS[eventKey];
  if (!event) return;

  const rootParticipation = document.querySelector('[data-participation-record]');
  const rootWitness = document.querySelector('[data-witness-report]');
  const esc = (value) => String(value || '').replace(/[&<>\"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const abs = (path) => new URL(path, window.location.origin).href;
  const number = (kind) => {
    const key = `raport:${kind}:${eventKey}`;
    let seq = localStorage.getItem(key);
    if (!/^\d{4}$/.test(seq || '')) {
      seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      localStorage.setItem(key, seq);
    }
    const mmdd = event.dateInput.slice(5, 7) + event.dateInput.slice(8, 10);
    return `${kind === 'zu' ? 'VH-ZU' : 'VH-WR'}-${event.dateInput.slice(0, 4)}-${mmdd}-${event.code}-${seq}`;
  };

  function openPrintableWindow({ title, pageClass, html, orientation = 'landscape' }) {
    const w = window.open('', '_blank');
    if (!w) return false;
    w.document.open();
    w.document.write(`<!doctype html><html lang="${event.lang}"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
      @page{size:A4 ${orientation};margin:0}html,body{margin:0;padding:0;background:#050403;color:#ead8b4}body{font-family:Georgia,'Times New Roman',serif}.toolbar{position:fixed;z-index:20;top:12px;left:12px;right:12px;display:flex;justify-content:center;gap:10px;font:13px Arial,sans-serif}.toolbar button{border:1px solid rgba(231,211,174,.45);border-radius:999px;padding:10px 16px;background:#17120d;color:#ead8b4;cursor:pointer}.page{position:relative;overflow:hidden;background:#080705}.landscape{width:297mm;height:210mm}.portrait{width:210mm;height:297mm}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.zu-content{position:absolute;inset:20mm 30mm;display:flex;flex-direction:column;align-items:center;text-align:center}.seal{width:28mm;height:28mm;object-fit:contain;margin-bottom:4mm}.title-plate{width:160mm;max-height:28mm;object-fit:contain;margin:2mm auto 6mm}.project{font:12px Arial,sans-serif;letter-spacing:.38em;text-transform:uppercase;color:rgba(231,211,174,.82);margin:0 0 5mm}.zu-body{max-width:220mm;font-size:16px;line-height:1.52;color:rgba(244,232,205,.9);margin:0 auto 6mm}.for{font-size:16px;letter-spacing:.08em;margin:1mm 0 6mm;color:#f3dfb7}.fields{display:grid;grid-template-columns:repeat(3,1fr);gap:12mm;width:220mm;margin:7mm auto}.field{border-top:1px solid rgba(232,206,150,.42);padding-top:3mm}.field span{display:block;font:10px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(232,206,150,.62);margin-bottom:2mm}.field strong{font-size:14px;font-weight:400;color:#f2e4c7;overflow-wrap:anywhere}.closing{margin-top:auto;max-width:205mm;font-size:13px;line-height:1.5;color:rgba(244,232,205,.78)}.author{margin-top:4mm;display:flex;flex-direction:column;align-items:center}.author img{width:60mm;max-height:18mm;object-fit:contain}.author span{font:10px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(232,206,150,.66)}.micro{font:8px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(232,206,150,.46);margin-top:2mm}.wr-content{position:absolute;inset:24mm 22mm;display:flex;flex-direction:column;text-align:center;align-items:center;color:#2a1d11}.wr-project{font:10px Arial,sans-serif;letter-spacing:.30em;text-transform:uppercase;color:rgba(66,46,22,.68);margin:0 0 9mm}.wr-title{font-size:42px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 12mm}.wr-quote{font-style:italic;font-size:19px;line-height:1.55;max-width:155mm;color:#2b2015;margin:0 0 11mm}.wr-reflection{width:160mm;min-height:58mm;border-top:1px solid rgba(66,46,22,.22);border-bottom:1px solid rgba(66,46,22,.18);padding:10mm 0;margin:0 auto 12mm;font:16px 'Courier New',monospace;line-height:1.55;color:#24180d}.wr-meta{display:grid;grid-template-columns:1fr 1fr;gap:10mm;width:160mm;margin-top:auto}.wr-sign{width:120mm;border-top:1px solid rgba(66,46,22,.32);padding-top:3mm;margin-top:13mm;font:10px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(66,46,22,.55)}@media print{.toolbar{display:none!important}}
    </style></head><body><div class="toolbar"><button onclick="window.print()">Drukuj / zapisz jako PDF</button></div>${html}</body></html>`);
    w.document.close();
    w.focus();
    return true;
  }

  function bootParticipation() {
    if (!rootParticipation) return;
    rootParticipation.classList.add('pr-event-specific', `pr-event-${eventKey}`);
    const q = (s) => rootParticipation.querySelector(s);
    const all = (s) => [...rootParticipation.querySelectorAll(s)];
    const set = (name, value) => { const node = q(`[name="${name}"]`); if (node) node.value = value; };
    q('[data-pr-gate]')?.setAttribute('hidden', '');
    if (q('[data-pr-generator]')) q('[data-pr-generator]').hidden = false;
    set('eventPreset', eventKey); set('place', event.place); set('eventDate', event.dateInput); set('documentNumber', number('zu'));
    ['eventPreset','place','eventDate','documentNumber'].forEach((name) => q(`[name="${name}"]`)?.closest('label')?.setAttribute('hidden',''));
    all('.pr-variant-grid,.pr-mode-grid,.pr-steps').forEach((n) => { n.hidden = true; });
    const badge = q('[data-pr-event-badge]');
    if (badge) { badge.hidden = false; badge.innerHTML = `<strong>${esc(event.place)}</strong><span>${esc(event.dateLabel)}</span><span>${esc(event.edition)}</span>`; }
    const previewBg = q('[data-pr-preview-bg]'); if (previewBg) previewBg.style.backgroundImage = `url('${abs(event.bgParticipation)}')`;
    const printBg = document.querySelector('[data-pr-print-bg]'); if (printBg) printBg.src = abs(event.bgParticipation);
    const guideButton = document.createElement('a'); guideButton.className = 'vh-button secondary'; guideButton.href = event.printGuide; guideButton.textContent = 'Jak drukować / preferencje'; guideButton.target = '_blank';
    q('[data-pr-print]')?.insertAdjacentElement('afterend', guideButton);
    all('[data-pr-status]').forEach((n) => { n.textContent = 'Wersja wydarzenia została ustawiona z linku QR. Uzupełnij tylko imię i nazwisko — opcjonalnie.'; });
    const render = () => {
      const name = q('[name="participantName"]')?.value.trim() || '';
      set('documentNumber', number('zu'));
      all('[data-pr-project]').forEach((n) => { n.textContent = `RAP-ORT: PRAWDA SUMIENIA · ${event.edition}`; });
      all('[data-pr-title]').forEach((n) => { n.textContent = 'ZAPIS UCZESTNICTWA'; });
      all('[data-pr-date]').forEach((n) => { n.textContent = event.dateLabel; });
      all('[data-pr-place]').forEach((n) => { n.textContent = event.place; });
      all('[data-pr-number]').forEach((n) => { n.textContent = number('zu'); });
      all('[data-pr-for]').forEach((n) => { n.hidden = !name; n.innerHTML = name ? `Dla: <strong>${esc(name)}</strong>` : ''; });
    };
    render(); rootParticipation.addEventListener('input', render, true);
    rootParticipation.addEventListener('click', (ev) => {
      if (!ev.target.closest('[data-pr-print]')) return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      const name = q('[name="participantName"]')?.value.trim();
      const html = `<main class="page landscape"><img class="bg" src="${abs(event.bgParticipation)}" alt=""><section class="zu-content"><img class="seal" src="${abs(event.seal)}" alt=""><p class="project">RAP-ORT: PRAWDA SUMIENIA · ${esc(event.edition)}</p><img class="title-plate" src="${abs(event.titleParticipation)}" alt="Zapis Uczestnictwa"><p class="zu-body">Niniejszy dokument upamiętnia udział w projekcji audiowizualnej „Rap-Ort: Prawda Sumienia” oraz rozmowie refleksyjnej poświęconej świadectwu, pamięci i odpowiedzialności człowieka wobec prawdy.</p>${name ? `<p class="for">Dla: <strong>${esc(name)}</strong></p>` : ''}<div class="fields"><div class="field"><span>Data wydarzenia</span><strong>${esc(event.dateLabel)}</strong></div><div class="field"><span>Miejsce</span><strong>${esc(event.place)}</strong></div><div class="field"><span>Numer dokumentu</span><strong>${esc(number('zu'))}</strong></div></div><p class="closing">To nie jest dyplom ani dokument urzędowy. To pamiątkowy ślad chwili, w której historia staje się pytaniem, które uczestnik zabiera ze sobą.</p><div class="author"><img src="${abs(event.signature)}" alt=""><span>Piotr Jakub Lichwała · autor projektu</span></div><p class="micro">Pamiątkowy zapis uczestnictwa · nie oznacza patronatu instytucji · dokument wygenerowany lokalnie w przeglądarce uczestnika.</p></section></main>`;
      openPrintableWindow({ title: 'Zapis Uczestnictwa — Rap-Ort', html, orientation: 'landscape' });
    }, true);
  }

  function bootWitness() {
    if (!rootWitness) return;
    const q = (s) => rootWitness.querySelector(s);
    const set = (name, value) => { const node = q(`[name="${name}"]`); if (node) node.value = value; };
    set('eventPreset', eventKey); set('place', event.place); set('eventDate', event.dateInput);
    ['eventPreset','place','eventDate'].forEach((name) => q(`[name="${name}"]`)?.closest('label')?.setAttribute('hidden',''));
    const archiveBtn = q('[data-wr-archive]'); if (archiveBtn) archiveBtn.textContent = 'Pobierz anonimowy Raport Świadka PDF';
    const personalBtn = q('[data-wr-download]'); if (personalBtn) personalBtn.textContent = 'Pobierz osobisty Raport Świadka PDF';
    if (!q('[data-wr-print-blank]')) { const a = document.createElement('a'); a.className = 'vh-button secondary'; a.href = event.witnessBlank; a.target = '_blank'; a.setAttribute('data-wr-print-blank',''); a.textContent = 'Wersja fizyczna do druku'; q('.wr-actions')?.appendChild(a); }
    rootWitness.addEventListener('click', (ev) => {
      const personal = ev.target.closest('[data-wr-download]');
      const anonymous = ev.target.closest('[data-wr-archive]');
      if (!personal && !anonymous) return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      const name = q('[name="participantName"]')?.value.trim();
      const reflectionRaw = q('[name="reflection"]')?.value.trim();
      const reflection = reflectionRaw || event.witnessQuote;
      const isAnon = !!anonymous;
      const title = isAnon ? 'ANONIMOWY RAPORT ŚWIADKA' : 'RAPORT ŚWIADKA';
      const html = `<main class="page portrait"><img class="bg" src="${abs(event.bgWitness)}" alt=""><section class="wr-content"><p class="wr-project">RAP-ORT: PRAWDA SUMIENIA · ${esc(event.edition)}</p><h1 class="wr-title">${title}</h1><p class="wr-quote">„Nie jesteś świadkiem wydarzeń historycznych. Jesteś świadkiem spotkania ze świadectwem.”</p><div class="wr-reflection">${esc(reflection)}</div><div class="wr-meta"><div class="field"><span>Data</span><strong>${esc(event.dateLabel)}</strong></div><div class="field"><span>Miejsce</span><strong>${esc(event.place)}</strong></div><div class="field"><span>${isAnon ? 'Numer archiwalny' : 'Numer raportu'}</span><strong>${esc(number('wr'))}</strong></div><div class="field"><span>${isAnon ? 'Status' : 'Uczestnik'}</span><strong>${isAnon ? 'Wersja anonimowa' : esc(name || 'Świadek doświadczenia')}</strong></div></div>${isAnon ? '' : '<div class="wr-sign">Podpis świadka doświadczenia</div>'}<p class="micro">${isAnon ? 'Wersja anonimowa · bez imienia, nazwiska i podpisu · do dobrowolnego przekazania uczelni.' : 'Osobisty dokument refleksji · generowany lokalnie · nie jest testem ani dokumentem urzędowym.'}</p></section></main>`;
      openPrintableWindow({ title: `${title} — Rap-Ort`, html, orientation: 'portrait' });
    }, true);
  }

  bootParticipation();
  bootWitness();
})();
