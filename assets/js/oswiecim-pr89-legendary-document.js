(() => {
  const route = '/rap-ort/oswiecim/zapis-uczestnictwa/';
  if (window.location.pathname.replace(/\/+$/, '/') !== route) return;

  const legalNote = ' Pamiątkowy dokument od autora projektu · nie jest dyplomem ani dokumentem urzędowym · generowany lokalnie w przeglądarce uczestnika.';
  const previewNote = 'Podgląd jest uproszczony dla szybkiego działania na telefonie. Finalny PDF zawiera pełną wersję graficzną.';

  function stylePreview() {
    const style = document.createElement('style');
    style.textContent = `
      .qr-participation .doc-bg{background:none!important;background-color:#0d0b09!important;}
      .qr-participation .doc-bg::after{display:none!important;content:none!important;}
      .qr-participation .doc-content{inset:0!important;display:block!important;text-align:center!important;font-family:Georgia,'Times New Roman',serif!important;}
      .qr-participation .topline,.qr-participation .subTitle,.qr-participation .topVeritasSealPreview{display:none!important;}
      .qr-participation .seal,.qr-participation .titlePlate,.qr-participation .anniversarySealPreview,.qr-participation .bottomEventSealWidePreview,.qr-participation .eventSealMirrorPreview,.qr-participation .veritasSealPreview,.qr-participation .sig{display:none!important;}
      .qr-participation .titleText{position:absolute;left:50%;top:14.6%;transform:translate(-50%,-50%);width:82%!important;margin:0!important;font-family:Georgia,'Times New Roman',serif!important;font-size:clamp(1.15rem,2.7vw,2.65rem)!important;font-weight:400!important;letter-spacing:.12em!important;color:#f4dfad!important;text-shadow:0 2px 18px rgba(0,0,0,.72);}
      .qr-participation .memorialLine{position:absolute;left:50%;top:32.75%;transform:translate(-50%,-50%);width:70%;max-width:none!important;font-size:clamp(.56rem,.98vw,.96rem)!important;line-height:1.42!important;margin:0!important;color:rgba(250,238,216,.91)!important;}
      .qr-participation .mainCopy{position:absolute;left:50%;top:63.15%;transform:translate(-50%,-50%);width:55%;max-width:none!important;font-size:clamp(.54rem,.94vw,.91rem)!important;line-height:1.52!important;font-style:italic!important;margin:0!important;color:rgba(255,241,207,.84)!important;}
      .qr-participation .for{position:absolute;left:50%;top:71.95%;transform:translate(-50%,-50%);width:70%;margin:0!important;font-size:clamp(.72rem,1.20vw,1.15rem)!important;text-shadow:0 2px 9px rgba(0,0,0,.62);}
      .qr-participation .fields{position:absolute!important;left:50%;top:83.45%;transform:translate(-50%,-50%);width:79.2%!important;margin:0!important;grid-template-columns:.86fr 1.26fr .86fr!important;gap:clamp(1.1rem,2.4vw,2rem)!important;}
      .qr-participation .field{display:flex!important;flex-direction:column!important;gap:.16rem!important;padding:0!important;border-top:0!important;border-bottom:0!important;align-items:stretch!important;}
      .qr-participation .field::before{content:"";display:block;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(232,208,154,.38),rgba(255,235,184,.54),rgba(232,208,154,.38),transparent);order:2;margin:.30rem 0 .16rem!important;}
      .qr-participation .field strong{order:1;color:#fff0ca!important;font-size:clamp(.44rem,.72vw,.70rem)!important;line-height:1.12!important;font-family:Georgia,'Times New Roman',serif!important;font-weight:400!important;min-height:1.95em!important;display:flex!important;align-items:flex-end!important;justify-content:center!important;white-space:nowrap!important;}
      .qr-participation .field span{order:3;margin:0!important;color:rgba(232,208,154,.58)!important;font-size:clamp(.27rem,.46vw,.43rem)!important;line-height:1!important;letter-spacing:.20em!important;white-space:nowrap!important;}
      .qr-participation .quote,.qr-participation .micro,.qr-participation .signatureBlock{display:none!important;}
      .qr-participation #doc > canvas[aria-hidden='true'],.qr-calibration-note{display:none!important;opacity:0!important;visibility:hidden!important;}
      .qr-mobile-preview-note{margin:.75rem auto 0;max-width:32rem;text-align:center;font-size:.76rem;line-height:1.45;color:rgba(232,208,154,.70);letter-spacing:.02em;}
      .qr-mobile-status{display:none;margin:.7rem auto 0;max-width:30rem;text-align:center;font-size:.82rem;line-height:1.4;color:rgba(255,241,207,.86);}
      .qr-mobile-status.is-visible{display:block;}
      .qr-mobile-status a{color:#f4dfad;text-decoration:underline;text-underline-offset:.18em;}
      .qr-name-warning{display:none;margin:.55rem 0 0;font-size:.78rem;line-height:1.35;color:rgba(255,210,145,.88);}
      .qr-name-warning.is-visible{display:block;}
      body.qr-modal-open #printBtn,body.qr-modal-open .qr-mobile-status{display:none!important;}
      @media (max-width: 760px){
        body{padding-bottom:7.8rem!important;}
        .qr-participation .titleText{top:13.2%!important;font-size:clamp(1rem,6vw,1.7rem)!important;letter-spacing:.10em!important;width:86%!important;}
        .qr-participation .memorialLine{top:32.3%!important;width:78%!important;font-size:clamp(.52rem,3vw,.82rem)!important;}
        .qr-participation .mainCopy{top:62.8%!important;width:70%!important;font-size:clamp(.50rem,2.8vw,.78rem)!important;}
        .qr-participation .for{top:72.1%!important;width:82%!important;font-size:clamp(.66rem,3.4vw,.98rem)!important;}
        .qr-participation .fields{top:84.5%!important;width:86%!important;gap:.65rem!important;}
        .qr-participation .field strong{font-size:clamp(.36rem,2.4vw,.58rem)!important;}
        .qr-participation .field span{font-size:clamp(.21rem,1.65vw,.34rem)!important;letter-spacing:.12em!important;}
        #printBtn{position:fixed!important;left:1rem!important;right:1rem!important;bottom:1rem!important;bottom:calc(1rem + env(safe-area-inset-bottom,0px))!important;z-index:9999!important;width:auto!important;min-height:56px!important;border-radius:999px!important;box-shadow:0 18px 42px rgba(0,0,0,.55),0 0 0 1px rgba(232,208,154,.22)!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;}
        #printBtn[disabled]{opacity:.84!important;}
        .qr-mobile-status.is-visible{position:fixed;left:1rem;right:1rem;bottom:5.3rem;bottom:calc(5.3rem + env(safe-area-inset-bottom,0px));z-index:9998;max-width:none;margin:0;padding:.65rem .85rem;border-radius:1rem;background:rgba(16,12,8,.94);border:1px solid rgba(232,208,154,.18);box-shadow:0 14px 34px rgba(0,0,0,.38);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);}
        body.qr-keyboard-open #printBtn{position:static!important;display:block!important;margin:1rem auto 0!important;width:100%!important;}
        body.qr-keyboard-open .qr-mobile-status.is-visible{position:static!important;margin:.75rem auto 0!important;}
        input,button{font-size:16px!important;}
      }
      @media (max-width: 380px){
        .qr-participation .fields{gap:.42rem!important;width:89%!important;}
        .qr-participation .field span{letter-spacing:.08em!important;}
        .qr-mobile-preview-note{font-size:.70rem;padding:0 .55rem;}
      }
      @media (max-height: 520px) and (orientation: landscape){
        body{padding-bottom:2rem!important;}
        #printBtn{position:static!important;margin:1rem auto 0!important;width:100%!important;}
        .qr-mobile-status.is-visible{position:static!important;margin:.75rem auto 0!important;}
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeName(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .replace(/[\u0000-\u001f\u007f]/g, '')
      .trimStart()
      .slice(0, 42);
  }

  function installNameGuard() {
    const input = document.getElementById('name');
    if (!input || input.dataset.mobileGuard === '1') return;
    input.dataset.mobileGuard = '1';
    input.setAttribute('maxlength', '42');
    input.setAttribute('autocomplete', 'name');
    input.setAttribute('inputmode', 'text');
    const warning = document.createElement('div');
    warning.className = 'qr-name-warning';
    warning.textContent = 'Wpis został skrócony, żeby zachować elegancki skład dokumentu.';
    input.insertAdjacentElement('afterend', warning);
    input.addEventListener('input', () => {
      const before = input.value;
      const clean = normalizeName(before);
      const changed = clean !== before;
      if (changed) input.value = clean;
      warning.classList.toggle('is-visible', changed || clean.length >= 42);
      window.dispatchEvent(new CustomEvent('osw:participant-interaction'));
    });
    input.addEventListener('focus', () => {
      document.body.classList.add('qr-keyboard-open');
      window.dispatchEvent(new CustomEvent('osw:participant-interaction'));
    }, { passive: true });
    input.addEventListener('blur', () => {
      input.value = input.value.trim();
      window.setTimeout(() => document.body.classList.remove('qr-keyboard-open'), 180);
    });
  }

  function addPreviewNote() {
    if (document.querySelector('.qr-mobile-preview-note')) return;
    const docEl = document.getElementById('doc') || document.querySelector('.qr-participation');
    if (!docEl?.parentElement) return;
    const note = document.createElement('div');
    note.className = 'qr-mobile-preview-note';
    note.textContent = previewNote;
    docEl.parentElement.insertBefore(note, docEl.nextSibling);
  }

  function addMobileStatus() {
    if (document.querySelector('.qr-mobile-status')) return;
    const button = document.getElementById('printBtn');
    if (!button?.parentElement) return;
    const status = document.createElement('div');
    status.className = 'qr-mobile-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    button.parentElement.insertBefore(status, button.nextSibling);
  }

  function installModalStateObserver() {
    const modal = document.querySelector('[data-qr-modal]');
    if (!modal || modal.dataset.mobileObserved === '1') return;
    modal.dataset.mobileObserved = '1';
    const sync = () => document.body.classList.toggle('qr-modal-open', modal.classList.contains('is-open') || modal.getAttribute('aria-hidden') === 'false');
    sync();
    new MutationObserver(sync).observe(modal, { attributes: true, attributeFilter: ['class', 'aria-hidden'] });
  }

  function tunePreview() {
    document.querySelectorAll('#doc > canvas[aria-hidden="true"], .qr-calibration-note, .topVeritasSealPreview, .titlePlate, .anniversarySealPreview, .bottomEventSealWidePreview, .eventSealMirrorPreview, .veritasSealPreview').forEach((el) => el.remove());
    const lead = document.querySelector('.qr-participation .memorialLine');
    const motto = document.querySelector('.qr-participation .mainCopy');
    if (lead) lead.innerHTML = 'Pamiątkowy zapis udziału<br>w projekcji audiowizualnej „Rap-Ort: Prawda Sumienia”<br>poświęconej świadectwu, pamięci, sumieniu i odpowiedzialności.';
    if (motto) motto.innerHTML = 'Prawda nie kończy się w dokumencie.<br>Zaczyna się w sumieniu.';
    const fields = Array.from(document.querySelectorAll('.qr-participation .field'));
    const docNo = document.getElementById('num')?.textContent || 'VH-ZU-2026-0525-OSW-0001';
    [['DATA','25.05.2026'],['NUMER DOKUMENTU',docNo],['MIEJSCE','OŚWIĘCIM']].forEach(([label,value], index) => {
      const field = fields[index];
      if (!field) return;
      const labelEl = field.querySelector('span');
      const valueEl = field.querySelector('strong');
      if (labelEl) labelEl.textContent = label;
      if (valueEl) valueEl.textContent = value;
    });
    const noteTarget = document.querySelector('.qr-privacy-note') || document.querySelector('.panel .note');
    if (noteTarget && !document.querySelector('.qr-print-legal-note')) {
      const note = document.createElement('span');
      note.className = 'qr-print-legal-note';
      note.textContent = legalNote;
      noteTarget.appendChild(note);
    }
    installNameGuard();
    addPreviewNote();
    addMobileStatus();
    installModalStateObserver();
  }

  function lockButtonUntilFinalRendererLoads() {
    const button = document.getElementById('printBtn');
    if (!button) return;
    const cleanButton = button.cloneNode(true);
    cleanButton.disabled = true;
    cleanButton.setAttribute('aria-busy', 'true');
    cleanButton.dataset.waitingForFinalRenderer = '1';
    cleanButton.textContent = 'Ładuję finalną wersję generatora...';
    button.replaceWith(cleanButton);
  }

  function loadFinalRenderer() {
    if (document.querySelector('script[data-pr98-final-rhythm]')) return;
    const script = document.createElement('script');
    script.src = `/assets/js/oswiecim-pr98-final-rhythm.js?v=final-20260521-17-final-hierarchy`;
    script.async = false;
    script.dataset.pr98FinalRhythm = '1';
    script.onload = () => {
      const button = document.getElementById('printBtn');
      if (button && button.dataset.waitingForFinalRenderer) {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = 'Pobierz finalny PDF';
      }
    };
    document.body.appendChild(script);
  }

  document.addEventListener('DOMContentLoaded', () => {
    stylePreview();
    lockButtonUntilFinalRendererLoads();
    [0, 100, 280, 650, 1200].forEach((delay) => window.setTimeout(tunePreview, delay));
    loadFinalRenderer();
  });
})();