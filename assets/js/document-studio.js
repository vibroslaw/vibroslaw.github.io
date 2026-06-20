(() => {
  "use strict";

  const body = document.body;
  if (!body?.classList.contains("document-studio-page")) return;

  const mode = body.dataset.documentMode || "public";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const cssEscape = (value) => window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/["\\]/g, "\\$&");
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
  const clampText = (value, max = 160) => String(value || "").trim().slice(0, max);
  const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));
  const cloneData = (value) => JSON.parse(JSON.stringify(value));
  const isoToday = new Date().toISOString().slice(0, 10);
  const A4 = {
    landscape: { width: 3508, height: 2480, pdf: [841.89, 595.28] },
    portrait: { width: 2480, height: 3508, pdf: [595.28, 841.89] },
  };
  const anonymousReportEmail = "peter.lichwala@gmail.com";
  const presetStorageKey = "vhDocumentStudioPresets";

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

  const fragmentBox = (x, y, w, h, align = "center", valign = "center", z = 30) => ({
    x, y, w, h, align, valign, z, locked: false, hidden: false,
  });

  const layoutFragmentDefaults = {
    certificate: {
      code: fragmentBox(23, 8.6, 54, 3.2, "center", "center", 10),
      meta: fragmentBox(11, 12.8, 78, 7.5, "center", "top", 20),
      stamp: fragmentBox(46.75, 17, 6.5, 7.4, "center", "center", 50),
      title: fragmentBox(11, 24, 78, 10, "center", "center", 40),
      body: fragmentBox(24, 39, 52, 19, "center", "top", 30),
      name: fragmentBox(25, 65.5, 50, 8.2, "center", "center", 60),
      closing: fragmentBox(27, 78, 46, 6.8, "center", "center", 70),
      author: fragmentBox(39, 83.4, 22, 9.5, "center", "center", 80),
    },
    report: {
      code: fragmentBox(13, 4.4, 74, 3.2, "center", "center", 10),
      meta: fragmentBox(9, 9.5, 82, 6.6, "center", "top", 20),
      title: fragmentBox(13, 15.4, 74, 8.2, "center", "center", 30),
      quote: fragmentBox(10, 25.6, 80, 7.5, "center", "top", 40),
      instruction: fragmentBox(10, 34.5, 80, 7, "center", "top", 50),
      lines: fragmentBox(9, 44, 82, 33.5, "left", "top", 60),
      entry: fragmentBox(10, 45.5, 80, 31, "left", "top", 70),
      signature: fragmentBox(45, 86.5, 46, 7.5, "right", "bottom", 80),
      stamp: fragmentBox(8, 79.5, 18, 12, "center", "center", 90),
    },
  };

  function cloneLayoutFragments(source = layoutFragmentDefaults) {
    return JSON.parse(JSON.stringify(source));
  }

  function cloneLayoutExtras(source = { certificate: [], report: [] }) {
    return JSON.parse(JSON.stringify(source));
  }

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
    layoutFragments: cloneLayoutFragments(),
    layoutExtras: cloneLayoutExtras(),
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

  const fragmentAlignments = {
    align: ["left", "center", "right"],
    valign: ["top", "center", "bottom"],
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

  const builtinPresetLabels = {
    balanced: "Balanced premium",
    ceremony: "Ceremonial gold",
    field: "1940s field archive",
    minimal: "Minimal print proof",
  };

  Object.values(studioPresets).forEach((preset) => {
    preset.layoutFragments = cloneLayoutFragments(preset.layoutFragments || layoutFragmentDefaults);
    preset.layoutExtras = cloneLayoutExtras(preset.layoutExtras);
  });

  Object.assign(studioPresets.ceremony.layoutFragments.certificate, {
    stamp: fragmentBox(46.4, 15.5, 7.2, 7.8, "center", "center", 50),
    title: fragmentBox(10, 22, 80, 10.2, "center", "center", 40),
    body: fragmentBox(23, 37.4, 54, 18.8, "center", "top", 30),
    name: fragmentBox(23, 66.8, 54, 8.6, "center", "center", 60),
    author: fragmentBox(38, 84.2, 24, 8.8, "center", "center", 80),
  });
  Object.assign(studioPresets.field.layoutFragments.report, {
    title: fragmentBox(10, 14.4, 80, 7.8, "center", "center", 30),
    quote: fragmentBox(9, 24.4, 82, 7.2, "left", "top", 40),
    instruction: fragmentBox(9, 33.4, 82, 7, "left", "top", 50),
    lines: fragmentBox(9, 42.5, 82, 35, "left", "top", 60),
    entry: fragmentBox(10, 44, 80, 32.5, "left", "top", 70),
    stamp: fragmentBox(7.5, 79, 19, 12.5, "center", "center", 90),
  });
  Object.assign(studioPresets.minimal.layoutFragments.certificate, {
    stamp: { ...studioPresets.minimal.layoutFragments.certificate.stamp, hidden: true },
    author: { ...studioPresets.minimal.layoutFragments.certificate.author, hidden: true },
    title: fragmentBox(13, 24.8, 74, 8.8, "center", "center", 40),
    body: fragmentBox(25, 41, 50, 16, "center", "top", 30),
  });
  Object.assign(studioPresets.minimal.layoutFragments.report, {
    stamp: { ...studioPresets.minimal.layoutFragments.report.stamp, hidden: true },
    quote: fragmentBox(12, 26, 76, 6.2, "center", "top", 40),
    instruction: fragmentBox(12, 35.2, 76, 6.2, "center", "top", 50),
  });

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

  function sanitizeFragmentBox(source, fallback) {
    const next = { ...fallback };
    if (!source || typeof source !== "object") return next;
    ["x", "y", "w", "h"].forEach((key) => {
      const value = Number(source[key]);
      if (!Number.isFinite(value)) return;
      const min = key === "w" || key === "h" ? 2 : 0;
      const max = key === "w" || key === "h" ? 100 : 98;
      next[key] = Math.min(max, Math.max(min, Math.round(value * 10) / 10));
    });
    next.x = Math.min(98, Math.max(0, next.x));
    next.y = Math.min(98, Math.max(0, next.y));
    next.w = Math.min(100 - next.x, Math.max(2, next.w));
    next.h = Math.min(100 - next.y, Math.max(2, next.h));
    if (fragmentAlignments.align.includes(source.align)) next.align = source.align;
    if (fragmentAlignments.valign.includes(source.valign)) next.valign = source.valign;
    const z = Number(source.z);
    next.z = Number.isFinite(z) ? Math.min(999, Math.max(1, Math.round(z))) : fallback.z || 30;
    next.locked = Boolean(source.locked);
    next.hidden = Boolean(source.hidden);
    return next;
  }

  function sanitizeLayoutFragments(raw) {
    const next = cloneLayoutFragments();
    if (!raw || typeof raw !== "object") return next;

    ["certificate", "report"].forEach((type) => {
      Object.keys(next[type]).forEach((id) => {
        const source = raw[type]?.[id];
        next[type][id] = sanitizeFragmentBox(source, next[type][id]);
      });
    });

    return next;
  }

  function sanitizeLayoutExtras(raw, fragments) {
    const next = cloneLayoutExtras();
    if (!raw || typeof raw !== "object") return next;

    ["certificate", "report"].forEach((type) => {
      const sourceList = Array.isArray(raw[type]) ? raw[type] : [];
      sourceList.slice(0, 24).forEach((source, index) => {
        if (!source || typeof source !== "object") return;
        const baseId = String(source.source || "");
        if (!fragments[type]?.[baseId]) return;
        const fallback = {
          ...fragments[type][baseId],
          x: Math.min(98, Math.max(0, Number(fragments[type][baseId].x) + 2)),
          y: Math.min(98, Math.max(0, Number(fragments[type][baseId].y) + 2)),
          z: (fragments[type][baseId].z || 30) + index + 1,
          locked: false,
          hidden: false,
        };
        const clean = sanitizeFragmentBox(source, fallback);
        clean.id = /^[a-z0-9_-]{6,40}$/i.test(source.id || "") ? source.id : `extra-${baseId}-${index + 1}`;
        clean.source = baseId;
        clean.label = clampText(source.label || `${baseId} copy`, 40);
        next[type].push(clean);
      });
    });

    return next;
  }

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
    next.layoutFragments = sanitizeLayoutFragments(raw.layoutFragments);
    next.layoutExtras = sanitizeLayoutExtras(raw.layoutExtras, next.layoutFragments);
    return next;
  }

  function normalizePresetName(value) {
    let base = String(value || "studio-preset")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 38);
    if (!base) base = "studio-preset";
    if (studioPresets[base]) base = `${base}-custom`;
    return base;
  }

  function ensurePresetAllowed(name) {
    if (name && !allowed.studioPreset.includes(name)) allowed.studioPreset.push(name);
  }

  function normalizeStudioPresetRecord(raw = {}, fallbackName = "Studio preset") {
    if (!raw || typeof raw !== "object") return null;
    const label = clampText(raw.label || raw.title || raw.name || fallbackName, 70) || "Studio preset";
    const name = normalizePresetName(raw.name || label);
    ensurePresetAllowed(name);
    const rawConfig = raw.config && typeof raw.config === "object" ? raw.config : raw;
    const clean = sanitizeConfig({ ...rawConfig, studioPreset: name });
    return {
      version: 1,
      name,
      label,
      createdAt: raw.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: clean,
    };
  }

  function loadCustomStudioPresets() {
    if (mode !== "admin") return {};
    try {
      const raw = JSON.parse(localStorage.getItem(presetStorageKey) || "{}");
      const values = Array.isArray(raw) ? raw : Object.values(raw && typeof raw === "object" ? raw : {});
      const next = {};
      values.slice(0, 50).forEach((item, index) => {
        const record = normalizeStudioPresetRecord(item, `Studio preset ${index + 1}`);
        if (record) next[record.name] = record;
      });
      return next;
    } catch {
      localStorage.removeItem(presetStorageKey);
      return {};
    }
  }

  let customStudioPresets = loadCustomStudioPresets();

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
  let pendingExportProof = null;
  let exportProofUrl = "";
  const status = $("[data-document-status]");
  const imageCache = new Map();
  const bytesCache = new Map();
  let pdfLibrariesReady;
  let documentToken = createDocumentToken();
  let historyPast = [];
  let historyFuture = [];
  let restoringHistory = false;

  const C = () => copy[config.language];
  const setStatus = (message) => { if (status) status.textContent = message || ""; };
  const configSnapshot = () => JSON.stringify(config);

  function pushHistory() {
    if (mode !== "admin" || restoringHistory) return;
    const snapshot = configSnapshot();
    if (historyPast[historyPast.length - 1] === snapshot) return;
    historyPast.push(snapshot);
    if (historyPast.length > 80) historyPast.shift();
    historyFuture = [];
    syncHistoryButtons();
  }

  function restoreSnapshot(snapshot) {
    if (!snapshot) return;
    restoringHistory = true;
    try {
      config = sanitizeConfig(JSON.parse(snapshot));
      const form = $("[data-document-admin-form]");
      if (form) {
        syncPresetSelect(form);
        fillAdminForm(form);
      }
      persistAdminConfig();
      syncVisualOptions();
      syncEditorTools();
      updatePreview();
      setStatus("");
    } finally {
      restoringHistory = false;
    }
  }

  function undoHistory() {
    if (!historyPast.length) return;
    historyFuture.push(configSnapshot());
    restoreSnapshot(historyPast.pop());
    syncHistoryButtons();
  }

  function redoHistory() {
    if (!historyFuture.length) return;
    historyPast.push(configSnapshot());
    restoreSnapshot(historyFuture.pop());
    syncHistoryButtons();
  }

  function syncHistoryButtons() {
    if (mode !== "admin") return;
    $$("[data-history-action='undo']").forEach((button) => { button.disabled = historyPast.length === 0; });
    $$("[data-history-action='redo']").forEach((button) => { button.disabled = historyFuture.length === 0; });
  }

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
  const fragmentLabels = {
    certificate: {
      code: "Certificate number",
      meta: "Date and place",
      stamp: "Event stamp",
      title: "Title plate",
      body: "Certificate text",
      name: "Participant name",
      closing: "Closing text",
      author: "Author signature",
    },
    report: {
      code: "Report number",
      meta: "Date and place",
      title: "Title plate",
      quote: "Opening line",
      instruction: "Instruction text",
      lines: "Typing lines",
      entry: "Typed report text",
      signature: "Witness signature",
      stamp: "Event stamp",
    },
  };

  function isBaseFragment(type, id) {
    return Boolean(layoutFragmentDefaults[type]?.[id]);
  }

  function layoutExtra(type, id) {
    return (config.layoutExtras?.[type] || []).find((layer) => layer.id === id);
  }

  function layerSource(type, id) {
    return isBaseFragment(type, id) ? id : layoutExtra(type, id)?.source;
  }

  function layerLabel(type, id) {
    if (isBaseFragment(type, id)) return fragmentLabels[type]?.[id] || id;
    const extra = layoutExtra(type, id);
    return extra?.label || `${fragmentLabels[type]?.[extra?.source] || "Layer"} copy`;
  }

  function layerItems(type = activeType) {
    const base = Object.keys(layoutFragmentDefaults[type] || {}).map((id) => ({
      id,
      source: id,
      base: true,
      label: layerLabel(type, id),
      fragment: layoutFragment(type, id),
    }));
    const extras = (config.layoutExtras?.[type] || []).map((layer) => ({
      id: layer.id,
      source: layer.source,
      base: false,
      label: layerLabel(type, layer.id),
      fragment: layer,
    }));
    return [...base, ...extras].sort((a, b) => {
      const z = (b.fragment.z || 30) - (a.fragment.z || 30);
      return z || a.label.localeCompare(b.label);
    });
  }

  function visibleExtras(type) {
    return (config.layoutExtras?.[type] || [])
      .filter((layer) => !layer.hidden)
      .sort((a, b) => (a.z || 30) - (b.z || 30));
  }

  function layoutFragment(type, id) {
    const extra = layoutExtra(type, id);
    if (extra) return extra;
    return config.layoutFragments?.[type]?.[id] || layoutFragmentDefaults[type]?.[id];
  }

  function updateLayoutFragment(type, id, updates) {
    const extra = layoutExtra(type, id);
    if (extra) {
      const clean = sanitizeFragmentBox({ ...extra, ...updates }, extra);
      Object.assign(extra, clean);
      return extra;
    }
    if (!config.layoutFragments) config.layoutFragments = cloneLayoutFragments();
    if (!config.layoutFragments[type]) config.layoutFragments[type] = cloneLayoutFragments()[type];
    const current = { ...layoutFragment(type, id), ...updates };
    const clean = sanitizeLayoutFragments({ [type]: { [id]: current } })[type][id];
    config.layoutFragments[type][id] = clean;
    return clean;
  }

  function resetLayoutFragment(type, id) {
    const extra = layoutExtra(type, id);
    if (extra) {
      const source = layoutFragment(type, extra.source) || layoutFragmentDefaults[type]?.[extra.source];
      Object.assign(extra, sanitizeFragmentBox({
        ...source,
        x: Math.min(98, source.x + 2),
        y: Math.min(98, source.y + 2),
        z: extra.z,
        locked: false,
        hidden: false,
      }, source), { id: extra.id, source: extra.source, label: extra.label });
      return;
    }
    if (!config.layoutFragments) config.layoutFragments = cloneLayoutFragments();
    config.layoutFragments[type][id] = { ...layoutFragmentDefaults[type][id] };
  }

  function resetAllLayoutFragments() {
    config.layoutFragments = cloneLayoutFragments();
    config.layoutExtras = cloneLayoutExtras();
  }

  function applyFragmentBox(element, fragment) {
    if (!element || !fragment) return;
    const align = fragment.align || "center";
    const valign = fragment.valign || "center";
    const justifyContent = { top: "start", center: "center", bottom: "end" }[valign] || "center";
    const objectPosition = `${align === "left" ? "left" : align === "right" ? "right" : "center"} ${valign === "top" ? "top" : valign === "bottom" ? "bottom" : "center"}`;
    element.style.left = percent(fragment.x);
    element.style.top = percent(fragment.y);
    element.style.width = percent(fragment.w);
    element.style.height = percent(fragment.h);
    element.style.minHeight = percent(fragment.h);
    element.style.setProperty("--fragment-text-align", align);
    element.style.setProperty("--fragment-align-content", justifyContent);
    element.style.setProperty("--fragment-object-position", objectPosition);
    element.dataset.fragmentAlign = align;
    element.dataset.fragmentValign = valign;
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.maxWidth = "none";
    element.style.transform = "none";
    element.style.zIndex = String(fragment.z || 30);
    element.hidden = Boolean(fragment.hidden);
    element.dataset.fragmentLocked = String(Boolean(fragment.locked));
  }

  function applyFragmentLayout(sheet, type) {
    if (!sheet) return;
    $$("[data-layout-extra]", sheet).forEach((element) => element.remove());
    $$("[data-layout-fragment]:not([data-layout-extra])", sheet).forEach((element) => {
      applyFragmentBox(element, layoutFragment(type, element.dataset.layoutFragment));
    });
    (config.layoutExtras?.[type] || []).forEach((layer) => {
      const source = $(`[data-layout-fragment="${layer.source}"]:not([data-layout-extra])`, sheet);
      if (!source) return;
      const clone = source.cloneNode(true);
      clone.removeAttribute("id");
      clone.hidden = false;
      clone.classList.add("document-duplicate-fragment");
      clone.classList.remove("is-layout-selected", "is-layout-dragging");
      clone.dataset.layoutFragment = layer.id;
      clone.dataset.layoutSource = layer.source;
      clone.dataset.layoutExtra = "true";
      source.parentElement?.appendChild(clone);
      applyFragmentBox(clone, layer);
    });
  }

  function fragmentRect(type, id, width, height) {
    const fragment = layoutFragment(type, id);
    return fragmentBoxRect(fragment, width, height);
  }

  function fragmentBoxRect(fragment, width, height) {
    return {
      x: width * fragment.x / 100,
      y: height * fragment.y / 100,
      width: width * fragment.w / 100,
      height: height * fragment.h / 100,
    };
  }

  function pdfFragmentRect(type, id, width, height) {
    return pdfBoxRect(layoutFragment(type, id), width, height);
  }

  function pdfBoxRect(fragment, width, height) {
    const rect = fragmentBoxRect(fragment, width, height);
    return {
      x: rect.x,
      y: height - rect.y - rect.height,
      width: rect.width,
      height: rect.height,
    };
  }

  function fragmentVisible(type, id) {
    return !layoutFragment(type, id)?.hidden;
  }

  function canvasTextX(rect, fragment) {
    const align = fragment?.align || "center";
    if (align === "left") return rect.x;
    if (align === "right") return rect.x + rect.width;
    return rect.x + rect.width / 2;
  }

  function canvasGroupBaseline(rect, fragment, lineCount, lineHeight, fontSize) {
    const valign = fragment?.valign || "center";
    const total = Math.max(fontSize, (Math.max(1, lineCount) - 1) * lineHeight + fontSize);
    if (valign === "top") return rect.y + fontSize;
    if (valign === "bottom") return rect.y + rect.height - total + fontSize;
    return rect.y + (rect.height - total) / 2 + fontSize;
  }

  function pdfTextX(rect, fragment, font, text, size) {
    const align = fragment?.align || "center";
    const width = font.widthOfTextAtSize(text, size);
    if (align === "left") return rect.x;
    if (align === "right") return rect.x + rect.width - width;
    return rect.x + (rect.width - width) / 2;
  }

  function pdfGroupBaseline(rect, fragment, lineCount, lineHeight, fontSize) {
    const valign = fragment?.valign || "center";
    const total = Math.max(fontSize, (Math.max(1, lineCount) - 1) * lineHeight + fontSize);
    if (valign === "top") return rect.y + rect.height - fontSize;
    if (valign === "bottom") return rect.y + total - fontSize;
    return rect.y + (rect.height + total) / 2 - fontSize;
  }

  function syncEditorTools() {
    body.dataset.proofGrid = mode === "admin" ? config.proofGrid : "off";
    $$("[data-range-output]").forEach((output) => {
      const key = output.dataset.rangeOutput;
      output.textContent = `${config[key] || defaults[key]}%`;
    });
    syncHistoryButtons();
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
      applyFragmentLayout(sheet, type);
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
    applyFragmentLayout(sheet, type);
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
    syncLayoutControls();
    updateReportMeter();
    renderPreflightPanel();
  }

  function updateProofTitle() {
    const title = $("[data-proof-title]");
    if (!title) return;
    title.textContent = activeType === "certificate"
      ? `${C().certificateTitle} / A4 landscape`
      : `${C().reportTitle} / A4 portrait`;
  }

  let selectedLayoutFragment = { type: "certificate", id: "title" };

  function persistAdminConfig() {
    if (mode === "admin") {
      localStorage.setItem("vhDocumentStudioIssue", JSON.stringify(config));
    }
  }

  function ensureLayoutSelection() {
    if (selectedLayoutFragment.type !== activeType || !layoutFragment(activeType, selectedLayoutFragment.id)) {
      selectedLayoutFragment = { type: activeType, id: activeType === "certificate" ? "title" : "entry" };
    }
    return selectedLayoutFragment;
  }

  function activeLayoutSheet() {
    return $(`[data-document-preview="${activeType}"]`);
  }

  function markSelectedLayoutFragment() {
    $$("[data-layout-fragment]").forEach((element) => element.classList.remove("is-layout-selected"));
    const selection = ensureLayoutSelection();
    const sheet = activeLayoutSheet();
    $(`[data-layout-fragment="${cssEscape(selection.id)}"]`, sheet)?.classList.add("is-layout-selected");
    syncResizeOverlay();
  }

  function syncLayoutControls() {
    if (mode !== "admin") return;
    const selection = ensureLayoutSelection();
    const target = $("[data-layout-target]");
    if (target) {
      const options = layerItems(activeType)
        .map((layer) => `<option value="${layer.id}">${layer.label}${layer.base ? "" : " *"}</option>`)
        .join("");
      target.innerHTML = options;
      target.dataset.optionsFor = activeType;
      target.value = selection.id;
    }
    const fragment = layoutFragment(activeType, selection.id);
    $$("[data-layout-field]").forEach((field) => {
      field.value = fragment[field.dataset.layoutField];
    });
    const align = $("[data-layout-align]");
    const valign = $("[data-layout-valign]");
    if (align) align.value = fragment.align || "center";
    if (valign) valign.value = fragment.valign || "center";
    $$("[data-lock-sensitive]").forEach((control) => { control.disabled = Boolean(fragment.locked); });
    $$("[data-mobile-layer-name]").forEach((node) => { node.textContent = layerLabel(selection.type, selection.id); });
    $$("[data-mobile-layer-state]").forEach((node) => { node.textContent = fragment.hidden ? "Hidden" : fragment.locked ? "Locked" : "Live"; });
    markSelectedLayoutFragment();
    renderLayerPanel();
  }

  function setSelectedLayoutFragment(id) {
    if (!layoutFragment(activeType, id)) return;
    selectedLayoutFragment = { type: activeType, id };
    syncLayoutControls();
  }

  function applyLayoutFieldChange(field) {
    const key = field.dataset.layoutField;
    if (!key) return;
    const selection = ensureLayoutSelection();
    const fragment = layoutFragment(selection.type, selection.id);
    if (fragment.locked) return;
    const value = Number(field.value);
    if (!Number.isFinite(value)) return;
    pushHistory();
    updateLayoutFragment(selection.type, selection.id, { [key]: value });
    persistAdminConfig();
    updatePreview();
  }

  function applyLayoutAlignmentChange(key, value) {
    const allowed = fragmentAlignments[key];
    if (!allowed?.includes(value)) return;
    const selection = ensureLayoutSelection();
    const fragment = layoutFragment(selection.type, selection.id);
    if (fragment.locked) return;
    pushHistory();
    updateLayoutFragment(selection.type, selection.id, { [key]: value });
    persistAdminConfig();
    updatePreview();
  }

  function snapSelectedFragment(axis, placement) {
    const selection = ensureLayoutSelection();
    const fragment = layoutFragment(selection.type, selection.id);
    if (fragment.locked) return;
    const updates = {};
    if (axis === "x") {
      updates.x = placement === "left" ? 0 : placement === "right" ? 100 - fragment.w : (100 - fragment.w) / 2;
      updates.align = placement === "left" || placement === "right" ? placement : "center";
    }
    if (axis === "y") {
      updates.y = placement === "top" ? 0 : placement === "bottom" ? 100 - fragment.h : (100 - fragment.h) / 2;
      updates.valign = placement === "top" || placement === "bottom" ? placement : "center";
    }
    pushHistory();
    updateLayoutFragment(selection.type, selection.id, updates);
    persistAdminConfig();
    updatePreview();
  }

  function nudgeSelectedFragment(mx, my, step = .5) {
    const selection = ensureLayoutSelection();
    const fragment = layoutFragment(selection.type, selection.id);
    if (!fragment || fragment.locked) return;
    updateSelectedLayer({
      x: clampNumber(fragment.x + mx * step, 0, 100 - fragment.w),
      y: clampNumber(fragment.y + my * step, 0, 100 - fragment.h),
    });
  }

  function syncResizeOverlay() {
    if (mode !== "admin") return;
    $$("[data-fragment-resize-box]").forEach((box) => box.hidden = true);
    const selection = ensureLayoutSelection();
    const sheet = activeLayoutSheet();
    const fragment = layoutFragment(selection.type, selection.id);
    if (!sheet || !fragment || fragment.hidden) return;
    let overlay = $("[data-fragment-resize-box]", sheet);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "document-fragment-resize-box";
      overlay.dataset.fragmentResizeBox = "true";
      overlay.setAttribute("aria-hidden", "true");
      ["nw", "n", "ne", "e", "se", "s", "sw", "w"].forEach((handle) => {
        const node = document.createElement("span");
        node.dataset.resizeHandle = handle;
        node.className = `document-resize-handle handle-${handle}`;
        overlay.appendChild(node);
      });
      sheet.appendChild(overlay);
    }
    overlay.hidden = false;
    overlay.dataset.locked = String(Boolean(fragment.locked));
    overlay.style.left = percent(fragment.x);
    overlay.style.top = percent(fragment.y);
    overlay.style.width = percent(fragment.w);
    overlay.style.height = percent(fragment.h);
    overlay.style.zIndex = String(Math.max(995, (fragment.z || 30) + 2));
  }

  function maxLayerZ(type) {
    return Math.max(10, ...layerItems(type).map((layer) => Number(layer.fragment.z) || 30));
  }

  function duplicateSelectedLayer() {
    const selection = ensureLayoutSelection();
    const source = layerSource(selection.type, selection.id);
    const fragment = layoutFragment(selection.type, selection.id);
    if (!source || !fragment) return;
    if (!config.layoutExtras) config.layoutExtras = cloneLayoutExtras();
    if (!config.layoutExtras[selection.type]) config.layoutExtras[selection.type] = [];
    pushHistory();
    const id = `copy-${source}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const layer = sanitizeFragmentBox({
      ...fragment,
      x: Math.min(98, fragment.x + 2),
      y: Math.min(98, fragment.y + 2),
      z: maxLayerZ(selection.type) + 10,
      locked: false,
      hidden: false,
    }, fragment);
    layer.id = id;
    layer.source = source;
    layer.label = `${layerLabel(selection.type, selection.id)} copy`;
    config.layoutExtras[selection.type].push(layer);
    selectedLayoutFragment = { type: selection.type, id };
    persistAdminConfig();
    updatePreview();
  }

  function updateSelectedLayer(updates, allowLocked = false) {
    const selection = ensureLayoutSelection();
    const fragment = layoutFragment(selection.type, selection.id);
    if (!fragment || (fragment.locked && !allowLocked)) return;
    pushHistory();
    updateLayoutFragment(selection.type, selection.id, updates);
    persistAdminConfig();
    updatePreview();
  }

  function removeSelectedLayer() {
    const selection = ensureLayoutSelection();
    if (isBaseFragment(selection.type, selection.id)) return;
    if (!config.layoutExtras?.[selection.type]) return;
    pushHistory();
    config.layoutExtras[selection.type] = config.layoutExtras[selection.type].filter((layer) => layer.id !== selection.id);
    selectedLayoutFragment = { type: selection.type, id: activeType === "certificate" ? "title" : "entry" };
    persistAdminConfig();
    updatePreview();
  }

  function handleLayerAction(action) {
    const selection = ensureLayoutSelection();
    const fragment = layoutFragment(selection.type, selection.id);
    if (!fragment) return;
    if (action === "lock") updateSelectedLayer({ locked: !fragment.locked }, true);
    if (action === "hide") updateSelectedLayer({ hidden: !fragment.hidden }, true);
    if (action === "duplicate") duplicateSelectedLayer();
    if (action === "front") updateSelectedLayer({ z: maxLayerZ(selection.type) + 10 }, true);
    if (action === "back") updateSelectedLayer({ z: 1 }, true);
    if (action === "forward") updateSelectedLayer({ z: (fragment.z || 30) + 10 }, true);
    if (action === "backward") updateSelectedLayer({ z: Math.max(1, (fragment.z || 30) - 10) }, true);
    if (action === "reset") {
      pushHistory();
      resetLayoutFragment(selection.type, selection.id);
      persistAdminConfig();
      updatePreview();
    }
    if (action === "remove") removeSelectedLayer();
  }

  function renderLayerPanel() {
    if (mode !== "admin") return;
    const list = $("[data-layer-list]");
    if (!list) return;
    const selection = ensureLayoutSelection();
    list.innerHTML = layerItems(activeType).map((layer) => {
      const selected = layer.id === selection.id;
      const icon = layer.fragment.hidden ? "Hidden" : layer.fragment.locked ? "Locked" : "Live";
      return `<button class="document-layer-item${selected ? " is-selected" : ""}${layer.fragment.hidden ? " is-hidden" : ""}" type="button" data-layer-select="${layer.id}">
        <span>${escapeHtml(layer.label)}</span><small>${icon} / z${layer.fragment.z || 30}</small>
      </button>`;
    }).join("");
    const selectedFragment = layoutFragment(selection.type, selection.id);
    const name = $("[data-selected-layer-name]");
    if (name) name.textContent = layerLabel(selection.type, selection.id);
    $$("[data-layer-action='lock']").forEach((button) => { button.textContent = selectedFragment?.locked ? "Unlock" : "Lock"; });
    $$("[data-layer-action='hide']").forEach((button) => { button.textContent = selectedFragment?.hidden ? "Show" : "Hide"; });
    $$("[data-layer-action='remove']").forEach((button) => { button.disabled = isBaseFragment(selection.type, selection.id); });
  }

  function rectForFragment(fragment) {
    return { left: fragment.x, top: fragment.y, right: fragment.x + fragment.w, bottom: fragment.y + fragment.h, area: fragment.w * fragment.h };
  }

  function overlapRatio(a, b) {
    const left = Math.max(a.left, b.left);
    const right = Math.min(a.right, b.right);
    const top = Math.max(a.top, b.top);
    const bottom = Math.min(a.bottom, b.bottom);
    if (right <= left || bottom <= top) return 0;
    return ((right - left) * (bottom - top)) / Math.max(1, Math.min(a.area, b.area));
  }

  function preflightIssues() {
    const issues = [];
    const visible = layerItems(activeType).filter((layer) => !layer.fragment.hidden);
    const required = activeType === "certificate"
      ? ["code", "meta", "title", "body", "name"]
      : ["code", "meta", "title", "lines", "entry"];

    required.forEach((id) => {
      if (layoutFragment(activeType, id)?.hidden) issues.push({ level: "critical", text: `${fragmentLabels[activeType][id]} is hidden.` });
    });

    visible.forEach((layer) => {
      const box = rectForFragment(layer.fragment);
      if (box.left < 4 || box.top < 4 || box.right > 96 || box.bottom > 96) {
        issues.push({ level: "warning", text: `${layer.label} is close to the print edge.` });
      }
    });

    for (let i = 0; i < visible.length; i += 1) {
      for (let j = i + 1; j < visible.length; j += 1) {
        const a = visible[i];
        const b = visible[j];
        if (overlapRatio(rectForFragment(a.fragment), rectForFragment(b.fragment)) > .18) {
          issues.push({ level: "warning", text: `${a.label} overlaps ${b.label}.` });
        }
        if (issues.length > 10) break;
      }
    }

    if (activeType === "report" && reportOverflow) issues.unshift({ level: "critical", text: C().reportOverflow });
    if (activeType === "certificate" && config.certificateStamp !== "none" && layoutFragment("certificate", "stamp")?.hidden) {
      issues.push({ level: "warning", text: "Certificate stamp is enabled but hidden." });
    }
    if (activeType === "certificate" && config.certificateAuthorSignature !== "none" && layoutFragment("certificate", "author")?.hidden) {
      issues.push({ level: "warning", text: "Author signature is enabled but hidden." });
    }
    if (activeType === "report" && config.reportStamp !== "none" && layoutFragment("report", "stamp")?.hidden) {
      issues.push({ level: "warning", text: "Report stamp is enabled but hidden." });
    }
    if (activeType === "report" && layoutFragment("report", "signature")?.hidden) {
      issues.push({ level: "warning", text: "Witness signature layer is hidden." });
    }

    return issues.slice(0, 12);
  }

  function renderPreflightPanel() {
    if (mode !== "admin") return;
    const list = $("[data-preflight-list]");
    const score = $("[data-preflight-score]");
    if (!list) return;
    const issues = preflightIssues();
    const critical = issues.filter((issue) => issue.level === "critical").length;
    const warnings = issues.filter((issue) => issue.level === "warning").length;
    if (score) {
      score.textContent = critical ? "Needs fix" : warnings ? "Review" : "Ready";
      score.dataset.preflightScore = critical ? "critical" : warnings ? "warning" : "ready";
    }
    list.innerHTML = issues.length
      ? issues.map((issue) => `<li data-preflight-level="${issue.level}">${escapeHtml(issue.text)}</li>`).join("")
      : `<li data-preflight-level="ready">No critical print issues detected.</li>`;
  }

  function installLayoutEditor() {
    if (mode !== "admin" || body.dataset.layoutEditorReady === "true") return;
    body.dataset.layoutEditorReady = "true";

    $("[data-layout-target]")?.addEventListener("input", (event) => {
      setSelectedLayoutFragment(event.target.value);
    });

    $$("[data-history-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.historyAction === "undo") undoHistory();
        if (button.dataset.historyAction === "redo") redoHistory();
      });
    });

    $("[data-layer-list]")?.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-layer-select]");
      if (!button) return;
      setSelectedLayoutFragment(button.dataset.layerSelect);
    });

    $$("[data-layer-action]").forEach((button) => {
      button.addEventListener("click", () => handleLayerAction(button.dataset.layerAction));
    });

    $$("[data-layout-field]").forEach((field) => {
      field.addEventListener("input", () => applyLayoutFieldChange(field));
    });

    $("[data-layout-align]")?.addEventListener("input", (event) => {
      applyLayoutAlignmentChange("align", event.target.value);
    });

    $("[data-layout-valign]")?.addEventListener("input", (event) => {
      applyLayoutAlignmentChange("valign", event.target.value);
    });

    $$("[data-layout-snap-x]").forEach((button) => {
      button.addEventListener("click", () => snapSelectedFragment("x", button.dataset.layoutSnapX));
    });

    $$("[data-layout-snap-y]").forEach((button) => {
      button.addEventListener("click", () => snapSelectedFragment("y", button.dataset.layoutSnapY));
    });

    $$("[data-mobile-nudge]").forEach((button) => {
      button.addEventListener("click", () => {
        const vectors = {
          left: [-1, 0],
          right: [1, 0],
          up: [0, -1],
          down: [0, 1],
        };
        const [mx, my] = vectors[button.dataset.mobileNudge] || [0, 0];
        nudgeSelectedFragment(mx, my, Number(button.dataset.mobileNudgeStep) || .5);
      });
    });

    $("[data-reset-layout-fragment]")?.addEventListener("click", () => {
      const selection = ensureLayoutSelection();
      pushHistory();
      resetLayoutFragment(selection.type, selection.id);
      persistAdminConfig();
      updatePreview();
    });

    $("[data-reset-layout-all]")?.addEventListener("click", () => {
      pushHistory();
      resetAllLayoutFragments();
      persistAdminConfig();
      updatePreview();
    });

    let dragState = null;
    let resizeState = null;
    document.addEventListener("pointerdown", (event) => {
      const handle = event.target.closest?.("[data-resize-handle]");
      if (handle) {
        const selection = ensureLayoutSelection();
        const fragment = layoutFragment(selection.type, selection.id);
        const sheet = activeLayoutSheet();
        if (!fragment || !sheet || fragment.locked) return;
        event.preventDefault();
        pushHistory();
        resizeState = {
          pointerId: event.pointerId,
          handle: handle.dataset.resizeHandle,
          sheet,
          rect: sheet.getBoundingClientRect(),
          startX: event.clientX,
          startY: event.clientY,
          box: { ...fragment },
        };
        handle.setPointerCapture?.(event.pointerId);
        return;
      }

      const fragment = event.target.closest?.("[data-layout-fragment]");
      const sheet = fragment?.closest?.("[data-document-preview]");
      if (!fragment || !sheet || sheet.hidden || sheet.dataset.documentPreview !== activeType) return;
      if (event.button !== 0) return;
      event.preventDefault();
      const id = fragment.dataset.layoutFragment;
      setSelectedLayoutFragment(id);
      const rect = sheet.getBoundingClientRect();
      const box = layoutFragment(activeType, id);
      if (box.locked) return;
      pushHistory();
      dragState = {
        pointerId: event.pointerId,
        sheet,
        fragment,
        id,
        rect,
        startX: event.clientX,
        startY: event.clientY,
        box: { ...box },
      };
      fragment.classList.add("is-layout-dragging");
      fragment.setPointerCapture?.(event.pointerId);
    });

    document.addEventListener("pointermove", (event) => {
      if (resizeState && event.pointerId === resizeState.pointerId) {
        const dx = (event.clientX - resizeState.startX) / resizeState.rect.width * 100;
        const dy = (event.clientY - resizeState.startY) / resizeState.rect.height * 100;
        const box = resizeState.box;
        const minSize = 2;
        const updates = { x: box.x, y: box.y, w: box.w, h: box.h };
        if (resizeState.handle.includes("e")) updates.w = clampNumber(box.w + dx, minSize, 100 - box.x);
        if (resizeState.handle.includes("s")) updates.h = clampNumber(box.h + dy, minSize, 100 - box.y);
        if (resizeState.handle.includes("w")) {
          const nextX = clampNumber(box.x + dx, 0, box.x + box.w - minSize);
          updates.x = nextX;
          updates.w = clampNumber(box.w + box.x - nextX, minSize, 100 - nextX);
        }
        if (resizeState.handle.includes("n")) {
          const nextY = clampNumber(box.y + dy, 0, box.y + box.h - minSize);
          updates.y = nextY;
          updates.h = clampNumber(box.h + box.y - nextY, minSize, 100 - nextY);
        }
        const selection = ensureLayoutSelection();
        updateLayoutFragment(selection.type, selection.id, updates);
        applyFragmentLayout(resizeState.sheet, selection.type);
        syncLayoutControls();
        return;
      }
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      const dx = (event.clientX - dragState.startX) / dragState.rect.width * 100;
      const dy = (event.clientY - dragState.startY) / dragState.rect.height * 100;
      updateLayoutFragment(activeType, dragState.id, {
        x: dragState.box.x + dx,
        y: dragState.box.y + dy,
      });
      applyFragmentLayout(dragState.sheet, activeType);
      syncLayoutControls();
    });

    document.addEventListener("pointerup", (event) => {
      if (resizeState && event.pointerId === resizeState.pointerId) {
        resizeState = null;
        persistAdminConfig();
        updatePreview();
        return;
      }
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      dragState.fragment.classList.remove("is-layout-dragging");
      dragState.fragment.releasePointerCapture?.(event.pointerId);
      dragState = null;
      persistAdminConfig();
      updatePreview();
    });

    document.addEventListener("keydown", (event) => {
      const active = document.activeElement;
      const editing = active?.matches?.("input, textarea, select") || active?.isContentEditable;
      if (editing) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redoHistory();
        else undoHistory();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redoHistory();
        return;
      }
      const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (!arrows[event.key]) return;
      const selection = ensureLayoutSelection();
      const fragment = layoutFragment(selection.type, selection.id);
      if (!fragment || fragment.locked) return;
      event.preventDefault();
      const step = event.altKey ? .05 : event.shiftKey ? 1 : .1;
      const [mx, my] = arrows[event.key];
      updateSelectedLayer({
        x: clampNumber(fragment.x + mx * step, 0, 100 - fragment.w),
        y: clampNumber(fragment.y + my * step, 0, 100 - fragment.h),
      });
    });
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
    syncLayoutControls();
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
    if (!form) return;
    Object.entries(config).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = value;
    });
    const presetName = $("[data-preset-name]", form);
    if (presetName) presetName.value = customStudioPresets[config.studioPreset]?.label || builtinPresetLabels[config.studioPreset] || "";
  }

  function applyStudioPresetToForm(form, name) {
    const preset = getStudioPreset(name);
    if (!form || !preset) return;
    ensurePresetAllowed(name);
    config = sanitizeConfig({ ...config, ...preset, studioPreset: name });
    fillAdminForm(form);
  }

  function getStudioPreset(name) {
    return studioPresets[name] || customStudioPresets[name]?.config || null;
  }

  function syncPresetSelect(form) {
    const select = form?.elements?.namedItem("studioPreset");
    if (!select) return;
    const current = config.studioPreset;
    const builtinOptions = Object.entries(builtinPresetLabels)
      .map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`)
      .join("");
    const customOptions = Object.values(customStudioPresets)
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((record) => `<option value="${record.name}">${escapeHtml(record.label)} (saved)</option>`)
      .join("");
    select.innerHTML = customOptions ? `${builtinOptions}<optgroup label="Saved presets">${customOptions}</optgroup>` : builtinOptions;
    select.value = getStudioPreset(current) ? current : defaults.studioPreset;
  }

  function writeCustomStudioPresets() {
    try {
      localStorage.setItem(presetStorageKey, JSON.stringify(customStudioPresets));
    } catch (error) {
      console.warn("Could not save Document Studio presets.", error);
    }
  }

  function currentStudioPresetRecord(labelValue) {
    const label = clampText(labelValue || config.eventTitle || "Document Studio preset", 70) || "Document Studio preset";
    const name = normalizePresetName(label);
    ensurePresetAllowed(name);
    const payload = {};
    Object.keys(defaults).forEach((key) => {
      if (key === "studioPreset") payload[key] = name;
      else if (key === "layoutFragments") payload[key] = cloneLayoutFragments(config.layoutFragments);
      else if (key === "layoutExtras") payload[key] = cloneLayoutExtras(config.layoutExtras);
      else payload[key] = cloneData(config[key] ?? defaults[key]);
    });
    return {
      version: 1,
      name,
      label,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: sanitizeConfig(payload),
    };
  }

  function applyPresetRecord(record, form, save = true) {
    if (!record) return;
    ensurePresetAllowed(record.name);
    if (save) {
      customStudioPresets[record.name] = record;
      writeCustomStudioPresets();
    }
    syncPresetSelect(form);
    applyStudioPresetToForm(form, record.name);
    persistAdminConfig();
    syncVisualOptions();
    syncEditorTools();
    updatePreview();
  }

  async function importStudioPresetFile(file, form) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      const record = normalizeStudioPresetRecord(raw, file.name.replace(/\.json$/i, ""));
      if (!record) throw new Error("Invalid preset file.");
      pushHistory();
      applyPresetRecord(record, form, true);
      setStatus("Preset imported and applied.");
    } catch (error) {
      console.error("Document Studio preset import failed", error);
      setStatus(error.message || "Could not import preset JSON.");
    }
  }

  function installPresetControls(form) {
    if (!form || mode !== "admin") return;
    syncPresetSelect(form);
    $("[data-save-studio-preset]", form)?.addEventListener("click", () => {
      pushHistory();
      const record = currentStudioPresetRecord($("[data-preset-name]", form)?.value);
      applyPresetRecord(record, form, true);
      setStatus("Studio preset saved with the full layout.");
    });
    $("[data-export-studio-preset]", form)?.addEventListener("click", () => {
      const record = currentStudioPresetRecord($("[data-preset-name]", form)?.value);
      downloadBlob(new Blob([JSON.stringify(record, null, 2)], { type: "application/json" }), `${safeFileName(record.label)}-document-studio-preset.json`);
      setStatus("Preset JSON exported.");
    });
    $("[data-import-studio-preset]", form)?.addEventListener("change", (event) => {
      importStudioPresetFile(event.target.files?.[0], form);
      event.target.value = "";
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

  function drawFinishedTitle(ctx, text, x, y, { size, font = "DocCinzel, serif", light, mid, shadow, maxWidth, align = "center" } = {}) {
    ctx.save();
    ctx.textAlign = align;
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

  function drawTransparentReportTitle(ctx, text, rect, scale = 1, fragment = {}) {
    const maxSize = Math.max(22, rect.height * .58 * scale);
    const minSize = Math.max(14, rect.height * .28);
    const size = setCanvasFontToFit(ctx, text, maxSize, minSize, rect.width * .96, (value) => `700 ${value}px DocTypewriter, monospace`);
    ctx.save();
    ctx.textAlign = fragment.align || "center";
    ctx.font = `700 ${size}px DocTypewriter, monospace`;
    ctx.fillStyle = "#2a2117";
    ctx.shadowColor = "rgba(255,249,228,.55)";
    ctx.shadowOffsetX = -1;
    ctx.shadowOffsetY = -1;
    ctx.shadowBlur = 0;
    drawTypewriterInk(ctx, text, canvasTextX(rect, fragment), canvasGroupBaseline(rect, fragment, 1, size, size));
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

  function drawCertificateExtraLayer(ctx, layer, data) {
    const { width, height, stamp, author, name, documentNumber, titleScale, bodyScale, nameScale } = data;
    const rect = fragmentBoxRect(layer, width, height);
    ctx.save();
    if (layer.source === "code") {
      ctx.textAlign = layer.align || "center";
      ctx.fillStyle = "#d9bd7e";
      setCanvasFontToFit(ctx, documentNumber, Math.round(width * .011), Math.round(width * .0075), rect.width, (size) => `700 ${size}px DocCinzel, serif`);
      ctx.fillText(documentNumber, canvasTextX(rect, layer), canvasGroupBaseline(rect, layer, 1, rect.height, rect.height * .7));
    }
    if (layer.source === "stamp") drawSeal25D(ctx, stamp, rect.x, rect.y, rect.width, rect.height, .92, true);
    if (layer.source === "author") drawContained(ctx, author, rect.x, rect.y, rect.width, rect.height, .96);
    if (layer.source === "title") {
      drawFinishedTitle(ctx, C().certificateTitle.toUpperCase(), canvasTextX(rect, layer), canvasGroupBaseline(rect, layer, 1, rect.height, rect.height * .55), {
        size: Math.round(Math.min(width * .052, rect.height * .55) * titleScale), light: "#fff4cf", mid: "#dfc17d", shadow: "#5b421d", maxWidth: rect.width,
        align: layer.align || "center",
      });
    }
    if (layer.source === "body") {
      ctx.fillStyle = "rgba(245,230,196,.82)";
      const size = Math.round(width * .014 * bodyScale);
      ctx.font = `${size}px DocSerif, serif`;
      ctx.textAlign = layer.align || "center";
      const lines = wrapLines(ctx, C().certificateBody, rect.width).slice(0, 9);
      drawCenteredLines(ctx, lines, canvasTextX(rect, layer), canvasGroupBaseline(rect, layer, lines.length, height * .03 * bodyScale, size), height * .03 * bodyScale);
    }
    if (layer.source === "closing") {
      ctx.fillStyle = "rgba(245,230,196,.72)";
      const size = Math.round(width * .012 * bodyScale);
      ctx.font = `${size}px DocSerif, serif`;
      ctx.textAlign = layer.align || "center";
      const lines = wrapLines(ctx, C().certificateClosing, rect.width).slice(0, 3);
      drawCenteredLines(ctx, lines, canvasTextX(rect, layer), canvasGroupBaseline(rect, layer, lines.length, height * .024 * bodyScale, size), height * .024 * bodyScale);
    }
    if (layer.source === "name") {
      ctx.fillStyle = "#fff4d5";
      const participantName = name || C().participant;
      const size = setCanvasFontToFit(ctx, participantName, Math.round(width * .041 * nameScale), Math.round(width * .021), rect.width, (fontSize) => signatureFont(config.certificateSignature, fontSize));
      ctx.textAlign = layer.align || "center";
      const y = canvasGroupBaseline(rect, layer, 1, size, size);
      const x = canvasTextX(rect, layer);
      ctx.fillText(participantName, x, y);
      const ruleWidth = Math.min(ctx.measureText(participantName).width + size * 1.2, rect.width);
      const center = layer.align === "left" ? rect.x + ruleWidth / 2 : layer.align === "right" ? rect.x + rect.width - ruleWidth / 2 : rect.x + rect.width / 2;
      drawPremiumRule(ctx, center - ruleWidth / 2, center + ruleWidth / 2, y + size * .22, width);
    }
    ctx.restore();
  }

  function drawReportExtraLayer(ctx, layer, data) {
    const { width, height, stamp, text, name, anonymous, documentNumber, titleScale, textScale } = data;
    const rect = fragmentBoxRect(layer, width, height);
    ctx.save();
    if (layer.source === "code") {
      ctx.fillStyle = "#2a2117";
      ctx.textAlign = layer.align || "center";
      setCanvasFontToFit(ctx, documentNumber, Math.round(width * .013), Math.round(width * .009), rect.width, (size) => `700 ${size}px DocTypewriter, monospace`);
      drawTypewriterInk(ctx, documentNumber, canvasTextX(rect, layer), canvasGroupBaseline(rect, layer, 1, rect.height, rect.height * .7));
    }
    if (layer.source === "stamp") drawSeal25D(ctx, stamp, rect.x, rect.y, rect.width, rect.height, .74, false);
    if (layer.source === "title") drawTransparentReportTitle(ctx, C().reportTitle.toUpperCase(), rect, titleScale, layer);
    if (layer.source === "quote") {
      ctx.font = `700 ${Math.round(width * .019)}px DocTypewriter, monospace`;
      ctx.fillStyle = "#5a472f";
      ctx.textAlign = layer.align || "center";
      const lines = wrapLines(ctx, quoteCopy[config.language][config.reportQuote], rect.width).slice(0, 3);
      drawCenteredLines(ctx, lines, canvasTextX(rect, layer), canvasGroupBaseline(rect, layer, lines.length, height * .026, Math.round(width * .019)), height * .026);
    }
    if (layer.source === "instruction") {
      ctx.fillStyle = "#33291d";
      const size = Math.round(width * .015);
      ctx.font = `${size}px DocTypewriter, monospace`;
      ctx.textAlign = layer.align || "center";
      const lines = wrapLines(ctx, C().reportInstruction, rect.width).slice(0, 4);
      drawCenteredLines(ctx, lines, canvasTextX(rect, layer), canvasGroupBaseline(rect, layer, lines.length, height * .022, size), height * .022);
    }
    if (layer.source === "lines") {
      const gap = rect.height / 6;
      ctx.strokeStyle = "rgba(61,46,29,.44)";
      ctx.lineWidth = Math.max(1.5, width * .0008);
      for (let index = 0; index < 6; index += 1) {
        const y = rect.y + (index + 1) * gap;
        ctx.beginPath();
        ctx.moveTo(rect.x, y);
        ctx.lineTo(rect.x + rect.width, y);
        ctx.stroke();
      }
    }
    if (layer.source === "entry") {
      const gap = rect.height / 6;
      ctx.textAlign = layer.align || "left";
      ctx.fillStyle = "#241d15";
      const size = Math.round(width * .024 * textScale);
      ctx.font = `${size}px DocTypewriter, monospace`;
      const lines = wrapLines(ctx, text || C().reportPlaceholder, rect.width).slice(0, 6);
      const startY = canvasGroupBaseline(rect, layer, lines.length, gap, size);
      lines.forEach((line, index) => drawTypewriterInk(ctx, line, canvasTextX(rect, layer), startY + index * gap));
    }
    if (layer.source === "signature") {
      ctx.fillStyle = "#2c2319";
      ctx.textAlign = layer.align || "right";
      const witnessName = anonymous ? C().anonymous : (name || C().witness);
      const size = setCanvasFontToFit(ctx, witnessName, Math.round(width * .027), Math.round(width * .017), rect.width, (fontSize) => signatureFont(config.reportSignature, fontSize));
      const y = canvasGroupBaseline(rect, layer, 1, size, size);
      const x = canvasTextX(rect, layer);
      ctx.fillText(witnessName, x, y);
    }
    ctx.restore();
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
    const numberRect = fragmentRect("certificate", "code", width, height);
    const metaRect = fragmentRect("certificate", "meta", width, height);
    const stampRect = fragmentRect("certificate", "stamp", width, height);
    const titleRect = fragmentRect("certificate", "title", width, height);
    const bodyRect = fragmentRect("certificate", "body", width, height);
    const nameRect = fragmentRect("certificate", "name", width, height);
    const closingRect = fragmentRect("certificate", "closing", width, height);
    const authorRect = fragmentRect("certificate", "author", width, height);
    const titleFragment = layoutFragment("certificate", "title");
    const bodyFragment = layoutFragment("certificate", "body");
    const nameFragment = layoutFragment("certificate", "name");
    const closingFragment = layoutFragment("certificate", "closing");
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

    if (fragmentVisible("certificate", "code")) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#d9bd7e";
      setCanvasFontToFit(ctx, documentNumber, Math.round(width * .011), Math.round(width * .0075), numberRect.width, (size) => `700 ${size}px DocCinzel, serif`);
      ctx.fillText(documentNumber, numberRect.x + numberRect.width / 2, numberRect.y + numberRect.height * .7);
    }

    if (fragmentVisible("certificate", "meta")) {
      const metaWidth = metaRect.width * .42;
      const metaLeft = metaRect.x;
      const metaRight = metaRect.x + metaRect.width;
      const metaLabelY = metaRect.y + metaRect.height * .28;
      const metaValueY = metaRect.y + metaRect.height * .62;
      const metaRuleY = metaRect.y + metaRect.height * .76;
      ctx.fillStyle = "rgba(221,190,122,.78)";
      ctx.font = `700 ${Math.round(width * .008)}px DocCinzel, serif`;
      ctx.textAlign = "left";
      ctx.fillText(C().dateField.toUpperCase(), metaLeft, metaLabelY);
      ctx.textAlign = "right";
      ctx.fillText(C().placeField.toUpperCase(), metaRight, metaLabelY);
      ctx.fillStyle = "#f7e9c4";
      ctx.textAlign = "left";
      setCanvasFontToFit(ctx, dateLabel(), Math.round(width * .012), Math.round(width * .009), metaWidth, (size) => `${size}px DocSerif, serif`);
      ctx.fillText(dateLabel(), metaLeft, metaValueY);
      ctx.textAlign = "right";
      const placeText = config.eventPlace || config.eventTitle;
      setCanvasFontToFit(ctx, placeText, Math.round(width * .012), Math.round(width * .008), metaWidth, (size) => `${size}px DocSerif, serif`);
      ctx.fillText(placeText, metaRight, metaValueY);
      drawPremiumRule(ctx, metaLeft, metaLeft + metaWidth, metaRuleY, width);
      drawPremiumRule(ctx, metaRight - metaWidth, metaRight, metaRuleY, width);
    }

    if (fragmentVisible("certificate", "stamp")) drawSeal25D(ctx, stamp, stampRect.x, stampRect.y, stampRect.width, stampRect.height, .92, true);
    if (fragmentVisible("certificate", "title")) {
      drawFinishedTitle(ctx, C().certificateTitle.toUpperCase(), canvasTextX(titleRect, titleFragment), canvasGroupBaseline(titleRect, titleFragment, 1, titleRect.height, titleRect.height * .55), {
        size: Math.round(Math.min(width * .052, titleRect.height * .55) * titleScale), light: "#fff4cf", mid: "#dfc17d", shadow: "#5b421d", maxWidth: titleRect.width,
        align: titleFragment.align || "center",
      });
    }
    if (fragmentVisible("certificate", "body")) {
      ctx.fillStyle = "rgba(245,230,196,.82)";
      const bodySize = Math.round(width * .014 * bodyScale);
      ctx.font = `${bodySize}px DocSerif, serif`;
      ctx.textAlign = bodyFragment.align || "center";
      const bodyLines = wrapLines(ctx, C().certificateBody, bodyRect.width).slice(0, 9);
      drawCenteredLines(ctx, bodyLines, canvasTextX(bodyRect, bodyFragment), canvasGroupBaseline(bodyRect, bodyFragment, bodyLines.length, height * .03 * bodyScale, bodySize), height * .03 * bodyScale);
    }
    if (fragmentVisible("certificate", "name")) {
      ctx.fillStyle = "#fff4d5";
      const participantName = name || C().participant;
      const nameSize = setCanvasFontToFit(ctx, participantName, Math.round(width * .041 * nameScale), Math.round(width * .021), nameRect.width, (size) => signatureFont(config.certificateSignature, size));
      ctx.textAlign = nameFragment.align || "center";
      const nameY = canvasGroupBaseline(nameRect, nameFragment, 1, nameSize, nameSize);
      const nameX = canvasTextX(nameRect, nameFragment);
      ctx.fillText(participantName, nameX, nameY);
      const nameWidth = Math.min(ctx.measureText(participantName).width + nameSize * 1.2, nameRect.width);
      const nameCenter = nameFragment.align === "left" ? nameRect.x + nameWidth / 2 : nameFragment.align === "right" ? nameRect.x + nameRect.width - nameWidth / 2 : nameRect.x + nameRect.width / 2;
      drawPremiumRule(ctx, nameCenter - nameWidth / 2, nameCenter + nameWidth / 2, nameY + nameSize * .22, width);
    }
    if (fragmentVisible("certificate", "closing")) {
      ctx.fillStyle = "rgba(245,230,196,.72)";
      const closingSize = Math.round(width * .012 * bodyScale);
      ctx.font = `${closingSize}px DocSerif, serif`;
      ctx.textAlign = closingFragment.align || "center";
      const closingLines = wrapLines(ctx, C().certificateClosing, closingRect.width).slice(0, 3);
      drawCenteredLines(ctx, closingLines, canvasTextX(closingRect, closingFragment), canvasGroupBaseline(closingRect, closingFragment, closingLines.length, height * .024 * bodyScale, closingSize), height * .024 * bodyScale);
    }
    if (fragmentVisible("certificate", "author")) drawContained(ctx, author, authorRect.x, authorRect.y, authorRect.width, authorRect.height, .96);
    visibleExtras("certificate").forEach((layer) => drawCertificateExtraLayer(ctx, layer, {
      width, height, stamp, author, name, documentNumber, titleScale, bodyScale, nameScale,
    }));
    return canvas;
  }

  async function renderReport({ text, name, anonymous = false, documentNumber = issueNumber(), width = A4.portrait.width } = {}) {
    await ensureFonts();
    const height = Math.round(width * 1.414);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const [background, texture, stamp] = await Promise.all([
      loadImage(reportBackground()), loadImage(assets.texture).catch(() => null),
      loadImage(stampAsset("report")).catch(() => null),
    ]);
    const numberRect = fragmentRect("report", "code", width, height);
    const metaRect = fragmentRect("report", "meta", width, height);
    const titleRect = fragmentRect("report", "title", width, height);
    const quoteRect = fragmentRect("report", "quote", width, height);
    const instructionRect = fragmentRect("report", "instruction", width, height);
    const linesRect = fragmentRect("report", "lines", width, height);
    const entryRect = fragmentRect("report", "entry", width, height);
    const signatureRect = fragmentRect("report", "signature", width, height);
    const stampRect = fragmentRect("report", "stamp", width, height);
    const titleFragment = layoutFragment("report", "title");
    const quoteFragment = layoutFragment("report", "quote");
    const instructionFragment = layoutFragment("report", "instruction");
    const entryFragment = layoutFragment("report", "entry");
    const signatureFragment = layoutFragment("report", "signature");
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

    if (fragmentVisible("report", "code")) {
      ctx.fillStyle = "#2a2117";
      ctx.textAlign = "center";
      setCanvasFontToFit(ctx, documentNumber, Math.round(width * .013), Math.round(width * .009), numberRect.width, (size) => `700 ${size}px DocTypewriter, monospace`);
      drawTypewriterInk(ctx, documentNumber, numberRect.x + numberRect.width / 2, numberRect.y + numberRect.height * .7);
    }

    if (fragmentVisible("report", "meta")) {
      const metaColumn = metaRect.width * .42;
      const metaLeft = metaRect.x;
      const metaRight = metaRect.x + metaRect.width;
      const metaLabelY = metaRect.y + metaRect.height * .25;
      const metaValueY = metaRect.y + metaRect.height * .64;
      const metaRuleY = metaRect.y + metaRect.height * .82;
      ctx.font = `700 ${Math.round(width * .012)}px DocTypewriter, monospace`;
      ctx.textAlign = "left";
      drawTypewriterInk(ctx, `${C().dateField.toUpperCase()}:`, metaLeft, metaLabelY);
      ctx.textAlign = "right";
      drawTypewriterInk(ctx, `${C().placeField.toUpperCase()}:`, metaRight, metaLabelY);
      ctx.textAlign = "left";
      setCanvasFontToFit(ctx, dateLabel(), Math.round(width * .016), Math.round(width * .011), metaColumn, (size) => `${size}px DocTypewriter, monospace`);
      drawTypewriterInk(ctx, dateLabel(), metaLeft, metaValueY);
      ctx.textAlign = "right";
      const placeText = config.eventPlace || config.eventTitle;
      setCanvasFontToFit(ctx, placeText, Math.round(width * .016), Math.round(width * .01), metaColumn, (size) => `${size}px DocTypewriter, monospace`);
      drawTypewriterInk(ctx, placeText, metaRight, metaValueY);
      ctx.strokeStyle = "rgba(28,22,16,.85)";
      ctx.lineWidth = Math.max(2, width * .0011);
      ctx.beginPath();
      ctx.moveTo(metaLeft, metaRuleY);
      ctx.lineTo(metaLeft + metaColumn, metaRuleY);
      ctx.moveTo(metaRight - metaColumn, metaRuleY);
      ctx.lineTo(metaRight, metaRuleY);
      ctx.stroke();
    }

    if (fragmentVisible("report", "title")) drawTransparentReportTitle(ctx, C().reportTitle.toUpperCase(), titleRect, titleScale, titleFragment);
    if (anonymous && fragmentVisible("report", "title")) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(42,33,23,.72)";
      ctx.font = `700 ${Math.round(width * .011)}px DocTypewriter, monospace`;
      drawTypewriterInk(ctx, C().anonymous.toUpperCase(), titleRect.x + titleRect.width / 2, titleRect.y + titleRect.height + width * .014);
    }
    if (fragmentVisible("report", "quote")) {
      ctx.font = `700 ${Math.round(width * .019)}px DocTypewriter, monospace`;
      ctx.fillStyle = "#5a472f";
      ctx.textAlign = quoteFragment.align || "center";
      const quoteLines = wrapLines(ctx, quoteCopy[config.language][config.reportQuote], quoteRect.width).slice(0, 3);
      drawCenteredLines(ctx, quoteLines, canvasTextX(quoteRect, quoteFragment), canvasGroupBaseline(quoteRect, quoteFragment, quoteLines.length, height * .026, Math.round(width * .019)), height * .026);
    }
    if (fragmentVisible("report", "instruction")) {
      ctx.fillStyle = "#33291d";
      const instructionSize = Math.round(width * .015);
      ctx.font = `${instructionSize}px DocTypewriter, monospace`;
      ctx.textAlign = instructionFragment.align || "center";
      const instructionLines = wrapLines(ctx, C().reportInstruction, instructionRect.width).slice(0, 4);
      drawCenteredLines(ctx, instructionLines, canvasTextX(instructionRect, instructionFragment), canvasGroupBaseline(instructionRect, instructionFragment, instructionLines.length, height * .022, instructionSize), height * .022);
    }

    const lineGap = linesRect.height / 6;
    if (fragmentVisible("report", "lines")) {
      ctx.strokeStyle = "rgba(61,46,29,.44)";
      ctx.lineWidth = Math.max(1.5, width * .0008);
      for (let index = 0; index < 6; index += 1) {
        const y = linesRect.y + (index + 1) * lineGap;
        ctx.beginPath();
        ctx.moveTo(linesRect.x, y);
        ctx.lineTo(linesRect.x + linesRect.width, y);
        ctx.stroke();
      }
    }
    if (fragmentVisible("report", "entry")) {
      ctx.textAlign = entryFragment.align || "left";
      ctx.fillStyle = "#241d15";
      const entrySize = Math.round(width * .024 * textScale);
      ctx.font = `${entrySize}px DocTypewriter, monospace`;
      const reportLines = wrapLines(ctx, text || C().reportPlaceholder, entryRect.width);
      if (reportLines.length > 6) throw new Error(C().reportOverflow);
      const entryStartY = canvasGroupBaseline(entryRect, entryFragment, reportLines.length, lineGap, entrySize);
      reportLines.forEach((line, index) => drawTypewriterInk(ctx, line, canvasTextX(entryRect, entryFragment), entryStartY + index * lineGap));
    }

    if (fragmentVisible("report", "signature")) {
      ctx.fillStyle = "#2c2319";
      ctx.font = `700 ${Math.round(width * .016)}px DocTypewriter, monospace`;
      ctx.textAlign = signatureFragment.align || "right";
      const witnessName = anonymous ? C().anonymous : (name || C().witness);
      const witnessSize = setCanvasFontToFit(ctx, witnessName, Math.round(width * .027), Math.round(width * .017), signatureRect.width, (size) => signatureFont(config.reportSignature, size));
      const witnessY = canvasGroupBaseline(signatureRect, signatureFragment, 1, witnessSize, witnessSize);
      const witnessX = canvasTextX(signatureRect, signatureFragment);
      ctx.fillText(witnessName, witnessX, witnessY);
      const witnessWidth = Math.min(ctx.measureText(witnessName).width + witnessSize, signatureRect.width);
      ctx.strokeStyle = "rgba(28,22,16,.78)";
      ctx.beginPath();
      const witnessCenter = signatureFragment.align === "left" ? signatureRect.x + witnessWidth / 2 : signatureFragment.align === "right" ? signatureRect.x + signatureRect.width - witnessWidth / 2 : signatureRect.x + signatureRect.width / 2;
      ctx.moveTo(witnessCenter - witnessWidth / 2, witnessY + witnessSize * .75);
      ctx.lineTo(witnessCenter + witnessWidth / 2, witnessY + witnessSize * .75);
      ctx.stroke();
      ctx.font = `700 ${Math.round(width * .011)}px DocTypewriter, monospace`;
      drawTypewriterInk(ctx, C().witness.toUpperCase(), witnessX, witnessY + witnessSize * 1.42);
    }
    if (fragmentVisible("report", "stamp")) drawSeal25D(ctx, stamp, stampRect.x, stampRect.y, stampRect.width, stampRect.height, .74, false);
    visibleExtras("report").forEach((layer) => drawReportExtraLayer(ctx, layer, {
      width, height, stamp, text, name, anonymous, documentNumber, titleScale, textScale,
    }));
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

  function pdfFinishedTitle(page, text, font, size, y, colors, rect = null, fragment = {}) {
    const width = font.widthOfTextAtSize(text, size);
    const x = rect ? pdfTextX(rect, fragment, font, text, size) : (page.getWidth() - width) / 2;
    page.drawText(text, { x: x + 1.7, y: y - 1.8, size, font, color: colors.shadow, opacity: .76 });
    page.drawText(text, { x: x - .55, y: y + .7, size, font, color: colors.highlight, opacity: .62 });
    page.drawText(text, { x, y, size, font, color: colors.main });
  }

  function pdfTransparentReportTitle(page, text, font, rect, color, scale = 1, fragment = {}) {
    const size = pdfSizeToFit(font, text, Math.max(18, rect.height * .55 * scale), Math.max(10, rect.height * .28), rect.width * .96);
    const x = pdfTextX(rect, fragment, font, text, size);
    const y = pdfGroupBaseline(rect, fragment, 1, size, size);
    page.drawText(text, { x: x + .8, y: y - .8, size, font, color, opacity: .22 });
    page.drawText(text, { x: x - .35, y: y + .35, size, font, color, opacity: .55 });
    page.drawText(text, { x, y, size, font, color, opacity: .95 });
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
      const numberRect = pdfFragmentRect("certificate", "code", width, height);
      const metaRect = pdfFragmentRect("certificate", "meta", width, height);
      const stampRect = pdfFragmentRect("certificate", "stamp", width, height);
      const titleRect = pdfFragmentRect("certificate", "title", width, height);
      const bodyRect = pdfFragmentRect("certificate", "body", width, height);
      const nameRect = pdfFragmentRect("certificate", "name", width, height);
      const closingRect = pdfFragmentRect("certificate", "closing", width, height);
      const authorRect = pdfFragmentRect("certificate", "author", width, height);
      const titleFragment = layoutFragment("certificate", "title");
      const bodyFragment = layoutFragment("certificate", "body");
      const nameFragment = layoutFragment("certificate", "name");
      const closingFragment = layoutFragment("certificate", "closing");
      const titleScale = scaleValue("certificateTitleScale");
      const bodyScale = scaleValue("certificateBodyScale");
      const nameScale = scaleValue("certificateNameScale");
      page.drawImage(background, { x: 0, y: 0, width, height });
      if (texture) page.drawImage(texture, { x: 0, y: 0, width, height, opacity: .12 });
      page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(.02, .018, .012), opacity: .24 });
      page.drawRectangle({ x: 40, y: 38, width: width - 80, height: height - 76, borderColor: palette.gold, borderWidth: 1, opacity: .74 });
       if (fragmentVisible("certificate", "code")) {
         const documentNumber = data.documentNumber || issueNumber();
         const numberSize = pdfSizeToFit(cinzel, documentNumber, 8.5, 6.2, numberRect.width);
         page.drawText(documentNumber, { x: numberRect.x + (numberRect.width - cinzel.widthOfTextAtSize(documentNumber, numberSize)) / 2, y: numberRect.y + numberRect.height * .36, size: numberSize, font: cinzel, color: palette.gold });
       }
       if (fragmentVisible("certificate", "meta")) {
       const metaLeft = metaRect.x;
       const metaRight = metaRect.x + metaRect.width;
       const metaWidth = metaRect.width * .42;
       const metaLabelY = metaRect.y + metaRect.height * .62;
       const metaValueY = metaRect.y + metaRect.height * .28;
       const metaRuleY = metaRect.y + metaRect.height * .15;
       page.drawText(C().dateField.toUpperCase(), { x: metaLeft, y: metaLabelY, size: 6.5, font: cinzel, color: palette.gold, opacity: .88 });
       pdfRight(page, C().placeField.toUpperCase(), cinzel, 6.5, metaRight, metaLabelY, palette.gold);
       const dateSize = pdfSizeToFit(serif, dateLabel(), 9.5, 7.2, metaWidth);
       page.drawText(dateLabel(), { x: metaLeft, y: metaValueY, size: dateSize, font: serif, color: palette.ivory });
       const placeText = config.eventPlace || config.eventTitle;
       const placeSize = pdfSizeToFit(serif, placeText, 9.5, 6.8, metaWidth);
       pdfRight(page, placeText, serif, placeSize, metaRight, metaValueY, palette.ivory);
       pdfPremiumRule(page, metaLeft, metaLeft + metaWidth, metaRuleY, palette);
       pdfPremiumRule(page, metaRight - metaWidth, metaRight, metaRuleY, palette);
       }
       if (fragmentVisible("certificate", "stamp")) pdfSeal25D(page, stamp, stampRect.x, stampRect.y, stampRect.width, stampRect.height, .92, rgb(.01, .008, .004));
       if (fragmentVisible("certificate", "title")) {
       const certificateTitle = C().certificateTitle.toUpperCase();
       const certificateTitleSize = Math.min(43, titleRect.height * .56) * titleScale;
       pdfFinishedTitle(page, certificateTitle, cinzel, certificateTitleSize, pdfGroupBaseline(titleRect, titleFragment, 1, certificateTitleSize, certificateTitleSize), {
         highlight: rgb(1, .96, .82), main: rgb(.9, .77, .5), shadow: rgb(.25, .16, .06),
       }, titleRect, titleFragment);
       }
       if (fragmentVisible("certificate", "body")) {
       const bodySize = 11.5 * bodyScale;
       const bodyLines = pdfWrap(serif, C().certificateBody, bodySize, bodyRect.width).slice(0, 9);
       const bodyLineHeight = 16.5 * bodyScale;
       const bodyStartY = pdfGroupBaseline(bodyRect, bodyFragment, bodyLines.length, bodyLineHeight, bodySize);
       bodyLines.forEach((line, index) => page.drawText(line, { x: pdfTextX(bodyRect, bodyFragment, serif, line, bodySize), y: bodyStartY - index * bodyLineHeight, size: bodySize, font: serif, color: palette.ivory }));
       }
       if (fragmentVisible("certificate", "name")) {
       const nameFont = config.certificateSignature === "typewriter" ? typewriter : config.certificateSignature === "serif" ? serif : signature;
       const participantName = data.name || C().participant;
       const nameSize = pdfSizeToFit(nameFont, participantName, 31 * nameScale, 18, nameRect.width);
       const nameTextWidth = nameFont.widthOfTextAtSize(participantName, nameSize);
       const nameX = pdfTextX(nameRect, nameFragment, nameFont, participantName, nameSize);
       const nameY = pdfGroupBaseline(nameRect, nameFragment, 1, nameSize, nameSize);
       page.drawText(participantName, { x: nameX, y: nameY, size: nameSize, font: nameFont, color: palette.ivory });
       const nameWidth = Math.min(nameTextWidth + nameSize * 1.2, nameRect.width);
       const nameCenter = nameFragment.align === "left" ? nameRect.x + nameWidth / 2 : nameFragment.align === "right" ? nameRect.x + nameRect.width - nameWidth / 2 : nameRect.x + nameRect.width / 2;
       pdfPremiumRule(page, nameCenter - nameWidth / 2, nameCenter + nameWidth / 2, nameY - 12, palette);
       }
       if (fragmentVisible("certificate", "closing")) {
       const closingSize = 9.5 * bodyScale;
       const closingLines = pdfWrap(serif, C().certificateClosing, closingSize, closingRect.width).slice(0, 3);
       const closingLineHeight = 12.5 * bodyScale;
       const closingStartY = pdfGroupBaseline(closingRect, closingFragment, closingLines.length, closingLineHeight, closingSize);
       closingLines.forEach((line, index) => page.drawText(line, { x: pdfTextX(closingRect, closingFragment, serif, line, closingSize), y: closingStartY - index * closingLineHeight, size: closingSize, font: serif, color: palette.ivory }));
       }
       if (fragmentVisible("certificate", "author")) pdfContained(page, author, authorRect.x, authorRect.y, authorRect.width, authorRect.height, .96);
     } else {
      const [width, height] = A4.portrait.pdf;
      const page = pdf.addPage([width, height]);
       const [background, texture, stamp] = await Promise.all([
         embedPdfImage(pdf, reportBackground()), embedPdfImage(pdf, assets.texture), embedPdfImage(pdf, stampAsset("report")),
       ]);
       const layout = reportLayout().pdf;
       const numberRect = pdfFragmentRect("report", "code", width, height);
       const metaRect = pdfFragmentRect("report", "meta", width, height);
       const titleRect = pdfFragmentRect("report", "title", width, height);
       const quoteRect = pdfFragmentRect("report", "quote", width, height);
       const instructionRect = pdfFragmentRect("report", "instruction", width, height);
       const linesRect = pdfFragmentRect("report", "lines", width, height);
       const entryRect = pdfFragmentRect("report", "entry", width, height);
       const signatureRect = pdfFragmentRect("report", "signature", width, height);
       const stampRect = pdfFragmentRect("report", "stamp", width, height);
       const titleFragment = layoutFragment("report", "title");
       const quoteFragment = layoutFragment("report", "quote");
       const instructionFragment = layoutFragment("report", "instruction");
       const entryFragment = layoutFragment("report", "entry");
       const signatureFragment = layoutFragment("report", "signature");
       const titleScale = scaleValue("reportTitleScale");
       const textScale = scaleValue("reportTextScale");
      page.drawImage(background, { x: 0, y: 0, width, height });
      if (texture) page.drawImage(texture, { x: 0, y: 0, width, height, opacity: .19 });
       page.drawRectangle({ x: 31, y: 30, width: width - 62, height: height - 60, borderColor: palette.brown, borderWidth: 1.1, opacity: .82 });
       if (fragmentVisible("report", "code")) {
         const documentNumber = data.documentNumber || issueNumber();
         const numberSize = pdfSizeToFit(typewriter, documentNumber, 7.5, 5.8, numberRect.width);
         page.drawText(documentNumber, { x: numberRect.x + (numberRect.width - typewriter.widthOfTextAtSize(documentNumber, numberSize)) / 2, y: numberRect.y + numberRect.height * .36, size: numberSize, font: typewriter, color: palette.ink });
       }
       if (fragmentVisible("report", "meta")) {
       const metaLeft = metaRect.x;
       const metaRight = metaRect.x + metaRect.width;
       const metaWidth = metaRect.width * .42;
       const metaLabelY = metaRect.y + metaRect.height * .58;
       const metaValueY = metaRect.y + metaRect.height * .24;
       const metaRuleY = metaRect.y + metaRect.height * .08;
       page.drawText(`${C().dateField.toUpperCase()}:`, { x: metaLeft, y: metaLabelY, size: 7, font: typewriter, color: palette.ink });
       pdfRight(page, `${C().placeField.toUpperCase()}:`, typewriter, 7, metaRight, metaLabelY, palette.ink);
       const dateSize = pdfSizeToFit(typewriter, dateLabel(), 9, 6.8, metaWidth);
       page.drawText(dateLabel(), { x: metaLeft, y: metaValueY, size: dateSize, font: typewriter, color: palette.ink });
       const placeText = config.eventPlace || config.eventTitle;
       const placeSize = pdfSizeToFit(typewriter, placeText, 9, 6.2, metaWidth);
       pdfRight(page, placeText, typewriter, placeSize, metaRight, metaValueY, palette.ink);
       page.drawLine({ start: { x: metaLeft, y: metaRuleY }, end: { x: metaLeft + metaWidth, y: metaRuleY }, thickness: 1, color: palette.ink, opacity: .9 });
       page.drawLine({ start: { x: metaRight - metaWidth, y: metaRuleY }, end: { x: metaRight, y: metaRuleY }, thickness: 1, color: palette.ink, opacity: .9 });
       }
       if (fragmentVisible("report", "title")) {
         pdfTransparentReportTitle(page, C().reportTitle.toUpperCase(), typewriter, titleRect, palette.ink, titleScale, titleFragment);
         if (data.anonymous) pdfCentered(page, C().anonymous.toUpperCase(), typewriter, 7.2, titleRect.y - 7, palette.brown);
       }
       if (fragmentVisible("report", "quote")) {
       const quoteLines = pdfWrap(typewriter, quoteCopy[config.language][config.reportQuote], 10.5, quoteRect.width).slice(0, 4);
       const quoteStartY = pdfGroupBaseline(quoteRect, quoteFragment, quoteLines.length, 14, 10.5);
       quoteLines.forEach((line, index) => page.drawText(line, { x: pdfTextX(quoteRect, quoteFragment, typewriter, line, 10.5), y: quoteStartY - index * 14, size: 10.5, font: typewriter, color: palette.brown }));
       }
       if (fragmentVisible("report", "instruction")) {
       const instructionLines = pdfWrap(typewriter, C().reportInstruction, 8.5, instructionRect.width).slice(0, 4);
       const instructionStartY = pdfGroupBaseline(instructionRect, instructionFragment, instructionLines.length, 12.5, 8.5);
       instructionLines.forEach((line, index) => page.drawText(line, { x: pdfTextX(instructionRect, instructionFragment, typewriter, line, 8.5), y: instructionStartY - index * 12.5, size: 8.5, font: typewriter, color: palette.ink }));
       }
       const reportSize = 13.5 * textScale;
       const reportLines = pdfWrap(typewriter, data.text || C().reportPlaceholder, reportSize, entryRect.width);
       if (reportLines.length > 6) throw new Error(C().reportOverflow);
       const lineGap = linesRect.height / 6;
       const reportStartY = pdfGroupBaseline(entryRect, entryFragment, reportLines.length, lineGap, reportSize);
       for (let index = 0; index < 6; index += 1) {
         const y = linesRect.y + linesRect.height - (index + 1) * lineGap;
         if (fragmentVisible("report", "lines")) page.drawLine({ start: { x: linesRect.x, y }, end: { x: linesRect.x + linesRect.width, y }, thickness: .65, color: palette.brown, opacity: .55 });
         if (fragmentVisible("report", "entry") && reportLines[index]) page.drawText(reportLines[index], { x: pdfTextX(entryRect, entryFragment, typewriter, reportLines[index], reportSize), y: reportStartY - index * lineGap, size: reportSize, font: typewriter, color: palette.ink });
       }
       if (fragmentVisible("report", "signature")) {
       const witnessName = data.anonymous ? C().anonymous : (data.name || C().witness);
       const nameFont = config.reportSignature === "typewriter" ? typewriter : config.reportSignature === "serif" ? serif : signature;
       const witnessSize = pdfSizeToFit(nameFont, witnessName, 15, 10, signatureRect.width);
       const witnessY = pdfGroupBaseline(signatureRect, signatureFragment, 1, witnessSize, witnessSize);
       page.drawText(witnessName, { x: pdfTextX(signatureRect, signatureFragment, nameFont, witnessName, witnessSize), y: witnessY, size: witnessSize, font: nameFont, color: palette.ink });
       const witnessWidth = Math.min(nameFont.widthOfTextAtSize(witnessName, witnessSize) + witnessSize, signatureRect.width);
       const witnessCenter = signatureFragment.align === "left" ? signatureRect.x + witnessWidth / 2 : signatureFragment.align === "right" ? signatureRect.x + signatureRect.width - witnessWidth / 2 : signatureRect.x + signatureRect.width / 2;
       page.drawLine({ start: { x: witnessCenter - witnessWidth / 2, y: witnessY - 13 }, end: { x: witnessCenter + witnessWidth / 2, y: witnessY - 13 }, thickness: .9, color: palette.ink, opacity: .85 });
       const witnessLabel = C().witness.toUpperCase();
       page.drawText(witnessLabel, { x: pdfTextX(signatureRect, signatureFragment, typewriter, witnessLabel, 6.8), y: witnessY - 34, size: 6.8, font: typewriter, color: palette.ink });
       }
       if (fragmentVisible("report", "stamp")) pdfSeal25D(page, stamp, stampRect.x, stampRect.y, stampRect.width, stampRect.height, .74, rgb(.24, .16, .08));
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
      if ((config.layoutExtras?.[type] || []).some((layer) => !layer.hidden)) {
        const canvas = type === "certificate"
          ? await renderCertificate({ name: data.name, documentNumber: data.documentNumber })
          : await renderReport({ text: data.text, name: data.name, anonymous: data.anonymous, documentNumber: data.documentNumber });
        await saveRasterPdf(canvas, base);
        return;
      }
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

  function revokeExportProofUrl() {
    if (!exportProofUrl) return;
    URL.revokeObjectURL(exportProofUrl);
    exportProofUrl = "";
  }

  function closeExportProof() {
    const dialog = $("[data-export-proof]");
    if (dialog) dialog.hidden = true;
    pendingExportProof = null;
    revokeExportProofUrl();
  }

  function ensureExportProofDialog() {
    let dialog = $("[data-export-proof]");
    if (dialog) return dialog;
    dialog = document.createElement("section");
    dialog.className = "document-export-proof";
    dialog.dataset.exportProof = "true";
    dialog.hidden = true;
    dialog.innerHTML = `
      <div class="document-export-proof-card" role="dialog" aria-modal="true" aria-labelledby="documentExportProofTitle">
        <div class="document-export-proof-copy">
          <span>Low-res proof</span>
          <h2 id="documentExportProofTitle" data-export-proof-title>Review before final export</h2>
          <p data-export-proof-copy>This preview is lightweight. The final file will render at print quality after confirmation.</p>
        </div>
        <img data-export-proof-image alt="Document proof preview">
        <div class="document-export-proof-actions">
          <button class="document-action" type="button" data-export-proof-cancel>Return to edit</button>
          <button class="document-action primary" type="button" data-export-proof-confirm>Download final</button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    $("[data-export-proof-cancel]", dialog)?.addEventListener("click", () => {
      closeExportProof();
      setStatus("");
    });
    $("[data-export-proof-confirm]", dialog)?.addEventListener("click", async () => {
      const payload = pendingExportProof;
      closeExportProof();
      if (payload) await finalizeExport(payload);
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeExportProof();
        setStatus("");
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dialog.hidden) {
        closeExportProof();
        setStatus("");
      }
    });
    return dialog;
  }

  async function showExportProof(payload) {
    const dialog = ensureExportProofDialog();
    const image = $("[data-export-proof-image]", dialog);
    const title = $("[data-export-proof-title]", dialog);
    const confirm = $("[data-export-proof-confirm]", dialog);
    const canvas = payload.type === "certificate"
      ? await renderCertificate({ ...payload.data, width: 1100 })
      : await renderReport({ ...payload.data, width: 850 });
    const blob = await canvasBlob(canvas, "image/jpeg", .82);
    revokeExportProofUrl();
    exportProofUrl = URL.createObjectURL(blob);
    pendingExportProof = payload;
    if (image) image.src = exportProofUrl;
    if (title) title.textContent = payload.action === "report-share" ? "Review anonymous email copy" : "Review before final export";
    if (confirm) confirm.textContent = payload.action === "report-share" ? "Prepare email copy" : `Download final ${payload.action.endsWith("jpg") ? "JPG" : "PDF"}`;
    dialog.hidden = false;
    confirm?.focus();
  }

  async function finalizeExport(payload) {
    setBusy(true);
    setStatus(C().preparing);
    try {
      const { action, type, data, base } = payload;
      if (type === "certificate") {
        if (action.endsWith("pdf")) {
          await downloadPdf("certificate", data, base);
        } else {
          const canvas = await renderCertificate(data);
          downloadBlob(await canvasBlob(canvas), `${base}.jpg`);
        }
        setStatus(C().ready);
        return;
      }
      if (action === "report-share") {
        const canvas = await renderReport({ ...data, width: 1600 });
        const blob = await canvasBlob(canvas, "image/jpeg", .92);
        await shareAnonymousReport(blob, `${base}.jpg`);
        return;
      }
      if (action.endsWith("pdf")) {
        await downloadPdf("report", data, base);
      } else {
        const canvas = await renderReport(data);
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
      let payload;
      if (action.startsWith("certificate")) {
        payload = {
          action,
          type: "certificate",
          data: { name: certificateName, documentNumber },
          base: safeFileName(`${documentNumber}-${C().certificateTitle}-${certificateName}`),
        };
      } else {
        const anonymous = action.includes("anonymous") || action.includes("share");
        payload = {
          action,
          type: "report",
          data: { text: reportText, name: action === "report-share" ? "" : reportName, anonymous, documentNumber },
          base: safeFileName(`${documentNumber}-${C().reportTitle}-${anonymous ? "anonymous" : reportName || "witness"}`),
        };
      }
      await showExportProof(payload);
      setStatus("Proof ready. Confirm the final export when it looks correct.");
    } catch (error) {
      console.error("Document Studio export proof failed", error);
      setStatus(error.message || "Could not prepare the proof preview.");
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
    syncPresetSelect(form);
    fillAdminForm(form);
    installPresetControls(form);
    enhanceVisualSelect("certificateBackground");
    enhanceVisualSelect("reportBackground");
    installLayoutEditor();
    syncVisualOptions();
    form.addEventListener("input", (event) => {
      if (event.target?.closest?.("[data-layout-control-panel]")) return;
      if (event.target?.matches?.("[data-preset-name], [data-import-studio-preset]")) return;
      pushHistory();
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
      pushHistory();
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
