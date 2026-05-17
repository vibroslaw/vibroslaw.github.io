window.RapOrtEventPortals = (() => {
  const portal = (data) => ({
    id: data.id,
    lang: data.lang,
    label: data.label,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    eventMeta: data.eventMeta || [],
    primaryCta: data.primaryCta,
    secondaryCta: data.secondaryCta,
    journeyTitle: data.journeyTitle,
    journey: data.journey || [],
    privacyTitle: data.privacyTitle,
    privacy: data.privacy || [],
    closingLine: data.closingLine
  });

  const defaultJourneyPl = [
    { id: 'access', label: 'Wejście przez QR', description: 'Otwórz link wydarzenia i sprawdź aktywną wersję uczestnika.', href: '#event-access', status: 'active' },
    { id: 'record', label: 'Zapis Uczestnictwa', description: 'Utwórz elegancki dokument PDF jako pamiątkę udziału.', href: '#generator', status: 'active' },
    { id: 'witness', label: 'Raport Świadka', description: 'Zapisz prywatną refleksję albo przygotuj anonimową wersję JPG.', href: '/rap-ort/raport-swiadka/generator/', status: 'active' },
    { id: 'memory', label: 'Pakiet Uczestnika', description: 'Pobierz materiały pamiątkowe przygotowane dla uczestników.', href: '#memory-pack', status: 'active' },
    { id: 'archive', label: 'Anonimowe Archiwum', description: 'Zobacz fundament statycznej galerii anonimowych śladów po projekcji.', href: '#archive-gallery', status: 'prepared' }
  ];

  const defaultJourneyEn = [
    { id: 'access', label: 'QR entry', description: 'Open the event link and confirm the active participant edition.', href: '#event-access', status: 'active' },
    { id: 'record', label: 'Participation Record', description: 'Create an elegant PDF document as a keepsake of participation.', href: '#generator', status: 'active' },
    { id: 'witness', label: 'Witness Report', description: 'Write a private reflection or prepare an anonymous JPG version.', href: '/rap-ort/witness-report/generator/', status: 'active' },
    { id: 'memory', label: 'Memory Pack', description: 'Download commemorative materials prepared for participants.', href: '#memory-pack', status: 'active' },
    { id: 'archive', label: 'Anonymous Archive', description: 'See the static gallery foundation for anonymous post-screening traces.', href: '#archive-gallery', status: 'prepared' }
  ];

  function eventJourney(journey, eventId) {
    return journey.map((item) => {
      if (item.id !== 'witness') return item;
      const glue = item.href.includes('?') ? '&' : '?';
      return { ...item, href: `${item.href}${glue}event=${eventId}` };
    });
  }

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
          subtitle: 'Jedna ścieżka po projekcji: dokument, refleksja, pakiet i archiwum.',
          description: 'To miejsce porządkuje doświadczenie uczestnika po spotkaniu z projektem Rap-Ort. Nie zastępuje rozmowy ani prowadzącego — prowadzi dalej, krok po kroku.',
          eventMeta: ['Publiczny podgląd', 'Rap-Ort: Prawda Sumienia'],
          primaryCta: { label: 'Utwórz Zapis Uczestnictwa', href: '#generator' },
          secondaryCta: { label: 'Zobacz Pakiet Uczestnika', href: '#memory-pack' },
          journeyTitle: 'Ścieżka po projekcji',
          journey: defaultJourneyPl,
          privacyTitle: 'Zasada prywatności',
          privacy: [
            'Dokumenty są generowane lokalnie w przeglądarce.',
            'Anonimowe archiwum nie powinno zawierać imienia, nazwiska ani podpisu.',
            'GitHub Pages nie zapisuje plików automatycznie — archiwum jest statycznym miejscem pod ręcznie dodane materiały.'
          ],
          closingLine: 'To nie jest ankieta. To ślad tego, co zostaje po projekcji.'
        }),
        en: portal({
          id: 'default',
          lang: 'en',
          label: 'Public Preview',
          title: 'Participant Portal',
          subtitle: 'One post-screening path: document, reflection, memory pack and archive.',
          description: 'This space organises the participant experience after encountering Rap-Ort. It does not replace the facilitator or conversation — it carries the participant forward step by step.',
          eventMeta: ['Public preview', 'Rap-Ort: Prawda Sumienia'],
          primaryCta: { label: 'Create Participation Record', href: '#generator' },
          secondaryCta: { label: 'View Memory Pack', href: '#memory-pack' },
          journeyTitle: 'Post-screening path',
          journey: defaultJourneyEn,
          privacyTitle: 'Privacy principle',
          privacy: [
            'Documents are generated locally in the browser.',
            'The anonymous archive should contain no name, surname or signature.',
            'GitHub Pages cannot save files automatically — the archive is a static place for manually added materials.'
          ],
          closingLine: 'This is not a survey. It is a trace of what remains after the screening.'
        })
      },
      oswiecim20260525: {
        pl: portal({
          id: 'oswiecim20260525',
          lang: 'pl',
          label: 'Oświęcim / MUP',
          title: 'Portal Uczestnika — Oświęcim / MUP',
          subtitle: 'Po projekcji: dokument, refleksja, pamięć i odpowiedzialny ślad.',
          description: 'Portal prowadzi uczestnika przez spokojne domknięcie wydarzenia: od dostępu QR, przez Zapis Uczestnictwa i Raport Świadka, po Pakiet Uczestnika oraz fundament anonimowego archiwum.',
          eventMeta: ['25 maja 2026', 'Oświęcim / MUP', 'Wersja wydarzenia'],
          primaryCta: { label: 'Utwórz dokument wydarzenia', href: '#generator' },
          secondaryCta: { label: 'Przejdź do archiwum anonimowego', href: '#archive-gallery' },
          journeyTitle: 'Ścieżka uczestnika po projekcji',
          journey: eventJourney(defaultJourneyPl, 'oswiecim20260525'),
          privacyTitle: 'Prywatność i anonimowość',
          privacy: [
            'Prywatny Raport Świadka może pozostać wyłącznie u uczestnika.',
            'Wersja archiwalna powinna być anonimowa: bez imienia, nazwiska, podpisu i danych osobowych.',
            'Dodanie materiałów do archiwum odbywa się ręcznie i świadomie, bez automatycznego uploadu.'
          ],
          closingLine: 'Pamięć nie kończy się na ekranie. Zostaje w pytaniu, które człowiek zabiera ze sobą.'
        }),
        en: portal({
          id: 'oswiecim20260525',
          lang: 'en',
          label: 'Oświęcim / MUP',
          title: 'Participant Portal — Oświęcim / MUP',
          subtitle: 'After the screening: document, reflection, memory and a responsible trace.',
          description: 'The portal guides the participant through a restrained closing experience: QR access, Participation Record, Witness Report, Memory Pack and the foundation of an anonymous archive.',
          eventMeta: ['25 May 2026', 'Oświęcim / MUP', 'Event edition'],
          primaryCta: { label: 'Create event document', href: '#generator' },
          secondaryCta: { label: 'Go to anonymous archive', href: '#archive-gallery' },
          journeyTitle: 'Participant path after the screening',
          journey: eventJourney(defaultJourneyEn, 'oswiecim20260525'),
          privacyTitle: 'Privacy and anonymity',
          privacy: [
            'The private Witness Report may remain only with the participant.',
            'The archive version should be anonymous: no name, surname, signature or personal data.',
            'Adding materials to the archive is manual and intentional, with no automatic upload.'
          ],
          closingLine: 'Memory does not end on the screen. It remains in the question a human being carries forward.'
        })
      },
      syd2026: {
        pl: portal({
          id: 'syd2026',
          lang: 'pl',
          label: 'Sydney 2026',
          title: 'Portal Uczestnika — Sydney 2026',
          subtitle: 'Międzynarodowy dostęp po projekcji: dokument, refleksja i pamiątkowy pakiet.',
          description: 'Portal spina doświadczenie uczestnika wydarzenia Sydney 2026: od linku QR, przez dokument, po materiały pamiątkowe i przyszłe archiwum anonimowych śladów.',
          eventMeta: ['21 czerwca 2026', 'Polish Club Ashfield / Sydney', 'Screening + Live Online Q&A'],
          primaryCta: { label: 'Utwórz Zapis Uczestnictwa', href: '#generator' },
          secondaryCta: { label: 'Zobacz Pakiet Uczestnika', href: '#memory-pack' },
          journeyTitle: 'Ścieżka uczestnika Sydney 2026',
          journey: eventJourney(defaultJourneyPl, 'syd2026'),
          privacyTitle: 'Bezpieczny ślad uczestnika',
          privacy: [
            'Materiały działają lokalnie i nie wysyłają danych na serwer.',
            'Archiwum anonimowe jest przygotowane jako statyczne miejsce pod przyszłe, ręcznie dodane pliki.',
            'Żaden element portalu nie sugeruje patronatu ani oficjalnej rekomendacji instytucji.'
          ],
          closingLine: 'Truth does not need noise. It needs to be heard.'
        }),
        en: portal({
          id: 'syd2026',
          lang: 'en',
          label: 'Sydney 2026',
          title: 'Participant Portal — Sydney 2026',
          subtitle: 'International post-screening access: document, reflection and memory pack.',
          description: 'The portal connects the Sydney 2026 participant experience: QR link, document, commemorative materials and a future archive of anonymous traces.',
          eventMeta: ['21 June 2026', 'Polish Club Ashfield / Sydney', 'Screening + Live Online Q&A'],
          primaryCta: { label: 'Create Participation Record', href: '#generator' },
          secondaryCta: { label: 'View Memory Pack', href: '#memory-pack' },
          journeyTitle: 'Sydney 2026 participant path',
          journey: eventJourney(defaultJourneyEn, 'syd2026'),
          privacyTitle: 'Safe participant trace',
          privacy: [
            'The materials work locally and do not send data to a server.',
            'The anonymous archive is prepared as a static place for future manually added files.',
            'No element of the portal implies patronage or official institutional endorsement.'
          ],
          closingLine: 'Truth does not need noise. It needs to be heard.'
        })
      }
    }
  };
})();
