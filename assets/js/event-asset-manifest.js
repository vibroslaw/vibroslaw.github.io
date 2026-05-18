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

  const procedural = {
    lobby: `${sharedRoot}event-lobby-cinematic-hero.svg`,
    lobbyMobile: `${sharedRoot}event-lobby-cinematic-mobile.svg`,
    eventPass: `${sharedRoot}event-pass-premium.svg`,
    witnessDesk: `${sharedRoot}witness-writing-desk.svg`,
    documentAtelier: `${sharedRoot}document-atelier.svg`,
    memoryCase: `${sharedRoot}memory-case.svg`,
    archiveEmpty: `${sharedRoot}archive-wall-empty.svg`,
    finalRoom: `${sharedRoot}final-question-dark-room.svg`
  };

  return {
    version: '0.2.0-pr78-procedural-cinematic-asset-pack',
    shared,
    procedural,
    assetCandidates: {
      lobby: [shared.lobby, procedural.lobby],
      lobbyMobile: [shared.lobbyMobile, procedural.lobbyMobile, procedural.lobby],
      eventPass: [shared.eventPass, procedural.eventPass],
      witnessDesk: [shared.witnessDesk, procedural.witnessDesk],
      documentAtelier: [shared.documentAtelier, procedural.documentAtelier],
      memoryCase: [shared.memoryCase, procedural.memoryCase],
      archiveEmpty: [shared.archiveEmpty, procedural.archiveEmpty],
      finalRoom: [shared.finalRoom, procedural.finalRoom]
    },
    events: {
      oswiecim20260525: {
        lobby: `${oswRoot}oswiecim-event-lobby.webp`,
        lobbyMobile: `${oswRoot}oswiecim-event-lobby-mobile.webp`,
        fallbackLobby: procedural.lobby,
        fallbackMobile: procedural.lobbyMobile
      },
      syd2026: {
        lobby: `${sydRoot}sydney-event-lobby.webp`,
        lobbyMobile: `${sydRoot}sydney-event-lobby-mobile.webp`,
        fallbackLobby: procedural.lobby,
        fallbackMobile: procedural.lobbyMobile
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
    requiredProcedural: [
      procedural.lobby,
      procedural.eventPass,
      procedural.witnessDesk,
      procedural.documentAtelier,
      procedural.memoryCase,
      procedural.archiveEmpty,
      procedural.finalRoom
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
