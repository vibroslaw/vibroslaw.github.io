window.RapOrtMemoryPacks = (() => {
  const root = '/public/assets/events/rap-ort/';
  const shared = `${root}shared/memory-pack/`;
  const oswiecim = `${root}oswiecim20260525/memory-pack/`;
  const sydney = `${root}syd2026/memory-pack/`;

  const item = (data) => ({
    id: data.id,
    type: data.type,
    label: data.label,
    description: data.description,
    format: data.format,
    path: data.path || '',
    fallback: Boolean(data.fallback),
    locked: Boolean(data.locked),
    recommendedUse: data.recommendedUse || ''
  });

  const pack = (data) => ({
    id: data.id,
    lang: data.lang,
    label: data.label,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    items: data.items.map(item)
  });

  return {
    version: '0.1.0-pr66-memory-pack',
    defaultPackId: 'default',
    packs: {
      default: {
        pl: pack({
          id: 'default',
          lang: 'pl',
          label: 'Wersja publiczna',
          title: 'Pakiet Uczestnika',
          subtitle: 'Pamiątkowe materiały po projekcji',
          description: 'Zachowaj ślad wydarzenia: dokument, kartę refleksji i materiały pamiątkowe przygotowane dla uczestników.',
          items: [
            {
              id: 'participation-record',
              type: 'pdf',
              label: 'Zapis Uczestnictwa',
              description: 'Pamiątkowy dokument PDF generowany lokalnie po uzupełnieniu danych wydarzenia.',
              format: 'PDF · A4 landscape',
              path: '#generator',
              recommendedUse: 'Wygeneruj dokument powyżej, a następnie zachowaj go lokalnie lub wydrukuj.'
            },
            {
              id: 'reflection-card',
              type: 'reflection-card',
              label: 'Karta refleksji',
              description: 'Krótka karta do zapisania myśli po spotkaniu z projektem Rap-Ort.',
              format: 'PDF / obraz',
              path: `${shared}reflection-card-pl.pdf`,
              recommendedUse: 'Do spokojnej pracy własnej po projekcji.'
            },
            {
              id: 'quote-card',
              type: 'quote-card',
              label: 'Karta cytatu',
              description: 'Pamiątkowa karta z wybranym zdaniem prowadzącym do dalszej refleksji.',
              format: 'PDF / obraz',
              path: `${shared}quote-card-pl.pdf`,
              recommendedUse: 'Do zachowania lub wydruku jako ślad uczestnictwa.'
            },
            {
              id: 'desktop-wallpaper',
              type: 'wallpaper-desktop',
              label: 'Tapeta desktop',
              description: 'Spokojny wariant wizualny inspirowany atmosferą Rap-Ort.',
              format: 'WEBP · desktop',
              path: `${shared}wallpaper-desktop.webp`,
              recommendedUse: 'Dla uczestników, którzy chcą zachować wizualny ślad wydarzenia.'
            },
            {
              id: 'mobile-wallpaper',
              type: 'wallpaper-mobile',
              label: 'Tapeta mobilna',
              description: 'Wersja pionowa przygotowana z myślą o telefonie.',
              format: 'WEBP · mobile',
              path: `${shared}wallpaper-mobile.webp`,
              recommendedUse: 'Do prywatnego wykorzystania na urządzeniu uczestnika.'
            }
          ]
        }),
        en: pack({
          id: 'default',
          lang: 'en',
          label: 'Public Preview',
          title: 'Participant Memory Pack',
          subtitle: 'Post-screening commemorative materials',
          description: 'Keep a trace of the experience: your document, reflection card and commemorative materials prepared for participants.',
          items: [
            {
              id: 'participation-record',
              type: 'pdf',
              label: 'Participation Record',
              description: 'A commemorative PDF document generated locally after the event details are completed.',
              format: 'PDF · A4 landscape',
              path: '#generator',
              recommendedUse: 'Generate the document above, then save it locally or print it.'
            },
            {
              id: 'reflection-card',
              type: 'reflection-card',
              label: 'Reflection card',
              description: 'A short card for writing down what remains after encountering Rap-Ort.',
              format: 'PDF / image',
              path: `${shared}reflection-card-en.pdf`,
              recommendedUse: 'For quiet personal reflection after the screening.'
            },
            {
              id: 'quote-card',
              type: 'quote-card',
              label: 'Quote card',
              description: 'A commemorative card with a selected sentence for further reflection.',
              format: 'PDF / image',
              path: `${shared}quote-card-en.pdf`,
              recommendedUse: 'For keeping or printing as a personal trace of participation.'
            },
            {
              id: 'desktop-wallpaper',
              type: 'wallpaper-desktop',
              label: 'Desktop wallpaper',
              description: 'A restrained visual variant inspired by the atmosphere of Rap-Ort.',
              format: 'WEBP · desktop',
              path: `${shared}wallpaper-desktop.webp`,
              recommendedUse: 'For participants who want to keep a visual trace of the event.'
            },
            {
              id: 'mobile-wallpaper',
              type: 'wallpaper-mobile',
              label: 'Mobile wallpaper',
              description: 'A vertical version prepared for a phone screen.',
              format: 'WEBP · mobile',
              path: `${shared}wallpaper-mobile.webp`,
              recommendedUse: 'For private use on the participant’s device.'
            }
          ]
        })
      },
      oswiecim20260525: {
        pl: pack({
          id: 'oswiecim20260525',
          lang: 'pl',
          label: 'Oświęcim / MUP',
          title: 'Pakiet Uczestnika — Oświęcim / MUP',
          subtitle: 'Materiały po projekcji i rozmowie',
          description: 'Zestaw pamiątkowych materiałów dla uczestników spotkania wokół projektu Rap-Ort: Prawda Sumienia.',
          items: [
            {
              id: 'reflection-card',
              type: 'reflection-card',
              label: 'Karta refleksji — Oświęcim / MUP',
              description: 'Karta do osobistego zapisu tego, co zostaje po projekcji i rozmowie.',
              format: 'PDF / obraz',
              path: `${oswiecim}reflection-card-pl.pdf`,
              recommendedUse: 'Do indywidualnej refleksji po wydarzeniu.'
            },
            {
              id: 'quote-card',
              type: 'quote-card',
              label: 'Karta cytatu po projekcji',
              description: 'Pamiątkowa karta z cytatem powiązanym z tonem projektu.',
              format: 'PDF / obraz',
              path: `${oswiecim}quote-card-pl.pdf`,
              recommendedUse: 'Do zachowania lub wydruku po spotkaniu.'
            },
            {
              id: 'thank-you-card',
              type: 'thank-you-card',
              label: 'Karta podziękowania',
              description: 'Powściągliwa karta pamiątkowa dla uczestników wydarzenia.',
              format: 'PDF / obraz',
              path: `${oswiecim}thank-you-card-pl.pdf`,
              recommendedUse: 'Jako osobisty ślad uczestnictwa.'
            },
            {
              id: 'mobile-wallpaper',
              type: 'wallpaper-mobile',
              label: 'Tapeta mobilna',
              description: 'Wersja pionowa utrzymana w spokojnym, archiwalnym charakterze.',
              format: 'WEBP · mobile',
              path: `${oswiecim}wallpaper-mobile.webp`,
              recommendedUse: 'Do prywatnego wykorzystania na telefonie.'
            },
            {
              id: 'desktop-wallpaper',
              type: 'wallpaper-desktop',
              label: 'Tapeta desktop',
              description: 'Wersja pozioma przygotowana jako wizualny ślad wydarzenia.',
              format: 'WEBP · desktop',
              path: `${oswiecim}wallpaper-desktop.webp`,
              recommendedUse: 'Do prywatnego wykorzystania na komputerze.'
            },
            {
              id: 'archive-instruction',
              type: 'archive-instruction',
              label: 'Karta instrukcji archiwalnej',
              description: 'Miejsce na przyszły materiał opisujący, jak zachować osobisty zapis po wydarzeniu.',
              format: 'PDF',
              path: `${oswiecim}archive-instruction-card-pl.pdf`,
              recommendedUse: 'Przygotowane dla przyszłego rozszerzenia pakietu.'
            }
          ]
        }),
        en: pack({
          id: 'oswiecim20260525',
          lang: 'en',
          label: 'Oświęcim / MUP',
          title: 'Participant Memory Pack — Oświęcim / MUP',
          subtitle: 'Post-screening and conversation materials',
          description: 'A set of commemorative materials for participants of the Rap-Ort: Prawda Sumienia screening and conversation.',
          items: [
            {
              id: 'reflection-card',
              type: 'reflection-card',
              label: 'Reflection card — Oświęcim / MUP',
              description: 'A card for recording what remains after the screening and conversation.',
              format: 'PDF / image',
              path: `${oswiecim}reflection-card-en.pdf`,
              recommendedUse: 'For individual reflection after the event.'
            },
            {
              id: 'quote-card',
              type: 'quote-card',
              label: 'Post-screening quote card',
              description: 'A commemorative quote card connected with the tone of the project.',
              format: 'PDF / image',
              path: `${oswiecim}quote-card-en.pdf`,
              recommendedUse: 'For keeping or printing after the meeting.'
            },
            {
              id: 'thank-you-card',
              type: 'thank-you-card',
              label: 'Thank-you card',
              description: 'A restrained commemorative card for event participants.',
              format: 'PDF / image',
              path: `${oswiecim}thank-you-card-en.pdf`,
              recommendedUse: 'As a personal trace of participation.'
            },
            {
              id: 'mobile-wallpaper',
              type: 'wallpaper-mobile',
              label: 'Mobile wallpaper',
              description: 'A vertical version in a quiet archival tone.',
              format: 'WEBP · mobile',
              path: `${oswiecim}wallpaper-mobile.webp`,
              recommendedUse: 'For private use on a phone.'
            },
            {
              id: 'desktop-wallpaper',
              type: 'wallpaper-desktop',
              label: 'Desktop wallpaper',
              description: 'A horizontal version prepared as a visual trace of the event.',
              format: 'WEBP · desktop',
              path: `${oswiecim}wallpaper-desktop.webp`,
              recommendedUse: 'For private use on a computer.'
            },
            {
              id: 'archive-instruction',
              type: 'archive-instruction',
              label: 'Archive instruction card',
              description: 'A future material describing how to preserve a personal record after the event.',
              format: 'PDF',
              path: `${oswiecim}archive-instruction-card-en.pdf`,
              recommendedUse: 'Prepared for a future pack extension.'
            }
          ]
        })
      },
      syd2026: {
        pl: pack({
          id: 'syd2026',
          lang: 'pl',
          label: 'Sydney 2026',
          title: 'Pakiet Uczestnika — Sydney 2026',
          subtitle: 'Materiały pamiątkowe po projekcji',
          description: 'Zestaw materiałów do pobrania przygotowany dla uczestników projekcji Rap-Ort i rozmowy online z autorem.',
          items: [
            {
              id: 'reflection-card',
              type: 'reflection-card',
              label: 'Karta refleksji — Sydney 2026',
              description: 'Karta do zapisania krótkiej refleksji po projekcji i rozmowie.',
              format: 'PDF / obraz',
              path: `${sydney}reflection-card-pl.pdf`,
              recommendedUse: 'Do prywatnego zachowania po wydarzeniu.'
            },
            {
              id: 'quote-card',
              type: 'quote-card',
              label: 'Karta cytatu',
              description: 'Pamiątkowa karta z krótkim zdaniem powiązanym z projektem.',
              format: 'PDF / obraz',
              path: `${sydney}quote-card-pl.pdf`,
              recommendedUse: 'Do zachowania lub wydruku.'
            },
            {
              id: 'thank-you-card',
              type: 'thank-you-card',
              label: 'Karta podziękowania',
              description: 'Pamiątkowy materiał dla uczestników wydarzenia Sydney 2026.',
              format: 'PDF / obraz',
              path: `${sydney}thank-you-card-pl.pdf`,
              recommendedUse: 'Jako osobista pamiątka po projekcji.'
            },
            {
              id: 'mobile-wallpaper',
              type: 'wallpaper-mobile',
              label: 'Tapeta mobilna',
              description: 'Pionowy wariant wizualny dla uczestników wydarzenia.',
              format: 'WEBP · mobile',
              path: `${sydney}wallpaper-mobile.webp`,
              recommendedUse: 'Do prywatnego wykorzystania na telefonie.'
            },
            {
              id: 'desktop-wallpaper',
              type: 'wallpaper-desktop',
              label: 'Tapeta desktop',
              description: 'Poziomy wariant wizualny dla uczestników wydarzenia.',
              format: 'WEBP · desktop',
              path: `${sydney}wallpaper-desktop.webp`,
              recommendedUse: 'Do prywatnego wykorzystania na komputerze.'
            },
            {
              id: 'social-card',
              type: 'social-card',
              label: 'Karta do udostępnienia',
              description: 'Pamiątkowy format graficzny przygotowany z myślą o spokojnym udostępnieniu informacji o uczestnictwie.',
              format: 'WEBP / PNG',
              path: `${sydney}social-share-card-pl.webp`,
              recommendedUse: 'Do prywatnego użycia, bez sugerowania patronatu lub oficjalnej rekomendacji.'
            }
          ]
        }),
        en: pack({
          id: 'syd2026',
          lang: 'en',
          label: 'Sydney 2026',
          title: 'Participant Memory Pack — Sydney 2026',
          subtitle: 'Post-screening commemorative materials',
          description: 'A set of downloadable keepsakes prepared for participants of the Rap-Ort screening and live online Q&A.',
          items: [
            {
              id: 'reflection-card',
              type: 'reflection-card',
              label: 'Sydney 2026 reflection card',
              description: 'A card for writing down a short reflection after the screening and conversation.',
              format: 'PDF / image',
              path: `${sydney}reflection-card-en.pdf`,
              recommendedUse: 'For private keeping after the event.'
            },
            {
              id: 'quote-card',
              type: 'quote-card',
              label: 'English quote card',
              description: 'A commemorative card with a short sentence connected with the project.',
              format: 'PDF / image',
              path: `${sydney}quote-card-en.pdf`,
              recommendedUse: 'For keeping or printing.'
            },
            {
              id: 'thank-you-card',
              type: 'thank-you-card',
              label: 'Thank-you card',
              description: 'A commemorative material for Sydney 2026 event participants.',
              format: 'PDF / image',
              path: `${sydney}thank-you-card-en.pdf`,
              recommendedUse: 'As a personal keepsake after the screening.'
            },
            {
              id: 'mobile-wallpaper',
              type: 'wallpaper-mobile',
              label: 'Mobile wallpaper',
              description: 'A vertical visual variant for event participants.',
              format: 'WEBP · mobile',
              path: `${sydney}wallpaper-mobile.webp`,
              recommendedUse: 'For private use on a phone.'
            },
            {
              id: 'desktop-wallpaper',
              type: 'wallpaper-desktop',
              label: 'Desktop wallpaper',
              description: 'A horizontal visual variant for event participants.',
              format: 'WEBP · desktop',
              path: `${sydney}wallpaper-desktop.webp`,
              recommendedUse: 'For private use on a computer.'
            },
            {
              id: 'social-card',
              type: 'social-card',
              label: 'Social share card',
              description: 'A commemorative graphic format prepared for restrained sharing of participation.',
              format: 'WEBP / PNG',
              path: `${sydney}social-share-card-en.webp`,
              recommendedUse: 'For private use, without implying patronage or official endorsement.'
            }
          ]
        })
      }
    }
  };
})();
