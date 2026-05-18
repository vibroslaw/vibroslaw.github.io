(() => {
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.body.classList.contains('reduce-motion');

  function loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }

  function bootPremiumAssets() {
    if (!document.querySelector('.event-shell-page')) return;
    loadStylesheet('/assets/css/premium-asset-integration.css');
    loadScript('/assets/js/event-asset-manifest.js')
      .then(() => loadScript('/assets/js/event-asset-loader.js'));
  }

  function copyText(value, statusNode, copiedText, fallbackText) {
    if (!value) return;
    if (!navigator.clipboard) {
      if (statusNode) statusNode.textContent = fallbackText;
      return;
    }
    navigator.clipboard.writeText(value).then(() => {
      if (statusNode) statusNode.textContent = copiedText;
    }).catch(() => {
      if (statusNode) statusNode.textContent = fallbackText;
    });
  }

  function bootCopyAndShare() {
    document.addEventListener('click', async (event) => {
      const copyButton = event.target.closest('[data-event-copy]');
      if (copyButton) {
        const target = document.querySelector(copyButton.dataset.eventCopy);
        const status = document.querySelector(copyButton.dataset.eventStatus);
        copyText(
          target?.value || target?.textContent || '',
          status,
          copyButton.dataset.copied || 'Link copied.',
          copyButton.dataset.copyFallback || 'Copy the link manually.'
        );
        return;
      }

      const shareButton = event.target.closest('[data-event-share]');
      if (!shareButton) return;

      const urlNode = document.querySelector(shareButton.dataset.eventShare);
      const status = document.querySelector(shareButton.dataset.eventStatus);
      const url = urlNode?.value || urlNode?.textContent || window.location.href;
      if (!navigator.share) {
        copyText(
          url,
          status,
          shareButton.dataset.copied || 'Link copied.',
          shareButton.dataset.shareFallback || 'Share is not available. Copy the link manually.'
        );
        return;
      }

      try {
        await navigator.share({
          title: shareButton.dataset.shareTitle || document.title,
          text: shareButton.dataset.shareText || '',
          url
        });
      } catch (_) {}
    });
  }

  function bootSmoothAnchors() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || prefersReducedMotion()) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function bootAtmosphere() {
    const hero = document.querySelector('[data-event-shell-hero]');
    if (!hero || prefersReducedMotion()) return;

    let ticking = false;
    const update = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight)));
      hero.style.setProperty('--event-shell-scroll', progress.toFixed(3));
      ticking = false;
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
  }

  function boot() {
    bootPremiumAssets();
    bootCopyAndShare();
    bootSmoothAnchors();
    bootAtmosphere();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();