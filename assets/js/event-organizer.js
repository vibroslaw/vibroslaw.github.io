(() => {
  const root = document.querySelector('[data-event-organizer]');
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const origin = window.location.origin;

  const presets = {
    syd2026: {
      eventCode: 'syd2026',
      code: 'SYD',
      title: 'Rap-Ort: Prawda Sumienia — Sydney 2026',
      place: 'Polish Club Ashfield / Sydney',
      date: '2026-06-21',
      dateLabel: '21 June 2026',
      note: 'International screening',
      gateway: '/events/sydney-2026/after/'
    }
  };

  const form = $('[data-organizer-form]');
  const preset = $('[name="preset"]');
  const title = $('[name="title"]');
  const place = $('[name="place"]');
  const date = $('[name="date"]');
  const code = $('[name="eventCode"]');
  const note = $('[name="note"]');
  const gatewayPath = $('[name="gatewayPath"]');
  const qrImage = $('[data-organizer-qr]');
  const gatewayUrl = $('[data-gateway-url]');
  const enUrl = $('[data-en-url]');
  const plUrl = $('[data-pl-url]');
  const screenPreview = $('[data-screen-preview]');
  const copyBlock = $('[data-copy-block]');
  const copyButton = $('[data-copy-links]');
  const printButton = $('[data-print-pack]');

  function formatDate(value) {
    if (!value) return '';
    try {
      return new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
    } catch (_) { return value; }
  }

  function safePath(path) {
    const raw = String(path || '').trim();
    if (!raw) return '/events/custom/after/';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return new URL(raw).pathname;
    return raw.startsWith('/') ? raw : `/${raw}`;
  }

  function absolute(path) {
    return new URL(path, origin).href;
  }

  function qrSrc(url) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=900x900&margin=30&data=${encodeURIComponent(url)}`;
  }

  function data() {
    const eventCode = String(code.value || 'custom').trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || 'custom';
    const path = safePath(gatewayPath.value || `/events/${eventCode}/after/`);
    return {
      title: title.value.trim() || 'Rap-Ort: Prawda Sumienia',
      place: place.value.trim() || 'Event place',
      dateValue: date.value,
      dateLabel: formatDate(date.value) || 'Event date',
      eventCode,
      note: note.value.trim() || 'Post-screening participant access',
      gateway: absolute(path),
      en: absolute(`/rap-ort/participation/?event=${eventCode}`),
      pl: absolute(`/rap-ort/uczestnictwo/?event=${eventCode}`)
    };
  }

  function render() {
    const d = data();
    if (qrImage) qrImage.src = qrSrc(d.gateway);
    if (gatewayUrl) gatewayUrl.textContent = d.gateway;
    if (enUrl) { enUrl.textContent = d.en; enUrl.href = d.en; }
    if (plUrl) { plUrl.textContent = d.pl; plUrl.href = d.pl; }
    if (screenPreview) {
      screenPreview.innerHTML = `
        <div class="organizer-screen-card">
          <p>VERITAS HUMANUM · RAP-ORT</p>
          <h3>Thank you</h3>
          <span>Dziękujemy za udział w doświadczeniu ${escapeHtml(d.title)}.</span>
          <strong>${escapeHtml(d.place)}</strong>
          <em>${escapeHtml(d.dateLabel)} · ${escapeHtml(d.note)}</em>
        </div>`;
    }
    if (copyBlock) {
      copyBlock.value = [
        'EVENT QR PACK',
        d.title,
        d.place,
        d.dateLabel,
        '',
        `Gateway: ${d.gateway}`,
        `English generator: ${d.en}`,
        `Polski generator: ${d.pl}`,
        '',
        'End-screen copy:',
        'Thank you for participating in Rap-Ort: Prawda Sumienia.',
        'Scan the QR code to create your commemorative Record of Participation.',
        'Dziękujemy za udział w doświadczeniu Rap-Ort: Prawda Sumienia.',
        'Zeskanuj kod QR, aby utworzyć pamiątkowy Zapis Uczestnictwa.'
      ].join('\n');
    }
  }

  function applyPreset(key) {
    const item = presets[key];
    if (!item) return;
    title.value = item.title;
    place.value = item.place;
    date.value = item.date;
    code.value = item.eventCode;
    note.value = item.note;
    gatewayPath.value = item.gateway;
    render();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  preset?.addEventListener('change', () => applyPreset(preset.value));
  form?.addEventListener('input', render);
  form?.addEventListener('change', render);
  copyButton?.addEventListener('click', async () => {
    if (!copyBlock) return;
    try {
      await navigator.clipboard.writeText(copyBlock.value);
      copyButton.textContent = 'Copied';
      setTimeout(() => { copyButton.textContent = 'Copy links'; }, 1600);
    } catch (_) {
      copyBlock.select();
      document.execCommand('copy');
    }
  });
  printButton?.addEventListener('click', () => window.print());

  applyPreset('syd2026');
})();
