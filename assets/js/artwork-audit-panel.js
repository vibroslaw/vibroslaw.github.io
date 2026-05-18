(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('artworkAudit') !== '1') return;

  const manifest = window.RapOrtEventAssets;
  if (!manifest) return;

  const required = manifest.requiredForWow || [];
  const procedural = manifest.requiredProcedural || [];

  function exists(path) {
    return fetch(path, { method: 'HEAD', cache: 'no-store' })
      .then((response) => response.ok)
      .catch(() => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = path;
      }));
  }

  function row(label, path, ok) {
    return `<li><span>${label}</span><strong class="${ok ? 'is-ok' : 'is-missing'}">${ok ? 'present' : 'missing'}</strong><code>${path}</code></li>`;
  }

  async function boot() {
    const webp = await Promise.all(required.map(async (path) => ({ path, ok: await exists(path) })));
    const svg = await Promise.all(procedural.map(async (path) => ({ path, ok: await exists(path) })));
    const webpMissing = webp.filter((item) => !item.ok).length;
    const svgMissing = svg.filter((item) => !item.ok).length;

    const panel = document.createElement('aside');
    panel.className = 'artwork-audit-panel';
    panel.setAttribute('aria-label', 'Artwork audit panel');
    panel.innerHTML = `
      <button class="artwork-audit-close" type="button" aria-label="Close artwork audit">×</button>
      <p class="artwork-audit-kicker">ARTWORK AUDIT</p>
      <h2>Rap-Ort cinematic assets</h2>
      <p>${webpMissing === 0 ? 'Final WebP artwork is complete.' : `${webpMissing} final WebP asset(s) still missing.`}</p>
      <p>${svgMissing === 0 ? 'Procedural SVG fallback pack is complete.' : `${svgMissing} procedural SVG fallback(s) missing.`}</p>
      <details open><summary>Final WebP artwork</summary><ul>${webp.map((item) => row('WebP', item.path, item.ok)).join('')}</ul></details>
      <details><summary>Procedural SVG fallbacks</summary><ul>${svg.map((item) => row('SVG', item.path, item.ok)).join('')}</ul></details>
    `;
    document.body.appendChild(panel);
    panel.querySelector('.artwork-audit-close')?.addEventListener('click', () => panel.remove());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
