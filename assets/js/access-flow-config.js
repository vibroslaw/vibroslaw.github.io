window.RapOrtAccessFlows = (() => {
  const base = 'https://piotrlichwala.com';

  const flow = (data) => ({
    id: data.id,
    lang: data.lang,
    label: data.label,
    eventTitle: data.eventTitle,
    eventSubtitle: data.eventSubtitle,
    accessLabel: data.accessLabel,
    accessCode: data.accessCode,
    participantUrl: data.participantUrl,
    witnessUrl: data.witnessUrl || '',
    memoryAnchor: data.memoryAnchor || '#memory-pack',
    generatorAnchor: data.generatorAnchor || '#generator',
    dateLabel: data.dateLabel || '',
    location: data.location || '',
    mode: data.mode || 'public',
    steps: data.steps || [],
    note: data.note || ''
  });

  const commonSteps = {
    pl: [
      'Zeskanuj lub otwórz link wydarzenia.',
      'Utwórz Zapis Uczestnictwa.',
      'Pobierz PDF i przejdź do Pakietu Uczestnika.'
    ],
    en: [
      'Scan or open the event link.',
      'Create your Participation Record.',
      'Download the PDF and continue to the Memory Pack.'
    ]
  };

  return {
    version: '0.1.0-pr68-access-flow',
    defaultFlowId: 'default',
    base,
    flows: {
      default: {
        pl: flow({
          id: 'default',
          lang: 'pl',
          label: 'Wersja publiczna',
          eventTitle: 'Rap-Ort: Prawda Sumienia',
          eventSubtitle: 'Publiczny dostęp do generatora pamiątkowego dokumentu.',
          accessLabel: 'Link publiczny',
          accessCode: 'PUBLIC',
          participantUrl: '/rap-ort/uczestnictwo/',
          witnessUrl: '/rap-ort/raport-swiadka/generator/',
          dateLabel: 'Data wydarzenia',
          location: 'Miejsce / instytucja',
          mode: 'public',
          steps: commonSteps.pl,
          note: 'Ten link nie jest hasłem ani zabezpieczeniem. To wygodna ścieżka dostępu dla uczestnika.'
        }),
        en: flow({
          id: 'default',
          lang: 'en',
          label: 'Public Preview',
          eventTitle: 'Rap-Ort: Prawda Sumienia',
          eventSubtitle: 'Public access to the commemorative document generator.',
          accessLabel: 'Public link',
          accessCode: 'PUBLIC',
          participantUrl: '/rap-ort/participation/',
          witnessUrl: '/rap-ort/witness-report/generator/',
          dateLabel: 'Event date',
          location: 'Place / institution',
          mode: 'public',
          steps: commonSteps.en,
          note: 'This link is not a password or security layer. It is a convenient access path for participants.'
        })
      },
      oswiecim20260525: {
        pl: flow({
          id: 'oswiecim20260525',
          lang: 'pl',
          label: 'Oświęcim / MUP',
          eventTitle: 'Rap-Ort: Prawda Sumienia',
          eventSubtitle: 'Projekcja audiowizualna i rozmowa po projekcji.',
          accessLabel: 'Link wydarzenia',
          accessCode: 'OSWIECIM20260525',
          participantUrl: '/rap-ort/uczestnictwo/?event=oswiecim20260525',
          witnessUrl: '/rap-ort/raport-swiadka/generator/?event=oswiecim20260525',
          dateLabel: '25 maja 2026',
          location: 'Oświęcim / MUP',
          mode: 'event',
          steps: [
            'Otwórz link lub zeskanuj QR po projekcji.',
            'Utwórz Zapis Uczestnictwa w wersji Oświęcim / MUP.',
            'Pobierz PDF, a następnie przejdź do Pakietu Uczestnika.'
          ],
          note: 'Dostęp wydarzenia porządkuje doświadczenie uczestnika. Nie jest oficjalnym zabezpieczeniem ani potwierdzeniem patronatu instytucji.'
        }),
        en: flow({
          id: 'oswiecim20260525',
          lang: 'en',
          label: 'Oświęcim / MUP',
          eventTitle: 'Rap-Ort: Prawda Sumienia',
          eventSubtitle: 'Audiovisual screening and post-screening conversation.',
          accessLabel: 'Event link',
          accessCode: 'OSWIECIM20260525',
          participantUrl: '/rap-ort/participation/?event=oswiecim20260525',
          witnessUrl: '/rap-ort/witness-report/generator/?event=oswiecim20260525',
          dateLabel: '25 May 2026',
          location: 'Oświęcim / MUP',
          mode: 'event',
          steps: [
            'Open the link or scan the QR after the screening.',
            'Create the Oświęcim / MUP Participation Record.',
            'Download the PDF, then continue to the Memory Pack.'
          ],
          note: 'The event access path organises the participant experience. It is not an official security layer or institutional endorsement.'
        })
      },
      syd2026: {
        pl: flow({
          id: 'syd2026',
          lang: 'pl',
          label: 'Sydney 2026',
          eventTitle: 'Rap-Ort: The Conscience Report',
          eventSubtitle: 'Projekcja audiowizualna + Q&A online z autorem.',
          accessLabel: 'Link wydarzenia',
          accessCode: 'SYD2026',
          participantUrl: '/rap-ort/uczestnictwo/?event=syd2026',
          witnessUrl: '/rap-ort/raport-swiadka/generator/?event=syd2026',
          dateLabel: '21 czerwca 2026',
          location: 'Polish Club Ashfield / Sydney',
          mode: 'event',
          steps: [
            'Otwórz link wydarzenia na telefonie lub komputerze.',
            'Utwórz pamiątkowy Zapis Uczestnictwa.',
            'Zachowaj PDF i pobierz materiały z Pakietu Uczestnika.'
          ],
          note: 'Link jest przygotowany dla uczestników projekcji i Q&A. Nie sugeruje patronatu ani oficjalnej rekomendacji.'
        }),
        en: flow({
          id: 'syd2026',
          lang: 'en',
          label: 'Sydney 2026',
          eventTitle: 'Rap-Ort: The Conscience Report',
          eventSubtitle: 'Audiovisual Film Screening + Live Online Q&A with the Author.',
          accessLabel: 'Event link',
          accessCode: 'SYD2026',
          participantUrl: '/rap-ort/participation/?event=syd2026',
          witnessUrl: '/rap-ort/witness-report/generator/?event=syd2026',
          dateLabel: '21 June 2026',
          location: 'Polish Club Ashfield / Sydney',
          mode: 'event',
          steps: [
            'Open the event link on your phone or computer.',
            'Create your commemorative Participation Record.',
            'Save the PDF and download materials from the Memory Pack.'
          ],
          note: 'The link is prepared for screening and Q&A participants. It does not imply patronage or official endorsement.'
        })
      }
    }
  };
})();
