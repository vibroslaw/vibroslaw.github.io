(() => {
  "use strict";

  const body = document.body;
  if (!body?.classList.contains("document-studio-page")) return;

  const mode = body.dataset.documentMode || "public";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clampText = (value, max = 160) => String(value || "").trim().slice(0, max);
  const isoToday = new Date().toISOString().slice(0, 10);
  const A4 = {
    landscape: { width: 3508, height: 2480, pdf: [841.89, 595.28] },
    portrait: { width: 2480, height: 3508, pdf: [595.28, 841.89] },
  };
  const anonymousReportEmail = "peter.lichwala@gmail.com";

  const assets = {
    certificateBackgrounds: {
      cinema: "/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg",
      museum: "/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg",
      ceremonial: "/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg",
      wall: "/public/assets/reports/participation-record-bg-04-wall-edition-a4.png",
    },
    certificatePreviews: {
      cinema: "/public/assets/reports/participation-record-bg-01-archival-cinema-preview.webp",
      museum: "/public/assets/reports/participation-record-bg-02-museum-line-preview.webp",
      ceremonial: "/public/assets/reports/participation-record-bg-03-ceremonial-frame-preview.webp",
      wall: "/public/assets/reports/participation-record-bg-04-wall-edition-preview.webp",
    },
    reportBackgrounds: {
      archival: "/public/assets/reports/witness-report-bg-01-archival-paper-a4.jpg",
      pilecki: "/assets/raport-swiadka/pdf/witness-report-bg-a4.png",
    },
    reportPreviews: {
      archival: "/public/assets/reports/witness-report-bg-preview.webp",
      pilecki: "/public/assets/reports/witness-report-bg-preview.webp",
    },
    texture: "/public/assets/reports/report-paper-texture.jpg",
    stamps: {
      dry: "/assets/raport-swiadka/pdf/witness-report-dry-seal.png",
      dryPreview: "/public/assets/reports/witness-report-dry-seal-preview.webp",
      eventGold: "/public/assets/reports/event-accents/event-accent-syd2026-gold.svg",
      eventDark: "/public/assets/reports/event-accents/event-accent-syd2026-dark.svg",
    },
    reportTitles: {
      en: "/public/assets/reports/title-plates/title-witness-report-dark.svg",
      pl: "/public/assets/reports/title-plates/title-raport-swiadka-dark.svg",
    },
    author: {
      gold: "/public/assets/reports/author-signature-gold.svg",
      dark: "/public/assets/reports/author-signature-dark.svg",
    },
    fonts: {
      cinzel: "/public/assets/fonts/print/cinzel/Cinzel-SemiBold.ttf",
      serif: "/public/assets/fonts/print/source-serif-4/SourceSerif4-Regular.ttf",
      typewriter: "/public/assets/fonts/print/courier-prime/CourierPrime-Regular.ttf",
      signature: "/public/assets/fonts/print/eb-garamond/EBGaramond-Italic.ttf",
    },
  };

  const defaults = {
    version: 3,
    language: "en",
    eventTitle: "Rap-Ort: Prawda Sumienia",
    eventDate: isoToday,
    eventPlace: "",
    studioPreset: "balanced",
    proofGrid: "safe",
    certificateBackground: "cinema",
    certificateStamp: "dry",
    certificateSignature: "script",
    certificateAuthorSignature: "gold",
    certificateLayout: "classic",
    certificateTitleScale: 100,
    certificateBodyScale: 100,
    certificateNameScale: 100,
    reportBackground: "archival",
    reportStamp: "dry",
    reportSignature: "typewriter",
    reportQuote: "question",
    reportLayout: "archive",
    reportTitleScale: 100,
    reportTextScale: 100,
  };

  const allowed = {
    language: ["en", "pl"],
    studioPreset: ["balanced", "ceremony", "field", "minimal"],
    proofGrid: ["off", "safe", "thirds", "print"],
    certificateBackground: Object.keys(assets.certificateBackgrounds),
    certificateStamp: ["dry", "event", "none"],
    certificateSignature: ["script", "serif", "typewriter"],
    certificateAuthorSignature: ["gold", "dark", "none"],
    certificateLayout: ["classic", "gallery", "ceremonial"],
    reportBackground: Object.keys(assets.reportBackgrounds),
    reportStamp: ["dry", "event", "none"],
    reportSignature: ["script", "serif", "typewriter"],
    reportQuote: ["question", "truth", "silence"],
    reportLayout: ["archive", "field", "compact"],
  };

  const numericFields = {
    certificateTitleScale: [88, 116],
    certificateBodyScale: [88, 112],
    certificateNameScale: [86, 118],
    reportTitleScale: [86, 116],
    reportTextScale: [88, 112],
  };

  const studioPresets = {
    balanced: {
      certificateBackground: "cinema",
      certificateStamp: "dry",
      certificateSignature: "script",
      certificateAuthorSignature: "gold",
      certificateLayout: "classic",
      certificateTitleScale: 100,
      certificateBodyScale: 100,
      certificateNameScale: 100,
      reportBackground: "archival",
      reportStamp: "dry",
      reportSignature: "typewriter",
      reportQuote: "question",
      reportLayout: "archive",
      reportTitleScale: 100,
      reportTextScale: 100,
    },
    ceremony: {
      certificateBackground: "ceremonial",
      certificateStamp: "event",
      certificateSignature: "script",
      certificateAuthorSignature: "gold",
      certificateLayout: "ceremonial",
      certificateTitleScale: 106,
      certificateBodyScale: 98,
      certificateNameScale: 108,
      reportBackground: "archival",
      reportStamp: "event",
      reportSignature: "typewriter",
      reportQuote: "truth",
      reportLayout: "field",
      reportTitleScale: 104,
      reportTextScale: 100,
    },
    field: {
      certificateBackground: "museum",
      certificateStamp: "dry",
      certificateSignature: "serif",
      certificateAuthorSignature: "dark",
      certificateLayout: "gallery",
      certificateTitleScale: 98,
      certificateBodyScale: 102,
      certificateNameScale: 100,
      reportBackground: "pilecki",
      reportStamp: "dry",
      reportSignature: "typewriter",
      reportQuote: "silence",
      reportLayout: "field",
      reportTitleScale: 96,
      reportTextScale: 104,
    },
    minimal: {
      certificateBackground: "cinema",
      certificateStamp: "none",
      certificateSignature: "serif",
      certificateAuthorSignature: "none",
      certificateLayout: "classic",
      certificateTitleScale: 96,
      certificateBodyScale: 96,
      certificateNameScale: 98,
      reportBackground: "archival",
      reportStamp: "none",
      reportSignature: "typewriter",
      reportQuote: "question",
      reportLayout: "compact",
      reportTitleScale: 94,
      reportTextScale: 98,
    },
  };

  const certificateLayouts = {
    classic: {
      label: "Classic landing",
      metaTop: 7, stampTop: 17, stampLeft: 46.75, stampWidth: 6.5,
      titleTop: 24, copyTop: 39, nameTop: 65.5, closingTop: 78, authorBottom: 6.5,
      canvas: { stampY: .17, stampW: .065, stampH: .07, titleY: .33, bodyY: .42, nameY: .695, closingY: .765, authorY: .84 },
      pdf: { stampY: 455, stampW: 54, stampH: 39, titleY: 393, bodyY: 344, nameY: 181, underlineY: 169, closingY: 137, authorY: 40 },
    },
    gallery: {
      label: "Gallery centred",
      metaTop: 7.5, stampTop: 15.5, stampLeft: 46.95, stampWidth: 6.1,
      titleTop: 22, copyTop: 37, nameTop: 67, closingTop: 80, authorBottom: 5.5,
      canvas: { stampY: .155, stampW: .061, stampH: .064, titleY: .305, bodyY: .398, nameY: .71, closingY: .79, authorY: .85 },
      pdf: { stampY: 468, stampW: 51, stampH: 36, titleY: 408, bodyY: 357, nameY: 172, underlineY: 160, closingY: 122, authorY: 34 },
    },
    ceremonial: {
      label: "Ceremonial signature",
      metaTop: 8, stampTop: 18.5, stampLeft: 46.5, stampWidth: 7,
      titleTop: 25.5, copyTop: 41, nameTop: 62.5, closingTop: 75.5, authorBottom: 7.5,
      canvas: { stampY: .185, stampW: .07, stampH: .076, titleY: .345, bodyY: .442, nameY: .67, closingY: .745, authorY: .835 },
      pdf: { stampY: 442, stampW: 58, stampH: 42, titleY: 384, bodyY: 331, nameY: 196, underlineY: 184, closingY: 149, authorY: 45 },
    },
  };

  const reportLayouts = {
    archive: {
      label: "Archive master",
      titleTop: 13.2, quoteTop: 22.5, copyTop: 34.5, linesTop: 44, linesHeight: 33.5, entryTop: 45.5, stampBottom: 8, signatureBottom: 4.8,
      canvas: { titleTop: .158, quoteY: .265, instructionY: .33, lineTop: .425, lineGap: .062, witnessY: .86, stampY: .77 },
      pdf: { titleY: 642, quoteY: 615, instructionY: 560, lineY: 484, lineGap: 52, witnessY: 118, stampY: 76 },
    },
    field: {
      label: "Field form",
      titleTop: 12, quoteTop: 21, copyTop: 32, linesTop: 41, linesHeight: 36, entryTop: 42.4, stampBottom: 7.2, signatureBottom: 4.2,
      canvas: { titleTop: .145, quoteY: .245, instructionY: .305, lineTop: .395, lineGap: .065, witnessY: .875, stampY: .765 },
      pdf: { titleY: 654, quoteY: 632, instructionY: 581, lineY: 509, lineGap: 55, witnessY: 105, stampY: 80 },
    },
    compact: {
      label: "Compact witness",
      titleTop: 11.5, quoteTop: 20, copyTop: 30.5, linesTop: 39.5, linesHeight: 35, entryTop: 41, stampBottom: 7.8, signatureBottom: 5,
      canvas: { titleTop: .135, quoteY: .235, instructionY: .292, lineTop: .382, lineGap: .061, witnessY: .855, stampY: .77 },
      pdf: { titleY: 662, quoteY: 640, instructionY: 592, lineY: 520, lineGap: 51, witnessY: 123, stampY: 78 },
    },
  };

  const copy = {
    en: {
      certificateTitle: "Certificate",
      certificateCode: "Certificate of Participation",
      certificateBody: "This document commemorates participation in the audiovisual screening of\n\"Rap-Ort: Prawda Sumienia\"\n\nan authorial experience of music, image, words and silence,\ndevoted to memory, testimony, conscience\nand human responsibility before truth.",
      certificateClosing: "A commemorative trace of an event in which history becomes a question the participant carries forward.",
      dateField: "Date",
      placeField: "Place",
      reportTitle: "Witness Report",
      reportCode: "Personal record / post-screening trace",
      reportInstruction: "This is not a knowledge test or an official document. It is a personal trace of reflection after the screening.",
      reportPlaceholder: "Write the words that remain after the screening...",
      participant: "Participant name",
      witness: "Witness signature",
      anonymous: "Anonymous witness",
      missingName: "Enter the name for the Certificate.",
      missingReport: "Write a few words for the Witness Report.",
      reportOverflow: "The report exceeds six printable lines. Shorten it before export.",
      preparing: "Building the print master...",
      ready: "Your print-ready document has been downloaded.",
      linkReady: "The participant link is ready.",
      copied: "Link copied.",
      shareReady: "The anonymous report is ready to send.",
      shareFallback: "The anonymous JPG was downloaded and your email app was opened. Attach the downloaded file to send it.",
      shareCancelled: "Sharing was cancelled. Your report remains on this device.",
      shareTitle: "Anonymous Witness Report",
      shareText: "Anonymous Witness Report generated locally after the Rap-Ort screening. The attached copy contains no name or signature.",
      publicHeading: "Your trace after the screening",
      publicLead: "The design and event details have already been approved. Add only the personal information you choose; generation happens locally on this device.",
      publicNote: "No name, report text or generated document is sent to a server. Anonymous sharing creates a clean copy without a name or signature.",
      publicPrivacy: "Generated locally. Anonymous copies contain no name or signature.",
      privacyTitle: "Nothing leaves this device",
      certificateFormTitle: "Create Certificate",
      certificateFormCopy: "Enter the name that should appear on the approved certificate.",
      reportFormTitle: "Write the Witness Report",
      reportFormCopy: "Six lines, like an old field report. Write only what remains with you after the screening.",
      nameLabel: "Name",
      reportLabel: "Report",
      reportNameLabel: "Name - optional",
      certificateTab: "Certificate",
      reportTab: "Witness Report",
      writeView: "Write",
      previewView: "Preview",
      savePdf: "Save PDF",
      saveJpg: "Save JPG",
      saveAnonymous: "Save anonymous PDF",
      sendAnonymous: "Send anonymous report",
      proofKicker: "Live proof",
      proofLocal: "Local",
      proofReady: "Print ready",
      proofFooterOne: "Lightweight live proof",
      proofFooterTwo: "Full print masters load on export",
      fullProof: "Full proof",
      closeProof: "Close proof",
      fit: "Fit",
      generatedLocally: "Generated locally",
      privateDefault: "Private by default",
      lineLabel: "lines",
      characterLabel: "characters",
      workspaceLabel: "Workspace view",
      documentChoiceLabel: "Choose document",
      proofLabel: "Live document proof",
      authorAlt: "Author signature",
      zoomOut: "Zoom out",
      zoomIn: "Zoom in",
      pdfFallback: "Vector PDF was unavailable; a high-resolution PDF was created instead.",
    },
    pl: {
      certificateTitle: "Certyfikat",
      certificateCode: "Certyfikat uczestnictwa",
      certificateBody: "Dokument upamiętnia uczestnictwo w audiowizualnym pokazie\n\"Rap-Ort: Prawda Sumienia\"\n\nautorskim doświadczeniu muzyki, obrazu, słowa i ciszy,\npoświęconym pamięci, świadectwu, sumieniu\ni odpowiedzialności człowieka wobec prawdy.",
      certificateClosing: "Pamiątkowy ślad wydarzenia, w którym historia staje się pytaniem niesionym dalej przez uczestnika.",
      dateField: "Data",
      placeField: "Miejsce",
      reportTitle: "Raport Świadka",
      reportCode: "Osobisty zapis / ślad po projekcji",
      reportInstruction: "To nie jest test wiedzy ani dokument urzędowy. To osobisty ślad refleksji po projekcji.",
      reportPlaceholder: "Zapisz słowa, które pozostają po projekcji...",
      participant: "Imię i nazwisko uczestnika",
      witness: "Podpis świadka",
      anonymous: "Świadek anonimowy",
      missingName: "Wpisz imię i nazwisko do Certyfikatu.",
      missingReport: "Wpisz kilka słów do Raportu Świadka.",
      reportOverflow: "Raport przekracza sześć linii druku. Skróć tekst przed eksportem.",
      preparing: "Tworzenie pliku do druku...",
      ready: "Dokument do druku został pobrany.",
      linkReady: "Link dla uczestnika jest gotowy.",
      copied: "Link skopiowany.",
      shareReady: "Anonimowy raport jest gotowy do wysłania.",
      shareFallback: "Anonimowy JPG został pobrany, a program pocztowy otwarty. Dołącz pobrany plik, aby go wysłać.",
      shareCancelled: "Udostępnianie anulowano. Raport pozostał na tym urządzeniu.",
      shareTitle: "Anonimowy Raport Świadka",
      shareText: "Anonimowy Raport Świadka utworzony lokalnie po projekcji Rap-Ort. Załączona kopia nie zawiera imienia ani podpisu.",
      publicHeading: "Twój ślad po projekcji",
      publicLead: "Projekt i dane wydarzenia zostały zatwierdzone. Dodaj tylko wybrane dane osobiste; dokument powstaje lokalnie na tym urządzeniu.",
      publicNote: "Imię, treść raportu i wygenerowany dokument nie są wysyłane na serwer. Udostępnianie anonimowe tworzy czystą kopię bez imienia i podpisu.",
      publicPrivacy: "Dokument powstaje lokalnie. Anonimowe kopie nie zawierają imienia ani podpisu.",
      privacyTitle: "Nic nie opuszcza tego urządzenia",
      certificateFormTitle: "Utwórz Certyfikat",
      certificateFormCopy: "Wpisz imię i nazwisko, które ma znaleźć się na zatwierdzonym certyfikacie.",
      reportFormTitle: "Napisz Raport Świadka",
      reportFormCopy: "Sześć linii jak w dawnym raporcie terenowym. Zapisz tylko to, co pozostało po projekcji.",
      nameLabel: "Imię i nazwisko",
      reportLabel: "Raport",
      reportNameLabel: "Imię i nazwisko - opcjonalnie",
      certificateTab: "Certyfikat",
      reportTab: "Raport Świadka",
      writeView: "Pisz",
      previewView: "Podgląd",
      savePdf: "Zapisz PDF",
      saveJpg: "Zapisz JPG",
      saveAnonymous: "Zapisz anonimowy PDF",
      sendAnonymous: "Wyślij anonimowy raport",
      proofKicker: "Podgląd na żywo",
      proofLocal: "Lokalnie",
      proofReady: "Gotowy do druku",
      proofFooterOne: "Lekki podgląd ekranowy",
      proofFooterTwo: "Pełne pliki są ładowane przy eksporcie",
      fullProof: "Pełny podgląd",
      closeProof: "Zamknij podgląd",
      fit: "Dopasuj",
      generatedLocally: "Tworzone lokalnie",
      privateDefault: "Domyślnie prywatne",
      lineLabel: "linii",
      characterLabel: "znaków",
      workspaceLabel: "Widok obszaru roboczego",
      documentChoiceLabel: "Wybierz dokument",
      proofLabel: "Podgląd dokumentu na żywo",
      authorAlt: "Podpis autora",
      zoomOut: "Pomniejsz",
      zoomIn: "Powiększ",
      pdfFallback: "Wersja wektorowa była niedostępna; utworzono PDF wysokiej rozdzielczości.",
    },
  };

  const quoteCopy = {
    en: {
      question: "The testimony has been spoken. Now the question remains with you.",
      truth: "Truth does not end on the screen. It remains in the decision a human being makes afterwards.",
      silence: "The silence after testimony is not empty. It is the place where conscience begins to work.",
    },
    pl: {
      question: "Świadectwo zostało wypowiedziane. Teraz pytanie zostaje przy Tobie.",
      truth: "Prawda nie kończy się na ekranie. Zostaje w decyzji, którą człowiek podejmuje później.",
      silence: "Cisza po świadectwie nie jest pustką. Jest miejscem, w którym zaczyna pracować sumienie.",
    },
  };

  function sanitizeConfig(raw = {}) {
    const next = { ...defaults };
    Object.keys(allowed).forEach((key) => {
      if (allowed[key].includes(raw[key])) next[key] = raw[key];
    });
    Object.entries(numericFields).forEach(([key, [min, max]]) => {
      const number = Number(raw[key]);
      next[key] = Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : defaults[key];
    });
    next.eventTitle = clampText(raw.eventTitle || defaults.eventTitle, 90);
    next.eventDate = /^\d{4}-\d{2}-\d{2}$/.test(raw.eventDate || "") ? raw.eventDate : defaults.eventDate;
    next.eventPlace = clampText(raw.eventPlace, 140);
    return next;
  }

  function encodeConfig(value) {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decodeConfig(value) {
    try {
      const base64 = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return sanitizeConfig(JSON.parse(new TextDecoder().decode(bytes)));
    } catch {
      return sanitizeConfig();
    }
  }

  let config = mode === "admin"
    ? sanitizeConfig(JSON.parse(localStorage.getItem("vhDocumentStudioIssue") || "{}"))
    : decodeConfig(new URLSearchParams(location.search).get("issue"));
  let activeType = "certificate";
  let proofZoom = 1;
  let reportOverflow = false;
  let exporting = false;
  const status = $("[data-document-status]");
  const imageCache = new Map();
  const bytesCache = new Map();
  let pdfLibrariesReady;
  let documentToken = createDocumentToken();

  const C = () => copy[config.language];
  const setStatus = (message) => { if (status) status.textContent = message || ""; };
  const dateLabel = () => {
    if (!config.eventDate) return "";
    return new Intl.DateTimeFormat(config.language === "pl" ? "pl-PL" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${config.eventDate}T12:00:00`));
  };
  function eventInitials() {
    const source = (config.eventPlace || config.eventTitle || "EVENT").split(/[\/|]/)[0];
    const words = source.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").match(/[A-Za-z0-9]+/g) || [];
    const initials = words.slice(0, 6).map((word) => word[0]).join("").toUpperCase();
    return initials || "EVT";
  }

  function createDocumentToken() {
    const now = new Date();
    const pad = (value, width = 2) => String(value).padStart(width, "0");
    const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`;
    const random = new Uint32Array(1);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(random);
    else random[0] = Math.floor(Math.random() * 0xffffffff);
    return { date, time, serial: String(random[0]).padStart(10, "0") };
  }

  function renewDocumentNumber() {
    documentToken = createDocumentToken();
    return issueNumber();
  }

  const issueNumber = () => `VH/${eventInitials()}/${documentToken.date}/${documentToken.time}/${documentToken.serial}`;
  const certificateBackground = () => assets.certificateBackgrounds[config.certificateBackground];
  const certificatePreview = () => assets.certificatePreviews[config.certificateBackground];
  const reportBackground = () => assets.reportBackgrounds[config.reportBackground];
  const reportPreview = () => assets.reportPreviews[config.reportBackground];
  const percent = (value) => `${value}%`;
  const scaleValue = (key) => Number(config[key] || 100) / 100;
  const certificateLayout = () => certificateLayouts[config.certificateLayout] || certificateLayouts.classic;
  const reportLayout = () => reportLayouts[config.reportLayout] || reportLayouts.archive;

  function syncEditorTools() {
    body.dataset.proofGrid = mode === "admin" ? config.proofGrid : "off";
    $$("[data-range-output]").forEach((output) => {
      const key = output.dataset.rangeOutput;
      output.textContent = `${config[key] || defaults[key]}%`;
    });
  }

  function ensureGridLayer(sheet) {
    if (mode !== "admin") return;
    if (!sheet || sheet.querySelector(".document-editor-grid")) return;
    const layer = document.createElement("span");
    layer.className = "document-editor-grid";
    layer.setAttribute("aria-hidden", "true");
    sheet.appendChild(layer);
  }

  function applySheetLayout(sheet, type) {
    if (!sheet) return;
    ensureGridLayer(sheet);
    const style = sheet.style;
    if (type === "certificate") {
      const layout = certificateLayout();
      sheet.dataset.layout = config.certificateLayout;
      style.setProperty("--cert-meta-top", percent(layout.metaTop));
      style.setProperty("--cert-stamp-top", percent(layout.stampTop));
      style.setProperty("--cert-stamp-left", percent(layout.stampLeft));
      style.setProperty("--cert-stamp-width", percent(layout.stampWidth));
      style.setProperty("--cert-title-top", percent(layout.titleTop));
      style.setProperty("--cert-copy-top", percent(layout.copyTop));
      style.setProperty("--cert-name-top", percent(layout.nameTop));
      style.setProperty("--cert-closing-top", percent(layout.closingTop));
      style.setProperty("--cert-author-bottom", percent(layout.authorBottom));
      style.setProperty("--cert-title-scale", scaleValue("certificateTitleScale").toFixed(2));
      style.setProperty("--cert-body-scale", scaleValue("certificateBodyScale").toFixed(2));
      style.setProperty("--cert-name-scale", scaleValue("certificateNameScale").toFixed(2));
      return;
    }
    const layout = reportLayout();
    sheet.dataset.layout = config.reportLayout;
    style.setProperty("--report-title-top", percent(layout.titleTop));
    style.setProperty("--report-quote-top", percent(layout.quoteTop));
    style.setProperty("--report-copy-top", percent(layout.copyTop));
    style.setProperty("--report-lines-top", percent(layout.linesTop));
    style.setProperty("--report-lines-height", percent(layout.linesHeight));
    style.setProperty("--report-entry-top", percent(layout.entryTop));
    style.setProperty("--report-stamp-bottom", percent(layout.stampBottom));
    style.setProperty("--report-signature-bottom", percent(layout.signatureBottom));
    style.setProperty("--report-title-scale", scaleValue("reportTitleScale").toFixed(2));
    style.setProperty("--report-text-scale", scaleValue("reportTextScale").toFixed(2));
  }

  function stampAsset(type, preview = false) {
    const selection = type === "certificate" ? config.certificateStamp : config.reportStamp;
    if (selection === "none") return "";
    if (selection === "event") return type === "certificate" ? assets.stamps.eventGold : assets.stamps.eventDark;
    return preview ? assets.stamps.dryPreview : assets.stamps.dry;
  }

  function authorAsset(type) {
    if (type !== "certificate") return "";
    const selection = config.certificateAuthorSignature;
    return selection === "none" ? "" : assets.author[selection];
  }

  function setImageSource(image, src) {
    if (!image) return;
    if (!src) {
      image.hidden = true;
      image.removeAttribute("src");
      return;
    }
    if (image.getAttribute("src") !== src) image.src = src;
    image.hidden = false;
  }

  function updateSheetText(sheet, type) {
    if (!sheet) return;
    const cert = type === "certificate";
    const code = $("[data-preview-code]", sheet);
    const title = $("[data-preview-title]", sheet);
    const date = $("[data-preview-date]", sheet);
    const place = $("[data-preview-place]", sheet);
    const sheetCopy = $("[data-preview-copy]", sheet);
    const closing = $("[data-preview-closing]", sheet);
    if (code) code.textContent = issueNumber();
    if (title) title.textContent = cert ? C().certificateTitle : C().reportTitle;
    if (date) date.textContent = dateLabel();
    if (place) place.textContent = config.eventPlace || config.eventTitle;
    if (sheetCopy) sheetCopy.textContent = cert ? C().certificateBody : C().reportInstruction;
    if (closing) closing.textContent = C().certificateClosing;
    $$("[data-date-label]", sheet).forEach((node) => { node.textContent = C().dateField; });
    $$("[data-place-label]", sheet).forEach((node) => { node.textContent = C().placeField; });
    if (!cert) {
      const quote = $("[data-preview-quote]", sheet);
      if (quote) quote.textContent = quoteCopy[config.language][config.reportQuote];
    }
  }

  function activateSheetAssets(sheet, type) {
    if (!sheet) return;
    const cert = type === "certificate";
    applySheetLayout(sheet, type);
    sheet.style.setProperty("--document-background", `url('${cert ? certificatePreview() : reportPreview()}')`);
    setImageSource($("[data-preview-stamp]", sheet), stampAsset(type, true));
    setImageSource($("[data-preview-author]", sheet), cert ? authorAsset(type) : "");
  }

  function wrapLines(ctx, text, maxWidth) {
    const paragraphs = String(text || "").split(/\n/);
    const lines = [];
    paragraphs.forEach((paragraph) => {
      if (!paragraph) { lines.push(""); return; }
      const words = paragraph.trim().split(/\s+/);
      let line = "";
      words.forEach((word) => {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);
    });
    return lines;
  }

  function reportLineCount(text) {
    if (!String(text || "").trim()) return 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${60 * scaleValue("reportTextScale")}px DocTypewriter, monospace`;
    return wrapLines(ctx, text, 2066).length;
  }

  function updateReportMeter() {
    const area = $('[name="reportText"]');
    if (!area) return;
    const text = area.value.trim();
    const lines = reportLineCount(text);
    reportOverflow = lines > 6;
    const meter = $(".document-report-meter");
    const lineNode = $("[data-report-lines]");
    const characterNode = $("[data-report-characters]");
    if (lineNode) lineNode.textContent = `${lines} / 6 ${C().lineLabel}`;
    if (characterNode) characterNode.textContent = `${area.value.length} / 620 ${C().characterLabel}`;
    if (meter) meter.classList.toggle("is-overflow", reportOverflow);
    area.setAttribute("aria-invalid", String(reportOverflow));
    $$('[data-export^="report"]').forEach((button) => { button.disabled = exporting || reportOverflow; });
  }

  function updatePreview() {
    $$('[data-document-preview="certificate"]').forEach((sheet) => updateSheetText(sheet, "certificate"));
    $$('[data-document-preview="report"]').forEach((sheet) => updateSheetText(sheet, "report"));
    const certificateName = $('[name="certificateName"]')?.value.trim() || C().participant;
    const reportText = $('[name="reportText"]')?.value.trim() || C().reportPlaceholder;
    $$('[data-document-preview="certificate"] [data-preview-name]').forEach((node) => { node.textContent = certificateName; });
    $$('[data-document-preview="report"] [data-preview-entry]').forEach((node) => { node.textContent = reportText; });
    $$('[data-document-preview="report"] [data-preview-signature-label]').forEach((node) => { node.textContent = C().witness; });
    const reportName = $('[name="reportName"]')?.value.trim() || C().witness;
    $$('[data-document-preview="report"] [data-preview-witness]').forEach((node) => { node.textContent = reportName; });
    $$('[data-document-preview]').forEach((sheet) => {
      const isActive = sheet.dataset.documentPreview === activeType;
      sheet.hidden = !isActive;
      if (isActive) activateSheetAssets(sheet, activeType);
    });
    syncEditorTools();
    updateReportMeter();
  }

  function updateProofTitle() {
    const title = $("[data-proof-title]");
    if (!title) return;
    title.textContent = activeType === "certificate"
      ? `${C().certificateTitle} / A4 landscape`
      : `${C().reportTitle} / A4 portrait`;
  }

  function switchType(type) {
    activeType = type === "report" ? "report" : "certificate";
    body.dataset.documentType = activeType;
    $$('[data-document-tab]').forEach((button) => button.setAttribute("aria-selected", String(button.dataset.documentTab === activeType)));
    $$('[data-document-settings]').forEach((fieldset) => {
      if (fieldset.dataset.documentSettings !== "shared") fieldset.hidden = fieldset.dataset.documentSettings !== activeType;
    });
    $$('[data-document-panel]').forEach((panel) => { panel.hidden = panel.dataset.documentPanel !== activeType; });
    updateProofTitle();
    updatePreview();
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value;
  }

  function applyPublicLanguage() {
    document.documentElement.lang = config.language;
    body.dataset.lang = config.language;
    document.title = `${C().certificateTitle} & ${C().reportTitle} - Rap-Ort`;
    const pairs = [
      ["[data-public-heading]", C().publicHeading], ["[data-public-lead]", C().publicLead],
      ["[data-public-note]", C().publicNote], ["[data-privacy-title]", C().privacyTitle],
      ["[data-public-privacy]", C().publicPrivacy],
      ["[data-certificate-form-title]", C().certificateFormTitle], ["[data-certificate-form-copy]", C().certificateFormCopy],
      ["[data-report-form-title]", C().reportFormTitle], ["[data-report-form-copy]", C().reportFormCopy],
      ["[data-name-label]", C().nameLabel], ["[data-report-label]", C().reportLabel],
      ["[data-report-name-label]", C().reportNameLabel], ["[data-save-pdf]", C().savePdf],
      ["[data-save-jpg]", C().saveJpg], ["[data-save-report]", C().savePdf],
      ["[data-save-anonymous]", C().saveAnonymous], ["[data-share-anonymous]", C().sendAnonymous],
      ["[data-proof-kicker]", C().proofKicker], ["[data-proof-local]", C().proofLocal],
      ["[data-proof-ready]", C().proofReady], ["[data-proof-footer-one]", C().proofFooterOne],
      ["[data-proof-footer-two]", C().proofFooterTwo], ["[data-quality-local]", C().generatedLocally],
      ["[data-quality-private]", C().privateDefault], ["[data-document-tab=\"certificate\"]", C().certificateTab],
      ["[data-document-tab=\"report\"]", C().reportTab], ["[data-document-view-button=\"edit\"]", C().writeView],
      ["[data-document-view-button=\"preview\"]", C().previewView], ["[data-proof-zoom=\"fit\"]", C().fit],
      ["[data-proof-fullscreen]", C().fullProof],
    ];
    pairs.forEach(([selector, value]) => setText(selector, value));
    $("[data-view-switch-label]")?.setAttribute("aria-label", C().workspaceLabel);
    $(".document-tabs")?.setAttribute("aria-label", C().documentChoiceLabel);
    $("[data-proof-shell]")?.setAttribute("aria-label", C().proofLabel);
    $$('[data-preview-author]').forEach((image) => image.alt = C().authorAlt);
    $("[data-proof-zoom=\"out\"]")?.setAttribute("aria-label", C().zoomOut);
    $("[data-proof-zoom=\"in\"]")?.setAttribute("aria-label", C().zoomIn);
    const reportArea = $('[name="reportText"]');
    if (reportArea) reportArea.placeholder = C().reportPlaceholder;
  }

  function readAdminForm(form) {
    const data = new FormData(form);
    const next = {};
    Object.keys(defaults).forEach((key) => {
      next[key] = data.has(key) ? data.get(key) : config[key];
    });
    config = sanitizeConfig(next);
    localStorage.setItem("vhDocumentStudioIssue", JSON.stringify(config));
    syncVisualOptions();
    syncEditorTools();
    updatePreview();
  }

  function fillAdminForm(form) {
    Object.entries(config).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = value;
    });
  }

  function applyStudioPresetToForm(form, name) {
    const preset = studioPresets[name];
    if (!form || !preset) return;

    Object.entries(preset).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (!field) return;
      field.value = value;
    });
  }

  const visualOptions = {
    certificateBackground: [
      ["cinema", "Archival Cinema", assets.certificatePreviews.cinema],
      ["museum", "Museum Line", assets.certificatePreviews.museum],
      ["ceremonial", "Ceremonial Frame", assets.certificatePreviews.ceremonial],
      ["wall", "Wall Edition", assets.certificatePreviews.wall],
    ],
    reportBackground: [
      ["archival", "Archival Paper", assets.reportPreviews.archival],
      ["pilecki", "Historical Report", assets.reportPreviews.pilecki],
    ],
  };

  function enhanceVisualSelect(name) {
    const select = $(`[name="${name}"]`);
    if (!select || select.dataset.visualEnhanced === "true") return;
    select.dataset.visualEnhanced = "true";
    select.classList.add("document-sr-only");
    select.closest("label")?.classList.add("document-visual-select-label");
    const group = document.createElement("div");
    group.className = "document-visual-options";
    group.dataset.visualOptions = name;
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", select.closest("label")?.querySelector("span")?.textContent || name);
    visualOptions[name].forEach(([value, label, preview]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "document-visual-option";
      button.dataset.visualValue = value;
      button.style.backgroundImage = `url('${preview}')`;
      button.innerHTML = `<span>${label}</span>`;
      button.addEventListener("click", () => {
        select.value = value;
        select.dispatchEvent(new Event("input", { bubbles: true }));
      });
      group.appendChild(button);
    });
    select.closest("label")?.after(group);
  }

  function syncVisualOptions() {
    Object.keys(visualOptions).forEach((name) => {
      const value = $(`[name="${name}"]`)?.value;
      $$(`[data-visual-options="${name}"] [data-visual-value]`).forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.visualValue === value));
      });
    });
  }

  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    if (imageCache.has(src)) return imageCache.get(src);
    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Could not load image: ${src}`));
      image.src = src;
    });
    imageCache.set(src, promise);
    return promise;
  }

  function fetchBytes(src) {
    if (bytesCache.has(src)) return bytesCache.get(src);
    const promise = fetch(src).then((response) => {
      if (!response.ok) throw new Error(`Could not load asset: ${src}`);
      return response.arrayBuffer();
    });
    bytesCache.set(src, promise);
    return promise;
  }

  function loadScript(src, ready) {
    if (ready()) return Promise.resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      return new Promise((resolve, reject) => {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  function ensurePdfLibraries() {
    if (pdfLibrariesReady) return pdfLibrariesReady;
    pdfLibrariesReady = Promise.all([
      loadScript("/public/assets/vendor/pdf-lib.min.js", () => Boolean(window.PDFLib?.PDFDocument)),
      loadScript("/public/assets/vendor/fontkit.umd.min.js", () => Boolean(window.fontkit)),
    ]);
    return pdfLibrariesReady;
  }

  function drawCover(ctx, image, width, height) {
    if (!image) return;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  }

  function drawContained(ctx, image, x, y, width, height, alpha = 1) {
    if (!image) return;
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, x + (width - image.naturalWidth * scale) / 2, y + (height - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale);
    ctx.restore();
  }

  function drawTextureOverlay(ctx, texture, width, height, alpha = .14) {
    if (!texture) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "soft-light";
    drawCover(ctx, texture, width, height);
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = alpha * .42;
    drawCover(ctx, texture, width, height);
    ctx.restore();
  }

  function drawFinishedTitle(ctx, text, x, y, { size, font = "DocCinzel, serif", light, mid, shadow, maxWidth } = {}) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = `${size}px ${font}`;
    ctx.lineJoin = "round";
    ctx.shadowColor = shadow;
    ctx.shadowBlur = Math.max(5, size * .11);
    ctx.shadowOffsetX = Math.max(1, size * .025);
    ctx.shadowOffsetY = Math.max(2, size * .045);
    ctx.strokeStyle = shadow;
    ctx.lineWidth = Math.max(1.5, size * .035);
    ctx.strokeText(text, x, y, maxWidth);
    const gradient = ctx.createLinearGradient(0, y - size, 0, y + size * .25);
    gradient.addColorStop(0, light);
    gradient.addColorStop(.48, mid);
    gradient.addColorStop(1, shadow);
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, y, maxWidth);
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = .58;
    ctx.fillStyle = light;
    ctx.fillText(text, x - size * .009, y - size * .018, maxWidth);
    ctx.restore();
  }

  function drawSeal25D(ctx, image, x, y, width, height, alpha = .88, dark = false) {
    if (!image) return;
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;
    ctx.save();
    ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
    ctx.rotate(-1.4 * Math.PI / 180);
    ctx.globalAlpha = .24;
    ctx.fillStyle = dark ? "#090704" : "#5b4429";
    ctx.shadowColor = dark ? "rgba(0,0,0,.78)" : "rgba(50,34,17,.48)";
    ctx.shadowBlur = width * .075;
    ctx.shadowOffsetX = width * .035;
    ctx.shadowOffsetY = width * .055;
    ctx.beginPath();
    ctx.ellipse(0, drawHeight * .04, drawWidth * .42, drawHeight * .4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = alpha;
    ctx.filter = `drop-shadow(${Math.max(2, width * .012)}px ${Math.max(3, width * .022)}px ${Math.max(4, width * .025)}px rgba(0,0,0,.62)) drop-shadow(-${Math.max(1, width * .006)}px -${Math.max(1, width * .008)}px ${Math.max(2, width * .01)}px rgba(255,255,255,.42))`;
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }

  function setCanvasFontToFit(ctx, text, maxSize, minSize, maxWidth, fontFactory) {
    let size = maxSize;
    do {
      ctx.font = fontFactory(size);
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 1;
    } while (size > minSize);
    ctx.font = fontFactory(minSize);
    return minSize;
  }

  function drawPremiumRule(ctx, x1, x2, y, width) {
    const gradient = ctx.createLinearGradient(x1, y, x2, y);
    gradient.addColorStop(0, "rgba(124,82,26,.18)");
    gradient.addColorStop(.18, "rgba(244,218,151,.9)");
    gradient.addColorStop(.5, "rgba(180,128,50,.98)");
    gradient.addColorStop(.82, "rgba(244,218,151,.9)");
    gradient.addColorStop(1, "rgba(124,82,26,.18)");
    ctx.save();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(2, width * .0012);
    ctx.shadowColor = "rgba(216,172,82,.38)";
    ctx.shadowBlur = width * .004;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = .5;
    ctx.lineWidth = Math.max(1, width * .00035);
    ctx.beginPath();
    ctx.moveTo(x1 + width * .003, y + width * .0022);
    ctx.lineTo(x2 - width * .003, y + width * .0022);
    ctx.stroke();
    ctx.restore();
  }

  function drawTypewriterInk(ctx, text, x, y) {
    ctx.save();
    ctx.globalAlpha = .93;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = .1;
    ctx.fillText(text, x + .8, y + .45);
    ctx.restore();
  }

  function drawCenteredLines(ctx, lines, x, y, lineHeight) {
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  }

  let fontsReady;
  function ensureFonts() {
    if (fontsReady) return fontsReady;
    const definitions = [
      ["DocCinzel", assets.fonts.cinzel], ["DocSerif", assets.fonts.serif],
      ["DocTypewriter", assets.fonts.typewriter], ["DocSignature", assets.fonts.signature],
    ];
    fontsReady = Promise.all(definitions.map(async ([family, url]) => {
      try {
        const face = await new FontFace(family, `url(${url})`).load();
        document.fonts.add(face);
      } catch {
        // Browser fallback remains available.
      }
    }));
    return fontsReady;
  }

  const signatureFont = (value, size) => value === "typewriter"
    ? `${size}px DocTypewriter, monospace`
    : value === "serif" ? `${size}px DocSerif, serif` : `italic ${size}px DocSignature, serif`;

  async function renderCertificate({ name, documentNumber = issueNumber(), width = A4.landscape.width } = {}) {
    await ensureFonts();
    const height = Math.round(width / 1.414);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const [background, texture, stamp, author] = await Promise.all([
      loadImage(certificateBackground()),
      loadImage(assets.texture).catch(() => null),
      loadImage(stampAsset("certificate")).catch(() => null),
      loadImage(authorAsset("certificate")).catch(() => null),
    ]);
    const layout = certificateLayout().canvas;
    const titleScale = scaleValue("certificateTitleScale");
    const bodyScale = scaleValue("certificateBodyScale");
    const nameScale = scaleValue("certificateNameScale");
    drawCover(ctx, background, width, height);
    drawTextureOverlay(ctx, texture, width, height, .13);
    const shade = ctx.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, "rgba(6,5,3,.18)");
    shade.addColorStop(.54, "rgba(6,5,3,.1)");
    shade.addColorStop(1, "rgba(6,5,3,.54)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(221,190,122,.38)";
    ctx.lineWidth = width * .0008;
    ctx.strokeRect(width * .047, height * .066, width * .906, height * .868);

    ctx.textAlign = "center";
    ctx.fillStyle = "#d9bd7e";
    setCanvasFontToFit(ctx, documentNumber, Math.round(width * .011), Math.round(width * .0075), width * .56, (size) => `700 ${size}px DocCinzel, serif`);
    ctx.fillText(documentNumber, width / 2, height * .115);

    const metaWidth = width * .27;
    const metaLeft = width * .13;
    const metaRight = width * .87;
    ctx.fillStyle = "rgba(221,190,122,.78)";
    ctx.font = `700 ${Math.round(width * .008)}px DocCinzel, serif`;
    ctx.textAlign = "left";
    ctx.fillText(C().dateField.toUpperCase(), metaLeft, height * .15);
    ctx.textAlign = "right";
    ctx.fillText(C().placeField.toUpperCase(), metaRight, height * .15);
    ctx.fillStyle = "#f7e9c4";
    ctx.textAlign = "left";
    setCanvasFontToFit(ctx, dateLabel(), Math.round(width * .012), Math.round(width * .009), metaWidth, (size) => `${size}px DocSerif, serif`);
    ctx.fillText(dateLabel(), metaLeft, height * .177);
    ctx.textAlign = "right";
    const placeText = config.eventPlace || config.eventTitle;
    setCanvasFontToFit(ctx, placeText, Math.round(width * .012), Math.round(width * .008), metaWidth, (size) => `${size}px DocSerif, serif`);
    ctx.fillText(placeText, metaRight, height * .177);
    drawPremiumRule(ctx, metaLeft, metaLeft + metaWidth, height * .188, width);
    drawPremiumRule(ctx, metaRight - metaWidth, metaRight, height * .188, width);

    drawSeal25D(ctx, stamp, width * ((1 - layout.stampW) / 2), height * layout.stampY, width * layout.stampW, height * layout.stampH, .92, true);
    drawFinishedTitle(ctx, C().certificateTitle.toUpperCase(), width / 2, height * layout.titleY, {
      size: Math.round(width * .052 * titleScale), light: "#fff4cf", mid: "#dfc17d", shadow: "#5b421d", maxWidth: width * .7,
    });
    ctx.fillStyle = "rgba(245,230,196,.82)";
    const bodySize = Math.round(width * .014 * bodyScale);
    ctx.font = `${bodySize}px DocSerif, serif`;
    drawCenteredLines(ctx, wrapLines(ctx, C().certificateBody, width * .62).slice(0, 9), width / 2, height * layout.bodyY, height * .03 * bodyScale);
    ctx.fillStyle = "#fff4d5";
    const participantName = name || C().participant;
    const nameSize = setCanvasFontToFit(ctx, participantName, Math.round(width * .041 * nameScale), Math.round(width * .021), width * .58, (size) => signatureFont(config.certificateSignature, size));
    ctx.fillText(participantName, width / 2, height * layout.nameY);
    const nameWidth = Math.min(ctx.measureText(participantName).width + nameSize * 1.2, width * .62);
    drawPremiumRule(ctx, width / 2 - nameWidth / 2, width / 2 + nameWidth / 2, height * (layout.nameY + .021), width);
    ctx.fillStyle = "rgba(245,230,196,.72)";
    ctx.font = `${Math.round(width * .012 * bodyScale)}px DocSerif, serif`;
    drawCenteredLines(ctx, wrapLines(ctx, C().certificateClosing, width * .54).slice(0, 3), width / 2, height * layout.closingY, height * .024 * bodyScale);
    drawContained(ctx, author, width * .39, height * layout.authorY, width * .22, height * .095, .96);
    return canvas;
  }

  async function renderReport({ text, name, anonymous = false, documentNumber = issueNumber(), width = A4.portrait.width } = {}) {
    await ensureFonts();
    const height = Math.round(width * 1.414);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const [background, texture, stamp, titlePlate] = await Promise.all([
      loadImage(reportBackground()), loadImage(assets.texture).catch(() => null),
      loadImage(stampAsset("report")).catch(() => null), loadImage(assets.reportTitles[config.language]).catch(() => null),
    ]);
    const layout = reportLayout().canvas;
    const titleScale = scaleValue("reportTitleScale");
    const textScale = scaleValue("reportTextScale");
    drawCover(ctx, background, width, height);
    if (texture) {
      drawTextureOverlay(ctx, texture, width, height, .2);
    }
    ctx.fillStyle = "rgba(245,235,207,.12)";
    ctx.fillRect(0, 0, width, height);
    const margin = width * .09;
    ctx.strokeStyle = "rgba(63,47,28,.64)";
    ctx.lineWidth = width * .0015;
    ctx.strokeRect(margin * .58, margin * .58, width - margin * 1.16, height - margin * 1.16);

    ctx.fillStyle = "#2a2117";
    ctx.textAlign = "center";
    setCanvasFontToFit(ctx, documentNumber, Math.round(width * .013), Math.round(width * .009), width * .76, (size) => `700 ${size}px DocTypewriter, monospace`);
    drawTypewriterInk(ctx, documentNumber, width / 2, height * .062);

    const metaColumn = width * .34;
    ctx.font = `700 ${Math.round(width * .012)}px DocTypewriter, monospace`;
    ctx.textAlign = "left";
    drawTypewriterInk(ctx, `${C().dateField.toUpperCase()}:`, margin, height * .095);
    ctx.textAlign = "right";
    drawTypewriterInk(ctx, `${C().placeField.toUpperCase()}:`, width - margin, height * .095);
    ctx.textAlign = "left";
    setCanvasFontToFit(ctx, dateLabel(), Math.round(width * .016), Math.round(width * .011), metaColumn, (size) => `${size}px DocTypewriter, monospace`);
    drawTypewriterInk(ctx, dateLabel(), margin, height * .125);
    ctx.textAlign = "right";
    const placeText = config.eventPlace || config.eventTitle;
    setCanvasFontToFit(ctx, placeText, Math.round(width * .016), Math.round(width * .01), metaColumn, (size) => `${size}px DocTypewriter, monospace`);
    drawTypewriterInk(ctx, placeText, width - margin, height * .125);
    ctx.strokeStyle = "rgba(28,22,16,.85)";
    ctx.lineWidth = Math.max(2, width * .0011);
    ctx.beginPath();
    ctx.moveTo(margin, height * .14);
    ctx.lineTo(margin + metaColumn, height * .14);
    ctx.moveTo(width - margin - metaColumn, height * .14);
    ctx.lineTo(width - margin, height * .14);
    ctx.stroke();

    const titleWidth = width * Math.min(.76, .64 * titleScale);
    const titleHeight = height * Math.min(.1, .08 * titleScale);
    drawContained(ctx, titlePlate, (width - titleWidth) / 2, height * layout.titleTop, titleWidth, titleHeight, .96);
    if (anonymous) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(42,33,23,.72)";
      ctx.font = `700 ${Math.round(width * .011)}px DocTypewriter, monospace`;
      drawTypewriterInk(ctx, C().anonymous.toUpperCase(), width / 2, height * (layout.titleTop + .072));
    }
    ctx.font = `700 ${Math.round(width * .019)}px DocTypewriter, monospace`;
    ctx.fillStyle = "#5a472f";
    ctx.textAlign = "center";
    drawCenteredLines(ctx, wrapLines(ctx, quoteCopy[config.language][config.reportQuote], width * .72).slice(0, 3), width / 2, height * layout.quoteY, height * .026);
    ctx.fillStyle = "#33291d";
    ctx.font = `${Math.round(width * .015)}px DocTypewriter, monospace`;
    drawCenteredLines(ctx, wrapLines(ctx, C().reportInstruction, width * .78).slice(0, 4), width / 2, height * layout.instructionY, height * .022);

    const lineTop = height * layout.lineTop;
    const lineGap = height * layout.lineGap;
    ctx.strokeStyle = "rgba(61,46,29,.44)";
    ctx.lineWidth = Math.max(1.5, width * .0008);
    for (let index = 0; index < 6; index += 1) {
      const y = lineTop + index * lineGap;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "#241d15";
    ctx.font = `${Math.round(width * .024 * textScale)}px DocTypewriter, monospace`;
    const reportLines = wrapLines(ctx, text || C().reportPlaceholder, width - margin * 2.1);
    if (reportLines.length > 6) throw new Error(C().reportOverflow);
    reportLines.forEach((line, index) => drawTypewriterInk(ctx, line, margin * 1.05, lineTop - lineGap * .22 + index * lineGap));

    ctx.fillStyle = "#2c2319";
    ctx.font = `700 ${Math.round(width * .016)}px DocTypewriter, monospace`;
    ctx.textAlign = "right";
    const witnessName = anonymous ? C().anonymous : (name || C().witness);
    const witnessSize = setCanvasFontToFit(ctx, witnessName, Math.round(width * .027), Math.round(width * .017), width * .42, (size) => signatureFont(config.reportSignature, size));
    ctx.fillText(witnessName, width - margin, height * layout.witnessY);
    const witnessWidth = Math.min(ctx.measureText(witnessName).width + witnessSize, width * .43);
    ctx.strokeStyle = "rgba(28,22,16,.78)";
    ctx.beginPath();
    ctx.moveTo(width - margin - witnessWidth, height * (layout.witnessY + .015));
    ctx.lineTo(width - margin, height * (layout.witnessY + .015));
    ctx.stroke();
    ctx.font = `700 ${Math.round(width * .011)}px DocTypewriter, monospace`;
    drawTypewriterInk(ctx, C().witness.toUpperCase(), width - margin, height * (layout.witnessY + .04));
    drawSeal25D(ctx, stamp, margin * .82, height * layout.stampY, width * .18, height * .14, .74, false);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(46,35,24,.7)";
    ctx.font = `${Math.round(width * .011)}px DocTypewriter, monospace`;
    drawTypewriterInk(ctx, anonymous ? "ANONYMOUS COPY - NO PERSONAL DATA" : C().reportCode.toUpperCase(), width / 2, height * .958);
    return canvas;
  }

  function safeFileName(value) {
    return String(value || "document").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 90);
  }

  function canvasBlob(canvas, type = "image/jpeg", quality = .96) {
    return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not create image file.")), type, quality));
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function shareAnonymousReport(blob, fileName) {
    const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
    const shareData = { title: C().shareTitle, text: C().shareText, files: [file] };
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share(shareData);
        setStatus(C().shareReady);
        return true;
      } catch (error) {
        if (error?.name === "AbortError") {
          setStatus(C().shareCancelled);
          return false;
        }
      }
    }
    downloadBlob(blob, fileName);
    const subject = encodeURIComponent(C().shareTitle);
    const bodyText = `${C().shareText}\n\n${C().shareFallback}`;
    window.location.href = `mailto:${anonymousReportEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    setStatus(C().shareFallback);
    return true;
  }

  async function rasterizeToPng(src, targetWidth = 1200) {
    const image = await loadImage(src);
    const ratio = image.naturalHeight / image.naturalWidth || 1;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = Math.max(1, Math.round(targetWidth * ratio));
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return (await canvasBlob(canvas, "image/png")).arrayBuffer();
  }

  async function embedPdfImage(pdf, src) {
    if (!src) return null;
    if (/\.jpe?g(?:$|\?)/i.test(src)) return pdf.embedJpg(await fetchBytes(src));
    if (/\.png(?:$|\?)/i.test(src)) return pdf.embedPng(await fetchBytes(src));
    return pdf.embedPng(await rasterizeToPng(src));
  }

  function pdfContained(page, image, x, y, width, height, opacity = 1) {
    if (!image) return;
    const scale = Math.min(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    page.drawImage(image, { x: x + (width - drawWidth) / 2, y: y + (height - drawHeight) / 2, width: drawWidth, height: drawHeight, opacity });
  }

  function pdfCentered(page, text, font, size, y, color) {
    const width = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (page.getWidth() - width) / 2, y, size, font, color });
  }

  function pdfFinishedTitle(page, text, font, size, y, colors) {
    const width = font.widthOfTextAtSize(text, size);
    const x = (page.getWidth() - width) / 2;
    page.drawText(text, { x: x + 1.7, y: y - 1.8, size, font, color: colors.shadow, opacity: .76 });
    page.drawText(text, { x: x - .55, y: y + .7, size, font, color: colors.highlight, opacity: .62 });
    page.drawText(text, { x, y, size, font, color: colors.main });
  }

  function pdfSeal25D(page, image, x, y, width, height, opacity, shadowColor) {
    if (!image) return;
    page.drawEllipse({
      x: x + width * .52, y: y + height * .43, xScale: width * .37, yScale: height * .34,
      color: shadowColor, opacity: .18,
    });
    pdfContained(page, image, x + 1.8, y - 2.2, width, height, opacity * .24);
    pdfContained(page, image, x, y, width, height, opacity);
  }

  function pdfRight(page, text, font, size, x, y, color) {
    page.drawText(text, { x: x - font.widthOfTextAtSize(text, size), y, size, font, color });
  }

  function pdfSizeToFit(font, text, maxSize, minSize, maxWidth) {
    let size = maxSize;
    while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) size -= .5;
    return size;
  }

  function pdfPremiumRule(page, x1, x2, y, palette) {
    page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: 1.15, color: palette.gold, opacity: .92 });
    page.drawLine({ start: { x: x1 + 2, y: y - 1.7 }, end: { x: x2 - 2, y: y - 1.7 }, thickness: .35, color: palette.ivory, opacity: .5 });
  }

  function pdfWrap(font, text, size, maxWidth) {
    const lines = [];
    String(text || "").split(/\n/).forEach((paragraph) => {
      if (!paragraph) { lines.push(""); return; }
      const words = paragraph.trim().split(/\s+/);
      let line = "";
      words.forEach((word) => {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);
    });
    return lines;
  }

  async function createVectorPdf(type, data) {
    await ensurePdfLibraries();
    if (!window.PDFLib?.PDFDocument || !window.fontkit) throw new Error("Vector PDF support unavailable");
    const { PDFDocument, rgb } = window.PDFLib;
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(window.fontkit);
    const [cinzelBytes, serifBytes, typewriterBytes, signatureBytes] = await Promise.all([
      fetchBytes(assets.fonts.cinzel), fetchBytes(assets.fonts.serif), fetchBytes(assets.fonts.typewriter), fetchBytes(assets.fonts.signature),
    ]);
    const [cinzel, serif, typewriter, signature] = await Promise.all([
      pdf.embedFont(cinzelBytes, { subset: true }), pdf.embedFont(serifBytes, { subset: true }),
      pdf.embedFont(typewriterBytes, { subset: true }), pdf.embedFont(signatureBytes, { subset: true }),
    ]);
    const palette = {
      gold: rgb(.84, .70, .42), ivory: rgb(.96, .90, .76), ink: rgb(.16, .13, .09), brown: rgb(.35, .28, .18),
    };

    if (type === "certificate") {
      const [width, height] = A4.landscape.pdf;
      const page = pdf.addPage([width, height]);
      const [background, texture, stamp, author] = await Promise.all([
        embedPdfImage(pdf, certificateBackground()), embedPdfImage(pdf, assets.texture), embedPdfImage(pdf, stampAsset("certificate")), embedPdfImage(pdf, authorAsset("certificate")),
      ]);
      const layout = certificateLayout().pdf;
      const titleScale = scaleValue("certificateTitleScale");
      const bodyScale = scaleValue("certificateBodyScale");
      const nameScale = scaleValue("certificateNameScale");
      page.drawImage(background, { x: 0, y: 0, width, height });
      if (texture) page.drawImage(texture, { x: 0, y: 0, width, height, opacity: .12 });
      page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(.02, .018, .012), opacity: .24 });
      page.drawRectangle({ x: 40, y: 38, width: width - 80, height: height - 76, borderColor: palette.gold, borderWidth: 1, opacity: .74 });
       const documentNumber = data.documentNumber || issueNumber();
       const numberSize = pdfSizeToFit(cinzel, documentNumber, 8.5, 6.2, 475);
       pdfCentered(page, documentNumber, cinzel, numberSize, 520, palette.gold);
       const metaLeft = 110;
       const metaRight = width - 110;
       const metaWidth = 220;
       page.drawText(C().dateField.toUpperCase(), { x: metaLeft, y: 503, size: 6.5, font: cinzel, color: palette.gold, opacity: .88 });
       pdfRight(page, C().placeField.toUpperCase(), cinzel, 6.5, metaRight, 503, palette.gold);
       const dateSize = pdfSizeToFit(serif, dateLabel(), 9.5, 7.2, metaWidth);
       page.drawText(dateLabel(), { x: metaLeft, y: 484, size: dateSize, font: serif, color: palette.ivory });
       const placeText = config.eventPlace || config.eventTitle;
       const placeSize = pdfSizeToFit(serif, placeText, 9.5, 6.8, metaWidth);
       pdfRight(page, placeText, serif, placeSize, metaRight, 484, palette.ivory);
       pdfPremiumRule(page, metaLeft, metaLeft + metaWidth, 476, palette);
       pdfPremiumRule(page, metaRight - metaWidth, metaRight, 476, palette);
       pdfSeal25D(page, stamp, width / 2 - layout.stampW / 2, layout.stampY, layout.stampW, layout.stampH, .92, rgb(.01, .008, .004));
       pdfFinishedTitle(page, C().certificateTitle.toUpperCase(), cinzel, 43 * titleScale, layout.titleY, {
         highlight: rgb(1, .96, .82), main: rgb(.9, .77, .5), shadow: rgb(.25, .16, .06),
       });
       const bodySize = 11.5 * bodyScale;
       const bodyLines = pdfWrap(serif, C().certificateBody, bodySize, 520).slice(0, 9);
       bodyLines.forEach((line, index) => pdfCentered(page, line, serif, bodySize, layout.bodyY - index * 16.5 * bodyScale, palette.ivory));
       const nameFont = config.certificateSignature === "typewriter" ? typewriter : config.certificateSignature === "serif" ? serif : signature;
       const participantName = data.name || C().participant;
       const nameSize = pdfSizeToFit(nameFont, participantName, 31 * nameScale, 18, 490);
       pdfCentered(page, participantName, nameFont, nameSize, layout.nameY, palette.ivory);
       const nameWidth = Math.min(nameFont.widthOfTextAtSize(participantName, nameSize) + nameSize * 1.2, 520);
       pdfPremiumRule(page, width / 2 - nameWidth / 2, width / 2 + nameWidth / 2, layout.underlineY, palette);
       const closingSize = 9.5 * bodyScale;
       const closingLines = pdfWrap(serif, C().certificateClosing, closingSize, 470).slice(0, 3);
       closingLines.forEach((line, index) => pdfCentered(page, line, serif, closingSize, layout.closingY - index * 12.5 * bodyScale, palette.ivory));
       pdfContained(page, author, width / 2 - 78, layout.authorY, 156, 57, .96);
     } else {
      const [width, height] = A4.portrait.pdf;
      const page = pdf.addPage([width, height]);
       const [background, texture, stamp, titlePlate] = await Promise.all([
         embedPdfImage(pdf, reportBackground()), embedPdfImage(pdf, assets.texture), embedPdfImage(pdf, stampAsset("report")), embedPdfImage(pdf, assets.reportTitles[config.language]),
       ]);
       const layout = reportLayout().pdf;
       const titleScale = scaleValue("reportTitleScale");
       const textScale = scaleValue("reportTextScale");
      page.drawImage(background, { x: 0, y: 0, width, height });
      if (texture) page.drawImage(texture, { x: 0, y: 0, width, height, opacity: .19 });
      page.drawRectangle({ x: 31, y: 30, width: width - 62, height: height - 60, borderColor: palette.brown, borderWidth: 1.1, opacity: .82 });
       const documentNumber = data.documentNumber || issueNumber();
       const numberSize = pdfSizeToFit(typewriter, documentNumber, 7.5, 5.8, 450);
       pdfCentered(page, documentNumber, typewriter, numberSize, 790, palette.ink);
       page.drawText(`${C().dateField.toUpperCase()}:`, { x: 53, y: 762, size: 7, font: typewriter, color: palette.ink });
       pdfRight(page, `${C().placeField.toUpperCase()}:`, typewriter, 7, width - 53, 762, palette.ink);
       const metaWidth = 205;
       const dateSize = pdfSizeToFit(typewriter, dateLabel(), 9, 6.8, metaWidth);
       page.drawText(dateLabel(), { x: 53, y: 737, size: dateSize, font: typewriter, color: palette.ink });
       const placeText = config.eventPlace || config.eventTitle;
       const placeSize = pdfSizeToFit(typewriter, placeText, 9, 6.2, metaWidth);
       pdfRight(page, placeText, typewriter, placeSize, width - 53, 737, palette.ink);
       page.drawLine({ start: { x: 53, y: 725 }, end: { x: 53 + metaWidth, y: 725 }, thickness: 1, color: palette.ink, opacity: .9 });
       page.drawLine({ start: { x: width - 53 - metaWidth, y: 725 }, end: { x: width - 53, y: 725 }, thickness: 1, color: palette.ink, opacity: .9 });
       const titleWidth = Math.min(440, 381 * titleScale);
       const titleHeight = Math.min(82, 67 * titleScale);
       pdfContained(page, titlePlate, (width - titleWidth) / 2, layout.titleY, titleWidth, titleHeight, .98);
       if (data.anonymous) pdfCentered(page, C().anonymous.toUpperCase(), typewriter, 7.2, layout.titleY - 7, palette.brown);
       const quoteLines = pdfWrap(typewriter, quoteCopy[config.language][config.reportQuote], 10.5, 420).slice(0, 4);
       quoteLines.forEach((line, index) => pdfCentered(page, line, typewriter, 10.5, layout.quoteY - index * 14, palette.brown));
       const instructionLines = pdfWrap(typewriter, C().reportInstruction, 8.5, 450).slice(0, 4);
       instructionLines.forEach((line, index) => pdfCentered(page, line, typewriter, 8.5, layout.instructionY - index * 12.5, palette.ink));
       const reportSize = 13.5 * textScale;
       const reportLines = pdfWrap(typewriter, data.text || C().reportPlaceholder, reportSize, 465);
       if (reportLines.length > 6) throw new Error(C().reportOverflow);
       for (let index = 0; index < 6; index += 1) {
         const y = layout.lineY - index * layout.lineGap;
         page.drawLine({ start: { x: 53, y }, end: { x: width - 53, y }, thickness: .65, color: palette.brown, opacity: .55 });
         if (reportLines[index]) page.drawText(reportLines[index], { x: 58, y: y + 10, size: reportSize, font: typewriter, color: palette.ink });
       }
       const witnessName = data.anonymous ? C().anonymous : (data.name || C().witness);
       const nameFont = config.reportSignature === "typewriter" ? typewriter : config.reportSignature === "serif" ? serif : signature;
       const witnessSize = pdfSizeToFit(nameFont, witnessName, 15, 10, 220);
       pdfRight(page, witnessName, nameFont, witnessSize, width - 53, layout.witnessY, palette.ink);
       const witnessWidth = Math.min(nameFont.widthOfTextAtSize(witnessName, witnessSize) + witnessSize, 225);
       page.drawLine({ start: { x: width - 53 - witnessWidth, y: layout.witnessY - 13 }, end: { x: width - 53, y: layout.witnessY - 13 }, thickness: .9, color: palette.ink, opacity: .85 });
       pdfRight(page, C().witness.toUpperCase(), typewriter, 6.8, width - 53, layout.witnessY - 34, palette.ink);
       pdfSeal25D(page, stamp, 49, layout.stampY, 108, 86, .74, rgb(.24, .16, .08));
       pdfCentered(page, data.anonymous ? "ANONYMOUS COPY - NO PERSONAL DATA" : C().reportCode.toUpperCase(), typewriter, 7.2, 47, palette.brown);
    }

    pdf.setTitle(type === "certificate" ? C().certificateTitle : C().reportTitle);
    pdf.setAuthor("Piotr Lichwała / Veritas Humanum");
    pdf.setCreator("Veritas Humanum Document Studio");
    pdf.setProducer("Veritas Humanum Document Studio");
    pdf.setCreationDate(new Date());
    return new Blob([await pdf.save()], { type: "application/pdf" });
  }

  async function saveRasterPdf(canvas, fileName) {
    await ensurePdfLibraries();
    if (!window.PDFLib?.PDFDocument) throw new Error("PDF library unavailable");
    const pdf = await window.PDFLib.PDFDocument.create();
    const jpgBytes = await (await canvasBlob(canvas, "image/jpeg", .97)).arrayBuffer();
    const image = await pdf.embedJpg(jpgBytes);
    const pageSize = canvas.width > canvas.height ? A4.landscape.pdf : A4.portrait.pdf;
    const page = pdf.addPage(pageSize);
    page.drawImage(image, { x: 0, y: 0, width: pageSize[0], height: pageSize[1] });
    pdf.setTitle(fileName.replace(/-/g, " "));
    pdf.setCreator("Veritas Humanum Document Studio");
    downloadBlob(new Blob([await pdf.save()], { type: "application/pdf" }), `${fileName}.pdf`);
  }

  function setBusy(value) {
    exporting = value;
    body.classList.toggle("document-exporting", value);
    $$('[data-export]').forEach((button) => {
      button.disabled = value || (button.dataset.export.startsWith("report") && reportOverflow);
    });
  }

  async function downloadPdf(type, data, base) {
    try {
      downloadBlob(await createVectorPdf(type, data), `${base}.pdf`);
    } catch (error) {
      if (error.message === C().reportOverflow) throw error;
      console.warn("Vector PDF generation failed; using high-resolution fallback.", error);
       const canvas = type === "certificate"
         ? await renderCertificate({ name: data.name, documentNumber: data.documentNumber })
         : await renderReport({ text: data.text, name: data.name, anonymous: data.anonymous, documentNumber: data.documentNumber });
      await saveRasterPdf(canvas, base);
    }
  }

  async function handleExport(action) {
    const certificateName = $('[name="certificateName"]')?.value.trim() || "";
    const reportText = $('[name="reportText"]')?.value.trim() || "";
    const reportName = $('[name="reportName"]')?.value.trim() || "";
    if (action.startsWith("certificate") && !certificateName) {
      setStatus(C().missingName);
      $('[name="certificateName"]')?.focus();
      return;
    }
    if (action.startsWith("report") && !reportText) {
      setStatus(C().missingReport);
      $('[name="reportText"]')?.focus();
      return;
    }
    if (action.startsWith("report") && reportOverflow) {
      setStatus(C().reportOverflow);
      $('[name="reportText"]')?.focus();
      return;
    }
    setBusy(true);
    setStatus(C().preparing);
    try {
      const documentNumber = renewDocumentNumber();
      updatePreview();
      if (action.startsWith("certificate")) {
        const base = safeFileName(`${documentNumber}-${C().certificateTitle}-${certificateName}`);
        if (action.endsWith("pdf")) {
          await downloadPdf("certificate", { name: certificateName, documentNumber }, base);
        } else {
          const canvas = await renderCertificate({ name: certificateName, documentNumber });
          downloadBlob(await canvasBlob(canvas), `${base}.jpg`);
        }
        setStatus(C().ready);
        return;
      }
      const anonymous = action.includes("anonymous") || action.includes("share");
      const base = safeFileName(`${documentNumber}-${C().reportTitle}-${anonymous ? "anonymous" : reportName || "witness"}`);
      if (action === "report-share") {
        const canvas = await renderReport({ text: reportText, name: "", anonymous: true, documentNumber, width: 1600 });
        const blob = await canvasBlob(canvas, "image/jpeg", .92);
        await shareAnonymousReport(blob, `${base}.jpg`);
        return;
      }
      if (action.endsWith("pdf")) {
        await downloadPdf("report", { text: reportText, name: reportName, anonymous, documentNumber }, base);
      } else {
        const canvas = await renderReport({ text: reportText, name: reportName, anonymous, documentNumber });
        downloadBlob(await canvasBlob(canvas, "image/jpeg", .96), `${base}.jpg`);
      }
      setStatus(C().ready);
    } catch (error) {
      console.error("Document Studio export failed", error);
      setStatus(error.message || "Could not generate the document.");
    } finally {
      setBusy(false);
    }
  }

  function setDocumentView(view) {
    const next = view === "preview" ? "preview" : "edit";
    body.dataset.documentView = next;
    $$('[data-document-view-button]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.documentViewButton === next)));
  }

  function installWorkspaceControls() {
    $$('[data-document-view-button]').forEach((button) => button.addEventListener("click", () => setDocumentView(button.dataset.documentViewButton)));
    $$('[data-proof-zoom]').forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.proofZoom;
      proofZoom = action === "fit" ? 1 : Math.min(1.3, Math.max(.75, proofZoom + (action === "in" ? .1 : -.1)));
      $$('[data-proof-stage]').forEach((stage) => stage.style.setProperty("--proof-zoom", proofZoom.toFixed(2)));
    }));
    $$('[data-proof-fullscreen]').forEach((button) => button.addEventListener("click", async () => {
      const shell = button.closest(".document-proof-shell");
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (shell?.requestFullscreen) {
        try { await shell.requestFullscreen(); return; } catch { /* use fixed fallback */ }
      }
      shell?.classList.toggle("is-proof-open");
      button.textContent = shell?.classList.contains("is-proof-open") ? C().closeProof : C().fullProof;
    }));
    document.addEventListener("fullscreenchange", () => {
      $$('[data-proof-fullscreen]').forEach((button) => { button.textContent = document.fullscreenElement ? C().closeProof : C().fullProof; });
    });
  }

  function restorePublicDraft() {
    const issue = new URLSearchParams(location.search).get("issue") || "default";
    const key = `vhDocumentDraft:${issue.slice(0, 64)}`;
    try {
      const draft = JSON.parse(sessionStorage.getItem(key) || "{}");
      ["certificateName", "reportText", "reportName"].forEach((name) => {
        const field = $(`[name="${name}"]`);
        if (field && typeof draft[name] === "string") field.value = draft[name];
      });
    } catch {
      sessionStorage.removeItem(key);
    }
    return () => {
      const draft = {};
      ["certificateName", "reportText", "reportName"].forEach((name) => { draft[name] = $(`[name="${name}"]`)?.value || ""; });
      sessionStorage.setItem(key, JSON.stringify(draft));
    };
  }

  $$('[data-document-tab]').forEach((button) => button.addEventListener("click", () => switchType(button.dataset.documentTab)));
  installWorkspaceControls();

  if (mode === "admin") {
    const form = $("[data-document-admin-form]");
    fillAdminForm(form);
    enhanceVisualSelect("certificateBackground");
    enhanceVisualSelect("reportBackground");
    syncVisualOptions();
    form.addEventListener("input", (event) => {
      if (event.target?.name === "studioPreset") {
        applyStudioPresetToForm(form, event.target.value);
      }
      readAdminForm(form);
    });
    $("[data-create-public-link]")?.addEventListener("click", () => {
      readAdminForm(form);
      const url = new URL("/rap-ort/documents/", location.origin);
      url.searchParams.set("issue", encodeConfig(config));
      const result = $("[data-share-result]");
      const input = $("[data-share-url]");
      const open = $("[data-open-share-link]");
      input.value = url.href;
      open.href = url.href;
      result.hidden = false;
      setStatus(C().linkReady);
    });
    $("[data-copy-share-link]")?.addEventListener("click", async () => {
      const value = $("[data-share-url]")?.value;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        $("[data-share-url]").select();
        document.execCommand("copy");
      }
      setStatus(C().copied);
    });
    $("[data-reset-document]")?.addEventListener("click", () => {
      config = sanitizeConfig();
      fillAdminForm(form);
      localStorage.removeItem("vhDocumentStudioIssue");
      syncVisualOptions();
      syncEditorTools();
      updatePreview();
      setStatus("");
    });
  } else {
    applyPublicLanguage();
    const saveDraft = restorePublicDraft();
    $$('[name="certificateName"], [name="reportText"], [name="reportName"]').forEach((field) => field.addEventListener("input", () => {
      saveDraft();
      updatePreview();
    }));
    $$('[data-export]').forEach((button) => button.addEventListener("click", () => handleExport(button.dataset.export)));
  }

  switchType("certificate");
  updatePreview();
})();
