window.RapOrtArchiveGalleries = (() => {
  const archiveRoot = '/public/assets/events/rap-ort/';

  const gallery = (data) => ({
    id: data.id,
    lang: data.lang,
    label: data.label,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    manifestPath: data.manifestPath,
    archiveRoot: data.archiveRoot,
    privacyTitle: data.privacyTitle,
    privacyText: data.privacyText,
    emptyTitle: data.emptyTitle,
    emptyText: data.emptyText,
    items: data.items || []
  });

  const emptyItems = {
    pl: [
      {
        id: 'placeholder-1',
        type: 'placeholder',
        title: 'Miejsce na anonimowy Raport Świadka',
        description: 'Po wydarzeniu mogą pojawić się tutaj wybrane anonimowe JPG dodane ręcznie do statycznego archiwum.',
        date: '',
        file: '',
        visible: true
      },
      {
        id: 'placeholder-2',
        type: 'placeholder',
        title: 'Bez imienia, nazwiska i podpisu',
        description: 'Galeria jest przygotowana wyłącznie pod materiały bez danych osobowych.',
        date: '',
        file: '',
        visible: true
      },
      {
        id: 'placeholder-3',
        type: 'placeholder',
        title: 'Ślad refleksji po projekcji',
        description: 'To nie jest tablica ocen ani ankieta. To przyszła przestrzeń spokojnych, anonimowych śladów.',
        date: '',
        file: '',
        visible: true
      }
    ],
    en: [
      {
        id: 'placeholder-1',
        type: 'placeholder',
        title: 'Space for an anonymous Witness Report',
        description: 'After the event, selected anonymous JPG files may appear here when manually added to the static archive.',
        date: '',
        file: '',
        visible: true
      },
      {
        id: 'placeholder-2',
        type: 'placeholder',
        title: 'No name, surname or signature',
        description: 'The gallery is prepared only for materials without personal data.',
        date: '',
        file: '',
        visible: true
      },
      {
        id: 'placeholder-3',
        type: 'placeholder',
        title: 'A trace of reflection after the screening',
        description: 'This is not a grading board or a survey. It is a future space for calm anonymous traces.',
        date: '',
        file: '',
        visible: true
      }
    ]
  };

  return {
    version: '0.1.0-pr69-archive-gallery',
    defaultGalleryId: 'default',
    galleries: {
      default: {
        pl: gallery({
          id: 'default',
          lang: 'pl',
          label: 'Wersja publiczna',
          title: 'Anonimowe Archiwum',
          subtitle: 'Fundament galerii śladów refleksji',
          description: 'Statyczna przestrzeń przygotowana pod anonimowe wersje Raportów Świadka. W tej wersji nic nie jest wysyłane ani zapisywane automatycznie.',
          manifestPath: `${archiveRoot}shared/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${archiveRoot}shared/archive/`,
          privacyTitle: 'Zasada prywatności',
          privacyText: 'Do archiwum mogą trafić wyłącznie materiały anonimowe: bez imienia, nazwiska, podpisu i danych osobowych.',
          emptyTitle: 'Archiwum czeka na pierwsze materiały',
          emptyText: 'Gdy dodasz anonimowe JPG do folderu archiwum i manifestu, galeria wyświetli je automatycznie.',
          items: emptyItems.pl
        }),
        en: gallery({
          id: 'default',
          lang: 'en',
          label: 'Public Preview',
          title: 'Anonymous Archive',
          subtitle: 'Foundation for a reflection-trace gallery',
          description: 'A static space prepared for anonymous Witness Report versions. In this version, nothing is uploaded or stored automatically.',
          manifestPath: `${archiveRoot}shared/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${archiveRoot}shared/archive/`,
          privacyTitle: 'Privacy principle',
          privacyText: 'Only anonymous materials may enter the archive: no name, no surname, no signature and no personal data.',
          emptyTitle: 'The archive is waiting for its first materials',
          emptyText: 'When anonymous JPG files are added to the archive folder and manifest, the gallery will display them automatically.',
          items: emptyItems.en
        })
      },
      oswiecim20260525: {
        pl: gallery({
          id: 'oswiecim20260525',
          lang: 'pl',
          label: 'Oświęcim / MUP',
          title: 'Anonimowe Raporty Świadka — Oświęcim / MUP',
          subtitle: 'Ślady refleksji po projekcji i rozmowie',
          description: 'Fundament statycznej galerii anonimowych raportów uczestników wydarzenia. Uczestnik może zachować raport dla siebie albo przekazać anonimowy JPG prowadzącemu.',
          manifestPath: `${archiveRoot}oswiecim20260525/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${archiveRoot}oswiecim20260525/archive/`,
          privacyTitle: 'Bez danych osobowych',
          privacyText: 'Wersja archiwalna Raportu Świadka nie zawiera imienia, nazwiska, podpisu ani widocznego identyfikatora uczestnika.',
          emptyTitle: 'Galeria Oświęcim / MUP jest gotowa na pierwsze anonimowe raporty',
          emptyText: 'Po wydarzeniu dodaj wybrane JPG ręcznie do folderu anonymous i uzupełnij ARCHIVE_MANIFEST.json.',
          items: emptyItems.pl
        }),
        en: gallery({
          id: 'oswiecim20260525',
          lang: 'en',
          label: 'Oświęcim / MUP',
          title: 'Anonymous Witness Reports — Oświęcim / MUP',
          subtitle: 'Traces of reflection after the screening and conversation',
          description: 'A static gallery foundation for anonymous reports from event participants. A participant may keep the report privately or pass an anonymous JPG to the facilitator.',
          manifestPath: `${archiveRoot}oswiecim20260525/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${archiveRoot}oswiecim20260525/archive/`,
          privacyTitle: 'No personal data',
          privacyText: 'The archive version of the Witness Report contains no name, no surname, no signature and no visible participant identifier.',
          emptyTitle: 'The Oświęcim / MUP gallery is ready for its first anonymous reports',
          emptyText: 'After the event, add selected JPG files manually to the anonymous folder and update ARCHIVE_MANIFEST.json.',
          items: emptyItems.en
        })
      },
      syd2026: {
        pl: gallery({
          id: 'syd2026',
          lang: 'pl',
          label: 'Sydney 2026',
          title: 'Anonimowe Archiwum — Sydney 2026',
          subtitle: 'Ślady refleksji po projekcji i Q&A',
          description: 'Statyczna przestrzeń przygotowana pod przyszłe anonimowe materiały uczestników wydarzenia Sydney 2026.',
          manifestPath: `${archiveRoot}syd2026/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${archiveRoot}syd2026/archive/`,
          privacyTitle: 'Prywatność uczestnika',
          privacyText: 'Materiały archiwalne nie mogą zawierać danych osobowych ani sugerować oficjalnego patronatu.',
          emptyTitle: 'Archiwum Sydney 2026 czeka na pierwsze materiały',
          emptyText: 'Po wydarzeniu możesz dodać anonimowe JPG ręcznie i włączyć je w manifeście.',
          items: emptyItems.pl
        }),
        en: gallery({
          id: 'syd2026',
          lang: 'en',
          label: 'Sydney 2026',
          title: 'Anonymous Archive — Sydney 2026',
          subtitle: 'Traces of reflection after the screening and Q&A',
          description: 'A static space prepared for future anonymous materials from Sydney 2026 event participants.',
          manifestPath: `${archiveRoot}syd2026/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${archiveRoot}syd2026/archive/`,
          privacyTitle: 'Participant privacy',
          privacyText: 'Archive materials must not contain personal data and must not imply official patronage.',
          emptyTitle: 'The Sydney 2026 archive is waiting for its first materials',
          emptyText: 'After the event, anonymous JPG files can be added manually and enabled in the manifest.',
          items: emptyItems.en
        })
      }
    }
  };
})();
