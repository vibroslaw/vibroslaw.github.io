(() => {
  const reduceKeys = ["siteReducedMotion", "reduceMotion", "reducedMotion"];
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const storedReduced = reduceKeys.map((key) => localStorage.getItem(key)).find((value) => value !== null);
  const reducedByPreference = storedReduced === "true" || (storedReduced === undefined && prefersReduced);
  const isPolish = document.documentElement.lang === "pl" || document.body?.dataset.lang === "pl";
  const reducedLabel = () => (isPolish ? "Ruch ograniczony" : "Motion Reduced");
  const reduceLabel = () => (isPolish ? "Ogranicz ruch" : "Reduce Motion");

  if (reducedByPreference) {
    document.body.classList.add("reduce-motion", "reduced-motion");
  }

  const reducedActive = () =>
    document.body.classList.contains("reduce-motion") || document.body.classList.contains("reduced-motion");

  const setReduced = (active) => {
    document.body.classList.toggle("reduce-motion", active);
    document.body.classList.toggle("reduced-motion", active);
    reduceKeys.forEach((key) => localStorage.setItem(key, String(active)));
    document.querySelectorAll("[data-reduce-motion-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(active));
      button.textContent = active ? reducedLabel() : reduceLabel();
    });
  };

  document.querySelectorAll("[data-reduce-motion-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(reducedActive()));
    button.textContent = reducedActive() ? reducedLabel() : reduceLabel();
    button.addEventListener("click", () => setReduced(!reducedActive()));
  });

  const onScroll = () => {
    if (reducedActive() || !document.body.classList.contains("cinematic-mode")) {
      document.documentElement.style.setProperty("--vh-parallax", "0px");
      return;
    }
    document.documentElement.style.setProperty("--vh-parallax", `${Math.min(window.scrollY, 800) * 0.08}px`);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealItems = [...document.querySelectorAll(".reveal")];
  if (revealItems.length) {
    if (reducedActive() || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      revealItems.forEach((item) => observer.observe(item));
    }
  }

  const modal = document.getElementById("manifestoModal");
  if (modal) {
    const frame = modal.querySelector("[data-manifesto-frame]");
    const placeholder = isPolish
      ? '<div class="manifesto-placeholder"><p>Film-manifest Veritas Humanum jest w przygotowaniu.</p><p>Wkrótce pojawi się tutaj krótki prolog do autorskiego świata Piotra Lichwały / Vibrosław.</p></div>'
      : '<div class="manifesto-placeholder"><p>The Veritas Humanum manifesto film is in preparation.</p><p>A short cinematic prologue to the authorial world of Piotr Lichwała / Vibrosław will appear here soon.</p></div>';

    const closeModal = () => {
      modal.setAttribute("aria-hidden", "true");
      if (frame) frame.innerHTML = placeholder;
      document.body.classList.remove("modal-open");
    };

    const openModal = (button) => {
      const id = button?.getAttribute("data-youtube-id") || modal.getAttribute("data-youtube-id") || "";
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      if (frame) {
        frame.innerHTML = id
          ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(
              id,
            )}?autoplay=1&rel=0" title="Veritas Humanum Manifesto Film" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
          : placeholder;
      }
      modal.querySelector(".manifesto-close")?.focus();
    };

    document.querySelectorAll("[data-open-manifesto]").forEach((button) => {
      button.addEventListener("click", () => openModal(button));
    });
    modal.querySelectorAll("[data-close-manifesto]").forEach((button) => {
      button.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
    });
  }

  const witnessForm = document.querySelector("[data-witness-form]");
  if (witnessForm) {
    const field = (name) => witnessForm.querySelector(`[name="${name}"]`);
    const preview = {
      name: document.querySelector("[data-witness-name]"),
      place: document.querySelector("[data-witness-place]"),
      date: document.querySelector("[data-witness-date]"),
      quote: document.querySelector("[data-witness-quote]"),
      reflection: document.querySelector("[data-witness-reflection]"),
      signature: document.querySelector("[data-witness-signature]"),
    };

    const updatePreview = () => {
      const first = field("firstName")?.value.trim() || "";
      const last = field("lastName")?.value.trim() || "";
      const fullName = `${first} ${last}`.trim();
      if (preview.name) preview.name.textContent = fullName || witnessForm.dataset.defaultName || "Participant";
      if (preview.signature) preview.signature.textContent = fullName || witnessForm.dataset.defaultSignature || "Signature";
      if (preview.place) preview.place.textContent = field("place")?.value.trim() || witnessForm.dataset.defaultPlace || "Place / institution";
      if (preview.date) preview.date.textContent = field("date")?.value || new Date().toISOString().slice(0, 10);
      if (preview.quote) preview.quote.textContent = field("quote")?.value || witnessForm.dataset.defaultQuote || "Truth does not need noise. It needs to be heard.";
      if (preview.reflection) preview.reflection.textContent = field("reflection")?.value.trim() || witnessForm.dataset.defaultReflection || "Your reflection will appear here.";
    };

    witnessForm.addEventListener("input", updatePreview);
    witnessForm.addEventListener("change", updatePreview);
    updatePreview();

    witnessForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = witnessForm.querySelector(".form-status");
      if (status) status.textContent = witnessForm.dataset.printMessage || "Opening print dialog. Save as PDF from your browser if needed.";
      window.print();
    });
  }
})();
