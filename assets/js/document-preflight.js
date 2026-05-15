window.VH_DOCUMENTS = window.VH_DOCUMENTS || {};

(() => {
  const master = window.VH_DOCUMENTS.printMaster;
  if (!master) return;

  master.version = '0.6.1-pr54-local-public-vendors';
  master.assets = master.assets || {};
  master.assets.signatures = {
    gold: '/public/assets/reports/author-signature-gold.svg',
    dark: '/public/assets/reports/author-signature-dark.svg',
    goldPng: '/public/assets/reports/author-signature-gold@2x.png',
    darkPng: '/public/assets/reports/author-signature-dark@2x.png',
    legacy: master.assets.signature || '/public/assets/reports/author-signature-placeholder.svg'
  };
  master.assets.titlePlates = {
    participation: {
      pl: '/public/assets/reports/title-plates/title-zapis-uczestnictwa-gold.svg',
      en: '/public/assets/reports/title-plates/title-record-of-participation-gold.svg'
    },
    witnessReport: {
      pl: '/public/assets/reports/title-plates/title-raport-swiadka-dark.svg',
      en: '/public/assets/reports/title-plates/title-witness-report-dark.svg'
    }
  };
  master.assets.eventAccents = {
    syd2026: {
      gold: '/public/assets/reports/event-accents/event-accent-syd2026-gold.svg',
      dark: '/public/assets/reports/event-accents/event-accent-syd2026-dark.svg'
    }
  };

  const participation = master.assets.participation || {};
  if (participation.cinema) participation.cinema.a3 = ['/public/assets/reports/participation-record-bg-01-archival-cinema-a3.jpg', ...(participation.cinema.a3 || [])];
  if (participation.museum) participation.museum.a3 = ['/public/assets/reports/participation-record-bg-02-museum-line-a3.jpg', ...(participation.museum.a3 || [])];
  if (participation.ceremonial) participation.ceremonial.a3 = ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a3.jpg', ...(participation.ceremonial.a3 || [])];

  master.vendors = {
    pdfLib: '/public/assets/vendor/pdf-lib.min.js',
    fontkit: '/public/assets/vendor/fontkit.umd.min.js',
    manifest: '/public/assets/vendor/VENDOR_MANIFEST.json'
  };
  master.fonts = {
    titleSerifRegular: '/public/assets/fonts/print/cinzel/Cinzel-Regular.ttf',
    titleSerifSemiBold: '/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf',
    bodySerifRegular: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Regular.ttf',
    bodySerifItalic: '/public/assets/fonts/print/source-serif-4/SourceSerif4-Italic.ttf',
    metaSansRegular: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-Regular.ttf',
    metaSansSemiBold: '/public/assets/fonts/print/ibm-plex-sans/IBMPlexSans-SemiBold.ttf',
    numberMonoRegular: '/public/assets/fonts/print/ibm-plex-mono/IBMPlexMono-Regular.ttf',
    typewriterRegular: '/public/assets/fonts/print/courier-prime/CourierPrime-Regular.ttf'
  };
  master.pr54 = {
    status: 'hybrid-vector-engine-active',
    rules: [
      'Use raster backgrounds with vector PDF text whenever PDFLib is available.',
      'Use local embedded fonts when fontkit and print fonts are available.',
      'Use final path-only signature and title assets when present.',
      'Prefer native A3 assets for Wall Edition and warn when A4 fallback is used.',
      'Keep all participant data local in the browser.'
    ]
  };
})();

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
      pdfLibLocal: await fileExists('/public/assets/vendor/pdf-lib.min.js'),
      fontkitLocal: await fileExists('/public/assets/vendor/fontkit.umd.min.js')
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
