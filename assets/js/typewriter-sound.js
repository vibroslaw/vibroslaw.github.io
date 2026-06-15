(() => {
  "use strict";

  const roots = [...document.querySelectorAll("[data-typewriter-scope]")];
  if (!roots.length) return;

  const prefKey = "raportTypewriterSound";
  const volumeKey = "raportTypewriterVolume";
  const lang = document.documentElement.lang?.startsWith("pl") || document.body.dataset.lang === "pl" ? "pl" : "en";
  const copy = lang === "pl" ? {
    title: "Dźwięk maszyny do pisania",
    body: "Lokalna mechanika klawiszy: osobny dźwięk spacji, przesuwu wałka i dzwonka końca wiersza.",
    enable: "Włącz dźwięk",
    disable: "Wyłącz dźwięk",
    test: "Test mechanizmu",
    volume: "Głośność",
    on: "Dźwięk maszyny do pisania jest włączony.",
    off: "Dźwięk maszyny do pisania jest wyłączony.",
  } : {
    title: "Typewriter atmosphere",
    body: "Local mechanical sound with distinct keys, spacebar, carriage travel and an end-of-line bell.",
    enable: "Enable sound",
    disable: "Disable sound",
    test: "Test mechanism",
    volume: "Volume",
    on: "Typewriter sound is enabled.",
    off: "Typewriter sound is disabled.",
  };

  const state = {
    enabled: localStorage.getItem(prefKey) === "true",
    volume: Math.min(.42, Math.max(.04, Number(localStorage.getItem(volumeKey) || ".16"))),
    context: null,
    lastKeyAt: 0,
  };
  const lineCounts = new WeakMap();
  const lastKeys = new WeakMap();

  function audioContext() {
    if (state.context) return state.context;
    const Context = window.AudioContext || window.webkitAudioContext;
    state.context = Context ? new Context() : null;
    return state.context;
  }

  function noiseBuffer(context, duration) {
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    return buffer;
  }

  function noiseStrike(context, at, { duration = .04, frequency = 1600, q = 1.4, gain = .6, sweep = 0 } = {}) {
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    source.buffer = noiseBuffer(context, duration);
    filter.type = "bandpass";
    filter.Q.value = q;
    filter.frequency.setValueAtTime(frequency, at);
    if (sweep) filter.frequency.exponentialRampToValueAtTime(Math.max(90, frequency + sweep), at + duration);
    envelope.gain.setValueAtTime(Math.max(.0001, state.volume * gain), at);
    envelope.gain.exponentialRampToValueAtTime(.0001, at + duration);
    source.connect(filter).connect(envelope).connect(context.destination);
    source.start(at);
    source.stop(at + duration);
  }

  function metalTone(context, at, { frequency, duration, gain, type = "sine", endFrequency = frequency } = {}) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, at + duration);
    envelope.gain.setValueAtTime(Math.max(.0001, state.volume * gain), at);
    envelope.gain.exponentialRampToValueAtTime(.0001, at + duration);
    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + duration);
  }

  function synth(kind = "key") {
    const context = audioContext();
    if (!context) return;
    if (context.state === "suspended") context.resume().catch(() => {});
    const now = context.currentTime + .004;

    if (kind === "space") {
      noiseStrike(context, now, { duration: .052, frequency: 620, q: .72, gain: .82, sweep: -210 });
      metalTone(context, now, { frequency: 118, endFrequency: 82, duration: .046, gain: .18, type: "triangle" });
      noiseStrike(context, now + .019, { duration: .024, frequency: 1320, q: 1.1, gain: .24 });
      return;
    }

    if (kind === "return") {
      noiseStrike(context, now, { duration: .16, frequency: 930, q: .72, gain: .43, sweep: -610 });
      noiseStrike(context, now + .105, { duration: .052, frequency: 520, q: .9, gain: .72 });
      metalTone(context, now + .125, { frequency: 1230, endFrequency: 1210, duration: .34, gain: .23 });
      metalTone(context, now + .127, { frequency: 1840, endFrequency: 1800, duration: .28, gain: .1 });
      return;
    }

    if (kind === "soft") {
      noiseStrike(context, now, { duration: .038, frequency: 980, q: .9, gain: .42, sweep: -180 });
      return;
    }

    noiseStrike(context, now, { duration: .034, frequency: 1650 + Math.random() * 420, q: 1.45, gain: .7 });
    metalTone(context, now, { frequency: 155 + Math.random() * 35, endFrequency: 105, duration: .027, gain: .1, type: "square" });
    noiseStrike(context, now + .012, { duration: .02, frequency: 720, q: 1, gain: .22 });
  }

  function play(kind = "key", force = false) {
    if (!state.enabled) return;
    const now = performance.now();
    if (!force && kind === "key" && now - state.lastKeyAt < 27) return;
    if (kind === "key") state.lastKeyAt = now;
    synth(kind);
  }

  function visualLineCount(field) {
    const style = getComputedStyle(field);
    const canvas = visualLineCount.canvas || (visualLineCount.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const width = Math.max(80, field.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    let count = 0;
    String(field.value || "").split("\n").forEach((paragraph) => {
      if (!paragraph) {
        count += 1;
        return;
      }
      const words = paragraph.split(/(\s+)/).filter(Boolean);
      let line = "";
      words.forEach((word) => {
        const candidate = line + word;
        if (line && context.measureText(candidate).width > width) {
          count += 1;
          line = word.trimStart();
        } else {
          line = candidate;
        }
      });
      count += 1;
    });
    return Math.max(1, count);
  }

  function setEnabled(value, message) {
    state.enabled = Boolean(value);
    localStorage.setItem(prefKey, state.enabled ? "true" : "false");
    if (state.enabled) audioContext()?.resume().catch(() => {});
    updatePanels(message || (state.enabled ? copy.on : copy.off));
  }

  function setVolume(value) {
    state.volume = Math.min(.42, Math.max(.04, Number(value) / 100));
    localStorage.setItem(volumeKey, String(state.volume));
    updatePanels();
  }

  function buildPanel(root) {
    if (root.querySelector("[data-typewriter-panel]")) return;
    const panel = document.createElement("details");
    panel.className = "typewriter-sound-panel";
    panel.setAttribute("data-typewriter-panel", "");
    panel.innerHTML = `
      <summary>${copy.title}</summary>
      <p>${copy.body}</p>
      <div class="typewriter-sound-controls">
        <button class="vh-button secondary" type="button" data-typewriter-toggle aria-pressed="false">${copy.enable}</button>
        <button class="vh-button secondary" type="button" data-typewriter-test>${copy.test}</button>
        <label class="typewriter-volume"><span>${copy.volume}</span><input type="range" min="4" max="42" step="1" value="${Math.round(state.volume * 100)}" data-typewriter-volume></label>
      </div>
      <p class="typewriter-sound-status" data-typewriter-status aria-live="polite"></p>
    `;
    const anchor = root.querySelector("[data-typewriter-sound-anchor]");
    if (anchor) anchor.replaceWith(panel);
    else (root.querySelector("[data-typewriter-panel-target]") || root).appendChild(panel);
  }

  function updatePanels(message) {
    roots.forEach((root) => {
      const toggle = root.querySelector("[data-typewriter-toggle]");
      const status = root.querySelector("[data-typewriter-status]");
      const volume = root.querySelector("[data-typewriter-volume]");
      if (toggle) {
        toggle.textContent = state.enabled ? copy.disable : copy.enable;
        toggle.setAttribute("aria-pressed", state.enabled ? "true" : "false");
      }
      if (volume && document.activeElement !== volume) volume.value = String(Math.round(state.volume * 100));
      if (status) status.textContent = message || (state.enabled ? copy.on : copy.off);
    });
  }

  roots.forEach((root) => {
    buildPanel(root);
    root.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-typewriter-toggle]");
      const test = event.target.closest("[data-typewriter-test]");
      if (toggle) setEnabled(!state.enabled);
      if (test) {
        setEnabled(true);
        play("key", true);
        setTimeout(() => play("space", true), 105);
        setTimeout(() => play("return", true), 245);
      }
    });
    root.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches?.("[data-typewriter-volume]")) {
        setVolume(target.value);
        return;
      }
      if (!(target instanceof HTMLTextAreaElement)) return;
      const previous = lineCounts.get(target) || 1;
      const next = visualLineCount(target);
      const lastKey = lastKeys.get(target);
      if (next > previous && lastKey !== "Enter") play("return", true);
      lineCounts.set(target, next);
    });
    root.addEventListener("focusin", (event) => {
      if (event.target instanceof HTMLTextAreaElement) lineCounts.set(event.target, visualLineCount(event.target));
    });
    root.addEventListener("keydown", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (target.readOnly || target.disabled || event.ctrlKey || event.metaKey || event.altKey) return;
      lastKeys.set(target, event.key);
      if (event.key === " ") play("space", true);
      else if (event.key === "Enter") play("return", true);
      else if (event.key === "Backspace" || event.key === "Delete") play("soft", true);
      else if (event.key.length === 1) play("key");
    });
  });

  updatePanels();
})();
