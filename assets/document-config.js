window.VH_DOCUMENTS = window.VH_DOCUMENTS || {};

window.VH_DOCUMENTS.printMaster = {
  version: '0.3.0-pr49-wall-edition',
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
            body: ['Ten zapis upamiętnia osobisty udział w projekcji audiowizualnej', '„Rap-Ort: Prawda Sumienia”', '', 'spotkaniu z pamięcią, świadectwem, ciszą i pytaniem', 'o odpowiedzialność człowieka wobec prawdy.'],
            closing: ['Nie jest dyplomem ani dokumentem urzędowym.', 'Jest pamiątkowym śladem obecności przy świadectwie.'],
            microprint: 'Pamiątkowy zapis uczestnictwa · dokument nieurzędowy · Veritas Humanum'
          },
          en: {
            body: ['This record commemorates personal participation in the audiovisual screening of', '“Rap-Ort: Prawda Sumienia”', '', 'an encounter with memory, testimony, silence and the question', 'of human responsibility before truth.'],
            closing: ['It is not an official institutional document.', 'It is a commemorative trace of presence before testimony.'],
            microprint: 'Commemorative participant record · non-official document · Veritas Humanum'
          }
        },
        wall: {
          pl: {
            body: ['Zapis uczestnictwa w projekcji audiowizualnej', '„Rap-Ort: Prawda Sumienia”', '', 'spotkaniu z pamięcią, świadectwem, ciszą i odpowiedzialnością.'],
            closing: ['Historia złożyła swoje świadectwo.', 'Teraz sumienie musi złożyć własne.'],
            microprint: 'Wall Edition · pamiątkowy zapis uczestnictwa · dokument nieurzędowy · Veritas Humanum'
          },
          en: {
            body: ['Participant record for the audiovisual screening of', '“Rap-Ort: Prawda Sumienia”', '', 'an encounter with memory, testimony, silence and responsibility.'],
            closing: ['History has given its testimony.', 'Now conscience must give its own.'],
            microprint: 'Wall Edition · commemorative participant record · non-official document · Veritas Humanum'
          }
        }
      },
      layouts: {
        cinema: {
          projectY: 330, titleY: 590, titleSize: 154, titleSpacing: 14, bodyY: 790, bodySize: 60, bodyLine: 88,
          nameY: 1195, fieldsY: 1420, closingY: 1810, signatureY: 2075, fieldWidth: 730, signatureWidth: 890,
          textMaxWidth: 2100, closingMaxWidth: 1920, titleDistress: 0.16, microprintY: 2325
        },
        museum: {
          projectY: 285, titleY: 535, titleSize: 162, titleSpacing: 16, bodyY: 755, bodySize: 58, bodyLine: 86,
          nameY: 1145, fieldsY: 1370, closingY: 1765, signatureY: 2035, fieldWidth: 790, signatureWidth: 850,
          textMaxWidth: 2020, closingMaxWidth: 1860, titleDistress: 0.1, microprintY: 2325
        },
        ceremonial: {
          projectY: 320, titleY: 610, titleSize: 178, titleSpacing: 18, bodyY: 850, bodySize: 56, bodyLine: 84,
          nameY: 1235, fieldsY: 1465, closingY: 1845, signatureY: 2055, fieldWidth: 690, signatureWidth: 930,
          textMaxWidth: 1880, closingMaxWidth: 1720, titleDistress: 0.08, microprintY: 2325
        },
        ceremonialWall: {
          projectY: 365, titleY: 685, titleSize: 198, titleSpacing: 20, bodyY: 955, bodySize: 60, bodyLine: 92,
          nameY: 1335, fieldsY: 1585, closingY: 1955, signatureY: 2110, fieldWidth: 710, signatureWidth: 980,
          textMaxWidth: 1760, closingMaxWidth: 1650, titleDistress: 0, microprintY: 2345, quiet: true
        }
      }
    },
    witnessReport: {
      format: 'a4Portrait',
      variant: 'archivalPaper',
      signatureMode: 'participant-signature-line',
      quotes: {
        pl: [
          { id: 'truth-trace', text: 'Historia złożyła swoje świadectwo. Teraz sumienie musi złożyć własne.', source: 'Veritas Humanum — linia kuratorska' },
          { id: 'silence', text: 'Cisza po świadectwie nie jest pustką. Jest miejscem, w którym człowiek zaczyna rozumieć własną odpowiedzialność.', source: 'Rap-Ort — refleksja autorska' },
          { id: 'question-remains', text: 'Raport został zapisany w historii. Pytanie pozostaje przy tym, kto go usłyszał.', source: 'Veritas Humanum — pytanie po projekcji' }
        ],
        en: [
          { id: 'truth-trace', text: 'History has given its testimony. Now conscience must give its own.', source: 'Veritas Humanum — curatorial line' },
          { id: 'silence', text: 'The silence after testimony is not empty. It is where a human being begins to understand responsibility.', source: 'Rap-Ort — authorial reflection' },
          { id: 'question-remains', text: 'The report has entered history. The question remains with the one who has heard it.', source: 'Veritas Humanum — post-screening question' }
        ]
      }
    }
  }
};
