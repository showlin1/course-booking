import { ArrowRight } from 'lucide-react';

const articles = [
  {
    tag: 'STRATÉGIE',
    category: 'Stratégie · Perspective',
    title: "Une sortie n'est pas une date. C'est un parcours.",
    desc: 'Penser le lancement comme une succession de rencontres, plutôt qu\'un seul jour de communication.',
  },
  {
    tag: 'INTERNATIONAL',
    category: 'International · Perspective',
    title: 'Voir grand. Commencer avec précision.',
    desc: "L'ambition internationale devient une stratégie lorsqu'elle se traduit en choix.",
  },
  {
    tag: 'CRÉATION',
    category: 'Création · Perspective',
    title: 'Une identité forte traverse tous les formats.',
    desc: "De la pochette au site, penser un langage plutôt qu'une accumulation de visuels.",
  },
];

export default function News() {
  return (
    <section id="news" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">
              05 / Le journal
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              Des idées pour
              <br />
              <span className="text-muted-foreground">aller plus loin.</span>
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:opacity-80 transition-opacity">
            Toutes les perspectives <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <article
              key={a.title}
              className="group p-6 rounded-lg border border-border/30 bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-default"
            >
              <div className="w-full h-40 rounded-md bg-secondary/60 flex items-center justify-center mb-5">
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold">
                  MH / {a.tag}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground tracking-wide mb-2">{a.category}</p>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.desc}</p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                Lire la suite <ArrowRight size={12} />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
