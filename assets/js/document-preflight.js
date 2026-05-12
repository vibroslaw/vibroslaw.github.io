window.VH_DOCUMENTS = window.VH_DOCUMENTS || {};

window.VH_DOCUMENTS.preflight = (() => {
  const imageCache = new Map();

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

  return { absolute, loadImage, resolveFirst, imageSize, meetsMinimum, constrainedDevice, formatSize };
})();
