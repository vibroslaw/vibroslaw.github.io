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
        title: 'Wejdź przez QR podczas wydarzenia',
        description: 'Dostęp uczestnika dla Oświęcimia działa wyłącznie z QR udostępnionego na sali. Po spotkaniu materiały trafiają na osobną stronę po wydarzeniu.',
        href: '/rap-ort/oswiecim/po-wydarzeniu/',
        status: 'QR-only'
      },
      {
        id: 'witness',
        label: 'Raport Świadka',
        title: 'Rytuał na żywo, nie publiczny generator',
        description: 'Raport Świadka dla Oświęcimia jest prowadzony przez QR i wypełniany fizycznie na papierze podczas wydarzenia.',
        href: '/rap-ort/oswiecim/po-wydarzeniu/',
        status: 'Po wydarzeniu'
      },
      {
        id: 'participation',
        label: 'Zapis Uczestnictwa',
        title: 'Dokument dostępny przez QR',
        description: 'Pamiątkowy dokument uczestnika nie jest częścią publicznego portalu. Dostęp działa przez link wydarzenia.',
        href: '/rap-ort/oswiecim/po-wydarzeniu/',
        status: 'QR-only'
      }
    ],
    en: [
      {
        id: 'access',
        label: 'Event access',
        title: 'Enter through the event QR',
        description: 'Oświęcim participant access works only through the QR shared in the room. After the event, materials move to the post-event page.',
        href: '/rap-ort/oswiecim/po-wydarzeniu/',
        status: 'QR-only'
      },
      {
        id: 'witness',
        label: 'Witness Report',
        title: 'A live ritual, not a public generator',
        description: 'The Oświęcim Witness Report is guided by QR and completed physically on paper during the event.',
        href: '/rap-ort/oswiecim/po-wydarzeniu/',
        status: 'Post-event'
      },
      {
        id: 'participation',
        label: 'Participation Record',
        title: 'Document available through QR',
        description: 'The commemorative participant document is not part of a public portal. Access works through the event link.',
        href: '/rap-ort/oswiecim/po-wydarzeniu/',
        status: 'QR-only'
      }
    ]
  };

  return {
    version: '0.1.2-oswiecim-live-locked',
    defaultPortalId: 'default',
    portals: {
      default: {
        pl: portal({
          id: 'default',
          lang: 'pl',
          label: 'Wersja publiczna',
          title: 'Portal Uczestnika',
          subtitle: 'Dostęp ograniczony dla wydarzeń',
          description: 'Publiczna wersja portalu nie otwiera materiałów wydarzenia Oświęcim. Dostęp na sali działa przez QR, a po wydarzeniu przez osobną stronę podsumowującą.',
          eventDate: 'Data wydarzenia',
          location: 'Miejsce / instytucja',
          modules: modules.pl,
          closingLine: 'To nie jest publiczny generator. To ścieżka wydarzenia uruchamiana przez QR albo strona po wydarzeniu.',
          privacyNote: 'Dostęp do artefaktów wydarzenia jest organizacyjnie ograniczony: noindex, brak publicznej nawigacji, QR podczas spotkania.',
          facilitatorNote: 'Prowadzący uruchamia właściwą ścieżkę przez QR na sali.'
        }),
        en: portal({
          id: 'default',
          lang: 'en',
          label: 'Public Preview',
          title: 'Participant Portal',
          subtitle: 'Restricted access for events',
          description: 'The public portal version does not open Oświęcim event materials. In-room access works through QR and post-event access through a separate summary page.',
          eventDate: 'Event date',
          location: 'Place / institution',
          modules: modules.en,
          closingLine: 'This is not a public generator. It is an event path activated by QR or a post-event page.',
          privacyNote: 'Event artefact access is organisationally restricted: noindex, no public navigation, QR during the meeting.',
          facilitatorNote: 'The facilitator opens the proper path through the in-room QR.'
        })
      },
      oswiecim20260525: {
        pl: portal({
          id: 'oswiecim20260525',
          lang: 'pl',
          label: 'Oświęcim / MUP',
          title: 'Dostęp uczestnika — Oświęcim / MUP',
          subtitle: 'QR na sali i strona po wydarzeniu',
          description: 'Dla Oświęcimia portal publiczny został zamknięty. Raport Świadka działa jako rytuał na żywo przez QR, a materiały po spotkaniu trafiają na osobną stronę.',
          eventDate: '25 maja 2026',
          location: 'Oświęcim / MUP',
          modules: modules.pl,
          closingLine: 'Nie chodzi o publiczny dostęp. Chodzi o wyjątkowy moment na sali i spokojną kontynuację po wydarzeniu.',
          privacyNote: 'Raport Świadka nie jest publicznym generatorem. Dostęp live działa przez QR z kluczem wydarzenia.',
          facilitatorNote: 'Na sali użyj QR z kluczem. Po wydarzeniu udostępnij stronę podsumowującą.'
        }),
        en: portal({
          id: 'oswiecim20260525',
          lang: 'en',
          label: 'Oświęcim / MUP',
          title: 'Participant Access — Oświęcim / MUP',
          subtitle: 'In-room QR and post-event page',
          description: 'For Oświęcim, the public portal has been closed. The Witness Report works as a live ritual through QR, while post-event materials move to a separate page.',
          eventDate: '25 May 2026',
          location: 'Oświęcim / MUP',
          modules: modules.en,
          closingLine: 'It is not about public access. It is about a unique in-room moment and a calm continuation after the event.',
          privacyNote: 'The Witness Report is not a public generator. Live access works through the event QR key.',
          facilitatorNote: 'Use the keyed QR in the room. Share the post-event page afterwards.'
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
          modules: [
            { id: 'witness', label: 'Raport Świadka', title: 'Zapisz to, co zostało po projekcji', description: 'Prywatny raport PDF i anonimowa wersja do przyszłego archiwum wydarzenia.', href: '/rap-ort/raport-swiadka/generator/?event=syd2026', status: 'Moduł refleksji' },
            { id: 'participation', label: 'Zapis Uczestnictwa', title: 'Utwórz dokument pamiątkowy', description: 'Elegancki PDF z datą, miejscem i numerem dokumentu.', href: '/rap-ort/uczestnictwo/?event=syd2026', status: 'Aktywne' }
          ],
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
          modules: [
            { id: 'witness', label: 'Witness Report', title: 'Record what remains after the screening', description: 'A private PDF report and an anonymous version for a future event archive.', href: '/rap-ort/witness-report/generator/?event=syd2026', status: 'Reflection module' },
            { id: 'participation', label: 'Participation Record', title: 'Create a commemorative document', description: 'An elegant PDF with date, place and document number.', href: '/rap-ort/participation/?event=syd2026', status: 'Active' }
          ],
          closingLine: 'Truth does not end on the screen. It remains in the question a human being carries forward.',
          privacyNote: 'The portal does not send or store personal data. Materials are created or downloaded locally.',
          facilitatorNote: 'For the international event, the portal keeps one clear participant path.'
        })
      }
    }
  };
})();