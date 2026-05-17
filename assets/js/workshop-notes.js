(() => {
  const root = document.querySelector('[data-workshop-notes]');
  if (!root) return;

  const eventId = root.dataset.eventId || 'event';
  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const storageKey = `raportWorkshopNotes:${eventId}:${lang}`;
  const notes = [...root.querySelectorAll('[data-workshop-note]')];
  const status = root.querySelector('[data-workshop-status]');

  const copy = lang === 'pl' ? {
    saved: 'Notatki zostały zapisane lokalnie w tej przeglądarce.',
    cleared: 'Notatki zostały wyczyszczone.',
    copied: 'Notatki zostały skopiowane do schowka.',
    fallback: 'Skopiuj notatki z pola poniżej.'
  } : {
    saved: 'Notes have been saved locally in this browser.',
    cleared: 'Notes have been cleared.',
    copied: 'Notes have been copied to clipboard.',
    fallback: 'Copy the notes from the field below.'
  };

  function readState() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch (_) { return {}; }
  }

  function writeState() {
    const state = {};
    notes.forEach((node) => { state[node.dataset.workshopNote] = node.value || ''; });
    localStorage.setItem(storageKey, JSON.stringify(state));
    if (status) status.textContent = copy.saved;
  }

  function restore() {
    const state = readState();
    notes.forEach((node) => {
      if (Object.prototype.hasOwnProperty.call(state, node.dataset.workshopNote)) node.value = state[node.dataset.workshopNote];
    });
  }

  function textBundle() {
    return notes.map((node) => {
      const label = node.closest('[data-workshop-module]')?.querySelector('h3')?.textContent?.trim() || node.dataset.workshopNote;
      return `${label}\n${node.value || ''}`;
    }).join('\n\n---\n\n');
  }

  restore();
  notes.forEach((node) => node.addEventListener('input', () => {
    clearTimeout(node.__workshopSaveTimer);
    node.__workshopSaveTimer = setTimeout(writeState, 300);
  }));

  root.querySelector('[data-copy-workshop-notes]')?.addEventListener('click', async () => {
    const text = textBundle();
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = copy.copied;
    } catch (_) {
      window.prompt(copy.fallback, text);
    }
  });

  root.querySelector('[data-clear-workshop-notes]')?.addEventListener('click', () => {
    notes.forEach((node) => { node.value = ''; });
    localStorage.removeItem(storageKey);
    if (status) status.textContent = copy.cleared;
  });
})();
