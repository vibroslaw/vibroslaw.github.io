(() => {
  const root = document.querySelector('[data-participation-record], [data-witness-report]');
  if (!root) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const isWitness = root.matches('[data-witness-report]');
  const master = window.VH_DOCUMENTS?.printMaster || {};

  const TEXT = {
    pl: {
      eyebrow: 'PRINT QUALITY',
      titleParticipation: 'Rekomendacja wydruku premium',
      titleWitness: 'Rekomendacja wydruku archiwalnego',
      wallReady: 'wall-ready',
      printReady: 'print-ready',
      draft: 'draft-safe',
      variant: 'Wariant',
      format: 'Format',
      paper: 'Papier',
      frame: 'Oprawa',
      device: 'Urządzenie',
      privacy: 'Prywatność',
      desktop: 'Najlepszy eksport wykonaj na laptopie lub komputerze. Mobile jest dobre do odblokowania dostępu i zapisania linku.',
      privacyText: 'Dane pozostają lokalnie w przeglądarce. PDF powstaje po stronie użytkownika.',
      copyLink: 'Kopiuj link do generatora',
      shareLink: 'Udostępnij link',
      copied: 'Link skopiowany.',
      fallbackCopy: 'Skopiuj adres z paska przeglądarki.',
      participationPaper: 'A4/A3 · kolor · papier matowy lub silk matte 250–300 gsm.',
      witnessPaper: 'A4 pionowo · papier matowy 160–250 gsm · spokojny druk archiwalny.',
      participationFrame: 'Najlepiej: czarna rama lub ciepłe passe-partout. Wariant Rama Uroczysta najlepiej nadaje się na ścianę.',
      witnessFrame: 'Najlepiej: teczka archiwalna, biurko albo prosta ramka. To dokument refleksji, nie certyfikat.',
      cinema: 'Archiwalne Kino — filmowy zapis uczestnictwa.',
      museum: 'Linia Muzealna — formalny, instytucjonalny charakter.',
      ceremonial: 'Rama Uroczysta — najlepszy wariant do oprawienia.',
      witnessVariant: 'Archiwalny papier — osobisty zapis refleksji.',
      a3: 'A3 Wall Edition dla najlepszego efektu na ścianie; A4 jako bezpieczny standard.',
      a4: 'A4 portrait jako spokojny dokument osobisty.'
    },
    en: {
      eyebrow: 'PRINT QUALITY',
      titleParticipation: 'Premium print recommendation',
      titleWitness: 'Archival print recommendation',
      wallReady: 'wall-ready',
      printReady: 'print-ready',
      draft: 'draft-safe',
      variant: 'Variant',
      format: 'Format',
      paper: 'Paper',
      frame: 'Framing',
      device: 'Device',
      privacy: 'Privacy',
      desktop: 'For the best export, use a laptop or desktop. Mobile is best for unlocking access and saving the link.',
      privacyText: 'Your data remains local in the browser. The PDF is created on the user side.',
      copyLink: 'Copy generator link',
      shareLink: 'Share link',
      copied: 'Link copied.',
      fallbackCopy: 'Copy the address from the browser bar.',
      participationPaper: 'A4/A3 · colour · matte or silk matte paper 250–300 gsm.',
      witnessPaper: 'A4 portrait · matte paper 160–250 gsm · calm archival print.',
      participationFrame: 'Best result: black frame or warm passe-partout. Ceremonial Frame is the strongest wall option.',
      witnessFrame: 'Best kept in an archival folder, on a desk, or in a simple frame. This is a reflection document, not a certificate.',
      cinema: 'Archival Cinema — cinematic participation record.',
      museum: 'Museum Line — formal, institutional character.',
      ceremonial: 'Ceremonial Frame — best variant for framing.',
      witnessVariant: 'Archival paper — personal reflection record.',
      a3: 'A3 Wall Edition for the strongest wall effect; A4 as the safe standard.',
      a4: 'A4 portrait as a calm personal document.'
    }
  }[lang];

  const panel = document.createElement('aside');
  panel.className = 'dq-panel';
  panel.setAttribute('aria-live', 'polite');

  function selectedVariant() {
    if (isWitness) return 'witness';
    return root.querySelector('[name="recordVariant"]:checked')?.value || 'cinema';
  }

  function grade() {
    if (isWitness) return { className: 'dq-grade', label: TEXT.printReady };
    return selectedVariant() === 'ceremonial'
      ? { className: 'dq-grade', label: TEXT.wallReady }
      : { className: 'dq-grade dq-warn', label: TEXT.printReady };
  }

  function variantText() {
    const key = selectedVariant();
    return TEXT[key] || TEXT.witnessVariant;
  }

  function formatText() {
    return isWitness ? TEXT.a4 : TEXT.a3;
  }

  function render() {
    const g = grade();
    panel.innerHTML = `
      <div class="dq-head">
        <div>
          <p class="dq-eyebrow">${TEXT.eyebrow}</p>
          <h3 class="dq-title">${isWitness ? TEXT.titleWitness : TEXT.titleParticipation}</h3>
        </div>
        <span class="${g.className}">${g.label}</span>
      </div>
      <div class="dq-grid">
        <div class="dq-item"><span>${TEXT.variant}</span><p>${variantText()}</p></div>
        <div class="dq-item"><span>${TEXT.format}</span><p>${formatText()}</p></div>
        <div class="dq-item"><span>${TEXT.paper}</span><p>${isWitness ? TEXT.witnessPaper : TEXT.participationPaper}</p></div>
        <div class="dq-item"><span>${TEXT.frame}</span><p>${isWitness ? TEXT.witnessFrame : TEXT.participationFrame}</p></div>
        <div class="dq-item"><span>${TEXT.device}</span><p>${TEXT.desktop}</p></div>
        <div class="dq-item"><span>${TEXT.privacy}</span><p>${TEXT.privacyText}</p></div>
      </div>
      <div class="dq-actions">
        <button class="dq-copy" type="button" data-dq-copy>${TEXT.copyLink}</button>
        <button class="dq-copy" type="button" data-dq-share>${TEXT.shareLink}</button>
      </div>
      <p class="dq-note">Veritas Humanum · ${master.version || 'print master'} · local browser PDF</p>
    `;
  }

  function target() {
    if (isWitness) return root.querySelector('.wr-print-recommendation') || root.querySelector('.wr-actions');
    return root.querySelector('.pr-print-recommendation') || root.querySelector('.pr-form-actions');
  }

  function urlWithEvent() {
    const url = new URL(window.location.href);
    const eventSelect = root.querySelector('[name="eventPreset"]');
    const event = eventSelect?.value || url.searchParams.get('event');
    if (event && event !== 'custom') url.searchParams.set('event', event);
    return url.href;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(urlWithEvent());
      const note = panel.querySelector('.dq-note');
      if (note) note.textContent = TEXT.copied;
    } catch (_) {
      const note = panel.querySelector('.dq-note');
      if (note) note.textContent = TEXT.fallbackCopy;
    }
  }

  async function shareLink() {
    const href = urlWithEvent();
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url: href }); return; } catch (_) {}
    }
    await copyLink();
  }

  const anchor = target();
  if (anchor) anchor.insertAdjacentElement('afterend', panel);
  render();

  root.addEventListener('change', (event) => {
    if (event.target?.matches('[name="recordVariant"], [name="eventPreset"]')) render();
  });
  panel.addEventListener('click', (event) => {
    if (event.target?.matches('[data-dq-copy]')) copyLink();
    if (event.target?.matches('[data-dq-share]')) shareLink();
  });
})();
