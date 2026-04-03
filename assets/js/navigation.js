const mobileNavToggle = document.getElementById("mobileNavToggle");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

function closeMobileMenu() {
  document.body.classList.remove("mobile-menu-open");
}

if (mobileNavToggle) {
  mobileNavToggle.addEventListener("click", () => {
    document.body.classList.toggle("mobile-menu-open");
  });
}

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener("click", (e) => {
    if (e.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobileMenu();
  }
});
