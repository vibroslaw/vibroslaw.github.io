(() => {
  const root = document.querySelector('[data-participation-record], [data-witness-report]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const isWitness = root.matches('[data-witness-report]');
  const master = window.VH_DOCUMENTS?.printMaster || {};

  const TEXT = {
    pl: {
      eyebrow: 'PRINT MASTER', titleParticipation: 'Panel jakości dokumentu', titleWitness: 'Panel jakości Raportu',
      wallReady: 'wall-ready', printReady: 'print-ready', vector: 'vector-ready', draft: 'draft-safe',
      variant: 'Wariant', format: 'Format', paper: 'Papier', frame: 'Oprawa', device: 'Urządzenie', privacy: 'Prywatność', event: 'Wydarzenie', handoff: 'Notatka do wydruku', engine: 'Silnik PDF',
      desktop: 'Najlepszy eksport wykonaj na laptopie lub komputerze. Telefon jest idealny do skanu QR, zapisania linku i powrotu do dokumentu później.',
      privacyText: 'Dane pozostają lokalnie w przeglądarce. PDF powstaje po stronie użytkownika i nie jest wysyłany na serwer.',
      copyLink: 'Kopiuj link', shareLink: 'Udostępnij', copyHandoff: 'Kopiuj notatkę do druku', downloadHandoff: 'Pobierz notatkę .txt',
      copied: 'Link skopiowany.', handoffCopied: 'Notatka do druku skopiowana.', handoffDownloaded: 'Notatka do druku została pobrana.', fallbackCopy: 'Skopiuj adres z paska przeglądarki.',
      participationPaper: 'A4/A3 · kolor · papier matowy lub silk matte 250–300 gsm.', witnessPaper: 'A4 pionowo · papier matowy 160–250 gsm · spokojny druk archiwalny.',
      participationFrame: 'Najlepiej: czarna rama albo ciepłe passe-partout. Wariant Rama Uroczysta najlepiej nadaje się na ścianę.', witnessFrame: 'Najlepiej: teczka archiwalna, biurko albo prosta ramka. To dokument refleksji, nie certyfikat.',
      cinema: 'Archiwalne Kino — filmowy zapis uczestnictwa.', museum: 'Linia Muzealna — formalny, instytucjonalny charakter.', ceremonial: 'Rama Uroczysta — najlepszy wariant do oprawienia.', witnessVariant: 'Archiwalny papier — osobisty zapis refleksji.',
      a3: 'A3 Wall Edition dla najlepszego efektu na ścianie; A4 jako bezpieczny standard.', a4: 'A4 portrait jako spokojny dokument osobisty.',
      customEvent: 'Wydarzenie wpisywane ręcznie', noNumber: 'Numer zostanie nadany w generatorze', notOfficial: 'Pamiątkowy dokument nieurzędowy. Nie sugeruje patronatu ani oficjalnej certyfikacji.',
      printShopLine: 'Druk bez dopasowania do marginesów, najlepiej w rzeczywistym rozmiarze strony PDF. Kolor: wysoka jakość.',
      engineText: 'PR54 Hybrid Vector Print Master: tło jako obraz, tekst jako warstwa PDF, fonty lokalne gdy dostępne.'
    },
    en: {
      eyebrow: 'PRINT MASTER', titleParticipation: 'Document quality panel', titleWitness: 'Report quality panel',
      wallReady: 'wall-ready', printReady: 'print-ready', vector: 'vector-ready', draft: 'draft-safe',
      variant: 'Variant', format: 'Format', paper: 'Paper', frame: 'Framing', device: 'Device', privacy: 'Privacy', event: 'Event', handoff: 'Print handoff note', engine: 'PDF engine',
      desktop: 'For the best export, use a laptop or desktop. Mobile is ideal for QR access, saving the link and returning to the document later.',
      privacyText: 'Your data remains local in the browser. The PDF is created on the user side and is not sent to a server.',
      copyLink: 'Copy link', shareLink: 'Share', copyHandoff: 'Copy print note', downloadHandoff: 'Download note .txt',
      copied: 'Link copied.', handoffCopied: 'Print note copied.', handoffDownloaded: 'Print note downloaded.', fallbackCopy: 'Copy the address from the browser bar.',
      participationPaper: 'A4/A3 · colour · matte or silk matte paper 250–300 gsm.', witnessPaper: 'A4 portrait · matte paper 160–250 gsm · calm archival print.',
      participationFrame: 'Best result: black frame or warm passe-partout. Ceremonial Frame is the strongest wall option.', witnessFrame: 'Best kept in an archival folder, on a desk, or in a simple frame. This is a reflection document, not a certificate.',
      cinema: 'Archival Cinema — cinematic participation record.', museum: 'Museum Line — formal, institutional character.', ceremonial: 'Ceremonial Frame — best variant for framing.', witnessVariant: 'Archival paper — personal reflection record.',
      a3: 'A3 Wall Edition for the strongest wall effect; A4 as the safe standard.', a4: 'A4 portrait as a calm personal document.',
      customEvent: 'Manually entered event', noNumber: 'Number will be assigned in the generator', notOfficial: 'Non-official commemorative document. It does not imply patronage or official certification.',
      printShopLine: 'Print without fitting to extra margins, preferably at the real PDF page size. Colour: high quality.',
      engineText: 'PR54 Hybrid Vector Print Master: raster background, PDF text layer, local fonts when available.'
    }
  }[lang];

  const panel = document.createElement('aside');
  panel.className = 'dq-panel';
  panel.setAttribute('aria-live', 'polite');

  function selectedVariant() { if (isWitness) return 'witness'; return root.querySelector('[name="recordVariant"]:checked')?.value || 'cinema'; }
  function selectedEventValue() { return root.querySelector('[name="eventPreset"]')?.value || 'custom'; }
  function eventField(name) { return root.querySelector(`[name="${name}"]`)?.value?.trim() || ''; }
  function selectedEventText() {
    const select = root.querySelector('[name="eventPreset"]');
    const value = selectedEventValue();
    if (!select || value === 'custom') {
      const place = eventField('place'); const date = eventField('eventDate');
      return [place || TEXT.customEvent, date].filter(Boolean).join(' · ');
    }
    return select.options[select.selectedIndex]?.textContent?.trim() || value;
  }
  function documentNumber() {
    const selectors = ['[name="documentNumber"]', '[data-pr-number]', '[data-wr-number]'];
    for (const selector of selectors) { const node = root.querySelector(selector); const value = node?.value || node?.textContent; if (value && value.trim()) return value.trim(); }
    return TEXT.noNumber;
  }
  function grade() { if (isWitness) return { className: 'dq-grade', label: TEXT.printReady }; return selectedVariant() === 'ceremonial' ? { className: 'dq-grade', label: TEXT.wallReady } : { className: 'dq-grade dq-warn', label: TEXT.printReady }; }
  function variantText() { return TEXT[selectedVariant()] || TEXT.witnessVariant; }
  function formatText() { return isWitness ? TEXT.a4 : TEXT.a3; }
  function paperText() { return isWitness ? TEXT.witnessPaper : TEXT.participationPaper; }
  function frameText() { return isWitness ? TEXT.witnessFrame : TEXT.participationFrame; }

  function render() {
    const g = grade();
    panel.innerHTML = `<div class="dq-head"><div><p class="dq-eyebrow">${TEXT.eyebrow}</p><h3 class="dq-title">${isWitness ? TEXT.titleWitness : TEXT.titleParticipation}</h3></div><span class="${g.className}">${g.label}</span></div><div class="dq-grid"><div class="dq-item"><span>${TEXT.variant}</span><p>${variantText()}</p></div><div class="dq-item"><span>${TEXT.format}</span><p>${formatText()}</p></div><div class="dq-item"><span>${TEXT.paper}</span><p>${paperText()}</p></div><div class="dq-item"><span>${TEXT.frame}</span><p>${frameText()}</p></div><div class="dq-item"><span>${TEXT.event}</span><p>${selectedEventText()}</p></div><div class="dq-item"><span>${TEXT.device}</span><p>${TEXT.desktop}</p></div><div class="dq-item"><span>${TEXT.privacy}</span><p>${TEXT.privacyText}</p></div><div class="dq-item"><span>${TEXT.handoff}</span><p>${TEXT.printShopLine}</p></div><div class="dq-item dq-print-master"><span>${TEXT.engine}</span><p>${TEXT.engineText}</p></div></div><div class="dq-actions"><button class="dq-copy" type="button" data-dq-copy>${TEXT.copyLink}</button><button class="dq-copy" type="button" data-dq-share>${TEXT.shareLink}</button><button class="dq-copy" type="button" data-dq-copy-handoff>${TEXT.copyHandoff}</button><button class="dq-copy" type="button" data-dq-download-handoff>${TEXT.downloadHandoff}</button></div><p class="dq-note">Veritas Humanum · ${master.version || 'print master'} · local browser PDF</p>`;
  }

  function target() { return isWitness ? (root.querySelector('.wr-print-recommendation') || root.querySelector('.wr-actions')) : (root.querySelector('.pr-print-recommendation') || root.querySelector('.pr-form-actions')); }
  function urlWithEvent() { const url = new URL(window.location.href); const event = selectedEventValue(); if (event && event !== 'custom') { url.searchParams.set('event', event); url.searchParams.delete('key'); } else { url.searchParams.delete('event'); url.searchParams.delete('key'); } return url.href; }
  function handoffText() {
    const title = isWitness ? (lang === 'pl' ? 'RAPORT ŚWIADKA' : 'WITNESS REPORT') : (lang === 'pl' ? 'ZAPIS UCZESTNICTWA' : 'RECORD OF PARTICIPATION');
    return ['VERITAS HUMANUM / RAP-ORT: PRAWDA SUMIENIA', title, '', `${TEXT.event}: ${selectedEventText()}`, `${TEXT.variant}: ${variantText()}`, `${TEXT.format}: ${formatText()}`, `${TEXT.paper}: ${paperText()}`, `${TEXT.frame}: ${frameText()}`, `${lang === 'pl' ? 'Numer dokumentu' : 'Document number'}: ${documentNumber()}`, '', TEXT.printShopLine, TEXT.notOfficial, TEXT.privacyText, '', `${lang === 'pl' ? 'Link do generatora' : 'Generator link'}: ${urlWithEvent()}`].join('\n');
  }
  function setNote(message) { const note = panel.querySelector('.dq-note'); if (note) note.textContent = message; }
  async function copyText(text, success) { try { await navigator.clipboard.writeText(text); setNote(success); } catch (_) { setNote(TEXT.fallbackCopy); } }
  function downloadHandoff() { const blob = new Blob([handoffText()], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); const prefix = isWitness ? 'Witness-Report-Print-Note' : 'Participation-Record-Print-Note'; a.href = url; a.download = `${prefix}-${documentNumber().replace(/[^a-zA-Z0-9-]+/g, '-')}.txt`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); setNote(TEXT.handoffDownloaded); }
  async function shareLink() { const href = urlWithEvent(); if (navigator.share) { try { await navigator.share({ title: document.title, text: isWitness ? TEXT.titleWitness : TEXT.titleParticipation, url: href }); return; } catch (_) {} } await copyText(href, TEXT.copied); }

  const anchor = target(); if (anchor) anchor.insertAdjacentElement('afterend', panel); render();
  root.addEventListener('change', (event) => { if (event.target?.matches('[name="recordVariant"], [name="eventPreset"]')) render(); });
  root.addEventListener('input', (event) => { if (event.target?.matches('[name="documentNumber"], [name="place"], [name="eventDate"]')) render(); });
  panel.addEventListener('click', (event) => { if (event.target?.matches('[data-dq-copy]')) copyText(urlWithEvent(), TEXT.copied); if (event.target?.matches('[data-dq-share]')) shareLink(); if (event.target?.matches('[data-dq-copy-handoff]')) copyText(handoffText(), TEXT.handoffCopied); if (event.target?.matches('[data-dq-download-handoff]')) downloadHandoff(); });
})();
