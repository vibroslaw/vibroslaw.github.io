(() => {
  const roots = [...document.querySelectorAll('[data-typewriter-scope]')];
  if (!roots.length) return;

  const prefKey = 'raportTypewriterSound';
  const volumeKey = 'raportTypewriterVolume';
  const audioRoot = '/public/assets/events/rap-ort/shared/audio/';
  const files = {
    key: `${audioRoot}typewriter-key.mp3`,
    soft: `${audioRoot}typewriter-key-soft.mp3`,
    space: `${audioRoot}typewriter-space.mp3`,
    return: `${audioRoot}typewriter-return.mp3`,
    bell: `${audioRoot}typewriter-bell.mp3`
  };

  const lang = document.documentElement.lang?.startsWith('en') || document.body.dataset.lang === 'en' ? 'en' : 'pl';
  const copy = lang === 'pl' ? {
    title: 'Dźwięk maszyny do pisania',
    body: 'Opcjonalny, subtelny dźwięk klawiszy podczas pisania. Działa lokalnie w przeglądarce i można go wyłączyć w każdej chwili.',
    enable: 'Włącz dźwięk pisania',
    disable: 'Wyłącz dźwięk pisania',
    test: 'Test dźwięku',
    on: 'Dźwięk pisania jest włączony.',
    off: 'Dźwięk pisania jest wyłączony.',
    missing: 'Nie znaleziono pliku typewriter-key.mp3. Dodaj go do folderu audio.',
    reduced: 'Dźwięk wyłączony w trybie ograniczonego ruchu / dostępności.'
  } : {
    title: 'Typewriter sound',
    body: 'Optional subtle key sound while writing. It works locally in the browser and can be disabled at any time.',
    enable: 'Enable typing sound',
    disable: 'Disable typing sound',
    test: 'Test sound',
    on: 'Typing sound is enabled.',
    off: 'Typing sound is disabled.',
    missing: 'typewriter-key.mp3 was not found. Add it to the audio folder.',
    reduced: 'Sound disabled in reduced-motion / accessibility mode.'
  };

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('vhReducedMotion') === 'true';

  const state = {
    enabled: localStorage.getItem(prefKey) === 'true',
    volume: Number(localStorage.getItem(volumeKey) || '0.16'),
    ready: false,
    missing: false,
    last: 0,
    pools: {}
  };

  function makeAudio(src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = state.volume;
    audio.addEventListener('error', () => { state.missing = true; updatePanels(); }, { once: true });
    return audio;
  }

  function initAudio() {
    if (state.ready) return;
    state.pools.key = Array.from({ length: 6 }, () => makeAudio(files.key));
    state.pools.soft = Array.from({ length: 3 }, () => makeAudio(files.soft));
    state.pools.space = Array.from({ length: 2 }, () => makeAudio(files.space));
    state.pools.return = Array.from({ length: 2 }, () => makeAudio(files.return));
    state.pools.bell = Array.from({ length: 1 }, () => makeAudio(files.bell));
    state.ready = true;
  }

  function choosePool(key) {
    if (key === 'Enter') return state.pools.return?.length ? 'return' : 'key';
    if (key === ' ') return state.pools.space?.length ? 'space' : 'soft';
    if (key === 'Backspace' || key === 'Delete') return 'soft';
    return 'key';
  }

  function play(key = 'key') {
    if (!state.enabled) return;
    if (reducedMotion()) { setEnabled(false, copy.reduced); return; }
    initAudio();
    const now = performance.now();
    if (now - state.last < 34) return;
    state.last = now;
    const poolName = choosePool(key);
    const pool = state.pools[poolName] || state.pools.key || [];
    const audio = pool.find((item) => item.paused) || pool[0];
    if (!audio) return;
    audio.volume = state.volume;
    try {
      audio.currentTime = 0;
      const result = audio.play();
      if (result?.catch) result.catch(() => {});
    } catch (_) {}
  }

  function setEnabled(value, customMessage) {
    state.enabled = Boolean(value);
    localStorage.setItem(prefKey, state.enabled ? 'true' : 'false');
    if (state.enabled) initAudio();
    updatePanels(customMessage || (state.enabled ? copy.on : copy.off));
  }

  function testSound() {
    setEnabled(true);
    play('a');
  }

  function buildPanel(root) {
    if (root.querySelector('[data-typewriter-panel]')) return;
    const panel = document.createElement('section');
    panel.className = 'typewriter-sound-panel';
    panel.setAttribute('data-typewriter-panel', '');
    panel.innerHTML = `
      <div><strong>${copy.title}</strong><p>${copy.body}</p></div>
      <div class="typewriter-sound-controls">
        <button class="vh-button secondary" type="button" data-typewriter-toggle aria-pressed="false">${copy.enable}</button>
        <button class="vh-button secondary" type="button" data-typewriter-test>${copy.test}</button>
      </div>
      <p class="typewriter-sound-status" data-typewriter-status aria-live="polite"></p>
    `;
    const target = root.querySelector('[data-typewriter-panel-target]') || root.querySelector('form') || root;
    target.prepend(panel);
  }

  function updatePanels(message) {
    roots.forEach((root) => {
      const toggle = root.querySelector('[data-typewriter-toggle]');
      const status = root.querySelector('[data-typewriter-status]');
      if (toggle) {
        toggle.textContent = state.enabled ? copy.disable : copy.enable;
        toggle.setAttribute('aria-pressed', state.enabled ? 'true' : 'false');
      }
      if (status) status.textContent = state.missing ? copy.missing : (message || (state.enabled ? copy.on : copy.off));
    });
  }

  function loadDocumentPackSystem() {
    if (!document.querySelector('[data-participation-record]')) return;

    if (!document.querySelector('link[href="/assets/css/document-pack.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/css/document-pack.css';
      document.head.appendChild(link);
    }

    const loadScript = (src) => new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });

    loadScript('/assets/js/document-pack-config.js')
      .then(() => loadScript('/assets/js/document-pack-renderer.js'));
  }

  roots.forEach((root) => {
    buildPanel(root);
    root.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-typewriter-toggle]');
      const test = event.target.closest('[data-typewriter-test]');
      if (toggle) setEnabled(!state.enabled);
      if (test) testSound();
    });
    root.addEventListener('keydown', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (target.readOnly || target.disabled) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Enter' || event.key === ' ') play(event.key);
    });
  });

  loadDocumentPackSystem();
  updatePanels();
})();
