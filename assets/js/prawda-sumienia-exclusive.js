(() => {
  const root = document.querySelector('[data-psx-page]');
  if (!root) return;

  const lang = root.dataset.lang || document.documentElement.lang || 'en';
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event') || root.dataset.defaultEvent || '';

  const copyText = {
    en: {
      copied: 'QR link copied.',
      failed: 'Copy failed. Use the address bar link.'
    },
    pl: {
      copied: 'Link QR skopiowany.',
      failed: 'Nie udało się skopiować. Użyj linku z paska adresu.'
    }
  };

  const routeMap = {
    en: {
      witness: '/rap-ort/witness-report/generator/',
      participation: '/rap-ort/participation/',
      archive: '/rap-ort/participation/#archive-gallery'
    },
    pl: {
      witness: '/rap-ort/raport-swiadka/generator/',
      participation: '/rap-ort/uczestnictwo/',
      archive: '/rap-ort/uczestnictwo/#archive-gallery'
    }
  };

  const routes = routeMap[lang] || routeMap.en;

  const buildEventUrl = (path) => {
    const url = new URL(path, window.location.origin);
    if (eventId) url.searchParams.set('event', eventId);
    return `${url.pathname}${url.search}${url.hash}`;
  };

  root.querySelectorAll('[data-psx-link-type]').forEach((link) => {
    const type = link.dataset.psxLinkType;
    if (!routes[type]) return;
    link.setAttribute('href', buildEventUrl(routes[type]));
  });

  const eventConfig = window.RAPORT_EVENTS?.events?.[eventId];
  const localizedEvent = eventConfig?.[lang];
  const eventName = root.querySelector('[data-psx-event-name]');
  const eventDetail = root.querySelector('[data-psx-event-detail]');

  if (localizedEvent && eventName && eventDetail) {
    eventName.textContent = localizedEvent.shortPlace || localizedEvent.title || eventId;
    const detailParts = [localizedEvent.date, localizedEvent.place].filter(Boolean);
    eventDetail.textContent = detailParts.join(' / ');
  }

  const currentExperienceUrl = () => {
    const url = new URL(window.location.href);
    if (eventId) url.searchParams.set('event', eventId);
    return url.href;
  };

  root.querySelectorAll('[data-copy-current]').forEach((button) => {
    button.addEventListener('click', async () => {
      const status = root.querySelector('[data-copy-status]');
      try {
        await navigator.clipboard.writeText(currentExperienceUrl());
        if (status) status.textContent = copyText[lang]?.copied || copyText.en.copied;
      } catch (_) {
        if (status) status.textContent = copyText[lang]?.failed || copyText.en.failed;
      }
    });
  });

  const navLinks = Array.from(root.querySelectorAll('.psx-orbit-nav a[href^="#"]'));
  if (!navLinks.length || !('IntersectionObserver' in window)) return;

  const sectionById = new Map(
    navLinks
      .map((link) => [link.getAttribute('href').slice(1), link])
      .filter(([id]) => id)
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.remove('is-active'));
      sectionById.get(entry.target.id)?.classList.add('is-active');
    });
  }, {
    rootMargin: '-42% 0px -48% 0px',
    threshold: 0.01
  });

  sectionById.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
