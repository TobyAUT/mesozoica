/**
 * GERMAN CONTENT OVERRIDES for the data manifests.
 *
 * English lives in the manifests themselves ([creatures.ts](../data/creatures.ts),
 * [eras.ts](../data/eras.ts)) and stays the source of truth — this file only carries the German
 * counterpart, keyed by the same ids. Adding a creature/chapter without a German entry degrades
 * gracefully to the English text rather than breaking.
 *
 * NOT translated (deliberately): genus/species names, institution names in `factSource`, licences,
 * and author names — proper nouns are identical in both languages.
 */

/** Manifest `period` values → German. */
export const PERIOD_DE: Record<string, string> = {
  Devonian: 'Devon',
  Triassic: 'Trias',
  'Early Jurassic': 'Früher Jura',
  'Middle Jurassic': 'Mittlerer Jura',
  'Late Jurassic': 'Später Jura',
  'Early Cretaceous': 'Frühe Kreidezeit',
  'Late Cretaceous': 'Späte Kreidezeit',
  'Latest Cretaceous': 'Jüngste Kreidezeit',
};

/** Manifest `continent` values → German. */
export const CONTINENT_DE: Record<string, string> = {
  Uncertain: 'Ungewiss',
  Europe: 'Europa',
  'Europe (England)': 'Europa (England)',
  Antarctica: 'Antarktis',
  'Asia (China)': 'Asien (China)',
  'North America': 'Nordamerika',
  'North America (Mexico)': 'Nordamerika (Mexiko)',
  'North America (Western Interior Seaway)': 'Nordamerika (Western Interior Seaway)',
  'South America (Argentina)': 'Südamerika (Argentinien)',
  'Africa (North Africa)': 'Afrika (Nordafrika)',
  'Global oceans': 'Weltweite Ozeane',
  'Global Devonian seas': 'Weltweite Meere des Devon',
  'Pangaea (global)': 'Pangaea (weltweit)',
};

/** `scientificStatus` badge labels → German (mirrors statusLabel()). */
export const STATUS_DE: Record<string, string> = {
  Verified: 'Gesichert',
  'Generic model': 'Allgemeines Modell',
  'Stylised interpretation': 'Stilisierte Interpretation',
  'Identification uncertain': 'Bestimmung ungewiss',
  'Group scene': 'Gruppenszene',
  'Marine reptile': 'Meeresreptil',
  Pterosaur: 'Flugsaurier',
  'Prehistoric bird': 'Urzeitlicher Vogel',
  'Prehistoric fish': 'Urzeitlicher Fisch',
  'Not a dinosaur': 'Kein Dinosaurier',
};

export interface CreatureText {
  shortDescription: string;
  keyFact: string;
}

/** Per-creature prose, keyed by creature id. */
export const CREATURE_DE: Record<string, CreatureText> = {
  carnotaurus: {
    shortDescription:
      'Carnotaurus war ein etwa acht Meter langer Abelisaurier-Räuber aus dem Argentinien der späten Kreidezeit. Er trug zwei dicke Hörner über den Augen, einen kurzen, hohen Schädel und extrem verkürzte Vorderbeine. Erhaltene Hautabdrücke zeigen Schuppen über den bekannten Körperbereichen.',
    keyFact:
      'Carnotaurus hatte im Verhältnis zur Körpergröße die kleinsten Vorderbeine aller großen Raubdinosaurier.',
  },
  'velociraptor-like': {
    shortDescription:
      'Dieses Modell wird bewusst als allgemeiner Dromaeosaurier gezeigt und nicht als exakte Velociraptor-Rekonstruktion. Der echte Velociraptor lebte in der späten Kreidezeit der Mongolei, wurde etwa zwei Meter lang und besaß mit hoher Wahrscheinlichkeit Federn sowie eine vergrößerte, gekrümmte Zehenkralle.',
    keyFact:
      'Der echte Velociraptor war truthahngroß und fast sicher gefiedert – weit entfernt von seiner Darstellung im Film.',
  },
  alexornis: {
    shortDescription:
      'Alexornis war ein kleiner urzeitlicher Vogel aus der späten Kreidezeit Mexikos. Er gehörte zu den Enantiornithes, einer ausgestorbenen Gruppe früher Vögel. Da das gezeigte Modell auf einer Filmfigur beruht, sollte es nicht als exakte wissenschaftliche Rekonstruktion verstanden werden.',
    keyFact:
      'Vögel sind lebende Dinosaurier: die einzige Dinosaurier-Linie, die das Massenaussterben am Ende der Kreidezeit überlebt hat.',
  },
  spinosaurus: {
    shortDescription:
      'Spinosaurus war ein riesiger Theropode mit Rückensegel aus der späten Kreidezeit Nordafrikas. Seine kegelförmigen Zähne, die schmalen Kiefer und der paddelartige Schwanz deuten auf starke Anpassungen an die Nahrungssuche im Wasser hin. Wie gut er schwamm und wie viel Zeit er in tiefem Wasser verbrachte, ist weiterhin umstritten.',
    keyFact: 'Spinosaurus ist der längste derzeit bekannte Raubdinosaurier.',
  },
  triceratops: {
    shortDescription:
      'Triceratops war ein großer gehörnter Pflanzenfresser, der in den letzten zwei Millionen Jahren der Kreidezeit in Nordamerika lebte. Seine drei Hörner, der Schnabel und der breite Nackenschild dienten der Nahrungsaufnahme, dem Imponieren und der Verteidigung. Er teilte seinen Lebensraum mit Tyrannosaurus rex.',
    keyFact:
      'Triceratops lebte gemeinsam mit Tyrannosaurus rex – und war wahrscheinlich dessen Beute – in den letzten Tagen des Dinosaurierzeitalters.',
  },
  'tyrannosaurus-rex': {
    shortDescription:
      'Tyrannosaurus rex war ein gewaltiger Tyrannosaurier-Räuber aus der jüngsten Kreidezeit Nordamerikas. Ausgewachsene Tiere erreichten rund zwölf Meter oder mehr und besaßen einen kraftvollen, knochenbrechenden Biss. Fossile Belege zeigen, dass T. rex sowohl lebende Tiere jagte als auch Aas fraß.',
    keyFact:
      'Ein Biss von T. rex konnte über 30.000 Newton Kraft entwickeln – einer der stärksten aller Landtiere.',
  },
  mosasaurus: {
    shortDescription:
      'Mosasaurus war ein riesiges Meeresreptil und kein Dinosaurier. Diese hochspezialisierte, im Meer lebende Schuppenechse lebte in der späten Kreidezeit und gehörte zu jener weiteren Verwandtschaft, die auch heutige Echsen und Schlangen umfasst. Seine kräftigen Kiefer machten ihn zu einem bedeutenden Meeresräuber.',
    keyFact:
      'Mosasaurus war einer der letzten und größten Mosasaurier – einer Gruppe im Meer lebender Echsen, nicht Dinosaurier.',
  },
  dunkleosteus: {
    shortDescription:
      'Dunkleosteus war ein großer gepanzerter Placodermen-Fisch aus dem späten Devon und kein Dinosaurier. Statt echter Zähne nutzte er geschärfte Knochenplatten, um Beute zu greifen und zu zerteilen. Da vor allem sein gepanzerter Kopf erhalten ist, bleibt seine vollständige Körperform ungewiss.',
    keyFact:
      'Dunkleosteus hatte einen der kräftigsten Bisse aller Fische – und nutzte dafür knöcherne Scherplatten statt Zähne.',
  },
  plesiosaurus: {
    shortDescription:
      'Plesiosaurus war ein Meeresreptil und kein Dinosaurier. Er lebte in den Meeren des frühen Jura und besaß einen verhältnismäßig kleinen Kopf, einen langen Hals und vier kräftige Flossen. Wahrscheinlich jagte er Fische und andere kleine Meerestiere in flachen Küstengewässern.',
    keyFact:
      'Plesiosaurier waren Meeresreptilien, die mit vier flügelartigen Flossen unter Wasser „flogen“.',
  },
  tylosaurus: {
    shortDescription:
      'Tylosaurus war ein riesiger Mosasaurier und kein Dinosaurier. Er jagte im Western Interior Seaway der späten Kreidezeit Nordamerikas und nutzte einen kräftigen Schwanz zum Antrieb. Fossile Belege zeigen, dass Mosasaurier eine große Bandbreite an Meeresbeute fraßen.',
    keyFact:
      'Tylosaurus war einer der größten Mosasaurier – einer Gruppe im Meer lebender Echsen.',
  },
  quetzalcoatlus: {
    shortDescription:
      'Quetzalcoatlus war ein riesiger Azhdarchiden-Flugsaurier und kein Dinosaurier. Mit einer geschätzten Flügelspannweite von etwa 10–11 Metern gehörte er zu den größten bekannten Flugtieren. Vieles deutet darauf hin, dass er zudem viel Zeit gehend und am Boden nach Nahrung suchend verbrachte.',
    keyFact: 'Quetzalcoatlus war so hoch wie eine Giraffe und konnte trotzdem fliegen.',
  },
  lystrosaurus: {
    shortDescription:
      'Lystrosaurus war ein Dicynodont-Synapside mit Stoßzähnen und kein Dinosaurier. Dieser gedrungene Pflanzenfresser verbreitete sich in der frühen Trias stark und war eines der häufigsten großen Landwirbeltiere, das die ökologische Krise nach dem Massenaussterben am Ende des Perms überlebte.',
    keyFact:
      'In der frühesten Trias stellte Lystrosaurus den weit überwiegenden Teil der großen Landwirbeltiere – ein seltener „Katastrophenüberlebender“ des End-Perm-Aussterbens.',
  },
  herrerasaurus: {
    shortDescription:
      'Herrerasaurus war einer der frühesten gut bekannten Raubdinosaurier. Er lebte vor rund 231 Millionen Jahren in der späten Trias Argentiniens und bewegte sich auf zwei kräftigen Hinterbeinen. Seine genaue Stellung nahe der Basis des Dinosaurier-Stammbaums ist wissenschaftlich weiterhin umstritten.',
    keyFact:
      'Herrerasaurus gehört zu den frühesten bekannten Dinosauriern und lebte vor etwa 231 Millionen Jahren.',
  },
  plateosaurus: {
    shortDescription:
      'Plateosaurus war ein großer Sauropodomorphe aus der späten Trias Europas und ein früher Verwandter der späteren Riesensauropoden. Er bewegte sich hauptsächlich auf zwei Beinen, fraß Pflanzen und besaß kräftige Hände mit einer auffälligen Daumenkralle. Zahlreiche Skelette machen ihn zu einem der bestbekannten Dinosaurier der Trias.',
    keyFact:
      'Plateosaurus war einer der ersten wirklich großen pflanzenfressenden Dinosaurier und ist durch viele Skelette in ganz Europa belegt.',
  },
  dilophosaurus: {
    shortDescription:
      'Dilophosaurus war ein Raubdinosaurier aus dem frühen Jura Nordamerikas, der etwa sieben Meter lang wurde. Seine beiden dünnen Schädelkämme dienten vermutlich dem Imponieren oder der Arterkennung. Es gibt keinerlei fossile Belege dafür, dass er Gift besaß oder einen ausklappbaren Halskragen hatte.',
    keyFact:
      'Dilophosaurus gehörte mit seinen zwei markanten Kopfkämmen zu den größten Landräubern des frühen Jura.',
  },
  cryolophosaurus: {
    shortDescription:
      'Cryolophosaurus war ein Theropode mit Kopfkamm aus dem frühen Jura der Antarktis. Damals war die Antarktis wärmer und trug Wälder und Flusstäler. Sein auffälliger, seitlich gebogener Kamm diente möglicherweise dem Imponieren, seine genaue Funktion ist jedoch unbekannt.',
    keyFact:
      'Cryolophosaurus war der erste wissenschaftlich benannte Dinosaurier aus der Antarktis – mit einem ungewöhnlichen Kamm quer über dem Kopf.',
  },
  pistosaurus: {
    shortDescription:
      'Pistosaurus war ein rund drei Meter langer, im Meer lebender Sauropterygier aus der mittleren Trias und kein Dinosaurier. Seine Anatomie verband ursprüngliche Merkmale von Meeresreptilien mit Eigenschaften, die später bei Plesiosauriern auftraten. Er war eng mit den Plesiosauriern verwandt, sollte aber nicht als deren gesicherter direkter Vorfahre beschrieben werden.',
    keyFact:
      'Pistosauroide waren frühe Verwandte der Plesiosaurier und bereits an die Jagd im offenen Wasser angepasst.',
  },
  megalosaurus: {
    shortDescription:
      'Megalosaurus war ein großer Theropode aus dem mittleren Jura Englands. 1824 wurde er als erster Nicht-Vogel-Dinosaurier wissenschaftlich benannt – fast zwei Jahrzehnte, bevor der Begriff „Dinosauria“ überhaupt eingeführt wurde.',
    keyFact:
      'Megalosaurus war 1824 der erste Dinosaurier, der je einen wissenschaftlichen Namen erhielt – lange bevor es das Wort „Dinosaurier“ gab.',
  },
  cetiosaurus: {
    shortDescription:
      'Cetiosaurus war ein großer pflanzenfressender Sauropode aus dem mittleren Jura Englands. Mit etwa 16–18 Metern Länge zählte er zu den ersten wissenschaftlich beschriebenen Sauropoden. Sein Name „Walechse“ spiegelt die frühe Verwirrung über seine gewaltigen Fossilknochen wider.',
    keyFact:
      'Cetiosaurus („Walechse“) war einer der ersten beschriebenen Sauropoden – noch bevor man ihre wahre Natur als riesige Landtiere verstand.',
  },
  huayangosaurus: {
    shortDescription:
      'Huayangosaurus war ein früher Stegosaurier aus dem mittleren Jura Chinas. Mit rund vier bis fünf Metern Länge war er kleiner und ursprünglicher als Stegosaurus. Platten, Stacheln und ausgeprägte Schulterstacheln kennzeichneten diesen kräftig gebauten Pflanzenfresser.',
    keyFact:
      'Huayangosaurus ist einer der frühesten bekannten Stegosaurier und ursprünglicher als sein berühmter späterer Verwandter Stegosaurus.',
  },
  allosaurus: {
    shortDescription:
      'Allosaurus war einer der häufigsten großen Räuber der Morrison-Formation im späten Jura Nordamerikas. Er besaß gesägte Zähne, dreifingrige Hände und kleine Kämme über den Augen. Belege für kooperative Jagd im Rudel bleiben ungewiss.',
    keyFact:
      'Allosaurus ist der am häufigsten gefundene große Raubdinosaurier der Morrison-Formation des späten Jura.',
  },
  stegosaurus: {
    shortDescription:
      'Stegosaurus war ein großer Pflanzenfresser des späten Jura, erkennbar an den abwechselnd angeordneten Rückenplatten und dem vierstacheligen Schwanz. Der Schwanz war eine wirksame Verteidigungswaffe, während der genaue Zweck der Platten – womöglich Imponieren, Arterkennung oder Temperaturregulierung – umstritten bleibt.',
    keyFact:
      'Stegosaurus hatte ein für seine Körpergröße kleines Gehirn und trug vier Schwanzstacheln mit dem Spitznamen „Thagomizer“.',
  },
  diplodocus: {
    shortDescription:
      'Diplodocus war ein außerordentlich langer Sauropode des späten Jura mit verlängertem Hals und peitschenartigem Schwanz. Einzelne Tiere erreichten möglicherweise rund 25 Meter. Seine schmalen, stiftartigen Zähne saßen vor allem vorn im Maul und eigneten sich zum Abstreifen von Pflanzen.',
    keyFact:
      'Diplodocus ist dank seines außergewöhnlich langen Halses und des peitschenartigen Schwanzes einer der längsten bekannten Dinosaurier.',
  },
  baryonyx: {
    shortDescription:
      'Baryonyx war ein Spinosaurier-Theropode aus der frühen Kreidezeit Englands. Seine langen, schmalen Kiefer ähnelten denen eines Krokodils, und jede Hand trug eine große hakenförmige Kralle. Bei seinem Skelett gefundene Fischreste belegen unmittelbar, dass Fisch Teil seiner Nahrung war.',
    keyFact:
      'Im Skelett eines Baryonyx gefundene Fischschuppen und -knochen belegen, dass er Fische fraß – gefangen mit krokodilartigen Kiefern und hakenförmigen Daumenkrallen.',
  },
  iguanodon: {
    shortDescription:
      'Iguanodon war ein großer pflanzenfressender Ornithopode aus der frühen Kreidezeit Europas. Er konnte sich auf zwei oder vier Beinen fortbewegen und trug an jedem Daumen einen kegelförmigen Stachel. Seine Fossilien spielten eine wichtige Rolle in der frühen wissenschaftlichen Erforschung der Dinosaurier.',
    keyFact:
      'Iguanodon war einer der ersten je benannten Dinosaurier und trug an jedem Daumen einen kegelförmigen Stachel, dessen Zweck bis heute diskutiert wird.',
  },
  argentinosaurus: {
    shortDescription:
      'Argentinosaurus war ein riesiger Titanosaurier aus der späten Kreidezeit Argentiniens und eines der größten bekannten Landtiere. Da er nur aus unvollständigen Überresten bekannt ist, schwanken die Schätzungen zu seiner genauen Länge und Masse erheblich und sollten mit Vorsicht dargestellt werden.',
    keyFact:
      'Argentinosaurus zählt mit geschätzt über 30 Metern Länge zu den schwersten Landtieren aller Zeiten.',
  },
  ankylosaurus: {
    shortDescription:
      'Ankylosaurus war ein stark gepanzerter Pflanzenfresser aus dem letzten Abschnitt der späten Kreidezeit Nordamerikas. Knöcherne Platten schützten seinen Körper, während verwachsene Knochen eine große Schwanzkeule bildeten, mit der er kräftige Verteidigungsschläge austeilen konnte.',
    keyFact:
      'Ankylosaurus schwang eine schwere knöcherne Schwanzkeule, die kraftvolle Verteidigungsschläge gegen Räuber wie T. rex austeilen konnte.',
  },
};

export interface ChapterText {
  title?: string;
  subtitle?: string;
  blurb?: string;
}

/** Per-chapter headings/copy, keyed by chapter id. Era-intro chapters read ERA_DE instead. */
export const CHAPTER_DE: Record<string, ChapterText> = {
  prologue: { title: 'Mesozoica', subtitle: 'Eine Reise durch die Tiefenzeit' },
  dunkleosteus: { title: 'Der gepanzerte Fisch', subtitle: 'Ein Placoderme – kein Dinosaurier' },
  lystrosaurus: { title: 'Der Katastrophenüberlebende', subtitle: 'Ein Synapside – kein Dinosaurier' },
  pistosaurus: { title: 'Ahne der Meeresdrachen', subtitle: 'Ein Meeresreptil – kein Dinosaurier' },
  herrerasaurus: { title: 'Einer der ersten Dinosaurier' },
  plateosaurus: { title: 'Der frühe Riese' },
  dilophosaurus: { title: 'Der Jäger mit dem Kamm' },
  cryolophosaurus: { title: 'Der Räuber aus der Antarktis' },
  plesiosaurus: {
    title: 'Der langhalsige Schwimmer',
    subtitle: 'Ein Meeresreptil – kein Dinosaurier',
  },
  'middle-jurassic': {
    title: 'Der mittlere Jura',
    subtitle: 'vor 174,7–161,5 Millionen Jahren',
    blurb:
      'Im mittleren Jura schufen driftende Kontinente zunehmend eigenständige Ökosysteme. Sauropoden wurden zu den bestimmenden großen Pflanzenfressern, während sich frühe Stegosaurier und große Theropoden ausbreiteten. Obwohl der Fossilbericht weniger vollständig ist als der des späten Jura, war dieser Abschnitt entscheidend für die Evolution der Dinosaurier.',
  },
  cetiosaurus: { title: 'Die Walechse' },
  megalosaurus: { title: 'Der erste benannte Dinosaurier' },
  huayangosaurus: { title: 'Der frühe Plattendinosaurier' },
  'late-jurassic': {
    title: 'Der späte Jura',
    subtitle: 'vor 161,5–143,1 Millionen Jahren',
    blurb:
      'Der späte Jura war geprägt von weiten Überschwemmungsebenen, Nadelwäldern und farnreichen Landschaften. Riesige Sauropoden wie Diplodocus lebten neben Stegosaurus und großen Räubern wie Allosaurus. Kleine gefiederte Dinosaurier und frühe Vögel zeigen zudem, dass der evolutionäre Übergang von Dinosauriern zu Vögeln bereits im Gange war.',
  },
  allosaurus: { title: 'Der Löwe des Jura' },
  stegosaurus: { title: 'Platten und Stacheln' },
  diplodocus: { title: 'Der längste Hals' },
  baryonyx: { title: 'Der Fischerkönig' },
  iguanodon: { title: 'Der Pflanzenfresser mit dem Daumenstachel' },
  'late-cretaceous': {
    title: 'Die späte Kreidezeit',
    subtitle: 'vor 100,5–66 Millionen Jahren',
    blurb:
      'In der späten Kreidezeit waren Blütenpflanzen weit verbreitet und die Dinosaurier hatten sich zu sehr vielfältigen Gruppen entwickelt. Tyrannosaurier, Ceratopsier, Titanosaurier und Ankylosaurier beherrschten viele Landökosysteme, während Mosasaurier die Ozeane und riesige Flugsaurier den Himmel durchzogen. Die Periode endete mit dem Chicxulub-Einschlag und einem globalen Massenaussterben.',
  },
  spinosaurus: { title: 'Der Flussjäger' },
  argentinosaurus: { title: 'Der Koloss' },
  tylosaurus: { title: 'Die Meeresechse', subtitle: 'Ein Mosasaurier – kein Dinosaurier' },
  carnotaurus: { title: 'Der gehörnte Räuber' },
  'velociraptor-like': { title: 'Der flinke Dromaeosaurier' },
  alexornis: { title: 'Die ersten Vögel' },
  ankylosaurus: { title: 'Die lebende Festung' },
  quetzalcoatlus: { title: 'Der Riese des Himmels', subtitle: 'Ein Flugsaurier – kein Dinosaurier' },
  triceratops: { title: 'Drei Hörner' },
  'tyrannosaurus-rex': { title: 'Der Tyrannenkönig' },
  marine: { title: 'Unter den Wellen', subtitle: 'Ein Meeresreptil – kein Dinosaurier' },
  extinction: { title: 'Einschlag', subtitle: 'vor 66 Millionen Jahren' },
  finale: {
    title: 'Die Dinosaurier sind nie verschwunden',
    subtitle: 'Vögel sind lebende Dinosaurier',
  },
  'before-dinosaurs': { title: 'Vor den Dinosauriern' },
  'era-triassic': { title: 'Die Trias' },
  'era-jurassic': { title: 'Der Jura' },
  'era-cretaceous': { title: 'Die Kreidezeit' },
};

export interface EraText {
  /** The full h2 heading — German word order can't be composed from "The " + label. */
  heading: string;
  epoch: string;
  intro: string;
}

/** Per-era intro block, keyed by era id. */
export const ERA_DE: Record<string, EraText> = {
  devonian: {
    heading: 'Das Devon',
    epoch: 'vor 419,6 – 358,9 Millionen Jahren',
    intro:
      'Lange bevor die ersten Dinosaurier erschienen, beherbergten die Meere des Devon vielfältige Fische, Riffe und frühe marine Ökosysteme. Gepanzerte Placodermen wie Dunkleosteus zählten zu den größten Räubern ihrer Zeit. An Land entwickelten sich die ersten ausgedehnten Wälder und begannen, Böden, Flüsse und den globalen Kohlenstoffkreislauf zu verändern.',
  },
  triassic: {
    heading: 'Die Trias',
    epoch: 'vor 251,9 – 201,4 Millionen Jahren',
    intro:
      'Die Trias begann nach dem größten Massenaussterben der Erdgeschichte. Das Leben erholte sich langsam über den Superkontinent Pangaea hinweg, wo das Klima oft warm und jahreszeitlich trocken war. Die ersten Dinosaurier erschienen in der späten Trias, teilten ihre Lebensräume zunächst aber mit vielen anderen Reptilien und Synapsiden.',
  },
  jurassic: {
    heading: 'Der frühe Jura',
    epoch: 'vor 201,4 – 174,7 Millionen Jahren',
    intro:
      'Nach dem Aussterben am Ende der Trias wurden Dinosaurier in den Landökosystemen immer bedeutender. Pangaea begann auseinanderzubrechen und schuf Grabenbrüche, Wüsten und weitläufige Flusssysteme. Frühe große Theropoden jagten an Land, während Plesiosaurier und andere Meeresreptilien die umliegenden Meere besiedelten.',
  },
  cretaceous: {
    heading: 'Die frühe Kreidezeit',
    epoch: 'vor 143,1 – 100,5 Millionen Jahren',
    intro:
      'In der frühen Kreidezeit trennten sich die Kontinente weiter voneinander, während die Meeresspiegel stiegen und regionale Ökosysteme eigenständiger wurden. Blütenpflanzen traten erstmals auf und begannen sich zu diversifizieren. Iguanodontier, Spinosaurier, gepanzerte Dinosaurier und viele kleinere gefiederte Arten bewohnten Wälder, Auen und Feuchtgebiete.',
  },
};

/** Certainty-badge explanations on the methodology page, keyed by scientificStatus. */
export const METHODOLOGY_DESC_DE: Record<string, string> = {
  verified:
    'Der Art- bzw. Gattungsname ist gut belegt. Hinweis: Das bewertet die Bestimmung, nicht die Genauigkeit dieses konkreten Modells.',
  generic:
    'Das Modell stellt eine reale Gruppe dar, die Quelle belegt aber keine bestimmte Gattung. Wir erfinden keine.',
  uncertain:
    'Die Quelle nennt eine Art, die Bestimmung ist jedoch nicht sicher belegt. Wird zurückhaltend dargestellt.',
  stylized:
    'Ein fiktives oder Fantasie-Wesen. Kein reales Tier; wird im Wissenschaftsmodus ausgeblendet.',
  nonDinosaur:
    'Ein urzeitliches Tier, das KEIN Dinosaurier war – etwa ein Flugsaurier, ein Meeresreptil oder ein Vogel.',
  groupScene:
    'Eine Szene mit mehreren Tieren; einzelne Arten werden erst nach Prüfung des Modells benannt.',
};
