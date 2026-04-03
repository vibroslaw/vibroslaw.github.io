const pageTransition = document.getElementById("pageTransition");

const internalLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])');

internalLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (pageTransition) {
      pageTransition.classList.add("active");
    }
  });
});
