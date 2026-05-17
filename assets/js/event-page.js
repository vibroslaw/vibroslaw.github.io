(() => {
  const root = document.querySelector('[data-raport-event-page]');
  if (!root) return;

  const eventId = root.dataset.eventId;
  const lang = root.dataset.lang === 'en' ? 'en' : 'pl';
  const config = window.RAPORT_EVENTS?.events?.[eventId];
  const accessKeys = window.RAPORT_EVENTS?.accessKeys || {};
  const expected = accessKeys[eventId];
  const params = new URLSearchParams(window.location.search);
  const storedKey = `raportEventAccess:${eventId}`;

  const copy = lang === 'pl' ? {
    unlocked: 'Dostęp uczestnika został odblokowany.',
    locked: 'Wpisz kod wydarzenia albo użyj linku QR z wydarzenia.',
    invalid: 'Kod nie pasuje do tego wydarzenia.',
    copied: 'Link został skopiowany. Możesz otworzyć go na laptopie lub przesłać dalej.',
    shareTitle: 'Portal uczestnika Rap-Ort',
    shareText: 'Link do portalu uczestnika Rap-Ort: Prawda Sumienia.',
    shareFallback: 'Udostępnianie nie jest dostępne w tej przeglądarce. Link został skopiowany.'
  } : {
    unlocked: 'Participant access has been unlocked.',
    locked: 'Enter the event code or use the QR link from the event.',
    invalid: 'The code does not match this event.',
    copied: 'The link has been copied. You can open it on a laptop or send it on.',
    shareTitle: 'Rap-Ort participant portal',
    shareText: 'Link to the Rap-Ort: Prawda Sumienia participant portal.',
    shareFallback: 'Sharing is not available in this browser. The link has been copied.'
  };

  const status = root.querySelector('[data-event-access-status]');
  const form = root.querySelector('[data-event-access-form]');
  const input = root.querySelector('[data-event-access-code]');

  function setState(unlocked) {
    root.classList.toggle('event-unlocked', unlocked);
    root.classList.toggle('event-locked', !unlocked);
    root.setAttribute('data-event-access', unlocked ? 'unlocked' : 'locked');
    if (status) status.textContent = unlocked ? copy.unlocked : copy.locked;
  }

  function unlock() {
    localStorage.setItem(storedKey, 'true');
    setState(true);
  }

  const paramAccess = params.get('access') || params.get('code') || '';
  if (!expected || paramAccess === expected || localStorage.getItem(storedKey) === 'true') unlock();
  else setState(false);

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (input?.value || '').trim();
    if (value === expected) unlock();
    else if (status) status.textContent = copy.invalid;
  });

  async function copyLink() {
    const url = new URL(window.location.href);
    if (expected) url.searchParams.set('access', expected);
    try {
      await navigator.clipboard.writeText(url.toString());
      if (status) status.textContent = copy.copied;
    } catch (_) {
      window.prompt(copy.copied, url.toString());
    }
  }

  root.querySelectorAll('[data-copy-event-link]').forEach((button) => button.addEventListener('click', copyLink));
  root.querySelectorAll('[data-share-event-link]').forEach((button) => button.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    if (expected) url.searchParams.set('access', expected);
    if (navigator.share) {
      try {
        await navigator.share({ title: copy.shareTitle, text: copy.shareText, url: url.toString() });
        return;
      } catch (_) {}
    }
    await copyLink();
    if (status) status.textContent = copy.shareFallback;
  }));

  root.querySelectorAll('[data-event-link]').forEach((link) => {
    if (!expected) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
    const url = new URL(href, window.location.origin);
    url.searchParams.set('access', expected);
    link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
  });

  const typeAudio = {
    enabled: false,
    last: 0,
    pool: [],
    init() {
      if (this.pool.length) return;
      const src = '/public/assets/events/rap-ort/shared/audio/typewriter-key.mp3';
      this.pool = Array.from({ length: 5 }, () => {
        const a = new Audio(src);
        a.preload = 'auto';
        a.volume = 0.16;
        return a;
      });
    },
    play() {
      if (!this.enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const now = performance.now();
      if (now - this.last < 38) return;
      this.last = now;
      const audio = this.pool.find((a) => a.paused) || this.pool[0];
      try { audio.currentTime = 0; audio.play(); } catch (_) {}
    }
  };

  const soundToggle = root.querySelector('[data-typewriter-toggle]');
  const savedSound = localStorage.getItem('raportTypewriterSound') === 'true';
  function setSound(on) {
    typeAudio.enabled = on;
    if (on) typeAudio.init();
    localStorage.setItem('raportTypewriterSound', on ? 'true' : 'false');
    if (soundToggle) {
      soundToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      soundToggle.textContent = on
        ? (lang === 'pl' ? 'Wyłącz dźwięk pisania' : 'Disable typing sound')
        : (lang === 'pl' ? 'Włącz dźwięk pisania' : 'Enable typing sound');
    }
  }
  setSound(savedSound);
  soundToggle?.addEventListener('click', () => setSound(!typeAudio.enabled));
  root.addEventListener('keydown', (event) => {
    if (!(event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Enter' || event.key === ' ') typeAudio.play();
  });
})();
