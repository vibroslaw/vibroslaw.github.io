(() => {
  "use strict";

  const root = document.querySelector("body.page-music");
  if (!root || window.__veritasPersonalPlaylistOverride) return;
  window.__veritasPersonalPlaylistOverride = true;

  const PERSONAL_PLAYLIST_ID = "22ClWy51TIpXxGzN7L0Aja";
  const PERSONAL_PLAYLIST_URL = "https://open.spotify.com/playlist/22ClWy51TIpXxGzN7L0Aja?si=CylRWaWYQZmG-99ZJThOLA";
  const isPl = root.dataset.lang === "pl";

  const text = {
    load: isPl ? "Załaduj playlistę Spotify" : "Load Spotify playlist",
    loading: isPl ? "Ładowanie playlisty…" : "Loading playlist…",
    loaded: isPl ? "Playlista załadowana" : "Playlist loaded",
    title: isPl ? "Osobiste / filmowe" : "Personal / Cinematic",
  };

  function isPersonalActive() {
    return document.querySelector('[data-playlist-key="personal"].is-active') || document.querySelector('[data-emotion-filter="personal"].is-active') || document.querySelector('[data-listening-path="personal"].is-active');
  }

  function applyPersonalPlaylist() {
    if (!isPersonalActive()) return;
    const open = document.querySelector("[data-playlist-open]");
    const load = document.querySelector("[data-load-playlist]");
    const embed = document.querySelector("#spotifyPlaylistRoom");
    if (open) open.href = PERSONAL_PLAYLIST_URL;
    if (load) {
      load.dataset.playlist = "personal";
      load.dataset.personalOverride = "true";
      load.disabled = false;
      load.textContent = text.load;
      load.setAttribute("aria-label", `${text.load}: ${text.title}`);
    }
    if (embed && embed.dataset.loaded !== "true") {
      embed.classList.remove("is-loading", "is-loaded");
      embed.dataset.loaded = "false";
      embed.innerHTML = "<span>Spotify</span>";
    }
  }

  function loadPersonalPlaylist(event) {
    const button = event.target.closest("[data-load-playlist]");
    if (!button || !isPersonalActive()) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const target = document.querySelector("#spotifyPlaylistRoom");
    if (!target || target.dataset.loaded === "true") return;

    let isSettled = false;
    const markLoaded = () => {
      if (isSettled) return;
      isSettled = true;
      target.classList.remove("is-loading");
      target.classList.add("is-loaded");
      target.dataset.loaded = "true";
      button.textContent = text.loaded;
    };

    button.disabled = true;
    button.textContent = text.loading;
    target.classList.add("is-loading");
    target.innerHTML = `<span>${text.loading}</span>`;

    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/playlist/${PERSONAL_PLAYLIST_ID}?utm_source=generator`;
    iframe.title = `Spotify playlist — ${text.title}`;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.width = "100%";
    iframe.height = "352";
    iframe.style.border = "0";
    iframe.addEventListener("load", markLoaded, { once: true });
    setTimeout(markLoaded, 2200);
    target.replaceChildren(iframe);
  }

  document.addEventListener("click", () => requestAnimationFrame(applyPersonalPlaylist));
  window.addEventListener("hashchange", () => requestAnimationFrame(applyPersonalPlaylist));
  document.addEventListener("click", loadPersonalPlaylist, true);

  requestAnimationFrame(applyPersonalPlaylist);
})();
