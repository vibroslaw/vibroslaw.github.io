(() => {
  const root = document.querySelector('[data-participation-record]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const eventKey = params.get('event') || params.get('key') || '';
  const event = eventKey === 'oswiecim20260525' ? {
    place: 'Małopolska Uczelnia Państwowa im. rtm. Witolda Pileckiego w Oświęcimiu',
    date: '2026-05-25',
    label: '25 maja 2026',
    code: 'OSW',
    bg: '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-bg-a4.jpg',
    preview: '/public/assets/events/rap-ort/oswiecim20260525/backgrounds/participation-record-preview.webp',
    seal: '/public/assets/events/rap-ort/oswiecim20260525/accents/event-seal-gold.svg',
    title: '/public/assets/events/rap-ort/oswiecim20260525/title-plates/title-zapis-uczestnictwa-gold.svg',
    signature: '/public/assets/reports/author-signature-gold.svg'
  } : null;
  if (!event) return;
  root.classList.add('pr-event-specific', 'pr-event-oswiecim20260525');
})();
