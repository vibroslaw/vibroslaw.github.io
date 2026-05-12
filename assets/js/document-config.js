window.VH_DOCUMENTS = window.VH_DOCUMENTS || {};

window.VH_DOCUMENTS.printMaster = {
  version: '0.1.0-pr47',
  brand: {
    system: 'VERITAS HUMANUM',
    author: 'Piotr Jakub Lichwała / Vibrosław',
    contact: 'peter.lichwala@gmail.com'
  },
  output: {
    a4Landscape: { width: 841.89, height: 595.28, pixels: { width: 3508, height: 2480 }, safePixels: { width: 2480, height: 1754 } },
    a4Portrait: { width: 595.28, height: 841.89, pixels: { width: 2480, height: 3508 }, safePixels: { width: 1754, height: 2480 } },
    minPrintBackground: { width: 3000, height: 2100 },
    jpegQuality: { premium: 0.94, safe: 0.92 }
  },
  assets: {
    reportsRoot: '/public/assets/reports/',
    signature: '/public/assets/reports/author-signature-placeholder.svg',
    participation: {
      cinema: {
        a4: ['/public/assets/reports/participation-record-bg-01-archival-cinema-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi.jpeg'],
        preview: ['/public/assets/reports/participation-record-bg-01-archival-cinema-preview.webp', '/public/assets/reports/participation-record-bg-preview.webp']
      },
      museum: {
        a4: ['/public/assets/reports/participation-record-bg-02-museum-line-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi2.jpeg'],
        preview: ['/public/assets/reports/participation-record-bg-02-museum-line-preview.webp', '/public/assets/reports/participation-record-bg-preview2.webp']
      },
      ceremonial: {
        a4: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-a4.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpg', '/public/assets/reports/participation-record-bg-a4-300dpi3.jpeg'],
        preview: ['/public/assets/reports/participation-record-bg-03-ceremonial-frame-preview.webp', '/public/assets/reports/participation-record-bg-preview3.webp']
      }
    },
    witnessReport: {
      archivalPaper: {
        a4: ['/public/assets/reports/witness-report-bg-01-archival-paper-a4.jpg', '/public/assets/reports/witness-report-bg-a4-300dpi.jpg', '/public/assets/reports/witness-report-bg-a4-300dpi.jpeg'],
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
      signatureMode: 'svg-plus-role-label',
      variants: {
        cinema: { layout: 'cinema', assetKey: 'cinema', label: { pl: 'Archiwalne Kino', en: 'Archival Cinema' } },
        museum: { layout: 'museum', assetKey: 'museum', label: { pl: 'Linia Muzealna', en: 'Museum Line' } },
        ceremonial: { layout: 'ceremonial', assetKey: 'ceremonial', label: { pl: 'Rama Uroczysta', en: 'Ceremonial Frame' } }
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
