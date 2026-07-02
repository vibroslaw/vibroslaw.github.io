window.RAPORT_EVENTS = {
  version: '0.2.0-qr-generators',
  accessKeys: {
    oswiecim20260525: 'VH-OSW-2026-0525',
    syd2026: 'VH-SYD-2026'
  },
  events: {
    oswiecim20260525: {
      id: 'oswiecim20260525',
      status: 'post-event',
      access: 'qr-only-after-workshop',
      pl: {
        title: 'Rap-Ort: Prawda Sumienia — Oświęcim 2026',
        edition: 'Edycja rocznicowa',
        date: '25 maja 2026',
        time: 'po projekcji i rozmowie warsztatowej',
        place: 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu',
        shortPlace: 'Oświęcim',
        summary: 'Strona wydarzenia pozostaje zapleczem instytucjonalnym, natomiast QR dla studentów prowadzą bezpośrednio do dwóch artefaktów po warsztacie: Raportu Świadka i Zapisu Uczestnictwa.',
        externalLabel: 'Informacje organizacyjne'
      },
      en: {
        title: 'Rap-Ort: Prawda Sumienia — Oświęcim 2026',
        edition: 'Anniversary edition',
        date: '25 May 2026',
        time: 'after the screening and workshop conversation',
        place: 'Małopolska State University named after Cavalry Captain Witold Pilecki in Oświęcim',
        shortPlace: 'Oświęcim',
        summary: 'The event page remains an institutional showcase, while in-room QR links take participants directly to the Witness Report and Record of Participation artefacts.',
        externalLabel: 'Organisational information'
      },
      links: {
        pl: '/rap-ort/wydarzenia/oswiecim-2026-05-25/',
        en: '/rap-ort/events/oswiecim-2026-05-25/',
        participationPl: '/rap-ort/oswiecim/zapis-uczestnictwa/',
        participationEn: '/rap-ort/oswiecim/zapis-uczestnictwa/',
        witnessPl: '/rap-ort/oswiecim/raport-swiadka/',
        witnessEn: '/rap-ort/oswiecim/raport-swiadka/'
      },
      qr: {
        witness: '/rap-ort/oswiecim/raport-swiadka/',
        participation: '/rap-ort/oswiecim/zapis-uczestnictwa/'
      },
      assetsRoot: '/public/assets/events/rap-ort/oswiecim20260525/'
    },
    syd2026: {
      id: 'syd2026',
      status: 'post-event',
      access: 'qr-or-code',
      pl: {
        title: 'Rap-Ort: Prawda Sumienia — Sydney 2026',
        edition: 'Międzynarodowa projekcja',
        date: '21 czerwca 2026',
        time: '15:00',
        place: 'Polish Club Ashfield / Sydney',
        shortPlace: 'Sydney',
        summary: 'Międzynarodowa projekcja z pakietem uczestnika, Raportem Świadka i pamiątkowym Zapisem Uczestnictwa.',
        externalLabel: 'Więcej informacji'
      },
      en: {
        title: 'Rap-Ort: Prawda Sumienia — Sydney 2026',
        edition: 'International screening',
        date: '21 June 2026',
        time: '3:00 PM',
        place: 'Polish Club Ashfield / Sydney',
        shortPlace: 'Sydney',
        summary: 'International screening with participant memory pack, Witness Report and commemorative Record of Participation.',
        externalLabel: 'More information'
      },
      links: {
        pl: '/rap-ort/wydarzenia/sydney-2026/',
        en: '/rap-ort/events/sydney-2026/',
        participationPl: '/rap-ort/uczestnictwo/?event=syd2026',
        participationEn: '/rap-ort/participation/?event=syd2026',
        witnessPl: '/rap-ort/raport-swiadka/generator/?event=syd2026',
        witnessEn: '/rap-ort/witness-report/generator/?event=syd2026'
      },
      qr: {
        witness: '/rap-ort/raport-swiadka/generator/?event=syd2026',
        participation: '/rap-ort/participation/?event=syd2026'
      },
      assetsRoot: '/public/assets/events/rap-ort/syd2026/'
    }
  }
};
