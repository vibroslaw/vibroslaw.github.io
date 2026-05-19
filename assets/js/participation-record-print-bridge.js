(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const raw = String(params.get('event') || params.get('key') || '').toLowerCase();
  const eventKey = raw === 'oswiecim20260525' || raw === 'oswiecim' || raw === 'mup' || raw === 'syd2026' ? raw : '';
  if (!eventKey) return;

  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const copy = lang === 'pl'
    ? {
        preparing: 'Przygotowuję wydruk 1:1 z podglądem: tło, seal, title plate i podpis autora…',
        ready: 'Gotowe. Otwieram drukowanie / zapis jako PDF z warstwy premium.',
        missing: 'Nie znaleziono warstwy wydruku. Odśwież stronę i spróbuj ponownie.'
      }
    : {
        preparing: 'Preparing a 1:1 print from the preview: background, seal, title plate and author signature…',
        ready: 'Ready. Opening print / save as PDF from the premium layer.',
        missing: 'The print layer was not found. Refresh the page and try again.'
      };

  const setStatus = (message) => {
    root.querySelectorAll('[data-pr-status]').forEach((node) => { node.textContent = message; });
  };

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  root.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-pr-print]');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const printStage = document.querySelector('[data-pr-print-stage]');
    if (!printStage) {
      setStatus(copy.missing);
      return;
    }

    button.disabled = true;
    document.body.classList.add('pr-event-printing');
    setStatus(copy.preparing);

    await wait(500);

    setStatus(copy.ready);
    window.setTimeout(() => {
      window.print();
      button.disabled = false;
    }, 120);
  }, true);

  window.addEventListener('afterprint', () => {
    document.body.classList.remove('pr-event-printing');
    const button = root.querySelector('[data-pr-print]');
    if (button) button.disabled = false;
  });
})();
