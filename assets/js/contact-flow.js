(() => {
  "use strict";

  if (window.__siteContactFlowInitialized) return;
  window.__siteContactFlowInitialized = true;

  const CONTACT_EMAIL = "peter.lichwala@gmail.com";
  const CONTACT_SUBJECTS = {
    screening: {
      en: "Screening%20/%20Licensing%20Enquiry%20-%20Vibroslaw",
      pl: "Zapytanie%20o%20pokaz%20/%20licencj%C4%99%20-%20Vibros%C5%82aw"
    },
    press: {
      en: "Press%20/%20Project%20Enquiry%20-%20Vibroslaw",
      pl: "Kontakt%20medialny%20/%20projektowy%20-%20Vibros%C5%82aw"
    },
    music: {
      en: "Music%20Use%20/%20Collaboration%20Enquiry%20-%20Vibroslaw",
      pl: "Wykorzystanie%20muzyki%20/%20wsp%C3%B3%C5%82praca%20-%20Vibros%C5%82aw"
    },
    prawda: {
      en: "Screening%20/%20Institutional%20Enquiry%20-%20Prawda%20Sumienia",
      pl: "Zapytanie%20o%20pokaz%20/%20kontekst%20instytucjonalny%20-%20Prawda%20Sumienia"
    }
  };

  function getBody() {
    return document.body;
  }

  function isPolishLanguage() {
    const body = getBody();
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    const path = normalizePath(window.location.pathname);
    return body?.dataset.lang === "pl" || htmlLang === "pl" || path === "/pl" || path.endsWith("/pl");
  }

  function getCurrentLanguageCode() {
    return isPolishLanguage() ? "pl" : "en";
  }

  function normalizePath(path) {
    return (path || "").replace(/\/+$/, "") || "/";
  }

  function getContactPageHref(lang = getCurrentLanguageCode()) {
    return lang === "pl" ? "/contact/pl/" : "/contact/";
  }

  function getContactMailHref(type = "screening", lang = getCurrentLanguageCode()) {
    const subjects = CONTACT_SUBJECTS[type] || CONTACT_SUBJECTS.screening;
    return `mailto:${CONTACT_EMAIL}?subject=${subjects[lang] || subjects.en}`;
  }

  function createContactButton(label, href, variant = "secondary") {
    const link = document.createElement("a");
    link.className = `btn btn-${variant}`;
    link.href = href;
    link.textContent = label;
    link.dataset.contactFlow = "true";
    return link;
  }

  function getOrCreateContactCtaRow(container) {
    if (!(container instanceof HTMLElement)) return null;
    let row = container.querySelector("[data-contact-flow-row]");
    if (row instanceof HTMLElement) return row;
    row = document.createElement("div");
    row.className = "cta-row compact";
    row.dataset.contactFlowRow = "true";
    container.appendChild(row);
    return row;
  }

  function hasContactHref(container, href) {
    if (!(container instanceof HTMLElement)) return false;
    return Array.from(container.querySelectorAll("a[href]")).some((link) => link.getAttribute("href") === href);
  }

  function addContactButton(container, label, href, variant = "secondary") {
    if (!(container instanceof HTMLElement) || hasContactHref(container, href)) return;
    const row = getOrCreateContactCtaRow(container);
    if (row) row.appendChild(createContactButton(label, href, variant));
  }

  function updateFirstContactMail(container, label, href) {
    if (!(container instanceof HTMLElement)) return false;
    const link = container.querySelector(`a[href^="mailto:${CONTACT_EMAIL}"]`);
    if (!(link instanceof HTMLAnchorElement)) return false;
    link.href = href;
    if (label) link.textContent = label;
    return true;
  }

  function normalizeContactNavigationLinks() {
    const contactHref = getContactPageHref();
    document.querySelectorAll('a[href="#contact"], a[href="/#contact"], a[href="/pl/#contact"]').forEach((link) => {
      if (link instanceof HTMLAnchorElement) link.href = contactHref;
    });
  }

  function enhanceContactFlow() {
    const body = getBody();
    if (!body) return;
    normalizeContactNavigationLinks();
    if (body.dataset.contactFlowEnhanced === "true") return;
    body.dataset.contactFlowEnhanced = "true";

    const lang = getCurrentLanguageCode();
    const isPl = lang === "pl";
    const path = normalizePath(window.location.pathname);
    const contactHref = getContactPageHref(lang);

    if (path === "/" || path === "/pl") {
      const panel = document.querySelector("#contact .content-panel");
      addContactButton(panel, isPl ? "Kontakt" : "Contact", contactHref, "primary");
      addContactButton(panel, isPl ? "Napisz wiadomość" : "Email Piotr / Vibrosław", getContactMailHref("screening", lang), "secondary");
      return;
    }

    if (path === "/rap-ort" || path === "/rap-ort/pl") {
      const panel = document.querySelector("#contact .content-panel");
      const mailHref = getContactMailHref("screening", lang);
      updateFirstContactMail(panel, isPl ? "Zapytaj o pokaz lub licencję" : "Request screening / licensing information", mailHref) || addContactButton(panel, isPl ? "Zapytaj o pokaz lub licencję" : "Request screening / licensing information", mailHref, "primary");
      addContactButton(panel, isPl ? "Kontakt" : "Contact page", contactHref, "secondary");
      return;
    }

    if (path.startsWith("/rap-ort/prawda-sumienia")) {
      const panel = document.querySelector("#contact .content-panel");
      const mailHref = getContactMailHref("prawda", lang);
      updateFirstContactMail(panel, isPl ? "Zapytanie o pokaz / kontekst instytucjonalny" : "Screening / institutional enquiry", mailHref) || addContactButton(panel, isPl ? "Zapytanie o pokaz / kontekst instytucjonalny" : "Screening / institutional enquiry", mailHref, "primary");
      addContactButton(panel, isPl ? "Kontakt" : "Contact page", contactHref, "secondary");
      return;
    }

    if (path.startsWith("/for-institutions")) {
      document.querySelectorAll(`a[href^="mailto:${CONTACT_EMAIL}"]`).forEach((link) => {
        if (link instanceof HTMLAnchorElement) link.href = getContactMailHref("screening", lang);
      });
      const panel = document.querySelector("#contact .content-panel");
      addContactButton(panel, isPl ? "Kontakt" : "Contact page", contactHref, "secondary");
      return;
    }

    if (path.startsWith("/press-recognition")) {
      const panel = document.querySelector("#archival .content-panel");
      const mailHref = getContactMailHref("press", lang);
      updateFirstContactMail(panel, isPl ? "Kontakt medialny / projektowy" : "Press / project enquiry", mailHref) || addContactButton(panel, isPl ? "Kontakt medialny / projektowy" : "Press / project enquiry", mailHref, "primary");
      addContactButton(panel, isPl ? "Kontakt" : "Contact page", contactHref, "secondary");
      return;
    }

    if (path.startsWith("/music-works")) {
      const panel = document.querySelector("#listen .content-panel");
      addContactButton(panel, isPl ? "Zapytanie o wykorzystanie muzyki / współpracę" : "Music use / collaboration enquiry", getContactMailHref("music", lang), "tertiary");
      if (isPl) addContactButton(panel, "Kontakt", contactHref, "secondary");
    }
  }

  function scheduleEnhancement() {
    enhanceContactFlow();
    window.setTimeout(enhanceContactFlow, 0);
    window.setTimeout(enhanceContactFlow, 250);
    window.setTimeout(enhanceContactFlow, 1000);
  }

  window.refreshContactFlow = scheduleEnhancement;

  if (document.body) {
    scheduleEnhancement();
  } else {
    document.addEventListener("DOMContentLoaded", scheduleEnhancement, { once: true });
  }

  window.addEventListener("pageshow", scheduleEnhancement);
})();
