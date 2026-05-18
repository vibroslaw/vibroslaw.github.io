window.RapOrtEventAssets = (() => {
  const sharedRoot = '/public/assets/events/rap-ort/shared/experience/';
  const oswRoot = '/public/assets/events/rap-ort/oswiecim20260525/experience/';
  const sydRoot = '/public/assets/events/rap-ort/syd2026/experience/';

  const shared = {
    lobby: `${sharedRoot}event-lobby-cinematic-hero.webp`,
    lobbyMobile: `${sharedRoot}event-lobby-cinematic-mobile.webp`,
    beam: `${sharedRoot}projection-beam-overlay.webp`,
    eventPass: `${sharedRoot}event-pass-premium.webp`,
    eventPassTexture: `${sharedRoot}event-pass-texture.webp`,
    witnessDesk: `${sharedRoot}witness-writing-desk.webp`,
    witnessPaper: `${sharedRoot}witness-report-paper-closeup.webp`,
    documentAtelier: `${sharedRoot}document-atelier.webp`,
    documentSamples: `${sharedRoot}document-print-samples.webp`,
    memoryCase: `${sharedRoot}memory-case.webp`,
    memoryStack: `${sharedRoot}memory-card-stack.webp`,
    archiveWall: `${sharedRoot}archive-wall.webp`,
    archiveEmpty: `${sharedRoot}archive-wall-empty.webp`,
    darkTexture: `${sharedRoot}archival-dark-texture.webp`,
    goldLine: `${sharedRoot}subtle-gold-line-ornament.webp`,
    finalRoom: `${sharedRoot}final-question-dark-room.webp`
  };

  return {
    version: '0.1.0-pr77-premium-asset-manifest',
    shared,
    events: {
      oswiecim20260525: {
        lobby: `${oswRoot}oswiecim-event-lobby.webp`,
        lobbyMobile: `${oswRoot}oswiecim-event-lobby-mobile.webp`,
        fallbackLobby: shared.lobby,
        fallbackMobile: shared.lobbyMobile
      },
      syd2026: {
        lobby: `${sydRoot}sydney-event-lobby.webp`,
        lobbyMobile: `${sydRoot}sydney-event-lobby-mobile.webp`,
        fallbackLobby: shared.lobby,
        fallbackMobile: shared.lobbyMobile
      }
    },
    requiredForWow: [
      shared.lobby,
      shared.eventPass,
      shared.witnessDesk,
      shared.documentAtelier,
      shared.memoryCase,
      shared.archiveEmpty,
      shared.finalRoom
    ],
    recommended: [
      shared.lobbyMobile,
      shared.beam,
      shared.eventPassTexture,
      shared.witnessPaper,
      shared.documentSamples,
      shared.memoryStack,
      shared.archiveWall,
      shared.darkTexture,
      shared.goldLine,
      '/public/assets/events/rap-ort/oswiecim20260525/experience/oswiecim-event-lobby.webp',
      '/public/assets/events/rap-ort/syd2026/experience/sydney-event-lobby.webp'
    ]
  };
})();
