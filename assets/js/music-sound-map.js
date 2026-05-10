(() => {
  "use strict";

  const root = document.querySelector("body.page-music");
  if (!root || window.__veritasMusicSoundMap) return;
  window.__veritasMusicSoundMap = true;

  const lang = root.dataset.lang === "pl" ? "pl" : "en";
  const labels = {
    en: {
      active: "Showing",
      all: "All emotional entries",
      empty: "No works match this emotional entry yet.",
      loaded: "Audio room loaded.",
    },
    pl: {
      active: "Pokazuję",
      all: "Wszystkie wejścia emocjonalne",
      empty: "Na razie brak prac dla tego wejścia emocjonalnego.",
      loaded: "Pokój odsłuchowy załadowany.",
    },
  }[lang];

  const pathData = {
    en: {
      memory: ["SZTAB — Raport z Pamięci", "Kurier Prawdy", "Rap-Ort / Prawda Sumienia"],
      conscience: ["LUSTRO / THE MIRROR", "Rap-Ort", "Kurier Prawdy"],
      resistance: ["Unbroken", "SZTAB", "Zo / SZTAB ORIGINS"],
      identity: ["LUSTRO / THE MIRROR", "Campus Ignis", "Between the Lines"],
      resilience: ["Unbroken", "Equilibrium", "SZTAB"],
    },
    pl: {
      memory: ["SZTAB — Raport z Pamięci", "Kurier Prawdy", "Rap-Ort / Prawda Sumienia"],
      conscience: ["LUSTRO / THE MIRROR", "Rap-Ort", "Kurier Prawdy"],
      resistance: ["Unbroken", "SZTAB", "Zo / SZTAB ORIGINS"],
      identity: ["LUSTRO / THE MIRROR", "Campus Ignis", "Między Wierszami"],
      resilience: ["Unbroken", "Equilibrium", "SZTAB"],
    },
  }[lang];

  function normalise(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setEmotionFilter(value) {
    const filter = normalise(value || "all");
    const cards = [...document.querySelectorAll(".track-document[data-emotions]")];
    const buttons = [...document.querySelectorAll("[data-emotion-filter]")];
    const status = document.querySelector("[data-emotion-status]");
    let visible = 0;

    buttons.forEach((button) => {
      const active = normalise(button.dataset.emotionFilter) === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      const emotions = normalise(card.dataset.emotions).split(/\s+/).filter(Boolean);
      const show = filter === "all" || emotions.includes(filter);
      card.classList.toggle("is-filtered-out", !show);
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (status) {
      const activeLabel = buttons.find((button) => normalise(button.dataset.emotionFilter) === filter)?.textContent?.trim() || labels.all;
      status.textContent = visible ? `${labels.active}: ${activeLabel}` : labels.empty;
    }
  }

  function setListeningPath(value) {
    const key = normalise(value || "memory");
    const output = document.querySelector("[data-now-listening-output]");
    const buttons = [...document.querySelectorAll("[data-listening-path]")];
    const recommendations = pathData[key] || pathData.memory;

    buttons.forEach((button) => {
      const active = normalise(button.dataset.listeningPath) === key;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (output) {
      output.innerHTML = recommendations.map((item, index) => `<li><span>${index + 1}</span>${item}</li>`).join("");
    }
  }

  function loadEmbed(button) {
    const target = document.querySelector(button.dataset.loadEmbed || "");
    const src = button.dataset.embedSrc;
    const title = button.dataset.embedTitle || "Spotify player";
    if (!target || !src || target.dataset.loaded === "true") return;

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.style.border = "0";
    iframe.width = "100%";
    iframe.height = "352";
    target.replaceChildren(iframe);
    target.dataset.loaded = "true";
    button.textContent = labels.loaded;
    button.disabled = true;
  }

  document.addEventListener("click", (event) => {
    const emotionButton = event.target.closest("[data-emotion-filter]");
    if (emotionButton) {
      setEmotionFilter(emotionButton.dataset.emotionFilter);
      return;
    }

    const pathButton = event.target.closest("[data-listening-path]");
    if (pathButton) {
      setListeningPath(pathButton.dataset.listeningPath);
      return;
    }

    const embedButton = event.target.closest("[data-load-embed]");
    if (embedButton) {
      loadEmbed(embedButton);
    }
  });

  setEmotionFilter("all");
  setListeningPath("memory");
})();
