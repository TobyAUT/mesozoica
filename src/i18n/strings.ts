import type { Lang } from '@/store/experienceStore';

/**
 * UI STRINGS — every fixed label on the site, in both languages.
 *
 * English is the source of truth and the default. German is a hand-written translation reviewed
 * against DeepL's output; palaeontological terms follow German museum usage (e.g. "Kreidezeit",
 * "Flugsaurier", "Meeresreptil"). Proper nouns (genus names, institutions, licences) are NOT
 * translated. Content that lives in the data manifests is translated in ./content.ts instead.
 */
export const UI = {
  en: {
    // ── Navigation & chrome ──
    navTimeline: 'Timeline',
    navCreatures: 'Creatures',
    navAbout: 'About',
    navMethodology: 'Methodology',
    navCredits: 'Credits',
    navJumpTo: 'Jump to…',
    navMenuOpen: 'Open menu',
    navMenuClose: 'Close menu',
    eraTriassic: 'Triassic',
    eraJurassic: 'Jurassic',
    eraCretaceous: 'Cretaceous',
    langSwitchTo: 'Auf Deutsch umschalten',
    yearsAgo: 'million years ago',
    scrollToBegin: 'Scroll to begin',
    loadingSpecimen: 'Loading specimen…',
    preloaderEyebrow: 'An interactive age of dinosaurs',

    // ── Controls ──
    scientificMode: 'Scientific',
    scientificModeOn: 'Scientific · on',
    scientificModeAria: 'Scientific mode',
    scientificModeTitle: 'Scientific mode hides stylised and fictional models',
    qualityAria: 'Graphics quality',
    qualityAuto: 'Auto',
    qualityHigh: 'High',
    qualityBalanced: 'Balanced',
    qualityLow: 'Low',
    audioEnable: 'Enable ambient sound',
    audioMute: 'Mute ambient sound',
    audioNote: 'Ambient sound is optional. No sudden roars — subtle era beds only.',
    audioAmbience: 'Ambience',
    audioEffects: 'Effects',

    // ── Creature info panel ──
    panelWhen: 'When',
    panelWhere: 'Where',
    panelDiet: 'Diet',
    panelLength: 'Length',
    panelToBeVerified: 'To be verified',
    panelDidYouKnow: 'Did you know',
    panelSource: 'Source',
    panelExplore: 'Explore in 3D',
    panelPlay: 'Play',
    panelPause: 'Pause',
    panelPlayAria: 'Play creature sound',
    panelPauseAria: 'Pause creature sound',
    panelAudioPosition: 'Audio position',
    panelModelSource: 'Model source',
    dietCarnivore: 'Carnivore',
    dietHerbivore: 'Herbivore',
    dietOmnivore: 'Omnivore',
    dietPiscivore: 'Piscivore (fish-eater)',
    dietUnknown: 'Unknown',

    // ── Explore mode ──
    exploreMode: 'Explore mode',
    exploreModel: 'Model',
    exploreClose: 'Close',
    exploreCloseAria: 'Close 3D explore mode',
    explorePlay: 'Play Animation',
    explorePlaying: 'Playing Animation…',
    exploreNoAnimation: 'No Animation Available',
    exploreHint: 'Drag to orbit · wheel or pinch to zoom · Esc to exit',

    // ── Command palette ──
    paletteAria: 'Command palette',
    palettePlaceholder: 'Jump to an era, creature, or page…',
    paletteNoMatches: 'No matches',
    paletteHintChapter: 'Chapter',
    paletteHintPage: 'Page',
    paletteToggleSci: 'Toggle scientific mode',
    paletteToggleSciHint: 'Hide stylised & fictional models',
    paletteCreatures: 'Creature explorer',
    paletteMethodology: 'Scientific methodology',
    paletteCredits: 'Credits & licenses',

    // ── Timeline chapters (hard-coded copy) ──
    prologueIntro:
      'Travel through more than 300 million years of prehistoric life, from the armoured fishes of the Devonian to the last non-avian dinosaurs of the Cretaceous. Explore scientifically informed 3D reconstructions and discover how ancient animals, ecosystems and continents changed through deep time.',
    impactHeading: 'Impact',
    impactBody:
      'About 66 million years ago, a large asteroid struck near today’s Yucatán Peninsula. Dust, aerosols and wildfire products disrupted sunlight, climate and food webs around the world. All non-avian dinosaurs became extinct, while birds—the only surviving dinosaur lineage—continued into the modern world.',
    finaleHeading: 'The dinosaurs never left',
    finaleBody:
      'Dinosaurs did not disappear completely. Modern birds evolved within the theropod dinosaur lineage and are therefore living dinosaurs. From hummingbirds to eagles, more than 10,000 bird species continue a history that began among small feathered dinosaurs during the Mesozoic Era.',
    finaleCta: 'Explore every creature',
    timeSliceFallback:
      'Warm, humid river deltas spread between muddy banks and dense fern growth.',

    // ── Footers / notices ──
    footerImpressum: 'Impressum',
    footerDatenschutz: 'Privacy',
    footerCredits: 'Credits',
    footerCopyright: 'Mesozoica · AI-generated images & videos',
    shellFooterEdu:
      'Mesozoica · An educational WebGL experience · Facts attributed to reputable museums & science bodies.',
    shellFooterAi:
      'AI notice (EU AI Act, Art. 50): all background images and videos on this site are AI-generated.',
    shellFooterPrivacy:
      'Privacy: this site loads no external services, sets no tracking cookies and sends no personal data. Fonts and assets are served locally.',
    aiMarkerImage: 'AI-generated image',
    aiMarkerVideo: 'AI-generated video',
    noticeWebgl:
      'Your browser or device does not support WebGL, so the 3D models cannot be shown. All text, facts and images still work.',
    noticeGeneric:
      'Something went wrong while running the page. Parts of the experience may be missing — reloading usually helps.',
    noticeDismiss: 'Dismiss notice',
    noticeOk: 'OK',

    // ── Pages ──
    aboutTitle: 'About the project',
    aboutIntro:
      'Mesozoica is a cinematic, scientifically-honest journey through the Mesozoic era — built as a single fixed WebGL scene that transforms as you scroll through 186 million years of deep time.',
    aboutLead:
      'The experience pairs real 3D models with restrained camera work, era-specific atmosphere, and editorial information panels. It is designed to feel like a premium natural-history museum rather than a game.',
    aboutPrinciplesTitle: 'Design principles',
    aboutBuiltWithTitle: 'Built with',
    aboutBuiltWith:
      'React, Three.js, React Three Fiber & drei, postprocessing, Lenis for scroll, Motion for interface motion, Zustand, Zod, and Tailwind CSS.',
    aboutA11yTitle: 'Accessibility',
    aboutA11y:
      'The site respects prefers-reduced-motion, provides text alternatives for every 3D scene, supports full keyboard navigation and a command palette, and keeps all information available outside the canvas.',

    methodologyTitle: 'Scientific methodology',
    methodologyIntro:
      'This is an educational site, so we are explicit about what we know, what we don’t, and where each fact comes from.',
    methodologyFactsTitle: 'How we handle facts',
    methodologyBadgesTitle: 'Certainty badges',
    methodologyNotAllTitle: 'Not all of these are dinosaurs',
    methodologyNotAll:
      'Pterosaurs (flying reptiles), mosasaurs (marine reptiles), and even the birds are frequently lumped in with dinosaurs. We label each honestly: pterosaurs and marine reptiles were separate lineages, while birds are the one branch of dinosaurs still alive today.',

    creaturesTitle: 'Creature explorer',
    creaturesIntro:
      'Every model-backed specimen in the collection. Species identity is kept separate from model quality throughout.',
    creaturesCount: 'live specimens',
    creaturesViewInTimeline: 'View in timeline',

    creditsTitle: 'Credits & licenses',
    creditsIntro:
      'Every model, background, font, and data source used in this project. Attribution is required and tracked here.',
    creditsWarning: 'model licences still need verification.',
    creditsWarningBody:
      'Author and licence must be confirmed on each Sketchfab page before publishing. These are shown below with blank fields — they are not omitted.',
    creditsModels: '3D models',
    creditsAudio: 'Audio',
    creditsAudioCreator: 'Audio creator',
    creditsOther: 'Backgrounds, sound, fonts & sources',
    creditsColDisplayName: 'Display name',
    creditsColSourceTitle: 'Source title',
    creditsColAuthor: 'Author',
    creditsColLicense: 'License',
    creditsColSource: 'Source',
    creditsColStatus: 'Status',
    creditsVerified: 'Verified',
    creditsUnresolved: 'Unresolved',
    creditsNote:
      'The user downloaded each model under their own Sketchfab permissions. This project renders local GLB files and does not hotlink or bypass any download restrictions.',

    notFoundTitle: 'Lost in deep time',
    notFoundIntro: 'This page drifted off the geological record.',
    notFoundCta: 'Return to the timeline',
  },

  de: {
    // ── Navigation & Rahmen ──
    navTimeline: 'Zeitleiste',
    navCreatures: 'Kreaturen',
    navAbout: 'Über',
    navMethodology: 'Methodik',
    navCredits: 'Credits',
    navJumpTo: 'Springe zu…',
    navMenuOpen: 'Menü öffnen',
    navMenuClose: 'Menü schließen',
    eraTriassic: 'Trias',
    eraJurassic: 'Jura',
    eraCretaceous: 'Kreidezeit',
    langSwitchTo: 'Switch to English',
    yearsAgo: 'Mio. Jahre alt',
    scrollToBegin: 'Zum Starten scrollen',
    loadingSpecimen: 'Exemplar wird geladen…',
    preloaderEyebrow: 'Ein interaktives Zeitalter der Dinosaurier',

    // ── Bedienelemente ──
    scientificMode: 'Wissenschaft',
    scientificModeOn: 'Wissenschaft · an',
    scientificModeAria: 'Wissenschaftsmodus',
    scientificModeTitle: 'Der Wissenschaftsmodus blendet stilisierte und fiktive Modelle aus',
    qualityAria: 'Grafikqualität',
    qualityAuto: 'Automatisch',
    qualityHigh: 'Hoch',
    qualityBalanced: 'Ausgewogen',
    qualityLow: 'Niedrig',
    audioEnable: 'Hintergrundton einschalten',
    audioMute: 'Hintergrundton stummschalten',
    audioNote:
      'Der Hintergrundton ist optional. Kein plötzliches Gebrüll – nur dezente Klangteppiche pro Ära.',
    audioAmbience: 'Atmosphäre',
    audioEffects: 'Effekte',

    // ── Info-Panel ──
    panelWhen: 'Wann',
    panelWhere: 'Wo',
    panelDiet: 'Ernährung',
    panelLength: 'Länge',
    panelToBeVerified: 'Noch zu prüfen',
    panelDidYouKnow: 'Wusstest du',
    panelSource: 'Quelle',
    panelExplore: 'In 3D erkunden',
    panelPlay: 'Abspielen',
    panelPause: 'Pause',
    panelPlayAria: 'Tierlaut abspielen',
    panelPauseAria: 'Tierlaut pausieren',
    panelAudioPosition: 'Audio-Position',
    panelModelSource: 'Modellquelle',
    dietCarnivore: 'Fleischfresser',
    dietHerbivore: 'Pflanzenfresser',
    dietOmnivore: 'Allesfresser',
    dietPiscivore: 'Fischfresser',
    dietUnknown: 'Unbekannt',

    // ── Erkundungsmodus ──
    exploreMode: 'Erkundungsmodus',
    exploreModel: 'Modell',
    exploreClose: 'Schließen',
    exploreCloseAria: '3D-Erkundungsmodus schließen',
    explorePlay: 'Animation abspielen',
    explorePlaying: 'Animation läuft…',
    exploreNoAnimation: 'Keine Animation verfügbar',
    exploreHint: 'Ziehen zum Drehen · Mausrad oder Zwei-Finger-Geste zum Zoomen · Esc zum Beenden',

    // ── Befehlspalette ──
    paletteAria: 'Befehlspalette',
    palettePlaceholder: 'Springe zu einer Ära, Kreatur oder Seite…',
    paletteNoMatches: 'Keine Treffer',
    paletteHintChapter: 'Kapitel',
    paletteHintPage: 'Seite',
    paletteToggleSci: 'Wissenschaftsmodus umschalten',
    paletteToggleSciHint: 'Stilisierte & fiktive Modelle ausblenden',
    paletteCreatures: 'Kreaturen-Explorer',
    paletteMethodology: 'Wissenschaftliche Methodik',
    paletteCredits: 'Credits & Lizenzen',

    // ── Kapiteltexte ──
    prologueIntro:
      'Reise durch mehr als 300 Millionen Jahre urzeitlichen Lebens – von den gepanzerten Fischen des Devon bis zu den letzten Nicht-Vogel-Dinosauriern der Kreidezeit. Erkunde wissenschaftlich fundierte 3D-Rekonstruktionen und entdecke, wie sich urzeitliche Tiere, Ökosysteme und Kontinente durch die Tiefenzeit verändert haben.',
    impactHeading: 'Einschlag',
    impactBody:
      'Vor etwa 66 Millionen Jahren schlug ein großer Asteroid nahe der heutigen Halbinsel Yucatán ein. Staub, Aerosole und Verbrennungsprodukte von Waldbränden störten weltweit Sonnenlicht, Klima und Nahrungsnetze. Alle Nicht-Vogel-Dinosaurier starben aus, während die Vögel – die einzige überlebende Dinosaurier-Linie – bis in die heutige Welt fortbestanden.',
    finaleHeading: 'Die Dinosaurier sind nie verschwunden',
    finaleBody:
      'Die Dinosaurier verschwanden nicht vollständig. Moderne Vögel entwickelten sich innerhalb der Linie der Theropoden-Dinosaurier und sind damit lebende Dinosaurier. Von Kolibris bis zu Adlern setzen mehr als 10.000 Vogelarten eine Geschichte fort, die im Mesozoikum unter kleinen gefiederten Dinosauriern begann.',
    finaleCta: 'Alle Kreaturen entdecken',
    timeSliceFallback:
      'Warme, feuchte Flussdeltas breiten sich zwischen schlammigen Ufern und dichtem Farnbewuchs aus.',

    // ── Fußzeilen / Hinweise ──
    footerImpressum: 'Impressum',
    footerDatenschutz: 'Datenschutz',
    footerCredits: 'Credits',
    footerCopyright: 'Mesozoica · KI-generierte Bilder & Videos',
    shellFooterEdu:
      'Mesozoica · Ein edukatives WebGL-Erlebnis · Fakten mit Quellenangabe zu anerkannten Museen & Wissenschaftseinrichtungen.',
    shellFooterAi:
      'KI-Hinweis (EU AI Act, Art. 50): Alle Hintergrundbilder und -videos dieser Seite sind KI-generiert.',
    shellFooterPrivacy:
      'Datenschutz: Diese Seite lädt keine externen Dienste, setzt keine Tracking-Cookies und sendet keine personenbezogenen Daten. Schriften und Assets werden lokal ausgeliefert.',
    aiMarkerImage: 'KI-generiertes Bild',
    aiMarkerVideo: 'KI-generiertes Video',
    noticeWebgl:
      'Dein Browser oder Gerät unterstützt kein WebGL, daher können die 3D-Modelle nicht angezeigt werden. Alle Texte, Fakten und Bilder funktionieren weiterhin.',
    noticeGeneric:
      'Beim Ausführen der Seite ist etwas schiefgegangen. Teile des Erlebnisses fehlen möglicherweise – ein Neuladen hilft meistens.',
    noticeDismiss: 'Hinweis schließen',
    noticeOk: 'OK',

    // ── Seiten ──
    aboutTitle: 'Über das Projekt',
    aboutIntro:
      'Mesozoica ist eine filmische, wissenschaftlich ehrliche Reise durch das Mesozoikum – umgesetzt als eine einzige feste WebGL-Szene, die sich verwandelt, während du durch 186 Millionen Jahre Tiefenzeit scrollst.',
    aboutLead:
      'Das Erlebnis verbindet echte 3D-Modelle mit zurückhaltender Kameraführung, einer für jede Ära eigenen Atmosphäre und redaktionellen Infotafeln. Es soll sich wie ein hochwertiges naturhistorisches Museum anfühlen und nicht wie ein Spiel.',
    aboutPrinciplesTitle: 'Gestaltungsprinzipien',
    aboutBuiltWithTitle: 'Umgesetzt mit',
    aboutBuiltWith:
      'React, Three.js, React Three Fiber & drei, Postprocessing, Lenis für das Scrollen, Motion für Interface-Animationen, Zustand, Zod und Tailwind CSS.',
    aboutA11yTitle: 'Barrierefreiheit',
    aboutA11y:
      'Die Seite respektiert prefers-reduced-motion, bietet Textalternativen für jede 3D-Szene, unterstützt vollständige Tastaturnavigation sowie eine Befehlspalette und hält alle Informationen außerhalb des Canvas verfügbar.',

    methodologyTitle: 'Wissenschaftliche Methodik',
    methodologyIntro:
      'Dies ist eine edukative Seite. Deshalb sagen wir ausdrücklich, was wir wissen, was nicht, und woher jede Angabe stammt.',
    methodologyFactsTitle: 'Wie wir mit Fakten umgehen',
    methodologyBadgesTitle: 'Sicherheits-Kennzeichnungen',
    methodologyNotAllTitle: 'Nicht alles davon sind Dinosaurier',
    methodologyNotAll:
      'Flugsaurier, Mosasaurier (Meeresreptilien) und sogar Vögel werden häufig mit Dinosauriern in einen Topf geworfen. Wir kennzeichnen jedes Tier ehrlich: Flugsaurier und Meeresreptilien waren eigene Linien, während die Vögel der eine Dinosaurier-Zweig sind, der bis heute lebt.',

    creaturesTitle: 'Kreaturen-Explorer',
    creaturesIntro:
      'Jedes durch ein Modell belegte Exemplar der Sammlung. Die Artbestimmung wird durchgehend getrennt von der Modellqualität betrachtet.',
    creaturesCount: 'aktive Exemplare',
    creaturesViewInTimeline: 'In der Zeitleiste ansehen',

    creditsTitle: 'Credits & Lizenzen',
    creditsIntro:
      'Alle Modelle, Hintergründe, Schriften und Datenquellen dieses Projekts. Die Namensnennung ist verpflichtend und wird hier nachgehalten.',
    creditsWarning: 'Modell-Lizenzen müssen noch geprüft werden.',
    creditsWarningBody:
      'Autor und Lizenz müssen vor einer Veröffentlichung auf der jeweiligen Sketchfab-Seite bestätigt werden. Sie werden unten mit leeren Feldern gezeigt – sie werden nicht weggelassen.',
    creditsModels: '3D-Modelle',
    creditsAudio: 'Audio',
    creditsAudioCreator: 'Audio-Urheber',
    creditsOther: 'Hintergründe, Ton, Schriften & Quellen',
    creditsColDisplayName: 'Anzeigename',
    creditsColSourceTitle: 'Originaltitel',
    creditsColAuthor: 'Autor',
    creditsColLicense: 'Lizenz',
    creditsColSource: 'Quelle',
    creditsColStatus: 'Status',
    creditsVerified: 'Geprüft',
    creditsUnresolved: 'Ungeklärt',
    creditsNote:
      'Alle Modelle wurden im Rahmen der eigenen Sketchfab-Berechtigungen heruntergeladen. Dieses Projekt rendert lokale GLB-Dateien und umgeht keinerlei Download-Beschränkungen.',

    notFoundTitle: 'Verloren in der Tiefenzeit',
    notFoundIntro: 'Diese Seite ist aus dem geologischen Befund gedriftet.',
    notFoundCta: 'Zurück zur Zeitleiste',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type StringKey = keyof (typeof UI)['en'];

/** List content that stays as ordered bullets on the static pages. */
export const UI_LISTS = {
  en: {
    aboutPrinciples: [
      'One fixed 3D scene; the DOM provides scroll length and all readable text.',
      'Model identity and scientific identity are treated as separate facts.',
      'Nothing essential lives only inside WebGL; the site works with reduced motion.',
      'Attribution is a first-class concern, never silently dropped.',
      'Performance scales from desktop down to mobile via an adaptive quality system.',
    ],
    methodologyFacts: [
      'Every displayed fact is attributed to a reputable museum or science body.',
      'Unverifiable details are shown as “To be verified”, never guessed.',
      'Popular-media portrayals are never used as scientific evidence.',
      'A model looking like a species is not treated as proof of that species.',
    ],
  },
  de: {
    aboutPrinciples: [
      'Eine einzige feste 3D-Szene; das DOM liefert die Scrolllänge und alle lesbaren Texte.',
      'Modell-Identität und wissenschaftliche Identität werden als getrennte Fakten behandelt.',
      'Nichts Wesentliches steckt nur in WebGL; die Seite funktioniert auch mit reduzierter Bewegung.',
      'Namensnennung ist ein zentrales Anliegen und wird nie stillschweigend weggelassen.',
      'Die Leistung skaliert dank adaptivem Qualitätssystem vom Desktop bis zum Mobilgerät.',
    ],
    methodologyFacts: [
      'Jede angezeigte Angabe ist einem anerkannten Museum oder einer Wissenschaftseinrichtung zugeordnet.',
      'Nicht überprüfbare Details werden als „Noch zu prüfen“ ausgewiesen und niemals geraten.',
      'Darstellungen aus populären Medien gelten nie als wissenschaftlicher Beleg.',
      'Dass ein Modell wie eine Art aussieht, gilt nicht als Beleg für diese Art.',
    ],
  },
} as const satisfies Record<Lang, Record<string, readonly string[]>>;
