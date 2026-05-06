(() => {
  "use strict";

  const MOTION_SCRIPT_ID = "siteMotionScript";
  const MOTION_SCRIPT_SRC = "/assets/js/motion.js?v=9";

  function hasMotionModule() {
    return !!(
      window.__siteMotionModuleInitialized ||
      document.getElementById(MOTION_SCRIPT_ID) ||
      document.querySelector('script[src*="/assets/js/motion.js"]')
    );
  }

  function ensureMotionModule() {
    if (hasMotionModule()) return;

    const script = document.createElement("script");
    script.id = MOTION_SCRIPT_ID;
    script.src = MOTION_SCRIPT_SRC;
    script.defer = true;

    const target = document.body || document.head || document.documentElement;
    target?.appendChild(script);
  }

  ensureMotionModule();
})();
