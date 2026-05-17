window.VH_DOCUMENTS = window.VH_DOCUMENTS || {};

window.VH_DOCUMENTS.printMaster = {
  version: '0.4.0-pr65-mup-event-stabilization',
  brand: {
    system: 'VERITAS HUMANUM',
    author: 'Piotr Jakub Lichwała / Vibrosław',
    contact: 'peter.lichwala@gmail.com'
  },
  output: {
    a4Landscape: { width: 841.89, height: 595.28, pixels: { width: 3508, height: 2480 }, safePixels: { width: 2480, height: 1754 } },
    a4Portrait: { width: 595.28, height: 841.89, pixels: { width: 2480, height: 3508 }, safePixels: { width: 1754, height: 2480 } },
    a3Landscape: { width: 1190.55, height: 841.89, pixels: { width: 4961, height: 3508 }, safePixels: { width: 3508, height: 2480 } },
    minPrintBackground: { width: 3000, height: 2100 },
    wallReadyBackground: { width: 3508, height: 2480 },
    jpegQuality: { premium: 0.94, safe: 0.92, wall: 0.96 }
  },
  assets: {
    reportsRoot: '/public/assets/reports/',
    signature: '/public/assets/reports/author-signature-placeholder.svg',
    participation: {
      cinema: {
        a4: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpeg', '/public/assets/reports/participation-record-bg-a4-300dpi.png'],
        preview: ['/public/assets/reports/participation-record-bg-01-archival-cinema-preview.webp', '/public/assets/reports/participation-record-bg-preview.webp']
      },
      museum: {
        a4: ['/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpeg', '/public/assets/reports/participation-record-bg-a4-300dpi2.png'],
        preview: ['/public/assets/reports/participation-record-bg-02-museum-line-preview.webp', '/public/assets/reports/participation-record-bg-preview2.webp']
      },
      ceremonial: {
        a4: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpeg', '/public/assets/reports/participation-record-bg-a4-300dpi3.png'],
        preview: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-preview.webp', '/public/assets/reports/participation-record-bg-preview3.webp']
      }
    },
    witnessReport: {
      archivalPaper: {
        a4: ['/public/assets/reports/witness-report-bg-01-archival-paper-a4.jpg', '/public/assets/reports/witness-report-bg-a4-300dpi.jpg', '/public/assets/reports/witness-report-bg-a4-300dpi.jpeg', '/public/assets/reports/witness-report-bg-a4-300dpi.png'],
        preview: ['/public/assets/reports/witness-report-bg-01-archival-paper-preview.webp', '/public/assets/reports/witness-report-bg-preview.webp']
      }
    }
  },
  typography: {
    participationRecord: {
      title: { family: 'Georgia', futureFamily: 'Veritas Humanum Monument Serif', role: 'monumental serif title' },
      body: { family: 'Georgia', role: 'premium ceremonial body copy' },
      meta: { family: 'Arial', role: 'clean institutional metadata' },
      number: { family: 'Arial', futureFamily: 'IBM Plex Mono or Courier Prime', role: 'archival numbering' }
    },
    witnessReport: {
      title: { family: 'Georgia', futureFamily: 'Veritas Humanum Monument Serif', role: 'archival report title' },
      quote: { family: 'Georgia', style: 'italic', role: 'source / reflection quote' },
      reflection: { family: 'Georgia', futureFamily: 'premium typewriter', role: 'participant reflection text' },
      meta: { family: 'Arial', role: 'report metadata' }
    }
  },
  events: {
    oswiecim20260525: {
      code: 'OSW',
      accessCode: 'VH-OSW-2026-0525',
      project: 'rap-ort',
      title: 'Rap-Ort: Prawda Sumienia — Oświęcim 2026',
      dateInput: '2026-05-25',
      pl: {
        place: 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu',
        dateLabel: '25 maja 2026',
        badgeLine: 'Edycja rocznicowa · warsztat akademicki'
      },
      en: {
        place: 'Małopolska State University named after Cavalry Captain Witold Pilecki in Oświęcim',
        dateLabel: '25 May 2026',
        badgeLine: 'Anniversary edition · academic workshop'
      },
      accent: { edition: 'Oświęcim Anniversary Edition', microLine: 'MUP Oświęcim · 25 maja 2026', code: 'OSW' },
      documents: ['participationRecord', 'witnessReport']
    },
    syd2026: {
      code: 'SYD',
      accessCode: 'VH-SYD-2026',
      project: 'rap-ort',
      title: 'Rap-Ort: Prawda Sumienia — Sydney 2026',
      dateInput: '2026-06-21',
      pl: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 czerwca 2026', badgeLine: 'Międzynarodowa projekcja' },
      en: { place: 'Polish Club Ashfield / Sydney', dateLabel: '21 June 2026', badgeLine: 'International screening' },
      accent: { edition: 'Sydney Edition', microLine: 'Polish Club Ashfield / Sydney', code: 'SYD' },
      documents: ['participationRecord', 'witnessReport']
    }
  },
  documents: {
    participationRecord: {
      format: 'a4Landscape',
      signatureMode: 'svg-plus-role-label-only',
      exports: {
        standard: { format: 'a4Landscape', label: { pl: 'A4 print-master', en: 'A4 print-master' }, recommendedVariant: 'ceremonial' },
        wall: { format: 'a3Landscape', label: { pl: 'A3 wall edition', en: 'A3 wall edition' }, recommendedVariant: 'ceremonial' }
      },
      variants: {
        cinema: { layout: 'cinema', assetKey: 'cinema', label: { pl: 'Archiwalne Kino', en: 'Archival Cinema' } },
        museum: { layout: 'museum', assetKey: 'museum', label: { pl: 'Linia Muzealna', en: 'Museum Line' } },
        ceremonial: { layout: 'ceremonial', assetKey: 'ceremonial', label: { pl: 'Rama Uroczysta', en: 'Ceremonial Frame' } }
      },
      copyProfiles: {
        standard: {
          pl: {
            body: ['Dokument upamiętnia udział w projekcji audiowizualnej', '„Rap-Ort: Prawda Sumienia”', '', 'autorskim doświadczeniu muzyki, obrazu, słowa i ciszy,', 'poświęconym pamięci, świadectwu, sumieniu', 'oraz odpowiedzialności wobec prawdy.'],
            closing: ['Pamiątkowy ślad wydarzenia, w którym historia', 'staje się pytaniem, które uczestnik zabiera ze sobą.'],
            microprint: 'Pamiątkowy zapis uczestnictwa · nie jest dyplomem ani dokumentem urzędowym'
          },
          en: {
            body: ['This document commemorates participation in the audiovisual screening of', '“Rap-Ort: Prawda Sumienia”', '', 'an authorial experience of music, image, words and silence,', 'devoted to memory, testimony, conscience', 'and human responsibility before truth.'],
            closing: ['A commemorative trace of an event in which history', 'becomes a question the participant carries forward.'],
            microprint: 'Commemorative record of participation · not an official certificate'
          }
        },
        wall: {
          pl: {
            body: ['Dokument upamiętnia udział w projekcji audiowizualnej', '„Rap-Ort: Prawda Sumienia”', '', 'doświadczeniu pamięci, świadectwa, ciszy i odpowiedzialności.'],
            closing: ['Prawda nie kończy się na ekranie.', 'Zostaje w pytaniu, które człowiek zabiera ze sobą.'],
            microprint: 'Wall Edition · pamiątkowy zapis uczestnictwa · Veritas Humanum'
          },
          en: {
            body: ['This document commemorates participation in the audiovisual screening of', '“Rap-Ort: Prawda Sumienia”', '', 'an experience of memory, testimony, silence and responsibility.'],
            closing: ['Truth does not end on the screen.', 'It remains in the question a human being carries forward.'],
            microprint: 'Wall Edition · commemorative record of participation · Veritas Humanum'
          }
        }
      },
      layouts: {
        cinema: { projectY: 300, titleY: 505, titleSize: 118, titlePlateWidth: 2180, bodyY: 760, bodySize: 43, nameLabelY: 1085, nameY: 1160, fieldsY: 1455, closingY: 1818, signatureY: 2090, fieldWidth: 700, placeWidth: 780, signatureWidth: 840, textMaxWidth: 1740, closingMaxWidth: 1540, microprintY: 2328 },
        museum: { projectY: 285, titleY: 495, titleSize: 120, titlePlateWidth: 2220, bodyY: 745, bodySize: 42, nameLabelY: 1065, nameY: 1138, fieldsY: 1438, closingY: 1795, signatureY: 2065, fieldWidth: 720, placeWidth: 820, signatureWidth: 805, textMaxWidth: 1700, closingMaxWidth: 1500, microprintY: 2328 },
        ceremonial: { projectY: 305, titleY: 535, titleSize: 126, titlePlateWidth: 2260, bodyY: 805, bodySize: 40, nameLabelY: 1130, nameY: 1208, fieldsY: 1490, closingY: 1842, signatureY: 2090, fieldWidth: 660, placeWidth: 820, signatureWidth: 900, textMaxWidth: 1580, closingMaxWidth: 1420, microprintY: 2332 },
        ceremonialWall: { projectY: 345, titleY: 620, titleSize: 140, titlePlateWidth: 2420, bodyY: 910, bodySize: 43, nameLabelY: 1235, nameY: 1310, fieldsY: 1605, closingY: 1948, signatureY: 2160, fieldWidth: 680, placeWidth: 840, signatureWidth: 960, textMaxWidth: 1540, closingMaxWidth: 1360, microprintY: 2348 }
      }
    },
    witnessReport: {
      format: 'a4Portrait',
      variant: 'archivalPaper',
      signatureMode: 'participant-signature-line',
      quotes: {
        pl: [
          { id: 'truth-trace', text: 'Prawda nie kończy się na ekranie. Zostaje w decyzji, którą człowiek podejmuje później.', source: 'Veritas Humanum — ślad po projekcji' },
          { id: 'silence', text: 'Cisza po świadectwie nie jest pustką. Jest miejscem, w którym zaczyna pracować sumienie.', source: 'Rap-Ort — refleksja autorska' },
          { id: 'question-remains', text: 'Świadectwo zostało wypowiedziane. Teraz pytanie zostaje przy Tobie.', source: 'Veritas Humanum — pytanie końcowe' }
        ],
        en: [
          { id: 'truth-trace', text: 'Truth does not end on the screen. It remains in the decision a human being makes afterwards.', source: 'Veritas Humanum — post-screening trace' },
          { id: 'silence', text: 'The silence after testimony is not empty. It is the place where conscience begins to work.', source: 'Rap-Ort — authorial reflection' },
          { id: 'question-remains', text: 'The testimony has been spoken. Now the question remains with you.', source: 'Veritas Humanum — final question' }
        ]
      }
    }
  }
};
