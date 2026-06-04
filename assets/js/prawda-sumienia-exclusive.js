(() => {
  const root = document.querySelector('[data-psx-page]');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const event = params.get('event');
  const lang = root.dataset.lang || document.documentElement.lang || 'en';

  const events = {
    oswiecim20260525: {
      en: 'Event: Oświęcim / 25 May 2026',
      pl: 'Wydarzenie: Oświęcim / 25 maja 2026'
    },
    syd2026: {
      en: 'Event: Sydney / 2026',
      pl: 'Wydarzenie: Sydney / 2026'
    }
  };

  if (event) {
    root.querySelectorAll('[data-psx-event-link]').forEach((link) => {
      try {
        const url = new URL(link.getAttribute('href'), window.location.origin);
        url.searchParams.set('event', event);
        link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
      } catch (_) {}
    });
  }

  const banner = root.querySelector('[data-psx-event-banner]');
  const eventCopy = event && events[event] ? events[event][lang] || events[event].en : null;

  if (banner && eventCopy) {
    banner.textContent = eventCopy;
    banner.hidden = false;
  }
})();
