window.RapOrtArchiveGalleries = (() => {
  const root = '/public/assets/events/rap-ort/';
  const archive = (data) => ({
    id: data.id,
    lang: data.lang,
    label: data.label,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    manifestPath: data.manifestPath,
    archiveRoot: data.archiveRoot,
    emptyTitle: data.emptyTitle,
    emptyDescription: data.emptyDescription,
    privacyTitle: data.privacyTitle,
    privacy: data.privacy || [],
    manualAddTitle: data.manualAddTitle,
    manualAddSteps: data.manualAddSteps || [],
    placeholderItems: data.placeholderItems || []
  });

  const placeholderPl = [
    { id: 'anon-001', label: 'Miejsce na anonimowy raport', meta: 'JPG · bez danych osobowych', state: 'placeholder' },
    { id: 'anon-002', label: 'Ślad refleksji po projekcji', meta: 'Dodawany ręcznie po wydarzeniu', state: 'placeholder' },
    { id: 'anon-003', label: 'Anonimowa karta archiwalna', meta: 'Gotowe miejsce w galerii', state: 'placeholder' }
  ];

  const placeholderEn = [
    { id: 'anon-001', label: 'Anonymous report slot', meta: 'JPG · no personal data', state: 'placeholder' },
    { id: 'anon-002', label: 'Post-screening reflection trace', meta: 'Added manually after the event', state: 'placeholder' },
    { id: 'anon-003', label: 'Anonymous archive card', meta: 'Prepared gallery slot', state: 'placeholder' }
  ];

  return {
    version: '0.1.0-pr69-archive-gallery',
    defaultArchiveId: 'default',
    galleries: {
      default: {
        pl: archive({
          id: 'default',
          lang: 'pl',
          label: 'Wersja publiczna',
          title: 'Anonimowe Archiwum',
          subtitle: 'Statyczny fundament pod ślady refleksji po projekcji',
          description: 'To miejsce przygotowuje stronę na przyszłe, ręcznie dodane anonimowe JPG wygenerowane z Raportu Świadka.',
          manifestPath: `${root}shared/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${root}shared/archive/`,
          emptyTitle: 'Archiwum czeka na pierwsze anonimowe ślady.',
          emptyDescription: 'Brak plików nie jest błędem. To świadomy placeholder pod przyszłe wydarzenia.',
          privacyTitle: 'Zasady archiwum',
          privacy: ['bez imienia i nazwiska', 'bez podpisu', 'bez danych kontaktowych', 'bez automatycznego uploadu'],
          manualAddTitle: 'Jak dodać materiały później',
          manualAddSteps: ['Wygeneruj anonimowy JPG lokalnie w Raporcie Świadka.', 'Zweryfikuj, że nie zawiera danych osobowych.', 'Dodaj plik ręcznie do folderu archive/anonymous i uzupełnij manifest.'],
          placeholderItems: placeholderPl
        }),
        en: archive({
          id: 'default',
          lang: 'en',
          label: 'Public Preview',
          title: 'Anonymous Archive',
          subtitle: 'Static foundation for post-screening reflection traces',
          description: 'This space prepares the site for future manually added anonymous JPG files generated from the Witness Report.',
          manifestPath: `${root}shared/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${root}shared/archive/`,
          emptyTitle: 'The archive is ready for the first anonymous traces.',
          emptyDescription: 'Missing files are not an error. This is an intentional placeholder for future events.',
          privacyTitle: 'Archive principles',
          privacy: ['no name or surname', 'no signature', 'no contact details', 'no automatic upload'],
          manualAddTitle: 'How materials can be added later',
          manualAddSteps: ['Generate an anonymous JPG locally in the Witness Report.', 'Verify that it contains no personal data.', 'Manually add the file to archive/anonymous and update the manifest.'],
          placeholderItems: placeholderEn
        })
      },
      oswiecim20260525: {
        pl: archive({
          id: 'oswiecim20260525',
          lang: 'pl',
          label: 'Oświęcim / MUP',
          title: 'Anonimowe Archiwum — Oświęcim / MUP',
          subtitle: 'Ślady refleksji po projekcji i rozmowie',
          description: 'Statyczna galeria przygotowana pod anonimowe Raporty Świadka uczestników wydarzenia. Na tym etapie pliki dodaje się ręcznie po świadomej weryfikacji prywatności.',
          manifestPath: `${root}oswiecim20260525/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${root}oswiecim20260525/archive/`,
          emptyTitle: 'Miejsce gotowe na anonimowe raporty Oświęcim / MUP.',
          emptyDescription: 'Po wydarzeniu można ręcznie dodać wybrane anonimowe JPG do folderu archive/anonymous.',
          privacyTitle: 'Ochrona uczestnika',
          privacy: ['wersja prywatna zostaje u uczestnika', 'wersja archiwalna nie zawiera podpisu', 'brak danych osobowych', 'ręczne dodanie po weryfikacji'],
          manualAddTitle: 'Manualny proces archiwizacji',
          manualAddSteps: ['Uczestnik pobiera anonimowy JPG.', 'Prowadzący zbiera tylko materiały bez danych osobowych.', 'Wybrane pliki trafiają do public/assets/events/rap-ort/oswiecim20260525/archive/anonymous/.', 'ARCHIVE_MANIFEST.json decyduje, które elementy są widoczne.'],
          placeholderItems: placeholderPl
        }),
        en: archive({
          id: 'oswiecim20260525',
          lang: 'en',
          label: 'Oświęcim / MUP',
          title: 'Anonymous Archive — Oświęcim / MUP',
          subtitle: 'Reflection traces after the screening and conversation',
          description: 'A static gallery prepared for anonymous Witness Reports from event participants. At this stage, files are added manually after privacy verification.',
          manifestPath: `${root}oswiecim20260525/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${root}oswiecim20260525/archive/`,
          emptyTitle: 'A place prepared for anonymous Oświęcim / MUP reports.',
          emptyDescription: 'After the event, selected anonymous JPG files can be manually added to archive/anonymous.',
          privacyTitle: 'Participant protection',
          privacy: ['private version remains with the participant', 'archive version contains no signature', 'no personal data', 'manual addition after verification'],
          manualAddTitle: 'Manual archive process',
          manualAddSteps: ['The participant downloads an anonymous JPG.', 'The facilitator collects only materials without personal data.', 'Selected files go to public/assets/events/rap-ort/oswiecim20260525/archive/anonymous/.', 'ARCHIVE_MANIFEST.json controls which items are visible.'],
          placeholderItems: placeholderEn
        })
      },
      syd2026: {
        pl: archive({
          id: 'syd2026',
          lang: 'pl',
          label: 'Sydney 2026',
          title: 'Anonimowe Archiwum — Sydney 2026',
          subtitle: 'Przyszła galeria anonimowych śladów uczestników',
          description: 'Fundament pod ręcznie dodawane anonimowe materiały po projekcji Sydney 2026 i Q&A online z autorem.',
          manifestPath: `${root}syd2026/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${root}syd2026/archive/`,
          emptyTitle: 'Archiwum Sydney 2026 jest przygotowane.',
          emptyDescription: 'Galeria pokaże elementy dopiero po ręcznym dodaniu anonimowych plików i manifestu.',
          privacyTitle: 'Zasady bezpieczeństwa',
          privacy: ['brak automatycznej wysyłki', 'brak danych osobowych', 'brak sugerowania patronatu', 'statyczna kontrola widoczności'],
          manualAddTitle: 'Proces po wydarzeniu',
          manualAddSteps: ['Wygeneruj anonimowe pliki lokalnie.', 'Sprawdź prywatność i brak danych osobowych.', 'Dodaj wybrane pliki do folderu Sydney archive/anonymous.', 'Zaktualizuj manifest widoczności.'],
          placeholderItems: placeholderPl
        }),
        en: archive({
          id: 'syd2026',
          lang: 'en',
          label: 'Sydney 2026',
          title: 'Anonymous Archive — Sydney 2026',
          subtitle: 'Future gallery of anonymous participant traces',
          description: 'A foundation for manually added anonymous materials after the Sydney 2026 screening and live online Q&A with the author.',
          manifestPath: `${root}syd2026/archive/ARCHIVE_MANIFEST.json`,
          archiveRoot: `${root}syd2026/archive/`,
          emptyTitle: 'The Sydney 2026 archive is prepared.',
          emptyDescription: 'The gallery will display items only after anonymous files and a manifest are manually added.',
          privacyTitle: 'Safety principles',
          privacy: ['no automatic submission', 'no personal data', 'no implied patronage', 'static visibility control'],
          manualAddTitle: 'Post-event process',
          manualAddSteps: ['Generate anonymous files locally.', 'Check privacy and absence of personal data.', 'Add selected files to the Sydney archive/anonymous folder.', 'Update the visibility manifest.'],
          placeholderItems: placeholderEn
        })
      }
    }
  };
})();
