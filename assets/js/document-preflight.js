window.VH_DOCUMENTS = window.VH_DOCUMENTS || {};

window.VH_DOCUMENTS.preflight = (() => {
  const imageCache = new Map();
  const headCache = new Map();

  function absolute(path) {
    return new URL(path, window.location.origin).href;
  }

  function loadImage(path) {
    if (!path) return Promise.resolve(null);
    const url = absolute(path);
    if (imageCache.has(url)) return imageCache.get(url);
    const promise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ img, url, path });
      img.onerror = () => resolve(null);
      img.src = url;
    });
    imageCache.set(url, promise);
    return promise;
  }

  async function resolveFirst(paths = []) {
    for (let index = 0; index < paths.length; index += 1) {
      const loaded = await loadImage(paths[index]);
      if (loaded) return { ...loaded, index };
    }
    return null;
  }

  function imageSize(loaded) {
    if (!loaded?.img) return { width: 0, height: 0 };
    return {
      width: loaded.img.naturalWidth || loaded.img.width || 0,
      height: loaded.img.naturalHeight || loaded.img.height || 0
    };
  }

  function meetsMinimum(loaded, minimum = { width: 3000, height: 2100 }) {
    const size = imageSize(loaded);
    return size.width >= minimum.width && size.height >= minimum.height;
  }

  function constrainedDevice() {
    const memory = Number(navigator.deviceMemory || 8);
    const smallViewport = Math.min(window.innerWidth || 1280, window.innerHeight || 720) < 760;
    return memory <= 3 || smallViewport;
  }

  function formatSize(loaded) {
    const size = imageSize(loaded);
    return `${size.width} × ${size.height}px`;
  }

  async function fileExists(path) {
    if (!path) return false;
    const url = absolute(path);
    if (headCache.has(url)) return headCache.get(url);
    const promise = fetch(url, { method: 'HEAD', cache: 'no-store' }).then((res) => res.ok).catch(() => false);
    headCache.set(url, promise);
    return promise;
  }

  async function vendorStatus() {
    return {
      pdfLibGlobal: Boolean(window.PDFLib?.PDFDocument),
      fontkitGlobal: Boolean(window.fontkit || window.Fontkit),
      pdfLibLocal: await fileExists('/assets/vendor/pdf-lib.min.js'),
      fontkitLocal: await fileExists('/assets/vendor/fontkit.umd.min.js')
    };
  }

  return { absolute, loadImage, resolveFirst, imageSize, meetsMinimum, constrainedDevice, formatSize, fileExists, vendorStatus };
})();

(() => {
  const isDocumentPage = document.querySelector('[data-participation-record], [data-witness-report]');
  if (!isDocumentPage) return;

  const cssId = 'vh-document-quality-css';
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.href = '/assets/css/document-quality.css';
    document.head.appendChild(link);
  }

  const scriptId = 'vh-document-quality-js';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = '/assets/js/document-quality.js';
    script.defer = true;
    document.body.appendChild(script);
  }
})();
