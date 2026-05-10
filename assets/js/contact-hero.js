(() => {
  "use strict";

  if (window.__veritasContactHeroPatch) return;
  window.__veritasContactHeroPatch = true;

  const STYLE_ID = "veritasContactHeroPositionPatch";

  function isContactPage() {
    return document.body && /^contact-/.test(document.body.dataset.page || "");
  }

  function applyContactHeroPosition() {
    if (!isContactPage()) return;

    const previous = document.getElementById(STYLE_ID);
    if (previous) previous.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body[data-page^="contact-"] .vh-hero-media,
      body[data-page^="contact-"] .vh-hero-media.has-final-hero,
      body[data-page^="contact-"].final-hero-ready .vh-hero-media.has-final-hero{
        background-position:center 72%!important;
      }
      body[data-page^="contact-"] .vh-hero-media::before,
      body[data-page^="contact-"].final-hero-ready .vh-hero-media.has-final-hero::before{
        background-position:center 72%,center 72%,center 72%,center 72%!important;
        transform:translate3d(0,calc(var(--vh-parallax,0px) * .20),0) scale(1.035)!important;
      }
      body.cinematic-mode[data-page^="contact-"] .vh-hero-media.has-final-hero::before,
      body.cinematic-mode[data-page^="contact-"].final-hero-ready .vh-hero-media.has-final-hero::before{
        background-position:center 74%,center 74%,center 74%,center 74%!important;
        transform:translate3d(0,calc(var(--vh-parallax,0px) * .34),0) scale(1.06)!important;
      }
      @media(max-width:760px){
        body[data-page^="contact-"] .vh-hero-media,
        body[data-page^="contact-"] .vh-hero-media.has-final-hero,
        body[data-page^="contact-"].final-hero-ready .vh-hero-media.has-final-hero{background-position:center 78%!important;}
        body[data-page^="contact-"] .vh-hero-media::before,
        body[data-page^="contact-"].final-hero-ready .vh-hero-media.has-final-hero::before{background-position:center 78%,center 78%,center 78%,center 78%!important;}
      }
    `;
    document.head.appendChild(style);
  }

  function schedule() {
    applyContactHeroPosition();
    requestAnimationFrame(applyContactHeroPosition);
    setTimeout(applyContactHeroPosition, 80);
    setTimeout(applyContactHeroPosition, 420);
    setTimeout(applyContactHeroPosition, 1000);
  }

  if (document.body) schedule();
  document.addEventListener("DOMContentLoaded", schedule, { once: true });
  window.addEventListener("load", schedule);
  window.addEventListener("pageshow", schedule);
  document.addEventListener("site:cinematic-change", schedule);
  document.addEventListener("site:reduced-motion-change", schedule);

  if (window.MutationObserver) {
    const observer = new MutationObserver(schedule);
    if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
})();
