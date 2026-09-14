import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'fr' | 'en';

const LangContext = createContext<{ lang: Lang; toggle: () => void; t: (key: string) => string }>({
  lang: 'fr',
  toggle: () => {},
  t: (k) => k,
});

export function useLang() {
  return useContext(LangContext);
}

const dict: Record<string, { fr: string; en: string }> = {
  // Nav
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.maison': { fr: 'La Maison', en: 'The Label' },
  'nav.expertises': { fr: 'Expertises', en: 'Expertise' },
  'nav.international': { fr: 'International', en: 'International' },
  'nav.news': { fr: 'Actualités', en: 'News' },
  'nav.partners': { fr: 'Partenaires', en: 'Partners' },
  'nav.contact': { fr: 'Contact', en: 'Contact' },
  'nav.project': { fr: 'Votre projet ↗', en: 'Your project ↗' },
  'nav.submitMobile': { fr: 'Présenter mon projet ↗', en: 'Submit my project ↗' },

  // Hero
  'hero.eyebrow': { fr: 'Maison musicale indépendante · Ambition internationale', en: 'Independent music label · International ambition' },
  'hero.h1.1': { fr: 'LE TALENT', en: 'TALENT' },
  'hero.h1.2': { fr: "N'A PAS DE", en: 'HAS NO' },
  'hero.h1.3': { fr: 'FRONTIÈRES.', en: 'BORDERS.' },
  'hero.lead': { fr: 'Musique. Image. Influence.', en: 'Music. Image. Influence.' },
  'hero.lead2': { fr: 'Nous faisons dialoguer création et promotion pour les artistes, les labels et leurs ambitions.', en: 'We bridge creation and promotion for artists, labels, and their ambitions.' },
  'hero.cta1': { fr: 'Découvrir MH Records', en: 'Discover MH Records' },
  'hero.cta2': { fr: 'Confiez votre projet', en: 'Submit your project' },
  'hero.bottom3': { fr: 'Explorer notre univers ↓', en: 'Explore our universe ↓' },

  // Channel strip
  'channel.label': { fr: 'AU CŒUR DE VOTRE STRATÉGIE', en: 'AT THE HEART OF YOUR STRATEGY' },

  // Maison
  'maison.eyebrow': { fr: '01 / La maison', en: '01 / The Label' },
  'maison.h2.1': { fr: "L'indépendance", en: 'Independence' },
  'maison.h2.2': { fr: 'comme point de départ.', en: 'as a starting point.' },
  'maison.h2.3': { fr: 'Le monde pour horizon.', en: 'The world as horizon.' },
  'maison.p1': { fr: "Une chanson commence dans un univers singulier. Pour rencontrer son public, elle a besoin d'une direction, d'une image et d'un récit qui lui ressemblent.", en: 'A song begins in a unique universe. To reach its audience, it needs a direction, an image, and a narrative that matches.' },
  'maison.p2': { fr: 'MH Entertainment Records est la vitrine musicale et institutionnelle de MH Entertainment. Elle réunit les approches de création, de promotion digitale et de communication médias.', en: 'MH Entertainment Records is the musical and institutional showcase of MH Entertainment. It brings together creation, digital promotion, and media communication.' },
  'maison.p3': { fr: 'Pour les artistes indépendants, les labels et les structures musicales : une même exigence de cohérence, des chemins adaptés à chaque projet.', en: 'For independent artists, labels, and music companies: the same standard of coherence, with paths tailored to each project.' },
  'maison.link': { fr: 'La vision MH', en: 'The MH vision' },
  'maison.artists.h3.1': { fr: 'Votre musique.', en: 'Your music.' },
  'maison.artists.h3.2': { fr: 'Votre prochaine étape.', en: 'Your next step.' },
  'maison.artists.p': { fr: 'Créer une présence à la hauteur de votre identité artistique.', en: 'Build a presence that matches your artistic identity.' },
  'maison.artists.cta': { fr: 'Soumettre', en: 'Submit' },
  'maison.labels.h3.1': { fr: 'Votre vision.', en: 'Your vision.' },
  'maison.labels.h3.2': { fr: 'De nouvelles perspectives.', en: 'New perspectives.' },
  'maison.labels.p': { fr: 'Des approches complémentaires pour accompagner vos projets et vos équipes.', en: 'Complementary approaches to support your projects and teams.' },
  'maison.labels.cta': { fr: 'En savoir plus', en: 'Learn more' },

  // Expertises
  'exp.eyebrow': { fr: '02 / Nos expertises', en: '02 / Our expertise' },
  'exp.h2.1': { fr: 'De la création', en: 'From creation' },
  'exp.h2.2': { fr: 'à la connexion.', en: 'to connection.' },
  'exp.desc': { fr: 'Des compétences qui se répondent. Une stratégie qui ne perd jamais de vue la musique.', en: 'Skills that complement each other. A strategy that never loses sight of the music.' },
  'exp.s1.title': { fr: 'YouTube & vidéo', en: 'YouTube & video' },
  'exp.s1.desc': { fr: 'Votre clip mérite une vraie rencontre.', en: 'Your music video deserves a real audience.' },
  'exp.s2.title': { fr: 'Streaming & découverte', en: 'Streaming & discovery' },
  'exp.s2.desc': { fr: 'Faire écouter. Donner envie de revenir.', en: 'Get heard. Make them come back.' },
  'exp.s3.title': { fr: 'Social & influence', en: 'Social & influence' },
  'exp.s3.desc': { fr: 'Un univers qui donne envie de suivre.', en: 'A universe that makes people want to follow.' },
  'exp.s4.title': { fr: 'Radio & programmation', en: 'Radio & programming' },
  'exp.s4.desc': { fr: "Une musique. Le bon contexte d'écoute.", en: 'One song. The right listening context.' },
  'exp.s5.title': { fr: 'Télévision & formats vidéo', en: 'Television & video formats' },
  'exp.s5.desc': { fr: 'Une image faite pour être découverte.', en: 'An image made to be discovered.' },
  'exp.s6.title': { fr: 'Presse & relations médias', en: 'Press & media relations' },
  'exp.s6.desc': { fr: 'Le bon récit change la première impression.', en: 'The right narrative changes the first impression.' },

  // Global Power
  'gp.desc': { fr: "L'univers MH se découvre aussi en images. Un projet musical de MH Entertainment.", en: 'The MH universe is also revealed through visuals. A musical project by MH Entertainment.' },

  // Submit Project
  'submit.eyebrow': { fr: '03 / Présentez votre projet', en: '03 / Submit your project' },
  'submit.h2.1': { fr: 'Votre ambition.', en: 'Your ambition.' },
  'submit.h2.2': { fr: 'Notre prochaine conversation.', en: 'Our next conversation.' },
  'submit.desc': { fr: 'Trois voies d\'accès pour soumettre votre musique au label, à la radio ou à la télévision.', en: 'Three pathways to submit your music to the label, radio, or television.' },
  'submit.label.title': { fr: 'Soumettre mon projet au label', en: 'Submit my project to the label' },
  'submit.label.desc': { fr: 'Partagez votre musique, votre identité et la prochaine étape que vous souhaitez construire avec MH Entertainment Records.', en: 'Share your music, your identity, and the next step you want to build with MH Entertainment Records.' },
  'submit.label.cta': { fr: 'Envoyer mon projet', en: 'Send my project' },
  'submit.radio.title': { fr: 'Soumission single radio', en: 'Radio single submission' },
  'submit.radio.desc': { fr: 'Proposez votre single pour une diffusion radio. Nous sélectionnons les projets adaptés aux programmations nationales et internationales.', en: 'Submit your single for radio airplay. We select projects suited for national and international programming.' },
  'submit.radio.cta': { fr: 'Soumettre en radio', en: 'Submit to radio' },
  'submit.tv.title': { fr: 'Soumission clip TV', en: 'TV music video submission' },
  'submit.tv.desc': { fr: "Envoyez votre clip pour une diffusion sur les chaînes musicales TV. Qualité d'image et narration visuelle exigées.", en: 'Send your music video for broadcast on TV music channels. High image quality and visual storytelling required.' },
  'submit.tv.cta': { fr: 'Soumettre en TV', en: 'Submit to TV' },

  // RadioTV
  'radiotv.radio.title': { fr: 'Soumission Radio', en: 'Radio Submission' },
  'radiotv.radio.desc': { fr: 'Proposez votre single aux programmations radio nationales et internationales.', en: 'Submit your single to national and international radio programming.' },
  'radiotv.radio.cta': { fr: 'Soumettre', en: 'Submit' },
  'radiotv.tv.title': { fr: 'Soumission Clip TV', en: 'TV Video Submission' },
  'radiotv.tv.desc': { fr: 'Envoyez votre clip vidéo pour diffusion sur les chaînes musicales TV.', en: 'Send your music video for broadcast on TV music channels.' },
  'radiotv.tv.cta': { fr: 'Soumettre', en: 'Submit' },

  // GlobalVision
  'global.eyebrow': { fr: '04 / Vision internationale', en: '04 / International vision' },
  'global.h2.1': { fr: 'Des cultures différentes.', en: 'Different cultures.' },
  'global.h2.2': { fr: 'Une même énergie.', en: 'The same energy.' },
  'global.desc': { fr: "Penser au-delà d'un seul territoire, sans parler à tous de la même manière. Une ouverture internationale se construit autour des langues, des esthétiques et des publics.", en: 'Thinking beyond a single territory, without speaking to everyone the same way. An international reach is built around languages, aesthetics, and audiences.' },
  'global.link': { fr: 'Notre approche internationale', en: 'Our international approach' },
  'global.regions': { fr: 'Europe,Amériques,Caraïbes & Outre-mer,Afrique,Asie & Océanie', en: 'Europe,Americas,Caribbean & Overseas,Africa,Asia & Oceania' },

  // News
  'news.eyebrow': { fr: '05 / Le journal', en: '05 / The journal' },
  'news.h2.1': { fr: 'Des idées pour', en: 'Ideas to' },
  'news.h2.2': { fr: 'aller plus loin.', en: 'go further.' },
  'news.all': { fr: 'Toutes les perspectives', en: 'All perspectives' },
  'news.read': { fr: 'Lire la suite', en: 'Read more' },
  'news.a1.cat': { fr: 'Stratégie · Perspective', en: 'Strategy · Perspective' },
  'news.a1.title': { fr: "Une sortie n'est pas une date. C'est un parcours.", en: "A release is not a date. It's a journey." },
  'news.a1.desc': { fr: "Penser le lancement comme une succession de rencontres, plutôt qu'un seul jour de communication.", en: 'Think of a launch as a series of encounters, rather than a single day of communication.' },
  'news.a2.cat': { fr: 'International · Perspective', en: 'International · Perspective' },
  'news.a2.title': { fr: 'Voir grand. Commencer avec précision.', en: 'Think big. Start with precision.' },
  'news.a2.desc': { fr: "L'ambition internationale devient une stratégie lorsqu'elle se traduit en choix.", en: 'International ambition becomes a strategy when it translates into decisions.' },
  'news.a3.cat': { fr: 'Création · Perspective', en: 'Creation · Perspective' },
  'news.a3.title': { fr: 'Une identité forte traverse tous les formats.', en: 'A strong identity crosses all formats.' },
  'news.a3.desc': { fr: "De la pochette au site, penser un langage plutôt qu'une accumulation de visuels.", en: 'From artwork to website, think language rather than an accumulation of visuals.' },

  // Partners
  'partners.eyebrow': { fr: '06 / Médias & industrie', en: '06 / Media & industry' },
  'partners.h2.1': { fr: 'Une industrie.', en: 'One industry.' },
  'partners.h2.2': { fr: 'Mille possibilités.', en: 'A thousand possibilities.' },
  'partners.disclaimer': { fr: 'Références sectorielles à découvrir. Leur présence ne signifie pas un partenariat avec MH Entertainment.', en: 'Industry references to discover. Their presence does not imply a partnership with MH Entertainment.' },

  // CTA
  'cta.eyebrow': { fr: "La suite s'écrit ensemble", en: "What's next is written together" },
  'cta.h2.1': { fr: 'Votre ambition.', en: 'Your ambition.' },
  'cta.h2.2': { fr: 'Notre prochaine conversation.', en: 'Our next conversation.' },
  'cta.submit': { fr: 'Présenter mon projet', en: 'Submit my project' },
  'cta.book': { fr: 'Prendre rendez-vous', en: 'Book a meeting' },

  // Footer
  'footer.desc.1': { fr: 'Une identité indépendante.', en: 'An independent identity.' },
  'footer.desc.2': { fr: 'Une musique sans frontières.', en: 'Music without borders.' },
  'footer.desc.3': { fr: 'Un univers MH Entertainment.', en: 'A MH Entertainment universe.' },
  'footer.col1': { fr: 'La maison', en: 'The label' },
  'footer.vision': { fr: 'Notre vision', en: 'Our vision' },
  'footer.forArtists': { fr: 'Pour les artistes', en: 'For artists' },
  'footer.forLabels': { fr: 'Pour les labels', en: 'For labels' },
  'footer.col2': { fr: 'Explorer', en: 'Explore' },
  'footer.expertises': { fr: 'Nos expertises', en: 'Our expertise' },
  'footer.media': { fr: 'Répertoire médias', en: 'Media directory' },
  'footer.col3': { fr: 'Le prochain chapitre', en: 'The next chapter' },
  'footer.submitProject': { fr: 'Présenter un projet ↗', en: 'Submit a project ↗' },
  'footer.book': { fr: 'Prendre rendez-vous ↗', en: 'Book a meeting ↗' },
  'footer.legal': { fr: 'Informations légales', en: 'Legal information' },
  'footer.privacy': { fr: 'Confidentialité', en: 'Privacy' },
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>;
}
