(() => {
  const root = document.querySelector('[data-psx-page]');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const event = params.get('event');
  if (!event) return;

  root.querySelectorAll('[data-psx-event-link]').forEach((link) => {
    try {
      const url = new URL(link.getAttribute('href'), window.location.origin);
      url.searchParams.set('event', event);
      link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    } catch (_) {}
  });
})();
