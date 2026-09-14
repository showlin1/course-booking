import { ArrowRight } from 'lucide-react';

const services = [
  { idx: '01', tag: 'VIDEO CAMPAIGNS', title: 'YouTube & vidéo', desc: 'Votre clip mérite une vraie rencontre.' },
  { idx: '02', tag: 'MUSIC DISCOVERY', title: 'Streaming & découverte', desc: 'Faire écouter. Donner envie de revenir.' },
  { idx: '03', tag: 'SOCIAL CULTURE', title: 'Social & influence', desc: "Un univers qui donne envie de suivre." },
  { idx: '04', tag: 'ON AIR', title: 'Radio & programmation', desc: "Une musique. Le bon contexte d'écoute." },
  { idx: '05', tag: 'BEYOND THE SCREEN', title: 'Télévision & formats vidéo', desc: 'Une image faite pour être découverte.' },
  { idx: '06', tag: 'STORIES THAT MATTER', title: 'Presse & relations médias', desc: 'Le bon récit change la première impression.' },
];

export default function Expertises() {
  return (
    <section id="expertises" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-6">
              02 / Nos expertises
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              De la création
              <br />
              <span className="text-muted-foreground">à la connexion.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Des compétences qui se répondent. Une stratégie qui ne perd jamais de vue la musique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s.idx}
              className="group p-6 md:p-8 rounded-lg border border-border/30 hover:border-primary/40 bg-card/50 hover:bg-card transition-all cursor-default"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium">
                  {s.idx} / {s.tag}
                </span>
                <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
