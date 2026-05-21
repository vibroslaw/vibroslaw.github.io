window.RapOrtEventPortals = (() => {
  const portal = (data) => ({
    id: data.id,
    lang: data.lang,
    label: data.label,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    eventDate: data.eventDate || '',
    location: data.location || '',
    closingLine: data.closingLine,
    modules: data.modules,
    privacyNote: data.privacyNote,
    facilitatorNote: data.facilitatorNote
  });

  const modules = {
    pl: [
      {
        id: 'access',
        label: 'Dostęp wydarzenia',
        title: 'Wejdź przez QR lub link wydarzenia',
        description: 'To pierwszy punkt orientacyjny uczestnika: właściwy event, kod, link, share i ścieżka działania.',
        href: '#access-flow-title',
        status: 'Aktywne'
      },
      {
        id: 'witness',
        label: 'Raport Świadka',
        title: 'Zapisz to, co zostało po projekcji',
        description: 'Prywatny raport PDF oraz anonimowa wersja JPG do przyszłego archiwum wydarzenia.',
        href: '/rap-ort/raport-swiadka/generator/',
        status: 'Moduł refleksji'
      },
      {
        id: 'participation',
        label: 'Zapis Uczestnictwa',
        title: 'Utwórz dokument pamiątkowy',
        description: 'Elegancki PDF z datą, miejscem, numerem dokumentu i eventową oprawą.',
        href: '#generator',
        status: 'Aktywne'
      },
      {
        id: 'memory',
        label: 'Pakiet Uczestnika',
        title: 'Zabierz ze sobą materiały po wydarzeniu',
        description: 'Karty, tapety, pamiątkowe materiały i placeholdery pod assety przygotowane dla wydarzenia.',
        href: '#memory-pack',
        status: 'Aktywne'
      },
      {
        id: 'archive',
        label: 'Anonimowe Archiwum',
        title: 'Zobacz fundament galerii śladów refleksji',
        description: 'Statyczna galeria anonimowych raportów bez imienia, podpisu i danych osobowych.',
        href: '#archive-gallery',
        status: 'Fundament'
      }
    ],
    en: [
      {
        id: 'access',
        label: 'Event access',
        title: 'Enter through QR or event link',
        description: 'The participant’s first orientation point: event context, code, link, share and guided path.',
        href: '#access-flow-title',
        status: 'Active'
      },
      {
        id: 'witness',
        label: 'Witness Report',
        title: 'Record what remains after the screening',
        description: 'A private PDF report and an anonymous JPG version prepared for a future event archive.',
        href: '/rap-ort/witness-report/generator/',
        status: 'Reflection module'
      },
      {
        id: 'participation',
        label: 'Participation Record',
        title: 'Create a commemorative document',
        description: 'An elegant PDF with date, place, document number and event-specific visual framing.',
        href: '#generator',
        status: 'Active'
      },
      {
        id: 'memory',
        label: 'Memory Pack',
        title: 'Take post-event materials with you',
        description: 'Cards, wallpapers, commemorative materials and placeholders prepared for the event edition.',
        href: '#memory-pack',
        status: 'Active'
      },
      {
        id: 'archive',
        label: 'Anonymous Archive',
        title: 'View the foundation of a reflection-trace gallery',
        description: 'A static gallery of anonymous reports without name, signature or personal data.',
        href: '#archive-gallery',
        status: 'Foundation'
      }
    ]
  };

  return {
    version: '0.1.0-pr69-event-portal',
    defaultPortalId: 'default',
    portals: {
      default: {
        pl: portal({
          id: 'default',
          lang: 'pl',
          label: 'Wersja publiczna',
          title: 'Portal Uczestnika',
          subtitle: 'Jedna ścieżka po projekcji',
          description: 'Ten portal prowadzi uczestnika od linku wydarzenia przez dokument, refleksję, pakiet pamiątkowy i przyszłe anonimowe archiwum.',
          eventDate: 'Data wydarzenia',
          location: 'Miejsce / instytucja',
          modules: modules.pl,
          closingLine: 'To nie jest ankieta. To ślad tego, co zostaje po spotkaniu ze świadectwem.',
          privacyNote: 'Wszystkie dokumenty powstają lokalnie w przeglądarce. Archiwum w tej wersji jest statyczne i nie zapisuje danych użytkownika.',
          facilitatorNote: 'Prowadzący może użyć tej strony jako spokojnej mapy działań po projekcji.'
        }),
        en: portal({
          id: 'default',
          lang: 'en',
          label: 'Public Preview',
          title: 'Participant Portal',
          subtitle: 'One post-screening path',
          description: 'This portal guides the participant from event link to document, reflection, memory pack and future anonymous archive.',
          eventDate: 'Event date',
          location: 'Place / institution',
          modules: modules.en,
          closingLine: 'This is not a survey. It is a trace of what remains after encountering testimony.',
          privacyNote: 'All documents are created locally in the browser. The archive in this version is static and does not store user data.',
          facilitatorNote: 'The facilitator can use this page as a calm post-screening action map.'
        })
      },
      oswiecim20260525: {
        pl: portal({
          id: 'oswiecim20260525',
          lang: 'pl',
          label: 'Oświęcim / MUP',
          title: 'Portal Uczestnika — Oświęcim / MUP',
          subtitle: 'Warsztatowa ścieżka po projekcji',
          description: 'Po projekcji uczestnik przechodzi przez refleksję, dokument, pamiątkowy pakiet i fundament anonimowego archiwum wydarzenia.',
          eventDate: '25 maja 2026',
          location: 'Oświęcim / MUP',
          modules: modules.pl.map((module) => module.id === 'witness' ? { ...module, title: 'Raport Świadka przez QR na sali', description: 'Raport Świadka pozostaje osobnym rytuałem uruchamianym przez QR podczas wydarzenia.', href: '#access-flow-title', status: 'QR podczas wydarzenia' } : module),
          closingLine: 'Nie chodzi o jedną poprawną odpowiedź. Chodzi o odpowiedzialną rozmowę po spotkaniu ze świadectwem.',
          privacyNote: 'Anonimowa wersja Raportu Świadka nie zawiera imienia, nazwiska, podpisu ani danych osobowych. Wersja archiwalna jest pobierana lokalnie i może być przekazana prowadzącemu ręcznie.',
          facilitatorNote: 'Portal nie zastępuje prowadzącego. Porządkuje rytm pracy po projekcji: wejście, refleksja, dokument, pamiątka, archiwum.'
        }),
        en: portal({
          id: 'oswiecim20260525',
          lang: 'en',
          label: 'Oświęcim / MUP',
          title: 'Participant Portal — Oświęcim / MUP',
          subtitle: 'A workshop path after the screening',
          description: 'After the screening, the participant moves through reflection, document creation, memory pack and the foundation of an anonymous event archive.',
          eventDate: '25 May 2026',
          location: 'Oświęcim / MUP',
          modules: modules.en.map((module) => module.id === 'witness' ? { ...module, title: 'Witness Report through in-room QR', description: 'The Witness Report remains a separate ritual opened by QR during the event.', href: '#access-flow-title', status: 'QR during the event' } : module),
          closingLine: 'It is not about one correct answer. It is about responsible conversation after encountering testimony.',
          privacyNote: 'The anonymous Witness Report version contains no name, no signature and no personal data. The archive version is downloaded locally and may be passed to the facilitator manually.',
          facilitatorNote: 'The portal does not replace the facilitator. It organises the post-screening rhythm: entry, reflection, document, keepsake, archive.'
        })
      },
      syd2026: {
        pl: portal({
          id: 'syd2026',
          lang: 'pl',
          label: 'Sydney 2026',
          title: 'Portal Uczestnika — Sydney 2026',
          subtitle: 'Ścieżka po projekcji i Q&A',
          description: 'Portal prowadzi uczestnika projekcji i rozmowy online od dostępu przez dokument i pakiet pamiątkowy do przyszłego anonimowego archiwum.',
          eventDate: '21 czerwca 2026',
          location: 'Polish Club Ashfield / Sydney',
          modules: modules.pl.map((module) => module.id === 'witness' ? { ...module, href: '/rap-ort/raport-swiadka/generator/?event=syd2026' } : module),
          closingLine: 'Prawda nie kończy się na ekranie. Zostaje w pytaniu, które człowiek zabiera ze sobą.',
          privacyNote: 'Portal nie wysyła ani nie zapisuje danych osobowych. Materiały są tworzone lub pobierane lokalnie.',
          facilitatorNote: 'Dla wydarzenia międzynarodowego portal pomaga utrzymać jedną, czytelną ścieżkę uczestnika.'
        }),
        en: portal({
          id: 'syd2026',
          lang: 'en',
          label: 'Sydney 2026',
          title: 'Participant Portal — Sydney 2026',
          subtitle: 'Post-screening and Q&A path',
          description: 'The portal guides screening and live online Q&A participants from access to document, memory pack and future anonymous archive.',
          eventDate: '21 June 2026',
          location: 'Polish Club Ashfield / Sydney',
          modules: modules.en.map((module) => module.id === 'witness' ? { ...module, href: '/rap-ort/witness-report/generator/?event=syd2026' } : module),
          closingLine: 'Truth does not end on the screen. It remains in the question a human being carries forward.',
          privacyNote: 'The portal does not send or store personal data. Materials are created or downloaded locally.',
          facilitatorNote: 'For the international event, the portal keeps one clear participant path.'
        })
      }
    }
  };
})();